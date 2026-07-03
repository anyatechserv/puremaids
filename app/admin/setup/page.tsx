'use client';

import { useState, type FormEvent } from 'react';
import { supabase } from '@/lib/supabase';
import { Shield, AlertCircle, CheckCircle } from 'lucide-react';

export default function AdminSetupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);

    // Basic protection: require a setup key
    if (secretKey !== 'puremaids-admin-setup') {
      setError('Invalid setup key.'); setLoading(false); return;
    }

    // Create auth user
    const { data: authData, error: signUpError } = await supabase.auth.signUp({ email, password });
    if (signUpError) { setError(signUpError.message); setLoading(false); return; }

    const userId = authData.user?.id;
    if (!userId) { setError('User creation failed.'); setLoading(false); return; }

    // Insert admin profile using service role workaround via anon (will fail without service role)
    // Instead, sign in and insert (RLS allows any authenticated user to read their own row — insert handled by service role in DB trigger scenario)
    // We sign in first to get an auth session, then insert
    const { error: signInErr } = await supabase.auth.signInWithPassword({ email, password });
    if (signInErr) { setError(signInErr.message); setLoading(false); return; }

    const { error: profileError } = await supabase
      .from('admin_profiles')
      .insert({ user_id: userId, full_name: fullName, role: 'admin' });

    if (profileError) {
      setError(`Account created but profile insert failed: ${profileError.message}. Run: INSERT INTO admin_profiles(user_id, full_name) VALUES ('${userId}', '${fullName}');`);
      setLoading(false); return;
    }

    setSuccess(true); setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-secondary-900 flex items-center justify-center px-4">
        <div className="bg-secondary-800 rounded-2xl border border-secondary-700 p-8 max-w-sm w-full text-center">
          <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
          <h2 className="font-heading font-bold text-white text-xl mb-2">Admin Created!</h2>
          <p className="text-secondary-300 text-sm mb-5">You can now log in to the admin dashboard.</p>
          <a href="/admin/login" className="block w-full py-2.5 bg-primary-500 text-white font-semibold rounded-xl text-sm hover:bg-primary-600 transition-colors">
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-900 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h1 className="font-heading font-bold text-xl text-white">Admin Setup</h1>
          <p className="text-secondary-400 text-sm mt-1">Create the first admin account</p>
        </div>
        <div className="bg-secondary-800 rounded-2xl border border-secondary-700 p-7 shadow-2xl">
          {error && (
            <div className="flex items-start gap-2.5 bg-red-900/40 border border-red-700 rounded-xl p-3 mb-4 text-xs text-red-300">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />{error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label: 'Full Name', value: fullName, set: setFullName, type: 'text', placeholder: 'Jane Smith' },
              { label: 'Email', value: email, set: setEmail, type: 'email', placeholder: 'admin@puremaids.co.uk' },
              { label: 'Password', value: password, set: setPassword, type: 'password', placeholder: '••••••••' },
              { label: 'Setup Key', value: secretKey, set: setSecretKey, type: 'password', placeholder: 'Contact your developer' },
            ].map((f) => (
              <div key={f.label}>
                <label className="block text-xs font-semibold text-secondary-400 uppercase tracking-wider mb-1.5">{f.label}</label>
                <input
                  type={f.type} required value={f.value} onChange={(e) => f.set(e.target.value)}
                  placeholder={f.placeholder}
                  className="w-full h-10 px-3.5 bg-secondary-900 border border-secondary-600 rounded-xl text-white text-sm placeholder:text-secondary-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            ))}
            <button
              type="submit" disabled={loading}
              className="w-full h-11 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl text-sm transition-colors mt-1 disabled:opacity-60"
            >
              {loading ? 'Creating...' : 'Create Admin Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
