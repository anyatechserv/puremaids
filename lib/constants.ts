export const SERVICES = {
  domestic: { label: 'Domestic Cleaning', basePence: 5900, description: 'Regular home cleaning tailored to your needs' },
  deep: { label: 'Deep Cleaning', basePence: 12900, description: 'Thorough top-to-bottom deep clean' },
  end_of_tenancy: { label: 'End of Tenancy Cleaning', basePence: 18900, description: 'Comprehensive move-out cleaning' },
  office: { label: 'Office Cleaning', basePence: 9900, description: 'Professional commercial cleaning' },
} as const;

export const EXTRAS = {
  oven: { label: 'Oven Clean', pence: 2000 },
  fridge: { label: 'Fridge Clean', pence: 1500 },
  carpet: { label: 'Carpet Shampoo', pence: 3500 },
  windows: { label: 'Window Cleaning', pence: 1800 },
  skirting: { label: 'Skirting Boards', pence: 1200 },
} as const;

export const SERVICE_AREAS = [
  'Bolton', 'Farnworth', 'Horwich', 'Westhoughton', 'Little Lever',
  'Kearsley', 'Atherton', 'Leigh', 'Tyldesley',
] as const;

export const TIME_SLOTS = ['08:00', '10:00', '12:00', '14:00'] as const;

export const SERVICE_KEYS = Object.keys(SERVICES) as (keyof typeof SERVICES)[];
export const EXTRA_KEYS = Object.keys(EXTRAS) as (keyof typeof EXTRAS)[];
