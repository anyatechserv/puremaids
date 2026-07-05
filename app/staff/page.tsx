'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useStaff } from '@/lib/staff-auth';
import { supabase } from '@/lib/supabase';
import { formatPrice } from '@/lib/booking';
import {
  CalendarDays, Clock, MapPin, ChevronRight,
  CheckCircle, AlertCircle, Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Job {
  id: string;
  reference: string;
  status: string;
  service_type: string;
  preferred_date: string;
  preferred_time: string;
  address: string;
  postcode: string;
  first_name: string;
  last_name: string;
  phone: string;
  total_price_pence: number;
  special_instructions: string | null;
}

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  pending:     { label: 'Pending',     bg: 'bg-amber-50',  text: 'text-amber-700',  dot: 'bg-amber-400'  },
  confirmed:   { label: 'Confirmed',   bg: 'bg-blue-50',   text: 'text-blue-700',   dot: 'bg-blue-500'   },
  in_progress: { label: 'In Progress', bg: 'bg-primary-50',text: 'text-primary-700',dot: 'bg-primary-500' },
  completed:   { label: 'Completed',   bg: 'bg-green-50',  text: 'text-green-700',  dot: 'bg-green-500'  },
  cancelled:   { label: 'Cancelled',   bg: 'bg-red-50',    text: 'text-red-600',    dot: 'bg-red-400'    },
};

const SERVICE_LABELS: Record<string, string> = {
  domestic: 'Domestic Clean',
  deep: 'Deep Clean',
  end_of_tenancy: 'End of Tenancy',
  office: 'Office Clean',
};

const TIME_LABELS: Record<string, string> = {
  morning: '8am – 12pm',
  afternoon: '12pm – 4pm',
  evening: '4pm – 6pm',
};

function JobCard({ job }: { job: Job }) {
  const cfg = STATUS_CONFIG[job.status] ?? STATUS_CONFIG.pending;
  const today = new Date().toISOString().slice(0, 10);
  const isToday = job.preferred_date === today;

  return (
    <Link href={`/staff/jobs/${job.id}`}
      className="flex items-center gap-4 bg-white rounded-2xl border border-secondary-100 p-4 shadow-soft hover:shadow-md hover:border-primary-100 transition-all active:scale-[0.98]">
      {/* Date block */}
      <div className={cn(
        'w-12 h-12 rounded-xl flex flex-col items-center justify-center shrink-0 font-heading',
        isToday ? 'bg-primary-500 text-white' : 'bg-secondary-50 text-secondary-700',
      )}>
        <span className="text-xs font-semibold leading-none">
          {new Date(job.preferred_date + 'T12:00').toLocaleDateString('en-GB', { weekday: 'short' })}
        </span>
        <span className="text-lg font-black leading-tight">
          {new Date(job.preferred_date + 'T12:00').getDate()}
        </span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className={cn('inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full', cfg.bg, cfg.text)}>
            <span className={cn('w-1.5 h-1.5 rounded-full', cfg.dot)} />
            {cfg.label}
          </span>
          {isToday && <span className="text-[10px] font-bold bg-primary-500 text-white px-1.5 py-0.5 rounded-full">TODAY</span>}
        </div>
        <p className="font-semibold text-secondary-800 text-sm truncate">{SERVICE_LABELS[job.service_type] ?? job.service_type}</p>
        <div className="flex items-center gap-2 mt-0.5 text-xs text-secondary-400">
          <span className="flex items-center gap-0.5"><Clock className="w-3 h-3" />{TIME_LABELS[job.preferred_time] ?? job.preferred_time}</span>
          <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3" />{job.postcode}</span>
        </div>
        <p className="text-xs text-secondary-500 mt-0.5 truncate">{job.first_name} {job.last_name}</p>
      </div>

      <ChevronRight className="w-4 h-4 text-secondary-300 shrink-0" />
    </Link>
  );
}

export default function StaffJobsPage() {
  const { profile } = useStaff();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');

  const load = useCallback(async () => {
    if (!profile) return;
    setLoading(true);
    const { data } = await supabase
      .from('bookings')
      .select('id,reference,status,service_type,preferred_date,preferred_time,address,postcode,first_name,last_name,phone,total_price_pence,special_instructions')
      .eq('assigned_cleaner_id', profile.cleaner_id)
      .not('status', 'eq', 'cancelled')
      .order('preferred_date', { ascending: true });
    setJobs((data as Job[]) ?? []);
    setLoading(false);
  }, [profile]);

  useEffect(() => { load(); }, [load]);

  const today = new Date().toISOString().slice(0, 10);
  const upcoming = jobs.filter(j => j.preferred_date >= today && j.status !== 'completed');
  const past = jobs.filter(j => j.preferred_date < today || j.status === 'completed');

  const todayJobs = upcoming.filter(j => j.preferred_date === today);
  const futureJobs = upcoming.filter(j => j.preferred_date > today);
  const shown = tab === 'upcoming' ? upcoming : past;

  return (
    <div className="px-4 pt-5 pb-4">
      {/* Header */}
      <div className="mb-5">
        <h1 className="font-heading font-extrabold text-2xl text-secondary-800">My Jobs</h1>
        <p className="text-secondary-400 text-sm">
          {todayJobs.length > 0 ? `${todayJobs.length} job${todayJobs.length > 1 ? 's' : ''} today` : 'No jobs today'}
        </p>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: 'Today',    value: todayJobs.length,  color: 'text-primary-600',  bg: 'bg-primary-50'  },
          { label: 'Upcoming', value: futureJobs.length, color: 'text-blue-600',     bg: 'bg-blue-50'     },
          { label: 'Done',     value: past.length,       color: 'text-green-600',    bg: 'bg-green-50'    },
        ].map(s => (
          <div key={s.label} className={cn('rounded-2xl p-3 text-center', s.bg)}>
            <p className={cn('font-heading font-extrabold text-2xl', s.color)}>{s.value}</p>
            <p className="text-xs font-semibold text-secondary-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-secondary-100 p-1 rounded-xl mb-5">
        {(['upcoming', 'past'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={cn('flex-1 py-2 rounded-lg text-sm font-semibold capitalize transition-all',
              tab === t ? 'bg-white text-secondary-800 shadow-soft' : 'text-secondary-500')}>
            {t} ({t === 'upcoming' ? upcoming.length : past.length})
          </button>
        ))}
      </div>

      {/* Jobs */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <Loader2 className="w-8 h-8 text-primary-400 animate-spin" />
          <p className="text-secondary-400 text-sm">Loading your jobs...</p>
        </div>
      ) : shown.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          {tab === 'upcoming' ? (
            <>
              <CalendarDays className="w-12 h-12 text-secondary-200 mb-3" />
              <p className="font-semibold text-secondary-600 mb-1">No upcoming jobs</p>
              <p className="text-secondary-400 text-sm">Your next assignments will appear here.</p>
            </>
          ) : (
            <>
              <CheckCircle className="w-12 h-12 text-secondary-200 mb-3" />
              <p className="font-semibold text-secondary-600 mb-1">No completed jobs yet</p>
              <p className="text-secondary-400 text-sm">Finished jobs will show here.</p>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {shown.map(job => <JobCard key={job.id} job={job} />)}
        </div>
      )}
    </div>
  );
}
