import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SERVICES } from '@/lib/constants';

const serviceDetails = [
  {
    slug: 'domestic-cleaning',
    description: 'Flexible weekly or fortnightly cleaning by a dedicated cleaner who learns your home perfectly.',
    features: ['Same cleaner every visit', 'Your own checklist', 'Flexible rescheduling'],
    image: 'https://images.pexels.com/photos/4108741/pexels-photo-4108741.jpeg',
    from: '£59',
    accentColor: '#00AEEF',
  },
  {
    slug: 'deep-cleaning',
    description: 'A thorough top-to-bottom clean — inside appliances, behind furniture, every surface tackled.',
    features: ['Inside oven & fridge', 'Skirting boards & coving', 'Satisfaction guaranteed'],
    image: 'https://images.pexels.com/photos/6195130/pexels-photo-6195130.jpeg',
    from: '£129',
    accentColor: '#10B981',
  },
  {
    slug: 'end-of-tenancy-cleaning',
    description: 'Move-out clean to landlord standards. We guarantee your deposit back or we re-clean free.',
    features: ['Deposit-back guarantee', 'Letting agent approved', 'Certificate included'],
    image: 'https://images.pexels.com/photos/7534761/pexels-photo-7534761.jpeg',
    from: '£149',
    accentColor: '#F59E0B',
  },
  {
    slug: 'office-cleaning',
    description: 'Keep your workplace pristine with professional commercial cleaning, after-hours if needed.',
    features: ['After-hours service', 'Supply restocking', 'COSHH compliant'],
    image: 'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg',
    from: '£99',
    accentColor: '#8B5CF6',
  },
];

export default function ServicesSection() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-14">
          <div>
            <span className="inline-block text-primary-500 font-semibold text-sm uppercase tracking-widest mb-3">Our Services</span>
            <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-secondary-800 leading-tight max-w-xl">
              Every Clean You Need,<br />Done Brilliantly
            </h2>
          </div>
          <p className="text-secondary-500 max-w-sm leading-relaxed text-sm md:text-base">
            From regular home maintenance to specialist deep cleans, we cover every corner of your home or office.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SERVICES.map((service) => {
            const detail = serviceDetails.find((d) => d.slug === service.slug)!;
            return (
              <Link
                key={service.slug}
                href={`/${service.slug}`}
                className="group relative bg-white rounded-3xl overflow-hidden border border-secondary-100 hover:border-transparent hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] transition-all duration-500 flex flex-col"
              >
                {/* Image */}
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={detail.image}
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary-900/70 via-secondary-900/20 to-transparent" />

                  {/* Price badge */}
                  <div
                    className="absolute top-4 right-4 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg"
                    style={{ backgroundColor: detail.accentColor }}
                  >
                    From {detail.from}
                  </div>
                </div>

                <div className="p-7 flex-1 flex flex-col">
                  <h3 className="font-heading font-bold text-secondary-800 text-xl mb-2 group-hover:text-primary-600 transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-secondary-500 text-sm leading-relaxed mb-5">{detail.description}</p>

                  <ul className="space-y-2 mb-6 flex-1">
                    {detail.features.map((f) => (
                      <li key={f} className="flex items-center gap-2.5 text-sm text-secondary-600">
                        <span
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: detail.accentColor }}
                        />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center gap-1.5 text-sm font-semibold text-primary-600 group-hover:gap-3 transition-all duration-200">
                    Find out more
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>

                {/* Bottom accent line */}
                <div
                  className="h-0.5 w-0 group-hover:w-full transition-all duration-500 absolute bottom-0 left-0"
                  style={{ backgroundColor: detail.accentColor }}
                />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
