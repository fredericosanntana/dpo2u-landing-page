// /research — DPO2U research index + whitepaper + MCP Tool Reference.
// Re-skinned 2026-04-29 with Sealed editorial cartorial vocabulary.
// Absorbed the MCP tool reference content (formerly /mcp) as a sub-section
// "MCP Tool Reference" (#mcp-reference) so nothing is lost when /mcp retired.
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

interface Whitepaper {
  title: string;
  version: string;
  year: string;
  summary: string;
  status: 'available' | 'draft';
  href?: string;
}

const WHITEPAPERS: Whitepaper[] = [
  {
    title: 'Compliance as a Computable Primitive',
    version: 'v1.1',
    year: '2026',
    summary:
      'Foundational whitepaper. Reframes compliance — from SaaS-dashboards and consulting-by-hour to typed tools and zero-knowledge attestations — with a concrete implementation on Solana.',
    status: 'available',
    href: '/research#whitepaper',
  },
  {
    title: 'ERC-8004: Autonomous Agent Standard',
    version: 'v1.0',
    year: '2025',
    summary:
      'An Ethereum standard enabling AI agents to operate with self-funding smart contracts and verifiable on-chain identity.',
    status: 'available',
    href: 'https://github.com/fredericosanntana',
  },
  {
    title: 'Cross-jurisdictional Compliance Matrix',
    version: 'Draft',
    year: '2026',
    summary:
      'LGPD, GDPR, MiCAR, DPDP, PDPA, UAE, PDPL, POPIA, NDPA, CCPA, PIPEDA, LAW25, PIPA, PDP, APPI, MEXICO, VIETNAM, MALAYSIA side-by-side. Proposes a shared primitive layer (attestation PDA + typed tools) across seventeen regulatory regimes spanning Brazil, EU, India, Southeast Asia, MENA, Sub-Saharan Africa, North America, and Northeast Asia (Japan + Korea).',
    status: 'draft',
  },
];

interface NewsletterIssue {
  date: string;
  title: string;
  reading: string;
}

const NEWSLETTER: NewsletterIssue[] = [
  { date: '2026-04-22', title: 'Why Colosseum matters for compliance research',      reading: '6 min' },
  { date: '2026-04-15', title: 'Seventeen jurisdictions, one primitive layer',           reading: '8 min' },
  { date: '2026-04-08', title: 'SP1 v6 on Solana: the 120-LOC patch',                 reading: '12 min' },
  { date: '2026-04-01', title: 'ZK proofs vs. auditor PDFs',                         reading: '5 min' },
  { date: '2026-03-25', title: 'Publish-first: why we write before we ship',         reading: '4 min' },
];

// MCP Tool Reference — pulled in from the retired /mcp page so the content
// continues to live on /research#mcp-reference. Four publicly documented
// skills; 24 more are internal and described in the design note.
interface MCPSkill {
  name: string;
  title: string;
  desc: string;
  tags: string[];
}

const MCP_SKILLS: MCPSkill[] = [
  {
    name: 'dpo2u-audit-micar',
    title: 'MiCAR ART vault audit',
    desc: 'Audit an EU stablecoin reserve program against MiCAR Art. 23 / 35 / 36 / 39 — Proof of Reserve, Liquidity Vault, Capital Buffer, Velocity Limiter.',
    tags: ['EU', 'MiCAR'],
  },
  {
    name: 'dpo2u-compliance-check',
    title: 'Compliance checklist + score',
    desc: 'Run an LGPD / GDPR / DPDP / MiCAR / PDPA / UAE / PDPL / POPIA / NDPA / CCPA / PIPEDA / LAW25 / PIPA / PDP compliance scan. Returns scored checklist, gap analysis, and prioritized action plan.',
    tags: ['LGPD', 'GDPR', 'DPDP', 'PDPA', 'POPIA', 'NDPA', 'CCPA', 'PIPEDA'],
  },
  {
    name: 'dpo2u-compare-jurisdictions',
    title: 'Cross-jurisdiction matrix',
    desc: 'Regulatory matrix across Brazil, EU, India, Singapore, UAE, South Africa, Nigeria, California, Canada, Quebec. Includes ADGM foundation charter generation for market entry.',
    tags: ['Multi-jurisdiction'],
  },
  {
    name: 'dpo2u-consent-record',
    title: 'On-chain consent record',
    desc: 'Record or revoke a DPDP India / LGPD consent event on Solana via the consent-manager program. Purpose hashing + AES-GCM payload + ZK-bound consent via SP1 verifier.',
    tags: ['Solana', 'DPDP', 'ZK'],
  },
];

const MCP_CONFIG = `{
  "mcpServers": {
    "dpo2u": {
      "command": "npx",
      "args": ["-y", "@dpo2u/mcp-server"],
      "env": {
        "DPO2U_CLUSTER": "devnet"
      }
    }
  }
}`;

export default function ResearchPage() {
  usePageHead({
    title: 'Research — Whitepaper & accumulation | DPO2U',
    description: 'Whitepaper, public Zettelkasten, and the publish-first principle in practice. The full DPO2U research surface — primitives before product.',
    path: '/research',
  });

  return (
    <>
      {/* Masthead */}
      <section className="px-6 lg:px-14 pt-16 lg:pt-24 pb-16 lg:pb-20" style={{ borderBottom: `.5px solid ${PALETTE.rule}` }}>
        <SmallLabel style={{ marginBottom: 16 }}>§ DOCS · RESEARCH · WHITEPAPER</SmallLabel>
        <h1
          style={{
            fontFamily: FONTS.display, fontWeight: 500,
            lineHeight: 1.02, letterSpacing: '-.035em',
            margin: 0,
          }}
          className="text-[44px] sm:text-[56px] lg:text-[60px]"
        >
          Read the research<br />
          <span style={{ fontStyle: 'italic', color: PALETTE.terracotta }}>before the pitch.</span>
        </h1>
        <p style={{ fontFamily: FONTS.body, fontSize: 19, lineHeight: 1.55, color: PALETTE.inkSoft, marginTop: 28, maxWidth: 640 }}>
          Whitepapers, newsletter, MCP tool reference, and the public Zettelkasten.
          Five years of compounding notes — published under Apache 2.0.
        </p>
        <div className="mt-10 flex gap-3 flex-wrap">
          <Button kind="terracotta" href="#whitepaper">
            Read the whitepaper →
          </Button>
          <Button kind="ghost" href="#mcp-reference">
            MCP Tool Reference
          </Button>
        </div>
      </section>

      {/* Whitepapers */}
      <section id="whitepaper" className="px-6 lg:px-14 py-24" style={{ borderBottom: `.5px solid ${PALETTE.rule}` }}>
        <SmallLabel style={{ marginBottom: 16 }}>§ I · WHITEPAPERS</SmallLabel>
        <h2
          style={{
            fontFamily: FONTS.display, fontWeight: 500,
            lineHeight: 1.05, letterSpacing: '-.03em',
            margin: '0 0 40px',
          }}
          className="text-[36px] sm:text-[48px] lg:text-[60px]"
        >
          Quarterly cadence.<br />
          <span style={{ fontStyle: 'italic' }}>Public archive.</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {WHITEPAPERS.map((w) => (
            <article
              key={w.title}
              style={{
                background: PALETTE.paper2,
                border: `.5px solid ${PALETTE.ruleStrong}`,
                padding: '24px 22px',
                display: 'flex',
                flexDirection: 'column',
                minHeight: 280,
              }}
            >
              <SmallLabel style={{ color: PALETTE.terracotta, fontSize: 9.5, marginBottom: 8 }}>
                {w.version} · {w.year}
                {w.status === 'draft' && (
                  <span style={{ color: PALETTE.concrete, marginLeft: 8 }}>· DRAFT</span>
                )}
              </SmallLabel>
              <h3
                style={{
                  fontFamily: FONTS.display, fontSize: 20, fontWeight: 500,
                  letterSpacing: '-.015em', lineHeight: 1.25, margin: 0,
                }}
              >
                {w.title}
              </h3>
              <p
                style={{
                  fontFamily: FONTS.body, fontSize: 14, lineHeight: 1.6,
                  color: PALETTE.inkSoft, margin: '14px 0 14px',
                  flex: 1,
                }}
              >
                {w.summary}
              </p>
              {w.href && w.status === 'available' ? (
                <a
                  href={w.href}
                  {...(w.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  style={{
                    fontFamily: FONTS.mono, fontSize: 11,
                    letterSpacing: '.14em', textTransform: 'uppercase',
                    color: PALETTE.terracotta,
                    borderBottom: `.5px solid ${PALETTE.terracotta}`,
                    paddingBottom: 1,
                    textDecoration: 'none',
                    alignSelf: 'flex-start',
                  }}
                >
                  Read →
                </a>
              ) : (
                <span
                  style={{
                    fontFamily: FONTS.mono, fontSize: 11,
                    letterSpacing: '.14em', color: PALETTE.concrete, textTransform: 'uppercase',
                  }}
                >
                  Coming Q3 2026
                </span>
              )}
            </article>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section id="newsletter" className="px-6 lg:px-14 py-24" style={{ borderBottom: `.5px solid ${PALETTE.rule}` }}>
        <SmallLabel style={{ marginBottom: 16 }}>§ II · NEWSLETTER · WEEKLY</SmallLabel>
        <h2
          style={{
            fontFamily: FONTS.display, fontWeight: 500,
            lineHeight: 1.05, letterSpacing: '-.03em',
            margin: '0 0 16px',
          }}
          className="text-[36px] sm:text-[44px] lg:text-[52px]"
        >
          48+ issues. <span style={{ fontStyle: 'italic' }}>No tracking.</span>
        </h2>
        <p style={{ fontFamily: FONTS.body, fontSize: 16, color: PALETTE.inkSoft, margin: '0 0 40px', maxWidth: 640 }}>
          The last five issues. Full archive on GitHub.
        </p>

        <div
          style={{
            border: `.5px solid ${PALETTE.ruleStrong}`,
            background: PALETTE.paper,
          }}
        >
          {NEWSLETTER.map((issue, i) => (
            <div
              key={issue.date}
              className="grid grid-cols-1 lg:grid-cols-[140px_1fr_120px] gap-3 lg:gap-8 items-start lg:items-center px-6 py-5 lg:px-7"
              style={{
                borderBottom: i < NEWSLETTER.length - 1 ? `.5px solid ${PALETTE.rule}` : 'none',
              }}
            >
              <div style={{ fontFamily: FONTS.mono, fontSize: 12, letterSpacing: '.08em', color: PALETTE.terracotta }}>
                {issue.date}
              </div>
              <h3 style={{ fontFamily: FONTS.display, fontSize: 18, lineHeight: 1.35, fontWeight: 500, margin: 0 }}>
                {issue.title}
              </h3>
              <div
                className="lg:text-right"
                style={{
                  fontFamily: FONTS.mono, fontSize: 11,
                  letterSpacing: '.12em', color: PALETTE.concrete, textTransform: 'uppercase',
                }}
              >
                {issue.reading}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <Button kind="ghost" href="https://github.com/fredericosanntana/dpo2u-zettelkasten">
            Full archive on GitHub ↗
          </Button>
        </div>
      </section>

      {/* MCP Tool Reference — absorbed from the retired /mcp page */}
      <section id="mcp-reference" className="px-6 lg:px-14 py-24" style={{ borderBottom: `.5px solid ${PALETTE.rule}` }}>
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-10 lg:gap-14 mb-12 items-end">
          <div>
            <SmallLabel style={{ marginBottom: 16, color: PALETTE.terracotta }}>§ III · MCP TOOL REFERENCE</SmallLabel>
            <h2
              style={{
                fontFamily: FONTS.display, fontWeight: 500,
                lineHeight: 1.05, letterSpacing: '-.03em',
                margin: 0,
              }}
              className="text-[36px] sm:text-[44px] lg:text-[52px]"
            >
              Sixty-six typed tools.<br />
              <span style={{ fontStyle: 'italic' }}>Seventeen jurisdictions.</span>
            </h2>
          </div>
          <div style={{ fontFamily: FONTS.body, fontSize: 16, color: PALETTE.inkSoft, lineHeight: 1.6 }}>
            Compiled from five years of research in LGPD, GDPR, MiCAR, DPDP, PDPA, UAE, PDPL,
            POPIA, NDPA, CCPA, PIPEDA, LAW25, PIPA, PDP, and APPI regulation — plus the AI Governance
            vertical (six frameworks: Japan AI Promotion Act + Hiroshima ICOC G7 + EU AI Act + Korea
            AI Basic Act + CAIDP Universal Guidelines + UNESCO RAM, aligned with the UN Global
            Dialogue on AI Governance).
            Every tool returns structured JSON and links to an auditable artifact — not prose. Four
            are publicly documented; fifty-five more are internal.
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {MCP_SKILLS.map((s) => (
            <article
              key={s.name}
              style={{
                background: PALETTE.paper2,
                border: `.5px solid ${PALETTE.ruleStrong}`,
                padding: '22px 20px',
                minHeight: 240,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <code
                style={{
                  fontFamily: FONTS.mono, fontSize: 11.5,
                  color: PALETTE.terracotta,
                  letterSpacing: '.02em',
                  wordBreak: 'break-word',
                }}
              >
                {s.name}
              </code>
              <h3
                style={{
                  fontFamily: FONTS.display, fontSize: 17, fontWeight: 500,
                  lineHeight: 1.25, margin: '12px 0 0',
                }}
              >
                {s.title}
              </h3>
              <p
                style={{
                  fontFamily: FONTS.body, fontSize: 13.5, lineHeight: 1.55,
                  color: PALETTE.inkSoft, margin: '12px 0',
                  flex: 1,
                }}
              >
                {s.desc}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {s.tags.map((t) => (
                  <span
                    key={t}
                    style={{
                      fontFamily: FONTS.mono, fontSize: 9,
                      letterSpacing: '.12em', textTransform: 'uppercase',
                      padding: '2px 6px',
                      border: `.5px solid ${PALETTE.ruleStrong}`,
                      color: PALETTE.concrete,
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>

        {/* Add to Claude callout */}
        <div
          className="mt-10 grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8 items-stretch"
        >
          <div
            style={{
              background: PALETTE.ink,
              color: PALETTE.paper,
              padding: '32px 28px',
            }}
          >
            <SmallLabel style={{ color: PALETTE.terracotta, marginBottom: 12 }}>
              ADD DPO2U TO CLAUDE
            </SmallLabel>
            <h3
              style={{
                fontFamily: FONTS.display, fontSize: 26, fontWeight: 500,
                letterSpacing: '-.018em', margin: 0, lineHeight: 1.2,
              }}
            >
              Point any MCP-capable agent at <span style={{ color: PALETTE.terracotta, fontFamily: FONTS.mono, fontSize: 22 }}>mcp.dpo2u.com</span>.
            </h3>
            <p
              style={{
                fontFamily: FONTS.body, fontSize: 14.5, lineHeight: 1.55,
                color: 'rgba(241,236,227,.72)', margin: '14px 0 0', maxWidth: 580,
              }}
            >
              The DPO2U MCP server runs locally (stdio) or remotely (SSE). Add it to Claude
              Code, ChatGPT with MCP, or your custom orchestrator with a single config entry.
              Every tool call is auditable and returns structured data.
            </p>
          </div>
          <div
            style={{
              background: PALETTE.paper2,
              border: `.5px solid ${PALETTE.ruleStrong}`,
              borderRadius: 4,
              overflow: 'hidden',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', borderBottom: `.5px solid ${PALETTE.rule}` }}>
              <span style={{ width: 9, height: 9, borderRadius: '50%', background: PALETTE.ruleStrong, opacity: .4 }} />
              <span style={{ width: 9, height: 9, borderRadius: '50%', background: PALETTE.ruleStrong, opacity: .4 }} />
              <span style={{ width: 9, height: 9, borderRadius: '50%', background: PALETTE.ruleStrong, opacity: .4 }} />
              <span style={{ marginLeft: 6, fontFamily: FONTS.mono, fontSize: 10, letterSpacing: '.14em', color: PALETTE.concrete, textTransform: 'uppercase' }}>
                ~/.claude/mcp_servers.json
              </span>
            </div>
            <pre style={{
              padding: 18, fontFamily: FONTS.mono, fontSize: 12.5, lineHeight: 1.7,
              color: PALETTE.ink, margin: 0, overflowX: 'auto', whiteSpace: 'pre',
            }}>
              {MCP_CONFIG}
            </pre>
          </div>
        </div>
      </section>

      {/* Zettelkasten */}
      <section className="px-6 lg:px-14 py-24" style={{ borderBottom: `.5px solid ${PALETTE.rule}` }}>
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-10 items-start">
          <div>
            <SmallLabel style={{ marginBottom: 16, color: PALETTE.terracotta }}>§ IV · ZETTELKASTEN · 6,586+ NOTES</SmallLabel>
            <h2
              style={{
                fontFamily: FONTS.display, fontWeight: 500,
                lineHeight: 1.05, letterSpacing: '-.03em',
                margin: 0,
              }}
              className="text-[36px] sm:text-[44px] lg:text-[52px]"
            >
              The raw <span style={{ fontStyle: 'italic' }}>research.</span>
            </h2>
            <p style={{ fontFamily: FONTS.body, fontSize: 17, lineHeight: 1.6, color: PALETTE.inkSoft, marginTop: 20, maxWidth: 640 }}>
              Five years of atomic notes on compliance, cryptography, and regulation. Public
              on GitHub. The ground truth everything else is distilled from.
            </p>
            <p style={{ fontFamily: FONTS.mono, fontSize: 11, letterSpacing: '.14em', color: PALETTE.concrete, marginTop: 16, textTransform: 'uppercase' }}>
              Last indexed 2026-04-24 · 178 MB · Markdown · Apache 2.0
            </p>
            <div className="mt-10 flex gap-3 flex-wrap">
              <Button kind="terracotta" href="https://github.com/fredericosanntana/dpo2u-zettelkasten">
                Browse the Zettelkasten ↗
              </Button>
              <Button kind="ghost" href="https://github.com/fredericosanntana/dpo2u-solana">
                Solana code ↗
              </Button>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <WaxSeal size={140} label="RESEARCH" />
          </div>
        </div>
      </section>
    </>
  );
}
