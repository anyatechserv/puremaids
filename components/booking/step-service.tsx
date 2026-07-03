'use client';

import React from 'react';
import { Home, Sparkles, Key, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SERVICES, type ServiceType } from '@/lib/booking';
import { cn } from '@/lib/utils';

const ICONS = { Home, Sparkles, Key, Building2 };

interface Props {
  value: ServiceType | '';
  onChange: (v: ServiceType) => void;
  onNext: () => void;
}

export default function StepService({ value, onChange, onNext }: Props) {
  return (
    <div className="p-8">
      <p className="text-xs font-bold uppercase tracking-widest text-primary-500 mb-2">Step 1 of 7</p>
      <h2 className="font-heading font-bold text-2xl text-secondary-800 mb-1">What service do you need?</h2>
      <p className="text-secondary-500 text-sm mb-7">Select the type of cleaning that suits you best.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        {SERVICES.map((svc) => {
          const Icon = ICONS[svc.icon as keyof typeof ICONS];
          const selected = value === svc.key;
          return (
            <button
              key={svc.key}
              type="button"
              onClick={() => onChange(svc.key)}
              className={cn(
                'group relative flex items-start gap-4 p-5 rounded-2xl border-2 text-left transition-all duration-200',
                selected
                  ? 'border-primary-500 bg-primary-50 shadow-[0_0_0_4px_rgba(0,174,239,0.08)]'
                  : 'border-secondary-100 hover:border-secondary-200 bg-white',
              )}
            >
              <div
                className={cn(
                  'w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-200',
                  selected ? 'bg-primary-500' : 'bg-secondary-100 group-hover:bg-secondary-200',
                )}
              >
                <Icon className={cn('w-5 h-5', selected ? 'text-white' : 'text-secondary-500')} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={cn('font-semibold text-sm', selected ? 'text-primary-700' : 'text-secondary-700')}>
                  {svc.label}
                </p>
                <p className="text-secondary-400 text-xs mt-0.5 leading-snug">{svc.tagline}</p>
                <p
                  className="text-xs font-bold mt-1.5"
                  style={{ color: svc.color }}
                >
                  From {svc.from}
                </p>
              </div>
              {selected && (
                <div className="absolute top-3 right-3 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                  <svg viewBox="0 0 12 12" className="w-3 h-3 text-white" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>

      <Button size="lg" className="w-full" onClick={onNext} disabled={!value}>
        Continue
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
      </Button>
    </div>
  );
}
