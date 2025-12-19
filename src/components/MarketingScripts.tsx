import React, { useEffect } from 'react';
import { useConsent } from '@/components/consent/ConsentProvider';

// @ts-ignore
const GA_ID = import.meta.env.VITE_GA_ID || process.env.VITE_GA_ID; // Vite exposes env vars via import.meta.env

export default function MarketingScripts() {
  const { categories } = useConsent();

  useEffect(() => {
    if (GA_ID && categories.analytics) {
      // Load GTag
      const script = document.createElement('script');
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
      script.async = true;
      document.head.appendChild(script);

      // Init GTag
      const inlineScript = document.createElement('script');
      inlineScript.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);} 
        gtag('js', new Date());
        gtag('config', '${GA_ID}', { anonymize_ip: true });
      `;
      document.head.appendChild(inlineScript);

      return () => {
        // Cleanup if necessary (optional for analytics often kept)
        if (document.head.contains(script)) {
          document.head.removeChild(script);
        }
        if (document.head.contains(inlineScript)) {
          document.head.removeChild(inlineScript);
        }
      }
    }
  }, [categories.analytics]);

  return null;
}

