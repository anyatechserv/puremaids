'use client';

import { useState } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase-client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email.toLowerCase().trim(), {
        redirectTo: `${window.location.origin}/account/reset-password`,
      });
      if (error) throw error;
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="section py-16">
      <div className="mx-auto max-w-md">
        <h1 className="heading-2 mb-6 text-center">Reset Password</h1>
        {error && <div className="alert-error mb-4">{error}</div>}
        {sent ? (
          <div className="card text-center">
            <p className="text-body">If an account exists for {email}, a reset link has been sent.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="card space-y-4">
            <div><label className="label">Email</label><input type="email" className="input" value={email} onChange={e => setEmail(e.target.value)} required maxLength={254} /></div>
            <button type="submit" className="btn-primary w-full" disabled={loading}>{loading ? 'Sending...' : 'Send Reset Link'}</button>
          </form>
        )}
      </div>
    </div>
  );
}
