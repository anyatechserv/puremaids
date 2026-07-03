'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CustomerProvider, useCustomer } from '@/lib/customer-auth';
import { Eye, EyeOff, Mail, Lock, User, Sparkles, AlertCircle, CheckCircle } from 'lucide-react';

function SignupForm() {
  const { signUp } = useCustomer();
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setError(''); setLoading(true);
    const err = await signUp(email, password, fullName);
    if (err) { setError(err); setLoading(false); }
    else {
      setSuccess(true);
      setTimeout(() => router.push('/account'), 1500);
    }
  };

  if (success) {
    return (
      <div className="bg-white rounded-3xl border border-secondary-100 shadow-medium p-10 text-center">
        <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-accent-500" />
        </div>
        <h2 className="font-heading font-bold text-xl text-secondary-800 mb-2">Account Created!</h2>
        <p className="text-secondary-400 text-sm">Taking you to your account...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-secondary-100 shadow-medium p-8">
      {error && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-3.5 mb-5">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { label: 'Full Name', value: fullName, set: setFullName, type: 'text', placeholder: 'Jane Smith', icon: User, autoComplete: 'name' },
          { label: 'Email', value: email, set: setEmail, type: 'email', placeholder: 'you@example.com', icon: Mail, autoComplete: 'email' },
        ].map(({ label, value, set, type, placeholder, icon: Icon, autoComplete }) => (
          <div key={label}>
            <label className="block text-xs font-bold uppercase tracking-wider text-secondary-500 mb-1.5">{label}</label>
            <div className="relative">
              <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
              <input type={type} required value={value} onChange={(e) => set(e.target.value)} autoComplete={autoComplete} placeholder={placeholder}
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-secondary-200 text-sm text-secondary-800 placeholder:text-secondary-300 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent bg-secondary-50/50 transition" />
            </div>
          </div>
        ))}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-secondary-500 mb-1.5">Password</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
            <input type={showPw ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" placeholder="At least 8 characters"
              className="w-full h-11 pl-10 pr-11 rounded-xl border border-secondary-200 text-sm text-secondary-800 placeholder:text-secondary-300 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent bg-secondary-50/50 transition" />
            <button type="button" tabIndex={-1} onClick={() => setShowPw((v) => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-600">
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <button type="submit" disabled={loading}
          className="w-full h-11 bg-primary-500 hover:bg-primary-600 disabled:opacity-60 text-white font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2 shadow-sm mt-2">
          {loading ? <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>Creating account...</> : 'Create Account'}
        </button>
      </form>
      <p className="text-center text-sm text-secondary-400 mt-5">
        Already have an account?{' '}
        <Link href="/login" className="text-primary-600 font-semibold hover:text-primary-700">Sign in</Link>
      </p>
    </div>
  );
}

export default function SignupPage() {
  return (
    <CustomerProvider>
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-5">
              <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center shadow-md">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-heading font-extrabold text-xl text-secondary-800">PureMaids</span>
            </Link>
            <h1 className="font-heading font-bold text-2xl text-secondary-800 mb-1.5">Create your account</h1>
            <p className="text-secondary-400 text-sm">Manage bookings, invoices and more</p>
          </div>
          <SignupForm />
        </div>
      </div>
    </CustomerProvider>
  );
}
