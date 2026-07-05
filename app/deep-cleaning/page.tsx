import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle, Star, Shield, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Deep Cleaning Services Bolton & Manchester | From £129 | PureMaids',
  description:
    'Professional deep cleaning services in Bolton and Manchester from £129. Thorough top-to-bottom clean including inside appliances, carpets and skirting boards. Fully insured. Book online today.',
  keywords: [
    'deep cleaning services Bolton',
    'deep cleaning Bolton',
    'deep clean Manchester',
    'one off deep clean Bolton',
    'professional deep clean near me',
    'deep cleaning company Bolton',
    'end of tenancy deep clean Bolton',
  ],
  alternates: { canonical: 'https://puremaids.co.uk/deep-cleaning' },
  openGraph: {
    title: 'Deep Cleaning Services Bolton & Manchester | From £129 | PureMaids',
    description: 'Top-to-bottom deep cleaning in Bolton and Manchester from £129. Inside appliances, carpets, skirting boards and more. Book online today.',
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How much does deep cleaning cost in Bolton?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Deep cleaning in Bolton starts from £129 for a studio or one-bedroom home. A 2-bed costs £169, a 3-bed £219, a 4-bed £279, and 5+ bedrooms £349. All prices include VAT and equipment.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between a regular clean and a deep clean?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A regular domestic clean maintains your home on an ongoing basis. A deep clean is an intensive, top-to-bottom service covering areas not reached in routine cleaning — inside ovens, fridges and microwaves, inside cupboards and wardrobes, behind appliances, skirting boards, light fittings, carpet treatment and more.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long does a deep clean take in Bolton?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Typically 4–8 hours depending on property size and condition. Our team may send one or two experienced cleaners to ensure the job is completed thoroughly and on schedule.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you offer a deep cleaning service near me in Greater Manchester?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes — PureMaids provides deep cleaning across Bolton, Manchester, Bury, Wigan, Salford, Rochdale and surrounding areas. Enter your postcode on our booking page for an instant quote.',
      },
    },
  ],
};

const pricing = [
  { size: 'Studio / 1 bed', price: '£129' },
  { size: '2 Bedroom', price: '£169' },
  { size: '3 Bedroom', price: '£219' },
  { size: '4 Bedroom', price: '£279' },
  { size: '5+ Bedroom', price: '£349' },
];

const included = [
  'Oven, fridge & microwave — inside',
  'Bathroom descaling, grout & polish',
  'Inside all cupboards & drawers',
  'Interior windows & frames',
  'Skirting boards, coving & picture rails',
  'Light fittings, switches & sockets',
  'Behind & under all furniture',
  'Deep carpet vacuum & stain treatment',
  'Mattress vacuuming',
  'Wardrobe interiors',
  'Radiators front & back',
  'Door frames & architraves',
];

export default function DeepCleaningPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-secondary-800 to-secondary-900 py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent-500/30 bg-accent-500/10 px-4 py-1.5">
                <Star className="h-3.5 w-3.5 fill-accent-400 text-accent-400" />
                <span className="text-xs font-bold text-accent-400 uppercase tracking-wider">100% Satisfaction Guaranteed</span>
              </div>
              <h1 className="font-heading mb-5 text-4xl font-extrabold leading-[1.08] text-white md:text-5xl lg:text-6xl">
                Deep Cleaning Services<br />
                <span className="text-accent-400">Bolton &amp; Manchester</span>
              </h1>
              <p className="mb-4 text-lg text-secondary-300 leading-relaxed">
                A truly thorough, top-to-bottom deep clean for homes and properties across Bolton and Greater Manchester. Every corner, every surface, every hidden area — spotless.
              </p>
              <p className="mb-8 text-secondary-400 leading-relaxed">
                Perfect for spring cleans, pre/post tenancy, before a house sale, or when your home needs a proper reset. From <strong className="text-white">£129</strong> including all products and equipment.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/book-online" className="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-7 py-3.5 text-sm font-bold text-white transition-all hover:bg-accent-400">
                  Book a Deep Clean
                </Link>
                <Link href="/pricing" className="inline-flex items-center gap-2 rounded-xl border border-secondary-600 px-7 py-3.5 text-sm font-bold text-secondary-200 transition-all hover:border-secondary-400 hover:text-white">
                  See All Prices
                </Link>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-3xl shadow-2xl">
              <img
                src="https://images.pexels.com/photos/6195130/pexels-photo-6195130.jpeg"
                alt="Professional deep cleaning service in Bolton"
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
              { icon: Shield, text: 'Fully Insured & DBS Checked' },
              { icon: Star, text: 'From £129 — all prices incl. VAT' },
              { icon: Clock, text: '4–8 hours typical duration' },
              { icon: CheckCircle, text: '100% Satisfaction Guarantee' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-sm font-semibold text-secondary-700">
                <Icon className="h-4 w-4 text-accent-500" /> {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's included + pricing */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <span className="mb-3 inline-block text-xs font-bold uppercase tracking-widest text-accent-600">What&apos;s Included</span>
              <h2 className="font-heading mb-4 text-3xl font-extrabold text-secondary-800 md:text-4xl">
                Complete Deep Clean Checklist
              </h2>
              <p className="mb-8 text-secondary-500 leading-relaxed">
                Our Bolton deep cleaning service goes far beyond a standard clean. Every item below is completed as standard — no extra charges, no surprises.
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {included.map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-xl border border-secondary-100 bg-white p-4 shadow-soft">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-accent-500" />
                    <span className="text-sm text-secondary-700">{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-12">
                <h3 className="font-heading mb-4 text-2xl font-bold text-secondary-800">
                  Deep Cleaning Across Bolton &amp; Greater Manchester
                </h3>
                <p className="text-secondary-500 leading-relaxed mb-3">
                  We provide deep cleaning services across all Bolton postcodes (BL1–BL7), Manchester, Salford, Bury, Wigan, Leigh and the surrounding North West area. Whether you&apos;re in the heart of Bolton town centre or out in Horwich or Westhoughton, we can help.
                </p>
                <p className="text-secondary-500 leading-relaxed">
                  Not sure if we cover your postcode? <Link href="/book-online" className="font-semibold text-primary-600 hover:underline">Check instantly online</Link> or call us free on 0800 012 3456.
                </p>
              </div>
            </div>

            <div>
              <div className="sticky top-24 rounded-3xl border border-secondary-100 bg-white p-7 shadow-medium">
                <h3 className="font-heading mb-1 text-xl font-bold text-secondary-800">Deep Clean Prices Bolton</h3>
                <p className="mb-5 text-xs text-secondary-400">All prices include VAT, products & equipment.</p>
                <div className="space-y-2.5">
                  {pricing.map(({ size, price }) => (
                    <div key={size} className="flex items-center justify-between rounded-xl border border-secondary-100 bg-secondary-50 px-4 py-3">
                      <span className="text-sm font-medium text-secondary-700">{size}</span>
                      <span className="font-heading font-bold text-secondary-800">{price}</span>
                    </div>
                  ))}
                </div>
                <Link href="/book-online" className="mt-5 flex w-full items-center justify-center rounded-xl bg-accent-500 py-3.5 text-sm font-bold text-white transition-colors hover:bg-accent-600">
                  Book a Deep Clean
                </Link>
                <p className="mt-3 text-center text-xs text-secondary-400">Instant online quote · No obligation</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-secondary-50 py-20">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="font-heading mb-3 text-center text-3xl font-extrabold text-secondary-800 md:text-4xl">
            Deep Cleaning Bolton — FAQs
          </h2>
          <p className="mb-10 text-center text-secondary-500">Answers to common questions about our Bolton deep cleaning service.</p>
          <div className="space-y-4">
            {faqSchema.mainEntity.map((faq) => (
              <details key={faq.name} className="group rounded-2xl border border-secondary-100 bg-white p-5 shadow-soft open:shadow-md open:border-accent-100">
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

      <section className="bg-accent-500 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="font-heading mb-3 text-3xl font-extrabold text-white">Book Your Deep Clean in Bolton Today</h2>
          <p className="mb-7 text-accent-50">Instant online quote — see your exact price in 60 seconds.</p>
          <Link href="/book-online" className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-sm font-bold text-accent-600 shadow-lg transition-all hover:shadow-xl">
            Get My Instant Quote
          </Link>
        </div>
      </section>
    </>
  );
}
