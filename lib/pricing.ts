import { SERVICES, EXTRAS, DEPOSIT_PCT } from './constants';

export interface PriceBreakdown {
  basePence:    number;
  extrasPence:  number;
  totalPence:   number;
  depositPence: number;
  balancePence: number;
}

export function calcPrice(serviceKey: string, extraKeys: string[] = []): PriceBreakdown {
  const svc        = SERVICES[serviceKey as keyof typeof SERVICES];
  const basePence  = svc?.basePence ?? 5900;
  const extrasPence = extraKeys.reduce(
    (s, k) => s + (EXTRAS[k as keyof typeof EXTRAS]?.pence ?? 0), 0,
  );
  const totalPence   = basePence + extrasPence;
  const depositPence = Math.round(totalPence * DEPOSIT_PCT / 100);
  return { basePence, extrasPence, totalPence, depositPence, balancePence: totalPence - depositPence };
}

export function fmt(pence: number): string {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(pence / 100);
}

export function fmtDate(iso: string): string {
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso));
}
