import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Key, CheckCircle, ArrowRight, Phone, Star, Shield, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'End of Tenancy Cleaning London | Deposit Back Guaranteed | PureMaids',
  description:
    'Professional end of tenancy cleaning London. Deposit-back guarantee. Landlord and letting agent approved. From £149. Fully insured. Book online today.',
};

const included = [
  'Full kitchen deep clean including oven, fridge, microwave',
  'Bathroom and toilet descale, polish and sanitise',
  'All carpets professionally vacuumed',
  'Windows cleaned inside (and outside where accessible)',
  'All cupboards and wardrobes cleaned inside and out',
  'Skirting boards, doors and door frames',
  'Walls spot cleaned',
  'Light fittings and switches',
  'Behind and under furniture',
  'Radiators and extractor fans',
  'Garden patio sweep (if applicable)',
  'Full written checklist provided',
];

export default function EndOfTenancyPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-secondary-800 to-secondary-700 py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
                <Key className="w-4 h-4 text-white" />
              </div>
              <span className="text-amber-300 font-medium text-sm">End of Tenancy Cleaning</span>
            </div>
            <h1 className="font-heading font-bold text-4xl md:text-5xl text-white mb-5 leading-tight">
              Get Your Full Deposit<br />Back — Guaranteed
            </h1>
            <p className="text-secondary-200 text-lg leading-relaxed mb-8 max-w-2xl">
              Our end of tenancy cleaning is carried out to landlord and letting agent standards. 
              We provide a written guarantee — if your landlord isn&apos;t satisfied, we&apos;ll re-clean free of charge.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/book-online">
                <Button size="xl">Book Now</Button>
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

      <section className="py-6 bg-amber-500">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-wrap gap-6 justify-center text-white text-sm font-medium">
            {[
              { icon: Award, text: 'Deposit-back guarantee' },
              { icon: Shield, text: 'Landlord approved checklist' },
              { icon: Star, text: 'From £149' },
              { icon: CheckCircle, text: 'Re-clean if needed — free' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-amber-100" />
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
                src="https://images.pexels.com/photos/7534761/pexels-photo-7534761.jpeg"
                alt="End of tenancy cleaning service"
                className="w-full h-72 object-cover rounded-2xl mb-8"
              />

              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-8 flex gap-3">
                <Award className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-amber-800 text-sm mb-1">Our Deposit-Back Guarantee</p>
                  <p className="text-amber-700 text-sm leading-relaxed">
                    If your landlord or letting agent raises any cleaning-related issues from our clean, 
                    we will return within 48 hours to address them — completely free of charge.
                  </p>
                </div>
              </div>

              <h2 className="font-heading font-bold text-2xl text-secondary-800 mb-4">
                Comprehensive Checklist
              </h2>
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
                <h3 className="font-heading font-semibold text-secondary-800 text-xl mb-1">Quick Quote</h3>
                <p className="text-secondary-500 text-sm mb-5">Fixed price, no hidden fees</p>
                <div className="space-y-3 mb-5">
                  {[
                    { size: 'Studio / 1 Bed', price: '£149' },
                    { size: '2 Bedrooms', price: '£199' },
                    { size: '3 Bedrooms', price: '£249' },
                    { size: '4 Bedrooms', price: '£299' },
                    { size: '5+ Bedrooms', price: 'From £379' },
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
