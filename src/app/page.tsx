'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Shield, Brain, Zap, Users, ArrowRight, Check, Star, Activity } from 'lucide-react';
import LiveSystemStatusDashboard from '@/components/enhanced/LiveSystemStatusDashboard';
import ROICalculator from '@/components/enhanced/ROICalculator';
import { Button } from '@/components/ui/button';
import { trackCTA } from '@/lib/analytics';
import { Card } from '@/components/ui/card';
import Header from '@/components/Header';
import FAQSection from '@/components/FAQSection';
import { ConsultationDialog, PremiumTrigger } from '@/components/ui/premium-dialog';
import DataProcessingModal from '@/components/modals/DataProcessingModal';
import CustomerJourneyMap from '@/components/enhanced/CustomerJourneyMap';
// Enhanced Technical Components
import TechnicalArchitectureDashboard from '@/components/enhanced/TechnicalArchitectureDashboard';
import IntegrationCapabilities from '@/components/enhanced/IntegrationCapabilities';
// import ArchitectureSection from '@/components/ArchitectureSection';
// import MultiAgentVisualization from '@/components/enhanced/MultiAgentVisualization';

// Animation variants
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

// Section wrapper with intersection observer
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

export default function HomePage() {
  const [isDataModalOpen, setIsDataModalOpen] = React.useState(false);
  const [showJourney, setShowJourney] = React.useState(false);
  
  return (
    <div className="min-h-screen">
      <Header />
      {/* Hero Section - Revolutionary 2025 */}
      <AnimatedSection className="relative min-h-screen flex items-center overflow-hidden bg-gradient-premium">
        {/* Revolutionary Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-brand-sapphire-500/10 via-brand-emerald-500/5 to-transparent"></div>
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-sapphire-500/15 rounded-full blur-3xl animate-pulse-subtle"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-brand-emerald-500/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-brand-platinum-500/8 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          
          {/* Geometric Overlays */}
          <div className="absolute top-20 left-20 w-32 h-32 border border-brand-sapphire-400/20 rotate-45 animate-spin" style={{ animationDuration: '20s' }}></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 border border-brand-emerald-400/20 rotate-12 animate-bounce" style={{ animationDuration: '3s' }}></div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="text-white">
              <motion.div 
                variants={fadeInUp}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-brand-sapphire-500/20 to-brand-emerald-500/20 rounded-full border border-brand-sapphire-400/30 mb-8 backdrop-blur-sm"
              >
                <Shield className="h-5 w-5 text-primary mr-3" />
                <span className="text-base font-semibold text-brand-sapphire-300">Líder Absoluto em Tecnologia Jurídica + IA</span>
              </motion.div>

              {/* SEO H1 - SISTEMA MULTIAGENTES */}
              <h1 className="sr-only" role="banner" aria-label="DPO2U: Sistema Multiagentes para Transformação Digital Empresarial - Líder em Legal Tech + IA">
                DPO2U: Sistema Multiagentes para Transformação Digital Empresarial - Líder em Legal Tech + IA
              </h1>
              
              <motion.h2 
                variants={fadeInUp}
                className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-8 leading-tight"
              >
                <span className="bg-gradient-to-r from-brand-sapphire-400 via-brand-emerald-400 to-brand-sapphire-500 bg-clip-text text-transparent">
                  Sistema Multiagentes
                </span>{' '}
                <br />
                <span className="text-white">para Transformação</span>
                <br />
                <span className="bg-gradient-to-r from-brand-emerald-400 to-brand-ocean-400 bg-clip-text text-transparent">
                  Digital Empresarial
                </span>
              </motion.h2>
              
              <motion.p 
                variants={fadeInUp}
                className="text-xl md:text-2xl mb-10 text-brand-platinum-300 leading-relaxed max-w-3xl font-light"
              >
                {/* INNOVATION FIRST: Digital Transformation + Smart Compliance */}
                <span className="text-white font-semibold">Acelere sua transformação digital</span>{' '}
                com nossa <span className="text-primary font-medium">arquitetura multiagente híbrida</span> que orquestra{' '}
                <span className="text-primary font-medium">145+ agentes especializados</span>.{' '}
                <span className="text-brand-emerald-400 font-medium">Automatização inteligente</span>{' '}
                de processos empresariais com{' '}
                <span className="text-brand-emerald-400 font-medium">compliance nativo e ROI de 400%</span>.
              </motion.p>

              {/* Key Metrics - SISTEMA MULTIAGENTES */}
              <motion.div 
                variants={fadeInUp}
                className="grid grid-cols-2 gap-8 mb-12 max-w-2xl"
              >
                <div className="text-center lg:text-left group">
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-brand-emerald-400 to-brand-emerald-500 bg-clip-text text-transparent mb-2">72h</div>
                  <div className="text-sm text-brand-platinum-400 font-semibold uppercase tracking-wide">Deploy Transformação Digital</div>
                  <div className="w-full h-1 bg-gradient-to-r from-brand-emerald-400/50 to-transparent rounded-full mt-2 group-hover:from-brand-emerald-400 transition-all"></div>
                </div>
                <div className="text-center lg:text-left group">
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-brand-sapphire-400 to-brand-sapphire-500 bg-clip-text text-transparent mb-2">400%</div>
                  <div className="text-sm text-brand-platinum-400 font-semibold uppercase tracking-wide">ROI Enterprise Comprovado</div>
                  <div className="w-full h-1 bg-gradient-to-r from-brand-sapphire-400/50 to-transparent rounded-full mt-2 group-hover:from-brand-sapphire-400 transition-all"></div>
                </div>
              </motion.div>

              {/* Revolutionary CTA Buttons */}
              <motion.div 
                variants={fadeInUp}
                className="flex flex-col sm:flex-row gap-6"
              >
                <ConsultationDialog />
                
                <Button
                  variant="outline"
                  size="xl"
                  className="relative border-2 border-brand-gray-400/50 text-brand-gray-200 hover:bg-brand-gray-700 hover:text-white hover:border-brand-gray-300 backdrop-blur-md bg-brand-gray-800/20 font-bold text-lg px-12 py-6 rounded-2xl group transition-all duration-300 overflow-hidden"
                  onClick={() => {
                    trackCTA('demo_interativo', 'hero');
                    setIsDataModalOpen(true);
                  }}
                >
                  <span className="relative z-10 flex items-center">
                    <Brain className="h-5 w-5 mr-3 group-hover:rotate-12 transition-transform" />
                    Consulta Estratégica
                  </span>
                  <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                </Button>
              </motion.div>

              <motion.p 
                variants={fadeInUp}
                className="mt-8 text-sm text-slate-400 font-light"
              >
                {/* LEANN Pattern: Value Stacking + Risk Reversal */}
                <span className="inline-flex items-center text-emerald-400 font-medium">
                  <Star className="h-3 w-3 mr-2 fill-current" />
                  Transformação Digital ACELERADA (72h Implementation)
                </span>
                {' '} • Consulta estratégica • Roadmap personalizado • ROI garantido
              </motion.p>
            </div>

            {/* Right Column - Live System Status Dashboard */}
            <motion.div 
              variants={fadeInUp}
              className="relative lg:block hidden"
            >
              <LiveSystemStatusDashboard />
            </motion.div>
          </div>
        </div>
      </AnimatedSection>

      {/* Sobre Nós Section */}
      <AnimatedSection id="about" className="section-padding bg-white dark:bg-slate-900">
        <div className="container mx-auto container-padding">
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-slate-100 rounded-full mb-6">
              <Users className="h-4 w-4 text-slate-600 mr-2" />
              <span className="text-sm font-medium text-slate-600">Sobre a DPO2U</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-text-dark mb-6 leading-tight">
              Criadores do{' '}
              <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                Sistema Multiagentes
              </span>{' '}
              para Transformação Digital Empresarial
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed font-light">
              Primeira empresa brasileira a desenvolver <span className="font-medium text-brand-text-dark">arquitetura multiagente híbrida</span> que{' '}
              <span className="font-medium text-brand-text-dark">orquestra IA especializada</span> para entregar 
              transformação digital empresarial completa com compliance automatizado e ROI mensurável de <span className="font-medium text-emerald-600">400%</span>.
            </p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              {
                icon: Brain,
                title: 'Orquestração Inteligente',
                description: 'Master Orchestrator coordena 145+ agentes especializados para máxima eficiência operacional enterprise',
              },
              {
                icon: Zap,
                title: 'Automação Multiagente',
                description: 'Agentes especializados em compliance, finance, operations, security - 90% automação empresarial',
              },
              {
                icon: Shield,
                title: 'Arquitetura Híbrida Enterprise',
                description: '4 níveis de inteligência: AI Brain → Master Orchestrator → Specialists → Workers com compliance nativo',
              },
              {
                icon: Users,
                title: 'ROI Empresarial Comprovado',
                description: '400% ROI em 12 meses - implementação 24h para Fortune 500 e empresas de médio-grande porte',
              },
            ].map((item, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card variant="brand" hover className="text-center h-full">
                  <item.icon className="h-12 w-12 text-brand-blue-500 mx-auto mb-4" />
                  <h3 className="text-lg font-serif font-semibold text-brand-gray-800 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">
                    {item.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </AnimatedSection>

      {/* ROI Calculator - PRIORITY POSITION */}
      <AnimatedSection id="roi" className="section-padding bg-gradient-to-br from-brand-sapphire-50 via-white to-brand-emerald-50">
        <div className="container mx-auto container-padding">
          <ROICalculator />
        </div>
      </AnimatedSection>

      {/* Technical Architecture Dashboard - NEW */}
      <AnimatedSection id="architecture-dashboard" className="bg-slate-900">
        <TechnicalArchitectureDashboard />
      </AnimatedSection>


      {/* Arquitetura Section removida conforme solicitação */}

      {/* Agentes Section removida */}

      {/* Nossos Serviços Section */}
      <AnimatedSection id="services" className="section-padding bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto container-padding">
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-brand-blue-100 rounded-full mb-6">
              <Zap className="h-4 w-4 text-brand-blue-600 mr-2" />
              <span className="text-sm font-medium text-brand-blue-600">Soluções Inovadoras</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-gray-800 mb-6">
              Sistema Multiagentes que{' '}
              <span className="bg-gradient-to-r from-brand-blue-600 to-brand-purple-600 bg-clip-text text-transparent">
                automatiza transformação digital empresarial
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Orquestração inteligente de IA especializada para entregar automação empresarial completa com <span className="font-semibold text-emerald-600">ROI de 400% comprovado</span>
            </p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            className="grid lg:grid-cols-3 gap-8 mb-16"
          >
            {/* Service Cards */}
            {[
              {
                icon: Brain,
                title: 'Master Orchestrator',
                subtitle: 'Coordenação Enterprise Multiagente',
                description: 'AI Brain que orquestra 145+ agentes especializados para entregar transformação digital completa com compliance nativo.',
                features: ['Coordenação de 145+ agentes simultaneamente', 'Balanceamento inteligente enterprise-grade', 'Failover e disaster recovery automático'],
                color: 'blue',
                gradient: 'from-brand-blue-500 to-brand-blue-600'
              },
              {
                icon: Zap,
                title: 'Agentes Especializados',
                subtitle: 'IA Especializada Enterprise por Domínio',
                description: 'Agentes especializados em Legal, Finance, Operations, Security, HR, Supply Chain - cada um expert certificado em sua área.',
                features: ['50+ domínios especializados enterprise', 'Machine learning contínuo', 'Customização por setor e compliance'],
                color: 'purple',
                gradient: 'from-brand-purple-500 to-brand-purple-600'
              },
              {
                icon: Shield,
                title: 'Workers & Monitors',
                subtitle: 'Execução Enterprise e Observabilidade Total',
                description: 'Agentes de execução que processam operações críticas e agentes de monitoramento com compliance LGPD/SOX/GDPR nativo.',
                features: ['Processamento paralelo enterprise-scale', 'Monitoramento compliance 24/7/365', 'Alertas preditivos e análise de risco'],
                color: 'green',
                gradient: 'from-brand-green-500 to-brand-green-600'
              }
            ].map((service, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="group relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-300`}></div>
                
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${service.gradient} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <service.icon className="h-8 w-8 text-white" />
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-2xl font-serif font-bold text-brand-gray-800 mb-2">
                    {service.title}
                  </h3>
                  <p className={`text-sm font-medium text-brand-${service.color}-600 mb-4`}>
                    {service.subtitle}
                  </p>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-3 mb-6">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start space-x-3">
                        <div className={`w-2 h-2 bg-gradient-to-br ${service.gradient} rounded-full mt-2 flex-shrink-0`}></div>
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <button
                    className={`w-full py-3 px-6 bg-gradient-to-r ${service.gradient} text-white rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200`}
                    onClick={() => {
                      trackCTA('comece_transformacao_agora', `service_${service.title}`);
                      setShowJourney(true);
                    }}
                  >
                    Comece Transformação Agora
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </AnimatedSection>

      {/* Customer Journey Map - Innovation First */}
      {showJourney && (
        <AnimatedSection id="customer-journey" className="bg-white">
          <CustomerJourneyMap onClose={() => setShowJourney(false)} />
        </AnimatedSection>
      )}

      {/* Benefícios Section */}
      <AnimatedSection id="benefits" className="section-padding bg-gray-50 dark:bg-slate-900">
        <div className="container mx-auto container-padding">
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-gray-800 mb-6">
              Impacto mensurável: ROI de transformação digital
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Métricas reais de empresas que implementaram nosso sistema multiagentes para automação empresarial
            </p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              {
                title: 'Automação Multiagente',
                stats: '90% automação',
                description: 'de processos empresariais críticos',
                color: 'text-green-600',
              },
              {
                title: 'Redução Operacional',
                stats: '75% menos',
                description: 'tempo em tarefas administrativas',
                color: 'text-blue-600',
              },
              {
                title: 'Escalabilidade IA',
                stats: '50+ agentes',
                description: 'coordenados simultaneamente',
                color: 'text-purple-600',
              },
              {
                title: 'ROI Transformação',
                stats: '400% ROI', 
                description: 'em 12 meses com sistema multiagentes',
                color: 'text-brand-purple-600',
              },
            ].map((benefit, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card variant="brand" className="text-center h-full">
                  <h3 className="text-lg font-serif font-semibold text-brand-gray-800 mb-2">
                    {benefit.title}
                  </h3>
                  <p className={`text-3xl font-bold mb-2 ${benefit.color}`}>
                    {benefit.stats}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {benefit.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </AnimatedSection>

      {/* FAQ Section */}
      <FAQSection />

      {/* Technology Showcase Section */}
      <AnimatedSection id="technology" className="section-padding bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto container-padding">
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-gray-800 mb-6">
              Tecnologia de Ponta para{' '}
              <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                Resultados Reais
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Nossa arquitetura multiagente está em produção, demonstrando capacidades técnicas 
              avançadas e entregando automação empresarial mensurável
            </p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            className="grid lg:grid-cols-3 gap-8"
          >
            {[
              {
                title: 'Sistema Multiagente em Produção',
                description: 'Arquitetura híbrida 4-níveis rodando 24/7 com 145+ agentes especializados disponíveis para coordenação dinâmica.',
                metrics: ['12+ agentes ativos simultâneos', '99.97% uptime sistema', '847 req/min throughput'],
                icon: <Brain className="h-8 w-8" />,
                color: 'blue'
              },
              {
                title: 'Performance Enterprise Validada',
                description: 'Métricas reais de sistema em produção demonstrando capacidade enterprise-grade com monitoramento contínuo.',
                metrics: ['120ms latência média', '67% memory efficiency', 'API response <250ms'],
                icon: <Activity className="h-8 w-8" />,
                color: 'emerald'
              },
              {
                title: 'Tecnologia Comprovada',
                description: 'Stack técnico robusto integrando OpenAI MCP, Claude Code, LEANN e Session Manager com alta disponibilidade.',
                metrics: ['OpenAI GPT-4o + o3-mini', 'LEANN 2.856+ docs indexados', 'Zero-loss context preservation'],
                icon: <Shield className="h-8 w-8" />,
                color: 'purple'
              },
            ].map((item, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="h-full p-6 hover:shadow-lg transition-shadow">
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-${item.color}-500 to-${item.color}-600 rounded-2xl mb-6`}>
                    {React.cloneElement(item.icon, { className: "h-8 w-8 text-white" })}
                  </div>
                  
                  <h3 className="text-xl font-serif font-bold text-brand-gray-800 mb-4">
                    {item.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {item.description}
                  </p>
                  
                  <div className="space-y-3">
                    {item.metrics.map((metric, idx) => (
                      <div key={idx} className="flex items-center text-sm">
                        <div className={`w-2 h-2 bg-${item.color}-500 rounded-full mr-3 flex-shrink-0`}></div>
                        <span className="text-gray-700">{metric}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Real System Status */}
          <motion.div variants={fadeInUp} className="mt-16">
            <Card className="p-8 bg-gradient-to-r from-slate-50 to-blue-50 border border-slate-200">
              <div className="text-center">
                <h3 className="text-2xl font-serif font-bold text-brand-gray-800 mb-4">
                  Sistema Live - Métricas Reais
                </h3>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Acompanhe em tempo real as métricas do nosso sistema multiagente em produção. 
                  Dados atualizados automaticamente a cada 2 segundos.
                </p>
                <Button 
                  className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white"
                  onClick={() => {
                    const dashboardSection = document.getElementById('architecture-dashboard');
                    dashboardSection?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <Activity className="h-5 w-5 mr-2" />
                  Ver Dashboard Live
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </AnimatedSection>

      {/* Integration Capabilities - Technical Details at End */}
      <AnimatedSection id="integrations" className="bg-white">
        <IntegrationCapabilities />
      </AnimatedSection>

      {/* CTA Final Section */}
      <AnimatedSection className="section-padding bg-brand-sapphire-800 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-sapphire-800 via-brand-sapphire-700 to-brand-sapphire-900"></div>
        <div className="absolute inset-0 bg-grid-white/5"></div>
        
        <div className="container mx-auto container-padding text-center relative z-10">
          <motion.div variants={fadeInUp} className="max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-8">
              <Shield className="h-4 w-4 text-emerald-400 mr-2" />
              <span className="text-sm font-medium text-emerald-400">Transformação Digital Segura</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-6 leading-tight">
              Pronto para transformar{' '}
              <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                sua empresa?
              </span>
            </h2>
            
            <p className="text-lg md:text-xl mb-8 text-slate-300 font-light leading-relaxed">
              Diagnóstico completo • Roadmap personalizado • Avaliação técnica
            </p>
            
            <div className="bg-brand-sapphire-700/50 backdrop-blur rounded-2xl p-6 mb-8 border border-brand-sapphire-600/30">
              <p className="text-slate-200 mb-2">
                <span className="text-emerald-400 font-medium">Consultoria estratégica</span> • Avaliação sem compromisso
              </p>
              <p className="text-slate-400 text-sm">
                ✓ Implementação em 72h • ✓ Suporte especializado • ✓ ROI garantido
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ConsultationDialog />
              <Button
                variant="outline"
                size="xl"
                className="border-2 border-brand-sapphire-500 text-brand-platinum-200 hover:bg-brand-sapphire-700 hover:text-white hover:border-brand-sapphire-400 transition-all duration-200 font-medium"
              >
                Baixar Guia Sistema Multiagentes
              </Button>
            </div>
          </motion.div>
        </div>
      </AnimatedSection>

      {/* Footer - Professional Design */}
      <footer className="bg-brand-sapphire-900 border-t border-brand-sapphire-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Footer Content */}
          <div className="py-16">
            <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-12 mb-12">
              {/* Brand Section */}
              <div className="lg:col-span-2">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-brand-blue-500 to-brand-green-500 rounded-lg flex items-center justify-center">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-2xl text-white">DPO2U</h3>
                    <p className="text-sm text-slate-400">Legal Tech + IA</p>
                  </div>
                </div>
                <p className="text-slate-300 text-lg mb-6 max-w-md leading-relaxed">
                  Sistema Multiagentes para Transformação Digital Empresarial. Arquitetura híbrida 4-níveis 
                  que orquestra 145+ agentes especializados com compliance nativo LGPD/GDPR.
                </p>
                
                {/* Contact Info */}
                <div className="space-y-3">
                  <div className="flex items-center text-slate-400">
                    <div className="w-2 h-2 bg-brand-green-500 rounded-full mr-3"></div>
                    <span className="text-sm">contato@dpo2u.com.br</span>
                  </div>
                  <div className="flex items-center text-slate-400">
                    <div className="w-2 h-2 bg-brand-blue-500 rounded-full mr-3"></div>
                    <span className="text-sm">+55 11 9999-9999</span>
                  </div>
                  <div className="flex items-center text-slate-400">
                    <div className="w-2 h-2 bg-brand-purple-500 rounded-full mr-3"></div>
                    <span className="text-sm">São Paulo, SP - Brasil</span>
                  </div>
                </div>
              </div>

              {/* Services */}
              <div>
                <h4 className="font-semibold text-white text-lg mb-6">Soluções</h4>
                <ul className="space-y-4">
                  {[
                    'Sistema Multiagentes Enterprise',
                    'Transformação Digital 72h', 
                    'Arquitetura Híbrida 4-Níveis',
                    'Agent Factory & Orchestration',
                    'Compliance Nativo LGPD/GDPR'
                  ].map((item, index) => (
                    <li key={index}>
                      <a href="#" className="text-slate-400 hover:text-brand-blue-400 transition-colors text-sm flex items-center group">
                        <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all" />
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company */}
              <div>
                <h4 className="font-semibold text-white text-lg mb-6">Empresa</h4>
                <ul className="space-y-4">
                  {[
                    'Sobre a DPO2U',
                    'Nossa Equipe',
                    'Cases de Sucesso',
                    'Blog & Recursos',
                    'Carreiras'
                  ].map((item, index) => (
                    <li key={index}>
                      <a href="#" className="text-slate-400 hover:text-brand-green-400 transition-colors text-sm flex items-center group">
                        <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all" />
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-brand-blue-500/10 to-brand-green-500/10 rounded-2xl border border-brand-blue-500/20 p-8 mb-12">
              <div className="text-center">
                <h4 className="text-2xl font-serif font-bold text-white mb-4">
                  Pronto para acelerar sua transformação digital?
                </h4>
                <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
                  Assessment técnico do sistema multiagentes em produção. Deploy em 72h 
                  com 400% ROI comprovado e compliance nativo LGPD/GDPR.
                </p>
                <ConsultationDialog />
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-brand-sapphire-800 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-slate-400 text-sm text-center md:text-left">
                <p>&copy; 2025 DPO2U Tecnologia Jurídica Ltda. Todos os direitos reservados.</p>
                <p className="mt-1">CNPJ: XX.XXX.XXX/0001-XX • Certificada ISO 27001 • Membro ANPPD</p>
              </div>
              
              <div className="flex items-center space-x-6">
                <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">
                  Política de Privacidade
                </a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">
                  Termos de Uso
                </a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">
                  LGPD
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <DataProcessingModal 
        isOpen={isDataModalOpen}
        onClose={() => setIsDataModalOpen(false)}
      />
    </div>
  );
}
