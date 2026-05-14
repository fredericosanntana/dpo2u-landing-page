/**
 * /pricing — 3 tiers (Free / Builder / Team) + comparison table + FAQ.
 *
 * Stripe billing live em fase 2 — atualmente CTA vai pro /alpha-signup pra
 * pilot pricing manual. Pricing publico fecha o gap "builder bouncepa em 30s
 * sem pricing visível" identificado no gap report 2026-05-11.
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
    name: 'Free',
    price: '$0',
    cadence: 'forever',
    pitch: 'For builders evaluating compliance on Solana.',
    features: [
      '3 DPIA generations / month',
      'Single jurisdiction (your pick)',
      'KB read access — 17 jurisdictions + 6 AI gov frameworks',
      'No on-chain anchor (off-chain only)',
      'Community Discord support',
    ],
    cta: { label: 'Start free →', to: '/alpha-signup' },
  },
  {
    name: 'Builder',
    price: '$29',
    cadence: '/ month',
    pitch: 'For active Solana builders shipping to production.',
    features: [
      '50 DPIA / audit / policy generations / month',
      'Single jurisdiction (switch any time)',
      'On-chain anchor (Solana devnet today, mainnet phase 2)',
      'IPFS pinning (Lighthouse OR Shadow Drive)',
      'Email support, ≤ 48h response',
      'CSV export of audit history',
    ],
    cta: { label: 'Start pilot →', to: '/alpha-signup' },
    highlight: true,
  },
  {
    name: 'Team',
    price: '$199',
    cadence: '/ month',
    pitch: 'For protocols + stablecoin issuers + DAOs at scale.',
    features: [
      'Unlimited generations',
      'All 17 jurisdictions + 6 AI gov frameworks',
      'Multi-jurisdiction cross-check (LGPD vs GDPR vs DPDP, etc.)',
      'MICA proof-of-reserve attestation (ART vault)',
      'White-label outputs (DPIA, audit reports)',
      'Priority support — Slack channel + 24h SLA',
      'Self-host option (Docker bundle)',
    ],
    cta: { label: 'Talk to us →', to: '/alpha-signup' },
  },
];

const COMPARISON_ROWS = [
  ['Generations / month', '3', '50', 'Unlimited'],
  ['Jurisdictions', '1', '1 (switchable)', 'All 17'],
  ['AI gov frameworks', '0', '0', 'All 6'],
  ['On-chain anchor', '—', 'Devnet', 'Devnet + Mainnet (phase 2)'],
  ['IPFS pinning (Lighthouse / Shadow Drive)', '—', '✓', '✓'],
  ['Multi-jurisdiction cross-check', '—', '—', '✓'],
  ['MICA proof-of-reserve', '—', '—', '✓ (mainnet phase 2)'],
  ['White-label', '—', '—', '✓'],
  ['Self-host (Docker)', '—', '—', '✓'],
  ['Support', 'Community', 'Email 48h', 'Slack 24h'],
];

const FAQ = [
  {
    q: 'É grátis pra sempre?',
    a: 'O tier Free é grátis indefinidamente, com limites (3 generations/month, 1 jurisdição). Builder e Team são pagos mensalmente.',
  },
  {
    q: 'Posso self-host o stack inteiro?',
    a: 'Sim — Tier Team inclui um Docker bundle com mcp-server + Solana programs + KBs. Self-host = $199/month flat, sem caps de uso.',
  },
  {
    q: 'Quando o anchor vai pra mainnet?',
    a: 'Devnet hoje, mainnet em fase 2 (após Squads multisig + external audit). Phase 1 priorities: MICAR ART vault + compliance_registry. ETA: Q3 2026.',
  },
  {
    q: 'Como funciona o billing pra agora?',
    a: 'Stripe live em fase 2. Por enquanto: pilot pricing via /alpha-signup → conversa com DPO2U → invoice manual (Wise / PIX / bank transfer). Pilots de 6 meses com discount possível.',
  },
  {
    q: 'Posso white-label os outputs?',
    a: 'Tier Team inclui white-label (sua marca, seu domínio). Builder mantém branding DPO2U mas pode editar livremente o markdown gerado.',
  },
];

export default function PricingPage() {
  usePageHead({
    title: 'Pricing — DPO2U',
    description:
      'Pricing público pra compliance on-chain — Free, Builder ($29/mo), Team ($199/mo). 17 jurisdictions, 6 AI gov frameworks. Stripe billing live em fase 2; pilots manuais via /alpha-signup hoje.',
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
          <p className="mt-6 max-w-[60ch] text-[17px] md:text-[19px] text-dpo2u-ink/75">
            Three tiers. No usage-based surprise bills. No "enterprise — contact sales"
            wall on tier two. Stripe billing live em fase 2; pilot pricing manual via
            alpha signup hoje — for 6-month engagements typically.
          </p>
          <p className="mt-3 max-w-[60ch] font-mono text-[12px] uppercase tracking-[0.14em] text-dpo2u-terracotta">
            Phase 1 — pilot pricing. Stripe self-service rolls out Q3 2026.
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
              Try it before buying.
            </h3>
            <p className="text-[15px] text-dpo2u-ink/70">
              Generate a DPIA in 90 seconds. No signup, no card.
            </p>
          </div>
          <Link
            to="/demo"
            className="inline-block py-3 px-7 font-mono text-[13px] uppercase tracking-[0.14em] transition-colors"
            style={{ background: PALETTE.ink, color: PALETTE.paper }}
          >
            Try the audit →
          </Link>
        </section>
      </div>
    </div>
  );
}
