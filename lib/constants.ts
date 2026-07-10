export const BUSINESS = {
  name: 'PureMaids',
  phone: '01204 123 456',
  email: 'hello@puremaids.co.uk',
  address: '21 Deansgate, Bolton BL1 1DE',
  domain: 'https://puremaids.co.uk',
};

export const SERVICE_AREAS = [
  'Bolton', 'Manchester', 'Bury', 'Wigan', 'Preston',
  'Chorley', 'Salford', 'Rochdale', 'Oldham',
];

export const DEPOSIT_PERCENTAGE = 20;

export const SERVICE_PRICES_PENCE: Record<string, { base: number; label: string }> = {
  domestic: { base: 5900, label: 'Domestic Cleaning' },
  deep: { base: 12900, label: 'Deep Cleaning' },
  end_of_tenancy: { base: 18900, label: 'End of Tenancy Cleaning' },
  office: { base: 9900, label: 'Office Cleaning' },
};

export const EXTRA_PRICES_PENCE: Record<string, number> = {
  oven_clean: 2000,
  fridge_clean: 1500,
  carpet_shampoo: 3500,
  window_clean: 1800,
  skirting_boards: 1200,
};
