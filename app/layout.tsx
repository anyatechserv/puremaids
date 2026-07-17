import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import CookieBanner from '@/components/gdpr/CookieBanner';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta', display: 'swap' });

export const metadata: Metadata = {
  title: { default: 'PureMaids — Professional Cleaning Services in Bolton', template: '%s | PureMaids' },
  description: 'Book trusted, DBS-checked cleaners in Bolton and Greater Manchester. Instant quotes, secure deposits, satisfaction guarantee.',
  keywords: ['cleaning services bolton', 'domestic cleaning', 'deep cleaning', 'end of tenancy cleaning', 'office cleaning'],
  metadataBase: new URL('https://puremaids.co.uk'),
  openGraph: {
    title: 'PureMaids — Professional Cleaning Services',
    description: 'Book trusted, DBS-checked cleaners in Bolton. Instant quotes, secure deposits.',
    type: 'website',
    locale: 'en_GB',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable}`}>
      <body className="font-sans">
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-brand-600 focus:px-4 focus:py-2 focus:text-white">
          Skip to main content
        </a>
        <Nav />
        <main id="main">{children}</main>
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}
