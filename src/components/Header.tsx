import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { trackCTA } from '@/lib/analytics';
import ThemeToggle from './ui/theme-toggle';

const navLinks = [
  { label: 'Sobre',      href: '#about' },
  { label: 'Serviços',   href: '#services' },
  { label: 'Benefícios', href: '#benefits' },
  { label: 'FAQ',        href: '#faq' },
  { label: 'MCP',        href: '/mcp' },
  { label: 'Kit LGPD',   href: '/kit-lgpd' },
  { label: 'ERC-8004',   href: '/erc8004' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-brand-gray-900/95 backdrop-blur-md border-b border-brand-gray-200/60 dark:border-brand-gray-700/60 shadow-subtle"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Logo */}
          <motion.a
            href="/"
            className="flex items-center space-x-3 group"
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            <div className="relative w-10 h-10 md:w-11 md:h-11 flex-shrink-0">
              <img
                src="/images/logo-dpo2u.png"
                alt="DPO2U"
                className="object-contain w-full h-full"
              />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-lg md:text-xl font-display font-bold text-brand-gray-900 dark:text-white">
                DPO2U{' '}
                <span className="text-brand-blue-500 dark:text-brand-blue-400 font-semibold text-base">
                  Legal Tech
                </span>
              </span>
              <span className="text-xs text-brand-gray-500 dark:text-brand-gray-400 hidden lg:block font-medium tracking-tight">
                Stack de IA Privada &amp; Soberana
              </span>
            </div>
          </motion.a>

          {/* Navegação Desktop */}
          <nav className="hidden md:flex items-center space-x-1" aria-label="Navegação principal">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="relative px-3 py-2 text-sm font-medium text-brand-gray-600 dark:text-brand-gray-300 hover:text-brand-blue-500 dark:hover:text-brand-blue-400 transition-colors rounded-md hover:bg-brand-blue-50 dark:hover:bg-brand-gray-800 group"
              >
                {link.label}
                <span className="absolute bottom-0.5 left-3 right-3 h-0.5 bg-brand-blue-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-full" />
              </a>
            ))}
          </nav>

          {/* Ações */}
          <div className="flex items-center space-x-2">
            <ThemeToggle variant="minimal" className="mr-1" />

            <Button
              variant="primary"
              size="sm"
              className="hidden sm:inline-flex shadow-brand hover:shadow-brand-lg transition-shadow"
              onClick={() => trackCTA('consultoria_executiva', 'header_desktop')}
            >
              Agendar Consultoria
            </Button>

            <Button
              variant="primary"
              size="sm"
              className="sm:hidden"
              onClick={() => trackCTA('demo_30min', 'header_mobile')}
            >
              Consulta
            </Button>

            {/* Botão menu mobile */}
            <button
              className="md:hidden p-2 rounded-md text-brand-gray-600 dark:text-brand-gray-300 hover:bg-brand-gray-100 dark:hover:bg-brand-gray-800 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Menu Mobile */}
        {mobileOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-brand-gray-200 dark:border-brand-gray-700 py-4"
            aria-label="Navegação mobile"
          >
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-4 py-3 text-sm font-medium text-brand-gray-700 dark:text-brand-gray-200 hover:text-brand-blue-500 hover:bg-brand-blue-50 dark:hover:bg-brand-gray-800 rounded-lg transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-2 px-4">
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    trackCTA('consultoria_executiva', 'header_mobile_menu');
                    setMobileOpen(false);
                  }}
                >
                  Agendar Consultoria
                </Button>
              </div>
            </div>
          </motion.nav>
        )}
      </div>
    </motion.header>
  );
}
