import React from 'react';
import type { Metadata } from 'next';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Phone } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions | PureMaids Cleaning Services',
  description:
    'Got questions about PureMaids cleaning services? Find answers to our most frequently asked questions about booking, pricing, cleaners, and more.',
};

const faqCategories = [
  {
    category: 'Booking & Scheduling',
    faqs: [
      {
        q: 'How do I book a cleaning service?',
        a: 'You can book online through our Book Online page, call us on our freephone number, or send us an email. Booking takes less than 2 minutes.',
      },
      {
        q: 'How far in advance do I need to book?',
        a: 'We recommend booking at least 48 hours in advance for regular cleans. For same-day bookings, call us and we\'ll do our best to accommodate you subject to availability.',
      },
      {
        q: 'Can I reschedule or cancel a booking?',
        a: 'Yes, you can reschedule or cancel with at least 24 hours notice at no charge. Late cancellations (under 24 hours) may incur a £25 fee.',
      },
      {
        q: 'Will I always have the same cleaner?',
        a: 'For regular domestic cleaning, yes — we assign you a dedicated cleaner who learns your home and preferences. In cases of illness or holiday, we\'ll always notify you in advance and offer a vetted replacement.',
      },
    ],
  },
  {
    category: 'Cleaning & Products',
    faqs: [
      {
        q: 'Do I need to provide cleaning products?',
        a: 'No. Our cleaners bring all professional-grade, eco-friendly cleaning products and equipment. If you have specific preferences or allergies, just let us know when booking.',
      },
      {
        q: 'Are your cleaning products safe for children and pets?',
        a: 'Yes, absolutely. We only use eco-friendly, non-toxic, biodegradable cleaning products that are completely safe for children, pets, and allergy sufferers.',
      },
      {
        q: 'What is the difference between a regular clean and a deep clean?',
        a: 'A regular clean covers all standard cleaning tasks — surfaces, floors, bathrooms, kitchens. A deep clean goes much further: inside appliances, behind furniture, skirting boards, light fittings, window frames, and more. We recommend a deep clean every 3–6 months.',
      },
    ],
  },
  {
    category: 'Our Cleaners',
    faqs: [
      {
        q: 'Are your cleaners DBS checked?',
        a: 'Yes. Every single cleaner employed by PureMaids undergoes a full DBS (Disclosure and Barring Service) background check before they clean any customer\'s home.',
      },
      {
        q: 'Are your cleaners insured?',
        a: 'Yes. All our cleaners are covered by comprehensive public liability insurance up to £5 million. In the extremely rare event of accidental damage, you are fully protected.',
      },
      {
        q: 'How are your cleaners trained?',
        a: 'All PureMaids cleaners complete a thorough in-house training programme before their first assignment. Training covers cleaning techniques, chemical handling, COSHH compliance, and customer service.',
      },
    ],
  },
  {
    category: 'Pricing & Payment',
    faqs: [
      {
        q: 'Are there any hidden fees?',
        a: 'Absolutely not. The price you see on our pricing page is the price you pay. All prices include VAT. There are no call-out fees, travel charges, or surprise extras.',
      },
      {
        q: 'How do I pay?',
        a: 'We accept all major credit and debit cards, as well as bank transfer. Payment is taken after your clean is complete and you are happy with the results.',
      },
      {
        q: 'Do you offer discounts for regular bookings?',
        a: 'Yes! We offer a 10% discount on weekly bookings and 5% on fortnightly bookings. Long-term contracts for commercial cleaning also attract reduced rates.',
      },
    ],
  },
  {
    category: 'End of Tenancy',
    faqs: [
      {
        q: 'Is your end of tenancy cleaning deposit-back guaranteed?',
        a: 'Yes. If your landlord or letting agent raises any cleaning-related issues following our clean, we will return within 48 hours to address them completely free of charge.',
      },
      {
        q: 'Do you provide a cleaning certificate?',
        a: 'Yes. On completion of an end of tenancy clean, we provide a full written certificate detailing all tasks completed. This is accepted by most letting agents and landlords.',
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-secondary-800 to-secondary-700 py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="max-w-3xl">
            <h1 className="font-heading font-bold text-4xl md:text-5xl text-white mb-5 leading-tight">
              Frequently Asked Questions
            </h1>
            <p className="text-secondary-200 text-lg leading-relaxed">
              Everything you need to know about PureMaids services. 
              Can&apos;t find what you&apos;re looking for? Contact us directly.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="space-y-10">
            {faqCategories.map((cat) => (
              <div key={cat.category}>
                <h2 className="font-heading font-semibold text-secondary-800 text-xl mb-4 pb-3 border-b border-secondary-100">
                  {cat.category}
                </h2>
                <Accordion type="single" collapsible className="space-y-0">
                  {cat.faqs.map((faq, i) => (
                    <AccordionItem key={i} value={`${cat.category}-${i}`}>
                      <AccordionTrigger>{faq.q}</AccordionTrigger>
                      <AccordionContent>{faq.a}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-primary-50 rounded-2xl p-8 text-center border border-primary-100">
            <h2 className="font-heading font-semibold text-secondary-800 text-xl mb-2">
              Still Have Questions?
            </h2>
            <p className="text-secondary-500 mb-5">
              Our friendly team is available Monday–Saturday, 8am–6pm.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/contact">
                <Button size="lg">Send Us a Message</Button>
              </Link>
              <a href={`tel:${SITE_CONFIG.phone.replace(/\s/g,'')}`}>
                <Button variant="outline" size="lg">
                  <Phone className="w-4 h-4" />
                  {SITE_CONFIG.phone}
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
