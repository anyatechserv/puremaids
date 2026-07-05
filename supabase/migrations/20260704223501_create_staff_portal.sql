/*
# Staff / Cleaner Portal Schema

## Summary
Adds all tables required for the mobile cleaner portal.

## Changes

### cleaner_profiles
Links an auth.users account to a `cleaners` row so cleaners can log in.
Stores user_id (FK auth.users) + cleaner_id (FK cleaners) + hourly_rate.

### job_checkins
Records when a cleaner checks in and checks out of a booking.
One row per booking per cleaner. Timestamps in UTC.

### job_tasks
Predefined task checklist per booking (seeded from service type).
Cleaners tick tasks off during the job.

### job_photos
Before/after photo uploads stored as Supabase Storage public URLs.
type = 'before' | 'after'

### job_issues
Issues reported by cleaners during a job (damage, access problems, etc.)
severity = 'low' | 'medium' | 'high'

### cleaner_notifications
Push/in-app notifications for cleaners.
read = false until opened.

## Security
All tables RLS-enabled. Cleaners access only their own data via cleaner_profiles lookup.
Admins retain full read access.
*/

-- ─── cleaner_profiles ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cleaner_profiles (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  cleaner_id   uuid NOT NULL UNIQUE REFERENCES cleaners(id) ON DELETE CASCADE,
  hourly_rate_pence integer NOT NULL DEFAULT 1200,
  created_at   timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE cleaner_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "cleaner_profiles_self_select" ON cleaner_profiles;
CREATE POLICY "cleaner_profiles_self_select" ON cleaner_profiles FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "cleaner_profiles_self_insert" ON cleaner_profiles;
CREATE POLICY "cleaner_profiles_self_insert" ON cleaner_profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "admin_select_cleaner_profiles" ON cleaner_profiles;
CREATE POLICY "admin_select_cleaner_profiles" ON cleaner_profiles FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_profiles WHERE admin_profiles.user_id = auth.uid()));

-- ─── job_checkins ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS job_checkins (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id   uuid NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  cleaner_id   uuid NOT NULL REFERENCES cleaners(id) ON DELETE CASCADE,
  checked_in_at  timestamptz,
  checked_out_at timestamptz,
  duration_minutes integer,
  created_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE(booking_id, cleaner_id)
);

ALTER TABLE job_checkins ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_checkins_booking ON job_checkins(booking_id);
CREATE INDEX IF NOT EXISTS idx_checkins_cleaner ON job_checkins(cleaner_id);

DROP POLICY IF EXISTS "cleaner_select_own_checkins" ON job_checkins;
CREATE POLICY "cleaner_select_own_checkins" ON job_checkins FOR SELECT
  TO authenticated
  USING (cleaner_id IN (SELECT cleaner_id FROM cleaner_profiles WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "cleaner_insert_checkins" ON job_checkins;
CREATE POLICY "cleaner_insert_checkins" ON job_checkins FOR INSERT
  TO authenticated
  WITH CHECK (cleaner_id IN (SELECT cleaner_id FROM cleaner_profiles WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "cleaner_update_checkins" ON job_checkins;
CREATE POLICY "cleaner_update_checkins" ON job_checkins FOR UPDATE
  TO authenticated
  USING (cleaner_id IN (SELECT cleaner_id FROM cleaner_profiles WHERE user_id = auth.uid()))
  WITH CHECK (cleaner_id IN (SELECT cleaner_id FROM cleaner_profiles WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "admin_select_checkins" ON job_checkins;
CREATE POLICY "admin_select_checkins" ON job_checkins FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_profiles WHERE admin_profiles.user_id = auth.uid()));

-- ─── job_tasks ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS job_tasks (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id   uuid NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  cleaner_id   uuid NOT NULL REFERENCES cleaners(id) ON DELETE CASCADE,
  label        text NOT NULL,
  completed    boolean NOT NULL DEFAULT false,
  completed_at timestamptz,
  sort_order   integer NOT NULL DEFAULT 0,
  created_at   timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE job_tasks ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_tasks_booking ON job_tasks(booking_id);

DROP POLICY IF EXISTS "cleaner_select_own_tasks" ON job_tasks;
CREATE POLICY "cleaner_select_own_tasks" ON job_tasks FOR SELECT
  TO authenticated
  USING (cleaner_id IN (SELECT cleaner_id FROM cleaner_profiles WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "cleaner_insert_tasks" ON job_tasks;
CREATE POLICY "cleaner_insert_tasks" ON job_tasks FOR INSERT
  TO authenticated
  WITH CHECK (cleaner_id IN (SELECT cleaner_id FROM cleaner_profiles WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "cleaner_update_tasks" ON job_tasks;
CREATE POLICY "cleaner_update_tasks" ON job_tasks FOR UPDATE
  TO authenticated
  USING (cleaner_id IN (SELECT cleaner_id FROM cleaner_profiles WHERE user_id = auth.uid()))
  WITH CHECK (cleaner_id IN (SELECT cleaner_id FROM cleaner_profiles WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "admin_select_tasks" ON job_tasks;
CREATE POLICY "admin_select_tasks" ON job_tasks FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_profiles WHERE admin_profiles.user_id = auth.uid()));

-- ─── job_photos ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS job_photos (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id   uuid NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  cleaner_id   uuid NOT NULL REFERENCES cleaners(id) ON DELETE CASCADE,
  photo_url    text NOT NULL,
  type         text NOT NULL DEFAULT 'before' CHECK (type IN ('before','after')),
  caption      text,
  created_at   timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE job_photos ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_photos_booking ON job_photos(booking_id);

DROP POLICY IF EXISTS "cleaner_select_own_photos" ON job_photos;
CREATE POLICY "cleaner_select_own_photos" ON job_photos FOR SELECT
  TO authenticated
  USING (cleaner_id IN (SELECT cleaner_id FROM cleaner_profiles WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "cleaner_insert_photos" ON job_photos;
CREATE POLICY "cleaner_insert_photos" ON job_photos FOR INSERT
  TO authenticated
  WITH CHECK (cleaner_id IN (SELECT cleaner_id FROM cleaner_profiles WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "admin_select_photos" ON job_photos;
CREATE POLICY "admin_select_photos" ON job_photos FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_profiles WHERE admin_profiles.user_id = auth.uid()));

-- ─── job_issues ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS job_issues (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id   uuid NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  cleaner_id   uuid NOT NULL REFERENCES cleaners(id) ON DELETE CASCADE,
  title        text NOT NULL,
  description  text,
  severity     text NOT NULL DEFAULT 'low' CHECK (severity IN ('low','medium','high')),
  resolved     boolean NOT NULL DEFAULT false,
  created_at   timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE job_issues ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_issues_booking ON job_issues(booking_id);

DROP POLICY IF EXISTS "cleaner_select_own_issues" ON job_issues;
CREATE POLICY "cleaner_select_own_issues" ON job_issues FOR SELECT
  TO authenticated
  USING (cleaner_id IN (SELECT cleaner_id FROM cleaner_profiles WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "cleaner_insert_issues" ON job_issues;
CREATE POLICY "cleaner_insert_issues" ON job_issues FOR INSERT
  TO authenticated
  WITH CHECK (cleaner_id IN (SELECT cleaner_id FROM cleaner_profiles WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "admin_select_issues" ON job_issues;
CREATE POLICY "admin_select_issues" ON job_issues FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_profiles WHERE admin_profiles.user_id = auth.uid()));

DROP POLICY IF EXISTS "admin_update_issues" ON job_issues;
CREATE POLICY "admin_update_issues" ON job_issues FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_profiles WHERE admin_profiles.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_profiles WHERE admin_profiles.user_id = auth.uid()));

-- ─── cleaner_notifications ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cleaner_notifications (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cleaner_id   uuid NOT NULL REFERENCES cleaners(id) ON DELETE CASCADE,
  title        text NOT NULL,
  body         text,
  type         text NOT NULL DEFAULT 'info',
  read         boolean NOT NULL DEFAULT false,
  booking_id   uuid REFERENCES bookings(id) ON DELETE SET NULL,
  created_at   timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE cleaner_notifications ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_notifications_cleaner ON cleaner_notifications(cleaner_id);

DROP POLICY IF EXISTS "cleaner_select_own_notifications" ON cleaner_notifications;
CREATE POLICY "cleaner_select_own_notifications" ON cleaner_notifications FOR SELECT
  TO authenticated
  USING (cleaner_id IN (SELECT cleaner_id FROM cleaner_profiles WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "cleaner_update_own_notifications" ON cleaner_notifications;
CREATE POLICY "cleaner_update_own_notifications" ON cleaner_notifications FOR UPDATE
  TO authenticated
  USING (cleaner_id IN (SELECT cleaner_id FROM cleaner_profiles WHERE user_id = auth.uid()))
  WITH CHECK (cleaner_id IN (SELECT cleaner_id FROM cleaner_profiles WHERE user_id = auth.uid()));

-- Admins can insert notifications (to send to cleaners)
DROP POLICY IF EXISTS "admin_insert_notifications" ON cleaner_notifications;
CREATE POLICY "admin_insert_notifications" ON cleaner_notifications FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM admin_profiles WHERE admin_profiles.user_id = auth.uid()));

DROP POLICY IF EXISTS "admin_select_notifications" ON cleaner_notifications;
CREATE POLICY "admin_select_notifications" ON cleaner_notifications FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_profiles WHERE admin_profiles.user_id = auth.uid()));

-- ─── cleaners: allow staff to read their own row ──────────────────────────────
DROP POLICY IF EXISTS "cleaner_select_self" ON cleaners;
CREATE POLICY "cleaner_select_self" ON cleaners FOR SELECT
  TO authenticated
  USING (id IN (SELECT cleaner_id FROM cleaner_profiles WHERE user_id = auth.uid()));

-- ─── bookings: cleaners can read/update their assigned bookings ───────────────
DROP POLICY IF EXISTS "cleaner_select_assigned" ON bookings;
CREATE POLICY "cleaner_select_assigned" ON bookings FOR SELECT
  TO authenticated
  USING (assigned_cleaner_id IN (SELECT cleaner_id FROM cleaner_profiles WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "cleaner_update_assigned" ON bookings;
CREATE POLICY "cleaner_update_assigned" ON bookings FOR UPDATE
  TO authenticated
  USING (assigned_cleaner_id IN (SELECT cleaner_id FROM cleaner_profiles WHERE user_id = auth.uid()))
  WITH CHECK (assigned_cleaner_id IN (SELECT cleaner_id FROM cleaner_profiles WHERE user_id = auth.uid()));

-- ─── booking_extras: cleaners can read extras for their jobs ──────────────────
DROP POLICY IF EXISTS "cleaner_select_extras" ON booking_extras;
CREATE POLICY "cleaner_select_extras" ON booking_extras FOR SELECT
  TO authenticated
  USING (booking_id IN (
    SELECT id FROM bookings
    WHERE assigned_cleaner_id IN (SELECT cleaner_id FROM cleaner_profiles WHERE user_id = auth.uid())
  ));
