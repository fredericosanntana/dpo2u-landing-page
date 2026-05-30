// Three-tier open-core ladder on the home. PRD §4.3 / mockup.
// Qualitative — no fixed Managed/$ number (gate G5: pricing in calibration).
import React from 'react';
import { Link } from 'react-router-dom';
import { SmallLabel, FONTS, PALETTE } from '../atoms';

const TIERS = [
  {
    name: 'Run it yourself',
    sub: 'Open Source',
    price: 'Free SDK + $0.0002 / attestation',
    points: ['Open-source SDK (npm + cargo)', 'Run primitives in your own CI/CD', 'You hold the keys · all chains · 24 jurisdictions'],
    featured: false,
  },
  {
    name: 'We run it',
    sub: 'Managed Protocol',
    price: 'In calibration + $0.0002 / attestation',
    points: ['Connect your repo — we execute the pipeline', 'Automatic on-chain anchoring + monitoring', 'Dashboard + audit-evidence export'],
    featured: true,
  },
  {
    name: 'We’re your DPO',
    sub: 'DPO-as-a-Service',
    price: 'Custom retainer + per-attestation',
    points: ['Everything in Managed', 'Named, accountable DPO of record', 'Audit defense + regulator interface'],
    featured: false,
  },
] as const;

export default function Ladder() {
  return (
    <div id="ladder" className="px-6 lg:px-14 py-20 lg:py-24" style={{ background: PALETTE.paper2, borderTop: `.5px solid ${PALETTE.rule}` }}>
      <SmallLabel style={{ marginBottom: 16 }}>§ 03 · THE LADDER</SmallLabel>
      <h2
        style={{ fontFamily: FONTS.display, fontWeight: 500, lineHeight: 1.05, letterSpacing: '-.03em', margin: 0 }}
        className="text-[36px] sm:text-[48px] lg:text-[56px] mb-3"
      >
        Three ways to <span style={{ fontStyle: 'italic' }}>seal</span> compliance<span style={{ color: PALETTE.terracotta }}>.</span>
      </h2>
      <p className="text-[16px] mb-12" style={{ color: PALETTE.inkSoft, maxWidth: 560 }}>
        The attestation is the unit of value — and the unit of billing. The ladder is defined by who runs the primitives and who stands behind the result.
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {TIERS.map((t) => (
          <div
            key={t.name}
            className="flex flex-col p-7"
            style={{
              borderRadius: 4,
              border: `${t.featured ? 2 : 0.5}px solid ${t.featured ? PALETTE.terracotta : PALETTE.ruleStrong}`,
              background: t.featured ? PALETTE.ink : PALETTE.paper,
              color: t.featured ? PALETTE.paper : PALETTE.ink,
            }}
          >
            <SmallLabel style={{ color: t.featured ? PALETTE.terracotta : PALETTE.concrete, marginBottom: 10 }}>{t.sub}</SmallLabel>
            <h3 style={{ fontFamily: FONTS.display, fontSize: 24, fontWeight: 500, letterSpacing: '-.02em', margin: 0 }}>{t.name}</h3>
            <div style={{ fontFamily: FONTS.mono, fontSize: 12.5, marginTop: 10, color: t.featured ? 'rgba(241,236,227,.8)' : PALETTE.concrete }}>{t.price}</div>
            <ul className="mt-5 space-y-2 flex-1">
              {t.points.map((p, i) => (
                <li key={i} className="flex gap-2 text-[14px] leading-[1.45]" style={{ color: t.featured ? 'rgba(241,236,227,.92)' : PALETTE.inkSoft }}>
                  <span style={{ color: PALETTE.terracotta }}>→</span><span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-10">
        <Link
          to="/pricing"
          style={{ fontFamily: FONTS.body, fontSize: 15, fontWeight: 500, color: PALETTE.ink, textDecoration: 'none', borderBottom: `1px solid ${PALETTE.terracotta}`, paddingBottom: 2 }}
        >
          See full pricing →
        </Link>
        <span style={{ fontFamily: FONTS.mono, fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase', color: PALETTE.concrete, marginLeft: 16 }}>
          Managed · DPO pricing in calibration
        </span>
      </div>
    </div>
  );
}
