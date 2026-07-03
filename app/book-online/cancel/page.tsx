import type { Metadata } from 'next';
import Link from 'next/link';
import { XCircle, ArrowLeft, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Payment Cancelled | PureMaids',
};

export default function BookingCancelPage({
  searchParams,
}: {
  searchParams: { ref?: string };
}) {
  const ref = searchParams.ref ?? '';

  return (
    <section className="min-h-[80vh] flex items-center justify-center py-20 bg-secondary-50">
      <div className="mx-auto max-w-lg px-4 text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-10 h-10 text-red-400" />
        </div>

        <h1 className="font-heading font-extrabold text-3xl text-secondary-800 mb-3">
          Payment Cancelled
        </h1>
        <p className="text-secondary-500 leading-relaxed mb-3">
          No charge was made. Your booking details have been saved — you can complete your deposit any time.
        </p>

        {ref && (
          <p className="text-sm text-secondary-400 mb-8">
            Booking reference: <strong className="text-secondary-600 font-mono">{ref}</strong>
          </p>
        )}

        <div className="bg-secondary-50 border border-secondary-100 rounded-2xl p-5 mb-8 text-sm text-secondary-600">
          <p className="font-semibold text-secondary-700 mb-1">Prefer to pay by phone?</p>
          <p>Call us and we&apos;ll take your deposit over the phone and confirm your booking instantly.</p>
          <a
            href="tel:08000123456"
            className="inline-flex items-center gap-2 mt-3 font-bold text-primary-600 hover:text-primary-700"
          >
            <Phone className="w-4 h-4" />
            0800 012 3456
          </a>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/book-online">
            <Button variant="outline" size="lg">
              <ArrowLeft className="w-4 h-4" />
              Try Again
            </Button>
          </Link>
          <Link href="/">
            <Button size="lg">Back to Home</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
