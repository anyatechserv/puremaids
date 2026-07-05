'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Briefcase, Bell, DollarSign, User as UserIcon, LogOut,
} from 'lucide-react';
import { StaffProvider, useStaff } from '@/lib/staff-auth';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

const NAV = [
  { href: '/staff',              label: 'Jobs',          icon: Briefcase   },
  { href: '/staff/notifications', label: 'Notifications', icon: Bell        },
  { href: '/staff/earnings',     label: 'Earnings',      icon: DollarSign  },
  { href: '/staff/profile',      label: 'Profile',       icon: UserIcon    },
];

function StaffShell({ children }: { children: ReactNode }) {
  const { isStaff, loading, profile, signOut } = useStaff();
  const router = useRouter();
  const pathname = usePathname();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!loading && !isStaff && pathname !== '/staff/login') {
      router.replace('/staff/login');
    }
  }, [isStaff, loading, pathname, router]);

  useEffect(() => {
    if (!profile) return;
    supabase
      .from('cleaner_notifications')
      .select('id', { count: 'exact', head: true })
      .eq('cleaner_id', profile.cleaner_id)
      .eq('read', false)
      .then(({ count }) => setUnread(count ?? 0));
  }, [profile]);

  if (pathname === '/staff/login') return <>{children}</>;

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!isStaff) return null;

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : 'C';

  return (
    <div className="flex flex-col min-h-screen bg-secondary-50 max-w-md mx-auto relative">
      {/* Top bar */}
      <header className="bg-secondary-900 px-4 pt-safe-top pb-3 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3 py-1">
          <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center shrink-0">
            <span className="text-white font-heading font-black text-sm">{initials}</span>
          </div>
          <div>
            <p className="text-white font-semibold text-sm leading-none">{profile?.full_name}</p>
            <p className="text-secondary-400 text-xs mt-0.5">Cleaner Portal</p>
          </div>
        </div>
        <button
          onClick={async () => { await signOut(); router.push('/staff/login'); }}
          className="p-2 rounded-xl text-secondary-400 hover:text-white hover:bg-secondary-800 transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </header>

      {/* Page content */}
      <main className="flex-1 overflow-y-auto pb-24">
        {children}
      </main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-secondary-100 pb-safe-bottom z-20 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        <div className="flex">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = href === '/staff' ? pathname === '/staff' : pathname.startsWith(href);
            const isNotif = href === '/staff/notifications';
            return (
              <Link key={href} href={href}
                className={cn(
                  'flex-1 flex flex-col items-center justify-center gap-0.5 py-3 relative transition-colors',
                  active ? 'text-primary-600' : 'text-secondary-400 hover:text-secondary-600',
                )}>
                <div className="relative">
                  <Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 1.8} />
                  {isNotif && unread > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-[14px] h-3.5 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center px-0.5">
                      {unread > 9 ? '9+' : unread}
                    </span>
                  )}
                </div>
                <span className={cn('text-[10px] font-semibold', active ? 'text-primary-600' : '')}>{label}</span>
                {active && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-primary-500 rounded-full" />}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export default function StaffLayout({ children }: { children: ReactNode }) {
  return (
    <StaffProvider>
      <StaffShell>{children}</StaffShell>
    </StaffProvider>
  );
}
