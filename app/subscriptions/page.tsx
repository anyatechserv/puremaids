'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/lib/supabase-client';
import { createCheckoutSession } from '@/lib/stripe-api';

interface Plan {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  monthly_price_pence: number;
  visits_per_month: number;
  hours_per_visit: number;
  features: string[];
  is_active: boolean;
  stripe_price_id: string;
}

export default function SubscriptionsPage() {
  const router = useRouter();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [redirecting, setRedirecting] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const supabase = getSupabaseBrowserClient();
      const { data } = await supabase.from('subscription_plans').select('*').eq('is_active', true).order('sort_order');
      setPlans((data || []).map((p: any) => ({ ...p, features: Array.isArray(p.features) ? p.features : [] })));
      setLoading(false);
    }
    load();
  }, []);

  async function handleSubscribe(plan: Plan) {
    setRedirecting(plan.id);
    try {
      const supabase = getSupabaseBrowserClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login?redirect=/subscriptions'); return; }
      const session = await createCheckoutSession({
        mode: 'subscription',
        planId: plan.slug,
        priceId: plan.stripe_price_id,
        planName: plan.name,
        customerEmail: user.email || '',
        customerName: user.user_metadata?.full_name || '',
      });
      router.push(session.url);
    } catch (err) {
      setRedirecting(null);
      alert(err instanceof Error ? err.message : 'Failed to start checkout');
    }
  }

  if (loading) return <div className="section py-20 text-center text-gray-500">Loading plans...</div>;

  return (
    <div className="section py-16">
      <div className="text-center mb-12">
        <h1 className="heading-1 mb-4">Subscription Plans</h1>
        <p className="text-body text-lg">Save money with regular cleaning subscriptions</p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {plans.map(plan => (
          <div key={plan.id} className="card-hover flex flex-col">
            <h2 className="heading-3 mb-2">{plan.name}</h2>
            <p className="text-gray-500 text-sm mb-4">{plan.description}</p>
            <p className="text-3xl font-bold text-brand-600 mb-1">£{(plan.monthly_price_pence / 100).toFixed(0)}<span className="text-base font-normal text-gray-500">/month</span></p>
            <p className="text-sm text-gray-500 mb-4">{plan.visits_per_month} visits x {plan.hours_per_visit}h</p>
            <ul className="space-y-2 mb-6 flex-1">
              {Array.isArray(plan.features) && plan.features.map((f, i) => <li key={i} className="text-sm text-gray-600 flex items-start gap-2"><span className="text-brand-600">&#10003;</span>{f}</li>)}
            </ul>
            <button className="btn-primary w-full" disabled={redirecting === plan.id} onClick={() => handleSubscribe(plan)}>
              {redirecting === plan.id ? 'Redirecting...' : 'Subscribe'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
