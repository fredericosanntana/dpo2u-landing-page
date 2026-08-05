// Traction cards. Ports FTraction() from sealed-final.jsx (lines 537-573).
import React from 'react';
import { SmallLabel, FONTS, PALETTE } from '../atoms';

function TractionCard({ metric, value, note }: {
  metric: string; value: string; note: string;
}) {
  return (
    <div
      style={{
        background: PALETTE.paper,
        border: `.5px solid ${PALETTE.ruleStrong}`,
        padding: '28px 30px 30px',
      }}
    >
      <div
        style={{
          fontFamily: FONTS.mono, fontSize: 11,
          letterSpacing: '.2em', color: PALETTE.verdigris,
          textTransform: 'uppercase', fontWeight: 600,
        }}
      >{metric}</div>
      <div
        style={{
          fontFamily: FONTS.display, fontSize: 30, fontWeight: 500,
          letterSpacing: '-.02em', margin: '14px 0 14px',
          lineHeight: 1.15,
        }}
      >{value}</div>
      <div
        style={{
          fontSize: 13.5, color: PALETTE.inkSoft,
          lineHeight: 1.6,
        }}
      >{note}</div>
    </div>
  );
}

export default function Traction() {
  return (
    <div
      className="px-6 lg:px-14 py-20 lg:py-24"
      style={{
        background: PALETTE.paper2,
        borderTop: `.5px solid ${PALETTE.rule}`,
        borderBottom: `.5px solid ${PALETTE.rule}`,
      }}
    >
      <SmallLabel style={{ marginBottom: 16 }}>§ 07 · TRACTION</SmallLabel>
      <h2
        style={{
          fontFamily: FONTS.display, fontWeight: 500,
          lineHeight: 1.05, letterSpacing: '-.03em',
          margin: '0 0 56px',
        }}
        className="text-[40px] sm:text-[52px] lg:text-[60px]"
      >
        Five years. Fourteen programs.<br />
        <span style={{ fontStyle: 'italic' }}>Live today.</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TractionCard
          metric="✓ HEALTH"
          value="mcp.dpo2u.com"
          note="Endpoint live. OAuth. 54 tools responding under 2s end-to-end. Polled every 60s."
        />
        <TractionCard
          metric="✓ LIVE"
          value="Soroban contract"
          note="register · verify · configure · authorize. anticorruption-attestation deployed on Stellar testnet, immutable."
        />
        <TractionCard
          metric="2021 → 2026"
          value="Five-year track record"
          note="DPO2U has shipped LGPD compliance to production since 2021 — five years of operating compliance for SaaS, fintech, exchanges, and AI startups across Brazil and the EU."
        />
      </div>
    </div>
  );
}
