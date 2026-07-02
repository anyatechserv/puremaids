import React from 'react';
import Link from 'next/link';
import { ClipboardList, UserCheck, Sparkles, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const steps = [
  {
    n: '01',
    icon: ClipboardList,
    title: 'Get Your Quote',
    body: 'Use our instant calculator or call us. Fixed prices, zero hidden fees — always.',
    iconBg: 'bg-primary-50',
    iconColor: 'text-primary-600',
    numColor: 'text-primary-400',
  },
  {
    n: '02',
    icon: UserCheck,
    title: 'We Match You',
    body: 'We assign a vetted, experienced local cleaner perfectly suited to your home.',
    iconBg: 'bg-accent-50',
    iconColor: 'text-accent-600',
    numColor: 'text-accent-400',
  },
  {
    n: '03',
    icon: Sparkles,
    title: 'We Clean',
    body: 'Your cleaner arrives on time, fully equipped, and transforms your space.',
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
    numColor: 'text-amber-400',
  },
  {
    n: '04',
    icon: ThumbsUp,
    title: 'You Enjoy',
    body: 'Come home to a spotless space. Rate your clean and rebook in one tap.',
    iconBg: 'bg-violet-50',
    iconColor: 'text-violet-600',
    numColor: 'text-violet-400',
  },
];

export default function HowItWorksSection() {
  return (
    <section className="bg-secondary-50 py-24">
      <div className="mx-auto max-w-7xl px-4">

        <div className="mb-16 text-center">
          <span className="mb-3 inline-block text-sm font-bold uppercase tracking-widest text-primary-500">
            Simple Process
          </span>
          <h2 className="font-heading text-4xl font-extrabold leading-tight text-secondary-800 md:text-5xl mb-4">
            Spotless in 4 Easy Steps
          </h2>
          <p className="mx-auto max-w-lg text-base leading-relaxed text-secondary-500">
            From booking to a gleaming home in minutes. No fuss, no faff — just a brilliant clean.
          </p>
        </div>

        {/* Steps */}
        <div className="relative grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* Connector line — desktop only */}
          <div className="pointer-events-none absolute left-[calc(12.5%+2.5rem)] right-[calc(12.5%+2.5rem)] top-12 hidden h-px bg-gradient-to-r from-primary-200 via-accent-200 via-amber-200 to-violet-200 lg:block" />

          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.n} className="group relative">
                <div className="flex h-full flex-col items-center rounded-2xl border border-secondary-100 bg-white p-7 text-center shadow-soft transition-all duration-300 hover:-translate-y-2 hover:shadow-medium">
                  {/* Large background number */}
                  <div className={`mb-1 font-heading text-6xl font-extrabold leading-none select-none ${step.numColor} opacity-10`}>
                    {step.n}
                  </div>
                  {/* Icon box — overlaps the number visually */}
                  <div className={`-mt-8 mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${step.iconBg} transition-transform duration-300 group-hover:scale-110 shadow-soft`}>
                    <Icon className={`h-6 w-6 ${step.iconColor}`} />
                  </div>
                  <h3 className="font-heading mb-2 text-lg font-bold text-secondary-800">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-secondary-500">{step.body}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Link href="/book-online">
            <Button size="xl">
              Book Your Clean Now
              <Sparkles className="h-4 w-4" />
            </Button>
          </Link>
          <p className="mt-3 text-sm text-secondary-400">Takes less than 2 minutes · No credit card required</p>
        </div>
      </div>
    </section>
  );
}
