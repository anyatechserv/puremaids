'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  PROPERTY_SIZES,
  FREQUENCIES,
  calcBasePrice,
  formatPrice,
  type ServiceType,
  type PropertySize,
  type Frequency,
} from '@/lib/booking';
import { cn } from '@/lib/utils';

interface Props {
  service: ServiceType | '';
  propertySize: PropertySize | '';
  frequency: Frequency;
  onSizeChange: (v: PropertySize) => void;
  onFrequencyChange: (v: Frequency) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function StepProperty({
  service,
  propertySize,
  frequency,
  onSizeChange,
  onFrequencyChange,
  onNext,
  onBack,
}: Props) {
  const sizes = PROPERTY_SIZES.filter((s) => !service || s.forServices.includes(service as ServiceType));
  const price = calcBasePrice(service, propertySize, frequency);
  const isOffice = service === 'office';
  const isCustom = propertySize === 'large' && isOffice;
  const canContinue = !!propertySize;

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

      <p className="text-xs font-bold uppercase tracking-widest text-primary-500 mb-2">Step 3 of 7</p>
      <h2 className="font-heading font-bold text-2xl text-secondary-800 mb-1">
        {isOffice ? 'Office size' : 'Property size'}
      </h2>
      <p className="text-secondary-500 text-sm mb-6">This helps us calculate your accurate price.</p>

      {/* Size options */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-7">
        {sizes.map((s) => (
          <button
            key={s.key}
            type="button"
            onClick={() => onSizeChange(s.key)}
            className={cn(
              'relative p-3.5 rounded-xl border-2 text-sm font-medium text-left transition-all duration-150',
              propertySize === s.key
                ? 'border-primary-500 bg-primary-50 text-primary-700'
                : 'border-secondary-100 bg-white text-secondary-600 hover:border-secondary-200',
            )}
          >
            {propertySize === s.key && (
              <span className="absolute top-2 right-2 w-4 h-4 bg-primary-500 rounded-full flex items-center justify-center">
                <svg viewBox="0 0 10 10" className="w-2.5 h-2.5 text-white" fill="none">
                  <path d="M2 5l2 2 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            )}
            <span className="block leading-tight">{s.label}</span>
          </button>
        ))}
      </div>

      {/* Frequency — only for residential */}
      {!isOffice && (
        <>
          <h3 className="font-semibold text-secondary-700 text-sm mb-3">How often?</h3>
          <div className="grid grid-cols-2 gap-2.5 mb-7">
            {FREQUENCIES.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => onFrequencyChange(f.key)}
                className={cn(
                  'relative p-3.5 rounded-xl border-2 text-sm font-medium text-left transition-all duration-150',
                  frequency === f.key
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-secondary-100 bg-white text-secondary-600 hover:border-secondary-200',
                )}
              >
                <span className="block">{f.label}</span>
                {f.badge && (
                  <span className="mt-1 inline-block bg-accent-100 text-accent-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {f.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Live price preview */}
      {price > 0 && !isCustom && (
        <div className="flex items-center justify-between bg-primary-50 border border-primary-100 rounded-2xl px-5 py-4 mb-6">
          <div>
            <p className="text-xs font-semibold text-secondary-500 uppercase tracking-wider">Estimated price</p>
            <p className="font-heading font-extrabold text-3xl text-primary-600 leading-none mt-0.5">
              {formatPrice(price)}
            </p>
          </div>
          <p className="text-xs text-secondary-400 text-right max-w-[140px] leading-snug">
            Final price confirmed before payment · inc. VAT
          </p>
        </div>
      )}
      {isCustom && (
        <div className="bg-secondary-50 border border-secondary-100 rounded-2xl px-5 py-4 mb-6">
          <p className="font-semibold text-secondary-700 text-sm">Custom quote required</p>
          <p className="text-xs text-secondary-500 mt-0.5">We&apos;ll call you within 2 hours to confirm pricing for large offices.</p>
        </div>
      )}

      <Button size="lg" className="w-full" onClick={onNext} disabled={!canContinue}>
        Continue to Schedule
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
      </Button>
    </div>
  );
}
