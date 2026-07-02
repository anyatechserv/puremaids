import React from 'react';
import Link from 'next/link';
import { ClipboardList, UserCheck, Sparkles, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const steps = [
  {
    step: '01',
    icon: ClipboardList,
    title: 'Get Your Quote',
    description: 'Use our instant quote calculator or call us. Get a transparent, fixed price with no hidden fees.',
  },
  {
    step: '02',
    icon: UserCheck,
    title: 'We Match You',
    description: 'We assign a vetted, experienced cleaner from your local area who suits your requirements.',
  },
  {
    step: '03',
    icon: Sparkles,
    title: 'We Clean',
    description: 'Your cleaner arrives on time with all equipment needed and transforms your home.',
  },
  {
    step: '04',
    icon: ThumbsUp,
    title: 'You Enjoy',
    description: 'Come home to a spotless space. Rate your service and book your next clean with ease.',
  },
];

export default function HowItWorksSection() {
  return (
    <section className="py-20 bg-primary-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <span className="text-primary-500 font-semibold text-sm uppercase tracking-widest">Simple Process</span>
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-secondary-800 mt-2 mb-3">
            How It Works
          </h2>
          <p className="text-secondary-500 max-w-xl mx-auto leading-relaxed">
            Getting a spotless home has never been easier. Book in minutes, relax all day.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connector line (desktop) */}
          <div className="absolute top-12 left-[12.5%] right-[12.5%] h-0.5 bg-primary-200 hidden lg:block" />

          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.step} className="relative flex flex-col items-center text-center group">
                <div className="relative z-10 w-24 h-24 bg-white rounded-2xl shadow-medium flex items-center justify-center mb-5 group-hover:bg-primary-500 transition-colors duration-300">
                  <Icon className="w-9 h-9 text-primary-500 group-hover:text-white transition-colors duration-300" />
                  <div className="absolute -top-2 -right-2 w-7 h-7 bg-primary-500 rounded-full flex items-center justify-center group-hover:bg-secondary-700 transition-colors duration-300">
                    <span className="text-white font-bold text-xs">{step.step}</span>
                  </div>
                </div>
                <h3 className="font-heading font-semibold text-secondary-800 text-lg mb-2">{step.title}</h3>
                <p className="text-secondary-500 text-sm leading-relaxed">{step.description}</p>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link href="/book-online">
            <Button size="xl">
              Book Your Clean Now
            </Button>
          </Link>
          <p className="text-secondary-400 text-sm mt-3">Takes less than 2 minutes. No credit card needed.</p>
        </div>
      </div>
    </section>
  );
}
