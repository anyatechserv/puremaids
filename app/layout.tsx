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
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: `${SITE_CONFIG.name} | Professional Cleaning Services London`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description:
    'PureMaids offers professional cleaning services across London. Domestic cleaning, deep cleaning, end of tenancy, and office cleaning. Fully insured, DBS checked cleaners.',
  keywords: [
    'cleaning service London',
    'domestic cleaning',
    'deep cleaning London',
    'end of tenancy cleaning',
    'office cleaning London',
    'professional cleaners',
    'house cleaning London',
    'PureMaids',
  ],
  openGraph: {
    title: `${SITE_CONFIG.name} | Professional Cleaning Services London`,
    description: 'London\'s most trusted professional cleaning service. Fully insured, DBS-checked cleaners.',
    url: `https://${SITE_CONFIG.domain}`,
    siteName: SITE_CONFIG.name,
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_CONFIG.name} | Professional Cleaning Services London`,
    description: 'London\'s most trusted professional cleaning service.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: `https://${SITE_CONFIG.domain}`,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${inter.variable} ${poppins.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'LocalBusiness',
              name: SITE_CONFIG.name,
              description: 'Professional cleaning services across London',
              url: `https://${SITE_CONFIG.domain}`,
              telephone: SITE_CONFIG.phone,
              email: SITE_CONFIG.email,
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'London',
                addressCountry: 'GB',
              },
              geo: {
                '@type': 'GeoCoordinates',
                latitude: '51.5074',
                longitude: '-0.1278',
              },
              openingHoursSpecification: [
                {
                  '@type': 'OpeningHoursSpecification',
                  dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                  opens: '08:00',
                  closes: '18:00',
                },
                {
                  '@type': 'OpeningHoursSpecification',
                  dayOfWeek: 'Saturday',
                  opens: '09:00',
                  closes: '16:00',
                },
              ],
              priceRange: '££',
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.9',
                reviewCount: '2847',
              },
            }),
          }}
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
