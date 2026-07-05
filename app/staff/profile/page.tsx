'use client';

import { useStaff } from '@/lib/staff-auth';
import { useRouter } from 'next/navigation';
import {
  User, Phone, Mail, DollarSign, LogOut, Shield,
  ChevronRight, ExternalLink,
} from 'lucide-react';
import Link from 'next/link';

export default function StaffProfilePage() {
  const { profile, signOut } = useStaff();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/staff/login');
  };

  if (!profile) return null;

  const initials = profile.full_name
    .split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();

  const hourlyRate = (profile.hourly_rate_pence / 100).toFixed(2);

  return (
    <div className="px-4 pt-5 pb-4">
      <h1 className="font-heading font-extrabold text-2xl text-secondary-800 mb-5">Profile</h1>

      {/* Avatar card */}
      <div className="bg-secondary-900 rounded-2xl p-5 mb-4 flex items-center gap-4">
        <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center shrink-0">
          <span className="font-heading font-black text-white text-2xl">{initials}</span>
        </div>
        <div>
          <h2 className="font-heading font-extrabold text-xl text-white">{profile.full_name}</h2>
          <p className="text-primary-400 text-sm font-semibold">PureMaids Cleaner</p>
        </div>
      </div>

      {/* Details */}
      <div className="bg-white rounded-2xl border border-secondary-100 shadow-soft overflow-hidden mb-4">
        <div className="px-4 py-3 border-b border-secondary-50">
          <p className="text-xs font-bold uppercase tracking-wider text-secondary-400">Contact Details</p>
        </div>
        {[
          { icon: Mail,       label: 'Email',       value: profile.email ?? 'Not set'   },
          { icon: Phone,      label: 'Phone',       value: profile.phone ?? 'Not set'   },
          { icon: DollarSign, label: 'Hourly Rate', value: `£${hourlyRate}/hr`           },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center gap-3 px-4 py-3.5 border-b border-secondary-50 last:border-0">
            <div className="w-8 h-8 bg-secondary-50 rounded-lg flex items-center justify-center shrink-0">
              <Icon className="w-3.5 h-3.5 text-secondary-500" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-secondary-400">{label}</p>
              <p className="font-semibold text-sm text-secondary-800">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="bg-white rounded-2xl border border-secondary-100 shadow-soft overflow-hidden mb-4">
        <div className="px-4 py-3 border-b border-secondary-50">
          <p className="text-xs font-bold uppercase tracking-wider text-secondary-400">Quick Links</p>
        </div>
        {[
          { href: '/staff/earnings',      label: 'My Earnings',      icon: DollarSign  },
          { href: '/staff/notifications', label: 'Notifications',    icon: Shield      },
        ].map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href}
            className="flex items-center gap-3 px-4 py-3.5 border-b border-secondary-50 last:border-0 hover:bg-secondary-50 transition-colors">
            <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center shrink-0">
              <Icon className="w-3.5 h-3.5 text-primary-500" />
            </div>
            <span className="flex-1 font-semibold text-sm text-secondary-800">{label}</span>
            <ChevronRight className="w-4 h-4 text-secondary-300" />
          </Link>
        ))}
        <a href="tel:08000123456"
          className="flex items-center gap-3 px-4 py-3.5 hover:bg-secondary-50 transition-colors">
          <div className="w-8 h-8 bg-secondary-50 rounded-lg flex items-center justify-center shrink-0">
            <Phone className="w-3.5 h-3.5 text-secondary-500" />
          </div>
          <span className="flex-1 font-semibold text-sm text-secondary-800">Call Office</span>
          <ExternalLink className="w-4 h-4 text-secondary-300" />
        </a>
      </div>

      {/* Sign out */}
      <button onClick={handleSignOut}
        className="w-full h-12 flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 font-bold rounded-2xl transition-colors">
        <LogOut className="w-4 h-4" />
        Sign Out
      </button>

      <p className="text-center text-secondary-400 text-xs mt-5">PureMaids Staff App · v1.0</p>
    </div>
  );
}
