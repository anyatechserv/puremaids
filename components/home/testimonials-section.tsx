import React from 'react';
import Link from 'next/link';
import { Star, Quote } from 'lucide-react';

const reviews = [
  {
    name: 'Sarah Mitchell',
    location: 'Bolton, BL1',
    service: 'Domestic Cleaning',
    text: 'Absolutely outstanding. My 3-bed home was cleaned top to bottom — every surface spotless. My regular cleaner always goes above and beyond. Couldn\'t ask for more.',
    initials: 'SM',
    color: 'bg-primary-500',
    featured: true,
  },
  {
    name: 'Marcus Thompson',
    location: 'Manchester, M14',
    service: 'End of Tenancy',
    text: 'Got my full £1,800 deposit back. The landlord was genuinely impressed. Worth every penny and completely stress-free. I\'d recommend PureMaids to anyone moving out in Manchester.',
    initials: 'MT',
    color: 'bg-accent-500',
    featured: false,
  },
  {
    name: 'Emma Williams',
    location: 'Bury, BL9',
    service: 'Regular Cleaning',
    text: "I've tried two other cleaning companies in Bury. PureMaids is by far the best — same cleaner every fortnight, always on time, always brilliant. Genuinely couldn't live without them.",
    initials: 'EW',
    color: 'bg-rose-500',
    featured: false,
  },
  {
    name: 'James Peters',
    location: 'Horwich, BL6',
    service: 'Deep Cleaning',
    text: 'Booked a deep clean before putting the house on the market. The place looked incredible — the estate agent commented on how clean it was. Efficient, professional and worth every penny.',
    initials: 'JP',
    color: 'bg-amber-500',
    featured: false,
  },
  {
    name: 'Priya Sharma',
    location: 'Wigan, WN1',
    service: 'Domestic Cleaning',
    text: 'The DBS checks gave me real peace of mind. Our cleaner is meticulous, trustworthy, and wonderful with our two children. Booked solidly for 18 months now and never had an issue.',
    initials: 'PS',
    color: 'bg-violet-500',
    featured: false,
  },
  {
    name: 'David Chen',
    location: 'Preston, PR1',
    service: 'Office Cleaning',
    text: 'We have a contract for our Preston office. The team arrives before 8am every morning — workspace is always immaculate. Professional, discreet, and reliable. Our staff love it.',
    initials: 'DC',
    color: 'bg-teal-500',
    featured: false,
  },
];

function Stars({ white = false }: { white?: boolean }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className={`h-4 w-4 ${white ? 'fill-white text-white' : 'fill-amber-400 text-amber-400'}`} />
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-4">

        {/* Header row */}
        <div className="mb-14 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="mb-3 inline-block text-sm font-bold uppercase tracking-widest text-primary-500">
              Customer Reviews
            </span>
            <h2 className="font-heading text-4xl font-extrabold leading-[1.1] text-secondary-800 md:text-5xl">
              Loved by Thousands Across<br />Bolton &amp; Greater Manchester
            </h2>
          </div>

          {/* Google widget */}
          <div className="shrink-0">
            <div className="inline-flex items-center gap-4 rounded-2xl border border-secondary-100 bg-secondary-50 px-6 py-4">
              <svg viewBox="0 0 24 24" className="h-7 w-7 shrink-0" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <div>
                <p className="mb-1 text-xs font-semibold text-secondary-500">Google Reviews</p>
                <div className="flex items-center gap-2">
                  <Stars />
                  <span className="font-heading text-lg font-extrabold text-secondary-800 leading-none">4.9</span>
                  <span className="text-sm text-secondary-400">/ 2,847 reviews</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Review grid */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r, i) => (
            <div
              key={r.name}
              className={`group relative flex flex-col rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 ${
                r.featured
                  ? 'bg-primary-500 shadow-[0_12px_40px_-8px_rgba(0,174,239,0.4)]'
                  : 'border border-secondary-100 bg-secondary-50 hover:bg-white hover:shadow-medium'
              }`}
            >
              <Quote
                className={`absolute right-5 top-5 h-8 w-8 ${r.featured ? 'text-white/20' : 'text-secondary-200'}`}
              />

              <Stars white={r.featured} />

              <span
                className={`mt-3 inline-block rounded-full px-2.5 py-1 text-[11px] font-bold ${
                  r.featured ? 'bg-white/20 text-white' : 'bg-primary-50 text-primary-700'
                }`}
              >
                {r.service}
              </span>

              <p
                className={`mt-3 flex-1 text-sm leading-relaxed ${
                  r.featured ? 'text-white/90' : 'text-secondary-600'
                }`}
              >
                &ldquo;{r.text}&rdquo;
              </p>

              <div className={`mt-5 flex items-center gap-3 border-t pt-4 ${r.featured ? 'border-white/20' : 'border-secondary-100'}`}>
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${r.color}`}>
                  <span className="text-xs font-bold text-white">{r.initials}</span>
                </div>
                <div>
                  <p className={`text-sm font-bold ${r.featured ? 'text-white' : 'text-secondary-800'}`}>{r.name}</p>
                  <p className={`text-xs ${r.featured ? 'text-white/60' : 'text-secondary-400'}`}>{r.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-secondary-400">
          Showing 6 of 2,847 verified Google reviews &middot;{' '}
          <Link href="/about" className="font-medium text-primary-500 hover:underline">
            Read more
          </Link>
        </p>
      </div>
    </section>
  );
}
