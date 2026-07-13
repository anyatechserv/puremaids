'use client';

import { useState } from 'react';
import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import Spinner from '@/components/ui/Spinner';
import { SERVICES, EXTRAS, PROPERTY_SIZES, FREQUENCIES, TIME_SLOTS, DEPOSIT_PCT } from '@/lib/constants';
import { calcPrice, fmt } from '@/lib/pricing';
import { supabase } from '@/lib/supabase-client';
import { createBookingCheckout } from '@/lib/stripe-api';

type Step = 'service' | 'details' | 'payment';

interface Form {
  serviceType: string;  extras: string[];   propertySize: string; frequency: string;
  firstName: string;    lastName: string;   email: string;        phone: string;
  address: string;      postcode: string;   preferredDate: string; preferredTime: string;
  instructions: string; gdpr: boolean;
}

type Errs = Partial<Record<keyof Form, string>>;

const INIT: Form = {
  serviceType: '', extras: [], propertySize: '2 bedrooms', frequency: 'one_off',
  firstName: '', lastName: '', email: '', phone: '',
  address: '', postcode: '', preferredDate: '', preferredTime: '09:00',
  instructions: '', gdpr: false,
};

export default function BookPage() {
  const [step,       setStep]       = useState<Step>('service');
  const [form,       setForm]       = useState<Form>(INIT);
  const [errs,       setErrs]       = useState<Errs>({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError,   setApiError]   = useState<string | null>(null);

  const pricing = form.serviceType ? calcPrice(form.serviceType, form.extras) : null;

  function set<K extends keyof Form>(k: K, v: Form[K]) {
    setForm(f => ({ ...f, [k]: v }));
    if (errs[k]) setErrs(e => ({ ...e, [k]: undefined }));
  }

  function toggleExtra(k: string) {
    set('extras', form.extras.includes(k) ? form.extras.filter(x => x !== k) : [...form.extras, k]);
  }

  function validateService(): boolean {
    const e: Errs = {};
    if (!form.serviceType) e.serviceType = 'Please select a service';
    setErrs(e); return Object.keys(e).length === 0;
  }

  function validateDetails(): boolean {
    const e: Errs = {};
    if (!form.firstName.trim())                               e.firstName     = 'Required';
    if (!form.lastName.trim())                                e.lastName      = 'Required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))      e.email         = 'Enter a valid email address';
    if (!form.phone.trim())                                   e.phone         = 'Required';
    if (!form.address.trim())                                 e.address       = 'Required';
    if (!form.postcode.trim())                                e.postcode      = 'Required';
    if (!form.preferredDate)                                  e.preferredDate = 'Please choose a date';
    if (!form.gdpr)                                           e.gdpr          = 'You must agree to continue';
    setErrs(e); return Object.keys(e).length === 0;
  }

  async function pay(paymentType: 'deposit' | 'full') {
    if (!validateDetails() || !pricing) return;
    setSubmitting(true);
    setApiError(null);
    try {
      const { data: booking, error } = await supabase
        .from('bookings')
        .insert({
          first_name: form.firstName,       last_name: form.lastName,
          email: form.email,                phone: form.phone,
          address: form.address,            postcode: form.postcode.toUpperCase(),
          service_type: form.serviceType,   property_size: form.propertySize,
          frequency: form.frequency,        preferred_date: form.preferredDate,
          preferred_time: form.preferredTime,
          special_instructions: form.instructions || null,
          gdpr_consent: form.gdpr,
          base_price_pence:    pricing.basePence,
          extras_price_pence:  pricing.extrasPence,
          total_price_pence:   pricing.totalPence,
          deposit_amount_pence: pricing.depositPence,
          status: 'pending',
        })
        .select('id, reference')
        .single();

      if (error || !booking) throw new Error(error?.message ?? 'Booking failed');

      if (form.extras.length) {
        await supabase.from('booking_extras').insert(
          form.extras.map(k => ({
            booking_id: booking.id,
            name: EXTRAS[k as keyof typeof EXTRAS]?.label ?? k,
            price_pence: EXTRAS[k as keyof typeof EXTRAS]?.pence ?? 0,
          }))
        );
      }

      const svc = SERVICES[form.serviceType as keyof typeof SERVICES];
      const url = await createBookingCheckout({
        bookingId: booking.id, bookingReference: booking.reference,
        serviceType: form.serviceType, serviceLabel: svc.label,
        totalPricePence: pricing.totalPence, depositPence: pricing.depositPence,
        customerEmail: form.email, customerName: `${form.firstName} ${form.lastName}`,
        paymentType,
      });
      window.location.href = url;
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Something went wrong');
      setSubmitting(false);
    }
  }

  const minDate = (() => { const d = new Date(); d.setDate(d.getDate() + 1); return d.toISOString().split('T')[0]; })();

  const STEP_LABELS: Record<Step, string> = { service: 'Choose service', details: 'Your details', payment: 'Confirm & pay' };
  const STEPS: Step[] = ['service', 'details', 'payment'];

  return (
    <>
      <Nav />
      <main id="main-content" className="min-h-screen bg-gray-50 pt-20">
        <div className="container py-10">
          <div className="mx-auto max-w-2xl">

            {/* Progress indicator */}
            <nav aria-label="Booking steps" className="mb-8">
              <ol className="flex items-center gap-2 sm:gap-3">
                {STEPS.map((s, i) => {
                  const active = s === step;
                  const done   = STEPS.indexOf(step) > i;
                  return (
                    <li key={s} className="flex items-center gap-2">
                      {i > 0 && <div className={`h-px w-6 sm:w-10 ${done ? 'bg-brand-500' : 'bg-gray-200'}`} aria-hidden="true" />}
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-colors shrink-0
                          ${active ? 'bg-brand-600 text-white' : done ? 'bg-brand-100 text-brand-700' : 'bg-gray-200 text-gray-400'}`}
                        aria-current={active ? 'step' : undefined}
                      >
                        {done ? '✓' : i + 1}
                      </div>
                      <span className={`hidden text-sm font-medium sm:block ${active ? 'text-brand-700' : 'text-gray-400'}`}>
                        {STEP_LABELS[s]}
                      </span>
                    </li>
                  );
                })}
              </ol>
            </nav>

            {/* ── Step 1: Service ── */}
            {step === 'service' && (
              <div className="animate-fade-in">
                <h1 className="font-display text-2xl font-bold text-gray-900 sm:text-3xl">What service do you need?</h1>
                <p className="mt-1 text-gray-500">Select your cleaning service and any optional extras.</p>

                {errs.serviceType && <p className="alert alert-error mt-4" role="alert">{errs.serviceType}</p>}

                <fieldset className="mt-6">
                  <legend className="sr-only">Select a cleaning service</legend>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {Object.entries(SERVICES).map(([key, svc]) => {
                      const selected = form.serviceType === key;
                      return (
                        <label
                          key={key}
                          className={`card cursor-pointer p-5 transition-all hover:shadow-md ${selected ? 'ring-2 ring-brand-500 bg-brand-50' : ''}`}
                        >
                          <input type="radio" name="serviceType" value={key} checked={selected} onChange={() => set('serviceType', key)} className="sr-only" />
                          <div className="flex items-start gap-3">
                            <span className="text-2xl mt-0.5" aria-hidden="true">{svc.icon}</span>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-900">{svc.label}</p>
                              <p className="mt-0.5 text-sm text-gray-500">{svc.description}</p>
                              <p className="mt-2 text-sm font-bold text-brand-600">from {fmt(svc.basePence)}</p>
                            </div>
                            <div className={`mt-1 h-5 w-5 shrink-0 rounded-full border-2 transition-colors ${selected ? 'border-brand-500 bg-brand-500' : 'border-gray-300'}`} aria-hidden="true" />
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>

                {form.serviceType && (
                  <fieldset className="mt-6">
                    <legend className="label">Optional extras</legend>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {Object.entries(EXTRAS).map(([k, ex]) => {
                        const checked = form.extras.includes(k);
                        return (
                          <label key={k} className={`flex cursor-pointer items-center justify-between rounded-xl border p-3.5 transition ${checked ? 'border-brand-400 bg-brand-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                            <span className="flex items-center gap-3">
                              <input type="checkbox" checked={checked} onChange={() => toggleExtra(k)} className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
                              <span className="text-sm font-medium text-gray-900">{ex.label}</span>
                            </span>
                            <span className="text-sm font-semibold text-brand-600">+{fmt(ex.pence)}</span>
                          </label>
                        );
                      })}
                    </div>
                  </fieldset>
                )}

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="propertySize" className="label">Property size</label>
                    <select id="propertySize" value={form.propertySize} onChange={e => set('propertySize', e.target.value)} className="input">
                      {PROPERTY_SIZES.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="frequency" className="label">How often?</label>
                    <select id="frequency" value={form.frequency} onChange={e => set('frequency', e.target.value)} className="input">
                      {FREQUENCIES.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                    </select>
                  </div>
                </div>

                {pricing && (
                  <div className="mt-5 rounded-2xl bg-brand-50 border border-brand-100 p-5">
                    <div className="space-y-1.5 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Service</span>
                        <span className="font-medium">{fmt(pricing.basePence)}</span>
                      </div>
                      {pricing.extrasPence > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Extras</span>
                          <span className="font-medium">{fmt(pricing.extrasPence)}</span>
                        </div>
                      )}
                      <div className="flex justify-between border-t border-brand-200 pt-2 font-bold">
                        <span>Total</span>
                        <span className="text-brand-700">{fmt(pricing.totalPence)}</span>
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-brand-600">Secure with a {DEPOSIT_PCT}% deposit ({fmt(pricing.depositPence)})</p>
                  </div>
                )}

                <button onClick={() => { if (validateService()) setStep('details'); }} disabled={!form.serviceType} className="btn btn-lg btn-primary w-full mt-6">
                  Continue to Your Details →
                </button>
              </div>
            )}

            {/* ── Step 2: Details ── */}
            {step === 'details' && (
              <div className="animate-fade-in">
                <button onClick={() => setStep('service')} className="btn btn-sm btn-ghost mb-5 -ml-2">← Back</button>
                <h2 className="font-display text-2xl font-bold text-gray-900">Your details</h2>
                <p className="mt-1 text-gray-500">We'll use these to confirm your booking.</p>

                <div className="mt-6 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {[
                      { id: 'firstName', label: 'First name', ac: 'given-name',   val: form.firstName,  key: 'firstName'  as keyof Form },
                      { id: 'lastName',  label: 'Last name',  ac: 'family-name',  val: form.lastName,   key: 'lastName'   as keyof Form },
                    ].map(f => (
                      <div key={f.id}>
                        <label htmlFor={f.id} className="label">{f.label}</label>
                        <input id={f.id} type="text" value={f.val as string} onChange={e => set(f.key, e.target.value)} autoComplete={f.ac} required className={`input ${errs[f.key] ? 'input-error' : ''}`} />
                        {errs[f.key] && <p className="field-error" role="alert">{errs[f.key]}</p>}
                      </div>
                    ))}
                  </div>
                  <div>
                    <label htmlFor="email" className="label">Email address</label>
                    <input id="email" type="email" value={form.email} onChange={e => set('email', e.target.value)} autoComplete="email" required className={`input ${errs.email ? 'input-error' : ''}`} />
                    {errs.email && <p className="field-error" role="alert">{errs.email}</p>}
                  </div>
                  <div>
                    <label htmlFor="phone" className="label">Phone number</label>
                    <input id="phone" type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} autoComplete="tel" required className={`input ${errs.phone ? 'input-error' : ''}`} />
                    {errs.phone && <p className="field-error" role="alert">{errs.phone}</p>}
                  </div>
                  <div>
                    <label htmlFor="address" className="label">Address</label>
                    <input id="address" type="text" value={form.address} onChange={e => set('address', e.target.value)} autoComplete="street-address" required className={`input ${errs.address ? 'input-error' : ''}`} />
                    {errs.address && <p className="field-error" role="alert">{errs.address}</p>}
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="postcode" className="label">Postcode</label>
                      <input id="postcode" type="text" value={form.postcode} onChange={e => set('postcode', e.target.value.toUpperCase())} autoComplete="postal-code" required className={`input ${errs.postcode ? 'input-error' : ''}`} />
                      {errs.postcode && <p className="field-error" role="alert">{errs.postcode}</p>}
                    </div>
                    <div />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="preferredDate" className="label">Preferred date</label>
                      <input id="preferredDate" type="date" value={form.preferredDate} min={minDate} onChange={e => set('preferredDate', e.target.value)} required className={`input ${errs.preferredDate ? 'input-error' : ''}`} />
                      {errs.preferredDate && <p className="field-error" role="alert">{errs.preferredDate}</p>}
                    </div>
                    <div>
                      <label htmlFor="preferredTime" className="label">Preferred time</label>
                      <select id="preferredTime" value={form.preferredTime} onChange={e => set('preferredTime', e.target.value)} className="input">
                        {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="instructions" className="label">
                      Special instructions <span className="font-normal text-gray-400">(optional)</span>
                    </label>
                    <textarea id="instructions" rows={3} value={form.instructions} onChange={e => set('instructions', e.target.value)} className="input resize-none" placeholder="Access notes, key location, pets, areas to focus on…" />
                  </div>

                  {/* GDPR consent */}
                  <div>
                    <label className="flex cursor-pointer items-start gap-3">
                      <input
                        type="checkbox"
                        checked={form.gdpr}
                        onChange={e => set('gdpr', e.target.checked)}
                        required
                        className={`mt-0.5 h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500 ${errs.gdpr ? 'border-red-400' : ''}`}
                        aria-describedby="gdpr-desc"
                      />
                      <span id="gdpr-desc" className="text-sm text-gray-600">
                        I agree to the{' '}
                        <a href="/privacy" target="_blank" className="text-brand-600 underline">Privacy Policy</a>{' '}
                        and{' '}
                        <a href="/terms" target="_blank" className="text-brand-600 underline">Terms & Conditions</a>.
                        My data will be used to process this booking and provide the requested services.
                      </span>
                    </label>
                    {errs.gdpr && <p className="field-error mt-1" role="alert">{errs.gdpr}</p>}
                  </div>
                </div>

                <button onClick={() => { if (validateDetails()) setStep('payment'); }} className="btn btn-lg btn-primary w-full mt-8">
                  Review &amp; Pay →
                </button>
              </div>
            )}

            {/* ── Step 3: Payment ── */}
            {step === 'payment' && pricing && (
              <div className="animate-fade-in">
                <button onClick={() => setStep('details')} className="btn btn-sm btn-ghost mb-5 -ml-2">← Back</button>
                <h2 className="font-display text-2xl font-bold text-gray-900">Confirm &amp; Pay</h2>
                <p className="mt-1 text-gray-500">Review your booking details and choose how to pay.</p>

                <div className="mt-6 card p-5 space-y-2 text-sm">
                  <h3 className="font-semibold text-gray-900">Booking summary</h3>
                  {([
                    ['Service',   SERVICES[form.serviceType as keyof typeof SERVICES]?.label ?? ''],
                    ['Property',  form.propertySize],
                    ['Frequency', FREQUENCIES.find(f => f.value === form.frequency)?.label ?? ''],
                    ['Date',      `${form.preferredDate} at ${form.preferredTime}`],
                    ['Address',   `${form.address}, ${form.postcode}`],
                    ['Contact',   `${form.firstName} ${form.lastName} · ${form.email}`],
                    ...(form.extras.length ? [['Extras', form.extras.map(k => EXTRAS[k as keyof typeof EXTRAS]?.label ?? k).join(', ')]] : []),
                  ] as [string, string][]).map(([label, val]) => (
                    <div key={label} className="flex justify-between gap-4">
                      <span className="text-gray-500 shrink-0">{label}</span>
                      <span className="font-medium text-gray-900 text-right">{val}</span>
                    </div>
                  ))}
                  <div className="flex justify-between border-t pt-2 font-bold text-base">
                    <span>Total</span>
                    <span className="text-brand-700">{fmt(pricing.totalPence)}</span>
                  </div>
                </div>

                {apiError && (
                  <div className="alert alert-error mt-4" role="alert">
                    <svg className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {apiError}
                  </div>
                )}

                <div className="mt-6 space-y-3">
                  <button onClick={() => pay('deposit')} disabled={submitting} className="btn btn-lg btn-primary w-full">
                    {submitting ? <><Spinner size="sm" /> Redirecting to Stripe…</> : `Pay ${DEPOSIT_PCT}% Deposit — ${fmt(pricing.depositPence)}`}
                  </button>
                  <button onClick={() => pay('full')} disabled={submitting} className="btn btn-lg btn-secondary w-full">
                    {submitting ? <><Spinner size="sm" /> Redirecting to Stripe…</> : `Pay in Full — ${fmt(pricing.totalPence)}`}
                  </button>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-gray-400">
                  <span>🔒 Secured by Stripe</span>
                  <span>💳 Card · Apple Pay · Google Pay</span>
                  <span>✅ 100% satisfaction guarantee</span>
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
