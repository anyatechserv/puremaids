// Shared types and pricing logic for the booking wizard

export type ServiceType = 'domestic' | 'deep' | 'end_of_tenancy' | 'office';
export type PropertySize = 'studio' | '2bed' | '3bed' | '4bed' | '5plus' | 'small' | 'medium' | 'large';
export type Frequency = 'one_off' | 'weekly' | 'fortnightly' | 'monthly';

export interface Extra {
  key: string;
  label: string;
  pricePence: number;
}

export interface BookingState {
  // Step 1
  service: ServiceType | '';
  // Step 2
  postcode: string;
  // Step 3
  propertySize: PropertySize | '';
  frequency: Frequency;
  // Step 4
  preferredDate: string;
  preferredTime: string;
  // Step 5
  extras: string[];
  // Step 6
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  specialInstructions: string;
  gdprConsent: boolean;
  // Computed
  basePricePence: number;
  extrasPricePence: number;
}

export const SERVICES = [
  {
    key: 'domestic' as ServiceType,
    label: 'Domestic Cleaning',
    tagline: 'Regular weekly or fortnightly',
    from: '£59',
    color: '#00AEEF',
    bg: 'bg-primary-50',
    border: 'border-primary-400',
    icon: 'Home',
  },
  {
    key: 'deep' as ServiceType,
    label: 'Deep Cleaning',
    tagline: 'Top-to-bottom thorough clean',
    from: '£129',
    color: '#10B981',
    bg: 'bg-accent-50',
    border: 'border-accent-400',
    icon: 'Sparkles',
  },
  {
    key: 'end_of_tenancy' as ServiceType,
    label: 'End of Tenancy',
    tagline: 'Deposit-back guaranteed',
    from: '£149',
    color: '#F59E0B',
    bg: 'bg-amber-50',
    border: 'border-amber-400',
    icon: 'Key',
  },
  {
    key: 'office' as ServiceType,
    label: 'Office Cleaning',
    tagline: 'Commercial & workplace',
    from: '£99',
    color: '#8B5CF6',
    bg: 'bg-violet-50',
    border: 'border-violet-400',
    icon: 'Building2',
  },
];

// Base prices in pence
const BASE_PRICES: Record<ServiceType, Record<string, number>> = {
  domestic: { studio: 5900, '2bed': 7900, '3bed': 9900, '4bed': 12900, '5plus': 15900 },
  deep: { studio: 12900, '2bed': 16900, '3bed': 21900, '4bed': 27900, '5plus': 34900 },
  end_of_tenancy: { studio: 14900, '2bed': 19900, '3bed': 24900, '4bed': 29900, '5plus': 37900 },
  office: { small: 9900, medium: 17900, large: 0 }, // large = custom quote
};

const FREQUENCY_DISCOUNTS: Record<Frequency, number> = {
  one_off: 0,
  weekly: 0.10,
  fortnightly: 0.05,
  monthly: 0,
};

export function calcBasePrice(service: ServiceType | '', size: PropertySize | '', frequency: Frequency): number {
  if (!service || !size) return 0;
  const base = BASE_PRICES[service]?.[size] ?? 0;
  const discount = FREQUENCY_DISCOUNTS[frequency] ?? 0;
  return Math.round(base * (1 - discount));
}

export const PROPERTY_SIZES: Array<{ key: PropertySize; label: string; forServices: ServiceType[] }> = [
  { key: 'studio', label: 'Studio / 1 Bed', forServices: ['domestic', 'deep', 'end_of_tenancy'] },
  { key: '2bed', label: '2 Bedrooms', forServices: ['domestic', 'deep', 'end_of_tenancy'] },
  { key: '3bed', label: '3 Bedrooms', forServices: ['domestic', 'deep', 'end_of_tenancy'] },
  { key: '4bed', label: '4 Bedrooms', forServices: ['domestic', 'deep', 'end_of_tenancy'] },
  { key: '5plus', label: '5+ Bedrooms', forServices: ['domestic', 'deep', 'end_of_tenancy'] },
  { key: 'small', label: 'Small (up to 500 sq ft)', forServices: ['office'] },
  { key: 'medium', label: 'Medium (500–1,500 sq ft)', forServices: ['office'] },
  { key: 'large', label: 'Large (1,500+ sq ft) — Custom', forServices: ['office'] },
];

export const FREQUENCIES = [
  { key: 'one_off' as Frequency, label: 'One-off clean', badge: null },
  { key: 'weekly' as Frequency, label: 'Weekly', badge: 'Save 10%' },
  { key: 'fortnightly' as Frequency, label: 'Fortnightly', badge: 'Save 5%' },
  { key: 'monthly' as Frequency, label: 'Monthly', badge: null },
];

export const TIME_SLOTS = [
  { value: 'morning', label: 'Morning · 8am – 12pm' },
  { value: 'afternoon', label: 'Afternoon · 12pm – 4pm' },
  { value: 'evening', label: 'Evening · 4pm – 6pm' },
];

export const EXTRAS: Extra[] = [
  { key: 'oven', label: 'Oven Clean', pricePence: 4900 },
  { key: 'fridge', label: 'Fridge Clean', pricePence: 1900 },
  { key: 'windows', label: 'Internal Windows', pricePence: 2900 },
  { key: 'carpet', label: 'Carpet Steam Clean', pricePence: 4900 },
  { key: 'laundry', label: 'Laundry & Ironing (2 hrs)', pricePence: 3600 },
  { key: 'balcony', label: 'Balcony / Patio', pricePence: 2500 },
];

export function formatPrice(pence: number): string {
  return `£${(pence / 100).toFixed(2).replace('.00', '')}`;
}

export const DEPOSIT_FRACTION = 0.25; // 25% deposit

export function calcDeposit(totalPence: number): number {
  return Math.round(totalPence * DEPOSIT_FRACTION);
}
