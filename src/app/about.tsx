// /about — DPO2U origin + F13 manifesto.
// Re-skinned 2026-04-29 with Sealed editorial cartorial vocabulary.
// Long-form prose layout, pull quotes in Fraunces italic, WaxSeal sign-off.
import React from 'react';
import { usePageHead } from '@/lib/page-head';
import {
  SmallLabel,
  Rule,
  Button,
  WaxSeal,
  FONTS,
  PALETTE,
} from '@/components/sealed/atoms';

interface TimelineItem {
  year: string;
  title: string;
  body: string;
}

const TIMELINE: TimelineItem[] = [
  {
    year: '2021',
    title: 'Origin',
    body: 'DPO2U starts as twenty lines in a Zettelkasten. Not a company — a question: why is compliance an industry of dashboards and PDFs when the underlying claim is mathematical?',
  },
  {
    year: '2022',
    title: 'Research',
    body: 'Publish-first principle established. First whitepaper draft. Public notes on LGPD as computational specification.',
  },
  {
    year: '2023',
    title: 'MCP primitives',
    body: 'First typed compliance tools (LGPD gap analysis, GDPR DPIA). MCP adopted as the integration substrate. Tools run inside any LLM.',
  },
  {
    year: '2024',
    title: 'Cross-jurisdictional',
    body: 'DPDP, PDPA, MiCAR, UAE regulations added. Six jurisdictions operationalized as typed tools (POPIA · NDPA · PDPL added 2026 Q1 for EMEA; CCPA · PIPEDA · LAW25 added 2026 Q2 for Americas).',
  },
  {
    year: '2025',
    title: 'ZK prototype',
    body: 'Zero-knowledge compliance proofs prototyped: circuits in Circom (Groth16, BN254) and Compact contracts (Midnight).',
  },
  {
    year: '2026',
    title: 'On-chain',
    body: 'Compliance as a protocol. A zero-knowledge layer proves score ≥ threshold without revealing the score. Anyone verifies trustlessly by (use_case_id, evidence_hash) over public RPC — no wallet, no fee. Stellar: mainnet (traceability anchor) · Solana: devnet · Midnight: preview.',
  },
];

interface Publication {
  title: string;
  type: string;
  year: string;
  description: string;
}

const PUBLICATIONS: Publication[] = [
  {
    title: 'Compliance as Protocol',
    type: 'Paper v0.4',
    year: '2026',
    description:
      'How MCP tools and zero-knowledge proofs turn a compliance verdict into a verifiable on-chain attestation.',
  },
];

// F13 manifesto — voice canon, English. Pull quotes get Fraunces italic styling.
const MANIFESTO_PARAGRAPHS: Array<{ text: string; pullQuote?: boolean }> = [
  { text: 'Five years ago, DPO2U began as twenty lines in a Zettelkasten.' },
  { text: 'We did not want to found a SaaS for compliance. We wanted to understand why compliance had become an industry of monthly dashboards, hours-of-lawyer, and signed PDFs — when the underlying claim is, at heart, verifiable mathematics.' },
  { text: 'Publish before you sell. Research before you code. Code before you hire. That order is the thesis: research first, primitive next, product third.', pullQuote: true },
  { text: 'Today: 25 jurisdictions in the norms engine, each with source and date. ZK circuits in Circom (Groth16, BN254) and Compact contracts (Midnight). 77 MCP tools. Stellar: mainnet (traceability anchor) · Solana: devnet · Midnight: preview.' },
  { text: 'No dashboard. No monthly subscription with a PDF report. No consultant billing by the hour.' },
  { text: 'We are not the $50k compliance consultancy. We are the research house that writes the primitive.' },
  { text: 'We are the DPO who ships code. The lawyer who learned to compute. The house that proved — in zero-knowledge proofs on-chain — that compliance can be mathematics.', pullQuote: true },
];

export default function AboutPage() {
  usePageHead({
    title: 'About — Origin story & F13 manifesto | DPO2U',
    description: 'DPO2U started in 2021 as twenty lines in a Zettelkasten. Today: a publish-first compliance research house — 25 jurisdictions in the norms engine and 77 MCP tools. Stellar: mainnet (traceability anchor) · Solana: devnet · Midnight: preview. The full story.',
    path: '/about',
  });

  return (
    <>
      {/* Masthead */}
      <section className="px-6 lg:px-14 pt-16 lg:pt-24 pb-16 lg:pb-20" style={{ borderBottom: `.5px solid ${PALETTE.rule}` }}>
        <SmallLabel style={{ marginBottom: 16 }}>§ ABOUT · DPO2U · EST. MMXXI</SmallLabel>
        <h1
          style={{
            fontFamily: FONTS.display, fontWeight: 500,
            lineHeight: 1.02, letterSpacing: '-.035em',
            margin: 0,
          }}
          className="text-[48px] sm:text-[64px] lg:text-[80px]"
        >
          Research first.<br />
          Primitive next.<br />
          <span style={{ fontStyle: 'italic', color: PALETTE.terracotta }}>Product third.</span>
        </h1>
        <p
          style={{
            fontFamily: FONTS.body, fontSize: 19, lineHeight: 1.55,
            color: PALETTE.inkSoft, marginTop: 28, maxWidth: 640,
          }}
        >
          DPO2U is the compliance research house that ships code. One founder.
          25 jurisdictions in the norms engine, each with source and date.
        </p>
      </section>

      {/* Manifesto — long-form, with pull quotes */}
      <section className="px-6 lg:px-14 py-24" style={{ borderBottom: `.5px solid ${PALETTE.rule}` }}>
        <SmallLabel style={{ marginBottom: 16, color: PALETTE.terracotta }}>§ I · MANIFESTO</SmallLabel>
        <h2
          style={{
            fontFamily: FONTS.display, fontWeight: 500, fontStyle: 'italic',
            lineHeight: 1.08, letterSpacing: '-.025em',
            margin: '0 0 40px',
            color: PALETTE.terracotta,
          }}
          className="text-[40px] sm:text-[52px] lg:text-[60px]"
        >
          Compliance, computed.
        </h2>

        <article style={{ maxWidth: 640 }}>
          {MANIFESTO_PARAGRAPHS.map((p, i) => (
            p.pullQuote ? (
              <blockquote
                key={i}
                style={{
                  fontFamily: FONTS.display,
                  fontStyle: 'italic',
                  fontSize: 28,
                  lineHeight: 1.35,
                  color: PALETTE.terracotta,
                  margin: '36px 0',
                  padding: '20px 0 20px 24px',
                  borderLeft: `2px solid ${PALETTE.terracotta}`,
                }}
                className="lg:text-[32px]"
              >
                {p.text}
              </blockquote>
            ) : (
              <p
                key={i}
                style={{
                  fontFamily: FONTS.body, fontSize: 17.5, lineHeight: 1.65,
                  color: PALETTE.ink,
                  margin: '0 0 20px',
                }}
              >
                {p.text}
              </p>
            )
          ))}

          <div style={{ marginTop: 40, display: 'flex', alignItems: 'center', gap: 24 }}>
            <WaxSeal size={108} label="DPO2U" />
            <div>
              <div
                style={{
                  fontFamily: FONTS.display, fontSize: 26, fontWeight: 600,
                  letterSpacing: '-.02em',
                }}
              >
                DP<span style={{ color: PALETTE.terracotta }}>O</span>2U.
              </div>
              <div style={{ fontFamily: FONTS.mono, fontSize: 11, letterSpacing: '.18em', color: PALETTE.concrete, marginTop: 4, textTransform: 'uppercase' }}>
                Compliance, computed.
              </div>
            </div>
          </div>
        </article>
      </section>

      {/* Timeline */}
      <section className="px-6 lg:px-14 py-24" style={{ borderBottom: `.5px solid ${PALETTE.rule}` }}>
        <SmallLabel style={{ marginBottom: 16 }}>§ II · ORIGIN · FIVE YEARS</SmallLabel>
        <h2
          style={{
            fontFamily: FONTS.display, fontWeight: 500,
            lineHeight: 1.05, letterSpacing: '-.03em',
            margin: '0 0 40px',
          }}
          className="text-[36px] sm:text-[48px] lg:text-[60px]"
        >
          From a Zettelkasten<br />
          <span style={{ fontStyle: 'italic' }}>to an on-chain protocol.</span>
        </h2>

        <div
          style={{
            border: `.5px solid ${PALETTE.ruleStrong}`,
            background: PALETTE.paper,
          }}
        >
          {TIMELINE.map((t, i) => (
            <div
              key={t.year}
              className="grid grid-cols-1 lg:grid-cols-[120px_220px_1fr] gap-3 lg:gap-8 items-start lg:items-center px-6 py-6 lg:px-7"
              style={{
                borderBottom: i < TIMELINE.length - 1 ? `.5px solid ${PALETTE.rule}` : 'none',
              }}
            >
              <div style={{ fontFamily: FONTS.mono, fontSize: 14, letterSpacing: '.08em', color: PALETTE.terracotta, fontWeight: 500 }}>
                {t.year}
              </div>
              <div style={{ fontFamily: FONTS.display, fontSize: 22, fontWeight: 500, letterSpacing: '-.015em' }}>
                {t.title}
              </div>
              <p style={{ fontFamily: FONTS.body, fontSize: 14.5, lineHeight: 1.6, color: PALETTE.inkSoft, margin: 0 }}>
                {t.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Publications */}
      <section className="px-6 lg:px-14 py-24" style={{ borderBottom: `.5px solid ${PALETTE.rule}` }}>
        <SmallLabel style={{ marginBottom: 16 }}>§ III · PUBLICATIONS</SmallLabel>
        <h2
          style={{
            fontFamily: FONTS.display, fontWeight: 500,
            lineHeight: 1.05, letterSpacing: '-.03em',
            margin: '0 0 40px',
          }}
          className="text-[36px] sm:text-[48px] lg:text-[60px]"
        >
          Read the research<br />
          <span style={{ fontStyle: 'italic' }}>before you read the pitch.</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PUBLICATIONS.map((p) => (
            <article
              key={p.title}
              style={{
                background: PALETTE.paper2,
                border: `.5px solid ${PALETTE.ruleStrong}`,
                padding: '24px 22px',
                minHeight: 260,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <SmallLabel style={{ color: PALETTE.terracotta, fontSize: 9.5, marginBottom: 8 }}>
                {p.type} · {p.year}
              </SmallLabel>
              <h3
                style={{
                  fontFamily: FONTS.display, fontSize: 20, fontWeight: 500,
                  letterSpacing: '-.015em', lineHeight: 1.25, margin: 0,
                }}
              >
                {p.title}
              </h3>
              <p
                style={{
                  fontFamily: FONTS.body, fontSize: 14, lineHeight: 1.6,
                  color: PALETTE.inkSoft, margin: '14px 0 0',
                }}
              >
                {p.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Founder */}
      <section className="px-6 lg:px-14 py-24" style={{ borderBottom: `.5px solid ${PALETTE.rule}` }}>
        <SmallLabel style={{ marginBottom: 16 }}>§ IV · FOUNDER</SmallLabel>
        <h2
          style={{
            fontFamily: FONTS.display, fontWeight: 500,
            lineHeight: 1.05, letterSpacing: '-.03em',
            margin: 0,
          }}
          className="text-[36px] sm:text-[48px] lg:text-[56px]"
        >
          Frederico <span style={{ fontStyle: 'italic' }}>Santana</span>
        </h2>
        <p style={{ fontFamily: FONTS.body, fontSize: 17, lineHeight: 1.6, color: PALETTE.inkSoft, marginTop: 20, maxWidth: 640 }}>
          Founder and sole author. 25 jurisdictions in the norms engine. 77 MCP tools.
          Based in São Paulo, BR.
        </p>
        <div className="mt-10 flex gap-3 flex-wrap">
          <Button kind="terracotta" href="mailto:contato@dpo2u.com">
            contato@dpo2u.com →
          </Button>
          <Button kind="ghost" href="https://github.com/fredericosanntana">
            GitHub
          </Button>
          <Button kind="ghost" href="https://linkedin.com/in/fredericosantana">
            LinkedIn
          </Button>
          <Button kind="ghost" href="https://x.com/fredsanntana">
            X (Twitter)
          </Button>
        </div>
      </section>
    </>
  );
}
