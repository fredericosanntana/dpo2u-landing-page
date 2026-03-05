import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  Shield, Brain, Zap, ArrowRight, Check, Fingerprint,
  Coins, FileText, Database, Users, Star, Network, Layers
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { trackCTA } from '@/lib/analytics';
import { Card } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import LiveSystemStatusDashboard from '@/components/enhanced/LiveSystemStatusDashboard';
import ROICalculator from '@/components/enhanced/ROICalculator';
import TechnicalArchitectureDashboard from '@/components/enhanced/TechnicalArchitectureDashboard';
import IntegrationCapabilities from '@/components/enhanced/IntegrationCapabilities';
import FAQSection from '@/components/FAQSection';

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

const colorMap: Record<string, { borderL: string; bg: string; text: string }> = {
  emerald: { borderL: 'border-l-emerald-500', bg: 'bg-emerald-500/10', text: 'text-emerald-500' },
  blue: { borderL: 'border-l-blue-500', bg: 'bg-blue-500/10', text: 'text-blue-500' },
  purple: { borderL: 'border-l-purple-500', bg: 'bg-purple-500/10', text: 'text-purple-500' },
  amber: { borderL: 'border-l-amber-500', bg: 'bg-amber-500/10', text: 'text-amber-500' },
};

const architectureLayers = [
  {
    num: 'L1',
    name: 'Application Layer',
    tagline: 'Client Interface & Tools',
    description: 'The touchpoint for businesses. The LGPD Kit Generator creates structured JSON policies, while the MCP Server exposes compliance logic to AI agents via securely verifiable tools.',
    icon: Layers,
    href: '/mcp-brain',
    color: 'emerald',
  },
  {
    num: 'L2',
    name: 'Agent Layer',
    tagline: 'Autonomous Operators',
    description: 'Expert Agents map business models to GDPR/LGPD requirements. Auditor Agents verify evidence against standardized schemas. Monitor Agents ensure continuous compliance 24/7.',
    icon: Network,
    href: '/self-funding-agent',
    color: 'blue',
  },
  {
    num: 'L3',
    name: 'Storage Layer',
    tagline: 'Immutable Records',
    description: 'Documents and policies are pinned to IPFS via Lighthouse. No sensitive user data is stored, only structural schemas, public policies, and proofs, accessible via permanent CIDs.',
    icon: Database,
    href: '/private-stack',
    color: 'purple',
  },
  {
    num: 'L4',
    name: 'Midnight Layer',
    tagline: 'Cryptographic Security & ZK Proofs',
    description: 'The trust engine. Smart contracts written in Compact record zero-knowledge attestations. Ensures privacy-first verification where proofs are public but underlying data remains private.',
    icon: Fingerprint,
    href: '/midnight-protocol',
    color: 'amber',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />

      {/* ============================================= */}
      {/* 1. HERO — Cleaned Up for Midnight Ecosystem   */}
      {/* ============================================= */}
      <AnimatedSection className="relative min-h-screen flex items-center overflow-hidden bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <motion.div
                variants={fadeInUp}
                className="inline-flex items-center px-4 py-2 bg-slate-100 dark:bg-slate-800/80 rounded-full border border-slate-200 dark:border-slate-700/50 mb-8"
              >
                <Fingerprint className="h-4 w-4 text-primary mr-2" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Powered by Midnight Network</span>
              </motion.div>

              <h1 className="sr-only">DPO2U — Compliance as a Protocol</h1>

              <motion.h2
                variants={fadeInUp}
                className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 leading-tight"
              >
                <span className="text-brand-text-dark dark:text-white">
                  Compliance as a Protocol.
                </span>
                <br />
                <span className="bg-gradient-to-r from-brand-emerald-400 to-brand-sapphire-400 bg-clip-text text-transparent text-3xl md:text-4xl lg:text-5xl">
                  Built for the Web3 Era.
                </span>
              </motion.h2>

              <motion.p
                variants={fadeInUp}
                className="text-lg md:text-xl mb-10 text-slate-600 dark:text-slate-400 leading-relaxed font-light"
              >
                DPO2U fuses <span className="text-brand-sapphire-600 dark:text-brand-sapphire-400 font-medium">Zero-Knowledge Proofs</span>,{' '}
                <span className="text-brand-emerald-600 dark:text-brand-emerald-400 font-medium">Autonomous Agents</span>, and{' '}
                <span className="text-amber-600 dark:text-amber-400 font-medium">Self-Funding Tokenomics</span> to transform LGPD/GDPR compliance into an on-chain, privacy-preserving asset.
              </motion.p>

              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4">
                <Button
                  variant="primary"
                  size="xl"
                  className="bg-brand-sapphire-600 hover:bg-brand-sapphire-700 text-white font-bold text-lg px-8 py-6 rounded-xl transition-all shadow-md hover:shadow-lg"
                  onClick={() => {
                    trackCTA('explore_architecture', 'hero');
                    document.getElementById('architecture')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Explore Architecture
                </Button>
                <Button
                  variant="outline"
                  size="xl"
                  className="border-2 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-lg px-8 py-6 rounded-xl transition-all"
                  onClick={() => {
                    trackCTA('get_in_touch', 'hero');
                    window.location.href = 'mailto:contato@dpo2u.com.br';
                  }}
                >
                  Contact Ecosystem Team
                </Button>
              </motion.div>

              <motion.p variants={fadeInUp} className="mt-8 text-sm text-slate-500 font-light flex items-center">
                <Star className="h-4 w-4 mr-2 text-amber-500" />
                Live on Midnight Testnet &middot; ZK-SNARKs &middot; MCP Server Protocol
              </motion.p>

              {/* Web2 → DPO2U → Midnight Diagram */}
              <motion.div
                variants={fadeInUp}
                className="mt-10 p-5 bg-slate-900 dark:bg-slate-950 rounded-xl border border-slate-700/50 overflow-hidden"
              >
                <p className="text-xs font-mono text-slate-500 mb-3 uppercase tracking-widest">Protocol Bridge</p>
                <svg viewBox="0 0 800 160" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto max-w-xl">
                  <defs>
                    <pattern id="grid-hero" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(26,58,255,0.08)" strokeWidth="0.5"/>
                    </pattern>
                    <marker id="arrow-hero" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                      <polygon points="0 0, 10 3, 0 6" fill="#1A3AFF" />
                    </marker>
                  </defs>
                  <rect width="800" height="160" fill="url(#grid-hero)" />
                  {/* Web2 */}
                  <rect x="20" y="30" width="180" height="100" fill="none" stroke="#FF6B6B" strokeWidth="1.5" rx="4"/>
                  <text x="110" y="55" textAnchor="middle" fill="#FF6B6B" fontFamily="monospace" fontSize="11" fontWeight="600">WEB2</text>
                  <text x="110" y="75" textAnchor="middle" fill="#6B7280" fontFamily="sans-serif" fontSize="9">WhatsApp · APIs</text>
                  <text x="110" y="90" textAnchor="middle" fill="#6B7280" fontFamily="sans-serif" fontSize="9">Databases · Systems</text>
                  <text x="110" y="110" textAnchor="middle" fill="#6B7280" fontFamily="sans-serif" fontSize="9">Centralized</text>
                  {/* Arrow 1 */}
                  <line x1="210" y1="80" x2="278" y2="80" stroke="#1A3AFF" strokeWidth="1.5" markerEnd="url(#arrow-hero)"/>
                  {/* DPO2U */}
                  <rect x="290" y="30" width="180" height="100" fill="none" stroke="#00C9B1" strokeWidth="2" rx="4"/>
                  <text x="380" y="55" textAnchor="middle" fill="#00C9B1" fontFamily="monospace" fontSize="11" fontWeight="600">DPO2U</text>
                  <text x="380" y="75" textAnchor="middle" fill="#9CA3AF" fontFamily="sans-serif" fontSize="9">ZK Compliance</text>
                  <text x="380" y="90" textAnchor="middle" fill="#9CA3AF" fontFamily="sans-serif" fontSize="9">Consent Registry</text>
                  <text x="380" y="110" textAnchor="middle" fill="#9CA3AF" fontFamily="sans-serif" fontSize="9">Verifiable Creds</text>
                  <circle cx="380" cy="80" r="45" fill="none" stroke="#00C9B1" strokeWidth="0.8" opacity="0.25">
                    <animate attributeName="r" from="30" to="60" dur="2.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from="0.6" to="0" dur="2.5s" repeatCount="indefinite" />
                  </circle>
                  {/* Arrow 2 */}
                  <line x1="480" y1="80" x2="548" y2="80" stroke="#1A3AFF" strokeWidth="1.5" markerEnd="url(#arrow-hero)"/>
                  {/* Midnight */}
                  <rect x="560" y="30" width="180" height="100" fill="none" stroke="#1A3AFF" strokeWidth="1.5" rx="4"/>
                  <text x="650" y="55" textAnchor="middle" fill="#6366F1" fontFamily="monospace" fontSize="11" fontWeight="600">MIDNIGHT</text>
                  <text x="650" y="75" textAnchor="middle" fill="#9CA3AF" fontFamily="sans-serif" fontSize="9">Sealed Ledger</text>
                  <text x="650" y="90" textAnchor="middle" fill="#9CA3AF" fontFamily="sans-serif" fontSize="9">ZK Proofs</text>
                  <text x="650" y="110" textAnchor="middle" fill="#9CA3AF" fontFamily="sans-serif" fontSize="9">On-chain Audit</text>
                </svg>
              </motion.div>
            </div>

            <motion.div variants={fadeInUp} className="hidden lg:block relative">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/20 pointer-events-none rounded-3xl" />
              <LiveSystemStatusDashboard />
            </motion.div>
          </div>
        </div>
      </AnimatedSection>

      {/* ============================================= */}
      {/* 2. PROBLEM / SOLUTION                         */}
      {/* ============================================= */}
      <AnimatedSection className="py-20 bg-slate-50 dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <motion.div variants={fadeInUp} className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 dark:text-white mb-4">
                The Problem We <span className="text-brand-sapphire-500">Solve</span>
              </h2>
              <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                Web2 compliance is broken. Web3 privacy is incomplete. DPO2U bridges the gap.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 mb-10">
              <motion.div variants={fadeInUp}>
                <Card className="p-8 h-full border-red-100 dark:border-red-900/20 bg-white dark:bg-slate-900 shadow-sm">
                  <h3 className="text-xl font-bold text-red-500 dark:text-red-400 mb-6 flex items-center">
                    <FileText className="h-5 w-5 mr-3" /> Web2 Compliance is Broken
                  </h3>
                  <ul className="space-y-4">
                    {[
                      'Sensitive data transits through centralized servers with no cryptographic audit trail',
                      'LGPD consent records are paper-based or stored in mutable databases',
                      'Compliance officers cannot prove data was handled correctly without exposing the data itself',
                      'Healthcare, eldercare, and fintech operators face regulatory risk with no technical solution',
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start text-sm text-slate-600 dark:text-slate-400">
                        <ArrowRight className="h-4 w-4 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card className="p-8 h-full border-amber-100 dark:border-amber-900/20 bg-white dark:bg-slate-900 shadow-sm">
                  <h3 className="text-xl font-bold text-amber-500 dark:text-amber-400 mb-6 flex items-center">
                    <Zap className="h-5 w-5 mr-3" /> Web3 Privacy is Incomplete
                  </h3>
                  <ul className="space-y-4">
                    {[
                      'Most blockchains are transparent by default — incompatible with sensitive data regulation',
                      'ZK technology exists but is not mapped to legal compliance frameworks',
                      'Developers building on privacy chains lack compliance primitives',
                      'The gap between cryptographic privacy and legal privacy remains unbridged',
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start text-sm text-slate-600 dark:text-slate-400">
                        <ArrowRight className="h-4 w-4 text-amber-400 mr-3 mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            </div>

            {/* Bridge Statement */}
            <motion.div
              variants={fadeInUp}
              className="border-l-4 border-brand-emerald-500 bg-brand-emerald-50/60 dark:bg-brand-emerald-900/10 rounded-r-xl p-6"
            >
              <p className="text-slate-800 dark:text-slate-200 leading-relaxed">
                <strong className="text-brand-emerald-600 dark:text-brand-emerald-400">DPO2U maps LGPD Article 11, GDPR Article 25, and HIPAA technical safeguards directly to Midnight Network primitives</strong> — selective disclosure, sealed ledger fields, and ZK proof circuits.
              </p>
            </motion.div>
          </div>
        </div>
      </AnimatedSection>

      {/* ============================================= */}
      {/* 3. 4-LAYER MULTI-FACETED ARCHITECTURE         */}
      {/* ============================================= */}
      <AnimatedSection id="architecture" className="py-24 bg-white dark:bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 dark:text-white mb-6">
              The <span className="text-brand-sapphire-500">4-Layer</span> Ecosystem
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              DPO2U is not a SaaS. It is an infrastructure stack built on Midnight, where AI and cryptography converge to make compliance verifiable and self-sustaining.
            </p>
          </motion.div>

          <motion.div variants={staggerContainer} className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {architectureLayers.map((layer) => {
              const colors = colorMap[layer.color];
              return (
                <motion.div key={layer.num} variants={fadeInUp}>
                  <Card className={`p-8 h-full border-l-4 ${colors.borderL} bg-white dark:bg-slate-900/50 border-t border-r border-b border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all duration-300`}>
                    <div className="flex items-center justify-between mb-6">
                      <div className={`w-14 h-14 ${colors.bg} rounded-2xl flex items-center justify-center`}>
                        <layer.icon className={`h-7 w-7 ${colors.text}`} />
                      </div>
                      <span className="text-sm font-mono font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-4 py-1.5 rounded-full">
                        {layer.num}
                      </span>
                    </div>
                    <h3 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mb-2">
                      {layer.name}
                    </h3>
                    <p className={`text-sm font-semibold mb-4 ${colors.text}`}>
                      {layer.tagline}
                    </p>
                    <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed font-light">
                      {layer.description}
                    </p>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </AnimatedSection>

      {/* ============================================= */}
      {/* 4. TECHNICAL ARCHITECTURE DASHBOARD           */}
      {/* ============================================= */}
      <AnimatedSection className="py-20 bg-slate-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
              Protocol <span className="text-brand-sapphire-400">Telemetry</span>
            </h2>
            <p className="text-lg text-slate-400 max-w-3xl mx-auto">
              Live view of the ZK-Attestation pipeline across the network.
            </p>
          </motion.div>
          <motion.div variants={fadeInUp}>
            <TechnicalArchitectureDashboard />
          </motion.div>
        </div>
      </AnimatedSection>

      {/* ============================================= */}
      {/* 5. MINIMAL TOKEN ECONOMICS                    */}
      {/* ============================================= */}
      <AnimatedSection className="py-24 bg-slate-50 dark:bg-slate-900/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div variants={fadeInUp} className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 dark:text-white mb-6">
                Self-Funding <span className="text-amber-500">Economics</span>
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                A dual-token model engineered so the protocol pays for its own zero-knowledge computation and monitoring.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="grid md:grid-cols-2 gap-8">
              <Card className="p-8 bg-white dark:bg-slate-900 border border-amber-100 dark:border-amber-900/30 shadow-sm relative overflow-hidden">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-xl">
                    <Coins className="h-8 w-8 text-amber-500" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">$NIGHT</h3>
                    <p className="text-sm font-medium text-amber-600 dark:text-amber-500">Value & Fee Token</p>
                  </div>
                </div>
                <p className="text-base text-slate-600 dark:text-slate-400 mb-6 font-light leading-relaxed">
                  The primary native asset. Clients pay for automated compliance cycles in $NIGHT via the PaymentGateway compact contract.
                </p>
                <div className="flex justify-between items-center text-sm text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-4">
                  <span>Supply: 24B</span>
                  <span>Distributes 40/60 to Agents</span>
                </div>
              </Card>

              <Card className="p-8 bg-white dark:bg-slate-900 border border-purple-100 dark:border-purple-900/30 shadow-sm relative overflow-hidden">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                    <Zap className="h-8 w-8 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">tDUST</h3>
                    <p className="text-sm font-medium text-purple-600 dark:text-purple-500">Privacy Gas Token</p>
                  </div>
                </div>
                <p className="text-base text-slate-600 dark:text-slate-400 mb-6 font-light leading-relaxed">
                  Non-transferable execution token on Midnight. Agents swap $NIGHT to acquire tDUST to pay for ZK-circuit executions and state changes.
                </p>
                <div className="flex justify-between items-center text-sm text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-4">
                  <span>Use: ZK Attestations</span>
                  <span>Decays over time</span>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </AnimatedSection>

      {/* ============================================= */}
      {/* 5.5 LAUNCH dAPP CTA                           */}
      {/* ============================================= */}
      <AnimatedSection id="launch-dapp" className="py-24 bg-gradient-to-br from-slate-900 via-purple-950/30 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-[80px] animate-pulse" style={{ animationDuration: '5s' }} />
          <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-brand-sapphire-600/10 rounded-full blur-[80px] animate-pulse" style={{ animationDuration: '7s' }} />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-5xl mx-auto">
            <motion.div variants={fadeInUp} className="text-center mb-12">
              <div className="inline-flex items-center px-4 py-2 bg-purple-500/20 rounded-full border border-purple-400/30 mb-6">
                <Zap className="h-4 w-4 text-purple-400 mr-2" />
                <span className="text-sm font-semibold text-purple-300">Live on Midnight Testnet</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 text-white">
                Interact with the{' '}
                <span className="bg-gradient-to-r from-purple-400 to-brand-sapphire-400 bg-clip-text text-transparent">
                  DPO2U dApp
                </span>
              </h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                Connect your Lace Wallet, generate ZK compliance proofs, deploy Compact contracts
                and monitor on-chain activity — all in one interface built on the Midnight Network.
              </p>
            </motion.div>

            <motion.div variants={staggerContainer} className="grid md:grid-cols-4 gap-4 mb-10">
              {[
                { icon: Fingerprint, label: 'Lace Wallet', desc: 'Connect & sign transactions', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
                { icon: Shield, label: 'ZK Proofs', desc: 'Generate LGPD/GDPR proofs', color: 'text-brand-sapphire-400', bg: 'bg-brand-sapphire-500/10', border: 'border-brand-sapphire-500/20' },
                { icon: FileText, label: 'Contracts', desc: 'Deploy Compact smart contracts', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
                { icon: Database, label: 'Dashboard', desc: 'Monitor network activity', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
              ].map((item) => (
                <motion.div key={item.label} variants={fadeInUp}>
                  <Card className={`p-5 bg-slate-800/60 border ${item.border} hover:bg-slate-800/80 transition-all text-center`}>
                    <div className={`w-10 h-10 ${item.bg} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                      <item.icon className={`h-5 w-5 ${item.color}`} />
                    </div>
                    <p className="font-bold text-white text-sm mb-1">{item.label}</p>
                    <p className="text-xs text-slate-400">{item.desc}</p>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            <motion.div variants={fadeInUp} className="text-center">
              <a
                href="https://3000-i5aw88os18ia78kr3p8mn-e1dbdc82.us2.manus.computer"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-purple-600 to-brand-sapphire-600 text-white font-bold text-lg rounded-xl shadow-xl hover:shadow-purple-500/30 hover:scale-105 transition-all"
                onClick={() => trackCTA('launch_dapp', 'home_section')}
              >
                <Zap className="h-5 w-5" />
                Launch dApp
                <ArrowRight className="h-5 w-5" />
              </a>
              <p className="mt-4 text-sm text-slate-500">
                Compact Runtime 0.14.0+ · Midnight.js v3.0.0+ · Wallet SDK 1.0.0+
              </p>
            </motion.div>
          </div>
        </div>
      </AnimatedSection>

      {/* ============================================= */}
      {/* 5.6 ROOMIECARE — REAL-WORLD USE CASE           */}
      {/* ============================================= */}
      <AnimatedSection id="roomiecare" className="py-24 bg-white dark:bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <motion.div variants={fadeInUp} className="text-center mb-14">
              <div className="inline-flex items-center px-4 py-2 bg-teal-50 dark:bg-teal-900/20 rounded-full border border-teal-200 dark:border-teal-700/40 mb-6">
                <Users className="h-4 w-4 text-teal-600 dark:text-teal-400 mr-2" />
                <span className="text-sm font-semibold text-teal-700 dark:text-teal-300">Live Deployment</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 dark:text-white mb-4">
                Built and Tested on <span className="text-teal-600 dark:text-teal-400">RoomieCare</span>
              </h2>
              <p className="text-lg text-slate-500 dark:text-slate-400 max-w-3xl mx-auto">
                RoomieCare is a WhatsApp-native elderly care platform. It is the first real-world deployment of the DPO2U compliance bridge — where sensitive health data of elderly patients is protected by decentralized identities and zero-knowledge proofs on Midnight Network.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 mb-10">
              {[
                {
                  icon: Fingerprint,
                  title: 'DID per Patient',
                  desc: 'Each elderly patient has a sovereign digital identity. Their caregiver credentials, medication records, and care confirmations are stored as Verifiable Credentials — never on-chain, never on WhatsApp servers.',
                  color: 'text-teal-600 dark:text-teal-400',
                  bg: 'bg-teal-50 dark:bg-teal-900/20',
                  border: 'border-teal-100 dark:border-teal-800/30',
                },
                {
                  icon: Shield,
                  title: 'ZK Care Proofs',
                  desc: 'When a caregiver administers medication, a ZK proof is generated confirming the action occurred. The family receives confirmation. The regulator receives audit trail. The clinical data stays sealed.',
                  color: 'text-brand-sapphire-600 dark:text-brand-sapphire-400',
                  bg: 'bg-brand-sapphire-50 dark:bg-brand-sapphire-900/20',
                  border: 'border-brand-sapphire-100 dark:border-brand-sapphire-800/30',
                },
                {
                  icon: FileText,
                  title: 'LGPD Art. 18 Executable',
                  desc: 'Family can revoke data access in one command. The smart contract executes the right to erasure on-chain. No manual process. No compliance risk.',
                  color: 'text-brand-emerald-600 dark:text-brand-emerald-400',
                  bg: 'bg-brand-emerald-50 dark:bg-brand-emerald-900/20',
                  border: 'border-brand-emerald-100 dark:border-brand-emerald-800/30',
                },
              ].map((item) => (
                <motion.div key={item.title} variants={fadeInUp}>
                  <Card className={`p-6 h-full border ${item.border} bg-white dark:bg-slate-900 shadow-sm`}>
                    <div className={`w-10 h-10 ${item.bg} rounded-xl flex items-center justify-center mb-4`}>
                      <item.icon className={`h-5 w-5 ${item.color}`} />
                    </div>
                    <h4 className={`font-bold text-base mb-3 ${item.color}`}>{item.title}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                  </Card>
                </motion.div>
              ))}
            </div>

            <motion.div
              variants={fadeInUp}
              className="bg-slate-900 dark:bg-slate-950 rounded-xl p-6 border border-slate-700/50"
            >
              <p className="text-slate-300 leading-relaxed text-sm">
                <strong className="text-white">The Contrast is the Point:</strong> A WhatsApp message is human-readable and immediate. The on-chain proof is cryptographic and permanent. Together, they prove that sensitive data can be handled with both compliance and privacy.
              </p>
            </motion.div>
          </div>
        </div>
      </AnimatedSection>

      {/* ============================================= */}
      {/* 5.7 COMPLIANCE MAPPING TABLE                  */}
      {/* ============================================= */}
      <AnimatedSection id="compliance" className="py-24 bg-slate-50 dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <motion.div variants={fadeInUp} className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 dark:text-white mb-4">
                Compliance is Not a Feature.{' '}
                <span className="text-brand-sapphire-500">It is the Architecture.</span>
              </h2>
              <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                DPO2U maps legal requirements directly to cryptographic primitives. This is unique to DPO2U.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-900 dark:bg-slate-950 text-white">
                    <th className="px-5 py-4 text-left font-semibold rounded-tl-xl">Regulation</th>
                    <th className="px-5 py-4 text-left font-semibold">Requirement</th>
                    <th className="px-5 py-4 text-left font-semibold">Midnight Primitive</th>
                    <th className="px-5 py-4 text-left font-semibold rounded-tr-xl">DPO2U Implementation</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { reg: 'LGPD Art. 11', req: 'Sensitive data legal basis', prim: 'Sealed ledger + consent circuit', impl: 'On-chain consent registry' },
                    { reg: 'LGPD Art. 18', req: 'Right to erasure', prim: 'deactivateDID() circuit', impl: 'One-command revocation' },
                    { reg: 'GDPR Art. 25', req: 'Privacy by design', prim: 'Non-exported ledger fields', impl: 'Default sealed architecture' },
                    { reg: 'HIPAA § 164.312', req: 'Technical safeguards', prim: 'ZK proof generation', impl: 'Verifiable care execution' },
                    { reg: 'ANS RN 452', req: 'Healthcare audit trail', prim: 'Immutable on-chain proofs', impl: 'Regulator-ready exports' },
                  ].map((row, idx) => (
                    <tr
                      key={idx}
                      className={idx % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-slate-50 dark:bg-slate-800/50'}
                    >
                      <td className="px-5 py-4 font-mono font-semibold text-brand-sapphire-600 dark:text-brand-sapphire-400 border-b border-slate-100 dark:border-slate-800">{row.reg}</td>
                      <td className="px-5 py-4 text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-slate-800">{row.req}</td>
                      <td className="px-5 py-4 font-mono text-teal-600 dark:text-teal-400 border-b border-slate-100 dark:border-slate-800">{row.prim}</td>
                      <td className="px-5 py-4 text-slate-600 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">{row.impl}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </div>
        </div>
      </AnimatedSection>

      {/* ============================================= */}
      {/* 6. INTEGRATION & ROI                          */}
      {/* ============================================= */}
      <AnimatedSection className="py-20 bg-white dark:bg-background border-y border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <motion.div variants={fadeInUp} className="mb-8">
                <h2 className="text-3xl font-serif font-bold text-slate-900 dark:text-white mb-4">
                  Integration API
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Connect DPO2U with your existing infrastructure securely.
                </p>
              </motion.div>
              <IntegrationCapabilities />
            </div>
            <div>
              <motion.div variants={fadeInUp} className="mb-8">
                <h2 className="text-3xl font-serif font-bold text-slate-900 dark:text-white mb-4">
                  Cost Efficiency
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Calculate the direct ROI of protocol-based compliance.
                </p>
              </motion.div>
              <ROICalculator />
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* ============================================= */}
      {/* 7. FAQ                                        */}
      {/* ============================================= */}
      <AnimatedSection className="py-20 bg-slate-50 dark:bg-slate-900/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 dark:text-white mb-6">
              Developer <span className="text-brand-sapphire-500">FAQ</span>
            </h2>
          </motion.div>
          <motion.div variants={fadeInUp}>
            <FAQSection />
          </motion.div>
        </div>
      </AnimatedSection>

      {/* ============================================= */}
      {/* 8. CTA FINAL                                  */}
      {/* ============================================= */}
      <AnimatedSection className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.02]"></div>

        <div className="container mx-auto text-center relative z-10">
          <motion.div variants={fadeInUp} className="max-w-3xl mx-auto">
            <Shield className="h-12 w-12 text-brand-emerald-400 mx-auto mb-6" />
            <h2 className="text-4xl lg:text-5xl font-serif font-bold mb-6 text-white">
              Initialize Your Node
            </h2>
            <p className="text-xl mb-10 text-slate-400 font-light">
              Join the testnet and start generating ZK-attestations today.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button
                variant="primary"
                size="xl"
                className="bg-brand-emerald-600 hover:bg-brand-emerald-700 text-white font-bold px-10 py-6 rounded-xl transition-all shadow-md hover:shadow-lg"
                onClick={() => window.location.href = '/analise'}
              >
                Run Diagnostic
              </Button>
              <Button
                variant="outline"
                size="xl"
                className="border-2 border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white px-10 py-6 rounded-xl transition-all"
                onClick={() => window.location.href = '/midnight-protocol'}
              >
                Read Docs
              </Button>
            </div>
          </motion.div>
        </div>
      </AnimatedSection>

      <Footer />
    </div>
  );
}
