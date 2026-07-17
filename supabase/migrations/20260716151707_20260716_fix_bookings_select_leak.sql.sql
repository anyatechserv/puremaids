-- CRITICAL FIX: anon_select_bookings had qual=true, leaking ALL customer PII
-- to anonymous users. Replace with a restrictive policy.

-- Drop the vulnerable policy
DROP POLICY IF EXISTS anon_select_bookings ON bookings;

-- Anonymous users should NOT be able to SELECT bookings at all.
-- They can only INSERT new bookings (which they own via user_id IS NULL).
-- Authenticated customers can only see their own bookings (via customers_select_own_bookings).
-- Admins can see all (via admin_select_bookings).
-- Cleaners can see assigned bookings (via cleaner_select_assigned).

-- No replacement SELECT policy for anon — by default, if no SELECT policy
-- matches for the anon role, RLS denies access.
