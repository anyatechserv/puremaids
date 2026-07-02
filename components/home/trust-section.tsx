import React from 'react';
import { Shield, Award, Users, Clock, Leaf, ThumbsUp, CheckCircle, Phone } from 'lucide-react';

const trustItems = [
  {
    icon: Shield,
    title: 'Fully Insured',
    description: 'Comprehensive public liability insurance up to £5 million for your complete peace of mind.',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: CheckCircle,
    title: 'DBS Checked',
    description: 'Every cleaner is background checked and verified through the Disclosure and Barring Service.',
    color: 'bg-green-50 text-green-600',
  },
  {
    icon: Award,
    title: 'Quality Guarantee',
    description: '100% satisfaction guarantee. If you\'re not happy, we\'ll come back and re-clean for free.',
    color: 'bg-amber-50 text-amber-600',
  },
  {
    icon: Users,
    title: '10,000+ Customers',
    description: 'Trusted by thousands of London households and businesses since 2015.',
    color: 'bg-purple-50 text-purple-600',
  },
  {
    icon: Clock,
    title: 'Flexible Scheduling',
    description: 'Book at a time that suits you — weekdays, weekends, or even same-day appointments.',
    color: 'bg-rose-50 text-rose-600',
  },
  {
    icon: Leaf,
    title: 'Eco-Friendly',
    description: 'We use only environmentally friendly, non-toxic cleaning products safe for families and pets.',
    color: 'bg-teal-50 text-teal-600',
  },
];

const stats = [
  { value: '10K+', label: 'Happy Customers' },
  { value: '4.9/5', label: 'Average Rating' },
  { value: '99%', label: 'Satisfaction Rate' },
  { value: '8+', label: 'Years Experience' },
];

export default function TrustSection() {
  return (
    <section className="py-20 bg-secondary-800">
      {/* Stats bar */}
      <div className="container mx-auto px-4 max-w-7xl mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-heading font-bold text-4xl md:text-5xl text-primary-400 mb-1">
                {stat.value}
              </div>
              <div className="text-secondary-300 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <span className="text-primary-400 font-semibold text-sm uppercase tracking-widest">Why Choose Us</span>
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-white mt-2 mb-3">
            The PureMaids Promise
          </h2>
          <p className="text-secondary-300 max-w-xl mx-auto leading-relaxed">
            We&apos;re not just another cleaning company. We&apos;re your trusted home care partner.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {trustItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="bg-secondary-700 rounded-2xl p-6 hover:bg-secondary-600 transition-colors duration-300"
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${item.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-semibold text-white text-lg mb-2">{item.title}</h3>
                <p className="text-secondary-300 text-sm leading-relaxed">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
