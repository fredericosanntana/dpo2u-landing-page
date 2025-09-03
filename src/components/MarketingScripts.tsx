"use client";

import React from 'react';
import Script from 'next/script';
import { useConsent } from '@/components/consent/ConsentProvider';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export default function MarketingScripts() {
  const { categories } = useConsent();

  return (
    <>
      {/* Google Analytics (consent: analytics) */}
      {GA_ID && categories.analytics && (
        <>
          <Script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
          <Script id="ga-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);} 
              gtag('js', new Date());
              gtag('config', '${GA_ID}', { anonymize_ip: true });
            `}
          </Script>
        </>
      )}
    </>
  );
}

