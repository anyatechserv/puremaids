import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle, Star, Shield, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Office Cleaning Bolton & Manchester | Commercial Cleaning Services',
  description:
    'Professional office and commercial cleaning in Bolton and Manchester. Flexible scheduling, after-hours cleans available. COSHH compliant. Bespoke quotes for businesses of all sizes. Contact us today.',
  keywords: [
    'office cleaning Bolton',
    'office cleaning Manchester',
    'commercial cleaning Bolton',
    'commercial cleaning Manchester',
    'office cleaners Bolton',
    'workplace cleaning Bolton',
    'commercial cleaners Greater Manchester',
    'after hours office cleaning Bolton',
  ],
  alternates: { canonical: 'https://puremaids.co.uk/office-cleaning' },
  openGraph: {
    title: 'Office Cleaning Bolton & Manchester | Commercial Cleaning Services | PureMaids',
    description: 'Professional office cleaning in Bolton and Manchester. Flexible scheduling including after-hours. Bespoke quotes for businesses of all sizes.',
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How much does office cleaning cost in Bolton?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Office cleaning in Bolton starts from £99 per visit for small offices (up to 500 sq ft). Medium offices (500–1,500 sq ft) are from £179, and large offices (1,500+ sq ft) from £299. Daily contracts receive discounted rates. Contact us for a bespoke commercial quote.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you offer after-hours office cleaning in Bolton and Manchester?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes — we offer fully flexible scheduling including early-morning cleans (from 6am), after-hours cleans (evenings and weekends) to minimise disruption to your team and customers.',
      },
    },
    {
      '@type': 'Question',
      name: 'Are your commercial cleaners DBS checked?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Every PureMaids commercial cleaner is fully DBS checked and covered by our £5 million public liability insurance policy. We are also COSHH compliant and use professional-grade, workplace-approved cleaning products.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which areas of Greater Manchester do you cover for office cleaning?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We provide commercial cleaning across Bolton, Manchester city centre, Salford, Wigan, Bury, Preston, Chorley and all surrounding areas. Contact us with your postcode and we can confirm coverage and provide a bespoke quote.',
      },
    },
  ],
};

const pricing = [
  { size: 'Small (up to 500 sq ft)', price: 'From £99/visit' },
  { size: 'Medium (500–1,500 sq ft)', price: 'From £179/visit' },
  { size: 'Large (1,500+ sq ft)', price: 'From £299/visit' },
  { size: 'Daily contracts', price: 'Discounted rates' },
];

const included = [
  'Desks, workstations & office furniture',
  'Meeting rooms & boardrooms',
  'Reception & communal areas',
  'Kitchen & breakout areas',
  'Toilets & washrooms sanitised',
  'Floor vacuuming & mopping',
  'All waste bins & recycling',
  'Window sills & ledges',
  'Computer screens & equipment (exterior)',
  'Fridges & kitchen appliances',
  'Supplies restocking (paper towels, soap)',
  'Stairwells & fire escapes',
];

export default function OfficeCleaningPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-secondary-800 to-secondary-900 py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5">
                <Shield className="h-3.5 w-3.5 text-violet-400" />
                <span className="text-xs font-bold text-violet-400 uppercase tracking-wider">COSHH Compliant · Fully Insured</span>
              </div>
              <h1 className="font-heading mb-5 text-4xl font-extrabold leading-[1.08] text-white md:text-5xl lg:text-6xl">
                Office Cleaning<br />
                <span className="text-violet-400">Bolton &amp; Manchester</span>
              </h1>
              <p className="mb-4 text-lg text-secondary-300 leading-relaxed">
                Professional commercial and office cleaning for businesses across Bolton, Manchester, Salford, Wigan and Preston. A spotless workplace that reflects your professional reputation.
              </p>
              <p className="mb-8 text-secondary-400 leading-relaxed">
                Flexible early-morning and after-hours cleaning to fit around your team. Daily, weekly or one-off contracts. Fully vetted, DBS-checked cleaners from <strong className="text-white">£99/visit</strong>.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/contact" className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-7 py-3.5 text-sm font-bold text-white transition-all hover:bg-violet-500">
                  Get a Commercial Quote
                </Link>
                <Link href="/book-online" className="inline-flex items-center gap-2 rounded-xl border border-secondary-600 px-7 py-3.5 text-sm font-bold text-secondary-200 transition-all hover:border-secondary-400 hover:text-white">
                  Book Online
                </Link>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-3xl shadow-2xl">
              <img
                src="https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg"
                alt="Professional office cleaning service in Bolton and Manchester"
                className="h-full w-full object-cover"
                style={{ minHeight: 360 }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="border-b border-secondary-100 bg-secondary-50 py-6">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
            {[
              { icon: Shield, text: 'COSHH Compliant Products' },
              { icon: Star, text: 'Bespoke Commercial Pricing' },
              { icon: Clock, text: 'After-Hours Available' },
              { icon: CheckCircle, text: 'Fully Insured & DBS Checked' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-sm font-semibold text-secondary-700">
                <Icon className="h-4 w-4 text-violet-500" /> {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Included + pricing */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <span className="mb-3 inline-block text-xs font-bold uppercase tracking-widest text-violet-600">Commercial Cleaning Tailored to You</span>
              <h2 className="font-heading mb-4 text-3xl font-extrabold text-secondary-800 md:text-4xl">
                What&apos;s Included in Our Office Cleaning Service
              </h2>
              <p className="mb-8 text-secondary-500 leading-relaxed">
                Whether you run a small Bolton office or a large Manchester commercial space, our service is tailored to your business. Every clean covers the essentials below — and we can customise your checklist further.
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {included.map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-xl border border-secondary-100 bg-white p-4 shadow-soft">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-violet-500" />
                    <span className="text-sm text-secondary-700">{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-12">
                <h3 className="font-heading mb-4 text-2xl font-bold text-secondary-800">
                  Commercial Cleaning Across Bolton &amp; Greater Manchester
                </h3>
                <p className="mb-3 text-secondary-500 leading-relaxed">
                  PureMaids provides office and commercial cleaning contracts across <strong>Bolton</strong>, <strong>Manchester city centre</strong>, <strong>Salford Quays</strong>, <strong>Wigan</strong>, <strong>Preston</strong>, <strong>Chorley</strong> and surrounding towns. Our commercial team is experienced in offices, retail units, medical practices, schools and hospitality environments.
                </p>
                <p className="text-secondary-500 leading-relaxed">
                  We work around your schedule — early-morning starts from 6am, or after-hours cleans once your team has left. Daily contract clients receive preferential rates and a dedicated account manager.
                </p>
              </div>
            </div>

            <div>
              <div className="sticky top-24 rounded-3xl border border-secondary-100 bg-white p-7 shadow-medium">
                <h3 className="font-heading mb-1 text-xl font-bold text-secondary-800">Office Cleaning Prices Bolton</h3>
                <p className="mb-5 text-xs text-secondary-400">Prices are per visit. Contact us for contract rates.</p>
                <div className="space-y-2.5">
                  {pricing.map(({ size, price }) => (
                    <div key={size} className="flex items-start justify-between rounded-xl border border-secondary-100 bg-secondary-50 px-4 py-3 gap-2">
                      <span className="text-sm font-medium text-secondary-700">{size}</span>
                      <span className="font-heading font-bold text-secondary-800 shrink-0">{price}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-xl bg-violet-50 border border-violet-100 px-4 py-3">
                  <p className="text-xs font-semibold text-violet-700">💼 Daily contracts receive discounted rates</p>
                </div>
                <Link href="/contact" className="mt-5 flex w-full items-center justify-center rounded-xl bg-violet-600 py-3.5 text-sm font-bold text-white transition-colors hover:bg-violet-700">
                  Request a Commercial Quote
                </Link>
                <p className="mt-3 text-center text-xs text-secondary-400">Bespoke quotes · No obligation</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-secondary-50 py-20">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="font-heading mb-3 text-center text-3xl font-extrabold text-secondary-800 md:text-4xl">
            Office Cleaning Bolton — FAQs
          </h2>
          <p className="mb-10 text-center text-secondary-500">Common questions about commercial cleaning in Bolton and Manchester.</p>
          <div className="space-y-4">
            {faqSchema.mainEntity.map((faq) => (
              <details key={faq.name} className="group rounded-2xl border border-secondary-100 bg-white p-5 shadow-soft open:shadow-md">
                <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-secondary-800">
                  {faq.name}
                  <span className="ml-4 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary-100 text-xs group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-secondary-600">{faq.acceptedAnswer.text}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-secondary-800 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="font-heading mb-3 text-3xl font-extrabold text-white">Get a Bespoke Office Cleaning Quote</h2>
          <p className="mb-7 text-secondary-400">Serving Bolton, Manchester, Wigan, Preston and all of Greater Manchester.</p>
          <Link href="/contact" className="inline-flex items-center gap-2 rounded-xl bg-primary-500 px-8 py-4 text-sm font-bold text-white shadow-lg transition-all hover:bg-primary-400">
            Request Your Commercial Quote
          </Link>
        </div>
      </section>
    </>
  );
}
