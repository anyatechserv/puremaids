import Image from 'next/image';
import Link from 'next/link';
import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import { BUSINESS, SERVICES, TRUST_STATS, REVIEWS, SERVICE_AREAS } from '@/lib/constants';
import { formatGBP } from '@/lib/pricing';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: `House Cleaning Bolton & Manchester | From £59 | ${BUSINESS.name}`,
  description: `Professional house cleaning services in Bolton, Manchester, Bury, Wigan & Preston. DBS-checked cleaners. 4.9★ rated. Deposit from £12. Book online now.`,
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How much does house cleaning cost in Bolton?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'PureMaids domestic cleaning starts from £59 for a standard clean. Deep cleaning starts from £129. We provide a fixed quote before booking with no hidden charges.',
      },
    },
    {
      '@type': 'Question',
      name: 'Are your cleaners DBS checked?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Every PureMaids cleaner is DBS (Disclosure and Barring Service) checked, fully insured, and vetted before joining our team.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need to be home during the clean?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. Many of our clients provide a key or entry code. You can trust our fully vetted and insured team with access to your home.',
      },
    },
    {
      '@type': 'Question',
      name: 'What areas do you cover?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: `We cover Bolton and all surrounding areas including Manchester, Bury, Wigan, Preston, Chorley, Salford, Rochdale, and Oldham.`,
      },
    },
  ],
};

function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) {
  const sizes = { sm: 'h-4 w-4', md: 'h-5 w-5' };
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`} role="img">
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} className={`${sizes[size]} ${i <= rating ? 'text-accent-400' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Nav />
      <main id="main-content">

        {/* ── HERO ── */}
        <section
          className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800"
          aria-labelledby="hero-heading"
        >
          {/* Background image overlay */}
          <div className="absolute inset-0 opacity-20" aria-hidden="true">
            <Image
              src="https://images.pexels.com/photos/4099469/pexels-photo-4099469.jpeg"
              alt=""
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-brand-950/80 to-transparent" aria-hidden="true" />

          <div className="container relative py-24 pt-36">
            <div className="max-w-2xl">
              {/* Trust badge */}
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-700/50 bg-brand-800/50 px-4 py-2 text-sm text-brand-200 backdrop-blur-sm animate-fade-in">
                <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse-soft" aria-hidden="true" />
                Serving Bolton & Greater Manchester since 2018
              </div>

              <h1
                id="hero-heading"
                className="font-display text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl text-pretty animate-slide-up"
              >
                A Cleaner Home,<br />
                <span className="text-brand-300">Guaranteed.</span>
              </h1>

              <p className="mt-6 text-lg leading-relaxed text-brand-100/90 animate-slide-up sm:text-xl text-pretty">
                DBS-checked, fully insured cleaners across Bolton, Manchester, Bury, Wigan & Preston.
                Rated <strong className="text-white">4.9★</strong> by over 2,400 happy customers.
              </p>

              {/* Social proof bar */}
              <div className="mt-6 flex items-center gap-4 animate-slide-up">
                <div className="flex -space-x-2">
                  {['#2a9a87','#1b7c6d','#196459','#14413b'].map((c, i) => (
                    <div key={i} className="h-8 w-8 rounded-full border-2 border-brand-800 flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: c }} aria-hidden="true">
                      {['S','J','R','M'][i]}
                    </div>
                  ))}
                </div>
                <div>
                  <StarRating rating={5} />
                  <p className="mt-0.5 text-sm text-brand-200">2,400+ five-star reviews</p>
                </div>
              </div>

              {/* CTA buttons */}
              <div className="mt-10 flex flex-wrap gap-4 animate-slide-up">
                <Link href="/book" className="btn btn-lg btn-primary shadow-glow">
                  Get a Free Quote
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </Link>
                <a href={`tel:${BUSINESS.phone}`} className="btn btn-lg border border-white/20 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Call {BUSINESS.phone}
                </a>
              </div>

              {/* Micro-trust line */}
              <p className="mt-6 text-sm text-brand-300 animate-fade-in">
                ✓ No contract · ✓ Same-day quotes · ✓ 100% satisfaction guarantee
              </p>
            </div>
          </div>

          {/* Scroll hint */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-sm" aria-hidden="true">
            <svg className="h-6 w-6 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </section>

        {/* ── TRUST STATS ── */}
        <section aria-label="Company statistics" className="border-b bg-white py-10">
          <div className="container">
            <dl className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              {TRUST_STATS.map(s => (
                <div key={s.label} className="text-center">
                  <dt className="text-3xl font-display font-extrabold text-brand-600 sm:text-4xl">{s.value}</dt>
                  <dd className="mt-1 text-sm font-medium text-gray-500">{s.label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ── TRUST BADGES ── */}
        <section aria-label="Accreditations and trust signals" className="bg-gray-50 py-6 border-b">
          <div className="container">
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
              {[
                { icon: '🛡️', label: 'DBS Checked' },
                { icon: '📋', label: 'Fully Insured' },
                { icon: '⭐', label: 'Trustpilot 4.9★' },
                { icon: '🔒', label: 'ICO Registered' },
                { icon: '✅', label: '100% Guarantee' },
                { icon: '💳', label: 'Secure Payments' },
              ].map(b => (
                <div key={b.label} className="flex items-center gap-2 text-sm font-medium text-gray-600">
                  <span aria-hidden="true">{b.icon}</span>
                  {b.label}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SERVICES ── */}
        <section className="section bg-white" aria-labelledby="services-heading">
          <div className="container">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">What we offer</p>
              <h2 id="services-heading" className="mt-2 font-display text-3xl font-bold text-gray-900 sm:text-4xl text-balance">
                Professional Cleaning Services in Bolton
              </h2>
              <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto text-pretty">
                From regular domestic cleaning to full end-of-tenancy deep cleans — every service is delivered by our trained, insured, DBS-checked team.
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {Object.entries(SERVICES).map(([key, svc]) => (
                <Link
                  key={key}
                  href={`/services/${key.replace(/_/g, '-')}`}
                  className="card-hover group p-6 flex flex-col"
                  aria-label={`${svc.label} — from ${formatGBP(svc.basePence)}`}
                >
                  <div className="text-3xl mb-4" aria-hidden="true">{svc.icon}</div>
                  <h3 className="font-display text-lg font-bold text-gray-900 group-hover:text-brand-600 transition-colors">
                    {svc.label}
                  </h3>
                  <p className="mt-2 flex-1 text-sm text-gray-600 leading-relaxed">{svc.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-lg font-bold text-brand-600">from {formatGBP(svc.basePence)}</span>
                    <span className="text-xs font-medium text-brand-600 group-hover:translate-x-1 transition-transform">
                      Book →
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link href="/book" className="btn btn-lg btn-primary">
                Book Any Service Now
              </Link>
              <p className="mt-3 text-sm text-gray-500">Pay just a 20% deposit to secure your booking</p>
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="section bg-brand-50" aria-labelledby="how-it-works-heading">
          <div className="container">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">Simple process</p>
              <h2 id="how-it-works-heading" className="mt-2 font-display text-3xl font-bold text-gray-900 sm:text-4xl">
                Book in 3 easy steps
              </h2>
            </div>

            <ol className="mt-12 grid gap-8 sm:grid-cols-3" role="list">
              {[
                { step: '1', title: 'Get an instant quote', desc: 'Fill in your service type, property size, and any extras. See your price immediately — no phone call needed.', icon: '📋' },
                { step: '2', title: 'Pay a 20% deposit', desc: 'Secure your booking with a small deposit. Pay by card, Apple Pay, or Google Pay via our secure Stripe checkout.', icon: '💳' },
                { step: '3', title: 'Enjoy a spotless home', desc: 'Your DBS-checked cleaner arrives on time. We guarantee satisfaction — if you\'re not happy, we\'ll return for free.', icon: '✨' },
              ].map(s => (
                <li key={s.step} className="relative flex flex-col items-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm text-3xl" aria-hidden="true">
                    {s.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 sm:static sm:hidden flex h-7 w-7 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white" aria-hidden="true">
                    {s.step}
                  </div>
                  <h3 className="mt-4 font-display text-xl font-bold text-gray-900">{s.title}</h3>
                  <p className="mt-2 text-gray-600 leading-relaxed text-pretty">{s.desc}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── REVIEWS ── */}
        <section className="section bg-white" aria-labelledby="reviews-heading">
          <div className="container">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">Customer reviews</p>
              <h2 id="reviews-heading" className="mt-2 font-display text-3xl font-bold text-gray-900 sm:text-4xl">
                What our customers say
              </h2>
              <div className="mt-3 flex items-center justify-center gap-2">
                <StarRating rating={5} size="md" />
                <span className="font-semibold text-gray-900">4.9 out of 5</span>
                <span className="text-gray-500">· 2,400+ reviews</span>
              </div>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-3">
              {REVIEWS.map((r, i) => (
                <figure key={i} className="card p-6 flex flex-col">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700"
                        aria-hidden="true"
                      >
                        {r.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{r.name}</p>
                        <p className="text-xs text-gray-500">{r.location}</p>
                      </div>
                    </div>
                    <StarRating rating={r.rating} />
                  </div>
                  <blockquote className="mt-4 flex-1">
                    <p className="text-sm text-gray-700 leading-relaxed">"{r.text}"</p>
                  </blockquote>
                  <figcaption className="mt-4 flex items-center justify-between text-xs text-gray-400">
                    <span>{r.service}</span>
                    <span>{r.date}</span>
                  </figcaption>
                </figure>
              ))}
            </div>

            <div className="mt-8 text-center">
              <a
                href={BUSINESS.trustpilotUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-brand-600 hover:text-brand-700 font-medium"
                aria-label="Read all reviews on Trustpilot (opens in new tab)"
              >
                Read all reviews on Trustpilot →
              </a>
            </div>
          </div>
        </section>

        {/* ── LOCAL SEO / AREAS ── */}
        <section className="section bg-gray-50" aria-labelledby="areas-heading">
          <div className="container">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">Local coverage</p>
              <h2 id="areas-heading" className="mt-2 font-display text-3xl font-bold text-gray-900 sm:text-4xl">
                Cleaning Services Across Greater Manchester
              </h2>
              <p className="mt-4 text-gray-600 max-w-xl mx-auto">
                We cover Bolton and all surrounding areas. If you're not sure we reach you, give us a call — we probably do.
              </p>
            </div>

            <div className="mt-10 flex flex-wrap justify-center gap-3">
              {SERVICE_AREAS.map(area => (
                <Link
                  key={area}
                  href={`/areas/${area.toLowerCase()}`}
                  className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 shadow-sm transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
                >
                  Cleaning in {area}
                </Link>
              ))}
            </div>

            {/* Local SEO content */}
            <div className="mt-12 prose prose-sm max-w-none text-gray-600">
              <h3 className="font-display text-xl font-bold text-gray-900">House Cleaning in Bolton</h3>
              <p>
                PureMaids is Bolton's most trusted cleaning company, serving households and businesses across all BL postcodes.
                Whether you need a one-off domestic clean, a regular fortnightly service, or a thorough end-of-tenancy clean before your checkout,
                our trained and insured cleaners deliver consistent, high-quality results every time.
              </p>
              <p>
                We also cover Greater Manchester including Manchester, Bury, Wigan, Preston, Chorley, Salford, Rochdale, and Oldham.
                All cleaners are DBS-checked and carry full public liability insurance — so you can trust us completely in your home.
              </p>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="section bg-white" aria-labelledby="faq-heading">
          <div className="container max-w-3xl">
            <h2 id="faq-heading" className="font-display text-3xl font-bold text-gray-900 sm:text-4xl text-center">
              Frequently Asked Questions
            </h2>
            <dl className="mt-10 space-y-4">
              {[
                { q: 'How much does house cleaning cost in Bolton?', a: 'Our domestic cleaning starts from just £59 for a standard visit. Deep cleaning from £129, end of tenancy from £189. We provide a fixed quote with no hidden charges.' },
                { q: 'Are your cleaners DBS checked and insured?', a: 'Yes. Every PureMaids cleaner undergoes a full DBS (Disclosure and Barring Service) check and is covered by our comprehensive public liability insurance.' },
                { q: 'How do I book?', a: 'Simply click "Get a Quote" above, choose your service, and pay a 20% deposit online by card, Apple Pay, or Google Pay. We\'ll confirm your booking within the hour.' },
                { q: 'What if I\'m not happy with the clean?', a: 'We offer a 100% satisfaction guarantee. If you\'re not completely happy, contact us within 24 hours and we\'ll return to put it right — at no extra cost.' },
                { q: 'Do I need to provide cleaning supplies?', a: 'No. Our cleaners bring all necessary equipment and eco-friendly products. Just let us know if you have any preferences.' },
              ].map((item, i) => (
                <div key={i} className="rounded-2xl border border-gray-200 bg-white">
                  <dt>
                    <details>
                      <summary className="flex cursor-pointer items-center justify-between gap-4 p-6 text-base font-semibold text-gray-900 hover:text-brand-700 transition-colors list-none">
                        {item.q}
                        <svg className="h-5 w-5 flex-shrink-0 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </summary>
                      <dd className="px-6 pb-6 text-gray-600 leading-relaxed">{item.a}</dd>
                    </details>
                  </dt>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section className="section bg-brand-700" aria-labelledby="cta-heading">
          <div className="container text-center">
            <h2 id="cta-heading" className="font-display text-3xl font-bold text-white sm:text-4xl text-balance">
              Ready for a spotless home?
            </h2>
            <p className="mt-4 text-lg text-brand-200 max-w-xl mx-auto">
              Book online in 2 minutes. Secure your slot with a 20% deposit. Satisfaction guaranteed.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/book" className="btn btn-lg bg-white text-brand-700 hover:bg-brand-50">
                Get a Free Quote
              </Link>
              <a href={`tel:${BUSINESS.phone}`} className="btn btn-lg border border-white/30 text-white hover:bg-white/10">
                Call {BUSINESS.phone}
              </a>
            </div>
            <p className="mt-6 text-sm text-brand-300">
              No contract · Cancel anytime · 100% satisfaction guarantee
            </p>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
