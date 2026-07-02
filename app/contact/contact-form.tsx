'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Phone, Mail, MapPin, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import { SITE_CONFIG } from '@/lib/constants';

const schema = z.object({
  first_name: z.string().min(2, 'First name required'),
  last_name: z.string().min(2, 'Last name required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(7, 'Phone number required'),
  service: z.string().min(1, 'Please select a service'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  gdpr_consent: z.boolean().refine((v) => v, 'You must agree to our privacy policy'),
});

type FormData = z.infer<typeof schema>;

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setServerError('');
    try {
      const { error } = await supabase.from('contact_enquiries').insert({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone,
        service: data.service,
        message: data.message,
        gdpr_consent: data.gdpr_consent,
      });
      if (error) throw error;
      setSubmitted(true);
    } catch (err: unknown) {
      setServerError('Something went wrong. Please try again or call us directly.');
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center py-20">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-8 h-8 text-accent-500" />
          </div>
          <h2 className="font-heading font-bold text-2xl text-secondary-800 mb-3">Message Sent!</h2>
          <p className="text-secondary-500 leading-relaxed">
            Thank you for getting in touch. A member of our team will respond within 2 business hours.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="bg-gradient-to-br from-secondary-800 to-secondary-700 py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="max-w-3xl">
            <h1 className="font-heading font-bold text-4xl md:text-5xl text-white mb-5 leading-tight">
              Get in Touch
            </h1>
            <p className="text-secondary-200 text-lg leading-relaxed">
              Have a question or want to book a clean? We&apos;re here to help.
              Our team responds within 2 business hours.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div>
              <h2 className="font-heading font-semibold text-secondary-800 text-xl mb-6">Contact Information</h2>
              <div className="space-y-5">
                {[
                  { icon: Phone, label: 'Phone', value: SITE_CONFIG.phone, href: `tel:${SITE_CONFIG.phone.replace(/\s/g,'')}` },
                  { icon: Mail, label: 'Email', value: SITE_CONFIG.email, href: `mailto:${SITE_CONFIG.email}` },
                  { icon: MapPin, label: 'Address', value: SITE_CONFIG.address, href: undefined },
                ].map(({ icon: Icon, label, value, href }) => (
                  <div key={label} className="flex items-start gap-3.5">
                    <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="w-[18px] h-[18px] text-primary-500" />
                    </div>
                    <div>
                      <p className="text-secondary-400 text-xs font-medium mb-0.5">{label}</p>
                      {href ? (
                        <a href={href} className="text-secondary-700 font-medium text-sm hover:text-primary-600 transition-colors">
                          {value}
                        </a>
                      ) : (
                        <p className="text-secondary-700 font-medium text-sm">{value}</p>
                      )}
                    </div>
                  </div>
                ))}

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-[18px] h-[18px] text-primary-500" />
                  </div>
                  <div>
                    <p className="text-secondary-400 text-xs font-medium mb-1">Opening Hours</p>
                    <div className="space-y-0.5">
                      <p className="text-secondary-700 text-sm">Mon–Fri: 8:00am – 6:00pm</p>
                      <p className="text-secondary-700 text-sm">Saturday: 9:00am – 4:00pm</p>
                      <p className="text-secondary-400 text-xs">Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-5 bg-primary-50 rounded-2xl border border-primary-100">
                <p className="font-semibold text-secondary-800 text-sm mb-1">Need an urgent booking?</p>
                <p className="text-secondary-500 text-sm mb-3">Call us directly for same-day availability.</p>
                <a href={`tel:${SITE_CONFIG.phone.replace(/\s/g,'')}`}>
                  <Button size="sm" className="w-full">
                    <Phone className="w-3.5 h-3.5" />
                    Call Now
                  </Button>
                </a>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-secondary-100 p-8 shadow-soft">
                <h2 className="font-heading font-semibold text-secondary-800 text-xl mb-5">Send Us a Message</h2>

                {serverError && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-5">
                    <p className="text-red-700 text-sm">{serverError}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
                      <Label htmlFor="email" className="mb-1.5 block">Email Address *</Label>
                      <Input id="email" type="email" placeholder="jane@example.com" {...register('email')} className={errors.email ? 'border-red-400' : ''} />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>
                    <div>
                      <Label htmlFor="phone" className="mb-1.5 block">Phone Number *</Label>
                      <Input id="phone" type="tel" placeholder="07700 900 000" {...register('phone')} className={errors.phone ? 'border-red-400' : ''} />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="service" className="mb-1.5 block">Service Required *</Label>
                    <div className="relative">
                      <Select id="service" {...register('service')} className={errors.service ? 'border-red-400' : ''}>
                        <option value="">Select a service</option>
                        <option value="domestic">Domestic Cleaning</option>
                        <option value="deep">Deep Cleaning</option>
                        <option value="end_of_tenancy">End of Tenancy Cleaning</option>
                        <option value="office">Office Cleaning</option>
                        <option value="other">Other / General Enquiry</option>
                      </Select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg className="w-4 h-4 text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    {errors.service && <p className="text-red-500 text-xs mt-1">{errors.service.message}</p>}
                  </div>

                  <div>
                    <Label htmlFor="message" className="mb-1.5 block">Message *</Label>
                    <Textarea id="message" placeholder="Tell us about your property, what you need cleaned, and any special requirements..." rows={4} {...register('message')} className={errors.message ? 'border-red-400' : ''} />
                    {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
                  </div>

                  <div className="flex items-start gap-3">
                    <input type="checkbox" id="gdpr_consent" {...register('gdpr_consent')} className="mt-0.5 w-4 h-4 rounded border-secondary-300 text-primary-500 focus:ring-primary-500" />
                    <label htmlFor="gdpr_consent" className="text-secondary-500 text-xs leading-relaxed cursor-pointer">
                      I agree to PureMaids processing my personal data to respond to this enquiry in accordance with the{' '}
                      <a href="/privacy" className="text-primary-600 hover:underline">Privacy Policy</a>. *
                    </label>
                  </div>
                  {errors.gdpr_consent && <p className="text-red-500 text-xs -mt-2">{errors.gdpr_consent.message}</p>}

                  <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>

                  <p className="text-xs text-secondary-400 text-center">
                    We will respond within 2 business hours. Your data is handled in accordance with GDPR.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
