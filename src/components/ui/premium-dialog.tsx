'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Crown, Zap, Star, type LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import SystemMultiagenteForm from '@/components/forms/SystemMultiagenteForm';

interface PremiumDialogProps {
  title: string;
  description: string;
  variant?: 'premium' | 'luxury' | 'executive';
  badge?: {
    text: string;
    variant: 'success' | 'premium' | 'luxury';
    icon?: LucideIcon;
  };
  trigger?: React.ReactNode;
  children?: React.ReactNode;
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3 }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

const dialogVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    y: 50
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 200,
      duration: 0.4
    }
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: 50,
    transition: { duration: 0.2 }
  }
};

export function PremiumDialog({
  title,
  description,
  variant = 'premium',
  badge,
  trigger,
  children
}: PremiumDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getVariantStyles = () => {
    switch (variant) {
      case 'luxury':
        return {
          background: 'bg-gradient-to-br from-brand-sapphire-900 via-brand-sapphire-800 to-brand-sapphire-900',
          border: 'border-brand-purple-500/30',
          accent: 'from-brand-purple-400 to-brand-purple-600'
        };
      case 'executive':
        return {
          background: 'bg-gradient-to-br from-brand-sapphire-800 via-brand-emerald-700 to-brand-sapphire-900',
          border: 'border-brand-emerald-500/30',
          accent: 'from-brand-emerald-400 to-brand-emerald-600'
        };
      default:
        return {
          background: 'bg-gradient-to-br from-brand-sapphire-900 via-brand-sapphire-800 to-slate-900',
          border: 'border-brand-sapphire-500/30',
          accent: 'from-brand-sapphire-400 to-brand-emerald-500'
        };
    }
  };

  const styles = getVariantStyles();

  const defaultTrigger = (
    <Button
      variant="cta-primary"
      size="lg"
      className="group"
    >
      <Sparkles className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform" />
      {title}
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>

      <DialogContent
        className={`max-w-5xl max-h-[90vh] overflow-auto p-0 ${styles.background} ${styles.border} border-2`}
        onEscapeKeyDown={() => setIsOpen(false)}
      >
        <AnimatePresence>
          {isOpen && (
            <motion.div
              variants={dialogVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative"
            >
              {/* Premium Header */}
              <div className="relative overflow-hidden rounded-t-lg">
                {/* Background Effects */}
                <div className="absolute inset-0">
                  <div className={`absolute inset-0 bg-gradient-to-r ${styles.accent} opacity-10`} />
                  <div className="absolute top-0 left-0 w-full h-full bg-grid-white/5" />
                  <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse-subtle" />
                  <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse-subtle" style={{ animationDelay: '2s' }} />
                </div>

                {/* Header Content */}
                <DialogHeader className="relative z-10 p-8 text-center text-white">
                  {badge && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="flex justify-center mb-4"
                    >
                      <Badge
                        variant={badge.variant === 'luxury' ? 'premium' : badge.variant}
                        size="xl"
                        className="px-6 py-2 backdrop-blur-sm"
                      >
                        {badge.icon && <badge.icon className="h-5 w-5 mr-2" />}
                        {badge.text}
                      </Badge>
                    </motion.div>
                  )}

                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <DialogTitle className={`text-4xl md:text-5xl font-serif font-bold mb-4 bg-gradient-to-r ${styles.accent} bg-clip-text text-transparent`}>
                      {title}
                    </DialogTitle>
                    <DialogDescription className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                      {description}
                    </DialogDescription>
                  </motion.div>

                  {/* Premium Features */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-wrap justify-center gap-4 mt-6"
                  >
                    {[
                      { icon: Crown, text: 'Executive' },
                      { icon: Zap, text: 'Imediato' },
                      { icon: Star, text: 'Gratuito' }
                    ].map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 px-4 py-2 bg-white/10 rounded-full border border-white/20 backdrop-blur-sm"
                      >
                        <feature.icon className="h-4 w-4 text-white" />
                        <span className="text-sm font-medium text-white">{feature.text}</span>
                      </div>
                    ))}
                  </motion.div>
                </DialogHeader>

                {/* Close Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 text-white hover:bg-white/10 rounded-full"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-6 w-6" />
                  <span className="sr-only">Close</span>
                </Button>
              </div>

              {/* Content */}
              <div className="p-8 bg-gradient-to-br from-white to-brand-platinum-50">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  {children || (
                    <SystemMultiagenteForm onClose={() => setIsOpen(false)} />
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}

// Specialized Premium Dialog Variants
export function ConsultationDialog() {
  return (
    <PremiumDialog
      title="Diagnóstico de Infraestrutura Gratuito"
      description="Análise completa em 72h + Roadmap personalizado + Demo da plataforma IA em produção"
      variant="executive"
      badge={{
        text: "100% Gratuito",
        variant: "success",
        icon: Sparkles
      }}
      trigger={
        <Button
          variant="cta-primary"
          size="xl"
          className="group relative border-0 shadow-xl transform hover:scale-[1.02] transition-all duration-200 font-bold text-lg px-12 py-6 rounded-2xl overflow-hidden bg-gradient-to-r from-brand-emerald-500 to-brand-emerald-600 hover:from-brand-emerald-600 hover:to-brand-emerald-700 focus:outline-none focus:ring-4 focus:ring-brand-emerald-500/50"
          aria-label="Abrir formulário para diagnóstico de infraestrutura gratuito em 72 horas"
          role="button"
          tabIndex={0}
        >
          <span className="relative z-10 flex items-center">
            <Sparkles className="h-5 w-5 mr-3 group-hover:rotate-12 transition-transform" aria-hidden="true" />
            Transformar Minha Empresa AGORA
          </span>
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
        </Button>
      }
    />
  );
}

export function LuxuryDialog({
  title = "Solução Enterprise",
  description = "Implementação completa com acompanhamento C-Level dedicado",
  children
}: {
  title?: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <PremiumDialog
      title={title}
      description={description}
      variant="luxury"
      badge={{
        text: "Enterprise",
        variant: "luxury",
        icon: Crown
      }}
    >
      {children}
    </PremiumDialog>
  );
}

// Premium Dialog Trigger Components
interface PremiumTriggerProps {
  children: React.ReactNode;
  variant?: 'premium' | 'luxury' | 'executive';
  className?: string;
}

export function PremiumTrigger({
  children,
  variant = 'premium',
  className
}: PremiumTriggerProps) {
  const getVariantClass = () => {
    switch (variant) {
      case 'luxury':
        return 'bg-gradient-to-r from-brand-purple-500 to-brand-purple-600 hover:from-brand-purple-600 hover:to-brand-purple-700 shadow-brand-purple-500/25';
      case 'executive':
        return 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-emerald-500/25';
      default:
        return 'bg-gradient-to-r from-brand-sapphire-500 to-brand-emerald-500 hover:from-brand-sapphire-600 hover:to-brand-emerald-600 shadow-brand-sapphire-500/25';
    }
  };

  return (
    <Button
      className={`
        ${getVariantClass()}
        text-white border-0 shadow-xl transform hover:scale-[1.02] transition-all duration-200 
        font-semibold px-8 py-3 rounded-2xl group overflow-hidden relative
        ${className}
      `}
    >
      <span className="relative z-10 flex items-center">
        {children}
      </span>
      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
    </Button>
  );
}

export default PremiumDialog;