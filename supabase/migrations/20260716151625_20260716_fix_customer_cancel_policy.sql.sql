-- Fix the customer cancel policy - the previous version had a broken subquery
DROP POLICY IF EXISTS customers_cancel_own_bookings ON bookings;

-- Customers can only cancel their own pending/confirmed bookings
-- They cannot modify status to anything other than 'cancelled'
-- They cannot modify deposit_paid, pricing, or assignment fields
CREATE POLICY "customers_cancel_own_bookings" ON bookings
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id
    AND status = 'cancelled'
  );
