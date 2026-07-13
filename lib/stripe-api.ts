const base = () => `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1`;
const anon  = () => process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

async function post(path: string, body: unknown, token?: string) {
  const res = await fetch(`${base()}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token ?? anon()}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const e = await res.json().catch(() => ({})) as { error?: string };
    throw new Error(e.error ?? `Request failed (${res.status})`);
  }
  return res.json();
}

export async function createBookingCheckout(p: {
  bookingId: string; bookingReference: string; serviceType: string; serviceLabel: string;
  totalPricePence: number; depositPence: number; customerEmail: string; customerName: string;
  paymentType: 'deposit' | 'full';
}): Promise<string> {
  const d = await post('/create-checkout', p);
  return d.url as string;
}

export async function createSubscriptionCheckout(p: {
  planId: string; priceId: string; planName: string; customerEmail: string; customerName: string;
}): Promise<string> {
  const d = await post('/create-checkout', { ...p, mode: 'subscription' });
  return d.url as string;
}

export async function requestRefund(
  accessToken: string,
  p: { paymentId: string; amountPence?: number; reason?: string; mode?: 'full' | 'partial' },
) {
  return post('/process-refund', { ...p, mode: p.mode ?? 'full' }, accessToken);
}
