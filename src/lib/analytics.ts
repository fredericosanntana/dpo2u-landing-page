// Lightweight GA4 helpers (safe no-op if GA not configured)

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || '';

export function gaReady(): boolean {
  return typeof window !== 'undefined' && !!GA_ID && typeof window.gtag === 'function';
}

function analyticsConsentEnabled(): boolean {
  try {
    if (typeof window === 'undefined') return false;
    const raw = window.localStorage.getItem('dpo2u-consent-v1');
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    return !!parsed?.categories?.analytics;
  } catch {
    return false;
  }
}

export function trackEvent(eventName: string, params: Record<string, any> = {}): void {
  try {
    if (gaReady() && analyticsConsentEnabled()) {
      window.gtag('event', eventName, params);
    }
  } catch {
    // swallow
  }
}

export function trackCTA(label: string, location: string): void {
  trackEvent('cta_click', { label, location });
}
