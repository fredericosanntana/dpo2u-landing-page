/**
 * /pricing — 3 tiers (Free / Builder / Team) + comparison table + FAQ.
 *
 * Stripe billing goes live in phase 2 — for now the CTA points to /alpha-signup for
 * manual pilot pricing. Public pricing closes the "builder bounces in 30s with no
 * visible pricing" gap identified in the 2026-05-11 gap report.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { usePageHead } from '@/lib/page-head';
import { FONTS, PALETTE } from '@/components/sealed/atoms';

type Tier = {
  name: string;
  price: string;
  cadence: string;
  pitch: string;
  features: string[];
  cta: { label: string; to: string };
  highlight?: boolean;
};

const TIERS: Tier[] = [
  {
    name: 'Open Source',
    price: 'Free SDK',
    cadence: '+ $0.0002 / attestation',
    pitch: 'Run it yourself. You own the stack.',
    features: [
      'Full open-source SDK (npm + cargo)',
      'Run the compliance primitives in your own CI/CD',
      'You hold the keys — no platform in the loop',
      'All chains (Stellar live · others roadmap)',
      '24 jurisdictions + 8 AI-governance frameworks',
      'Selective disclosure (ZK) — score private, proof public',
    ],
    cta: { label: 'Read the docs →', to: '/research' },
  },
  {
    name: 'Managed Protocol',
    price: 'In calibration',
    cadence: 'platform fee + $0.0002 / attestation',
    pitch: 'We run it. The result, not the integration.',
    features: [
      'Connect your repo — we execute the pipeline',
      'Automatic on-chain anchoring of every seal',
      'Legal-source manifest monitoring (24 jurisdictions)',
      'Dashboard + audit-evidence (dossier) export',
      'Email support',
      'Platform pricing in calibration — talk to us',
    ],
    cta: { label: 'Connect repo →', to: '/app/activate' },
    highlight: true,
  },
  {
    name: 'DPO-as-a-Service',
    price: 'Custom retainer',
    cadence: '+ per-attestation',
    pitch: "We're your DPO. A name on the line.",
    features: [
      'Everything in Managed',
      'Named, accountable DPO of record',
      'Audit defense + regulator interface',
      'Quarterly compliance review',
      'Priority SLA',
    ],
    cta: { label: 'Book a consult →', to: '/alpha-signup' },
  },
];

const COMPARISON_ROWS = [
  ['Who runs the primitives', 'You', 'DPO2U', 'DPO2U'],
  ['On-chain seal', '$0.0002 / attestation', '$0.0002 / attestation', '$0.0002 / attestation'],
  ['Platform fee', '—', 'In calibration', 'Custom retainer'],
  ['Jurisdictions', 'All 24', 'All 24', 'All 24'],
  ['AI-governance frameworks', 'All 8', 'All 8', 'All 8'],
  ['Chains', 'All (Stellar live)', 'All (Stellar live)', 'All (Stellar live)'],
  ['Selective disclosure (ZK)', '✓', '✓', '✓'],
  ['Managed pipeline + dashboard', '—', '✓', '✓'],
  ['Audit-evidence export (dossier)', 'self-serve', '✓', '✓'],
  ['Named accountable DPO', '—', '—', '✓'],
  ['Audit defense + regulator interface', '—', '—', '✓'],
  ['Support', 'Community', 'Email', 'Priority SLA'],
];

const FAQ = [
  {
    q: 'What exactly do I pay for?',
    a: 'The unit of value — and of billing — is the attestation. The on-chain seal costs $0.0002 (the cost of anchoring one attestation). On the Open Source tier you run the SDK and pay only the seal at the moment you anchor. Managed and DPO-aaS add a service layer (running the pipeline / accountable DPO) whose price is in calibration.',
  },
  {
    q: 'Is the SDK really free?',
    a: 'Yes. The open-source SDK is free (npm + cargo). You only pay the $0.0002 on-chain seal when you anchor an attestation. No subscription on the OSS tier.',
  },
  {
    q: 'Why is Managed/DPO pricing "in calibration"?',
    a: 'We are validating willingness-to-pay with target customers before fixing the public number. Instead of publishing a price we will change, we talk case by case. Reach us via alpha signup.',
  },
  {
    q: 'Which chain is live?',
    a: 'Stellar (Soroban) is the protocol chain: testnet validated on-chain, mainnet in phased rollout. The attestation contract is immutable and verification is trustless by (use_case_id, evidence_hash).',
  },
  {
    q: 'How many jurisdictions does it cover?',
    a: '24 jurisdictions + 8 AI-governance frameworks, in the same stack. Multi-jurisdiction cross-check (LGPD vs GDPR vs DPDP, etc.) included.',
  },
];

export default function PricingPage() {
  usePageHead({
    title: 'Pricing — DPO2U',
    description:
      'Open-core ladder for on-chain compliance — Open Source (free SDK + $0.0002/attestation), Managed Protocol and DPO-as-a-Service. The attestation is the billing unit. 24 jurisdictions, 8 AI frameworks. Managed/DPO pricing in calibration — talk to us.',
    path: '/pricing',
  });

  return (
    <div className="min-h-screen bg-dpo2u-ivory text-dpo2u-ink" style={{ fontFamily: FONTS.body }}>
      <div className="max-w-[1100px] mx-auto px-6 md:px-10 py-16 md:py-24">
        {/* Hero */}
        <header className="mb-16 md:mb-20">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-dpo2u-ink/70 mb-4">
            — Pricing —
          </p>
          <h1
            className="text-[44px] md:text-[60px] leading-[1.04] font-medium"
            style={{ fontFamily: FONTS.display, letterSpacing: '-0.02em' }}
          >
            Compliance, priced honestly.
          </h1>
          <p className="mt-6 max-w-[62ch] text-[17px] md:text-[19px] text-dpo2u-ink/75">
            The attestation is the unit of value — and the unit of billing. Three ways to
            seal compliance, defined by who runs the primitives and who stands behind the
            result: run it yourself, we run it, or we become your accountable DPO.
          </p>
          <p className="mt-3 max-w-[62ch] font-mono text-[12px] uppercase tracking-[0.14em] text-dpo2u-terracotta">
            On-chain seal — $0.0002 / attestation. Managed &amp; DPO pricing in calibration — talk to us.
          </p>
        </header>

        {/* Tier cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-20">
          {TIERS.map((tier) => (
            <article
              key={tier.name}
              className="relative border bg-[#E8E2D5] p-7 md:p-8 flex flex-col"
              style={{
                borderColor: tier.highlight ? PALETTE.terracotta : PALETTE.rule,
                borderWidth: tier.highlight ? 2 : 1,
              }}
            >
              {tier.highlight && (
                <span
                  className="absolute -top-3 left-7 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em]"
                  style={{ background: PALETTE.terracotta, color: PALETTE.paper }}
                >
                  Most popular
                </span>
              )}
              <h2
                className="text-[26px] font-medium mb-2"
                style={{ fontFamily: FONTS.display, letterSpacing: '-0.01em' }}
              >
                {tier.name}
              </h2>
              <p className="text-[13px] text-dpo2u-ink/70 mb-6 min-h-[3em]">{tier.pitch}</p>
              <div className="flex items-baseline gap-2 mb-6">
                <span
                  className="text-[44px] font-medium"
                  style={{ fontFamily: FONTS.display, letterSpacing: '-0.02em' }}
                >
                  {tier.price}
                </span>
                <span className="text-[13px] text-dpo2u-ink/60">{tier.cadence}</span>
              </div>
              <ul className="flex-1 mb-7 space-y-2.5">
                {tier.features.map((f, i) => (
                  <li key={i} className="text-[14px] text-dpo2u-ink/85 leading-[1.4] flex gap-2">
                    <span className="text-dpo2u-terracotta">→</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                to={tier.cta.to}
                className="block text-center py-3 font-mono text-[13px] uppercase tracking-[0.14em] transition-colors"
                style={{
                  background: tier.highlight ? PALETTE.terracotta : 'transparent',
                  color: tier.highlight ? PALETTE.paper : PALETTE.ink,
                  border: tier.highlight ? 'none' : `1px solid ${PALETTE.ink}`,
                }}
              >
                {tier.cta.label}
              </Link>
            </article>
          ))}
        </section>

        {/* Comparison table */}
        <section className="mb-20">
          <h2
            className="text-[28px] md:text-[36px] font-medium mb-8"
            style={{ fontFamily: FONTS.display, letterSpacing: '-0.015em' }}
          >
            Compare tiers.
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr style={{ borderBottom: `1px solid ${PALETTE.ruleStrong}` }}>
                  <th className="text-left py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-dpo2u-ink/70">
                    Feature
                  </th>
                  {TIERS.map((t) => (
                    <th
                      key={t.name}
                      className="text-left py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-dpo2u-ink/70"
                    >
                      {t.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map(([feature, a, b, c], i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${PALETTE.rule}` }}>
                    <td className="py-3 text-[14px] text-dpo2u-ink">{feature}</td>
                    <td className="py-3 text-[14px] text-dpo2u-ink/70">{a}</td>
                    <td className="py-3 text-[14px] text-dpo2u-ink/70">{b}</td>
                    <td className="py-3 text-[14px] text-dpo2u-ink/70">{c}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2
            className="text-[28px] md:text-[36px] font-medium mb-8"
            style={{ fontFamily: FONTS.display, letterSpacing: '-0.015em' }}
          >
            FAQ.
          </h2>
          <div className="space-y-6">
            {FAQ.map(({ q, a }) => (
              <div key={q} style={{ borderTop: `1px solid ${PALETTE.rule}`, paddingTop: '1.25rem' }}>
                <h3
                  className="text-[18px] mb-2 font-medium"
                  style={{ fontFamily: FONTS.display, letterSpacing: '-0.01em' }}
                >
                  {q}
                </h3>
                <p className="text-[15px] text-dpo2u-ink/75 leading-[1.55]">{a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer CTA */}
        <section
          className="border-t pt-12 mt-16 flex flex-col md:flex-row md:items-center md:justify-between gap-6"
          style={{ borderColor: PALETTE.ruleStrong }}
        >
          <div>
            <h3
              className="text-[22px] md:text-[26px] font-medium mb-2"
              style={{ fontFamily: FONTS.display }}
            >
              Open the app.
            </h3>
            <p className="text-[15px] text-dpo2u-ink/70">
              Connect your wallet, seal an attestation, share a public proof.
            </p>
          </div>
          <Link
            to="/app"
            className="inline-block py-3 px-7 font-mono text-[13px] uppercase tracking-[0.14em] transition-colors"
            style={{ background: PALETTE.ink, color: PALETTE.paper }}
          >
            Open the app →
          </Link>
        </section>
      </div>
    </div>
  );
}
