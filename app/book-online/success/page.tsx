import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle, Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Booking Confirmed | PureMaids',
};

export default function BookingSuccessPage({
  searchParams,
}: {
  searchParams: { ref?: string; session_id?: string };
}) {
  const ref = searchParams.ref ?? '';

  return (
    <section className="min-h-[80vh] flex items-center justify-center py-20 bg-secondary-50">
      <div className="mx-auto max-w-lg px-4 text-center">
        {/* Success icon */}
        <div className="relative inline-block mb-7">
          <div className="w-24 h-24 bg-accent-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-12 h-12 text-accent-500" />
          </div>
          <div className="absolute -top-1 -right-1 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center shadow-lg">
            <svg viewBox="0 0 16 16" className="w-4 h-4 text-white" fill="none">
              <path d="M3 8l4 4 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        <h1 className="font-heading font-extrabold text-3xl md:text-4xl text-secondary-800 mb-3">
          Deposit Paid — You&apos;re Booked!
        </h1>
        <p className="text-secondary-500 leading-relaxed mb-8">
          Your deposit has been received and your booking is confirmed. A full confirmation has been sent to your email.
        </p>

        {ref && (
          <div className="bg-white border border-secondary-100 rounded-2xl p-6 mb-8 shadow-soft">
            <p className="text-xs font-bold uppercase tracking-widest text-secondary-400 mb-1">Booking Reference</p>
            <p className="font-heading font-extrabold text-3xl text-primary-600 tracking-wider">{ref}</p>
            <p className="text-xs text-secondary-400 mt-1">Keep this for your records</p>
          </div>
        )}

        <div className="bg-primary-50 border border-primary-100 rounded-2xl p-5 mb-8 text-left text-sm">
          <p className="font-bold text-primary-700 mb-3">What happens next?</p>
          <ol className="space-y-3 text-secondary-600">
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 bg-primary-500 text-white rounded-full text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
              We confirm a cleaner is available for your chosen date and time.
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 bg-primary-500 text-white rounded-full text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
              You&apos;ll receive a cleaner&apos;s name and contact number 24 hours before your appointment.
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 bg-primary-500 text-white rounded-full text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
              Your cleaner arrives and delivers a spotless clean. Remaining balance paid on the day.
            </li>
          </ol>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/">
            <Button variant="outline" size="lg">Back to Home</Button>
          </Link>
          <Link href="/book-online">
            <Button size="lg">
              Book Another Clean
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
