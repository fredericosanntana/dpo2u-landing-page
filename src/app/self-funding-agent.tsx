import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  Coins, Wallet, Shield, Zap, ArrowRight, Check,
  Lock, Fingerprint, Network, Loader2, Users, Brain
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

export default function SelfFundingAgentPage() {
  const [zkStatus, setZkStatus] = useState<'idle' | 'generating' | 'broadcasting' | 'verified'>('idle');
  const [zkData, setZkData] = useState<any>(null);

  const runZKSimulation = () => {
    setZkStatus('generating');
    setTimeout(() => {
      setZkStatus('broadcasting');
      setTimeout(() => {
        setZkData({
          compliant: true,
          score: 100,
          proofHash: '0xb65f4be9fd9b9aebb1c507b46d64ca823c4f642428788f6e2ba40da0a226790a',
          last_validated: new Date().toISOString(),
          cid: 'ipfs://QmTestScoreDoc12345',
        });
        setZkStatus('verified');
      }, 1800);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 overflow-x-hidden">
      <Header />

      {/* Hero Section */}
      <AnimatedSection className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-brand-sapphire-950">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '4s' }}></div>
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '6s' }}></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-500/20 to-purple-500/20 rounded-full border border-amber-400/30 mb-4 backdrop-blur-sm"
            >
              <span className="text-xs font-mono text-slate-400 mr-2">04</span>
              <Coins className="h-5 w-5 text-amber-400 mr-3" />
              <span className="text-base font-semibold text-amber-300">Self-Funding Agents</span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-4xl md:text-5xl lg:text-7xl font-serif font-bold mb-8 leading-tight text-white"
            >
              Compliance That <br />
              <span className="bg-gradient-to-r from-amber-400 via-yellow-400 to-purple-400 bg-clip-text text-transparent">
                Finances Itself
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-xl md:text-2xl mb-12 text-slate-300 leading-relaxed font-light"
            >
              Autonomous agents earning <span className="text-amber-400 font-medium">$NIGHT</span>,
              buying <span className="text-purple-400 font-medium">$DUST</span> for gas.
              PaymentGateway splits fees automatically — perpetual self-funding on Midnight Network.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button
                variant="primary"
                size="xl"
                className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-12"
                onClick={() => window.location.href = 'mailto:contato@dpo2u.com.br'}
              >
                Get in Touch
              </Button>
              <Button
                variant="outline"
                size="xl"
                className="border-2 border-amber-400/30 text-amber-300 hover:bg-amber-500/10 hover:text-amber-200 backdrop-blur-md bg-amber-900/20 font-bold px-12"
                onClick={() => window.location.href = '/private-stack'}
              >
                <Lock className="h-5 w-5 mr-2" />
                Next: Private Stack
              </Button>
            </motion.div>

            <motion.div variants={fadeInUp} className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-slate-400">
              {[
                'Midnight Network',
                '$NIGHT / $DUST Tokens',
                'ERC-8004 Standard',
                'DID-Based Wallets',
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400" />
                  {item}
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </AnimatedSection>

      {/* Token Model */}
      <AnimatedSection className="section-padding bg-slate-900 text-white">
        <div className="container mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 text-white">
              <span className="text-amber-400">$NIGHT</span> / <span className="text-purple-400">$DUST</span> Token Model
            </h2>
            <p className="text-lg text-slate-400 max-w-3xl mx-auto">
              A dual-token system on Midnight Network. $NIGHT for payments, $DUST for gas.
              Agents self-fund perpetually.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="bg-slate-800 border-amber-500/30 p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center">
                  <Coins className="h-8 w-8 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-amber-400">$NIGHT</h3>
                  <p className="text-slate-400 text-sm">Payment Token</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between py-2 border-b border-slate-700">
                  <span className="text-slate-400">Total Supply</span>
                  <span className="text-amber-400 font-mono font-bold">24,000,000,000</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-700">
                  <span className="text-slate-400">Type</span>
                  <span className="text-amber-400 font-mono">Transferable</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-700">
                  <span className="text-slate-400">Usage</span>
                  <span className="text-amber-400 font-mono">Service Payments</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-400">Network</span>
                  <span className="text-amber-400 font-mono">Midnight</span>
                </div>
              </div>
            </Card>

            <Card className="bg-slate-800 border-purple-500/30 p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <Zap className="h-8 w-8 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-purple-400">$DUST</h3>
                  <p className="text-slate-400 text-sm">Gas Token</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between py-2 border-b border-slate-700">
                  <span className="text-slate-400">Supply</span>
                  <span className="text-purple-400 font-mono font-bold">Dynamic (minted)</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-700">
                  <span className="text-slate-400">Type</span>
                  <span className="text-purple-400 font-mono">Non-Transferable</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-700">
                  <span className="text-slate-400">Usage</span>
                  <span className="text-purple-400 font-mono">On-Chain Gas</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-400">Behavior</span>
                  <span className="text-purple-400 font-mono">Decays Over Time</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </AnimatedSection>

      {/* PaymentGateway */}
      <AnimatedSection className="section-padding bg-slate-950">
        <div className="container mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">
              <span className="text-amber-400">PaymentGateway</span>.compact
            </h2>
            <p className="text-lg text-slate-400 max-w-3xl mx-auto">
              The Compact contract that distributes fees automatically.
              Clients pay in $NIGHT, the gateway splits to agents.
            </p>
          </div>

          {/* Flow Diagram */}
          <div className="max-w-4xl mx-auto bg-slate-900 rounded-xl p-8 border border-slate-800 mb-12">
            <h3 className="text-center text-xl font-bold mb-8 text-amber-400">Fee Distribution Flow</h3>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center">
              {[
                { icon: Users, label: 'Client', sub: 'Pays $NIGHT', bgClass: 'bg-blue-500/20', textClass: 'text-blue-400' },
                { icon: Network, label: 'PaymentGateway', sub: 'Compact contract', bgClass: 'bg-amber-500/20', textClass: 'text-amber-400' },
                { icon: Brain, label: 'Expert Agent', sub: '40% fee share', bgClass: 'bg-emerald-500/20', textClass: 'text-emerald-400' },
                { icon: Shield, label: 'Auditor Agent', sub: '60% fee share', bgClass: 'bg-purple-500/20', textClass: 'text-purple-400' },
              ].map((step, idx) => (
                <React.Fragment key={step.label}>
                  {idx > 0 && (
                    <>
                      <ArrowRight className="h-6 w-6 text-amber-500/50 hidden md:block flex-shrink-0" />
                      <ArrowRight className="h-6 w-6 text-amber-500/50 md:hidden rotate-90 flex-shrink-0" />
                    </>
                  )}
                  <div className="flex flex-col items-center gap-2">
                    <div className={`w-12 h-12 ${step.bgClass} rounded-full flex items-center justify-center`}>
                      <step.icon className={`h-6 w-6 ${step.textClass}`} />
                    </div>
                    <span className="text-sm text-white font-medium">{step.label}</span>
                    <span className="text-xs text-slate-500">{step.sub}</span>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Code Preview */}
          <div className="max-w-3xl mx-auto">
            <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shadow-2xl">
              <div className="flex items-center px-4 py-2 bg-slate-800 border-b border-slate-700">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <span className="ml-4 text-xs text-slate-500 font-mono">PaymentGateway.compact</span>
              </div>
              <div className="p-6 overflow-x-auto">
                <pre className="text-xs md:text-sm font-mono text-amber-400 pointer-events-none select-none">
{`// PaymentGateway.compact — Fee Distribution
contract PaymentGateway {
  // Split ratios (basis points)
  const EXPERT_SHARE: Uint = 4000;   // 40%
  const AUDITOR_SHARE: Uint = 6000;  // 60%

  // Process compliance payment
  transition processPayment(
    amount: Uint,
    expertDID: Bytes,
    auditorDID: Bytes
  ) {
    // Split $NIGHT to agents
    let expertFee = amount * EXPERT_SHARE / 10000;
    let auditorFee = amount - expertFee;

    transfer(expertDID, expertFee);
    transfer(auditorDID, auditorFee);

    // Agents use $NIGHT to buy $DUST for gas
    emit PaymentProcessed(amount, expertDID);
  }
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Agent Wallets */}
      <AnimatedSection className="section-padding bg-slate-900">
        <div className="container mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">
              Agent <span className="text-amber-400">Wallets</span> on Midnight
            </h2>
            <p className="text-lg text-slate-400 max-w-3xl mx-auto">
              Each AI agent has a DID-based wallet on Midnight with both shielded and unshielded addresses.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="bg-slate-800 border-slate-700 p-6">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                <Wallet className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="font-bold text-white mb-2">Unshielded Wallet</h3>
              <p className="text-slate-400 text-sm">Public balance for receiving $NIGHT payments and $DUST faucet tokens. Transparent for auditing.</p>
            </Card>

            <Card className="bg-slate-800 border-slate-700 p-6">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                <Lock className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="font-bold text-white mb-2">Shielded Wallet</h3>
              <p className="text-slate-400 text-sm">Private balance for sensitive operations. ZK proofs verify transactions without revealing amounts.</p>
            </Card>

            <Card className="bg-slate-800 border-slate-700 p-6">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center mb-4">
                <Fingerprint className="h-6 w-6 text-emerald-400" />
              </div>
              <h3 className="font-bold text-white mb-2">DID Identity</h3>
              <p className="text-slate-400 text-sm">W3C-compliant did:midnight: identity binding the agent to its on-chain actions with selective disclosure.</p>
            </Card>
          </div>
        </div>
      </AnimatedSection>

      {/* Self-Funding Loop */}
      <AnimatedSection className="section-padding bg-slate-950">
        <div className="container mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">
              Zero-Operation <span className="text-amber-400">Self-Funding</span>
            </h2>
            <p className="text-lg text-slate-400 max-w-3xl mx-auto">
              Once set up, agents fund themselves perpetually. No human intervention needed.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { step: '01', title: 'Client Pays', desc: 'Client sends $NIGHT for a compliance audit request.', icon: Users, bgClass: 'bg-blue-500/20', textClass: 'text-blue-400' },
              { step: '02', title: 'Gateway Splits', desc: 'PaymentGateway distributes 40/60 to Expert & Auditor agents.', icon: Network, bgClass: 'bg-amber-500/20', textClass: 'text-amber-400' },
              { step: '03', title: 'Buy $DUST', desc: 'Agents convert $NIGHT → $DUST for Midnight gas fees.', icon: Zap, bgClass: 'bg-purple-500/20', textClass: 'text-purple-400' },
              { step: '04', title: 'Execute On-Chain', desc: 'Agents post ZK proofs, update registries, issue attestations.', icon: Fingerprint, bgClass: 'bg-emerald-500/20', textClass: 'text-emerald-400' },
            ].map((item) => (
              <motion.div key={item.step} variants={fadeInUp}>
                <Card className="p-6 h-full bg-slate-900 border-slate-800 hover:border-amber-500/30 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-serif font-bold text-slate-700">{item.step}</span>
                    <div className={`w-10 h-10 ${item.bgClass} rounded-lg flex items-center justify-center`}>
                      <item.icon className={`h-5 w-5 ${item.textClass}`} />
                    </div>
                  </div>
                  <h3 className="font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-slate-400 text-sm">{item.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div variants={fadeInUp} className="text-center mt-8">
            <p className="text-slate-500 text-sm">
              Loop repeats indefinitely. Agents earn → buy gas → execute → earn more.
            </p>
          </motion.div>
        </div>
      </AnimatedSection>

      {/* ERC-8004 Standard */}
      <AnimatedSection className="section-padding bg-slate-900 border-t border-slate-800">
        <div className="container mx-auto container-padding">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 text-white">
                ERC-8004 <span className="text-amber-400">Standard</span>
              </h2>
              <p className="text-lg text-slate-300 mb-8">
                The governance framework defining how autonomous agents operate with
                financial autonomy. ERC-8004 specifies the interface for self-funding,
                self-governance, and auto-execution.
              </p>
              <div className="space-y-4">
                {[
                  { label: 'Self-Funding', desc: 'Agents generate income through service fees and reinvest in gas' },
                  { label: 'Self-Governance', desc: 'On-chain voting with weights based on agent participation' },
                  { label: 'Auto-Execution', desc: 'Operations triggered automatically when conditions are met' },
                  { label: 'Permission System', desc: 'Granular READ/WRITE/TREASURY/DEPLOY/GOVERNANCE bits' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-amber-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-white font-medium">{item.label}</span>
                      <p className="text-slate-400 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* $DUST Faucet / Proof Server */}
            <div className="space-y-6">
              <Card className="bg-slate-800 border-slate-700 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <Zap className="h-5 w-5 text-purple-400" />
                  </div>
                  <h3 className="font-bold text-white">$DUST Faucet</h3>
                </div>
                <p className="text-slate-400 text-sm mb-3">
                  Initial $DUST allocation for new agents via the Midnight testnet faucet.
                  After bootstrap, agents buy their own $DUST with earned $NIGHT.
                </p>
                <code className="text-xs text-purple-300/70 font-mono block bg-slate-900 p-2 rounded">
                  midnight faucet request --did did:midnight:agent_001
                </code>
              </Card>

              <Card className="bg-slate-800 border-slate-700 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                    <Shield className="h-5 w-5 text-emerald-400" />
                  </div>
                  <h3 className="font-bold text-white">Proof Server</h3>
                </div>
                <p className="text-slate-400 text-sm mb-3">
                  Docker-based proof server for generating Halo2 ZK proofs locally
                  before submission to Midnight Network.
                </p>
                <code className="text-xs text-emerald-300/70 font-mono block bg-slate-900 p-2 rounded">
                  midnightntwrk/proof-server:7.0.0
                </code>
              </Card>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* ZK Demo */}
      <AnimatedSection className="section-padding bg-slate-950 border-t border-slate-800">
        <div className="container mx-auto container-padding">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">
              <span className="text-amber-400">Live</span> Agent Verification Demo
            </h2>
            <p className="text-lg text-slate-400 max-w-3xl mx-auto">
              Simulate an agent earning $NIGHT, buying $DUST, and posting a ZK compliance proof to Midnight.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="bg-slate-950 border-amber-500/30 overflow-hidden shadow-2xl relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-600/10 blur-[80px] rounded-full pointer-events-none"></div>

              <div className="p-8 relative z-10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2 flex items-center">
                      <Fingerprint className="h-6 w-6 text-amber-400 mr-2" />
                      Self-Funding Agent Simulation
                    </h3>
                    <p className="text-slate-400 text-sm">
                      $NIGHT → PaymentGateway → $DUST → ZK Proof → Midnight Ledger
                    </p>
                  </div>
                  <Button
                    onClick={runZKSimulation}
                    disabled={zkStatus !== 'idle' && zkStatus !== 'verified'}
                    className="bg-amber-600 hover:bg-amber-500 text-white min-w-[200px]"
                  >
                    {zkStatus === 'idle' ? 'Run Simulation' :
                      zkStatus === 'verified' ? 'Run Again' :
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</>}
                  </Button>
                </div>

                <div className="bg-slate-900 rounded-lg p-6 font-mono text-sm border border-slate-800 min-h-[180px] flex flex-col justify-center">
                  {zkStatus === 'idle' && (
                    <div className="text-slate-500 text-center flex flex-col items-center">
                      <Coins className="h-12 w-12 mb-4 opacity-20" />
                      <span>Click to simulate the self-funding loop.</span>
                    </div>
                  )}
                  {zkStatus === 'generating' && (
                    <div className="space-y-3 text-slate-300">
                      <p className="text-amber-400">1. Client pays 100 $NIGHT for compliance audit</p>
                      <p className="animate-pulse">2. PaymentGateway splits: 40 → Expert, 60 → Auditor</p>
                      <p className="text-purple-400">3. Auditor converts 10 $NIGHT → $DUST for gas</p>
                    </div>
                  )}
                  {zkStatus === 'broadcasting' && (
                    <div className="space-y-3 text-slate-300">
                      <p className="text-emerald-400">4. Generating Halo2 ZK proof (k=9, 305 rows)...</p>
                      <p className="text-purple-400">5. Broadcasting to Midnight Preprod Network...</p>
                      <p className="animate-pulse text-slate-400">Waiting for Ledger confirmation...</p>
                    </div>
                  )}
                  {zkStatus === 'verified' && zkData && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                      <div className="flex items-center text-emerald-400 font-bold text-lg mb-2">
                        <Check className="h-6 w-6 mr-2" />
                        SELF-FUNDING LOOP COMPLETE!
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-800/50 p-3 rounded">
                          <span className="text-slate-500 block text-xs mb-1">Compliance Score</span>
                          <span className="text-white text-lg">{zkData.score}/100 — Compliant</span>
                        </div>
                        <div className="bg-slate-800/50 p-3 rounded">
                          <span className="text-slate-500 block text-xs mb-1">Agent Balance</span>
                          <span className="text-amber-400 text-lg">+90 $NIGHT (net)</span>
                        </div>
                        <div className="bg-slate-800/50 p-3 rounded col-span-2 overflow-hidden">
                          <span className="text-slate-500 block text-xs mb-1">Proof on Midnight</span>
                          <span className="text-purple-300/80 text-xs break-all">midnight://attestation/{zkData.proofHash}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </AnimatedSection>

      {/* CTA Final */}
      <AnimatedSection className="py-24 bg-gradient-to-r from-amber-900/30 via-slate-900 to-purple-900/30 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-8">
            Build Self-Funding AI Agents
          </h2>
          <p className="text-lg text-slate-300 mb-12 max-w-2xl mx-auto">
            $NIGHT/$DUST economics on Midnight Network. Agents that pay for themselves — forever.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              variant="primary"
              size="xl"
              className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-12"
              onClick={() => window.location.href = 'mailto:contato@dpo2u.com.br'}
            >
              Get in Touch
            </Button>
            <Button
              variant="outline"
              size="xl"
              className="border-2 border-white/20 text-white hover:bg-white/10"
              onClick={() => window.location.href = '/private-stack'}
            >
              <Lock className="h-5 w-5 mr-2" />
              Next: Private AI Stack
            </Button>
          </div>
        </div>
      </AnimatedSection>

      <Footer />
    </div>
  );
}
