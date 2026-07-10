'use client';

import { useState } from 'react';
import { calculatePrice, formatGBP } from '@/lib/pricing';
import { createBookingCheckoutSession, redirectToCheckout } from '@/lib/stripe-api';
import { DEPOSIT_PERCENTAGE } from '@/lib/constants';

interface Props {
  bookingId: string;
  bookingReference: string;
  serviceType: string;
  extras: string[];
  customerEmail: string;
  customerName: string;
  onSuccess?: () => void;
}

export default function CheckoutButton({
  bookingId,
  bookingReference,
  serviceType,
  extras,
  customerEmail,
  customerName,
  onSuccess,
}: Props) {
  const [loading, setLoading] = useState<'deposit' | 'full' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const pricing = calculatePrice(serviceType, extras);

  async function handleCheckout(paymentType: 'deposit' | 'full') {
    setLoading(paymentType);
    setError(null);

    try {
      const result = await createBookingCheckoutSession({
        bookingId,
        bookingReference,
        serviceType,
        serviceLabel: '',
        totalPricePence: pricing.totalPricePence,
        depositPence: pricing.depositPence,
        extras: extras.map((key) => ({
          name: key.replace(/_/g, ' '),
          pricePence: 0,
        })),
        customerEmail,
        customerName,
        paymentType,
      });

      if (result?.url) {
        redirectToCheckout(result.url);
        onSuccess?.();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout failed');
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="space-y-3">
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="rounded-lg bg-gray-50 p-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Total</span>
          <span className="font-semibold">{formatGBP(pricing.totalPricePence)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">{DEPOSIT_PERCENTAGE}% deposit</span>
          <span className="font-semibold">{formatGBP(pricing.depositPence)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Balance on completion</span>
          <span className="font-semibold">{formatGBP(pricing.balancePence)}</span>
        </div>
      </div>

      <button
        onClick={() => handleCheckout('deposit')}
        disabled={loading !== null}
        className="btn-primary w-full"
      >
        {loading === 'deposit' ? 'Redirecting...' : `Pay ${DEPOSIT_PERCENTAGE}% Deposit (${formatGBP(pricing.depositPence)})`}
      </button>

      <button
        onClick={() => handleCheckout('full')}
        disabled={loading !== null}
        className="btn-secondary w-full"
      >
        {loading === 'full' ? 'Redirecting...' : `Pay Full Amount (${formatGBP(pricing.totalPricePence)})`}
      </button>

      <p className="text-center text-xs text-gray-500">
        Secure payment by card, Apple Pay, or Google Pay via Stripe
      </p>
    </div>
  );
}
