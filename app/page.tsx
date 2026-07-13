import Image from 'next/image';
import Link from 'next/link';
import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import Stars from '@/components/ui/Stars';
import { BUSINESS, SERVICES, TRUST_STATS, TRUST_BADGES, REVIEWS, SERVICE_AREAS, DEPOSIT_PCT } from '@/lib/constants';
import { fmt } from '@/lib/pricing';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: `House Cleaning Bolton & Manchester | From £59 | ${BUSINESS.name}`,
  description: 'Professional house cleaning Bolton, Bury, Wigan, Manchester & Preston. DBS-checked, fully insured. Rated 4.9★ by 2,400+ customers. Deposit from just £12. Book online today.',
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'How much does house cleaning cost in Bolton?', acceptedAnswer: { '@type': 'Answer', text: 'PureMaids domestic cleaning starts from £59. Deep cleaning from £129, end of tenancy from £189. You only pay a 20% deposit to secure your booking.' } },
    { '@type': 'Question', name: 'Are your cleaners DBS checked?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Every PureMaids cleaner is DBS (Disclosure and Barring Service) checked, fully insured, and vetted before joining our team.' } },
    { '@type': 'Question', name: 'Do I need to be home during the clean?', acceptedAnswer: { '@type': 'Answer', text: 'No. Many clients give us a key or entry code. All our staff are vetted and insured, and you can track your booking in your account.' } },
    { '@type': 'Question', name: 'What areas do you cover?', acceptedAnswer: { '@type': 'Answer', text: `We cover ${SERVICE_AREAS.join(', ')} and all surrounding postcodes.` } },
    { '@type': 'Question', name: 'What payment methods do you accept?', acceptedAnswer: { '@type': 'Answer', text: 'We accept all major debit and credit cards, Apple Pay, and Google Pay via our secure Stripe checkout.' } },
  ],
};

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Nav />
      <main id="main-content">

        {/* ── HERO ───────────────────────────────────────────── */}
        <section
          className="relative flex min-h-[92vh] items-center overflow-hidden bg-brand-950"
          aria-labelledby="hero-heading"
        >
          <div className="absolute inset-0 opacity-25" aria-hidden="true">
            <Image
              src="https://images.pexels.com/photos/4099469/pexels-photo-4099469.jpeg"
              alt=""
              fill
              className="object-cover object-center"
              priority
              sizes="100vw"
              quality={80}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-brand-950/90 via-brand-950/70 to-transparent" aria-hidden="true" />

          <div className="container relative z-10 py-24 pt-36">
            <div className="max-w-2xl">
              {/* Urgency badge */}
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-700/40 bg-brand-800/50 px-4 py-1.5 text-sm text-brand-200 backdrop-blur-sm animate-fade-in">
                <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse-dot" aria-hidden="true" />
                Accepting bookings in Bolton &amp; Greater Manchester
              </div>

              <h1
                id="hero-heading"
                className="font-display text-4xl font-extrabold leading-tight text-white animate-slide-up sm:text-5xl lg:text-6xl text-balance"
              >
                A Cleaner Home,<br />
                <span className="text-brand-300">Guaranteed.</span>
              </h1>

              <p className="mt-5 text-lg text-brand-100/90 animate-slide-up leading-relaxed max-w-xl text-pretty sm:text-xl">
                DBS-checked, fully insured cleaners across Bolton &amp; Greater Manchester.
                Rated <strong className="text-white">4.9★</strong> by over 2,400 customers.
              </p>

              {/* Social proof avatars */}
              <div className="mt-6 flex items-center gap-4 animate-fade-in" aria-label="Recent customer ratings">
                <div className="flex -space-x-2" aria-hidden="true">
                  {['#259a87','#1b7c6d','#196459','#14413b'].map((c, i) => (
                    <div key={i} className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-brand-900 text-xs font-bold text-white" style={{ backgroundColor: c }}>
                      {['S','J','R','A'][i]}
                    </div>
                  ))}
                </div>
                <div>
                  <Stars rating={5} size="md" />
                  <p className="mt-0.5 text-sm text-brand-200">2,400+ five-star reviews</p>
                </div>
              </div>

              {/* CTAs */}
              <div className="mt-10 flex flex-wrap gap-4 animate-slide-up">
                <Link href="/book" className="btn btn-lg btn-primary shadow-glow">
                  Get a Free Quote
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </Link>
                <a href={`tel:${BUSINESS.phone}`} className="btn btn-lg border border-white/20 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20">
                  <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Call {BUSINESS.phone}
                </a>
              </div>

              <p className="mt-5 text-sm text-brand-300 animate-fade-in">
                ✓ No contract &nbsp;·&nbsp; ✓ Same-day quotes &nbsp;·&nbsp; ✓ 100% satisfaction guarantee
              </p>
            </div>
          </div>

          {/* Scroll hint */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-y" aria-hidden="true">
            <svg className="h-6 w-6 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </section>

        {/* ── STATS ────────────────────────────────────────────── */}
        <section aria-label="Company statistics" className="border-y bg-white py-10">
          <div className="container">
            <dl className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              {TRUST_STATS.map(s => (
                <div key={s.label} className="text-center">
                  <dt className="font-display text-3xl font-extrabold text-brand-600 sm:text-4xl">{s.value}</dt>
                  <dd className="mt-1 text-sm text-gray-500">{s.label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ── TRUST BADGES ─────────────────────────────────────── */}
        <section aria-label="Accreditations" className="bg-gray-50 py-5 border-b">
          <div className="container">
            <ul className="flex flex-wrap items-center justify-center gap-5 sm:gap-8" role="list">
              {TRUST_BADGES.map(b => (
                <li key={b} className="text-sm font-medium text-gray-600">{b}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── SERVICES ─────────────────────────────────────────── */}
        <section className="section bg-white" aria-labelledby="services-heading">
          <div className="container">
            <header className="text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">What we offer</p>
              <h2 id="services-heading" className="mt-2 font-display text-3xl font-bold text-gray-900 sm:text-4xl text-balance">
                Professional Cleaning Services in Bolton
              </h2>
              <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto text-pretty">
                From regular domestic cleaning to full end-of-tenancy deep cleans — delivered by trained, insured, DBS-checked professionals.
              </p>
            </header>

            <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4" role="list">
              {Object.entries(SERVICES).map(([key, svc]) => (
                <li key={key}>
                  <Link
                    href={`/services/${key.replace(/_/g, '-')}`}
                    className="card-hover group flex h-full flex-col p-6"
                    aria-label={`${svc.label} — from ${fmt(svc.basePence)}`}
                  >
                    <span className="text-3xl" aria-hidden="true">{svc.icon}</span>
                    <h3 className="mt-3 font-display text-lg font-bold text-gray-900 group-hover:text-brand-600 transition-colors">
                      {svc.label}
                    </h3>
                    <p className="mt-1.5 flex-1 text-sm text-gray-600 leading-relaxed">{svc.description}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-base font-bold text-brand-600">from {fmt(svc.basePence)}</span>
                      <span className="text-sm font-medium text-brand-500 transition-transform group-hover:translate-x-1">Book →</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-10 text-center">
              <Link href="/book" className="btn btn-lg btn-primary">Book Any Service Now</Link>
              <p className="mt-2.5 text-sm text-gray-500">Secure your slot with just a {DEPOSIT_PCT}% deposit</p>
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ─────────────────────────────────────── */}
        <section className="section bg-brand-50" aria-labelledby="hiw-heading">
          <div className="container">
            <header className="text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">Simple process</p>
              <h2 id="hiw-heading" className="mt-2 font-display text-3xl font-bold text-gray-900 sm:text-4xl">Book in 3 easy steps</h2>
            </header>
            <ol className="mt-12 grid gap-8 sm:grid-cols-3" role="list">
              {[
                { n: '1', icon: '📋', title: 'Get an instant quote', desc: 'Choose your service, property size, and any extras. See your fixed price immediately — no phone call needed.' },
                { n: '2', icon: '💳', title: `Pay a ${DEPOSIT_PCT}% deposit`, desc: 'Secure your booking with a small deposit. Pay by card, Apple Pay, or Google Pay via our secure Stripe checkout.' },
                { n: '3', icon: '✨', title: 'Enjoy a spotless home', desc: "Your DBS-checked cleaner arrives on time. If you're not happy, we'll return for free — no questions asked." },
              ].map(s => (
                <li key={s.n} className="flex flex-col items-center text-center">
                  <div className="relative">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm text-3xl" aria-hidden="true">{s.icon}</div>
                    <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white" aria-hidden="true">{s.n}</span>
                  </div>
                  <h3 className="mt-4 font-display text-xl font-bold text-gray-900">{s.title}</h3>
                  <p className="mt-2 text-gray-600 text-pretty leading-relaxed">{s.desc}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── REVIEWS ──────────────────────────────────────────── */}
        <section className="section bg-white" aria-labelledby="reviews-heading">
          <div className="container">
            <header className="text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">Customer reviews</p>
              <h2 id="reviews-heading" className="mt-2 font-display text-3xl font-bold text-gray-900 sm:text-4xl">
                What our customers say
              </h2>
              <div className="mt-3 flex items-center justify-center gap-2">
                <Stars rating={5} size="md" />
                <span className="font-semibold">4.9 out of 5</span>
                <span className="text-gray-400">·</span>
                <span className="text-gray-500 text-sm">2,400+ reviews</span>
              </div>
            </header>

            <ul className="mt-12 grid gap-6 sm:grid-cols-3" role="list">
              {REVIEWS.map((r, i) => (
                <li key={i}>
                  <figure className="card flex h-full flex-col p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700"
                          aria-hidden="true"
                        >
                          {r.avatar}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{r.name}</p>
                          <p className="text-xs text-gray-400">{r.location}</p>
                        </div>
                      </div>
                      <Stars rating={r.rating} />
                    </div>
                    <blockquote className="mt-4 flex-1">
                      <p className="text-sm text-gray-600 leading-relaxed">"{r.text}"</p>
                    </blockquote>
                    <figcaption className="mt-4 flex items-center justify-between text-xs text-gray-400">
                      <span>{r.service}</span>
                      <span>{r.date}</span>
                    </figcaption>
                  </figure>
                </li>
              ))}
            </ul>

            <div className="mt-8 text-center">
              <a href={BUSINESS.trustpilotUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-ghost" aria-label="Read all reviews on Trustpilot (opens in new tab)">
                Read all reviews on Trustpilot →
              </a>
            </div>
          </div>
        </section>

        {/* ── AREAS ────────────────────────────────────────────── */}
        <section className="section bg-gray-50" aria-labelledby="areas-heading">
          <div className="container">
            <header className="text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">Local coverage</p>
              <h2 id="areas-heading" className="mt-2 font-display text-3xl font-bold text-gray-900 sm:text-4xl">
                Cleaning Services Across Greater Manchester
              </h2>
            </header>

            <nav aria-label="Service areas" className="mt-10 flex flex-wrap justify-center gap-3">
              {SERVICE_AREAS.map(area => (
                <Link
                  key={area}
                  href={`/areas/${area.toLowerCase()}`}
                  className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
                >
                  Cleaning in {area}
                </Link>
              ))}
            </nav>

            {/* Local SEO prose */}
            <div className="mt-12 text-gray-600 text-sm leading-relaxed space-y-3 max-w-3xl mx-auto">
              <h3 className="font-display text-xl font-bold text-gray-900">House Cleaning in Bolton</h3>
              <p>
                PureMaids is Bolton's most trusted cleaning company, serving households and businesses across all BL postcodes.
                Whether you need a one-off domestic clean, a regular fortnightly service, or a thorough end-of-tenancy clean,
                our trained and insured cleaners deliver consistent, high-quality results every time.
              </p>
              <p>
                We cover the whole of Greater Manchester — including Manchester, Bury, Wigan, Preston, Chorley, Salford, Rochdale, and Oldham.
                All cleaners are DBS-checked and carry full public liability insurance.
              </p>
            </div>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────── */}
        <section className="section bg-white" aria-labelledby="faq-heading">
          <div className="container max-w-3xl">
            <h2 id="faq-heading" className="font-display text-3xl font-bold text-gray-900 text-center sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <dl className="mt-10 space-y-3">
              {[
                { q: 'How much does house cleaning cost in Bolton?', a: 'Our domestic cleaning starts from £59. Deep cleaning from £129, end of tenancy from £189. We provide a fixed quote — no hidden charges.' },
                { q: 'Are your cleaners DBS checked and insured?', a: 'Yes. Every cleaner undergoes a full DBS check and is covered by £5m public liability insurance.' },
                { q: 'How do I book?', a: `Click "Get a Quote", choose your service, and pay a ${DEPOSIT_PCT}% deposit online by card, Apple Pay, or Google Pay. We'll confirm within the hour.` },
                { q: "What if I'm not happy?", a: "Contact us within 24 hours and we'll return to put it right — free of charge. That's our 100% satisfaction guarantee." },
                { q: 'Do I need to provide cleaning supplies?', a: 'No — our cleaners bring all equipment and eco-friendly products. Just let us know if you have any preferences.' },
              ].map((item, i) => (
                <div key={i} className="rounded-2xl border border-gray-200">
                  <dt>
                    <details>
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-base font-semibold text-gray-900 hover:text-brand-700 transition-colors">
                        {item.q}
                        <svg className="h-5 w-5 shrink-0 text-gray-400 transition-transform details-open:rotate-180" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </summary>
                      <dd className="px-5 pb-5 text-gray-600 text-sm leading-relaxed">{item.a}</dd>
                    </details>
                  </dt>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ── FINAL CTA ────────────────────────────────────────── */}
        <section className="section bg-brand-700" aria-labelledby="cta-heading">
          <div className="container text-center">
            <h2 id="cta-heading" className="font-display text-3xl font-bold text-white sm:text-4xl text-balance">
              Ready for a spotless home?
            </h2>
            <p className="mt-4 text-lg text-brand-200 max-w-xl mx-auto">
              Book online in 2 minutes. Secure your slot with a {DEPOSIT_PCT}% deposit. Satisfaction guaranteed.
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
