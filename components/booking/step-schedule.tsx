'use client';

import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TIME_SLOTS } from '@/lib/booking';
import { cn } from '@/lib/utils';

interface Props {
  date: string;
  time: string;
  onDateChange: (v: string) => void;
  onTimeChange: (v: string) => void;
  onNext: () => void;
  onBack: () => void;
}

function todayMin() {
  const d = new Date();
  d.setDate(d.getDate() + 1); // min tomorrow
  return d.toISOString().split('T')[0];
}

function maxDate() {
  const d = new Date();
  d.setMonth(d.getMonth() + 6);
  return d.toISOString().split('T')[0];
}

export default function StepSchedule({ date, time, onDateChange, onTimeChange, onNext, onBack }: Props) {
  const canContinue = !!date && !!time;

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

      <p className="text-xs font-bold uppercase tracking-widest text-primary-500 mb-2">Step 4 of 7</p>
      <h2 className="font-heading font-bold text-2xl text-secondary-800 mb-1">When would you like us?</h2>
      <p className="text-secondary-500 text-sm mb-7">Choose your preferred date and arrival window.</p>

      {/* Date picker */}
      <div className="mb-6">
        <label className="block text-xs font-bold uppercase tracking-wider text-secondary-500 mb-2">
          Preferred Date
        </label>
        <div className="relative">
          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400 pointer-events-none" />
          <input
            type="date"
            value={date}
            min={todayMin()}
            max={maxDate()}
            onChange={(e) => onDateChange(e.target.value)}
            className={cn(
              'w-full h-12 pl-11 pr-4 rounded-xl border-2 text-sm font-medium text-secondary-700 transition-all focus:outline-none cursor-pointer',
              date
                ? 'border-primary-300 bg-primary-50 focus:border-primary-400'
                : 'border-secondary-200 bg-secondary-50 focus:border-primary-300',
            )}
          />
        </div>
        <p className="text-xs text-secondary-400 mt-1.5">Subject to cleaner availability — we&apos;ll confirm within 2 hours.</p>
      </div>

      {/* Time slot */}
      <div className="mb-7">
        <label className="block text-xs font-bold uppercase tracking-wider text-secondary-500 mb-3">
          Preferred Arrival Window
        </label>
        <div className="grid grid-cols-1 gap-2.5">
          {TIME_SLOTS.map((slot) => (
            <button
              key={slot.value}
              type="button"
              onClick={() => onTimeChange(slot.value)}
              className={cn(
                'flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all duration-150',
                time === slot.value
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-secondary-100 bg-white hover:border-secondary-200',
              )}
            >
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
                time === slot.value ? 'bg-primary-500' : 'bg-secondary-100',
              )}>
                <Clock className={cn('w-4 h-4', time === slot.value ? 'text-white' : 'text-secondary-400')} />
              </div>
              <span className={cn('text-sm font-medium', time === slot.value ? 'text-primary-700' : 'text-secondary-600')}>
                {slot.label}
              </span>
              {time === slot.value && (
                <div className="ml-auto w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                  <svg viewBox="0 0 10 10" className="w-3 h-3 text-white" fill="none">
                    <path d="M2 5l2 2 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      <Button size="lg" className="w-full" onClick={onNext} disabled={!canContinue}>
        Continue to Extras
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
      </Button>
    </div>
  );
}
