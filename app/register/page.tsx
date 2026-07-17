'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/lib/supabase-client';
import { authSchema } from '@/lib/validation';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const validated = authSchema.parse({ email: email.toLowerCase().trim(), password });
      if (fullName.trim().length < 2) throw new Error('Full name is required');
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase.auth.signUp({
        email: validated.email,
        password: validated.password,
        options: { data: { full_name: fullName.trim(), phone: phone.trim() || undefined } },
      });
      if (error) throw error;
      if (data.user) {
        await supabase.from('customer_profiles').insert({ user_id: data.user.id, full_name: fullName.trim(), phone: phone.trim() || null });
      }
      router.push('/account');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="section py-16">
      <div className="mx-auto max-w-md">
        <h1 className="heading-2 mb-6 text-center">Create Account</h1>
        {error && <div className="alert-error mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="card space-y-4">
          <div><label className="label">Full Name</label><input className="input" value={fullName} onChange={e => setFullName(e.target.value)} required maxLength={50} /></div>
          <div><label className="label">Email</label><input type="email" className="input" value={email} onChange={e => setEmail(e.target.value)} required maxLength={254} autoComplete="email" /></div>
          <div><label className="label">Phone (optional)</label><input type="tel" className="input" value={phone} onChange={e => setPhone(e.target.value)} maxLength={20} /></div>
          <div>
            <label className="label">Password</label>
            <input type="password" className="input" value={password} onChange={e => setPassword(e.target.value)} required maxLength={72} autoComplete="new-password" />
            <p className="mt-1 text-xs text-gray-500">Min 8 chars, 1 uppercase, 1 lowercase, 1 number</p>
          </div>
          <button type="submit" className="btn-primary w-full" disabled={loading}>{loading ? 'Creating...' : 'Create Account'}</button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">Already have an account? <a href="/login" className="text-brand-600 underline">Sign in</a></p>
      </div>
    </div>
  );
}
