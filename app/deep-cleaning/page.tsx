import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Sparkles, CheckCircle, ArrowRight, Phone, Star, Shield, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Deep Cleaning London | Top-to-Bottom Professional Clean | PureMaids',
  description:
    'Professional deep cleaning service across London. Thorough top-to-bottom clean including inside appliances, carpets, and more. From £129. Book online.',
};

const included = [
  'Full kitchen deep clean — inside oven, fridge, microwave',
  'Bathroom de-scaling and grout cleaning',
  'Inside all cupboards and drawers',
  'Windows (interior) and window frames',
  'Skirting boards, coving and picture rails',
  'Light fittings, switches and plug sockets',
  'Behind and under all furniture',
  'Deep carpet vacuuming and stain treatment',
  'Mattress vacuuming',
  'Wardrobe interiors',
  'Radiator cleaning',
  'Door frames and architraves',
];

export default function DeepCleaningPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-secondary-800 to-secondary-700 py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-accent-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-accent-300 font-medium text-sm">Deep Cleaning</span>
            </div>
            <h1 className="font-heading font-bold text-4xl md:text-5xl text-white mb-5 leading-tight">
              A Truly Thorough<br />Deep Clean
            </h1>
            <p className="text-secondary-200 text-lg leading-relaxed mb-8 max-w-2xl">
              Our deep cleaning service goes far beyond a standard clean — every corner, every surface, 
              every appliance gets meticulous attention. Perfect for spring cleans, post-renovation, or a fresh start.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/book-online">
                <Button size="xl">Book a Deep Clean</Button>
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

      <section className="py-6 bg-accent-500">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-wrap gap-6 justify-center text-white text-sm font-medium">
            {[
              { icon: Star, text: 'From £129 per clean' },
              { icon: Shield, text: 'Fully insured & DBS checked' },
              { icon: Clock, text: '4–8 hours typical duration' },
              { icon: CheckCircle, text: 'Satisfaction guarantee' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-accent-100" />
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
                src="https://images.pexels.com/photos/6195130/pexels-photo-6195130.jpeg"
                alt="Professional deep cleaning service"
                className="w-full h-72 object-cover rounded-2xl mb-8"
              />
              <h2 className="font-heading font-bold text-2xl text-secondary-800 mb-4">
                What&apos;s Included in a Deep Clean
              </h2>
              <p className="text-secondary-500 leading-relaxed mb-6">
                Our deep cleaning service is the most comprehensive clean we offer. 
                Teams of 2–4 professional cleaners work systematically through your property, 
                leaving it in pristine condition.
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
              <div className="bg-secondary-50 rounded-2xl p-6 mb-5 sticky top-24">
                <h3 className="font-heading font-semibold text-secondary-800 text-xl mb-1">Quick Quote</h3>
                <p className="text-secondary-500 text-sm mb-5">Transparent, fixed pricing</p>
                <div className="space-y-3 mb-5">
                  {[
                    { size: 'Studio / 1 Bed', price: '£129' },
                    { size: '2 Bedrooms', price: '£169' },
                    { size: '3 Bedrooms', price: '£219' },
                    { size: '4 Bedrooms', price: '£279' },
                    { size: '5+ Bedrooms', price: 'From £349' },
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
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
