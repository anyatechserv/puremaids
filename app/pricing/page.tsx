import type { Metadata } from 'next';
import PricingCalculator from './pricing-calculator';

export const metadata: Metadata = {
  title: 'Cleaning Prices London | Instant Quote Calculator | PureMaids',
  description:
    'Transparent, fixed pricing for all PureMaids cleaning services. Use our instant quote calculator. No hidden fees, no surprises. Domestic from £59.',
};

export default function PricingPage() {
  return <PricingCalculator />;
}
