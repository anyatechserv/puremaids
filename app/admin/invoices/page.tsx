'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { formatPrice } from '@/lib/booking';
import { FileText, Printer, Download, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Booking {
  id: string; reference: string; first_name: string; last_name: string;
  email: string; phone: string; address: string; postcode: string;
  service_type: string; preferred_date: string; preferred_time: string;
  base_price_pence: number; extras_price_pence: number; total_price_pence: number;
  deposit_paid: boolean; deposit_amount_pence: number; status: string;
  created_at: string;
  booking_extras: { name: string; price_pence: number }[];
}

const SERVICE_LABELS: Record<string, string> = {
  domestic: 'Domestic Cleaning', deep: 'Deep Cleaning',
  end_of_tenancy: 'End of Tenancy Cleaning', office: 'Office Cleaning',
};
const TIME_LABELS: Record<string, string> = {
  morning: 'Morning (8am–12pm)', afternoon: 'Afternoon (12pm–4pm)', evening: 'Evening (4pm–6pm)',
};

function generateInvoiceHtml(b: Booking): string {
  const extras = b.booking_extras?.map((e) =>
    `<tr><td style="padding:8px 0;color:#6b7280;font-size:14px;">${e.name}</td><td style="padding:8px 0;text-align:right;font-size:14px;">${formatPrice(e.price_pence)}</td></tr>`
  ).join('') ?? '';

  return `
<!DOCTYPE html><html><head><meta charset="UTF-8"/>
<title>Invoice ${b.reference}</title>
<style>
  body{font-family:Arial,sans-serif;margin:0;padding:32px;color:#111827;font-size:14px;}
  .header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:40px;}
  .brand{font-size:24px;font-weight:900;color:#00AEEF;}
  .sub{font-size:12px;color:#6b7280;margin-top:4px;}
  .invoice-info{text-align:right;}
  .invoice-info h2{font-size:22px;color:#111827;margin:0 0 8px;}
  .badge{display:inline-block;background:#dcfce7;color:#166534;padding:4px 12px;border-radius:99px;font-size:12px;font-weight:bold;}
  h3{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#6b7280;margin:24px 0 8px;}
  table{width:100%;border-collapse:collapse;}
  .total-row td{padding:12px 0;font-weight:bold;font-size:16px;border-top:2px solid #e5e7eb;}
  .total-row td:last-child{color:#00AEEF;font-size:20px;}
  .footer{margin-top:48px;padding-top:16px;border-top:1px solid #e5e7eb;color:#9ca3af;font-size:12px;text-align:center;}
</style></head><body>
<div class="header">
  <div>
    <div class="brand">PureMaids</div>
    <div class="sub">Premium Cleaning Services · London<br/>hello@puremaids.co.uk · 0800 012 3456</div>
  </div>
  <div class="invoice-info">
    <h2>Invoice</h2>
    <p style="margin:0 0 4px;font-size:13px;color:#6b7280;">Reference</p>
    <p style="margin:0 0 8px;font-weight:900;font-size:18px;color:#00AEEF;">${b.reference}</p>
    <span class="badge">${b.deposit_paid ? 'Deposit Paid' : 'Awaiting Payment'}</span>
    <p style="margin:8px 0 0;font-size:12px;color:#9ca3af;">Issued: ${new Date().toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})}</p>
  </div>
</div>

<h3>Bill To</h3>
<p style="margin:0;font-weight:bold;">${b.first_name} ${b.last_name}</p>
<p style="margin:2px 0;color:#4b5563;">${b.email}</p>
<p style="margin:2px 0;color:#4b5563;">${b.phone}</p>
<p style="margin:2px 0;color:#4b5563;">${b.address}, ${b.postcode}</p>

<h3>Service Details</h3>
<table>
  <tr style="border-bottom:1px solid #e5e7eb;">
    <th style="text-align:left;padding:8px 0;font-size:12px;text-transform:uppercase;letter-spacing:.05em;color:#6b7280;">Description</th>
    <th style="text-align:right;padding:8px 0;font-size:12px;text-transform:uppercase;letter-spacing:.05em;color:#6b7280;">Amount</th>
  </tr>
  <tr><td style="padding:10px 0;font-weight:600;">${SERVICE_LABELS[b.service_type] ?? b.service_type}</td><td style="padding:10px 0;text-align:right;">${formatPrice(b.base_price_pence)}</td></tr>
  ${extras}
  ${b.booking_extras?.length > 0 ? `<tr style="border-top:1px solid #f3f4f6;"><td style="padding:8px 0;color:#6b7280;">Extras subtotal</td><td style="padding:8px 0;text-align:right;color:#6b7280;">${formatPrice(b.extras_price_pence)}</td></tr>` : ''}
  <tr class="total-row"><td>Total</td><td>${formatPrice(b.total_price_pence)}</td></tr>
  <tr><td style="padding:4px 0;color:#6b7280;font-size:13px;">Deposit (25%)</td><td style="padding:4px 0;text-align:right;color:#6b7280;font-size:13px;">${formatPrice(b.deposit_amount_pence)} ${b.deposit_paid ? '✓' : '(pending)'}</td></tr>
  <tr><td style="padding:4px 0;color:#374151;font-weight:600;">Balance due on day</td><td style="padding:4px 0;text-align:right;font-weight:600;color:#374151;">${formatPrice(b.total_price_pence - b.deposit_amount_pence)}</td></tr>
</table>

<h3 style="margin-top:24px;">Appointment</h3>
<p style="margin:0;"><strong>Date:</strong> ${b.preferred_date}</p>
<p style="margin:4px 0;"><strong>Time:</strong> ${TIME_LABELS[b.preferred_time] ?? b.preferred_time}</p>
<p style="margin:4px 0;"><strong>Address:</strong> ${b.address}, ${b.postcode}</p>

<div class="footer">
  <p>Thank you for choosing PureMaids · PureMaids Ltd · London, United Kingdom</p>
  <p>Payment terms: Balance due on day of service · Queries: hello@puremaids.co.uk</p>
</div>
</body></html>`;
}

export default function AdminInvoicesPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [preview, setPreview] = useState<Booking | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('bookings')
      .select('*, booking_extras(name, price_pence)')
      .neq('status', 'cancelled')
      .order('created_at', { ascending: false });
    if (data) setBookings(data as Booking[]);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const printInvoice = (b: Booking) => {
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(generateInvoiceHtml(b));
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 300);
  };

  const downloadInvoice = (b: Booking) => {
    const html = generateInvoiceHtml(b);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `invoice-${b.reference}.html`; a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = bookings.filter((b) => {
    const q = search.toLowerCase();
    return !q || [b.reference, b.first_name, b.last_name, b.email].some((v) => v?.toLowerCase().includes(q));
  });

  return (
    <div className="p-6 md:p-8 max-w-screen-xl mx-auto">
      <div className="mb-6">
        <h1 className="font-heading font-extrabold text-2xl text-secondary-800">Invoices</h1>
        <p className="text-secondary-400 text-sm">Generate and download invoices for bookings</p>
      </div>

      <div className="bg-white rounded-2xl border border-secondary-100 shadow-soft overflow-hidden">
        <div className="p-4 border-b border-secondary-100">
          <div className="relative max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
            <input
              type="text" placeholder="Search by name, email, reference..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-xl border border-secondary-200 bg-secondary-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
            />
          </div>
        </div>
        {loading
          ? <div className="text-center py-16 text-secondary-400 text-sm">Loading...</div>
          : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-secondary-100 bg-secondary-50/80">
                    {['Reference','Customer','Service','Date','Total','Status','Actions'].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-secondary-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0
                    ? <tr><td colSpan={7} className="text-center py-12 text-secondary-400 text-sm">No invoices found</td></tr>
                    : filtered.map((b) => (
                        <tr key={b.id} className="border-b border-secondary-50 hover:bg-secondary-50/50">
                          <td className="px-4 py-3.5"><span className="font-mono font-bold text-sm text-primary-600">{b.reference}</span></td>
                          <td className="px-4 py-3.5">
                            <p className="font-semibold text-sm text-secondary-800">{b.first_name} {b.last_name}</p>
                            <p className="text-xs text-secondary-400">{b.email}</p>
                          </td>
                          <td className="px-4 py-3.5 text-sm text-secondary-600">{SERVICE_LABELS[b.service_type] ?? b.service_type}</td>
                          <td className="px-4 py-3.5 text-sm text-secondary-600">{b.preferred_date}</td>
                          <td className="px-4 py-3.5 font-heading font-bold text-sm text-secondary-800">{formatPrice(b.total_price_pence)}</td>
                          <td className="px-4 py-3.5">
                            <span className={cn(
                              'text-xs px-2 py-1 rounded-full font-semibold border capitalize',
                              b.deposit_paid ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200',
                            )}>
                              {b.deposit_paid ? 'Deposit Paid' : 'Pending'}
                            </span>
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => setPreview(preview?.id === b.id ? null : b)}
                                className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border border-secondary-200 text-secondary-600 hover:bg-secondary-50 transition-colors"
                              >
                                <FileText className="w-3 h-3" /> Preview
                              </button>
                              <button
                                onClick={() => printInvoice(b)}
                                className="p-1.5 rounded-lg border border-secondary-200 text-secondary-600 hover:bg-secondary-50 transition-colors"
                                title="Print"
                              >
                                <Printer className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => downloadInvoice(b)}
                                className="p-1.5 rounded-lg border border-secondary-200 text-secondary-600 hover:bg-secondary-50 transition-colors"
                                title="Download HTML"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          )}
      </div>

      {/* Inline preview */}
      {preview && (
        <div className="mt-6 bg-white rounded-2xl border border-secondary-100 shadow-soft overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-secondary-100">
            <h2 className="font-heading font-bold text-secondary-800">Invoice Preview — {preview.reference}</h2>
            <div className="flex gap-2">
              <button onClick={() => printInvoice(preview)} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-primary-500 text-white hover:bg-primary-600 transition-colors">
                <Printer className="w-3 h-3" /> Print
              </button>
              <button onClick={() => setPreview(null)} className="text-secondary-400 hover:text-secondary-600 px-2">&times;</button>
            </div>
          </div>
          <div className="p-5">
            <iframe
              srcDoc={generateInvoiceHtml(preview)}
              className="w-full h-[600px] border-0 rounded-xl"
              title={`Invoice ${preview.reference}`}
            />
          </div>
        </div>
      )}
    </div>
  );
}
