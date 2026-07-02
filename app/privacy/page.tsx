import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Privacy Policy | PureMaids',
  description: 'PureMaids privacy policy. How we collect, use, and protect your personal data in accordance with GDPR.',
};

export default function PrivacyPage() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="font-heading font-bold text-3xl text-secondary-800 mb-3">Privacy Policy</h1>
        <p className="text-secondary-400 text-sm mb-8">Last updated: 1 January 2024</p>

        <div className="prose prose-secondary max-w-none space-y-6 text-secondary-600 leading-relaxed text-sm">
          <section>
            <h2 className="font-heading font-semibold text-secondary-800 text-xl mb-3">1. Who We Are</h2>
            <p>PureMaids Ltd (&ldquo;PureMaids&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) is a professional cleaning company registered in England and Wales. We are the data controller responsible for your personal data. You can contact us at <a href={`mailto:${SITE_CONFIG.email}`} className="text-primary-600 hover:underline">{SITE_CONFIG.email}</a>.</p>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-secondary-800 text-xl mb-3">2. Data We Collect</h2>
            <p>We collect personal information you provide when:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Making a booking or enquiry (name, email, phone, address)</li>
              <li>Contacting us via our contact form</li>
              <li>Subscribing to our newsletter</li>
              <li>Visiting our website (usage data via cookies)</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-secondary-800 text-xl mb-3">3. How We Use Your Data</h2>
            <p>We use your personal data to:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Process and fulfil your cleaning bookings</li>
              <li>Communicate with you about your bookings</li>
              <li>Send service-related notifications</li>
              <li>Improve our services and website</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-secondary-800 text-xl mb-3">4. Legal Basis for Processing</h2>
            <p>We process your personal data under the following legal bases: contractual necessity (to fulfil your booking), legitimate interests (to communicate with customers), and consent (for marketing communications).</p>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-secondary-800 text-xl mb-3">5. Data Retention</h2>
            <p>We retain your personal data for as long as necessary to fulfil the purposes for which it was collected, and in accordance with applicable legal requirements. Booking records are kept for 7 years for accounting purposes.</p>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-secondary-800 text-xl mb-3">6. Your Rights</h2>
            <p>Under GDPR, you have the right to access, rectify, erase, restrict processing of, or port your data. You also have the right to object to processing and to withdraw consent at any time. To exercise these rights, contact us at <a href={`mailto:${SITE_CONFIG.email}`} className="text-primary-600 hover:underline">{SITE_CONFIG.email}</a>.</p>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-secondary-800 text-xl mb-3">7. Contact Us</h2>
            <p>For any privacy-related questions, contact our Data Protection Officer at <a href={`mailto:${SITE_CONFIG.email}`} className="text-primary-600 hover:underline">{SITE_CONFIG.email}</a> or call <a href={`tel:${SITE_CONFIG.phone.replace(/\s/g,'')}`} className="text-primary-600 hover:underline">{SITE_CONFIG.phone}</a>.</p>
          </section>
        </div>
      </div>
    </section>
  );
}
