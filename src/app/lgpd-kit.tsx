
import React from 'react';
import { motion } from 'framer-motion';
import { Shield, FileText, CheckCircle, Zap, ArrowRight, Lock, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

export default function LgpdKitPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            <Header />

            {/* Hero Section */}
            <section className="relative min-h-[80vh] flex items-center overflow-hidden bg-gradient-premium pt-20">
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-brand-sapphire-500/10 via-brand-emerald-500/5 to-transparent"></div>
                    <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-brand-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.div
                            variants={fadeInUp}
                            initial="initial"
                            animate="animate"
                            className="inline-flex items-center px-6 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-8 backdrop-blur-sm"
                        >
                            <Shield className="h-4 w-4 text-emerald-500 mr-2" />
                            <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">DPO2U LGPD Kit</span>
                        </motion.div>

                        <motion.h1
                            variants={fadeInUp}
                            initial="initial"
                            animate="animate"
                            className="text-4xl md:text-6xl font-serif font-bold mb-6 leading-tight text-brand-gray-900 dark:text-white"
                        >
                            Adequação LGPD Completa <br />
                            <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                                Gerada por IA em Minutos
                            </span>
                        </motion.h1>

                        <motion.p
                            variants={fadeInUp}
                            initial="initial"
                            animate="animate"
                            className="text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto"
                        >
                            Não gaste meses e milhares de reais com consultorias tradicionais.
                            Nosso kit inteligente gera toda a documentação obrigatória personalizada para o seu negócio.
                        </motion.p>

                        <motion.div
                            variants={fadeInUp}
                            initial="initial"
                            animate="animate"
                            className="flex flex-col sm:flex-row gap-4 justify-center"
                        >
                            <Button
                                size="xl"
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 shadow-lg shadow-emerald-500/20"
                                onClick={() => window.location.href = '#start'}
                            >
                                Gerar Meu Kit Agora
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                            <Button
                                variant="outline"
                                size="xl"
                                className="border-2 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                                Ver Exemplo de Documento
                            </Button>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 bg-white dark:bg-slate-900">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4 text-brand-gray-900 dark:text-white">O Que Está Incluído no Kit?</h2>
                        <p className="text-slate-600 dark:text-slate-400">Tudo o que você precisa para comprovar conformidade.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: FileText,
                                title: 'Política de Privacidade',
                                desc: 'Gerada sob medida para seu site ou app, cobrindo coleta, uso e direitos dos usuários.',
                                color: 'blue'
                            },
                            {
                                icon: Lock,
                                title: 'Termos de Uso',
                                desc: 'Regras claras de utilização dos seus serviços, protegendo legalmente sua empresa.',
                                color: 'emerald'
                            },
                            {
                                icon: Activity,
                                title: 'Relatório de Impacto (DPIA)',
                                desc: 'Análise de riscos e medidas mitigadoras exigida para tratamentos de alto risco.',
                                color: 'purple'
                            },
                            {
                                icon: Shield,
                                title: 'Política de Segurança',
                                desc: 'Diretrizes internas para proteção de dados e resposta a incidentes.',
                                color: 'orange'
                            },
                            {
                                icon: CheckCircle,
                                title: 'Checklist de Conformidade',
                                desc: 'Passo a passo para garantir que você não esqueceu nenhum detalhe legal.',
                                color: 'cyan'
                            },
                            {
                                icon: Zap,
                                title: 'Gerador Automático',
                                desc: 'IA que entende seu modelo de negócio e adapta os textos juridicamente.',
                                color: 'yellow'
                            }
                        ].map((item, idx) => (
                            <Card key={idx} className="p-6 hover:shadow-xl transition-all border-slate-200 dark:border-slate-800">
                                <div className={`w-12 h-12 rounded-lg bg-${item.color}-100 dark:bg-${item.color}-900/20 flex items-center justify-center mb-4`}>
                                    <item.icon className={`h-6 w-6 text-${item.color}-600 dark:text-${item.color}-400`} />
                                </div>
                                <h3 className="text-xl font-bold mb-2 text-brand-gray-900 dark:text-white">{item.title}</h3>
                                <p className="text-slate-600 dark:text-slate-400">{item.desc}</p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section className="py-20 bg-slate-50 dark:bg-slate-800/50">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-brand-gray-900 dark:text-white">
                                Como Funciona?
                            </h2>
                            <div className="space-y-8">
                                {[
                                    { step: 1, title: 'Responda o Questionário', desc: 'Perguntas simples sobre seu negócio, sem juridiquês.' },
                                    { step: 2, title: 'IA Analisa Seus Dados', desc: 'Nossa inteligência identifica as obrigações legais específicas.' },
                                    { step: 3, title: 'Receba Seus Documentos', desc: 'Baixe o kit completo em PDF e Word, pronto para uso.' }
                                ].map((step, idx) => (
                                    <div key={idx} className="flex gap-4">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
                                            {step.step}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold mb-1 text-brand-gray-900 dark:text-white">{step.title}</h3>
                                            <p className="text-slate-600 dark:text-slate-400">{step.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative">
                            {/* Placeholder for an image or UI demo */}
                            <div className="aspect-video bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 rounded-2xl shadow-2xl flex items-center justify-center border border-slate-300 dark:border-slate-600">
                                <p className="text-slate-500 dark:text-slate-400 font-medium">Interface do Gerador</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Bottom */}
            <section className="py-24 bg-brand-sapphire-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-white/5"></div>
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Comece sua Adequação Hoje</h2>
                    <p className="text-brand-sapphire-200 text-lg mb-8 max-w-2xl mx-auto">
                        Evite multas e ganhe a confiança dos seus clientes com uma postura profissional de proteção de dados.
                    </p>
                    <Button
                        size="xl"
                        className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-10 py-6 text-lg rounded-xl shadow-2xl shadow-emerald-900/50"
                    >
                        Acessar Gerador Gratuitamente
                    </Button>
                </div>
            </section>

            <Footer />
        </div>
    );
}
