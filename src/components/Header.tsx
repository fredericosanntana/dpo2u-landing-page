'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { trackCTA } from '@/lib/analytics';
import ThemeToggle from './ui/theme-toggle';

export default function Header() {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-gray-200/50 dark:border-slate-700/50 shadow-lg"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo DPO2U */}
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <div className="relative w-10 h-10 md:w-12 md:h-12">
              <Image
                src="/images/logo-dpo2u.png"
                alt="DPO2U - Transformação Digital com Privacidade e IA"
                fill
                className="object-contain"
                priority
                sizes="(max-width: 768px) 40px, 48px"
              />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl md:text-2xl font-serif font-bold text-brand-gray-800">
                DPO2U
              </h1>
              <p className="text-xs text-gray-600 -mt-1 hidden md:block">
                Legal Tech + IA
              </p>
            </div>
          </motion.div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#about" className="text-gray-700 hover:text-primary transition-colors font-medium relative group">
              Sobre
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </a>
            <a href="#services" className="text-gray-700 hover:text-primary transition-colors font-medium relative group">
              Serviços
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </a>
            <a href="#benefits" className="text-gray-700 hover:text-primary transition-colors font-medium relative group">
              Benefícios  
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </a>
            <a href="#cases" className="text-gray-700 hover:text-primary transition-colors font-medium relative group">
              Cases
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </a>
            <a href="/lgpd" className="text-gray-700 hover:text-primary transition-colors font-medium relative group">
              LGPD
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </a>
            <a href="/privacy" className="text-gray-700 hover:text-primary transition-colors font-medium relative group">
              Privacidade
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </a>
            <a href="/terms" className="text-gray-700 hover:text-primary transition-colors font-medium relative group">
              Termos
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <ThemeToggle variant="minimal" className="mr-2" />
            <Button
              variant="primary"
              size="sm"
              className="hidden sm:inline-flex bg-primary hover:opacity-90 border-0 shadow-lg transform hover:scale-105 transition-all"
              onClick={() => trackCTA('consultoria_executiva', 'header_desktop')}
            >
              Agendar Consultoria Executive
            </Button>
            <Button
              variant="primary"
              size="sm"
              className="sm:hidden px-3 bg-primary hover:opacity-90 border-0"
              onClick={() => trackCTA('demo_30min', 'header_mobile')}
            >
              Consulta 30min
            </Button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
