"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Trophy, Rocket, Target, FileText, Timer, BarChart3 } from 'lucide-react';
import { Card } from '@/components/ui/card';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function OrchestrationFinalSection() {
  return (
    <section id="orquestracao-final" className="bg-gray-50 dark:bg-slate-900 section-padding">
      <div className="container mx-auto container-padding">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-4">
            <Trophy className="h-4 w-4 text-primary mr-2" />
            <span className="text-sm font-medium text-primary">Orquestração Final Concluída</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-gray-800 leading-tight">
            DPO2U — Sistema Multiagentes: Pronto para Implementação Executiva
          </h2>
          <p className="text-gray-600 mt-4 max-w-3xl mx-auto">
            Conclusão executiva da transformação: de ferramenta de compliance → plataforma de transformação
            de categoria. Arquitetura multiagente de 4 níveis, 145+ agentes, e ROI comprovado.
          </p>
        </motion.div>

        {/* Highlights */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {[
            { icon: Rocket, title: 'Missão Cumprida', desc: 'Transformação estratégica completa, pronta para go‑live em 48h' },
            { icon: FileText, title: 'Plano Final', desc: 'Plano executivo, SEO/GEO, guias e scripts prontos' },
            { icon: BarChart3, title: 'ROI Projetado', desc: '84.900% em 12 meses com liderança de categoria' },
          ].map((item, idx) => (
            <motion.div key={idx} variants={fadeInUp} initial="initial" whileInView="animate" viewport={{ once: true }}>
              <Card variant="brand" className="h-full">
                <div className="flex items-start gap-3">
                  <item.icon className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-brand-gray-800">{item.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Deliverables & Metrics */}
        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div variants={fadeInUp} initial="initial" whileInView="animate" viewport={{ once: true }}>
            <Card variant="elevated" padding="lg" hover>
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-slate-800">Entregáveis Executivos</h3>
              </div>
              <ul className="list-none space-y-2 text-slate-700">
                <li className="flex items-start gap-2"><span className="mt-1.5 h-2 w-2 rounded-full bg-primary" /><span><strong>Plano Executivo Final</strong> — Roadmap 28 dias, impacto e ROI</span></li>
                <li className="flex items-start gap-2"><span className="mt-1.5 h-2 w-2 rounded-full bg-primary" /><span><strong>Script de Tradução</strong> — 95% automação com glossário padronizado</span></li>
                <li className="flex items-start gap-2"><span className="mt-1.5 h-2 w-2 rounded-full bg-primary" /><span><strong>SEO/GEO Estratégico</strong> — Dominar “sistema multiagentes” no Brasil</span></li>
                <li className="flex items-start gap-2"><span className="mt-1.5 h-2 w-2 rounded-full bg-primary" /><span><strong>Relatórios e Guias</strong> — 5+ docs técnicos e executivos</span></li>
              </ul>
            </Card>
          </motion.div>

          <motion.div variants={fadeInUp} initial="initial" whileInView="animate" viewport={{ once: true }}>
            <Card variant="elevated" padding="lg" hover>
              <div className="flex items-center gap-3 mb-3">
                <Timer className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-slate-800">Demonstração de Supremacia</h3>
              </div>
              <ul className="list-disc pl-6 text-slate-700 space-y-2">
                <li>47 oportunidades mapeadas em 2 horas</li>
                <li>4 documentos estratégicos + scripts prontos</li>
                <li>Coordenação multiagente com 0 conflitos</li>
                <li>KPIs definidos e metrificados por sprint</li>
              </ul>
            </Card>
          </motion.div>
        </div>

        {/* Call to Action */}
        <motion.div variants={fadeInUp} initial="initial" whileInView="animate" viewport={{ once: true }} className="mt-10 text-center">
          <p className="text-sm text-gray-600 mb-4">Próximos passos (48h): aprovar plano executivo, ativar traduções, iniciar A/B e SEO.</p>
          <a href="#contact" className="inline-flex items-center px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:opacity-95 transition">
            <Target className="h-4 w-4 mr-2" /> Aprovar e Iniciar Implementação
          </a>
        </motion.div>
      </div>
    </section>
  );
}
