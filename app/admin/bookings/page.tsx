'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Search, Filter, RefreshCw, CheckCircle, Clock, XCircle, AlertCircle,
  ChevronDown, ChevronRight, Calendar, Phone, Mail, MapPin, Sparkles,
  Download, UserCheck, MessageSquare, Send,
} from 'lucide-react';
import { formatPrice } from '@/lib/booking';
import { cn } from '@/lib/utils';

type Status = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

interface BookingExtra { name: string; price_pence: number; }
interface Cleaner { id: string; full_name: string; }

interface Booking {
  id: string; reference: string; status: Status; service_type: string;
  property_size: string | null; frequency: string; preferred_date: string;
  preferred_time: string; address: string; postcode: string;
  first_name: string; last_name: string; email: string; phone: string;
  special_instructions: string | null; internal_notes: string | null;
  base_price_pence: number; extras_price_pence: number; total_price_pence: number;
  deposit_paid: boolean; deposit_amount_pence: number;
  assigned_cleaner_id: string | null; created_at: string;
  booking_extras: BookingExtra[];
}

const STATUS_CONFIG: Record<Status, { label: string; icon: React.ComponentType<{ className?: string }>; bg: string; text: string; border: string }> = {
  pending:     { label: 'Pending',     icon: Clock,       bg: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-200'  },
  confirmed:   { label: 'Confirmed',   icon: CheckCircle, bg: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-200'   },
  in_progress: { label: 'In Progress', icon: Sparkles,    bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200' },
  completed:   { label: 'Completed',   icon: CheckCircle, bg: 'bg-green-50',  text: 'text-green-700',  border: 'border-green-200'  },
  cancelled:   { label: 'Cancelled',   icon: XCircle,     bg: 'bg-red-50',    text: 'text-red-700',    border: 'border-red-200'    },
};

const SERVICE_LABELS: Record<string, string> = {
  domestic: 'Domestic', deep: 'Deep Clean', end_of_tenancy: 'End of Tenancy', office: 'Office',
};
const TIME_LABELS: Record<string, string> = {
  morning: 'Morning (8am–12pm)', afternoon: 'Afternoon (12pm–4pm)', evening: 'Evening (4pm–6pm)',
};

function StatusBadge({ status }: { status: Status }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  const Icon = cfg.icon;
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border', cfg.bg, cfg.text, cfg.border)}>
      <Icon className="w-3 h-3" />{cfg.label}
    </span>
  );
}

function BookingRow({ booking, onStatusChange, onUpdate, cleaners }: {
  booking: Booking;
  onStatusChange: (id: string, s: Status) => void;
  onUpdate: (id: string, patch: Partial<Booking>) => void;
  cleaners: Cleaner[];
}) {
  const [expanded, setExpanded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sendingReminder, setSendingReminder] = useState(false);
  const [notes, setNotes] = useState(booking.internal_notes ?? '');
  const [reminderMsg, setReminderMsg] = useState('');

  const handleStatus = async (newStatus: Status) => {
    setSaving(true);
    onStatusChange(booking.id, newStatus);
    await supabase.from('bookings').update({ status: newStatus }).eq('id', booking.id);
    setSaving(false);
  };

  const handleCleanerAssign = async (cleanerId: string) => {
    setSaving(true);
    const val = cleanerId || null;
    onUpdate(booking.id, { assigned_cleaner_id: val });
    await supabase.from('bookings').update({ assigned_cleaner_id: val }).eq('id', booking.id);
    setSaving(false);
  };

  const handleSaveNotes = async () => {
    setSaving(true);
    await supabase.from('bookings').update({ internal_notes: notes }).eq('id', booking.id);
    onUpdate(booking.id, { internal_notes: notes });
    setSaving(false);
  };

  const handleSendReminder = async () => {
    setSendingReminder(true);
    setReminderMsg('');
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    try {
      const res = await fetch(`${supabaseUrl}/functions/v1/send-reminder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${supabaseAnonKey}` },
        body: JSON.stringify({ bookingId: booking.id }),
      });
      const json = await res.json();
      setReminderMsg(json.error ? `Error: ${json.error}` : 'Reminder sent!');
    } catch {
      setReminderMsg('Failed to send reminder.');
    }
    setSendingReminder(false);
  };

  const assignedCleaner = cleaners.find((c) => c.id === booking.assigned_cleaner_id);

  return (
    <>
      <tr className="border-b border-secondary-50 hover:bg-secondary-50/50 cursor-pointer transition-colors" onClick={() => setExpanded((v) => !v)}>
        <td className="py-3.5 px-4">
          <div className="flex items-center gap-2">
            {expanded ? <ChevronDown className="w-3.5 h-3.5 text-secondary-400 shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 text-secondary-400 shrink-0" />}
            <span className="font-mono font-bold text-sm text-primary-600">{booking.reference}</span>
          </div>
        </td>
        <td className="py-3.5 px-4">
          <p className="font-semibold text-sm text-secondary-800">{booking.first_name} {booking.last_name}</p>
          <p className="text-xs text-secondary-400">{booking.email}</p>
        </td>
        <td className="py-3.5 px-4 hidden md:table-cell">
          <p className="text-sm text-secondary-700">{SERVICE_LABELS[booking.service_type] ?? booking.service_type}</p>
          <p className="text-xs text-secondary-400">{booking.postcode}</p>
        </td>
        <td className="py-3.5 px-4 hidden lg:table-cell">
          <p className="text-sm text-secondary-700">{booking.preferred_date}</p>
          <p className="text-xs text-secondary-400">{TIME_LABELS[booking.preferred_time] ?? booking.preferred_time}</p>
        </td>
        <td className="py-3.5 px-4 hidden lg:table-cell">
          {assignedCleaner
            ? <span className="text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-1 rounded-full font-semibold">{assignedCleaner.full_name}</span>
            : <span className="text-xs text-secondary-400 italic">Unassigned</span>}
        </td>
        <td className="py-3.5 px-4 hidden lg:table-cell">
          <span className="font-heading font-bold text-secondary-800">{formatPrice(booking.total_price_pence)}</span>
          {booking.deposit_paid && <p className="text-[10px] text-green-600 font-semibold mt-0.5">Deposit paid</p>}
        </td>
        <td className="py-3.5 px-4"><StatusBadge status={booking.status} /></td>
      </tr>

      {expanded && (
        <tr className="bg-secondary-50/70">
          <td colSpan={7} className="px-6 py-5">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
              {/* Contact */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-secondary-500 mb-3">Contact</h4>
                <div className="space-y-1.5 text-sm">
                  <p className="flex items-center gap-2 text-secondary-600"><Phone className="w-3.5 h-3.5 text-secondary-400" />{booking.phone}</p>
                  <p className="flex items-center gap-2 text-secondary-600"><Mail className="w-3.5 h-3.5 text-secondary-400" />{booking.email}</p>
                  <p className="flex items-start gap-2 text-secondary-600"><MapPin className="w-3.5 h-3.5 text-secondary-400 mt-0.5 shrink-0" />{booking.address}, {booking.postcode}</p>
                </div>
                {/* Reminder */}
                <div className="mt-4">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleSendReminder(); }}
                    disabled={sendingReminder}
                    className="flex items-center gap-2 text-xs px-3 py-2 bg-primary-50 hover:bg-primary-100 text-primary-700 font-semibold rounded-lg transition-colors disabled:opacity-60"
                  >
                    <Send className="w-3 h-3" />
                    {sendingReminder ? 'Sending...' : 'Send Email Reminder'}
                  </button>
                  {reminderMsg && <p className="text-xs mt-1.5 text-secondary-500">{reminderMsg}</p>}
                </div>
              </div>

              {/* Service + Status */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-secondary-500 mb-3">Update Status</h4>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {(Object.keys(STATUS_CONFIG) as Status[]).map((s) => (
                    <button
                      key={s}
                      onClick={(e) => { e.stopPropagation(); handleStatus(s); }}
                      disabled={booking.status === s || saving}
                      className={cn(
                        'px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all',
                        booking.status === s
                          ? `${STATUS_CONFIG[s].bg} ${STATUS_CONFIG[s].text} ${STATUS_CONFIG[s].border} cursor-default`
                          : 'border-secondary-200 text-secondary-600 hover:border-secondary-300 bg-white',
                      )}
                    >
                      {STATUS_CONFIG[s].label}
                    </button>
                  ))}
                </div>
                <div className="text-sm space-y-1 text-secondary-600">
                  <p><strong>Total:</strong> <span className="text-primary-600 font-bold">{formatPrice(booking.total_price_pence)}</span></p>
                  <p><strong>Deposit:</strong> {formatPrice(booking.deposit_amount_pence)} {booking.deposit_paid ? '✅' : '⏳'}</p>
                  {booking.booking_extras?.length > 0 && (
                    <p><strong>Extras:</strong> {booking.booking_extras.map((e) => e.name).join(', ')}</p>
                  )}
                </div>
              </div>

              {/* Assign cleaner */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-secondary-500 mb-3">
                  <span className="flex items-center gap-1.5"><UserCheck className="w-3 h-3" />Assign Cleaner</span>
                </h4>
                <select
                  value={booking.assigned_cleaner_id ?? ''}
                  onChange={(e) => { e.stopPropagation(); handleCleanerAssign(e.target.value); }}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full h-9 px-3 rounded-lg border border-secondary-200 bg-white text-sm text-secondary-700 focus:outline-none focus:ring-2 focus:ring-primary-300"
                >
                  <option value="">— Unassigned —</option>
                  {cleaners.map((c) => (
                    <option key={c.id} value={c.id}>{c.full_name}</option>
                  ))}
                </select>
                {booking.special_instructions && (
                  <div className="mt-3">
                    <p className="text-xs font-semibold text-secondary-500 mb-1">Customer Notes</p>
                    <p className="text-xs text-secondary-600 bg-white border border-secondary-100 rounded-lg p-2">{booking.special_instructions}</p>
                  </div>
                )}
              </div>

              {/* Internal notes */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-secondary-500 mb-3">
                  <span className="flex items-center gap-1.5"><MessageSquare className="w-3 h-3" />Internal Notes</span>
                </h4>
                <textarea
                  value={notes}
                  onChange={(e) => { e.stopPropagation(); setNotes(e.target.value); }}
                  onClick={(e) => e.stopPropagation()}
                  rows={4}
                  className="w-full px-3 py-2 rounded-lg border border-secondary-200 bg-white text-sm text-secondary-700 resize-none focus:outline-none focus:ring-2 focus:ring-primary-300"
                  placeholder="Admin notes (not visible to customer)..."
                />
                <button
                  onClick={(e) => { e.stopPropagation(); handleSaveNotes(); }}
                  disabled={saving}
                  className="mt-2 text-xs px-3 py-1.5 bg-secondary-800 text-white rounded-lg hover:bg-secondary-700 transition-colors disabled:opacity-60"
                >
                  {saving ? 'Saving...' : 'Save Notes'}
                </button>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function exportCSV(bookings: Booking[]) {
  const header = ['Reference','First Name','Last Name','Email','Phone','Service','Postcode','Date','Time','Total','Deposit Paid','Status','Created'];
  const rows = bookings.map((b) => [
    b.reference, b.first_name, b.last_name, b.email, b.phone,
    SERVICE_LABELS[b.service_type] ?? b.service_type, b.postcode,
    b.preferred_date, b.preferred_time,
    (b.total_price_pence / 100).toFixed(2), b.deposit_paid ? 'Yes' : 'No',
    b.status, new Date(b.created_at).toLocaleDateString('en-GB'),
  ]);
  const csv = [header, ...rows].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `puremaids-bookings-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click(); URL.revokeObjectURL(url);
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [cleaners, setCleaners] = useState<Cleaner[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<Status | 'all'>('all');
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true); setError('');
    const [bookRes, cleanRes] = await Promise.all([
      supabase.from('bookings').select('*, booking_extras(name, price_pence)').order('created_at', { ascending: false }),
      supabase.from('cleaners').select('id, full_name').eq('is_active', true).order('full_name'),
    ]);
    if (bookRes.error) setError(bookRes.error.message);
    else setBookings((bookRes.data as Booking[]) ?? []);
    if (cleanRes.data) setCleaners(cleanRes.data as Cleaner[]);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleStatusChange = (id: string, status: Status) =>
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));

  const handleUpdate = (id: string, patch: Partial<Booking>) =>
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } : b)));

  const filtered = bookings.filter((b) => {
    const matchStatus = statusFilter === 'all' || b.status === statusFilter;
    const q = search.toLowerCase();
    const matchSearch = !q || [b.reference, b.first_name, b.last_name, b.email, b.phone, b.postcode].some((v) => v?.toLowerCase().includes(q));
    return matchStatus && matchSearch;
  });

  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === 'pending').length,
    confirmed: bookings.filter((b) => b.status === 'confirmed').length,
    revenue: bookings.filter((b) => b.status !== 'cancelled').reduce((s, b) => s + b.total_price_pence, 0),
  };

  return (
    <div className="p-6 md:p-8 max-w-screen-xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-secondary-800">Bookings</h1>
          <p className="text-secondary-400 text-sm">Manage all customer bookings</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => exportCSV(filtered)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-secondary-200 bg-white text-sm font-semibold text-secondary-600 hover:bg-secondary-50 transition-colors"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button onClick={load} className="flex items-center gap-2 text-sm text-secondary-500 hover:text-secondary-700 px-3 py-2 rounded-xl border border-secondary-200 bg-white transition-colors">
            <RefreshCw className={cn('w-4 h-4', loading && 'animate-spin')} />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Bookings', value: stats.total, color: 'text-secondary-800' },
          { label: 'Pending', value: stats.pending, color: 'text-amber-600' },
          { label: 'Confirmed', value: stats.confirmed, color: 'text-blue-600' },
          { label: 'Total Revenue', value: formatPrice(stats.revenue), color: 'text-primary-600' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-secondary-100 p-5 shadow-soft">
            <p className="text-xs font-semibold text-secondary-400 uppercase tracking-wider mb-1">{s.label}</p>
            <p className={cn('font-heading font-extrabold text-2xl leading-none', s.color)}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-secondary-100 shadow-soft p-4 mb-5 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
          <input
            type="text" placeholder="Search by name, email, reference, phone..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-secondary-200 bg-secondary-50 text-sm text-secondary-700 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400 pointer-events-none" />
          <select
            value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as Status | 'all')}
            className="h-10 pl-9 pr-8 rounded-xl border border-secondary-200 bg-secondary-50 text-sm text-secondary-700 focus:outline-none focus:ring-2 focus:ring-primary-300 appearance-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            {(Object.keys(STATUS_CONFIG) as Status[]).map((s) => (
              <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4 mb-5">
          <AlertCircle className="w-4 h-4 text-red-500" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-secondary-100 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-secondary-100 bg-secondary-50/80">
                {['Reference', 'Customer', 'Service', 'Date', 'Cleaner', 'Total', 'Status'].map((h, i) => (
                  <th key={h} className={cn('text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-secondary-500', i >= 2 && i <= 4 && 'hidden lg:table-cell', i === 2 && 'hidden md:table-cell')}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-secondary-50">
                      {Array.from({ length: 7 }).map((_, j) => (
                        <td key={j} className="px-4 py-3.5"><div className="h-4 bg-secondary-100 rounded animate-pulse w-20" /></td>
                      ))}
                    </tr>
                  ))
                : filtered.length === 0
                ? (
                    <tr>
                      <td colSpan={7} className="text-center py-16 text-secondary-400 text-sm">
                        {bookings.length === 0 ? 'No bookings yet.' : 'No bookings match your filters.'}
                      </td>
                    </tr>
                  )
                : filtered.map((b) => (
                    <BookingRow key={b.id} booking={b} onStatusChange={handleStatusChange} onUpdate={handleUpdate} cleaners={cleaners} />
                  ))}
            </tbody>
          </table>
        </div>
        {filtered.length > 0 && (
          <div className="px-4 py-3 border-t border-secondary-100 bg-secondary-50/50 text-xs text-secondary-400">
            Showing {filtered.length} of {bookings.length} bookings
          </div>
        )}
      </div>
    </div>
  );
}
