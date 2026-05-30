// Two doors — "I'm building" vs "Run it for me". PRD §4.2 / home mockup.
// Sealed identity: reuses PALETTE/FONTS/SmallLabel; no new design tokens.
import React from 'react';
import { Link } from 'react-router-dom';
import { SmallLabel, FONTS, PALETTE } from '../atoms';

const DOORS = [
  {
    tag: "I'm building",
    h: 'Run the primitives in your own stack.',
    p: 'Install the open-source SDK and run DPO2U’s compliance primitives inside your CI/CD. Open source, any stack — you hold the keys.',
    code: '$ npm install @dpo2u/sdk',
    note: 'SDK in private alpha',
    cta: { label: 'Read the docs →', to: '/research' },
  },
  {
    tag: 'Run it for me',
    h: 'The result, not the integration.',
    p: 'Don’t run it yourself. We execute the pipeline for you — or go further and become your accountable DPO of record.',
    code: '⤷ connect your repository → we seal it',
    note: 'Managed · DPO-as-a-Service',
    cta: { label: 'See pricing →', to: '/pricing' },
  },
] as const;

export default function TwoDoors() {
  return (
    <div id="two-doors" className="px-6 lg:px-14 py-20 lg:py-24">
      <SmallLabel style={{ marginBottom: 16 }}>§ 02 · TWO WAYS IN</SmallLabel>
      <h2
        style={{ fontFamily: FONTS.display, fontWeight: 500, lineHeight: 1.05, letterSpacing: '-.03em', margin: 0 }}
        className="text-[36px] sm:text-[48px] lg:text-[56px] mb-12"
      >
        Two ways in<span style={{ color: PALETTE.terracotta }}>.</span>
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {DOORS.map((d) => (
          <div
            key={d.tag}
            className="flex flex-col p-7 lg:p-9"
            style={{ background: PALETTE.paper2, border: `.5px solid ${PALETTE.ruleStrong}`, borderRadius: 4 }}
          >
            <SmallLabel style={{ color: PALETTE.terracotta, marginBottom: 14 }}>{d.tag}</SmallLabel>
            <h3
              style={{ fontFamily: FONTS.display, fontWeight: 500, fontSize: 27, letterSpacing: '-.02em', lineHeight: 1.1, margin: 0 }}
            >
              {d.h}
            </h3>
            <p className="mt-3 text-[15.5px] leading-[1.55]" style={{ color: PALETTE.inkSoft, flex: 1 }}>
              {d.p}
            </p>
            <div
              className="mt-6 px-4 py-3"
              style={{
                background: PALETTE.paper, border: `.5px solid ${PALETTE.rule}`, borderRadius: 4,
                fontFamily: FONTS.mono, fontSize: 13, color: PALETTE.ink, overflowX: 'auto', whiteSpace: 'nowrap',
              }}
            >
              {d.code}
            </div>
            <div className="mt-5 flex items-center justify-between">
              <Link
                to={d.cta.to}
                style={{ fontFamily: FONTS.body, fontSize: 15, fontWeight: 500, color: PALETTE.ink, textDecoration: 'none', borderBottom: `1px solid ${PALETTE.terracotta}`, paddingBottom: 2 }}
              >
                {d.cta.label}
              </Link>
              <span style={{ fontFamily: FONTS.mono, fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase', color: PALETTE.concrete }}>
                {d.note}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
