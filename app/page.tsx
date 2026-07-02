import type { Metadata } from 'next';
import HeroSection from '@/components/home/hero-section';
import ServicesSection from '@/components/home/services-section';
import TrustSection from '@/components/home/trust-section';
import TestimonialsSection from '@/components/home/testimonials-section';
import HowItWorksSection from '@/components/home/how-it-works-section';
import BeforeAfterSection from '@/components/home/before-after-section';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'PureMaids | Professional Cleaning Services London',
  description:
    'PureMaids offers professional domestic, deep, end of tenancy and office cleaning across London. Fully insured, DBS-checked cleaners. Get a free instant quote today.',
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <HowItWorksSection />
      <TrustSection />
      <BeforeAfterSection />
      <TestimonialsSection />
    </>
  );
}
