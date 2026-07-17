export default function TermsPage() {
  return (
    <div className="section py-16">
      <div className="mx-auto max-w-3xl prose">
        <h1 className="heading-1 mb-8">Terms and Conditions</h1>
        <div className="space-y-6 text-gray-600">
          <section><h2 className="heading-3 mb-3">1. Services</h2><p>PureMaids Ltd provides professional cleaning services in Bolton and Greater Manchester.</p></section>
          <section><h2 className="heading-3 mb-3">2. Booking and Payment</h2><p>A 20% deposit is required to secure all bookings. The balance is due on completion of the service. Payments are processed by Stripe.</p></section>
          <section><h2 className="heading-3 mb-3">3. Cancellation</h2><p>Cancellations made more than 48 hours before the scheduled service will receive a full balance refund. The deposit is non-refundable. Cancellations within 48 hours may incur a 50% cancellation fee.</p></section>
          <section><h2 className="heading-3 mb-3">4. Satisfaction Guarantee</h2><p>If you are not satisfied with the cleaning service, contact us within 24 hours and we will re-clean the affected areas at no additional cost.</p></section>
          <section><h2 className="heading-3 mb-3">5. Liability</h2><p>PureMaids Ltd is insured for up to £2,000,000 public liability. Claims must be reported within 48 hours of the service.</p></section>
          <section><h2 className="heading-3 mb-3">6. Subscriptions</h2><p>Subscription plans are billed monthly via Stripe. You can cancel anytime with 30 days notice.</p></section>
        </div>
      </div>
    </div>
  );
}
