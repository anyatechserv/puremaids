-- Fix critical vulnerability: customers could set status='confirmed' or deposit_paid=true themselves
-- by exploiting the overly permissive UPDATE policies on bookings.

-- Drop the vulnerable policies
DROP POLICY IF EXISTS auth_update_own_booking ON bookings;
DROP POLICY IF EXISTS customers_update_own_bookings ON bookings;

-- Replace with a restrictive policy: customers can only update their own bookings
-- and ONLY to cancel them (status -> 'cancelled'). They cannot change status to confirmed,
-- set deposit_paid, or modify pricing fields.
CREATE POLICY "customers_cancel_own_bookings" ON bookings
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id
    AND status = 'cancelled'
    AND deposit_paid = (SELECT deposit_paid FROM bookings WHERE id = (SELECT id FROM bookings WHERE user_id = auth.uid() ORDER BY updated_at DESC LIMIT 1))
  );

-- Note: The cleaner_update_assigned policy is also overly permissive — cleaners could
-- change booking status to anything. Restrict cleaners to only setting status to
-- 'in_progress' or 'completed'.
DROP POLICY IF EXISTS cleaner_update_assigned ON bookings;

CREATE POLICY "cleaner_update_assigned" ON bookings
  FOR UPDATE TO authenticated
  USING (
    assigned_cleaner_id IN (
      SELECT cleaner_id FROM cleaner_profiles WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    assigned_cleaner_id IN (
      SELECT cleaner_id FROM cleaner_profiles WHERE user_id = auth.uid()
    )
    AND status IN ('assigned', 'in_progress', 'completed')
  );
