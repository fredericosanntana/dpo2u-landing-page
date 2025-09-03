'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  Shield,
  Brain,
  Users,
  BarChart3,
  Zap,
  ChevronRight,
  ExternalLink,
  Phone,
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
  external?: boolean;
}

const navigationItems: NavItem[] = [
  {
    title: 'Sobre a DPO2U',
    href: '#about',
    description: 'Pioneiros em Legal Tech + IA',
    icon: Users,
  },
  {
    title: 'Serviços',
    href: '#services',
    description: 'Soluções completas LGPD/GDPR',
    icon: Shield,
  },
  {
    title: 'Benefícios',
    href: '#benefits',
    description: 'ROI mensurável em compliance',
    icon: BarChart3,
  },
  {
    title: 'Cases de Sucesso',
    href: '#cases',
    description: '+500 empresas protegidas',
    icon: ExternalLink,
  },
  {
    title: 'LGPD',
    href: '/lgpd',
    description: 'Princípios e consentimento',
  },
  {
    title: 'Privacidade',
    href: '/privacy',
    description: 'Política de Privacidade',
  },
  {
    title: 'Termos',
    href: '/terms',
    description: 'Termos de Uso',
  },
];

const quickActions = [
  {
    title: 'Consultoria Gratuita',
    description: 'Diagnóstico completo sem custo',
    icon: Phone,
    action: () => console.log('Abrir modal consultoria'),
    variant: 'cta-primary' as const,
  },
  {
    title: 'Falar com Especialista',
    description: 'Contato direto via WhatsApp',
    icon: Mail,
    action: () => window.open('https://wa.me/5511999999999', '_blank'),
    variant: 'outline' as const,
  },
];

const slideInFromRight = {
  initial: { x: '100%', opacity: 0 },
  animate: { 
    x: 0, 
    opacity: 1,
    transition: { 
      type: 'spring',
      damping: 25,
      stiffness: 200
    }
  },
  exit: { 
    x: '100%', 
    opacity: 0,
    transition: { 
      type: 'spring',
      damping: 25,
      stiffness: 200
    }
  }
};

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
    transition: { duration: 0.3 }
  },
};

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavClick = (href: string, external?: boolean) => {
    if (external) {
      window.open(href, '_blank');
    } else if (href.startsWith('#')) {
      const element = document.querySelector(href);
      element?.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = href;
    }
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="md:hidden relative z-50 hover:bg-brand-sapphire-50"
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
        className="w-full sm:w-96 bg-gradient-to-br from-white to-brand-platinum-50 border-l border-brand-gray-200"
      >
        <motion.div
          initial="initial"
          animate="animate"
          variants={staggerContainer}
          className="h-full flex flex-col"
        >
          {/* Header */}
          <SheetHeader className="pb-6 border-b border-brand-gray-200">
            <motion.div variants={fadeInUp} className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-brand-sapphire-500 to-brand-emerald-500 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <SheetTitle className="text-xl font-serif font-bold text-brand-gray-800">
                  DPO2U
                </SheetTitle>
                <SheetDescription className="text-brand-gray-600">
                  Legal Tech + IA
                </SheetDescription>
              </div>
            </motion.div>
          </SheetHeader>

          {/* Navigation Items */}
          <div className="flex-1 py-6">
            <motion.nav variants={staggerContainer} className="space-y-2">
              {navigationItems.map((item, index) => (
                <motion.div key={item.title} variants={fadeInUp}>
                  <button
                    onClick={() => handleNavClick(item.href, item.external)}
                    className="w-full group flex items-center justify-between p-4 rounded-2xl hover:bg-white hover:shadow-md transition-all duration-200 text-left"
                  >
                    <div className="flex items-start space-x-3 flex-1">
                      {item.icon && (
                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-brand-sapphire-100 to-brand-emerald-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                          <item.icon className="h-5 w-5 text-brand-sapphire-600" />
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-brand-gray-800 group-hover:text-brand-sapphire-600 transition-colors">
                            {item.title}
                          </h3>
                          {item.badge && (
                            <Badge variant="brand" size="sm">
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                        {item.description && (
                          <p className="text-sm text-brand-gray-600 leading-relaxed">
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

          {/* Quick Actions */}
          <motion.div 
            variants={fadeInUp} 
            className="border-t border-brand-gray-200 pt-6 space-y-4"
          >
            <h4 className="font-semibold text-brand-gray-800 mb-4 flex items-center">
              <Zap className="h-4 w-4 mr-2 text-brand-emerald-500" />
              Ações Rápidas
            </h4>
            
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                variants={fadeInUp}
                custom={index}
              >
                <Button
                  variant={action.variant}
                  size="lg"
                  onClick={action.action}
                  className="w-full flex items-start space-x-3 h-auto p-4 text-left justify-start"
                >
                  <div className="flex-shrink-0">
                    <action.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold">{action.title}</div>
                    <div className="text-xs opacity-75 mt-1">
                      {action.description}
                    </div>
                  </div>
                </Button>
              </motion.div>
            ))}
          </motion.div>

          {/* Footer Info */}
          <motion.div 
            variants={fadeInUp}
            className="pt-4 text-center border-t border-brand-gray-200 mt-6"
          >
            <div className="flex items-center justify-center space-x-4 text-xs text-brand-gray-500">
              <Badge variant="status-active" size="sm">
                99.9% Uptime
              </Badge>
              <Badge variant="success" size="sm">
                ISO 27001
              </Badge>
              <Badge variant="premium" size="sm">
                ANPPD
              </Badge>
            </div>
            <p className="text-xs text-brand-gray-500 mt-2">
              © 2025 DPO2U • Todos os direitos reservados
            </p>
          </motion.div>
        </motion.div>
      </SheetContent>
    </Sheet>
  );
}
