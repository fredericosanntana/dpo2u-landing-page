// Lightweight brand toast — zustand store + viewport (matches the app's other
// zustand stores; no React context/provider to wire). Mount <ToastViewport/> once
// in AppLayout, then call toast.success(...) / toast.error(...) from anywhere.
import React from 'react';
import { create } from 'zustand';
import { FONTS, PALETTE } from '@/components/sealed/atoms';
import type { Tone } from './primitives';
import './ui.css';

export interface ToastItem { id: number; tone: Tone; message: string }

interface ToastState {
  toasts: ToastItem[];
  push: (tone: Tone, message: string) => void;
  dismiss: (id: number) => void;
}

let seq = 0;

const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  push: (tone, message) => {
    const id = ++seq;
    set((s) => ({ toasts: [...s.toasts, { id, tone, message }] }));
    // Errors linger longer; successes/info auto-dismiss.
    const ttl = tone === 'error' ? 7000 : 4500;
    setTimeout(() => get().dismiss(id), ttl);
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

/** Fire-and-forget toast helpers. */
export const toast = {
  success: (message: string) => useToastStore.getState().push('success', message),
  error: (message: string) => useToastStore.getState().push('error', message),
  info: (message: string) => useToastStore.getState().push('info', message),
};

const TONE_COLOR: Record<Tone, string> = {
  info: PALETTE.ruleStrong,
  success: PALETTE.verdigris,
  error: PALETTE.terracotta,
};
const TONE_GLYPH: Record<Tone, string> = { info: '·', success: '✓', error: '⚠' };

/** Renders the active toasts. Mount once (AppLayout). */
export function ToastViewport() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);
  if (toasts.length === 0) return null;
  return (
    <div
      aria-live="polite"
      style={{ position: 'fixed', right: 16, bottom: 16, zIndex: 60, display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 'min(380px, calc(100vw - 32px))' }}
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className="appui-toast"
          style={{
            display: 'flex', alignItems: 'flex-start', gap: 10,
            background: PALETTE.paper, color: PALETTE.ink,
            border: `1px solid ${TONE_COLOR[t.tone]}`, borderLeft: `3px solid ${TONE_COLOR[t.tone]}`,
            borderRadius: 4, padding: '12px 14px', fontFamily: FONTS.body, fontSize: 13,
            boxShadow: '0 10px 30px rgba(12,13,16,.14)',
          }}
        >
          <span aria-hidden style={{ color: TONE_COLOR[t.tone], fontFamily: FONTS.mono, lineHeight: 1.4 }}>{TONE_GLYPH[t.tone]}</span>
          <span style={{ flex: 1, lineHeight: 1.45 }}>{t.message}</span>
          <button
            type="button"
            onClick={() => dismiss(t.id)}
            aria-label="Dismiss"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: PALETTE.concrete, fontSize: 14, lineHeight: 1, padding: 0, marginLeft: 2 }}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
