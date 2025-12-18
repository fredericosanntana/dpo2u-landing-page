'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ChevronDown, HelpCircle, Server, Zap, Shield, Rocket, Lock } from 'lucide-react';
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
    category: "Infraestrutura & VPS",
    icon: <Server className="h-5 w-5" />,
    question: "Por que ter minha própria Stack de IA em VPS?",
    answer: "Soberania total (seus dados, suas regras), eliminação de custos recorrentes por usuário (SaaS) e personalização ilimitada. Você não fica preso a fornecedores (Vendor Lock-in) e tem controle total sobre segurança e performance."
  },
  {
    category: "Infraestrutura & VPS",
    icon: <Server className="h-5 w-5" />,
    question: "O que está incluído na entrega da Stack?",
    answer: "Entregamos a infraestrutura completa configurada: Servidor VPS com hardening de segurança, Docker Swarm para orquestração, Traefik como Gateway seguro (HTTPS automático), Gitea para seus repositórios privados e um Template de Aplicação Next.js + Python pronto para uso."
  },
  {
    category: "Segurança & Privacidade",
    icon: <Lock className="h-5 w-5" />,
    question: "Meus dados realmente não saem do servidor?",
    answer: "Exatamente. Toda a stack roda dentro da sua VPS privada. Os bancos de dados (PostgreSQL/Vector), repositórios de código e modelos locais (se aplicável) ficam isolados em sua infraestrutura. Nenhuma telemetria sensível é enviada para terceiros."
  },
  {
    category: "Implementação",
    icon: <Rocket className="h-5 w-5" />,
    question: "Quanto tempo demora para implementar?",
    answer: "Nosso processo é padronizado e automatizado. Em 48 a 72 horas entregamos sua infraestrutura 'Turnkey' (Chave na Mão), com todos os serviços rodando, seguros e documentados, prontos para sua equipe de desenvolvimento."
  },
  {
    category: "Técnico",
    icon: <Zap className="h-5 w-5" />,
    question: "Preciso de uma equipe de DevOps dedicada?",
    answer: "Não. A estrutura é desenhada para ser 'Low Ops'. Usamos Portainer para gestão visual de containers e Traefik para roteamento automático. Além disso, entregamos documentação completa para operações básicas e oferecemos suporte opcional."
  },
  {
    category: "Técnico",
    icon: <Zap className="h-5 w-5" />,
    question: "Posso instalar modelos Open Source (Llama, Mistral)?",
    answer: "Sim! A stack é baseada em Docker, permitindo que você suba containers de Ollama, vLLM ou HuggingFace TGI facilmente, aproveitando o poder computacional da sua VPS para rodar LLMs privados sem custo de API."
  },
  {
    category: "Segurança & Privacidade",
    icon: <Shield className="h-5 w-5" />,
    question: "O ambiente possui Backup e SSL?",
    answer: "Sim. O Traefik gerencia automaticamente certificados SSL (Let's Encrypt) para todos os domínios. Configuramos também scripts de backup automático para bancos de dados e repositórios, que podem ser enviados para S3 externo ou armazenamento local."
  },
  {
    category: "Comercial",
    icon: <HelpCircle className="h-5 w-5" />,
    question: "Qual o custo recorrente após a implementação?",
    answer: "O único custo recorrente obrigatório é o da VPS (Cloud Provider de sua escolha, como Hetzner, DigitalOcean ou AWS) e domínios. Não cobramos mensalidade pelo uso do software open-source configurado. Você paga pela implementação e setup."
  }
];

const categoryIcons = {
  "Infraestrutura & VPS": <Server className="h-5 w-5 text-blue-600" />,
  "Segurança & Privacidade": <Shield className="h-5 w-5 text-emerald-600" />,
  "Implementação": <Rocket className="h-5 w-5 text-purple-600" />,
  "Técnico": <Zap className="h-5 w-5 text-amber-600" />,
  "Comercial": <HelpCircle className="h-5 w-5 text-brand-sapphire-600" />
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
              Dúvidas sobre sua{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Infraestrutura Privada
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Tudo o que você precisa saber sobre soberania de dados, segurança em VPS e como assumir o controle da sua tecnologia.
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
                Ainda tem dúvidas técnicas?
              </h3>
              <p className="text-gray-600 mb-6 max-w-xl mx-auto">
                Fale diretamente com nossos arquitetos de solução e entenda se a Stack Privada DPO2U é ideal para seu momento.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-colors">
                  Agendar Avaliação
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