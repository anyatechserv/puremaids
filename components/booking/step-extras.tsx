'use client';

import React from 'react';
import { Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EXTRAS, formatPrice, calcBasePrice, type ServiceType, type PropertySize, type Frequency } from '@/lib/booking';
import { cn } from '@/lib/utils';

interface Props {
  selected: string[];
  service: ServiceType | '';
  propertySize: PropertySize | '';
  frequency: Frequency;
  onToggle: (key: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function StepExtras({ selected, service, propertySize, frequency, onToggle, onNext, onBack }: Props) {
  const basePrice = calcBasePrice(service, propertySize, frequency);
  const extrasTotal = EXTRAS.filter((e) => selected.includes(e.key)).reduce((sum, e) => sum + e.pricePence, 0);
  const total = basePrice + extrasTotal;

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

      <p className="text-xs font-bold uppercase tracking-widest text-primary-500 mb-2">Step 5 of 7</p>
      <h2 className="font-heading font-bold text-2xl text-secondary-800 mb-1">Add extras</h2>
      <p className="text-secondary-500 text-sm mb-7">Boost your clean with optional add-ons — all at fixed prices.</p>

      <div className="space-y-2.5 mb-7">
        {EXTRAS.map((extra) => {
          const on = selected.includes(extra.key);
          return (
            <button
              key={extra.key}
              type="button"
              onClick={() => onToggle(extra.key)}
              className={cn(
                'w-full flex items-center gap-4 px-5 py-4 rounded-2xl border-2 text-left transition-all duration-150',
                on
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-secondary-100 bg-white hover:border-secondary-200',
              )}
            >
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors',
                on ? 'bg-primary-500' : 'bg-secondary-100',
              )}>
                {on
                  ? <Minus className="w-4 h-4 text-white" />
                  : <Plus className="w-4 h-4 text-secondary-500" />}
              </div>
              <span className={cn('flex-1 text-sm font-medium', on ? 'text-primary-700' : 'text-secondary-600')}>
                {extra.label}
              </span>
              <span className={cn('text-sm font-bold shrink-0', on ? 'text-primary-600' : 'text-secondary-500')}>
                +{formatPrice(extra.pricePence)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Running total */}
      <div className="bg-secondary-50 border border-secondary-100 rounded-2xl p-5 mb-6 space-y-2.5">
        <div className="flex justify-between text-sm text-secondary-500">
          <span>Base price</span>
          <span className="font-semibold text-secondary-700">{formatPrice(basePrice)}</span>
        </div>
        {EXTRAS.filter((e) => selected.includes(e.key)).map((e) => (
          <div key={e.key} className="flex justify-between text-sm text-secondary-500">
            <span>{e.label}</span>
            <span className="font-semibold text-secondary-700">+{formatPrice(e.pricePence)}</span>
          </div>
        ))}
        <div className="border-t border-secondary-200 pt-2.5 flex justify-between">
          <span className="font-bold text-secondary-800">Total</span>
          <span className="font-heading font-extrabold text-primary-600 text-xl leading-none">{formatPrice(total)}</span>
        </div>
        <p className="text-xs text-secondary-400 text-right">inc. VAT · final price confirmed before payment</p>
      </div>

      <Button size="lg" className="w-full" onClick={onNext}>
        Continue to Your Details
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
      </Button>
      <button
        type="button"
        onClick={onNext}
        className="w-full mt-2 text-sm text-secondary-400 hover:text-secondary-600 py-2 transition-colors"
      >
        Skip extras
      </button>
    </div>
  );
}
