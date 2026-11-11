import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  ArrowRight, BadgeCheck, Check, Code, ExternalLink, Fingerprint, Landmark,
  Mail, Network, Scale, Shield, ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { fadeInUp, staggerContainer } from '@/lib/animations';

const SNOWTRACE = 'https://testnet.snowtrace.io';
const REPO = 'https://github.com/fredericosanntana/dpo2u-avalanche';

const AnimatedSection: React.FC<{ children: React.ReactNode; className?: string; id?: string }> = ({ children, className = '', id }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  return (
    <motion.section ref={ref} id={id} initial="initial" animate={inView ? 'animate' : 'initial'} variants={staggerContainer} className={className}>
      {children}
    </motion.section>
  );
};

const contracts = [
  { name: 'SP1Verifier (Groth16, v6.1.0)', address: '0xA9EF51126b02DDb8C284C424EfC4C54893d5979E', what: 'Verifies SP1 zero-knowledge proofs on the C-Chain.' },
  { name: 'ComplianceRegistry', address: '0xc997C83FbF40c70867b9A969a2AC2ee2Ae87C4cE', what: 'The seal: PASS / FAIL / REVIEW per subject and use case, with mandatory expiry and revocation.' },
  { name: 'ZkThresholdAttestor', address: '0x0a48471953bEFaEDE2f75E0D9A54f0EAFe68B9B7', what: 'Proves score ≥ threshold with a Groth16 proof. The score never touches the chain.' },
  { name: 'PassportOracle', address: '0x27bb394d3fFdD7DDc5bb67F8C8Ee64073BeDF2b2', what: 'Conformity passport per counterparty. Any contract asks isValid() before settling.' },
  { name: 'TravelRuleGate', address: '0xCB53038Bf6105F00F9FD48Fa22d0f77b6BE93834', what: 'An operator action only runs with a valid Travel Rule PASS, anti-replay and intent binding.' },
  { name: 'SolvencyRegistry', address: '0x92d194d2766394F917Aca20c6b8881De1F5db97b', what: 'Proof of reserves as an SP1 proof: solvent or not, without exposing balances.' },
  { name: 'MidnightRelay', address: '0xeF52a2F26E0A5E558A87b34Bd98E910F3F64D845', what: 'Brings private compliance seals from Midnight to Avalanche through k-of-n relayers.' },
];

const proofs = [
  { label: 'Real SP1 Groth16 proof verified on-chain', tx: '0xbb82fac5972b72f930538d404afb941be3a7e12d46578d4c2185987c5e630706' },
  { label: 'First solvency seal (SP1 proof of reserves, test data)', tx: '0x0663f0c23fc7a2435d54fcd1f892ad5be62933bc428ab53ae9ef8548f59593a2' },
  { label: 'First Midnight → Fuji relayed seal', tx: '0x66f356b299fae0271be3e305f69b883bae0fe6e0d11a46042a6a75d4be2a1e4a' },
];

const short = (a: string) => `${a.slice(0, 6)}…${a.slice(-4)}`;

export default function AvalanchePage() {
  useEffect(() => {
    document.title = 'DPO2U on Avalanche | Compliance as a protocol';
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 overflow-x-hidden">
      <Header />

      {/* Hero */}
      <AnimatedSection className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-b from-slate-900 via-brand-sapphire-950/30 to-slate-900">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-brand-sapphire-500/15 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '4s' }} />
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-brand-emerald-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '6s' }} />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div variants={fadeInUp} className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-brand-sapphire-500/20 to-brand-emerald-500/20 rounded-full border border-brand-sapphire-400/30 mb-4 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse mr-3" />
              <span className="text-base font-semibold text-brand-sapphire-200">Live on Avalanche Fuji</span>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-4xl md:text-5xl lg:text-7xl font-serif font-bold mb-8 leading-tight text-white">
              Compliance as a protocol, <br />
              <span className="bg-gradient-to-r from-brand-sapphire-400 via-brand-emerald-400 to-emerald-300 bg-clip-text text-transparent">
                on Avalanche
              </span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-xl md:text-2xl mb-12 text-slate-300 leading-relaxed font-light">
              DPO2U turns regulation into on-chain seals any smart contract can check.
              <span className="text-brand-emerald-400 font-medium"> Institutions, banks and crypto asset providers prove compliance with zero-knowledge proofs</span>,
              without exposing their data.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button
                variant="primary"
                size="xl"
                className="bg-brand-sapphire-600 hover:bg-brand-sapphire-500 text-white font-bold px-12"
                onClick={() => document.getElementById('live')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Fingerprint className="h-5 w-5 mr-2" />
                See it on-chain
              </Button>
              <Button
                variant="outline"
                size="xl"
                className="border-2 border-brand-sapphire-400/30 text-brand-sapphire-200 hover:bg-brand-sapphire-500/10 hover:text-white backdrop-blur-md bg-brand-sapphire-900/20 font-bold px-12"
                onClick={() => window.open(REPO, '_blank')}
              >
                <Code className="h-5 w-5 mr-2" />
                View on GitHub
              </Button>
            </motion.div>

            <motion.div variants={fadeInUp} className="mt-12 flex flex-wrap justify-center gap-6 text-sm">
              {[
                { label: '7 contracts verified on Snowtrace', color: 'text-emerald-400' },
                { label: 'Real SP1 Groth16 proof on-chain', color: 'text-brand-sapphire-400' },
                { label: 'Open source (MIT)', color: 'text-purple-400' },
                { label: '122 tests', color: 'text-amber-400' },
              ].map(b => (
                <div key={b.label} className="flex items-center gap-2 text-slate-400">
                  <Check className={`h-4 w-4 ${b.color}`} />
                  <span>{b.label}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </AnimatedSection>

      {/* Problem */}
      <AnimatedSection id="problem" className="py-24 bg-slate-900 border-b border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 text-white">The problem</h2>
            <p className="text-lg text-slate-400 max-w-3xl mx-auto">
              Brazil's Central Bank rules for virtual asset providers (BCB Resolutions 519, 520 and 521), the Travel Rule and the LGPD
              force every institution to check its counterparties. Today that means PDFs, questionnaires and trust. Nothing a smart contract can read.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Scale, title: 'Regulation is manual', desc: 'Each partner audits every other partner, again and again, with no shared and verifiable record.', bg: 'bg-brand-sapphire-500/20', text: 'text-brand-sapphire-400' },
              { icon: Fingerprint, title: 'Privacy blocks transparency', desc: 'Institutions cannot publish client data or balances to prove they comply.', bg: 'bg-purple-500/20', text: 'text-purple-400' },
              { icon: Landmark, title: 'Contracts cannot see compliance', desc: 'Settlement contracts have no way to refuse a counterparty that is not compliant.', bg: 'bg-emerald-500/20', text: 'text-emerald-400' },
            ].map(({ icon: Icon, title, desc, bg, text }) => (
              <motion.div key={title} variants={fadeInUp} className="bg-slate-800/50 rounded-xl p-8 border border-slate-700 hover:border-slate-600 transition-colors">
                <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center mb-6`}>
                  <Icon className={`h-6 w-6 ${text}`} />
                </div>
                <h3 className="text-xl font-serif font-bold text-white mb-3">{title}</h3>
                <p className="text-slate-400 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* How it works */}
      <AnimatedSection id="how" className="py-24 bg-slate-950 border-b border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 text-white">
              How it <span className="text-brand-emerald-400">works</span>
            </h2>
            <p className="text-lg text-slate-400 max-w-3xl mx-auto">
              One flow, from a regulatory rule pack to a contract that refuses non-compliant counterparties.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { n: '01', title: 'Evaluate', desc: 'The DPO2U gateway runs versioned rule packs (PSAV partner, safeguard, Travel Rule) over the evidence. The pack hash goes on-chain.' },
              { n: '02', title: 'Prove', desc: 'An SP1 zero-knowledge proof shows the result (score ≥ threshold, reserves ≥ liabilities) without revealing inputs.' },
              { n: '03', title: 'Seal', desc: 'The C-Chain verifies the Groth16 proof and writes a seal with origin, pack version and mandatory expiry.' },
              { n: '04', title: 'Enforce', desc: 'Any contract asks the PassportOracle or the TravelRuleGate before it settles. No valid passport, no transfer.' },
            ].map(s => (
              <motion.div key={s.n} variants={fadeInUp} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <div className="text-xs font-mono text-brand-sapphire-400 mb-3">{s.n}</div>
                <h3 className="text-lg font-serif font-bold text-white mb-2">{s.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
          <motion.div variants={fadeInUp} className="mt-8 bg-slate-800/50 rounded-xl p-6 border border-emerald-500/20 flex items-start gap-4">
            <ShieldCheck className="h-6 w-6 text-emerald-400 shrink-0 mt-0.5" />
            <p className="text-slate-300 text-sm leading-relaxed">
              <strong className="text-white">Invariants:</strong> REVIEW and FAIL are never valid, every seal expires, a seal is written once,
              and verifier keys are immutable. Without a real proof or signer the system records REVIEW instead of faking a PASS.
            </p>
          </motion.div>
        </div>
      </AnimatedSection>

      {/* Live on Fuji */}
      <AnimatedSection id="live" className="py-24 bg-slate-900 border-b border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-emerald-500/10 rounded-full border border-emerald-500/30 mb-6">
              <span className="text-sm font-semibold text-emerald-300">Avalanche Fuji · chain 43113</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 text-white">Live on Fuji today</h2>
            <p className="text-lg text-slate-400 max-w-3xl mx-auto">Every contract is verified on Snowtrace. Click any row to inspect it.</p>
          </div>
          <div className="max-w-5xl mx-auto grid gap-3">
            {contracts.map(c => (
              <motion.a
                key={c.address}
                variants={fadeInUp}
                href={`${SNOWTRACE}/address/${c.address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-800/50 rounded-xl p-5 border border-slate-700 hover:border-brand-sapphire-500/50 transition-colors flex flex-col md:flex-row md:items-center gap-2 md:gap-6"
              >
                <div className="md:w-72 shrink-0 flex items-center gap-2 font-semibold text-white">
                  <BadgeCheck className="h-5 w-5 text-emerald-400 shrink-0" /> {c.name}
                </div>
                <div className="flex-1 text-slate-400 text-sm">{c.what}</div>
                <div className="font-mono text-sm text-brand-sapphire-300 flex items-center gap-1">{short(c.address)} <ExternalLink className="h-3.5 w-3.5" /></div>
              </motion.a>
            ))}
          </div>

          <h3 className="text-2xl font-serif font-bold text-white text-center mt-16 mb-8">Proof it works</h3>
          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
            {proofs.map(p => (
              <motion.a
                key={p.tx}
                variants={fadeInUp}
                href={`${SNOWTRACE}/tx/${p.tx}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-br from-brand-sapphire-900/40 to-slate-800/50 rounded-xl p-6 border border-brand-sapphire-500/20 hover:border-brand-sapphire-500/50 transition-colors"
              >
                <div className="font-semibold text-white mb-3">{p.label}</div>
                <div className="font-mono text-xs text-brand-sapphire-300 flex items-center gap-1">tx {short(p.tx)} <ExternalLink className="h-3 w-3" /></div>
              </motion.a>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Roadmap */}
      <AnimatedSection id="roadmap" className="py-24 bg-slate-950 border-b border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 text-white">Roadmap</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { tag: 'Done', tagClass: 'text-emerald-300 border-emerald-500/30 bg-emerald-500/10', title: 'C-Chain core', items: ['SP1 verifier and compliance registry', 'ZK threshold attestor', 'PassportOracle, admin under a 2-of-3 Safe', 'Travel Rule gate', 'Solvency registry (SP1 proof of reserves)', 'Midnight → Avalanche relay'] },
              { tag: 'Next', tagClass: 'text-amber-300 border-amber-500/30 bg-amber-500/10', title: 'Real institutions', items: ['First PSAV seal with a real partner and a named reviewer', 'Solvency with real custody and ledger feeds', 'Legal source manifest on-chain', 'SDK and docs for integrators'] },
              { tag: 'Then', tagClass: 'text-brand-sapphire-200 border-brand-sapphire-500/30 bg-brand-sapphire-500/10', title: 'Compliance L1', items: ['Permissioned Avalanche L1 for institutions', 'Validator governance and allowlists', 'Passport mirrored across L1s via ICM / Teleporter', 'Native token design'] },
            ].map(col => (
              <motion.div key={col.title} variants={fadeInUp} className="bg-slate-800/50 rounded-xl p-8 border border-slate-700">
                <span className={`inline-block text-xs font-mono px-3 py-1 rounded-full border mb-4 ${col.tagClass}`}>{col.tag}</span>
                <h3 className="text-xl font-serif font-bold text-white mb-4">{col.title}</h3>
                <ul className="space-y-3 text-slate-400 text-sm">
                  {col.items.map(i => (
                    <li key={i} className="flex gap-3"><Check className="h-4 w-4 text-brand-emerald-400 shrink-0 mt-0.5" />{i}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Team / CTA */}
      <AnimatedSection className="py-24 bg-slate-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto bg-gradient-to-r from-brand-sapphire-900/40 to-emerald-900/30 rounded-2xl p-8 md:p-12 border border-brand-sapphire-500/20 grid md:grid-cols-2 gap-10 items-center">
            <motion.div variants={fadeInUp}>
              <div className="w-12 h-12 rounded-xl bg-brand-sapphire-500/20 flex items-center justify-center mb-6">
                <Network className="h-6 w-6 text-brand-sapphire-400" />
              </div>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-4">Built in Brazil, for Avalanche</h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                Led by Frederico Santana, DPO2U's Chief Compliance &amp; Innovation Officer and protocol architect, working where
                legal design meets smart contracts. Collaborator in the Team1 Brazil chapter.
              </p>
              <p className="text-slate-400 text-sm">
                The same compliance engine already anchors seals on Midnight, Solana and Stellar. Avalanche is its first full reference implementation.
              </p>
            </motion.div>
            <motion.div variants={fadeInUp} className="flex flex-col gap-4">
              {[
                { href: REPO, icon: Code, label: 'dpo2u-avalanche on GitHub', external: true },
                { href: 'mailto:contato@dpo2u.com.br', icon: Mail, label: 'contato@dpo2u.com.br', external: false },
                { href: '/midnight-protocol', icon: Shield, label: 'DPO2U ZK Compliance Protocol', external: false },
              ].map(l => (
                <a
                  key={l.label}
                  href={l.href}
                  {...(l.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="flex items-center justify-between gap-3 bg-slate-800/60 hover:bg-slate-800 border border-slate-700 hover:border-brand-sapphire-500/40 rounded-xl p-5 transition-colors"
                >
                  <span className="flex items-center gap-3 font-semibold text-white"><l.icon className="h-5 w-5 text-brand-sapphire-400" /> {l.label}</span>
                  <ArrowRight className="h-4 w-4 text-slate-400" />
                </a>
              ))}
            </motion.div>
          </div>
          <p className="text-center text-slate-500 text-sm mt-10">Testnet deployment on Avalanche Fuji. Not yet on mainnet.</p>
        </div>
      </AnimatedSection>

      <Footer />
    </div>
  );
}
