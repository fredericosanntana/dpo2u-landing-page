import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  Shield, Lock, ArrowRight, Check, Database,
  Brain, Fingerprint, Coins, FileText, Users, Eye, Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
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

export default function PrivateStackPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 overflow-x-hidden">
      <Header />

      {/* Hero */}
      <AnimatedSection className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-b from-slate-900 via-cyan-950/20 to-slate-900">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '4s' }}></div>
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '6s' }}></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full border border-cyan-400/30 mb-4 backdrop-blur-sm"
            >
              <span className="text-xs font-mono text-slate-400 mr-2">05</span>
              <Lock className="h-5 w-5 text-cyan-400 mr-3" />
              <span className="text-base font-semibold text-cyan-300">Private AI Stack</span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-4xl md:text-5xl lg:text-7xl font-serif font-bold mb-8 leading-tight text-white"
            >
              The Security Layer <br />
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                That Closes the Loop
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-xl md:text-2xl mb-12 text-slate-300 leading-relaxed font-light"
            >
              FHE + LEANN + on-chain security.
              <span className="text-cyan-400 font-medium"> The doughnuts economy</span> — where the outer boundary
              protects and the inner boundary empowers.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button
                variant="primary"
                size="xl"
                className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-12"
                onClick={() => window.location.href = 'mailto:contato@dpo2u.com.br'}
              >
                Get Started
              </Button>
              <Button
                variant="outline"
                size="xl"
                className="border-2 border-cyan-400/30 text-cyan-300 hover:bg-cyan-500/10 hover:text-cyan-200 backdrop-blur-md bg-cyan-900/20 font-bold px-12"
                onClick={() => window.location.href = '/analise'}
              >
                <Zap className="h-5 w-5 mr-2" />
                Free Diagnostic
              </Button>
            </motion.div>
          </div>
        </div>
      </AnimatedSection>

      {/* Doughnuts Economy — Full Explanation */}
      <AnimatedSection className="py-24 bg-slate-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 text-white">
              The <span className="text-cyan-400">Doughnuts Economy</span>
            </h2>
            <p className="text-lg text-slate-400 max-w-3xl mx-auto">
              Kate Raworth's Doughnut Economics applied to data privacy. A safe operating space
              for companies between technological boundaries and human rights.
            </p>
          </div>

          {/* Visual Doughnut */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="relative">
              {/* Outer Ring */}
              <div className="border-2 border-red-500/30 rounded-full p-8 bg-red-500/5">
                <div className="text-center mb-4">
                  <span className="text-xs font-bold text-red-400 uppercase tracking-widest">Outer Boundary — Technological Ceiling</span>
                </div>

                {/* Middle Ring (Safe Zone) */}
                <div className="border-2 border-emerald-500/30 rounded-full p-8 bg-emerald-500/5">
                  <div className="text-center mb-4">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Safe Zone — Compliant Companies</span>
                  </div>

                  {/* Inner Ring */}
                  <div className="border-2 border-blue-500/30 rounded-full p-6 bg-blue-500/5 text-center">
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Inner Boundary — Human Rights</span>
                    <p className="text-slate-400 text-sm mt-2">
                      LGPD Art. 16 erasure, data portability, transparency,
                      consent, non-discrimination
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Three Boundaries Explained */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <motion.div variants={fadeInUp}>
              <Card className="p-8 h-full bg-slate-800/50 border-red-500/30">
                <div className="w-14 h-14 bg-red-500/10 rounded-xl flex items-center justify-center mb-6">
                  <Shield className="h-7 w-7 text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-red-400 mb-3">Outer Boundary</h3>
                <p className="text-slate-400 leading-relaxed mb-4">
                  The technological ceiling that no one can breach.
                </p>
                <ul className="space-y-2">
                  {[
                    'On-chain immutability (Midnight Ledger)',
                    'Zero-knowledge proofs (Halo2)',
                    'Fully Homomorphic Encryption (FHE)',
                    'Content-addressable storage (IPFS CIDs)',
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start text-sm text-slate-400">
                      <Check className="h-4 w-4 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="p-8 h-full bg-slate-800/50 border-emerald-500/30 ring-2 ring-emerald-500/20">
                <div className="w-14 h-14 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-6">
                  <Check className="h-7 w-7 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-emerald-400 mb-3">Safe Zone</h3>
                <p className="text-slate-400 leading-relaxed mb-4">
                  Where companies thrive — compliant, protected, productive.
                </p>
                <ul className="space-y-2">
                  {[
                    'Automated LGPD/GDPR compliance',
                    'Verifiable on-chain attestations',
                    'Self-funding agent economics',
                    'Continuous AI-powered monitoring',
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start text-sm text-slate-400">
                      <Check className="h-4 w-4 text-emerald-400 mr-2 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="p-8 h-full bg-slate-800/50 border-blue-500/30">
                <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6">
                  <Users className="h-7 w-7 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-blue-400 mb-3">Inner Boundary</h3>
                <p className="text-slate-400 leading-relaxed mb-4">
                  The social foundation protecting data subjects' rights.
                </p>
                <ul className="space-y-2">
                  {[
                    'LGPD Article 16 — Right to erasure',
                    'Data portability & access rights',
                    'Transparency & clear consent',
                    'Non-discrimination in processing',
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start text-sm text-slate-400">
                      <Check className="h-4 w-4 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          </div>
        </div>
      </AnimatedSection>

      {/* FHE Section */}
      <AnimatedSection className="py-24 bg-slate-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <div>
              <div className="inline-flex items-center px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full mb-6">
                <span className="text-xs font-bold text-cyan-300 uppercase tracking-widest">Fully Homomorphic Encryption</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 text-white">
                Compute on <span className="text-cyan-400">Encrypted Data</span>
              </h2>
              <p className="text-lg text-slate-300 mb-8">
                FHE allows DPO2U to perform compliance analytics, risk assessments, and
                audit scoring on encrypted data — without ever decrypting it.
              </p>
              <ul className="space-y-4">
                {[
                  'Run compliance checks on encrypted company data',
                  'Generate risk scores without accessing raw PII',
                  'Encrypted reporting via MCP encryptedreporting tool',
                  'Powered by OpenFHE library (open-source)',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start text-slate-400">
                    <Lock className="h-5 w-5 text-cyan-400 mr-3 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shadow-2xl">
              <div className="flex items-center px-4 py-2 bg-slate-800 border-b border-slate-700">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <span className="ml-4 text-xs text-slate-500 font-mono">fhe-compliance.ts</span>
              </div>
              <div className="p-6 overflow-x-auto">
                <pre className="text-xs md:text-sm font-mono text-cyan-400 pointer-events-none select-none">
{`// FHE Compliance Check — compute on encrypted data
import { OpenFHE } from '@dpo2u/fhe-engine';

const fhe = new OpenFHE({ schemeType: 'CKKS' });

// Encrypt company data (never leaves client)
const encryptedData = fhe.encrypt(companyData);

// Run compliance scoring on encrypted values
const encryptedScore = fhe.evaluate(
  complianceCircuit,
  encryptedData
);

// Only the client can decrypt the result
const score = fhe.decrypt(encryptedScore);
// → { overall: 87, controls: 32, passed: 28 }

// Score ready for ZK proof (Product 03)
await postToMidnight(score.overall);`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* LEANN Section */}
      <AnimatedSection className="py-24 bg-slate-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <div className="order-2 lg:order-1">
              <Card className="bg-slate-800 border-slate-700 p-8">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                  <Database className="h-6 w-6 text-cyan-400 mr-3" />
                  LEANN Search Example
                </h3>
                <div className="space-y-4 font-mono text-sm">
                  <div className="bg-slate-900 p-3 rounded">
                    <span className="text-slate-500">query:</span>
                    <span className="text-cyan-400"> "LGPD compliance data retention"</span>
                  </div>
                  <div className="bg-slate-900 p-3 rounded">
                    <span className="text-slate-500">model:</span>
                    <span className="text-emerald-400"> all-MiniLM-L6-v2 (384 dims)</span>
                  </div>
                  <div className="bg-slate-900 p-3 rounded">
                    <span className="text-slate-500">backend:</span>
                    <span className="text-purple-400"> HNSW (compact + recompute)</span>
                  </div>
                  <div className="bg-slate-900 p-3 rounded">
                    <span className="text-slate-500">results:</span>
                    <span className="text-amber-400"> 5 relevant documents in 12ms</span>
                  </div>
                </div>
              </Card>
            </div>

            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full mb-6">
                <span className="text-xs font-bold text-cyan-300 uppercase tracking-widest">Semantic Search</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 text-white">
                LEANN <span className="text-cyan-400">Knowledge Base</span>
              </h2>
              <p className="text-lg text-slate-300 mb-8">
                Semantic search over encrypted knowledge base. LEANN indexes compliance documents,
                regulations, and case law for instant retrieval by AI agents.
              </p>
              <ul className="space-y-4">
                {[
                  '2,078+ documents indexed and searchable',
                  'Sub-millisecond vector similarity search',
                  'Sentence-transformers for semantic understanding',
                  'Privacy-preserving: data stays on your infrastructure',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start text-slate-400">
                    <Database className="h-5 w-5 text-cyan-400 mr-3 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Full Architecture — All 5 Products */}
      <AnimatedSection className="py-24 bg-slate-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 text-white">
              The <span className="text-cyan-400">Complete</span> Stack
            </h2>
            <p className="text-lg text-slate-400 max-w-3xl mx-auto">
              Product 05 closes the loop. All 5 products work as one integrated, self-funding,
              privacy-preserving compliance system.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            {/* Full pipeline */}
            <div className="grid md:grid-cols-5 gap-4 mb-12">
              {[
                { num: '01', name: 'Compliance Engine', icon: FileText, href: '/compliance-automate', hoverBorder: 'hover:border-emerald-500/50', ringClass: '', bgClass: 'bg-emerald-500/20', textClass: 'text-emerald-400' },
                { num: '02', name: 'AI Brain', icon: Brain, href: '/mcp-brain', hoverBorder: 'hover:border-blue-500/50', ringClass: '', bgClass: 'bg-blue-500/20', textClass: 'text-blue-400' },
                { num: '03', name: 'ZK Protocol', icon: Fingerprint, href: '/midnight-protocol', hoverBorder: 'hover:border-purple-500/50', ringClass: '', bgClass: 'bg-purple-500/20', textClass: 'text-purple-400' },
                { num: '04', name: 'Self-Funding', icon: Coins, href: '/self-funding-agent', hoverBorder: 'hover:border-amber-500/50', ringClass: '', bgClass: 'bg-amber-500/20', textClass: 'text-amber-400' },
                { num: '05', name: 'Private Stack', icon: Lock, href: '/private-stack', hoverBorder: 'hover:border-cyan-500/50', ringClass: 'ring-2 ring-cyan-500/30', bgClass: 'bg-cyan-500/20', textClass: 'text-cyan-400' },
              ].map((product, idx) => (
                <React.Fragment key={product.num}>
                  <a href={product.href} className="block group">
                    <Card className={`p-4 text-center h-full bg-slate-900 border-slate-800 ${product.hoverBorder} transition-all ${product.ringClass}`}>
                      <div className="text-xs font-mono text-slate-500 mb-2">{product.num}</div>
                      <div className={`w-10 h-10 mx-auto ${product.bgClass} rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                        <product.icon className={`h-5 w-5 ${product.textClass}`} />
                      </div>
                      <h3 className="text-xs font-bold text-white">{product.name}</h3>
                    </Card>
                  </a>
                </React.Fragment>
              ))}
            </div>

            {/* How 05 closes the loop */}
            <Card className="bg-slate-900 border-cyan-500/20 p-8">
              <h3 className="text-xl font-bold text-cyan-400 mb-4 text-center">How Product 05 Closes the Doughnut</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-bold text-white mb-3 flex items-center">
                    <Shield className="h-4 w-4 text-red-400 mr-2" />
                    Outer Boundary (Security)
                  </h4>
                  <ul className="space-y-2 text-sm text-slate-400">
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">→</span>
                      FHE ensures data is encrypted even during computation
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">→</span>
                      ZK proofs from Product 03 verify without revealing
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">→</span>
                      IPFS CIDs make documents tamper-proof
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">→</span>
                      Midnight Ledger provides immutable audit trail
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-3 flex items-center">
                    <Users className="h-4 w-4 text-blue-400 mr-2" />
                    Inner Boundary (Rights)
                  </h4>
                  <ul className="space-y-2 text-sm text-slate-400">
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">→</span>
                      Product 01 generates LGPD-compliant policies
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">→</span>
                      Product 02 audits consent and data flows
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">→</span>
                      Data subject rights enforced by smart contracts
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">→</span>
                      LEANN enables privacy-preserving knowledge retrieval
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </AnimatedSection>

      {/* CTA */}
      <AnimatedSection className="py-24 bg-gradient-to-r from-cyan-900/30 via-slate-900 to-purple-900/30 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-8">
            The Stack Is Complete
          </h2>
          <p className="text-lg text-slate-300 mb-12 max-w-2xl mx-auto">
            5 products, 1 mission: self-funding, privacy-preserving, on-chain compliance.
            Start with a free diagnostic or explore from Product 01.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              variant="primary"
              size="xl"
              className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-12"
              onClick={() => window.location.href = 'mailto:contato@dpo2u.com.br'}
            >
              Get Started
            </Button>
            <Button
              variant="outline"
              size="xl"
              className="border-2 border-white/20 text-white hover:bg-white/10"
              onClick={() => window.location.href = '/compliance-automate'}
            >
              <FileText className="mr-2 h-5 w-5" />
              Start from Product 01
            </Button>
          </div>
        </div>
      </AnimatedSection>

      <Footer />
    </div>
  );
}
