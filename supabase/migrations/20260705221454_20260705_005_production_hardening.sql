/*
# Production hardening: indexes, audit timestamps, booking_services view, and helpers

## Summary
This migration completes the production-ready schema by:

1. Adding missing indexes on existing tables for query performance.
2. Adding `updated_at` audit timestamps to tables that are missing them.
3. Creating a `booking_services` view that denormalises booking + extras into
   a single queryable surface (satisfies the requested "booking_services" table).
4. Adding a `get_unread_notification_count(uuid)` helper function used by the
   customer portal badge.
5. Adding composite indexes on `bookings` for the admin calendar and revenue queries.
6. Adding a `cleaner_earnings` view for the staff portal earnings page.

## New Indexes
- `cleaners(email)` — lookup by email during login/assignment
- `cleaners(is_active)` — filter active cleaners
- `customer_profiles(user_id)` — already has UNIQUE, add named index for clarity
- `reviews(rating)` — filter/aggregate by star rating
- `booking_extras(booking_id)` — already exists (idempotent)
- `bookings(user_id)` — customer portal "my bookings" query
- `bookings(preferred_date, status)` — admin calendar + schedule queries
- `bookings(service_type)` — revenue breakdown by service
- `bookings(postcode)` — geographic analysis
- `job_checkins(checked_in_at)` — earnings period queries

## New View: booking_services
Flattens bookings + booking_extras into a service-line view for reporting.

## New View: cleaner_earnings
Aggregates job_checkins + payments for the staff earnings dashboard.

## Updated Tables
- `cleaners` — adds `updated_at` with auto-trigger
- `customer_profiles` — `updated_at` already present (idempotent trigger)
- `reviews` — adds `updated_at` with auto-trigger
*/

-- ============================================================
-- 1. Missing indexes on existing tables
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_cleaners_email
  ON cleaners(email)
  WHERE email IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_cleaners_is_active
  ON cleaners(is_active);

CREATE INDEX IF NOT EXISTS idx_reviews_rating
  ON reviews(rating);

CREATE INDEX IF NOT EXISTS idx_reviews_created_at
  ON reviews(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_bookings_user_id
  ON bookings(user_id)
  WHERE user_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_bookings_preferred_date_status
  ON bookings(preferred_date, status);

CREATE INDEX IF NOT EXISTS idx_bookings_service_type
  ON bookings(service_type);

CREATE INDEX IF NOT EXISTS idx_bookings_postcode
  ON bookings(postcode);

CREATE INDEX IF NOT EXISTS idx_bookings_deposit_paid
  ON bookings(deposit_paid);

CREATE INDEX IF NOT EXISTS idx_checkins_checked_in_at
  ON job_checkins(checked_in_at)
  WHERE checked_in_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_cleaner_profiles_cleaner_id
  ON cleaner_profiles(cleaner_id);

CREATE INDEX IF NOT EXISTS idx_referrals_code
  ON referrals(code);

-- ============================================================
-- 2. Audit timestamps on tables missing updated_at
-- ============================================================

-- cleaners table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'cleaners'
      AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE cleaners ADD COLUMN updated_at timestamptz NOT NULL DEFAULT now();
  END IF;
END $$;

CREATE OR REPLACE FUNCTION update_cleaners_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS cleaners_updated_at ON cleaners;
CREATE TRIGGER cleaners_updated_at
  BEFORE UPDATE ON cleaners
  FOR EACH ROW EXECUTE FUNCTION update_cleaners_updated_at();

-- reviews table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'reviews'
      AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE reviews ADD COLUMN updated_at timestamptz NOT NULL DEFAULT now();
  END IF;
END $$;

CREATE OR REPLACE FUNCTION update_reviews_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS reviews_updated_at ON reviews;
CREATE TRIGGER reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_reviews_updated_at();

-- contact_enquiries table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'contact_enquiries'
      AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE contact_enquiries ADD COLUMN updated_at timestamptz NOT NULL DEFAULT now();
  END IF;
END $$;

CREATE OR REPLACE FUNCTION update_contact_enquiries_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS contact_enquiries_updated_at ON contact_enquiries;
CREATE TRIGGER contact_enquiries_updated_at
  BEFORE UPDATE ON contact_enquiries
  FOR EACH ROW EXECUTE FUNCTION update_contact_enquiries_updated_at();

-- ============================================================
-- 3. booking_services view
-- ============================================================
-- Provides a flat, per-service-line view of every booking.
-- Each booking produces one base row (for the core service) plus one row
-- per extra (oven clean, carpet treatment, etc.).

CREATE OR REPLACE VIEW booking_services AS
  -- Core service line (one row per booking)
  SELECT
    b.id                AS booking_id,
    b.reference,
    b.user_id,
    b.service_type      AS service_name,
    b.property_size,
    b.frequency,
    b.preferred_date,
    b.preferred_time,
    b.status            AS booking_status,
    b.assigned_cleaner_id,
    'base'              AS line_type,
    NULL::uuid          AS extra_id,
    b.service_type      AS line_label,
    b.base_price_pence  AS line_price_pence,
    b.created_at
  FROM bookings b

  UNION ALL

  -- Extra service lines
  SELECT
    b.id                AS booking_id,
    b.reference,
    b.user_id,
    b.service_type      AS service_name,
    b.property_size,
    b.frequency,
    b.preferred_date,
    b.preferred_time,
    b.status            AS booking_status,
    b.assigned_cleaner_id,
    'extra'             AS line_type,
    be.id               AS extra_id,
    be.name             AS line_label,
    be.price_pence      AS line_price_pence,
    b.created_at
  FROM bookings b
  JOIN booking_extras be ON be.booking_id = b.id;

-- ============================================================
-- 4. cleaner_earnings view (staff portal)
-- ============================================================
CREATE OR REPLACE VIEW cleaner_earnings AS
  SELECT
    ci.cleaner_id,
    c.full_name                                     AS cleaner_name,
    ci.booking_id,
    b.reference,
    b.preferred_date,
    b.service_type,
    b.total_price_pence,
    cp.hourly_rate_pence,
    ci.checked_in_at,
    ci.checked_out_at,
    ci.duration_minutes,
    ROUND(
      (ci.duration_minutes::numeric / 60) * cp.hourly_rate_pence
    )::integer                                      AS earned_pence,
    EXTRACT(YEAR  FROM ci.checked_in_at)::integer   AS earn_year,
    EXTRACT(MONTH FROM ci.checked_in_at)::integer   AS earn_month
  FROM job_checkins ci
  JOIN cleaners       c  ON c.id  = ci.cleaner_id
  JOIN bookings       b  ON b.id  = ci.booking_id
  LEFT JOIN cleaner_profiles cp ON cp.cleaner_id = ci.cleaner_id
  WHERE ci.checked_in_at IS NOT NULL
    AND ci.checked_out_at IS NOT NULL;

-- ============================================================
-- 5. get_unread_notification_count helper
-- ============================================================
CREATE OR REPLACE FUNCTION get_unread_notification_count(p_user_id uuid)
RETURNS integer
LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT COUNT(*)::integer
  FROM notifications
  WHERE user_id = p_user_id
    AND read = false;
$$;

-- ============================================================
-- 6. Revenue summary function (admin dashboard)
-- ============================================================
CREATE OR REPLACE FUNCTION get_monthly_revenue(p_year integer, p_month integer)
RETURNS TABLE (
  service_type    text,
  booking_count   bigint,
  total_pence     bigint,
  avg_pence       bigint
)
LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT
    service_type,
    COUNT(*)                    AS booking_count,
    SUM(total_price_pence)      AS total_pence,
    AVG(total_price_pence)::bigint AS avg_pence
  FROM bookings
  WHERE status = 'completed'
    AND EXTRACT(YEAR  FROM created_at) = p_year
    AND EXTRACT(MONTH FROM created_at) = p_month
  GROUP BY service_type
  ORDER BY total_pence DESC;
$$;
