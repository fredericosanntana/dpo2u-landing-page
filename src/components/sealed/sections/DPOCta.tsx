// DPO-as-a-Service conversion card. PRD / mockup "We become your DPO".
import React from 'react';
import { Link } from 'react-router-dom';
import { SmallLabel, FONTS, PALETTE, WaxSeal } from '../atoms';

const TRUST = [
  ['2021', 'founded · independent'],
  ['24', 'jurisdictions'],
  ['On-chain', 'auditable evidence'],
];

export default function DPOCta() {
  return (
    <div className="px-6 lg:px-14 py-20 lg:py-24" style={{ borderTop: `.5px solid ${PALETTE.rule}` }}>
      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-10 lg:gap-16 items-center">
        <div>
          <SmallLabel style={{ marginBottom: 16 }}>§ DPO-AS-A-SERVICE</SmallLabel>
          <h2
            style={{ fontFamily: FONTS.display, fontWeight: 500, lineHeight: 1.05, letterSpacing: '-.03em', margin: 0 }}
            className="text-[34px] sm:text-[44px] lg:text-[52px]"
          >
            Don’t want to run any of it?<br />
            <span style={{ fontStyle: 'italic' }}>We become your DPO</span><span style={{ color: PALETTE.terracotta }}>.</span>
          </h2>
          <p className="mt-5 text-[17px] leading-[1.55]" style={{ color: PALETTE.inkSoft, maxWidth: 560 }}>
            For regulated companies and stablecoin issuers: a named, accountable Data Protection Officer of record,
            audit defense and regulator interface, with every compliance event sealed on-chain as verifiable evidence.
          </p>
          <div className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
            {TRUST.map(([n, l]) => (
              <div key={l}>
                <div style={{ fontFamily: FONTS.display, fontSize: 26, fontWeight: 500, letterSpacing: '-.02em' }}>{n}</div>
                <SmallLabel style={{ marginTop: 4 }}>{l}</SmallLabel>
              </div>
            ))}
          </div>
          <div className="mt-9">
            <Link
              to="/alpha-signup"
              className="inline-flex items-center gap-2 px-6 py-3"
              style={{ background: PALETTE.terracotta, color: '#FFFFFF', borderRadius: 4, fontFamily: FONTS.body, fontSize: 15, fontWeight: 500, textDecoration: 'none' }}
            >
              Book a DPO consult →
            </Link>
          </div>
        </div>
        <div className="hidden lg:flex justify-center">
          <WaxSeal size={180} label="DPO OF RECORD" />
        </div>
      </div>
    </div>
  );
}
