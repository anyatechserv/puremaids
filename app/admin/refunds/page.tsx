'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/lib/supabase-client';
import { processRefund } from '@/lib/stripe-api';

interface Payment {
  id: string;
  booking_id: string;
  amount_pence: number;
  status: string;
  refund_amount_pence: number;
  created_at: string;
}

export default function AdminRefundsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refundModal, setRefundModal] = useState<Payment | null>(null);
  const [refundAmount, setRefundAmount] = useState('');
  const [refundReason, setRefundReason] = useState('requested_by_customer');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = getSupabaseBrowserClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }
      const { data: admin } = await supabase.from('admin_profiles').select('role').eq('user_id', user.id).single();
      if (!admin) { router.push('/account'); return; }
      setIsAdmin(true);
      const { data: pays } = await supabase.from('payments').select('id, booking_id, amount_pence, status, refund_amount_pence, created_at').in('status', ['succeeded', 'partially_refunded']).order('created_at', { ascending: false });
      setPayments(pays || []);
      setLoading(false);
    }
    load();
  }, [router]);

  async function handleRefund() {
    if (!refundModal) return;
    setProcessing(true);
    setError(null);
    try {
      const supabase = getSupabaseBrowserClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');
      const amountPence = refundAmount ? parseInt(refundAmount) * 100 : refundModal.amount_pence - refundModal.refund_amount_pence;
      await processRefund({ paymentId: refundModal.id, amountPence, reason: refundReason, mode: refundAmount ? 'partial' : 'full' }, session.access_token);
      setRefundModal(null);
      setRefundAmount('');
      const { data: pays } = await getSupabaseBrowserClient().from('payments').select('id, booking_id, amount_pence, status, refund_amount_pence, created_at').in('status', ['succeeded', 'partially_refunded', 'refunded']).order('created_at', { ascending: false });
      setPayments(pays || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Refund failed');
    } finally {
      setProcessing(false);
    }
  }

  if (loading) return <div className="section py-20 text-center text-gray-500">Loading...</div>;
  if (!isAdmin) return null;

  return (
    <div className="section py-12">
      <h1 className="heading-2 mb-8">Refund Management</h1>
      {error && <div className="alert-error mb-4">{error}</div>}
      <div className="space-y-3">
        {payments.map(p => (
          <div key={p.id} className="card flex justify-between items-center">
            <div>
              <p className="font-medium">Payment {(p.amount_pence / 100).toFixed(2)} GBP</p>
              <p className="text-sm text-gray-500">Status: {p.status} | Refunded: {(p.refund_amount_pence / 100).toFixed(2)} GBP</p>
            </div>
            <button className="btn-secondary" onClick={() => setRefundModal(p)}>Refund</button>
          </div>
        ))}
      </div>
      {refundModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setRefundModal(null)}>
          <div className="card max-w-md w-full mx-4" onClick={e => e.stopPropagation()}>
            <h2 className="heading-3 mb-4">Process Refund</h2>
            <p className="text-sm text-gray-500 mb-4">Original: {(refundModal.amount_pence / 100).toFixed(2)} GBP | Already refunded: {(refundModal.refund_amount_pence / 100).toFixed(2)} GBP</p>
            <div className="mb-4">
              <label className="label">Refund Amount (GBP, leave empty for full remaining)</label>
              <input type="number" className="input" value={refundAmount} onChange={e => setRefundAmount(e.target.value)} min="0" step="0.01" placeholder={`Max: ${((refundModal.amount_pence - refundModal.refund_amount_pence) / 100).toFixed(2)}`} />
            </div>
            <div className="mb-4">
              <label className="label">Reason</label>
              <select className="input" value={refundReason} onChange={e => setRefundReason(e.target.value)}>
                <option value="requested_by_customer">Customer requested</option>
                <option value="duplicate">Duplicate</option>
                <option value="fraudulent">Fraudulent</option>
                <option value="service_not_provided">Service not provided</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="flex gap-4">
              <button className="btn-secondary" onClick={() => setRefundModal(null)}>Cancel</button>
              <button className="btn-primary flex-1" disabled={processing} onClick={handleRefund}>{processing ? 'Processing...' : 'Confirm Refund'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
