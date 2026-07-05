/*
# Create customer notifications table

## Summary
Adds a `notifications` table for customer-facing notifications (booking
confirmations, reminders, status updates, invoice ready, review requests).
Distinct from the existing `cleaner_notifications` table which is staff-only.

## New Table: notifications
Columns:
- `id` — UUID primary key
- `user_id` — FK to auth.users (CASCADE delete) — the customer receiving the notification
- `booking_id` — nullable FK to bookings (SET NULL) — related booking if applicable
- `invoice_id` — nullable FK to invoices (SET NULL) — related invoice if applicable
- `type` — enum: booking_confirmed | booking_reminder | booking_cancelled |
           booking_completed | payment_received | invoice_ready |
           review_request | promotion | system
- `title` — short notification title
- `body` — full notification message
- `action_url` — optional deep-link URL (e.g. /account/bookings/<id>)
- `read` — boolean, default false
- `read_at` — timestamp when marked read
- `sent_via_email` — whether an email was also dispatched
- `sent_via_sms` — whether an SMS was also dispatched
- `created_at` — when the notification was created

## Security
- RLS enabled.
- Customers can SELECT and UPDATE (mark read) their own notifications.
- No INSERT from frontend — notifications are created by edge functions / triggers only.
- Admins have full SELECT and INSERT access.

## Indexes
- `user_id` — list all notifications for a user
- `(user_id, read)` — unread badge count
- `booking_id` — find notifications tied to a booking
- `created_at DESC` — chronological listing
- `type` — filter by notification type

## Trigger: auto-notify on booking status change
Adds a PL/pgSQL trigger on `bookings` that inserts a notification row whenever
`status` changes to `confirmed`, `completed`, or `cancelled`.
*/

-- ============================================================
-- notifications (customer-facing)
-- ============================================================
CREATE TABLE IF NOT EXISTS notifications (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           uuid        NOT NULL
                      REFERENCES auth.users(id) ON DELETE CASCADE,
  booking_id        uuid
                      REFERENCES bookings(id) ON DELETE SET NULL,
  invoice_id        uuid
                      REFERENCES invoices(id) ON DELETE SET NULL,
  type              text        NOT NULL DEFAULT 'system'
                      CHECK (type IN (
                        'booking_confirmed','booking_reminder','booking_cancelled',
                        'booking_completed','payment_received','invoice_ready',
                        'review_request','promotion','system'
                      )),
  title             text        NOT NULL,
  body              text,
  action_url        text,
  read              boolean     NOT NULL DEFAULT false,
  read_at           timestamptz,
  sent_via_email    boolean     NOT NULL DEFAULT false,
  sent_via_sms      boolean     NOT NULL DEFAULT false,
  created_at        timestamptz NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id
  ON notifications(user_id);

CREATE INDEX IF NOT EXISTS idx_notifications_user_unread
  ON notifications(user_id, read)
  WHERE read = false;

CREATE INDEX IF NOT EXISTS idx_notifications_booking_id
  ON notifications(booking_id)
  WHERE booking_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_notifications_invoice_id
  ON notifications(invoice_id)
  WHERE invoice_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_notifications_created_at
  ON notifications(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_notifications_type
  ON notifications(type);

-- RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "customers_select_own_notifications" ON notifications;
CREATE POLICY "customers_select_own_notifications" ON notifications
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "customers_update_own_notifications" ON notifications;
CREATE POLICY "customers_update_own_notifications" ON notifications
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "admin_select_notifications" ON notifications;
CREATE POLICY "admin_select_notifications" ON notifications
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_profiles WHERE admin_profiles.user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "admin_insert_notifications" ON notifications;
CREATE POLICY "admin_insert_notifications" ON notifications
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM admin_profiles WHERE admin_profiles.user_id = auth.uid()
  ));

-- ============================================================
-- Trigger: auto-create notification on booking status change
-- ============================================================
CREATE OR REPLACE FUNCTION notify_on_booking_status_change()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
  v_user_id uuid;
  v_title   text;
  v_body    text;
  v_type    text;
BEGIN
  -- Only fire when status actually changes
  IF OLD.status = NEW.status THEN
    RETURN NEW;
  END IF;

  -- Only notify if there's a linked user
  IF NEW.user_id IS NULL THEN
    RETURN NEW;
  END IF;

  v_user_id := NEW.user_id;

  IF NEW.status = 'confirmed' THEN
    v_type  := 'booking_confirmed';
    v_title := 'Booking Confirmed';
    v_body  := 'Your booking ' || COALESCE(NEW.reference, NEW.id::text) ||
               ' has been confirmed. We look forward to seeing you!';

  ELSIF NEW.status = 'completed' THEN
    v_type  := 'booking_completed';
    v_title := 'Cleaning Complete';
    v_body  := 'Your cleaning for booking ' || COALESCE(NEW.reference, NEW.id::text) ||
               ' has been completed. We hope you love the results!';

  ELSIF NEW.status = 'cancelled' THEN
    v_type  := 'booking_cancelled';
    v_title := 'Booking Cancelled';
    v_body  := 'Your booking ' || COALESCE(NEW.reference, NEW.id::text) ||
               ' has been cancelled. Please contact us if this was unexpected.';

  ELSE
    RETURN NEW;
  END IF;

  INSERT INTO notifications (user_id, booking_id, type, title, body, action_url)
  VALUES (
    v_user_id,
    NEW.id,
    v_type,
    v_title,
    v_body,
    '/account/bookings/' || NEW.id::text
  );

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS bookings_notify_customer ON bookings;
CREATE TRIGGER bookings_notify_customer
  AFTER UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION notify_on_booking_status_change();
