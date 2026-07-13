'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BUSINESS } from '@/lib/constants';

const NAV = [
  { href: '/services',      label: 'Services'      },
  { href: '/subscriptions', label: 'Plans'         },
  { href: '/areas',         label: 'Areas'         },
  { href: '/about',         label: 'About'         },
  { href: '/contact',       label: 'Contact'       },
];

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-white" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9" />
    </svg>
  );
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // Close mobile menu on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const headerBg = scrolled
    ? 'bg-white/95 shadow-sm backdrop-blur-md'
    : 'bg-transparent';

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${headerBg}`} role="banner">
      <nav
        className="container flex h-16 items-center justify-between sm:h-20"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0" aria-label={`${BUSINESS.name} — home`}>
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600" aria-hidden="true">
            <HomeIcon />
          </span>
          <span className={`font-display text-xl font-bold transition-colors ${scrolled ? 'text-gray-900' : 'text-gray-900'}`}>
            {BUSINESS.name}
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-0.5" role="list">
          {NAV.map(l => (
            <Link
              key={l.href}
              href={l.href}
              role="listitem"
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-brand-50 hover:text-brand-700"
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href={`tel:${BUSINESS.phone}`}
            className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-brand-700 transition-colors"
            aria-label={`Call us on ${BUSINESS.phone}`}
          >
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span className="hidden lg:inline">{BUSINESS.phone}</span>
          </a>
          <Link href="/book" className="btn btn-md btn-primary">
            Get a Quote
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(v => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 hover:bg-gray-100 transition md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
        >
          {open
            ? <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            : <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
          }
        </button>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div
          id="mobile-menu"
          className="animate-slide-down border-t border-gray-100 bg-white md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <div className="container py-4 space-y-1">
            {NAV.map(l => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block rounded-xl px-4 py-3 text-base font-medium text-gray-700 hover:bg-brand-50 hover:text-brand-700 transition-colors"
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-3 space-y-2 border-t border-gray-100 pt-3">
              <a
                href={`tel:${BUSINESS.phone}`}
                className="flex items-center gap-2 rounded-xl px-4 py-3 text-base font-medium text-gray-700 hover:bg-brand-50"
              >
                <svg className="h-5 w-5 text-brand-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {BUSINESS.phone}
              </a>
              <Link
                href="/book"
                onClick={() => setOpen(false)}
                className="btn btn-md btn-primary w-full"
              >
                Get a Free Quote
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
