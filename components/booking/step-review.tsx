'use client';

import React, { useState } from 'react';
import { Shield, CreditCard, Lock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  SERVICES,
  EXTRAS,
  FREQUENCIES,
  PROPERTY_SIZES,
  TIME_SLOTS,
  formatPrice,
  calcDeposit,
  type ServiceType,
  type PropertySize,
  type Frequency,
} from '@/lib/booking';

interface ReviewData {
  service: ServiceType | '';
  postcode: string;
  propertySize: PropertySize | '';
  frequency: Frequency;
  preferredDate: string;
  preferredTime: string;
  extras: string[];
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  specialInstructions: string;
  basePricePence: number;
  extrasPricePence: number;
}

interface Props {
  data: ReviewData;
  onConfirm: () => Promise<void>;
  onBack: () => void;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-2 py-2.5 border-b border-secondary-100 last:border-0">
      <span className="text-sm text-secondary-500 shrink-0">{label}</span>
      <span className="text-sm font-semibold text-secondary-700 text-right">{value}</span>
    </div>
  );
}

export default function StepReview({ data, onConfirm, onBack }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const svc = SERVICES.find((s) => s.key === data.service);
  const size = PROPERTY_SIZES.find((s) => s.key === data.propertySize);
  const freq = FREQUENCIES.find((f) => f.key === data.frequency);
  const timeSlot = TIME_SLOTS.find((t) => t.value === data.preferredTime);
  const selectedExtras = EXTRAS.filter((e) => data.extras.includes(e.key));
  const total = data.basePricePence + data.extrasPricePence;
  const deposit = calcDeposit(total);

  const handleConfirm = async () => {
    setError('');
    setLoading(true);
    try {
      await onConfirm();
    } catch (err: unknown) {
      setError('Something went wrong. Please try again or call us.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 text-secondary-400 hover:text-secondary-600 text-sm mb-5 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        Back
      </button>

      <p className="text-xs font-bold uppercase tracking-widest text-primary-500 mb-2">Step 7 of 7</p>
      <h2 className="font-heading font-bold text-2xl text-secondary-800 mb-1">Review & Confirm</h2>
      <p className="text-secondary-500 text-sm mb-7">Please check your booking details before confirming.</p>

      {error && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4 mb-5">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Service summary */}
      <div className="bg-secondary-50 rounded-2xl p-5 mb-4">
        <h3 className="font-semibold text-secondary-700 text-xs uppercase tracking-wider mb-3">Service Details</h3>
        <Row label="Service" value={svc?.label ?? ''} />
        <Row label="Property size" value={size?.label ?? ''} />
        {data.service !== 'office' && <Row label="Frequency" value={freq?.label ?? ''} />}
        <Row label="Date" value={data.preferredDate} />
        <Row label="Time" value={timeSlot?.label ?? data.preferredTime} />
        <Row label="Postcode" value={data.postcode} />
        <Row label="Address" value={data.address} />
        {data.specialInstructions && <Row label="Notes" value={data.specialInstructions} />}
      </div>

      {/* Contact summary */}
      <div className="bg-secondary-50 rounded-2xl p-5 mb-4">
        <h3 className="font-semibold text-secondary-700 text-xs uppercase tracking-wider mb-3">Your Details</h3>
        <Row label="Name" value={`${data.firstName} ${data.lastName}`} />
        <Row label="Email" value={data.email} />
        <Row label="Phone" value={data.phone} />
      </div>

      {/* Price summary */}
      <div className="bg-secondary-50 rounded-2xl p-5 mb-6">
        <h3 className="font-semibold text-secondary-700 text-xs uppercase tracking-wider mb-3">Price Summary</h3>
        <Row label="Base price" value={formatPrice(data.basePricePence)} />
        {selectedExtras.map((e) => (
          <Row key={e.key} label={e.label} value={`+${formatPrice(e.pricePence)}`} />
        ))}
        <div className="flex justify-between pt-2.5 mt-1 border-t border-secondary-200">
          <span className="font-bold text-secondary-800">Total</span>
          <span className="font-heading font-extrabold text-xl text-primary-600">{formatPrice(total)}</span>
        </div>
        <p className="text-xs text-secondary-400 text-right mt-1">inc. VAT</p>
      </div>

      {/* Deposit + Stripe notice */}
      <div className="bg-primary-50 border border-primary-100 rounded-2xl p-5 mb-6">
        <div className="flex items-start gap-3">
          <CreditCard className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-primary-700 text-sm mb-1">
              25% Deposit: {formatPrice(deposit)}
            </p>
            <p className="text-xs text-secondary-500 leading-relaxed">
              A refundable deposit secures your booking. The remaining {formatPrice(total - deposit)} is paid on the day of your clean. Secure payment powered by Stripe.
            </p>
          </div>
        </div>
      </div>

      {/* Stripe not yet configured notice */}
      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6">
        <Lock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-amber-700">Stripe payments coming soon</p>
          <p className="text-xs text-amber-600 mt-0.5">
            Your booking will be confirmed and stored. Our team will call you within 2 hours to take a deposit over the phone.
          </p>
        </div>
      </div>

      <Button size="lg" className="w-full" onClick={handleConfirm} disabled={loading}>
        {loading ? 'Confirming booking...' : 'Confirm Booking'}
        {!loading && <Shield className="w-4 h-4" />}
      </Button>
      <p className="text-xs text-secondary-400 text-center mt-3 flex items-center justify-center gap-1.5">
        <Lock className="w-3 h-3" />
        Your data is encrypted and never shared with third parties.
      </p>
    </div>
  );
}
