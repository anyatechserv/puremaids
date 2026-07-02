'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('pm_cookie_consent');
    if (!consent) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem('pm_cookie_consent', 'accepted');
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem('pm_cookie_consent', 'declined');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-slide-up">
      <div className="container mx-auto max-w-5xl">
        <div className="bg-secondary-800 text-white rounded-2xl p-5 shadow-large flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex-1">
            <p className="font-semibold text-sm mb-1">We use cookies</p>
            <p className="text-secondary-300 text-xs leading-relaxed">
              We use cookies to improve your experience, analyse site traffic, and personalise content. 
              By clicking &ldquo;Accept&rdquo; you consent to our use of cookies in accordance with our{' '}
              <a href="/cookies" className="text-primary-400 hover:underline">Cookie Policy</a>.
            </p>
          </div>
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <button
              onClick={decline}
              className="text-xs text-secondary-400 hover:text-white transition-colors px-3 py-1.5"
            >
              Decline
            </button>
            <Button size="sm" onClick={accept}>
              Accept All
            </Button>
            <button onClick={decline} className="text-secondary-400 hover:text-white p-1 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
