"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Trophy, Rocket, Target, FileText, Timer, BarChart3, Shield, Server, Lock } from 'lucide-react';
import { Card } from '@/components/ui/card';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function OrchestrationFinalSection() {
  return (
    <section id="roadmap-implementacao" className="bg-gray-50 dark:bg-slate-900 section-padding">
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
            <span className="text-sm font-medium text-primary">Implementação Turnkey</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-gray-800 leading-tight">
            Sua Stack de IA Privada: Roadmap de Entrega em 72h
          </h2>
          <p className="text-gray-600 mt-4 max-w-3xl mx-auto">
            Transformamos seus servidores em uma potência de Inteligência Artificial com soberania total de dados.
            Do zero ao "Hello World" da sua IA corporativa em apenas 3 dias.
          </p>
        </motion.div>

        {/* Highlights */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {[
            { icon: Rocket, title: 'Deploy Acelerado', desc: 'Infraestrutura completa (Docker, Traefik, Gitea) instalada e configurada em 24-48h.' },
            { icon: Lock, title: 'Segurança Máxima', desc: 'Hardening de VPS, Firewalls, SSL Automático e sandboxing de aplicações.' },
            { icon: FileText, title: 'Autonomia Total', desc: 'Entrega de documentação técnica, credenciais root e repositórios de código fonte.' },
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
                <Server className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-slate-800">O Que Entregamos (Deliverables)</h3>
              </div>
              <ul className="list-none space-y-2 text-slate-700">
                <li className="flex items-start gap-2"><span className="mt-1.5 h-2 w-2 rounded-full bg-primary" /><span><strong>VPS Hardening</strong> — Configuração de segurança militar em seu servidor</span></li>
                <li className="flex items-start gap-2"><span className="mt-1.5 h-2 w-2 rounded-full bg-primary" /><span><strong>Stack Core</strong> — Docker Swarm/Compose, Traefik Proxy, Portainer</span></li>
                <li className="flex items-start gap-2"><span className="mt-1.5 h-2 w-2 rounded-full bg-primary" /><span><strong>DevTools Privados</strong> — Gitea (Git), Registry Privado, CI/CD Actions</span></li>
                <li className="flex items-start gap-2"><span className="mt-1.5 h-2 w-2 rounded-full bg-primary" /><span><strong>App Template</strong> — Next.js + FastAPI Starter Kit configurado</span></li>
              </ul>
            </Card>
          </motion.div>

          <motion.div variants={fadeInUp} initial="initial" whileInView="animate" viewport={{ once: true }}>
            <Card variant="elevated" padding="lg" hover>
              <div className="flex items-center gap-3 mb-3">
                <Shield className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-slate-800">Garantias do Projeto</h3>
              </div>
              <ul className="list-disc pl-6 text-slate-700 space-y-2">
                <li>Zero dependência externa (Lock-in Free)</li>
                <li>Auditoria de código e segurança inclusa</li>
                <li>Treinamento "Hand-over" para sua equipe de TI</li>
                <li>30 dias de suporte pós-implementação</li>
              </ul>
            </Card>
          </motion.div>
        </div>

        {/* Call to Action */}
        <motion.div variants={fadeInUp} initial="initial" whileInView="animate" viewport={{ once: true }} className="mt-10 text-center">
          <p className="text-sm text-gray-600 mb-4">Próximos passos: Agende uma call técnica para avaliarmos sua infraestrutura atual.</p>
          <a href="#contact" className="inline-flex items-center px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:opacity-95 transition">
            <Target className="h-4 w-4 mr-2" /> Agendar Avaliação Técnica
          </a>
        </motion.div>
      </div>
    </section>
  );
}
