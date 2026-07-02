import React from 'react';

const pairs = [
  {
    before: 'https://images.pexels.com/photos/6195056/pexels-photo-6195056.jpeg',
    after: 'https://images.pexels.com/photos/4108741/pexels-photo-4108741.jpeg',
    room: 'Kitchen',
    detail: 'Grease-free surfaces, polished appliances',
  },
  {
    before: 'https://images.pexels.com/photos/6197119/pexels-photo-6197119.jpeg',
    after: 'https://images.pexels.com/photos/6195130/pexels-photo-6195130.jpeg',
    room: 'Bathroom',
    detail: 'Limescale removed, surfaces disinfected',
  },
  {
    before: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg',
    after: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
    room: 'Living Room',
    detail: 'Dusted, vacuumed, furniture polished',
  },
];

export default function BeforeAfterSection() {
  return (
    <section className="py-24 bg-secondary-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-14">
          <span className="inline-block text-primary-500 font-semibold text-sm uppercase tracking-widest mb-3">
            Real Results
          </span>
          <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-secondary-800 leading-tight mb-4">
            See the PureMaids Difference
          </h2>
          <p className="text-secondary-500 max-w-md mx-auto text-base leading-relaxed">
            Every clean is backed by our 100% satisfaction guarantee. If it&apos;s not right, we come back free.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pairs.map((item) => (
            <div key={item.room} className="group rounded-3xl overflow-hidden shadow-soft hover:shadow-large transition-all duration-300 hover:-translate-y-1 bg-white">
              {/* Split image */}
              <div className="relative h-56">
                <div className="grid grid-cols-2 h-full">
                  <div className="relative overflow-hidden">
                    <img
                      src={item.before}
                      alt={`${item.room} before cleaning`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-secondary-900/30" />
                    <div className="absolute top-3 left-3">
                      <span className="bg-secondary-800/80 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-full">
                        Before
                      </span>
                    </div>
                  </div>
                  <div className="relative overflow-hidden">
                    <img
                      src={item.after}
                      alt={`${item.room} after cleaning`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-3 right-3">
                      <span className="bg-primary-500/90 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-full">
                        After
                      </span>
                    </div>
                  </div>
                </div>
                {/* Center divider */}
                <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-0.5 bg-white/60 z-10" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-7 h-7 bg-white rounded-full shadow-lg z-20 flex items-center justify-center">
                  <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 text-secondary-400">
                    <path d="M10 4l-4 4 4 4M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              {/* Label */}
              <div className="px-5 py-4">
                <p className="font-heading font-semibold text-secondary-800">{item.room}</p>
                <p className="text-secondary-400 text-xs mt-0.5">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
