'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase-client';

export default function SubscriptionSuccessPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    async function confirm() {
      const sessionId = new URLSearchParams(window.location.search).get('session_id');
      if (!sessionId) {
        setStatus('error');
        return;
      }
      // The webhook handles the actual subscription record creation.
      // We just show success here.
      setStatus('success');
    }
    confirm();
  }, []);

  if (status === 'loading') {
    return <div className="flex min-h-screen items-center justify-center text-gray-500">Confirming your subscription...</div>;
  }

  if (status === 'error') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="card p-8 text-center">
          <h1 className="text-2xl font-bold text-red-600">Something went wrong</h1>
          <p className="mt-2 text-gray-600">We couldn't confirm your subscription. Please contact us.</p>
          <a href="/subscriptions" className="btn-primary mt-6">Back to Plans</a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="card p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Subscription Activated!</h1>
        <p className="mt-2 text-gray-600">Your cleaning plan is now active. We'll be in touch to schedule your first visit.</p>
        <a href="/" className="btn-primary mt-6">Back to Home</a>
      </div>
    </div>
  );
}
