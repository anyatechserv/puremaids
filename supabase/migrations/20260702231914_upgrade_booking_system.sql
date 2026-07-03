/*
# Upgrade existing bookings table + create booking_extras

## Changes to bookings table
Adds columns required for the full booking system:
- reference: unique human-readable booking ref (PM-XXXXXXXX), set by trigger
- base_price_pence, extras_price_pence, total_price_pence: pricing in pence
- deposit_paid, deposit_amount_pence, stripe_session_id: payment tracking
- notes: internal admin notes
- user_id: optional link to auth.users for account holders
- updated_at: auto-updated timestamp
- preferred_date changed to text for flexibility (was date type before)

## New Tables
- booking_extras: one row per add-on per booking

## Security
Refreshes all RLS policies to support guest checkout (anon + authenticated).
*/

-- Add new columns to bookings (each IF NOT EXISTS to be idempotent)
DO $$
BEGIN
  -- Reference
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='reference') THEN
    ALTER TABLE bookings ADD COLUMN reference text UNIQUE;
  END IF;

  -- Pricing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='base_price_pence') THEN
    ALTER TABLE bookings ADD COLUMN base_price_pence integer NOT NULL DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='extras_price_pence') THEN
    ALTER TABLE bookings ADD COLUMN extras_price_pence integer NOT NULL DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='total_price_pence') THEN
    ALTER TABLE bookings ADD COLUMN total_price_pence integer NOT NULL DEFAULT 0;
  END IF;

  -- Payment
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='deposit_paid') THEN
    ALTER TABLE bookings ADD COLUMN deposit_paid boolean NOT NULL DEFAULT false;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='deposit_amount_pence') THEN
    ALTER TABLE bookings ADD COLUMN deposit_amount_pence integer NOT NULL DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='stripe_session_id') THEN
    ALTER TABLE bookings ADD COLUMN stripe_session_id text;
  END IF;

  -- Admin / user
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='notes') THEN
    ALTER TABLE bookings ADD COLUMN notes text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='user_id') THEN
    ALTER TABLE bookings ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;

  -- Timestamps
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='updated_at') THEN
    ALTER TABLE bookings ADD COLUMN updated_at timestamptz NOT NULL DEFAULT now();
  END IF;
END $$;

-- Make preferred_date accept text (date strings) if it was typed date
-- We store as text to handle partial dates from the picker more flexibly
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name='bookings' AND column_name='preferred_date' AND data_type='date'
  ) THEN
    ALTER TABLE bookings ALTER COLUMN preferred_date TYPE text USING preferred_date::text;
  END IF;
END $$;

-- Make preferred_date NOT NULL (was nullable)
ALTER TABLE bookings ALTER COLUMN preferred_date SET NOT NULL;
ALTER TABLE bookings ALTER COLUMN preferred_time SET NOT NULL;

-- Reference trigger
CREATE OR REPLACE FUNCTION set_booking_reference()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.reference IS NULL THEN
    NEW.reference := 'PM-' || upper(substring(replace(gen_random_uuid()::text, '-', ''), 1, 8));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS bookings_set_reference ON bookings;
CREATE TRIGGER bookings_set_reference
  BEFORE INSERT ON bookings
  FOR EACH ROW EXECUTE FUNCTION set_booking_reference();

-- updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS bookings_updated_at ON bookings;
CREATE TRIGGER bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- booking_extras table
CREATE TABLE IF NOT EXISTS booking_extras (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id  uuid NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  name        text NOT NULL,
  price_pence integer NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_bookings_reference  ON bookings(reference);
CREATE INDEX IF NOT EXISTS idx_bookings_email      ON bookings(email);
CREATE INDEX IF NOT EXISTS idx_bookings_status     ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_created    ON bookings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_extras_booking_id   ON booking_extras(booking_id);

-- RLS: refresh all policies
ALTER TABLE bookings       ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_extras ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_bookings"       ON bookings;
DROP POLICY IF EXISTS "anon_select_bookings"       ON bookings;
DROP POLICY IF EXISTS "auth_update_own_booking"    ON bookings;
DROP POLICY IF EXISTS "anon_insert_booking_extras" ON booking_extras;
DROP POLICY IF EXISTS "anon_select_booking_extras" ON booking_extras;

-- Drop any older policies that might exist
DROP POLICY IF EXISTS "Anyone can insert bookings"    ON bookings;
DROP POLICY IF EXISTS "Anyone can view bookings"      ON bookings;
DROP POLICY IF EXISTS "Authenticated users can update their own bookings" ON bookings;

CREATE POLICY "anon_insert_bookings" ON bookings FOR INSERT
  TO anon, authenticated WITH CHECK (true);

CREATE POLICY "anon_select_bookings" ON bookings FOR SELECT
  TO anon, authenticated USING (true);

CREATE POLICY "auth_update_own_booking" ON bookings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "anon_insert_booking_extras" ON booking_extras FOR INSERT
  TO anon, authenticated WITH CHECK (true);

CREATE POLICY "anon_select_booking_extras" ON booking_extras FOR SELECT
  TO anon, authenticated USING (true);
