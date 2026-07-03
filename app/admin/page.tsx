'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { formatPrice } from '@/lib/booking';
import {
  TrendingUp,
  ClipboardList,
  Clock,
  CheckCircle,
  Users,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface StatRow {
  status: string;
  count: number;
  total_pence: number;
}

interface RecentBooking {
  reference: string;
  first_name: string;
  last_name: string;
  service_type: string;
  preferred_date: string;
  total_price_pence: number;
  status: string;
  created_at: string;
}

const STATUS_COLORS: Record<string, string> = {
  pending:     'bg-amber-100 text-amber-700',
  confirmed:   'bg-blue-100 text-blue-700',
  in_progress: 'bg-violet-100 text-violet-700',
  completed:   'bg-green-100 text-green-700',
  cancelled:   'bg-red-100 text-red-700',
};

const SERVICE_LABELS: Record<string, string> = {
  domestic: 'Domestic',
  deep: 'Deep Clean',
  end_of_tenancy: 'End of Tenancy',
  office: 'Office',
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<StatRow[]>([]);
  const [recent, setRecent] = useState<RecentBooking[]>([]);
  const [customerCount, setCustomerCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const [bookingsRes, recentRes, customersRes] = await Promise.all([
      supabase.from('bookings').select('status, total_price_pence'),
      supabase
        .from('bookings')
        .select('reference, first_name, last_name, service_type, preferred_date, total_price_pence, status, created_at')
        .order('created_at', { ascending: false })
        .limit(6),
      supabase.from('bookings').select('email', { count: 'exact', head: false }),
    ]);

    if (bookingsRes.data) {
      const grouped: Record<string, StatRow> = {};
      for (const b of bookingsRes.data as { status: string; total_price_pence: number }[]) {
        if (!grouped[b.status]) grouped[b.status] = { status: b.status, count: 0, total_pence: 0 };
        grouped[b.status].count++;
        grouped[b.status].total_pence += b.total_price_pence;
      }
      setStats(Object.values(grouped));
    }
    if (recentRes.data) setRecent(recentRes.data as RecentBooking[]);
    if (customersRes.data) {
      const unique = new Set((customersRes.data as { email: string }[]).map((r) => r.email));
      setCustomerCount(unique.size);
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const total = stats.reduce((s, r) => s + r.count, 0);
  const revenue = stats.filter((r) => r.status !== 'cancelled').reduce((s, r) => s + r.total_pence, 0);
  const pending = stats.find((r) => r.status === 'pending')?.count ?? 0;
  const confirmed = stats.find((r) => r.status === 'confirmed')?.count ?? 0;

  const kpis = [
    { label: 'Total Revenue',   value: formatPrice(revenue), icon: TrendingUp,    color: 'text-primary-600', bg: 'bg-primary-50'   },
    { label: 'Total Bookings',  value: total,                icon: ClipboardList,  color: 'text-blue-600',   bg: 'bg-blue-50'      },
    { label: 'Pending',         value: pending,              icon: Clock,          color: 'text-amber-600',  bg: 'bg-amber-50'     },
    { label: 'Confirmed',       value: confirmed,            icon: CheckCircle,    color: 'text-green-600',  bg: 'bg-green-50'     },
    { label: 'Customers',       value: customerCount,        icon: Users,          color: 'text-violet-600', bg: 'bg-violet-50'    },
  ];

  return (
    <div className="p-6 md:p-8 max-w-screen-xl mx-auto">
      <div className="mb-7">
        <h1 className="font-heading font-extrabold text-2xl text-secondary-800">Dashboard</h1>
        <p className="text-secondary-400 text-sm">Welcome back. Here&apos;s your overview.</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {kpis.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl border border-secondary-100 p-5 shadow-soft">
            <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center mb-3', bg)}>
              <Icon className={cn('w-4.5 h-4.5', color)} />
            </div>
            <p className={cn('font-heading font-extrabold text-2xl leading-none mb-1', color)}>
              {loading ? <span className="block w-16 h-7 bg-secondary-100 rounded animate-pulse" /> : value}
            </p>
            <p className="text-xs text-secondary-400 font-medium">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent bookings */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-secondary-100 shadow-soft overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-secondary-100">
            <h2 className="font-heading font-bold text-secondary-800">Recent Bookings</h2>
            <Link href="/admin/bookings" className="text-xs text-primary-500 hover:text-primary-700 flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-secondary-50">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="px-5 py-4 flex items-center gap-4">
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 bg-secondary-100 rounded w-32 animate-pulse" />
                      <div className="h-3 bg-secondary-100 rounded w-48 animate-pulse" />
                    </div>
                  </div>
                ))
              : recent.map((b) => (
                  <div key={b.reference} className="px-5 py-4 flex items-center gap-4 hover:bg-secondary-50/50">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-mono font-bold text-xs text-primary-600">{b.reference}</span>
                        <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full font-semibold capitalize', STATUS_COLORS[b.status] ?? 'bg-secondary-100 text-secondary-600')}>
                          {b.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-sm text-secondary-700 truncate">
                        {b.first_name} {b.last_name} · {SERVICE_LABELS[b.service_type] ?? b.service_type}
                      </p>
                      <p className="text-xs text-secondary-400">{b.preferred_date}</p>
                    </div>
                    <p className="font-heading font-bold text-sm text-secondary-800 shrink-0">{formatPrice(b.total_price_pence)}</p>
                  </div>
                ))}
          </div>
        </div>

        {/* Quick links */}
        <div className="space-y-3">
          <h2 className="font-heading font-bold text-secondary-800 px-1">Quick Actions</h2>
          {[
            { href: '/admin/bookings',  label: 'Manage Bookings',    sub: 'Update status, assign cleaners',  icon: ClipboardList },
            { href: '/admin/calendar',  label: 'Calendar View',      sub: 'See bookings by date',            icon: Sparkles      },
            { href: '/admin/revenue',   label: 'Revenue Report',     sub: 'Charts & export CSV',             icon: TrendingUp    },
            { href: '/admin/invoices',  label: 'Generate Invoices',  sub: 'Create & send PDF invoices',      icon: ClipboardList },
          ].map(({ href, label, sub, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-4 bg-white rounded-2xl border border-secondary-100 p-4 shadow-soft hover:shadow-md hover:border-primary-100 transition-all group"
            >
              <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-primary-100 transition-colors">
                <Icon className="w-4.5 h-4.5 text-primary-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-secondary-800">{label}</p>
                <p className="text-xs text-secondary-400 truncate">{sub}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-secondary-300 group-hover:text-primary-500 transition-colors" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
