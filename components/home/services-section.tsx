import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { SERVICES } from '@/lib/constants';

const details = [
  {
    slug: 'domestic-cleaning',
    tagline: 'House cleaning Bolton',
    description: 'Regular weekly or fortnightly domestic cleaning across Bolton, Manchester and Bury. Your dedicated cleaner learns your home and delivers consistent, spotless results every visit.',
    features: ['Same cleaner every visit', 'Custom checklist for your home', 'Flexible reschedule anytime'],
    image: 'https://images.pexels.com/photos/4108741/pexels-photo-4108741.jpeg',
    from: '£59',
    accent: '#00AEEF',
    accentLight: '#e6f7fd',
  },
  {
    slug: 'deep-cleaning',
    tagline: 'Deep cleaning Bolton',
    description: 'Top-to-bottom intensive deep clean for homes across the North West. Inside appliances, behind furniture, skirting boards, carpets — nothing missed, every time.',
    features: ['Inside oven, fridge & microwave', 'Skirting boards & coving', '100% satisfaction guarantee'],
    image: 'https://images.pexels.com/photos/6195130/pexels-photo-6195130.jpeg',
    from: '£129',
    accent: '#10B981',
    accentLight: '#ecfdf5',
  },
  {
    slug: 'end-of-tenancy-cleaning',
    tagline: 'End of tenancy Bolton',
    description: 'Move-out cleans across Bolton and Manchester to landlord and letting agent standards. Deposit-back guaranteed — or we re-clean free of charge within 48 hours.',
    features: ['Deposit-back guarantee', 'Letting agent approved checklist', 'Full written certificate'],
    image: 'https://images.pexels.com/photos/7534761/pexels-photo-7534761.jpeg',
    from: '£149',
    accent: '#F59E0B',
    accentLight: '#fffbeb',
  },
  {
    slug: 'office-cleaning',
    tagline: 'Office cleaning Bolton',
    description: 'Professional office and commercial cleaning across Bolton and Manchester. Flexible scheduling including early-morning and after-hours cleans to suit your business.',
    features: ['After-hours & weekend available', 'Supply restocking included', 'COSHH-compliant products'],
    image: 'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg',
    from: '£99',
    accent: '#8B5CF6',
    accentLight: '#f5f3ff',
  },
];

export default function ServicesSection() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-4">

        {/* Section header */}
        <div className="mb-14 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <span className="mb-3 inline-block text-sm font-bold uppercase tracking-widest text-primary-500">
              Our Services
            </span>
            <h2 className="font-heading text-4xl font-extrabold leading-[1.1] text-secondary-800 md:text-5xl">
              Professional Cleaning Services<br />Bolton &amp; Greater Manchester
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-secondary-500 md:text-right">
            Serving Bolton, Manchester, Bury, Wigan, Preston and all surrounding areas.
          </p>
        </div>

        {/* 2×2 card grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {SERVICES.map((svc) => {
            const d = details.find((x) => x.slug === svc.slug)!;
            return (
              <Link
                key={svc.slug}
                href={`/${svc.slug}`}
                className="group relative flex flex-col overflow-hidden rounded-3xl border border-secondary-100 bg-white transition-all duration-500 hover:border-transparent hover:shadow-[0_24px_64px_-12px_rgba(0,0,0,0.16)]"
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={d.image}
                    alt={svc.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary-900/65 via-secondary-900/15 to-transparent" />

                  {/* Floating label */}
                  <div className="absolute left-4 bottom-4">
                    <span
                      className="rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white"
                      style={{ backgroundColor: d.accent }}
                    >
                      {d.tagline}
                    </span>
                  </div>

                  {/* Price badge */}
                  <div className="absolute right-4 top-4 rounded-full bg-white/95 px-3 py-1.5 shadow-lg">
                    <span className="text-xs font-semibold text-secondary-500">from </span>
                    <span className="font-heading text-sm font-bold text-secondary-800">{d.from}</span>
                  </div>
                </div>

                {/* Body */}
                <div className="flex flex-1 flex-col p-7">
                  <h3 className="font-heading mb-2 text-xl font-bold text-secondary-800 transition-colors duration-200 group-hover:text-primary-600">
                    {svc.name}
                  </h3>
                  <p className="mb-5 text-sm leading-relaxed text-secondary-500">{d.description}</p>

                  <ul className="mb-6 flex-1 space-y-2.5">
                    {d.features.map((f) => (
                      <li key={f} className="flex items-center gap-2.5 text-sm text-secondary-600">
                        <CheckCircle className="h-4 w-4 shrink-0" style={{ color: d.accent }} />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center gap-1.5 text-sm font-bold text-primary-600 transition-all duration-200 group-hover:gap-3">
                    Find out more <ArrowRight className="h-4 w-4" />
                  </div>
                </div>

                {/* Animated bottom border */}
                <span
                  className="absolute bottom-0 left-0 h-0.5 w-0 transition-all duration-500 group-hover:w-full"
                  style={{ backgroundColor: d.accent }}
                />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
