'use client';

import React, { useState } from 'react';
import { CheckCircle, Calendar, Phone } from 'lucide-react';
import BookingProgress from '@/components/booking/booking-progress';
import StepService from '@/components/booking/step-service';
import StepPostcode from '@/components/booking/step-postcode';
import StepProperty from '@/components/booking/step-property';
import StepSchedule from '@/components/booking/step-schedule';
import StepExtras from '@/components/booking/step-extras';
import StepDetails, { type DetailsFormData } from '@/components/booking/step-details';
import StepReview from '@/components/booking/step-review';
import { supabase } from '@/lib/supabase';
import {
  calcBasePrice,
  EXTRAS,
  type ServiceType,
  type PropertySize,
  type Frequency,
} from '@/lib/booking';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface BookingConfirmed {
  reference: string;
  email: string;
  firstName: string;
  service: string;
  date: string;
  total: number;
}

export default function BookingWizard() {
  const [step, setStep] = useState(1);
  const [confirmed, setConfirmed] = useState<BookingConfirmed | null>(null);

  // Step state
  const [service, setService] = useState<ServiceType | ''>('');
  const [postcode, setPostcode] = useState('');
  const [propertySize, setPropertySize] = useState<PropertySize | ''>('');
  const [frequency, setFrequency] = useState<Frequency>('one_off');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [extras, setExtras] = useState<string[]>([]);
  const [details, setDetails] = useState<DetailsFormData | null>(null);

  const toggleExtra = (key: string) =>
    setExtras((prev) => prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]);

  const go = (n: number) => {
    setStep(n);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDetailsNext = (data: DetailsFormData) => {
    setDetails(data);
    go(7);
  };

  const basePricePence = calcBasePrice(service, propertySize, frequency);
  const extrasPricePence = EXTRAS.filter((e) => extras.includes(e.key)).reduce((s, e) => s + e.pricePence, 0);
  const totalPricePence = basePricePence + extrasPricePence;

  const handleConfirm = async () => {
    if (!details || !service) throw new Error('Incomplete booking data');

    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        service_type: service,
        property_size: propertySize || null,
        frequency,
        preferred_date: preferredDate,
        preferred_time: preferredTime,
        address: details.address,
        postcode,
        first_name: details.firstName,
        last_name: details.lastName,
        email: details.email,
        phone: details.phone,
        special_instructions: details.specialInstructions || null,
        gdpr_consent: details.gdprConsent,
        base_price_pence: basePricePence,
        extras_price_pence: extrasPricePence,
        total_price_pence: totalPricePence,
        deposit_amount_pence: Math.round(totalPricePence * 0.25),
        status: 'pending',
      })
      .select('id, reference')
      .single();

    if (bookingError) throw bookingError;

    // Insert extras
    if (extras.length > 0 && booking?.id) {
      const extraRows = EXTRAS.filter((e) => extras.includes(e.key)).map((e) => ({
        booking_id: booking.id,
        name: e.label,
        price_pence: e.pricePence,
      }));
      const { error: extrasError } = await supabase.from('booking_extras').insert(extraRows);
      if (extrasError) throw extrasError;
    }

    // Trigger confirmation email via edge function (fire-and-forget)
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (supabaseUrl && supabaseAnonKey) {
        fetch(`${supabaseUrl}/functions/v1/notify-booking`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseAnonKey}`,
          },
          body: JSON.stringify({ bookingId: booking.id }),
        }).catch(() => {}); // non-critical
      }
    } catch {
      // Email failure does not block the booking
    }

    setConfirmed({
      reference: booking.reference,
      email: details.email,
      firstName: details.firstName,
      service,
      date: preferredDate,
      total: totalPricePence,
    });
  };

  if (confirmed) {
    return <BookingConfirmation {...confirmed} />;
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-700 py-14">
        <div className="mx-auto max-w-7xl px-4">
          <h1 className="font-heading font-extrabold text-4xl md:text-5xl text-white mb-2 leading-tight">
            Book Your Clean
          </h1>
          <p className="text-secondary-300 text-lg">Takes less than 3 minutes · No payment needed to book</p>
        </div>
      </section>

      <section className="bg-secondary-50 py-10 min-h-[80vh]">
        <div className="mx-auto max-w-2xl px-4">
          {/* Progress bar */}
          <div className="mb-8">
            <BookingProgress current={step} />
          </div>

          {/* Step card */}
          <div className="bg-white rounded-3xl shadow-large overflow-hidden">
            {step === 1 && (
              <StepService value={service} onChange={setService} onNext={() => go(2)} />
            )}
            {step === 2 && (
              <StepPostcode value={postcode} onChange={setPostcode} onNext={() => go(3)} onBack={() => go(1)} />
            )}
            {step === 3 && (
              <StepProperty
                service={service}
                propertySize={propertySize}
                frequency={frequency}
                onSizeChange={setPropertySize}
                onFrequencyChange={setFrequency}
                onNext={() => go(4)}
                onBack={() => go(2)}
              />
            )}
            {step === 4 && (
              <StepSchedule
                date={preferredDate}
                time={preferredTime}
                onDateChange={setPreferredDate}
                onTimeChange={setPreferredTime}
                onNext={() => go(5)}
                onBack={() => go(3)}
              />
            )}
            {step === 5 && (
              <StepExtras
                selected={extras}
                service={service}
                propertySize={propertySize}
                frequency={frequency}
                onToggle={toggleExtra}
                onNext={() => go(6)}
                onBack={() => go(4)}
              />
            )}
            {step === 6 && (
              <StepDetails
                defaultValues={details ?? {}}
                onNext={handleDetailsNext}
                onBack={() => go(5)}
              />
            )}
            {step === 7 && details && (
              <StepReview
                data={{
                  service,
                  postcode,
                  propertySize,
                  frequency,
                  preferredDate,
                  preferredTime,
                  extras,
                  firstName: details.firstName,
                  lastName: details.lastName,
                  email: details.email,
                  phone: details.phone,
                  address: details.address,
                  specialInstructions: details.specialInstructions ?? '',
                  basePricePence,
                  extrasPricePence,
                }}
                onConfirm={handleConfirm}
                onBack={() => go(6)}
              />
            )}
          </div>

          {/* Trust strip */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-secondary-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-accent-500" /> Fully insured
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-accent-500" /> DBS checked cleaners
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-accent-500" /> 100% satisfaction guarantee
            </span>
          </div>
        </div>
      </section>
    </>
  );
}

function BookingConfirmation({ reference, email, firstName, service, date, total }: BookingConfirmed) {
  const serviceLabels: Record<string, string> = {
    domestic: 'Domestic Cleaning',
    deep: 'Deep Cleaning',
    end_of_tenancy: 'End of Tenancy Cleaning',
    office: 'Office Cleaning',
  };
  const totalFormatted = `£${(total / 100).toFixed(2).replace('.00', '')}`;

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

        <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-secondary-800 mb-2">
          Booking Confirmed!
        </h2>
        <p className="text-secondary-500 leading-relaxed mb-2">
          Thank you, {firstName}! Your booking has been received and saved.
        </p>
        <p className="text-secondary-400 text-sm mb-8">
          A confirmation has been sent to <strong className="text-secondary-600">{email}</strong>. Our team will call you within 2 hours to confirm your cleaner.
        </p>

        {/* Reference card */}
        <div className="bg-white border border-secondary-100 rounded-2xl p-6 mb-8 text-left shadow-soft">
          <div className="text-center mb-4 pb-4 border-b border-secondary-100">
            <p className="text-xs font-bold uppercase tracking-widest text-secondary-400 mb-1">Booking Reference</p>
            <p className="font-heading font-extrabold text-3xl text-primary-600 tracking-wider">{reference}</p>
            <p className="text-xs text-secondary-400 mt-1">Keep this for your records</p>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-secondary-500">Service</span>
              <span className="font-semibold text-secondary-700">{serviceLabels[service] ?? service}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary-500">Date</span>
              <span className="font-semibold text-secondary-700 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-primary-500" />
                {date}
              </span>
            </div>
            <div className="flex justify-between border-t border-secondary-100 pt-3 mt-1">
              <span className="font-bold text-secondary-800">Total Price</span>
              <span className="font-heading font-extrabold text-lg text-primary-600">{totalFormatted}</span>
            </div>
          </div>
        </div>

        {/* What's next */}
        <div className="bg-primary-50 border border-primary-100 rounded-2xl p-5 mb-8 text-left text-sm">
          <p className="font-bold text-primary-700 mb-2">What happens next?</p>
          <ol className="space-y-2 text-secondary-600">
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 bg-primary-500 text-white rounded-full text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
              Our team reviews your booking and matches you with an available cleaner.
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 bg-primary-500 text-white rounded-full text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
              We call you within 2 hours to confirm the appointment and take a 25% deposit.
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 bg-primary-500 text-white rounded-full text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
              Your cleaner arrives on the agreed date — sit back and enjoy a spotless home!
            </li>
          </ol>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/">
            <Button variant="outline" size="lg">Back to Home</Button>
          </Link>
          <a href="tel:08000123456">
            <Button size="lg">
              <Phone className="w-4 h-4" />
              Call Us Now
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
