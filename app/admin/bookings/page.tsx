'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Search,
  Filter,
  RefreshCw,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { formatPrice } from '@/lib/booking';
import { cn } from '@/lib/utils';

type Status = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

interface BookingExtra {
  name: string;
  price_pence: number;
}

interface Booking {
  id: string;
  reference: string;
  status: Status;
  service_type: string;
  property_size: string | null;
  frequency: string;
  preferred_date: string;
  preferred_time: string;
  address: string;
  postcode: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  special_instructions: string | null;
  base_price_pence: number;
  extras_price_pence: number;
  total_price_pence: number;
  deposit_paid: boolean;
  deposit_amount_pence: number;
  notes: string | null;
  created_at: string;
  booking_extras: BookingExtra[];
}

const STATUS_CONFIG: Record<
  Status,
  { label: string; icon: React.ComponentType<{ className?: string }>; bg: string; text: string; border: string }
> = {
  pending:     { label: 'Pending',     icon: Clock,       bg: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-200'  },
  confirmed:   { label: 'Confirmed',   icon: CheckCircle, bg: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-200'   },
  in_progress: { label: 'In Progress', icon: Sparkles,    bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200' },
  completed:   { label: 'Completed',   icon: CheckCircle, bg: 'bg-accent-50', text: 'text-accent-700', border: 'border-accent-200' },
  cancelled:   { label: 'Cancelled',   icon: XCircle,     bg: 'bg-red-50',    text: 'text-red-700',    border: 'border-red-200'    },
};

const SERVICE_LABELS: Record<string, string> = {
  domestic: 'Domestic',
  deep: 'Deep Clean',
  end_of_tenancy: 'End of Tenancy',
  office: 'Office',
};

function StatusBadge({ status }: { status: Status }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  const Icon = cfg.icon;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border',
        cfg.bg, cfg.text, cfg.border,
      )}
    >
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  );
}

function BookingRow({
  booking,
  onStatusChange,
}: {
  booking: Booking;
  onStatusChange: (id: string, s: Status) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const handleStatus = async (newStatus: Status) => {
    setUpdatingStatus(true);
    onStatusChange(booking.id, newStatus);
    await supabase.from('bookings').update({ status: newStatus }).eq('id', booking.id);
    setUpdatingStatus(false);
  };

  const createdDate = new Date(booking.created_at).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

  return (
    <>
      <tr
        className="border-b border-secondary-50 hover:bg-secondary-50/50 cursor-pointer transition-colors"
        onClick={() => setExpanded((v) => !v)}
      >
        <td className="py-3.5 px-4">
          <div className="flex items-center gap-2">
            {expanded
              ? <ChevronDown className="w-3.5 h-3.5 text-secondary-400 shrink-0" />
              : <ChevronRight className="w-3.5 h-3.5 text-secondary-400 shrink-0" />}
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
          <p className="text-xs text-secondary-400 capitalize">{booking.preferred_time}</p>
        </td>
        <td className="py-3.5 px-4 hidden lg:table-cell">
          <span className="font-heading font-bold text-secondary-800">
            {formatPrice(booking.total_price_pence)}
          </span>
          {booking.deposit_paid && (
            <p className="text-[10px] text-accent-600 font-semibold mt-0.5">Deposit paid</p>
          )}
        </td>
        <td className="py-3.5 px-4">
          <StatusBadge status={booking.status} />
        </td>
        <td className="py-3.5 px-4 hidden xl:table-cell text-xs text-secondary-400">{createdDate}</td>
      </tr>

      {expanded && (
        <tr className="bg-secondary-50/70">
          <td colSpan={7} className="px-6 py-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Contact */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-secondary-500 mb-3">Contact</h4>
                <div className="space-y-1.5 text-sm">
                  <p className="flex items-center gap-2 text-secondary-600">
                    <Phone className="w-3.5 h-3.5 text-secondary-400" /> {booking.phone}
                  </p>
                  <p className="flex items-center gap-2 text-secondary-600">
                    <Mail className="w-3.5 h-3.5 text-secondary-400" /> {booking.email}
                  </p>
                  <p className="flex items-start gap-2 text-secondary-600">
                    <MapPin className="w-3.5 h-3.5 text-secondary-400 mt-0.5 shrink-0" />
                    {booking.address}, {booking.postcode}
                  </p>
                </div>
              </div>

              {/* Service */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-secondary-500 mb-3">Service Details</h4>
                <div className="space-y-1 text-sm text-secondary-600">
                  <p><strong>Service:</strong> {SERVICE_LABELS[booking.service_type] ?? booking.service_type}</p>
                  {booking.property_size && <p><strong>Size:</strong> {booking.property_size}</p>}
                  <p><strong>Frequency:</strong> {booking.frequency}</p>
                  <p className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-secondary-400" />
                    {booking.preferred_date} — {booking.preferred_time}
                  </p>
                  {booking.booking_extras?.length > 0 && (
                    <p><strong>Extras:</strong> {booking.booking_extras.map((e) => e.name).join(', ')}</p>
                  )}
                  {booking.special_instructions && (
                    <p><strong>Notes:</strong> {booking.special_instructions}</p>
                  )}
                </div>
              </div>

              {/* Status + Pricing */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-secondary-500 mb-3">
                  Update Status
                </h4>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {(Object.keys(STATUS_CONFIG) as Status[]).map((s) => (
                    <button
                      key={s}
                      onClick={(e) => { e.stopPropagation(); handleStatus(s); }}
                      disabled={booking.status === s || updatingStatus}
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
                  <p><strong>Base:</strong> {formatPrice(booking.base_price_pence)}</p>
                  {booking.extras_price_pence > 0 && (
                    <p><strong>Extras:</strong> +{formatPrice(booking.extras_price_pence)}</p>
                  )}
                  <p>
                    <strong>Total:</strong>{' '}
                    <span className="text-primary-600 font-bold">{formatPrice(booking.total_price_pence)}</span>
                  </p>
                  <p>
                    <strong>Deposit:</strong> {formatPrice(booking.deposit_amount_pence)}{' '}
                    {booking.deposit_paid ? '✅ Paid' : '⏳ Pending'}
                  </p>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<Status | 'all'>('all');
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    const { data, error: err } = await supabase
      .from('bookings')
      .select('*, booking_extras(name, price_pence)')
      .order('created_at', { ascending: false });
    if (err) {
      setError(err.message);
    } else {
      setBookings((data as Booking[]) ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleStatusChange = (id: string, status: Status) => {
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
  };

  const filtered = bookings.filter((b) => {
    const matchStatus = statusFilter === 'all' || b.status === statusFilter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      [b.reference, b.first_name, b.last_name, b.email, b.phone, b.postcode].some(
        (v) => v?.toLowerCase().includes(q),
      );
    return matchStatus && matchSearch;
  });

  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === 'pending').length,
    confirmed: bookings.filter((b) => b.status === 'confirmed').length,
    revenue: bookings
      .filter((b) => b.status !== 'cancelled')
      .reduce((s, b) => s + b.total_price_pence, 0),
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <div className="bg-white border-b border-secondary-100 px-6 py-5">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-heading font-extrabold text-2xl text-secondary-800">Bookings Admin</h1>
            <p className="text-secondary-400 text-sm">PureMaids · Booking Management</p>
          </div>
          <button
            onClick={load}
            className="flex items-center gap-2 text-sm text-secondary-500 hover:text-secondary-700 transition-colors"
          >
            <RefreshCw className={cn('w-4 h-4', loading && 'animate-spin')} />
            Refresh
          </button>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Bookings', value: stats.total, color: 'text-secondary-800' },
            { label: 'Pending',        value: stats.pending, color: 'text-amber-600' },
            { label: 'Confirmed',      value: stats.confirmed, color: 'text-blue-600' },
            { label: 'Total Revenue',  value: formatPrice(stats.revenue), color: 'text-primary-600' },
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
              type="text"
              placeholder="Search by name, email, reference, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-xl border border-secondary-200 bg-secondary-50 text-sm text-secondary-700 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400 pointer-events-none" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as Status | 'all')}
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

        {/* Table */}
        <div className="bg-white rounded-2xl border border-secondary-100 shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-secondary-100 bg-secondary-50/80">
                  {['Reference', 'Customer', 'Service', 'Date', 'Total', 'Status', 'Created'].map((h, i) => (
                    <th
                      key={h}
                      className={cn(
                        'text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-secondary-500',
                        i === 2 && 'hidden md:table-cell',
                        (i === 3 || i === 4) && 'hidden lg:table-cell',
                        i === 6 && 'hidden xl:table-cell',
                      )}
                    >
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
                          <td key={j} className="px-4 py-3.5">
                            <div className="h-4 bg-secondary-100 rounded animate-pulse w-20" />
                          </td>
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
                      <BookingRow key={b.id} booking={b} onStatusChange={handleStatusChange} />
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
    </div>
  );
}
