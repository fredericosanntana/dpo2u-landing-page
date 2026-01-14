
import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Shield, Brain, Zap, Users, ArrowRight, Check, Star, Activity, Database, Lock, Server, Code, Terminal } from 'lucide-react';
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

export default function MCPPage() {
    const [isDataModalOpen, setIsDataModalOpen] = React.useState(false);

    return (
        <div className="min-h-screen">
            <Header />

            {/* Hero Section */}
            <AnimatedSection className="relative min-h-screen flex items-center overflow-hidden bg-gradient-premium">
                {/* Background Effects */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-brand-sapphire-500/10 via-brand-emerald-500/5 to-transparent"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-sapphire-500/10 rounded-full blur-[100px] animate-pulse-subtle"></div>
                </div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-20">
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.div
                            variants={fadeInUp}
                            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-brand-sapphire-500/20 to-brand-emerald-500/20 rounded-full border border-brand-sapphire-400/30 mb-8 backdrop-blur-sm"
                        >
                            <Brain className="h-5 w-5 text-primary mr-3" />
                            <span className="text-base font-semibold text-brand-sapphire-300">Model Context Protocol (MCP) Server</span>
                        </motion.div>

                        <motion.h1
                            variants={fadeInUp}
                            className="text-4xl md:text-5xl lg:text-7xl font-serif font-bold mb-8 leading-tight text-white"
                        >
                            O Cérebro da sua <br />
                            <span className="bg-gradient-to-r from-brand-emerald-400 to-brand-sapphire-400 bg-clip-text text-transparent">
                                Privacidade Digital
                            </span>
                        </motion.h1>

                        <motion.p
                            variants={fadeInUp}
                            className="text-xl md:text-2xl mb-12 text-brand-platinum-300 leading-relaxed font-light"
                        >
                            Uma ponte inteligente entre sua infraestrutura local e a IA.
                            <span className="text-brand-emerald-400 font-medium"> 17 Ferramentas especializadas</span> para auditoria, compliance e criptografia homomórfica, rodando 100% no seu servidor.
                        </motion.p>

                        <motion.div
                            variants={fadeInUp}
                            className="flex flex-col sm:flex-row gap-6 justify-center"
                        >
                            <ConsultationDialog />
                            <Button
                                variant="outline"
                                size="xl"
                                className="border-2 border-brand-gray-400/50 text-brand-gray-200 hover:bg-brand-gray-700 hover:text-white backdrop-blur-md bg-brand-gray-800/20 font-bold px-12"
                                onClick={() => window.open('https://github.com/dpo2u/dpo2u-mcp', '_blank')}
                            >
                                <Code className="h-5 w-5 mr-2" />
                                Ver Documentação Técnica
                            </Button>
                        </motion.div>
                    </div>
                </div>
            </AnimatedSection>

            {/* Architecture Section */}
            <AnimatedSection className="section-padding bg-slate-900 text-white">
                <div className="container mx-auto container-padding">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 text-white">
                            Arquitetura <span className="text-brand-emerald-400">Zero-Trust AI</span>
                        </h2>
                        <p className="text-lg text-slate-400 max-w-3xl mx-auto">
                            Seus dados nunca saem da sua infraestrutura. O MCP Server orquestra a inteligência localmente.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8 items-center">
                        {/* Client */}
                        <Card className="bg-slate-800 border-slate-700 p-8 text-center relative">
                            <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 hidden lg:block z-10">
                                <ArrowRight className="h-8 w-8 text-slate-600" />
                            </div>
                            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Terminal className="h-8 w-8 text-blue-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-white">MCP Clients</h3>
                            <p className="text-slate-400 text-sm">Claude Desktop, Cursor, Custom Apps</p>
                        </Card>

                        {/* Server */}
                        <Card className="bg-slate-800 border-brand-emerald-500/50 p-8 text-center ring-2 ring-brand-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.1)]">
                            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Server className="h-10 w-10 text-emerald-400" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2 text-white">DPO2U MCP Server</h3>
                            <div className="flex flex-wrap gap-2 justify-center mt-4">
                                <span className="px-2 py-1 bg-emerald-500/10 rounded text-xs text-emerald-400 border border-emerald-500/20">Node.js</span>
                                <span className="px-2 py-1 bg-emerald-500/10 rounded text-xs text-emerald-400 border border-emerald-500/20">TypeScript</span>
                                <span className="px-2 py-1 bg-emerald-500/10 rounded text-xs text-emerald-400 border border-emerald-500/20">Docker</span>
                            </div>
                        </Card>

                        {/* Backend */}
                        <Card className="bg-slate-800 border-slate-700 p-8 text-center relative">
                            <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 hidden lg:block z-10">
                                <ArrowRight className="h-8 w-8 text-slate-600 rotate-180" />
                            </div>
                            <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Database className="h-8 w-8 text-purple-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-white">Local Intelligence</h3>
                            <div className="space-y-2 mt-4">
                                <div className="flex items-center justify-center gap-2 text-sm text-slate-300">
                                    <Database className="h-4 w-4" /> LEANN Vector DB
                                </div>
                                <div className="flex items-center justify-center gap-2 text-sm text-slate-300">
                                    <Lock className="h-4 w-4" /> OpenFHE Crypto
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </AnimatedSection>

            {/* Tools Showcase */}
            <AnimatedSection className="section-padding bg-slate-50 dark:bg-slate-900">
                <div className="container mx-auto container-padding">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-gray-800 dark:text-white mb-6">
                            17 Agentes Especializados
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                            Automacão completa para LGPD, GDPR e Segurança da Informação.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { title: 'auditinfrastructure', desc: 'Auditoria completa de servidores e VPS para compliance.', icon: Activity, color: 'blue' },
                            { title: 'assessrisk', desc: 'Geração automática de DPIA/RIPD e avaliação de riscos.', icon: Shield, color: 'red' },
                            { title: 'mapdataflow', desc: 'Mapeamento visual do fluxo de dados pessoais.', icon: Database, color: 'emerald' },
                            { title: 'generateprivacypolicy', desc: 'Criação de políticas personalizadas e jurídicamente válidas.', icon: Code, color: 'purple' },
                            { title: 'simulatebreach', desc: 'Simulação técnica de incidentes para teste de resiliência.', icon: Zap, color: 'orange' },
                            { title: 'verifyconsent', desc: 'Auditoria de bases de consentimento e opt-ins.', icon: Check, color: 'green' },
                            { title: 'encryptedreporting', desc: 'Relatórios gerados sobre dados encriptados (FHE).', icon: Lock, color: 'indigo' },
                            { title: 'zkcomplianceproof', desc: 'Provas Zero-Knowledge de conformidade sem expor dados.', icon: Shield, color: 'cyan' },
                            { title: 'homomorphicanalytics', desc: 'Analytics preservando privacidade total.', icon: Activity, color: 'pink' },
                        ].map((tool, idx) => (
                            <motion.div key={idx} variants={fadeInUp}>
                                <Card className="h-full p-6 hover:shadow-lg transition-all border-l-4 border-l-transparent hover:border-l-brand-emerald-500">
                                    <div className="flex items-start justify-between mb-4">
                                        <h3 className="font-mono text-lg font-bold text-brand-blue-600 dark:text-brand-blue-400">
                                            {tool.title}
                                        </h3>
                                        <tool.icon className={`h-5 w-5 text-${tool.color}-500`} />
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                        {tool.desc}
                                    </p>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <p className="text-sm text-gray-500 italic">...e mais 8 ferramentas avançadas de segurança e análise.</p>
                    </div>
                </div>
            </AnimatedSection>

            {/* Integration Code */}
            <AnimatedSection className="section-padding bg-slate-900 text-white">
                <div className="container mx-auto container-padding">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 text-white">
                                Integração Simples
                            </h2>
                            <p className="text-lg text-slate-300 mb-8">
                                Adicione ao seu Claude Desktop ou Cursor em segundos. O servidor roda localmente via Docker, expondo uma interface padrão MCP.
                            </p>

                            <ul className="space-y-4 mb-8">
                                {[
                                    'Compatível com Claude 3.5 Sonnet',
                                    'Compatível com Cursor IDE',
                                    'API HTTP para integrações customizadas',
                                    'Autenticação via API Key'
                                ].map((item, idx) => (
                                    <li key={idx} className="flex items-center text-slate-400">
                                        <Check className="h-5 w-5 text-emerald-400 mr-3" />
                                        {item}
                                    </li>
                                ))}
                            </ul>

                            <Button
                                variant="primary"
                                size="lg"
                                className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold"
                                onClick={() => window.open('https://github.com/dpo2u/dpo2u-mcp', '_blank')}
                            >
                                Ver Guia de Instalação
                            </Button>
                        </div>

                        <div className="bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shadow-2xl">
                            <div className="flex items-center px-4 py-2 bg-slate-900 border-b border-slate-800">
                                <div className="flex space-x-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                </div>
                                <span className="ml-4 text-xs text-slate-500 font-mono">claude_desktop_config.json</span>
                            </div>
                            <div className="p-6 overflow-x-auto">
                                <pre className="text-sm font-mono text-emerald-400 pointer-events-none select-none">
                                    {`{
  "mcpServers": {
    "dpo2u": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "dpo2u-mcp"
      ],
      "env": {
        "MCP_API_KEY": "sk-..."
      }
    }
  }
}`}
                                </pre>
                            </div>
                        </div>
                    </div>
                </div>
            </AnimatedSection>

            {/* CTA Final */}
            <AnimatedSection className="py-24 bg-brand-sapphire-900 text-center">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-8">
                        Comece sua jornada de IA Soberana hoje
                    </h2>
                    <ConsultationDialog />
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
