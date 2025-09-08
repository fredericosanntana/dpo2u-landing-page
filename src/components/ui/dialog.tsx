'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Crown, Sparkles, Shield, Zap, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from './badge';

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

const overlayVariants = cva(
  "fixed inset-0 z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
  {
    variants: {
      variant: {
        default: "bg-black/80",
        premium: "bg-gradient-to-br from-black/60 via-brand-sapphire-900/40 to-black/80 backdrop-blur-sm",
        luxury: "bg-gradient-to-br from-brand-chrome-900/70 via-brand-gray-900/50 to-black/90 backdrop-blur-md",
        glassmorphism: "bg-white/10 backdrop-blur-xl",
        subtle: "bg-black/40 backdrop-blur-sm"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

const contentVariants = cva(
  "fixed left-[50%] top-[50%] z-50 grid w-full translate-x-[-50%] translate-y-[-50%] gap-6 border shadow-lg duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
  {
    variants: {
      variant: {
        default: "max-w-lg bg-background p-6 rounded-lg border-border",
        premium: "max-w-2xl bg-gradient-to-br from-white to-brand-platinum-50 p-8 rounded-3xl border-brand-sapphire-200/30 shadow-2xl",
        luxury: "max-w-3xl bg-gradient-to-br from-brand-chrome-50 to-white p-10 rounded-3xl border-brand-chrome-200/50 shadow-hero",
        glassmorphism: "max-w-xl bg-white/90 backdrop-blur-xl p-8 rounded-2xl border-white/20 shadow-2xl",
        compact: "max-w-sm bg-background p-4 rounded-xl border-border",
        fullscreen: "max-w-7xl w-[95vw] h-[90vh] bg-background p-8 rounded-2xl border-border overflow-auto"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay> & VariantProps<typeof overlayVariants>
>(({ className, variant, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(overlayVariants({ variant, className }))}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & 
  VariantProps<typeof contentVariants> & 
  VariantProps<typeof overlayVariants> & {
    overlayVariant?: VariantProps<typeof overlayVariants>['variant'];
    showCloseButton?: boolean;
  }
>(({ className, variant, overlayVariant, showCloseButton = true, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay variant={overlayVariant || variant} />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(contentVariants({ variant, className }))}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close className="absolute right-6 top-6 rounded-xl opacity-70 ring-offset-background transition-all duration-200 hover:opacity-100 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-brand-sapphire-500 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground group">
          <X className="h-5 w-5 group-hover:rotate-90 transition-transform duration-200" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      )}
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const headerVariants = cva(
  "flex flex-col space-y-3 text-center sm:text-left",
  {
    variants: {
      variant: {
        default: "space-y-1.5",
        premium: "space-y-4 pb-6 border-b border-brand-gray-200",
        luxury: "space-y-6 pb-8 border-b border-brand-chrome-200/50",
        compact: "space-y-2",
        centered: "text-center items-center space-y-4"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

const DialogHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof headerVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(headerVariants({ variant, className }))}
    {...props}
  />
));
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

const titleVariants = cva(
  "font-semibold leading-none tracking-tight",
  {
    variants: {
      variant: {
        default: "text-lg",
        premium: "text-3xl font-serif font-bold bg-gradient-to-r from-brand-sapphire-600 to-brand-emerald-600 bg-clip-text text-transparent",
        luxury: "text-4xl font-serif font-bold text-brand-chrome-800",
        compact: "text-base font-bold",
        hero: "text-5xl font-serif font-black bg-gradient-to-r from-brand-sapphire-600 via-brand-emerald-500 to-brand-sapphire-600 bg-clip-text text-transparent"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title> & VariantProps<typeof titleVariants>
>(({ className, variant, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(titleVariants({ variant, className }))}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const descriptionVariants = cva(
  "text-muted-foreground",
  {
    variants: {
      variant: {
        default: "text-sm",
        premium: "text-lg text-brand-gray-600 leading-relaxed",
        luxury: "text-xl text-brand-chrome-600 leading-relaxed",
        compact: "text-xs text-brand-gray-500",
        hero: "text-xl text-brand-gray-700 leading-relaxed max-w-2xl mx-auto"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description> & VariantProps<typeof descriptionVariants>
>(({ className, variant, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn(descriptionVariants({ variant, className }))}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

// Premium Dialog Components
interface PremiumDialogProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  variant?: VariantProps<typeof contentVariants>['variant'];
  badge?: {
    text: string;
    variant: 'premium' | 'luxury' | 'success' | 'brand';
    icon?: LucideIcon;
  };
  onOpenChange?: ((open: boolean) => void) | undefined;
  trigger?: React.ReactNode;
  open?: boolean | undefined;
}

const PremiumDialog: React.FC<PremiumDialogProps> = ({
  title,
  description,
  children,
  variant = 'premium',
  badge,
  onOpenChange,
  trigger,
  open
}) => {
  return (
    <Dialog {...(open !== undefined && { open })} {...(onOpenChange && { onOpenChange })}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent variant={variant === 'compact' || variant === 'fullscreen' ? 'default' : variant} overlayVariant={variant === 'compact' || variant === 'fullscreen' ? 'default' : variant}>
        <DialogHeader variant={variant === 'glassmorphism' || variant === 'fullscreen' ? 'default' : variant}>
          {badge && (
            <div className="flex justify-center mb-4">
              <Badge variant={badge.variant === 'luxury' ? 'premium' : badge.variant} size="xl" className="px-6 py-2">
                {badge.icon && <badge.icon className="h-5 w-5 mr-2" />}
                {badge.text}
              </Badge>
            </div>
          )}
          <DialogTitle variant={variant === 'glassmorphism' || variant === 'fullscreen' ? 'default' : variant}>{title}</DialogTitle>
          {description && (
            <DialogDescription variant={variant === 'glassmorphism' || variant === 'fullscreen' ? 'default' : variant}>{description}</DialogDescription>
          )}
        </DialogHeader>
        <div className="space-y-6">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Consultation Dialog Component
interface ConsultationDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
}

const ConsultationDialog: React.FC<ConsultationDialogProps> = ({
  open,
  onOpenChange,
  trigger
}) => {
  return (
    <PremiumDialog
      title="Consultoria Executive Gratuita"
      description="Diagnóstico completo + Roadmap personalizado + Demo da plataforma"
      variant="premium"
      badge={{
        text: "Consultoria Premium",
        variant: "premium",
        icon: Sparkles
      }}
      open={open}
      onOpenChange={onOpenChange}
      trigger={trigger}
    >
      <div className="grid gap-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-brand-sapphire-50 rounded-xl">
            <Shield className="h-8 w-8 text-brand-sapphire-600 mx-auto mb-3" />
            <h4 className="font-semibold text-brand-gray-800 mb-2">Diagnóstico LGPD</h4>
            <p className="text-sm text-brand-gray-600">Análise completa da sua conformidade atual</p>
          </div>
          <div className="text-center p-4 bg-brand-emerald-50 rounded-xl">
            <Zap className="h-8 w-8 text-brand-emerald-600 mx-auto mb-3" />
            <h4 className="font-semibold text-brand-gray-800 mb-2">Roadmap IA</h4>
            <p className="text-sm text-brand-gray-600">Plano personalizado de automação</p>
          </div>
          <div className="text-center p-4 bg-brand-chrome-50 rounded-xl">
            <Crown className="h-8 w-8 text-brand-chrome-600 mx-auto mb-3" />
            <h4 className="font-semibold text-brand-gray-800 mb-2">Demo Live</h4>
            <p className="text-sm text-brand-gray-600">Apresentação exclusiva da plataforma</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-brand-platinum-50 to-white p-6 rounded-2xl border border-brand-gray-200/50">
          <div className="flex items-center justify-between">
            <div>
              <h5 className="font-semibold text-brand-gray-800 mb-1">Valor da Consultoria</h5>
              <p className="text-sm text-brand-gray-600">Avaliação executiva especializada</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-brand-gray-400 line-through">R$ 2.500</div>
              <div className="text-3xl font-black text-brand-green-600">GRÁTIS</div>
            </div>
          </div>
        </div>
      </div>
    </PremiumDialog>
  );
};

// Animated Dialog Wrapper
const AnimatedDialog: React.FC<{
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}> = ({ children, open, onOpenChange }) => {
  return (
    <AnimatePresence>
      {open && (
        <Dialog open={true} {...(onOpenChange && { onOpenChange })}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  PremiumDialog,
  ConsultationDialog,
  AnimatedDialog,
  type PremiumDialogProps,
  type ConsultationDialogProps
};
