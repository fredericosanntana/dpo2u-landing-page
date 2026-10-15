/**
 * /pricing — em revisão (hotfix S0, 15/10/2026).
 *
 * O preço por selo e o "Midnight live" saíram do ar (em revisão). A página
 * mantém os três jeitos de contratar, sem número, e o CTA de contato.
 * Reversão: git show snapshot/live-2026-10-02:src/app/pricing.tsx
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { usePageHead } from '@/lib/page-head';
import { FONTS, PALETTE } from '@/components/sealed/atoms';

const CONTACT_EMAIL = 'contato@dpo2u.com';
const NETWORK_STATUS = 'Stellar: mainnet (traceability anchor) · Solana: devnet · Midnight: preview.';

const WAYS = [
  { name: 'Run it yourself', pitch: 'You run the compliance primitives in your own CI/CD and hold the keys. SDK in private alpha.' },
  { name: 'We run it', pitch: 'Connect your repository — we execute the pipeline and hand you the result.' },
  { name: 'We’re your DPO', pitch: 'A named, accountable DPO of record, with audit defense and regulator interface.' },
];

export default function PricingPage() {
  usePageHead({
    title: 'Pricing — DPO2U',
    description:
      'Pricing is under review. ' + NETWORK_STATUS + ' Talk to us for a pilot.',
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
            Pricing under review.
          </h1>
          <p className="mt-6 max-w-[62ch] text-[17px] md:text-[19px] text-dpo2u-ink/75">
            We are not publishing prices yet. Pilots are
            scoped case by case — talk to us.
          </p>
          <p className="mt-3 max-w-[62ch] font-mono text-[12px] uppercase tracking-[0.14em] text-dpo2u-terracotta">
            {NETWORK_STATUS}
          </p>
        </header>

        {/* Three ways, no numbers */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-20">
          {WAYS.map((w) => (
            <article
              key={w.name}
              className="relative border bg-[#E8E2D5] p-7 md:p-8 flex flex-col"
              style={{ borderColor: PALETTE.rule, borderWidth: 1 }}
            >
              <h2
                className="text-[26px] font-medium mb-2"
                style={{ fontFamily: FONTS.display, letterSpacing: '-0.01em' }}
              >
                {w.name}
              </h2>
              <p className="text-[14px] text-dpo2u-ink/80 leading-[1.5]">{w.pitch}</p>
            </article>
          ))}
        </section>

        {/* Contact CTA */}
        <section
          className="border-t pt-12 mt-16 flex flex-col md:flex-row md:items-center md:justify-between gap-6"
          style={{ borderColor: PALETTE.ruleStrong }}
        >
          <div>
            <h3
              className="text-[22px] md:text-[26px] font-medium mb-2"
              style={{ fontFamily: FONTS.display }}
            >
              Talk to us.
            </h3>
            <p className="text-[15px] text-dpo2u-ink/70">
              Write to{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: PALETTE.terracotta, textDecoration: 'underline' }}>
                {CONTACT_EMAIL}
              </a>{' '}
              or use the signup form.
            </p>
          </div>
          <Link
            to="/alpha-signup"
            className="inline-block py-3 px-7 font-mono text-[13px] uppercase tracking-[0.14em] transition-colors"
            style={{ background: PALETTE.ink, color: PALETTE.paper }}
          >
            Talk to us →
          </Link>
        </section>
      </div>
    </div>
  );
}
