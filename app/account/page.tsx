'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useCustomer } from '@/lib/customer-auth';
import { supabase } from '@/lib/supabase';
import { formatPrice } from '@/lib/booking';
import {
  CalendarDays, FileText, MapPin, Star, Gift,
  ArrowRight, CheckCircle, Clock, Pencil, Save, X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Booking {
  reference: string; status: string; service_type: string;
  preferred_date: string; total_price_pence: number;
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-violet-100 text-violet-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const SERVICE_LABELS: Record<string, string> = {
  domestic: 'Domestic', deep: 'Deep Clean',
  end_of_tenancy: 'End of Tenancy', office: 'Office',
};

export default function AccountPage() {
  const { user, profile, refreshProfile } = useCustomer();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState(profile?.full_name ?? '');
  const [phone, setPhone] = useState(profile?.phone ?? '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name);
      setPhone(profile.phone ?? '');
    }
  }, [profile]);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from('bookings')
      .select('reference, status, service_type, preferred_date, total_price_pence')
      .eq('user_id', user.id)
      .order('preferred_date', { ascending: false })
      .limit(4);
    setBookings((data as Booking[]) ?? []);
    setLoading(false);
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    await supabase
      .from('customer_profiles')
      .update({ full_name: fullName, phone: phone || null })
      .eq('user_id', user.id);
    await refreshProfile();
    setSaving(false);
    setEditing(false);
  };

  const upcoming = bookings.filter((b) => b.status !== 'completed' && b.status !== 'cancelled');
  const totalSpent = bookings.filter((b) => b.status !== 'cancelled').reduce((s, b) => s + b.total_price_pence, 0);

  const quickLinks = [
    { href: '/account/bookings',  label: 'My Bookings',    sub: 'View & manage appointments', icon: CalendarDays },
    { href: '/account/addresses', label: 'Saved Addresses', sub: 'Manage your property addresses', icon: MapPin },
    { href: '/account/invoices',  label: 'Invoices',        sub: 'Download booking invoices',   icon: FileText    },
    { href: '/account/reviews',   label: 'My Reviews',      sub: 'Leave feedback on cleanings', icon: Star        },
    { href: '/account/refer',     label: 'Refer a Friend',  sub: 'Earn rewards for referrals',  icon: Gift        },
  ];

  return (
    <div>
      <h1 className="font-heading font-extrabold text-2xl text-secondary-800 mb-1">
        Hello, {profile?.full_name?.split(' ')[0] || 'there'} 👋
      </h1>
      <p className="text-secondary-400 text-sm mb-7">Here&apos;s your account overview.</p>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-7">
        {[
          { label: 'Bookings', value: bookings.length, icon: CalendarDays, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Upcoming', value: upcoming.length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Total Spent', value: formatPrice(totalSpent), icon: CheckCircle, color: 'text-primary-600', bg: 'bg-primary-50' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl border border-secondary-100 p-5 shadow-soft">
            <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center mb-3', bg)}>
              <Icon className={cn('w-4 h-4', color)} />
            </div>
            <p className={cn('font-heading font-extrabold text-2xl leading-none mb-1', color)}>{value}</p>
            <p className="text-xs text-secondary-400 font-medium">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Profile card */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-secondary-100 shadow-soft p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-heading font-bold text-secondary-800">Profile</h2>
            {!editing
              ? <button onClick={() => setEditing(true)} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-secondary-200 text-secondary-500 hover:bg-secondary-50 transition-colors">
                  <Pencil className="w-3 h-3" /> Edit
                </button>
              : <div className="flex gap-2">
                  <button onClick={() => { setEditing(false); setFullName(profile?.full_name ?? ''); setPhone(profile?.phone ?? ''); }}
                    className="p-1.5 rounded-lg border border-secondary-200 text-secondary-400 hover:bg-secondary-50">
                    <X className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={handleSave} disabled={saving}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-primary-500 text-white hover:bg-primary-600 transition-colors disabled:opacity-60">
                    <Save className="w-3 h-3" /> {saving ? 'Saving...' : 'Save'}
                  </button>
                </div>}
          </div>
          <div className="space-y-4">
            {editing
              ? <>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-secondary-400 mb-1.5 block">Full Name</label>
                    <input value={fullName} onChange={(e) => setFullName(e.target.value)}
                      className="w-full h-10 px-3.5 rounded-xl border border-secondary-200 text-sm text-secondary-800 focus:outline-none focus:ring-2 focus:ring-primary-300" />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-secondary-400 mb-1.5 block">Phone</label>
                    <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+44 7700 000000"
                      className="w-full h-10 px-3.5 rounded-xl border border-secondary-200 text-sm text-secondary-800 focus:outline-none focus:ring-2 focus:ring-primary-300" />
                  </div>
                </>
              : <>
                  <div>
                    <p className="text-xs font-semibold text-secondary-400 mb-0.5">Full Name</p>
                    <p className="font-semibold text-secondary-800">{profile?.full_name || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-secondary-400 mb-0.5">Email</p>
                    <p className="text-secondary-700 text-sm">{user?.email}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-secondary-400 mb-0.5">Phone</p>
                    <p className="text-secondary-700 text-sm">{profile?.phone || '—'}</p>
                  </div>
                </>}
          </div>
        </div>

        {/* Quick links */}
        <div className="lg:col-span-3 space-y-3">
          <h2 className="font-heading font-bold text-secondary-800">Quick Access</h2>
          {quickLinks.map(({ href, label, sub, icon: Icon }) => (
            <Link key={href} href={href}
              className="flex items-center gap-4 bg-white rounded-2xl border border-secondary-100 p-4 shadow-soft hover:shadow-md hover:border-primary-100 transition-all group">
              <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-primary-100 transition-colors">
                <Icon className="w-4 h-4 text-primary-600" />
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

      {/* Recent bookings */}
      {bookings.length > 0 && (
        <div className="mt-7 bg-white rounded-2xl border border-secondary-100 shadow-soft overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-secondary-100">
            <h2 className="font-heading font-bold text-secondary-800">Recent Bookings</h2>
            <Link href="/account/bookings" className="text-xs text-primary-500 hover:text-primary-700 flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-secondary-50">
            {loading
              ? Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="px-5 py-4 flex gap-4">
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 bg-secondary-100 rounded w-28 animate-pulse" />
                      <div className="h-3 bg-secondary-100 rounded w-48 animate-pulse" />
                    </div>
                  </div>
                ))
              : bookings.map((b) => (
                  <div key={b.reference} className="px-5 py-4 flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-mono font-bold text-xs text-primary-600">{b.reference}</span>
                        <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full font-semibold capitalize', STATUS_COLORS[b.status] ?? 'bg-secondary-100 text-secondary-600')}>
                          {b.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-sm text-secondary-700">{SERVICE_LABELS[b.service_type] ?? b.service_type} · {b.preferred_date}</p>
                    </div>
                    <p className="font-heading font-bold text-sm text-secondary-800">{formatPrice(b.total_price_pence)}</p>
                  </div>
                ))}
          </div>
        </div>
      )}
    </div>
  );
}
