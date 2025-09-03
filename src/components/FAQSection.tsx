'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ChevronDown, HelpCircle, Brain, Zap, Shield, Rocket } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

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

interface FAQ {
  question: string;
  answer: string;
  category: string;
  icon?: React.ReactNode;
}

const faqs: FAQ[] = [
  {
    category: "Sistema Multiagentes",
    icon: <Brain className="h-5 w-5" />,
    question: "Como funcionam os 145+ agentes especializados da DPO2U?",
    answer: "Nossa arquitetura híbrida de 4 níveis orquestra agentes especializados em Legal, Finance, Operations, Security e HR. O Master Orchestrator coordena spawning dinâmico baseado na carga de trabalho, com cada agente otimizado para domínios específicos e Machine Learning contínuo para máxima eficiência empresarial."
  },
  {
    category: "Sistema Multiagentes", 
    icon: <Brain className="h-5 w-5" />,
    question: "Qual a diferença entre AI Brain, Master Orchestrator e Agentes Especializados?",
    answer: "AI Brain (Nível 0) usa GPT-4o para raciocínio estratégico e tomada de decisões. Master Orchestrator (Nível 1) gerencia meta-orquestração e spawning de agentes. Agentes Especializados (Nível 2) coordenam domínios específicos. Workers (Nível 3) executam tarefas operacionais com compliance nativo."
  },
  {
    category: "Transformação Digital",
    icon: <Rocket className="h-5 w-5" />,
    question: "Como alcançam ROI de 400% em 12 meses?",
    answer: "Automatização de 90% dos processos empresariais críticos através de coordenação multiagente. Deploy em 72h elimina meses de implementação. Agentes especializados reduzem 75% do tempo em tarefas administrativas. Monitoramento 24/7 com compliance nativo previne multas e retrabalho."
  },
  {
    category: "Transformação Digital",
    icon: <Rocket className="h-5 w-5" />,
    question: "É possível implementar em empresas Fortune 500?",
    answer: "Sim, nossa arquitetura é enterprise-grade com deploy simultâneo em múltiplos países. Integramos SAP, Oracle, Microsoft e sistemas legados. Suporte a 15+ países simultaneamente com compliance LGPD/GDPR/SOX. Processamento paralelo enterprise-scale com failover automático."
  },
  {
    category: "Tecnologia & Integração",
    icon: <Zap className="h-5 w-5" />,
    question: "Como integram com nossa infraestrutura atual?",
    answer: "Agent Factory cria conectores personalizados para qualquer sistema. APIs REST/GraphQL nativas, WebHooks, integrações via MCP (Model Context Protocol) e conectores no-code. Compatível com cloud híbrida, on-premise e multi-cloud. Zero-downtime deployment com migração gradual."
  },
  {
    category: "Tecnologia & Integração", 
    icon: <Zap className="h-5 w-5" />,
    question: "Qual a tecnologia por trás do sistema LEANN?",
    answer: "LEANN (Legal Enterprise AI Neural Network) combina 2.856+ documentos jurídicos indexados com retrieval aumentado por IA. Pesquisa semântica em 0.85s, análise preditiva de riscos e geração automática de contratos e políticas com precisão de 99.8% validada por especialistas."
  },
  {
    category: "Segurança & Compliance",
    icon: <Shield className="h-5 w-5" />,
    question: "Como garantem segurança enterprise com multi-tenancy?",
    answer: "Zero Trust nativo com isolamento de agentes por tenant. Criptografia end-to-end, Multi-Factor Authentication para spawning de agentes, monitoramento de intrusão 24/7 e backups criptografados. Certificações ISO 27001, compliance LGPD/GDPR/SOX automático com audit trails completos."
  },
  {
    category: "Segurança & Compliance",
    icon: <Shield className="h-5 w-5" />,
    question: "Como funciona o compliance automático LGPD/GDPR?",
    answer: "Agentes especializados em compliance monitoram fluxos de dados em tempo real. Detecção automática de PII, classificação de sensibilidade, alertas preditivos de risco e geração automática de relatórios de impacto. DPO virtual ativo com decisões baseadas em jurisprudência atualizada."
  },
  {
    category: "Implementação & Suporte",
    icon: <HelpCircle className="h-5 w-5" />,
    question: "Como funciona o processo de implementação em 72h?",
    answer: "Dia 1: Diagnóstico automatizado via IA com mapeamento completo de processos. Dia 2: Configuração de agentes especializados e integração com sistemas existentes. Dia 3: Deploy em produção com testes de carga e ativação de monitoramento. Suporte 24/7 com SLA de 99.9% uptime."
  },
  {
    category: "Implementação & Suporte",
    icon: <HelpCircle className="h-5 w-5" />,
    question: "Que tipo de suporte oferecemos pós-implementação?",
    answer: "Session Manager com Obsidian preserva contexto zero-loss entre sessões. Suporte técnico especializado 24/7/365, atualizações automáticas de agentes, monitoramento preditivo com alertas proativos e otimização contínua baseada em ML. Roadmap conjunto com atualizações trimestrais."
  }
];

const categoryIcons = {
  "Sistema Multiagentes": <Brain className="h-5 w-5 text-blue-600" />,
  "Transformação Digital": <Rocket className="h-5 w-5 text-emerald-600" />,
  "Tecnologia & Integração": <Zap className="h-5 w-5 text-purple-600" />,
  "Segurança & Compliance": <Shield className="h-5 w-5 text-green-600" />,
  "Implementação & Suporte": <HelpCircle className="h-5 w-5 text-brand-sapphire-600" />
};

const FAQSection: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section className="section-padding bg-gradient-to-b from-white to-gray-50" id="faq">
      <div className="container mx-auto container-padding">
        <motion.div
          ref={ref}
          initial="initial"
          animate={inView ? "animate" : "initial"}
          variants={staggerContainer}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full mb-6">
              <HelpCircle className="h-4 w-4 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-blue-600">Perguntas Frequentes</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-text-dark mb-6">
              Entenda o{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Sistema Multiagentes DPO2U
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Respostas técnicas sobre nossa arquitetura híbrida 4-níveis, implementação enterprise 
              e como alcançamos 400% ROI com transformação digital + compliance nativo
            </p>
          </motion.div>

          {/* FAQ Categories */}
          <motion.div variants={fadeInUp} className="grid md:grid-cols-5 gap-4 mb-12">
            {Object.entries(categoryIcons).map(([category, icon]) => (
              <div key={category} className="flex items-center justify-center p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="flex flex-col items-center text-center">
                  {icon}
                  <span className="text-xs font-medium text-gray-700 mt-2 leading-tight">
                    {category}
                  </span>
                </div>
              </div>
            ))}
          </motion.div>

          {/* FAQ Accordion */}
          <motion.div variants={fadeInUp}>
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-white border border-gray-200 rounded-2xl px-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <AccordionTrigger className="py-6 text-left hover:no-underline group">
                    <div className="flex items-start space-x-4 text-left">
                      <div className="flex-shrink-0 mt-1">
                        {faq.icon || categoryIcons[faq.category as keyof typeof categoryIcons]}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-blue-600 mb-1">{faq.category}</div>
                        <div className="text-lg font-semibold text-brand-text-dark group-hover:text-blue-600 transition-colors">
                          {faq.question}
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-6 pt-0">
                    <div className="ml-9 text-gray-700 leading-relaxed">
                      {faq.answer}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>

          {/* CTA */}
          <motion.div variants={fadeInUp} className="text-center mt-12">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100">
              <h3 className="text-xl font-semibold text-brand-text-dark mb-4">
                Não encontrou sua resposta?
              </h3>
              <p className="text-gray-600 mb-6 max-w-xl mx-auto">
                Nossos especialistas técnicos estão prontos para demonstrar como nossa arquitetura 
                multiagente pode acelerar sua transformação digital
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-colors">
                  Assessment Técnico
                </button>
                <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors">
                  Contatar Especialista
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;