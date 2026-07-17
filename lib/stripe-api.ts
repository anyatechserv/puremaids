const BASE = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!BASE || !KEY) throw new Error('Missing Supabase env vars');

export async function createCheckoutSession(data: Record<string, unknown>): Promise<{ url: string; sessionId: string }> {
  const res = await fetch(`${BASE}/functions/v1/create-checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${KEY}` },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(err.error || 'Checkout failed');
  }
  return res.json();
}

export async function processRefund(data: Record<string, unknown>, accessToken: string): Promise<{ refundId: string; amountRefundedPence: number; status: string }> {
  const res = await fetch(`${BASE}/functions/v1/process-refund`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(err.error || 'Refund failed');
  }
  return res.json();
}
