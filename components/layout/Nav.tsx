'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/lib/supabase-client';

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<{ email: string } | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    async function checkUser() {
      const supabase = getSupabaseBrowserClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user ? { email: user.email || '' } : null);
    }
    checkUser();
    const { data: { subscription } } = getSupabaseBrowserClient().auth.onAuthStateChange(() => checkUser());
    return () => subscription.unsubscribe();
  }, []);

  const links = [
    { href: '/book', label: 'Book Now' },
    { href: '/subscriptions', label: 'Subscriptions' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
      <div className="section flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-brand-600">PureMaids</span>
        </Link>
        <div className="hidden md:flex items-center gap-6">
          {links.map(l => (
            <Link key={l.href} href={l.href} className={`text-sm font-medium transition-colors hover:text-brand-600 ${pathname === l.href ? 'text-brand-600' : 'text-gray-700'}`}>
              {l.label}
            </Link>
          ))}
          {user ? (
            <Link href="/account" className="btn-primary text-sm px-4 py-2">My Account</Link>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-brand-600">Sign In</Link>
              <Link href="/book" className="btn-primary text-sm px-4 py-2">Get Quote</Link>
            </>
          )}
        </div>
        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} /></svg>
        </button>
      </div>
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="section py-4 space-y-3">
            {links.map(l => (
              <Link key={l.href} href={l.href} className="block text-gray-700 hover:text-brand-600" onClick={() => setMobileOpen(false)}>{l.label}</Link>
            ))}
            {user ? (
              <Link href="/account" className="block text-brand-600 font-medium" onClick={() => setMobileOpen(false)}>My Account</Link>
            ) : (
              <Link href="/login" className="block text-brand-600 font-medium" onClick={() => setMobileOpen(false)}>Sign In</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
