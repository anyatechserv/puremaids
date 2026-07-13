'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const KEY = 'puremaids_gdpr';
type Prefs = { necessary: true; analytics: boolean; marketing: boolean; ts: string };

function getPrefs(): Prefs | null {
  try { return JSON.parse(localStorage.getItem(KEY) ?? 'null') as Prefs | null; }
  catch { return null; }
}
function savePrefs(p: Omit<Prefs, 'necessary' | 'ts'>) {
  const full: Prefs = { necessary: true, ...p, ts: new Date().toISOString() };
  localStorage.setItem(KEY, JSON.stringify(full));
  window.dispatchEvent(new CustomEvent('gdpr:consent', { detail: full }));
}

export default function CookieBanner() {
  const [show, setShow]       = useState(false);
  const [detail, setDetail]   = useState(false);
  const [analytics, setAna]   = useState(true);
  const [marketing, setMkt]   = useState(false);

  useEffect(() => { if (!getPrefs()) setShow(true); }, []);

  if (!show) return null;

  const accept = (a: boolean, m: boolean) => { savePrefs({ analytics: a, marketing: m }); setShow(false); };

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Cookie consent"
      aria-live="polite"
      className="fixed inset-x-4 bottom-4 z-[90] sm:inset-x-auto sm:bottom-6 sm:left-6 sm:max-w-sm animate-slide-up"
    >
      <div className="card shadow-xl p-5">
        <p className="text-sm font-semibold text-gray-900">We use cookies 🍪</p>
        <p className="mt-1 text-xs text-gray-600 leading-relaxed">
          We use essential cookies to make our site work, and optional analytics cookies to improve your experience.{' '}
          <Link href="/cookies" className="text-brand-600 underline">Learn more</Link>
        </p>

        {detail && (
          <div className="mt-3 space-y-2 rounded-xl bg-gray-50 p-3 text-xs">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-medium text-gray-800">Necessary</p>
                <p className="text-gray-500">Required for core functionality.</p>
              </div>
              <span className="text-brand-600 font-semibold">Always on</span>
            </div>
            {([
              { key: 'analytics', label: 'Analytics',  desc: 'Helps us improve the site.',          val: analytics, set: setAna },
              { key: 'marketing', label: 'Marketing',   desc: 'Personalised promotions.',            val: marketing, set: setMkt },
            ] as const).map(({ key, label, desc, val, set }) => (
              <div key={key} className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-gray-800">{label}</p>
                  <p className="text-gray-500">{desc}</p>
                </div>
                <button
                  role="switch"
                  aria-checked={val}
                  aria-label={`Toggle ${label} cookies`}
                  onClick={() => (set as React.Dispatch<React.SetStateAction<boolean>>)(!val)}
                  className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${val ? 'bg-brand-600' : 'bg-gray-300'}`}
                >
                  <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${val ? 'translate-x-4' : 'translate-x-0.5'}`} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-3 flex flex-wrap gap-2">
          <button onClick={() => accept(true, true)}   className="btn btn-sm btn-primary flex-1">Accept all</button>
          {detail
            ? <button onClick={() => accept(analytics, marketing)} className="btn btn-sm btn-secondary flex-1">Save</button>
            : <button onClick={() => setDetail(true)}              className="btn btn-sm btn-secondary flex-1">Manage</button>
          }
        </div>
        <button onClick={() => accept(false, false)} className="btn btn-sm btn-ghost mt-1 w-full text-xs text-gray-400">
          Necessary only
        </button>
      </div>
    </div>
  );
}
