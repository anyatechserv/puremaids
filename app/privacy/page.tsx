export default function PrivacyPage() {
  return (
    <div className="section py-16">
      <div className="mx-auto max-w-3xl prose">
        <h1 className="heading-1 mb-8">Privacy Policy</h1>
        <div className="space-y-6 text-gray-600">
          <section>
            <h2 className="heading-3 mb-3">1. Data Controller</h2>
            <p>PureMaids Ltd is the data controller for your personal data. We are registered with the ICO and comply with the UK GDPR and Data Protection Act 2018.</p>
          </section>
          <section>
            <h2 className="heading-3 mb-3">2. Data We Collect</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Name, email, phone number, address, and postcode for booking purposes</li>
              <li>Payment information is processed by Stripe and is not stored on our servers</li>
              <li>Booking preferences and special instructions</li>
              <li>IP address and browser data for security purposes</li>
            </ul>
          </section>
          <section>
            <h2 className="heading-3 mb-3">3. How We Use Your Data</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>To process bookings and assign cleaners</li>
              <li>To process payments and issue invoices</li>
              <li>To send booking confirmations and reminders</li>
              <li>To respond to enquiries and provide customer support</li>
            </ul>
          </section>
          <section>
            <h2 className="heading-3 mb-3">4. Data Retention</h2>
            <p>Booking data is retained for 7 years for tax purposes. Contact enquiries are deleted after 12 months if no booking is made.</p>
          </section>
          <section>
            <h2 className="heading-3 mb-3">5. Your Rights</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Right to access your data</li>
              <li>Right to rectification</li>
              <li>Right to erasure (right to be forgotten)</li>
              <li>Right to data portability</li>
              <li>Right to object to processing</li>
            </ul>
          </section>
          <section>
            <h2 className="heading-3 mb-3">6. Contact</h2>
            <p>To exercise your rights, contact us at privacy@puremaids.co.uk</p>
          </section>
        </div>
      </div>
    </div>
  );
}
