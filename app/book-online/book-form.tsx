'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckCircle, ArrowRight, ArrowLeft, Calendar, Home, Sparkles, Key, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';

const services = [
  { key: 'domestic', label: 'Domestic Cleaning', icon: Home, description: 'Regular weekly or fortnightly', from: '£59' },
  { key: 'deep', label: 'Deep Cleaning', icon: Sparkles, description: 'Top-to-bottom thorough clean', from: '£129' },
  { key: 'end_of_tenancy', label: 'End of Tenancy', icon: Key, description: 'Deposit-back guaranteed', from: '£149' },
  { key: 'office', label: 'Office Cleaning', icon: Building2, description: 'Commercial & workplace cleaning', from: '£99' },
];

const propertySizes = [
  { key: 'studio', label: 'Studio / 1 Bed' },
  { key: '2bed', label: '2 Bedrooms' },
  { key: '3bed', label: '3 Bedrooms' },
  { key: '4bed', label: '4 Bedrooms' },
  { key: '5plus', label: '5+ Bedrooms' },
];

const frequencies = [
  { key: 'one_off', label: 'One-off clean' },
  { key: 'weekly', label: 'Weekly (save 10%)' },
  { key: 'fortnightly', label: 'Fortnightly (save 5%)' },
  { key: 'monthly', label: 'Monthly' },
];

const personalSchema = z.object({
  first_name: z.string().min(2, 'Required'),
  last_name: z.string().min(2, 'Required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(7, 'Phone required'),
  address: z.string().min(5, 'Address required'),
  postcode: z.string().min(3, 'Postcode required'),
  preferred_date: z.string().min(1, 'Date required'),
  preferred_time: z.string().min(1, 'Time required'),
  special_instructions: z.string().optional(),
  gdpr_consent: z.boolean().refine((v) => v, 'You must agree to continue'),
});

type PersonalData = z.infer<typeof personalSchema>;

export default function BookOnlineForm() {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedFrequency, setSelectedFrequency] = useState('one_off');
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PersonalData>({ resolver: zodResolver(personalSchema) });

  const onSubmit = async (data: PersonalData) => {
    setServerError('');
    try {
      const { error } = await supabase.from('bookings').insert({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        postcode: data.postcode,
        service_type: selectedService,
        property_size: selectedSize,
        frequency: selectedFrequency,
        preferred_date: data.preferred_date,
        preferred_time: data.preferred_time,
        special_instructions: data.special_instructions || null,
        gdpr_consent: data.gdpr_consent,
        status: 'pending',
      });
      if (error) throw error;
      setSubmitted(true);
    } catch (err: unknown) {
      setServerError('Something went wrong. Please try again or call us.');
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center py-20">
        <div className="text-center max-w-lg mx-auto px-4">
          <div className="w-20 h-20 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-accent-500" />
          </div>
          <h2 className="font-heading font-bold text-3xl text-secondary-800 mb-3">Booking Confirmed!</h2>
          <p className="text-secondary-500 leading-relaxed mb-5">
            We&apos;ve received your booking request. A member of our team will call you within 2 business hours 
            to confirm your appointment and provide a final quote.
          </p>
          <div className="bg-secondary-50 rounded-2xl p-5 text-left text-sm text-secondary-600 space-y-2 mb-6">
            <p><strong>Service:</strong> {services.find(s => s.key === selectedService)?.label}</p>
            <p><strong>Property:</strong> {propertySizes.find(s => s.key === selectedSize)?.label}</p>
            <p><strong>Frequency:</strong> {frequencies.find(f => f.key === selectedFrequency)?.label}</p>
          </div>
          <a href="/" className="inline-block">
            <Button>Back to Home</Button>
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="bg-gradient-to-br from-secondary-800 to-secondary-700 py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <h1 className="font-heading font-bold text-4xl md:text-5xl text-white mb-3 leading-tight">
            Book Your Clean Online
          </h1>
          <p className="text-secondary-200 text-lg">Takes less than 2 minutes. No payment needed to book.</p>
        </div>
      </section>

      <section className="py-14 bg-secondary-50">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Progress steps */}
          <div className="flex items-center justify-center gap-3 mb-10">
            {[1, 2, 3].map((s) => (
              <React.Fragment key={s}>
                <div className={`flex items-center gap-2 ${step >= s ? 'text-primary-600' : 'text-secondary-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step > s ? 'bg-primary-500 text-white' :
                    step === s ? 'bg-primary-500 text-white ring-4 ring-primary-100' :
                    'bg-secondary-200 text-secondary-500'
                  }`}>
                    {step > s ? <CheckCircle className="w-4 h-4" /> : s}
                  </div>
                  <span className="text-sm font-medium hidden sm:block">
                    {s === 1 ? 'Service' : s === 2 ? 'Details' : 'Confirm'}
                  </span>
                </div>
                {s < 3 && <div className={`flex-1 h-0.5 max-w-16 ${step > s ? 'bg-primary-500' : 'bg-secondary-200'}`} />}
              </React.Fragment>
            ))}
          </div>

          <div className="bg-white rounded-3xl shadow-large overflow-hidden">
            {/* Step 1: Service selection */}
            {step === 1 && (
              <div className="p-8">
                <h2 className="font-heading font-bold text-2xl text-secondary-800 mb-2">Choose Your Service</h2>
                <p className="text-secondary-500 text-sm mb-6">Select the service that best suits your needs.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  {services.map(({ key, label, icon: Icon, description, from }) => (
                    <button
                      key={key}
                      onClick={() => setSelectedService(key)}
                      className={`flex items-start gap-3.5 p-4 rounded-2xl border-2 text-left transition-all ${
                        selectedService === key
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-secondary-100 hover:border-secondary-200'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        selectedService === key ? 'bg-primary-500' : 'bg-secondary-100'
                      }`}>
                        <Icon className={`w-5 h-5 ${selectedService === key ? 'text-white' : 'text-secondary-500'}`} />
                      </div>
                      <div>
                        <p className={`font-semibold text-sm ${selectedService === key ? 'text-primary-700' : 'text-secondary-700'}`}>
                          {label}
                        </p>
                        <p className="text-secondary-400 text-xs mt-0.5">{description}</p>
                        <p className="text-primary-600 font-semibold text-xs mt-1">From {from}</p>
                      </div>
                    </button>
                  ))}
                </div>

                {selectedService !== 'office' && (
                  <>
                    <h3 className="font-semibold text-secondary-700 text-sm mb-3">Property Size</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
                      {propertySizes.map(({ key, label }) => (
                        <button
                          key={key}
                          onClick={() => setSelectedSize(key)}
                          className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                            selectedSize === key
                              ? 'border-primary-500 bg-primary-50 text-primary-700'
                              : 'border-secondary-100 text-secondary-600 hover:border-secondary-200'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </>
                )}

                <h3 className="font-semibold text-secondary-700 text-sm mb-3">Frequency</h3>
                <div className="grid grid-cols-2 gap-2 mb-7">
                  {frequencies.map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => setSelectedFrequency(key)}
                      className={`p-3 rounded-xl border-2 text-sm font-medium text-left transition-all ${
                        selectedFrequency === key
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-secondary-100 text-secondary-600 hover:border-secondary-200'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => setStep(2)}
                  disabled={!selectedService || (!selectedSize && selectedService !== 'office')}
                >
                  Continue to Details
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            )}

            {/* Step 2: Personal details */}
            {step === 2 && (
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="p-8">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex items-center gap-1.5 text-secondary-400 hover:text-secondary-600 text-sm mb-5 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                  <h2 className="font-heading font-bold text-2xl text-secondary-800 mb-2">Your Details</h2>
                  <p className="text-secondary-500 text-sm mb-6">We need a few details to confirm your booking.</p>

                  {serverError && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-5">
                      <p className="text-red-700 text-sm">{serverError}</p>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="first_name" className="mb-1.5 block">First Name *</Label>
                        <Input id="first_name" placeholder="Jane" {...register('first_name')} className={errors.first_name ? 'border-red-400' : ''} />
                        {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name.message}</p>}
                      </div>
                      <div>
                        <Label htmlFor="last_name" className="mb-1.5 block">Last Name *</Label>
                        <Input id="last_name" placeholder="Smith" {...register('last_name')} className={errors.last_name ? 'border-red-400' : ''} />
                        {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name.message}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email" className="mb-1.5 block">Email *</Label>
                        <Input id="email" type="email" placeholder="jane@example.com" {...register('email')} className={errors.email ? 'border-red-400' : ''} />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                      </div>
                      <div>
                        <Label htmlFor="phone" className="mb-1.5 block">Phone *</Label>
                        <Input id="phone" type="tel" placeholder="07700 900 000" {...register('phone')} className={errors.phone ? 'border-red-400' : ''} />
                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="address" className="mb-1.5 block">Property Address *</Label>
                      <Input id="address" placeholder="123 High Street, London" {...register('address')} className={errors.address ? 'border-red-400' : ''} />
                      {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
                    </div>

                    <div>
                      <Label htmlFor="postcode" className="mb-1.5 block">Postcode *</Label>
                      <Input id="postcode" placeholder="SW1A 1AA" {...register('postcode')} className={errors.postcode ? 'border-red-400' : ''} />
                      {errors.postcode && <p className="text-red-500 text-xs mt-1">{errors.postcode.message}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="preferred_date" className="mb-1.5 block">Preferred Date *</Label>
                        <Input id="preferred_date" type="date" {...register('preferred_date')} className={errors.preferred_date ? 'border-red-400' : ''} />
                        {errors.preferred_date && <p className="text-red-500 text-xs mt-1">{errors.preferred_date.message}</p>}
                      </div>
                      <div>
                        <Label htmlFor="preferred_time" className="mb-1.5 block">Preferred Time *</Label>
                        <div className="relative">
                          <select
                            id="preferred_time"
                            {...register('preferred_time')}
                            className={`flex h-11 w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-secondary-700 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none cursor-pointer ${errors.preferred_time ? 'border-red-400' : 'border-secondary-200'}`}
                          >
                            <option value="">Select time</option>
                            <option value="morning">Morning (8am – 12pm)</option>
                            <option value="afternoon">Afternoon (12pm – 4pm)</option>
                            <option value="evening">Evening (4pm – 6pm)</option>
                          </select>
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg className="w-4 h-4 text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                        {errors.preferred_time && <p className="text-red-500 text-xs mt-1">{errors.preferred_time.message}</p>}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="special_instructions" className="mb-1.5 block">Special Instructions (optional)</Label>
                      <Textarea id="special_instructions" placeholder="Any pets, access instructions, areas to focus on..." rows={3} {...register('special_instructions')} />
                    </div>

                    <div className="flex items-start gap-3">
                      <input type="checkbox" id="gdpr_consent" {...register('gdpr_consent')} className="mt-0.5 w-4 h-4 rounded border-secondary-300 text-primary-500 focus:ring-primary-500" />
                      <label htmlFor="gdpr_consent" className="text-secondary-500 text-xs leading-relaxed cursor-pointer">
                        I agree to PureMaids processing my personal data to manage this booking in accordance with the{' '}
                        <a href="/privacy" className="text-primary-600 hover:underline">Privacy Policy</a>. *
                      </label>
                    </div>
                    {errors.gdpr_consent && <p className="text-red-500 text-xs">{errors.gdpr_consent.message}</p>}
                  </div>
                </div>

                <div className="px-8 pb-8">
                  <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Confirm Booking Request'}
                    {!isSubmitting && <CheckCircle className="w-4 h-4" />}
                  </Button>
                  <p className="text-xs text-secondary-400 text-center mt-3">
                    No payment required now. We&apos;ll confirm via phone within 2 hours.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
