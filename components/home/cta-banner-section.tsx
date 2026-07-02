import React from 'react';
import Link from 'next/link';
import { Phone, ArrowRight, Star, Shield, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SITE_CONFIG } from '@/lib/constants';

export default function CtaBannerSection() {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(https://images.pexels.com/photos/4108741/pexels-photo-4108741.jpeg)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-primary-600/95 via-primary-500/90 to-primary-600/95" />

      {/* Decorative */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-white/5 rounded-full" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-white/5 rounded-full" />
      </div>

      <div className="relative container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
          {/* Left copy */}
          <div className="text-center lg:text-left max-w-xl">
            {/* Mini social proof */}
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 text-white fill-white" />)}
              </div>
              <span className="text-white/90 text-xs font-medium">4.9 stars · 2,847 reviews</span>
            </div>

            <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-white leading-tight mb-4">
              Ready for a Spotless Home?
            </h2>
            <p className="text-white/85 text-lg leading-relaxed mb-7">
              Join 10,000+ happy customers across the UK. Get an instant quote in 60 seconds — no commitment required.
            </p>

            <div className="flex flex-wrap items-center gap-4 justify-center lg:justify-start">
              <Link href="/book-online">
                <Button variant="white" size="xl" className="shadow-lg shadow-secondary-900/30">
                  Book Online Now
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <a
                href={`tel:${SITE_CONFIG.phone.replace(/\s/g, '')}`}
                className="flex items-center gap-2.5 text-white font-semibold hover:text-primary-100 transition-colors"
              >
                <div className="w-11 h-11 rounded-full bg-white/20 border border-white/30 flex items-center justify-center">
                  <Phone className="w-4.5 h-4.5 w-[18px] h-[18px]" />
                </div>
                <div className="text-left">
                  <div className="text-xs text-white/70">Call us free</div>
                  <div className="text-sm font-bold">{SITE_CONFIG.phone}</div>
                </div>
              </a>
            </div>
          </div>

          {/* Right trust card */}
          <div className="bg-white/15 backdrop-blur-md border border-white/25 rounded-3xl p-7 w-full lg:w-auto lg:min-w-[300px] flex-shrink-0">
            <h3 className="font-heading font-bold text-white text-xl mb-6 text-center">Why PureMaids?</h3>
            <ul className="space-y-4">
              {[
                { icon: Shield, text: 'Fully insured up to £5M' },
                { icon: CheckCircle, text: 'All cleaners DBS checked' },
                { icon: CheckCircle, text: '100% satisfaction guarantee' },
                { icon: CheckCircle, text: 'No hidden fees, fixed prices' },
                { icon: CheckCircle, text: 'Eco-friendly products' },
                { icon: CheckCircle, text: 'Same-day availability' },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-white/90 text-sm font-medium">{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
