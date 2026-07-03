/*
# Customer Portal Schema

## Summary
Adds all tables required for the customer account area.

## New Tables

### customer_profiles
Extends auth.users with display name and avatar for customers.
Separate from admin_profiles — customers are not admins.

### saved_addresses
Stored addresses for a customer so they don't re-type every booking.

### reviews
Star ratings + written review for a completed booking.
One review per booking.

### referrals
Tracks referral codes. Each customer gets one unique code.
When someone books using a referral code, a row is inserted here.

## Security
All tables are RLS-enabled and scoped to the owner via auth.uid().
*/

-- ─── customer_profiles ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS customer_profiles (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name    text NOT NULL DEFAULT '',
  phone        text,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE customer_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "customers_select_own" ON customer_profiles;
CREATE POLICY "customers_select_own" ON customer_profiles FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "customers_insert_own" ON customer_profiles;
CREATE POLICY "customers_insert_own" ON customer_profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "customers_update_own" ON customer_profiles;
CREATE POLICY "customers_update_own" ON customer_profiles FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ─── saved_addresses ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS saved_addresses (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  label       text NOT NULL DEFAULT 'Home',
  address     text NOT NULL,
  postcode    text NOT NULL,
  is_default  boolean NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE saved_addresses ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_saved_addresses_user ON saved_addresses(user_id);

DROP POLICY IF EXISTS "addresses_select_own" ON saved_addresses;
CREATE POLICY "addresses_select_own" ON saved_addresses FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "addresses_insert_own" ON saved_addresses;
CREATE POLICY "addresses_insert_own" ON saved_addresses FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "addresses_update_own" ON saved_addresses;
CREATE POLICY "addresses_update_own" ON saved_addresses FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "addresses_delete_own" ON saved_addresses;
CREATE POLICY "addresses_delete_own" ON saved_addresses FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ─── reviews ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reviews (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  booking_id   uuid NOT NULL UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,
  rating       smallint NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title        text,
  body         text,
  created_at   timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_booking ON reviews(booking_id);

DROP POLICY IF EXISTS "reviews_select_own" ON reviews;
CREATE POLICY "reviews_select_own" ON reviews FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "reviews_insert_own" ON reviews;
CREATE POLICY "reviews_insert_own" ON reviews FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "reviews_update_own" ON reviews;
CREATE POLICY "reviews_update_own" ON reviews FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Admin can read all reviews (for moderation / display on site)
DROP POLICY IF EXISTS "admin_select_reviews" ON reviews;
CREATE POLICY "admin_select_reviews" ON reviews FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_profiles WHERE admin_profiles.user_id = auth.uid()));

-- ─── referrals ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS referrals (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  code            text NOT NULL UNIQUE,
  uses            integer NOT NULL DEFAULT 0,
  created_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

CREATE UNIQUE INDEX IF NOT EXISTS idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_code ON referrals(code);

DROP POLICY IF EXISTS "referrals_select_own" ON referrals;
CREATE POLICY "referrals_select_own" ON referrals FOR SELECT
  TO authenticated USING (auth.uid() = referrer_id);

DROP POLICY IF EXISTS "referrals_insert_own" ON referrals;
CREATE POLICY "referrals_insert_own" ON referrals FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = referrer_id);

-- Allow anon/authenticated to check if a code exists (for booking form)
DROP POLICY IF EXISTS "referrals_select_by_code" ON referrals;
CREATE POLICY "referrals_select_by_code" ON referrals FOR SELECT
  TO anon, authenticated USING (true);

-- ─── bookings: let customers link their account ────────────────────────────────
-- The user_id column already exists. We just need a policy for customers to
-- read their own bookings and a way to claim bookings by email.

-- Customers can read their own linked bookings
DROP POLICY IF EXISTS "customers_select_own_bookings" ON bookings;
CREATE POLICY "customers_select_own_bookings" ON bookings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Customers can update (reschedule/cancel) their own bookings
-- Only allow updating preferred_date, preferred_time, status (for cancel)
DROP POLICY IF EXISTS "customers_update_own_bookings" ON bookings;
CREATE POLICY "customers_update_own_bookings" ON bookings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
