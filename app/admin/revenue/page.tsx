'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { formatPrice } from '@/lib/booking';
import { Download, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Booking {
  status: string; total_price_pence: number; deposit_amount_pence: number;
  deposit_paid: boolean; service_type: string; created_at: string; preferred_date: string;
}

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const SERVICE_LABELS: Record<string, string> = {
  domestic: 'Domestic', deep: 'Deep Clean', end_of_tenancy: 'End of Tenancy', office: 'Office',
};

export default function AdminRevenuePage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'3m' | '6m' | '12m'>('6m');

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('bookings')
      .select('status, total_price_pence, deposit_amount_pence, deposit_paid, service_type, created_at, preferred_date')
      .order('created_at', { ascending: true });
    if (data) setBookings(data as Booking[]);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const periodMonths = period === '3m' ? 3 : period === '6m' ? 6 : 12;

  const monthlyData = useMemo(() => {
    const now = new Date();
    const result: { label: string; revenue: number; bookings: number }[] = [];
    for (let i = periodMonths - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const monthBookings = bookings.filter((b) => b.created_at?.startsWith(ym) && b.status !== 'cancelled');
      result.push({
        label: `${MONTHS[d.getMonth()]} ${d.getFullYear() !== now.getFullYear() ? d.getFullYear() : ''}`.trim(),
        revenue: monthBookings.reduce((s, b) => s + b.total_price_pence, 0),
        bookings: monthBookings.length,
      });
    }
    return result;
  }, [bookings, periodMonths]);

  const maxRevenue = Math.max(...monthlyData.map((m) => m.revenue), 1);

  const active = bookings.filter((b) => b.status !== 'cancelled');
  const totalRevenue = active.reduce((s, b) => s + b.total_price_pence, 0);
  const depositCollected = bookings.filter((b) => b.deposit_paid).reduce((s, b) => s + b.deposit_amount_pence, 0);

  const serviceBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    for (const b of active) {
      map[b.service_type] = (map[b.service_type] ?? 0) + b.total_price_pence;
    }
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [active]);

  const currentMonthRevenue = monthlyData[monthlyData.length - 1]?.revenue ?? 0;
  const prevMonthRevenue = monthlyData[monthlyData.length - 2]?.revenue ?? 0;
  const trend = prevMonthRevenue ? ((currentMonthRevenue - prevMonthRevenue) / prevMonthRevenue) * 100 : 0;

  const exportCSV = () => {
    const header = ['Month', 'Revenue (£)', 'Bookings'];
    const rows = monthlyData.map((m) => [m.label, (m.revenue / 100).toFixed(2), m.bookings]);
    const csv = [header, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `revenue-${period}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 md:p-8 max-w-screen-xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-secondary-800">Revenue</h1>
          <p className="text-secondary-400 text-sm">Financial overview and trends</p>
        </div>
        <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-secondary-200 bg-white text-sm font-semibold text-secondary-600 hover:bg-secondary-50 transition-colors">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-7">
        {[
          { label: 'Total Revenue', value: formatPrice(totalRevenue), sub: 'All time', color: 'text-primary-600' },
          { label: 'This Month', value: formatPrice(currentMonthRevenue), sub: `${trend >= 0 ? '+' : ''}${trend.toFixed(1)}% vs last month`, color: 'text-secondary-800' },
          { label: 'Deposits Collected', value: formatPrice(depositCollected), sub: 'Stripe payments', color: 'text-green-600' },
          { label: 'Active Bookings', value: active.length, sub: 'Excluding cancelled', color: 'text-blue-600' },
        ].map((k) => (
          <div key={k.label} className="bg-white rounded-2xl border border-secondary-100 p-5 shadow-soft">
            <p className="text-xs font-semibold text-secondary-400 uppercase tracking-wider mb-2">{k.label}</p>
            <p className={cn('font-heading font-extrabold text-2xl mb-1', k.color)}>{k.value}</p>
            <p className="text-xs text-secondary-400">{k.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-secondary-100 shadow-soft p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-heading font-bold text-secondary-800">Monthly Revenue</h2>
            <div className="flex gap-1">
              {(['3m', '6m', '12m'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={cn('px-3 py-1 rounded-lg text-xs font-semibold transition-colors', period === p ? 'bg-primary-500 text-white' : 'text-secondary-500 hover:bg-secondary-100')}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {loading
            ? <div className="h-48 flex items-center justify-center text-secondary-400 text-sm">Loading...</div>
            : (
              <div className="flex items-end gap-2 h-48">
                {monthlyData.map((m, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                    <div className="text-xs font-bold text-secondary-600 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {formatPrice(m.revenue)}
                    </div>
                    <div
                      className="w-full bg-primary-500 hover:bg-primary-400 rounded-t-lg transition-all"
                      style={{ height: `${Math.max((m.revenue / maxRevenue) * 160, 4)}px` }}
                      title={`${m.label}: ${formatPrice(m.revenue)}`}
                    />
                    <p className="text-[10px] text-secondary-400 font-medium text-center">{m.label}</p>
                  </div>
                ))}
              </div>
            )}

          <div className="flex items-center gap-1.5 mt-4 text-sm">
            {trend >= 0
              ? <TrendingUp className="w-4 h-4 text-green-500" />
              : <TrendingDown className="w-4 h-4 text-red-500" />}
            <span className={cn('font-semibold', trend >= 0 ? 'text-green-600' : 'text-red-600')}>
              {trend >= 0 ? '+' : ''}{trend.toFixed(1)}%
            </span>
            <span className="text-secondary-400 text-xs">vs previous month</span>
          </div>
        </div>

        {/* Service breakdown */}
        <div className="bg-white rounded-2xl border border-secondary-100 shadow-soft p-5">
          <h2 className="font-heading font-bold text-secondary-800 mb-5">By Service</h2>
          {loading
            ? <div className="text-center text-secondary-400 text-sm py-8">Loading...</div>
            : serviceBreakdown.length === 0
            ? <p className="text-secondary-400 text-sm text-center py-8">No data yet</p>
            : (
              <div className="space-y-4">
                {serviceBreakdown.map(([svc, rev]) => (
                  <div key={svc}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="font-medium text-secondary-700">{SERVICE_LABELS[svc] ?? svc}</span>
                      <span className="font-bold text-secondary-800">{formatPrice(rev)}</span>
                    </div>
                    <div className="h-2 bg-secondary-100 rounded-full overflow-hidden">
                      <div className="h-full bg-primary-500 rounded-full" style={{ width: `${(rev / totalRevenue) * 100}%` }} />
                    </div>
                    <p className="text-xs text-secondary-400 mt-0.5">{((rev / totalRevenue) * 100).toFixed(1)}% of total</p>
                  </div>
                ))}
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
