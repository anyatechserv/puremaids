import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Terms of Service | PureMaids',
  description: 'PureMaids terms of service and conditions for our professional cleaning services.',
};

export default function TermsPage() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="font-heading font-bold text-3xl text-secondary-800 mb-3">Terms of Service</h1>
        <p className="text-secondary-400 text-sm mb-8">Last updated: 1 January 2024</p>
        <div className="space-y-6 text-secondary-600 leading-relaxed text-sm">
          {[
            { title: '1. Agreement', content: 'By booking a service with PureMaids Ltd, you agree to be bound by these Terms of Service.' },
            { title: '2. Services', content: 'PureMaids provides professional cleaning services as described on our website. We reserve the right to refuse service to anyone.' },
            { title: '3. Booking & Payment', content: 'Bookings are confirmed upon receipt of deposit or full payment. Prices are inclusive of VAT and are fixed at the time of booking.' },
            { title: '4. Cancellation Policy', content: 'Cancellations must be made at least 24 hours before the scheduled clean. Late cancellations may incur a £25 fee.' },
            { title: '5. Satisfaction Guarantee', content: 'If you are not satisfied with the quality of our clean, please notify us within 24 hours and we will arrange a free re-clean.' },
            { title: '6. Liability', content: 'Our liability is limited to the value of the clean in question. We carry public liability insurance up to £5 million.' },
            { title: '7. Governing Law', content: 'These terms are governed by the laws of England and Wales.' },
          ].map(({ title, content }) => (
            <section key={title}>
              <h2 className="font-heading font-semibold text-secondary-800 text-xl mb-2">{title}</h2>
              <p>{content}</p>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
