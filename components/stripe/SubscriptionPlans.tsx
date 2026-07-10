'use client';

import { useState } from 'react';
import { SUBSCRIPTION_PLANS } from '@/lib/types/stripe';
import { formatGBP } from '@/lib/pricing';
import { createSubscriptionCheckoutSession, redirectToCheckout } from '@/lib/stripe-api';
import { supabase } from '@/lib/supabase-client';

export default function SubscriptionPlans() {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubscribe(planId: string, priceId: string, planName: string) {
    setLoading(planId);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('Please sign in to subscribe to a cleaning plan.');
        setLoading(null);
        return;
      }

      const result = await createSubscriptionCheckoutSession({
        planId,
        priceId,
        planName,
        customerEmail: user.email ?? '',
        customerName: user.email ?? '',
      });

      if (result?.url) {
        redirectToCheckout(result.url);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Subscription failed');
    } finally {
      setLoading(null);
    }
  }

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Subscription Cleaning Plans</h2>
          <p className="mt-3 text-gray-600">
            Save up to 10% with recurring cleaning. Cancel anytime — no long-term contracts.
          </p>
        </div>

        {error && (
          <div className="mx-auto mt-6 max-w-md rounded-lg bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {SUBSCRIPTION_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`card relative p-8 ${
                plan.popular ? 'ring-2 ring-brand-500' : ''
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-600 px-4 py-1 text-xs font-semibold text-white">
                  Most Popular
                </span>
              )}

              <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
              <p className="mt-2 text-sm text-gray-600">{plan.description}</p>

              <div className="mt-6">
                <span className="text-4xl font-bold text-gray-900">
                  {formatGBP(plan.monthlyPricePence)}
                </span>
                <span className="text-gray-500">/month</span>
              </div>

              <div className="mt-4 text-sm text-gray-500">
                {plan.visitsPerMonth} {plan.visitsPerMonth === 1 ? 'visit' : 'visits'}/month
                {' · '}
                {plan.hoursPerVisit}h per visit
              </div>

              <ul className="mt-6 space-y-3">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-brand-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.7 5.3a1 1 0 010 1.4l-8 8a1 1 0 01-1.4 0l-4-4a1 1 0 011.4-1.4L8 12.6l7.3-7.3a1 1 0 011.4 0z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan.id, plan.stripePriceId, plan.name)}
                disabled={loading !== null}
                className={`mt-8 w-full ${plan.popular ? 'btn-primary' : 'btn-secondary'}`}
              >
                {loading === plan.id ? 'Redirecting...' : 'Subscribe Now'}
              </button>

              <p className="mt-3 text-center text-xs text-gray-500">
                Secure payment via Stripe · Cancel anytime
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
