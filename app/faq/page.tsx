import type { Metadata } from 'next';
import Link from 'next/link';
import { Phone, Mail } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Cleaning Services FAQs Bolton & Manchester | PureMaids',
  description:
    'Frequently asked questions about PureMaids cleaning services in Bolton and Greater Manchester. Pricing, booking, our cleaners, guarantees and more. Get answers instantly.',
  alternates: { canonical: 'https://puremaids.co.uk/faq' },
};

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqCategory {
  label: string;
  faqs: FaqItem[];
}

const categories: FaqCategory[] = [
  {
    label: 'Booking & Scheduling',
    faqs: [
      {
        question: 'How do I book a cleaner in Bolton or Manchester?',
        answer: 'You can book instantly online in under 60 seconds via our Book Online page — simply select your service, property size and preferred date to get an instant price and confirm your booking. Alternatively, call us free on 0800 012 3456 Monday to Saturday, 8am–6pm.',
      },
      {
        question: 'How much notice do I need to give to book a cleaning service?',
        answer: 'We recommend booking 48 hours in advance to guarantee your preferred time slot. Same-day appointments are often available in Bolton and surrounding areas — call us and we\'ll do our best to accommodate you.',
      },
      {
        question: 'Can I reschedule or cancel my booking?',
        answer: 'Yes — you can reschedule or cancel with at least 24 hours\' notice at no charge, through your online account or by calling us. Late cancellations under 24 hours may incur a small £25 admin fee to cover our cleaner\'s time.',
      },
      {
        question: 'Will I get the same cleaner every time?',
        answer: 'For regular domestic cleaning, yes. We match you with a dedicated cleaner who gets to know your home, your preferences and your routine. In the rare event of absence, we always notify you and send a fully vetted substitute.',
      },
    ],
  },
  {
    label: 'Our Cleaning Services',
    faqs: [
      {
        question: 'What is the difference between a regular clean and a deep clean?',
        answer: 'A regular domestic clean maintains your home on an ongoing basis — surfaces, floors, bathrooms and kitchen. A deep clean is a thorough, one-off intensive clean that covers inside appliances (oven, fridge, microwave), inside cupboards, behind furniture, skirting boards, light fittings and more. We recommend a deep clean before starting a regular service, or once or twice a year as a top-up.',
      },
      {
        question: 'Do your cleaners bring their own products and equipment?',
        answer: 'Yes — all PureMaids cleaners arrive fully equipped with professional-grade, eco-friendly cleaning products and all necessary equipment. You don\'t need to provide a thing. If you have specific preferences, allergies or pets, please mention it when booking.',
      },
      {
        question: 'Are your cleaning products safe for children and pets?',
        answer: 'Yes. We use non-toxic, eco-friendly products that are safe for children and pets once dry. If you have specific concerns, let us know when booking and we can discuss alternatives.',
      },
    ],
  },
  {
    label: 'Our Cleaners',
    faqs: [
      {
        question: 'Are your cleaners DBS checked?',
        answer: 'Yes — every PureMaids cleaner undergoes a thorough enhanced DBS (Disclosure and Barring Service) background check before their first assignment. We take trust and safety extremely seriously.',
      },
      {
        question: 'Are your cleaners insured?',
        answer: 'Yes — all our cleaning operatives are covered by our comprehensive £5 million public liability insurance policy. In the unlikely event of accidental damage, you are fully protected.',
      },
      {
        question: 'How are your cleaners trained?',
        answer: 'All PureMaids cleaners complete our in-house training programme before working with customers. Training covers cleaning techniques, product safety (COSHH), customer service, and our quality standards. We also conduct regular spot-checks and quality reviews.',
      },
    ],
  },
  {
    label: 'Pricing & Payment',
    faqs: [
      {
        question: 'Are there any hidden fees?',
        answer: 'No. Our prices are fully inclusive of VAT, all products and all equipment. The price you see on our booking page is exactly what you pay — there are no add-ons or surprises at the end.',
      },
      {
        question: 'How do I pay for my cleaning service?',
        answer: 'We accept all major credit and debit cards, bank transfer and cash. For regular customers, we take a 25% deposit at the time of booking, with the balance due on the day of the clean.',
      },
      {
        question: 'Do you offer discounts for regular cleaning?',
        answer: 'Yes — weekly cleaning customers save 10% on the standard price, and fortnightly customers save 5%. Commercial clients on daily contracts receive bespoke discounted rates. Call us to discuss.',
      },
    ],
  },
  {
    label: 'End of Tenancy Cleaning',
    faqs: [
      {
        question: 'Do you guarantee I will get my deposit back?',
        answer: 'We offer a deposit-back guarantee: if your landlord or letting agent raises any cleaning-related issues following our service, we will return to re-clean the affected areas at no additional charge within 48 hours. This gives you and your landlord complete peace of mind.',
      },
      {
        question: 'Do you provide a cleaning certificate for letting agents?',
        answer: 'Yes — after every end of tenancy clean in Bolton, Manchester or anywhere we serve, we provide a full written completion certificate that can be submitted to your letting agent or landlord as proof of professional cleaning.',
      },
      {
        question: 'Do you cover all areas of Bolton and Manchester for end of tenancy cleaning?',
        answer: 'Yes — we cover all BL postcodes in Bolton, all Manchester city postcodes, and the wider Greater Manchester and Lancashire area. Enter your postcode on our booking page for instant confirmation.',
      },
    ],
  },
  {
    label: 'Areas Covered',
    faqs: [
      {
        question: 'Which areas near Bolton do you cover?',
        answer: 'We cover the entire Bolton borough (BL1–BL7) including Bolton town centre, Farnworth, Horwich, Westhoughton, Kearsley, Little Lever, Bromley Cross and Heaton. We also serve Manchester, Bury, Wigan, Preston, Chorley, Salford, Rochdale, Oldham and 30+ other North West towns.',
      },
      {
        question: 'Do you offer cleaning services in Bury?',
        answer: 'Yes — Bury is one of our key service areas. We cover Bury town centre (BL9), Radcliffe, Ramsbottom, Heywood, Tottington, Whitefield and Prestwich. Domestic cleaning and end of tenancy cleaning are our most popular services in Bury.',
      },
    ],
  },
];

// Flat list for JSON-LD FAQPage schema
const allFaqs = categories.flatMap(c => c.faqs);

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: allFaqs.map(faq => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: { '@type': 'Answer', text: faq.answer },
  })),
};

export default function FaqPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-secondary-800 to-secondary-900 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h1 className="font-heading mb-4 text-4xl font-extrabold text-white md:text-5xl">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-secondary-300">
            Everything you need to know about PureMaids cleaning services in Bolton and Greater Manchester.
          </p>
        </div>
      </section>

      {/* FAQ categories */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4">
          <div className="space-y-12">
            {categories.map((category) => (
              <div key={category.label}>
                <h2 className="font-heading mb-5 text-2xl font-extrabold text-secondary-800">
                  {category.label}
                </h2>
                <div className="space-y-3">
                  {category.faqs.map((faq) => (
                    <details
                      key={faq.question}
                      className="group rounded-2xl border border-secondary-100 bg-white p-5 shadow-soft transition-shadow open:shadow-md open:border-primary-100"
                    >
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                        <span className="font-semibold text-secondary-800">{faq.question}</span>
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary-100 text-secondary-500 text-sm font-bold group-open:rotate-45 group-open:bg-primary-100 group-open:text-primary-600 transition-all">
                          +
                        </span>
                      </summary>
                      <p className="mt-3 text-sm leading-relaxed text-secondary-600">{faq.answer}</p>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-secondary-50 py-16">
        <div className="mx-auto max-w-2xl px-4">
          <div className="rounded-3xl border border-secondary-100 bg-white p-10 shadow-medium text-center">
            <h2 className="font-heading mb-3 text-2xl font-extrabold text-secondary-800">
              Still Have a Question?
            </h2>
            <p className="mb-7 text-secondary-500 leading-relaxed">
              Our Bolton-based team is available Monday to Saturday, 8am–6pm. We aim to respond to all enquiries within the hour.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a href={`tel:${SITE_CONFIG.phone.replace(/\s/g, '')}`}
                className="inline-flex items-center gap-2 rounded-xl bg-primary-500 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-primary-600">
                <Phone className="h-4 w-4" /> {SITE_CONFIG.phone}
              </a>
              <a href={`mailto:${SITE_CONFIG.email}`}
                className="inline-flex items-center gap-2 rounded-xl border border-secondary-200 px-6 py-3 text-sm font-bold text-secondary-700 transition-colors hover:bg-secondary-50">
                <Mail className="h-4 w-4" /> {SITE_CONFIG.email}
              </a>
              <Link href="/contact"
                className="inline-flex items-center gap-2 rounded-xl border border-secondary-200 px-6 py-3 text-sm font-bold text-secondary-700 transition-colors hover:bg-secondary-50">
                Send a Message
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
