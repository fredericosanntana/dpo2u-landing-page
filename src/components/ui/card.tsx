'use client';

import * as React from "react";
import { cn } from "@/lib/utils";

// Enhanced DPO2U Card with shadcn/ui structure + brand customizations
const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & {
  variant?: 'default' | 'elevated' | 'outlined' | 'brand' | 'premium' | 'glassmorphism' | 'gradient';
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
}>(({ className, variant = 'default', padding = 'md', hover = false, ...props }, ref) => {
  
  const cardVariants = {
    default: "bg-card text-card-foreground border shadow-sm",
    elevated: "bg-white shadow-card hover:shadow-card-hover border border-gray-200",
    outlined: "bg-transparent border-2 border-brand-gray-200",
    brand: "bg-gradient-card border border-brand-gray-100 shadow-brand",
    premium: "bg-gradient-to-br from-white/95 to-brand-platinum-50/80 border border-brand-sapphire-200/30 shadow-xl backdrop-blur-sm",
    glassmorphism: "bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl",
    gradient: "bg-gradient-to-br from-brand-sapphire-500/10 to-brand-emerald-500/10 border border-brand-sapphire-200/30 backdrop-blur-sm"
  };

  const paddingVariants = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-12',
  };

  return (
    <div
      ref={ref}
      className={cn(
        'rounded-2xl transition-all duration-300',
        cardVariants[variant],
        paddingVariants[padding],
        hover && 'hover:shadow-card-hover hover:scale-[1.02] cursor-pointer',
        className
      )}
      {...props}
    />
  );
});

Card.displayName = "Card";

// shadcn/ui Card subcomponents with DPO2U styling
const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-2 p-6 pb-4", className)}
      {...props}
    />
  )
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & {
  variant?: 'default' | 'brand' | 'large';
}>(({ className, variant = 'default', ...props }, ref) => {
  const titleVariants = {
    default: "text-2xl font-semibold leading-none tracking-tight",
    brand: "text-2xl font-serif font-bold text-brand-gray-800 leading-tight",
    large: "text-3xl md:text-4xl font-serif font-bold text-brand-gray-800 leading-tight"
  };

  return (
    <div
      ref={ref}
      className={cn(titleVariants[variant], className)}
      {...props}
    />
  );
});
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & {
  variant?: 'default' | 'muted' | 'brand';
}>(({ className, variant = 'default', ...props }, ref) => {
  const descriptionVariants = {
    default: "text-sm text-muted-foreground",
    muted: "text-sm text-slate-500 leading-relaxed",
    brand: "text-base text-gray-600 leading-relaxed font-light"
  };

  return (
    <div
      ref={ref}
      className={cn(descriptionVariants[variant], className)}
      {...props}
    />
  );
});
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center p-6 pt-4", className)}
      {...props}
    />
  )
);
CardFooter.displayName = "CardFooter";

// DPO2U specific card variants for common use cases
const ServiceCard = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  features?: string[];
  gradient?: string;
}>(({ className, icon, title, description, features, gradient, children, ...props }, ref) => (
  <Card
    ref={ref}
    variant="premium"
    hover
    className={cn("group relative overflow-hidden", className)}
    {...props}
  >
    {gradient && (
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`} />
    )}
    
    {icon && (
      <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${gradient || 'from-brand-sapphire-500 to-brand-emerald-500'} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
    )}

    <div className="relative z-10">
      {title && (
        <CardTitle variant="brand" className="mb-2">
          {title}
        </CardTitle>
      )}
      
      {description && (
        <CardDescription variant="brand" className="mb-6">
          {description}
        </CardDescription>
      )}

      {features && (
        <div className="space-y-3 mb-6">
          {features.map((feature, idx) => (
            <div key={idx} className="flex items-start space-x-3">
              <div className={`w-2 h-2 bg-gradient-to-br ${gradient || 'from-brand-sapphire-500 to-brand-emerald-500'} rounded-full mt-2 flex-shrink-0`} />
              <span className="text-sm text-gray-700">{feature}</span>
            </div>
          ))}
        </div>
      )}

      {children}
    </div>
  </Card>
));
ServiceCard.displayName = "ServiceCard";

const StatsCard = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & {
  title?: string;
  value?: string;
  description?: string;
  color?: string;
}>(({ className, title, value, description, color = 'text-brand-sapphire-600', ...props }, ref) => (
  <Card ref={ref} variant="brand" hover className={cn("text-center", className)} {...props}>
    {title && (
      <CardTitle variant="default" className="text-lg mb-2">
        {title}
      </CardTitle>
    )}
    {value && (
      <div className={cn("text-3xl md:text-4xl font-bold mb-2", color)}>
        {value}
      </div>
    )}
    {description && (
      <CardDescription variant="muted">
        {description}
      </CardDescription>
    )}
  </Card>
));
StatsCard.displayName = "StatsCard";

export { 
  Card, 
  CardHeader, 
  CardFooter, 
  CardTitle, 
  CardDescription, 
  CardContent,
  ServiceCard,
  StatsCard
};