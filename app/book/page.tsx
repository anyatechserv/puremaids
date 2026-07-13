'use client';

import { useState } from 'react';
import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import { SERVICES, EXTRAS, DEPOSIT_PERCENTAGE } from '@/lib/constants';
import { calcPrice, formatGBP } from '@/lib/pricing';
import { supabase } from '@/lib/supabase-client';
import { createBookingCheckout } from '@/lib/stripe-api';
import Spinner from '@/components/ui/Spinner';

type Step = 'service' | 'details' | 'payment';

interface BookingForm {
  serviceType: string;
  extras: string[];
  propertySize: string;
  frequency: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  postcode: string;
  preferredDate: string;
  preferredTime: string;
  instructions: string;
  gdprConsent: boolean;
}

const PROPERTY_SIZES = ['Studio', '1 bedroom', '2 bedrooms', '3 bedrooms', '4 bedrooms', '5+ bedrooms'];
const FREQUENCIES = [
  { value: 'one_off', label: 'One-off' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'fortnightly', label: 'Fortnightly' },
  { value: 'monthly', label: 'Monthly' },
];
const TIME_SLOTS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];

const INITIAL: BookingForm = {
  serviceType: '', extras: [], propertySize: '2 bedrooms', frequency: 'one_off',
  firstName: '', lastName: '', email: '', phone: '',
  address: '', postcode: '', preferredDate: '', preferredTime: '09:00',
  instructions: '', gdprConsent: false,
};

export default function BookPage() {
  const [step, setStep] = useState<Step>('service');
  const [form, setForm] = useState<BookingForm>(INITIAL);
  const [errors, setErrors] = useState<Partial<Record<keyof BookingForm, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const pricing = form.serviceType ? calcPrice(form.serviceType, form.extras) : null;

  function set<K extends keyof BookingForm>(k: K, v: BookingForm[K]) {
    setForm(f => ({ ...f, [k]: v }));
    if (errors[k]) setErrors(e => ({ ...e, [k]: undefined }));
  }

  function toggleExtra(key: string) {
    set('extras', form.extras.includes(key)
      ? form.extras.filter(e => e !== key)
      : [...form.extras, key]);
  }

  function validateService(): boolean {
    const e: typeof errors = {};
    if (!form.serviceType) e.serviceType = 'Please select a service';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function validateDetails(): boolean {
    const e: typeof errors = {};
    if (!form.firstName.trim()) e.firstName = 'Required';
    if (!form.lastName.trim()) e.lastName = 'Required';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Enter a valid email';
    if (!form.phone.trim()) e.phone = 'Required';
    if (!form.address.trim()) e.address = 'Required';
    if (!form.postcode.trim()) e.postcode = 'Required';
    if (!form.preferredDate) e.preferredDate = 'Please choose a date';
    if (!form.gdprConsent) e.gdprConsent = 'You must agree to proceed';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function goToDetails() {
    if (validateService()) setStep('details');
  }

  async function handleSubmit(paymentType: 'deposit' | 'full') {
    if (!validateDetails()) return;
    if (!pricing) return;
    setSubmitting(true);
    setSubmitError(null);

    try {
      // Insert booking record
      const { data: booking, error } = await supabase
        .from('bookings')
        .insert({
          first_name: form.firstName,
          last_name: form.lastName,
          email: form.email,
          phone: form.phone,
          address: form.address,
          postcode: form.postcode.toUpperCase(),
          service_type: form.serviceType,
          property_size: form.propertySize,
          frequency: form.frequency,
          preferred_date: form.preferredDate,
          preferred_time: form.preferredTime,
          special_instructions: form.instructions || null,
          gdpr_consent: form.gdprConsent,
          base_price_pence: pricing.basePence,
          extras_price_pence: pricing.extrasPence,
          total_price_pence: pricing.totalPence,
          deposit_amount_pence: pricing.depositPence,
          status: 'pending',
        })
        .select('id, reference')
        .single();

      if (error || !booking) throw new Error(error?.message ?? 'Booking failed');

      // Insert extras
      if (form.extras.length > 0) {
        await supabase.from('booking_extras').insert(
          form.extras.map(key => ({
            booking_id: booking.id,
            name: EXTRAS[key as keyof typeof EXTRAS]?.label ?? key,
            price_pence: EXTRAS[key as keyof typeof EXTRAS]?.pence ?? 0,
          }))
        );
      }

      const svc = SERVICES[form.serviceType as keyof typeof SERVICES];
      const url = await createBookingCheckout({
        bookingId: booking.id,
        bookingReference: booking.reference,
        serviceType: form.serviceType,
        serviceLabel: svc.label,
        totalPricePence: pricing.totalPence,
        depositPence: pricing.depositPence,
        customerEmail: form.email,
        customerName: `${form.firstName} ${form.lastName}`,
        paymentType,
      });

      window.location.href = url;
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong');
      setSubmitting(false);
    }
  }

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <>
      <Nav />
      <main id="main-content" className="min-h-screen bg-gray-50 pt-20">
        <div className="container py-10">
          <div className="mx-auto max-w-3xl">
            {/* Progress */}
            <nav aria-label="Booking progress" className="mb-8">
              <ol className="flex items-center gap-2">
                {(['service', 'details', 'payment'] as Step[]).map((s, i) => (
                  <li key={s} className="flex items-center gap-2">
                    {i > 0 && <div className="h-px flex-1 bg-gray-300 w-8" aria-hidden="true" />}
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                      s === step ? 'bg-brand-600 text-white'
                      : (i < ['service','details','payment'].indexOf(step)) ? 'bg-brand-100 text-brand-700'
                      : 'bg-gray-200 text-gray-400'
                    }`} aria-current={s === step ? 'step' : undefined}>
                      {i + 1}
                    </div>
                    <span className={`text-sm font-medium capitalize ${s === step ? 'text-brand-700' : 'text-gray-400'}`}>
                      {s === 'service' ? 'Choose service' : s === 'details' ? 'Your details' : 'Confirm & pay'}
                    </span>
                  </li>
                ))}
              </ol>
            </nav>

            {/* Step 1: Service */}
            {step === 'service' && (
              <div className="animate-fade-in">
                <h1 className="font-display text-2xl font-bold text-gray-900 sm:text-3xl">What service do you need?</h1>
                <p className="mt-2 text-gray-600">Choose your cleaning service and any extras.</p>

                {errors.serviceType && <p className="alert alert-error mt-4" role="alert">{errors.serviceType}</p>}

                <fieldset className="mt-6">
                  <legend className="sr-only">Select a cleaning service</legend>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {Object.entries(SERVICES).map(([key, svc]) => (
                      <label
                        key={key}
                        className={`card cursor-pointer p-5 transition-all hover:shadow-md ${
                          form.serviceType === key ? 'ring-2 ring-brand-500 bg-brand-50' : ''
                        }`}
                      >
                        <input
                          type="radio"
                          name="serviceType"
                          value={key}
                          checked={form.serviceType === key}
                          onChange={() => set('serviceType', key)}
                          className="sr-only"
                        />
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-2xl" aria-hidden="true">{svc.icon}</span>
                            <p className="mt-2 font-semibold text-gray-900">{svc.label}</p>
                            <p className="mt-1 text-sm text-gray-600">{svc.description}</p>
                          </div>
                          <div className={`mt-1 h-5 w-5 flex-shrink-0 rounded-full border-2 transition-colors ${form.serviceType === key ? 'border-brand-500 bg-brand-500' : 'border-gray-300'}`} aria-hidden="true" />
                        </div>
                        <p className="mt-3 text-sm font-bold text-brand-600">from {formatGBP(svc.basePence)}</p>
                      </label>
                    ))}
                  </div>
                </fieldset>

                {/* Extras */}
                {form.serviceType && (
                  <div className="mt-6">
                    <h3 className="label">Optional extras</h3>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {Object.entries(EXTRAS).map(([key, extra]) => (
                        <label key={key} className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition ${form.extras.includes(key) ? 'border-brand-400 bg-brand-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={form.extras.includes(key)}
                              onChange={() => toggleExtra(key)}
                              className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                            />
                            <span className="text-sm font-medium text-gray-900">{extra.label}</span>
                          </div>
                          <span className="text-sm font-semibold text-brand-600">+{formatGBP(extra.pence)}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Property + frequency */}
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="propertySize" className="label">Property size</label>
                    <select id="propertySize" value={form.propertySize} onChange={e => set('propertySize', e.target.value)} className="input">
                      {PROPERTY_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="frequency" className="label">How often?</label>
                    <select id="frequency" value={form.frequency} onChange={e => set('frequency', e.target.value)} className="input">
                      {FREQUENCIES.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                    </select>
                  </div>
                </div>

                {/* Price preview */}
                {pricing && (
                  <div className="mt-6 rounded-2xl bg-brand-50 p-5 border border-brand-100">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Service</span>
                      <span className="font-medium">{formatGBP(pricing.basePence)}</span>
                    </div>
                    {pricing.extrasPence > 0 && (
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-gray-600">Extras</span>
                        <span className="font-medium">{formatGBP(pricing.extrasPence)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold mt-2 pt-2 border-t border-brand-200">
                      <span>Total</span>
                      <span className="text-brand-700">{formatGBP(pricing.totalPence)}</span>
                    </div>
                    <p className="mt-2 text-xs text-brand-600">Secure your booking with just {formatGBP(pricing.depositPence)} ({DEPOSIT_PERCENTAGE}% deposit)</p>
                  </div>
                )}

                <button onClick={goToDetails} disabled={!form.serviceType} className="btn btn-lg btn-primary w-full mt-6">
                  Continue to Your Details →
                </button>
              </div>
            )}

            {/* Step 2: Details */}
            {step === 'details' && (
              <div className="animate-fade-in">
                <button onClick={() => setStep('service')} className="btn btn-sm btn-ghost mb-4 -ml-2">
                  ← Back
                </button>
                <h2 className="font-display text-2xl font-bold text-gray-900">Your details</h2>
                <p className="mt-1 text-gray-600">We need these to confirm your booking.</p>

                <div className="mt-6 space-y-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="firstName" className="label">First name</label>
                      <input id="firstName" type="text" value={form.firstName} onChange={e => set('firstName', e.target.value)} className={`input ${errors.firstName ? 'input-error' : ''}`} autoComplete="given-name" required />
                      {errors.firstName && <p className="field-error" role="alert">{errors.firstName}</p>}
                    </div>
                    <div>
                      <label htmlFor="lastName" className="label">Last name</label>
                      <input id="lastName" type="text" value={form.lastName} onChange={e => set('lastName', e.target.value)} className={`input ${errors.lastName ? 'input-error' : ''}`} autoComplete="family-name" required />
                      {errors.lastName && <p className="field-error" role="alert">{errors.lastName}</p>}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className="label">Email address</label>
                    <input id="email" type="email" value={form.email} onChange={e => set('email', e.target.value)} className={`input ${errors.email ? 'input-error' : ''}`} autoComplete="email" required />
                    {errors.email && <p className="field-error" role="alert">{errors.email}</p>}
                  </div>
                  <div>
                    <label htmlFor="phone" className="label">Phone number</label>
                    <input id="phone" type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} className={`input ${errors.phone ? 'input-error' : ''}`} autoComplete="tel" required />
                    {errors.phone && <p className="field-error" role="alert">{errors.phone}</p>}
                  </div>
                  <div>
                    <label htmlFor="address" className="label">Address</label>
                    <input id="address" type="text" value={form.address} onChange={e => set('address', e.target.value)} className={`input ${errors.address ? 'input-error' : ''}`} autoComplete="street-address" required />
                    {errors.address && <p className="field-error" role="alert">{errors.address}</p>}
                  </div>
                  <div>
                    <label htmlFor="postcode" className="label">Postcode</label>
                    <input id="postcode" type="text" value={form.postcode} onChange={e => set('postcode', e.target.value.toUpperCase())} className={`input sm:max-w-[200px] ${errors.postcode ? 'input-error' : ''}`} autoComplete="postal-code" required />
                    {errors.postcode && <p className="field-error" role="alert">{errors.postcode}</p>}
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="preferredDate" className="label">Preferred date</label>
                      <input id="preferredDate" type="date" value={form.preferredDate} min={minDate} onChange={e => set('preferredDate', e.target.value)} className={`input ${errors.preferredDate ? 'input-error' : ''}`} required />
                      {errors.preferredDate && <p className="field-error" role="alert">{errors.preferredDate}</p>}
                    </div>
                    <div>
                      <label htmlFor="preferredTime" className="label">Preferred time</label>
                      <select id="preferredTime" value={form.preferredTime} onChange={e => set('preferredTime', e.target.value)} className="input">
                        {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="instructions" className="label">Special instructions <span className="font-normal text-gray-400">(optional)</span></label>
                    <textarea id="instructions" rows={3} value={form.instructions} onChange={e => set('instructions', e.target.value)} className="input resize-none" placeholder="Any access notes, areas to focus on, pets, etc." />
                  </div>

                  {/* GDPR */}
                  <div>
                    <label className={`flex items-start gap-3 cursor-pointer`}>
                      <input
                        type="checkbox"
                        checked={form.gdprConsent}
                        onChange={e => set('gdprConsent', e.target.checked)}
                        className={`mt-0.5 h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500 ${errors.gdprConsent ? 'border-error-500' : ''}`}
                        required
                      />
                      <span className="text-sm text-gray-600">
                        I agree to the <a href="/privacy" className="text-brand-600 underline">Privacy Policy</a> and{' '}
                        <a href="/terms" className="text-brand-600 underline">Terms & Conditions</a>.
                        My data will be used to process this booking and provide the requested services.
                      </span>
                    </label>
                    {errors.gdprConsent && <p className="field-error mt-1" role="alert">{errors.gdprConsent}</p>}
                  </div>
                </div>

                <button onClick={() => { if (validateDetails()) setStep('payment'); }} className="btn btn-lg btn-primary w-full mt-8">
                  Review & Pay →
                </button>
              </div>
            )}

            {/* Step 3: Payment */}
            {step === 'payment' && pricing && (
              <div className="animate-fade-in">
                <button onClick={() => setStep('details')} className="btn btn-sm btn-ghost mb-4 -ml-2">
                  ← Back
                </button>
                <h2 className="font-display text-2xl font-bold text-gray-900">Confirm & Pay</h2>
                <p className="mt-1 text-gray-600">Review your booking and choose how to pay.</p>

                {/* Summary */}
                <div className="mt-6 card p-6 space-y-3 text-sm">
                  <h3 className="font-semibold text-gray-900">Booking summary</h3>
                  {[
                    { label: 'Service', value: SERVICES[form.serviceType as keyof typeof SERVICES]?.label },
                    { label: 'Property', value: form.propertySize },
                    { label: 'Frequency', value: FREQUENCIES.find(f => f.value === form.frequency)?.label },
                    { label: 'Date', value: `${form.preferredDate} at ${form.preferredTime}` },
                    { label: 'Address', value: `${form.address}, ${form.postcode}` },
                    { label: 'Name', value: `${form.firstName} ${form.lastName}` },
                    { label: 'Email', value: form.email },
                  ].map(row => (
                    <div key={row.label} className="flex justify-between">
                      <span className="text-gray-500">{row.label}</span>
                      <span className="font-medium text-gray-900 text-right max-w-[60%]">{row.value}</span>
                    </div>
                  ))}
                  {form.extras.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Extras</span>
                      <span className="font-medium text-right">{form.extras.map(k => EXTRAS[k as keyof typeof EXTRAS]?.label).join(', ')}</span>
                    </div>
                  )}
                  <div className="border-t pt-3 flex justify-between font-bold text-base">
                    <span>Total</span>
                    <span className="text-brand-700">{formatGBP(pricing.totalPence)}</span>
                  </div>
                </div>

                {submitError && (
                  <div className="alert alert-error mt-4" role="alert">
                    <svg className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {submitError}
                  </div>
                )}

                <div className="mt-6 space-y-3">
                  <button
                    onClick={() => handleSubmit('deposit')}
                    disabled={submitting}
                    className="btn btn-lg btn-primary w-full"
                  >
                    {submitting ? <><Spinner size="sm" /> Processing…</> : `Pay ${DEPOSIT_PERCENTAGE}% Deposit — ${formatGBP(pricing.depositPence)}`}
                  </button>
                  <button
                    onClick={() => handleSubmit('full')}
                    disabled={submitting}
                    className="btn btn-lg btn-secondary w-full"
                  >
                    {submitting ? <><Spinner size="sm" /> Processing…</> : `Pay in Full — ${formatGBP(pricing.totalPence)}`}
                  </button>
                </div>

                <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-400">
                  <span>🔒 Secured by Stripe</span>
                  <span>💳 Card · Apple Pay · Google Pay</span>
                  <span>✅ Money-back guarantee</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
