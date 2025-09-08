"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Workflow, Timer, Image as ImageIcon, Database, FileText, ShieldCheck } from 'lucide-react';
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
            <span className="text-sm font-medium text-slate-700">Arquitetura em 4 Níveis</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-800 leading-tight">
            Estratégia → Orquestração → Especialização → Execução
          </h2>
          <p className="text-slate-600 mt-4 max-w-3xl mx-auto">
            Arquitetura hierárquica que combina inteligência estratégica, orquestração especializada e agentes de execução para resultados rápidos e consistentes com a marca.
          </p>
        </motion.div>

        {/* Diagram */}
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* Levels stack */}
          <div className="space-y-4 relative">
            <Level
              label="0"
              title="AI Brain (Estratégico) — OpenAI MCP Server"
              description="Inteligência estratégica, análise de contexto e direcionamento de alto nível para todo o sistema."
              accent="blue"
            />
            <Level
              label="1"
              title="Meta-Orchestration — Master Orchestrator"
              description="Coordenação híbrida, delegação dinâmica e criação de agentes sob demanda (Agent Factory)."
              accent="green"
            />
            <Level
              label="2"
              title="Orquestração Especializada — Claude/Task/Session Manager"
              description="Sessões com contexto global, execução local e backup completo de sessões com relatórios Markdown."
              accent="purple"
            />
            <Level
              label="3"
              title="Agentes de Execução — Conteúdo e Técnico"
              description="Copywriter, Visual Designer, Brand Designer e técnicos (arquitetura, dev, devops, segurança)."
              accent="slate"
            />
          </div>

          {/* Pipelines & Session Manager */}
          <div className="space-y-8">
            {/* Conteúdo */}
            <Card variant="elevated" padding="lg" hover>
              <div className="flex items-center gap-3 mb-3">
                <Timer className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-slate-800">Pipeline — Produção de Conteúdo (&lt; 15 min)</h3>
              </div>
              <ul className="list-none space-y-2 text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-primary" />
                  <span><strong>F1 Pesquisa:</strong> firecrawl-mcp, openai-mcp, web-search → keywords e tendências.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-primary" />
                  <span><strong>F2 Geração:</strong> copywriter-seo-geo → artigo master + adaptações; SEO ≥ 0.85.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-primary" />
                  <span><strong>F3 Visual:</strong> visual-designer → DALL·E 3 HD + HTML→JPG; múltiplos assets.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-primary" />
                  <span><strong>F4 Obsidian:</strong> organização PARA, cross-links e backup.</span>
                </li>
              </ul>
            </Card>

            {/* Visual Híbrido */}
            <Card variant="elevated" padding="lg" hover>
              <div className="flex items-center gap-3 mb-3">
                <ImageIcon className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-slate-800">Geração Visual Híbrida</h3>
              </div>
              <ul className="list-disc pl-6 text-slate-700 space-y-2">
                <li><strong>OpenAI DALL·E 3 HD</strong>: prompts brandados, 1792×1024.</li>
                <li><strong>HTML → JPG (Puppeteer)</strong>: controle total e identidade consistente.</li>
                <li>Seleção automática do melhor resultado por qualidade.</li>
              </ul>
            </Card>

            {/* Session Manager */}
            <Card variant="elevated" padding="lg" hover>
              <div className="flex items-center gap-3 mb-3">
                <Workflow className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-slate-800">Session Manager</h3>
              </div>
              <ul className="list-none space-y-2 text-slate-700">
                <li className="flex items-start gap-2">
                  <ShieldCheck className="h-4 w-4 mt-1 text-primary" />
                  <span><strong>Auto-detecção + logging contínuo</strong> com relatórios Markdown.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Database className="h-4 w-4 mt-1 text-primary" />
                  <span><strong>Recuperação completa</strong> de sessões (zero context loss).</span>
                </li>
                <li className="flex items-start gap-2">
                  <FileText className="h-4 w-4 mt-1 text-primary" />
                  <span>Métricas e status: tempo, ferramentas, arquivos e próximos passos.</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
