import React from 'react';
import Link from 'next/link';
import { ClipboardList, UserCheck, Sparkles, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const steps = [
  {
    step: 1,
    icon: ClipboardList,
    title: 'Get Your Quote',
    description: 'Use our instant calculator or call us. Fixed, transparent prices — no hidden fees, ever.',
    color: 'bg-primary-500',
    lightColor: 'bg-primary-50',
    textColor: 'text-primary-600',
  },
  {
    step: 2,
    icon: UserCheck,
    title: 'We Match You',
    description: 'We assign a vetted, experienced local cleaner suited to your home and schedule.',
    color: 'bg-accent-500',
    lightColor: 'bg-accent-50',
    textColor: 'text-accent-600',
  },
  {
    step: 3,
    icon: Sparkles,
    title: 'We Clean',
    description: 'Your cleaner arrives on time with everything needed and transforms your space.',
    color: 'bg-amber-500',
    lightColor: 'bg-amber-50',
    textColor: 'text-amber-600',
  },
  {
    step: 4,
    icon: ThumbsUp,
    title: 'You Enjoy',
    description: 'Come home to perfection. Rate your clean and rebook with a single tap.',
    color: 'bg-violet-500',
    lightColor: 'bg-violet-50',
    textColor: 'text-violet-600',
  },
];

export default function HowItWorksSection() {
  return (
    <section className="py-24 bg-secondary-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <span className="inline-block text-primary-500 font-semibold text-sm uppercase tracking-widest mb-3">Simple Process</span>
          <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-secondary-800 leading-tight mb-4">
            Spotless in 4 Easy Steps
          </h2>
          <p className="text-secondary-500 max-w-lg mx-auto text-base leading-relaxed">
            Getting a professionally cleaned home has never been simpler. Book online in minutes, relax all day.
          </p>
        </div>

        <div className="relative">
          {/* Desktop connector */}
          <div className="absolute top-[52px] left-[calc(12.5%+2rem)] right-[calc(12.5%+2rem)] h-px bg-gradient-to-r from-primary-200 via-accent-200 to-violet-200 hidden lg:block pointer-events-none" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.step} className="relative group">
                  <div className="flex flex-col items-center text-center bg-white rounded-2xl p-7 shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1.5 border border-secondary-100">
                    {/* Step number + icon */}
                    <div className="relative mb-5">
                      <div className={`w-16 h-16 ${step.lightColor} rounded-2xl flex items-center justify-center mb-0 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className={`w-7 h-7 ${step.textColor}`} />
                      </div>
                      <div className={`absolute -top-2 -right-2 w-6 h-6 ${step.color} rounded-full flex items-center justify-center text-white font-bold text-xs shadow-sm`}>
                        {step.step}
                      </div>
                    </div>
                    <h3 className="font-heading font-bold text-secondary-800 text-lg mb-2">{step.title}</h3>
                    <p className="text-secondary-500 text-sm leading-relaxed">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="text-center mt-12">
          <Link href="/book-online">
            <Button size="xl">
              Book Your Clean Now
              <Sparkles className="w-4 h-4" />
            </Button>
          </Link>
          <p className="text-secondary-400 text-sm mt-3">Takes less than 2 minutes. No credit card required.</p>
        </div>
      </div>
    </section>
  );
}
