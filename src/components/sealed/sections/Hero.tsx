// Hero section. Ports FHero() from sealed-final.jsx (lines 114-175).
import React, { useState } from 'react';
import {
  WaxSeal, Cancellation, Stamp, Button, SmallLabel, FONTS, PALETTE,
} from '../atoms';
import PitchDeckModal from '../PitchDeckModal';

export default function Hero() {
  const [deckOpen, setDeckOpen] = useState(false);
  return (
    <div className="px-6 lg:px-14 pt-[72px] pb-[80px] relative">
      <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] gap-10 lg:gap-16 items-start">
        <div>
          <SmallLabel style={{ marginBottom: 24 }}>
            ISSUE N°001 · COLOSSEUM FRONTIER 2026 · SÃO PAULO · EST. 2021
          </SmallLabel>
          <h1
            style={{
              fontFamily: FONTS.display,
              fontWeight: 500,
              lineHeight: 0.9,
              letterSpacing: '-.038em',
              margin: 0,
            }}
            className="text-[64px] sm:text-[88px] lg:text-[132px]"
          >
            Compliance,<br />
            <span style={{ fontStyle: 'italic' }}>sealed</span>
            <span style={{ color: PALETTE.terracotta }}>.</span>
          </h1>
          <div
            style={{
              marginTop: 32,
              maxWidth: 580,
              fontSize: 19.5,
              lineHeight: 1.55,
              color: PALETTE.inkSoft,
            }}
          >
            Regulatory compliance as on-chain primitives. For every Solana project that processes data, issues tokens, or runs AI — 17 jurisdictions, 70 countries, 6 AI governance frameworks. From DPIA generation to MICA proof-of-reserve.
            <br /><br />
            <b style={{ color: PALETTE.ink }}>Score stays private. Proof is public.</b>
            <br />
            Without a lawyer. Without a dashboard your buyer can see.
          </div>
          <div
            style={{ marginTop: 36 }}
            className="flex gap-3 items-center flex-wrap"
          >
            <Button kind="terracotta" href="#sdk">
              <span style={{ fontFamily: FONTS.mono, fontSize: 13.5 }}>$ npm install dpo2u-sdk</span>
            </Button>
            <Button kind="ghost" href="/research">Read the docs →</Button>
            <span
              style={{
                fontFamily: FONTS.mono,
                fontSize: 11,
                color: PALETTE.concrete,
                letterSpacing: '.15em',
                marginLeft: 8,
              }}
            >v0.4.1 · MIT · TS-first</span>
          </div>
          <div
            className="mt-14 grid grid-cols-2 lg:grid-cols-4"
            style={{
              borderTop: `.5px solid ${PALETTE.ruleStrong}`,
              borderBottom: `.5px solid ${PALETTE.ruleStrong}`,
            }}
          >
            {[
              ['1.94s', 'per attestation'],
              ['$0.0002', 'per seal'],
              ['15', 'jurisdictions'],
              ['5 yrs', 'since 2021'],
            ].map(([n, l], i) => (
              <div
                key={l}
                style={{
                  padding: '22px 20px',
                  borderRight: i < 3 ? `.5px solid ${PALETTE.rule}` : 'none',
                }}
                className={
                  // remove right border on last item per row at each breakpoint
                  i % 2 === 1
                    ? 'lg:[&]:border-r-[.5px] [&]:border-r-0'
                    : ''
                }
              >
                <div
                  className="text-[30px] sm:text-[34px] lg:text-[36px]"
                  style={{
                    fontFamily: FONTS.display, fontWeight: 500,
                    letterSpacing: '-.025em', lineHeight: 1,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >{n}</div>
                <SmallLabel style={{ marginTop: 8 }}>{l}</SmallLabel>
              </div>
            ))}
          </div>
        </div>
        <div className="relative pt-3">
          <div
            style={{
              position: 'absolute',
              top: -8, right: -10,
              transform: 'rotate(8deg)',
              zIndex: 2,
            }}
          >
            <Stamp rotate={8}>Live · Devnet</Stamp>
          </div>
          <WaxSeal size={240} style={{ margin: '0 auto 24px' }} />
          <Cancellation width={400} lines={6} style={{ margin: '0 auto', display: 'block' }} />
          <div
            style={{
              marginTop: 22,
              textAlign: 'center',
              fontFamily: FONTS.display,
              fontStyle: 'italic',
              fontSize: 22,
              color: PALETTE.inkSoft,
              maxWidth: 360,
              marginLeft: 'auto',
              marginRight: 'auto',
              lineHeight: 1.4,
            }}
          >
            "Score stays private.<br />Proof is public."
          </div>
          <div style={{ marginTop: 14, textAlign: 'center' }}>
            <SmallLabel>SEAL N° 000 004 821 · 2026-04-29</SmallLabel>
          </div>
          {/* 90-second pitch — portrait reel embedded under the seal so it sits
              alongside the stat grid in the left column on desktop. Caps width
              so the 9:16 reel doesn't dominate the right column. */}
          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <SmallLabel style={{ marginBottom: 10, display: 'block' }}>
              § PITCH · 90s
            </SmallLabel>
            <video
              controls
              preload="metadata"
              playsInline
              style={{
                width: '100%',
                maxWidth: 280,
                background: PALETTE.ink,
                border: `.5px solid ${PALETTE.ruleStrong}`,
                display: 'block',
                margin: '0 auto',
              }}
            >
              <source src="/downloads/pitch/dpo2u-pitch-2026.mp4" type="video/mp4" />
              <a href="/downloads/pitch/dpo2u-pitch-2026.mp4">Download the pitch (mp4)</a>
            </video>
            <div style={{ marginTop: 10 }}>
              <button
                type="button"
                onClick={() => setDeckOpen(true)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  padding: 0,
                  fontFamily: FONTS.mono,
                  fontSize: 11,
                  color: PALETTE.concrete,
                  letterSpacing: '.15em',
                  textTransform: 'uppercase',
                  textDecoration: 'underline',
                  textUnderlineOffset: 3,
                  cursor: 'pointer',
                }}
              >
                § VIEW DECK · 13 SLIDES
              </button>
            </div>
          </div>
        </div>
      </div>
      <PitchDeckModal open={deckOpen} onClose={() => setDeckOpen(false)} />
    </div>
  );
}
