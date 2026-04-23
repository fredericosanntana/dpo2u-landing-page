import React, { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import {
  Shield, Fingerprint, Check, ArrowRight, Cpu, FileCheck,
  ExternalLink, Zap, Github, BookOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import PageShell from '@/components/landing/PageShell';
import PageHero from '@/components/landing/PageHero';
import PageSection from '@/components/landing/PageSection';
import { PROGRAMS, explorerUrl, truncateAddress } from '@/lib/solana';
import { fadeInUp, staggerContainer } from '@/lib/animations';

const LiveAttestationsWidget = lazy(() =>
  import('@/components/solana/LiveAttestationsWidget'),
);
const AgentsRegisteredWidget = lazy(() =>
  import('@/components/solana/AgentsRegisteredWidget'),
);

const AnimatedBlock: React.FC<{
  children: React.ReactNode;
  className?: string;
  id?: string;
}> = ({ children, className = '', id }) => (
  <motion.div
    id={id}
    initial="initial"
    whileInView="animate"
    viewport={{ once: true, amount: 0.05 }}
    variants={staggerContainer}
    className={className}
  >
    {children}
  </motion.div>
);

const HEADLINE_STATS = [
  { label: 'Cost / attestation', value: '$0.0002' },
  { label: 'Compute units',      value: '~156k CU' },
  { label: 'Proof size',         value: '356 B' },
  { label: 'Prover',             value: 'SP1 v6' },
];

const FLOW_STEPS = [
  {
    n: '01',
    icon: Cpu,
    title: 'Prove locally (SP1 zkVM)',
    desc: 'Private inputs (compliance score, salt) enter the RISC-V program. SP1 emits a Groth16 proof + 5 public values (subject, threshold, meets, vkRoot, nonce).',
  },
  {
    n: '02',
    icon: Zap,
    title: 'Submit Solana transaction',
    desc: 'TypeScript client sends proof (~356 B) + public values (~160 B) to the compliance verifier. Fits in one transaction.',
  },
  {
    n: '03',
    icon: FileCheck,
    title: 'Verifier CPIs registry',
    desc: 'Verifier program checks alt_bn128 pairing on-chain (~156k CU) and CPIs into the compliance-registry to write the attestation PDA.',
  },
  {
    n: '04',
    icon: Shield,
    title: 'Attestation PDA lives on-chain',
    desc: 'Auditable, revocable, linked to the subject DID (did:br:cnpj:…). Score stays private. Proof is public. Everything is enforceable on-chain.',
  },
];

const SP1_BULLETS = [
  '120 LOC, backward-compatible via separate entry points',
  'PublicValuesStruct ABI (subject, threshold, meets, vkRoot, nonce)',
  'Groth16 verification via native alt_bn128 syscall — no BPF bloat',
  'Upstream PR ready to open on succinctlabs/sp1-solana',
];

export default function SolanaProtocolPage() {
  return (
    <PageShell>
      <PageHero
        badge={
          <>
            <span className="relative flex h-2 w-2 mr-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-emerald-500" />
            </span>
            Live on Solana Devnet · 2026-04-21
          </>
        }
        title={
          <>
            Zero-Knowledge Compliance,{' '}
            <span className="bg-gradient-to-r from-brand-emerald-400 to-brand-sapphire-400 bg-clip-text text-transparent">
              Native to Solana.
            </span>
          </>
        }
        subtitle={
          <>
            Prove <code className="text-brand-emerald-400 font-mono">score ≥ threshold</code> to an
            auditor without revealing the score. Groth16 via SP1 v6,
            verified by <code className="text-brand-sapphire-400 font-mono">alt_bn128</code> syscall
            in ~156k CU, recorded as an immutable attestation PDA.
          </>
        }
        ctas={[
          { label: 'Browse on-chain programs', href: '#programs' },
          { label: 'Repo on GitHub', href: 'https://github.com/fredericosanntana/dpo2u-solana', external: true },
        ]}
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {HEADLINE_STATS.map((s) => (
            <div key={s.label} className="liquid-glass rounded-2xl px-4 py-5">
              <div className="text-2xl sm:text-3xl font-semibold text-apex-heading">{s.value}</div>
              <div className="text-xs text-zinc-500 uppercase tracking-widest mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </PageHero>

      <PageSection id="programs">
        <AnimatedBlock>
          <motion.div variants={fadeInUp} className="text-center mb-12 max-w-3xl mx-auto">
            <Badge variant="brand" size="sm" className="mb-4">Six Anchor programs · Solana devnet</Badge>
            <h2 className="text-3xl sm:text-5xl font-semibold text-apex-heading mb-4">
              Proof points, on-chain.
            </h2>
            <p className="text-zinc-400">
              Every program ID below is live on devnet and clickable to Solana Explorer.
              This is the same infrastructure the demo reproduces end-to-end in 60 seconds.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROGRAMS.map((p) => (
              <motion.div key={p.key} variants={fadeInUp}>
                <Card className="group h-full p-6 liquid-glass rounded-3xl hover:bg-white/[0.03] transition-all duration-300 flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-sapphire-500/20 to-brand-emerald-500/20 flex items-center justify-center">
                      <Fingerprint className="w-5 h-5 text-brand-sapphire-400" />
                    </div>
                    <Badge variant="status-active" size="sm">devnet</Badge>
                  </div>
                  <h3 className="text-lg font-semibold text-apex-heading mb-2">{p.displayName}</h3>
                  <p className="text-sm text-zinc-400 mb-4 flex-1 leading-relaxed">{p.tagline}</p>
                  <div className="border-t border-white/[0.06] pt-4 space-y-3">
                    <div>
                      <div className="text-[10px] text-zinc-600 uppercase tracking-widest mb-1">Program ID</div>
                      <code className="text-xs text-brand-emerald-400 font-mono">
                        {truncateAddress(p.programId, 8, 8)}
                      </code>
                    </div>
                    <a
                      href={explorerUrl(p.programId)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between text-sm text-brand-sapphire-400 hover:text-brand-sapphire-300 transition-colors"
                    >
                      View on Solana Explorer
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </AnimatedBlock>
      </PageSection>

      <PageSection>
        <AnimatedBlock>
          <motion.div variants={fadeInUp} className="text-center mb-16 max-w-3xl mx-auto">
            <Badge variant="brand" size="sm" className="mb-4">How it works</Badge>
            <h2 className="text-3xl sm:text-5xl font-semibold text-apex-heading mb-4">
              Private score. Public proof. Enforceable attestation.
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {FLOW_STEPS.map((step) => (
              <motion.div key={step.n} variants={fadeInUp}>
                <Card className="h-full p-6 liquid-glass rounded-3xl">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xs font-mono text-zinc-500">{step.n}</span>
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-purple-500/20 to-brand-sapphire-500/20 flex items-center justify-center">
                      <step.icon className="w-4 h-4 text-brand-purple-400" />
                    </div>
                  </div>
                  <h3 className="text-base font-semibold text-apex-heading mb-2 leading-tight">{step.title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">{step.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </AnimatedBlock>
      </PageSection>

      <PageSection id="live">
        <AnimatedBlock>
          <motion.div variants={fadeInUp} className="text-center mb-12 max-w-3xl mx-auto">
            <Badge variant="success" size="sm" className="mb-4">Live data · Solana devnet RPC</Badge>
            <h2 className="text-3xl sm:text-5xl font-semibold text-apex-heading mb-4">
              Read the chain, right now.
            </h2>
            <p className="text-zinc-400">
              These widgets fetch on-chain accounts directly from Solana devnet
              every time you load this page. Read-only — no wallet connect needed.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-6">
            <Suspense fallback={<Card className="h-64 liquid-glass rounded-3xl animate-pulse" />}>
              <LiveAttestationsWidget />
            </Suspense>
            <Suspense fallback={<Card className="h-64 liquid-glass rounded-3xl animate-pulse" />}>
              <AgentsRegisteredWidget />
            </Suspense>
          </div>
        </AnimatedBlock>
      </PageSection>

      <PageSection id="verifier">
        <AnimatedBlock className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div variants={fadeInUp}>
            <Badge variant="premium" size="sm" className="mb-4">Upstream-worthy patch</Badge>
            <h2 className="text-3xl sm:text-4xl font-semibold text-apex-heading mb-4">
              We had to patch sp1-solana for SP1 v6.
            </h2>
            <p className="text-zinc-400 mb-6 leading-relaxed">
              Upstream <code className="text-brand-emerald-400 font-mono">sp1-solana</code> only
              supported SP1 up to v5. Our patch (~120 LOC, backward-compatible)
              extends it to v6 with 5 public inputs and a versioned envelope —
              separate entry points keep v5 behavior intact.
            </p>
            <ul className="space-y-3">
              {SP1_BULLETS.map((bullet) => (
                <li key={bullet} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-brand-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-sm text-zinc-300">{bullet}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <Card className="liquid-glass rounded-3xl overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                </div>
                <span className="text-xs text-zinc-500 ml-2 font-mono">dpo2u-driver output</span>
              </div>
              <pre className="p-5 text-xs text-zinc-300 font-mono leading-relaxed overflow-x-auto">
{`$ cargo run -p dpo2u-driver -- --verbose
┌─ DPO2U compliance proof ────────────┐
│ threshold          : 70              │
│ subject_commitment : 0x0913644c…     │
│ meets_threshold    : true            │
│ score              : [PRIVATE]       │
│ proof size         : 356 bytes       │
└──────────────────────────────────────┘
✓ on-chain verification succeeded
✓ attestation PDA: 71b2EPzr… [Explorer↗]`}
              </pre>
            </Card>
          </motion.div>
        </AnimatedBlock>
      </PageSection>

      <PageSection>
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.05 }}
          variants={staggerContainer}
          className="max-w-3xl mx-auto text-center liquid-glass rounded-[2rem] p-12 sm:p-16"
        >
          <motion.div variants={fadeInUp}>
            <Badge variant="success" size="sm" className="mb-4">60-second demo</Badge>
            <h2 className="text-3xl sm:text-5xl font-semibold text-apex-heading mb-4">
              Run the proof yourself.
            </h2>
            <p className="text-zinc-400 mb-8 max-w-xl mx-auto">
              No SP1 setup. No validator config. Fixtures committed to the repo —
              clone, <code className="text-brand-emerald-400 font-mono">cargo run</code>, watch the
              Explorer link print in your terminal.
            </p>
            <div className="bg-[#0d0d15] rounded-xl p-4 mb-8 text-left max-w-xl mx-auto">
              <pre className="text-xs text-zinc-300 font-mono">
{`git clone https://github.com/fredericosanntana/dpo2u-solana
cd dpo2u-solana && cargo run -p dpo2u-driver`}
              </pre>
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button variant="hero" size="lg" onClick={() => window.open('https://github.com/fredericosanntana/dpo2u-solana', '_blank')}>
                <Github className="w-4 h-4 mr-2" /> Clone the repo
              </Button>
              <Button variant="heroSecondary" size="lg" onClick={() => window.open('https://github.com/fredericosanntana/dpo2u-solana/blob/main/docs/HACKATHON.md', '_blank')}>
                <BookOpen className="w-4 h-4 mr-2" /> Read the pitch
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </PageSection>
    </PageShell>
  );
}
