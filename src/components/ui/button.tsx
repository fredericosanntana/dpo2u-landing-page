'use client';

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Enhanced DPO2U Button with shadcn/ui base + brand customizations
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // shadcn/ui standard variants
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-md hover:shadow-lg",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-md hover:shadow-lg",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        
        // DPO2U Brand variants (enhanced)
        primary: "bg-primary text-white hover:bg-primary/90 shadow-lg hover:shadow-xl transform hover:scale-[1.02]",
        brand: "bg-gradient-to-r from-brand-sapphire-500 to-brand-emerald-500 text-white hover:from-brand-sapphire-600 hover:to-brand-emerald-600 shadow-xl hover:shadow-2xl transform hover:scale-[1.02]",
        premium: "bg-gradient-to-r from-brand-ocean-600 to-brand-sapphire-600 text-white hover:from-brand-ocean-700 hover:to-brand-sapphire-700 shadow-2xl border border-white/20 backdrop-blur-sm",
        luxury: "bg-gradient-to-r from-brand-platinum-400 to-brand-chrome-500 text-brand-gray-900 hover:from-brand-platinum-500 hover:to-brand-chrome-600 shadow-xl font-semibold",
        
        // CTA variants for landing page
        'cta-primary': "bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white shadow-2xl hover:shadow-3xl transform hover:scale-[1.05] transition-all duration-300 font-bold border-0",
        'cta-secondary': "border-2 border-slate-500/50 text-slate-200 hover:bg-slate-700 hover:text-white hover:border-slate-400 backdrop-blur-md bg-slate-800/20 font-medium transition-all duration-300"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 py-1.5 text-xs rounded-md",
        lg: "h-12 px-8 py-3 text-base rounded-xl",
        xl: "h-14 px-10 py-4 text-lg rounded-2xl",
        icon: "h-10 w-10",
        
        // DPO2U specific sizes
        hero: "h-16 px-12 py-5 text-xl rounded-2xl font-bold",
        cta: "h-14 px-10 py-4 text-lg rounded-xl"
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    asChild = false, 
    loading, 
    leftIcon, 
    rightIcon, 
    children, 
    disabled,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : "button";
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {leftIcon && !loading && (
          <span className="mr-2">{leftIcon}</span>
        )}
        {children}
        {rightIcon && !loading && (
          <span className="ml-2">{rightIcon}</span>
        )}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };