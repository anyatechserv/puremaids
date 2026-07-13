import Link from 'next/link';
import { BUSINESS, SERVICE_AREAS } from '@/lib/constants';

const SERVICES_LINKS = [
  { href: '/services/domestic-cleaning', label: 'Domestic Cleaning' },
  { href: '/services/deep-cleaning', label: 'Deep Cleaning' },
  { href: '/services/end-of-tenancy', label: 'End of Tenancy' },
  { href: '/services/office-cleaning', label: 'Office Cleaning' },
  { href: '/subscriptions', label: 'Subscription Plans' },
];

const COMPANY_LINKS = [
  { href: '/about', label: 'About Us' },
  { href: '/areas', label: 'Areas We Cover' },
  { href: '/faq', label: 'FAQs' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];

const LEGAL_LINKS = [
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms & Conditions' },
  { href: '/cookies', label: 'Cookie Policy' },
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300" role="contentinfo">
      <div className="container py-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5" aria-label="PureMaids home">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600">
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-white" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9" />
                </svg>
              </div>
              <span className="font-display text-xl font-bold text-white">{BUSINESS.name}</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed">
              Professional cleaning services across Bolton, Manchester, and Greater Manchester. Trusted by 2,400+ customers since 2018.
            </p>
            <div className="mt-6 space-y-2 text-sm">
              <a href={`tel:${BUSINESS.phone}`} className="flex items-center gap-2 hover:text-white transition-colors">
                <svg className="h-4 w-4 text-brand-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {BUSINESS.phone}
              </a>
              <a href={`mailto:${BUSINESS.email}`} className="flex items-center gap-2 hover:text-white transition-colors">
                <svg className="h-4 w-4 text-brand-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {BUSINESS.email}
              </a>
              <p className="flex items-start gap-2">
                <svg className="h-4 w-4 mt-0.5 text-brand-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {BUSINESS.address}
              </p>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Services</h3>
            <ul className="mt-4 space-y-2" role="list">
              {SERVICES_LINKS.map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Company</h3>
            <ul className="mt-4 space-y-2" role="list">
              {COMPANY_LINKS.map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Areas</h3>
              <p className="mt-2 text-sm">
                {SERVICE_AREAS.join(' · ')}
              </p>
            </div>
          </div>

          {/* Trust */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Trusted & Certified</h3>
            <div className="mt-4 space-y-3">
              {['DBS Checked Staff', 'Fully Insured', 'ICO Registered', 'Trustpilot 4.9★'].map(badge => (
                <div key={badge} className="flex items-center gap-2 text-sm">
                  <svg className="h-4 w-4 text-brand-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.7 5.3a1 1 0 010 1.4l-8 8a1 1 0 01-1.4 0l-4-4a1 1 0 011.4-1.4L8 12.6l7.3-7.3a1 1 0 011.4 0z" clipRule="evenodd" />
                  </svg>
                  {badge}
                </div>
              ))}
            </div>
            <div className="mt-6">
              <p className="text-xs text-gray-500">
                Company No. {BUSINESS.companiesHouse}<br />
                VAT No. {BUSINESS.vatNumber}<br />
                ICO Registration: ZB123456
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm">
            © {new Date().getFullYear()} {BUSINESS.name} Ltd. All rights reserved.
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-1" role="list">
            {LEGAL_LINKS.map(l => (
              <li key={l.href}>
                <Link href={l.href} className="text-xs text-gray-500 hover:text-gray-300 transition-colors">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
