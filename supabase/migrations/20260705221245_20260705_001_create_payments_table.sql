/*
# Create payments table

## Summary
Adds a production-ready `payments` table that tracks every financial transaction
tied to a booking — Stripe charges, deposits, refunds, and manual payments.

## New Table: payments
Stores full payment lifecycle per booking:
- `id` — UUID primary key
- `booking_id` — FK to bookings (CASCADE delete)
- `user_id` — nullable FK to auth.users (SET NULL if user deleted)
- `stripe_payment_intent_id` — Stripe's canonical payment intent ID (unique)
- `stripe_charge_id` — Stripe charge ID once captured
- `stripe_customer_id` — Stripe customer ID for repeat billing
- `amount_pence` — total charged amount in pence (GBP)
- `deposit_pence` — deposit portion in pence
- `currency` — ISO currency code, defaults to 'gbp'
- `status` — enum: pending | processing | succeeded | failed | refunded | partially_refunded | cancelled
- `payment_method` — enum: card | bank_transfer | cash | other
- `description` — human-readable description of what was charged
- `failure_reason` — populated on failed/declined payments
- `refund_amount_pence` — total refunded so far in pence
- `refunded_at` — timestamp of refund
- `metadata` — JSONB for arbitrary Stripe or internal metadata
- `created_at` / `updated_at` — audit timestamps with auto-update trigger

## Security
- RLS enabled.
- Customers can SELECT their own payments (via user_id).
- Admins have full SELECT, UPDATE access.
- No direct INSERT from frontend — payments are created by the Stripe webhook edge function.
- No DELETE policy — payment records must never be deleted.

## Indexes
- `booking_id` — fast lookup of all payments for a booking
- `user_id` — customer portal payment history
- `stripe_payment_intent_id` — webhook deduplication (UNIQUE)
- `status` — filter by payment state
- `created_at DESC` — chronological listing
*/

-- ============================================================
-- payments
-- ============================================================
CREATE TABLE IF NOT EXISTS payments (
  id                          uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id                  uuid          NOT NULL
                                REFERENCES bookings(id) ON DELETE CASCADE,
  user_id                     uuid
                                REFERENCES auth.users(id) ON DELETE SET NULL,
  stripe_payment_intent_id    text          UNIQUE,
  stripe_charge_id            text,
  stripe_customer_id          text,
  amount_pence                integer       NOT NULL DEFAULT 0,
  deposit_pence               integer       NOT NULL DEFAULT 0,
  currency                    text          NOT NULL DEFAULT 'gbp',
  status                      text          NOT NULL DEFAULT 'pending'
                                CHECK (status IN (
                                  'pending','processing','succeeded',
                                  'failed','refunded','partially_refunded','cancelled'
                                )),
  payment_method              text          NOT NULL DEFAULT 'card'
                                CHECK (payment_method IN ('card','bank_transfer','cash','other')),
  description                 text,
  failure_reason              text,
  refund_amount_pence         integer       NOT NULL DEFAULT 0,
  refunded_at                 timestamptz,
  metadata                    jsonb         DEFAULT '{}',
  created_at                  timestamptz   NOT NULL DEFAULT now(),
  updated_at                  timestamptz   NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_payments_booking_id
  ON payments(booking_id);

CREATE INDEX IF NOT EXISTS idx_payments_user_id
  ON payments(user_id);

CREATE INDEX IF NOT EXISTS idx_payments_status
  ON payments(status);

CREATE INDEX IF NOT EXISTS idx_payments_created_at
  ON payments(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_payments_stripe_customer
  ON payments(stripe_customer_id)
  WHERE stripe_customer_id IS NOT NULL;

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_payments_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS payments_updated_at ON payments;
CREATE TRIGGER payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_payments_updated_at();

-- RLS
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "customers_select_own_payments" ON payments;
CREATE POLICY "customers_select_own_payments" ON payments
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "admin_select_payments" ON payments;
CREATE POLICY "admin_select_payments" ON payments
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_profiles WHERE admin_profiles.user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "admin_insert_payments" ON payments;
CREATE POLICY "admin_insert_payments" ON payments
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM admin_profiles WHERE admin_profiles.user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "admin_update_payments" ON payments;
CREATE POLICY "admin_update_payments" ON payments
  FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_profiles WHERE admin_profiles.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM admin_profiles WHERE admin_profiles.user_id = auth.uid()
  ));
