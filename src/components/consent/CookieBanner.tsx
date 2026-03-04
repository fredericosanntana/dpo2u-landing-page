"use client";

import React, { useState } from 'react';
import { useConsent } from './ConsentProvider';

export default function CookieBanner() {
  const { given, categories, acceptAll, rejectAll, setCategories } = useConsent();
  const [showCustomize, setShowCustomize] = useState(false);
  const [localCats, setLocalCats] = useState(categories);

  if (given) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] p-4 sm:p-6">
      <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white/95 shadow-xl backdrop-blur dark:bg-slate-900/95 dark:border-slate-700">
        <div className="p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Privacy &amp; Cookies</h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            We use cookies to improve your experience, measure audience (analytics), and, with your permission, for marketing purposes. You can accept, reject, or customize.
          </p>

          {showCustomize && (
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-200">
                <input
                  type="checkbox"
                  checked={localCats.analytics}
                  onChange={(e) => setLocalCats((c) => ({ ...c, analytics: e.target.checked }))}
                />
                Analytics (GA4)
              </label>
              <label className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-200">
                <input
                  type="checkbox"
                  checked={localCats.marketing}
                  onChange={(e) => setLocalCats((c) => ({ ...c, marketing: e.target.checked }))}
                />
                Marketing (disabled by default)
              </label>
              <div className="sm:col-span-2 flex justify-end gap-2 pt-1">
                <button
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
                  onClick={() => setShowCustomize(false)}
                >
                  Back
                </button>
                <button
                  className="px-4 py-2 rounded-lg bg-primary text-white hover:opacity-90"
                  onClick={() => setCategories(localCats)}
                >
                  Save Preferences
                </button>
              </div>
            </div>
          )}

          {!showCustomize && (
            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
              <button
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
                onClick={rejectAll}
              >
                Reject All
              </button>
              <button
                className="px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-50 border border-slate-300 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
                onClick={() => setShowCustomize(true)}
              >
                Customize
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-primary text-white hover:opacity-90"
                onClick={acceptAll}
              >
                Accept All
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
