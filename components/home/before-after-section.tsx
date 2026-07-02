import React from 'react';
import Link from 'next/link';

const pairs = [
  {
    before: 'https://images.pexels.com/photos/6195056/pexels-photo-6195056.jpeg',
    after: 'https://images.pexels.com/photos/4108741/pexels-photo-4108741.jpeg',
    room: 'Kitchen',
    result: 'Grease-free surfaces, polished appliances',
  },
  {
    before: 'https://images.pexels.com/photos/6197119/pexels-photo-6197119.jpeg',
    after: 'https://images.pexels.com/photos/6195130/pexels-photo-6195130.jpeg',
    room: 'Bathroom',
    result: 'Limescale removed, fully sanitised',
  },
  {
    before: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg',
    after: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
    room: 'Living Room',
    result: 'Dusted, vacuumed, furniture polished',
  },
];

export default function BeforeAfterSection() {
  return (
    <section className="bg-secondary-50 py-24">
      <div className="mx-auto max-w-7xl px-4">

        <div className="mb-14 text-center">
          <span className="mb-3 inline-block text-sm font-bold uppercase tracking-widest text-primary-500">
            Real Results
          </span>
          <h2 className="font-heading text-4xl font-extrabold leading-tight text-secondary-800 md:text-5xl mb-4">
            See the Difference
          </h2>
          <p className="mx-auto max-w-md text-base leading-relaxed text-secondary-500">
            Every clean is backed by our 100% satisfaction guarantee. Not right? We come back free.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {pairs.map((p) => (
            <div
              key={p.room}
              className="group overflow-hidden rounded-3xl bg-white shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-large"
            >
              {/* Split photo */}
              <div className="relative h-60">
                <div className="grid h-full grid-cols-2">
                  {/* Before */}
                  <div className="relative overflow-hidden">
                    <img
                      src={p.before}
                      alt={`${p.room} before cleaning`}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-secondary-900/25" />
                    <span className="absolute left-2.5 top-2.5 rounded-full bg-secondary-800/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                      Before
                    </span>
                  </div>

                  {/* After */}
                  <div className="relative overflow-hidden">
                    <img
                      src={p.after}
                      alt={`${p.room} after cleaning`}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute right-2.5 top-2.5 rounded-full bg-primary-500/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                      After
                    </span>
                  </div>
                </div>

                {/* Divider + handle */}
                <div className="pointer-events-none absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-white/70" />
                <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-medium">
                  <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
                    <path d="M7 5l-4 5 4 5M13 5l4 5-4 5" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>

              {/* Caption */}
              <div className="px-5 py-4">
                <p className="font-heading font-bold text-secondary-800">{p.room}</p>
                <p className="mt-0.5 text-xs text-secondary-400">{p.result}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
