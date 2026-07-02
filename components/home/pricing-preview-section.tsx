import React from 'react';
import Link from 'next/link';
import { CheckCircle, ArrowRight, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const plans = [
  {
    name: 'Domestic Cleaning',
    sub: 'Weekly or fortnightly',
    from: '£59',
    tag: null,
    features: ['Same cleaner every visit', 'Flexible scheduling', 'All products included'],
    href: '/domestic-cleaning',
    borderClass: 'border-secondary-150',
    btnVariant: 'outline' as const,
  },
  {
    name: 'Deep Cleaning',
    sub: 'One-off thorough clean',
    from: '£129',
    tag: 'Most Popular',
    features: ['Inside appliances', 'Behind furniture', 'Guarantee included'],
    href: '/deep-cleaning',
    borderClass: 'border-primary-400',
    btnVariant: 'primary' as const,
  },
  {
    name: 'End of Tenancy',
    sub: 'Deposit-back guaranteed',
    from: '£149',
    tag: null,
    features: ['Landlord approved', 'Re-clean if needed', 'Certificate issued'],
    href: '/end-of-tenancy-cleaning',
    borderClass: 'border-secondary-150',
    btnVariant: 'outline' as const,
  },
  {
    name: 'Office Cleaning',
    sub: 'Commercial solutions',
    from: '£99',
    tag: null,
    features: ['After-hours available', 'Supply restocking', 'Bespoke contracts'],
    href: '/office-cleaning',
    borderClass: 'border-secondary-150',
    btnVariant: 'outline' as const,
  },
];

export default function PricingPreviewSection() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-4">

        <div className="mb-14 text-center">
          <span className="mb-3 inline-block text-sm font-bold uppercase tracking-widest text-primary-500">
            Transparent Pricing
          </span>
          <h2 className="font-heading text-4xl font-extrabold leading-tight text-secondary-800 md:text-5xl mb-4">
            No Hidden Fees. Ever.
          </h2>
          <p className="mx-auto max-w-lg text-base leading-relaxed text-secondary-500">
            Fixed, all-inclusive pricing. What you see is what you pay — all prices include VAT.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl border-2 ${plan.borderClass} p-6 transition-shadow duration-300 ${plan.tag ? 'shadow-[0_8px_30px_-6px_rgba(0,174,239,0.25)]' : 'hover:shadow-soft'}`}
            >
              {plan.tag && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary-500 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm">
                    <Zap className="h-3 w-3" />
                    {plan.tag}
                  </span>
                </div>
              )}

              <div className="mb-4">
                <h3 className="font-heading mb-0.5 text-base font-bold text-secondary-800">{plan.name}</h3>
                <p className="text-xs text-secondary-400">{plan.sub}</p>
              </div>

              <div className="mb-5">
                <p className="text-xs font-medium text-secondary-400">From</p>
                <p className="font-heading text-4xl font-extrabold leading-none text-secondary-800">{plan.from}</p>
                <p className="mt-0.5 text-[11px] text-secondary-400">inc. VAT</p>
              </div>

              <ul className="mb-6 flex-1 space-y-2.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-secondary-600">
                    <CheckCircle className="h-3.5 w-3.5 shrink-0 text-accent-500" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link href={plan.href}>
                <Button variant={plan.btnVariant} size="sm" className="w-full">
                  Learn More
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link href="/pricing">
            <Button variant="ghost" size="lg" className="text-primary-600 hover:bg-primary-50 hover:text-primary-700">
              Use our full instant quote calculator
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
