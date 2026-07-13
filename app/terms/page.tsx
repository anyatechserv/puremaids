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
          <h1 className="font-display text-3xl font-bold text-gray-900">Terms & Conditions</h1>
          <p className="mt-2 text-sm text-gray-500">Last updated: January 2026</p>
          <div className="mt-8 prose prose-sm max-w-none text-gray-700 space-y-6">
            <section>
              <h2 className="text-xl font-bold text-gray-900">1. Booking and payment</h2>
              <p>A 20% non-refundable deposit is required to confirm your booking. The remaining balance is due on completion of the service.</p>
              <p>All prices are quoted inclusive of VAT where applicable. Payments are processed securely by Stripe.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-gray-900">2. Cancellation policy</h2>
              <p>Cancellations made more than 48 hours before the scheduled service will receive a full refund of the balance (deposit is non-refundable). Cancellations within 48 hours may incur a cancellation fee of up to 50% of the service value.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-gray-900">3. Satisfaction guarantee</h2>
              <p>If you are not satisfied with our service, please contact us within 24 hours of your clean. We will arrange a return visit at no additional cost to rectify any issues.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-gray-900">4. Liability</h2>
              <p>We carry comprehensive public liability insurance. Any claims for damage must be reported within 24 hours of the service. We are not liable for pre-existing damage or items of exceptional value unless previously declared.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-gray-900">5. Contact</h2>
              <p>For queries: <a href={`mailto:${BUSINESS.email}`} className="text-brand-600 underline">{BUSINESS.email}</a> or call {BUSINESS.phone}.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
