'use client';

import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  value: string;
  onChange: (v: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const UK_POSTCODE_RE = /^[A-Z]{1,2}[0-9][0-9A-Z]?\s?[0-9][A-Z]{2}$/i;

export default function StepPostcode({ value, onChange, onNext, onBack }: Props) {
  const [touched, setTouched] = useState(false);
  const valid = UK_POSTCODE_RE.test(value.trim());
  const showError = touched && value.length > 0 && !valid;

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

      <p className="text-xs font-bold uppercase tracking-widest text-primary-500 mb-2">Step 2 of 7</p>
      <h2 className="font-heading font-bold text-2xl text-secondary-800 mb-1">What&apos;s your postcode?</h2>
      <p className="text-secondary-500 text-sm mb-7">
        We&apos;ll confirm we cover your area and match you with a local cleaner.
      </p>

      <div className="mb-6">
        <div className="relative">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
          <input
            type="text"
            autoFocus
            value={value}
            onChange={(e) => onChange(e.target.value.toUpperCase())}
            onBlur={() => setTouched(true)}
            placeholder="e.g. SW1A 1AA"
            maxLength={8}
            className={`w-full h-14 pl-12 pr-4 rounded-2xl border-2 text-lg font-semibold text-secondary-800 placeholder:text-secondary-300 transition-all focus:outline-none focus:ring-0 ${
              showError
                ? 'border-red-300 bg-red-50 focus:border-red-400'
                : valid && value
                ? 'border-accent-400 bg-accent-50 focus:border-accent-500'
                : 'border-secondary-200 bg-secondary-50 focus:border-primary-400 focus:bg-white'
            }`}
          />
          {valid && value && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 bg-accent-500 rounded-full flex items-center justify-center">
              <svg viewBox="0 0 12 12" className="w-3.5 h-3.5 text-white" fill="none">
                <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          )}
        </div>
        {showError && (
          <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
            Please enter a valid UK postcode (e.g. SW1A 1AA)
          </p>
        )}
      </div>

      {/* Coverage note */}
      <div className="flex items-start gap-3 bg-secondary-50 rounded-2xl p-4 mb-7 text-sm text-secondary-600">
        <MapPin className="w-4 h-4 text-primary-500 shrink-0 mt-0.5" />
        <span>We currently cover <strong>London and surrounding areas</strong>. Can&apos;t find your area? Call us on <strong>0800 012 3456</strong>.</span>
      </div>

      <Button size="lg" className="w-full" onClick={onNext} disabled={!valid}>
        Confirm Postcode
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
      </Button>
    </div>
  );
}
