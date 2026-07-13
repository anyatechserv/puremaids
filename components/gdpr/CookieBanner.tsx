'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type Consent = { analytics: boolean; marketing: boolean; savedAt: string };

const COOKIE_KEY = 'puremaids_consent';

function getStoredConsent(): Consent | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(COOKIE_KEY);
    return raw ? (JSON.parse(raw) as Consent) : null;
  } catch {
    return null;
  }
}

function saveConsent(consent: Omit<Consent, 'savedAt'>) {
  const full: Consent = { ...consent, savedAt: new Date().toISOString() };
  localStorage.setItem(COOKIE_KEY, JSON.stringify(full));
  // Dispatch event so the rest of the app can react
  window.dispatchEvent(new CustomEvent('consentUpdated', { detail: full }));
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const stored = getStoredConsent();
    if (!stored) setVisible(true);
  }, []);

  if (!visible) return null;

  function acceptAll() {
    saveConsent({ analytics: true, marketing: true });
    setVisible(false);
  }

  function acceptNecessary() {
    saveConsent({ analytics: false, marketing: false });
    setVisible(false);
  }

  function saveCustom() {
    saveConsent({ analytics, marketing });
    setVisible(false);
  }

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Cookie consent"
      aria-live="polite"
      className="fixed inset-x-4 bottom-4 z-[90] sm:inset-x-auto sm:bottom-6 sm:left-6 sm:max-w-md animate-slide-up"
    >
      <div className="card p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-gray-900">We use cookies</h2>
            <p className="mt-1.5 text-sm text-gray-600 leading-relaxed">
              We use essential cookies to make our site work. With your consent, we also use analytics cookies to improve your experience.{' '}
              <Link href="/cookies" className="text-brand-600 underline hover:text-brand-700">Learn more</Link>
            </p>
          </div>
        </div>

        {showDetails && (
          <div className="mt-4 space-y-3 rounded-xl bg-gray-50 p-4">
            <label className="flex items-center justify-between gap-3">
              <div>
                <span className="text-sm font-medium text-gray-900">Necessary</span>
                <p className="text-xs text-gray-500">Required for the site to function.</p>
              </div>
              <div className="relative h-5 w-9 rounded-full bg-brand-600 opacity-50 cursor-not-allowed" aria-label="Always on" />
            </label>
            <label className="flex items-center justify-between gap-3 cursor-pointer">
              <div>
                <span className="text-sm font-medium text-gray-900">Analytics</span>
                <p className="text-xs text-gray-500">Helps us understand how visitors use our site.</p>
              </div>
              <button
                role="switch"
                aria-checked={analytics}
                onClick={() => setAnalytics(!analytics)}
                className={`relative h-5 w-9 rounded-full transition-colors ${analytics ? 'bg-brand-600' : 'bg-gray-300'}`}
              >
                <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${analytics ? 'translate-x-4' : 'translate-x-0.5'}`} />
              </button>
            </label>
            <label className="flex items-center justify-between gap-3 cursor-pointer">
              <div>
                <span className="text-sm font-medium text-gray-900">Marketing</span>
                <p className="text-xs text-gray-500">Personalised ads and promotions.</p>
              </div>
              <button
                role="switch"
                aria-checked={marketing}
                onClick={() => setMarketing(!marketing)}
                className={`relative h-5 w-9 rounded-full transition-colors ${marketing ? 'bg-brand-600' : 'bg-gray-300'}`}
              >
                <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${marketing ? 'translate-x-4' : 'translate-x-0.5'}`} />
              </button>
            </label>
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          <button onClick={acceptAll} className="btn btn-sm btn-primary flex-1">
            Accept all
          </button>
          {showDetails ? (
            <button onClick={saveCustom} className="btn btn-sm btn-secondary flex-1">
              Save preferences
            </button>
          ) : (
            <button onClick={() => setShowDetails(true)} className="btn btn-sm btn-secondary flex-1">
              Manage cookies
            </button>
          )}
          <button onClick={acceptNecessary} className="btn btn-sm btn-ghost w-full text-xs text-gray-500">
            Necessary only
          </button>
        </div>
      </div>
    </div>
  );
}
