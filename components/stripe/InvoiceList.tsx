'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase-client';
import { formatGBP } from '@/lib/pricing';

interface Invoice {
  id: string;
  invoice_number: string;
  invoice_date: string;
  total_pence: number;
  amount_paid_pence: number;
  amount_due_pence: number;
  status: string;
  service_description: string | null;
  pdf_url: string | null;
}

export default function InvoiceList() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInvoices() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from('invoices')
        .select('id, invoice_number, invoice_date, total_pence, amount_paid_pence, amount_due_pence, status, service_description, pdf_url')
        .eq('user_id', user.id)
        .order('invoice_date', { ascending: false });

      setInvoices(data ?? []);
      setLoading(false);
    }

    loadInvoices();
  }, []);

  const statusColors: Record<string, string> = {
    paid: 'bg-green-100 text-green-700',
    sent: 'bg-blue-100 text-blue-700',
    draft: 'bg-gray-100 text-gray-700',
    overdue: 'bg-red-100 text-red-700',
    void: 'bg-gray-100 text-gray-500',
    cancelled: 'bg-gray-100 text-gray-500',
  };

  if (loading) {
    return <div className="py-8 text-center text-gray-500">Loading invoices...</div>;
  }

  if (invoices.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500">
        No invoices yet. Your invoices will appear here after each cleaning service.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">Invoice</th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">Date</th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">Service</th>
            <th className="px-6 py-3 text-right text-xs font-semibold uppercase text-gray-500">Total</th>
            <th className="px-6 py-3 text-center text-xs font-semibold uppercase text-gray-500">Status</th>
            <th className="px-6 py-3 text-center text-xs font-semibold uppercase text-gray-500">PDF</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {invoices.map((inv) => (
            <tr key={inv.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm font-medium text-gray-900">{inv.invoice_number}</td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {new Date(inv.invoice_date).toLocaleDateString('en-GB')}
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {inv.service_description ?? '—'}
              </td>
              <td className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                {formatGBP(inv.total_pence)}
              </td>
              <td className="px-6 py-4 text-center">
                <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusColors[inv.status] ?? 'bg-gray-100 text-gray-600'}`}>
                  {inv.status}
                </span>
              </td>
              <td className="px-6 py-4 text-center">
                {inv.pdf_url ? (
                  <a
                    href={inv.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-600 hover:text-brand-700"
                  >
                    Download
                  </a>
                ) : (
                  '—'
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
