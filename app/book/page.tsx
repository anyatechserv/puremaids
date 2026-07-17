'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SERVICES, EXTRAS, SERVICE_KEYS, EXTRA_KEYS, TIME_SLOTS } from '@/lib/constants';
import { calcPrice, formatGBP } from '@/lib/pricing';
import { sanitizeBookingInput } from '@/lib/validation';
import { getSupabaseBrowserClient } from '@/lib/supabase-client';
import { createCheckoutSession } from '@/lib/stripe-api';

type Step = 1 | 2 | 3;

export default function BookingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [serviceType, setServiceType] = useState<string>('');
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [frequency, setFrequency] = useState('one_off');
  const [propertySize, setPropertySize] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [formData, setFormData] = useState({
    first_name: '', last_name: '', email: '', phone: '', address: '', postcode: '',
    special_instructions: '', gdpr_consent: false,
  });
  const [paymentType, setPaymentType] = useState<'deposit' | 'full'>('deposit');

  const price = serviceType ? calcPrice(serviceType, selectedExtras) : null;

  function toggleExtra(key: string) {
    setSelectedExtras(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const sanitized = sanitizeBookingInput({
        ...formData,
        service_type: serviceType,
        extras: selectedExtras,
        frequency,
        property_size: propertySize,
        preferred_date: preferredDate,
        preferred_time: preferredTime,
        payment_type: paymentType,
      });

      const supabase = getSupabaseBrowserClient();
      const { data: booking, error: dbError } = await supabase
        .from('bookings')
        .insert({
          first_name: sanitized.first_name,
          last_name: sanitized.last_name,
          email: sanitized.email,
          phone: sanitized.phone,
          address: sanitized.address,
          postcode: sanitized.postcode,
          service_type: sanitized.service_type,
          property_size: sanitized.property_size || null,
          frequency: sanitized.frequency,
          preferred_date: sanitized.preferred_date,
          preferred_time: sanitized.preferred_time,
          special_instructions: sanitized.special_instructions || null,
          gdpr_consent: sanitized.gdpr_consent,
          status: 'pending',
          base_price_pence: price!.basePence,
          extras_price_pence: price!.extrasPence,
          total_price_pence: price!.totalPence,
          deposit_amount_pence: price!.depositPence,
          deposit_paid: false,
        })
        .select('id, reference')
        .single();

      if (dbError || !booking) throw new Error(dbError?.message || 'Failed to create booking');

      if (sanitized.extras.length > 0) {
        const extrasRows = sanitized.extras.map(key => ({
          booking_id: booking.id,
          name: EXTRAS[key as keyof typeof EXTRAS]?.label || key,
          price_pence: EXTRAS[key as keyof typeof EXTRAS]?.pence || 0,
        }));
        await supabase.from('booking_extras').insert(extrasRows);
      }

      const session = await createCheckoutSession({
        bookingId: booking.id,
        bookingReference: booking.reference || `PM-${booking.id.slice(0, 8).toUpperCase()}`,
        serviceType: sanitized.service_type,
        serviceLabel: SERVICES[serviceType as keyof typeof SERVICES]?.label || sanitized.service_type,
        totalPricePence: price!.totalPence,
        depositPence: paymentType === 'deposit' ? price!.depositPence : price!.totalPence,
        customerEmail: sanitized.email,
        customerName: `${sanitized.first_name} ${sanitized.last_name}`,
        paymentType: sanitized.payment_type,
      });

      router.push(session.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setStep(3);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="section py-12">
      <div className="mx-auto max-w-2xl">
        <h1 className="heading-1 mb-2 text-3xl">Book Your Cleaning</h1>
        <div className="mb-8 flex items-center gap-2">
          {[1, 2, 3].map(s => (
            <div key={s} className={`h-2 flex-1 rounded-full ${step >= s ? 'bg-brand-600' : 'bg-gray-200'}`} />
          ))}
        </div>

        {error && <div className="alert-error mb-4">{error}</div>}

        {step === 1 && (
          <div className="card animate-slide-up">
            <h2 className="heading-3 mb-6">Select Your Service</h2>
            <div className="space-y-3 mb-6">
              {SERVICE_KEYS.map(key => (
                <label key={key} className={`block cursor-pointer rounded-lg border-2 p-4 transition-all ${serviceType === key ? 'border-brand-600 bg-brand-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input type="radio" name="service" value={key} className="sr-only" onChange={() => setServiceType(key)} />
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{SERVICES[key].label}</p>
                      <p className="text-sm text-gray-500">{SERVICES[key].description}</p>
                    </div>
                    <p className="font-bold text-brand-600">from {formatGBP(SERVICES[key].basePence)}</p>
                  </div>
                </label>
              ))}
            </div>

            <h3 className="font-semibold mb-3">Optional Extras</h3>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {EXTRA_KEYS.map(key => (
                <label key={key} className={`flex items-center gap-2 rounded-lg border p-3 cursor-pointer ${selectedExtras.includes(key) ? 'border-brand-600 bg-brand-50' : 'border-gray-200'}`}>
                  <input type="checkbox" className="accent-brand-600" checked={selectedExtras.includes(key)} onChange={() => toggleExtra(key)} />
                  <span className="text-sm">{EXTRAS[key].label} (+{formatGBP(EXTRAS[key].pence)})</span>
                </label>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="label">Frequency</label>
                <select className="input" value={frequency} onChange={e => setFrequency(e.target.value)}>
                  <option value="one_off">One-off</option>
                  <option value="weekly">Weekly</option>
                  <option value="fortnightly">Fortnightly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <div>
                <label className="label">Property Size</label>
                <select className="input" value={propertySize} onChange={e => setPropertySize(e.target.value)}>
                  <option value="">Select...</option>
                  <option value="1_bed">1 Bedroom</option>
                  <option value="2_bed">2 Bedrooms</option>
                  <option value="3_bed">3 Bedrooms</option>
                  <option value="4_bed">4+ Bedrooms</option>
                </select>
              </div>
            </div>

            {price && (
              <div className="mb-6 rounded-lg bg-brand-50 p-4">
                <div className="flex justify-between text-sm mb-1"><span>Base price</span><span>{formatGBP(price.basePence)}</span></div>
                {price.extrasPence > 0 && <div className="flex justify-between text-sm mb-1"><span>Extras</span><span>{formatGBP(price.extrasPence)}</span></div>}
                <div className="flex justify-between font-bold pt-2 border-t border-brand-200"><span>Total</span><span>{formatGBP(price.totalPence)}</span></div>
                <div className="flex justify-between text-sm text-brand-700 mt-1"><span>Deposit (20%)</span><span>{formatGBP(price.depositPence)}</span></div>
              </div>
            )}

            <button className="btn-primary w-full" disabled={!serviceType} onClick={() => setStep(2)}>Continue</button>
          </div>
        )}

        {step === 2 && (
          <div className="card animate-slide-up">
            <h2 className="heading-3 mb-6">Your Details</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div><label className="label">First Name</label><input className="input" value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} maxLength={50} /></div>
              <div><label className="label">Last Name</label><input className="input" value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} maxLength={50} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div><label className="label">Email</label><input type="email" className="input" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} maxLength={254} /></div>
              <div><label className="label">Phone</label><input type="tel" className="input" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} maxLength={20} /></div>
            </div>
            <div className="mb-4"><label className="label">Address</label><input className="input" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} maxLength={200} /></div>
            <div className="mb-4"><label className="label">Postcode</label><input className="input" value={formData.postcode} onChange={e => setFormData({...formData, postcode: e.target.value})} maxLength={10} /></div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div><label className="label">Preferred Date</label><input type="date" className="input" value={preferredDate} onChange={e => setPreferredDate(e.target.value)} min={new Date().toISOString().split('T')[0]} /></div>
              <div><label className="label">Preferred Time</label><select className="input" value={preferredTime} onChange={e => setPreferredTime(e.target.value)}><option value="">Select...</option>{TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
            </div>
            <div className="mb-4"><label className="label">Special Instructions (optional)</label><textarea className="input" rows={3} value={formData.special_instructions} onChange={e => setFormData({...formData, special_instructions: e.target.value})} maxLength={1000} /></div>
            <label className="flex items-start gap-2 mb-6">
              <input type="checkbox" className="mt-1 accent-brand-600" checked={formData.gdpr_consent} onChange={e => setFormData({...formData, gdpr_consent: e.target.checked})} />
              <span className="text-sm text-gray-600">I agree to the <a href="/privacy" className="text-brand-600 underline">Privacy Policy</a> and processing of my data.</span>
            </label>
            <div className="flex gap-4">
              <button className="btn-secondary" onClick={() => setStep(1)}>Back</button>
              <button className="btn-primary flex-1" disabled={!formData.first_name || !formData.email || !formData.gdpr_consent || !preferredDate || !preferredTime} onClick={() => setStep(3)}>Continue to Payment</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="card animate-slide-up">
            <h2 className="heading-3 mb-6">Payment</h2>
            {price && (
              <div className="mb-6 rounded-lg bg-gray-50 p-4">
                <div className="flex justify-between font-bold mb-2"><span>Total</span><span>{formatGBP(price.totalPence)}</span></div>
              </div>
            )}
            <div className="space-y-3 mb-6">
              <label className={`block cursor-pointer rounded-lg border-2 p-4 ${paymentType === 'deposit' ? 'border-brand-600 bg-brand-50' : 'border-gray-200'}`}>
                <input type="radio" name="payment" className="sr-only" checked={paymentType === 'deposit'} onChange={() => setPaymentType('deposit')} />
                <div className="flex justify-between"><span className="font-medium">Pay Deposit (20%)</span><span className="font-bold">{price ? formatGBP(price.depositPence) : ''}</span></div>
              </label>
              <label className={`block cursor-pointer rounded-lg border-2 p-4 ${paymentType === 'full' ? 'border-brand-600 bg-brand-50' : 'border-gray-200'}`}>
                <input type="radio" name="payment" className="sr-only" checked={paymentType === 'full'} onChange={() => setPaymentType('full')} />
                <div className="flex justify-between"><span className="font-medium">Pay in Full</span><span className="font-bold">{price ? formatGBP(price.totalPence) : ''}</span></div>
              </label>
            </div>
            <div className="flex gap-4">
              <button className="btn-secondary" onClick={() => setStep(2)}>Back</button>
              <button className="btn-primary flex-1" disabled={submitting} onClick={handleSubmit}>
                {submitting ? 'Processing...' : 'Pay and Confirm Booking'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
