'use client';

import React from 'react';
import { CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const STEPS = [
  { n: 1, label: 'Service' },
  { n: 2, label: 'Postcode' },
  { n: 3, label: 'Property' },
  { n: 4, label: 'Schedule' },
  { n: 5, label: 'Extras' },
  { n: 6, label: 'Details' },
  { n: 7, label: 'Confirm' },
];

export default function BookingProgress({ current }: { current: number }) {
  return (
    <div className="w-full overflow-x-auto pb-1">
      <div className="flex items-center min-w-max mx-auto px-4">
        {STEPS.map((step, i) => (
          <React.Fragment key={step.n}>
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ring-2',
                  current > step.n
                    ? 'bg-primary-500 text-white ring-primary-100'
                    : current === step.n
                    ? 'bg-primary-500 text-white ring-primary-200 ring-offset-2'
                    : 'bg-white text-secondary-400 ring-secondary-200',
                )}
              >
                {current > step.n ? <CheckCircle className="w-4 h-4" /> : step.n}
              </div>
              <span
                className={cn(
                  'text-[10px] font-semibold whitespace-nowrap',
                  current >= step.n ? 'text-primary-600' : 'text-secondary-400',
                )}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  'h-0.5 w-8 mx-1 mt-[-14px] transition-all duration-300',
                  current > step.n ? 'bg-primary-400' : 'bg-secondary-200',
                )}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
