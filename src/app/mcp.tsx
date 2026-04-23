import React from 'react';
import { motion } from 'framer-motion';
import {
  Brain, ArrowRight, Terminal, Shield, Globe,
  FileCheck, UserCheck, Zap, Github, BookOpen, ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import PageShell from '@/components/landing/PageShell';
import PageHero from '@/components/landing/PageHero';
import PageSection from '@/components/landing/PageSection';
import { fadeInUp, staggerContainer } from '@/lib/animations';

const SKILLS = [
  {
    icon: Shield,
    name: 'dpo2u-audit-micar',
    title: 'MiCAR ART vault audit',
    desc: 'Audit an EU stablecoin reserve program against MiCAR Art. 23 / 35 / 36 / 39 — Proof of Reserve, Liquidity Vault, Capital Buffer, Velocity Limiter.',
    tags: ['EU', 'MiCAR', 'Crypto'],
  },
  {
    icon: FileCheck,
    name: 'dpo2u-compliance-check',
    title: 'Compliance checklist + score',
    desc: 'Run an LGPD / GDPR / DPDP / MiCAR / PDPA / UAE compliance scan. Returns scored checklist, gaps, and prioritized action plan.',
    tags: ['LGPD', 'GDPR', 'DPDP', 'PDPA'],
  },
  {
    icon: Globe,
    name: 'dpo2u-compare-jurisdictions',
    title: 'Cross-jurisdiction matrix',
    desc: 'Regulatory matrix across Brazil, EU, India, Singapore, UAE. Includes ADGM foundation charter generation for market entry.',
    tags: ['Multi-jurisdiction'],
  },
  {
    icon: UserCheck,
    name: 'dpo2u-consent-record',
    title: 'On-chain consent record',
    desc: 'Record or revoke a DPDP India / LGPD consent event on Solana via the consent-manager program. Purpose hashing + optional AES-GCM payload + ZK-bound consent via SP1 verifier.',
    tags: ['Solana', 'DPDP', 'ZK'],
  },
];

const INTEGRATION_BULLETS = [
  'Typed tool schemas (JSON-Schema) for every skill',
  'Idempotent outputs — suitable for audit trails',
  'Pluggable against the Solana on-chain programs',
  'Supports remote via stdio/SSE transport',
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
  return (
    <PageShell>
      <PageHero
        badge={
          <>
            <Brain className="w-3.5 h-3.5" />
            Model Context Protocol · Compliance tools for AI agents
          </>
        }
        title={
          <>
            Compliance tools,{' '}
            <span className="bg-gradient-to-r from-brand-emerald-400 to-brand-sapphire-400 bg-clip-text text-transparent">
              callable from any LLM.
            </span>
          </>
        }
        subtitle={
          <>
            The DPO2U MCP server exposes LGPD, GDPR, DPDP, MiCAR, PDPA, and UAE
            compliance primitives as typed MCP tools. Plug into Claude, ChatGPT,
            or any MCP-capable agent — from audit checklists to on-chain consent records.
          </>
        }
        ctas={[
          { label: 'Browse the tools', href: '#skills' },
          { label: 'Repo', href: 'https://github.com/fredericosanntana/dpo2u-solana', external: true },
        ]}
      />

      <PageSection id="skills">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.05 }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="text-center mb-12 max-w-3xl mx-auto">
            <Badge variant="brand" size="sm" className="mb-4">Core skills</Badge>
            <h2 className="text-3xl sm:text-5xl font-semibold text-apex-heading mb-4">
              Four compliance skills, one MCP server.
            </h2>
            <p className="text-zinc-400">
              Every skill returns structured output and links to deterministic,
              auditable artifacts — not prose.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {SKILLS.map((s) => (
              <motion.div key={s.name} variants={fadeInUp}>
                <Card className="h-full p-8 liquid-glass rounded-3xl hover:bg-white/[0.03] transition-colors duration-300 flex flex-col">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-sapphire-500/20 to-brand-emerald-500/20 flex items-center justify-center shrink-0">
                      <s.icon className="w-5 h-5 text-brand-sapphire-400" />
                    </div>
                    <div className="min-w-0">
                      <code className="text-xs text-brand-emerald-400 font-mono">{s.name}</code>
                      <h3 className="text-lg font-semibold text-apex-heading mt-1 leading-tight">{s.title}</h3>
                    </div>
                  </div>
                  <p className="text-sm text-zinc-400 flex-1 leading-relaxed">{s.desc}</p>
                  <div className="flex gap-1.5 mt-4 flex-wrap">
                    {s.tags.map((t) => (
                      <span key={t} className="text-[10px] uppercase tracking-widest px-2 py-1 rounded-full bg-white/[0.04] text-zinc-400 border border-white/[0.04]">
                        {t}
                      </span>
                    ))}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </PageSection>

      <PageSection>
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.05 }}
          variants={staggerContainer}
          className="grid lg:grid-cols-2 gap-12 items-center"
        >
          <motion.div variants={fadeInUp}>
            <Badge variant="brand" size="sm" className="mb-4">
              <Terminal className="w-3 h-3 mr-1" /> Integration
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-semibold text-apex-heading mb-4">
              Point any MCP-capable agent here.
            </h2>
            <p className="text-zinc-400 mb-6 leading-relaxed">
              The DPO2U MCP server runs locally or remotely. Add it to Claude Code,
              ChatGPT with MCP, or your custom orchestrator with a single config
              entry — every tool call is auditable and returns structured data.
            </p>
            <ul className="space-y-3">
              {INTEGRATION_BULLETS.map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-brand-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-sm text-zinc-300">{b}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-4 text-xs text-zinc-500">
              <a href="mailto:contato@dpo2u.com.br" className="hover:text-zinc-300 transition-colors inline-flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" /> Talk to us
              </a>
              <a href="/compliance-automate" className="hover:text-zinc-300 transition-colors inline-flex items-center gap-1">
                Compliance wizard <ExternalLink className="w-3 h-3" />
              </a>
              <a href="/solana-protocol" className="hover:text-zinc-300 transition-colors inline-flex items-center gap-1">
                On-chain protocol <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <Card className="liquid-glass rounded-3xl overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                </div>
                <span className="text-xs text-zinc-500 ml-2 font-mono">claude mcp config</span>
              </div>
              <pre className="p-5 text-xs text-zinc-300 font-mono leading-relaxed overflow-x-auto">
                {MCP_CONFIG}
              </pre>
            </Card>
          </motion.div>
        </motion.div>
      </PageSection>
    </PageShell>
  );
}
