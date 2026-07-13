import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import { BUSINESS } from '@/lib/constants';
export const metadata = { title: 'Terms & Conditions' };

export default function TermsPage() {
  return (
    <>
      <Nav />
      <main id="main-content" className="min-h-screen bg-white pt-20">
        <div className="container max-w-3xl py-12">
          <h1 className="font-display text-3xl font-bold text-gray-900">Terms &amp; Conditions</h1>
          <p className="mt-1 text-sm text-gray-500">Last updated: January 2026</p>
          <div className="mt-8 space-y-6 text-sm leading-relaxed text-gray-700">
            {[
              { id: '1', title: 'Booking and payment', body: `A ${BUSINESS.name} booking is confirmed only once a 20% deposit has been paid. The balance is due on completion of the service. All prices include VAT where applicable. Payments are processed securely by Stripe.` },
              { id: '2', title: 'Cancellation policy', body: 'Cancellations made more than 48 hours before the scheduled service will receive a full refund of the balance (deposit is non-refundable). Cancellations within 48 hours may incur a fee of up to 50% of the service value.' },
              { id: '3', title: 'Satisfaction guarantee', body: 'If you are not satisfied, please contact us within 24 hours of your clean. We will arrange a return visit at no additional cost to rectify any issues.' },
              { id: '4', title: 'Liability', body: 'We carry comprehensive public liability insurance (£5m). Damage claims must be reported within 24 hours. We are not liable for pre-existing damage or items of exceptional value unless declared in advance.' },
              { id: '5', title: 'Subscriptions', body: 'Subscription plans are billed monthly. You may cancel at any time; your plan remains active until the end of the current billing period. No cancellation fees apply.' },
              { id: '6', title: 'Contact', body: `For queries: ${BUSINESS.email} · ${BUSINESS.phone}` },
            ].map(s => (
              <section key={s.id} aria-labelledby={`terms-${s.id}`}>
                <h2 id={`terms-${s.id}`} className="text-lg font-bold text-gray-900">{s.id}. {s.title}</h2>
                <p className="mt-2">{s.body}</p>
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
