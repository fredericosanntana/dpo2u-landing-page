'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Shield, Brain, ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatsCard } from '@/components/ui/card';

// Animation variants
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

// Enhanced Hero Section with shadcn/ui + DPO2U components
export default function EnhancedHeroSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.section
      ref={ref}
      initial="initial"
      animate={inView ? "animate" : "initial"}
      variants={staggerContainer}
      className="relative min-h-screen flex items-center overflow-hidden bg-gradient-premium"
    >
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-brand-sapphire-500/10 via-brand-emerald-500/5 to-transparent"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-sapphire-500/15 rounded-full blur-3xl animate-pulse-subtle"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-brand-emerald-500/10 rounded-full blur-3xl animate-float"></div>
        
        {/* New geometric overlays */}
        <div className="absolute top-20 left-20 w-32 h-32 border border-brand-sapphire-400/20 rotate-45 animate-spin" style={{ animationDuration: '20s' }}></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 border border-brand-emerald-400/20 rotate-12 animate-bounce" style={{ animationDuration: '3s' }}></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Enhanced Content */}
          <div className="text-white">
            {/* Enhanced Badge with glassmorphism */}
            <motion.div variants={fadeInUp}>
              <Badge 
                variant="glassmorphism" 
                size="xl"
                className="mb-8 px-6 py-3"
              >
                <Shield className="h-5 w-5 mr-3" />
                Líder Absoluto em Legal Tech + IA
              </Badge>
            </motion.div>

            {/* Enhanced Title */}
            <motion.h1 
              variants={fadeInUp}
              className="text-5xl md:text-6xl lg:text-8xl font-serif font-bold mb-8 leading-none"
            >
              <span className="bg-gradient-to-r from-brand-sapphire-400 via-brand-emerald-400 to-brand-sapphire-500 bg-clip-text text-transparent">
                Revolução
              </span>{' '}
              <br />
              <span className="text-white">Digital com</span>
              <br />
              <span className="bg-gradient-to-r from-brand-emerald-400 to-brand-ocean-400 bg-clip-text text-transparent">
                IA Avançada
              </span>
            </motion.h1>
            
            {/* Enhanced Description */}
            <motion.p 
              variants={fadeInUp}
              className="text-xl md:text-2xl mb-10 text-brand-platinum-300 leading-relaxed max-w-3xl font-light"
            >
              Ecossistema multiagente de{' '}
              <span className="text-primary font-medium">inteligência artificial</span>{' '}
              que transforma compliance LGPD/GDPR em{' '}
              <span className="text-primary font-medium">vantagem competitiva estratégica</span>{' '}
              para empresas visionárias.
            </motion.p>

            {/* Enhanced Stats with new StatsCard */}
            <motion.div 
              variants={fadeInUp}
              className="grid grid-cols-3 gap-6 mb-12"
            >
              <StatsCard
                title="Conformidade Total"
                value="99.9%"
                color="text-brand-emerald-400"
              />
              <StatsCard
                title="Deploy Ágil"
                value="24h"
                color="text-brand-sapphire-400"
              />
              <StatsCard
                title="ROI Enterprise"
                value="400%"
                color="text-brand-ocean-400"
              />
            </motion.div>

            {/* Enhanced CTA Buttons */}
            <motion.div 
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-6"
            >
              <Button
                variant="cta-primary"
                size="hero"
                rightIcon={<ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />}
                className="group"
              >
                Consultoria Executive
              </Button>
              
              <Button
                variant="cta-secondary"
                size="hero"
                className="group"
              >
                <Brain className="h-5 w-5 mr-3 group-hover:rotate-12 transition-transform" />
                Consulta Estratégica
              </Button>
            </motion.div>

            {/* Enhanced Trust Badge */}
            <motion.div 
              variants={fadeInUp}
              className="mt-8 flex items-center gap-4"
            >
              <Badge variant="success" size="lg">
                <Star className="h-3 w-3 mr-2 fill-current" />
                Consultoria estratégica sem custo
              </Badge>
              <div className="text-slate-400 text-sm">
                • Avaliação personalizada • Resultados em 72h
              </div>
            </motion.div>
          </div>

          {/* Right Column - Enhanced Dashboard Preview */}
          <motion.div 
            variants={fadeInUp}
            className="relative lg:block hidden"
          >
            <div className="relative w-full h-96 lg:h-[500px]">
              {/* Enhanced Dashboard with glassmorphism */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 rounded-3xl backdrop-blur-lg border border-white/20 shadow-2xl">
                <div className="p-6 h-full">
                  {/* Enhanced Header with badges */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-brand-green-500 rounded-lg flex items-center justify-center">
                        <Shield className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="text-white font-semibold">DPO2U Platform</div>
                        <Badge variant="status-active" size="sm" className="mt-1">
                          AI-Powered Compliance
                        </Badge>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Badge variant="status-active" size="sm">Online</Badge>
                      <Badge variant="premium" size="sm">Pro</Badge>
                    </div>
                  </div>
                  
                  {/* Enhanced Content */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-emerald-500/15 rounded-xl p-4 border border-emerald-500/25">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-emerald-300 text-sm font-medium">Compliance Score</div>
                          <Badge variant="status-completed" size="sm">Active</Badge>
                        </div>
                        <div className="text-2xl font-bold text-white">99.8%</div>
                      </div>
                      <div className="bg-blue-500/15 rounded-xl p-4 border border-blue-500/25">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-blue-300 text-sm font-medium">Risk Level</div>
                          <Badge variant="success" size="sm">Low</Badge>
                        </div>
                        <div className="text-2xl font-bold text-white">Mínimo</div>
                      </div>
                    </div>
                    
                    <div className="bg-slate-500/15 rounded-xl p-4 border border-slate-500/25">
                      <div className="text-slate-300 text-sm mb-2 font-medium">Status IA</div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Brain className="h-4 w-4 text-blue-400 animate-pulse" />
                          <div className="text-white text-sm">Monitoramento ativo</div>
                        </div>
                        <Badge variant="info" size="sm">145 Agentes</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}