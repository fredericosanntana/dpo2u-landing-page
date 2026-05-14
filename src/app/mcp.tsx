// LEGACY — route removed 2026-04-29; content moved to home FMCP section + /research MCP reference
import React from 'react';
import { motion } from 'framer-motion';
import LiquidGlassNav from '@/components/landing/LiquidGlassNav';
import CTAFooterWrapper from '@/components/landing/CTAFooterWrapper';
import { fadeIn, viewportOnce } from '@/lib/animations';
import { usePageHead } from '@/lib/page-head';

interface Skill {
  name: string;
  title: string;
  desc: string;
  tags: string[];
}

const SKILLS: Skill[] = [
  {
    name: 'dpo2u-audit-micar',
    title: 'MiCAR ART vault audit',
    desc: 'Audit an EU stablecoin reserve program against MiCAR Art. 23 / 35 / 36 / 39 — Proof of Reserve, Liquidity Vault, Capital Buffer, Velocity Limiter.',
    tags: ['EU', 'MiCAR', 'Crypto'],
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
  // CAIDP UN Global Dialogue alignment (May 2026).
  {
    name: 'audit_ai_red_lines',
    title: 'AI red-line audit',
    desc: 'Audits an AI system against the seven CAIDP red-line categories — emotion analysis, biometric categorization, biometric mass surveillance, predictive policing, child targeting, social scoring, subliminal manipulation — and EU AI Act Article 5. Returns termination obligation recommendation per CAIDP Universal Guidelines Princípio 12.',
    tags: ['CAIDP', 'EU-AIA', 'Red lines'],
  },
  {
    name: 'generate_ai_hria',
    title: 'AI Human Rights Impact Assessment',
    desc: 'Generates an HRIA distinct from a DPIA — covers free expression, association, privacy, gender-based violence facilitation, vulnerable populations, and children safety. Aligned with UNESCO RAM social-cultural dimension and EU AI Act Art. 27 FRIA.',
    tags: ['HRIA', 'UNESCO', 'CAIDP'],
  },
  {
    name: 'report_ai_incident',
    title: 'AI incident report',
    desc: 'AIAAIC-aligned incident reporting for AI failures: discrimination, safety failures, privacy breaches, agentic misbehavior, children harm, gender-based violence. Severity ≥4 with rights-violation triggers UN Special Rapporteur escalation hint plus jurisdiction mandatory-report list (EU AI Act Art. 73, GDPR Art. 33, LGPD Art. 48).',
    tags: ['AIAAIC', 'UN', 'Incident'],
  },
  {
    name: 'caidp_ai_index_score',
    title: 'CAIDP AI Index baseline',
    desc: 'Scores an organization against the CAIDP AI Index 2026 ten indicators — public participation, algorithmic transparency, fairness, independent oversight, accountability, human rights commitment, data protection, democratic values, research collaboration, capacity building. 90-country baseline per the CAIDP Index report.',
    tags: ['CAIDP', 'AI Index', 'Human rights'],
  },
];

const INTEGRATION_BULLETS = [
  'Typed tool schemas (JSON-Schema) for every skill',
  'Idempotent outputs — suitable for audit trails',
  'Pluggable against the Solana on-chain programs',
  'Transport: stdio (local) and SSE (remote)',
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

export default function MCPPage() {
  usePageHead({
    title: 'MCP — 66 typed compliance tools across 17 jurisdictions + 6 AI governance frameworks | DPO2U',
    description: '66 typed Model Context Protocol tools covering LGPD, GDPR, MiCAR, DPDP, PDPA, UAE/PDPL, POPIA, NDPA, CCPA, PIPEDA, LAW25, PIPA, PDP, APPI, MEXICO, VIETNAM, MALAYSIA plus six AI governance frameworks (Japan AI Promotion Act, Hiroshima ICOC G7, EU AI Act, Korea AI Basic Act, CAIDP Universal Guidelines, UNESCO RAM). Run compliance gap analysis, DPIA, HRIA, AI red-line audit, AI Index scoring, ZK attestation inside any MCP-compatible LLM.',
    path: '/mcp',
  });
  return (
    <div className="min-h-screen bg-dpo2u-ivory text-dpo2u-ink font-body">
      <LiquidGlassNav />
      <main className="pt-16">
        {/* Hero */}
        <section className="border-b border-dpo2u-ink/10">
          <div className="mx-auto max-w-[1200px] px-6 sm:px-8 lg:px-10 pt-24 md:pt-32 pb-20 md:pb-28">
            <motion.p
              initial="initial"
              animate="animate"
              variants={fadeIn}
              className="font-mono text-[11px] uppercase tracking-[0.18em] text-dpo2u-ink/70 mb-8"
            >
              — MCP · Model Context Protocol —
            </motion.p>
            <motion.h1
              initial="initial"
              animate="animate"
              variants={fadeIn}
              transition={{ delay: 0.1 }}
              className="font-display text-hero text-dpo2u-ink font-medium max-w-[20ch]"
            >
              Compliance tools, callable from any LLM.
            </motion.h1>
            <motion.p
              initial="initial"
              animate="animate"
              variants={fadeIn}
              transition={{ delay: 0.2 }}
              className="mt-8 font-body text-[19px] md:text-[21px] leading-snug text-dpo2u-ink/75 max-w-[58ch]"
            >
              66 typed tools. 4 public skills. Compiled from five years of research across 17 jurisdictions —
              LGPD, GDPR, MiCAR, DPDP, PDPA, UAE/PDPL, POPIA, NDPA, CCPA, PIPEDA, LAW25, PIPA, PDP, APPI, MEXICO, VIETNAM, MALAYSIA —
              plus six AI governance frameworks: Japan AI Promotion Act, Hiroshima ICOC G7, EU AI Act, Korea AI Basic Act, CAIDP Universal Guidelines, UNESCO RAM.
            </motion.p>
            <motion.div
              initial="initial"
              animate="animate"
              variants={fadeIn}
              transition={{ delay: 0.3 }}
              className="mt-10 flex flex-wrap gap-x-10 gap-y-3 font-body text-[14px]"
            >
              <a
                href="#skills"
                className="group inline-flex items-center gap-2 text-dpo2u-ink border-b border-dpo2u-ink/30 hover:border-dpo2u-indigo hover:text-dpo2u-indigo transition-colors pb-1"
              >
                Browse the skills
                <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
              </a>
              <a
                href="https://github.com/fredericosanntana/dpo2u-solana"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 text-dpo2u-ink/70 border-b border-dpo2u-ink/15 hover:border-dpo2u-ink hover:text-dpo2u-ink transition-colors pb-1"
              >
                Read the MCP design doc (coming 2026-Q2)
                <span aria-hidden className="transition-transform group-hover:translate-x-1">↗</span>
              </a>
            </motion.div>
          </div>
        </section>

        {/* Skills — editorial table */}
        <section id="skills" className="border-b border-dpo2u-ink/10">
          <div className="mx-auto max-w-[1200px] px-6 sm:px-8 lg:px-10 py-24 md:py-32">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={viewportOnce}
              variants={fadeIn}
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-dpo2u-ink/70 mb-6">
                — Eight public skills —
              </p>
              <h2 className="font-display text-section text-dpo2u-ink font-medium max-w-[24ch]">
                Published skills, deterministic outputs.
              </h2>
              <p className="mt-4 font-body text-[16px] text-dpo2u-ink/70 max-w-[56ch]">
                Every skill returns structured JSON and links to an auditable artifact — not prose.
                Four new AI-governance skills are aligned with CAIDP&apos;s submission to the UN
                Global Dialogue on AI Governance (UN GA Resolution 79/325): red-line audit, HRIA,
                incident reporting, and AI Index scoring. Fifty-five more tools are internal,
                documented in the design note.
              </p>
            </motion.div>

            <div className="mt-14 border-t border-dpo2u-ink/15">
              {/* Column headers */}
              <div className="hidden md:grid md:grid-cols-12 gap-4 py-3 border-b border-dpo2u-ink/10 font-mono text-[10px] uppercase tracking-[0.16em] text-dpo2u-ink/70">
                <div className="md:col-span-4">Tool</div>
                <div className="md:col-span-6">Description</div>
                <div className="md:col-span-2">Jurisdictions</div>
              </div>

              {SKILLS.map((s, i) => (
                <motion.article
                  key={s.name}
                  initial="initial"
                  whileInView="animate"
                  viewport={viewportOnce}
                  variants={fadeIn}
                  transition={{ delay: 0.05 * i }}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 py-6 md:py-8 border-b border-dpo2u-ink/10 items-baseline"
                >
                  <div className="md:col-span-4">
                    <code className="font-mono text-[13px] text-dpo2u-indigo">{s.name}</code>
                    <h3 className="mt-2 font-display text-[20px] text-dpo2u-ink font-medium leading-tight">
                      {s.title}
                    </h3>
                  </div>
                  <p className="md:col-span-6 font-body text-[14.5px] leading-relaxed text-dpo2u-ink/80">
                    {s.desc}
                  </p>
                  <div className="md:col-span-2 flex flex-wrap gap-1.5">
                    {s.tags.map((t) => (
                      <span
                        key={t}
                        className="font-mono text-[9px] uppercase tracking-[0.12em] px-1.5 py-0.5 border border-dpo2u-ink/20 text-dpo2u-ink/70"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* Integration — config block */}
        <section className="border-b border-dpo2u-ink/10">
          <div className="mx-auto max-w-[1200px] px-6 sm:px-8 lg:px-10 py-24 md:py-32">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
              <motion.div
                initial="initial"
                whileInView="animate"
                viewport={viewportOnce}
                variants={fadeIn}
              >
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-dpo2u-indigo mb-6">
                  — Integration —
                </p>
                <h2 className="font-display text-[36px] md:text-[44px] leading-[1.15] tracking-[-0.015em] text-dpo2u-ink font-medium max-w-[22ch]">
                  Point any MCP-capable agent here.
                </h2>
                <p className="mt-6 font-body text-[16px] leading-relaxed text-dpo2u-ink/75">
                  The DPO2U MCP server runs locally (stdio) or remotely (SSE). Add it to Claude
                  Code, ChatGPT with MCP, or your custom orchestrator with a single config entry.
                  Every tool call is auditable and returns structured data.
                </p>
                <ul className="mt-8 space-y-3">
                  {INTEGRATION_BULLETS.map((b) => (
                    <li
                      key={b}
                      className="flex items-start gap-3 font-body text-[14.5px] text-dpo2u-ink/85 leading-relaxed"
                    >
                      <span aria-hidden className="font-mono text-dpo2u-indigo text-[12px] mt-1">
                        ✓
                      </span>
                      {b}
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                initial="initial"
                whileInView="animate"
                viewport={viewportOnce}
                variants={fadeIn}
                transition={{ delay: 0.1 }}
                className="bg-dpo2u-ivory-warm/60 border border-dpo2u-ink/15 rounded-md overflow-hidden h-fit"
              >
                <div className="flex items-center gap-2 px-4 py-3 border-b border-dpo2u-ink/10">
                  <div className="flex gap-1.5">
                    <span aria-hidden className="w-2.5 h-2.5 rounded-full bg-dpo2u-terracotta/50" />
                    <span aria-hidden className="w-2.5 h-2.5 rounded-full bg-dpo2u-gold/60" />
                    <span aria-hidden className="w-2.5 h-2.5 rounded-full bg-dpo2u-verdigris/60" />
                  </div>
                  <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-dpo2u-ink/70 ml-2">
                    ~/.claude/mcp_servers.json
                  </span>
                </div>
                <pre className="p-5 font-mono text-[13px] text-dpo2u-ink leading-[1.7] overflow-x-auto whitespace-pre">
                  {MCP_CONFIG}
                </pre>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <CTAFooterWrapper />
    </div>
  );
}
