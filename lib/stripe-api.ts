import { supabase } from './supabase-client';
import type { CheckoutRequest, SubscriptionCheckoutRequest } from './types/stripe';

const EDGE_FUNCTION_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1`;

export async function createBookingCheckoutSession(
  req: CheckoutRequest,
): Promise<{ url: string } | null> {
  const response = await fetch(`${EDGE_FUNCTION_URL}/create-checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify(req),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error ?? `Checkout failed (${response.status})`);
  }

  const data = await response.json();
  return { url: data.url };
}

export async function createSubscriptionCheckoutSession(
  req: SubscriptionCheckoutRequest,
): Promise<{ url: string } | null> {
  const response = await fetch(`${EDGE_FUNCTION_URL}/create-checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({ ...req, mode: 'subscription' }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error ?? `Subscription checkout failed (${response.status})`);
  }

  const data = await response.json();
  return { url: data.url };
}

export async function redirectToCheckout(url: string): Promise<void> {
  window.location.href = url;
}

export async function processRefund(params: {
  paymentId: string;
  amountPence?: number;
  reason?: string;
  mode?: 'full' | 'partial';
}): Promise<{ refundId: string; amountRefundedPence: number; status: string }> {
  const { data: session } = await supabase.auth.getSession();
  const token = session.session?.access_token;

  if (!token) throw new Error('Not authenticated');

  const response = await fetch(`${EDGE_FUNCTION_URL}/process-refund`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      paymentId: params.paymentId,
      amountPence: params.amountPence,
      reason: params.reason,
      mode: params.mode ?? 'full',
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error ?? `Refund failed (${response.status})`);
  }

  return response.json();
}
