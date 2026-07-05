import React from 'react';
import Link from 'next/link';
import { MapPin, ArrowRight } from 'lucide-react';

const groups = [
  {
    region: 'Bolton',
    areas: ['Bolton Town Centre', 'Farnworth', 'Horwich', 'Westhoughton'],
  },
  {
    region: 'Manchester',
    areas: ['Manchester City', 'Salford', 'Eccles', 'Stretford'],
  },
  {
    region: 'Bury',
    areas: ['Bury', 'Radcliffe', 'Ramsbottom', 'Heywood'],
  },
  {
    region: 'Wigan',
    areas: ['Wigan', 'Leigh', 'Atherton', 'Tyldesley'],
  },
  {
    region: 'Preston',
    areas: ['Preston', 'Chorley', 'Leyland', 'Bamber Bridge'],
  },
  {
    region: 'North West',
    areas: ['Blackburn', 'Burnley', 'Rochdale', 'Oldham'],
  },
];

export default function AreasSection() {
  return (
    <section className="bg-secondary-800 py-24">
      <div className="mx-auto max-w-7xl px-4">

        {/* Header */}
        <div className="mb-14 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="mb-3 inline-block text-sm font-bold uppercase tracking-widest text-primary-400">
              Where We Clean
            </span>
            <h2 className="font-heading text-4xl font-extrabold leading-tight text-white md:text-5xl">
              Covering Bolton, Manchester<br />&amp; the North West
            </h2>
            <p className="mt-3 max-w-xl text-secondary-400 text-sm leading-relaxed">
              From Bolton town centre to Preston, Wigan and Bury — our local cleaners know your area and are ready to book.
            </p>
          </div>
          <Link
            href="/areas"
            className="inline-flex shrink-0 items-center gap-2 text-sm font-bold text-primary-400 transition-colors hover:text-primary-300"
          >
            See full coverage map
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
              <p className="font-heading font-bold text-white">Don&apos;t see your town?</p>
              <p className="mt-0.5 text-sm text-secondary-400">
                We cover 30+ towns across the North West — contact us to confirm your postcode.
              </p>
            </div>
          </div>
          <Link href="/contact" className="shrink-0">
            <button className="rounded-xl bg-primary-500 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-primary-600">
              Check My Postcode
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
