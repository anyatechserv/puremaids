export const BUSINESS = {
  name: 'PureMaids',
  tagline: 'Professional Cleaning Services',
  phone: '01204 123 456',
  email: 'hello@puremaids.co.uk',
  address: '21 Deansgate, Bolton BL1 1DE',
  domain: 'https://puremaids.co.uk',
  vatNumber: 'GB 123 4567 89',
  companiesHouse: '12345678',
  trustpilotUrl: 'https://www.trustpilot.com',
  googleReviewsUrl: 'https://www.google.com',
} as const;

export const SERVICE_AREAS = [
  'Bolton', 'Manchester', 'Bury', 'Wigan', 'Preston',
  'Chorley', 'Salford', 'Rochdale', 'Oldham',
] as const;

export const DEPOSIT_PERCENTAGE = 20;

export const SERVICES = {
  domestic:        { label: 'Domestic Cleaning',       basePence: 5900,  icon: '🏠', description: 'Regular home cleaning tailored to your schedule.' },
  deep:            { label: 'Deep Cleaning',            basePence: 12900, icon: '✨', description: 'A thorough top-to-bottom clean of your entire property.' },
  end_of_tenancy:  { label: 'End of Tenancy Cleaning',  basePence: 18900, icon: '🔑', description: 'Spotless results guaranteed — get your deposit back.' },
  office:          { label: 'Office Cleaning',          basePence: 9900,  icon: '🏢', description: 'Professional commercial cleaning for your workplace.' },
} as const;

export const EXTRAS = {
  oven_clean:       { label: 'Oven Clean',        pence: 2000 },
  fridge_clean:     { label: 'Fridge Clean',       pence: 1500 },
  carpet_shampoo:   { label: 'Carpet Shampoo',     pence: 3500 },
  window_clean:     { label: 'Window Cleaning',    pence: 1800 },
  skirting_boards:  { label: 'Skirting Boards',    pence: 1200 },
} as const;

export const TRUST_STATS = [
  { value: '2,400+', label: 'Happy customers' },
  { value: '98%',    label: 'Satisfaction rate' },
  { value: '6 yrs',  label: 'In business' },
  { value: '4.9★',   label: 'Average rating' },
] as const;

export const REVIEWS = [
  {
    name: 'Sarah M.',
    location: 'Bolton',
    rating: 5,
    text: 'Absolutely spotless — they even cleaned inside the cupboard doors. Best cleaners I\'ve ever used.',
    service: 'Deep Cleaning',
    date: '2 weeks ago',
    avatar: 'SM',
  },
  {
    name: 'James T.',
    location: 'Manchester',
    rating: 5,
    text: 'Got my full deposit back thanks to their end of tenancy clean. Landlord was genuinely impressed.',
    service: 'End of Tenancy',
    date: '1 month ago',
    avatar: 'JT',
  },
  {
    name: 'Rachel P.',
    location: 'Bury',
    rating: 5,
    text: 'Used the fortnightly subscription for 4 months now. Always on time, always perfect. Highly recommend.',
    service: 'Regular Clean',
    date: '3 weeks ago',
    avatar: 'RP',
  },
] as const;
