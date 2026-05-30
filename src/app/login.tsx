/**
 * /login — wallet connect ("Seal in"). PRD §7.6 / screens auth card.
 * Freighter primary; Phantom behind VITE_WALLET_SOLANA; WalletConnect/GitHub roadmap.
 */
import React from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { usePageHead } from '@/lib/page-head';
import { FONTS, PALETTE, SmallLabel, WaxSeal, DPO2UWordmark } from '@/components/sealed/atoms';
import { useWalletAuth } from '@/components/app/WalletAuthProvider';
import { WALLET_ADAPTERS } from '@/lib/app/wallet-multi';

export default function LoginPage() {
  usePageHead({ title: 'Connect — DPO2U', description: 'Conecte sua wallet para entrar no app DPO2U.', path: '/login' });
  const { pubkey, connect, connecting, error } = useWalletAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? '/app';

  if (pubkey) return <Navigate to={from} replace />;

  const onConnect = async (id: string) => {
    const ok = await connect(id);
    if (ok) navigate(from, { replace: true });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 py-16"
      style={{ background: PALETTE.paper, color: PALETTE.ink, fontFamily: FONTS.body }}
    >
      <div className="w-full max-w-[460px] text-center">
        <Link to="/" className="inline-block mb-8"><DPO2UWordmark size={22} /></Link>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <WaxSeal size={96} label="SEAL IN" />
        </div>
        <h1
          className="text-[34px] md:text-[40px] font-medium"
          style={{ fontFamily: FONTS.display, letterSpacing: '-0.02em', marginTop: 18 }}
        >
          Seal in<span style={{ color: PALETTE.terracotta }}>.</span>
        </h1>
        <p className="mt-3 text-[15px]" style={{ color: PALETTE.inkSoft }}>
          Conecte sua wallet para abrir o app. Você paga por atestação — sem assinatura recorrente no tier OSS.
        </p>

        <div className="mt-8 flex flex-col gap-3 text-left">
          {WALLET_ADAPTERS.map((a) => (
            <button
              key={a.id}
              type="button"
              disabled={!a.enabled || connecting}
              onClick={() => void onConnect(a.id)}
              className="flex items-center justify-between px-5 py-4 transition-colors"
              style={{
                border: `1px solid ${a.enabled ? PALETTE.ruleStrong : PALETTE.rule}`,
                borderRadius: 4,
                background: PALETTE.paper2,
                color: a.enabled ? PALETTE.ink : PALETTE.concrete,
                cursor: a.enabled && !connecting ? 'pointer' : 'not-allowed',
                opacity: a.enabled ? 1 : 0.6,
              }}
            >
              <span style={{ fontFamily: FONTS.body, fontSize: 15, fontWeight: 500 }}>{a.label}</span>
              <span style={{ fontFamily: FONTS.mono, fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: PALETTE.concrete }}>
                {connecting ? '…' : a.enabled ? 'connect →' : 'soon'}
              </span>
            </button>
          ))}
          <div className="flex items-center gap-3 my-1">
            <div style={{ flex: 1, height: 1, background: PALETTE.rule }} />
            <SmallLabel>or</SmallLabel>
            <div style={{ flex: 1, height: 1, background: PALETTE.rule }} />
          </div>
          <button
            type="button"
            disabled
            className="px-5 py-4"
            style={{ border: `1px solid ${PALETTE.rule}`, borderRadius: 4, background: PALETTE.paper2, color: PALETTE.concrete, cursor: 'not-allowed', opacity: 0.6, fontFamily: FONTS.body, fontSize: 15 }}
          >
            GitHub <span style={{ fontFamily: FONTS.mono, fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase' }}>· soon</span>
          </button>
        </div>

        {error && (
          <p className="mt-4 text-[13px]" style={{ color: PALETTE.terracotta, fontFamily: FONTS.mono }}>{error}</p>
        )}
        <p className="mt-6 text-[12px]" style={{ color: PALETTE.concrete }}>
          Sessão client-only — a chave fica na sua wallet. Ver <Link to="/privacy" style={{ color: PALETTE.terracotta }}>Privacy</Link>.
        </p>
      </div>
    </div>
  );
}
