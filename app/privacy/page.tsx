import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import { BUSINESS } from '@/lib/constants';
export const metadata = { title: 'Privacy Policy', description: 'How PureMaids collects, uses, and protects your personal data under UK GDPR.' };

export default function PrivacyPage() {
  return (
    <>
      <Nav />
      <main id="main-content" className="min-h-screen bg-white pt-20">
        <div className="container max-w-3xl py-12">
          <h1 className="font-display text-3xl font-bold text-gray-900">Privacy Policy</h1>
          <p className="mt-1 text-sm text-gray-500">Last updated: January 2026</p>
          <div className="prose prose-gray mt-8 max-w-none space-y-6 text-sm leading-relaxed">

            <section aria-labelledby="h-who">
              <h2 id="h-who" className="text-xl font-bold text-gray-900">1. Who we are</h2>
              <p>{BUSINESS.name} Ltd ("{BUSINESS.name}", "we") is registered in England and Wales (Co. No.&nbsp;{BUSINESS.companiesHouse}), registered address {BUSINESS.address}. We are registered with the ICO (Reg.&nbsp;{BUSINESS.icoNumber}) and act as the data controller for personal data collected through our website and services.</p>
            </section>

            <section aria-labelledby="h-collect">
              <h2 id="h-collect" className="text-xl font-bold text-gray-900">2. Data we collect</h2>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li><strong>Identity:</strong> first name, last name</li>
                <li><strong>Contact:</strong> email, phone, postal address, postcode</li>
                <li><strong>Booking:</strong> service type, property details, preferred dates</li>
                <li><strong>Payment:</strong> amount, transaction reference (card data is processed by Stripe — we never store it)</li>
                <li><strong>Technical:</strong> IP address, browser type, pages visited, cookie data</li>
              </ul>
            </section>

            <section aria-labelledby="h-use">
              <h2 id="h-use" className="text-xl font-bold text-gray-900">3. How we use your data</h2>
              <p>We process your data to: process and manage bookings; process payments via Stripe; send confirmations, reminders, and invoices; respond to enquiries; and improve our services. Lawful bases: <strong>contract performance</strong> (booking data), <strong>legitimate interests</strong> (analytics), <strong>consent</strong> (marketing).</p>
            </section>

            <section aria-labelledby="h-share">
              <h2 id="h-share" className="text-xl font-bold text-gray-900">4. Data sharing</h2>
              <p>We share data only with trusted processors: <strong>Stripe</strong> (payments), <strong>Supabase</strong> (secure database), <strong>Resend</strong> (transactional email). We never sell personal data.</p>
            </section>

            <section aria-labelledby="h-rights">
              <h2 id="h-rights" className="text-xl font-bold text-gray-900">5. Your rights (UK GDPR)</h2>
              <p>You have the right to: access your data; correct inaccuracies; request deletion; object to or restrict processing; data portability; withdraw consent. Exercise these rights by emailing <a href={`mailto:${BUSINESS.email}`} className="text-brand-600 underline">{BUSINESS.email}</a>. You can also complain to the <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-brand-600 underline">ICO</a>.</p>
            </section>

            <section aria-labelledby="h-retain">
              <h2 id="h-retain" className="text-xl font-bold text-gray-900">6. Retention</h2>
              <p>Booking records are retained for 7 years for accounting and legal compliance. You may request earlier deletion subject to those obligations.</p>
            </section>

            <section aria-labelledby="h-cookies">
              <h2 id="h-cookies" className="text-xl font-bold text-gray-900">7. Cookies</h2>
              <p>See our <a href="/cookies" className="text-brand-600 underline">Cookie Policy</a> for details and to manage preferences.</p>
            </section>

            <section aria-labelledby="h-contact">
              <h2 id="h-contact" className="text-xl font-bold text-gray-900">8. Contact</h2>
              <p>Privacy queries: <a href={`mailto:${BUSINESS.email}`} className="text-brand-600 underline">{BUSINESS.email}</a> or write to us at {BUSINESS.address}.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
