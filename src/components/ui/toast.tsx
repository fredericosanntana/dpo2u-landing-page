'use client';

import * as React from 'react';
import * as ToastPrimitives from '@radix-ui/react-toast';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  CheckCircle, 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  Sparkles,
  Crown,
  Shield,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

const ToastProvider = ToastPrimitives.Provider

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[480px]",
      className
    )}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-start space-x-4 overflow-hidden rounded-2xl border shadow-2xl transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full backdrop-blur-sm",
  {
    variants: {
      variant: {
        default: "bg-white/95 border-brand-gray-200/50 text-brand-gray-800 p-6",
        success: "bg-gradient-to-r from-brand-green-50 to-emerald-50 border-brand-green-200/50 text-brand-green-800 p-6",
        error: "bg-gradient-to-r from-red-50 to-pink-50 border-red-200/50 text-red-800 p-6",
        warning: "bg-gradient-to-r from-brand-emerald-50 to-brand-sapphire-50 border-brand-emerald-200/50 text-brand-emerald-800 p-6",
        info: "bg-gradient-to-r from-brand-sapphire-50 to-blue-50 border-brand-sapphire-200/50 text-brand-sapphire-800 p-6",
        premium: "bg-gradient-to-br from-white to-brand-platinum-50 border-brand-sapphire-200/30 text-brand-gray-800 p-8 shadow-hero",
        luxury: "bg-gradient-to-br from-brand-chrome-50 to-white border-brand-chrome-200/50 text-brand-chrome-800 p-8 shadow-hero",
        glassmorphism: "bg-white/80 backdrop-blur-xl border-white/20 text-brand-gray-800 p-6",
        destructive: "bg-gradient-to-r from-red-500 to-pink-600 border-transparent text-white p-6"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  )
})
Toast.displayName = ToastPrimitives.Root.displayName

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-9 shrink-0 items-center justify-center rounded-xl border bg-white/80 backdrop-blur-sm px-4 text-sm font-semibold transition-all duration-200 hover:bg-white hover:scale-105 focus:outline-none focus:ring-2 focus:ring-brand-sapphire-500 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 shadow-sm",
      "group-[.success]:border-brand-green-200 group-[.success]:text-brand-green-700 group-[.success]:hover:bg-brand-green-50",
      "group-[.error]:border-red-200 group-[.error]:text-red-700 group-[.error]:hover:bg-red-50",
      "group-[.warning]:border-brand-emerald-200 group-[.warning]:text-brand-emerald-700 group-[.warning]:hover:bg-brand-emerald-50",
      "group-[.info]:border-brand-sapphire-200 group-[.info]:text-brand-sapphire-700 group-[.info]:hover:bg-brand-sapphire-50",
      "group-[.destructive]:border-white/20 group-[.destructive]:text-white group-[.destructive]:hover:bg-white/10",
      className
    )}
    {...props}
  />
));
ToastAction.displayName = ToastPrimitives.Action.displayName;

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-3 top-3 rounded-xl p-1.5 text-current/60 opacity-0 transition-all duration-200 hover:text-current hover:bg-black/5 hover:scale-110 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-brand-sapphire-500 group-hover:opacity-100 group-[.destructive]:text-white/70 group-[.destructive]:hover:text-white group-[.destructive]:hover:bg-white/10",
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
));
ToastClose.displayName = ToastPrimitives.Close.displayName;

const titleVariants = cva(
  "font-semibold leading-tight",
  {
    variants: {
      variant: {
        default: "text-base text-brand-gray-800",
        success: "text-lg text-brand-green-800 font-bold",
        error: "text-lg text-red-800 font-bold",
        warning: "text-lg text-brand-emerald-800 font-bold",
        info: "text-lg text-brand-sapphire-800 font-bold",
        premium: "text-xl font-serif font-bold bg-gradient-to-r from-brand-sapphire-600 to-brand-emerald-600 bg-clip-text text-transparent",
        luxury: "text-xl font-serif font-bold text-brand-chrome-800",
        glassmorphism: "text-lg font-bold text-brand-gray-800",
        destructive: "text-lg font-bold text-white"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title> & VariantProps<typeof titleVariants>
>(({ className, variant, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn(titleVariants({ variant, className }))}
    {...props}
  />
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const descriptionVariants = cva(
  "text-sm leading-relaxed mt-1",
  {
    variants: {
      variant: {
        default: "text-brand-gray-600",
        success: "text-brand-green-700",
        error: "text-red-700",
        warning: "text-brand-emerald-700",
        info: "text-brand-sapphire-700",
        premium: "text-base text-brand-gray-600",
        luxury: "text-base text-brand-chrome-600",
        glassmorphism: "text-brand-gray-700",
        destructive: "text-white/90"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description> & VariantProps<typeof descriptionVariants>
>(({ className, variant, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn(descriptionVariants({ variant, className }))}
    {...props}
  />
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;

// Enhanced Toast with Icon Support
interface ToastWithIconProps extends React.ComponentPropsWithoutRef<typeof Toast> {
  variant?: VariantProps<typeof toastVariants>['variant'];
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  duration?: number;
  showIcon?: boolean;
}

const getToastIcon = (variant: VariantProps<typeof toastVariants>['variant']) => {
  switch (variant) {
    case 'success':
      return CheckCircle;
    case 'error':
    case 'destructive':
      return AlertCircle;
    case 'warning':
      return AlertTriangle;
    case 'info':
      return Info;
    case 'premium':
      return Sparkles;
    case 'luxury':
      return Crown;
    default:
      return Shield;
  }
};

const ToastWithIcon: React.FC<ToastWithIconProps> = ({
  variant = 'default',
  title,
  description,
  action,
  showIcon = true,
  duration = 5000,
  ...props
}) => {
  const IconComponent = getToastIcon(variant);
  
  return (
    <Toast variant={variant} duration={duration} {...props}>
      <div className="flex items-start space-x-3 flex-1">
        {showIcon && (
          <div className="flex-shrink-0 mt-0.5">
            <IconComponent className="h-5 w-5" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <ToastTitle variant={variant}>{title}</ToastTitle>
          {description && (
            <ToastDescription variant={variant}>{description}</ToastDescription>
          )}
        </div>
      </div>
      {action && (
        <ToastAction altText={action.label} onClick={action.onClick}>
          {action.label}
        </ToastAction>
      )}
      <ToastClose />
    </Toast>
  );
};

// Premium Success Toast
const SuccessToast: React.FC<{
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}> = ({ title, description, action }) => (
  <ToastWithIcon
    variant="success"
    title={title}
    {...(description && { description })}
    {...(action && { action })}
  />
);

// Premium Error Toast
const ErrorToast: React.FC<{
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}> = ({ title, description, action }) => (
  <ToastWithIcon
    variant="error"
    title={title}
    {...(description && { description })}
    {...(action && { action })}
  />
);

// DPO2U Premium Notification
const DPO2UToast: React.FC<{
  title: string;
  description?: string;
  variant?: 'premium' | 'luxury' | 'success';
  action?: { label: string; onClick: () => void };
}> = ({ title, description, variant = 'premium', action }) => (
  <ToastWithIcon
    variant={variant}
    title={title}
    {...(description && { description })}
    {...(action && { action })}
    duration={7000}
  />
);

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>;
type ToastActionElement = React.ReactElement<typeof ToastAction>;

export {
  type ToastProps,
  type ToastActionElement,
  type ToastWithIconProps,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
  ToastWithIcon,
  SuccessToast,
  ErrorToast,
  DPO2UToast
};
