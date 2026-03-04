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
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 dark:text-white mb-6">
                Redefining the Cost of <span className="text-brand-sapphire-500">Trust</span>
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              <motion.div variants={fadeInUp}>
                <Card className="p-8 h-full border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center">
                    <FileText className="h-5 w-5 mr-3 text-slate-500" /> Traditional Compliance
                  </h3>
                  <ul className="space-y-4">
                    {[
                      'R$264K+/year for DPO, legal, and consultants',
                      'Static PDF reports that expire instantly',
                      'Exposes sensitive data during manual audits',
                      'Siloed inside the company, hard to prove externally',
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start text-sm text-slate-600 dark:text-slate-400">
                        <span className="text-slate-400 mr-3 mt-0.5">✕</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card className="p-8 h-full border-brand-emerald-200 dark:border-brand-emerald-900/30 bg-brand-emerald-50/30 dark:bg-brand-emerald-900/10 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Fingerprint className="h-24 w-24 text-brand-emerald-500" />
                  </div>
                  <h3 className="text-xl font-bold text-brand-emerald-600 dark:text-brand-emerald-400 mb-6 flex items-center">
                    <Shield className="h-5 w-5 mr-3" /> Protocol Compliance
                  </h3>
                  <ul className="space-y-4">
                    {[
                      'R$5K/year — Autonomous AI Agents do the heavy lifting',
                      'Cryptographic, on-chain Zero-Knowledge attestations',
                      'Proves compliance without ever exposing raw data',
                      'Self-funding mechanism: $NIGHT payments fuel $DUST gas',
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start text-sm text-slate-700 dark:text-slate-300">
                        <Check className="h-4 w-4 text-brand-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            </div>
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
