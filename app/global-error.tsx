'use client';
import { BUSINESS } from '@/lib/constants';
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en-GB">
      <body className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center font-sans">
        <p className="text-7xl font-extrabold text-gray-200 select-none" aria-hidden="true">500</p>
        <h1 className="mt-3 text-2xl font-bold text-gray-900">Something went wrong</h1>
        <p className="mt-2 text-gray-500 max-w-sm">An unexpected error occurred. Our team has been notified.</p>
        {error.digest && <p className="mt-1 text-xs text-gray-400">Error ID: {error.digest}</p>}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <button onClick={reset} className="rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white hover:bg-brand-700">Try Again</button>
          <a href="/" className="rounded-xl border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50">Home</a>
          <a href={`tel:${BUSINESS.phone}`} className="rounded-xl border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50">Call Us</a>
        </div>
      </body>
    </html>
  );
}
