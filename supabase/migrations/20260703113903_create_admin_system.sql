/*
# Admin System — PureMaids

## Summary
Adds tables and policies for the admin dashboard:

1. admin_profiles — links auth.users to an admin role. Only users with a row here can access admin features.
2. cleaners — PureMaids staff who can be assigned to bookings.
3. Alters bookings — adds assigned_cleaner_id, internal_notes columns.
4. RLS — admin users (those with a row in admin_profiles) get full CRUD on bookings, cleaners, contact_enquiries.

## New Tables
- admin_profiles(id, user_id, full_name, role, created_at)
- cleaners(id, full_name, email, phone, is_active, created_at)

## Altered Tables
- bookings: adds assigned_cleaner_id (fk -> cleaners), internal_notes

## Security
- admin_profiles: authenticated users can read their own row; service role manages inserts.
- cleaners: admin users (have a row in admin_profiles) can CRUD.
- bookings: admin users can SELECT/UPDATE/DELETE; existing anon INSERT policy stays.
- contact_enquiries: admin users can SELECT/UPDATE.
*/

-- ─── admin_profiles ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admin_profiles (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   text NOT NULL DEFAULT '',
  role        text NOT NULL DEFAULT 'admin',
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_profiles_self_select" ON admin_profiles;
CREATE POLICY "admin_profiles_self_select" ON admin_profiles FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

-- ─── cleaners ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cleaners (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name   text NOT NULL,
  email       text,
  phone       text,
  is_active   boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE cleaners ENABLE ROW LEVEL SECURITY;

-- Admin-only CRUD on cleaners
DROP POLICY IF EXISTS "admin_select_cleaners" ON cleaners;
CREATE POLICY "admin_select_cleaners" ON cleaners FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_profiles WHERE admin_profiles.user_id = auth.uid()));

DROP POLICY IF EXISTS "admin_insert_cleaners" ON cleaners;
CREATE POLICY "admin_insert_cleaners" ON cleaners FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM admin_profiles WHERE admin_profiles.user_id = auth.uid()));

DROP POLICY IF EXISTS "admin_update_cleaners" ON cleaners;
CREATE POLICY "admin_update_cleaners" ON cleaners FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_profiles WHERE admin_profiles.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_profiles WHERE admin_profiles.user_id = auth.uid()));

DROP POLICY IF EXISTS "admin_delete_cleaners" ON cleaners;
CREATE POLICY "admin_delete_cleaners" ON cleaners FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_profiles WHERE admin_profiles.user_id = auth.uid()));

-- ─── Alter bookings ───────────────────────────────────────────────────────────
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name='bookings' AND column_name='assigned_cleaner_id'
  ) THEN
    ALTER TABLE bookings ADD COLUMN assigned_cleaner_id uuid REFERENCES cleaners(id) ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name='bookings' AND column_name='internal_notes'
  ) THEN
    ALTER TABLE bookings ADD COLUMN internal_notes text;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_bookings_cleaner ON bookings(assigned_cleaner_id);

-- ─── Bookings: admin policies ─────────────────────────────────────────────────
DROP POLICY IF EXISTS "admin_select_bookings" ON bookings;
CREATE POLICY "admin_select_bookings" ON bookings FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_profiles WHERE admin_profiles.user_id = auth.uid()));

DROP POLICY IF EXISTS "admin_update_bookings" ON bookings;
CREATE POLICY "admin_update_bookings" ON bookings FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_profiles WHERE admin_profiles.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_profiles WHERE admin_profiles.user_id = auth.uid()));

DROP POLICY IF EXISTS "admin_delete_bookings" ON bookings;
CREATE POLICY "admin_delete_bookings" ON bookings FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_profiles WHERE admin_profiles.user_id = auth.uid()));

-- ─── contact_enquiries: admin select/update ────────────────────────────────
DROP POLICY IF EXISTS "admin_select_enquiries" ON contact_enquiries;
CREATE POLICY "admin_select_enquiries" ON contact_enquiries FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_profiles WHERE admin_profiles.user_id = auth.uid()));

DROP POLICY IF EXISTS "admin_update_enquiries" ON contact_enquiries;
CREATE POLICY "admin_update_enquiries" ON contact_enquiries FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_profiles WHERE admin_profiles.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_profiles WHERE admin_profiles.user_id = auth.uid()));

-- ─── booking_extras: admin select ────────────────────────────────────────────
DROP POLICY IF EXISTS "admin_select_booking_extras" ON booking_extras;
CREATE POLICY "admin_select_booking_extras" ON booking_extras FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_profiles WHERE admin_profiles.user_id = auth.uid()));
