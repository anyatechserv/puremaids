import type { Metadata } from 'next';
import HeroSection from '@/components/home/hero-section';
import ServicesSection from '@/components/home/services-section';
import HowItWorksSection from '@/components/home/how-it-works-section';
import PricingPreviewSection from '@/components/home/pricing-preview-section';
import TrustSection from '@/components/home/trust-section';
import TestimonialsSection from '@/components/home/testimonials-section';
import BeforeAfterSection from '@/components/home/before-after-section';
import AreasSection from '@/components/home/areas-section';
import FaqSection from '@/components/home/faq-section';
import CtaBannerSection from '@/components/home/cta-banner-section';

export const metadata: Metadata = {
  title: 'PureMaids | Professional House Cleaning Across the UK',
  description:
    'Professional house cleaning services across the UK. Fully insured, DBS-checked cleaners. Domestic, deep, end of tenancy and office cleaning. Get a free instant quote today.',
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <HowItWorksSection />
      <PricingPreviewSection />
      <TrustSection />
      <TestimonialsSection />
      <BeforeAfterSection />
      <AreasSection />
      <FaqSection />
      <CtaBannerSection />
    </>
  );
}
