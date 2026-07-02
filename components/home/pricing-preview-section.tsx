import React from 'react';
import Link from 'next/link';
import { CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const services = [
  {
    name: 'Domestic Cleaning',
    description: 'Regular weekly or fortnightly home cleaning',
    from: '£59',
    popular: false,
    color: 'border-primary-200',
    badge: '',
    features: ['Same cleaner every visit', 'Flexible scheduling', 'All products included'],
    href: '/domestic-cleaning',
  },
  {
    name: 'Deep Cleaning',
    description: 'Thorough top-to-bottom clean of your entire home',
    from: '£129',
    popular: true,
    color: 'border-primary-500',
    badge: 'Most Booked',
    features: ['Inside appliances', 'Behind furniture', 'Satisfaction guarantee'],
    href: '/deep-cleaning',
  },
  {
    name: 'End of Tenancy',
    description: 'Deposit-back guaranteed move-out clean',
    from: '£149',
    popular: false,
    color: 'border-amber-200',
    badge: '',
    features: ['Landlord approved', 'Re-clean guarantee', 'Certificate included'],
    href: '/end-of-tenancy-cleaning',
  },
  {
    name: 'Office Cleaning',
    description: 'Professional commercial cleaning solutions',
    from: '£99',
    popular: false,
    color: 'border-violet-200',
    badge: '',
    features: ['After-hours available', 'Supply restocking', 'Flexible contracts'],
    href: '/office-cleaning',
  },
];

export default function PricingPreviewSection() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-14">
          <span className="inline-block text-primary-500 font-semibold text-sm uppercase tracking-widest mb-3">
            Pricing Preview
          </span>
          <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-secondary-800 leading-tight mb-4">
            Transparent Prices, No Surprises
          </h2>
          <p className="text-secondary-500 max-w-lg mx-auto text-base leading-relaxed">
            Fixed, all-inclusive pricing. No hidden fees, no call-out charges. All prices include VAT.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {services.map((svc) => (
            <div
              key={svc.name}
              className={`relative rounded-2xl border-2 ${svc.color} p-6 flex flex-col ${svc.popular ? 'shadow-medium' : 'hover:shadow-soft'} transition-shadow duration-300`}
            >
              {svc.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="bg-primary-500 text-white text-xs font-bold px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                    <Sparkles className="w-3 h-3" />
                    {svc.badge}
                  </span>
                </div>
              )}

              <div className="mb-4">
                <h3 className="font-heading font-bold text-secondary-800 text-base mb-1">{svc.name}</h3>
                <p className="text-secondary-400 text-xs leading-snug">{svc.description}</p>
              </div>

              <div className="mb-5">
                <span className="text-xs text-secondary-400 font-medium">From</span>
                <div className="font-heading font-bold text-4xl text-secondary-800 leading-none mt-0.5">
                  {svc.from}
                </div>
                <span className="text-xs text-secondary-400">inc. VAT</span>
              </div>

              <ul className="space-y-2 mb-6 flex-1">
                {svc.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-secondary-600">
                    <CheckCircle className="w-3.5 h-3.5 text-accent-500 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link href={svc.href}>
                <Button
                  variant={svc.popular ? 'primary' : 'outline'}
                  size="sm"
                  className="w-full"
                >
                  Learn More
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link href="/pricing">
            <Button size="lg" variant="ghost" className="text-primary-600 hover:text-primary-700 hover:bg-primary-50">
              Use our full instant quote calculator
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
