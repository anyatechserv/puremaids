import React from 'react';

const beforeAfter = [
  {
    before: 'https://images.pexels.com/photos/4108714/pexels-photo-4108714.jpeg',
    after: 'https://images.pexels.com/photos/4108741/pexels-photo-4108741.jpeg',
    room: 'Kitchen',
  },
  {
    before: 'https://images.pexels.com/photos/6197119/pexels-photo-6197119.jpeg',
    after: 'https://images.pexels.com/photos/6195130/pexels-photo-6195130.jpeg',
    room: 'Bathroom',
  },
  {
    before: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg',
    after: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
    room: 'Living Room',
  },
];

export default function BeforeAfterSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <span className="text-primary-500 font-semibold text-sm uppercase tracking-widest">Our Results</span>
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-secondary-800 mt-2 mb-3">
            See the Difference
          </h2>
          <p className="text-secondary-500 max-w-xl mx-auto leading-relaxed">
            Real results from real cleans. See why our customers trust us with their homes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {beforeAfter.map((item) => (
            <div key={item.room} className="rounded-2xl overflow-hidden shadow-soft">
              <div className="grid grid-cols-2">
                <div className="relative">
                  <img
                    src={item.before}
                    alt={`${item.room} before cleaning`}
                    className="w-full h-48 object-cover"
                    loading="lazy"
                  />
                  <div className="absolute top-2 left-2 bg-secondary-800/80 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                    Before
                  </div>
                </div>
                <div className="relative">
                  <img
                    src={item.after}
                    alt={`${item.room} after cleaning`}
                    className="w-full h-48 object-cover"
                    loading="lazy"
                  />
                  <div className="absolute top-2 left-2 bg-primary-500/90 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                    After
                  </div>
                </div>
              </div>
              <div className="bg-secondary-50 px-4 py-3 text-center">
                <span className="font-semibold text-secondary-700 text-sm">{item.room}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
