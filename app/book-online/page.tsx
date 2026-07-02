import type { Metadata } from 'next';
import BookForm from './book-form';

export const metadata: Metadata = {
  title: 'Book Online | PureMaids Professional Cleaning London',
  description:
    'Book your professional cleaning service online in under 2 minutes. Domestic, deep, end of tenancy and office cleaning across London. No payment needed to book.',
};

export default function BookOnlinePage() {
  return <BookForm />;
}
