export type ServiceKey = keyof typeof import('./constants')['SERVICES'];
export type ExtraKey = keyof typeof import('./constants')['EXTRAS'];

export interface PriceBreakdown {
  basePence: number;
  extrasPence: number;
  totalPence: number;
  depositPence: number;
  balancePence: number;
}

export function calcPrice(serviceKey: string, extraKeys: string[] = []): PriceBreakdown {
  const SERVICES = (globalThis as any).__SERVICES;
  if (!SERVICES) throw new Error('Constants not loaded');
  const basePence = SERVICES[serviceKey]?.basePence ?? 0;
  const EXTRAS = (globalThis as any).__EXTRAS;
  const extrasPence = extraKeys.reduce((s, k) => s + (EXTRAS[k]?.pence ?? 0), 0);
  const totalPence = basePence + extrasPence;
  const depositPence = Math.round(totalPence * 20 / 100);
  return { basePence, extrasPence, totalPence, depositPence, balancePence: totalPence - depositPence };
}

export function formatGBP(pence: number): string {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(pence / 100);
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(d);
}
