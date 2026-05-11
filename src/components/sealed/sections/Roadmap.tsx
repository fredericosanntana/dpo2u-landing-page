// Roadmap timeline. Ports FRoadmap() from sealed-final.jsx (lines 640-682).
import React from 'react';
import { SmallLabel, FONTS, PALETTE } from '../atoms';

const MILESTONES = [
  { t: '2021 → 2025', label: 'Foundation', items: ['DPO2U founded · São Paulo', 'LGPD reference engine in production', '50M+ CNPJs in regulatory scope', 'Web2 SaaS, fintech & exchange clients'] },
  { t: '2026 · Q2',   label: 'Now',         items: ['Devnet live · 14 programs', '66 MCP tools · OAuth', '17 jurisdictions · 70 countries · EMEA + Americas + APAC', 'Hiroshima ICOC G7 + AI Governance vertical (six frameworks)', 'CAIDP + UNESCO + UN Global Dialogue alignment', 'Colosseum Frontier submission'] },
  { t: '2026 · Q3-Q4',label: 'Mainnet',     items: ['Solana mainnet deploy', 'dpo2u-sdk v1.0 npm', 'SOC2 + HIPAA primitives', 'KSA PDPL · LATAM expansion'] },
  { t: '2027',        label: 'Open',        items: ['Permissionless verifier set', 'On-chain attestation marketplace', 'Cross-chain proofs · zk-bridges'] },
];

export default function Roadmap() {
  return (
    <div
      className="px-6 lg:px-14 py-20 lg:py-24"
      style={{
        background: PALETTE.paper2,
        borderTop: `.5px solid ${PALETTE.rule}`,
        borderBottom: `.5px solid ${PALETTE.rule}`,
      }}
    >
      <SmallLabel style={{ marginBottom: 16 }}>§ 09 · ROADMAP</SmallLabel>
      <h2
        style={{
          fontFamily: FONTS.display, fontWeight: 500,
          lineHeight: 1.05, letterSpacing: '-.03em',
          margin: '0 0 48px',
        }}
        className="text-[40px] sm:text-[52px] lg:text-[60px]"
      >
        Five years in. <span style={{ fontStyle: 'italic' }}>Now on-chain.</span>
      </h2>
      <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0">
        <div
          className="hidden lg:block"
          style={{
            position: 'absolute',
            top: 30,
            left: '4%',
            right: '4%',
            height: 1,
            background: PALETTE.ruleStrong,
          }}
        />
        {MILESTONES.map((m, i) => (
          <div key={m.t} className="lg:px-4 relative">
            <div
              style={{
                width: 14, height: 14, borderRadius: '50%',
                background: i === 1 ? PALETTE.terracotta : PALETTE.paper,
                border: `1.5px solid ${PALETTE.terracotta}`,
                margin: '24px auto 24px',
                position: 'relative',
                zIndex: 2,
              }}
            />
            <SmallLabel
              style={{
                textAlign: 'center',
                color: i === 1 ? PALETTE.terracotta : PALETTE.concrete,
              }}
            >{m.t}</SmallLabel>
            <div
              style={{
                fontFamily: FONTS.display, fontSize: 24,
                fontWeight: 500, fontStyle: 'italic',
                textAlign: 'center', margin: '8px 0 16px',
                letterSpacing: '-.015em',
              }}
            >{m.label}</div>
            <div className="flex flex-col gap-2">
              {m.items.map((it) => (
                <div
                  key={it}
                  style={{
                    fontSize: 12.5, color: PALETTE.inkSoft,
                    lineHeight: 1.5, paddingLeft: 14,
                    position: 'relative',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute', left: 0, top: 8,
                      width: 6, height: 1,
                      background: PALETTE.terracotta,
                    }}
                  />
                  {it}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
