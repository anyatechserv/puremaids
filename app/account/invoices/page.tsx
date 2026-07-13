'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import Spinner from '@/components/ui/Spinner';
import { supabase } from '@/lib/supabase-client';
import { fmt, fmtDate } from '@/lib/pricing';

interface Invoice {
  id: string; invoice_number: string; invoice_date: string;
  total_pence: number; status: string;
  service_description: string | null; pdf_url: string | null;
}

const STATUS: Record<string, string> = {
  paid: 'badge-green', sent: 'badge-blue', draft: 'badge-gray',
  overdue: 'badge-red', void: 'badge-gray', cancelled: 'badge-gray',
};

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [authed,   setAuthed]   = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setAuthed(!!user);
      if (!user) { setLoading(false); return; }
      const { data } = await supabase
        .from('invoices')
        .select('id,invoice_number,invoice_date,total_pence,status,service_description,pdf_url')
        .eq('user_id', user.id)
        .order('invoice_date', { ascending: false });
      setInvoices(data ?? []);
      setLoading(false);
    })();
  }, []);

  return (
    <>
      <Nav />
      <main id="main-content" className="min-h-screen bg-gray-50 pt-20">
        <div className="container py-10">
          <h1 className="font-display text-3xl font-bold text-gray-900">My Invoices</h1>
          <p className="mt-1 text-gray-500">View and download invoices for all your cleaning services.</p>

          <div className="mt-8">
            {loading ? (
              <div className="flex justify-center py-16"><Spinner size="lg" /></div>
            ) : authed === false ? (
              <div className="card p-8 text-center">
                <p className="text-gray-600">Please sign in to view your invoices.</p>
                <Link href="/login" className="btn btn-md btn-primary mt-4">Sign In</Link>
              </div>
            ) : invoices.length === 0 ? (
              <div className="card p-8 text-center text-gray-500">
                No invoices yet — they'll appear here after each service.
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {['Invoice','Date','Service','Total','Status','PDF'].map(h => (
                          <th key={h} scope="col" className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {invoices.map(inv => (
                        <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-5 py-4 text-sm font-medium text-gray-900">{inv.invoice_number}</td>
                          <td className="px-5 py-4 text-sm text-gray-600 whitespace-nowrap">{fmtDate(inv.invoice_date)}</td>
                          <td className="px-5 py-4 text-sm text-gray-600 max-w-[180px] truncate">{inv.service_description ?? '—'}</td>
                          <td className="px-5 py-4 text-sm font-semibold text-gray-900">{fmt(inv.total_pence)}</td>
                          <td className="px-5 py-4">
                            <span className={STATUS[inv.status] ?? 'badge-gray'}>{inv.status}</span>
                          </td>
                          <td className="px-5 py-4 text-sm">
                            {inv.pdf_url
                              ? <a href={inv.pdf_url} target="_blank" rel="noopener noreferrer" className="font-medium text-brand-600 hover:text-brand-700" aria-label={`Download invoice ${inv.invoice_number}`}>Download</a>
                              : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
