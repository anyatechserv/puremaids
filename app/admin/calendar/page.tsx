'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { ChevronLeft, ChevronRight, Clock, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Booking {
  id: string; reference: string; status: string;
  service_type: string; preferred_date: string; preferred_time: string;
  first_name: string; last_name: string; postcode: string;
  total_price_pence: number; assigned_cleaner_id: string | null;
}

interface Cleaner { id: string; full_name: string; }

const STATUS_COLORS: Record<string, string> = {
  pending:     'bg-amber-100 text-amber-700 border-amber-200',
  confirmed:   'bg-blue-100 text-blue-700 border-blue-200',
  in_progress: 'bg-violet-100 text-violet-700 border-violet-200',
  completed:   'bg-green-100 text-green-700 border-green-200',
  cancelled:   'bg-red-100 text-red-700 border-red-200',
};

const SERVICE_SHORT: Record<string, string> = {
  domestic: 'Domestic', deep: 'Deep', end_of_tenancy: 'EOT', office: 'Office',
};

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

function getMonthMatrix(year: number, month: number): (Date | null)[][] {
  const first = new Date(year, month, 1);
  const startDow = (first.getDay() + 6) % 7; // Mon=0
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = [
    ...Array.from({ length: startDow }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1)),
  ];
  while (cells.length % 7 !== 0) cells.push(null);
  const rows: (Date | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
  return rows;
}

function formatDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function AdminCalendarPage() {
  const [today] = useState(() => new Date());
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [cleaners, setCleaners] = useState<Cleaner[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const [br, cr] = await Promise.all([
      supabase.from('bookings').select('id,reference,status,service_type,preferred_date,preferred_time,first_name,last_name,postcode,total_price_pence,assigned_cleaner_id').neq('status', 'cancelled'),
      supabase.from('cleaners').select('id,full_name').eq('is_active', true),
    ]);
    if (br.data) setBookings(br.data as Booking[]);
    if (cr.data) setCleaners(cr.data as Cleaner[]);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const byDate = useMemo(() => {
    const map: Record<string, Booking[]> = {};
    for (const b of bookings) {
      if (!map[b.preferred_date]) map[b.preferred_date] = [];
      map[b.preferred_date].push(b);
    }
    return map;
  }, [bookings]);

  const matrix = useMemo(() => getMonthMatrix(year, month), [year, month]);

  const prevMonth = () => { if (month === 0) { setYear((y) => y - 1); setMonth(11); } else setMonth((m) => m - 1); };
  const nextMonth = () => { if (month === 11) { setYear((y) => y + 1); setMonth(0); } else setMonth((m) => m + 1); };

  const selectedBookings = selected ? (byDate[selected] ?? []) : [];

  return (
    <div className="p-6 md:p-8 max-w-screen-xl mx-auto">
      <div className="mb-6">
        <h1 className="font-heading font-extrabold text-2xl text-secondary-800">Calendar</h1>
        <p className="text-secondary-400 text-sm">View bookings by date</p>
      </div>

      <div className="flex flex-col xl:flex-row gap-6">
        {/* Calendar grid */}
        <div className="flex-1 bg-white rounded-2xl border border-secondary-100 shadow-soft overflow-hidden">
          {/* Month nav */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-secondary-100">
            <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-secondary-100 text-secondary-600 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="font-heading font-bold text-lg text-secondary-800">{MONTHS[month]} {year}</h2>
            <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-secondary-100 text-secondary-600 transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 border-b border-secondary-100">
            {DAYS.map((d) => (
              <div key={d} className="py-2 text-center text-xs font-bold uppercase tracking-wider text-secondary-400">{d}</div>
            ))}
          </div>

          {/* Cells */}
          {loading
            ? <div className="h-64 flex items-center justify-center text-secondary-400 text-sm">Loading...</div>
            : matrix.map((row, ri) => (
                <div key={ri} className="grid grid-cols-7 border-b border-secondary-50 last:border-0">
                  {row.map((day, ci) => {
                    if (!day) return <div key={ci} className="min-h-[88px] bg-secondary-50/30 border-r border-secondary-50 last:border-0" />;
                    const dateStr = formatDate(day);
                    const dayBookings = byDate[dateStr] ?? [];
                    const isToday = formatDate(today) === dateStr;
                    const isSelected = selected === dateStr;
                    return (
                      <div
                        key={ci}
                        onClick={() => setSelected(isSelected ? null : dateStr)}
                        className={cn(
                          'min-h-[88px] p-1.5 border-r border-secondary-50 last:border-0 cursor-pointer transition-colors',
                          isSelected ? 'bg-primary-50' : 'hover:bg-secondary-50',
                        )}
                      >
                        <span className={cn(
                          'inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold mb-1',
                          isToday ? 'bg-primary-500 text-white' : 'text-secondary-600',
                          isSelected && !isToday ? 'text-primary-600 font-bold' : '',
                        )}>
                          {day.getDate()}
                        </span>
                        <div className="space-y-0.5">
                          {dayBookings.slice(0, 3).map((b) => (
                            <div key={b.id} className={cn('text-[9px] px-1 py-0.5 rounded font-semibold truncate border', STATUS_COLORS[b.status] ?? 'bg-secondary-100 text-secondary-600 border-secondary-200')}>
                              {b.first_name} — {SERVICE_SHORT[b.service_type] ?? b.service_type}
                            </div>
                          ))}
                          {dayBookings.length > 3 && (
                            <p className="text-[9px] text-secondary-400 font-semibold pl-0.5">+{dayBookings.length - 3} more</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
        </div>

        {/* Day panel */}
        <div className="xl:w-80">
          <div className="bg-white rounded-2xl border border-secondary-100 shadow-soft overflow-hidden sticky top-6">
            <div className="px-5 py-4 border-b border-secondary-100">
              <h3 className="font-heading font-bold text-secondary-800">
                {selected
                  ? new Date(selected + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })
                  : 'Select a date'}
              </h3>
              {selected && <p className="text-xs text-secondary-400 mt-0.5">{selectedBookings.length} booking{selectedBookings.length !== 1 ? 's' : ''}</p>}
            </div>
            <div className="divide-y divide-secondary-50 max-h-[60vh] overflow-y-auto">
              {!selected && (
                <p className="text-center text-secondary-400 text-sm py-10">Click a date to view bookings</p>
              )}
              {selected && selectedBookings.length === 0 && (
                <p className="text-center text-secondary-400 text-sm py-10">No bookings on this date</p>
              )}
              {selectedBookings.map((b) => {
                const cleaner = cleaners.find((c) => c.id === b.assigned_cleaner_id);
                return (
                  <div key={b.id} className="px-5 py-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono font-bold text-xs text-primary-600">{b.reference}</span>
                      <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full font-semibold border capitalize', STATUS_COLORS[b.status] ?? '')}>
                        {b.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="font-semibold text-sm text-secondary-800">{b.first_name} {b.last_name}</p>
                    <p className="text-xs text-secondary-500">{SERVICE_SHORT[b.service_type] ?? b.service_type}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-secondary-400">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{b.preferred_time}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{b.postcode}</span>
                    </div>
                    {cleaner && (
                      <p className="text-xs mt-1.5 bg-green-50 text-green-700 px-2 py-1 rounded-lg inline-block font-semibold">
                        Cleaner: {cleaner.full_name}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
