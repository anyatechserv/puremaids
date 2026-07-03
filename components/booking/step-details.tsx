'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Mail, Phone, MapPin, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const schema = z.object({
  firstName: z.string().min(2, 'Required'),
  lastName: z.string().min(2, 'Required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(7, 'Phone required'),
  address: z.string().min(5, 'Full address required'),
  specialInstructions: z.string().optional(),
  gdprConsent: z.boolean().refine((v) => v, 'You must agree to continue'),
});

export type DetailsFormData = z.infer<typeof schema>;

interface Props {
  defaultValues: Partial<DetailsFormData>;
  onNext: (data: DetailsFormData) => void;
  onBack: () => void;
}

export default function StepDetails({ defaultValues, onNext, onBack }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DetailsFormData>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onNext)} noValidate>
      <div className="p-8">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-secondary-400 hover:text-secondary-600 text-sm mb-5 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back
        </button>

        <p className="text-xs font-bold uppercase tracking-widest text-primary-500 mb-2">Step 6 of 7</p>
        <h2 className="font-heading font-bold text-2xl text-secondary-800 mb-1">Your details</h2>
        <p className="text-secondary-500 text-sm mb-7">We need this to confirm your booking and assign your cleaner.</p>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-secondary-500">
                First Name *
              </Label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-300 pointer-events-none" />
                <Input
                  id="firstName"
                  placeholder="Jane"
                  className={`pl-10 ${errors.firstName ? 'border-red-400' : ''}`}
                  {...register('firstName')}
                />
              </div>
              {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
            </div>
            <div>
              <Label htmlFor="lastName" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-secondary-500">
                Last Name *
              </Label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-300 pointer-events-none" />
                <Input
                  id="lastName"
                  placeholder="Smith"
                  className={`pl-10 ${errors.lastName ? 'border-red-400' : ''}`}
                  {...register('lastName')}
                />
              </div>
              {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-secondary-500">
                Email Address *
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-300 pointer-events-none" />
                <Input
                  id="email"
                  type="email"
                  placeholder="jane@example.com"
                  className={`pl-10 ${errors.email ? 'border-red-400' : ''}`}
                  {...register('email')}
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <Label htmlFor="phone" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-secondary-500">
                Phone Number *
              </Label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-300 pointer-events-none" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="07700 900 000"
                  className={`pl-10 ${errors.phone ? 'border-red-400' : ''}`}
                  {...register('phone')}
                />
              </div>
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="address" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-secondary-500">
              Property Address *
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-secondary-300 pointer-events-none" />
              <Input
                id="address"
                placeholder="123 High Street, London"
                className={`pl-10 ${errors.address ? 'border-red-400' : ''}`}
                {...register('address')}
              />
            </div>
            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
          </div>

          <div>
            <Label htmlFor="specialInstructions" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-secondary-500">
              Special Instructions <span className="font-normal normal-case text-secondary-400">(optional)</span>
            </Label>
            <div className="relative">
              <MessageSquare className="absolute left-3.5 top-3.5 w-4 h-4 text-secondary-300 pointer-events-none" />
              <Textarea
                id="specialInstructions"
                placeholder="Pets, access codes, areas to focus on, allergies..."
                rows={3}
                className="pl-10"
                {...register('specialInstructions')}
              />
            </div>
          </div>

          <div className="bg-secondary-50 rounded-2xl p-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                id="gdprConsent"
                className="mt-0.5 w-4 h-4 rounded border-secondary-300 text-primary-500 focus:ring-primary-500 shrink-0"
                {...register('gdprConsent')}
              />
              <span className="text-secondary-500 text-xs leading-relaxed">
                I agree to PureMaids processing my personal data to manage this booking in accordance with the{' '}
                <a href="/privacy" className="text-primary-600 hover:underline font-medium">Privacy Policy</a>.
                I understand I can withdraw consent at any time. *
              </span>
            </label>
            {errors.gdprConsent && <p className="text-red-500 text-xs mt-2 ml-7">{errors.gdprConsent.message}</p>}
          </div>
        </div>
      </div>

      <div className="px-8 pb-8">
        <Button type="submit" size="lg" className="w-full">
          Review Booking
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </Button>
      </div>
    </form>
  );
}
