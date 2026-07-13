import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import { BUSINESS } from '@/lib/constants';

export const metadata = { title: 'Privacy Policy', description: 'PureMaids privacy policy — how we collect, use, and protect your data.' };

export default function PrivacyPage() {
  return (
    <>
      <Nav />
      <main id="main-content" className="min-h-screen bg-white pt-20">
        <div className="container max-w-3xl py-12">
          <h1 className="font-display text-3xl font-bold text-gray-900">Privacy Policy</h1>
          <p className="mt-2 text-sm text-gray-500">Last updated: January 2026</p>

          <div className="mt-8 prose prose-sm max-w-none text-gray-700 leading-relaxed space-y-6">
            <section>
              <h2 className="text-xl font-bold text-gray-900">1. Who we are</h2>
              <p>{BUSINESS.name} Ltd ("{BUSINESS.name}", "we", "us") is a cleaning services company registered in England and Wales (Company No. {BUSINESS.companiesHouse}). Our registered address is {BUSINESS.address}.</p>
              <p>We are registered with the Information Commissioner's Office (ICO). We act as the data controller for personal data we collect through our website and services.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900">2. Data we collect</h2>
              <p>We collect the following categories of personal data:</p>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>Identity data:</strong> first name, last name</li>
                <li><strong>Contact data:</strong> email address, phone number, postal address</li>
                <li><strong>Booking data:</strong> service type, property details, preferred dates</li>
                <li><strong>Payment data:</strong> payment amount, transaction reference (card details are processed by Stripe — we do not store them)</li>
                <li><strong>Technical data:</strong> IP address, browser type, pages visited</li>
                <li><strong>Communication data:</strong> emails and messages you send us</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900">3. How we use your data</h2>
              <p>We use your data to:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Process and manage your cleaning bookings</li>
                <li>Process payments securely via Stripe</li>
                <li>Send booking confirmations, reminders, and invoices</li>
                <li>Respond to your enquiries</li>
                <li>Improve our website and services</li>
                <li>Comply with legal obligations</li>
              </ul>
              <p>Our lawful basis for processing is: <strong>contract performance</strong> (for booking data), <strong>legitimate interests</strong> (for analytics), and <strong>consent</strong> (for marketing).</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900">4. Data sharing</h2>
              <p>We share your data only with trusted third parties necessary to deliver our services:</p>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>Stripe</strong> — payment processing (see Stripe's privacy policy)</li>
                <li><strong>Supabase</strong> — secure database and authentication hosting</li>
                <li><strong>Resend</strong> — transactional email delivery</li>
              </ul>
              <p>We do not sell your personal data to any third party.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900">5. Your rights</h2>
              <p>Under UK GDPR, you have the right to:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Access your personal data</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion ("right to be forgotten")</li>
                <li>Object to or restrict processing</li>
                <li>Data portability</li>
                <li>Withdraw consent at any time</li>
              </ul>
              <p>To exercise any of these rights, contact us at <a href={`mailto:${BUSINESS.email}`} className="text-brand-600 underline">{BUSINESS.email}</a>.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900">6. Data retention</h2>
              <p>We retain personal data for as long as necessary to fulfil our contractual and legal obligations. Booking records are retained for 7 years for accounting purposes. You may request earlier deletion subject to our legal obligations.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900">7. Cookies</h2>
              <p>We use cookies to improve your experience. See our <a href="/cookies" className="text-brand-600 underline">Cookie Policy</a> for full details and to manage your preferences.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900">8. Contact</h2>
              <p>For privacy enquiries: <a href={`mailto:${BUSINESS.email}`} className="text-brand-600 underline">{BUSINESS.email}</a></p>
              <p>You also have the right to complain to the <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-brand-600 underline">ICO</a>.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
