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
  title: 'House Cleaning Bolton & Greater Manchester | From £59 | PureMaids',
  description:
    'Professional house cleaning in Bolton, Manchester, Bury, Wigan and Preston. Fully insured, DBS-checked cleaners from £59. Domestic, deep, end of tenancy and office cleaning. Instant online quote — book today.',
  alternates: { canonical: 'https://puremaids.co.uk' },
  openGraph: {
    title: 'House Cleaning Bolton & Greater Manchester | From £59 | PureMaids',
    description:
      'Professional house cleaning in Bolton, Manchester, Bury, Wigan and Preston. Fully insured, DBS-checked cleaners from £59. Book online for an instant quote.',
  },
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
