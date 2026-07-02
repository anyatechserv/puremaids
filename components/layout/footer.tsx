import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, CheckCircle } from 'lucide-react';

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}

function TwitterXIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}
import { SITE_CONFIG, SERVICES } from '@/lib/constants';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary-800 text-white">
      {/* CTA strip */}
      <div className="bg-primary-500 py-10">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="font-heading font-bold text-white text-2xl md:text-3xl">
                Ready for a spotless home?
              </h2>
              <p className="text-primary-100 mt-1">Get an instant quote in under 60 seconds.</p>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <a
                href={`tel:${SITE_CONFIG.phone.replace(/\s/g,'')}`}
                className="flex items-center gap-2 bg-white text-primary-600 font-semibold px-5 py-3 rounded-xl hover:bg-primary-50 transition-colors"
              >
                <Phone className="w-4 h-4" />
                Call Us Free
              </a>
              <Link
                href="/book-online"
                className="flex items-center gap-2 bg-secondary-700 text-white font-semibold px-5 py-3 rounded-xl hover:bg-secondary-800 transition-colors"
              >
                Book Online
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="py-14">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Brand */}
            <div className="lg:col-span-1">
              <Link href="/" className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-heading font-bold text-sm">PM</span>
                </div>
                <span className="font-heading font-bold text-xl text-white">
                  Pure<span className="text-primary-400">Maids</span>
                </span>
              </Link>
              <p className="text-secondary-300 text-sm leading-relaxed mb-5">
                London&apos;s most trusted professional cleaning service. Fully insured, background-checked cleaners delivering spotless results.
              </p>
              <div className="space-y-2.5">
                <a href={`tel:${SITE_CONFIG.phone.replace(/\s/g,'')}`} className="flex items-center gap-2.5 text-sm text-secondary-300 hover:text-primary-400 transition-colors">
                  <Phone className="w-4 h-4 text-primary-400 flex-shrink-0" />
                  {SITE_CONFIG.phone}
                </a>
                <a href={`mailto:${SITE_CONFIG.email}`} className="flex items-center gap-2.5 text-sm text-secondary-300 hover:text-primary-400 transition-colors">
                  <Mail className="w-4 h-4 text-primary-400 flex-shrink-0" />
                  {SITE_CONFIG.email}
                </a>
                <div className="flex items-center gap-2.5 text-sm text-secondary-300">
                  <MapPin className="w-4 h-4 text-primary-400 flex-shrink-0" />
                  {SITE_CONFIG.address}
                </div>
              </div>
              <div className="flex gap-3 mt-5">
                {[
                  { icon: FacebookIcon, href: SITE_CONFIG.social.facebook, label: 'Facebook' },
                  { icon: InstagramIcon, href: SITE_CONFIG.social.instagram, label: 'Instagram' },
                  { icon: TwitterXIcon, href: SITE_CONFIG.social.twitter, label: 'Twitter' },
                ].map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-8 h-8 bg-secondary-700 hover:bg-primary-500 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Services */}
            <div>
              <h3 className="font-heading font-semibold text-white mb-4 text-sm uppercase tracking-wider">Our Services</h3>
              <ul className="space-y-2.5">
                {SERVICES.map((service) => (
                  <li key={service.slug}>
                    <Link href={`/${service.slug}`} className="text-sm text-secondary-300 hover:text-primary-400 transition-colors flex items-center gap-1.5">
                      <span className="w-1 h-1 bg-primary-400 rounded-full flex-shrink-0" />
                      {service.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <h3 className="font-heading font-semibold text-white mb-4 text-sm uppercase tracking-wider mt-7">Quick Links</h3>
              <ul className="space-y-2.5">
                {[
                  { label: 'Pricing', href: '/pricing' },
                  { label: 'About Us', href: '/about' },
                  { label: 'Areas We Cover', href: '/areas' },
                  { label: 'FAQ', href: '/faq' },
                  { label: 'Contact Us', href: '/contact' },
                ].map(({ label, href }) => (
                  <li key={href}>
                    <Link href={href} className="text-sm text-secondary-300 hover:text-primary-400 transition-colors flex items-center gap-1.5">
                      <span className="w-1 h-1 bg-primary-400 rounded-full flex-shrink-0" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Why PureMaids */}
            <div>
              <h3 className="font-heading font-semibold text-white mb-4 text-sm uppercase tracking-wider">Why PureMaids</h3>
              <ul className="space-y-3">
                {[
                  'Fully insured & DBS checked',
                  'Eco-friendly products',
                  'Flexible scheduling',
                  'Satisfaction guarantee',
                  'No hidden fees',
                  '5-star rated service',
                  'Professional equipment',
                  'Background-verified cleaners',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-secondary-300">
                    <CheckCircle className="w-4 h-4 text-accent-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Certifications */}
            <div>
              <h3 className="font-heading font-semibold text-white mb-4 text-sm uppercase tracking-wider">Trusted & Certified</h3>
              <div className="space-y-3">
                {[
                  { label: 'Fully Insured', sub: 'Public liability up to £5M' },
                  { label: 'DBS Checked', sub: 'All cleaners verified' },
                  { label: 'GDPR Compliant', sub: 'Your data is safe' },
                  { label: 'Eco-Friendly', sub: 'Green cleaning products' },
                ].map((badge) => (
                  <div key={badge.label} className="bg-secondary-700 rounded-xl p-3.5">
                    <div className="font-semibold text-sm text-white">{badge.label}</div>
                    <div className="text-xs text-secondary-400 mt-0.5">{badge.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-secondary-700 py-5">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-secondary-400">
            <p>&copy; {currentYear} PureMaids Ltd. All rights reserved. Registered in England & Wales.</p>
            <div className="flex gap-5">
              {[
                { label: 'Privacy Policy', href: '/privacy' },
                { label: 'Terms of Service', href: '/terms' },
                { label: 'Cookie Policy', href: '/cookies' },
              ].map(({ label, href }) => (
                <Link key={href} href={href} className="hover:text-primary-400 transition-colors">
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
