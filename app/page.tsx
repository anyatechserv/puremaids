import CheckoutButton from '@/components/stripe/CheckoutButton';
import SubscriptionPlans from '@/components/stripe/SubscriptionPlans';
import { BUSINESS, SERVICE_PRICES_PENCE } from '@/lib/constants';
import { formatGBP } from '@/lib/pricing';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <span className="text-xl font-bold text-brand-600">{BUSINESS.name}</span>
          <nav className="flex gap-6 text-sm">
            <a href="/subscriptions" className="text-gray-600 hover:text-brand-600">Plans</a>
            <a href="/account/invoices" className="text-gray-600 hover:text-brand-600">Invoices</a>
            <a href="/admin/refunds" className="text-gray-600 hover:text-brand-600">Admin</a>
          </nav>
        </div>
      </header>

      <section className="bg-gradient-to-b from-brand-50 to-white py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            Professional Cleaning Services in Bolton & Greater Manchester
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            House cleaning, deep cleaning, end of tenancy, and office cleaning.
            Book online with a 20% deposit — pay by card, Apple Pay, or Google Pay.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {Object.entries(SERVICE_PRICES_PENCE).map(([key, val]) => (
              <div key={key} className="card px-6 py-4 text-center">
                <div className="text-sm text-gray-500">{val.label}</div>
                <div className="text-xl font-bold text-brand-600">from {formatGBP(val.base)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SubscriptionPlans />

      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-bold text-gray-900">Example Booking Checkout</h2>
          <p className="mt-2 text-gray-600">
            Pay a 20% deposit or the full amount. Secure checkout powered by Stripe.
          </p>
          <div className="card mt-6 p-6">
            <CheckoutButton
              bookingId="demo-booking-id"
              bookingReference="PM-DEMO001"
              serviceType="deep"
              extras={['oven_clean', 'fridge_clean']}
              customerEmail="demo@example.com"
              customerName="Demo Customer"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
