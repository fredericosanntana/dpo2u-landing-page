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
  CheckCircle,
  Server,
  Lock
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
    subtitle: "Controle total da infraestrutura, código-fonte e dados",
    icon: Code,
    color: "text-brand-sapphire-600",
    gradient: "from-brand-sapphire-500 to-brand-sapphire-600",
    priorities: [
      {
        icon: Server,
        title: "Soberania de Infraestrutura",
        description: "Stack completa (Docker, Traefik, Gitea) na sua própria VPS"
      },
      {
        icon: Shield,
        title: "Segurança & Privacidade",
        description: "Zero data leakage, firewall configurado, updates automáticos"
      },
      {
        icon: Settings,
        title: "DevEx Superior",
        description: "Repositórios git privados, CI/CD local e ambiente Dockerizado"
      }
    ],
    ctaText: "Ver Documentação da Stack",
    ctaSecondary: "Agendar Technical Deep Dive",
    benefits: [
      { metric: "100%", description: "Acesso ao Código", color: "text-brand-emerald-500" },
      { metric: "<45ms", description: "Latência Local", color: "text-brand-sapphire-500" },
      { metric: "72h", description: "Tempo de Deploy", color: "text-brand-purple-500" }
    ],
    concerns: [
      {
        concern: "Lock-in com fornecedores",
        solution: "Zero lock-in. O código e a infraestrutura são seus para sempre."
      },
      {
        concern: "Complexidade de manutenção",
        solution: "Entregamos a stack configurada com scripts de auto-healing e updates."
      },
      {
        concern: "Segurança dos dados",
        solution: "Dados nunca saem da sua VPS. Privacidade absoluta por design."
      }
    ]
  },
  ceo: {
    title: "Para o CEO Estratégico",
    subtitle: "Ativo proprietário real e valorização do valuation",
    icon: TrendingUp,
    color: "text-brand-emerald-600",
    gradient: "from-brand-emerald-500 to-brand-emerald-600",
    priorities: [
      {
        icon: TrendingUp,
        title: "Propriedade Intelectual",
        description: "Pare de alugar inteligência, comece a construir seu ativo próprio"
      },
      {
        icon: Users,
        title: "Autonomia Digital",
        description: "Independência total de APIs de terceiros e custos flutuantes"
      },
      {
        icon: BarChart3,
        title: "Valorização da Empresa",
        description: "Tecnologia proprietária aumenta o valuation do seu negócio"
      }
    ],
    ctaText: "Planejamento Estratégico",
    ctaSecondary: "Consultoria Executiva",
    benefits: [
      { metric: "Zero", description: "Licenças Mensais", color: "text-brand-emerald-500" },
      { metric: "Ativo", description: "IP Proprietária", color: "text-brand-sapphire-500" },
      { metric: "Speed", description: "Go-to-market Rápido", color: "text-brand-purple-500" }
    ],
    concerns: [
      {
        concern: "Dependência tecnológica",
        solution: "Sua empresa é dona da tecnologia. Sem surpresas de preço ou mudanças de regras."
      },
      {
        concern: "Continuidade de negócio",
        solution: "Infraestrutura robusta e documentada, sem risco de descontinuação de SaaS."
      },
      {
        concern: "Diferencial competitivo",
        solution: "Stack de IA exclusiva treinada nos seus dados, impossível de copiar."
      }
    ]
  },
  cfo: {
    title: "Para o CFO Analítico",
    subtitle: "Redução drástica de TCO e previsibilidade financeira",
    icon: DollarSign,
    color: "text-brand-purple-600",
    gradient: "from-brand-purple-500 to-brand-purple-600",
    priorities: [
      {
        icon: DollarSign,
        title: "Redução de OpEx",
        description: "Elimine mensalidades recorrentes de múltiplos SaaS"
      },
      {
        icon: BarChart3,
        title: "Investimento em CapEx",
        description: "Converta aluguel de software em ativo da empresa"
      },
      {
        icon: FileText,
        title: "Sem Custos Ocultos",
        description: "Custo fixo de VPS conhecido e controlado"
      }
    ],
    ctaText: "Análise de ROI vs SaaS",
    ctaSecondary: "Calculadora de Economia",
    benefits: [
      { metric: "-60%", description: "Redução TCO", color: "text-brand-emerald-500" },
      { metric: "Fixo", description: "Custo Infra", color: "text-brand-sapphire-500" },
      { metric: "6 meses", description: "Payback Estimado", color: "text-brand-purple-500" }
    ],
    concerns: [
      {
        concern: "Custo inicial vs recorrente",
        solution: "Investimento único de setup que se paga com a economia de mensalidades."
      },
      {
        concern: "Escalabilidade de custos",
        solution: "Custo de VPS escala linearmente e de forma muito mais barata que licenças por usuário."
      },
      {
        concern: "Risco do investimento",
        solution: "Tecnologia open-source standard de mercado (Docker, Python), sem risco de vendor lock-in."
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
      className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${isActive
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
        Dúvidas Estratégicas
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
            Impacto{' '}
            <span className="bg-gradient-to-r from-brand-ocean-600 to-brand-purple-600 bg-clip-text text-transparent">
              Estratégico
            </span>{' '}
            para Lideranças
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Entenda como a adoção de uma Stack de IA Própria transforma os objetivos da sua área
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
              Pronto para assumir o controle?
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Agende uma demonstração personalizada focada nas prioridades de {activePersona.toUpperCase()} e veja o ROI da soberania digital.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className={`bg-gradient-to-r ${personaContent[activePersona].gradient}`}
              >
                <Zap className="h-5 w-5 mr-2" />
                Demo para {activePersona.toUpperCase()}
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