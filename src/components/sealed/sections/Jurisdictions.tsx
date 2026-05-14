// 6 wax seals row. Ports FJurisdictions() from sealed-final.jsx (lines 471-501).
import React from 'react';
import { JURISDICTIONS, WaxSeal, SmallLabel, FONTS, PALETTE } from '../atoms';

export default function Jurisdictions() {
  return (
    <div
      id="jurisdictions"
      className="px-6 lg:px-14 py-20 lg:py-24"
      style={{
        background: PALETTE.paper2,
        borderTop: `.5px solid ${PALETTE.rule}`,
        borderBottom: `.5px solid ${PALETTE.rule}`,
      }}
    >
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-6 mb-12">
        <div>
          <SmallLabel style={{ marginBottom: 16 }}>§ 05 · COVERAGE</SmallLabel>
          <h2
            style={{
              fontFamily: FONTS.display, fontWeight: 500,
              lineHeight: 1.05, letterSpacing: '-.03em',
              margin: 0,
            }}
            className="text-[40px] sm:text-[52px] lg:text-[60px]"
          >
            Seventeen jurisdictions,<br />
            <span style={{ fontStyle: 'italic' }}>one primitive</span>.
          </h2>
        </div>
        <div
          className="lg:text-right"
          style={{
            fontSize: 14.5, color: PALETTE.inkSoft,
            maxWidth: 360, lineHeight: 1.6,
          }}
        >
          Each jurisdiction is a set of rule primitives inside one engine — not a separate product, not a separate contract, not a separate price.
        </div>
      </div>
      <div
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6"
        style={{
          borderTop: `.5px solid ${PALETTE.ruleStrong}`,
          borderBottom: `.5px solid ${PALETTE.ruleStrong}`,
          background: PALETTE.paper,
        }}
      >
        {JURISDICTIONS.map((j, i) => (
          <div
            key={j.code}
            style={{
              padding: '30px 18px 36px',
              borderRight: i < 5 ? `.5px solid ${PALETTE.rule}` : 'none',
              borderBottom: i < JURISDICTIONS.length - 1 ? `.5px solid ${PALETTE.rule}` : 'none',
              textAlign: 'center',
            }}
            className="lg:[&]:border-b-0"
          >
            <WaxSeal size={68} label={j.code} style={{ margin: '0 auto 16px' }} />
            <div
              style={{
                fontFamily: FONTS.display, fontSize: 22,
                fontWeight: 600, letterSpacing: '.02em',
              }}
            >{j.code}</div>
            <div
              style={{
                fontSize: 12.5,
                color: PALETTE.inkSoft,
                marginTop: 4,
              }}
            >{j.region}</div>
            <div
              style={{
                fontFamily: FONTS.mono, fontSize: 10,
                color: PALETTE.concrete, marginTop: 10,
                letterSpacing: '.15em',
              }}
            >{j.lat}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
