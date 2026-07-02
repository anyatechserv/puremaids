import React from 'react';
import { Shield, Award, Users, Clock, Leaf, CheckCircle } from 'lucide-react';

const stats = [
  { value: '10K+', label: 'Happy Customers', sub: 'Across the UK' },
  { value: '4.9', label: 'Average Rating', sub: 'Google Reviews' },
  { value: '99%', label: 'Satisfaction Rate', sub: 'Re-clean guarantee' },
  { value: '8+', label: 'Years Experience', sub: 'In the industry' },
];

const trustItems = [
  {
    icon: Shield,
    title: 'Fully Insured',
    description: 'Comprehensive public liability cover up to £5 million. Every visit, every time.',
    gradient: 'from-blue-500 to-primary-500',
    bg: 'bg-blue-50',
    text: 'text-blue-600',
  },
  {
    icon: CheckCircle,
    title: 'DBS Checked',
    description: 'All cleaners are background-verified through the official Disclosure & Barring Service.',
    gradient: 'from-accent-500 to-teal-500',
    bg: 'bg-accent-50',
    text: 'text-accent-600',
  },
  {
    icon: Award,
    title: 'Satisfaction Guarantee',
    description: "Not happy? We'll return within 24 hours and re-clean completely free of charge.",
    gradient: 'from-amber-500 to-orange-500',
    bg: 'bg-amber-50',
    text: 'text-amber-600',
  },
  {
    icon: Users,
    title: 'Dedicated Cleaner',
    description: 'You get the same trusted cleaner every visit — they learn your home and preferences.',
    gradient: 'from-violet-500 to-purple-500',
    bg: 'bg-violet-50',
    text: 'text-violet-600',
  },
  {
    icon: Clock,
    title: 'Flexible Scheduling',
    description: 'Morning, afternoon, evening — weekdays or weekends. We fit around your life.',
    gradient: 'from-rose-500 to-pink-500',
    bg: 'bg-rose-50',
    text: 'text-rose-600',
  },
  {
    icon: Leaf,
    title: 'Eco-Friendly',
    description: 'We use only non-toxic, biodegradable products — safe for children, pets, and the planet.',
    gradient: 'from-teal-500 to-accent-500',
    bg: 'bg-teal-50',
    text: 'text-teal-600',
  },
];

export default function TrustSection() {
  return (
    <section className="py-24 bg-secondary-800 overflow-hidden">
      {/* Stats row */}
      <div className="container mx-auto px-4 max-w-7xl mb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="relative bg-secondary-700/60 border border-secondary-600/50 rounded-2xl px-6 py-8 text-center overflow-hidden group hover:bg-secondary-700 transition-colors duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <div className="font-heading font-bold text-4xl md:text-5xl text-primary-400 mb-1 leading-none">
                  {stat.value}
                </div>
                <div className="font-semibold text-white text-sm mb-0.5">{stat.label}</div>
                <div className="text-secondary-400 text-xs">{stat.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Why PureMaids */}
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-14">
          <span className="inline-block text-primary-400 font-semibold text-sm uppercase tracking-widest mb-3">Why Choose Us</span>
          <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-white leading-tight mb-4">
            The PureMaids Promise
          </h2>
          <p className="text-secondary-300 max-w-lg mx-auto text-base leading-relaxed">
            We&apos;re not just a cleaning company. We&apos;re your trusted home care partner — committed to quality in every visit.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {trustItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="group bg-secondary-700/50 hover:bg-secondary-700 border border-secondary-600/40 hover:border-secondary-500/60 rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-12 h-12 ${item.bg} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-5.5 h-5.5 ${item.text} w-[22px] h-[22px]`} />
                </div>
                <h3 className="font-heading font-bold text-white text-lg mb-2">{item.title}</h3>
                <p className="text-secondary-300 text-sm leading-relaxed">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
