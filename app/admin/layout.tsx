'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  CalendarDays,
  ClipboardList,
  Users,
  UserCheck,
  BarChart3,
  FileText,
  LogOut,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';
import { useState } from 'react';
import { AdminProvider, useAdmin } from '@/lib/admin-auth';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/admin',           label: 'Dashboard',   icon: LayoutDashboard },
  { href: '/admin/bookings',  label: 'Bookings',    icon: ClipboardList   },
  { href: '/admin/calendar',  label: 'Calendar',    icon: CalendarDays    },
  { href: '/admin/customers', label: 'Customers',   icon: Users           },
  { href: '/admin/cleaners',  label: 'Cleaners',    icon: UserCheck       },
  { href: '/admin/revenue',   label: 'Revenue',     icon: BarChart3       },
  { href: '/admin/invoices',  label: 'Invoices',    icon: FileText        },
];

function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const { profile, signOut } = useAdmin();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/admin/login');
  };

  return (
    <>
      {/* Overlay (mobile) */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'fixed top-0 left-0 h-full w-64 bg-secondary-900 border-r border-secondary-800 z-30 flex flex-col transition-transform duration-200',
          open ? 'translate-x-0' : '-translate-x-full',
          'lg:translate-x-0 lg:static lg:z-auto',
        )}
      >
        {/* Brand */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-secondary-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-heading font-bold text-white text-sm leading-none">PureMaids</p>
              <p className="text-secondary-500 text-[10px] mt-0.5">Admin Portal</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden text-secondary-500 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== '/admin' && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                  active
                    ? 'bg-primary-500/15 text-primary-400'
                    : 'text-secondary-400 hover:text-white hover:bg-secondary-800',
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="px-3 pb-4 border-t border-secondary-800 pt-4">
          <div className="px-3 py-2 mb-1">
            <p className="text-white text-sm font-semibold truncate">{profile?.full_name || 'Admin'}</p>
            <p className="text-secondary-500 text-xs capitalize">{profile?.role}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-secondary-400 hover:text-red-400 hover:bg-red-900/20 transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}

function AdminShell({ children }: { children: ReactNode }) {
  const { isAdmin, loading } = useAdmin();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !isAdmin && pathname !== '/admin/login') {
      router.replace('/admin/login');
    }
  }, [isAdmin, loading, pathname, router]);

  if (pathname === '/admin/login' || pathname === '/admin/setup') return <>{children}</>;
  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!isAdmin) return null;

  return (
    <div className="flex h-screen bg-secondary-50 overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile topbar */}
        <header className="lg:hidden flex items-center gap-3 px-4 py-3.5 bg-white border-b border-secondary-100 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-secondary-600 hover:text-secondary-800"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-heading font-bold text-secondary-800">PureMaids Admin</span>
        </header>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminProvider>
      <AdminShell>{children}</AdminShell>
    </AdminProvider>
  );
}
