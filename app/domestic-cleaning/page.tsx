import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, CheckCircle, ArrowRight, Phone, Calendar, Star, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Domestic Cleaning London | Weekly & Fortnightly | PureMaids',
  description:
    'Professional domestic cleaning services across London. Regular weekly or fortnightly cleans from £59. Vetted, insured cleaners. Book online today.',
};

const included = [
  'Kitchen — worktops, appliances, sinks, floors',
  'Bathrooms — toilets, sinks, shower/bath, mirrors',
  'Bedrooms — dusting, hoovering, bed making',
  'Living rooms — dusting, vacuuming, tidying',
  'Hallways, stairs & landings',
  'General tidying and organising',
  'Emptying bins & recycling',
  'Window sills & ledges',
];

const faqs = [
  {
    q: 'Do I need to provide cleaning products?',
    a: 'No, our cleaners bring all professional-grade, eco-friendly products and equipment. Just let us know if you have any allergies or product preferences.',
  },
  {
    q: 'Will I have the same cleaner every visit?',
    a: 'Yes. We match you with a dedicated cleaner who learns your home and preferences. In the rare case of illness or holiday, we\'ll always notify you in advance.',
  },
  {
    q: 'How do I access my home on cleaning days?',
    a: 'Many customers provide a spare key which we store securely. Others use a key safe or let the cleaner in. We can discuss the best option for you.',
  },
  {
    q: 'What happens if something gets damaged?',
    a: 'All our cleaners are fully insured with public liability cover up to £5M. Any damage is extremely rare, but if it occurs, it will be resolved promptly.',
  },
];

export default function DomesticCleaningPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-secondary-800 to-secondary-700 py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <Home className="w-4 h-4 text-white" />
              </div>
              <span className="text-primary-300 font-medium text-sm">Domestic Cleaning</span>
            </div>
            <h1 className="font-heading font-bold text-4xl md:text-5xl text-white mb-5 leading-tight">
              Regular Home Cleaning<br />You Can Count On
            </h1>
            <p className="text-secondary-200 text-lg leading-relaxed mb-8 max-w-2xl">
              Weekly or fortnightly domestic cleaning tailored to your home and lifestyle. 
              A dedicated, vetted cleaner who learns exactly how you like things done.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/book-online">
                <Button size="xl">Book a Clean</Button>
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

      {/* Pricing highlights */}
      <section className="py-6 bg-primary-500">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-wrap gap-6 justify-center text-white text-sm font-medium">
            {[
              { icon: Star, text: 'From £59 per clean' },
              { icon: Shield, text: 'Fully insured & DBS checked' },
              { icon: Calendar, text: 'Flexible scheduling' },
              { icon: CheckCircle, text: '100% satisfaction guarantee' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-primary-100" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <img
                src="https://images.pexels.com/photos/4108741/pexels-photo-4108741.jpeg"
                alt="Professional domestic cleaning"
                className="w-full h-72 object-cover rounded-2xl mb-8"
              />
              <h2 className="font-heading font-bold text-2xl text-secondary-800 mb-4">
                What&apos;s Included in Your Domestic Clean
              </h2>
              <p className="text-secondary-500 leading-relaxed mb-6">
                Our standard domestic cleaning service covers every room in your home. 
                We work from a comprehensive checklist to ensure nothing is missed, every single visit.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {included.map((item) => (
                  <div key={item} className="flex items-start gap-2.5">
                    <CheckCircle className="w-4.5 h-4.5 text-accent-500 flex-shrink-0 mt-0.5 w-[18px] h-[18px]" />
                    <span className="text-secondary-600 text-sm">{item}</span>
                  </div>
                ))}
              </div>

              <h2 className="font-heading font-bold text-2xl text-secondary-800 mb-4">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {faqs.map((faq) => (
                  <div key={faq.q} className="bg-secondary-50 rounded-xl p-5">
                    <h3 className="font-semibold text-secondary-800 text-sm mb-2">{faq.q}</h3>
                    <p className="text-secondary-500 text-sm leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-secondary-50 rounded-2xl p-6 mb-5 sticky top-24">
                <h3 className="font-heading font-semibold text-secondary-800 text-xl mb-1">Quick Quote</h3>
                <p className="text-secondary-500 text-sm mb-5">Transparent, fixed pricing</p>
                <div className="space-y-3 mb-5">
                  {[
                    { size: 'Studio / 1 Bed', price: '£59' },
                    { size: '2 Bedrooms', price: '£79' },
                    { size: '3 Bedrooms', price: '£99' },
                    { size: '4 Bedrooms', price: '£129' },
                    { size: '5+ Bedrooms', price: 'From £159' },
                  ].map(({ size, price }) => (
                    <div key={size} className="flex justify-between items-center py-2.5 border-b border-secondary-100 last:border-0">
                      <span className="text-secondary-600 text-sm">{size}</span>
                      <span className="font-semibold text-secondary-800 text-sm">{price}</span>
                    </div>
                  ))}
                </div>
                <Link href="/book-online" className="block">
                  <Button className="w-full" size="lg">
                    Book Online
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <a href={`tel:${SITE_CONFIG.phone.replace(/\s/g,'')}`} className="block mt-3">
                  <Button variant="outline" className="w-full" size="lg">
                    <Phone className="w-4 h-4" />
                    Call to Book
                  </Button>
                </a>
                <p className="text-xs text-secondary-400 text-center mt-3">
                  * Prices include VAT. No hidden charges.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
