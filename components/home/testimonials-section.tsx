import React from 'react';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Johnson',
    location: 'Chelsea, London',
    rating: 5,
    text: 'Absolutely outstanding service! The team cleaned my 3-bedroom flat from top to bottom. Every surface was spotless. Will definitely use PureMaids again.',
    avatar: 'SJ',
    date: '2 weeks ago',
  },
  {
    name: 'Marcus Thompson',
    location: 'Canary Wharf, London',
    rating: 5,
    text: 'Used PureMaids for end of tenancy cleaning and got my full deposit back. The landlord was genuinely impressed. Incredibly professional service.',
    avatar: 'MT',
    date: '1 month ago',
  },
  {
    name: 'Emma Williams',
    location: 'Clapham, London',
    rating: 5,
    text: 'I\'ve tried multiple cleaning companies and PureMaids is by far the best. My regular cleaner is meticulous and always on time. Highly recommend!',
    avatar: 'EW',
    date: '3 weeks ago',
  },
  {
    name: 'James Peters',
    location: 'Fulham, London',
    rating: 5,
    text: 'Booking was super easy online, the team arrived on time and did an excellent job. Our office has never looked so clean. Great value for money.',
    avatar: 'JP',
    date: '1 week ago',
  },
  {
    name: 'Priya Sharma',
    location: 'Islington, London',
    rating: 5,
    text: 'I was nervous about letting cleaners into my home but the DBS check gave me real peace of mind. The cleaner was professional, friendly, and thorough.',
    avatar: 'PS',
    date: '2 months ago',
  },
  {
    name: 'David Chen',
    location: 'Richmond, London',
    rating: 5,
    text: 'Deep clean before hosting a dinner party — it was perfect. Guests kept commenting on how clean and fresh everything was. 10/10 service!',
    avatar: 'DC',
    date: '3 weeks ago',
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-secondary-200'}`}
        />
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <span className="text-primary-500 font-semibold text-sm uppercase tracking-widest">Customer Reviews</span>
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-secondary-800 mt-2 mb-3">
            Loved by 10,000+ Customers
          </h2>
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
              ))}
            </div>
            <span className="font-semibold text-secondary-800">4.9 out of 5</span>
            <span className="text-secondary-400">·</span>
            <span className="text-secondary-500 text-sm">Based on 2,847 reviews</span>
          </div>
        </div>

        {/* Google Reviews badge */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex items-center gap-3 bg-secondary-50 border border-secondary-100 rounded-2xl px-5 py-3">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span className="font-semibold text-secondary-700 text-sm">4.9 on Google Reviews</span>
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-secondary-50 rounded-2xl p-6 relative hover:bg-white hover:shadow-medium transition-all duration-300">
              <Quote className="w-8 h-8 text-primary-200 absolute top-5 right-5" />
              <StarRating rating={t.rating} />
              <p className="text-secondary-600 text-sm leading-relaxed mt-3 mb-5">&ldquo;{t.text}&rdquo;</p>
              <div className="flex items-center gap-3 pt-4 border-t border-secondary-100">
                <div className="w-9 h-9 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold text-xs">{t.avatar}</span>
                </div>
                <div>
                  <p className="font-semibold text-secondary-800 text-sm">{t.name}</p>
                  <p className="text-secondary-400 text-xs">{t.location} · {t.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
