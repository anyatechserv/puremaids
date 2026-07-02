'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Phone, Shield, Star, Clock, Leaf, ChevronDown, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SITE_CONFIG } from '@/lib/constants';

const serviceOptions = [
  { value: 'domestic', label: 'Domestic Cleaning' },
  { value: 'deep', label: 'Deep Cleaning' },
  { value: 'end_of_tenancy', label: 'End of Tenancy' },
  { value: 'office', label: 'Office Cleaning' },
];

const sizeOptions: Record<string, { value: string; label: string }[]> = {
  domestic: [
    { value: 'studio', label: 'Studio / 1 Bedroom' },
    { value: '2bed', label: '2 Bedrooms' },
    { value: '3bed', label: '3 Bedrooms' },
    { value: '4bed', label: '4 Bedrooms' },
    { value: '5plus', label: '5+ Bedrooms' },
  ],
  deep: [
    { value: 'studio', label: 'Studio / 1 Bedroom' },
    { value: '2bed', label: '2 Bedrooms' },
    { value: '3bed', label: '3 Bedrooms' },
    { value: '4bed', label: '4 Bedrooms' },
    { value: '5plus', label: '5+ Bedrooms' },
  ],
  end_of_tenancy: [
    { value: 'studio', label: 'Studio / 1 Bedroom' },
    { value: '2bed', label: '2 Bedrooms' },
    { value: '3bed', label: '3 Bedrooms' },
    { value: '4bed', label: '4 Bedrooms' },
    { value: '5plus', label: '5+ Bedrooms' },
  ],
  office: [
    { value: 'small', label: 'Small (up to 500 sq ft)' },
    { value: 'medium', label: 'Medium (500–1,500 sq ft)' },
    { value: 'large', label: 'Large (1,500+ sq ft)' },
  ],
};

function NativeSelect({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-12 pl-4 pr-10 bg-secondary-50 border border-secondary-200 rounded-xl text-sm text-secondary-700 font-medium focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent appearance-none cursor-pointer transition-all hover:bg-white"
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
    </div>
  );
}

export default function HeroSection() {
  const [service, setService] = useState('domestic');
  const [size, setSize] = useState('');
  const [postcode, setPostcode] = useState('');

  return (
    <section className="relative overflow-hidden bg-secondary-900" style={{ minHeight: 'calc(100vh - 88px)' }}>
      {/* Full-bleed background photo */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(https://images.pexels.com/photos/4108715/pexels-photo-4108715.jpeg)' }}
      />
      {/* Dark overlay — heavier left so text is legible, lighter right so image shows */}
      <div className="absolute inset-0 bg-gradient-to-r from-secondary-900/92 via-secondary-900/75 to-secondary-800/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-secondary-900/50 via-transparent to-transparent" />

      {/* Glow accents */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 h-[600px] w-[600px] rounded-full bg-primary-500/8 blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-accent-500/6 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-16 md:py-24 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 items-center">

          {/* ── LEFT COLUMN ── */}
          <div className="max-w-2xl">

            {/* Trust pill */}
            <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/8 px-4 py-2 backdrop-blur-sm">
              <div className="flex -space-x-1">
                {['#F59E0B', '#10B981', '#00AEEF', '#8B5CF6'].map((c, i) => (
                  <div key={i} className="h-6 w-6 rounded-full border-2 border-secondary-900/40 ring-1 ring-white/10" style={{ backgroundColor: c }} />
                ))}
              </div>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />)}
              </div>
              <span className="text-xs font-semibold text-white/85">Trusted by 10,000+ homes</span>
            </div>

            {/* Headline */}
            <h1 className="font-heading mb-6 leading-[1.06] tracking-tight text-white">
              <span className="block text-5xl font-extrabold md:text-6xl lg:text-7xl">Professional</span>
              <span className="block text-5xl font-extrabold md:text-6xl lg:text-7xl">House Cleaning</span>
              <span className="block text-5xl font-extrabold md:text-6xl lg:text-7xl">
                Across the{' '}
                <span className="relative inline-block text-primary-400">
                  UK
                  <svg
                    aria-hidden="true"
                    className="absolute -bottom-1.5 left-0 w-full"
                    viewBox="0 0 80 10"
                    preserveAspectRatio="none"
                    style={{ height: 7 }}
                  >
                    <path d="M2 7 Q40 1 78 7" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
                  </svg>
                </span>
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="mb-8 text-lg leading-relaxed text-secondary-200 md:text-xl max-w-lg">
              Fully insured, DBS-checked cleaners who deliver spotless results every single time.
              Transparent pricing, no hidden fees, satisfaction guaranteed.
            </p>

            {/* Badge grid */}
            <div className="mb-9 grid grid-cols-2 gap-2.5">
              {[
                { icon: Shield, label: 'Fully Insured & DBS Checked' },
                { icon: Star, label: '4.9 ★ on Google · 2,847 reviews' },
                { icon: Clock, label: 'Same-Day Availability' },
                { icon: Leaf, label: '100% Eco-Friendly Products' },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2.5 rounded-xl border border-white/12 bg-white/7 px-3.5 py-2.5 backdrop-blur-sm"
                >
                  <Icon className="h-4 w-4 shrink-0 text-primary-400" />
                  <span className="text-xs font-medium leading-tight text-white/85">{label}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/book-online">
                <Button size="xl" className="shadow-xl shadow-primary-500/25 hover:shadow-primary-500/40 transition-shadow">
                  Book a Clean
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <a
                href={`tel:${SITE_CONFIG.phone.replace(/\s/g, '')}`}
                className="group flex items-center gap-3 rounded-xl border border-white/20 bg-white/8 px-5 py-3 text-white backdrop-blur-sm transition-all hover:bg-white/15 hover:border-white/30"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-500 shadow-sm">
                  <Phone className="h-3.5 w-3.5 text-white" />
                </div>
                <div>
                  <div className="text-[10px] font-medium text-white/55 leading-none mb-0.5">Call free</div>
                  <div className="text-sm font-bold leading-none">{SITE_CONFIG.phone}</div>
                </div>
              </a>
            </div>
          </div>

          {/* ── RIGHT COLUMN — Quote card ── */}
          <div className="w-full lg:max-w-md xl:max-w-lg">
            <div className="overflow-hidden rounded-3xl bg-white shadow-[0_30px_80px_-10px_rgba(0,0,0,0.45)]">
              {/* Card header */}
              <div className="bg-gradient-to-r from-primary-600 to-primary-500 px-7 py-6">
                <p className="mb-0.5 text-xs font-semibold uppercase tracking-widest text-primary-100">Free Estimate</p>
                <h2 className="font-heading text-2xl font-bold text-white">Get an Instant Quote</h2>
                <p className="mt-1 text-sm text-primary-100">Answer 3 questions — done in 60 seconds</p>
              </div>

              {/* Form body */}
              <div className="space-y-4 px-7 py-6">
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-secondary-400">
                    1. Service type
                  </label>
                  <NativeSelect
                    value={service}
                    onChange={(v) => { setService(v); setSize(''); }}
                    options={serviceOptions}
                    placeholder="Select a service"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-secondary-400">
                    2. {service === 'office' ? 'Office size' : 'Property size'}
                  </label>
                  <NativeSelect
                    value={size}
                    onChange={setSize}
                    options={sizeOptions[service] ?? sizeOptions.domestic}
                    placeholder="Select size"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-secondary-400">
                    3. Your postcode
                  </label>
                  <input
                    type="text"
                    value={postcode}
                    onChange={(e) => setPostcode(e.target.value.toUpperCase())}
                    placeholder="e.g. SW1A 1AA"
                    maxLength={8}
                    className="h-12 w-full rounded-xl border border-secondary-200 bg-secondary-50 px-4 text-sm font-medium text-secondary-700 placeholder:text-secondary-300 transition-all hover:bg-white focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-400"
                  />
                </div>

                <Button
                  size="lg"
                  className="mt-1 w-full"
                  onClick={() => {
                    const p = new URLSearchParams({ service, size, postcode });
                    window.location.href = `/pricing?${p}`;
                  }}
                >
                  See My Price
                  <ArrowRight className="h-4 w-4" />
                </Button>

                <p className="text-center text-xs text-secondary-400">
                  No payment required &middot; No spam &middot; Cancel anytime
                </p>
              </div>

              {/* Footer trust bar */}
              <div className="flex items-center justify-between border-t border-secondary-100 bg-secondary-50 px-7 py-4">
                <div className="flex items-center gap-1.5">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-secondary-700">4.9/5</span>
                </div>
                <span className="text-xs text-secondary-400">2,847 verified reviews</span>
                <div className="flex items-center gap-1.5">
                  {/* Google G */}
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  <span className="text-xs font-semibold text-secondary-500">Google</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1.5 md:flex" style={{ opacity: 0.45 }}>
        <span className="text-[10px] font-semibold uppercase tracking-widest text-white">Scroll</span>
        <div className="flex h-8 w-5 items-start justify-center rounded-full border border-white/40 pt-1.5">
          <div className="h-2 w-1 animate-bounce rounded-full bg-white" />
        </div>
      </div>
    </section>
  );
}
