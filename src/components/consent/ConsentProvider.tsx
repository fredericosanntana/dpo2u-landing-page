"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type ConsentCategories = {
  analytics: boolean;
  marketing: boolean;
};

type ConsentState = {
  given: boolean;
  categories: ConsentCategories;
  acceptAll: () => void;
  rejectAll: () => void;
  setCategories: (c: ConsentCategories) => void;
};

const defaultState: ConsentState = {
  given: false,
  categories: { analytics: false, marketing: false },
  acceptAll: () => {},
  rejectAll: () => {},
  setCategories: () => {},
};

const ConsentContext = createContext<ConsentState>(defaultState);
export const useConsent = () => useContext(ConsentContext);

const STORAGE_KEY = 'dpo2u-consent-v1';

export default function ConsentProvider({ children }: { children: React.ReactNode }) {
  const [given, setGiven] = useState(false);
  const [categories, setCategories] = useState<ConsentCategories>({ analytics: false, marketing: false });

  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null;
      if (raw) {
        const parsed = JSON.parse(raw);
        setGiven(!!parsed.given);
        setCategories({
          analytics: !!parsed.categories?.analytics,
          marketing: !!parsed.categories?.marketing,
        });
      }
    } catch {
      /* noop */
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ given, categories, ts: Date.now() })
      );
    } catch {
      /* noop */
    }
  }, [given, categories]);

  const value = useMemo<ConsentState>(() => ({
    given,
    categories,
    acceptAll: () => {
      setCategories({ analytics: true, marketing: true });
      setGiven(true);
    },
    rejectAll: () => {
      setCategories({ analytics: false, marketing: false });
      setGiven(true);
    },
    setCategories: (c: ConsentCategories) => {
      setCategories(c);
      setGiven(true);
    },
  }), [given, categories]);

  return (
    <ConsentContext.Provider value={value}>
      {children}
    </ConsentContext.Provider>
  );
}

