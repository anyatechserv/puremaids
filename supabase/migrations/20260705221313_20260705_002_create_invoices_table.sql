/*
# Create invoices table

## Summary
Adds a production-ready `invoices` table that generates a formal PDF-ready invoice
record for every completed booking. Linked to both `bookings` and `payments`.

## New Table: invoices
Columns:
- `id` — UUID primary key
- `booking_id` — FK to bookings (CASCADE delete)
- `payment_id` — nullable FK to payments (SET NULL) — links the invoice to a payment
- `user_id` — nullable FK to auth.users (SET NULL if user deleted)
- `invoice_number` — unique human-readable number e.g. "INV-2026-00001" (auto-generated)
- `invoice_date` — date issued (defaults to today)
- `due_date` — payment due date (defaults to invoice_date + 14 days)
- `subtotal_pence` — pre-VAT total in pence
- `vat_rate` — VAT percentage (e.g. 20.00 for 20%)
- `vat_amount_pence` — calculated VAT in pence
- `total_pence` — subtotal + VAT in pence
- `amount_paid_pence` — amount already received
- `amount_due_pence` — remaining balance
- `status` — enum: draft | sent | paid | overdue | void | cancelled
- `customer_name` — snapshot of customer name at invoice time
- `customer_email` — snapshot of customer email
- `customer_address` — snapshot of customer address
- `service_description` — human-readable summary of services
- `line_items` — JSONB array of line items (label, qty, unit_price_pence, total_pence)
- `notes` — free-text invoice notes
- `pdf_url` — URL to generated PDF (populated by edge function)
- `sent_at` — timestamp when invoice was emailed to customer
- `paid_at` — timestamp when fully paid
- `voided_at` — timestamp when voided
- `created_at` / `updated_at` — audit timestamps

## Invoice number generation
Auto-increment trigger generates `INV-YYYY-NNNNN` format on insert.

## Security
- RLS enabled.
- Customers can SELECT their own invoices (via user_id).
- Admins have full SELECT, INSERT, UPDATE.
- No DELETE — invoices are financial records and must be voided, not deleted.

## Indexes
- `booking_id`, `user_id`, `invoice_number` (unique), `status`, `invoice_date DESC`
*/

-- ============================================================
-- Invoice number sequence
-- ============================================================
CREATE SEQUENCE IF NOT EXISTS invoice_number_seq START 1;

-- ============================================================
-- invoices
-- ============================================================
CREATE TABLE IF NOT EXISTS invoices (
  id                    uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id            uuid        NOT NULL
                          REFERENCES bookings(id) ON DELETE CASCADE,
  payment_id            uuid
                          REFERENCES payments(id) ON DELETE SET NULL,
  user_id               uuid
                          REFERENCES auth.users(id) ON DELETE SET NULL,
  invoice_number        text        NOT NULL UNIQUE,
  invoice_date          date        NOT NULL DEFAULT CURRENT_DATE,
  due_date              date        NOT NULL DEFAULT (CURRENT_DATE + INTERVAL '14 days'),
  subtotal_pence        integer     NOT NULL DEFAULT 0,
  vat_rate              numeric(5,2) NOT NULL DEFAULT 0.00,
  vat_amount_pence      integer     NOT NULL DEFAULT 0,
  total_pence           integer     NOT NULL DEFAULT 0,
  amount_paid_pence     integer     NOT NULL DEFAULT 0,
  amount_due_pence      integer     NOT NULL DEFAULT 0,
  status                text        NOT NULL DEFAULT 'draft'
                          CHECK (status IN ('draft','sent','paid','overdue','void','cancelled')),
  customer_name         text        NOT NULL DEFAULT '',
  customer_email        text        NOT NULL DEFAULT '',
  customer_address      text,
  service_description   text,
  line_items            jsonb       NOT NULL DEFAULT '[]',
  notes                 text,
  pdf_url               text,
  sent_at               timestamptz,
  paid_at               timestamptz,
  voided_at             timestamptz,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);

-- Auto-generate invoice_number as INV-YYYY-NNNNN
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.invoice_number IS NULL OR NEW.invoice_number = '' THEN
    NEW.invoice_number := 'INV-' || to_char(now(), 'YYYY') || '-' ||
                          lpad(nextval('invoice_number_seq')::text, 5, '0');
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS invoices_set_number ON invoices;
CREATE TRIGGER invoices_set_number
  BEFORE INSERT ON invoices
  FOR EACH ROW EXECUTE FUNCTION generate_invoice_number();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_invoices_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS invoices_updated_at ON invoices;
CREATE TRIGGER invoices_updated_at
  BEFORE UPDATE ON invoices
  FOR EACH ROW EXECUTE FUNCTION update_invoices_updated_at();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_invoices_booking_id
  ON invoices(booking_id);

CREATE INDEX IF NOT EXISTS idx_invoices_payment_id
  ON invoices(payment_id)
  WHERE payment_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_invoices_user_id
  ON invoices(user_id);

CREATE INDEX IF NOT EXISTS idx_invoices_status
  ON invoices(status);

CREATE INDEX IF NOT EXISTS idx_invoices_invoice_date
  ON invoices(invoice_date DESC);

CREATE INDEX IF NOT EXISTS idx_invoices_due_date
  ON invoices(due_date)
  WHERE status = 'sent';

-- RLS
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "customers_select_own_invoices" ON invoices;
CREATE POLICY "customers_select_own_invoices" ON invoices
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "admin_select_invoices" ON invoices;
CREATE POLICY "admin_select_invoices" ON invoices
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_profiles WHERE admin_profiles.user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "admin_insert_invoices" ON invoices;
CREATE POLICY "admin_insert_invoices" ON invoices
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM admin_profiles WHERE admin_profiles.user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "admin_update_invoices" ON invoices;
CREATE POLICY "admin_update_invoices" ON invoices
  FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_profiles WHERE admin_profiles.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM admin_profiles WHERE admin_profiles.user_id = auth.uid()
  ));
