import Link from 'next/link';
import { BUSINESS } from '@/lib/constants';
export const metadata = { title: 'Page Not Found' };

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <p className="font-display text-8xl font-extrabold text-brand-100 select-none" aria-hidden="true">404</p>
      <h1 className="mt-2 font-display text-2xl font-bold text-gray-900">Page not found</h1>
      <p className="mt-2 text-gray-500 max-w-sm">The page you're looking for doesn't exist or has moved.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link href="/" className="btn btn-md btn-primary">Back to Home</Link>
        <a href={`tel:${BUSINESS.phone}`} className="btn btn-md btn-secondary">Call Us</a>
      </div>
    </div>
  );
}
