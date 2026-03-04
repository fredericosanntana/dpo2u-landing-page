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
import { fadeInUp, staggerContainer } from '@/lib/animations';

interface FAQ {
  question: string;
  answer: string;
  category: string;
  icon?: React.ReactNode;
}

const faqs: FAQ[] = [
  {
    category: 'Infrastructure & Privacy',
    icon: <Server className="h-5 w-5" />,
    question: 'Why run your own AI stack on a private VPS?',
    answer: 'Total data sovereignty (your data, your rules), elimination of per-user SaaS costs, and unlimited customization. No vendor lock-in, full control over security and performance.',
  },
  {
    category: 'Infrastructure & Privacy',
    icon: <Server className="h-5 w-5" />,
    question: 'What is included in the stack delivery?',
    answer: 'We deliver the complete configured infrastructure: hardened VPS, Docker orchestration, Traefik as a secure gateway (automatic HTTPS), Gitea for private repositories, and a Next.js + Python application template ready to use.',
  },
  {
    category: 'Security & Compliance',
    icon: <Lock className="h-5 w-5" />,
    question: 'Does my data really never leave the server?',
    answer: 'Exactly. The entire stack runs inside your private VPS. Databases (PostgreSQL/Vector), code repositories, and local models are isolated in your infrastructure. No sensitive telemetry is sent to third parties.',
  },
  {
    category: 'Implementation',
    icon: <Rocket className="h-5 w-5" />,
    question: 'How long does implementation take?',
    answer: 'Our process is standardized and automated. In 48 to 72 hours we deliver your turnkey infrastructure with all services running, secured, and documented — ready for your development team.',
  },
  {
    category: 'Technical',
    icon: <Zap className="h-5 w-5" />,
    question: 'Do I need a dedicated DevOps team?',
    answer: 'No. The infrastructure is designed to be low-ops. We use Portainer for visual container management and Traefik for automatic routing. We also deliver complete documentation and offer optional support.',
  },
  {
    category: 'Technical',
    icon: <Zap className="h-5 w-5" />,
    question: 'Can I run open-source LLMs (Llama, Mistral)?',
    answer: 'Yes! The stack is Docker-based, allowing you to spin up Ollama, vLLM, or HuggingFace TGI containers easily, leveraging your VPS compute power to run private LLMs without API costs.',
  },
  {
    category: 'Security & Compliance',
    icon: <Shield className="h-5 w-5" />,
    question: 'Does the environment include backups and SSL?',
    answer: 'Yes. Traefik automatically manages SSL certificates (Let\'s Encrypt) for all domains. We also configure automatic backup scripts for databases and repositories.',
  },
  {
    category: 'Commercial',
    icon: <HelpCircle className="h-5 w-5" />,
    question: 'What are the recurring costs after implementation?',
    answer: 'The only mandatory recurring cost is the VPS (cloud provider of your choice: Hetzner, DigitalOcean, AWS, etc.) and domains. We do not charge monthly fees for the configured open-source software. You pay for implementation and setup.',
  },
];

const categoryIcons: Record<string, React.ReactNode> = {
  'Infrastructure & Privacy': <Server className="h-5 w-5 text-brand-sapphire-600" />,
  'Security & Compliance': <Shield className="h-5 w-5 text-brand-emerald-600" />,
  'Implementation': <Rocket className="h-5 w-5 text-brand-purple-600" />,
  'Technical': <Zap className="h-5 w-5 text-brand-sapphire-600" />,
  'Commercial': <HelpCircle className="h-5 w-5 text-brand-sapphire-600" />,
};

const FAQSection: React.FC = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section className="section-padding bg-gradient-to-b from-white to-brand-gray-50 dark:from-brand-chrome-900 dark:to-brand-chrome-800" id="faq">
      <div className="container mx-auto container-padding">
        <motion.div
          ref={ref}
          initial="initial"
          animate={inView ? 'animate' : 'initial'}
          variants={staggerContainer}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-brand-sapphire-100 dark:bg-brand-sapphire-900/30 rounded-full mb-6">
              <HelpCircle className="h-4 w-4 text-brand-sapphire-600 dark:text-brand-sapphire-400 mr-2" />
              <span className="text-sm font-medium text-brand-sapphire-600 dark:text-brand-sapphire-400">Frequently Asked Questions</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-text-dark dark:text-white mb-6">
              Questions About Your{' '}
              <span className="bg-gradient-to-r from-brand-sapphire-600 to-brand-purple-600 bg-clip-text text-transparent">
                Private Infrastructure
              </span>
            </h2>
            <p className="text-lg text-brand-gray-600 dark:text-brand-gray-400 max-w-3xl mx-auto">
              Everything you need to know about data sovereignty, VPS security, and taking control of your technology.
            </p>
          </motion.div>

          {/* Category Icons */}
          <motion.div variants={fadeInUp} className="grid grid-cols-3 md:grid-cols-5 gap-4 mb-12">
            {Object.entries(categoryIcons).map(([category, icon]) => (
              <div key={category} className="flex items-center justify-center p-4 bg-white dark:bg-brand-chrome-800 rounded-lg shadow-sm border border-brand-gray-100 dark:border-brand-platinum-800">
                <div className="flex flex-col items-center text-center">
                  {icon}
                  <span className="text-xs font-medium text-brand-gray-700 dark:text-brand-gray-300 mt-2 leading-tight">
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
                  className="bg-white dark:bg-brand-chrome-800 border border-brand-gray-200 dark:border-brand-platinum-800 rounded-2xl px-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <AccordionTrigger className="py-6 text-left hover:no-underline group">
                    <div className="flex items-start space-x-4 text-left">
                      <div className="flex-shrink-0 mt-1">
                        {faq.icon || categoryIcons[faq.category]}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-brand-sapphire-600 dark:text-brand-sapphire-400 mb-1">{faq.category}</div>
                        <div className="text-lg font-semibold text-brand-text-dark dark:text-white group-hover:text-brand-sapphire-600 transition-colors">
                          {faq.question}
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-6 pt-0">
                    <div className="ml-9 text-brand-gray-700 dark:text-brand-gray-300 leading-relaxed">
                      {faq.answer}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>

          {/* CTA */}
          <motion.div variants={fadeInUp} className="text-center mt-12">
            <div className="bg-gradient-to-r from-brand-sapphire-50 to-brand-purple-50 dark:from-brand-chrome-800 dark:to-brand-platinum-800 rounded-2xl p-8 border border-brand-sapphire-100 dark:border-brand-platinum-700">
              <h3 className="text-xl font-semibold text-brand-text-dark dark:text-white mb-4">
                Still have technical questions?
              </h3>
              <p className="text-brand-gray-600 dark:text-brand-gray-400 mb-6 max-w-xl mx-auto">
                Talk directly with our solution architects and understand if
                the DPO2U private stack is right for your needs.
              </p>
              <a
                href="mailto:contato@dpo2u.com.br"
                className="inline-flex px-6 py-3 bg-gradient-to-r from-brand-sapphire-600 to-brand-sapphire-700 text-white rounded-xl font-medium hover:from-brand-sapphire-700 hover:to-brand-sapphire-800 transition-colors"
              >
                Schedule Assessment
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
