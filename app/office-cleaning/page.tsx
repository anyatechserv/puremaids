import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Building2, CheckCircle, ArrowRight, Phone, Star, Shield, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Office Cleaning London | Commercial Cleaning Services | PureMaids',
  description:
    'Professional office and commercial cleaning services across London. Flexible scheduling, after-hours cleans available. Get a bespoke quote for your workplace.',
};

const included = [
  'Desks, workstations and office furniture',
  'Meeting rooms and boardrooms',
  'Reception and communal areas',
  'Kitchen and breakout areas',
  'Toilets and washrooms sanitised',
  'Floor vacuuming and mopping',
  'Waste bin emptying and recycling',
  'Window sills and ledges',
  'Computer screens and equipment (exterior)',
  'Fridges and kitchen appliances',
  'Supply restocking (paper towels, soap)',
  'Stairwells and fire escapes',
];

export default function OfficeCleaningPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-secondary-800 to-secondary-700 py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-violet-500 rounded-lg flex items-center justify-center">
                <Building2 className="w-4 h-4 text-white" />
              </div>
              <span className="text-violet-300 font-medium text-sm">Office Cleaning</span>
            </div>
            <h1 className="font-heading font-bold text-4xl md:text-5xl text-white mb-5 leading-tight">
              A Spotless Workplace<br />Every Single Day
            </h1>
            <p className="text-secondary-200 text-lg leading-relaxed mb-8 max-w-2xl">
              Professional office cleaning tailored to your business. 
              Flexible early-morning, daytime, or after-hours service to minimise disruption.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/contact">
                <Button size="xl">Get a Custom Quote</Button>
              </Link>
              <a href={`tel:${SITE_CONFIG.phone.replace(/\s/g,'')}`}>
                <Button variant="outline" size="xl" className="border-white/30 text-white hover:bg-white/10">
                  <Phone className="w-4 h-4" />
                  {SITE_CONFIG.phone}
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-6 bg-violet-600">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-wrap gap-6 justify-center text-white text-sm font-medium">
            {[
              { icon: Star, text: 'Bespoke pricing' },
              { icon: Shield, text: 'Fully insured & DBS checked' },
              { icon: Clock, text: 'After-hours available' },
              { icon: CheckCircle, text: 'COSHH compliant products' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2">
                <Icon className="w-4 h-4 opacity-80" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <img
                src="https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg"
                alt="Professional office cleaning service"
                className="w-full h-72 object-cover rounded-2xl mb-8"
              />
              <h2 className="font-heading font-bold text-2xl text-secondary-800 mb-4">
                Commercial Cleaning Tailored to You
              </h2>
              <p className="text-secondary-500 leading-relaxed mb-6">
                Every office is different. Whether you need a daily clean for a large open-plan space 
                or a weekly freshen-up for a small studio, we tailor our service to your exact needs and budget.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {included.map((item) => (
                  <div key={item} className="flex items-start gap-2.5">
                    <CheckCircle className="w-[18px] h-[18px] text-accent-500 flex-shrink-0 mt-0.5" />
                    <span className="text-secondary-600 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-secondary-50 rounded-2xl p-6 sticky top-24">
                <h3 className="font-heading font-semibold text-secondary-800 text-xl mb-1">Starting Prices</h3>
                <p className="text-secondary-500 text-sm mb-5">Contact us for a custom quote</p>
                <div className="space-y-3 mb-5">
                  {[
                    { size: 'Small (up to 500 sq ft)', price: '£99/visit' },
                    { size: 'Medium (500–1500 sq ft)', price: '£179/visit' },
                    { size: 'Large (1500+ sq ft)', price: 'From £299/visit' },
                    { size: 'Daily contracts', price: 'Discounted rates' },
                  ].map(({ size, price }) => (
                    <div key={size} className="flex justify-between items-center py-2.5 border-b border-secondary-100 last:border-0">
                      <span className="text-secondary-600 text-sm">{size}</span>
                      <span className="font-semibold text-secondary-800 text-sm">{price}</span>
                    </div>
                  ))}
                </div>
                <Link href="/contact" className="block">
                  <Button className="w-full" size="lg">
                    Get a Custom Quote
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <a href={`tel:${SITE_CONFIG.phone.replace(/\s/g,'')}`} className="block mt-3">
                  <Button variant="outline" className="w-full" size="lg">
                    <Phone className="w-4 h-4" />
                    Call to Discuss
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
