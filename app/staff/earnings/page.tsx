'use client';

import { useEffect, useState, useCallback } from 'react';
import { useStaff } from '@/lib/staff-auth';
import { supabase } from '@/lib/supabase';
import { formatPrice } from '@/lib/booking';
import { DollarSign, Clock, TrendingUp, CalendarDays } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Job {
  id: string; reference: string; service_type: string;
  preferred_date: string; total_price_pence: number; status: string;
}
interface CheckIn {
  booking_id: string; checked_in_at: string | null; checked_out_at: string | null; duration_minutes: number | null;
}

const SERVICE_LABELS: Record<string, string> = {
  domestic: 'Domestic', deep: 'Deep Clean', end_of_tenancy: 'End of Tenancy', office: 'Office',
};

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function StaffEarningsPage() {
  const { profile } = useStaff();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [checkins, setCheckins] = useState<CheckIn[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'month' | 'all'>('month');

  const load = useCallback(async () => {
    if (!profile) return;
    setLoading(true);
    const [jobsRes, checkinsRes] = await Promise.all([
      supabase.from('bookings')
        .select('id, reference, service_type, preferred_date, total_price_pence, status')
        .eq('assigned_cleaner_id', profile.cleaner_id)
        .eq('status', 'completed')
        .order('preferred_date', { ascending: false }),
      supabase.from('job_checkins')
        .select('booking_id, checked_in_at, checked_out_at, duration_minutes')
        .eq('cleaner_id', profile.cleaner_id),
    ]);
    setJobs((jobsRes.data as Job[]) ?? []);
    setCheckins((checkinsRes.data as CheckIn[]) ?? []);
    setLoading(false);
  }, [profile]);

  useEffect(() => { load(); }, [load]);

  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const filteredJobs = period === 'month'
    ? jobs.filter(j => j.preferred_date?.startsWith(currentMonth))
    : jobs;

  const totalJobs = filteredJobs.length;
  const totalHours = filteredJobs.reduce((s, j) => {
    const ci = checkins.find(c => c.booking_id === j.id);
    return s + (ci?.duration_minutes ?? 0) / 60;
  }, 0);

  // Estimated earnings = duration-based at hourly_rate OR fallback 40% of job value
  const hourlyRate = (profile?.hourly_rate_pence ?? 1200) / 100;
  const estimatedEarnings = filteredJobs.reduce((s, j) => {
    const ci = checkins.find(c => c.booking_id === j.id);
    if (ci?.duration_minutes) return s + (ci.duration_minutes / 60) * hourlyRate;
    return s + j.total_price_pence * 0.4 / 100;
  }, 0);

  // Monthly chart (last 6 months)
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const monthJobs = jobs.filter(j => j.preferred_date?.startsWith(ym));
    const earnings = monthJobs.reduce((s, j) => {
      const ci = checkins.find(c => c.booking_id === j.id);
      if (ci?.duration_minutes) return s + (ci.duration_minutes / 60) * hourlyRate;
      return s + j.total_price_pence * 0.4 / 100;
    }, 0);
    return { label: MONTHS[d.getMonth()], earnings, jobs: monthJobs.length };
  });
  const maxEarnings = Math.max(...monthlyData.map(m => m.earnings), 1);

  return (
    <div className="px-4 pt-5 pb-4">
      <div className="mb-5">
        <h1 className="font-heading font-extrabold text-2xl text-secondary-800">Earnings</h1>
        <p className="text-secondary-400 text-sm">Your earnings from completed jobs</p>
      </div>

      {/* Period toggle */}
      <div className="flex gap-1 bg-secondary-100 p-1 rounded-xl mb-5">
        {(['month', 'all'] as const).map(p => (
          <button key={p} onClick={() => setPeriod(p)}
            className={cn('flex-1 py-2 rounded-lg text-sm font-semibold capitalize transition-all',
              period === p ? 'bg-white text-secondary-800 shadow-soft' : 'text-secondary-500')}>
            {p === 'month' ? 'This Month' : 'All Time'}
          </button>
        ))}
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {[
          { label: 'Estimated Pay',    value: `£${estimatedEarnings.toFixed(2)}`, icon: DollarSign, color: 'text-accent-500', bg: 'bg-accent-50'  },
          { label: 'Jobs Completed',   value: totalJobs,                          icon: CalendarDays, color: 'text-primary-600', bg: 'bg-primary-50' },
          { label: 'Hours Worked',     value: `${totalHours.toFixed(1)}h`,        icon: Clock,      color: 'text-blue-600',   bg: 'bg-blue-50'    },
          { label: 'Hourly Rate',      value: `£${hourlyRate.toFixed(2)}/hr`,     icon: TrendingUp, color: 'text-secondary-700', bg: 'bg-secondary-100' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl border border-secondary-100 p-4 shadow-soft">
            <div className={cn('w-8 h-8 rounded-xl flex items-center justify-center mb-2', bg)}>
              <Icon className={cn('w-4 h-4', color)} />
            </div>
            <p className={cn('font-heading font-extrabold text-xl leading-none mb-0.5', color)}>{value}</p>
            <p className="text-xs text-secondary-400 font-medium">{label}</p>
          </div>
        ))}
      </div>

      {/* Monthly bar chart */}
      <div className="bg-white rounded-2xl border border-secondary-100 shadow-soft p-4 mb-5">
        <h2 className="font-heading font-bold text-secondary-800 mb-4 text-sm">Last 6 Months</h2>
        {loading
          ? <div className="h-32 flex items-center justify-center text-secondary-400 text-sm">Loading...</div>
          : (
            <div className="flex items-end gap-2 h-32">
              {monthlyData.map((m, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                  <span className="text-[9px] font-bold text-secondary-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    £{m.earnings.toFixed(0)}
                  </span>
                  <div
                    className={cn('w-full rounded-t-lg transition-all', i === 5 ? 'bg-accent-500' : 'bg-secondary-200')}
                    style={{ height: `${Math.max((m.earnings / maxEarnings) * 96, 4)}px` }}
                  />
                  <p className="text-[9px] text-secondary-400 font-semibold">{m.label}</p>
                </div>
              ))}
            </div>
          )}
      </div>

      {/* Job breakdown */}
      <div className="bg-white rounded-2xl border border-secondary-100 shadow-soft overflow-hidden">
        <div className="px-4 py-3.5 border-b border-secondary-100">
          <h2 className="font-heading font-bold text-secondary-800 text-sm">Job Breakdown</h2>
        </div>
        {loading
          ? <div className="p-8 text-center text-secondary-400 text-sm">Loading...</div>
          : filteredJobs.length === 0
          ? <div className="p-8 text-center text-secondary-400 text-sm">No completed jobs yet</div>
          : (
            <div className="divide-y divide-secondary-50">
              {filteredJobs.map(job => {
                const ci = checkins.find(c => c.booking_id === job.id);
                const earned = ci?.duration_minutes
                  ? (ci.duration_minutes / 60) * hourlyRate
                  : job.total_price_pence * 0.4 / 100;
                return (
                  <div key={job.id} className="px-4 py-3.5 flex items-center gap-3">
                    <div className="w-9 h-9 bg-accent-50 rounded-xl flex items-center justify-center shrink-0">
                      <DollarSign className="w-4 h-4 text-accent-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-secondary-800 truncate">
                        {SERVICE_LABELS[job.service_type] ?? job.service_type}
                      </p>
                      <p className="text-xs text-secondary-400">
                        {job.preferred_date}
                        {ci?.duration_minutes ? ` · ${ci.duration_minutes} mins` : ''}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-heading font-bold text-accent-600">£{earned.toFixed(2)}</p>
                      <p className="text-[10px] text-secondary-400 font-mono">{job.reference}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
      </div>
    </div>
  );
}
