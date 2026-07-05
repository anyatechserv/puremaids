export const SITE_CONFIG = {
  name: 'PureMaids',
  tagline: 'Professional Cleaning Services Bolton & Greater Manchester',
  phone: '0800 012 3456',
  email: 'hello@puremaids.co.uk',
  address: 'Bolton, Greater Manchester, United Kingdom',
  addressStreet: '12 Deansgate',
  addressLocality: 'Bolton',
  addressRegion: 'Greater Manchester',
  addressPostcode: 'BL1 1DE',
  latitude: '53.5779',
  longitude: '-2.4282',
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
    shortDesc: 'Regular home cleaning in Bolton and across Greater Manchester',
    icon: 'Home',
    color: '#00AEEF',
  },
  {
    slug: 'deep-cleaning',
    name: 'Deep Cleaning',
    shortDesc: 'Thorough top-to-bottom deep clean for homes across the North West',
    icon: 'Sparkles',
    color: '#10B981',
  },
  {
    slug: 'end-of-tenancy-cleaning',
    name: 'End of Tenancy Cleaning',
    shortDesc: 'Deposit-back guaranteed end of tenancy cleans across Bolton & Manchester',
    icon: 'Key',
    color: '#F59E0B',
  },
  {
    slug: 'office-cleaning',
    name: 'Office Cleaning',
    shortDesc: 'Professional commercial cleaning for Bolton and Manchester businesses',
    icon: 'Building2',
    color: '#8B5CF6',
  },
];

export const AREAS = [
  'Bolton', 'Manchester', 'Bury', 'Wigan', 'Preston',
  'Salford', 'Chorley', 'Leigh', 'Horwich', 'Farnworth',
  'Radcliffe', 'Ramsbottom', 'Heywood', 'Middleton', 'Rochdale',
  'Oldham', 'Stockport', 'Warrington', 'Blackburn', 'Burnley',
  'Accrington', 'Darwen', 'Skelmersdale', 'Atherton', 'Walkden',
  'Little Lever', 'Kearsley', 'Westhoughton', 'Tyldesley', 'Eccles',
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
    medium: { price: 17900, label: 'Medium (500–1,500 sq ft)' },
    large: { price: 29900, label: 'Large (1,500+ sq ft)' },
  },
};
