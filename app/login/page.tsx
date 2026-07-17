'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/lib/supabase-client';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithPassword({ email: email.toLowerCase().trim(), password });
      if (error) throw error;
      const redirect = new URLSearchParams(window.location.search).get('redirect') || '/account';
      router.push(redirect);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="section py-16">
      <div className="mx-auto max-w-md">
        <h1 className="heading-2 mb-6 text-center">Sign In</h1>
        {error && <div className="alert-error mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="card space-y-4">
          <div>
            <label className="label" htmlFor="email">Email</label>
            <input id="email" type="email" className="input" value={email} onChange={e => setEmail(e.target.value)} required maxLength={254} autoComplete="email" />
          </div>
          <div>
            <label className="label" htmlFor="password">Password</label>
            <input id="password" type="password" className="input" value={password} onChange={e => setPassword(e.target.value)} required maxLength={72} autoComplete="current-password" />
          </div>
          <button type="submit" className="btn-primary w-full" disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          <a href="/forgot-password" className="text-brand-600 underline">Forgot password?</a>
          <span className="mx-2">or</span>
          <a href="/register" className="text-brand-600 underline">Create account</a>
        </p>
      </div>
    </div>
  );
}
