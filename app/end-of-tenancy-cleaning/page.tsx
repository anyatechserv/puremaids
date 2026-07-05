import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle, Star, Shield, Award } from 'lucide-react';

export const metadata: Metadata = {
  title: 'End of Tenancy Cleaning Bolton & Manchester | Deposit Back Guaranteed',
  description:
    'Professional end of tenancy cleaning in Bolton and Manchester. Deposit-back guaranteed. Landlord and letting agent approved. From £149. Fully insured. Book online today.',
  keywords: [
    'end of tenancy cleaning Bolton',
    'end of tenancy cleaning Manchester',
    'end of tenancy cleaners near me',
    'move out cleaning Bolton',
    'deposit back cleaning Bolton',
    'letting agent approved cleaning Bolton',
    'end of tenancy clean Greater Manchester',
  ],
  alternates: { canonical: 'https://puremaids.co.uk/end-of-tenancy-cleaning' },
  openGraph: {
    title: 'End of Tenancy Cleaning Bolton & Manchester | Deposit Back Guaranteed | PureMaids',
    description: 'End of tenancy cleaning in Bolton from £149. Deposit-back guarantee — or we re-clean free. Landlord approved. Book online today.',
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How much does end of tenancy cleaning cost in Bolton?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'End of tenancy cleaning in Bolton starts from £149 for a studio or one-bedroom flat. A 2-bed costs £199, a 3-bed £249, a 4-bed £299, and 5+ bedrooms £379. All prices include VAT, products and equipment.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you guarantee the deposit will be returned?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. We offer a deposit-back guarantee: if your landlord or letting agent raises cleaning issues after our service, we will return and re-clean the affected areas at no extra charge within 48 hours.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is your end of tenancy cleaning approved by Bolton letting agents?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Our cleaning checklist meets or exceeds the standards required by Bolton and Greater Manchester letting agents and landlords. We provide a written completion certificate after every end of tenancy clean.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can you clean carpets as part of an end of tenancy clean?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes — professional carpet vacuuming and stain treatment is included as standard in our end of tenancy service. We can also arrange specialist carpet steam cleaning as an optional add-on.',
      },
    },
  ],
};

const pricing = [
  { size: 'Studio / 1 bed', price: '£149' },
  { size: '2 Bedroom', price: '£199' },
  { size: '3 Bedroom', price: '£249' },
  { size: '4 Bedroom', price: '£299' },
  { size: '5+ Bedroom', price: '£379' },
];

const included = [
  'Full kitchen deep clean incl. oven/fridge/microwave',
  'Bathroom descaled, polished & sanitised',
  'Carpets professionally vacuumed & treated',
  'Interior & accessible exterior windows',
  'All cupboards & wardrobes inside and out',
  'Skirting boards, door frames & architraves',
  'Walls spot cleaned',
  'Light fittings, switches & sockets',
  'Behind and under all furniture',
  'Radiators & extractor fans',
  'Hallways, stairs & landing',
  'Full written completion checklist provided',
];

export default function EndOfTenancyCleaningPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-secondary-800 to-secondary-900 py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5">
                <Award className="h-3.5 w-3.5 text-amber-400" />
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Deposit-Back Guaranteed</span>
              </div>
              <h1 className="font-heading mb-5 text-4xl font-extrabold leading-[1.08] text-white md:text-5xl lg:text-6xl">
                End of Tenancy Cleaning<br />
                <span className="text-amber-400">Bolton &amp; Manchester</span>
              </h1>
              <p className="mb-4 text-lg text-secondary-300 leading-relaxed">
                Get your full deposit back — guaranteed. Professional end of tenancy cleaning across Bolton, Manchester, Bury, Wigan and Preston. Letting agent approved checklist, every time.
              </p>
              <p className="mb-8 text-secondary-400 leading-relaxed">
                If your landlord raises any cleaning issues, we return and re-clean free of charge within 48 hours. No quibbles, no extra cost. From <strong className="text-white">£149</strong>.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/book-online" className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-7 py-3.5 text-sm font-bold text-white transition-all hover:bg-amber-400">
                  Book End of Tenancy Clean
                </Link>
                <Link href="/pricing" className="inline-flex items-center gap-2 rounded-xl border border-secondary-600 px-7 py-3.5 text-sm font-bold text-secondary-200 transition-all hover:border-secondary-400 hover:text-white">
                  See All Prices
                </Link>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-3xl shadow-2xl">
              <img
                src="https://images.pexels.com/photos/7534761/pexels-photo-7534761.jpeg"
                alt="End of tenancy cleaning service in Bolton"
                className="h-full w-full object-cover"
                style={{ minHeight: 360 }}
              />
              <div className="absolute left-5 right-5 top-5 rounded-2xl border border-amber-400/30 bg-amber-900/80 p-4 backdrop-blur-md">
                <div className="flex items-start gap-3">
                  <Award className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
                  <div>
                    <p className="font-bold text-sm text-amber-300">Deposit-Back Guarantee</p>
                    <p className="text-xs text-amber-200/70 mt-0.5">Free re-clean within 48 hours if needed</p>
                  </div>
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
              { icon: Award, text: 'Deposit-Back Guarantee' },
              { icon: Shield, text: 'Landlord Approved Checklist' },
              { icon: Star, text: 'From £149 incl. VAT' },
              { icon: CheckCircle, text: 'Free Re-Clean If Needed' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-sm font-semibold text-secondary-700">
                <Icon className="h-4 w-4 text-amber-500" /> {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Checklist + pricing */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <span className="mb-3 inline-block text-xs font-bold uppercase tracking-widest text-amber-600">Comprehensive Checklist</span>
              <h2 className="font-heading mb-4 text-3xl font-extrabold text-secondary-800 md:text-4xl">
                What&apos;s Included in Your End of Tenancy Clean
              </h2>
              <p className="mb-8 text-secondary-500 leading-relaxed">
                Our end of tenancy cleaning checklist is modelled on the inventory standards used by Bolton and Manchester letting agents. Everything below is completed as standard.
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {included.map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-xl border border-secondary-100 bg-white p-4 shadow-soft">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                    <span className="text-sm text-secondary-700">{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-12">
                <h3 className="font-heading mb-4 text-2xl font-bold text-secondary-800">
                  End of Tenancy Cleaning Across Bolton &amp; Greater Manchester
                </h3>
                <p className="mb-3 text-secondary-500 leading-relaxed">
                  Moving out in Bolton, Farnworth, Horwich or Westhoughton? Or further afield in Manchester, Salford, Bury, Wigan or Preston? PureMaids covers all of Greater Manchester and Lancashire — enter your postcode on our <Link href="/book-online" className="font-semibold text-primary-600 hover:underline">booking page</Link> for your instant quote.
                </p>
                <p className="text-secondary-500 leading-relaxed">
                  We work directly with Bolton and Manchester landlords, letting agents and estate agents. Our deposit-back guarantee means if there are any issues raised by your inventory clerk, we come back — free of charge.
                </p>
              </div>
            </div>

            <div>
              <div className="sticky top-24 rounded-3xl border border-secondary-100 bg-white p-7 shadow-medium">
                <h3 className="font-heading mb-1 text-xl font-bold text-secondary-800">End of Tenancy Prices Bolton</h3>
                <p className="mb-5 text-xs text-secondary-400">All prices include VAT, products & equipment.</p>
                <div className="space-y-2.5">
                  {pricing.map(({ size, price }) => (
                    <div key={size} className="flex items-center justify-between rounded-xl border border-secondary-100 bg-secondary-50 px-4 py-3">
                      <span className="text-sm font-medium text-secondary-700">{size}</span>
                      <span className="font-heading font-bold text-secondary-800">{price}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-xl bg-amber-50 border border-amber-100 px-4 py-3">
                  <p className="text-xs font-semibold text-amber-700">🏆 Deposit-back guarantee on every clean</p>
                </div>
                <Link href="/book-online" className="mt-5 flex w-full items-center justify-center rounded-xl bg-amber-500 py-3.5 text-sm font-bold text-white transition-colors hover:bg-amber-600">
                  Book End of Tenancy Clean
                </Link>
                <p className="mt-3 text-center text-xs text-secondary-400">Written certificate provided · No obligation</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-secondary-50 py-20">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="font-heading mb-3 text-center text-3xl font-extrabold text-secondary-800 md:text-4xl">
            End of Tenancy Cleaning Bolton — FAQs
          </h2>
          <p className="mb-10 text-center text-secondary-500">Common questions about move-out cleaning in Bolton and Manchester.</p>
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

      <section className="bg-amber-500 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="font-heading mb-3 text-3xl font-extrabold text-white">Get Your Deposit Back — Book Today</h2>
          <p className="mb-7 text-amber-50">Instant quote for Bolton and Greater Manchester. Deposit-back guaranteed.</p>
          <Link href="/book-online" className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-sm font-bold text-amber-600 shadow-lg transition-all hover:shadow-xl">
            Get My Instant Quote
          </Link>
        </div>
      </section>
    </>
  );
}
