export const SITE_CONFIG = {
  name: 'PureMaids',
  tagline: 'Professional Cleaning Services',
  phone: '0800 012 3456',
  email: 'hello@puremaids.co.uk',
  address: 'London, United Kingdom',
  domain: 'puremaids.co.uk',
  social: {
    facebook: 'https://facebook.com/puremaids',
    instagram: 'https://instagram.com/puremaids',
    twitter: 'https://twitter.com/puremaids',
  },
};

export const SERVICES = [
  {
    slug: 'domestic-cleaning',
    name: 'Domestic Cleaning',
    shortDesc: 'Regular home cleaning tailored to your schedule',
    icon: 'Home',
    color: '#00AEEF',
  },
  {
    slug: 'deep-cleaning',
    name: 'Deep Cleaning',
    shortDesc: 'Thorough top-to-bottom clean of your entire home',
    icon: 'Sparkles',
    color: '#10B981',
  },
  {
    slug: 'end-of-tenancy-cleaning',
    name: 'End of Tenancy Cleaning',
    shortDesc: 'Guaranteed clean to get your full deposit back',
    icon: 'Key',
    color: '#F59E0B',
  },
  {
    slug: 'office-cleaning',
    name: 'Office Cleaning',
    shortDesc: 'Professional commercial cleaning for your workplace',
    icon: 'Building2',
    color: '#8B5CF6',
  },
];

export const AREAS = [
  'Central London', 'North London', 'South London', 'East London', 'West London',
  'Canary Wharf', 'Chelsea', 'Kensington', 'Fulham', 'Battersea',
  'Clapham', 'Brixton', 'Hackney', 'Islington', 'Camden',
  'Hammersmith', 'Wimbledon', 'Richmond', 'Kingston', 'Croydon',
  'Ealing', 'Harrow', 'Barnet', 'Wembley', 'Stratford',
  'Greenwich', 'Lewisham', 'Dulwich', 'Crystal Palace', 'Tooting',
];

export const PRICING = {
  domestic: {
    studio: { price: 5900, label: 'Studio / 1 bed' },
    two_bed: { price: 7900, label: '2 Bedroom' },
    three_bed: { price: 9900, label: '3 Bedroom' },
    four_bed: { price: 12900, label: '4 Bedroom' },
    five_plus: { price: 15900, label: '5+ Bedroom' },
  },
  deep: {
    studio: { price: 12900, label: 'Studio / 1 bed' },
    two_bed: { price: 16900, label: '2 Bedroom' },
    three_bed: { price: 21900, label: '3 Bedroom' },
    four_bed: { price: 27900, label: '4 Bedroom' },
    five_plus: { price: 34900, label: '5+ Bedroom' },
  },
  endOfTenancy: {
    studio: { price: 14900, label: 'Studio / 1 bed' },
    two_bed: { price: 19900, label: '2 Bedroom' },
    three_bed: { price: 24900, label: '3 Bedroom' },
    four_bed: { price: 29900, label: '4 Bedroom' },
    five_plus: { price: 37900, label: '5+ Bedroom' },
  },
  office: {
    small: { price: 9900, label: 'Small (up to 500 sq ft)' },
    medium: { price: 17900, label: 'Medium (500–1500 sq ft)' },
    large: { price: 29900, label: 'Large (1500+ sq ft)' },
  },
};
