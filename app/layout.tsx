import type { Metadata, Viewport } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import CookieBanner from '@/components/gdpr/CookieBanner';
import { BUSINESS, SERVICE_AREAS } from '@/lib/constants';
import './globals.css';

const inter = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});
const interBody = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1b7c6d',
};

export const metadata: Metadata = {
  metadataBase: new URL(BUSINESS.domain),
  title: {
    default: `${BUSINESS.name} | House Cleaning Bolton & Greater Manchester`,
    template: `%s | ${BUSINESS.name}`,
  },
  description: `Professional house cleaning Bolton, Manchester, Bury, Wigan & Preston. DBS-checked, fully insured. Deep clean, end of tenancy, domestic cleaning from £59. Book with 20% deposit.`,
  keywords: ['house cleaning Bolton','domestic cleaners near me','end of tenancy cleaning','deep cleaning services','office cleaning Bolton','cleaning services Manchester',
    ...SERVICE_AREAS.map(a => `cleaning services ${a}`)],
  authors: [{ name: BUSINESS.name, url: BUSINESS.domain }],
  creator: BUSINESS.name,
  publisher: BUSINESS.name,
  openGraph: {
    type: 'website', locale: 'en_GB',
    url: BUSINESS.domain, siteName: BUSINESS.name,
    title: `${BUSINESS.name} | Professional Cleaning Bolton & Manchester`,
    description: 'Trusted cleaning services across Bolton & Greater Manchester. 4.9★ rated by 2,400+ customers.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'PureMaids Professional Cleaning Services' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${BUSINESS.name} | Professional Cleaning Bolton`,
    description: 'DBS-checked cleaners. 4.9★ rating. Book from £59 with a 20% deposit.',
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
  alternates: { canonical: BUSINESS.domain },
  manifest: '/manifest.json',
};

const lbSchema = {
  '@context': 'https://schema.org', '@type': 'LocalBusiness',
  '@id': `${BUSINESS.domain}/#org`,
  name: BUSINESS.name, url: BUSINESS.domain,
  telephone: BUSINESS.phone, email: BUSINESS.email,
  address: { '@type': 'PostalAddress', streetAddress: '21 Deansgate', addressLocality: 'Bolton', addressRegion: 'Greater Manchester', postalCode: 'BL1 1DE', addressCountry: 'GB' },
  geo: { '@type': 'GeoCoordinates', latitude: 53.578, longitude: -2.429 },
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday'], opens: '08:00', closes: '18:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Saturday'], opens: '09:00', closes: '16:00' },
  ],
  areaServed: SERVICE_AREAS.map(a => ({ '@type': 'City', name: a })),
  priceRange: '££',
  aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', reviewCount: '2400', bestRating: '5', worstRating: '1' },
  sameAs: [BUSINESS.trustpilotUrl, BUSINESS.googleUrl],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${inter.variable} ${interBody.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(lbSchema) }} />
      </head>
      <body className="font-sans antialiased">
        <a href="#main-content" className="skip-link">Skip to main content</a>
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
