import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'PureMaids | Professional Cleaning Services Bolton & Greater Manchester',
  description: 'House cleaning Bolton, domestic cleaners near me, deep cleaning, end of tenancy cleaning, and office cleaning across Greater Manchester.',
  keywords: [
    'house cleaning Bolton', 'domestic cleaners near me', 'end of tenancy cleaning',
    'deep cleaning services', 'office cleaning Bolton', 'cleaning services Manchester',
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
