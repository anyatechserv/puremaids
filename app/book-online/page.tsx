import type { Metadata } from 'next';
import BookingWizard from '@/components/booking/booking-wizard';

export const metadata: Metadata = {
  title: 'Book Online | PureMaids Professional Cleaning',
  description:
    'Book your professional cleaning service online in under 3 minutes. Choose your service, date, and extras — get an instant price and secure your slot.',
};

export default function BookOnlinePage() {
  return <BookingWizard />;
}
