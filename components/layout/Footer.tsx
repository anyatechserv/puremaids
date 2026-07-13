import Link from 'next/link';
import { BUSINESS, SERVICE_AREAS } from '@/lib/constants';

const SERVICES_LINKS = [
  { href: '/services/domestic-cleaning',  label: 'Domestic Cleaning' },
  { href: '/services/deep-cleaning',      label: 'Deep Cleaning' },
  { href: '/services/end-of-tenancy',     label: 'End of Tenancy' },
  { href: '/services/office-cleaning',    label: 'Office Cleaning' },
  { href: '/subscriptions',               label: 'Subscription Plans' },
];
const COMPANY_LINKS = [
  { href: '/about',   label: 'About Us' },
  { href: '/areas',   label: 'Areas We Cover' },
  { href: '/faq',     label: 'FAQs' },
  { href: '/contact', label: 'Contact' },
];
const LEGAL_LINKS = [
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms',   label: 'Terms & Conditions' },
  { href: '/cookies', label: 'Cookie Policy' },
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300" role="contentinfo">
      <div className="container py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2.5" aria-label={`${BUSINESS.name} — home`}>
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-white" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9" />
                </svg>
              </span>
              <span className="font-display text-xl font-bold text-white">{BUSINESS.name}</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-gray-400">
              Professional cleaning across Bolton, Manchester, and Greater Manchester. Trusted by 2,400+ customers since 2018.
            </p>
            <address className="mt-5 not-italic space-y-2 text-sm text-gray-400">
              <p><a href={`tel:${BUSINESS.phone}`} className="hover:text-white transition-colors">{BUSINESS.phone}</a></p>
              <p><a href={`mailto:${BUSINESS.email}`} className="hover:text-white transition-colors">{BUSINESS.email}</a></p>
              <p>{BUSINESS.address}</p>
            </address>
          </div>

          {/* Services */}
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Services</h2>
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
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Company</h2>
            <ul className="mt-4 space-y-2" role="list">
              {COMPANY_LINKS.map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
            <h2 className="mt-6 text-sm font-semibold uppercase tracking-wider text-gray-400">Areas</h2>
            <p className="mt-2 text-sm text-gray-400">{SERVICE_AREAS.join(' · ')}</p>
          </div>

          {/* Trust */}
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Trusted & Certified</h2>
            <ul className="mt-4 space-y-2.5" role="list">
              {['DBS Checked Staff', 'Fully Insured (£5m)', 'ICO Registered', 'Trustpilot 4.9★', '100% Satisfaction Guarantee'].map(t => (
                <li key={t} className="flex items-center gap-2 text-sm">
                  <svg className="h-4 w-4 shrink-0 text-brand-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {t}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-xs text-gray-600">
              Co. No. {BUSINESS.companiesHouse}<br />
              VAT No. {BUSINESS.vatNumber}<br />
              ICO: {BUSINESS.icoNumber}
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-800 pt-8 sm:flex-row">
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} {BUSINESS.name} Ltd. All rights reserved.</p>
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-1" role="list">
            {LEGAL_LINKS.map(l => (
              <li key={l.href}>
                <Link href={l.href} className="text-xs text-gray-600 hover:text-gray-300 transition-colors">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
