'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle, Star, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SITE_CONFIG } from '@/lib/constants';

const pricingData = {
  domestic: {
    label: 'Domestic Cleaning',
    sizes: [
      { key: 'studio', label: 'Studio / 1 Bed', pence: 5900 },
      { key: 'two', label: '2 Bedrooms', pence: 7900 },
      { key: 'three', label: '3 Bedrooms', pence: 9900 },
      { key: 'four', label: '4 Bedrooms', pence: 12900 },
      { key: 'five', label: '5+ Bedrooms', pence: 15900 },
    ],
  },
  deep: {
    label: 'Deep Cleaning',
    sizes: [
      { key: 'studio', label: 'Studio / 1 Bed', pence: 12900 },
      { key: 'two', label: '2 Bedrooms', pence: 16900 },
      { key: 'three', label: '3 Bedrooms', pence: 21900 },
      { key: 'four', label: '4 Bedrooms', pence: 27900 },
      { key: 'five', label: '5+ Bedrooms', pence: 34900 },
    ],
  },
  end_of_tenancy: {
    label: 'End of Tenancy',
    sizes: [
      { key: 'studio', label: 'Studio / 1 Bed', pence: 14900 },
      { key: 'two', label: '2 Bedrooms', pence: 19900 },
      { key: 'three', label: '3 Bedrooms', pence: 24900 },
      { key: 'four', label: '4 Bedrooms', pence: 29900 },
      { key: 'five', label: '5+ Bedrooms', pence: 37900 },
    ],
  },
};

const extras = [
  { key: 'oven', label: 'Professional Oven Clean', pence: 4900 },
  { key: 'fridge', label: 'Inside Fridge Clean', pence: 1900 },
  { key: 'windows', label: 'Interior Window Clean', pence: 2900 },
  { key: 'carpet', label: 'Carpet Steam Clean (per room)', pence: 4900 },
  { key: 'laundry', label: 'Laundry & Ironing (per hour)', pence: 1800 },
];

export default function PricingCalculator() {
  const [service, setService] = useState<keyof typeof pricingData>('domestic');
  const [sizeKey, setSizeKey] = useState('');
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);

  const currentService = pricingData[service];
  const selectedSize = currentService.sizes.find((s) => s.key === sizeKey);
  const basePrice = selectedSize?.pence ?? 0;
  const extrasTotal = extras.filter((e) => selectedExtras.includes(e.key)).reduce((acc, e) => acc + e.pence, 0);
  const totalPence = basePrice + extrasTotal;
  const fmt = (p: number) => `£${(p / 100).toFixed(2)}`;

  const toggleExtra = (key: string) =>
    setSelectedExtras((prev) => prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]);

  return (
    <>
      <section className="bg-gradient-to-br from-secondary-800 to-secondary-700 py-16">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <h1 className="font-heading font-bold text-4xl md:text-5xl text-white mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-secondary-200 text-lg max-w-xl mx-auto">
            No hidden fees. No surprise charges. What you see is what you pay.
          </p>
        </div>
      </section>

      {/* Calculator */}
      <section className="py-16 bg-secondary-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-8">
            <span className="text-primary-500 font-semibold text-sm uppercase tracking-widest">Instant Quote</span>
            <h2 className="font-heading font-bold text-3xl text-secondary-800 mt-2">Calculate Your Price</h2>
          </div>

          <div className="bg-white rounded-3xl shadow-large overflow-hidden">
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="text-sm font-semibold text-secondary-700 mb-2 block">Service Type</label>
                  <div className="grid grid-cols-1 gap-2">
                    {Object.entries(pricingData).map(([key, data]) => (
                      <button
                        key={key}
                        onClick={() => { setService(key as keyof typeof pricingData); setSizeKey(''); }}
                        className={`flex items-center gap-3 p-3.5 rounded-xl border-2 text-left transition-all ${service === key ? 'border-primary-500 bg-primary-50' : 'border-secondary-100 hover:border-secondary-200'}`}
                      >
                        <div className={`w-3 h-3 rounded-full flex-shrink-0 ${service === key ? 'bg-primary-500' : 'bg-secondary-200'}`} />
                        <span className={`font-medium text-sm ${service === key ? 'text-primary-700' : 'text-secondary-600'}`}>{data.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-secondary-700 mb-2 block">Property Size</label>
                  <div className="grid grid-cols-1 gap-2">
                    {currentService.sizes.map((size) => (
                      <button
                        key={size.key}
                        onClick={() => setSizeKey(size.key)}
                        className={`flex items-center justify-between p-3.5 rounded-xl border-2 text-left transition-all ${sizeKey === size.key ? 'border-primary-500 bg-primary-50' : 'border-secondary-100 hover:border-secondary-200'}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full flex-shrink-0 ${sizeKey === size.key ? 'bg-primary-500' : 'bg-secondary-200'}`} />
                          <span className={`font-medium text-sm ${sizeKey === size.key ? 'text-primary-700' : 'text-secondary-600'}`}>{size.label}</span>
                        </div>
                        <span className="font-semibold text-secondary-800 text-sm">{fmt(size.pence)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-t border-secondary-100 pt-6">
                <label className="text-sm font-semibold text-secondary-700 mb-3 block">Optional Extras</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {extras.map((extra) => (
                    <button
                      key={extra.key}
                      onClick={() => toggleExtra(extra.key)}
                      className={`flex items-center justify-between p-3 rounded-xl border-2 text-left transition-all ${selectedExtras.includes(extra.key) ? 'border-primary-500 bg-primary-50' : 'border-secondary-100 hover:border-secondary-200'}`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-4 h-4 rounded flex-shrink-0 flex items-center justify-center border-2 ${selectedExtras.includes(extra.key) ? 'bg-primary-500 border-primary-500' : 'border-secondary-300'}`}>
                          {selectedExtras.includes(extra.key) && <CheckCircle className="w-3 h-3 text-white" />}
                        </div>
                        <span className="text-secondary-600 text-sm">{extra.label}</span>
                      </div>
                      <span className="font-medium text-secondary-700 text-sm">+{fmt(extra.pence)}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className={`p-8 ${sizeKey ? 'bg-primary-500' : 'bg-secondary-100'}`}>
              {sizeKey ? (
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                  <div>
                    <div className="text-primary-100 text-sm font-medium mb-1">Your Total</div>
                    <div className="font-heading font-bold text-5xl text-white">{fmt(totalPence)}</div>
                    {extrasTotal > 0 && (
                      <div className="text-primary-200 text-sm mt-1">Base: {fmt(basePrice)} + Extras: {fmt(extrasTotal)}</div>
                    )}
                    <div className="text-primary-100 text-xs mt-1">Includes VAT · No hidden fees</div>
                  </div>
                  <div className="flex flex-col gap-2 w-full md:w-auto">
                    <Link href="/book-online">
                      <Button variant="white" size="lg" className="w-full md:w-auto">
                        Book This Clean <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                    <a href={`tel:${SITE_CONFIG.phone.replace(/\s/g,'')}`}>
                      <Button variant="outline" size="lg" className="w-full md:w-auto border-white/40 text-white hover:bg-white/10">
                        <Phone className="w-4 h-4" /> Call to Book
                      </Button>
                    </a>
                  </div>
                </div>
              ) : (
                <div className="text-center text-secondary-500 py-2">
                  Select a property size above to see your price
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Office pricing */}
      <section className="py-14 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-8">
            <h2 className="font-heading font-bold text-3xl text-secondary-800">Office Cleaning</h2>
            <p className="text-secondary-500 mt-2">Bespoke commercial cleaning — contact us for a tailored quote</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { name: 'Small Office', size: 'Up to 500 sq ft', price: '£99', features: ['Up to 10 desks', 'Kitchen & bathroom', 'Flexible scheduling'] },
              { name: 'Medium Office', size: '500–1,500 sq ft', price: '£179', popular: true, features: ['Up to 30 desks', 'Multiple bathrooms', 'Supply restocking', 'After-hours available'] },
              { name: 'Large Office', size: '1,500+ sq ft', price: 'Custom', features: ['Unlimited desks', 'Full building coverage', 'Dedicated account manager', 'Daily cleans available'] },
            ].map((plan) => (
              <div key={plan.name} className={`rounded-2xl p-6 border-2 relative ${plan.popular ? 'border-primary-500 shadow-medium' : 'border-secondary-100'}`}>
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="bg-primary-500 text-white text-xs font-semibold px-3 py-1 rounded-full">Most Popular</span>
                  </div>
                )}
                <h3 className="font-heading font-semibold text-secondary-800 text-lg mb-0.5">{plan.name}</h3>
                <p className="text-secondary-400 text-xs mb-3">{plan.size}</p>
                <div className="font-heading font-bold text-3xl text-secondary-800 mb-1">
                  {plan.price}{plan.price !== 'Custom' && <span className="text-secondary-400 text-base font-normal">/visit</span>}
                </div>
                <div className="my-4 border-t border-secondary-100" />
                <ul className="space-y-2.5 mb-5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-secondary-600">
                      <CheckCircle className="w-4 h-4 text-accent-500 flex-shrink-0" />{f}
                    </li>
                  ))}
                </ul>
                <Link href="/contact">
                  <Button variant={plan.popular ? 'primary' : 'outline'} className="w-full">Get a Quote</Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 bg-secondary-50 border-t border-secondary-100">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex flex-wrap gap-6 justify-center items-center">
            {[
              { icon: Star, text: '4.9/5 customer rating' },
              { icon: CheckCircle, text: 'All prices include VAT' },
              { icon: CheckCircle, text: 'No hidden charges' },
              { icon: CheckCircle, text: 'Satisfaction guarantee' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-sm text-secondary-600">
                <Icon className="w-4 h-4 text-primary-500" />{text}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
