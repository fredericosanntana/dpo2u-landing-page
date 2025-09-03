# 🎨 ESPECIFICAÇÃO COMPLETA - DESIGN SYSTEM UNIFICADO DPO2U

**Data**: 03 de Setembro de 2025  
**Projeto**: P05 - Design System Unificado para Landing Page  
**Status**: Especificação Técnica Completa  
**Versão**: 1.0

---

## 🎯 VISÃO GERAL DO DESIGN SYSTEM

### Propósito
Criar um design system consistente, escalável e otimizado para a landing page DPO2U que reflita a liderança em tecnologia jurídica + IA, mantendo excelência visual e performance técnica.

### Princípios de Design
1. **Consistência**: Cada elemento segue padrões visuais rigorosos
2. **Performance**: Otimizado para Core Web Vitals e SEO
3. **Acessibilidade**: WCAG 2.1 AA compliance
4. **Escalabilidade**: Sistema modular para futuras expansões
5. **Brasileiro-First**: Localizado e culturalmente relevante

---

## 🎨 SISTEMA DE CORES

### 1. Paleta Primária - Identidade DPO2U

#### 1.1 Cores Principais
```css
:root {
  /* === PRIMARY BRAND COLORS === */
  --brand-sapphire-50: #EFF6FF;
  --brand-sapphire-100: #DBEAFE;
  --brand-sapphire-200: #BFDBFE;
  --brand-sapphire-300: #93C5FD;
  --brand-sapphire-400: #60A5FA;  /* Primary Brand */
  --brand-sapphire-500: #3B82F6;  /* Core Blue */
  --brand-sapphire-600: #2563EB;
  --brand-sapphire-700: #1D4ED8;
  --brand-sapphire-800: #1E40AF;
  --brand-sapphire-900: #1E3A8A;

  /* === SECONDARY COLORS === */
  --brand-emerald-50: #ECFDF5;
  --brand-emerald-100: #D1FAE5;
  --brand-emerald-200: #A7F3D0;
  --brand-emerald-300: #6EE7B7;
  --brand-emerald-400: #34D399;   /* Success/Growth */
  --brand-emerald-500: #10B981;   /* Secondary Brand */
  --brand-emerald-600: #059669;
  --brand-emerald-700: #047857;
  --brand-emerald-800: #065F46;
  --brand-emerald-900: #064E3B;

  /* === ACCENT COLORS === */
  --brand-ocean-50: #F0F9FF;
  --brand-ocean-100: #E0F2FE;
  --brand-ocean-200: #BAE6FD;
  --brand-ocean-300: #7DD3FC;
  --brand-ocean-400: #38BDF8;    /* Tech Accent */
  --brand-ocean-500: #0891B2;    /* Ocean Blue */
  --brand-ocean-600: #0E7490;
  --brand-ocean-700: #155E75;
  --brand-ocean-800: #164E63;
  --brand-ocean-900: #0C4A6E;
}
```

#### 1.2 Cores Neutras Premium
```css
:root {
  /* === PREMIUM NEUTRALS === */
  --brand-platinum-50: #F8FAFC;
  --brand-platinum-100: #F1F5F9;
  --brand-platinum-200: #E2E8F0;
  --brand-platinum-300: #CBD5E1;  /* Light Text */
  --brand-platinum-400: #94A3B8;
  --brand-platinum-500: #64748B;  /* Mid Gray */
  --brand-platinum-600: #475569;
  --brand-platinum-700: #334155;
  --brand-platinum-800: #1E293B;  /* Dark Text */
  --brand-platinum-900: #0F172A;  /* Premium Black */

  /* === SEMANTIC COLORS === */
  --color-success: var(--brand-emerald-500);
  --color-warning: #F59E0B;
  --color-error: #EF4444;
  --color-info: var(--brand-ocean-500);
  
  /* === PRIMARY ASSIGNMENTS === */
  --color-primary: var(--brand-sapphire-500);
  --color-primary-foreground: #FFFFFF;
  --color-secondary: var(--brand-emerald-500);
  --color-secondary-foreground: #FFFFFF;
}
```

### 2. Dark Mode System

#### 2.1 Dark Mode Variables
```css
[data-theme="dark"] {
  /* === DARK MODE OVERRIDES === */
  --bg-primary: var(--brand-platinum-900);
  --bg-secondary: var(--brand-platinum-800);
  --bg-tertiary: var(--brand-platinum-700);
  
  --text-primary: var(--brand-platinum-50);
  --text-secondary: var(--brand-platinum-300);
  --text-tertiary: var(--brand-platinum-400);
  
  /* Maintain brand colors in dark mode */
  --color-primary: var(--brand-sapphire-400); /* Lighter for contrast */
  --color-secondary: var(--brand-emerald-400);
  --color-accent: var(--brand-ocean-400);
}
```

### 3. Gradientes Premium

#### 3.1 Hero Gradients
```css
.bg-gradient-premium {
  background: linear-gradient(
    135deg,
    var(--brand-platinum-900) 0%,
    #16213e 25%,
    var(--brand-sapphire-900) 50%,
    #16213e 75%,
    var(--brand-platinum-900) 100%
  );
}

.bg-gradient-hero-overlay {
  background: linear-gradient(
    to bottom right,
    var(--brand-sapphire-500) 0%,
    var(--brand-ocean-500) 50%,
    var(--brand-emerald-500) 100%
  );
  opacity: 0.1;
}

.bg-gradient-cta {
  background: linear-gradient(
    45deg,
    var(--brand-sapphire-500) 0%,
    var(--brand-ocean-500) 50%,
    var(--brand-sapphire-600) 100%
  );
}

.bg-gradient-text {
  background: linear-gradient(
    90deg,
    var(--brand-sapphire-400) 0%,
    var(--brand-emerald-400) 50%,
    var(--brand-ocean-400) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

---

## 📝 SISTEMA TIPOGRÁFICO

### 1. Hierarquia de Fontes

#### 1.1 Font Stack
```css
:root {
  /* === FONT FAMILIES === */
  --font-serif: 'Playfair Display', 'Georgia', 'Times New Roman', serif;
  --font-sans: 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', sans-serif;
  --font-mono: 'JetBrains Mono', 'Consolas', 'Monaco', monospace;
}

/* Font Loading Optimization */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400 700;
  font-display: swap;
  src: url('/fonts/inter-var.woff2') format('woff2');
}

@font-face {
  font-family: 'Playfair Display';
  font-style: normal;
  font-weight: 400 700;
  font-display: swap;
  src: url('/fonts/playfair-var.woff2') format('woff2');
}
```

#### 1.2 Typography Scale
```css
:root {
  /* === TYPOGRAPHY SCALE === */
  --text-xs: 0.75rem;     /* 12px */
  --text-sm: 0.875rem;    /* 14px */
  --text-base: 1rem;      /* 16px */
  --text-lg: 1.125rem;    /* 18px */
  --text-xl: 1.25rem;     /* 20px */
  --text-2xl: 1.5rem;     /* 24px */
  --text-3xl: 1.875rem;   /* 30px */
  --text-4xl: 2.25rem;    /* 36px */
  --text-5xl: 3rem;       /* 48px */
  --text-6xl: 3.75rem;    /* 60px */
  --text-7xl: 4.5rem;     /* 72px */
  --text-8xl: 6rem;       /* 96px */
  --text-9xl: 8rem;       /* 128px */

  /* === LINE HEIGHTS === */
  --leading-tight: 1.25;
  --leading-snug: 1.375;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
  --leading-loose: 2;
}
```

### 2. Componentes Tipográficos

#### 2.1 Heading Classes
```css
/* === HEADING SYSTEM === */
.text-hero {
  font-family: var(--font-serif);
  font-size: var(--text-7xl);
  font-weight: 700;
  line-height: var(--leading-tight);
  letter-spacing: -0.025em;
  color: var(--text-primary);
}

@media (max-width: 768px) {
  .text-hero {
    font-size: var(--text-5xl);
  }
}

.text-h1 {
  font-family: var(--font-serif);
  font-size: var(--text-5xl);
  font-weight: 600;
  line-height: var(--leading-tight);
  letter-spacing: -0.025em;
}

.text-h2 {
  font-family: var(--font-serif);
  font-size: var(--text-4xl);
  font-weight: 600;
  line-height: var(--leading-snug);
}

.text-h3 {
  font-family: var(--font-sans);
  font-size: var(--text-2xl);
  font-weight: 600;
  line-height: var(--leading-snug);
}

.text-body-lg {
  font-family: var(--font-sans);
  font-size: var(--text-xl);
  font-weight: 400;
  line-height: var(--leading-relaxed);
}

.text-body {
  font-family: var(--font-sans);
  font-size: var(--text-base);
  font-weight: 400;
  line-height: var(--leading-normal);
}
```

#### 2.2 Responsive Typography
```css
/* === RESPONSIVE TEXT CLASSES === */
.responsive-hero {
  font-size: clamp(2.5rem, 5vw, 6rem);
  line-height: clamp(1.2, 1.1, 1.1);
}

.responsive-h1 {
  font-size: clamp(2rem, 4vw, 3.5rem);
}

.responsive-h2 {
  font-size: clamp(1.5rem, 3vw, 2.5rem);
}

.responsive-body {
  font-size: clamp(1rem, 1.5vw, 1.25rem);
}
```

---

## 🧩 COMPONENTES PADRONIZADOS

### 1. Button System

#### 1.1 Button Variants Completas
```typescript
// /src/components/ui/button.tsx - ENHANCED
import { cva, type VariantProps } from "class-variance-authority";

export const buttonVariants = cva(
  // Base classes
  "inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // === STANDARD VARIANTS ===
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        
        // === DPO2U CUSTOM VARIANTS ===
        primary: "bg-brand-sapphire-500 text-white hover:bg-brand-sapphire-600 shadow-lg hover:shadow-xl transform hover:scale-105",
        cta: "bg-gradient-cta text-white hover:opacity-90 shadow-xl hover:shadow-2xl transform hover:scale-105",
        "cta-primary": "bg-gradient-to-r from-brand-sapphire-500 to-brand-ocean-500 text-white hover:from-brand-sapphire-600 hover:to-brand-ocean-600 shadow-xl transform hover:scale-105",
        "cta-secondary": "bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 hover:border-white/30",
        success: "bg-brand-emerald-500 text-white hover:bg-brand-emerald-600 shadow-lg",
        premium: "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-xl"
      },
      size: {
        sm: "h-9 rounded-lg px-3 text-sm",
        default: "h-10 px-4 py-2",
        lg: "h-11 rounded-lg px-8 text-lg",
        xl: "h-14 rounded-xl px-10 text-xl",
        hero: "h-16 rounded-xl px-12 text-xl font-bold",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  rightIcon?: React.ReactNode;
  leftIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, rightIcon, leftIcon, children, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    )
  }
)
```

#### 1.2 Button Usage Examples
```typescript
// USAGE EXAMPLES:
<Button variant="cta-primary" size="hero" rightIcon={<ArrowRight />}>
  Agendar Consultoria Executive
</Button>

<Button variant="cta-secondary" size="lg" leftIcon={<Brain />}>
  Ver Demo da Plataforma
</Button>

<Button variant="primary" size="default">
  Saiba Mais
</Button>

<Button variant="outline" size="sm">
  Documentação
</Button>
```

### 2. Badge System

#### 2.1 Badge Variants Completas
```typescript
// /src/components/ui/badge.tsx - ENHANCED
export const badgeVariants = cva(
  "inline-flex items-center rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        // === STANDARD VARIANTS ===
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline: "text-foreground border border-input",
        
        // === DPO2U CUSTOM VARIANTS ===
        success: "bg-brand-emerald-100 text-brand-emerald-800 border-brand-emerald-200",
        info: "bg-brand-ocean-100 text-brand-ocean-800 border-brand-ocean-200",
        premium: "bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 border border-purple-200",
        
        // === STATUS VARIANTS ===
        "status-active": "bg-brand-emerald-500 text-white animate-pulse-subtle",
        "status-warning": "bg-yellow-100 text-yellow-800 border-yellow-200",
        "status-critical": "bg-red-100 text-red-800 border-red-200",
        
        // === GLASSMORPHISM VARIANTS ===
        glassmorphism: "bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-lg",
        "glass-success": "bg-brand-emerald-500/20 backdrop-blur-md border border-brand-emerald-400/30 text-brand-emerald-100",
        "glass-info": "bg-brand-ocean-500/20 backdrop-blur-md border border-brand-ocean-400/30 text-brand-ocean-100"
      },
      size: {
        sm: "px-2 py-1 text-xs",
        default: "px-2.5 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
        xl: "px-4 py-2 text-base"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
```

### 3. Card System

#### 3.1 Card Variants & Components
```typescript
// /src/components/ui/card.tsx - ENHANCED
export const cardVariants = cva(
  "rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-200",
  {
    variants: {
      variant: {
        default: "border-border bg-background",
        elevated: "shadow-lg hover:shadow-xl",
        glass: "bg-white/10 backdrop-blur-md border-white/20",
        premium: "bg-gradient-to-br from-white to-gray-50 shadow-xl border-0",
        interactive: "cursor-pointer hover:shadow-lg hover:scale-105 transform",
        feature: "border-0 shadow-xl bg-gradient-to-br from-brand-sapphire-50 to-white"
      },
      size: {
        sm: "p-4",
        default: "p-6",
        lg: "p-8",
        xl: "p-12"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

// StatsCard - Custom component
export interface StatsCardProps {
  title: string;
  value: string;
  color?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    label: string;
    direction: 'up' | 'down';
  };
}

export function StatsCard({ title, value, color, icon, trend }: StatsCardProps) {
  return (
    <Card variant="glass" className="text-center">
      <CardContent className="p-4">
        {icon && (
          <div className="flex justify-center mb-2">
            <div className="p-2 rounded-full bg-white/10">
              {icon}
            </div>
          </div>
        )}
        <div className={cn("text-2xl font-bold mb-1", color || "text-white")}>
          {value}
        </div>
        <div className="text-sm text-white/80">{title}</div>
        {trend && (
          <div className="text-xs mt-2 flex items-center justify-center gap-1">
            {trend.direction === 'up' ? '↗' : '↘'}
            <span>{trend.value}% {trend.label}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
```

### 4. Tooltip System

#### 4.1 Technical Term Tooltips
```typescript
// /src/components/ui/technical-term.tsx - NEW COMPONENT
interface TechnicalTermProps {
  term: string;
  explanation: string;
  children: React.ReactNode;
  variant?: 'default' | 'premium' | 'glass';
}

export function TechnicalTerm({ 
  term, 
  explanation, 
  children, 
  variant = 'default' 
}: TechnicalTermProps) {
  const tooltipVariants = {
    default: "bg-popover text-popover-foreground",
    premium: "bg-gradient-to-r from-brand-sapphire-500 to-brand-ocean-500 text-white",
    glass: "bg-black/80 backdrop-blur-md text-white border border-white/20"
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="underline decoration-dotted decoration-brand-sapphire-500 cursor-help hover:decoration-solid transition-all">
            {children}
          </span>
        </TooltipTrigger>
        <TooltipContent className={cn("max-w-xs p-4", tooltipVariants[variant])}>
          <div className="space-y-2">
            <div className="font-semibold text-sm">{term}</div>
            <div className="text-xs leading-relaxed">{explanation}</div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Usage Example:
<TechnicalTerm 
  term="Sistema Multiagente"
  explanation="Arquitetura de IA onde múltiplos agentes especializados trabalham coordenadamente para resolver problemas complexos"
  variant="glass"
>
  sistema multiagente
</TechnicalTerm>
```

---

## 🎬 SISTEMA DE ANIMAÇÕES

### 1. Animation Framework

#### 1.1 CSS Animations
```css
/* === KEYFRAME ANIMATIONS === */
@keyframes pulse-subtle {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

@keyframes slide-in-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* === UTILITY CLASSES === */
.animate-pulse-subtle {
  animation: pulse-subtle 4s ease-in-out infinite;
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-slide-in-up {
  animation: slide-in-up 0.6s ease-out;
}

.animate-fade-in {
  animation: fade-in 0.8s ease-out;
}

.animate-scale-in {
  animation: scale-in 0.5s ease-out;
}
```

#### 1.2 Framer Motion Variants
```typescript
// /src/lib/animations.ts - ANIMATION CONSTANTS
export const animationVariants = {
  // === CONTAINER VARIANTS ===
  staggerContainer: {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  },

  // === ELEMENT VARIANTS ===
  fadeInUp: {
    initial: { 
      opacity: 0, 
      y: 60 
    },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.4, 0.55, 1.4] // Custom easing
      }
    }
  },

  fadeInLeft: {
    initial: { opacity: 0, x: -60 },
    animate: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  },

  fadeInRight: {
    initial: { opacity: 0, x: 60 },
    animate: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  },

  scaleIn: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  },

  // === HOVER VARIANTS ===
  hoverScale: {
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 }
    },
    tap: {
      scale: 0.95
    }
  },

  hoverGlow: {
    hover: {
      boxShadow: "0 0 30px rgba(59, 130, 246, 0.3)",
      transition: { duration: 0.3 }
    }
  }
};

// === REUSABLE ANIMATION HOOKS ===
export const useScrollAnimation = (threshold = 0.1) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold
  });
  
  return [ref, inView];
};
```

### 2. Animation Usage Patterns

#### 2.1 Section Animations
```typescript
// STANDARD SECTION ANIMATION PATTERN:
export function AnimatedSection({ children, className, ...props }) {
  const [ref, inView] = useScrollAnimation();
  
  return (
    <motion.section
      ref={ref}
      initial="initial"
      animate={inView ? "animate" : "initial"}
      variants={animationVariants.staggerContainer}
      className={className}
      {...props}
    >
      {children}
    </motion.section>
  );
}

// USAGE:
<AnimatedSection className="py-20">
  <motion.h2 variants={animationVariants.fadeInUp}>
    Título da Seção
  </motion.h2>
  <motion.p variants={animationVariants.fadeInUp}>
    Descrição da seção
  </motion.p>
</AnimatedSection>
```

#### 2.2 Interactive Animations
```typescript
// INTERACTIVE CARD COMPONENT:
<motion.div
  variants={animationVariants.scaleIn}
  whileHover={animationVariants.hoverScale.hover}
  whileTap={animationVariants.hoverScale.tap}
  className="card-interactive"
>
  <Card>Content</Card>
</motion.div>

// CTA BUTTON WITH GLOW:
<motion.div variants={animationVariants.hoverGlow}>
  <Button variant="cta-primary">
    Call to Action
  </Button>
</motion.div>
```

---

## 📱 SISTEMA RESPONSIVO

### 1. Breakpoint System

#### 1.1 Breakpoint Definitions
```typescript
// /src/lib/breakpoints.ts
export const breakpoints = {
  sm: '640px',   // Small devices
  md: '768px',   // Tablets
  lg: '1024px',  // Laptops
  xl: '1280px',  // Desktops
  '2xl': '1536px' // Large displays
} as const;

export type Breakpoint = keyof typeof breakpoints;
```

#### 1.2 Responsive Utilities
```css
/* === RESPONSIVE SPACING === */
.container-responsive {
  @apply px-4 sm:px-6 lg:px-8 xl:px-12;
  max-width: 1280px;
  margin: 0 auto;
}

.section-padding {
  @apply py-12 sm:py-16 lg:py-20 xl:py-24;
}

.text-responsive {
  @apply text-base sm:text-lg lg:text-xl;
}

/* === RESPONSIVE GRID === */
.grid-responsive-2 {
  @apply grid grid-cols-1 lg:grid-cols-2;
}

.grid-responsive-3 {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3;
}

.grid-responsive-4 {
  @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4;
}
```

### 2. Mobile-First Components

#### 2.1 Mobile Navigation
```typescript
// Mobile-optimized navigation component structure
interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems: NavItem[];
}

export function MobileNavigation({ isOpen, onClose, menuItems }: MobileNavProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[320px] sm:w-[400px]">
        <nav className="flex flex-col space-y-4 mt-8">
          {menuItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className="text-lg font-medium hover:text-primary transition-colors py-2"
              onClick={onClose}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
```

#### 2.2 Responsive Images
```typescript
// Optimized image component
interface ResponsiveImageProps {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
}

export function ResponsiveImage({ src, alt, priority, className }: ResponsiveImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      className={cn("object-cover", className)}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  );
}
```

---

## ♿ SISTEMA DE ACESSIBILIDADE

### 1. WCAG 2.1 Compliance

#### 1.1 Color Contrast
```css
/* === HIGH CONTRAST VARIANTS === */
.high-contrast {
  --text-primary: #000000;
  --text-secondary: #333333;
  --bg-primary: #FFFFFF;
  --bg-secondary: #F5F5F5;
}

/* Ensure minimum 4.5:1 contrast ratio for normal text */
/* Ensure minimum 3:1 contrast ratio for large text */
```

#### 1.2 Focus States
```css
/* === FOCUS MANAGEMENT === */
.focus-visible {
  @apply outline-none ring-2 ring-brand-sapphire-500 ring-offset-2;
}

/* Skip to content link */
.skip-link {
  @apply sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded z-50;
}
```

#### 1.3 ARIA Labels & Semantic HTML
```typescript
// Accessibility utilities
export const a11y = {
  // Screen reader only text
  srOnly: "sr-only",
  
  // Focus visible
  focusVisible: "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
  
  // ARIA attributes helpers
  ariaLabel: (label: string) => ({ "aria-label": label }),
  ariaDescribedBy: (id: string) => ({ "aria-describedby": id }),
  ariaExpanded: (expanded: boolean) => ({ "aria-expanded": expanded }),
  
  // Role helpers
  role: (role: string) => ({ role }),
  
  // Semantic heading levels
  headingLevel: (level: 1 | 2 | 3 | 4 | 5 | 6) => ({
    role: "heading",
    "aria-level": level
  })
};
```

---

## 🔧 IMPLEMENTAÇÃO TÉCNICA

### 1. Tailwind Configuration

#### 1.1 tailwind.config.ts - Enhanced
```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Brand Colors
        "brand-sapphire": {
          50: "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          300: "#93C5FD",
          400: "#60A5FA",
          500: "#3B82F6",
          600: "#2563EB",
          700: "#1D4ED8",
          800: "#1E40AF",
          900: "#1E3A8A",
        },
        "brand-emerald": {
          50: "#ECFDF5",
          100: "#D1FAE5",
          200: "#A7F3D0",
          300: "#6EE7B7",
          400: "#34D399",
          500: "#10B981",
          600: "#059669",
          700: "#047857",
          800: "#065F46",
          900: "#064E3B",
        },
        "brand-ocean": {
          50: "#F0F9FF",
          100: "#E0F2FE",
          200: "#BAE6FD",
          300: "#7DD3FC",
          400: "#38BDF8",
          500: "#0891B2",
          600: "#0E7490",
          700: "#155E75",
          800: "#164E63",
          900: "#0C4A6E",
        },
        "brand-platinum": {
          50: "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          300: "#CBD5E1",
          400: "#94A3B8",
          500: "#64748B",
          600: "#475569",
          700: "#334155",
          800: "#1E293B",
          900: "#0F172A",
        },
        // Shadcn colors
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: "hsl(var(--primary))",
        "primary-foreground": "hsl(var(--primary-foreground))",
        secondary: "hsl(var(--secondary))",
        "secondary-foreground": "hsl(var(--secondary-foreground))",
        destructive: "hsl(var(--destructive))",
        "destructive-foreground": "hsl(var(--destructive-foreground))",
        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",
        accent: "hsl(var(--accent))",
        "accent-foreground": "hsl(var(--accent-foreground))",
        popover: "hsl(var(--popover))",
        "popover-foreground": "hsl(var(--popover-foreground))",
        card: "hsl(var(--card))",
        "card-foreground": "hsl(var(--card-foreground))",
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      animation: {
        "pulse-subtle": "pulse-subtle 4s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "slide-in-up": "slide-in-up 0.6s ease-out",
        "fade-in": "fade-in 0.8s ease-out",
        "scale-in": "scale-in 0.5s ease-out",
      },
      keyframes: {
        "pulse-subtle": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "slide-in-up": {
          from: {
            opacity: "0",
            transform: "translateY(30px)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "scale-in": {
          from: {
            opacity: "0",
            transform: "scale(0.95)",
          },
          to: {
            opacity: "1",
            transform: "scale(1)",
          },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
```

### 2. CSS Variables Setup

#### 2.1 globals.css - Complete Setup
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@400;600;700&display=swap');
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* === SHADCN VARIABLES === */
    --background: 0 0% 100%;
    --foreground: 224 71.4% 4.1%;
    --card: 0 0% 100%;
    --card-foreground: 224 71.4% 4.1%;
    --popover: 0 0% 100%;
    --popover-foreground: 224 71.4% 4.1%;
    --primary: 220.9 39.3% 11%;
    --primary-foreground: 210 20% 98%;
    --secondary: 220 14.3% 95.9%;
    --secondary-foreground: 220.9 39.3% 11%;
    --muted: 220 14.3% 95.9%;
    --muted-foreground: 220 8.9% 46.1%;
    --accent: 220 14.3% 95.9%;
    --accent-foreground: 220.9 39.3% 11%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 20% 98%;
    --border: 220 13% 91%;
    --input: 220 13% 91%;
    --ring: 224 71.4% 4.1%;
    --radius: 0.75rem;

    /* === CUSTOM DPO2U VARIABLES === */
    --color-primary: 220.9 39.3% 11%;
    --color-primary-foreground: 210 20% 98%;
    --color-secondary: 142.1 76.2% 36.3%;
    --color-secondary-foreground: 355.7 100% 97.3%;
  }

  .dark {
    --background: 224 71.4% 4.1%;
    --foreground: 210 20% 98%;
    --card: 224 71.4% 4.1%;
    --card-foreground: 210 20% 98%;
    --popover: 224 71.4% 4.1%;
    --popover-foreground: 210 20% 98%;
    --primary: 210 20% 98%;
    --primary-foreground: 220.9 39.3% 11%;
    --secondary: 215 27.9% 16.9%;
    --secondary-foreground: 210 20% 98%;
    --muted: 215 27.9% 16.9%;
    --muted-foreground: 217.9 10.6% 64.9%;
    --accent: 215 27.9% 16.9%;
    --accent-foreground: 210 20% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 20% 98%;
    --border: 215 27.9% 16.9%;
    --input: 215 27.9% 16.9%;
    --ring: 216 12.2% 83.9%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  
  body {
    @apply bg-background text-foreground;
    font-feature-settings: "rlig" 1, "calt" 1;
  }

  /* === CUSTOM GRADIENT CLASSES === */
  .bg-gradient-premium {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 25%, #1E3A8A 50%, #16213e 75%, #1a1a2e 100%);
  }

  .bg-gradient-hero-overlay {
    background: linear-gradient(to bottom right, #3B82F6 0%, #0891B2 50%, #10B981 100%);
    opacity: 0.1;
  }

  .bg-gradient-cta {
    background: linear-gradient(45deg, #3B82F6 0%, #0891B2 50%, #2563EB 100%);
  }

  /* === RESPONSIVE TYPOGRAPHY === */
  .text-responsive-hero {
    font-size: clamp(2.5rem, 5vw, 6rem);
    line-height: clamp(1.2, 1.1, 1.1);
  }
}

@layer components {
  /* === UTILITY COMPONENTS === */
  .container-responsive {
    @apply px-4 sm:px-6 lg:px-8 xl:px-12 max-w-7xl mx-auto;
  }

  .section-padding {
    @apply py-12 sm:py-16 lg:py-20 xl:py-24;
  }

  /* === ANIMATION CLASSES === */
  .animate-on-scroll {
    @apply opacity-0 translate-y-8 transition-all duration-700 ease-out;
  }

  .animate-on-scroll.visible {
    @apply opacity-100 translate-y-0;
  }
}
```

---

## 📋 CHECKLIST DE IMPLEMENTAÇÃO

### ✅ Fase 1: Setup Base (1 dia)
```
[ ] Configurar tailwind.config.ts com cores DPO2U
[ ] Implementar CSS variables em globals.css
[ ] Setup de fonts (Inter + Playfair Display)
[ ] Configurar animações base
[ ] Testar build sem erros
```

### ✅ Fase 2: Componentes Core (2 dias)
```
[ ] Implementar buttonVariants completo
[ ] Implementar badgeVariants completo
[ ] Criar StatsCard component
[ ] Criar TechnicalTerm component
[ ] Implementar cardVariants
[ ] Testar todos os variants
```

### ✅ Fase 3: Sistema Responsivo (1 dia)
```
[ ] Implementar breakpoints system
[ ] Criar responsive utilities
[ ] Testar mobile-first approach
[ ] Validar acessibilidade
[ ] Performance audit
```

### ✅ Fase 4: Documentação (0.5 dia)
```
[ ] Documentar usage examples
[ ] Criar Storybook stories
[ ] Validar TypeScript types
[ ] Code review final
```

---

**Design System elaborado por**: Documentador Técnico Especializado  
**Padrão seguido**: Atomic Design + shadcn/ui + DPO2U Brand Guidelines  
**Compatibilidade**: Next.js 15, React 18, Tailwind CSS 3.4  
**Status**: Pronto para implementação