"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Network, Layers, Users, Shield, Sparkles, Workflow, Wrench } from 'lucide-react';
import { agents, sections } from '@/lib/agents';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

function SectionHeader({ icon: Icon, title, subtitle }: { icon: React.ElementType; title: string; subtitle?: string }) {
  return (
    <div className="text-center mb-12">
      <div className="inline-flex items-center px-4 py-2 bg-slate-100 rounded-full mb-4">
        <Icon className="h-4 w-4 text-primary-600 mr-2" />
        <span className="text-sm font-medium text-slate-700">{title}</span>
      </div>
      {subtitle && (
        <p className="text-slate-600 max-w-2xl mx-auto">{subtitle}</p>
      )}
    </div>
  );
}

function AgentCard({ id }: { id: string }) {
  const agent = agents.find((a) => a.id === id);
  if (!agent) return null;

  return (
    <motion.div variants={fadeInUp}>
      <Card variant="elevated" padding="lg" hover>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-800">{agent.name}</h3>
            <p className="text-sm text-slate-500 mt-1">{agent.role} • {agent.level}</p>
          </div>
          <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary-700 border border-primary/20">
            DPO2U
          </span>
        </div>
        <p className="text-slate-600 mt-4 text-sm leading-relaxed">{agent.description}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {agent.tools?.slice(0, 4).map((t) => (
            <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">{t}</span>
          ))}
        </div>
        {agent.kpis && (
          <div className="mt-4 text-xs text-slate-500">KPIs: {agent.kpis.join(' • ')}</div>
        )}
      </Card>
    </motion.div>
  );
}

export default function AgentsSection() {
  return (
    <section id="agents" className="bg-white dark:bg-slate-900 section-padding">
      <div className="container mx-auto container-padding">
        <SectionHeader icon={Users} title="Agentes DPO2U" subtitle="Arquitetura multiagente em 4 níveis: Estratégia → Orquestração → Especialização → Execução" />

        {/* Modal: Arquitetura de Classes (fonte única: lib/agents.ts) */}
        <div className="mb-8 flex justify-end">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Ver Arquitetura de Agentes</Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Arquitetura de Agentes (fonte única)</DialogTitle>
              </DialogHeader>
              <div className="grid sm:grid-cols-2 gap-4 max-h-[60vh] overflow-auto">
                {agents.map((a) => (
                  <Card key={a.id} variant="brand">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-slate-800 dark:text-white">{a.name}</h4>
                        <p className="text-xs text-slate-500 mt-1">{a.role} • {a.level}</p>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary-700 border border-primary/20">{a.id}</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">{a.description}</p>
                  </Card>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Estratégia */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="h-5 w-5 text-primary-600" />
            <h3 className="font-semibold text-slate-800">Nível 0 — Estratégia</h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sections.strategy.map((id) => (
              <AgentCard key={id} id={id} />
            ))}
          </div>
        </div>

        {/* Orquestração */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Network className="h-5 w-5 text-primary-600" />
            <h3 className="font-semibold text-slate-800">Nível 1 — Orquestração</h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sections.orchestration.map((id) => (
              <AgentCard key={id} id={id} />
            ))}
          </div>
        </div>

        {/* Orquestração Especializada */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Workflow className="h-5 w-5 text-primary-600" />
            <h3 className="font-semibold text-slate-800">Nível 2 — Orquestração Especializada</h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sections.specialized.map((id) => (
              <AgentCard key={id} id={id} />
            ))}
          </div>
        </div>

        {/* Execução (Conteúdo) */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-primary-600" />
            <h3 className="font-semibold text-slate-800">Nível 3 — Execução (Conteúdo)</h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sections.executionContent.map((id) => (
              <AgentCard key={id} id={id} />
            ))}
          </div>
        </div>

        {/* Execução (Técnico) */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Wrench className="h-5 w-5 text-primary-600" />
            <h3 className="font-semibold text-slate-800">Nível 3 — Execução (Técnico)</h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sections.executionTech.map((id) => (
              <AgentCard key={id} id={id} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
