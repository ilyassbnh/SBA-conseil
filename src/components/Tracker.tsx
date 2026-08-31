'use client';

import { useEffect } from 'react';

export default function Tracker() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      return;
    }

    try {
      if (typeof window !== 'undefined' && localStorage.getItem('ignore_admin') === 'true') {
        return;
      }

      const payload = {
        url: window.location.href,
        referrer: document.referrer || 'Direct / Chat Link',
        userAgent: navigator.userAgent,
        language: navigator.language,
        screen: `${window.screen.width}x${window.screen.height}`,
        timestamp: new Date().toISOString(),
      };

      fetch('https://YOUR_N8N_URL/webhook/site-visit-tracker', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => {
        // Silently catch network errors
      });
    } catch {
      // Silently catch any unexpected browser API errors
    }
  }, []);

  return null;
}
