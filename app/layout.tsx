import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import CookieConsent from '@/components/layout/cookie-consent';
import { SITE_CONFIG } from '@/lib/constants';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({
  weight: ['400', '600', '700', '800', '900'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(`https://${SITE_CONFIG.domain}`),
  title: {
    default: 'PureMaids | House Cleaning Bolton & Greater Manchester',
    template: '%s | PureMaids',
  },
  description:
    'PureMaids — professional house cleaning services in Bolton, Manchester, Bury, Wigan and Preston. Domestic cleaning, deep cleaning, end of tenancy and office cleaning. Fully insured, DBS-checked cleaners. Book online for an instant quote.',
  keywords: [
    'house cleaning Bolton',
    'domestic cleaners Bolton',
    'domestic cleaners near me',
    'end of tenancy cleaning Bolton',
    'end of tenancy cleaning Manchester',
    'deep cleaning services Bolton',
    'deep cleaning Manchester',
    'office cleaning Bolton',
    'office cleaning Manchester',
    'professional cleaners Bolton',
    'cleaning company Bolton',
    'house cleaners near me',
    'domestic cleaning Greater Manchester',
    'cleaning services Bury',
    'cleaning services Wigan',
    'cleaning services Preston',
    'PureMaids',
  ],
  authors: [{ name: 'PureMaids', url: `https://${SITE_CONFIG.domain}` }],
  creator: 'PureMaids',
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: `https://${SITE_CONFIG.domain}`,
    siteName: 'PureMaids',
    title: 'PureMaids | House Cleaning Bolton & Greater Manchester',
    description:
      "Bolton and Greater Manchester's most trusted professional cleaning service. Fully insured, DBS-checked cleaners covering Bolton, Manchester, Bury, Wigan and Preston.",
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'PureMaids Professional Cleaning Services Bolton' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PureMaids | House Cleaning Bolton & Greater Manchester',
    description:
      "Bolton and Greater Manchester's most trusted professional cleaning service. Fully insured, DBS-checked cleaners.",
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  alternates: { canonical: `https://${SITE_CONFIG.domain}` },
};

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': `https://${SITE_CONFIG.domain}/#business`,
  name: 'PureMaids',
  description:
    'Professional house cleaning services in Bolton, Manchester, Bury, Wigan and Preston. Domestic cleaning, deep cleaning, end of tenancy and office cleaning.',
  url: `https://${SITE_CONFIG.domain}`,
  telephone: SITE_CONFIG.phone,
  email: SITE_CONFIG.email,
  address: {
    '@type': 'PostalAddress',
    streetAddress: SITE_CONFIG.addressStreet,
    addressLocality: SITE_CONFIG.addressLocality,
    addressRegion: SITE_CONFIG.addressRegion,
    postalCode: SITE_CONFIG.addressPostcode,
    addressCountry: 'GB',
  },
  geo: { '@type': 'GeoCoordinates', latitude: SITE_CONFIG.latitude, longitude: SITE_CONFIG.longitude },
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday'], opens: '08:00', closes: '18:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Saturday'], opens: '09:00', closes: '16:00' },
  ],
  priceRange: '££',
  currenciesAccepted: 'GBP',
  paymentAccepted: 'Cash, Credit Card, Debit Card, Bank Transfer',
  areaServed: [
    { '@type': 'City', name: 'Bolton' },
    { '@type': 'City', name: 'Manchester' },
    { '@type': 'City', name: 'Bury' },
    { '@type': 'City', name: 'Wigan' },
    { '@type': 'City', name: 'Preston' },
    { '@type': 'City', name: 'Salford' },
    { '@type': 'City', name: 'Chorley' },
    { '@type': 'City', name: 'Rochdale' },
    { '@type': 'City', name: 'Oldham' },
  ],
  aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', reviewCount: '2847', bestRating: '5' },
  sameAs: [SITE_CONFIG.social.facebook, SITE_CONFIG.social.instagram, SITE_CONFIG.social.twitter],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Cleaning Services',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Domestic Cleaning', description: 'Regular weekly or fortnightly house cleaning in Bolton and Greater Manchester' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Deep Cleaning', description: 'Thorough top-to-bottom deep clean for homes across the North West' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'End of Tenancy Cleaning', description: 'Deposit-back guaranteed end of tenancy cleaning across Bolton and Manchester' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Office Cleaning', description: 'Professional commercial cleaning for Bolton and Manchester businesses' } },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${inter.variable} ${poppins.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </head>
      <body className="font-sans antialiased bg-white text-secondary-700">
        <Header />
        <main>{children}</main>
        <Footer />
        <CookieConsent />
      </body>
    </html>
  );
}
