'use client';

import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react'; // used in trust strip below
import BookingProgress from '@/components/booking/booking-progress';
import StepService from '@/components/booking/step-service';
import StepPostcode from '@/components/booking/step-postcode';
import StepProperty from '@/components/booking/step-property';
import StepSchedule from '@/components/booking/step-schedule';
import StepExtras from '@/components/booking/step-extras';
import StepDetails, { type DetailsFormData } from '@/components/booking/step-details';
import StepReview from '@/components/booking/step-review';
import {
  calcBasePrice,
  EXTRAS,
  type ServiceType,
  type PropertySize,
  type Frequency,
} from '@/lib/booking';

export default function BookingWizard() {
  const [step, setStep] = useState(1);

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

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseAnonKey) throw new Error('Configuration error');

    const extraRows = EXTRAS.filter((e) => extras.includes(e.key)).map((e) => ({
      name: e.label,
      price_pence: e.pricePence,
    }));

    const res = await fetch(`${supabaseUrl}/functions/v1/create-checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${supabaseAnonKey}`,
      },
      body: JSON.stringify({
        serviceType: service,
        propertySize: propertySize || null,
        frequency,
        preferredDate,
        preferredTime,
        address: details.address,
        postcode,
        firstName: details.firstName,
        lastName: details.lastName,
        email: details.email,
        phone: details.phone,
        specialInstructions: details.specialInstructions || null,
        gdprConsent: details.gdprConsent,
        basePricePence,
        extrasPricePence,
        totalPricePence,
        extras: extraRows,
        origin: window.location.origin,
      }),
    });

    const json = await res.json();
    if (!res.ok || json.error) throw new Error(json.error ?? 'Failed to create checkout');

    // Redirect to Stripe Checkout
    window.location.href = json.url;
  };

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


