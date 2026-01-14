
import React from 'react';
import { motion } from 'framer-motion';
import { Shield, FileText, CheckCircle, Zap, ArrowRight, Lock, Activity, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

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

export default function LgpdKitPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 overflow-x-hidden">
            <Header />

            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-20">
                {/* Premium Background Effects */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-slate-900 via-slate-900 to-brand-sapphire-950"></div>
                    {/* Floating Orbs */}
                    <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-brand-sapphire-600/20 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '4s' }}></div>
                    <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-brand-emerald-600/10 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '6s' }}></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('/grid.svg')] opacity-[0.03]"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-5xl mx-auto text-center">
                        <motion.div
                            variants={fadeInUp}
                            initial="initial"
                            animate="animate"
                            className="inline-flex items-center px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-8 backdrop-blur-md shadow-lg shadow-brand-emerald-500/10"
                        >
                            <Shield className="h-4 w-4 text-brand-emerald-400 mr-2" />
                            <span className="text-sm font-semibold text-brand-emerald-300 tracking-wide uppercase">DPO2U Compliance Suite</span>
                        </motion.div>

                        <motion.h1
                            variants={fadeInUp}
                            initial="initial"
                            animate="animate"
                            className="text-5xl md:text-7xl font-serif font-bold mb-8 leading-tight tracking-tight"
                        >
                            <span className="text-white drop-shadow-sm">Sua Adequação LGPD</span> <br />
                            <span className="bg-gradient-to-r from-brand-emerald-400 via-brand-ocean-400 to-brand-sapphire-400 bg-clip-text text-transparent drop-shadow-lg">
                                Inteligente & Automática
                            </span>
                        </motion.h1>

                        <motion.p
                            variants={fadeInUp}
                            initial="initial"
                            animate="animate"
                            className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto font-light leading-relaxed"
                        >
                            Abandone planilhas complexas. Utilize nossa tecnologia de agentes IA para gerar toda a documentação jurídica e técnica do seu negócio em minutos.
                        </motion.p>

                        <motion.div
                            variants={fadeInUp}
                            initial="initial"
                            animate="animate"
                            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
                        >
                            <Button
                                size="xl"
                                className="bg-gradient-to-r from-brand-emerald-600 to-brand-emerald-500 hover:from-brand-emerald-500 hover:to-brand-emerald-400 text-white font-bold px-10 py-7 text-lg rounded-2xl shadow-xl shadow-brand-emerald-900/40 hover:shadow-brand-emerald-500/20 hover:scale-105 transition-all duration-300 border border-brand-emerald-400/20"
                                onClick={() => window.location.href = '/analise'}
                            >
                                <Zap className="mr-2 h-5 w-5 fill-current" />
                                Iniciar Diagnóstico Grátis
                            </Button>
                            <Button
                                variant="outline"
                                size="xl"
                                className="bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20 backdrop-blur-sm px-8 py-7 text-lg rounded-2xl font-medium transition-all"
                            >
                                Ver Demonstração
                            </Button>
                        </motion.div>

                        <motion.p
                            variants={fadeInUp}
                            initial="initial"
                            animate="animate"
                            className="mt-8 text-sm text-slate-500 font-medium"
                        >
                            <span className="text-brand-emerald-400">✓</span> Sem cartão de crédito necessário &nbsp;
                            <span className="text-brand-emerald-400">✓</span> Resultado imediato
                        </motion.p>
                    </div>
                </div>
            </section>

            {/* Features Grid - Glassmorphism */}
            <section className="py-24 relative bg-slate-950">
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6 text-white leading-tight">
                            O Kit de Compliance <span className="text-brand-emerald-400">Mais Completo</span>
                        </h2>
                        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                            Nossa IA analisa 32 pontos de controle e gera documentos personalizados juridicamente válidos.
                        </p>
                    </div>

                    <motion.div
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {[
                            {
                                icon: FileText,
                                title: 'Política de Privacidade',
                                desc: 'Gerada sob medida com cláusulas específicas para seu setor e tipo de coleta de dados.',
                                color: 'blue'
                            },
                            {
                                icon: Lock,
                                title: 'Termos de Uso',
                                desc: 'Regras claras de utilização protegendo sua propriedade intelectual e responsabilidades.',
                                color: 'emerald'
                            },
                            {
                                icon: Activity,
                                title: 'Relatório DPIA',
                                desc: 'Avaliação de Impacto à Proteção de Dados completa para processos de alto risco.',
                                color: 'purple'
                            },
                            {
                                icon: Shield,
                                title: 'Política de Segurança',
                                desc: 'Normas internas de SI, controle de acesso e resposta a incidentes cibernéticos.',
                                color: 'orange'
                            },
                            {
                                icon: CheckCircle,
                                title: 'Gestão de Cookies',
                                desc: 'Script de banner de consentimento pronto para copiar e colar no seu site.',
                                color: 'cyan'
                            },
                            {
                                icon: Star,
                                title: 'Selo de Adequação',
                                desc: 'Certificado visual para transmitir confiança aos visitantes do seu site.',
                                color: 'yellow'
                            }
                        ].map((item, idx) => (
                            <motion.div key={idx} variants={fadeInUp}>
                                <Card className="p-8 h-full bg-white/5 border-white/10 backdrop-blur-md hover:bg-white/10 hover:border-brand-emerald-500/30 transition-all duration-300 group hover:-translate-y-2">
                                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-${item.color}-500/20 to-${item.color}-600/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-${item.color}-500/20`}>
                                        <item.icon className={`h-7 w-7 text-${item.color}-400 group-hover:text-${item.color}-300`} />
                                    </div>
                                    <h3 className="text-2xl font-serif font-bold mb-3 text-white group-hover:text-brand-emerald-300 transition-colors">{item.title}</h3>
                                    <p className="text-slate-400 group-hover:text-slate-300 leading-relaxed">{item.desc}</p>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* How it works - Dark Elegant */}
            <section className="py-24 bg-slate-900 border-t border-white/5">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <div className="inline-flex items-center px-3 py-1 bg-brand-sapphire-500/10 border border-brand-sapphire-500/20 rounded-full mb-6">
                                <span className="text-xs font-bold text-brand-sapphire-300 uppercase tracking-widest">Processo Simplificado</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-8 text-white leading-tight">
                                Do Zero ao Compliance <br />
                                <span className="text-slate-500">em 3 Passos</span>
                            </h2>
                            <div className="space-y-10">
                                {[
                                    { step: '01', title: 'Diagnóstico Inteligente', desc: 'Responda perguntas dinâmicas adaptadas ao seu modelo de negócio.' },
                                    { step: '02', title: 'Processamento IA', desc: 'Nossos agentes cruzam seus dados com a legislação vigente.' },
                                    { step: '03', title: 'Entrega Imediata', desc: 'Receba seu kit completo editável e pronto para implementação.' }
                                ].map((step, idx) => (
                                    <div key={idx} className="flex gap-6 group">
                                        <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl font-serif font-bold text-slate-600 group-hover:text-brand-emerald-400 group-hover:border-brand-emerald-500/30 transition-all">
                                            {step.step}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold mb-2 text-white group-hover:text-brand-emerald-300 transition-colors">{step.title}</h3>
                                            <p className="text-slate-400 group-hover:text-slate-300">{step.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-brand-emerald-500 to-brand-sapphire-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                            <div className="relative aspect-square md:aspect-video bg-slate-950 rounded-2xl border border-white/10 overflow-hidden shadow-2xl flex items-center justify-center">
                                {/* Abstract UI representation */}
                                <div className="text-center p-8">
                                    <div className="w-24 h-24 mx-auto bg-brand-emerald-500/10 rounded-full flex items-center justify-center mb-4 animate-pulse">
                                        <Lock className="h-10 w-10 text-brand-emerald-400" />
                                    </div>
                                    <p className="text-slate-300 font-serif text-lg">Gerando Documentos...</p>
                                    <div className="w-48 h-1 bg-slate-800 rounded-full mx-auto mt-4 overflow-hidden">
                                        <div className="h-full bg-brand-emerald-500 w-2/3 animate-[shimmer_2s_infinite]"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Bottom - Radiant */}
            <section className="py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-brand-sapphire-950"></div>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-sapphire-900/50 via-brand-sapphire-950 to-brand-sapphire-950"></div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-8">
                        Proteja Sua Empresa Hoje
                    </h2>
                    <p className="text-slate-300 text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
                        Junte-se a empresas modernas que escolheram a segurança jurídica automática do DPO2U.
                    </p>
                    <Button
                        size="xl"
                        className="bg-white text-brand-sapphire-900 hover:bg-slate-100 font-bold px-12 py-8 text-xl rounded-2xl shadow-2xl hover:scale-105 transition-all duration-300"
                        onClick={() => window.location.href = '/analise'}
                    >
                        Começar Adequação
                        <ArrowRight className="ml-3 h-6 w-6" />
                    </Button>
                    <p className="mt-8 text-slate-500 text-sm">Garantia de 7 dias ou seu dinheiro de volta</p>
                </div>
            </section>

            <Footer />
        </div>
    );
}
