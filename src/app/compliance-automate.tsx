import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  Shield, FileText, CheckCircle, ArrowRight, Lock, Activity, Fingerprint, Database, Brain,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import PageShell from '@/components/landing/PageShell';
import PageHero from '@/components/landing/PageHero';
import PageSection from '@/components/landing/PageSection';
import { fadeInUp, staggerContainer } from '@/lib/animations';

const AnimatedBlock: React.FC<{
  children: React.ReactNode;
  className?: string;
  id?: string;
}> = ({ children, className = '', id }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  return (
    <motion.div
      ref={ref}
      id={id}
      initial="initial"
      animate={inView ? 'animate' : 'initial'}
      variants={staggerContainer}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const ARTIFACTS = [
  {
    icon: FileText,
    title: 'Privacy Policy',
    desc: 'Custom-generated with specific clauses for your sector, data collection type, and legal basis.',
    output: 'policy.json → IPFS CID',
    bgClass: 'bg-brand-sapphire-500/10',
    borderClass: 'border-brand-sapphire-500/20',
    textClass: 'text-brand-sapphire-400',
  },
  {
    icon: Lock,
    title: 'Terms of Use',
    desc: 'Clear usage rules protecting intellectual property and outlining responsibilities.',
    output: 'terms.json → IPFS CID',
    bgClass: 'bg-brand-emerald-500/10',
    borderClass: 'border-brand-emerald-500/20',
    textClass: 'text-brand-emerald-400',
  },
  {
    icon: Activity,
    title: 'DPIA Report',
    desc: 'Complete Data Protection Impact Assessment for high-risk data processing activities.',
    output: 'dpia.json → IPFS CID',
    bgClass: 'bg-brand-purple-500/10',
    borderClass: 'border-brand-purple-500/20',
    textClass: 'text-brand-purple-400',
  },
  {
    icon: Shield,
    title: 'Security Policy',
    desc: 'Internal information security standards, access control, and incident response procedures.',
    output: 'security.json → IPFS CID',
    bgClass: 'bg-orange-500/10',
    borderClass: 'border-orange-500/20',
    textClass: 'text-orange-400',
  },
  {
    icon: CheckCircle,
    title: 'Audit Checklist',
    desc: 'Point-by-point compliance checklist covering all 32 control points with pass/fail status.',
    output: 'audit.json → IPFS CID',
    bgClass: 'bg-cyan-500/10',
    borderClass: 'border-cyan-500/20',
    textClass: 'text-cyan-400',
  },
  {
    icon: Fingerprint,
    title: 'ZK-Ready Score',
    desc: 'Compliance score ready to be posted as a zero-knowledge proof on Solana via the dpo2u-compliance-verifier program.',
    output: 'score → Solana devnet',
    bgClass: 'bg-yellow-500/10',
    borderClass: 'border-yellow-500/20',
    textClass: 'text-yellow-400',
  },
];

const STEPS = [
  { step: '01', title: 'Smart Diagnostic', desc: 'Answer dynamic questions adapted to your business model and data processing activities.' },
  { step: '02', title: 'AI Processing', desc: 'Our agents cross-reference your data with LGPD, GDPR, and applicable legislation across 32 control points.' },
  { step: '03', title: 'Instant Delivery', desc: 'Receive your complete compliance kit — all documents stored on IPFS with content-addressable CIDs.' },
];

const PIPELINE = [
  { label: 'Compliance Engine', active: true, icon: FileText },
  { label: 'AI Brain', active: false, icon: Brain },
  { label: 'ZK Protocol', active: false, icon: Fingerprint },
  { label: 'Agents', active: false, icon: Database },
];

export default function ComplianceAutomatePage() {
  return (
    <PageShell>
      <PageHero
        badge={
          <>
            <span className="text-xs font-mono text-zinc-500 mr-1">01</span>
            <Shield className="w-4 h-4 text-brand-emerald-400" />
            <span className="text-sm font-semibold text-brand-emerald-300 tracking-wide uppercase">Compliance Engine</span>
          </>
        }
        title={
          <>
            From Zero to Compliant
            <br />
            <span className="bg-gradient-to-r from-brand-emerald-400 via-brand-ocean-400 to-brand-sapphire-400 bg-clip-text text-transparent">
              in Minutes
            </span>
          </>
        }
        subtitle={
          <>
            AI agents analyze <span className="text-brand-emerald-400 font-medium">32 control points</span> and generate
            all legal and technical documentation — policies, DPIAs, audit checklists —
            customized to your business in minutes.
          </>
        }
        ctas={[
          { label: 'Start Free Diagnostic', href: '/analise' },
          { label: 'Next: AI Brain', href: '/mcp' },
        ]}
      >
        <p className="text-sm text-zinc-500 font-medium">
          <span className="text-brand-emerald-400">✓</span> No credit card required &nbsp;
          <span className="text-brand-emerald-400">✓</span> Instant results &nbsp;
          <span className="text-brand-emerald-400">✓</span> LGPD &amp; GDPR
        </p>
      </PageHero>

      <PageSection>
        <AnimatedBlock>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-semibold text-apex-heading mb-4 leading-tight">
              What the Engine <span className="text-brand-emerald-400">Generates</span>
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              AI analyzes 32 control points and produces legally valid, customized documents
              stored on IPFS with content-addressable CIDs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ARTIFACTS.map((item) => (
              <motion.div key={item.title} variants={fadeInUp}>
                <Card className="p-8 h-full liquid-glass rounded-3xl hover:bg-white/[0.03] transition-all duration-300 group hover:-translate-y-1">
                  <div className={`w-14 h-14 rounded-2xl ${item.bgClass} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border ${item.borderClass}`}>
                    <item.icon className={`h-7 w-7 ${item.textClass}`} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-apex-heading">
                    {item.title}
                  </h3>
                  <p className="text-zinc-400 leading-relaxed mb-3">{item.desc}</p>
                  <p className="text-xs font-mono text-brand-emerald-400/70">{item.output}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </AnimatedBlock>
      </PageSection>

      <PageSection>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center px-3 py-1 bg-brand-sapphire-500/10 border border-brand-sapphire-500/20 rounded-full mb-6">
              <span className="text-xs font-bold text-brand-sapphire-300 uppercase tracking-widest">Simplified Process</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-semibold mb-8 text-apex-heading leading-tight">
              From Zero to Compliant <br />
              <span className="text-zinc-500">in 3 Steps</span>
            </h2>
            <div className="space-y-10">
              {STEPS.map((step) => (
                <div key={step.step} className="flex gap-6 group">
                  <div className="flex-shrink-0 w-16 h-16 rounded-2xl liquid-glass flex items-center justify-center text-2xl font-semibold text-zinc-600 group-hover:text-brand-emerald-400 transition-all">
                    {step.step}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-apex-heading group-hover:text-brand-emerald-300 transition-colors">{step.title}</h3>
                    <p className="text-zinc-400">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-brand-emerald-500 to-brand-sapphire-500 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000" />
            <div className="relative liquid-glass rounded-3xl overflow-hidden p-8">
              <div className="space-y-4 font-mono text-sm">
                <div className="text-brand-emerald-400">{"> Processing company data..."}</div>
                <div className="text-zinc-500">Analyzing 32 control points</div>
                <div className="text-zinc-500">Cross-referencing LGPD Art. 7-11</div>
                <div className="text-brand-sapphire-400">Generating privacy_policy.json</div>
                <div className="text-brand-sapphire-400">Generating dpia_report.json</div>
                <div className="text-brand-sapphire-400">Generating security_policy.json</div>
                <div className="text-brand-purple-400">Uploading to IPFS/Lighthouse...</div>
                <div className="text-brand-emerald-400">CID: bafybeig...k2mq</div>
                <div className="text-amber-400">Score: 87/100 — Ready for ZK proof</div>
                <div className="mt-4 text-brand-emerald-400 font-semibold">
                  ✓ Compliance kit ready. Next → AI Brain (MCP)
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageSection>

      <PageSection>
        <AnimatedBlock>
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-3xl sm:text-5xl font-semibold text-apex-heading mb-4">
              Product <span className="text-brand-emerald-400">01</span> in the Pipeline
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              The Compliance Engine is the entry point. Documents flow to the AI Brain for programmatic processing.
            </p>
          </motion.div>

          <motion.div variants={fadeInUp} className="max-w-3xl mx-auto liquid-glass rounded-3xl p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center">
              {PIPELINE.map((step, idx) => (
                <React.Fragment key={step.label}>
                  {idx > 0 && <ArrowRight className="h-5 w-5 text-zinc-600 hidden md:block flex-shrink-0" />}
                  <div className="flex flex-col items-center gap-2">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
                      step.active
                        ? 'bg-brand-emerald-500/20 border-brand-emerald-500/50'
                        : 'bg-white/[0.02] border-white/[0.06]'
                    }`}>
                      <step.icon className={`h-6 w-6 ${step.active ? 'text-brand-emerald-400' : 'text-zinc-500'}`} />
                    </div>
                    <span className={`text-sm font-medium ${step.active ? 'text-brand-emerald-400' : 'text-zinc-500'}`}>
                      {step.label}
                    </span>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </motion.div>
        </AnimatedBlock>
      </PageSection>
    </PageShell>
  );
}
