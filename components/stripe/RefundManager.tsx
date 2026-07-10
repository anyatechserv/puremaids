'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase-client';
import { formatGBP } from '@/lib/pricing';
import { processRefund } from '@/lib/stripe-api';

interface Payment {
  id: string;
  booking_id: string;
  amount_pence: number;
  refund_amount_pence: number;
  status: string;
  description: string | null;
  created_at: string;
  failure_reason: string | null;
  bookings: { reference: string }[] | null;
}

export default function RefundManager() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refundModal, setRefundModal] = useState<Payment | null>(null);
  const [refundAmount, setRefundAmount] = useState('');
  const [refundReason, setRefundReason] = useState('requested_by_customer');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPayments();
  }, []);

  async function loadPayments() {
    const { data } = await supabase
      .from('payments')
      .select(`
        id, booking_id, amount_pence, refund_amount_pence, status, description, created_at, failure_reason,
        bookings!inner(reference)
      `)
      .in('status', ['succeeded', 'partially_refunded'])
      .order('created_at', { ascending: false });

    setPayments(data ?? []);
    setLoading(false);
  }

  function openRefundModal(payment: Payment) {
    setRefundModal(payment);
    const remaining = payment.amount_pence - (payment.refund_amount_pence ?? 0);
    setRefundAmount((remaining / 100).toFixed(2));
    setError(null);
  }

  async function handleRefund() {
    if (!refundModal) return;
    setProcessing(true);
    setError(null);

    try {
      const amountPence = Math.round(parseFloat(refundAmount) * 100);
      const remaining = refundModal.amount_pence - (refundModal.refund_amount_pence ?? 0);

      if (amountPence > remaining) {
        setError(`Amount exceeds refundable balance of ${formatGBP(remaining)}`);
        setProcessing(false);
        return;
      }

      const isFull = amountPence >= remaining;

      await processRefund({
        paymentId: refundModal.id,
        amountPence,
        reason: refundReason,
        mode: isFull ? 'full' : 'partial',
      });

      setRefundModal(null);
      await loadPayments();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Refund failed');
    } finally {
      setProcessing(false);
    }
  }

  if (loading) {
    return <div className="py-8 text-center text-gray-500">Loading payments...</div>;
  }

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-gray-900">Refund Management</h2>

      {payments.length === 0 ? (
        <div className="py-8 text-center text-gray-500">No refundable payments.</div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">Booking</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">Date</th>
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase text-gray-500">Charged</th>
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase text-gray-500">Refunded</th>
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase text-gray-500">Refundable</th>
                <th className="px-6 py-3 text-center text-xs font-semibold uppercase text-gray-500">Status</th>
                <th className="px-6 py-3 text-center text-xs font-semibold uppercase text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {payments.map((p) => {
                const refunded = p.refund_amount_pence ?? 0;
                const refundable = p.amount_pence - refunded;
                return (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {p.bookings?.[0]?.reference ?? '—'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(p.created_at).toLocaleDateString('en-GB')}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                      {formatGBP(p.amount_pence)}
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-orange-600">
                      {refunded > 0 ? formatGBP(refunded) : '—'}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                      {formatGBP(refundable)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-700">
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {refundable > 0 ? (
                        <button
                          onClick={() => openRefundModal(p)}
                          className="text-sm font-semibold text-red-600 hover:text-red-700"
                        >
                          Refund
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400">Fully refunded</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Refund modal */}
      {refundModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="card w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-gray-900">Process Refund</h3>
            <p className="mt-2 text-sm text-gray-600">
              Booking: {refundModal.bookings?.[0]?.reference ?? '—'}
            </p>
            <p className="mt-1 text-sm text-gray-600">
              Original charge: {formatGBP(refundModal.amount_pence)}
            </p>

            {error && (
              <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Refund amount (GBP)</label>
                <input
                  type="number"
                  step="0.01"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Reason</label>
                <select
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                >
                  <option value="requested_by_customer">Requested by customer</option>
                  <option value="duplicate">Duplicate charge</option>
                  <option value="fraudulent">Fraudulent</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setRefundModal(null)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleRefund}
                disabled={processing}
                className="flex-1 rounded-lg bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700"
              >
                {processing ? 'Processing...' : 'Confirm Refund'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
