'use client';

import { useEffect, useState, useCallback } from 'react';
import { useCustomer } from '@/lib/customer-auth';
import { supabase } from '@/lib/supabase';
import { formatPrice } from '@/lib/booking';
import { FileText, Download, Printer } from 'lucide-react';

interface Booking {
  id: string; reference: string; status: string; service_type: string;
  first_name: string; last_name: string; email: string; phone: string;
  address: string; postcode: string; preferred_date: string; preferred_time: string;
  base_price_pence: number; extras_price_pence: number; total_price_pence: number;
  deposit_paid: boolean; deposit_amount_pence: number; created_at: string;
  booking_extras: { name: string; price_pence: number }[];
}

const SERVICE_LABELS: Record<string, string> = {
  domestic: 'Domestic Cleaning', deep: 'Deep Cleaning',
  end_of_tenancy: 'End of Tenancy Cleaning', office: 'Office Cleaning',
};
const TIME_LABELS: Record<string, string> = {
  morning: 'Morning (8am–12pm)', afternoon: 'Afternoon (12pm–4pm)', evening: 'Evening (4pm–6pm)',
};

function buildInvoiceHtml(b: Booking): string {
  const extras = (b.booking_extras ?? []).map((e) =>
    `<tr><td style="padding:8px 0;color:#6b7280;">${e.name}</td><td style="padding:8px 0;text-align:right;">${formatPrice(e.price_pence)}</td></tr>`
  ).join('');
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"/><title>Invoice ${b.reference}</title>
<style>body{font-family:Arial,sans-serif;margin:0;padding:32px;color:#111827;font-size:14px;}.brand{font-size:24px;font-weight:900;color:#00AEEF;}.header{display:flex;justify-content:space-between;margin-bottom:32px;}.total-row td{padding:12px 0;font-weight:bold;font-size:16px;border-top:2px solid #e5e7eb;}.total-row td:last-child{color:#00AEEF;font-size:20px;}h3{font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:#6b7280;margin:20px 0 6px;}table{width:100%;border-collapse:collapse;}.footer{margin-top:40px;padding-top:12px;border-top:1px solid #e5e7eb;color:#9ca3af;font-size:12px;text-align:center;}</style></head><body>
<div class="header"><div><div class="brand">PureMaids</div><div style="color:#6b7280;font-size:12px;margin-top:4px;">Premium Cleaning · London<br/>hello@puremaids.co.uk · 0800 012 3456</div></div>
<div style="text-align:right;"><div style="font-size:22px;font-weight:900;margin-bottom:6px;">Invoice</div>
<div style="font-size:18px;font-weight:900;color:#00AEEF;">${b.reference}</div>
<div style="font-size:12px;color:#6b7280;margin-top:4px;">Issued: ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</div></div></div>
<h3>Bill To</h3><p style="margin:0;font-weight:bold;">${b.first_name} ${b.last_name}</p><p style="margin:2px 0;color:#4b5563;">${b.email} · ${b.phone}</p><p style="margin:2px 0;color:#4b5563;">${b.address}, ${b.postcode}</p>
<h3>Service</h3><table><tr style="border-bottom:1px solid #e5e7eb;"><th style="text-align:left;padding:8px 0;font-size:11px;text-transform:uppercase;color:#6b7280;">Description</th><th style="text-align:right;font-size:11px;text-transform:uppercase;color:#6b7280;">Amount</th></tr>
<tr><td style="padding:10px 0;font-weight:600;">${SERVICE_LABELS[b.service_type] ?? b.service_type}</td><td style="padding:10px 0;text-align:right;">${formatPrice(b.base_price_pence)}</td></tr>
${extras}<tr class="total-row"><td>Total</td><td>${formatPrice(b.total_price_pence)}</td></tr>
<tr><td style="padding:4px 0;color:#6b7280;">Deposit (paid)</td><td style="padding:4px 0;text-align:right;color:#6b7280;">${formatPrice(b.deposit_amount_pence)} ${b.deposit_paid ? '✓' : ''}</td></tr>
<tr><td style="padding:4px 0;font-weight:600;">Balance due on day</td><td style="padding:4px 0;text-align:right;font-weight:600;">${formatPrice(b.total_price_pence - b.deposit_amount_pence)}</td></tr></table>
<h3>Appointment</h3><p style="margin:0;"><strong>Date:</strong> ${b.preferred_date} · <strong>Time:</strong> ${TIME_LABELS[b.preferred_time] ?? b.preferred_time}</p>
<div class="footer"><p>Thank you for choosing PureMaids · PureMaids Ltd · London</p></div></body></html>`;
}

export default function AccountInvoicesPage() {
  const { user } = useCustomer();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState<Booking | null>(null);

  const load = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('bookings')
      .select('*, booking_extras(name, price_pence)')
      .eq('user_id', user.id)
      .neq('status', 'pending')
      .order('created_at', { ascending: false });
    setBookings((data as Booking[]) ?? []);
    setLoading(false);
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const printInvoice = (b: Booking) => {
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(buildInvoiceHtml(b));
    win.document.close();
    setTimeout(() => win.print(), 300);
  };

  const downloadInvoice = (b: Booking) => {
    const blob = new Blob([buildInvoiceHtml(b)], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `invoice-${b.reference}.html`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <h1 className="font-heading font-extrabold text-2xl text-secondary-800 mb-1">Invoices</h1>
      <p className="text-secondary-400 text-sm mb-6">Download invoices for your bookings.</p>

      {loading
        ? <div className="space-y-3">{Array.from({ length: 2 }).map((_, i) => <div key={i} className="h-20 bg-white rounded-2xl border border-secondary-100 animate-pulse" />)}</div>
        : bookings.length === 0
        ? (
          <div className="bg-white rounded-2xl border border-secondary-100 p-12 text-center shadow-soft">
            <FileText className="w-10 h-10 text-secondary-200 mx-auto mb-3" />
            <p className="font-semibold text-secondary-600">No invoices yet</p>
            <p className="text-secondary-400 text-sm mt-1">Invoices appear here once your booking is confirmed.</p>
          </div>
        )
        : (
          <div className="space-y-3">
            {bookings.map((b) => (
              <div key={b.id} className="bg-white rounded-2xl border border-secondary-100 shadow-soft">
                <div className="flex items-center gap-4 px-5 py-4">
                  <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center shrink-0">
                    <FileText className="w-4.5 h-4.5 text-primary-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-primary-600">{b.reference}</span>
                    </div>
                    <p className="text-sm text-secondary-700">{SERVICE_LABELS[b.service_type] ?? b.service_type} · {b.preferred_date}</p>
                  </div>
                  <p className="font-heading font-bold text-secondary-800 hidden sm:block">{formatPrice(b.total_price_pence)}</p>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setPreview(preview?.id === b.id ? null : b)}
                      className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-secondary-200 text-secondary-600 hover:bg-secondary-50 transition-colors">
                      Preview
                    </button>
                    <button onClick={() => printInvoice(b)} title="Print"
                      className="p-1.5 rounded-lg border border-secondary-200 text-secondary-600 hover:bg-secondary-50 transition-colors">
                      <Printer className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => downloadInvoice(b)} title="Download"
                      className="p-1.5 rounded-lg border border-secondary-200 text-secondary-600 hover:bg-secondary-50 transition-colors">
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                {preview?.id === b.id && (
                  <div className="border-t border-secondary-100 p-4">
                    <iframe srcDoc={buildInvoiceHtml(b)} className="w-full h-[500px] border-0 rounded-xl" title={`Invoice ${b.reference}`} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
    </div>
  );
}
