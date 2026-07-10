'use client';

import { useEffect, useState } from 'react';
import { formatGBP } from '@/lib/pricing';

export default function BookingSuccessPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [details, setDetails] = useState<{ reference: string } | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id');
    const ref = params.get('ref') ?? '—';

    if (!sessionId) {
      setStatus('error');
      return;
    }

    setDetails({ reference: ref });
    setStatus('success');
  }, []);

  if (status === 'loading') {
    return <div className="flex min-h-screen items-center justify-center text-gray-500">Confirming your payment...</div>;
  }

  if (status === 'error') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="card p-8 text-center">
          <h1 className="text-2xl font-bold text-red-600">Payment Incomplete</h1>
          <p className="mt-2 text-gray-600">Your payment could not be confirmed. Please contact us if you believe this is an error.</p>
          <a href="/" className="btn-primary mt-6">Back to Home</a>
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
        <h1 className="text-2xl font-bold text-gray-900">Payment Successful!</h1>
        {details && (
          <p className="mt-2 text-gray-600">
            Booking <strong>{details.reference}</strong> — your deposit has been received.
          </p>
        )}
        <p className="mt-1 text-gray-600">We'll email you a confirmation shortly.</p>
        <a href="/" className="btn-primary mt-6">Back to Home</a>
      </div>
    </div>
  );
}
