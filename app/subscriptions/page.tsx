'use client';

import { useState } from 'react';
import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import { SUBSCRIPTION_PLANS } from '@/lib/subscription-plans';
import { formatGBP } from '@/lib/pricing';
import { supabase } from '@/lib/supabase-client';
import { createSubscriptionCheckout } from '@/lib/stripe-api';
import Spinner from '@/components/ui/Spinner';

export const dynamic = 'force-dynamic';

function CheckIcon() {
  return (
    <svg className="h-5 w-5 flex-shrink-0 text-brand-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M16.7 5.3a1 1 0 010 1.4l-8 8a1 1 0 01-1.4 0l-4-4a1 1 0 011.4-1.4L8 12.6l7.3-7.3a1 1 0 011.4 0z" clipRule="evenodd" />
    </svg>
  );
}

export default function SubscriptionsPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function subscribe(plan: typeof SUBSCRIPTION_PLANS[number]) {
    setLoading(plan.id);
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('Please sign in to subscribe.');
        setLoading(null);
        return;
      }
      const url = await createSubscriptionCheckout({
        planId: plan.id,
        priceId: plan.priceId,
        planName: plan.name,
        customerEmail: user.email ?? '',
        customerName: user.email ?? '',
      });
      window.location.href = url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Subscription failed');
      setLoading(null);
    }
  }

  return (
    <>
      <Nav />
      <main id="main-content">
        <section className="bg-gradient-to-b from-brand-50 to-white py-20 pt-32" aria-labelledby="plans-heading">
          <div className="container text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">Save up to 10%</p>
            <h1 id="plans-heading" className="mt-2 font-display text-4xl font-extrabold text-gray-900 sm:text-5xl text-balance">
              Subscription Cleaning Plans
            </h1>
            <p className="mt-4 text-lg text-gray-600 max-w-xl mx-auto">
              Recurring cleaning on your schedule. Cancel anytime. No long contracts.
            </p>
          </div>
        </section>

        <section className="section" aria-label="Plan options">
          <div className="container">
            {error && (
              <div className="alert alert-error mb-8 max-w-md mx-auto" role="alert">
                <svg className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            <div className="grid gap-8 md:grid-cols-3">
              {SUBSCRIPTION_PLANS.map(plan => (
                <article
                  key={plan.id}
                  className={`relative flex flex-col ${plan.popular ? 'card-featured' : 'card'} p-8`}
                  aria-label={`${plan.name} plan`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <span className="rounded-full bg-brand-600 px-4 py-1 text-xs font-bold text-white shadow-sm">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div>
                    <h2 className="font-display text-xl font-bold text-gray-900">{plan.name}</h2>
                    <p className="mt-2 text-sm text-gray-600">{plan.description}</p>
                  </div>

                  <div className="mt-6">
                    <div className="flex items-baseline gap-1">
                      <span className="font-display text-4xl font-extrabold text-gray-900">
                        {formatGBP(plan.monthlyPence)}
                      </span>
                      <span className="text-gray-500">/month</span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      {plan.visitsPerMonth === 1 ? '1 visit' : `${plan.visitsPerMonth} visits`} ·{' '}
                      {plan.hoursPerVisit} hrs each
                    </p>
                  </div>

                  <ul className="mt-6 flex-1 space-y-3" role="list">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                        <CheckIcon />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => subscribe(plan)}
                    disabled={loading !== null}
                    className={`btn btn-md mt-8 w-full ${plan.popular ? 'btn-primary' : 'btn-secondary'}`}
                    aria-label={`Subscribe to ${plan.name} for ${formatGBP(plan.monthlyPence)} per month`}
                  >
                    {loading === plan.id ? <><Spinner size="sm" /> Redirecting…</> : 'Subscribe Now'}
                  </button>

                  <p className="mt-3 text-center text-xs text-gray-400">
                    Secure · Cancel anytime · No setup fee
                  </p>
                </article>
              ))}
            </div>

            {/* FAQs */}
            <div className="mt-16 max-w-2xl mx-auto">
              <h2 className="font-display text-2xl font-bold text-gray-900 text-center">Plan FAQs</h2>
              <dl className="mt-6 space-y-4">
                {[
                  { q: 'Can I cancel at any time?', a: 'Yes. Cancel your subscription from your account with no cancellation fees. Your plan will remain active until the end of the billing period.' },
                  { q: 'What if I need to skip a visit?', a: 'Just give us 48 hours notice and we\'ll pause that visit at no charge.' },
                  { q: 'Do I always get the same cleaner?', a: 'Yes — we assign a dedicated cleaner to your property so they learn your preferences.' },
                ].map((item, i) => (
                  <div key={i} className="rounded-2xl border border-gray-200 bg-white">
                    <details>
                      <summary className="flex cursor-pointer items-center justify-between gap-4 p-5 text-sm font-semibold text-gray-900 hover:text-brand-700 list-none">
                        {item.q}
                        <svg className="h-4 w-4 flex-shrink-0 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </summary>
                      <dd className="px-5 pb-5 text-sm text-gray-600">{item.a}</dd>
                    </details>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
