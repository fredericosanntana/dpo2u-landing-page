

import React from 'react';

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
              <div className="relative w-10 h-10 md:w-12 md:h-12">
                <img
                  src="/images/logo-dpo2u.png"
                  alt="DPO2U - Transformação Digital com Privacidade e IA"
                  className="object-contain w-full h-full"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl md:text-2xl font-serif font-bold text-brand-gray-800 dark:text-white">
                DPO2U <span className="text-brand-blue-600 dark:text-brand-blue-400 font-semibold">(Legal Tech)</span> <span className="text-gray-400 dark:text-gray-500">—</span> <span className="text-brand-emerald-600 dark:text-brand-emerald-400 font-medium">Stack de IA Privada</span>
              </h1>
              <p className="text-xs text-gray-600 dark:text-gray-400 -mt-1 hidden lg:block font-medium">
                Transformação Digital com Infraestrutura 100% Soberana
              </p>
            </div>
          </motion.div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#about" className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-brand-blue-400 transition-colors font-medium relative group">
              Sobre
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary dark:bg-brand-blue-400 transition-all group-hover:w-full"></span>
            </a>
            <a href="#services" className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-brand-blue-400 transition-colors font-medium relative group">
              Serviços
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary dark:bg-brand-blue-400 transition-all group-hover:w-full"></span>
            </a>
            <a href="#benefits" className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-brand-blue-400 transition-colors font-medium relative group">
              Benefícios
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary dark:bg-brand-blue-400 transition-all group-hover:w-full"></span>
            </a>
            <a href="#cases" className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-brand-blue-400 transition-colors font-medium relative group">
              Cases
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary dark:bg-brand-blue-400 transition-all group-hover:w-full"></span>
            </a>
            <a href="/mcp" className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-brand-blue-400 transition-colors font-medium relative group">
              MCP
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary dark:bg-brand-blue-400 transition-all group-hover:w-full"></span>
            </a>
            <a href="/kit-lgpd" className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-brand-blue-400 transition-colors font-medium relative group">
              Kit LGPD
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary dark:bg-brand-blue-400 transition-all group-hover:w-full"></span>
            </a>
            <a href="/lgpd" className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-brand-blue-400 transition-colors font-medium relative group">
              LGPD
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary dark:bg-brand-blue-400 transition-all group-hover:w-full"></span>
            </a>
            <a href="/privacy" className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-brand-blue-400 transition-colors font-medium relative group">
              Privacidade
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary dark:bg-brand-blue-400 transition-all group-hover:w-full"></span>
            </a>
            <a href="/terms" className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-brand-blue-400 transition-colors font-medium relative group">
              Termos
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary dark:bg-brand-blue-400 transition-all group-hover:w-full"></span>
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
              Agendar Consultoria Executiva
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
