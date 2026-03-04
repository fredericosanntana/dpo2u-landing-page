import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { trackCTA } from '@/lib/analytics';
import ThemeToggle from './ui/theme-toggle';
import MobileNav from './navigation/MobileNav';
import {
  Shield, Brain, Fingerprint, Coins, Lock, ChevronDown
} from 'lucide-react';

const products = [
  { num: '01', name: 'Compliance Engine', desc: 'Automated LGPD/GDPR compliance', href: '/compliance-automate', icon: Shield, color: 'text-emerald-400' },
  { num: '02', name: 'AI Compliance Brain', desc: '17 MCP tools for AI agents', href: '/mcp-brain', icon: Brain, color: 'text-blue-400' },
  { num: '03', name: 'ZK Compliance Protocol', desc: 'Zero-knowledge proofs on Midnight', href: '/midnight-protocol', icon: Fingerprint, color: 'text-purple-400' },
  { num: '04', name: 'Self-Funding Agents', desc: '$NIGHT/$DUST autonomous economics', href: '/self-funding-agent', icon: Coins, color: 'text-amber-400' },
  { num: '05', name: 'Private AI Stack', desc: 'On-chain security layer', href: '/private-stack', icon: Lock, color: 'text-cyan-400' },
];

export default function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-gray-200/50 dark:border-slate-700/50 shadow-lg"
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
              <p className="text-xs text-gray-600 dark:text-gray-400 -mt-1 hidden lg:block font-medium">
                Private AI Stack
              </p>
            </div>
          </motion.a>

          {/* Navigation — Desktop */}
          <nav className="hidden lg:flex items-center space-x-6">
            <a href="/" className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-brand-blue-400 transition-colors font-medium relative group">
              DPO2U
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary dark:bg-brand-blue-400 transition-all group-hover:w-full"></span>
            </a>

            {/* Products Dropdown */}
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-brand-blue-400 transition-colors font-medium relative group"
              >
                Products
                <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary dark:bg-brand-blue-400 transition-all group-hover:w-full"></span>
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-gray-200 dark:border-slate-700 overflow-hidden"
                  >
                    <div className="p-2">
                      {products.map((product) => (
                        <a
                          key={product.href}
                          href={product.href}
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors group"
                        >
                          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <product.icon className={`h-4 w-4 ${product.color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-mono text-slate-400">{product.num}</span>
                              <span className="text-sm font-semibold text-gray-800 dark:text-white">{product.name}</span>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{product.desc}</p>
                          </div>
                        </a>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <a href="/about" className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-brand-blue-400 transition-colors font-medium relative group">
              About
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
