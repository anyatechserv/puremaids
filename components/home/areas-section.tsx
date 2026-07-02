import React from 'react';
import Link from 'next/link';
import { MapPin, ArrowRight } from 'lucide-react';

const areaGroups = [
  { region: 'Central', areas: ['Westminster', 'City of London', 'Covent Garden', 'Marylebone'] },
  { region: 'North', areas: ['Camden', 'Islington', 'Hackney', 'Barnet'] },
  { region: 'South', areas: ['Brixton', 'Clapham', 'Battersea', 'Wimbledon'] },
  { region: 'East', areas: ['Canary Wharf', 'Stratford', 'Greenwich', 'Bethnal Green'] },
  { region: 'West', areas: ['Chelsea', 'Kensington', 'Fulham', 'Richmond'] },
  { region: 'NW / SW', areas: ['Harrow', 'Wembley', 'Ealing', 'Kingston'] },
];

export default function AreasSection() {
  return (
    <section className="py-24 bg-secondary-800">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-14">
          <div>
            <span className="inline-block text-primary-400 font-semibold text-sm uppercase tracking-widest mb-3">
              Where We Work
            </span>
            <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-white leading-tight">
              Covering 30+ London Areas
            </h2>
          </div>
          <Link
            href="/areas"
            className="inline-flex items-center gap-2 text-primary-400 font-semibold text-sm hover:text-primary-300 transition-colors flex-shrink-0"
          >
            See full coverage map
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {areaGroups.map((group) => (
            <div key={group.region} className="bg-secondary-700/60 border border-secondary-600/40 rounded-2xl p-5 hover:bg-secondary-700 transition-colors duration-200">
              <div className="flex items-center gap-1.5 mb-3">
                <MapPin className="w-3.5 h-3.5 text-primary-400 flex-shrink-0" />
                <span className="text-primary-400 font-semibold text-xs uppercase tracking-wider">{group.region}</span>
              </div>
              <ul className="space-y-2">
                {group.areas.map((area) => (
                  <li key={area}>
                    <Link
                      href="/areas"
                      className="text-secondary-300 hover:text-primary-300 transition-colors text-sm"
                    >
                      {area}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 bg-secondary-700/40 border border-secondary-600/30 rounded-2xl p-7 flex flex-col md:flex-row items-center justify-between gap-5">
          <div>
            <p className="font-heading font-semibold text-white text-lg mb-1">Don&apos;t see your area?</p>
            <p className="text-secondary-400 text-sm">We&apos;re expanding constantly. Contact us and we&apos;ll check if we cover your postcode.</p>
          </div>
          <Link href="/contact" className="flex-shrink-0">
            <button className="bg-primary-500 hover:bg-primary-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm">
              Check My Area
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
