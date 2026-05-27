// DPO2U footer. Ports FFooter() from sealed-final.jsx (lines 738-774).
import React from 'react';
import { DPO2ULockup, Rule, SmallLabel, FONTS, PALETTE } from '../atoms';

function FooterCol({ title, items }: { title: string; items: Array<[string, string]> }) {
  return (
    <div>
      <SmallLabel style={{ marginBottom: 14 }}>{title}</SmallLabel>
      <div
        className="flex flex-col gap-2"
        style={{ fontSize: 13, color: PALETTE.inkSoft }}
      >
        {items.map(([label, href]) => (
          <a
            key={label}
            href={href}
            style={{ color: 'inherit', textDecoration: 'none' }}
          >{label}</a>
        ))}
      </div>
    </div>
  );
}

export default function SealedFooter() {
  return (
    <footer
      className="px-6 lg:px-14 pt-14 pb-10"
      style={{ background: '#FFFFFF' }}
    >
      <div className="grid grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-8 mb-9">
        <div className="col-span-2 lg:col-span-1">
          <DPO2ULockup size={32} style={{ marginBottom: 16 }} />
          <div
            style={{
              fontSize: 13.5,
              color: PALETTE.inkSoft,
              lineHeight: 1.6,
              maxWidth: 380,
            }}
          >
            DPO2U is a São Paulo compliance house. <b style={{ color: PALETTE.ink }}>Founded 2021.</b> Now turning five years of regulatory engineering into on-chain primitives — for every Solana project that processes data, issues tokens, or runs AI. 17 jurisdictions. 70 countries. 6 AI governance frameworks.
          </div>
          <div
            style={{
              marginTop: 16,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 14px',
              border: `.5px solid ${PALETTE.ruleStrong}`,
              borderRadius: 2,
            }}
          >
            <span
              style={{
                fontFamily: FONTS.mono,
                fontSize: 9.5,
                letterSpacing: '.25em',
                color: PALETTE.concrete,
              }}
            >EST. MMXXI · SÃO PAULO</span>
          </div>
        </div>
        <FooterCol
          title="Product"
          items={[
            ['Protocol', '/solana-protocol'],
            ['MCP endpoint', '/#mcp'],
            ['Architecture', '/solana-protocol'],
            ['Alpha showcase', '/alpha'],
            ['Alpha signup', '/alpha-signup'],
            ['Register a dApp', '/register-dapp'],
          ]}
        />
        <FooterCol
          title="Company"
          items={[
            ['About DPO2U', '/about'],
            ['Manifesto', '/about'],
            ['Research', '/research'],
            ['Colosseum 2026', '/research'],
            ['Contact', 'mailto:fredericosanntana@gmail.com'],
          ]}
        />
        <FooterCol
          title="Developers"
          items={[
            ['Docs', '/research'],
            ['MCP reference', '/research#mcp-reference'],
            ['GitHub', 'https://github.com/fredericosanntana'],
            ['npm: dpo2u-sdk', 'https://www.npmjs.com/'],
            ['Solana Explorer', 'https://explorer.solana.com/?cluster=devnet'],
          ]}
        />
      </div>
      <Rule color={PALETTE.ruleStrong} />
      <div
        style={{
          marginTop: 20,
          fontFamily: FONTS.mono,
          fontSize: 10,
          letterSpacing: '.22em',
          color: PALETTE.concrete,
        }}
        className="flex flex-col md:flex-row md:justify-between gap-2"
      >
        <div>DPO2U · SÃO PAULO · MMXXI–MMXXVI</div>
        <div>COMPLIANCE, SEALED.</div>
        <div>MCP.DPO2U.COM</div>
      </div>
    </footer>
  );
}
