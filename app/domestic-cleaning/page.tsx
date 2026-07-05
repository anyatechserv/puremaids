import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle, Star, Shield, Clock, Leaf } from 'lucide-react';

export const metadata: Metadata = {
  title: 'House Cleaning Bolton | Domestic Cleaners Near Me | From £59',
  description:
    'Professional house cleaning in Bolton and Greater Manchester from £59. Weekly and fortnightly domestic cleaning by vetted, insured, DBS-checked cleaners. Same cleaner every visit. Book online today.',
  keywords: [
    'house cleaning Bolton',
    'domestic cleaning Bolton',
    'domestic cleaners near me',
    'house cleaners Bolton',
    'regular cleaning Bolton',
    'weekly cleaning service Bolton',
    'domestic cleaning Greater Manchester',
    'home cleaning service Bolton',
  ],
  alternates: { canonical: 'https://puremaids.co.uk/domestic-cleaning' },
  openGraph: {
    title: 'House Cleaning Bolton | Domestic Cleaners Near Me | From £59 | PureMaids',
    description:
      'Professional domestic cleaning in Bolton from £59. Vetted, DBS-checked local cleaners. Same cleaner every visit. Book online for an instant quote.',
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How much does house cleaning in Bolton cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'PureMaids domestic cleaning in Bolton starts from £59 for a studio or one-bedroom property. A 2-bed home is £79, a 3-bed is £99, a 4-bed is £129, and 5+ bedrooms is £159. All prices include VAT. Regular customers can save up to 10% with a weekly plan.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you provide domestic cleaning near me in Bolton?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes — PureMaids covers all areas of Bolton including Bolton town centre, Farnworth, Horwich, Westhoughton, Kearsley, Little Lever and Bromley Cross. We can usually assign a local cleaner within 24–48 hours.',
      },
    },
    {
      '@type': 'Question',
      name: 'Will I get the same cleaner every time?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. For regular domestic cleaning we assign you a dedicated cleaner who learns your home, your preferences and your routine. In the rare event of sickness or holiday, we always inform you in advance and send a fully vetted replacement.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do PureMaids cleaners bring their own products?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes — all cleaners arrive with professional-grade, eco-friendly cleaning products and equipment. You do not need to provide anything. If you have specific product preferences or allergies, simply note them when booking.',
      },
    },
  ],
};

const pricing = [
  { size: 'Studio / 1 bed', price: '£59' },
  { size: '2 Bedroom', price: '£79' },
  { size: '3 Bedroom', price: '£99' },
  { size: '4 Bedroom', price: '£129' },
  { size: '5+ Bedroom', price: '£159' },
];

const included = [
  'Kitchen worktops, appliances & sink',
  'Bathroom & toilet sanitised',
  'All rooms dusted & vacuumed',
  'Hard floors mopped',
  'Beds made & linens straightened',
  'Hallways & staircases cleaned',
  'Bins emptied throughout',
  'Window sills & ledges wiped',
];

export default function DomesticCleaningPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-secondary-800 to-secondary-900 py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary-500/30 bg-primary-500/10 px-4 py-1.5">
                <Star className="h-3.5 w-3.5 fill-primary-400 text-primary-400" />
                <span className="text-xs font-bold text-primary-400 uppercase tracking-wider">Bolton&apos;s #1 Rated Cleaning Service</span>
              </div>
              <h1 className="font-heading mb-5 text-4xl font-extrabold leading-[1.08] text-white md:text-5xl lg:text-6xl">
                House Cleaning Bolton<br />
                <span className="text-primary-400">Done Brilliantly</span>
              </h1>
              <p className="mb-4 text-lg text-secondary-300 leading-relaxed">
                Professional domestic cleaning across Bolton and Greater Manchester. Your dedicated, DBS-checked local cleaner delivers a consistently spotless home — every single visit, without fail.
              </p>
              <p className="mb-8 text-secondary-400 leading-relaxed">
                Covering Bolton town centre, Farnworth, Horwich, Westhoughton, Kearsley, Little Lever and all surrounding BL postcodes. Weekly and fortnightly plans from <strong className="text-white">£59</strong>.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/book-online" className="inline-flex items-center gap-2 rounded-xl bg-primary-500 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary-500/20 transition-all hover:bg-primary-400 hover:shadow-primary-500/30">
                  Book a Domestic Clean
                </Link>
                <Link href="/pricing" className="inline-flex items-center gap-2 rounded-xl border border-secondary-600 px-7 py-3.5 text-sm font-bold text-secondary-200 transition-all hover:border-secondary-400 hover:text-white">
                  See Pricing
                </Link>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-3xl shadow-2xl">
              <img
                src="https://images.pexels.com/photos/4108741/pexels-photo-4108741.jpeg"
                alt="Domestic cleaner cleaning a home in Bolton"
                className="h-full w-full object-cover"
                style={{ minHeight: 360 }}
              />
              <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/15 bg-secondary-900/80 p-4 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="flex gap-0.5">{[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />)}</div>
                  <span className="text-sm font-bold text-white">4.9/5</span>
                  <span className="text-xs text-secondary-400">· 2,847 verified reviews</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="border-b border-secondary-100 bg-secondary-50 py-6">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
            {[
              { icon: Shield, text: 'Fully Insured & DBS Checked' },
              { icon: Star, text: 'From £59 — all prices incl. VAT' },
              { icon: Clock, text: 'Same Cleaner Every Visit' },
              { icon: Leaf, text: 'Eco-Friendly Products' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-sm font-semibold text-secondary-700">
                <Icon className="h-4 w-4 text-primary-500" /> {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's included + pricing */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            {/* Included */}
            <div className="lg:col-span-2">
              <span className="mb-3 inline-block text-xs font-bold uppercase tracking-widest text-primary-600">What&apos;s Included</span>
              <h2 className="font-heading mb-4 text-3xl font-extrabold text-secondary-800 md:text-4xl">
                Your Full Domestic Cleaning Checklist
              </h2>
              <p className="mb-8 text-secondary-500 leading-relaxed">
                Every domestic clean in Bolton includes a comprehensive checklist. Your dedicated cleaner follows it every visit, ensuring nothing is ever missed. You can also add custom tasks to your personal checklist.
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {included.map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-xl border border-secondary-100 bg-white p-4 shadow-soft">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-accent-500" />
                    <span className="text-sm text-secondary-700">{item}</span>
                  </div>
                ))}
              </div>

              {/* H3 local SEO */}
              <div className="mt-12">
                <h3 className="font-heading mb-4 text-2xl font-bold text-secondary-800">
                  Domestic Cleaners Across Bolton Borough
                </h3>
                <p className="text-secondary-500 leading-relaxed mb-3">
                  Our Bolton-based domestic cleaning team covers every area of the borough: <strong>Bolton BL1</strong> town centre, <strong>Farnworth BL4</strong>, <strong>Horwich BL6</strong>, <strong>Westhoughton BL5</strong>, <strong>Kearsley BL4</strong>, <strong>Little Lever BL3</strong>, <strong>Bromley Cross BL7</strong> and beyond.
                </p>
                <p className="text-secondary-500 leading-relaxed">
                  We also cover Manchester, Bury, Salford, Wigan, Preston and Chorley. Not sure if we cover your postcode? Enter it on the <Link href="/book-online" className="font-semibold text-primary-600 hover:underline">booking page</Link> for an instant answer.
                </p>
              </div>
            </div>

            {/* Pricing sidebar */}
            <div>
              <div className="sticky top-24 rounded-3xl border border-secondary-100 bg-white p-7 shadow-medium">
                <h3 className="font-heading mb-1 text-xl font-bold text-secondary-800">Domestic Cleaning Prices Bolton</h3>
                <p className="mb-5 text-xs text-secondary-400">All prices include VAT. Save up to 10% with weekly plan.</p>
                <div className="space-y-2.5">
                  {pricing.map(({ size, price }) => (
                    <div key={size} className="flex items-center justify-between rounded-xl border border-secondary-100 bg-secondary-50 px-4 py-3">
                      <span className="text-sm font-medium text-secondary-700">{size}</span>
                      <span className="font-heading font-bold text-secondary-800">{price}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 rounded-xl bg-primary-50 border border-primary-100 px-4 py-3">
                  <p className="text-xs font-semibold text-primary-700">💡 Save up to 10% with a weekly cleaning plan</p>
                </div>
                <Link href="/book-online" className="mt-5 flex w-full items-center justify-center rounded-xl bg-primary-500 py-3.5 text-sm font-bold text-white transition-colors hover:bg-primary-600">
                  Book a Domestic Clean
                </Link>
                <p className="mt-3 text-center text-xs text-secondary-400">No obligation · Instant online booking</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-secondary-50 py-20">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="font-heading mb-3 text-center text-3xl font-extrabold text-secondary-800 md:text-4xl">
            Domestic Cleaning Bolton — FAQs
          </h2>
          <p className="mb-10 text-center text-secondary-500">
            Common questions about our house cleaning service in Bolton and Greater Manchester.
          </p>
          <div className="space-y-4">
            {faqSchema.mainEntity.map((faq) => (
              <details key={faq.name} className="group rounded-2xl border border-secondary-100 bg-white p-5 shadow-soft open:shadow-md open:border-primary-100">
                <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-secondary-800">
                  {faq.name}
                  <span className="ml-4 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary-100 text-secondary-500 text-xs group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-secondary-600">{faq.acceptedAnswer.text}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary-500 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="font-heading mb-3 text-3xl font-extrabold text-white">Ready to Book Your Bolton House Clean?</h2>
          <p className="mb-7 text-primary-100">Get an instant online quote in 60 seconds. No obligation, no hidden fees.</p>
          <Link href="/book-online" className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-sm font-bold text-primary-600 shadow-lg transition-all hover:shadow-xl">
            Get My Instant Quote
          </Link>
        </div>
      </section>
    </>
  );
}
