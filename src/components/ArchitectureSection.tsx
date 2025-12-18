"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Server, Code2, Database, Shield, Globe, Box, Workflow } from 'lucide-react';
import { Card } from '@/components/ui/card';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

function Level({
  label,
  title,
  description,
  accent,
}: {
  label: string;
  title: string;
  description: string;
  accent: 'blue' | 'green' | 'purple' | 'slate';
}) {
  const accentMap: Record<typeof accent, string> = {
    blue: 'from-primary/15 to-primary/5 border-primary/30',
    green: 'from-brand-green-500/15 to-brand-green-500/5 border-brand-green-500/30',
    purple: 'from-brand-purple-500/15 to-brand-purple-500/5 border-brand-purple-500/30',
    slate: 'from-slate-400/15 to-slate-400/5 border-slate-400/30',
  } as any;

  return (
    <motion.div variants={fadeInUp} className="relative">
      <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-slate-200 to-transparent" />
      <Card
        variant="elevated"
        padding="lg"
        className={`relative bg-gradient-to-br ${accentMap[accent]} backdrop-blur-sm`}
      >
        <div className="flex items-start gap-4">
          <div className="shrink-0 mt-1">
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-semibold shadow">
              {label}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
            <p className="text-slate-600 mt-1 text-sm leading-relaxed">{description}</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export default function ArchitectureSection() {
  return (
    <section id="architecture" className="bg-white dark:bg-slate-900 section-padding">
      <div className="container mx-auto container-padding">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center px-4 py-2 bg-slate-100 rounded-full mb-4">
            <Layers className="h-4 w-4 text-primary mr-2" />
            <span className="text-sm font-medium text-slate-700">Arquitetura da Solução</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-800 leading-tight">
            Sua Stack de IA em 4 Camadas
          </h2>
          <p className="text-slate-600 mt-4 max-w-3xl mx-auto">
            Uma fundação sólida e segura para suas aplicações de IA, construída sobre tecnologias open-source líderes de mercado.
          </p>
        </motion.div>

        {/* Diagram */}
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* Levels stack */}
          <div className="space-y-4 relative">
            <Level
              label="1"
              title="Infrastructure (VPS + Hardening)"
              description="Servidor virtual dedicado com configurações de segurança avançada, firewall UFW, fail2ban e chaves SSH para acesso seguro."
              accent="slate"
            />
            <Level
              label="2"
              title="Base Services (Docker Core)"
              description="Camada de orquestração de containers com Docker Swarm/Compose, garantindo isolamento e portabilidade."
              accent="blue"
            />
            <Level
              label="3"
              title="Routing & Security (Traefik)"
              description="Reverse Proxy inteligente com gestão automática de certificados HTTPS/TLS e roteamento dinâmico de serviços."
              accent="purple"
            />
            <Level
              label="4"
              title="Application Layer (App & AI)"
              description="Aplicações Next.js, APIs Python, bancos de dados e modelos de IA rodando em containers otimizados."
              accent="green"
            />
          </div>

          {/* Features Detail */}
          <div className="space-y-8">
            {/* Version Control */}
            <Card variant="elevated" padding="lg" hover>
              <div className="flex items-center gap-3 mb-3">
                <Code2 className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-slate-800">Seu GitHub Privado (Gitea)</h3>
              </div>
              <ul className="list-none space-y-2 text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-primary" />
                  <span><strong>Hospedagem de Código:</strong> Repositórios Git ilimitados em seu próprio servidor.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-primary" />
                  <span><strong>CI/CD Pipelines:</strong> Automação de testes e deploy integrados.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-primary" />
                  <span><strong>Colaboração:</strong> Review de código, issues e wiki para sua equipe.</span>
                </li>
              </ul>
            </Card>

            {/* Application Stack */}
            <Card variant="elevated" padding="lg" hover>
              <div className="flex items-center gap-3 mb-3">
                <Box className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-slate-800">Template de Aplicação Moderna</h3>
              </div>
              <ul className="list-disc pl-6 text-slate-700 space-y-2">
                <li><strong>Frontend Next.js:</strong> React, TypeScript, TailwindCSS - Rápido e SEO-friendly.</li>
                <li><strong>Backend Python:</strong> FastAPI para alta performance em APIs de IA.</li>
                <li><strong>Database:</strong> PostgreSQL ou Vector DB para dados corporativos.</li>
              </ul>
            </Card>

            {/* Security */}
            <Card variant="elevated" padding="lg" hover>
              <div className="flex items-center gap-3 mb-3">
                <Shield className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-slate-800">Segurança & Privacidade</h3>
              </div>
              <ul className="list-none space-y-2 text-slate-700">
                <li className="flex items-start gap-2">
                  <Globe className="h-4 w-4 mt-1 text-primary" />
                  <span><strong>HTTPS Automático:</strong> Certificados SSL renovados automaticamente.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Database className="h-4 w-4 mt-1 text-primary" />
                  <span><strong>Dados em Casa:</strong> Seus dados nunca saem da sua VPS sem permissão.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Server className="h-4 w-4 mt-1 text-primary" />
                  <span><strong>Backup e Restore:</strong> Estratégias de backup configuráveis para proteção total.</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
