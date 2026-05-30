/**
 * /app/settings — wallet, workspace, tier + OSS API key (Fase E).
 * The wallet session is client-only; the OSS API key (reused from the pilot
 * auth-store) is what authorizes writes to the gateway until wallet-signature
 * auth exists server-side.
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FONTS, PALETTE, SmallLabel, Rule } from '@/components/sealed/atoms';
import { useWalletAuth } from '@/components/app/WalletAuthProvider';
import { useAuthStore, maskApiKey } from '@/lib/pilot/auth-store';

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <SmallLabel>{label}</SmallLabel>
      <div style={{ fontFamily: FONTS.mono, fontSize: 13, marginTop: 4, wordBreak: 'break-all' }}>{value}</div>
    </div>
  );
}

export default function AppSettings() {
  const { pubkey, chain, network, tier, workspace, disconnect } = useWalletAuth();
  const navigate = useNavigate();
  const apiKey = useAuthStore((s) => s.apiKey);
  const setSession = useAuthStore((s) => s.setSession);
  const clearKey = useAuthStore((s) => s.clear);
  const [keyInput, setKeyInput] = useState('');

  return (
    <div className="max-w-[720px]">
      <SmallLabel>Settings</SmallLabel>
      <h1 className="text-[30px] md:text-[38px] font-medium" style={{ fontFamily: FONTS.display, letterSpacing: '-0.02em', marginTop: 6 }}>
        Workspace<span style={{ color: PALETTE.terracotta }}>.</span>
      </h1>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Field label="Workspace" value={workspace.label} />
        <Field label="Plan / tier" value={tier.label} />
        <Field label="Wallet" value={pubkey ?? '—'} />
        <Field label="Chain · network" value={`${chain ?? '—'} · ${network ?? '—'}`} />
      </div>

      <div className="mt-6">
        <button type="button" onClick={() => { disconnect(); navigate('/'); }} className="py-2.5 px-5 font-mono text-[12px] uppercase tracking-[.14em]"
          style={{ border: `1px solid ${PALETTE.ruleStrong}`, color: PALETTE.ink, background: 'transparent', cursor: 'pointer' }}>
          Disconnect wallet
        </button>
      </div>

      <Rule style={{ margin: '32px 0' }} color={PALETTE.ruleStrong} />

      <SmallLabel style={{ marginBottom: 8 }}>OSS gateway API key</SmallLabel>
      <p className="text-[13px] mb-3" style={{ color: PALETTE.inkSoft }}>
        Escrita no gateway (submit/erasure) ainda usa chave API OSS — auth por assinatura de wallet é roadmap. Atual: <b style={{ fontFamily: FONTS.mono }}>{maskApiKey(apiKey)}</b>.
      </p>
      <div className="flex gap-2 flex-wrap">
        <input value={keyInput} onChange={(e) => setKeyInput(e.target.value)} placeholder="dpo2u_sk_…" className="px-4 py-2.5 flex-1 min-w-[220px]"
          style={{ border: `1px solid ${PALETTE.ruleStrong}`, borderRadius: 4, background: PALETTE.paper, fontFamily: FONTS.mono, fontSize: 13 }} />
        <button type="button" onClick={() => { if (keyInput.trim()) { setSession({ apiKey: keyInput.trim() }); setKeyInput(''); } }}
          className="py-2.5 px-5 font-mono text-[12px] uppercase tracking-[.14em]" style={{ background: PALETTE.ink, color: PALETTE.paper, border: 'none', cursor: 'pointer' }}>
          Save key
        </button>
        {apiKey && (
          <button type="button" onClick={() => clearKey()} className="py-2.5 px-5 font-mono text-[12px] uppercase tracking-[.14em]"
            style={{ border: `1px solid ${PALETTE.ruleStrong}`, color: PALETTE.concrete, background: 'transparent', cursor: 'pointer' }}>
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
