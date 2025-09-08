"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Code, 
  TrendingUp, 
  DollarSign, 
  Shield, 
  Zap, 
  Users, 
  FileText, 
  BarChart3,
  Cpu,
  Settings,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type Persona = 'cto' | 'ceo' | 'cfo';

interface PersonaContent {
  title: string;
  subtitle: string;
  icon: React.ElementType;
  color: string;
  gradient: string;
  priorities: Array<{
    icon: React.ElementType;
    title: string;
    description: string;
  }>;
  ctaText: string;
  ctaSecondary: string;
  benefits: Array<{
    metric: string;
    description: string;
    color: string;
  }>;
  concerns: Array<{
    concern: string;
    solution: string;
  }>;
}

const personaContent: Record<Persona, PersonaContent> = {
  cto: {
    title: "Para o CTO Visionário",
    subtitle: "Arquitetura técnica escalável e integrações enterprise",
    icon: Code,
    color: "text-brand-sapphire-600",
    gradient: "from-brand-sapphire-500 to-brand-sapphire-600",
    priorities: [
      {
        icon: Cpu,
        title: "Arquitetura Multiagente",
        description: "Sistema híbrido de 4 níveis com APIs RESTful e GraphQL"
      },
      {
        icon: Shield,
        title: "Segurança Enterprise",
        description: "ISO 27001, SOC 2, criptografia AES-256, zero-trust"
      },
      {
        icon: Settings,
        title: "Integrações Nativas",
        description: "APIs abertas, webhooks, SDKs para Python/Node.js/Java"
      }
    ],
    ctaText: "Documentação Técnica Completa",
    ctaSecondary: "Agendar Technical Deep Dive",
    benefits: [
      { metric: "99.99%", description: "Uptime garantido", color: "text-brand-emerald-500" },
      { metric: "<100ms", description: "Latência média API", color: "text-brand-sapphire-500" },
      { metric: "15min", description: "Tempo de deploy", color: "text-brand-purple-500" }
    ],
    concerns: [
      {
        concern: "Complexidade de integração",
        solution: "APIs plug-and-play com documentação completa e SDKs oficiais"
      },
      {
        concern: "Escalabilidade do sistema",
        solution: "Arquitetura cloud-native com auto-scaling e load balancing"
      },
      {
        concern: "Segurança e compliance",
        solution: "Certificações enterprise e auditoria contínua de segurança"
      }
    ]
  },
  ceo: {
    title: "Para o CEO Estratégico",
    subtitle: "Transformação digital e vantagem competitiva sustentável",
    icon: TrendingUp,
    color: "text-brand-emerald-600",
    gradient: "from-brand-emerald-500 to-brand-emerald-600",
    priorities: [
      {
        icon: TrendingUp,
        title: "Vantagem Competitiva",
        description: "Primeira empresa do setor com sistema multiagente completo"
      },
      {
        icon: Users,
        title: "Transformação Digital",
        description: "90% dos processos automatizados em 6 meses"
      },
      {
        icon: BarChart3,
        title: "Growth Acelerado",
        description: "300% ROI e redução de 60% no time-to-market"
      }
    ],
    ctaText: "Business Case Completo",
    ctaSecondary: "Consultoria C-Level Executiva",
    benefits: [
      { metric: "300%", description: "ROI médio 12 meses", color: "text-brand-emerald-500" },
      { metric: "6 meses", description: "Payback period", color: "text-brand-sapphire-500" },
      { metric: "+500", description: "Empresas confiaram", color: "text-brand-purple-500" }
    ],
    concerns: [
      {
        concern: "ROI e tempo de retorno",
        solution: "300% ROI garantido com payback em 6 meses ou reembolso"
      },
      {
        concern: "Disrupção operacional",
        solution: "Implementação gradual com zero downtime e suporte 24/7"
      },
      {
        concern: "Diferencial competitivo",
        solution: "Único sistema multiagente híbrido do mercado brasileiro"
      }
    ]
  },
  cfo: {
    title: "Para o CFO Analítico",
    subtitle: "ROI comprovado e otimização de custos operacionais",
    icon: DollarSign,
    color: "text-brand-purple-600",
    gradient: "from-brand-purple-500 to-brand-purple-600",
    priorities: [
      {
        icon: DollarSign,
        title: "Redução de Custos",
        description: "70% menos custos de compliance vs. equipe interna"
      },
      {
        icon: BarChart3,
        title: "ROI Mensurável",
        description: "Métricas detalhadas e relatórios financeiros automáticos"
      },
      {
        icon: FileText,
        title: "Budget Predictable",
        description: "Modelo SaaS transparente sem custos ocultos"
      }
    ],
    ctaText: "Análise de Custo-Benefício",
    ctaSecondary: "ROI Calculator Detalhado",
    benefits: [
      { metric: "70%", description: "Redução custos", color: "text-brand-emerald-500" },
      { metric: "R$ 2.3M", description: "Economia média/ano", color: "text-brand-sapphire-500" },
      { metric: "6 meses", description: "Payback period", color: "text-brand-purple-500" }
    ],
    concerns: [
      {
        concern: "Justificativa de investimento",
        solution: "ROI calculator com dados reais e benchmarks do mercado"
      },
      {
        concern: "Custos ocultos",
        solution: "Pricing transparente all-inclusive sem taxas adicionais"
      },
      {
        concern: "Previsibilidade orçamentária",
        solution: "Modelo SaaS fixo com escalabilidade previsível"
      }
    ]
  }
};

const PersonaButton: React.FC<{
  persona: Persona;
  isActive: boolean;
  onClick: () => void;
  content: PersonaContent;
}> = ({ persona, isActive, onClick, content }) => {
  const Icon = content.icon;
  
  return (
    <button
      onClick={onClick}
      className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
        isActive
          ? `border-transparent bg-gradient-to-r ${content.gradient} text-white shadow-lg scale-105`
          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md text-gray-700'
      }`}
    >
      <div className="flex items-center space-x-3">
        <Icon className={`h-6 w-6 ${isActive ? 'text-white' : content.color}`} />
        <div className="text-left">
          <div className={`font-semibold ${isActive ? 'text-white' : 'text-gray-800'}`}>
            {persona.toUpperCase()}
          </div>
          <div className={`text-sm ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
            {content.title.replace('Para o ', '')}
          </div>
        </div>
      </div>
    </button>
  );
};

const ContentSection: React.FC<{ content: PersonaContent }> = ({ content }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
    className="space-y-8"
  >
    {/* Hero Section */}
    <Card className="p-8 bg-gradient-to-r from-white to-gray-50 border-2 border-gray-100">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">{content.title}</h3>
          <p className="text-lg text-gray-600 mb-6">{content.subtitle}</p>
          
          {/* Key Benefits */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {content.benefits.map((benefit, index) => (
              <div key={index} className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div className={`text-2xl font-bold ${benefit.color} mb-1`}>
                  {benefit.metric}
                </div>
                <div className="text-sm text-gray-600">{benefit.description}</div>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              size="lg" 
              className={`bg-gradient-to-r ${content.gradient} hover:opacity-90`}
            >
              <FileText className="h-5 w-5 mr-2" />
              {content.ctaText}
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className={`border-2 ${content.color.replace('text-', 'border-')} hover:bg-gray-50`}
            >
              <Users className="h-5 w-5 mr-2" />
              {content.ctaSecondary}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
        
        {/* Visual Element */}
        <div className="hidden lg:block ml-8">
          <div className={`w-32 h-32 bg-gradient-to-br ${content.gradient} rounded-2xl flex items-center justify-center shadow-lg`}>
            <content.icon className="h-16 w-16 text-white" />
          </div>
        </div>
      </div>
    </Card>

    {/* Priorities Grid */}
    <div className="grid md:grid-cols-3 gap-6">
      {content.priorities.map((priority, index) => (
        <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
          <priority.icon className={`h-10 w-10 ${content.color} mb-4`} />
          <h4 className="text-lg font-semibold text-gray-800 mb-2">
            {priority.title}
          </h4>
          <p className="text-gray-600 text-sm leading-relaxed">
            {priority.description}
          </p>
        </Card>
      ))}
    </div>

    {/* Concerns & Solutions */}
    <Card className="p-8">
      <h4 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
        <CheckCircle className={`h-6 w-6 ${content.color} mr-3`} />
        Principais Preocupações Respondidas
      </h4>
      <div className="space-y-6">
        {content.concerns.map((item, index) => (
          <div key={index} className="border-l-4 border-gray-200 pl-4">
            <div className="font-medium text-gray-800 mb-2">
              ❓ {item.concern}
            </div>
            <div className={`text-sm ${content.color} bg-gray-50 p-3 rounded-lg`}>
              ✅ {item.solution}
            </div>
          </div>
        ))}
      </div>
    </Card>
  </motion.div>
);

export default function PersonaToggle() {
  const [activePersona, setActivePersona] = useState<Persona>('cto');

  return (
    <section className="section-padding bg-white">
      <div className="container mx-auto container-padding">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center px-4 py-2 bg-brand-ocean-100 rounded-full mb-6">
            <Users className="h-4 w-4 text-brand-ocean-600 mr-2" />
            <span className="text-sm font-medium text-brand-ocean-700">Conteúdo Personalizado</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-800 mb-6">
            Benefícios{' '}
            <span className="bg-gradient-to-r from-brand-ocean-600 to-brand-purple-600 bg-clip-text text-transparent">
              Específicos
            </span>{' '}
            para Cada Líder
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Descubra como o sistema multiagente DPO2U impacta diretamente suas prioridades e objetivos específicos
          </p>
        </motion.div>

        {/* Persona Selector */}
        <div className="flex flex-col md:flex-row gap-4 justify-center mb-12">
          {(Object.keys(personaContent) as Persona[]).map((persona) => (
            <PersonaButton
              key={persona}
              persona={persona}
              isActive={activePersona === persona}
              onClick={() => setActivePersona(persona)}
              content={personaContent[persona]}
            />
          ))}
        </div>

        {/* Content Display */}
        <AnimatePresence mode="wait">
          <ContentSection 
            key={activePersona}
            content={personaContent[activePersona]} 
          />
        </AnimatePresence>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <Card className="p-8 bg-gradient-to-r from-gray-800 to-gray-900 text-white">
            <h3 className="text-2xl font-semibold mb-4">
              Pronto para ver os resultados na prática?
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Agende uma demonstração personalizada focada nas suas prioridades específicas como {activePersona.toUpperCase()}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className={`bg-gradient-to-r ${personaContent[activePersona].gradient}`}
              >
                <Zap className="h-5 w-5 mr-2" />
                Demo Personalizada {activePersona.toUpperCase()}
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-white text-white hover:bg-white hover:text-gray-800"
              >
                Falar com Especialista
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}