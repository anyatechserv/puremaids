const BASE = () => `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1`;
const ANON = () => process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

export async function createBookingCheckout(params: {
  bookingId: string;
  bookingReference: string;
  serviceType: string;
  serviceLabel: string;
  totalPricePence: number;
  depositPence: number;
  customerEmail: string;
  customerName: string;
  paymentType: 'deposit' | 'full';
}): Promise<string> {
  const res = await fetch(`${BASE()}/create-checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${ANON()}` },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const e = await res.json().catch(() => ({}));
    throw new Error(e.error ?? `Checkout error ${res.status}`);
  }
  const d = await res.json();
  return d.url;
}

export async function createSubscriptionCheckout(params: {
  planId: string;
  priceId: string;
  planName: string;
  customerEmail: string;
  customerName: string;
}): Promise<string> {
  const res = await fetch(`${BASE()}/create-checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${ANON()}` },
    body: JSON.stringify({ ...params, mode: 'subscription' }),
  });
  if (!res.ok) {
    const e = await res.json().catch(() => ({}));
    throw new Error(e.error ?? `Subscription checkout error ${res.status}`);
  }
  const d = await res.json();
  return d.url;
}

export async function requestRefund(
  accessToken: string,
  params: { paymentId: string; amountPence?: number; reason?: string; mode?: 'full' | 'partial' },
): Promise<{ refundId: string; amountRefundedPence: number; status: string }> {
  const res = await fetch(`${BASE()}/process-refund`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify({ ...params, mode: params.mode ?? 'full' }),
  });
  if (!res.ok) {
    const e = await res.json().catch(() => ({}));
    throw new Error(e.error ?? `Refund error ${res.status}`);
  }
  return res.json();
}
