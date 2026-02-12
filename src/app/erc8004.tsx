
import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Coins, Wallet, Shield, Zap, ArrowRight, Check, Activity, Lock, Code, Terminal, GitBranch, Building2, Sparkles, Hexagon, Network, Gauge } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { trackCTA } from '@/lib/analytics';
import { Card } from '@/components/ui/card';
import Header from '@/components/Header';
import FAQSection from '@/components/FAQSection';
import { ConsultationDialog } from '@/components/ui/premium-dialog';
import DataProcessingModal from '@/components/modals/DataProcessingModal';
import Footer from '@/components/Footer';

// Animation variants (reused for consistency)
const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const AnimatedSection: React.FC<{
    children: React.ReactNode;
    className?: string;
    id?: string;
}> = ({ children, className = '', id }) => {
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    return (
        <motion.section
            ref={ref}
            id={id}
            initial="initial"
            animate={inView ? "animate" : "initial"}
            variants={staggerContainer}
            className={className}
        >
            {children}
        </motion.section>
    );
};

export default function ERC8004Page() {
    const [isDataModalOpen, setIsDataModalOpen] = React.useState(false);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 overflow-x-hidden">
            <Header />

            {/* Hero Section */}
            <AnimatedSection className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-brand-sapphire-950">
                {/* Background Effects */}
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
                            O Primeiro Agente <br />
                            <span className="bg-gradient-to-r from-amber-400 via-yellow-400 to-brand-sapphire-400 bg-clip-text text-transparent">
                                Self-Funding da Web3
                            </span>
                        </motion.h1>

                        <motion.p
                            variants={fadeInUp}
                            className="text-xl md:text-2xl mb-12 text-slate-300 leading-relaxed font-light"
                        >
                            Um revolucionário padrão Ethereum que permite agentes IA operarem com
                            <span className="text-amber-400 font-medium"> autonomia financeira completa</span>.
                            Self-funding, self-governance e auto-execução em smart contracts.
                        </motion.p>

                        <motion.div
                            variants={fadeInUp}
                            className="flex flex-col sm:flex-row gap-6 justify-center"
                        >
                            <ConsultationDialog />
                            <Button
                                variant="outline"
                                size="xl"
                                className="border-2 border-amber-400/30 text-amber-300 hover:bg-amber-500/10 hover:text-amber-200 backdrop-blur-md bg-amber-900/20 font-bold px-12"
                                onClick={() => window.open('https://github.com/dpo2u/self-funding-agent', '_blank')}
                            >
                                <Code className="h-5 w-5 mr-2" />
                                Ver Smart Contracts
                            </Button>
                        </motion.div>

                        <motion.div
                            variants={fadeInUp}
                            className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-slate-400"
                        >
                            <div className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-emerald-400" />
                                Base Chain Mainnet
                            </div>
                            <div className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-emerald-400" />
                                70+ Testes Passando
                            </div>
                            <div className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-emerald-400" />
                                OpenZeppelin 5.x
                            </div>
                            <div className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-emerald-400" />
                                Auditorado
                            </div>
                        </motion.div>
                    </div>
                </div>
            </AnimatedSection>

            {/* Architecture Section */}
            <AnimatedSection className="section-padding bg-slate-900 text-white">
                <div className="container mx-auto container-padding">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 text-white">
                            Arquitetura <span className="text-amber-400">ERC-8004</span>
                        </h2>
                        <p className="text-lg text-slate-400 max-w-3xl mx-auto">
                            Quatro smart contracts interconectados que dão vida a agentes autônomos.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-4 gap-6 items-center">
                        {/* Treasury */}
                        <Card className="bg-slate-800 border-slate-700 p-6 text-center">
                            <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Wallet className="h-8 w-8 text-amber-400" />
                            </div>
                            <h3 className="text-lg font-bold mb-2 text-white">Treasury</h3>
                            <p className="text-slate-400 text-xs">Gerencia fundos do agente com multi-sig e controles de segurança</p>
                        </Card>

                        {/* Token */}
                        <Card className="bg-slate-800 border-brand-sapphire-500/50 p-6 text-center ring-2 ring-brand-sapphire-500/20">
                            <div className="w-16 h-16 bg-brand-sapphire-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Coins className="h-8 w-8 text-brand-sapphire-400" />
                            </div>
                            <h3 className="text-lg font-bold mb-2 text-white">DPO2UToken</h3>
                            <p className="text-slate-400 text-xs">Token ERC-20 nativo do ecossistema com governança integrada</p>
                        </Card>

                        {/* Agent Registry */}
                        <Card className="bg-slate-800 border-slate-700 p-6 text-center">
                            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Network className="h-8 w-8 text-emerald-400" />
                            </div>
                            <h3 className="text-lg font-bold mb-2 text-white">AgentRegistry</h3>
                            <p className="text-slate-400 text-xs">Registro descentralizado de agentes com perfis e metadados</p>
                        </Card>

                        {/* Swap Executor */}
                        <Card className="bg-slate-800 border-slate-700 p-6 text-center">
                            <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Zap className="h-8 w-8 text-purple-400" />
                            </div>
                            <h3 className="text-lg font-bold mb-2 text-white">SwapExecutor</h3>
                            <p className="text-slate-400 text-xs">Executa swaps automáticos via Uniswap V3 para auto-financiamento</p>
                        </Card>
                    </div>

                    {/* Flow Diagram */}
                    <div className="mt-16 bg-slate-950 rounded-xl p-8 border border-slate-800">
                        <h3 className="text-center text-xl font-bold mb-8 text-amber-400">Fluxo de Auto-Financiamento</h3>
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center">
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center">
                                    <Building2 className="h-6 w-6 text-amber-400" />
                                </div>
                                <span className="text-sm text-slate-300">Usuário Deposit</span>
                            </div>
                            <ArrowRight className="h-6 w-6 text-slate-600 hidden md:block rotate-0 md:rotate-0" />
                            <ArrowRight className="h-6 w-6 text-slate-600 md:hidden rotate-90" />
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-12 h-12 bg-brand-sapphire-500/20 rounded-full flex items-center justify-center">
                                    <Wallet className="h-6 w-6 text-brand-sapphire-400" />
                                </div>
                                <span className="text-sm text-slate-300">Treasury Recebe</span>
                            </div>
                            <ArrowRight className="h-6 w-6 text-slate-600 hidden md:block rotate-0 md:rotate-0" />
                            <ArrowRight className="h-6 w-6 text-slate-600 md:hidden rotate-90" />
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center">
                                    <Sparkles className="h-6 w-6 text-emerald-400" />
                                </div>
                                <span className="text-sm text-slate-300">Agente Operação</span>
                            </div>
                            <ArrowRight className="h-6 w-6 text-slate-600 hidden md:block rotate-0 md:rotate-0" />
                            <ArrowRight className="h-6 w-6 text-slate-600 md:hidden rotate-90" />
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                                    <Zap className="h-6 w-6 text-purple-400" />
                                </div>
                                <span className="text-sm text-slate-300">Swap & Yield</span>
                            </div>
                            <ArrowRight className="h-6 w-6 text-slate-600 hidden md:block rotate-0 md:rotate-0" />
                            <ArrowRight className="h-6 w-6 text-slate-600 md:hidden rotate-90" />
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center">
                                    <Coins className="h-6 w-6 text-amber-400" />
                                </div>
                                <span className="text-sm text-slate-300">Self-Funding</span>
                            </div>
                        </div>
                    </div>
                </div>
            </AnimatedSection>

            {/* Features Grid */}
            <AnimatedSection className="section-padding bg-slate-950">
                <div className="container mx-auto container-padding">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">
                            Recursos <span className="text-amber-400">Pioneiros</span>
                        </h2>
                        <p className="text-lg text-slate-400 max-w-3xl mx-auto">
                            Funcionalidades exclusivas que definem o novo padrão de agentes autônomos.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            {
                                title: 'Self-Funding',
                                desc: 'O agente gera renda própria através de swaps e yield farming, eliminando dependência de financiamento externo.',
                                icon: Coins,
                                color: 'amber'
                            },
                            {
                                title: 'Self-Governance',
                                desc: 'Decisões tomadas através de votação on-chain com pesos baseados em participação.',
                                icon: GitBranch,
                                color: 'brand-sapphire'
                            },
                            {
                                title: 'Auto-Execution',
                                desc: 'Operações executadas automaticamente quando condições pré-definidas são atendidas.',
                                icon: Zap,
                                color: 'purple'
                            },
                            {
                                title: 'Permission System',
                                desc: 'Controle granular de permissões (READ, WRITE, TREASURY, DEPLOY, GOVERNANCE) para cada agente.',
                                icon: Shield,
                                color: 'emerald'
                            },
                            {
                                title: 'Multi-Sig Treasury',
                                desc: 'Segurança adicional com múltiplas assinaturas para movimentações de fundos de alto valor.',
                                icon: Lock,
                                color: 'red'
                            },
                            {
                                title: 'Real-Time Monitoring',
                                desc: 'Dashboard completo para acompanhar operações, saldo e performance em tempo real.',
                                icon: Gauge,
                                color: 'cyan'
                            }
                        ].map((feature, idx) => (
                            <motion.div key={idx} variants={fadeInUp}>
                                <Card className="h-full p-6 hover:shadow-lg transition-all bg-slate-900 border-slate-800 hover:border-amber-500/30">
                                    <div className="flex items-start justify-between mb-4">
                                        <h3 className="text-lg font-bold text-white">{feature.title}</h3>
                                        <feature.icon className={`h-5 w-5 text-${feature.color}-400`} />
                                    </div>
                                    <p className="text-slate-400 text-sm leading-relaxed">
                                        {feature.desc}
                                    </p>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </AnimatedSection>

            {/* Technical Specs */}
            <AnimatedSection className="section-padding bg-slate-900 text-white">
                <div className="container mx-auto container-padding">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 text-white">
                                Especificações <span className="text-amber-400">Técnicas</span>
                            </h2>
                            <p className="text-lg text-slate-300 mb-8">
                                Desenvolvido com as melhores práticas de segurança e performance para Mainnet.
                            </p>

                            <div className="space-y-4">
                                {[
                                    { label: 'Solidity Version', value: '0.8.24' },
                                    { label: 'Framework', value: 'Hardhat with TypeScript' },
                                    { label: 'Ethers.js', value: 'v6' },
                                    { label: 'OpenZeppelin', value: '5.x Contracts' },
                                    { label: 'Network', value: 'Base Chain (L2)' },
                                    { label: 'Test Coverage', value: '70+ Test Cases' }
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
                                onClick={() => window.open('https://github.com/dpo2u/self-funding-agent', '_blank')}
                            >
                                <Code className="h-5 w-5 mr-2" />
                                Ver Repositório
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
                            Integração <span className="text-blue-400">Base Chain</span>
                        </h2>
                        <p className="text-lg text-slate-400 max-w-3xl mx-auto">
                            Deployado na Base Chain para aproveitar baixas taxas e alta performance.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            {
                                title: 'WETH',
                                address: '0x4200000000000000000000000000000000000006',
                                desc: 'Wrapped Ether para collateral',
                                icon: Coins
                            },
                            {
                                title: 'USDC',
                                address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bDA02913',
                                desc: 'USD Coin para transações',
                                icon: Activity
                            },
                            {
                                title: 'SwapRouter',
                                address: '0x2626664c2603336E57B271c5C0b26F421741e481',
                                desc: 'Uniswap V3 SwapRouter',
                                icon: Network
                            }
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

            {/* FAQ Section */}
            <AnimatedSection className="section-padding bg-slate-900">
                <div className="container mx-auto container-padding">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-white text-center mb-12">
                        Perguntas <span className="text-amber-400">Frequentes</span>
                    </h2>
                    <FAQSection />
                </div>
            </AnimatedSection>

            {/* CTA Final */}
            <AnimatedSection className="py-24 bg-gradient-to-r from-amber-900/30 via-slate-900 to-brand-sapphire-900/30 text-center">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-8">
                        Construa o Futuro dos Agentes Autônomos
                    </h2>
                    <p className="text-lg text-slate-300 mb-12 max-w-2xl mx-auto">
                        Junte-se à revolução ERC-8004 e crie agentes que operam com completa autonomia financeira.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <ConsultationDialog />
                        <Button
                            variant="outline"
                            size="xl"
                            className="border-2 border-amber-400/30 text-amber-300 hover:bg-amber-500/10"
                            onClick={() => window.open('https://github.com/dpo2u/self-funding-agent', '_blank')}
                        >
                            <Code className="h-5 w-5 mr-2" />
                            Documentação
                        </Button>
                    </div>
                </div>
            </AnimatedSection>

            <DataProcessingModal
                isOpen={isDataModalOpen}
                onClose={() => setIsDataModalOpen(false)}
            />
            <Footer />
        </div>
    );
}
