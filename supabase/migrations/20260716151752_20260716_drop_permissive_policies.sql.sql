-- Drop remaining overly permissive SELECT policies

-- 1. booking_extras: drop anon SELECT all, add restricted version
DROP POLICY IF EXISTS anon_select_booking_extras ON booking_extras;

CREATE POLICY "anon_select_own_booking_extras" ON booking_extras
  FOR SELECT TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM bookings b
      WHERE b.id = booking_extras.booking_id
      AND b.user_id IS NULL
      AND b.status = 'pending'
    )
  );

-- 2. referrals: drop the permissive policy (referrals_select_own already exists)
DROP POLICY IF EXISTS referrals_select_by_code ON referrals;

-- 3. availability_overrides: drop the permissive policy
-- (cleaner_select_own_overrides and admin_select_overrides already exist)
DROP POLICY IF EXISTS anon_select_overrides ON availability_overrides;
