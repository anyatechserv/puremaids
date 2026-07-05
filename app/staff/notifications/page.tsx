'use client';

import { useEffect, useState, useCallback } from 'react';
import { useStaff } from '@/lib/staff-auth';
import { supabase } from '@/lib/supabase';
import { Bell, BellOff, Check, CheckCheck, Loader2, CalendarDays, AlertTriangle, Briefcase, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Notification {
  id: string; title: string; body: string | null; type: string;
  read: boolean; booking_id: string | null; created_at: string;
}

const TYPE_CFG: Record<string, { icon: React.ComponentType<{ className?: string }>; bg: string; text: string }> = {
  booking:  { icon: Briefcase,     bg: 'bg-blue-100',    text: 'text-blue-600'    },
  reminder: { icon: CalendarDays,  bg: 'bg-amber-100',   text: 'text-amber-600'   },
  alert:    { icon: AlertTriangle, bg: 'bg-red-100',     text: 'text-red-600'     },
  info:     { icon: Info,          bg: 'bg-secondary-100', text: 'text-secondary-500' },
};

function timeAgo(dateStr: string): string {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60)    return 'just now';
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function StaffNotificationsPage() {
  const { profile } = useStaff();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!profile) return;
    const { data } = await supabase
      .from('cleaner_notifications')
      .select('*')
      .eq('cleaner_id', profile.cleaner_id)
      .order('created_at', { ascending: false });
    setNotifications((data as Notification[]) ?? []);
    setLoading(false);
  }, [profile]);

  useEffect(() => { load(); }, [load]);

  const markRead = async (id: string) => {
    await supabase.from('cleaner_notifications').update({ read: true }).eq('id', id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = async () => {
    if (!profile) return;
    await supabase.from('cleaner_notifications')
      .update({ read: true })
      .eq('cleaner_id', profile.cleaner_id)
      .eq('read', false);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unread = notifications.filter(n => !n.read).length;

  return (
    <div className="px-4 pt-5 pb-4">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-secondary-800">Notifications</h1>
          <p className="text-secondary-400 text-sm">{unread > 0 ? `${unread} unread` : 'All caught up'}</p>
        </div>
        {unread > 0 && (
          <button onClick={markAllRead}
            className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl border border-secondary-200 text-secondary-600 hover:bg-secondary-50 font-semibold transition-colors">
            <CheckCheck className="w-3.5 h-3.5" /> Mark all read
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <Loader2 className="w-8 h-8 text-primary-400 animate-spin" />
          <p className="text-secondary-400 text-sm">Loading...</p>
        </div>
      ) : notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <BellOff className="w-12 h-12 text-secondary-200 mb-3" />
          <p className="font-semibold text-secondary-600 mb-1">No notifications yet</p>
          <p className="text-secondary-400 text-sm">Job assignments and reminders will appear here.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map(n => {
            const cfg = TYPE_CFG[n.type] ?? TYPE_CFG.info;
            const Icon = cfg.icon;
            return (
              <div key={n.id}
                onClick={() => !n.read && markRead(n.id)}
                className={cn(
                  'flex items-start gap-3 bg-white rounded-2xl border p-4 transition-all',
                  n.read ? 'border-secondary-100 opacity-70' : 'border-primary-100 shadow-soft cursor-pointer hover:shadow-md',
                )}>
                <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center shrink-0', cfg.bg)}>
                  <Icon className={cn('w-4 h-4', cfg.text)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={cn('font-semibold text-sm', n.read ? 'text-secondary-600' : 'text-secondary-800')}>{n.title}</p>
                    <span className="text-[10px] text-secondary-400 shrink-0">{timeAgo(n.created_at)}</span>
                  </div>
                  {n.body && <p className="text-xs text-secondary-500 mt-0.5 leading-relaxed">{n.body}</p>}
                </div>
                {!n.read && <div className="w-2 h-2 bg-primary-500 rounded-full shrink-0 mt-1" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
