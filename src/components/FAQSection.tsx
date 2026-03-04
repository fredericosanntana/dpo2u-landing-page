'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { HelpCircle, Server, Zap, Shield, Rocket, Lock } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const staggerContainer = {
  animate: {
    transition: { staggerChildren: 0.1 },
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
    category: 'Infraestrutura & VPS',
    icon: <Server className="h-5 w-5" />,
    question: 'Por que ter minha própria Stack de IA em VPS?',
    answer:
      'Soberania total (seus dados, suas regras), eliminação de custos recorrentes por usuário (SaaS) e personalização ilimitada. Você não fica preso a fornecedores (Vendor Lock-in) e tem controle total sobre segurança e performance.',
  },
  {
    category: 'Infraestrutura & VPS',
    icon: <Server className="h-5 w-5" />,
    question: 'O que está incluído na entrega da Stack?',
    answer:
      'Entregamos a infraestrutura completa configurada: Servidor VPS com hardening de segurança, Docker Swarm para orquestração, Traefik como Gateway seguro (HTTPS automático), Gitea para seus repositórios privados e um Template de Aplicação Next.js + Python pronto para uso.',
  },
  {
    category: 'Segurança & Privacidade',
    icon: <Lock className="h-5 w-5" />,
    question: 'Meus dados realmente não saem do servidor?',
    answer:
      'Exatamente. Toda a stack roda dentro da sua VPS privada. Os bancos de dados (PostgreSQL/Vector), repositórios de código e modelos locais (se aplicável) ficam isolados em sua infraestrutura. Nenhuma telemetria sensível é enviada para terceiros.',
  },
  {
    category: 'Implementação',
    icon: <Rocket className="h-5 w-5" />,
    question: 'Quanto tempo demora para implementar?',
    answer:
      'Nosso processo é padronizado e automatizado. Em 48 a 72 horas entregamos sua infraestrutura "Turnkey" (Chave na Mão), com todos os serviços rodando, seguros e documentados, prontos para sua equipe de desenvolvimento.',
  },
  {
    category: 'Técnico',
    icon: <Zap className="h-5 w-5" />,
    question: 'Preciso de uma equipe de DevOps dedicada?',
    answer:
      'Não. A estrutura é desenhada para ser "Low Ops". Usamos Portainer para gestão visual de containers e Traefik para roteamento automático. Além disso, entregamos documentação completa para operações básicas e oferecemos suporte opcional.',
  },
  {
    category: 'Técnico',
    icon: <Zap className="h-5 w-5" />,
    question: 'Posso instalar modelos Open Source (Llama, Mistral)?',
    answer:
      'Sim! A stack é baseada em Docker, permitindo que você suba containers de Ollama, vLLM ou HuggingFace TGI facilmente, aproveitando o poder computacional da sua VPS para rodar LLMs privados sem custo de API.',
  },
  {
    category: 'Segurança & Privacidade',
    icon: <Shield className="h-5 w-5" />,
    question: 'O ambiente possui Backup e SSL?',
    answer:
      'Sim. O Traefik gerencia automaticamente certificados SSL (Let\'s Encrypt) para todos os domínios. Configuramos também scripts de backup automático para bancos de dados e repositórios, que podem ser enviados para S3 externo ou armazenamento local.',
  },
  {
    category: 'Comercial',
    icon: <HelpCircle className="h-5 w-5" />,
    question: 'Qual o custo recorrente após a implementação?',
    answer:
      'O único custo recorrente obrigatório é o da VPS (Cloud Provider de sua escolha, como Hetzner, DigitalOcean ou AWS) e domínios. Não cobramos mensalidade pelo uso do software open-source configurado. Você paga pela implementação e setup.',
  },
];

/* Mapeamento categoria → ícone + cor (usando tokens de marca) */
const categoryConfig: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  'Infraestrutura & VPS': {
    icon: <Server className="h-5 w-5 text-brand-blue-500" />,
    color: 'text-brand-blue-600',
    bg: 'bg-brand-blue-50',
  },
  'Segurança & Privacidade': {
    icon: <Shield className="h-5 w-5 text-brand-green-500" />,
    color: 'text-brand-green-600',
    bg: 'bg-brand-green-50',
  },
  Implementação: {
    icon: <Rocket className="h-5 w-5 text-brand-purple-500" />,
    color: 'text-brand-purple-600',
    bg: 'bg-brand-purple-50',
  },
  Técnico: {
    icon: <Zap className="h-5 w-5 text-brand-blue-500" />,
    color: 'text-brand-blue-600',
    bg: 'bg-brand-blue-50',
  },
  Comercial: {
    icon: <HelpCircle className="h-5 w-5 text-brand-gray-500" />,
    color: 'text-brand-gray-600',
    bg: 'bg-brand-gray-100',
  },
};

const FAQSection: React.FC = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section className="section-padding bg-gradient-to-b from-white to-brand-gray-50" id="faq">
      <div className="container mx-auto container-padding">
        <motion.div
          ref={ref}
          initial="initial"
          animate={inView ? 'animate' : 'initial'}
          variants={staggerContainer}
          className="max-w-4xl mx-auto"
        >
          {/* Cabeçalho */}
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-brand-blue-50 rounded-full mb-6 border border-brand-blue-100">
              <HelpCircle className="h-4 w-4 text-brand-blue-500 mr-2" />
              <span className="text-sm font-medium text-brand-blue-600">Perguntas Frequentes</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-display font-bold text-brand-gray-900 mb-6">
              Dúvidas sobre sua{' '}
              <span className="text-brand-gradient">
                Infraestrutura Privada
              </span>
            </h2>

            <p className="text-lg text-brand-gray-600 max-w-3xl mx-auto">
              Tudo o que você precisa saber sobre soberania de dados, segurança em VPS e como
              assumir o controle da sua tecnologia.
            </p>
          </motion.div>

          {/* Categorias */}
          <motion.div variants={fadeInUp} className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-12">
            {Object.entries(categoryConfig).map(([category, cfg]) => (
              <div
                key={category}
                className={`flex flex-col items-center justify-center p-4 ${cfg.bg} rounded-xl border border-brand-gray-200/60 text-center`}
              >
                {cfg.icon}
                <span className={`text-xs font-medium ${cfg.color} mt-2 leading-tight`}>
                  {category}
                </span>
              </div>
            ))}
          </motion.div>

          {/* Accordion */}
          <motion.div variants={fadeInUp}>
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((faq, index) => {
                const cfg = categoryConfig[faq.category] ?? categoryConfig['Comercial'];
                return (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="bg-white border border-brand-gray-200 rounded-2xl px-6 shadow-subtle hover:shadow-card transition-shadow"
                  >
                    <AccordionTrigger className="py-6 text-left hover:no-underline group">
                      <div className="flex items-start space-x-4 text-left">
                        <div className={`flex-shrink-0 mt-1 p-2 rounded-lg ${cfg.bg}`}>
                          {faq.icon || cfg.icon}
                        </div>
                        <div className="flex-1">
                          <div className={`text-xs font-semibold uppercase tracking-wide ${cfg.color} mb-1`}>
                            {faq.category}
                          </div>
                          <div className="text-base font-semibold text-brand-gray-900 group-hover:text-brand-blue-500 transition-colors leading-snug">
                            {faq.question}
                          </div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-6 pt-0">
                      <div className="ml-14 text-brand-gray-600 leading-relaxed text-sm">
                        {faq.answer}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </motion.div>

          {/* CTA */}
          <motion.div variants={fadeInUp} className="text-center mt-12">
            <div className="bg-gradient-to-r from-brand-blue-50 to-brand-purple-50 rounded-2xl p-8 border border-brand-blue-100">
              <h3 className="text-xl font-display font-semibold text-brand-gray-900 mb-3">
                Ainda tem dúvidas técnicas?
              </h3>
              <p className="text-brand-gray-600 mb-6 max-w-xl mx-auto text-sm">
                Fale diretamente com nossos arquitetos de solução e entenda se a Stack Privada
                DPO2U é ideal para seu momento.
              </p>
              <Button variant="primary" size="lg">
                Agendar Avaliação Gratuita
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
