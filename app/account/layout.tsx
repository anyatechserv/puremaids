'use client';

import { useEffect, type ReactNode, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard, CalendarDays, MapPin, FileText,
  Star, Gift, LogOut, Menu, X, Sparkles, User,
} from 'lucide-react';
import { CustomerProvider, useCustomer } from '@/lib/customer-auth';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/account',           label: 'My Account',   icon: LayoutDashboard },
  { href: '/account/bookings',  label: 'My Bookings',  icon: CalendarDays    },
  { href: '/account/addresses', label: 'Addresses',    icon: MapPin          },
  { href: '/account/invoices',  label: 'Invoices',     icon: FileText        },
  { href: '/account/reviews',   label: 'My Reviews',   icon: Star            },
  { href: '/account/refer',     label: 'Refer a Friend', icon: Gift          },
];

function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const { profile, user, signOut } = useCustomer();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()
    : user?.email?.[0]?.toUpperCase() ?? 'U';

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/40 z-20 lg:hidden" onClick={onClose} />}
      <aside className={cn(
        'fixed top-0 left-0 h-full w-64 bg-white border-r border-secondary-100 z-30 flex flex-col transition-transform duration-200',
        open ? 'translate-x-0' : '-translate-x-full',
        'lg:translate-x-0 lg:static lg:z-auto',
      )}>
        {/* Brand */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-secondary-100">
          <Link href="/" className="flex items-center gap-2.5" onClick={onClose}>
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-heading font-bold text-secondary-800 text-sm">My Account</span>
          </Link>
          <button onClick={onClose} className="lg:hidden text-secondary-400 hover:text-secondary-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User avatar */}
        <div className="px-4 py-4 border-b border-secondary-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center shrink-0">
              <span className="text-white font-heading font-bold text-sm">{initials}</span>
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm text-secondary-800 truncate">{profile?.full_name || 'My Account'}</p>
              <p className="text-xs text-secondary-400 truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== '/account' && pathname.startsWith(href));
            return (
              <Link key={href} href={href} onClick={onClose}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                  active ? 'bg-primary-50 text-primary-600' : 'text-secondary-500 hover:text-secondary-800 hover:bg-secondary-50',
                )}>
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Sign out */}
        <div className="px-3 pb-4 border-t border-secondary-100 pt-3">
          <button onClick={handleSignOut}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-secondary-400 hover:text-red-500 hover:bg-red-50 transition-colors">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}

function AccountShell({ children }: { children: ReactNode }) {
  const { user, loading } = useCustomer();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [user, loading, pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-secondary-50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile topbar */}
        <header className="lg:hidden flex items-center gap-3 px-4 py-3.5 bg-white border-b border-secondary-100 sticky top-0 z-10">
          <button onClick={() => setSidebarOpen(true)} className="text-secondary-600">
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-heading font-bold text-secondary-800">My Account</span>
        </header>
        <main className="flex-1 p-4 md:p-8 max-w-screen-lg mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AccountLayout({ children }: { children: ReactNode }) {
  return (
    <CustomerProvider>
      <AccountShell>{children}</AccountShell>
    </CustomerProvider>
  );
}
