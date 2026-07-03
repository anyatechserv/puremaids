'use client';

import { useEffect, useState, useCallback } from 'react';
import { useCustomer } from '@/lib/customer-auth';
import { supabase } from '@/lib/supabase';
import { formatPrice } from '@/lib/booking';
import { CalendarDays, Clock, MapPin, AlertCircle, X, Check, ChevronDown, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface Booking {
  id: string; reference: string; status: string; service_type: string;
  property_size: string | null; frequency: string;
  preferred_date: string; preferred_time: string;
  address: string; postcode: string;
  base_price_pence: number; extras_price_pence: number;
  total_price_pence: number; deposit_paid: boolean; deposit_amount_pence: number;
  special_instructions: string | null; created_at: string;
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700 border-amber-200',
  confirmed: 'bg-blue-100 text-blue-700 border-blue-200',
  in_progress: 'bg-violet-100 text-violet-700 border-violet-200',
  completed: 'bg-green-100 text-green-700 border-green-200',
  cancelled: 'bg-red-100 text-red-700 border-red-200',
};

const SERVICE_LABELS: Record<string, string> = {
  domestic: 'Domestic Cleaning', deep: 'Deep Cleaning',
  end_of_tenancy: 'End of Tenancy Cleaning', office: 'Office Cleaning',
};

const TIME_LABELS: Record<string, string> = {
  morning: 'Morning (8am–12pm)', afternoon: 'Afternoon (12pm–4pm)', evening: 'Evening (4pm–6pm)',
};

const TIME_SLOTS = [
  { value: 'morning', label: 'Morning (8am–12pm)' },
  { value: 'afternoon', label: 'Afternoon (12pm–4pm)' },
  { value: 'evening', label: 'Evening (4pm–6pm)' },
];

function BookingCard({ booking, onUpdate }: {
  booking: Booking;
  onUpdate: (id: string, patch: Partial<Booking>) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [rescheduleMode, setRescheduleMode] = useState(false);
  const [cancelMode, setCancelMode] = useState(false);
  const [newDate, setNewDate] = useState(booking.preferred_date);
  const [newTime, setNewTime] = useState(booking.preferred_time);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const canModify = booking.status === 'pending' || booking.status === 'confirmed';

  const handleReschedule = async () => {
    if (!newDate || !newTime) return;
    setSaving(true); setError('');
    const { error: e } = await supabase
      .from('bookings')
      .update({ preferred_date: newDate, preferred_time: newTime })
      .eq('id', booking.id);
    if (e) { setError(e.message); setSaving(false); return; }
    onUpdate(booking.id, { preferred_date: newDate, preferred_time: newTime });
    setRescheduleMode(false);
    setSaving(false);
  };

  const handleCancel = async () => {
    setSaving(true); setError('');
    const { error: e } = await supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', booking.id);
    if (e) { setError(e.message); setSaving(false); return; }
    onUpdate(booking.id, { status: 'cancelled' });
    setCancelMode(false);
    setSaving(false);
  };

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className={cn('bg-white rounded-2xl border shadow-soft overflow-hidden', booking.status === 'cancelled' ? 'border-secondary-100 opacity-60' : 'border-secondary-100')}>
      {/* Header row */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-secondary-50/50 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="font-mono font-bold text-sm text-primary-600">{booking.reference}</span>
            <span className={cn('text-[10px] px-2 py-0.5 rounded-full font-semibold capitalize border', STATUS_COLORS[booking.status] ?? 'bg-secondary-100 text-secondary-600 border-secondary-200')}>
              {booking.status.replace('_', ' ')}
            </span>
            {booking.deposit_paid && <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200 font-semibold">Deposit Paid</span>}
          </div>
          <p className="font-semibold text-secondary-800">{SERVICE_LABELS[booking.service_type] ?? booking.service_type}</p>
          <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-secondary-400">
            <span className="flex items-center gap-1"><CalendarDays className="w-3 h-3" />{booking.preferred_date}</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{TIME_LABELS[booking.preferred_time] ?? booking.preferred_time}</span>
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{booking.postcode}</span>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="font-heading font-bold text-secondary-800">{formatPrice(booking.total_price_pence)}</p>
          {expanded ? <ChevronDown className="w-4 h-4 text-secondary-400 mt-1 ml-auto" /> : <ChevronRight className="w-4 h-4 text-secondary-400 mt-1 ml-auto" />}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-secondary-100 px-5 py-5 bg-secondary-50/40">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3 mb-4 text-sm text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0" />{error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-secondary-400 mb-2">Appointment</p>
              <p className="text-sm text-secondary-700"><strong>Date:</strong> {booking.preferred_date}</p>
              <p className="text-sm text-secondary-700"><strong>Time:</strong> {TIME_LABELS[booking.preferred_time] ?? booking.preferred_time}</p>
              <p className="text-sm text-secondary-700"><strong>Address:</strong> {booking.address}, {booking.postcode}</p>
              {booking.special_instructions && <p className="text-sm text-secondary-700 mt-1"><strong>Notes:</strong> {booking.special_instructions}</p>}
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-secondary-400 mb-2">Payment</p>
              <p className="text-sm text-secondary-700"><strong>Total:</strong> {formatPrice(booking.total_price_pence)}</p>
              <p className="text-sm text-secondary-700"><strong>Deposit:</strong> {formatPrice(booking.deposit_amount_pence)} {booking.deposit_paid ? '✅' : '⏳ pending'}</p>
              <p className="text-sm text-secondary-700"><strong>Balance due on day:</strong> {formatPrice(booking.total_price_pence - booking.deposit_amount_pence)}</p>
            </div>
          </div>

          {/* Reschedule */}
          {canModify && rescheduleMode && (
            <div className="bg-white border border-secondary-200 rounded-xl p-4 mb-4">
              <p className="font-semibold text-sm text-secondary-800 mb-3">Choose a new date & time</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <input type="date" value={newDate} min={today} onChange={(e) => setNewDate(e.target.value)}
                  className="h-10 px-3.5 rounded-xl border border-secondary-200 text-sm text-secondary-800 focus:outline-none focus:ring-2 focus:ring-primary-300 flex-1" />
                <select value={newTime} onChange={(e) => setNewTime(e.target.value)}
                  className="h-10 px-3.5 rounded-xl border border-secondary-200 text-sm text-secondary-800 focus:outline-none focus:ring-2 focus:ring-primary-300 flex-1">
                  {TIME_SLOTS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div className="flex gap-2 mt-3">
                <button onClick={handleReschedule} disabled={saving || !newDate}
                  className="flex items-center gap-1.5 px-4 py-2 bg-primary-500 text-white text-sm font-semibold rounded-xl hover:bg-primary-600 transition-colors disabled:opacity-60">
                  <Check className="w-3.5 h-3.5" />{saving ? 'Saving...' : 'Confirm Reschedule'}
                </button>
                <button onClick={() => setRescheduleMode(false)} className="px-4 py-2 border border-secondary-200 text-sm text-secondary-600 rounded-xl hover:bg-secondary-50 transition-colors">Cancel</button>
              </div>
            </div>
          )}

          {/* Cancel confirm */}
          {canModify && cancelMode && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
              <p className="font-semibold text-sm text-red-800 mb-1">Cancel this booking?</p>
              <p className="text-xs text-red-600 mb-3">This cannot be undone. Please contact us about any deposit refunds.</p>
              <div className="flex gap-2">
                <button onClick={handleCancel} disabled={saving}
                  className="px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-xl hover:bg-red-600 transition-colors disabled:opacity-60">
                  {saving ? 'Cancelling...' : 'Yes, Cancel Booking'}
                </button>
                <button onClick={() => setCancelMode(false)} className="px-4 py-2 border border-red-200 text-sm text-red-700 rounded-xl hover:bg-red-100 transition-colors">Keep Booking</button>
              </div>
            </div>
          )}

          {canModify && !rescheduleMode && !cancelMode && (
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setRescheduleMode(true)}
                className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-xl border border-primary-200 text-primary-700 hover:bg-primary-50 font-semibold transition-colors">
                <CalendarDays className="w-3.5 h-3.5" /> Reschedule
              </button>
              <button onClick={() => setCancelMode(true)}
                className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 font-semibold transition-colors">
                <X className="w-3.5 h-3.5" /> Cancel Booking
              </button>
              <Link href="/account/invoices"
                className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-xl border border-secondary-200 text-secondary-600 hover:bg-secondary-50 font-semibold transition-colors">
                Invoice
              </Link>
            </div>
          )}

          {booking.status === 'completed' && (
            <Link href="/account/reviews"
              className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-xl bg-accent-50 border border-accent-200 text-accent-700 hover:bg-accent-100 font-semibold transition-colors">
              ⭐ Leave a Review
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

export default function AccountBookingsPage() {
  const { user } = useCustomer();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_id', user.id)
      .order('preferred_date', { ascending: false });
    setBookings((data as Booking[]) ?? []);
    setLoading(false);
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const handleUpdate = (id: string, patch: Partial<Booking>) =>
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } : b)));

  const today = new Date().toISOString().slice(0, 10);
  const upcoming = bookings.filter((b) => b.status !== 'completed' && b.status !== 'cancelled' && b.preferred_date >= today);
  const past = bookings.filter((b) => b.status === 'completed' || b.status === 'cancelled' || b.preferred_date < today);
  const shown = tab === 'upcoming' ? upcoming : past;

  return (
    <div>
      <h1 className="font-heading font-extrabold text-2xl text-secondary-800 mb-1">My Bookings</h1>
      <p className="text-secondary-400 text-sm mb-6">View, reschedule, or cancel your appointments.</p>

      <div className="flex gap-1 mb-6 bg-secondary-100 p-1 rounded-xl w-fit">
        {(['upcoming', 'past'] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={cn('px-5 py-2 rounded-lg text-sm font-semibold capitalize transition-colors',
              tab === t ? 'bg-white text-secondary-800 shadow-soft' : 'text-secondary-500 hover:text-secondary-700')}>
            {t} ({t === 'upcoming' ? upcoming.length : past.length})
          </button>
        ))}
      </div>

      {loading
        ? <div className="space-y-3">{Array.from({ length: 2 }).map((_, i) => <div key={i} className="h-24 bg-white rounded-2xl border border-secondary-100 animate-pulse" />)}</div>
        : shown.length === 0
        ? (
          <div className="bg-white rounded-2xl border border-secondary-100 p-12 text-center shadow-soft">
            <CalendarDays className="w-10 h-10 text-secondary-200 mx-auto mb-3" />
            <p className="font-semibold text-secondary-600 mb-1">No {tab} bookings</p>
            <p className="text-secondary-400 text-sm mb-5">
              {tab === 'upcoming' ? 'Ready for a fresh start?' : 'Your completed bookings will appear here.'}
            </p>
            {tab === 'upcoming' && (
              <Link href="/book-online" className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-500 text-white font-semibold rounded-xl text-sm hover:bg-primary-600 transition-colors">
                Book a Clean
              </Link>
            )}
          </div>
        )
        : (
          <div className="space-y-3">
            {shown.map((b) => <BookingCard key={b.id} booking={b} onUpdate={handleUpdate} />)}
          </div>
        )}
    </div>
  );
}
