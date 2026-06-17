// /app/start — Act 1 (Start) of the funnel: "What do you need to prove?".
// The user picks the obligation → routes to execution (Act 2). Each option shows
// the honest status (live testnet) + a live on-chain proof link when one exists.
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FONTS, PALETTE, SmallLabel } from '@/components/sealed/atoms';
import { StatusBadge } from '@/components/app/ui/StatusBadge';
import { OBLIGATIONS, txExplorerUrl } from '@/lib/status-registry';

export default function AppStart() {
  const navigate = useNavigate();
  return (
    <div className="max-w-[1000px]">
      <SmallLabel>Start · Step 1 of 3</SmallLabel>
      <h1 className="text-[32px] md:text-[40px] font-medium" style={{ fontFamily: FONTS.display, letterSpacing: '-0.02em', marginTop: 6 }}>
        What do you need to prove<span style={{ color: PALETTE.terracotta }}>?</span>
      </h1>
      <p className="mt-2 text-[15px]" style={{ color: PALETTE.inkSoft, maxWidth: 620 }}>
        Pick the obligation. DPO2U runs the engine, generates the evidence and seals the proof on-chain — you walk away with a
        verifiable dossier. <span style={{ fontFamily: FONTS.mono, fontSize: 12, color: PALETTE.concrete }}>Start → Execution → Proof.</span>
      </p>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        {OBLIGATIONS.map((o) => (
          <button
            key={o.key}
            type="button"
            onClick={() => navigate(o.route)}
            className="appui-row text-left flex flex-col p-5"
            style={{ border: `.5px solid ${PALETTE.ruleStrong}`, borderRadius: 6, background: PALETTE.paper2, cursor: 'pointer' }}
          >
            <div className="flex items-start justify-between gap-3">
              <h3 style={{ fontFamily: FONTS.display, fontSize: 19, fontWeight: 500, lineHeight: 1.15 }}>{o.title}</h3>
              <StatusBadge status={o.status} />
            </div>
            <p className="mt-2 text-[14px] leading-[1.5]" style={{ color: PALETTE.inkSoft, flex: 1 }}>{o.blurb}</p>
            <div className="mt-4 flex items-center justify-between">
              <span style={{ fontFamily: FONTS.mono, fontSize: 11, color: PALETTE.terracotta }}>Start →</span>
              {o.proofTx && (
                <a
                  href={txExplorerUrl(o.proofTx)}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  style={{ fontFamily: FONTS.mono, fontSize: 10, color: PALETTE.concrete, textDecoration: 'underline', textUnderlineOffset: 3 }}
                >
                  live proof ↗
                </a>
              )}
            </div>
          </button>
        ))}
      </div>

      <p className="mt-8 text-[12px]" style={{ color: PALETTE.concrete, fontFamily: FONTS.mono }}>
        Everything on testnet. Seals and proofs are real and verifiable;{' '}
        <Link to="/app/evidence" style={{ color: PALETTE.terracotta }}>see your dossier →</Link>
      </p>
    </div>
  );
}
