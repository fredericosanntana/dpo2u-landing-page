import React from 'react';
import { usePageHead } from '@/lib/page-head';

interface Section {
  title: string;
  body: React.ReactNode;
}

const SECTIONS: Section[] = [
  {
    title: 'Data controller',
    body: (
      <>
        DPO2U — Frederico Santana, sole proprietor.
        <br />
        Contact:{' '}
        <a
          href="mailto:fredericosanntana@gmail.com"
          className="border-b border-dpo2u-ink/30 hover:border-dpo2u-indigo hover:text-dpo2u-indigo transition-colors"
        >
          fredericosanntana@gmail.com
        </a>
        .
      </>
    ),
  },
  {
    title: 'Purposes',
    body: (
      <ul className="space-y-2 mt-3">
        <li>Respond to inquiries and contact requests.</li>
        <li>Measure site audience (analytics) with your consent.</li>
        <li>Provide services and relevant content (marketing) with your consent.</li>
      </ul>
    ),
  },
  {
    title: 'Legal bases',
    body: 'Consent (Art. 7, I LGPD / Art. 6(1)(a) GDPR / §11 POPIA / §26 NDPA / Art. 5 PDPL / §1798.120 CCPA / Principle 4.3 PIPEDA / §14 Quebec Law 25 / Art. 15 PIPA Korea / Art. 22 PDP Indonesia); legitimate interest (Art. 7, IX LGPD / Art. 6(1)(f) GDPR); legal obligation when applicable.',
  },
  {
    title: 'Data-subject rights',
    body: 'You may request access, correction, anonymization, portability, deletion, and information about data sharing at any time by emailing us.',
  },
  {
    title: 'Cookies & consent (3 categories)',
    body: (
      <>
        We use cookies in 3 categories with explicit handling:
        <ul className="space-y-2 mt-3 list-disc ml-5">
          <li><strong>Essential</strong> — session, CSRF, rate-limit counters. Loaded by default (LGPD Art. 7º IX legitimate interest).</li>
          <li><strong>Analytics</strong> — only loaded after explicit opt-in via cookie banner (LGPD Art. 7º I).</li>
          <li><strong>Marketing</strong> — disabled by default; user must opt in.</li>
        </ul>
        We honor the <strong>Global Privacy Control (GPC)</strong> signal (Cal. Code Regs. tit. 11 §7025 + ePrivacy) — when <code>Sec-GPC: 1</code> header is set, analytics + marketing remain disabled regardless of banner state.
      </>
    ),
  },
  {
    title: 'Sub-processors',
    body: (
      <>
        Personal data may be processed by the following third parties under DPA / equivalent safeguards:
        <ul className="space-y-2 mt-3 list-disc ml-5">
          <li><strong>BillionMail</strong> (self-hosted in BR) — SMTP outbound delivery. Internal processor: same controller (no third-party DPA needed).</li>
          <li><strong>Anthropic Claude API</strong> (US) — LLM-backed tool generation. DPA in place + "Do Not Train" toggle activated (Apr 2026).</li>
          <li><strong>Stellar Soroban RPC</strong> — broadcast of on-chain attestations only. No PII reaches RPC; only opaque commitment hashes.</li>
          <li><strong>Google OAuth</strong> (US) — authentication only. DPA in place via Google Cloud Terms.</li>
          <li><strong>Stripe</strong> (US) — subscription billing only. DPA in place via Stripe DPA standard.</li>
        </ul>
      </>
    ),
  },
  {
    title: 'International transfers',
    body: 'Where data is transferred outside Brazil or the EU, we use standard contractual clauses (SCCs) or equivalent safeguards (BCRs / adequacy decisions) as required by LGPD Art. 33 / GDPR Chapter V / POPIA §72 / NDPA §41 / PDPL Art. 22 / PIPEDA Schedule 1 §4.1.3 / Quebec Law 25 §17 / PIPA Art. 28-8 / PDP Indonesia Art. 56.',
  },
  {
    title: 'Retention',
    body: (
      <>
        Personal data is retained only as long as necessary for the declared purpose:
        <ul className="space-y-2 mt-3 list-disc ml-5">
          <li><strong>Alpha cohort signups</strong> — 30 days after end of alpha period, then deleted.</li>
          <li><strong>Compliance attestations</strong> — 5 years (regulatory audit trail; LGPD Art. 7º II).</li>
          <li><strong>Newsletter subscribers</strong> — until unsubscribe.</li>
          <li><strong>Zettelkasten knowledge base</strong> — indefinite (operational; no PII).</li>
          <li><strong>Logs (server)</strong> — 90 days, then rotated.</li>
        </ul>
        Erasure requests under LGPD Art. 18 / GDPR Art. 17 / Quebec Law 25 §28.1 are honored within 15 business days.
      </>
    ),
  },
  {
    title: 'Multi-jurisdiction coverage',
    body: 'DPO2U operates under 17 jurisdictions: LGPD · GDPR · MICAR · DPDP · PDPA · UAE/PDPL · POPIA · NDPA · CCPA · PIPEDA · LAW25 · PIPA · PDP · APPI · MEXICO · VIETNAM · MALAYSIA. Per-jurisdiction obligations (DPO mandate, breach notification deadlines, data subject rights, cross-border safeguards) are documented in the RoPA available on request to the contact below.',
  },
  {
    title: 'Contact',
    body: (
      <>
        For any privacy-related matter, write to{' '}
        <a
          href="mailto:fredericosanntana@gmail.com"
          className="border-b border-dpo2u-ink/30 hover:border-dpo2u-indigo hover:text-dpo2u-indigo transition-colors"
        >
          fredericosanntana@gmail.com
        </a>
        .
      </>
    ),
  },
];

export default function PrivacyPage() {
  usePageHead({
    title: 'Privacy Policy | DPO2U',
    description: 'How DPO2U handles personal data on its own surfaces. Minimal collection, no tracking by default, and full LGPD/GDPR rights.',
    path: '/privacy',
  });
  const lastUpdated = new Date().toISOString().slice(0, 10);
  return (
    <article className="px-6 lg:px-14 pt-16 lg:pt-24 pb-24 max-w-[1100px] mx-auto">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-dpo2u-ink/70 mb-8">
        — Privacy policy · Last updated {lastUpdated} —
      </p>
      <h1 className="font-display text-[44px] sm:text-[56px] lg:text-[60px] text-dpo2u-ink font-medium max-w-[22ch] leading-[1.05] tracking-[-0.03em]">
        Privacy, in plain prose.
      </h1>
      <p className="mt-6 font-body text-[17px] leading-relaxed text-dpo2u-ink/75 max-w-[640px]">
        This policy describes how DPO2U handles personal data under LGPD (Law 13.709/2018)
        and, where applicable, the GDPR. No dark patterns. No tracking-by-default.
      </p>

      <div className="mt-16 max-w-[640px]">
        {SECTIONS.map((s, i) => (
          <section key={s.title} className="border-t border-dpo2u-ink/15 py-10">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 md:col-span-1 font-mono text-[11px] tracking-[0.12em] text-dpo2u-terracotta pt-1">
                §{String(i + 1).padStart(2, '0')}
              </div>
              <div className="col-span-12 md:col-span-11">
                <h2 className="font-display text-[22px] md:text-[26px] text-dpo2u-ink font-medium leading-tight">
                  {s.title}
                </h2>
                <div className="mt-3 font-body text-[16px] leading-[1.7] text-dpo2u-ink/80">
                  {s.body}
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>
    </article>
  );
}
