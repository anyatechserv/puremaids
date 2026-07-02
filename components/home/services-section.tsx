import React from 'react';
import Link from 'next/link';
import { Home, Sparkles, Key, Building2, ArrowRight } from 'lucide-react';
import { SERVICES } from '@/lib/constants';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Home,
  Sparkles,
  Key,
  Building2,
};

const serviceDetails = [
  {
    slug: 'domestic-cleaning',
    description: 'Regular weekly or fortnightly cleaning tailored to your home and lifestyle.',
    features: ['Flexible scheduling', 'Same cleaner every visit', 'Your own cleaning checklist'],
    image: 'https://images.pexels.com/photos/4108741/pexels-photo-4108741.jpeg',
    startingFrom: '£59',
  },
  {
    slug: 'deep-cleaning',
    description: 'A thorough top-to-bottom clean covering every corner of your home.',
    features: ['Inside appliances', 'Windows & frames', 'Skirting boards & coving'],
    image: 'https://images.pexels.com/photos/6195130/pexels-photo-6195130.jpeg',
    startingFrom: '£129',
  },
  {
    slug: 'end-of-tenancy-cleaning',
    description: 'Deposit-back guaranteed cleaning when moving out of a rented property.',
    features: ['Deposit-back guarantee', 'Landlord approved', 'Full certificate provided'],
    image: 'https://images.pexels.com/photos/7534761/pexels-photo-7534761.jpeg',
    startingFrom: '£149',
  },
  {
    slug: 'office-cleaning',
    description: 'Keep your workplace spotless with regular professional office cleaning.',
    features: ['After-hours service', 'Supply management', 'Health & safety compliant'],
    image: 'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg',
    startingFrom: '£99',
  },
];

export default function ServicesSection() {
  return (
    <section className="py-20 bg-secondary-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <span className="text-primary-500 font-semibold text-sm uppercase tracking-widest">What We Offer</span>
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-secondary-800 mt-2 mb-3">
            Professional Cleaning Services
          </h2>
          <p className="text-secondary-500 max-w-xl mx-auto leading-relaxed">
            From regular domestic cleaning to specialist deep cleans, we&apos;ve got every inch of your home or office covered.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SERVICES.map((service, i) => {
            const Icon = iconMap[service.icon];
            const detail = serviceDetails.find((d) => d.slug === service.slug)!;

            return (
              <div
                key={service.slug}
                className="group bg-white rounded-3xl overflow-hidden shadow-soft hover:shadow-large transition-all duration-300 hover:-translate-y-1 flex flex-col"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={detail.image}
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary-900/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 flex items-center gap-2">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: service.color }}
                    >
                      <Icon className="w-4.5 h-4.5 text-white w-[18px] h-[18px]" />
                    </div>
                    <span className="text-white font-semibold text-sm">{detail.startingFrom} from</span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="font-heading font-semibold text-secondary-800 text-xl mb-2">
                    {service.name}
                  </h3>
                  <p className="text-secondary-500 text-sm leading-relaxed mb-4">{detail.description}</p>
                  <ul className="space-y-2 mb-5 flex-1">
                    {detail.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-secondary-600">
                        <span className="w-1.5 h-1.5 bg-accent-500 rounded-full flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/${service.slug}`}
                    className="inline-flex items-center gap-1.5 text-primary-600 font-semibold text-sm hover:gap-2.5 transition-all duration-200"
                  >
                    Learn more
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
