'use client';

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'puremaids-cookie-consent';

interface Consent {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
}

export default function CookieBanner() {
  const [show, setShow] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) setShow(true);
    } catch {
      setShow(true);
    }
  }, []);

  function save(consent: Consent) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    } catch {
      // localStorage not available
    }
    setShow(false);
  }

  function acceptAll() {
    save({ essential: true, analytics: true, marketing: true, timestamp: new Date().toISOString() });
  }

  function acceptEssential() {
    save({ essential: true, analytics: false, marketing: false, timestamp: new Date().toISOString() });
  }

  function savePreferences() {
    save({ essential: true, analytics, marketing, timestamp: new Date().toISOString() });
  }

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 text-white p-4 shadow-lg animate-slide-up">
      <div className="section">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex-1">
            <p className="text-sm mb-2">We use cookies to improve your experience. Essential cookies are required for the site to function.</p>
            <div className="flex flex-wrap gap-4 text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked disabled className="accent-brand-500" />
                <span>Essential (required)</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={analytics} onChange={e => setAnalytics(e.target.checked)} className="accent-brand-500" />
                <span>Analytics</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={marketing} onChange={e => setMarketing(e.target.checked)} className="accent-brand-500" />
                <span>Marketing</span>
              </label>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={acceptEssential} className="text-sm text-gray-300 hover:text-white px-3 py-2">Essential Only</button>
            <button onClick={savePreferences} className="text-sm bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg">Save Preferences</button>
            <button onClick={acceptAll} className="text-sm bg-brand-600 hover:bg-brand-700 px-4 py-2 rounded-lg font-medium">Accept All</button>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-2">See our <a href="/cookies" className="underline">Cookie Policy</a> for details.</p>
      </div>
    </div>
  );
}
