import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { trackCTA } from '@/lib/analytics';
import ThemeToggle from './ui/theme-toggle';
import MobileNav from './navigation/MobileNav';
import {
  Shield, Brain, Fingerprint,
} from 'lucide-react';

const products = [
  { num: '01', name: 'Solana Protocol', desc: 'SP1 v6 ZK verifier + 6 Anchor programs', href: '/solana-protocol', icon: Fingerprint, color: 'text-brand-purple-400' },
  { num: '02', name: 'MCP Brain', desc: 'Compliance tools for AI agents', href: '/mcp', icon: Brain, color: 'text-brand-sapphire-400' },
  { num: '03', name: 'Compliance Engine', desc: 'LGPD/GDPR audit wizard', href: '/compliance-automate', icon: Shield, color: 'text-brand-emerald-400' },
];

export default function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-brand-chrome-900/95 backdrop-blur-md border-b border-brand-gray-200/50 dark:border-brand-platinum-800/50 shadow-lg"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <motion.a
            href="/"
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <div className="relative w-10 h-10 md:w-12 md:h-12">
              <img
                src="/images/logo-dpo2u.png"
                alt="DPO2U — Private AI Stack"
                className="object-contain w-full h-full"
              />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl md:text-2xl font-serif font-bold text-brand-gray-800 dark:text-white">
                DPO2U
              </h1>
              <p className="text-xs text-brand-gray-600 dark:text-brand-gray-400 -mt-1 hidden lg:block font-medium">
                Private AI Stack
              </p>
            </div>
          </motion.a>

          {/* Navigation — Desktop */}
          <nav className="hidden lg:flex items-center space-x-5">
            {[
              ...products.map(p => ({ name: p.name, href: p.href })),
              { name: 'Piloto', href: '/pilot' },
              { name: 'About', href: '/about' },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm text-brand-gray-700 dark:text-brand-gray-300 hover:text-brand-sapphire-600 dark:hover:text-brand-sapphire-400 transition-colors font-medium relative group whitespace-nowrap"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-sapphire-600 dark:bg-brand-sapphire-400 transition-all group-hover:w-full"></span>
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <a
              href="https://dpo2u.com.br"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-brand-gray-600 dark:text-brand-gray-400 hover:text-brand-sapphire-600 dark:hover:text-brand-sapphire-400 transition-colors border border-brand-gray-200 dark:border-brand-platinum-700 rounded-full px-3 py-1"
              aria-label="Mudar para versão em Português"
            >
              🇧🇷 PT
            </a>
            <ThemeToggle variant="minimal" className="mr-2" />
            <Button
              variant="primary"
              size="sm"
              className="hidden sm:inline-flex bg-brand-sapphire-600 hover:opacity-90 border-0 shadow-lg transform hover:scale-105 transition-all"
              onClick={() => {
                trackCTA('get_in_touch', 'header_desktop');
                window.location.href = 'mailto:contato@dpo2u.com.br';
              }}
            >
              Get in Touch
            </Button>
            <MobileNav />
          </div>
        </div>
      </div>

    </motion.header>
  );
}
