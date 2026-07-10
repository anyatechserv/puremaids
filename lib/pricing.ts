import { DEPOSIT_PERCENTAGE, SERVICE_PRICES_PENCE, EXTRA_PRICES_PENCE } from './constants';

export interface PriceBreakdown {
  basePricePence: number;
  extrasPricePence: number;
  totalPricePence: number;
  depositPence: number;
  balancePence: number;
}

export function calculatePrice(
  serviceType: string,
  extras: string[] = [],
): PriceBreakdown {
  const service = SERVICE_PRICES_PENCE[serviceType];
  const basePricePence = service?.base ?? 5900;

  const extrasPricePence = extras.reduce((sum, key) => {
    return sum + (EXTRA_PRICES_PENCE[key] ?? 0);
  }, 0);

  const totalPricePence = basePricePence + extrasPricePence;
  const depositPence = Math.round(totalPricePence * (DEPOSIT_PERCENTAGE / 100));
  const balancePence = totalPricePence - depositPence;

  return { basePricePence, extrasPricePence, totalPricePence, depositPence, balancePence };
}

export function formatGBP(pence: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(pence / 100);
}
