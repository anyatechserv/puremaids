import React from 'react';
import Link from 'next/link';
import { MapPin, ArrowRight, CheckCircle } from 'lucide-react';

const groups = [
  { region: 'Central', areas: ['Westminster', 'City of London', 'Covent Garden', 'Marylebone'] },
  { region: 'North', areas: ['Camden', 'Islington', 'Hackney', 'Barnet'] },
  { region: 'South', areas: ['Brixton', 'Clapham', 'Battersea', 'Wimbledon'] },
  { region: 'East', areas: ['Canary Wharf', 'Stratford', 'Greenwich', 'Bethnal Green'] },
  { region: 'West', areas: ['Chelsea', 'Kensington', 'Fulham', 'Richmond'] },
  { region: 'NW / SW', areas: ['Harrow', 'Wembley', 'Ealing', 'Kingston'] },
];

export default function AreasSection() {
  return (
    <section className="bg-secondary-800 py-24">
      <div className="mx-auto max-w-7xl px-4">

        {/* Header */}
        <div className="mb-14 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="mb-3 inline-block text-sm font-bold uppercase tracking-widest text-primary-400">
              Where We Work
            </span>
            <h2 className="font-heading text-4xl font-extrabold leading-tight text-white md:text-5xl">
              Covering 30+ Areas<br />Across London
            </h2>
          </div>
          <Link
            href="/areas"
            className="inline-flex shrink-0 items-center gap-2 text-sm font-bold text-primary-400 transition-colors hover:text-primary-300"
          >
            See full coverage
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Area cards */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {groups.map((g) => (
            <div
              key={g.region}
              className="rounded-2xl border border-secondary-700/60 bg-secondary-700/40 p-5 transition-colors duration-200 hover:bg-secondary-700"
            >
              <div className="mb-3 flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-primary-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-primary-400">{g.region}</span>
              </div>
              <ul className="space-y-2">
                {g.areas.map((a) => (
                  <li key={a}>
                    <Link
                      href="/areas"
                      className="text-sm text-secondary-300 transition-colors hover:text-primary-300"
                    >
                      {a}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* "Not listed" nudge */}
        <div className="mt-8 flex flex-col items-center justify-between gap-5 rounded-2xl border border-secondary-700/50 bg-secondary-700/30 p-7 md:flex-row">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-500/15">
              <MapPin className="h-5 w-5 text-primary-400" />
            </div>
            <div>
              <p className="font-heading font-bold text-white">Don&apos;t see your area?</p>
              <p className="mt-0.5 text-sm text-secondary-400">
                We&apos;re expanding constantly — contact us to check your postcode.
              </p>
            </div>
          </div>
          <Link href="/contact" className="shrink-0">
            <button className="rounded-xl bg-primary-500 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-primary-600">
              Check My Area
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
