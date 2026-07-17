'use client';

import { useState } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase-client';
import { contactSchema, sanitizeString } from '@/lib/validation';

export default function ContactPage() {
  const [formData, setFormData] = useState({ first_name: '', last_name: '', email: '', phone: '', service: '', message: '', gdpr_consent: false });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const validated = contactSchema.parse(formData);
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.from('contact_enquiries').insert({
        first_name: sanitizeString(validated.first_name),
        last_name: sanitizeString(validated.last_name),
        email: validated.email,
        phone: validated.phone,
        service: sanitizeString(validated.service),
        message: sanitizeString(validated.message),
        gdpr_consent: validated.gdpr_consent,
        status: 'new',
      });
      if (error) throw error;
      setSuccess(true);
      setFormData({ first_name: '', last_name: '', email: '', phone: '', service: '', message: '', gdpr_consent: false });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed');
    } finally {
      setLoading(false);
    }
  }

  if (success) return (
    <div className="section py-20"><div className="mx-auto max-w-md text-center">
      <h1 className="heading-2 mb-4">Thank You!</h1>
      <p className="text-body mb-8">We'll get back to you within 24 hours.</p>
      <a href="/" className="btn-primary">Return Home</a>
    </div></div>
  );

  return (
    <div className="section py-16">
      <div className="mx-auto max-w-md">
        <h1 className="heading-2 mb-6 text-center">Contact Us</h1>
        {error && <div className="alert-error mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="card space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">First Name</label><input className="input" value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} required maxLength={50} /></div>
            <div><label className="label">Last Name</label><input className="input" value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} required maxLength={50} /></div>
          </div>
          <div><label className="label">Email</label><input type="email" className="input" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required maxLength={254} /></div>
          <div><label className="label">Phone</label><input type="tel" className="input" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required maxLength={20} /></div>
          <div><label className="label">Service</label><input className="input" value={formData.service} onChange={e => setFormData({...formData, service: e.target.value})} required maxLength={50} /></div>
          <div><label className="label">Message</label><textarea className="input" rows={4} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} required maxLength={2000} /></div>
          <label className="flex items-start gap-2">
            <input type="checkbox" className="mt-1 accent-brand-600" checked={formData.gdpr_consent} onChange={e => setFormData({...formData, gdpr_consent: e.target.checked})} required />
            <span className="text-sm text-gray-600">I agree to the <a href="/privacy" className="text-brand-600 underline">Privacy Policy</a>.</span>
          </label>
          <button type="submit" className="btn-primary w-full" disabled={loading}>{loading ? 'Sending...' : 'Send Message'}</button>
        </form>
      </div>
    </div>
  );
}
