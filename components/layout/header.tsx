'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Phone, Menu, X, ChevronDown, User, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SITE_CONFIG, SERVICES } from '@/lib/constants';
import { supabase } from '@/lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

const navLinks = [
  {
    label: 'Services',
    href: '#',
    children: SERVICES.map((s) => ({ label: s.name, href: `/${s.slug}` })),
  },
  { label: 'Pricing', href: '/pricing' },
  { label: 'About', href: '/about' },
  { label: 'Areas', href: '/areas' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [authUser, setAuthUser] = useState<SupabaseUser | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setAuthUser(session?.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setAuthUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <>
      {/* Top bar */}
      <div className="bg-secondary-700 text-white text-xs py-2 hidden md:block">
        <div className="container mx-auto px-4 flex justify-between items-center max-w-7xl">
          <span className="text-secondary-300">Trusted by 10,000+ happy customers across London</span>
          <div className="flex items-center gap-6">
            <a href={`tel:${SITE_CONFIG.phone.replace(/\s/g,'')}`} className="flex items-center gap-1.5 hover:text-primary-300 transition-colors">
              <Phone className="w-3 h-3" />
              {SITE_CONFIG.phone}
            </a>
            <a href={`mailto:${SITE_CONFIG.email}`} className="hover:text-primary-300 transition-colors">
              {SITE_CONFIG.email}
            </a>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header
        className={cn(
          'sticky top-0 z-50 w-full transition-all duration-300',
          isScrolled
            ? 'bg-white shadow-medium'
            : 'bg-white'
        )}
      >
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-between h-16 md:h-18">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center shadow-sm group-hover:bg-primary-600 transition-colors">
                <span className="text-white font-heading font-bold text-sm">PM</span>
              </div>
              <span className="font-heading font-bold text-xl text-secondary-800">
                Pure<span className="text-primary-500">Maids</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) =>
                link.children ? (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={() => setServicesOpen(true)}
                    onMouseLeave={() => setServicesOpen(false)}
                  >
                    <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-secondary-600 hover:text-primary-600 transition-colors rounded-lg hover:bg-primary-50">
                      {link.label}
                      <ChevronDown className={cn('w-3.5 h-3.5 transition-transform duration-200', servicesOpen && 'rotate-180')} />
                    </button>
                    {servicesOpen && (
                      <div className="absolute top-full left-0 w-56 bg-white rounded-2xl shadow-large border border-secondary-100 py-2 mt-1">
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="flex items-center px-4 py-2.5 text-sm text-secondary-600 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="px-3 py-2 text-sm font-medium text-secondary-600 hover:text-primary-600 transition-colors rounded-lg hover:bg-primary-50"
                  >
                    {link.label}
                  </Link>
                )
              )}
            </nav>

            {/* CTA buttons */}
            <div className="hidden md:flex items-center gap-3">
              <a
                href={`tel:${SITE_CONFIG.phone.replace(/\s/g,'')}`}
                className="flex items-center gap-2 text-sm font-semibold text-secondary-700 hover:text-primary-600 transition-colors"
              >
                <Phone className="w-4 h-4 text-primary-500" />
                {SITE_CONFIG.phone}
              </a>
              {authUser
                ? (
                  <Link href="/account"
                    className="flex items-center gap-1.5 text-sm font-semibold text-secondary-700 hover:text-primary-600 transition-colors px-3 py-1.5 rounded-xl border border-secondary-200 hover:border-primary-200 hover:bg-primary-50">
                    <User className="w-4 h-4" /> My Account
                  </Link>
                )
                : (
                  <Link href="/login"
                    className="flex items-center gap-1.5 text-sm font-semibold text-secondary-600 hover:text-primary-600 transition-colors">
                    <LogIn className="w-4 h-4" /> Sign In
                  </Link>
                )}
              <Link href="/book-online">
                <Button size="md">Book Online</Button>
              </Link>
            </div>

            {/* Mobile menu toggle */}
            <button
              className="lg:hidden p-2 rounded-lg text-secondary-600 hover:bg-secondary-50"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-secondary-100 bg-white">
            <div className="container mx-auto px-4 py-4 max-w-7xl">
              <a
                href={`tel:${SITE_CONFIG.phone.replace(/\s/g,'')}`}
                className="flex items-center gap-2 p-3 mb-2 rounded-xl bg-primary-50 text-primary-700 font-semibold"
              >
                <Phone className="w-4 h-4" />
                {SITE_CONFIG.phone}
              </a>
              {navLinks.map((link) =>
                link.children ? (
                  <div key={link.label}>
                    <div className="px-3 py-2 text-xs font-semibold text-secondary-400 uppercase tracking-wider mt-2">
                      {link.label}
                    </div>
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block px-4 py-2.5 text-sm text-secondary-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        onClick={() => setMobileOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block px-4 py-2.5 text-sm text-secondary-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                )
              )}
              {authUser
                ? (
                  <Link href="/account" className="flex items-center gap-2 p-3 mt-2 rounded-xl bg-secondary-50 text-secondary-700 font-semibold" onClick={() => setMobileOpen(false)}>
                    <User className="w-4 h-4" /> My Account
                  </Link>
                )
                : (
                  <Link href="/login" className="flex items-center gap-2 p-3 mt-2 rounded-xl bg-secondary-50 text-secondary-700 font-semibold" onClick={() => setMobileOpen(false)}>
                    <LogIn className="w-4 h-4" /> Sign In
                  </Link>
                )}
              <Link href="/book-online" className="block mt-3">
                <Button className="w-full" size="lg" onClick={() => setMobileOpen(false)}>
                  Book Online
                </Button>
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
