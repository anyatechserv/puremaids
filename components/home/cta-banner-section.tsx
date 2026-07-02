import React from 'react';
import Link from 'next/link';
import { Phone, ArrowRight, Star, Shield, CheckCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SITE_CONFIG } from '@/lib/constants';

export default function CtaBannerSection() {
  return (
    <section className="relative overflow-hidden py-24">
      {/* Photo background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(https://images.pexels.com/photos/4108741/pexels-photo-4108741.jpeg)' }}
      />
      {/* Colour overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-700/96 via-primary-600/92 to-primary-500/88" />

      {/* Decorative blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full bg-white/5 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-white/3 blur-2xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-stretch lg:justify-between">

          {/* ── Left – Copy ── */}
          <div className="max-w-xl text-center lg:text-left">
            {/* Proof pill */}
            <div className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-sm">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-3 w-3 fill-white text-white" />)}
              </div>
              <span className="text-xs font-semibold text-white/90">4.9 stars · 2,847 verified reviews</span>
            </div>

            <h2 className="font-heading mb-5 text-4xl font-extrabold leading-[1.08] text-white md:text-5xl lg:text-6xl">
              Ready for a<br />Spotless Home?
            </h2>

            <p className="mb-8 text-lg leading-relaxed text-white/85">
              Join 10,000+ UK households who trust PureMaids. 
              Get a free instant quote in 60 seconds — no commitment required.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 lg:justify-start">
              <Link href="/book-online">
                <Button
                  variant="white"
                  size="xl"
                  className="shadow-[0_8px_30px_-6px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_40px_-8px_rgba(0,0,0,0.4)]"
                >
                  Book Online Now
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <a
                href={`tel:${SITE_CONFIG.phone.replace(/\s/g, '')}`}
                className="group flex items-center gap-3 rounded-xl border border-white/25 bg-white/10 px-5 py-3.5 text-white backdrop-blur-sm transition-all hover:bg-white/20"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
                  <Phone className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <div className="text-[10px] font-medium text-white/60 leading-none mb-0.5">Call us free</div>
                  <div className="text-sm font-bold leading-none">{SITE_CONFIG.phone}</div>
                </div>
              </a>
            </div>

            {/* Micro-reassurances */}
            <div className="mt-7 flex flex-wrap justify-center gap-x-5 gap-y-2 lg:justify-start">
              {['No payment to book', 'Same-day availability', 'Cancel anytime'].map((t) => (
                <div key={t} className="flex items-center gap-1.5 text-xs font-medium text-white/75">
                  <CheckCircle className="h-3.5 w-3.5 text-white/60" />
                  {t}
                </div>
              ))}
            </div>
          </div>

          {/* ── Right – Trust card ── */}
          <div className="w-full lg:w-auto lg:max-w-xs xl:max-w-sm">
            <div className="h-full rounded-3xl border border-white/20 bg-white/12 p-7 backdrop-blur-md">
              <div className="mb-6 flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20">
                  <Sparkles className="h-4.5 w-4.5 text-white h-[18px] w-[18px]" />
                </div>
                <h3 className="font-heading text-lg font-bold text-white">The PureMaids Promise</h3>
              </div>

              <ul className="space-y-4">
                {[
                  { icon: Shield, text: 'Fully insured up to £5 million' },
                  { icon: CheckCircle, text: 'All cleaners DBS background checked' },
                  { icon: CheckCircle, text: '100% satisfaction guarantee' },
                  { icon: CheckCircle, text: 'Fixed prices — no hidden charges' },
                  { icon: CheckCircle, text: 'Eco-friendly, non-toxic products' },
                  { icon: CheckCircle, text: 'Same-day appointments available' },
                ].map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-center gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/15">
                      <Icon className="h-3.5 w-3.5 text-white" />
                    </div>
                    <span className="text-sm font-medium text-white/90">{text}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-7 rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-center">
                <p className="text-xs text-white/70">Average response time</p>
                <p className="font-heading text-xl font-bold text-white">Under 2 hours</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
