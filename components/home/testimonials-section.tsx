import React from 'react';
import Link from 'next/link';
import { ArrowRight, Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Johnson',
    location: 'Chelsea, London',
    rating: 5,
    text: 'Absolutely outstanding service. The team cleaned my 3-bedroom flat from top to bottom — every surface spotless. My regular cleaner Maria always goes above and beyond.',
    avatar: 'SJ',
    avatarBg: 'bg-primary-500',
    date: '2 weeks ago',
    service: 'Domestic Cleaning',
  },
  {
    name: 'Marcus Thompson',
    location: 'Canary Wharf',
    rating: 5,
    text: 'Used PureMaids for end of tenancy cleaning and got my full £2,400 deposit back. The landlord was genuinely impressed. Worth every penny and completely stress-free.',
    avatar: 'MT',
    avatarBg: 'bg-accent-500',
    date: '1 month ago',
    service: 'End of Tenancy',
  },
  {
    name: 'Emma Williams',
    location: 'Clapham, London',
    rating: 5,
    text: "I've tried many cleaning companies over the years. PureMaids is by far the best. Same cleaner every fortnight, always on time, always brilliant. Highly recommend!",
    avatar: 'EW',
    avatarBg: 'bg-rose-500',
    date: '3 weeks ago',
    service: 'Regular Cleaning',
  },
  {
    name: 'James Peters',
    location: 'Fulham, London',
    rating: 5,
    text: 'Booked a deep clean before a big family event. The house looked incredible — places I hadn\'t thought to clean in years were spotless. Will absolutely use again.',
    avatar: 'JP',
    avatarBg: 'bg-amber-500',
    date: '1 week ago',
    service: 'Deep Cleaning',
  },
  {
    name: 'Priya Sharma',
    location: 'Islington, London',
    rating: 5,
    text: 'The DBS checks and insurance gave me peace of mind from day one. Our cleaner is meticulous, trustworthy, and wonderful with our two cats. Couldn\'t be happier.',
    avatar: 'PS',
    avatarBg: 'bg-violet-500',
    date: '2 months ago',
    service: 'Domestic Cleaning',
  },
  {
    name: 'David Chen',
    location: 'Richmond, Surrey',
    rating: 5,
    text: 'Office cleaning contract for 15 people. The team comes in every morning before 8am and our workspace is immaculate. Professional, discreet, and reliable.',
    avatar: 'DC',
    avatarBg: 'bg-teal-500',
    date: '3 weeks ago',
    service: 'Office Cleaning',
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14">
          <div>
            <span className="inline-block text-primary-500 font-semibold text-sm uppercase tracking-widest mb-3">
              Customer Reviews
            </span>
            <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-secondary-800 leading-tight">
              Loved by Thousands<br />of UK Customers
            </h2>
          </div>

          {/* Google rating */}
          <div className="flex-shrink-0">
            <div className="inline-flex items-center gap-4 bg-secondary-50 border border-secondary-100 rounded-2xl px-6 py-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  <span className="font-bold text-secondary-800 text-sm">Google Reviews</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
                  </div>
                  <span className="font-bold text-secondary-800">4.9</span>
                  <span className="text-secondary-400 text-sm">/ 2,847 reviews</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className={`relative rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-medium group ${
                i === 0 ? 'bg-primary-500 text-white' : 'bg-secondary-50 hover:bg-white border border-secondary-100'
              }`}
            >
              <Quote
                className={`absolute top-5 right-5 w-8 h-8 ${i === 0 ? 'text-white/20' : 'text-secondary-200'}`}
              />

              {/* Stars */}
              <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_, j) => (
                  <Star
                    key={j}
                    className={`w-4 h-4 ${i === 0 ? 'text-white fill-white' : 'text-amber-400 fill-amber-400'}`}
                  />
                ))}
              </div>

              {/* Service tag */}
              <div className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full mb-3 ${
                i === 0 ? 'bg-white/20 text-white' : 'bg-primary-50 text-primary-700'
              }`}>
                {t.service}
              </div>

              <p className={`text-sm leading-relaxed mb-5 ${i === 0 ? 'text-white/90' : 'text-secondary-600'}`}>
                &ldquo;{t.text}&rdquo;
              </p>

              <div className={`flex items-center gap-3 pt-4 border-t ${i === 0 ? 'border-white/20' : 'border-secondary-100'}`}>
                <div className={`w-9 h-9 ${t.avatarBg} rounded-full flex items-center justify-center flex-shrink-0`}>
                  <span className="text-white font-semibold text-xs">{t.avatar}</span>
                </div>
                <div>
                  <p className={`font-semibold text-sm ${i === 0 ? 'text-white' : 'text-secondary-800'}`}>{t.name}</p>
                  <p className={`text-xs ${i === 0 ? 'text-white/60' : 'text-secondary-400'}`}>{t.location} · {t.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <p className="text-secondary-400 text-sm">
            Showing 6 of 2,847 verified Google reviews ·{' '}
            <Link href="/about" className="text-primary-500 font-medium hover:underline">
              Read more
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
