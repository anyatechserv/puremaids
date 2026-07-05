'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useStaff } from '@/lib/staff-auth';
import { supabase } from '@/lib/supabase';
import { formatPrice } from '@/lib/booking';
import {
  ArrowLeft, MapPin, Navigation, Phone, Clock, CheckSquare, Square,
  Camera, AlertTriangle, ChevronDown, ChevronUp, Loader2, Send,
  CheckCircle, PlayCircle, StopCircle, Image as ImageIcon, Plus, X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/* ─── Types ─────────────────────────────────────────────────────────────── */
interface Booking {
  id: string; reference: string; status: string;
  service_type: string; property_size: string | null;
  preferred_date: string; preferred_time: string;
  address: string; postcode: string;
  first_name: string; last_name: string; phone: string;
  total_price_pence: number; special_instructions: string | null;
  booking_extras: { name: string; price_pence: number }[];
}
interface CheckIn { id: string; checked_in_at: string | null; checked_out_at: string | null; duration_minutes: number | null; }
interface Task    { id: string; label: string; completed: boolean; sort_order: number; }
interface Photo   { id: string; photo_url: string; type: 'before' | 'after'; caption: string | null; created_at: string; }
interface Issue   { id: string; title: string; description: string | null; severity: string; resolved: boolean; }

/* ─── Constants ─────────────────────────────────────────────────────────── */
const SERVICE_LABELS: Record<string, string> = {
  domestic: 'Domestic Clean', deep: 'Deep Clean',
  end_of_tenancy: 'End of Tenancy', office: 'Office Clean',
};
const TIME_LABELS: Record<string, string> = {
  morning: '8am – 12pm', afternoon: '12pm – 4pm', evening: '4pm – 6pm',
};
const SEVERITY_CFG: Record<string, { label: string; bg: string; text: string; border: string }> = {
  low:    { label: 'Low',    bg: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-200'  },
  medium: { label: 'Medium', bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  high:   { label: 'High',   bg: 'bg-red-50',    text: 'text-red-700',    border: 'border-red-200'    },
};

const DEFAULT_TASKS: Record<string, string[]> = {
  domestic: ['Vacuum all carpets','Mop hard floors','Clean bathrooms','Clean kitchen surfaces','Empty bins','Dust surfaces','Clean mirrors & glass'],
  deep:     ['All domestic tasks','Clean oven','Fridge interior','Inside cupboards','Scale taps & showerheads','Clean windows inside','Behind appliances'],
  end_of_tenancy: ['All deep tasks','Clean walls & skirting','Descale entire bathroom','Clean all appliances','Clean curtain rails','Report any damage'],
  office:   ['Vacuum office floors','Clean desks & monitors','Sanitise phones & keyboards','Clean kitchen area','Restock supplies','Empty all bins'],
};

/* ─── Section wrapper ───────────────────────────────────────────────────── */
function Section({ title, icon: Icon, badge, children, defaultOpen = true }: {
  title: string; icon: React.ComponentType<{ className?: string }>;
  badge?: string | number; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-2xl border border-secondary-100 shadow-soft overflow-hidden mb-3">
      <button onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-3 px-4 py-3.5 text-left">
        <Icon className="w-4.5 h-4.5 text-primary-500 shrink-0" />
        <span className="font-semibold text-secondary-800 text-sm flex-1">{title}</span>
        {badge !== undefined && (
          <span className="text-[10px] font-bold bg-primary-50 text-primary-600 px-2 py-0.5 rounded-full">{badge}</span>
        )}
        {open ? <ChevronUp className="w-4 h-4 text-secondary-400" /> : <ChevronDown className="w-4 h-4 text-secondary-400" />}
      </button>
      {open && <div className="border-t border-secondary-50 px-4 pb-4 pt-3">{children}</div>}
    </div>
  );
}

/* ─── Main page ─────────────────────────────────────────────────────────── */
export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { profile } = useStaff();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [checkin, setCheckin] = useState<CheckIn | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  // Issue form state
  const [issueTitle, setIssueTitle] = useState('');
  const [issueDesc, setIssueDesc] = useState('');
  const [issueSeverity, setIssueSeverity] = useState<'low' | 'medium' | 'high'>('low');
  const [showIssueForm, setShowIssueForm] = useState(false);

  // Photo upload state
  const [photoType, setPhotoType] = useState<'before' | 'after'>('before');
  const [photoCaption, setPhotoCaption] = useState('');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    if (!profile) return;
    const [bookRes, checkinRes, tasksRes, photosRes, issuesRes] = await Promise.all([
      supabase.from('bookings')
        .select('*, booking_extras(name, price_pence)')
        .eq('id', id).maybeSingle(),
      supabase.from('job_checkins')
        .select('*').eq('booking_id', id).eq('cleaner_id', profile.cleaner_id).maybeSingle(),
      supabase.from('job_tasks')
        .select('*').eq('booking_id', id).eq('cleaner_id', profile.cleaner_id).order('sort_order'),
      supabase.from('job_photos')
        .select('*').eq('booking_id', id).eq('cleaner_id', profile.cleaner_id).order('created_at'),
      supabase.from('job_issues')
        .select('*').eq('booking_id', id).eq('cleaner_id', profile.cleaner_id).order('created_at', { ascending: false }),
    ]);

    if (bookRes.data) setBooking(bookRes.data as Booking);
    if (checkinRes.data) setCheckin(checkinRes.data as CheckIn);
    if (photosRes.data) setPhotos(photosRes.data as Photo[]);
    if (issuesRes.data) setIssues(issuesRes.data as Issue[]);

    // Seed tasks if none exist yet
    if (tasksRes.data && tasksRes.data.length > 0) {
      setTasks(tasksRes.data as Task[]);
    } else if (bookRes.data) {
      const serviceType = (bookRes.data as Booking).service_type;
      const defaults = DEFAULT_TASKS[serviceType] ?? DEFAULT_TASKS.domestic;
      const rows = defaults.map((label, i) => ({
        booking_id: id,
        cleaner_id: profile.cleaner_id,
        label,
        completed: false,
        sort_order: i,
      }));
      const { data: seeded } = await supabase.from('job_tasks').insert(rows).select('*');
      if (seeded) setTasks(seeded as Task[]);
    }

    setLoading(false);
  }, [id, profile]);

  useEffect(() => { load(); }, [load]);

  /* ─── Check In ─────────────────────────────────────────────── */
  const handleCheckIn = async () => {
    if (!profile) return;
    setSaving('checkin');
    const now = new Date().toISOString();
    const { data, error } = await supabase.from('job_checkins')
      .insert({ booking_id: id, cleaner_id: profile.cleaner_id, checked_in_at: now })
      .select('*').single();
    if (!error && data) {
      setCheckin(data as CheckIn);
      // Update booking status to in_progress
      await supabase.from('bookings').update({ status: 'in_progress' }).eq('id', id);
      setBooking(prev => prev ? { ...prev, status: 'in_progress' } : prev);
    }
    setSaving(null);
  };

  /* ─── Check Out ────────────────────────────────────────────── */
  const handleCheckOut = async () => {
    if (!checkin || !profile) return;
    setSaving('checkout');
    const now = new Date().toISOString();
    const inTime = new Date(checkin.checked_in_at!).getTime();
    const duration = Math.round((Date.now() - inTime) / 60000);
    const { data } = await supabase.from('job_checkins')
      .update({ checked_out_at: now, duration_minutes: duration })
      .eq('id', checkin.id).select('*').single();
    if (data) setCheckin(data as CheckIn);
    // Mark booking completed
    await supabase.from('bookings').update({ status: 'completed' }).eq('id', id);
    setBooking(prev => prev ? { ...prev, status: 'completed' } : prev);
    setSaving(null);
  };

  /* ─── Toggle task ───────────────────────────────────────────── */
  const toggleTask = async (task: Task) => {
    const completed = !task.completed;
    const completed_at = completed ? new Date().toISOString() : null;
    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, completed, completed_at: completed_at ?? undefined } : t));
    await supabase.from('job_tasks').update({ completed, completed_at }).eq('id', task.id);
  };

  /* ─── Submit issue ──────────────────────────────────────────── */
  const handleSubmitIssue = async () => {
    if (!profile || !issueTitle.trim()) return;
    setSaving('issue');
    const { data } = await supabase.from('job_issues')
      .insert({ booking_id: id, cleaner_id: profile.cleaner_id, title: issueTitle, description: issueDesc || null, severity: issueSeverity })
      .select('*').single();
    if (data) {
      setIssues(prev => [data as Issue, ...prev]);
      setIssueTitle(''); setIssueDesc(''); setIssueSeverity('low'); setShowIssueForm(false);
    }
    setSaving(null);
  };

  /* ─── Upload photo (stores as base64 data URL in DB for demo) ── */
  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;
    setUploadingPhoto(true);

    // Convert to base64 data URL (works without Storage bucket setup)
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataUrl = ev.target?.result as string;
      const { data } = await supabase.from('job_photos')
        .insert({
          booking_id: id,
          cleaner_id: profile.cleaner_id,
          photo_url: dataUrl,
          type: photoType,
          caption: photoCaption || null,
        })
        .select('*').single();
      if (data) setPhotos(prev => [...prev, data as Photo]);
      setPhotoCaption('');
      setUploadingPhoto(false);
    };
    reader.readAsDataURL(file);
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  /* ─── GPS navigation ────────────────────────────────────────── */
  const openNavigation = () => {
    if (!booking) return;
    const query = encodeURIComponent(`${booking.address}, ${booking.postcode}`);
    // Try Google Maps app first, fallback to browser maps
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${query}&travelmode=driving`, '_blank');
  };

  /* ─── Render ────────────────────────────────────────────────── */
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-8 h-8 text-primary-400 animate-spin" />
        <p className="text-secondary-400 text-sm">Loading job details...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 px-4 text-center">
        <AlertTriangle className="w-10 h-10 text-secondary-300" />
        <p className="font-semibold text-secondary-700">Job not found</p>
        <button onClick={() => router.back()} className="text-primary-600 text-sm font-semibold">Go back</button>
      </div>
    );
  }

  const completedTasks = tasks.filter(t => t.completed).length;
  const isCheckedIn = !!checkin?.checked_in_at && !checkin?.checked_out_at;
  const isCheckedOut = !!checkin?.checked_out_at;
  const beforePhotos = photos.filter(p => p.type === 'before');
  const afterPhotos = photos.filter(p => p.type === 'after');

  return (
    <div className="px-4 pt-4 pb-4">
      {/* Back button */}
      <button onClick={() => router.back()}
        className="flex items-center gap-1.5 text-secondary-500 hover:text-secondary-800 mb-4 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-semibold">All Jobs</span>
      </button>

      {/* Job header card */}
      <div className="bg-secondary-900 rounded-2xl p-4 mb-3 text-white">
        <div className="flex items-start justify-between mb-2">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-secondary-400">
              {booking.preferred_date} · {TIME_LABELS[booking.preferred_time] ?? booking.preferred_time}
            </span>
            <h1 className="font-heading font-extrabold text-xl mt-0.5">
              {SERVICE_LABELS[booking.service_type] ?? booking.service_type}
            </h1>
          </div>
          <span className={cn(
            'text-[10px] font-bold px-2 py-1 rounded-full capitalize',
            booking.status === 'completed' ? 'bg-green-500/20 text-green-400' :
            booking.status === 'in_progress' ? 'bg-primary-500/20 text-primary-300' :
            'bg-amber-500/20 text-amber-400',
          )}>
            {booking.status.replace('_', ' ')}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-secondary-300 text-sm mb-3">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{booking.address}, {booking.postcode}</span>
        </div>

        <div className="flex gap-2">
          <button onClick={openNavigation}
            className="flex-1 flex items-center justify-center gap-2 h-10 bg-primary-500 hover:bg-primary-400 rounded-xl text-sm font-bold transition-colors">
            <Navigation className="w-4 h-4" />
            Navigate
          </button>
          <a href={`tel:${booking.phone}`}
            className="flex items-center justify-center gap-2 h-10 px-4 bg-secondary-700 hover:bg-secondary-600 rounded-xl text-sm font-bold transition-colors">
            <Phone className="w-4 h-4" />
            Call
          </a>
        </div>
      </div>

      {/* Check In / Out */}
      {!isCheckedOut && (
        <div className="mb-3">
          {!isCheckedIn ? (
            <button onClick={handleCheckIn} disabled={saving === 'checkin'}
              className="w-full h-14 bg-accent-500 hover:bg-accent-400 text-white font-bold text-lg rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-accent-500/20 active:scale-[0.98] transition-all disabled:opacity-60">
              {saving === 'checkin' ? <Loader2 className="w-5 h-5 animate-spin" /> : <PlayCircle className="w-6 h-6" />}
              Check In
            </button>
          ) : (
            <div className="space-y-2">
              <div className="bg-accent-50 border border-accent-200 rounded-xl px-4 py-3 flex items-center gap-3">
                <div className="w-2.5 h-2.5 bg-accent-500 rounded-full animate-pulse" />
                <div>
                  <p className="text-xs font-bold text-accent-700">Checked in</p>
                  <p className="text-xs text-accent-600">
                    {new Date(checkin!.checked_in_at!).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
              <button onClick={handleCheckOut} disabled={saving === 'checkout'}
                className="w-full h-14 bg-red-500 hover:bg-red-400 text-white font-bold text-lg rounded-2xl flex items-center justify-center gap-3 active:scale-[0.98] transition-all disabled:opacity-60">
                {saving === 'checkout' ? <Loader2 className="w-5 h-5 animate-spin" /> : <StopCircle className="w-6 h-6" />}
                Check Out &amp; Complete
              </button>
            </div>
          )}
        </div>
      )}

      {isCheckedOut && (
        <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-3 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
          <div>
            <p className="text-sm font-bold text-green-800">Job Completed</p>
            <p className="text-xs text-green-600">
              Duration: {checkin?.duration_minutes ?? 0} mins ·
              Checked out {new Date(checkin!.checked_out_at!).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
      )}

      {/* Tasks */}
      <Section title="Tasks" icon={CheckSquare} badge={`${completedTasks}/${tasks.length}`}>
        <div className="space-y-2">
          {tasks.map(task => (
            <button key={task.id} onClick={() => toggleTask(task)}
              className={cn(
                'w-full flex items-center gap-3 p-3 rounded-xl text-left transition-colors border',
                task.completed
                  ? 'bg-green-50 border-green-100'
                  : 'bg-secondary-50 border-secondary-100 hover:bg-secondary-100',
              )}>
              {task.completed
                ? <CheckSquare className="w-5 h-5 text-green-500 shrink-0" />
                : <Square className="w-5 h-5 text-secondary-300 shrink-0" />}
              <span className={cn('text-sm font-medium', task.completed ? 'line-through text-secondary-400' : 'text-secondary-700')}>
                {task.label}
              </span>
            </button>
          ))}
        </div>
        {booking.booking_extras && booking.booking_extras.length > 0 && (
          <div className="mt-3 pt-3 border-t border-secondary-100">
            <p className="text-xs font-bold uppercase tracking-wider text-secondary-400 mb-2">Extras requested</p>
            {booking.booking_extras.map(e => (
              <p key={e.name} className="text-sm text-secondary-600 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary-400 rounded-full" />
                {e.name}
              </p>
            ))}
          </div>
        )}
        {booking.special_instructions && (
          <div className="mt-3 pt-3 border-t border-secondary-100">
            <p className="text-xs font-bold uppercase tracking-wider text-secondary-400 mb-1">Customer notes</p>
            <p className="text-sm text-secondary-600 bg-amber-50 border border-amber-100 rounded-xl p-3">{booking.special_instructions}</p>
          </div>
        )}
      </Section>

      {/* Photos */}
      <Section title="Before & After Photos" icon={Camera} badge={photos.length}>
        <div className="flex gap-2 mb-3">
          {(['before', 'after'] as const).map(t => (
            <button key={t} onClick={() => setPhotoType(t)}
              className={cn('flex-1 h-9 rounded-xl text-sm font-semibold capitalize transition-colors',
                photoType === t ? 'bg-primary-500 text-white' : 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200')}>
              {t}
            </button>
          ))}
        </div>

        <input
          type="text" value={photoCaption}
          onChange={e => setPhotoCaption(e.target.value)}
          placeholder="Optional caption..."
          className="w-full h-9 px-3.5 mb-2 rounded-xl border border-secondary-200 text-sm text-secondary-800 focus:outline-none focus:ring-2 focus:ring-primary-300"
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploadingPhoto}
          className="w-full h-11 bg-secondary-800 hover:bg-secondary-700 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-60 mb-3">
          {uploadingPhoto ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
          {uploadingPhoto ? 'Uploading...' : `Take / Upload ${photoType === 'before' ? 'Before' : 'After'} Photo`}
        </button>
        <input ref={fileInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handlePhotoSelect} />

        {/* Before photos */}
        {beforePhotos.length > 0 && (
          <div className="mb-3">
            <p className="text-xs font-bold uppercase tracking-wider text-secondary-400 mb-2">Before ({beforePhotos.length})</p>
            <div className="grid grid-cols-3 gap-2">
              {beforePhotos.map(p => (
                <div key={p.id} className="aspect-square rounded-xl overflow-hidden bg-secondary-100 relative">
                  <img src={p.photo_url} alt={p.caption ?? 'Before'} className="w-full h-full object-cover" />
                  {p.caption && <div className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-[9px] p-1 truncate">{p.caption}</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* After photos */}
        {afterPhotos.length > 0 && (
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-secondary-400 mb-2">After ({afterPhotos.length})</p>
            <div className="grid grid-cols-3 gap-2">
              {afterPhotos.map(p => (
                <div key={p.id} className="aspect-square rounded-xl overflow-hidden bg-secondary-100 relative">
                  <img src={p.photo_url} alt={p.caption ?? 'After'} className="w-full h-full object-cover" />
                  {p.caption && <div className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-[9px] p-1 truncate">{p.caption}</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {photos.length === 0 && (
          <div className="text-center py-4 text-secondary-400 text-sm">
            <ImageIcon className="w-8 h-8 mx-auto mb-2 text-secondary-200" />
            No photos yet
          </div>
        )}
      </Section>

      {/* Issues */}
      <Section title="Report an Issue" icon={AlertTriangle} badge={issues.length} defaultOpen={false}>
        {!showIssueForm ? (
          <button onClick={() => setShowIssueForm(true)}
            className="w-full h-10 border-2 border-dashed border-secondary-200 rounded-xl text-sm font-semibold text-secondary-500 hover:border-primary-300 hover:text-primary-600 flex items-center justify-center gap-2 transition-colors">
            <Plus className="w-4 h-4" /> Report New Issue
          </button>
        ) : (
          <div className="space-y-3">
            <input value={issueTitle} onChange={e => setIssueTitle(e.target.value)} placeholder="Issue title e.g. Broken cabinet door"
              className="w-full h-10 px-3.5 rounded-xl border border-secondary-200 text-sm text-secondary-800 focus:outline-none focus:ring-2 focus:ring-primary-300" />
            <textarea value={issueDesc} onChange={e => setIssueDesc(e.target.value)} rows={2} placeholder="Describe the issue (optional)"
              className="w-full px-3.5 py-2.5 rounded-xl border border-secondary-200 text-sm text-secondary-800 resize-none focus:outline-none focus:ring-2 focus:ring-primary-300" />
            <div className="flex gap-2">
              {(['low', 'medium', 'high'] as const).map(sev => (
                <button key={sev} onClick={() => setIssueSeverity(sev)}
                  className={cn('flex-1 h-9 rounded-xl text-xs font-bold capitalize transition-all border',
                    issueSeverity === sev
                      ? `${SEVERITY_CFG[sev].bg} ${SEVERITY_CFG[sev].text} ${SEVERITY_CFG[sev].border}`
                      : 'bg-secondary-50 text-secondary-500 border-secondary-100')}>
                  {sev}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={handleSubmitIssue} disabled={!issueTitle.trim() || saving === 'issue'}
                className="flex-1 h-10 bg-secondary-800 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-60">
                {saving === 'issue' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Submit
              </button>
              <button onClick={() => setShowIssueForm(false)}
                className="h-10 px-4 border border-secondary-200 rounded-xl text-sm text-secondary-600 hover:bg-secondary-50">
                Cancel
              </button>
            </div>
          </div>
        )}

        {issues.length > 0 && (
          <div className="mt-3 space-y-2">
            {issues.map(issue => {
              const cfg = SEVERITY_CFG[issue.severity] ?? SEVERITY_CFG.low;
              return (
                <div key={issue.id} className={cn('rounded-xl p-3 border', cfg.bg, cfg.border)}>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={cn('text-[10px] font-bold uppercase', cfg.text)}>{cfg.label}</span>
                    {issue.resolved && <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">Resolved</span>}
                  </div>
                  <p className={cn('font-semibold text-sm', cfg.text)}>{issue.title}</p>
                  {issue.description && <p className={cn('text-xs mt-0.5 opacity-80', cfg.text)}>{issue.description}</p>}
                </div>
              );
            })}
          </div>
        )}
      </Section>

      {/* Job info */}
      <Section title="Job Details" icon={Clock} defaultOpen={false}>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-secondary-500">Reference</span><span className="font-mono font-bold text-primary-600">{booking.reference}</span></div>
          <div className="flex justify-between"><span className="text-secondary-500">Date</span><span className="font-semibold text-secondary-800">{booking.preferred_date}</span></div>
          <div className="flex justify-between"><span className="text-secondary-500">Time window</span><span className="font-semibold text-secondary-800">{TIME_LABELS[booking.preferred_time]}</span></div>
          <div className="flex justify-between"><span className="text-secondary-500">Property</span><span className="font-semibold text-secondary-800">{booking.property_size ?? '—'}</span></div>
          <div className="flex justify-between"><span className="text-secondary-500">Customer</span><span className="font-semibold text-secondary-800">{booking.first_name} {booking.last_name}</span></div>
          {checkin?.duration_minutes && (
            <div className="flex justify-between"><span className="text-secondary-500">Duration</span><span className="font-semibold text-secondary-800">{checkin.duration_minutes} mins</span></div>
          )}
          <div className="flex justify-between pt-2 border-t border-secondary-100">
            <span className="font-bold text-secondary-800">Job Value</span>
            <span className="font-heading font-extrabold text-primary-600">{formatPrice(booking.total_price_pence)}</span>
          </div>
        </div>
      </Section>
    </div>
  );
}
