'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { StaffProvider, useStaff } from '@/lib/staff-auth';
import { Eye, EyeOff, Lock, Mail, AlertCircle, Sparkles } from 'lucide-react';

function LoginForm() {
  const { signIn } = useStaff();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    const err = await signIn(email, password);
    if (err) { setError(err); setLoading(false); }
    else router.push('/staff');
  };

  return (
    <div className="min-h-screen bg-secondary-900 flex flex-col items-center justify-center px-5 py-12">
      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-heading font-extrabold text-2xl text-white mb-1">PureMaids Staff</h1>
          <p className="text-secondary-400 text-sm">Sign in to your cleaner portal</p>
        </div>

        <div className="bg-secondary-800 rounded-3xl border border-secondary-700 p-7 shadow-2xl">
          {error && (
            <div className="flex items-start gap-3 bg-red-900/40 border border-red-800 rounded-xl p-3.5 mb-5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-secondary-400 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-500" />
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email" placeholder="you@puremaids.co.uk"
                  className="w-full h-12 pl-10 pr-4 bg-secondary-900 border border-secondary-600 rounded-xl text-white text-sm placeholder:text-secondary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-secondary-400 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-500" />
                <input type={showPw ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password" placeholder="••••••••"
                  className="w-full h-12 pl-10 pr-12 bg-secondary-900 border border-secondary-600 rounded-xl text-white text-sm placeholder:text-secondary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                <button type="button" tabIndex={-1} onClick={() => setShowPw(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-secondary-500 hover:text-secondary-300">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full h-12 bg-primary-500 hover:bg-primary-400 disabled:opacity-60 text-white font-bold rounded-xl text-base transition-colors flex items-center justify-center gap-2 mt-2 shadow-lg shadow-primary-500/20">
              {loading
                ? <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>Signing in...</>
                : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center text-secondary-600 text-xs mt-6">
          Staff access only · Contact your manager for help
        </p>
      </div>
    </div>
  );
}

export default function StaffLoginPage() {
  return (
    <StaffProvider>
      <LoginForm />
    </StaffProvider>
  );
}
