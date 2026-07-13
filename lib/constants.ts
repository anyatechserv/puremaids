export const BUSINESS = {
  name:            'PureMaids',
  tagline:         'Professional Cleaning Services',
  phone:           '01204 123 456',
  email:           'hello@puremaids.co.uk',
  address:         '21 Deansgate, Bolton BL1 1DE',
  domain:          'https://puremaids.co.uk',
  vatNumber:       'GB 123 456 789',
  companiesHouse:  '12345678',
  icoNumber:       'ZB123456',
  trustpilotUrl:   'https://www.trustpilot.com/review/puremaids.co.uk',
  googleUrl:       'https://g.page/puremaids',
} as const;

export const SERVICE_AREAS = [
  'Bolton', 'Manchester', 'Bury', 'Wigan', 'Preston',
  'Chorley', 'Salford', 'Rochdale', 'Oldham',
] as const;

export const DEPOSIT_PCT = 20;

export const SERVICES = {
  domestic:       { label: 'Domestic Cleaning',      icon: '🏠', basePence: 5900,  description: 'Regular home cleaning tailored to your schedule and preferences.' },
  deep:           { label: 'Deep Cleaning',           icon: '✨', basePence: 12900, description: 'A thorough top-to-bottom clean — every surface, every corner.' },
  end_of_tenancy: { label: 'End of Tenancy Cleaning', icon: '🔑', basePence: 18900, description: 'Landlord-ready results. Get your full deposit back, guaranteed.' },
  office:         { label: 'Office Cleaning',         icon: '🏢', basePence: 9900,  description: 'Reliable commercial cleaning for a productive workplace.' },
} as const;

export const EXTRAS = {
  oven_clean:      { label: 'Oven Clean',       pence: 2000 },
  fridge_clean:    { label: 'Fridge Clean',      pence: 1500 },
  carpet_shampoo:  { label: 'Carpet Shampoo',    pence: 3500 },
  window_clean:    { label: 'Window Cleaning',   pence: 1800 },
  skirting_boards: { label: 'Skirting Boards',   pence: 1200 },
} as const;

export const TRUST_STATS = [
  { value: '2,400+', label: 'Happy customers' },
  { value: '98%',    label: 'Satisfaction rate' },
  { value: '6 yrs',  label: 'In business' },
  { value: '4.9★',   label: 'Average rating' },
] as const;

export const TRUST_BADGES = [
  '🛡️ DBS Checked Staff',
  '📋 Fully Insured',
  '⭐ Trustpilot 4.9★',
  '🔒 ICO Registered',
  '✅ 100% Guarantee',
  '💳 Secure Payments',
] as const;

export const REVIEWS = [
  {
    avatar: 'SM', name: 'Sarah M.', location: 'Bolton', rating: 5,
    text: 'Absolutely spotless — they even cleaned inside the cupboard doors. Best cleaners I\'ve ever used.',
    service: 'Deep Cleaning', date: '2 weeks ago',
  },
  {
    avatar: 'JT', name: 'James T.', location: 'Manchester', rating: 5,
    text: 'Got my full deposit back thanks to their end of tenancy clean. Landlord was genuinely impressed.',
    service: 'End of Tenancy', date: '1 month ago',
  },
  {
    avatar: 'RP', name: 'Rachel P.', location: 'Bury', rating: 5,
    text: 'Used the fortnightly subscription for 4 months now. Always on time, always perfect. Highly recommend.',
    service: 'Regular Clean', date: '3 weeks ago',
  },
] as const;

export const PROPERTY_SIZES = ['Studio', '1 bedroom', '2 bedrooms', '3 bedrooms', '4 bedrooms', '5+ bedrooms'] as const;
export const FREQUENCIES    = [
  { value: 'one_off',     label: 'One-off'      },
  { value: 'weekly',      label: 'Weekly'       },
  { value: 'fortnightly', label: 'Fortnightly'  },
  { value: 'monthly',     label: 'Monthly'      },
] as const;
export const TIME_SLOTS = ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00'] as const;
