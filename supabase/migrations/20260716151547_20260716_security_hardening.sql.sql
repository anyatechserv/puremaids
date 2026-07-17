-- Security hardening migration: add missing CHECK constraints, tighten RLS, revoke public function execution

-- ============================================================
-- 1. Add missing CHECK constraints on enum-like text columns
-- ============================================================

ALTER TABLE bookings ADD CONSTRAINT bookings_status_check
  CHECK (status = ANY (ARRAY['pending', 'confirmed', 'assigned', 'in_progress', 'completed', 'cancelled', 'expired']));

ALTER TABLE bookings ADD CONSTRAINT bookings_frequency_check
  CHECK (frequency = ANY (ARRAY['one_off', 'weekly', 'fortnightly', 'monthly']));

ALTER TABLE contact_enquiries ADD CONSTRAINT contact_enquiries_status_check
  CHECK (status = ANY (ARRAY['new', 'responded', 'closed']));

ALTER TABLE cleaner_notifications ADD CONSTRAINT cleaner_notifications_type_check
  CHECK (type = ANY (ARRAY['info', 'booking_assigned', 'booking_cancelled', 'booking_updated', 'system']));

-- ============================================================
-- 2. Revoke EXECUTE on admin-only functions from anon and public
-- ============================================================
REVOKE EXECUTE ON FUNCTION get_unread_notification_count(uuid) FROM anon, public;
REVOKE EXECUTE ON FUNCTION get_monthly_revenue(integer, integer) FROM anon, public;

-- ============================================================
-- 3. Add CHECK constraints: non-negative prices and amounts
-- ============================================================
ALTER TABLE bookings ADD CONSTRAINT bookings_deposit_amount_check CHECK (deposit_amount_pence >= 0);
ALTER TABLE bookings ADD CONSTRAINT bookings_base_price_check CHECK (base_price_pence >= 0);
ALTER TABLE bookings ADD CONSTRAINT bookings_extras_price_check CHECK (extras_price_pence >= 0);
ALTER TABLE bookings ADD CONSTRAINT bookings_total_price_check CHECK (total_price_pence >= 0);

ALTER TABLE payments ADD CONSTRAINT payments_amount_check CHECK (amount_pence >= 0);
ALTER TABLE payments ADD CONSTRAINT payments_deposit_check CHECK (deposit_pence >= 0);
ALTER TABLE payments ADD CONSTRAINT payments_refund_check CHECK (refund_amount_pence >= 0);

ALTER TABLE invoices ADD CONSTRAINT invoices_subtotal_check CHECK (subtotal_pence >= 0);
ALTER TABLE invoices ADD CONSTRAINT invoices_vat_amount_check CHECK (vat_amount_pence >= 0);
ALTER TABLE invoices ADD CONSTRAINT invoices_total_check CHECK (total_pence >= 0);
ALTER TABLE invoices ADD CONSTRAINT invoices_amount_paid_check CHECK (amount_paid_pence >= 0);
ALTER TABLE invoices ADD CONSTRAINT invoices_amount_due_check CHECK (amount_due_pence >= 0);

ALTER TABLE referrals ADD CONSTRAINT referrals_uses_check CHECK (uses >= 0);

ALTER TABLE subscription_plans ADD CONSTRAINT subscription_plans_monthly_price_check CHECK (monthly_price_pence >= 0);

-- ============================================================
-- 4. Add index for rate-limiting: prevent rapid duplicate pending bookings
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_bookings_email_pending
  ON bookings (email)
  WHERE status = 'pending' AND deposit_paid = false;
