import { SERVICES, SERVICE_AREAS } from '@/lib/constants';
import { formatGBP } from '@/lib/pricing';

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 to-white">
        <div className="section py-20 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <span className="badge-brand mb-4">Trusted by 500+ Bolton homes</span>
            <h1 className="heading-1 mb-6">
              Professional cleaning services <span className="text-brand-600">done right</span>
            </h1>
            <p className="text-body mb-8 text-lg">
              Book DBS-checked cleaners in under 2 minutes. Instant quotes, secure deposits, satisfaction guarantee.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/book" className="btn-primary">Get a Free Quote</a>
              <a href="/subscriptions" className="btn-outline">View Subscription Plans</a>
            </div>
          </div>
        </div>
      </section>

      <section className="section py-16">
        <div className="text-center mb-12">
          <h2 className="heading-2 mb-4">Our Services</h2>
          <p className="text-body">Choose from our range of professional cleaning services</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {Object.entries(SERVICES).map(([key, svc]) => (
            <div key={key} className="card-hover">
              <h3 className="heading-3 mb-2 text-lg">{svc.label}</h3>
              <p className="text-body text-sm mb-4">{svc.description}</p>
              <p className="text-2xl font-bold text-brand-600">from {formatGBP(svc.basePence)}</p>
              <a href={`/book?service=${key}`} className="btn-primary mt-4 w-full">Book Now</a>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="section">
          <div className="text-center mb-12">
            <h2 className="heading-2 mb-4">Areas We Cover</h2>
            <p className="text-body">Serving Bolton and surrounding areas</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {SERVICE_AREAS.map(area => (
              <span key={area} className="badge-brand">{area}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="section py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="heading-2 mb-4">Ready for a cleaner home?</h2>
          <p className="text-body mb-8 text-lg">Get your instant quote and book online in under 2 minutes.</p>
          <a href="/book" className="btn-primary text-lg px-8 py-4">Get Started</a>
        </div>
      </section>
    </>
  );
}
