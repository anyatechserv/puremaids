/*
# Create availability table

## Summary
Adds a `availability` table for managing cleaner scheduling and time-slot
availability. Supports both recurring weekly patterns and specific date overrides,
enabling the booking system to show real-time slot availability.

## New Table: availability
Columns:
- `id` — UUID primary key
- `cleaner_id` — FK to cleaners (CASCADE delete)
- `type` — enum: recurring | specific_date | blocked
  - `recurring` — repeats every week on a given day
  - `specific_date` — overrides for a particular date (holiday cover, extra slots)
  - `blocked` — marks unavailability (holiday, sick day, etc.)
- `day_of_week` — 0=Sunday … 6=Saturday (used when type = 'recurring')
- `specific_date` — exact date (used when type = 'specific_date' or 'blocked')
- `start_time` — time slot start (e.g. '08:00:00')
- `end_time` — time slot end (e.g. '14:00:00')
- `max_bookings` — how many bookings can be taken in this slot (default 1)
- `notes` — internal note (e.g. "covering for Sarah", "half day")
- `is_active` — soft-disable without deleting
- `created_at` / `updated_at` — audit timestamps

## New Table: availability_overrides
Handles specific date overrides that supersede recurring patterns:
- `id` — UUID primary key
- `cleaner_id` — FK to cleaners
- `date` — the specific date being overridden
- `reason` — enum: holiday | sick | personal | extra_capacity | other
- `all_day` — if true, cleaner is unavailable the entire day
- `created_at` — audit timestamp

## Security
- RLS enabled on both tables.
- Cleaners can SELECT their own availability and INSERT/UPDATE their own records.
- Admins have full CRUD on both tables.
- Public (anon) can SELECT active availability for booking form slot checks.

## Indexes
- `cleaner_id` on both tables
- `(cleaner_id, day_of_week)` composite for recurring lookups
- `(cleaner_id, specific_date)` composite for date-specific lookups
- `is_active` partial index
*/

-- ============================================================
-- availability
-- ============================================================
CREATE TABLE IF NOT EXISTS availability (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  cleaner_id      uuid        NOT NULL
                    REFERENCES cleaners(id) ON DELETE CASCADE,
  type            text        NOT NULL DEFAULT 'recurring'
                    CHECK (type IN ('recurring','specific_date','blocked')),
  day_of_week     smallint
                    CHECK (day_of_week BETWEEN 0 AND 6),
  specific_date   date,
  start_time      time        NOT NULL,
  end_time        time        NOT NULL,
  max_bookings    smallint    NOT NULL DEFAULT 1 CHECK (max_bookings >= 1),
  notes           text,
  is_active       boolean     NOT NULL DEFAULT true,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),

  -- Ensure recurring rows have a day_of_week
  CONSTRAINT chk_recurring_has_day
    CHECK (
      (type = 'recurring' AND day_of_week IS NOT NULL) OR
      (type != 'recurring')
    ),
  -- Ensure specific_date rows have a date
  CONSTRAINT chk_specific_has_date
    CHECK (
      (type IN ('specific_date','blocked') AND specific_date IS NOT NULL) OR
      (type = 'recurring')
    ),
  -- End must be after start
  CONSTRAINT chk_time_order CHECK (end_time > start_time)
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_availability_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS availability_updated_at ON availability;
CREATE TRIGGER availability_updated_at
  BEFORE UPDATE ON availability
  FOR EACH ROW EXECUTE FUNCTION update_availability_updated_at();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_availability_cleaner_id
  ON availability(cleaner_id);

CREATE INDEX IF NOT EXISTS idx_availability_cleaner_day
  ON availability(cleaner_id, day_of_week)
  WHERE type = 'recurring' AND is_active = true;

CREATE INDEX IF NOT EXISTS idx_availability_cleaner_date
  ON availability(cleaner_id, specific_date)
  WHERE type IN ('specific_date','blocked');

CREATE INDEX IF NOT EXISTS idx_availability_active
  ON availability(is_active)
  WHERE is_active = true;

-- RLS
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_availability" ON availability;
CREATE POLICY "anon_select_availability" ON availability
  FOR SELECT TO anon, authenticated
  USING (is_active = true);

DROP POLICY IF EXISTS "cleaner_insert_own_availability" ON availability;
CREATE POLICY "cleaner_insert_own_availability" ON availability
  FOR INSERT TO authenticated
  WITH CHECK (
    cleaner_id IN (
      SELECT cleaner_profiles.cleaner_id FROM cleaner_profiles
      WHERE cleaner_profiles.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "cleaner_update_own_availability" ON availability;
CREATE POLICY "cleaner_update_own_availability" ON availability
  FOR UPDATE TO authenticated
  USING (
    cleaner_id IN (
      SELECT cleaner_profiles.cleaner_id FROM cleaner_profiles
      WHERE cleaner_profiles.user_id = auth.uid()
    )
  )
  WITH CHECK (
    cleaner_id IN (
      SELECT cleaner_profiles.cleaner_id FROM cleaner_profiles
      WHERE cleaner_profiles.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "cleaner_delete_own_availability" ON availability;
CREATE POLICY "cleaner_delete_own_availability" ON availability
  FOR DELETE TO authenticated
  USING (
    cleaner_id IN (
      SELECT cleaner_profiles.cleaner_id FROM cleaner_profiles
      WHERE cleaner_profiles.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "admin_select_availability" ON availability;
CREATE POLICY "admin_select_availability" ON availability
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_profiles WHERE admin_profiles.user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "admin_insert_availability" ON availability;
CREATE POLICY "admin_insert_availability" ON availability
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM admin_profiles WHERE admin_profiles.user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "admin_update_availability" ON availability;
CREATE POLICY "admin_update_availability" ON availability
  FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_profiles WHERE admin_profiles.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM admin_profiles WHERE admin_profiles.user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "admin_delete_availability" ON availability;
CREATE POLICY "admin_delete_availability" ON availability
  FOR DELETE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_profiles WHERE admin_profiles.user_id = auth.uid()
  ));

-- ============================================================
-- availability_overrides  (specific date blocking/expansion)
-- ============================================================
CREATE TABLE IF NOT EXISTS availability_overrides (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  cleaner_id      uuid        NOT NULL
                    REFERENCES cleaners(id) ON DELETE CASCADE,
  date            date        NOT NULL,
  reason          text        NOT NULL DEFAULT 'personal'
                    CHECK (reason IN ('holiday','sick','personal','extra_capacity','other')),
  all_day         boolean     NOT NULL DEFAULT true,
  notes           text,
  created_at      timestamptz NOT NULL DEFAULT now(),

  UNIQUE(cleaner_id, date)
);

CREATE INDEX IF NOT EXISTS idx_availability_overrides_cleaner
  ON availability_overrides(cleaner_id);

CREATE INDEX IF NOT EXISTS idx_availability_overrides_date
  ON availability_overrides(date);

ALTER TABLE availability_overrides ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "cleaner_select_own_overrides" ON availability_overrides;
CREATE POLICY "cleaner_select_own_overrides" ON availability_overrides
  FOR SELECT TO authenticated
  USING (
    cleaner_id IN (
      SELECT cleaner_profiles.cleaner_id FROM cleaner_profiles
      WHERE cleaner_profiles.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "cleaner_insert_own_overrides" ON availability_overrides;
CREATE POLICY "cleaner_insert_own_overrides" ON availability_overrides
  FOR INSERT TO authenticated
  WITH CHECK (
    cleaner_id IN (
      SELECT cleaner_profiles.cleaner_id FROM cleaner_profiles
      WHERE cleaner_profiles.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "cleaner_update_own_overrides" ON availability_overrides;
CREATE POLICY "cleaner_update_own_overrides" ON availability_overrides
  FOR UPDATE TO authenticated
  USING (
    cleaner_id IN (
      SELECT cleaner_profiles.cleaner_id FROM cleaner_profiles
      WHERE cleaner_profiles.user_id = auth.uid()
    )
  )
  WITH CHECK (
    cleaner_id IN (
      SELECT cleaner_profiles.cleaner_id FROM cleaner_profiles
      WHERE cleaner_profiles.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "cleaner_delete_own_overrides" ON availability_overrides;
CREATE POLICY "cleaner_delete_own_overrides" ON availability_overrides
  FOR DELETE TO authenticated
  USING (
    cleaner_id IN (
      SELECT cleaner_profiles.cleaner_id FROM cleaner_profiles
      WHERE cleaner_profiles.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "admin_select_overrides" ON availability_overrides;
CREATE POLICY "admin_select_overrides" ON availability_overrides
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_profiles WHERE admin_profiles.user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "admin_insert_overrides" ON availability_overrides;
CREATE POLICY "admin_insert_overrides" ON availability_overrides
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM admin_profiles WHERE admin_profiles.user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "admin_update_overrides" ON availability_overrides;
CREATE POLICY "admin_update_overrides" ON availability_overrides
  FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_profiles WHERE admin_profiles.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM admin_profiles WHERE admin_profiles.user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "admin_delete_overrides" ON availability_overrides;
CREATE POLICY "admin_delete_overrides" ON availability_overrides
  FOR DELETE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_profiles WHERE admin_profiles.user_id = auth.uid()
  ));

-- Public read for booking slot availability (anon needs to know when slots are blocked)
DROP POLICY IF EXISTS "anon_select_overrides" ON availability_overrides;
CREATE POLICY "anon_select_overrides" ON availability_overrides
  FOR SELECT TO anon, authenticated
  USING (true);
