// Payment confirmation gate — shows the exact x402 price BEFORE the Freighter
// signature popup. Wired as withX402's `onChallenge` hook: the server's real 402
// challenge is surfaced to the user (amount, asset, network, recipient) and the
// payment only proceeds on explicit confirm. If x402 is disabled server-side the
// first call returns ok with no challenge, so this never appears (no charge).
import React, { useEffect } from 'react';
import { create } from 'zustand';
import { FONTS, PALETTE, SmallLabel } from '@/components/sealed/atoms';
import { humanAmount, type X402Challenge } from '@/lib/pilot/payment-tx';
import { AppButton, btnClass } from './primitives';

interface Pending { challenge: X402Challenge; resolve: (ok: boolean) => void }
interface Store { pending: Pending | null }

const usePayStore = create<Store>(() => ({ pending: null }));

/** Use as withX402({ onChallenge: requestPaymentConfirm }). Resolves true to pay. */
export function requestPaymentConfirm(challenge: X402Challenge): Promise<boolean> {
  return new Promise((resolve) => usePayStore.setState({ pending: { challenge, resolve } }));
}

function settle(ok: boolean) {
  const p = usePayStore.getState().pending;
  if (!p) return;
  p.resolve(ok);
  usePayStore.setState({ pending: null });
}

function assetLabel(c: X402Challenge): string {
  const sym = c.extra?.assetSymbol ?? c.extra?.symbol;
  if (sym && String(sym).length > 0) return String(sym);
  return 'USDC';
}

function networkLabel(c: X402Challenge): string {
  return c.network.includes('testnet') ? 'Stellar testnet' : 'Stellar';
}

/** Mount once (AppLayout). Renders the confirm dialog when a payment is pending. */
export function PaymentConfirmHost() {
  const pending = usePayStore((s) => s.pending);

  useEffect(() => {
    if (!pending) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') settle(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [pending]);

  if (!pending) return null;
  const c = pending.challenge;
  const amount = humanAmount(c);
  const asset = assetLabel(c);
  const net = networkLabel(c);
  const isTestnet = c.network.includes('testnet');

  return (
    <div
      onClick={() => settle(false)}
      className="fixed inset-0 z-[70] flex items-center justify-center px-4"
      style={{ background: 'rgba(12,13,16,.45)' }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Confirm payment"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[420px]"
        style={{ background: PALETTE.paper, border: `1px solid ${PALETTE.ruleStrong}`, borderRadius: 6, padding: 24, fontFamily: FONTS.body, boxShadow: '0 24px 60px rgba(12,13,16,.28)' }}
      >
        <SmallLabel>Confirm payment</SmallLabel>
        <div className="mt-2 flex items-baseline gap-2">
          <span style={{ fontFamily: FONTS.display, fontSize: 38, fontWeight: 600, letterSpacing: '-0.02em' }}>{amount}</span>
          <span style={{ fontFamily: FONTS.mono, fontSize: 15, color: PALETTE.inkSoft }}>{asset}</span>
        </div>
        <p className="mt-2 text-[13px]" style={{ color: PALETTE.inkSoft, lineHeight: 1.5 }}>
          You'll sign this payment in Freighter, then we anchor the seal on-chain. {isTestnet ? 'Running on testnet — no real funds.' : ''}
        </p>

        <div className="mt-4" style={{ display: 'flex', flexDirection: 'column', gap: 8, fontFamily: FONTS.mono, fontSize: 12 }}>
          <div className="flex justify-between gap-3">
            <span style={{ color: PALETTE.concrete }}>Network</span>
            <span style={{ color: PALETTE.ink }}>{net}</span>
          </div>
          <div className="flex justify-between gap-3">
            <span style={{ color: PALETTE.concrete }}>Recipient</span>
            <span style={{ color: PALETTE.ink, wordBreak: 'break-all', textAlign: 'right' }}>{c.payTo.slice(0, 6)}…{c.payTo.slice(-6)}</span>
          </div>
          <div className="flex justify-between gap-3">
            <span style={{ color: PALETTE.concrete }}>Protocol</span>
            <span style={{ color: PALETTE.ink }}>x402 · {c.scheme}</span>
          </div>
        </div>

        <div className="mt-6 flex gap-3 justify-end">
          <button type="button" onClick={() => settle(false)} className={btnClass('ghost')}>Cancel</button>
          <AppButton variant="terracotta" onClick={() => settle(true)}>Pay {amount} {asset} →</AppButton>
        </div>
      </div>
    </div>
  );
}
