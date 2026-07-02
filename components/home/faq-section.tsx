'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const faqs = [
  {
    q: 'How quickly can you arrange a cleaner?',
    a: 'For most areas we can arrange a cleaner within 24–48 hours. In many cases we offer same-day availability — just give us a call and we\'ll do our best to accommodate you.',
  },
  {
    q: 'Do your cleaners bring their own products and equipment?',
    a: 'Yes — all our cleaners arrive fully equipped with professional-grade, eco-friendly cleaning products. You don\'t need to provide a thing. If you have specific product preferences or allergies, just let us know.',
  },
  {
    q: 'Are your cleaners insured and DBS checked?',
    a: 'Absolutely. Every PureMaids cleaner undergoes a full DBS (Disclosure and Barring Service) background check before their first assignment. All are also covered by our £5 million public liability insurance.',
  },
  {
    q: 'Will I get the same cleaner each time?',
    a: 'For regular domestic cleaning, yes — we match you with a dedicated cleaner who gets to know your home and preferences. In the rare event of illness or holiday, we always notify you in advance and offer a trusted replacement.',
  },
  {
    q: 'What is your cancellation policy?',
    a: 'You can cancel or reschedule with at least 24 hours notice at no charge. We understand life happens — we just ask for reasonable notice so we can reassign our cleaners appropriately.',
  },
  {
    q: 'Do you offer a satisfaction guarantee?',
    a: 'Yes, 100%. If you\'re not satisfied with any aspect of your clean, notify us within 24 hours and we\'ll return to put it right at no extra cost. Your satisfaction is our priority, not a policy.',
  },
];

function FaqItem({ q, a, isOpen, onToggle }: { q: string; a: string; isOpen: boolean; onToggle: () => void }) {
  return (
    <button
      className="w-full text-left group"
      onClick={onToggle}
      type="button"
    >
      <div className={cn(
        'rounded-2xl border transition-all duration-200 overflow-hidden',
        isOpen
          ? 'border-primary-200 bg-primary-50 shadow-soft'
          : 'border-secondary-100 bg-white hover:border-primary-100 hover:bg-secondary-50'
      )}>
        <div className="flex items-center justify-between gap-4 px-6 py-5">
          <span className={cn(
            'font-semibold text-sm md:text-base leading-snug text-left',
            isOpen ? 'text-primary-700' : 'text-secondary-800 group-hover:text-primary-600'
          )}>
            {q}
          </span>
          <div className={cn(
            'w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200',
            isOpen ? 'bg-primary-500 rotate-180' : 'bg-secondary-100 group-hover:bg-primary-100'
          )}>
            <ChevronDown className={cn('w-4 h-4 transition-colors', isOpen ? 'text-white' : 'text-secondary-500 group-hover:text-primary-600')} />
          </div>
        </div>
        {isOpen && (
          <div className="px-6 pb-5">
            <p className="text-secondary-600 text-sm leading-relaxed">{a}</p>
          </div>
        )}
      </div>
    </button>
  );
}

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-14">
          <span className="inline-block text-primary-500 font-semibold text-sm uppercase tracking-widest mb-3">FAQ</span>
          <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-secondary-800 leading-tight mb-4">
            Common Questions
          </h2>
          <p className="text-secondary-500 max-w-md mx-auto text-base leading-relaxed">
            Everything you need to know before booking. Can&apos;t find your answer? We&apos;re a phone call away.
          </p>
        </div>

        <div className="space-y-3 mb-10">
          {faqs.map((faq, i) => (
            <FaqItem
              key={i}
              q={faq.q}
              a={faq.a}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/faq"
            className="inline-flex items-center gap-2 text-primary-600 font-semibold text-sm hover:gap-3 transition-all duration-200"
          >
            View all FAQs
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
