'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useSpring, useTransform, useInView } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  delay?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  separator?: string;
  startOnView?: boolean;
}

export function AnimatedCounter({
  value,
  duration = 2,
  delay = 0,
  className,
  prefix = '',
  suffix = '',
  decimals = 0,
  separator = ',',
  startOnView = true
}: AnimatedCounterProps) {
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const spring = useSpring(0, {
    duration: duration * 1000,
    bounce: 0
  });

  const display = useTransform(spring, (latest) => {
    const num = Number(latest.toFixed(decimals));
    return formatNumber(num, decimals, separator);
  });

  useEffect(() => {
    if (startOnView && !isInView) return;
    if (started) return;

    const timer = setTimeout(() => {
      setStarted(true);
      spring.set(value);
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [value, delay, spring, started, isInView, startOnView]);

  // Direct start if not waiting for view
  useEffect(() => {
    if (!startOnView && !started) {
      const timer = setTimeout(() => {
        setStarted(true);
        spring.set(value);
      }, delay * 1000);

      return () => clearTimeout(timer);
    }
    
    return undefined;
  }, [value, delay, spring, started, startOnView]);

  function formatNumber(num: number, decimals: number, separator: string) {
    const parts = num.toFixed(decimals).split('.');
    const integerPart = parts[0]?.replace(/\B(?=(\d{3})+(?!\d))/g, separator) || '';
    return decimals > 0 ? `${integerPart}.${parts[1] || ''}` : integerPart;
  }

  return (
    <span ref={ref} className={className}>
      {prefix}
      <motion.span>{display}</motion.span>
      {suffix}
    </span>
  );
}

// Enhanced Counter with more animations
interface EnhancedCounterProps extends AnimatedCounterProps {
  variant?: 'default' | 'glow' | 'gradient' | 'bounce';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function EnhancedCounter({
  variant = 'default',
  size = 'md',
  ...props
}: EnhancedCounterProps) {
  const sizeClasses = {
    sm: 'text-lg font-semibold',
    md: 'text-2xl font-bold',
    lg: 'text-4xl font-black',
    xl: 'text-6xl font-black'
  };

  const variantClasses = {
    default: 'text-brand-gray-900',
    glow: 'text-brand-sapphire-600 drop-shadow-[0_0_20px_rgba(0,109,255,0.3)]',
    gradient: 'bg-gradient-to-r from-brand-sapphire-600 to-brand-emerald-500 bg-clip-text text-transparent',
    bounce: 'text-brand-emerald-600'
  };

  const containerAnimation = variant === 'bounce' ? {
    animate: { scale: [1, 1.05, 1] },
    transition: { duration: 0.3, delay: props.delay || 0 }
  } : {};

  return (
    <motion.div {...containerAnimation}>
      <AnimatedCounter
        {...props}
        className={`${sizeClasses[size]} ${variantClasses[variant]} ${props.className || ''}`}
      />
    </motion.div>
  );
}

// Statistics Grid Component
interface StatItemProps {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
  delay?: number;
  icon?: React.ComponentType<{ className?: string }>;
  color?: 'blue' | 'green' | 'purple' | 'orange';
}

const StatItem: React.FC<StatItemProps> = ({
  value,
  label,
  prefix,
  suffix,
  delay = 0,
  icon: Icon,
  color = 'blue'
}) => {
  const colorClasses = {
    blue: {
      bg: 'bg-gradient-to-br from-brand-sapphire-50 to-blue-50',
      icon: 'text-brand-sapphire-600',
      counter: 'text-brand-sapphire-700'
    },
    green: {
      bg: 'bg-gradient-to-br from-brand-emerald-50 to-green-50',
      icon: 'text-brand-emerald-600',
      counter: 'text-brand-emerald-700'
    },
    purple: {
      bg: 'bg-gradient-to-br from-purple-50 to-violet-50',
      icon: 'text-purple-600',
      counter: 'text-purple-700'
    },
    orange: {
      bg: 'bg-gradient-to-br from-brand-emerald-50 to-brand-sapphire-50',
      icon: 'text-brand-emerald-600',
      counter: 'text-brand-emerald-700'
    }
  };

  const colors = colorClasses[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.1, duration: 0.5 }}
      className={`p-6 rounded-2xl ${colors.bg} border border-white/50 backdrop-blur-sm`}
    >
      <div className="flex items-start justify-between">
        <div>
          <EnhancedCounter
            value={value}
            {...(prefix && { prefix })}
            {...(suffix && { suffix })}
            duration={2}
            delay={delay * 0.2}
            variant="gradient"
            size="lg"
            className={colors.counter}
          />
          <p className="mt-2 text-sm font-medium text-gray-600">{label}</p>
        </div>
        {Icon && (
          <div className="flex-shrink-0">
            <Icon className={`h-8 w-8 ${colors.icon}`} />
          </div>
        )}
      </div>
    </motion.div>
  );
};

interface StatsGridProps {
  stats: Array<{
    value: number;
    label: string;
    prefix?: string;
    suffix?: string;
    icon?: React.ComponentType<{ className?: string }>;
    color?: 'blue' | 'green' | 'purple' | 'orange';
  }>;
  title?: string;
  description?: string;
  className?: string;
}

export const StatsGrid: React.FC<StatsGridProps> = ({
  stats,
  title,
  description,
  className
}) => {
  return (
    <div className={className}>
      {title && (
        <div className="text-center mb-12">
          <h3 className="text-3xl font-serif font-bold text-brand-gray-800 mb-4">
            {title}
          </h3>
          {description && (
            <p className="text-lg text-brand-gray-600 max-w-2xl mx-auto">
              {description}
            </p>
          )}
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatItem
            key={index}
            {...stat}
            delay={index}
          />
        ))}
      </div>
    </div>
  );
};