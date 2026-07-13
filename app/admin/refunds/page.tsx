'use client';

import { useEffect, useState } from 'react';
import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import { supabase } from '@/lib/supabase-client';
import { formatGBP } from '@/lib/pricing';
import { requestRefund } from '@/lib/stripe-api';
import Spinner from '@/components/ui/Spinner';

interface Payment {
  id: string;
  booking_id: string;
  amount_pence: number;
  refund_amount_pence: number;
  status: string;
  created_at: string;
  bookings: { reference: string }[] | null;
}

export const dynamic = 'force-dynamic';

export default function AdminRefundsPage() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<Payment | null>(null);
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('requested_by_customer');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setIsAdmin(false); setLoading(false); return; }
      const { data } = await supabase.from('admin_profiles').select('id').eq('user_id', user.id).maybeSingle();
      setIsAdmin(!!data);
      if (data) await loadPayments();
      setLoading(false);
    }
    init();
  }, []);

  async function loadPayments() {
    const { data } = await supabase
      .from('payments')
      .select('id,booking_id,amount_pence,refund_amount_pence,status,created_at,bookings!inner(reference)')
      .in('status', ['succeeded', 'partially_refunded'])
      .order('created_at', { ascending: false });
    setPayments(data ?? []);
  }

  function openModal(p: Payment) {
    setModal(p);
    const rem = p.amount_pence - (p.refund_amount_pence ?? 0);
    setAmount((rem / 100).toFixed(2));
    setError(null);
    setSuccess(null);
  }

  async function handleRefund() {
    if (!modal) return;
    setProcessing(true);
    setError(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');
      const pence = Math.round(parseFloat(amount) * 100);
      const rem = modal.amount_pence - (modal.refund_amount_pence ?? 0);
      await requestRefund(session.access_token, {
        paymentId: modal.id,
        amountPence: pence,
        reason,
        mode: pence >= rem ? 'full' : 'partial',
      });
      setSuccess(`Refund of ${formatGBP(pence)} processed.`);
      setModal(null);
      await loadPayments();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Refund failed');
    } finally {
      setProcessing(false);
    }
  }

  if (loading) return <div className="flex min-h-screen items-center justify-center"><Spinner size="lg" /></div>;
  if (isAdmin === false) return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="card p-8 text-center">
        <h1 className="text-xl font-bold text-error-500">Access Denied</h1>
        <p className="mt-2 text-gray-600">Admin access required.</p>
      </div>
    </div>
  );

  return (
    <>
      <Nav />
      <main id="main-content" className="min-h-screen bg-gray-50 pt-20">
        <div className="container py-10">
          <h1 className="font-display text-3xl font-bold text-gray-900">Refund Management</h1>
          {success && <div className="alert alert-success mt-4" role="status">{success}</div>}

          <div className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {['Booking', 'Date', 'Charged', 'Refunded', 'Remaining', 'Status', 'Action'].map(h => (
                      <th key={h} scope="col" className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {payments.length === 0 ? (
                    <tr><td colSpan={7} className="px-5 py-10 text-center text-gray-400 text-sm">No refundable payments.</td></tr>
                  ) : payments.map(p => {
                    const refunded = p.refund_amount_pence ?? 0;
                    const rem = p.amount_pence - refunded;
                    return (
                      <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-4 text-sm font-medium text-gray-900">{p.bookings?.[0]?.reference ?? '—'}</td>
                        <td className="px-5 py-4 text-sm text-gray-600">{new Date(p.created_at).toLocaleDateString('en-GB')}</td>
                        <td className="px-5 py-4 text-sm font-semibold">{formatGBP(p.amount_pence)}</td>
                        <td className="px-5 py-4 text-sm text-accent-600">{refunded > 0 ? formatGBP(refunded) : '—'}</td>
                        <td className="px-5 py-4 text-sm font-semibold">{formatGBP(rem)}</td>
                        <td className="px-5 py-4"><span className="badge-green">{p.status}</span></td>
                        <td className="px-5 py-4">
                          {rem > 0 ? (
                            <button onClick={() => openModal(p)} className="text-sm font-semibold text-error-500 hover:text-error-700 transition-colors">
                              Refund
                            </button>
                          ) : <span className="text-xs text-gray-400">Fully refunded</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Refund modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in" role="dialog" aria-modal="true" aria-labelledby="refund-modal-title">
          <div className="card w-full max-w-md p-6 animate-slide-up">
            <h2 id="refund-modal-title" className="font-display text-lg font-bold text-gray-900">Process Refund</h2>
            <p className="mt-1 text-sm text-gray-600">Booking {modal.bookings?.[0]?.reference} · Charged: {formatGBP(modal.amount_pence)}</p>
            {error && <div className="alert alert-error mt-4" role="alert">{error}</div>}
            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor="refund-amount" className="label">Refund amount (£)</label>
                <input id="refund-amount" type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} className="input" min="0.01" max={(modal.amount_pence / 100).toFixed(2)} />
              </div>
              <div>
                <label htmlFor="refund-reason" className="label">Reason</label>
                <select id="refund-reason" value={reason} onChange={e => setReason(e.target.value)} className="input">
                  <option value="requested_by_customer">Requested by customer</option>
                  <option value="duplicate">Duplicate charge</option>
                  <option value="fraudulent">Fraudulent</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={() => setModal(null)} className="btn btn-md btn-secondary flex-1">Cancel</button>
              <button onClick={handleRefund} disabled={processing} className="btn btn-md btn-danger flex-1">
                {processing ? <><Spinner size="sm" /> Processing…</> : 'Confirm Refund'}
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}
