import React from 'react';
import type { Metadata } from 'next';
import { Users, Award, Heart, Leaf, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'About PureMaids | London\'s Trusted Cleaning Company',
  description:
    'Learn about PureMaids — London\'s trusted professional cleaning company. Our story, values, and the team behind every spotless home.',
};

const values = [
  {
    icon: Heart,
    title: 'Care in Every Detail',
    description: 'We treat every home like our own. Our cleaners take pride in their work and go the extra mile every single visit.',
  },
  {
    icon: Award,
    title: 'Consistent Quality',
    description: 'Same high standard every time. Our rigorous training and quality checks ensure you receive a perfect clean, guaranteed.',
  },
  {
    icon: Users,
    title: 'People First',
    description: 'Our cleaners are our greatest asset. We pay fairly, treat them with respect, and invest in their development.',
  },
  {
    icon: Leaf,
    title: 'Sustainability',
    description: 'We only use eco-friendly, biodegradable cleaning products that are safe for your family, pets, and the planet.',
  },
];

const team = [
  {
    name: 'Sophie Clarke',
    role: 'Founder & CEO',
    image: 'https://images.pexels.com/photos/3796217/pexels-photo-3796217.jpeg',
    bio: 'Former hospitality manager with 15 years experience. Founded PureMaids in 2015 with a mission to raise the bar in domestic cleaning.',
  },
  {
    name: 'James Okafor',
    role: 'Head of Operations',
    image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
    bio: 'Responsible for scheduling, training and quality assurance. Ensures every customer receives a consistently excellent service.',
  },
  {
    name: 'Amelia Patel',
    role: 'Customer Experience Lead',
    image: 'https://images.pexels.com/photos/3796024/pexels-photo-3796024.jpeg',
    bio: 'Dedicated to making every customer interaction seamless and delightful, from booking to post-clean feedback.',
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-secondary-800 to-secondary-700 py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="max-w-3xl">
            <h1 className="font-heading font-bold text-4xl md:text-5xl text-white mb-5 leading-tight">
              About PureMaids
            </h1>
            <p className="text-secondary-200 text-lg leading-relaxed">
              We started PureMaids in 2015 with a simple idea: London deserves a cleaning company 
              that genuinely cares about quality, reliability, and people. Eight years and 10,000+ 
              customers later, that mission hasn&apos;t changed.
            </p>
          </div>
        </div>
      </section>

      {/* Our story */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-primary-500 font-semibold text-sm uppercase tracking-widest">Our Story</span>
              <h2 className="font-heading font-bold text-3xl text-secondary-800 mt-2 mb-5">
                Built on Trust, Delivered with Care
              </h2>
              <div className="space-y-4 text-secondary-600 leading-relaxed">
                <p>
                  PureMaids was founded in Chelsea in 2015 by Sophie Clarke, a former hospitality 
                  manager who was frustrated by the inconsistency of cleaning services available in London. 
                  She wanted a service she could trust — one that sent the same cleaner every time, 
                  communicated clearly, and stood behind its work.
                </p>
                <p>
                  What started as a small team of five cleaners serving Chelsea and Kensington has grown 
                  into one of London&apos;s most trusted cleaning companies, with over 200 vetted professionals 
                  serving customers across 30+ London areas.
                </p>
                <p>
                  Our growth has always been driven by word of mouth — customers who love our service 
                  tell their friends and neighbours. That&apos;s the greatest validation of what we do.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/4108741/pexels-photo-4108741.jpeg"
                alt="Professional PureMaids cleaner"
                className="rounded-2xl w-full h-80 object-cover shadow-large"
              />
              <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl p-5 shadow-medium">
                <div className="font-heading font-bold text-3xl text-primary-500">8+</div>
                <div className="text-secondary-600 text-sm">Years in London</div>
              </div>
              <div className="absolute -top-5 -right-5 bg-primary-500 rounded-2xl p-5 shadow-medium">
                <div className="font-heading font-bold text-3xl text-white">10K+</div>
                <div className="text-primary-100 text-sm">Happy Customers</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-secondary-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-10">
            <span className="text-primary-500 font-semibold text-sm uppercase tracking-widest">Our Values</span>
            <h2 className="font-heading font-bold text-3xl text-secondary-800 mt-2">What We Stand For</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon: Icon, title, description }) => (
              <div key={title} className="bg-white rounded-2xl p-6 shadow-soft text-center hover:shadow-medium transition-shadow">
                <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-primary-500" />
                </div>
                <h3 className="font-heading font-semibold text-secondary-800 text-lg mb-2">{title}</h3>
                <p className="text-secondary-500 text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-10">
            <span className="text-primary-500 font-semibold text-sm uppercase tracking-widest">Meet the Team</span>
            <h2 className="font-heading font-bold text-3xl text-secondary-800 mt-2">The People Behind PureMaids</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7 max-w-4xl mx-auto">
            {team.map((member) => (
              <div key={member.name} className="text-center">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-28 h-28 rounded-full mx-auto mb-4 object-cover shadow-medium"
                />
                <h3 className="font-heading font-semibold text-secondary-800 text-lg">{member.name}</h3>
                <p className="text-primary-600 font-medium text-sm mb-2">{member.role}</p>
                <p className="text-secondary-500 text-sm leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Accreditations */}
      <section className="py-14 bg-secondary-50 border-t border-secondary-100">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-8">
            <h2 className="font-heading font-semibold text-2xl text-secondary-800">Accreditations & Commitments</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              'Fully Insured (£5M PLI)',
              'DBS Checked Staff',
              'GDPR Compliant',
              'Eco-Friendly Products',
              'Living Wage Employer',
              'ISO 9001 Quality',
              'COSHH Compliant',
              'Member: NCCA',
            ].map((item) => (
              <div key={item} className="bg-white rounded-xl p-4 text-center shadow-soft flex items-center gap-2 justify-center">
                <CheckCircle className="w-4 h-4 text-accent-500 flex-shrink-0" />
                <span className="text-secondary-700 text-sm font-medium">{item}</span>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/book-online">
              <Button size="xl">Book Your Clean Today</Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
