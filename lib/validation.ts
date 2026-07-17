import { z } from 'zod';
import { SERVICES, EXTRAS, SERVICE_AREAS, TIME_SLOTS, SERVICE_KEYS, EXTRA_KEYS } from './constants';

const phoneRegex = /^(\+44\s?7\d{3}|\(?0\d{2,4}\)?\s?\d{3,4}\s?\d{3,4})$/;
const postcodeRegex = /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i;
const emailSchema = z.string().email().max(254).toLowerCase().trim();

const nameSchema = z.string().min(2).max(50).regex(/^[a-zA-Z\s'-]+$/, 'Name contains invalid characters');

export const bookingSchema = z.object({
  first_name: nameSchema,
  last_name: nameSchema,
  email: emailSchema,
  phone: z.string().min(7).max(20).regex(phoneRegex, 'Invalid UK phone number'),
  address: z.string().min(5).max(200),
  postcode: z.string().min(5).max(10).regex(postcodeRegex, 'Invalid UK postcode'),
  service_type: z.enum(SERVICE_KEYS as [string, ...string[]]),
  property_size: z.string().max(50).optional(),
  frequency: z.enum(['one_off', 'weekly', 'fortnightly', 'monthly']),
  preferred_date: z.string().min(1).max(20),
  preferred_time: z.enum(TIME_SLOTS as [string, ...string[]]),
  special_instructions: z.string().max(1000).optional(),
  gdpr_consent: z.literal(true),
  extras: z.array(z.enum(EXTRA_KEYS as [string, ...string[]])).optional().default([]),
  payment_type: z.enum(['deposit', 'full']),
});

export const contactSchema = z.object({
  first_name: nameSchema,
  last_name: nameSchema,
  email: emailSchema,
  phone: z.string().min(7).max(20).regex(phoneRegex, 'Invalid UK phone number'),
  service: z.string().min(1).max(50),
  message: z.string().min(10).max(2000),
  gdpr_consent: z.literal(true),
});

export const authSchema = z.object({
  email: emailSchema,
  password: z.string().min(8).max(72).regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
    'Password must have at least 8 characters, one uppercase, one lowercase, and one number'
  ),
});

export const reviewSchema = z.object({
  booking_id: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  title: z.string().max(100).optional(),
  body: z.string().max(2000).optional(),
});

export const refundSchema = z.object({
  paymentId: z.string().uuid(),
  amountPence: z.number().int().positive().max(10000000),
  reason: z.enum(['requested_by_customer', 'duplicate', 'fraudulent', 'service_not_provided', 'other']),
  mode: z.enum(['full', 'partial']).default('full'),
});

export const subscriptionCheckoutSchema = z.object({
  mode: z.literal('subscription'),
  planId: z.string().min(1).max(50),
  priceId: z.string().min(1).max(100),
  planName: z.string().min(1).max(100),
  customerEmail: emailSchema,
  customerName: z.string().min(1).max(100),
});

export const checkoutSchema = z.object({
  bookingId: z.string().uuid(),
  bookingReference: z.string().min(1).max(20),
  serviceType: z.string().min(1).max(50),
  serviceLabel: z.string().min(1).max(100),
  totalPricePence: z.number().int().positive().max(10000000),
  depositPence: z.number().int().nonnegative().max(10000000),
  customerEmail: emailSchema,
  customerName: z.string().min(1).max(100),
  paymentType: z.enum(['deposit', 'full']),
});

export function sanitizeString(input: string): string {
  return input
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim();
}

export function sanitizeBookingInput(data: Record<string, unknown>) {
  const parsed = bookingSchema.parse(data);
  return {
    ...parsed,
    first_name: sanitizeString(parsed.first_name),
    last_name: sanitizeString(parsed.last_name),
    address: sanitizeString(parsed.address),
    special_instructions: parsed.special_instructions ? sanitizeString(parsed.special_instructions) : null,
  };
}
