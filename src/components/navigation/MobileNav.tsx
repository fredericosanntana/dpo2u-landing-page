'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  Shield,
  Brain,
  Fingerprint,
  Coins,
  Lock,
  Users,
  ChevronRight,
  ChevronDown,
  Mail,
  type LucideIcon
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

interface NavItem {
  title: string;
  href: string;
  description?: string;
  icon?: LucideIcon;
  badge?: string;
  highlight?: boolean;
  num?: string;
}

const productItems: NavItem[] = [
  {
    title: 'Compliance Engine',
    href: '/compliance-automate',
    description: 'Automated LGPD/GDPR compliance',
    icon: Shield,
    num: '01',
  },
  {
    title: 'AI Compliance Brain',
    href: '/mcp-brain',
    description: '17 MCP tools for AI agents',
    icon: Brain,
    num: '02',
  },
  {
    title: 'ZK Compliance Protocol',
    href: '/midnight-protocol',
    description: 'Zero-knowledge proofs on Midnight',
    icon: Fingerprint,
    num: '03',
    highlight: true,
    badge: 'ZK',
  },
  {
    title: 'Self-Funding Agents',
    href: '/self-funding-agent',
    description: '$NIGHT/$DUST autonomous economics',
    icon: Coins,
    num: '04',
  },
  {
    title: 'Private AI Stack',
    href: '/private-stack',
    description: 'On-chain security layer',
    icon: Lock,
    num: '05',
  },
];

const otherItems: NavItem[] = [
  {
    title: 'About',
    href: '/about',
    description: 'Founder & Builder Portfolio',
    icon: Users,
  },
];

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
};

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [productsExpanded, setProductsExpanded] = useState(true);

  const handleNavClick = (href: string) => {
    window.location.href = href;
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden relative z-50 hover:bg-brand-sapphire-50"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="h-6 w-6 text-brand-gray-700" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu className="h-6 w-6 text-brand-gray-700" />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-full sm:w-96 bg-gradient-to-br from-white to-brand-platinum-50 dark:from-slate-900 dark:to-slate-800 border-l border-brand-gray-200 dark:border-slate-700"
      >
        <motion.div
          initial="initial"
          animate="animate"
          variants={staggerContainer}
          className="h-full flex flex-col"
        >
          {/* Header */}
          <SheetHeader className="pb-6 border-b border-brand-gray-200 dark:border-slate-700">
            <motion.div variants={fadeInUp} className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-brand-sapphire-500 to-brand-emerald-500 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <SheetTitle className="text-xl font-serif font-bold text-brand-gray-800 dark:text-white">
                  DPO2U
                </SheetTitle>
                <SheetDescription className="text-brand-gray-600 dark:text-gray-400">
                  Private AI Stack
                </SheetDescription>
              </div>
            </motion.div>
          </SheetHeader>

          {/* Navigation Items */}
          <div className="flex-1 py-6 overflow-y-auto">
            <motion.nav variants={staggerContainer} className="space-y-2">
              {/* Home */}
              <motion.div variants={fadeInUp}>
                <button
                  onClick={() => handleNavClick('/')}
                  className="w-full group flex items-center justify-between p-4 rounded-2xl hover:bg-white dark:hover:bg-slate-700 hover:shadow-md transition-all duration-200 text-left"
                >
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-brand-sapphire-100 to-brand-emerald-100 dark:from-slate-700 dark:to-slate-600 group-hover:scale-110 transition-transform duration-200">
                      <Shield className="h-5 w-5 text-brand-sapphire-600 dark:text-brand-sapphire-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-brand-gray-800 dark:text-white group-hover:text-brand-sapphire-600 transition-colors">
                        DPO2U Home
                      </h3>
                      <p className="text-sm text-brand-gray-600 dark:text-gray-400 leading-relaxed">
                        Company overview & products
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-brand-gray-400 group-hover:text-brand-sapphire-600 group-hover:translate-x-1 transition-all duration-200 flex-shrink-0" />
                </button>
              </motion.div>

              {/* Products Section */}
              <motion.div variants={fadeInUp}>
                <button
                  onClick={() => setProductsExpanded(!productsExpanded)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left"
                >
                  <span className="text-xs font-bold text-brand-gray-500 dark:text-gray-500 uppercase tracking-widest">
                    Products
                  </span>
                  <ChevronDown className={`h-4 w-4 text-brand-gray-400 transition-transform ${productsExpanded ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {productsExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden space-y-1"
                    >
                      {productItems.map((item) => (
                        <button
                          key={item.title}
                          onClick={() => handleNavClick(item.href)}
                          className={`w-full group flex items-center justify-between p-3 pl-4 rounded-2xl hover:bg-white dark:hover:bg-slate-700 hover:shadow-md transition-all duration-200 text-left ${
                            item.highlight ? 'bg-brand-purple-50 dark:bg-brand-purple-900/20 border border-brand-purple-200 dark:border-brand-purple-700' : ''
                          }`}
                        >
                          <div className="flex items-start space-x-3 flex-1">
                            {item.icon && (
                              <div className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200 ${
                                item.highlight
                                  ? 'bg-gradient-to-br from-brand-purple-100 to-brand-purple-200 dark:from-brand-purple-800 dark:to-brand-purple-700'
                                  : 'bg-gradient-to-br from-brand-sapphire-100 to-brand-emerald-100 dark:from-slate-700 dark:to-slate-600'
                              }`}>
                                <item.icon className={`h-4 w-4 ${item.highlight ? 'text-brand-purple-600 dark:text-brand-purple-400' : 'text-brand-sapphire-600 dark:text-brand-sapphire-400'}`} />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-0.5">
                                <span className="text-[10px] font-mono text-slate-400">{item.num}</span>
                                <h3 className={`text-sm font-semibold transition-colors ${
                                  item.highlight
                                    ? 'text-brand-purple-700 dark:text-brand-purple-400'
                                    : 'text-brand-gray-800 dark:text-white group-hover:text-brand-sapphire-600'
                                }`}>
                                  {item.title}
                                </h3>
                                {item.badge && (
                                  <Badge variant="brand" size="sm">
                                    {item.badge}
                                  </Badge>
                                )}
                              </div>
                              {item.description && (
                                <p className="text-xs text-brand-gray-600 dark:text-gray-400 leading-relaxed">
                                  {item.description}
                                </p>
                              )}
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-brand-gray-400 group-hover:text-brand-sapphire-600 group-hover:translate-x-1 transition-all duration-200 flex-shrink-0" />
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Other Links */}
              {otherItems.map((item) => (
                <motion.div key={item.title} variants={fadeInUp}>
                  <button
                    onClick={() => handleNavClick(item.href)}
                    className="w-full group flex items-center justify-between p-4 rounded-2xl hover:bg-white dark:hover:bg-slate-700 hover:shadow-md transition-all duration-200 text-left"
                  >
                    <div className="flex items-start space-x-3 flex-1">
                      {item.icon && (
                        <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-brand-sapphire-100 to-brand-emerald-100 dark:from-slate-700 dark:to-slate-600 group-hover:scale-110 transition-transform duration-200">
                          <item.icon className="h-5 w-5 text-brand-sapphire-600 dark:text-brand-sapphire-400" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-brand-gray-800 dark:text-white group-hover:text-brand-sapphire-600 transition-colors">
                          {item.title}
                        </h3>
                        {item.description && (
                          <p className="text-sm text-brand-gray-600 dark:text-gray-400 leading-relaxed">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-brand-gray-400 group-hover:text-brand-sapphire-600 group-hover:translate-x-1 transition-all duration-200 flex-shrink-0" />
                  </button>
                </motion.div>
              ))}
            </motion.nav>
          </div>

          {/* Contact CTA */}
          <motion.div
            variants={fadeInUp}
            className="border-t border-brand-gray-200 dark:border-slate-700 pt-6"
          >
            <Button
              variant="primary"
              size="lg"
              onClick={() => {
                window.location.href = 'mailto:contato@dpo2u.com.br';
                setIsOpen(false);
              }}
              className="w-full flex items-center justify-center space-x-2"
            >
              <Mail className="h-5 w-5" />
              <span>Get in Touch</span>
            </Button>
          </motion.div>

          {/* Footer Info */}
          <motion.div
            variants={fadeInUp}
            className="pt-4 text-center border-t border-brand-gray-200 dark:border-slate-700 mt-6"
          >
            <div className="flex items-center justify-center space-x-4 text-xs text-brand-gray-500">
              <Badge variant="status-active" size="sm">
                5 Products
              </Badge>
              <Badge variant="success" size="sm">
                6 AI Agents
              </Badge>
              <Badge variant="premium" size="sm">
                5 ZK Contracts
              </Badge>
            </div>
            <p className="text-xs text-brand-gray-500 dark:text-gray-500 mt-2">
              &copy; 2026 DPO2U &middot; All rights reserved
            </p>
          </motion.div>
        </motion.div>
      </SheetContent>
    </Sheet>
  );
}
