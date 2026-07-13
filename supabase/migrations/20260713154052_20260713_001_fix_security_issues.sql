-- ============================================================
-- Fix: Security Definer Views
-- Recreate both views with SECURITY INVOKER so they run with
-- the querying role's permissions, not the definer's.
-- ============================================================

CREATE OR REPLACE VIEW public.booking_services
  WITH (security_invoker = true)
AS
SELECT
  b.id            AS booking_id,
  b.reference,
  b.user_id,
  b.service_type  AS service_name,
  b.property_size,
  b.frequency,
  b.preferred_date,
  b.preferred_time,
  b.status        AS booking_status,
  b.assigned_cleaner_id,
  'base'::text    AS line_type,
  NULL::uuid      AS extra_id,
  b.service_type  AS line_label,
  b.base_price_pence AS line_price_pence,
  b.created_at
FROM bookings b
UNION ALL
SELECT
  b.id            AS booking_id,
  b.reference,
  b.user_id,
  b.service_type  AS service_name,
  b.property_size,
  b.frequency,
  b.preferred_date,
  b.preferred_time,
  b.status        AS booking_status,
  b.assigned_cleaner_id,
  'extra'::text   AS line_type,
  be.id           AS extra_id,
  be.name         AS line_label,
  be.price_pence  AS line_price_pence,
  b.created_at
FROM bookings b
JOIN booking_extras be ON be.booking_id = b.id;


CREATE OR REPLACE VIEW public.cleaner_earnings
  WITH (security_invoker = true)
AS
SELECT
  ci.cleaner_id,
  c.full_name                                                     AS cleaner_name,
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
    (ci.duration_minutes::numeric / 60) * cp.hourly_rate_pence::numeric
  )::integer                                                      AS earned_pence,
  EXTRACT(year  FROM ci.checked_in_at)::integer                  AS earn_year,
  EXTRACT(month FROM ci.checked_in_at)::integer                  AS earn_month
FROM job_checkins ci
JOIN cleaners       c  ON c.id  = ci.cleaner_id
JOIN bookings       b  ON b.id  = ci.booking_id
LEFT JOIN cleaner_profiles cp ON cp.cleaner_id = ci.cleaner_id
WHERE ci.checked_in_at IS NOT NULL
  AND ci.checked_out_at IS NOT NULL;


-- ============================================================
-- Fix: Function Search Path Mutable
-- Add SET search_path = public, pg_catalog to every affected
-- function so the search path cannot be hijacked.
-- ============================================================

-- update_updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public, pg_catalog
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- set_booking_reference
CREATE OR REPLACE FUNCTION public.set_booking_reference()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public, pg_catalog
AS $$
BEGIN
  IF NEW.reference IS NULL THEN
    NEW.reference := 'PM-' || upper(substring(replace(gen_random_uuid()::text, '-', ''), 1, 8));
  END IF;
  RETURN NEW;
END;
$$;

-- update_payments_updated_at
CREATE OR REPLACE FUNCTION public.update_payments_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public, pg_catalog
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- generate_invoice_number
CREATE OR REPLACE FUNCTION public.generate_invoice_number()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public, pg_catalog
AS $$
BEGIN
  IF NEW.invoice_number IS NULL OR NEW.invoice_number = '' THEN
    NEW.invoice_number := 'INV-' || to_char(now(), 'YYYY') || '-' ||
      lpad(nextval('invoice_number_seq')::text, 5, '0');
  END IF;
  RETURN NEW;
END;
$$;

-- update_invoices_updated_at
CREATE OR REPLACE FUNCTION public.update_invoices_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public, pg_catalog
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- update_availability_updated_at
CREATE OR REPLACE FUNCTION public.update_availability_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public, pg_catalog
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- notify_on_booking_status_change
CREATE OR REPLACE FUNCTION public.notify_on_booking_status_change()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public, pg_catalog
AS $$
DECLARE
  v_user_id uuid;
  v_title   text;
  v_body    text;
  v_type    text;
BEGIN
  IF OLD.status = NEW.status THEN
    RETURN NEW;
  END IF;

  IF NEW.user_id IS NULL THEN
    RETURN NEW;
  END IF;

  v_user_id := NEW.user_id;

  IF NEW.status = 'confirmed' THEN
    v_type  := 'booking_confirmed';
    v_title := 'Booking Confirmed';
    v_body  := 'Your booking ' || COALESCE(NEW.reference, NEW.id::text) ||
               ' has been confirmed. We look forward to seeing you!';

  ELSIF NEW.status = 'completed' THEN
    v_type  := 'booking_completed';
    v_title := 'Cleaning Complete';
    v_body  := 'Your cleaning for booking ' || COALESCE(NEW.reference, NEW.id::text) ||
               ' has been completed. We hope you love the results!';

  ELSIF NEW.status = 'cancelled' THEN
    v_type  := 'booking_cancelled';
    v_title := 'Booking Cancelled';
    v_body  := 'Your booking ' || COALESCE(NEW.reference, NEW.id::text) ||
               ' has been cancelled. Please contact us if this was unexpected.';

  ELSE
    RETURN NEW;
  END IF;

  INSERT INTO notifications (user_id, booking_id, type, title, body, action_url)
  VALUES (
    v_user_id,
    NEW.id,
    v_type,
    v_title,
    v_body,
    '/account/bookings/' || NEW.id::text
  );

  RETURN NEW;
END;
$$;

-- update_cleaners_updated_at
CREATE OR REPLACE FUNCTION public.update_cleaners_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public, pg_catalog
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- update_reviews_updated_at
CREATE OR REPLACE FUNCTION public.update_reviews_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public, pg_catalog
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- update_contact_enquiries_updated_at
CREATE OR REPLACE FUNCTION public.update_contact_enquiries_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public, pg_catalog
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- update_subscription_plans_updated_at
CREATE OR REPLACE FUNCTION public.update_subscription_plans_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public, pg_catalog
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- update_subscriptions_updated_at
CREATE OR REPLACE FUNCTION public.update_subscriptions_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public, pg_catalog
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


-- ============================================================
-- Fix: SECURITY DEFINER functions callable by anon/authenticated
-- Switch get_monthly_revenue and get_unread_notification_count
-- to SECURITY INVOKER and revoke EXECUTE from anon.
-- ============================================================

-- get_unread_notification_count: SECURITY INVOKER + fixed search_path
-- anon cannot query notifications anyway (RLS blocks it), so
-- SECURITY INVOKER is safe; authenticated users query their own rows.
CREATE OR REPLACE FUNCTION public.get_unread_notification_count(p_user_id uuid)
RETURNS integer
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public, pg_catalog
AS $$
  SELECT COUNT(*)::integer
  FROM notifications
  WHERE user_id = p_user_id
    AND read = false;
$$;

REVOKE EXECUTE ON FUNCTION public.get_unread_notification_count(uuid) FROM anon;
GRANT  EXECUTE ON FUNCTION public.get_unread_notification_count(uuid) TO authenticated;


-- get_monthly_revenue: admin-only, SECURITY INVOKER + fixed search_path.
-- Authenticated callers only reach bookings they can SELECT via RLS;
-- non-admin users will get 0 rows (their RLS policy restricts to own bookings).
-- Revoke anon entirely.
CREATE OR REPLACE FUNCTION public.get_monthly_revenue(p_year integer, p_month integer)
RETURNS TABLE(service_type text, booking_count bigint, total_pence bigint, avg_pence bigint)
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public, pg_catalog
AS $$
  SELECT
    service_type,
    COUNT(*)                       AS booking_count,
    SUM(total_price_pence)         AS total_pence,
    AVG(total_price_pence)::bigint AS avg_pence
  FROM bookings
  WHERE status = 'completed'
    AND EXTRACT(YEAR  FROM created_at) = p_year
    AND EXTRACT(MONTH FROM created_at) = p_month
  GROUP BY service_type
  ORDER BY total_pence DESC;
$$;

REVOKE EXECUTE ON FUNCTION public.get_monthly_revenue(integer, integer) FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_monthly_revenue(integer, integer) FROM authenticated;
GRANT  EXECUTE ON FUNCTION public.get_monthly_revenue(integer, integer) TO authenticated;


-- ============================================================
-- Fix: RLS INSERT policies with always-true WITH CHECK
--
-- bookings:        Unauthenticated bookings (pre-login flow) are
--                  legitimate, BUT we must prevent callers from
--                  setting privileged columns (user_id, status,
--                  deposit_paid, stripe_session_id).
--                  Rule: status must be 'pending', user_id must
--                  be NULL (guest) or match auth.uid().
--
-- booking_extras:  The booking_id must reference a booking that
--                  is either owned by the caller or has no owner
--                  (guest booking just inserted in same request).
--                  We cannot easily enforce the FK owner check in
--                  a single WITH CHECK without a subquery; we lock
--                  this down to anon-only (no login = guest flow)
--                  or authenticated-owns-booking.
--
-- contact_enquiries: Enquiries have no sensitive FK to protect;
--                  lock down to ensure status starts as 'new' and
--                  no admin-only fields are pre-set.
-- ============================================================

-- ── bookings ─────────────────────────────────────────────────────
DROP POLICY IF EXISTS anon_insert_bookings ON public.bookings;

-- Anon (guest) bookings: must have no user_id and status = 'pending'
CREATE POLICY anon_insert_bookings ON public.bookings
  FOR INSERT
  TO anon
  WITH CHECK (
    user_id IS NULL
    AND status = 'pending'
    AND deposit_paid = false
    AND stripe_session_id IS NULL
  );

-- Authenticated bookings: user_id must match the caller, status = 'pending'
CREATE POLICY auth_insert_own_bookings ON public.bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (user_id IS NULL OR user_id = auth.uid())
    AND status = 'pending'
    AND deposit_paid = false
    AND stripe_session_id IS NULL
  );


-- ── booking_extras ────────────────────────────────────────────────
DROP POLICY IF EXISTS anon_insert_booking_extras ON public.booking_extras;

-- Anon: the referenced booking must itself have no user_id (guest booking)
CREATE POLICY anon_insert_booking_extras ON public.booking_extras
  FOR INSERT
  TO anon
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = booking_id
        AND bookings.user_id IS NULL
        AND bookings.status = 'pending'
    )
  );

-- Authenticated: the referenced booking must be owned by the caller
--                or be an unowned pending booking
CREATE POLICY auth_insert_own_booking_extras ON public.booking_extras
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = booking_id
        AND (bookings.user_id = auth.uid() OR bookings.user_id IS NULL)
        AND bookings.status = 'pending'
    )
  );


-- ── contact_enquiries ─────────────────────────────────────────────
DROP POLICY IF EXISTS anon_insert_contact_enquiries ON public.contact_enquiries;

-- Anyone may submit an enquiry; lock to status = 'new' to prevent
-- bypassing admin workflow fields.
CREATE POLICY anon_insert_contact_enquiries ON public.contact_enquiries
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    status = 'new'
  );
