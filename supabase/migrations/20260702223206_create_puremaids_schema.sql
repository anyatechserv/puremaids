/*
# PureMaids Database Schema

## Overview
Creates the core tables for the PureMaids cleaning company website.

## New Tables

### 1. contact_enquiries
Stores contact form submissions from the Contact page.
- id: UUID primary key
- first_name, last_name: Customer name
- email, phone: Contact details
- service: Service type they're enquiring about
- message: Enquiry message
- gdpr_consent: GDPR consent boolean
- status: Processing status (new, responded, closed)
- created_at: Timestamp

### 2. bookings
Stores online booking requests from the Book Online page.
- id: UUID primary key
- first_name, last_name: Customer name
- email, phone: Contact details
- address, postcode: Property location
- service_type: Type of cleaning service
- property_size: Number of bedrooms / office size
- frequency: How often (one_off, weekly, fortnightly, monthly)
- preferred_date, preferred_time: When they want the clean
- special_instructions: Any notes from customer
- gdpr_consent: GDPR consent boolean
- status: Booking status (pending, confirmed, completed, cancelled)
- created_at: Timestamp

## Security
- RLS enabled on both tables
- Public (anon) inserts allowed — no login required for form submissions
- Reads restricted to service role only (admin backend)
*/

CREATE TABLE IF NOT EXISTS contact_enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  service text NOT NULL,
  message text NOT NULL,
  gdpr_consent boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_enquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_contact_enquiries" ON contact_enquiries;
CREATE POLICY "anon_insert_contact_enquiries" ON contact_enquiries FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_select_contact_enquiries" ON contact_enquiries;
CREATE POLICY "anon_select_contact_enquiries" ON contact_enquiries FOR SELECT
TO anon, authenticated USING (false);

CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  address text NOT NULL,
  postcode text NOT NULL,
  service_type text NOT NULL,
  property_size text,
  frequency text NOT NULL DEFAULT 'one_off',
  preferred_date date,
  preferred_time text,
  special_instructions text,
  gdpr_consent boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_bookings" ON bookings;
CREATE POLICY "anon_insert_bookings" ON bookings FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_select_bookings" ON bookings;
CREATE POLICY "anon_select_bookings" ON bookings FOR SELECT
TO anon, authenticated USING (false);
