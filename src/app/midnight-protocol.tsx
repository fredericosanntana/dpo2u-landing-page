import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  Shield, Lock, Fingerprint, Check, ArrowRight,
  Eye, Network, Package, Code, BookOpen, ExternalLink, Brain, Coins
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CompactContractsShowcase from '@/components/midnight/CompactContractsShowcase';
import MidnightZKDemo from '@/components/midnight/MidnightZKDemo';
import BuildTimeline from '@/components/midnight/BuildTimeline';
import { fadeInUp, staggerContainer } from '@/lib/animations';

const AnimatedSection: React.FC<{
  children: React.ReactNode;
  className?: string;
  id?: string;
}> = ({ children, className = '', id }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  return (
    <motion.section
      ref={ref}
      id={id}
      initial="initial"
      animate={inView ? 'animate' : 'initial'}
      variants={staggerContainer}
      className={className}
    >
      {children}
    </motion.section>
  );
};

const sdkPackages = [
  '@midnight-ntwrk/compact-js',
  '@midnight-ntwrk/midnight-js-contracts',
  '@midnight-ntwrk/midnight-js-network-id',
  '@midnight-ntwrk/wallet-sdk-unshielded-wallet',
  '@midnight-ntwrk/wallet-sdk-facade',
  '@midnight-ntwrk/wallet-sdk-hd',
  '@midnight-ntwrk/ledger-v7',
  '@midnight-ntwrk/compact-runtime',
  '@midnight-ntwrk/midnight-js-types',
  '@midnight-ntwrk/midnight-js-logger',
  '@midnight-ntwrk/midnight-js-indexer',
  '@midnight-ntwrk/midnight-js-transaction',
  '@midnight-ntwrk/midnight-js-proving',
  '@midnight-ntwrk/midnight-js-crypto',
  '@midnight-ntwrk/midnight-js-wallet',
  '@midnight-ntwrk/midnight-js-balances',
  '@midnight-ntwrk/midnight-js-zswap',
  '@midnight-ntwrk/midnight-js-contract-api',
  '@midnight-ntwrk/midnight-js-deployment',
  '@midnight-ntwrk/midnight-js-node-api',
  '@midnight-ntwrk/midnight-js-proof-server',
  '@midnight-ntwrk/midnight-js-recipe',
  '@midnight-ntwrk/midnight-js-signing',
  '@midnight-ntwrk/midnight-js-submission',
  '@midnight-ntwrk/midnight-js-witness-ctx',
  '@midnight-ntwrk/midnight-js-indexer-api',
  '@midnight-ntwrk/midnight-js-fee-balancer',
];

export default function MidnightProtocolPage() {
  return (
    <div className="min-h-screen bg-brand-chrome-900 text-brand-platinum-100 overflow-x-hidden">
      <Header />

      {/* Hero */}
      <AnimatedSection className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-b from-brand-chrome-900 via-purple-950/20 to-brand-chrome-900">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-brand-purple-500/15 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '4s' }}></div>
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-brand-sapphire-600/10 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '6s' }}></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-brand-purple-500/20 to-brand-sapphire-500/20 rounded-full border border-brand-purple-400/30 mb-4 backdrop-blur-sm"
            >
              <span className="text-xs font-mono text-brand-platinum-500 mr-2">03</span>
              <Fingerprint className="h-5 w-5 text-brand-purple-400 mr-3" />
              <span className="text-base font-semibold text-brand-purple-300">ZK Compliance Protocol</span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-4xl md:text-5xl lg:text-7xl font-serif font-bold mb-8 leading-tight text-white"
            >
              Proven, <br />
              <span className="bg-gradient-to-r from-brand-purple-400 via-brand-sapphire-400 to-brand-emerald-400 bg-clip-text text-transparent">
                Not Declared
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-xl md:text-2xl mb-12 text-brand-platinum-400 leading-relaxed font-light"
            >
              Zero-knowledge proofs on Midnight Network.
              <span className="text-brand-purple-400 font-medium"> Compliance becomes a cryptographic on-chain asset</span> —
              verifiable by anyone, readable by no one.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button
                variant="primary"
                size="xl"
                className="bg-brand-purple-600 hover:bg-brand-purple-500 text-white font-bold px-12"
                onClick={() => document.getElementById('zk-demo')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Fingerprint className="h-5 w-5 mr-2" />
                Try ZK Demo
              </Button>
              <Button
                variant="outline"
                size="xl"
                className="border-2 border-brand-purple-400/30 text-brand-purple-300 hover:bg-brand-purple-500/10 hover:text-brand-purple-200 backdrop-blur-md bg-brand-purple-900/20 font-bold px-12"
                onClick={() => window.open('https://github.com/fredericosanntana', '_blank')}
              >
                <Code className="h-5 w-5 mr-2" />
                View on GitHub
              </Button>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="mt-12 flex flex-wrap justify-center gap-6 text-sm"
            >
              {[
                { label: 'Phase 2 Complete', color: 'text-brand-emerald-400' },
                { label: '5 Compact Contracts', color: 'text-brand-purple-400' },
                { label: '2 SDK Bugs Fixed', color: 'text-amber-400' },
                { label: '27+ SDK Packages', color: 'text-brand-sapphire-400' },
              ].map((badge) => (
                <div key={badge.label} className="flex items-center gap-2 text-brand-platinum-500">
                  <Check className={`h-4 w-4 ${badge.color}`} />
                  <span>{badge.label}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </AnimatedSection>

      {/* Connection to Products 01/02 */}
      <AnimatedSection className="py-20 bg-brand-chrome-900 border-b border-brand-chrome-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 text-white">
              Inputs from <span className="text-brand-emerald-400">01</span> & <span className="text-brand-sapphire-400">02</span>,
              Economics via <span className="text-amber-400">04</span>
            </h2>
            <p className="text-lg text-brand-platinum-500 max-w-3xl mx-auto">
              The ZK Protocol receives compliance data from the Engine and Brain,
              posts proofs on-chain, and agents pay gas with $DUST.
            </p>
          </div>

          <div className="max-w-4xl mx-auto bg-brand-chrome-800/50 rounded-xl p-8 border border-brand-platinum-800">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center">
              {[
                { icon: Shield, label: 'Compliance Engine', sub: 'Docs & score', bgClass: 'bg-brand-emerald-500/10', borderClass: 'border-brand-emerald-500/20', textClass: 'text-brand-emerald-400' },
                { icon: Brain, label: 'AI Brain', sub: 'MCP tools', bgClass: 'bg-brand-sapphire-500/10', borderClass: 'border-brand-sapphire-500/20', textClass: 'text-brand-sapphire-400' },
                { icon: Fingerprint, label: 'ZK Protocol', sub: 'On-chain proof', bgClass: 'bg-brand-purple-500/20', borderClass: 'border-brand-purple-500/50', textClass: 'text-brand-purple-400', active: true },
                { icon: Coins, label: 'Self-Funding', sub: '$NIGHT/$DUST', bgClass: 'bg-amber-500/10', borderClass: 'border-amber-500/20', textClass: 'text-amber-400' },
              ].map((step, idx) => (
                <React.Fragment key={step.label}>
                  {idx > 0 && <ArrowRight className="h-5 w-5 text-brand-purple-500/50 hidden md:block flex-shrink-0" />}
                  <div className="flex flex-col items-center gap-2">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
                      step.active
                        ? `${step.bgClass} ${step.borderClass} ring-2 ring-brand-purple-500/30`
                        : `${step.bgClass} ${step.borderClass}`
                    }`}>
                      <step.icon className={`h-6 w-6 ${step.textClass}`} />
                    </div>
                    <span className={`text-sm font-medium ${step.active ? 'text-brand-purple-400' : 'text-brand-platinum-500'}`}>
                      {step.label}
                    </span>
                    <span className="text-xs text-brand-platinum-600">{step.sub}</span>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Why Midnight */}
      <AnimatedSection className="py-24 bg-brand-chrome-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 text-white">
              Why <span className="text-brand-purple-400">Midnight</span>?
            </h2>
            <p className="text-lg text-brand-platinum-500 max-w-3xl mx-auto">
              Midnight Network provides the cryptographic infrastructure
              that makes privacy compliance provable without exposing sensitive data.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Lock,
                title: 'Privacy by Default',
                description: 'Compact contracts store only hashes and ZK-verified scores. Sensitive data never touches the ledger — only proofs of compliance.',
                bgClass: 'bg-brand-purple-500/20',
                textClass: 'text-brand-purple-400',
              },
              {
                icon: Eye,
                title: 'Verifiable Attestations',
                description: 'Any party can verify a company\'s compliance status on-chain without accessing the underlying data. Trust through mathematics, not institutions.',
                bgClass: 'bg-brand-sapphire-500/20',
                textClass: 'text-brand-sapphire-400',
              },
              {
                icon: Fingerprint,
                title: 'Decentralized Identity',
                description: 'W3C-compliant DIDs (did:midnight:) bind AI agents to on-chain identities, creating accountable autonomous operators.',
                bgClass: 'bg-brand-emerald-500/20',
                textClass: 'text-brand-emerald-400',
              },
            ].map((item, idx) => (
              <motion.div key={idx} variants={fadeInUp}>
                <Card className="h-full p-8 bg-brand-chrome-800/50 border-brand-platinum-800 hover:border-brand-purple-500/30 transition-all">
                  <div className={`w-14 h-14 ${item.bgClass} rounded-xl flex items-center justify-center mb-6`}>
                    <item.icon className={`h-7 w-7 ${item.textClass}`} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-brand-platinum-500 leading-relaxed">{item.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Architecture Diagram */}
      <AnimatedSection className="py-24 bg-brand-chrome-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 text-white">
              Architecture <span className="text-brand-purple-400">Flow</span>
            </h2>
            <p className="text-lg text-brand-platinum-500 max-w-3xl mx-auto">
              From AI audit to public attestation — every step is private until proven.
            </p>
          </div>

          <div className="max-w-5xl mx-auto bg-brand-chrome-900 rounded-xl p-8 border border-brand-chrome-800">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center">
              {[
                { label: 'AI Agent Audit', icon: Brain, sublabel: 'MCP Server' },
                { label: 'Private Data', icon: Lock, sublabel: 'IPFS / Lighthouse' },
                { label: 'Compact Contract', icon: Code, sublabel: 'Compact 0.21.0' },
                { label: 'ZK Proof', icon: Fingerprint, sublabel: 'Halo2 Circuit' },
                { label: 'Midnight Ledger', icon: Network, sublabel: 'Preprod Network' },
                { label: 'Public Attestation', icon: Check, sublabel: 'Verifiable Score' },
              ].map((step, idx) => (
                <React.Fragment key={step.label}>
                  {idx > 0 && (
                    <>
                      <ArrowRight className="h-5 w-5 text-brand-purple-500/50 hidden md:block flex-shrink-0" />
                      <ArrowRight className="h-5 w-5 text-brand-purple-500/50 md:hidden rotate-90 flex-shrink-0" />
                    </>
                  )}
                  <div className="flex flex-col items-center gap-2 min-w-[100px]">
                    <div className="w-14 h-14 bg-brand-purple-500/10 rounded-xl flex items-center justify-center border border-brand-purple-500/20">
                      <step.icon className="h-6 w-6 text-brand-purple-400" />
                    </div>
                    <span className="text-sm font-medium text-white">{step.label}</span>
                    <span className="text-xs text-brand-platinum-600">{step.sublabel}</span>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Compact Contracts */}
      <AnimatedSection className="py-24 bg-brand-chrome-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 text-white">
              <span className="text-brand-purple-400">Compact</span> Contracts
            </h2>
            <p className="text-lg text-brand-platinum-500 max-w-3xl mx-auto">
              5 smart contracts written in Compact — Midnight's TypeScript-like DSL for
              privacy-preserving programs that generate ZK circuits automatically.
            </p>
          </div>

          <CompactContractsShowcase />
        </div>
      </AnimatedSection>

      {/* SDK Integration */}
      <AnimatedSection className="py-24 bg-brand-chrome-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 text-white">
              SDK <span className="text-brand-purple-400">Integration</span>
            </h2>
            <p className="text-lg text-brand-platinum-500 max-w-3xl mx-auto">
              27+ @midnight-ntwrk packages integrated, with 2 critical bugs discovered and fixed during development.
            </p>
          </div>

          {/* Bug Fix Callouts */}
          <div className="grid md:grid-cols-2 gap-6 mb-12 max-w-4xl mx-auto">
            <motion.div variants={fadeInUp}>
              <Card className="p-6 bg-amber-500/5 border-amber-500/20">
                <div className="flex items-center gap-2 mb-3">
                  <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Bug Fix #1</Badge>
                </div>
                <h3 className="font-bold text-white mb-2 text-sm">Failed to clone intent</h3>
                <p className="text-brand-platinum-500 text-xs mb-3">
                  wallet-sdk signRecipe hardcodes 'pre-proof' marker but proved transactions use 'proof'.
                  Fixed by manually signing with correct markers.
                </p>
                <code className="text-xs text-amber-300/70 font-mono">@midnight-ntwrk/wallet-sdk-unshielded-wallet@1.0.0</code>
              </Card>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <Card className="p-6 bg-amber-500/5 border-amber-500/20">
                <div className="flex items-center gap-2 mb-3">
                  <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Bug Fix #2</Badge>
                </div>
                <h3 className="font-bold text-white mb-2 text-sm">Invalid network ID</h3>
                <p className="text-brand-platinum-500 text-xs mb-3">
                  Network module initializes with 'undeployed' but scripts never called setNetworkId.
                  Fixed by adding explicit initialization.
                </p>
                <code className="text-xs text-amber-300/70 font-mono">@midnight-ntwrk/midnight-js-network-id@3.1.0</code>
              </Card>
            </motion.div>
          </div>

          {/* Package Wall */}
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-wrap justify-center gap-2">
              {sdkPackages.map((pkg) => (
                <span
                  key={pkg}
                  className="inline-flex items-center px-3 py-1.5 bg-brand-purple-500/10 border border-brand-purple-500/20 rounded-lg text-xs font-mono text-brand-purple-300 hover:bg-brand-purple-500/20 transition-colors"
                >
                  <Package className="h-3 w-3 mr-1.5 text-brand-purple-400" />
                  {pkg.replace('@midnight-ntwrk/', '')}
                </span>
              ))}
            </div>
          </div>

          {/* Code Snippet */}
          <div className="max-w-3xl mx-auto mt-12">
            <div className="bg-brand-chrome-900 rounded-xl overflow-hidden border border-brand-chrome-800">
              <div className="flex items-center px-4 py-2 bg-brand-chrome-800 border-b border-brand-platinum-800">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-brand-emerald-500"></div>
                </div>
                <span className="ml-4 text-xs text-brand-platinum-600 font-mono">deploy-registry.ts</span>
              </div>
              <div className="p-6 overflow-x-auto">
                <pre className="text-xs md:text-sm font-mono text-brand-purple-300">
{`import { setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { createWalletAndMidnightProvider } from './lib/wallet-setup';

// Fix: explicit network initialization
setNetworkId('preprod');

const { wallet, midnightProvider } =
  await createWalletAndMidnightProvider();

// Deploy ComplianceRegistry contract
const contract = await deployContract(
  midnightProvider,
  complianceRegistryContract
);

console.log('Contract:', contract.address);
// → ec6860dd...976c3701`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* ZK Demo */}
      <AnimatedSection id="zk-demo" className="py-24 bg-brand-chrome-900 border-t border-b border-brand-purple-500/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">
              Interactive <span className="text-brand-purple-400">ZK Proof</span> Demo
            </h2>
            <p className="text-lg text-brand-platinum-500 max-w-3xl mx-auto">
              Experience the full flow: AI audit → compile circuit → generate proof → submit to Midnight → verify on-chain.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <MidnightZKDemo />
          </div>
        </div>
      </AnimatedSection>

      {/* Roadmap */}
      <AnimatedSection className="py-24 bg-brand-chrome-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 text-white">
              Build <span className="text-brand-purple-400">Timeline</span>
            </h2>
            <p className="text-lg text-brand-platinum-500 max-w-3xl mx-auto">
              A transparent roadmap from research to mainnet — built in public, one phase at a time.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <BuildTimeline />
          </div>
        </div>
      </AnimatedSection>

      {/* Tech Specs */}
      <AnimatedSection className="py-24 bg-brand-chrome-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 text-white">
              Technical <span className="text-brand-purple-400">Specifications</span>
            </h2>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="space-y-4">
              {[
                { label: 'Compact Compiler', value: '0.29.0' },
                { label: 'Compact Language', value: '0.21.0' },
                { label: '@midnight-ntwrk/compact-js', value: '2.4.0' },
                { label: '@midnight-ntwrk/midnight-js-contracts', value: '3.1.0' },
                { label: '@midnight-ntwrk/midnight-js-network-id', value: '3.1.0' },
                { label: '@midnight-ntwrk/wallet-sdk-unshielded-wallet', value: '1.0.0' },
                { label: '@midnight-ntwrk/wallet-sdk-facade', value: '1.0.0' },
                { label: '@midnight-ntwrk/ledger-v7', value: '7.0.0' },
                { label: '@midnight-ntwrk/compact-runtime', value: '0.14.0' },
                { label: 'Network', value: 'Midnight Preprod' },
                { label: 'Proof Server', value: 'midnightntwrk/proof-server:7.0.0 (Docker)' },
                { label: 'ZK Circuit', value: 'Halo2 (k=9, 305 rows)' },
              ].map((spec, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeInUp}
                  className="flex items-center justify-between py-3 border-b border-brand-chrome-800"
                >
                  <span className="text-brand-platinum-500 text-sm">{spec.label}</span>
                  <span className="text-brand-purple-400 font-mono font-semibold text-sm">{spec.value}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Whitepaper CTA */}
      <AnimatedSection className="py-24 bg-gradient-to-r from-brand-purple-900/30 via-brand-chrome-900 to-brand-sapphire-900/30 text-center">
        <div className="container mx-auto px-4">
          <motion.div variants={fadeInUp}>
            <BookOpen className="h-12 w-12 text-brand-purple-400 mx-auto mb-6" />
          </motion.div>
          <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
            Read the Whitepaper
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-lg text-brand-platinum-400 mb-4 max-w-2xl mx-auto">
            &ldquo;DPO2U: Compliance as Protocol&rdquo; — Version 1.1
          </motion.p>
          <motion.p variants={fadeInUp} className="text-brand-platinum-500 mb-8 max-w-2xl mx-auto">
            How MCP + IPFS + $NIGHT/$DUST + Midnight ZK-SNARKs transform privacy compliance
            from a reactive PDF-based model into a cryptographic on-chain asset.
          </motion.p>
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              variant="primary"
              size="xl"
              className="bg-brand-purple-600 hover:bg-brand-purple-500 text-white font-bold px-12"
              onClick={() => window.open('mailto:contato@dpo2u.com.br?subject=Whitepaper%20Request', '_blank')}
            >
              <BookOpen className="h-5 w-5 mr-2" />
              Request Whitepaper
            </Button>
            <Button
              variant="outline"
              size="xl"
              className="border-2 border-brand-purple-400/30 text-brand-purple-300 hover:bg-brand-purple-500/10"
              onClick={() => window.location.href = '/self-funding-agent'}
            >
              <Coins className="h-5 w-5 mr-2" />
              Next: Self-Funding Agents
            </Button>
          </motion.div>
        </div>
      </AnimatedSection>

      <Footer />
    </div>
  );
}
