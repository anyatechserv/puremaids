'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Star, Shield, Clock, Leaf, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { SITE_CONFIG } from '@/lib/constants';

const trustBadges = [
  { icon: Shield, text: 'Fully Insured' },
  { icon: Star, text: '4.9/5 Rating' },
  { icon: Clock, text: 'Same Day Available' },
  { icon: Leaf, text: 'Eco-Friendly' },
];

export default function HeroSection() {
  const [serviceType, setServiceType] = useState('domestic');
  const [bedrooms, setBedrooms] = useState('');
  const [postcode, setPostcode] = useState('');

  const handleGetQuote = () => {
    const params = new URLSearchParams({ service: serviceType, bedrooms, postcode });
    window.location.href = `/pricing?${params.toString()}`;
  };

  return (
    <section className="relative overflow-hidden bg-secondary-800 min-h-[600px] flex items-center">
      {/* Background image overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(https://images.pexels.com/photos/4108714/pexels-photo-4108714.jpeg)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-secondary-900/90 via-secondary-800/80 to-secondary-700/50" />

      {/* Decorative circles */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-64 h-64 bg-accent-500/10 rounded-full blur-3xl" />

      <div className="relative container mx-auto px-4 max-w-7xl py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Hero copy */}
          <div>
            <div className="inline-flex items-center gap-2 bg-primary-500/20 border border-primary-400/30 rounded-full px-4 py-1.5 mb-6">
              <Star className="w-3.5 h-3.5 text-primary-300 fill-primary-300" />
              <span className="text-primary-200 text-sm font-medium">Rated 4.9/5 by 2,847 customers</span>
            </div>

            <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl text-white leading-[1.1] mb-6">
              London&apos;s Most{' '}
              <span className="text-primary-400">Trusted</span>{' '}
              Cleaning Service
            </h1>

            <p className="text-secondary-200 text-lg md:text-xl leading-relaxed mb-8 max-w-lg">
              Professional, fully insured cleaners who care about your home as much as you do. 
              Flexible scheduling, transparent pricing, guaranteed satisfaction.
            </p>

            <div className="flex flex-wrap gap-3 mb-8">
              {trustBadges.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1.5">
                  <Icon className="w-3.5 h-3.5 text-primary-400" />
                  <span className="text-white text-xs font-medium">{text}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <a href={`tel:${SITE_CONFIG.phone.replace(/\s/g,'')}`}>
                <Button variant="white" size="lg" className="gap-2">
                  <Phone className="w-4 h-4" />
                  {SITE_CONFIG.phone}
                </Button>
              </a>
              <Link href="/pricing">
                <Button variant="outline" size="lg" className="border-white/40 text-white hover:bg-white/10 hover:border-white/60">
                  View Pricing
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Booking form */}
          <div className="bg-white rounded-3xl p-7 shadow-large">
            <h2 className="font-heading font-bold text-secondary-800 text-xl mb-1">
              Get an Instant Quote
            </h2>
            <p className="text-secondary-500 text-sm mb-5">Free, no-obligation estimate in 60 seconds</p>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-secondary-700 mb-1.5 block">Service Type</label>
                <div className="relative">
                  <Select value={serviceType} onChange={(e) => setServiceType(e.target.value)}>
                    <option value="domestic">Domestic Cleaning</option>
                    <option value="deep">Deep Cleaning</option>
                    <option value="end_of_tenancy">End of Tenancy Cleaning</option>
                    <option value="office">Office Cleaning</option>
                  </Select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {serviceType !== 'office' ? (
                <div>
                  <label className="text-sm font-medium text-secondary-700 mb-1.5 block">Number of Bedrooms</label>
                  <div className="relative">
                    <Select value={bedrooms} onChange={(e) => setBedrooms(e.target.value)}>
                      <option value="">Select bedrooms</option>
                      <option value="studio">Studio / 1 Bedroom</option>
                      <option value="2">2 Bedrooms</option>
                      <option value="3">3 Bedrooms</option>
                      <option value="4">4 Bedrooms</option>
                      <option value="5+">5+ Bedrooms</option>
                    </Select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-4 h-4 text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="text-sm font-medium text-secondary-700 mb-1.5 block">Office Size</label>
                  <div className="relative">
                    <Select value={bedrooms} onChange={(e) => setBedrooms(e.target.value)}>
                      <option value="">Select office size</option>
                      <option value="small">Small (up to 500 sq ft)</option>
                      <option value="medium">Medium (500–1500 sq ft)</option>
                      <option value="large">Large (1500+ sq ft)</option>
                    </Select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-4 h-4 text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-secondary-700 mb-1.5 block">Your Postcode</label>
                <Input
                  placeholder="e.g. SW1A 1AA"
                  value={postcode}
                  onChange={(e) => setPostcode(e.target.value.toUpperCase())}
                  maxLength={8}
                />
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={handleGetQuote}
              >
                Get My Free Quote
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

            <p className="text-xs text-secondary-400 text-center mt-4">
              No payment required. No spam. Cancel anytime.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
