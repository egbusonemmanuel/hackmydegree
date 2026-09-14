// src/components/AdBanner.jsx
import React, { useEffect, useRef } from 'react';
import { useAuth } from '../App';

/**
 * Reusable Google AdSense Banner Component
 *
 * Features:
 * - Automatically pushes ad request to adsbygoogle on mount
 * - Hides ads for PRO subscribers (adds high value to the PRO subscription!)
 * - Graceful fallback in development/testing mode
 *
 * Usage:
 *   <AdBanner slot="YOUR_AD_SLOT_ID" />
 *
 * Get your slot ID from your AdSense dashboard → Ads → By ad unit.
 */
export default function AdBanner({
  slot = '1234567890',
  format = 'auto',
  responsive = 'true',
  layout = '',
  style = {},
  className = ''
}) {
  const { profile } = useAuth();
  const adRef = useRef(null);
  const adInitialized = useRef(false);

  const clientId = process.env.REACT_APP_ADSENSE_CLIENT_ID || 'ca-pub-2921216147231328';
  const isPro = profile?.is_pro;

  // Must call hooks unconditionally — hide AFTER hooks are declared
  useEffect(() => {
    if (isPro) return; // PRO users get no ads
    if (adInitialized.current) return;

    try {
      if (typeof window !== 'undefined') {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        adInitialized.current = true;
      }
    } catch (err) {
      console.warn('[AdSense] Ad push note:', err?.message || err);
    }
  }, [isPro]);

  // Ad-free experience for PRO members
  if (isPro) return null;

  return (
    <div
      className={`ad-container ${className}`}
      style={{
        margin: '2rem auto',
        textAlign: 'center',
        overflow: 'hidden',
        minHeight: '90px',
        maxWidth: '100%',
        ...style
      }}
    >
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block', ...style }}
        data-ad-client={clientId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
        {...(layout ? { 'data-ad-layout': layout } : {})}
      />
    </div>
  );
}
