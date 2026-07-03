'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Search, Mail, Phone, MapPin, Calendar, ClipboardList } from 'lucide-react';
import { formatPrice } from '@/lib/booking';
import { cn } from '@/lib/utils';

interface Customer {
  email: string; first_name: string; last_name: string; phone: string;
  bookings_count: number; total_spent: number; latest_date: string;
  statuses: string[];
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Customer | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('bookings')
      .select('email, first_name, last_name, phone, status, total_price_pence, preferred_date');
    if (data) {
      const map: Record<string, Customer> = {};
      for (const b of data as { email: string; first_name: string; last_name: string; phone: string; status: string; total_price_pence: number; preferred_date: string }[]) {
        if (!map[b.email]) {
          map[b.email] = { email: b.email, first_name: b.first_name, last_name: b.last_name, phone: b.phone, bookings_count: 0, total_spent: 0, latest_date: '', statuses: [] };
        }
        const c = map[b.email];
        c.bookings_count++;
        if (b.status !== 'cancelled') c.total_spent += b.total_price_pence;
        if (!c.statuses.includes(b.status)) c.statuses.push(b.status);
        if (!c.latest_date || b.preferred_date > c.latest_date) c.latest_date = b.preferred_date;
      }
      setCustomers(Object.values(map).sort((a, b) => b.total_spent - a.total_spent));
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = customers.filter((c) => {
    const q = search.toLowerCase();
    return !q || [c.first_name, c.last_name, c.email, c.phone].some((v) => v?.toLowerCase().includes(q));
  });

  return (
    <div className="p-6 md:p-8 max-w-screen-xl mx-auto">
      <div className="mb-6">
        <h1 className="font-heading font-extrabold text-2xl text-secondary-800">Customers</h1>
        <p className="text-secondary-400 text-sm">All unique customers from bookings</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Customers', value: customers.length },
          { label: 'Repeat Customers', value: customers.filter((c) => c.bookings_count > 1).length },
          { label: 'Total Revenue', value: formatPrice(customers.reduce((s, c) => s + c.total_spent, 0)) },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-secondary-100 p-5 shadow-soft">
            <p className="text-xs font-semibold text-secondary-400 uppercase tracking-wider mb-1">{s.label}</p>
            <p className="font-heading font-extrabold text-2xl text-secondary-800">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-secondary-100 shadow-soft overflow-hidden">
        <div className="p-4 border-b border-secondary-100">
          <div className="relative max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
            <input
              type="text" placeholder="Search customers..."
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
                    {['Customer','Email','Phone','Bookings','Total Spent','Last Booking'].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-secondary-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0
                    ? <tr><td colSpan={6} className="text-center py-12 text-secondary-400 text-sm">No customers found</td></tr>
                    : filtered.map((c) => (
                        <tr
                          key={c.email}
                          onClick={() => setSelected(selected?.email === c.email ? null : c)}
                          className="border-b border-secondary-50 hover:bg-secondary-50/50 cursor-pointer transition-colors"
                        >
                          <td className="px-4 py-3.5">
                            <p className="font-semibold text-sm text-secondary-800">{c.first_name} {c.last_name}</p>
                            {c.bookings_count > 1 && <span className="text-[10px] bg-primary-50 text-primary-600 font-semibold px-1.5 py-0.5 rounded-full">Repeat</span>}
                          </td>
                          <td className="px-4 py-3.5 text-sm text-secondary-600">{c.email}</td>
                          <td className="px-4 py-3.5 text-sm text-secondary-600">{c.phone}</td>
                          <td className="px-4 py-3.5">
                            <span className="inline-flex items-center justify-center w-7 h-7 bg-secondary-100 rounded-full text-xs font-bold text-secondary-700">{c.bookings_count}</span>
                          </td>
                          <td className="px-4 py-3.5 font-heading font-bold text-sm text-primary-600">{formatPrice(c.total_spent)}</td>
                          <td className="px-4 py-3.5 text-sm text-secondary-500">{c.latest_date}</td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          )}
      </div>

      {/* Customer detail panel */}
      {selected && (
        <div className="fixed inset-y-0 right-0 w-80 bg-white border-l border-secondary-100 shadow-2xl z-40 overflow-y-auto">
          <div className="p-5 border-b border-secondary-100 flex items-center justify-between">
            <h2 className="font-heading font-bold text-secondary-800">Customer Profile</h2>
            <button onClick={() => setSelected(null)} className="text-secondary-400 hover:text-secondary-600 text-xl font-bold">&times;</button>
          </div>
          <div className="p-5 space-y-4">
            <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center">
              <span className="font-heading font-black text-primary-600 text-lg">{selected.first_name[0]}{selected.last_name[0]}</span>
            </div>
            <div>
              <h3 className="font-heading font-bold text-xl text-secondary-800">{selected.first_name} {selected.last_name}</h3>
              {selected.bookings_count > 1 && <span className="text-xs bg-primary-50 text-primary-600 font-semibold px-2 py-0.5 rounded-full">Repeat Customer</span>}
            </div>
            <div className="space-y-2 text-sm text-secondary-600">
              <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-secondary-400" />{selected.email}</p>
              <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-secondary-400" />{selected.phone}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-secondary-50 rounded-xl p-3 text-center">
                <p className="font-heading font-extrabold text-xl text-secondary-800">{selected.bookings_count}</p>
                <p className="text-xs text-secondary-400">Bookings</p>
              </div>
              <div className="bg-primary-50 rounded-xl p-3 text-center">
                <p className="font-heading font-extrabold text-lg text-primary-600">{formatPrice(selected.total_spent)}</p>
                <p className="text-xs text-secondary-400">Total Spent</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <p className="flex items-center gap-2 text-secondary-600"><Calendar className="w-4 h-4 text-secondary-400" />Last booking: {selected.latest_date}</p>
            </div>
            <div className="flex gap-2">
              <a href={`mailto:${selected.email}`} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-primary-500 text-white text-xs font-semibold rounded-xl hover:bg-primary-600 transition-colors">
                <Mail className="w-3 h-3" />Email
              </a>
              <a href={`tel:${selected.phone}`} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-secondary-200 text-secondary-700 text-xs font-semibold rounded-xl hover:bg-secondary-50 transition-colors">
                <Phone className="w-3 h-3" />Call
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
