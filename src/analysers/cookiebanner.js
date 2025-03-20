'use client';
import { useEffect, useState } from 'react';
import { getLocalStorage, setLocalStorage } from './storageHelper';

export default function CookieBanner() {
  const [cookieConsent, setCookieConsent] = useState(false);

  useEffect(() => {
    const storedCookieConsent = getLocalStorage('cookie_consent', false);
    setCookieConsent(storedCookieConsent);
  }, [setCookieConsent]);

  useEffect(() => {
    const newValue = cookieConsent ? 'granted' : 'denied';

    // Add safety check for gtag
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        analytics_storage: newValue,
      });
    }

    setLocalStorage('cookie_consent', cookieConsent);

    // For Testing
    console.log('Cookie Consent: ', cookieConsent);
  }, [cookieConsent]);

  useEffect(() => {
    setTimeout(() => setCookieConsent(true), 1000);
  }, []);

  return <></>;
}
