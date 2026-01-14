

import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Shield, Brain, Zap, Users, ArrowRight, Check, Star, Activity, Database } from 'lucide-react';
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
import Footer from '@/components/Footer';
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
      {/* Hero Section - Secure AI Stack 2025 */}
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
                <span className="text-base font-semibold text-brand-sapphire-300">Infraestrutura IA Soberana & Segura</span>
              </motion.div>

              {/* SEO H1 */}
              <h1 className="sr-only" role="banner" aria-label="DPO2U: Stack de IA Segura em VPS para Transformação Digital com Privacidade de Dados">
                DPO2U: Stack de IA Segura em VPS para Transformação Digital com Privacidade de Dados
              </h1>

              <motion.h2
                variants={fadeInUp}
                className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-8 leading-tight"
              >
                <span className="bg-gradient-to-r from-brand-sapphire-400 via-brand-emerald-400 to-brand-sapphire-500 bg-clip-text text-transparent">
                  Transformação Digital
                </span>{' '}
                <br />
                <span className="text-white">com sua própria</span>
                <br />
                <span className="bg-gradient-to-r from-brand-emerald-400 to-brand-ocean-400 bg-clip-text text-transparent">
                  Stack de IA Privada
                </span>
              </motion.h2>

              <motion.p
                variants={fadeInUp}
                className="text-xl md:text-2xl mb-10 text-brand-platinum-300 leading-relaxed max-w-3xl font-light"
              >
                Obtenha controle total dos seus dados. Implementamos sua <span className="text-primary font-medium">Stack de IA completa em VPS dedicada</span>:
                <span className="text-brand-emerald-400 font-medium"> Docker, Gitea, Traefik, Next.js e Python</span>.
                Segurança, privacidade e soberania para sua empresa escalar na era da IA.
              </motion.p>

              {/* Key Metrics */}
              <motion.div
                variants={fadeInUp}
                className="grid grid-cols-2 gap-8 mb-12 max-w-2xl"
              >
                <div className="text-center lg:text-left group">
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-brand-emerald-400 to-brand-emerald-500 bg-clip-text text-transparent mb-2">100%</div>
                  <div className="text-sm text-brand-platinum-400 font-semibold uppercase tracking-wide">Privacidade de Dados</div>
                  <div className="w-full h-1 bg-gradient-to-r from-brand-emerald-400/50 to-transparent rounded-full mt-2 group-hover:from-brand-emerald-400 transition-all"></div>
                </div>
                <div className="text-center lg:text-left group">
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-brand-sapphire-400 to-brand-sapphire-500 bg-clip-text text-transparent mb-2">VPS</div>
                  <div className="text-sm text-brand-platinum-400 font-semibold uppercase tracking-wide">Infraestrutura Soberana</div>
                  <div className="w-full h-1 bg-gradient-to-r from-brand-sapphire-400/50 to-transparent rounded-full mt-2 group-hover:from-brand-sapphire-400 transition-all"></div>
                </div>
              </motion.div>

              {/* CTA Buttons */}
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
                    Conheça a Stack
                  </span>
                  <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                </Button>
              </motion.div>

              <motion.p
                variants={fadeInUp}
                className="mt-8 text-sm text-slate-400 font-light"
              >
                <span className="inline-flex items-center text-emerald-400 font-medium">
                  <Star className="h-3 w-3 mr-2 fill-current" />
                  Deploy em 72h em sua própria VPS
                </span>
                {' '} • Código Fonte Próprio • Sem Lock-in de Cloud • Segurança Militar
              </motion.p>
            </div>

            {/* Right Column - System Status */}
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
              <span className="text-sm font-medium text-slate-600">Por que DPO2U?</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-text-dark mb-6 leading-tight">
              Sua Empresa, Sua Infraestrutura,{' '}
              <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                Sua Inteligência Artificial
              </span>
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed font-light">
              Não alugue inteligência, possua a sua. Nós montamos uma <span className="font-medium text-brand-text-dark">Stack de IA completa</span> diretamente em seus servidores (VPS), garantindo que seus dados sensíveis nunca saiam do seu controle, enquanto você aproveita o poder da transformação digital.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              {
                icon: Shield,
                title: 'Privacidade Absoluta',
                description: 'Seus dados rodam no seu "Ground" seguro. Nada é compartilhado com APIs públicas sem seu consentimento explícito.',
              },
              {
                icon: Zap,
                title: 'Stack Moderna & Robusta',
                description: 'Docker, Traefik, Gitea, Next.js, Python/FastAPI - A mesma tecnologia das Big Techs, configurada para você.',
              },
              {
                icon: Users,
                title: 'Autonomia Total',
                description: 'Entregamos o código fonte. Você tem controle total sobre o Gitea (Git) e o ciclo de vida do software.',
              },
              {
                icon: Brain,
                title: 'Inteligência Customizada',
                description: 'Modelos de IA ajustados ao contexto da sua empresa, rodando localmente ou via conexões seguras.',
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

      {/* ROI Calculator */}
      <AnimatedSection id="roi" className="section-padding bg-gradient-to-br from-brand-sapphire-50 via-white to-brand-emerald-50">
        <div className="container mx-auto container-padding">
          <ROICalculator />
        </div>
      </AnimatedSection>

      {/* Technical Architecture Dashboard */}
      <AnimatedSection id="architecture-dashboard" className="bg-slate-900">
        <TechnicalArchitectureDashboard />
      </AnimatedSection>

      {/* Benefits Section */}
      <AnimatedSection id="benefits" className="section-padding bg-gray-50 dark:bg-slate-900">
        <div className="container mx-auto container-padding">
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-gray-800 mb-6">
              Impacto da Soberania Digital
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Benefícios reais de internalizar sua infraestrutura de IA e dados
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              {
                title: 'Redução de Custos',
                stats: '-60% TCO',
                description: 'em comparação com soluções SaaS proprietárias',
                color: 'text-green-600',
              },
              {
                title: 'Segurança de Dados',
                stats: '100% Privado',
                description: 'nenhum dado sensível exposto a terceiros',
                color: 'text-blue-600',
              },
              {
                title: 'Velocidade de Deploy',
                stats: '72 horas',
                description: 'para setup completo da infraestrutura',
                color: 'text-purple-600',
              },
              {
                title: 'Conformidade',
                stats: 'LGPD/GDPR',
                description: 'compliance nativo por design',
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
              Nossa Stack de IA está em produção, demonstrando capacidades técnicas
              avançadas e entregando automação empresarial mensurável
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            className="grid lg:grid-cols-3 gap-8"
          >
            {[
              {
                title: 'Stack de IA em Produção',
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
                  Acompanhe em tempo real as métricas da nossa infraestrutura em produção.
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

      {/* Featured Stack Section */}
      <AnimatedSection id="technology" className="section-padding bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto container-padding">
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-gray-800 mb-6">
              Stack Tecnológica de{' '}
              <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                Classe Mundial
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Implementamos e configuramos as melhores ferramentas open-source para criar sua fundação de IA privada.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            className="grid lg:grid-cols-3 gap-8"
          >
            {[
              {
                title: 'Traefik Proxy & SSL',
                description: 'Gateway moderno e seguro que gerencia todo o tráfego de entrada, garantindo criptografia SSL automática e roteamento inteligente para seus serviços.',
                metrics: ['Gestão automática de Certificados', 'Load Balancing', 'Security Headers'],
                icon: <Shield className="h-8 w-8" />,
                color: 'blue'
              },
              {
                title: 'Gitea - Version Control',
                description: 'Sua própria plataforma de código. Hospede, revise e gerencie seus repositórios de IA com total privacidade e sem limites de usuários.',
                metrics: ['Git Privado', 'CI/CD Pipelines Integrados', 'Zero custo por usuário'],
                icon: <Database className="h-8 w-8" />,
                color: 'emerald'
              },
              {
                title: 'Next.js & Python API',
                description: 'Frontend de alta performance e Backend robusto em Python/FastAPI para servir seus modelos de IA e aplicações de negócio.',
                metrics: ['Server Side Rendering', 'FastAPI Async Performance', 'TypeSafe'],
                icon: <Activity className="h-8 w-8" />,
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

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-6 leading-tight text-white">
              Pronto para assumir o controle da{' '}
              <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                sua tecnologia?
              </span>
            </h2>

            <p className="text-lg md:text-xl mb-8 text-slate-300 font-light leading-relaxed">
              Entregamos sua infraestrutura de IA configurada, segura e pronta para escalar.
            </p>

            <div className="bg-brand-sapphire-700/50 backdrop-blur rounded-2xl p-6 mb-8 border border-brand-sapphire-600/30">
              <p className="text-slate-200 mb-2">
                <span className="text-emerald-400 font-medium">Setup Inicial Completo</span> • Treinamento da Equipe
              </p>
              <p className="text-slate-400 text-sm">
                ✓ Entrega do Código Fonte • ✓ Documentação Técnica • ✓ Suporte Dedicado
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ConsultationDialog />
              <Button
                variant="outline"
                size="xl"
                className="border-2 border-brand-sapphire-500 text-brand-platinum-200 hover:bg-brand-sapphire-700 hover:text-white hover:border-brand-sapphire-400 transition-all duration-200 font-medium"
              >
                Baixar Guia Técnico
              </Button>
            </div>
          </motion.div>
        </div>
      </AnimatedSection>

      {/* Footer - Professional Design */}
      <Footer />

      {/* Modals */}
      <DataProcessingModal
        isOpen={isDataModalOpen}
        onClose={() => setIsDataModalOpen(false)}
      />
    </div>
  );
}
