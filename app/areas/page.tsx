import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AREAS } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Cleaning Services Areas London | PureMaids Coverage Map',
  description:
    'PureMaids provides professional cleaning services across 30+ London areas. Check if we cover your area — from Chelsea to Canary Wharf, North to South London.',
};

const areaGroups = [
  {
    title: 'Central London',
    areas: ['City of London', 'Westminster', 'Covent Garden', 'Clerkenwell', 'Holborn', 'Marylebone'],
  },
  {
    title: 'North London',
    areas: ['Camden', 'Islington', 'Highbury', 'Holloway', 'Hackney', 'Stoke Newington', 'Barnet', 'Finchley'],
  },
  {
    title: 'South London',
    areas: ['Brixton', 'Clapham', 'Battersea', 'Dulwich', 'Crystal Palace', 'Tooting', 'Wimbledon', 'Streatham', 'Lewisham'],
  },
  {
    title: 'East London',
    areas: ['Canary Wharf', 'Stratford', 'Hackney', 'Bethnal Green', 'Whitechapel', 'Greenwich', 'Woolwich'],
  },
  {
    title: 'West London',
    areas: ['Chelsea', 'Kensington', 'Fulham', 'Hammersmith', 'Ealing', 'Chiswick', 'Richmond', 'Kingston', 'Twickenham'],
  },
  {
    title: 'North West London',
    areas: ['Harrow', 'Wembley', 'Brent', 'Kilburn', 'Queen\'s Park', 'Maida Vale', 'Paddington'],
  },
];

export default function AreasPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-secondary-800 to-secondary-700 py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-primary-400" />
              <span className="text-primary-300 font-medium text-sm">Service Coverage</span>
            </div>
            <h1 className="font-heading font-bold text-4xl md:text-5xl text-white mb-5 leading-tight">
              Areas We Cover
            </h1>
            <p className="text-secondary-200 text-lg leading-relaxed">
              PureMaids serves over 30 areas across London. If you&apos;re not sure we cover your area, 
              just give us a call — we&apos;re always expanding.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {areaGroups.map((group) => (
              <div key={group.title} className="bg-white rounded-2xl border border-secondary-100 p-6 shadow-soft hover:shadow-medium transition-shadow">
                <h2 className="font-heading font-semibold text-secondary-800 text-xl mb-4 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary-500 flex-shrink-0" />
                  {group.title}
                </h2>
                <ul className="space-y-2">
                  {group.areas.map((area) => (
                    <li key={area} className="flex items-center gap-2 text-sm text-secondary-600">
                      <CheckCircle className="w-3.5 h-3.5 text-accent-500 flex-shrink-0" />
                      {area}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-primary-50 border border-primary-100 rounded-2xl p-8 text-center">
            <MapPin className="w-10 h-10 text-primary-500 mx-auto mb-4" />
            <h2 className="font-heading font-semibold text-secondary-800 text-2xl mb-2">
              Don&apos;t See Your Area?
            </h2>
            <p className="text-secondary-500 mb-5 max-w-md mx-auto">
              We&apos;re constantly expanding our coverage. Contact us and we&apos;ll let you know if we can help, 
              or add you to our waiting list.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/contact">
                <Button size="lg">Check Your Area</Button>
              </Link>
              <a href="tel:08000123456">
                <Button variant="outline" size="lg">Call Us</Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
