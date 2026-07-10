import SubscriptionPlans from '@/components/stripe/SubscriptionPlans';
import { BUSINESS } from '@/lib/constants';

export const metadata = {
  title: 'Subscription Cleaning Plans | PureMaids',
  description: 'Save up to 10% with weekly, fortnightly, or monthly cleaning subscriptions. Cancel anytime.',
};

export const dynamic = 'force-dynamic';

export default function SubscriptionsPage() {
  return (
    <div className="min-h-screen">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <a href="/" className="text-xl font-bold text-brand-600">{BUSINESS.name}</a>
        </div>
      </header>

      <div className="bg-gradient-to-b from-brand-50 to-white py-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900">Cleaning Subscription Plans</h1>
        <p className="mt-3 text-gray-600">Recurring cleaning on your schedule. Cancel anytime.</p>
      </div>

      <SubscriptionPlans />
    </div>
  );
}
