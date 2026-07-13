import Link from 'next/link';
import { BUSINESS } from '@/lib/constants';

export const metadata = { title: 'Page Not Found' };

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <div className="text-6xl font-display font-extrabold text-brand-200 select-none" aria-hidden="true">404</div>
      <h1 className="mt-4 font-display text-2xl font-bold text-gray-900">Page not found</h1>
      <p className="mt-2 text-gray-600 max-w-sm">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link href="/" className="btn btn-md btn-primary">Back to Home</Link>
        <a href={`tel:${BUSINESS.phone}`} className="btn btn-md btn-secondary">Call Us</a>
      </div>
    </div>
  );
}
