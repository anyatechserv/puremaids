import React from 'react';
import { Shield, Award, Users, Clock, Leaf, CheckCircle } from 'lucide-react';

const stats = [
  { value: '10,000+', label: 'Happy Customers', sub: 'Across the UK' },
  { value: '4.9 ★', label: 'Google Rating', sub: '2,847 reviews' },
  { value: '99%', label: 'Satisfaction Rate', sub: 'Re-clean guarantee' },
  { value: '8 Years', label: 'Experience', sub: 'In the industry' },
];

const promises = [
  {
    icon: Shield,
    title: 'Fully Insured',
    body: 'Public liability cover up to £5M. Every visit, every cleaner, every time.',
    bg: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    icon: CheckCircle,
    title: 'DBS Checked',
    body: 'Every cleaner is background-verified through the official Disclosure & Barring Service.',
    bg: 'bg-accent-50',
    iconColor: 'text-accent-600',
  },
  {
    icon: Award,
    title: 'Satisfaction Guarantee',
    body: "Not happy? We return within 24 hours and re-clean completely free of charge.",
    bg: 'bg-amber-50',
    iconColor: 'text-amber-600',
  },
  {
    icon: Users,
    title: 'Dedicated Cleaner',
    body: 'You get the same trusted cleaner every visit — they learn your home inside out.',
    bg: 'bg-violet-50',
    iconColor: 'text-violet-600',
  },
  {
    icon: Clock,
    title: 'Flexible Scheduling',
    body: 'Mornings, evenings, weekdays, weekends — we fit around your life.',
    bg: 'bg-rose-50',
    iconColor: 'text-rose-600',
  },
  {
    icon: Leaf,
    title: 'Eco-Friendly',
    body: 'Non-toxic, biodegradable products — safe for children, pets, and the planet.',
    bg: 'bg-teal-50',
    iconColor: 'text-teal-600',
  },
];

export default function TrustSection() {
  return (
    <section className="bg-secondary-800 py-24">
      <div className="mx-auto max-w-7xl px-4">

        {/* Stats */}
        <div className="mb-20 grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="group relative overflow-hidden rounded-2xl border border-secondary-700 bg-secondary-700/50 px-6 py-8 text-center transition-all duration-300 hover:bg-secondary-700 hover:border-secondary-600"
            >
              <div className="font-heading mb-1 text-4xl font-extrabold leading-none text-primary-400 md:text-5xl">
                {s.value}
              </div>
              <div className="text-sm font-semibold text-white">{s.label}</div>
              <div className="mt-0.5 text-xs text-secondary-400">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="mb-14 text-center">
          <span className="mb-3 inline-block text-sm font-bold uppercase tracking-widest text-primary-400">
            Why Choose Us
          </span>
          <h2 className="font-heading text-4xl font-extrabold leading-tight text-white md:text-5xl mb-4">
            The PureMaids Promise
          </h2>
          <p className="mx-auto max-w-lg text-base leading-relaxed text-secondary-300">
            We&apos;re not just a cleaning company. We&apos;re your trusted home care partner — committed to quality on every visit.
          </p>
        </div>

        {/* Promise cards */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {promises.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                className="group rounded-2xl border border-secondary-700/60 bg-secondary-700/40 p-7 transition-all duration-300 hover:-translate-y-1 hover:bg-secondary-700 hover:border-secondary-600"
              >
                <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${p.bg} transition-transform duration-300 group-hover:scale-110`}>
                  <Icon className={`h-5 w-5 ${p.iconColor}`} />
                </div>
                <h3 className="font-heading mb-2 text-lg font-bold text-white">{p.title}</h3>
                <p className="text-sm leading-relaxed text-secondary-300">{p.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
