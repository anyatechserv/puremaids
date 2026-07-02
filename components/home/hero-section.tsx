'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Phone, Shield, Star, Clock, Leaf, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SITE_CONFIG } from '@/lib/constants';

const badges = [
  { icon: Shield, text: 'Fully Insured & DBS Checked' },
  { icon: Star, text: '4.9★ on Google (2,847 reviews)' },
  { icon: Clock, text: 'Same-Day Available' },
  { icon: Leaf, text: '100% Eco-Friendly Products' },
];

const serviceOptions = [
  { value: 'domestic', label: 'Domestic Cleaning' },
  { value: 'deep', label: 'Deep Cleaning' },
  { value: 'end_of_tenancy', label: 'End of Tenancy Cleaning' },
  { value: 'office', label: 'Office Cleaning' },
];

const bedroomOptions: Record<string, { value: string; label: string }[]> = {
  domestic: [
    { value: 'studio', label: 'Studio / 1 Bed' },
    { value: '2bed', label: '2 Bedrooms' },
    { value: '3bed', label: '3 Bedrooms' },
    { value: '4bed', label: '4 Bedrooms' },
    { value: '5plus', label: '5+ Bedrooms' },
  ],
  deep: [
    { value: 'studio', label: 'Studio / 1 Bed' },
    { value: '2bed', label: '2 Bedrooms' },
    { value: '3bed', label: '3 Bedrooms' },
    { value: '4bed', label: '4 Bedrooms' },
    { value: '5plus', label: '5+ Bedrooms' },
  ],
  end_of_tenancy: [
    { value: 'studio', label: 'Studio / 1 Bed' },
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

const CustomSelect = ({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
}) => (
  <div className="relative">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full h-12 pl-4 pr-10 bg-white border border-secondary-200 rounded-xl text-secondary-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent appearance-none cursor-pointer transition-all"
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
    <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400 pointer-events-none" />
  </div>
);

export default function HeroSection() {
  const [service, setService] = useState('domestic');
  const [size, setSize] = useState('');
  const [postcode, setPostcode] = useState('');

  const handleQuote = () => {
    const params = new URLSearchParams({ service, size, postcode });
    window.location.href = `/pricing?${params}`;
  };

  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
        style={{ backgroundImage: 'url(https://images.pexels.com/photos/4108715/pexels-photo-4108715.jpeg)' }}
      />
      {/* Layered gradients for depth */}
      <div className="absolute inset-0 bg-gradient-to-r from-secondary-900/95 via-secondary-900/80 to-secondary-800/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-secondary-900/60 via-transparent to-transparent" />

      {/* Decorative accent shapes */}
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary-400 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent-400 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full">
        <div className="container mx-auto px-4 max-w-7xl py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

            {/* Left — copy */}
            <div className="max-w-xl">
              {/* Social proof pill */}
              <div className="inline-flex items-center gap-2.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-7">
                <div className="flex -space-x-1.5">
                  {['#F59E0B','#10B981','#00AEEF'].map((c, i) => (
                    <div key={i} className="w-5 h-5 rounded-full border-2 border-white/30" style={{ backgroundColor: c }} />
                  ))}
                </div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <span className="text-white/90 text-xs font-medium">Trusted by 10,000+ UK homes</span>
              </div>

              <h1 className="font-heading font-bold text-white leading-[1.08] mb-5">
                <span className="text-4xl md:text-5xl lg:text-6xl block">Professional</span>
                <span className="text-4xl md:text-5xl lg:text-6xl block">House Cleaning</span>
                <span className="text-4xl md:text-5xl lg:text-6xl block">
                  Across the{' '}
                  <span className="relative">
                    <span className="text-primary-400">UK</span>
                    <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 100 8" preserveAspectRatio="none" style={{ height: '6px' }}>
                      <path d="M0 6 Q50 0 100 6" stroke="#00AEEF" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                    </svg>
                  </span>
                </span>
              </h1>

              <p className="text-secondary-200 text-lg md:text-xl leading-relaxed mb-8">
                Fully insured, DBS-checked cleaners delivering spotless results — every time. 
                Transparent pricing, no hidden fees, 100% satisfaction guaranteed.
              </p>

              {/* Trust badges */}
              <div className="grid grid-cols-2 gap-2.5 mb-9">
                {badges.map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2.5 bg-white/8 backdrop-blur-sm border border-white/15 rounded-xl px-3.5 py-2.5">
                    <Icon className="w-4 h-4 text-primary-400 flex-shrink-0" />
                    <span className="text-white/85 text-xs font-medium leading-tight">{text}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Link href="/book-online">
                  <Button size="xl" className="shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50">
                    Book a Clean
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <a
                  href={`tel:${SITE_CONFIG.phone.replace(/\s/g, '')}`}
                  className="flex items-center gap-2 text-white font-semibold hover:text-primary-300 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span className="text-sm">{SITE_CONFIG.phone}</span>
                </a>
              </div>
            </div>

            {/* Right — quote card */}
            <div>
              <div className="bg-white rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.4)] overflow-hidden">
                {/* Card header */}
                <div className="bg-primary-500 px-7 py-5">
                  <h2 className="font-heading font-bold text-white text-xl">Get an Instant Quote</h2>
                  <p className="text-primary-100 text-sm mt-0.5">Free estimate in under 60 seconds</p>
                </div>

                <div className="p-7 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-secondary-500 uppercase tracking-wider mb-2">
                      Service Type
                    </label>
                    <CustomSelect
                      value={service}
                      onChange={(v) => { setService(v); setSize(''); }}
                      options={serviceOptions}
                      placeholder="Select service"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-secondary-500 uppercase tracking-wider mb-2">
                      {service === 'office' ? 'Office Size' : 'Property Size'}
                    </label>
                    <CustomSelect
                      value={size}
                      onChange={setSize}
                      options={bedroomOptions[service] || bedroomOptions.domestic}
                      placeholder="Select size"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-secondary-500 uppercase tracking-wider mb-2">
                      Your Postcode
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. SW1A 1AA"
                      value={postcode}
                      onChange={(e) => setPostcode(e.target.value.toUpperCase())}
                      maxLength={8}
                      className="w-full h-12 px-4 border border-secondary-200 rounded-xl text-secondary-700 text-sm font-medium placeholder:text-secondary-300 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all"
                    />
                  </div>

                  <Button
                    className="w-full mt-1"
                    size="lg"
                    onClick={handleQuote}
                  >
                    Get My Free Quote
                    <ArrowRight className="w-4 h-4" />
                  </Button>

                  <p className="text-center text-xs text-secondary-400">
                    No payment required · No spam · Cancel anytime
                  </p>
                </div>

                {/* Social proof strip */}
                <div className="bg-secondary-50 border-t border-secondary-100 px-7 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />)}
                    </div>
                    <span className="font-semibold text-secondary-700 text-xs">4.9/5</span>
                  </div>
                  <span className="text-secondary-400 text-xs">2,847 verified reviews</span>
                  <div className="flex items-center gap-1">
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    <span className="text-secondary-500 text-xs font-medium">Google</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-1.5 opacity-50">
        <span className="text-white text-xs">Scroll</span>
        <div className="w-5 h-8 border border-white/40 rounded-full flex items-start justify-center pt-1.5">
          <div className="w-1 h-2 bg-white rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}


export default HeroSection