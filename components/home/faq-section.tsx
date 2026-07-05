'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, Minus, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const faqs = [
  {
    q: 'Do you offer house cleaning in Bolton?',
    a: 'Yes — PureMaids is based in Bolton and covers the whole of Bolton borough including Farnworth, Horwich, Westhoughton, Little Lever and Kearsley. We can usually arrange a cleaner within 24–48 hours.',
  },
  {
    q: 'Which areas of Greater Manchester do you cover?',
    a: 'We cover Manchester city, Salford, Bury, Radcliffe, Ramsbottom, Wigan, Leigh, Atherton, Preston, Chorley and many more North West towns. If you\'re unsure, enter your postcode on our booking page for an instant check.',
  },
  {
    q: 'Do your cleaners bring their own products and equipment?',
    a: 'Yes — all our cleaners arrive fully equipped with professional-grade, eco-friendly products and equipment. You don\'t need to provide a thing. If you have specific preferences or allergies, just let us know.',
  },
  {
    q: 'Are your cleaners insured and DBS checked?',
    a: 'Absolutely. Every PureMaids cleaner undergoes a full DBS background check before their first assignment and is covered by our £5 million public liability insurance policy.',
  },
  {
    q: 'Will I get the same cleaner each time?',
    a: 'For regular domestic cleaning, yes. We match you with a dedicated cleaner who learns your home and preferences. In the rare event of illness or holiday, we always notify you in advance and send a vetted replacement.',
  },
  {
    q: 'Do you offer a satisfaction guarantee?',
    a: 'Yes, 100%. If you\'re not satisfied with any aspect of your clean, notify us within 24 hours and we\'ll return to put it right at no extra cost. Your satisfaction is our only measure of success.',
  },
];

export default function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-4xl px-4">

        <div className="mb-14 text-center">
          <span className="mb-3 inline-block text-sm font-bold uppercase tracking-widest text-primary-500">
            FAQ
          </span>
          <h2 className="font-heading text-4xl font-extrabold leading-tight text-secondary-800 md:text-5xl mb-4">
            Common Questions About<br />Our Cleaning Services
          </h2>
          <p className="mx-auto max-w-md text-base leading-relaxed text-secondary-500">
            Everything you need to know about house cleaning in Bolton and Greater Manchester. Can&apos;t find your answer? Call us on 0800 012 3456.
          </p>
        </div>

        <div className="space-y-3 mb-10">
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <button
                key={i}
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                className="w-full text-left"
              >
                <div
                  className={cn(
                    'overflow-hidden rounded-2xl border transition-all duration-200',
                    isOpen
                      ? 'border-primary-200 bg-primary-50 shadow-[0_4px_20px_-4px_rgba(0,174,239,0.12)]'
                      : 'border-secondary-100 bg-white hover:border-primary-100 hover:bg-secondary-50/70',
                  )}
                >
                  <div className="flex items-center justify-between gap-4 px-6 py-5">
                    <span
                      className={cn(
                        'font-semibold leading-snug text-sm md:text-base',
                        isOpen ? 'text-primary-700' : 'text-secondary-800',
                      )}
                    >
                      {faq.q}
                    </span>
                    <div
                      className={cn(
                        'flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors duration-200',
                        isOpen ? 'bg-primary-500' : 'bg-secondary-100 group-hover:bg-primary-50',
                      )}
                    >
                      {isOpen
                        ? <Minus className="h-3.5 w-3.5 text-white" />
                        : <Plus className="h-3.5 w-3.5 text-secondary-500" />}
                    </div>
                  </div>
                  {isOpen && (
                    <div className="px-6 pb-5">
                      <p className="text-sm leading-relaxed text-secondary-600">{faq.a}</p>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className="text-center">
          <Link
            href="/faq"
            className="inline-flex items-center gap-2 text-sm font-bold text-primary-600 transition-all hover:gap-3"
          >
            View all FAQs
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
