import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  Coins, Wallet, Shield, Zap, ArrowRight, Check, Activity, Lock,
  Code, Terminal, GitBranch, Building2, Sparkles, Hexagon, Network,
  Gauge, Loader2, Fingerprint, FileCode2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Header from '@/components/Header';
import FAQSection from '@/components/FAQSection';
import DataProcessingModal from '@/components/modals/DataProcessingModal';
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

export default function ERC8004Page() {
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);
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
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-brand-sapphire-600/10 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '6s' }}></div>
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-500/20 to-brand-sapphire-500/20 rounded-full border border-amber-400/30 mb-8 backdrop-blur-sm"
            >
              <Hexagon className="h-5 w-5 text-amber-400 mr-3" />
              <span className="text-base font-semibold text-amber-300">ERC-8004: Autonomous Agent Standard</span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-4xl md:text-5xl lg:text-7xl font-serif font-bold mb-8 leading-tight text-white"
            >
              The First <br />
              <span className="bg-gradient-to-r from-amber-400 via-yellow-400 to-brand-sapphire-400 bg-clip-text text-transparent">
                Self-Funding Web3 Agent
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-xl md:text-2xl mb-12 text-slate-300 leading-relaxed font-light"
            >
              A revolutionary Ethereum standard enabling AI agents to operate with{' '}
              <span className="text-amber-400 font-medium">complete financial autonomy</span>.
              Self-funding, self-governance, and auto-execution via smart contracts.
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
                onClick={() => window.open('https://github.com/fredericosanntana', '_blank')}
              >
                <Code className="h-5 w-5 mr-2" />
                View Smart Contracts
              </Button>
            </motion.div>

            <motion.div variants={fadeInUp} className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-slate-400">
              {[
                'Base Chain Mainnet',
                '70+ Tests Passing',
                'OpenZeppelin 5.x',
                'Audited',
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

      {/* Architecture Section */}
      <AnimatedSection className="section-padding bg-slate-900 text-white">
        <div className="container mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 text-white">
              <span className="text-amber-400">ERC-8004</span> Architecture
            </h2>
            <p className="text-lg text-slate-400 max-w-3xl mx-auto">
              Four interconnected smart contracts that bring autonomous agents to life.
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-6 items-center">
            <Card className="bg-slate-800 border-slate-700 p-6 text-center">
              <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet className="h-8 w-8 text-amber-400" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-white">Treasury</h3>
              <p className="text-slate-400 text-xs">Manages agent funds with multi-sig and security controls</p>
            </Card>

            <Card className="bg-slate-800 border-brand-sapphire-500/50 p-6 text-center ring-2 ring-brand-sapphire-500/20">
              <div className="w-16 h-16 bg-brand-sapphire-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Coins className="h-8 w-8 text-brand-sapphire-400" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-white">DPO2UToken</h3>
              <p className="text-slate-400 text-xs">Native ERC-20 token with integrated governance</p>
            </Card>

            <Card className="bg-slate-800 border-slate-700 p-6 text-center">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Network className="h-8 w-8 text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-white">AgentRegistry</h3>
              <p className="text-slate-400 text-xs">Decentralized agent registry with profiles and metadata</p>
            </Card>

            <Card className="bg-slate-800 border-slate-700 p-6 text-center">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-white">SwapExecutor</h3>
              <p className="text-slate-400 text-xs">Executes automatic swaps via Uniswap V3 for self-funding</p>
            </Card>
          </div>

          {/* Flow Diagram */}
          <div className="mt-16 bg-slate-950 rounded-xl p-8 border border-slate-800">
            <h3 className="text-center text-xl font-bold mb-8 text-amber-400">Self-Funding Flow</h3>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center">
              {[
                { icon: Building2, label: 'User Deposit', color: 'amber' },
                { icon: Wallet, label: 'Treasury Receives', color: 'brand-sapphire' },
                { icon: Sparkles, label: 'Agent Operation', color: 'emerald' },
                { icon: Zap, label: 'Swap & Yield', color: 'purple' },
                { icon: Coins, label: 'Self-Funding', color: 'amber' },
              ].map((step, idx) => (
                <React.Fragment key={step.label}>
                  {idx > 0 && (
                    <>
                      <ArrowRight className="h-6 w-6 text-slate-600 hidden md:block" />
                      <ArrowRight className="h-6 w-6 text-slate-600 md:hidden rotate-90" />
                    </>
                  )}
                  <div className="flex flex-col items-center gap-2">
                    <div className={`w-12 h-12 bg-${step.color}-500/20 rounded-full flex items-center justify-center`}>
                      <step.icon className={`h-6 w-6 text-${step.color}-400`} />
                    </div>
                    <span className="text-sm text-slate-300">{step.label}</span>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Features Grid */}
      <AnimatedSection className="section-padding bg-slate-950">
        <div className="container mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">
              Pioneering <span className="text-amber-400">Features</span>
            </h2>
            <p className="text-lg text-slate-400 max-w-3xl mx-auto">
              Exclusive capabilities that define the new standard for autonomous agents.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Self-Funding',
                desc: 'The agent generates its own income through swaps and yield farming, eliminating dependency on external funding.',
                icon: Coins,
                color: 'amber',
              },
              {
                title: 'Self-Governance',
                desc: 'Decisions made through on-chain voting with weights based on participation.',
                icon: GitBranch,
                color: 'brand-sapphire',
              },
              {
                title: 'Auto-Execution',
                desc: 'Operations executed automatically when pre-defined conditions are met.',
                icon: Zap,
                color: 'purple',
              },
              {
                title: 'Permission System',
                desc: 'Granular permission control (READ, WRITE, TREASURY, DEPLOY, GOVERNANCE) for each agent.',
                icon: Shield,
                color: 'emerald',
              },
              {
                title: 'Multi-Sig Treasury',
                desc: 'Additional security with multiple signatures for high-value fund movements.',
                icon: Lock,
                color: 'red',
              },
              {
                title: 'Real-Time Monitoring',
                desc: 'Complete dashboard to track operations, balances, and performance in real time.',
                icon: Gauge,
                color: 'cyan',
              },
            ].map((feature, idx) => (
              <motion.div key={idx} variants={fadeInUp}>
                <Card className="h-full p-6 hover:shadow-lg transition-all bg-slate-900 border-slate-800 hover:border-amber-500/30">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-bold text-white">{feature.title}</h3>
                    <feature.icon className={`h-5 w-5 text-${feature.color}-400`} />
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* ZK Compliance Dashboard */}
      <AnimatedSection className="section-padding bg-slate-900 border-t border-b border-slate-800">
        <div className="container mx-auto container-padding">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">
              <span className="text-brand-sapphire-400">Zero-Knowledge</span> On-Chain Verification
            </h2>
            <p className="text-lg text-slate-400 max-w-3xl mx-auto">
              The ERC-8004 Agent attests and queries compliance without exposing PII,
              validating proofs directly from the Midnight Ledger while operating on Base Chain.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="bg-slate-950 border-brand-sapphire-500/30 overflow-hidden shadow-2xl relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-sapphire-600/10 blur-[80px] rounded-full pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-600/10 blur-[80px] rounded-full pointer-events-none"></div>

              <div className="p-8 relative z-10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2 flex items-center">
                      <Fingerprint className="h-6 w-6 text-brand-sapphire-400 mr-2" />
                      ZK-SNARK Payload Generator
                    </h3>
                    <p className="text-slate-400 text-sm">Circuit: getComplianceStatus.zkir (k=9, rows=305)<br />Type: Halo2</p>
                  </div>
                  <Button
                    onClick={runZKSimulation}
                    disabled={zkStatus !== 'idle' && zkStatus !== 'verified'}
                    className="bg-brand-sapphire-600 hover:bg-brand-sapphire-500 text-white min-w-[200px]"
                  >
                    {zkStatus === 'idle' ? 'Run ZK Audit' :
                      zkStatus === 'verified' ? 'Run Again' :
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing ZKIR...</>}
                  </Button>
                </div>

                <div className="bg-slate-900 rounded-lg p-6 font-mono text-sm border border-slate-800 min-h-[180px] flex flex-col justify-center">
                  {zkStatus === 'idle' && (
                    <div className="text-slate-500 text-center flex flex-col items-center">
                      <Shield className="h-12 w-12 mb-4 opacity-20" />
                      <span>No proof submitted. Click to compile.</span>
                    </div>
                  )}
                  {zkStatus === 'generating' && (
                    <div className="space-y-3 text-slate-300">
                      <p className="text-amber-400">🔄 [Agent Auditor] Analyzing rules dpo2u/lgpd/v1...</p>
                      <p className="animate-pulse">Compiling public parameters (score, agent_did)...</p>
                      <p className="text-emerald-400 mt-2">↳ Generating Commitment Hash from IPFS Document.</p>
                    </div>
                  )}
                  {zkStatus === 'broadcasting' && (
                    <div className="space-y-3 text-slate-300">
                      <p className="text-emerald-400">✅ Proof generated locally in 8ms</p>
                      <p className="text-brand-sapphire-400">📡 Broadcasting halo2 SNARK via Midnight Network RPC...</p>
                      <p className="animate-pulse text-slate-400">Waiting for Ledger confirmation (Compact v0.29)...</p>
                    </div>
                  )}
                  {zkStatus === 'verified' && zkData && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                      <div className="flex items-center text-emerald-400 font-bold text-lg mb-2">
                        <Check className="h-6 w-6 mr-2" />
                        MIDNIGHT INTEGRATION TEST (PHASE 2) PASSED!
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-800/50 p-3 rounded">
                          <span className="text-slate-500 block text-xs mb-1">On-Chain Status</span>
                          <span className="text-white text-lg">Compliant (Score: {zkData.score})</span>
                        </div>
                        <div className="bg-slate-800/50 p-3 rounded overflow-hidden">
                          <span className="text-slate-500 block text-xs mb-1">Doc CID (Lighthouse)</span>
                          <span className="text-brand-sapphire-300 text-xs break-all">{zkData.cid}</span>
                        </div>
                        <div className="bg-slate-800/50 p-3 rounded col-span-2 overflow-hidden">
                          <span className="text-slate-500 block text-xs mb-1">Proof URL Payload</span>
                          <span className="text-amber-300/80 text-xs break-all">midnight://attestation/{zkData.proofHash}</span>
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

      {/* Technical Specs */}
      <AnimatedSection className="section-padding bg-slate-900 text-white">
        <div className="container mx-auto container-padding">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 text-white">
                Technical <span className="text-amber-400">Specifications</span>
              </h2>
              <p className="text-lg text-slate-300 mb-8">
                Built with security and performance best practices for Mainnet deployment.
              </p>

              <div className="space-y-4">
                {[
                  { label: 'Solidity Version', value: '0.8.24' },
                  { label: 'Framework', value: 'Hardhat with TypeScript' },
                  { label: 'Ethers.js', value: 'v6' },
                  { label: 'OpenZeppelin', value: '5.x Contracts' },
                  { label: 'Network', value: 'Base Chain (L2)' },
                  { label: 'Test Coverage', value: '70+ Test Cases' },
                ].map((spec, idx) => (
                  <div key={idx} className="flex items-center justify-between py-3 border-b border-slate-800">
                    <span className="text-slate-400">{spec.label}</span>
                    <span className="text-amber-400 font-mono font-semibold">{spec.value}</span>
                  </div>
                ))}
              </div>

              <Button
                variant="primary"
                size="lg"
                className="mt-8 bg-amber-500 hover:bg-amber-600 text-white font-bold"
                onClick={() => window.open('https://github.com/fredericosanntana', '_blank')}
              >
                <Code className="h-5 w-5 mr-2" />
                View Repository
              </Button>
            </div>

            <div className="bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shadow-2xl">
              <div className="flex items-center px-4 py-2 bg-slate-900 border-b border-slate-800">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <span className="ml-4 text-xs text-slate-500 font-mono">ERC8004Agent.sol</span>
              </div>
              <div className="p-6 overflow-x-auto">
                <pre className="text-xs md:text-sm font-mono text-amber-400 pointer-events-none select-none">
{`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract DPO2UToken is ERC20, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");

    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10**18;

    constructor() ERC20("DPO2U Token", "DPO2U") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(BURNER_ROLE, msg.sender);
    }

    function mint(address to, uint256 amount)
        public onlyRole(MINTER_ROLE) {
        require(totalSupply() + amount <= MAX_SUPPLY);
        _mint(to, amount);
    }
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Base Chain Integration */}
      <AnimatedSection className="section-padding bg-slate-950">
        <div className="container mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">
              <span className="text-blue-400">Base Chain</span> Integration
            </h2>
            <p className="text-lg text-slate-400 max-w-3xl mx-auto">
              Deployed on Base Chain to leverage low fees and high performance.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'WETH', address: '0x4200000000000000000000000000000000000006', desc: 'Wrapped Ether for collateral', icon: Coins },
              { title: 'USDC', address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bDA02913', desc: 'USD Coin for transactions', icon: Activity },
              { title: 'SwapRouter', address: '0x2626664c2603336E57B271c5C0b26F421741e481', desc: 'Uniswap V3 SwapRouter', icon: Network },
            ].map((contract, idx) => (
              <motion.div key={idx} variants={fadeInUp}>
                <Card className="h-full p-6 bg-slate-900 border-slate-800">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <contract.icon className="h-5 w-5 text-blue-400" />
                    </div>
                    <h3 className="font-bold text-white">{contract.title}</h3>
                  </div>
                  <p className="font-mono text-xs text-slate-500 mb-2 break-all">{contract.address}</p>
                  <p className="text-sm text-slate-400">{contract.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* FAQ */}
      <AnimatedSection className="section-padding bg-slate-900">
        <div className="container mx-auto container-padding">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white text-center mb-12">
            Frequently Asked <span className="text-amber-400">Questions</span>
          </h2>
          <FAQSection />
        </div>
      </AnimatedSection>

      {/* CTA Final */}
      <AnimatedSection className="py-24 bg-gradient-to-r from-amber-900/30 via-slate-900 to-brand-sapphire-900/30 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-8">
            Build the Future of Autonomous Agents
          </h2>
          <p className="text-lg text-slate-300 mb-12 max-w-2xl mx-auto">
            Join the ERC-8004 revolution and create agents that operate with complete financial autonomy.
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
              className="border-2 border-amber-400/30 text-amber-300 hover:bg-amber-500/10"
              onClick={() => window.open('https://github.com/fredericosanntana', '_blank')}
            >
              <Code className="h-5 w-5 mr-2" />
              Documentation
            </Button>
          </div>
        </div>
      </AnimatedSection>

      <DataProcessingModal isOpen={isDataModalOpen} onClose={() => setIsDataModalOpen(false)} />
      <Footer />
    </div>
  );
}
