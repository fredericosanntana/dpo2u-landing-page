'use client';

import { motion, useInView, Variants } from 'framer-motion';
import { useRef, ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale' | 'fade';
  delay?: number;
  duration?: number;
  distance?: number;
  once?: boolean;
  className?: string;
  stagger?: boolean;
  staggerDelay?: number;
}

const getVariants = (
  direction: ScrollRevealProps['direction'],
  distance: number
): Variants => {
  const baseTransition = {
    type: 'spring',
    damping: 25,
    stiffness: 100
  };

  switch (direction) {
    case 'up':
      return {
        hidden: { opacity: 0, y: distance, transition: baseTransition },
        visible: { opacity: 1, y: 0, transition: baseTransition }
      };
    case 'down':
      return {
        hidden: { opacity: 0, y: -distance, transition: baseTransition },
        visible: { opacity: 1, y: 0, transition: baseTransition }
      };
    case 'left':
      return {
        hidden: { opacity: 0, x: distance, transition: baseTransition },
        visible: { opacity: 1, x: 0, transition: baseTransition }
      };
    case 'right':
      return {
        hidden: { opacity: 0, x: -distance, transition: baseTransition },
        visible: { opacity: 1, x: 0, transition: baseTransition }
      };
    case 'scale':
      return {
        hidden: { opacity: 0, scale: 0.8, transition: baseTransition },
        visible: { opacity: 1, scale: 1, transition: baseTransition }
      };
    case 'fade':
    default:
      return {
        hidden: { opacity: 0, transition: baseTransition },
        visible: { opacity: 1, transition: baseTransition }
      };
  }
};

export function ScrollReveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.6,
  distance = 50,
  once = true,
  className = '',
  stagger = false,
  staggerDelay = 0.1
}: ScrollRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once, 
    margin: '-50px',
    amount: 0.1 
  });

  const variants = getVariants(direction, distance);

  const motionProps = {
    ref,
    variants,
    initial: 'hidden',
    animate: isInView ? 'visible' : 'hidden',
    transition: { 
      duration, 
      delay,
      type: 'spring',
      damping: 25,
      stiffness: 100
    },
    className
  };

  if (stagger) {
    const staggerVariants: Variants = {
      hidden: {},
      visible: {
        transition: {
          staggerChildren: staggerDelay,
          delayChildren: delay
        }
      }
    };

    return (
      <motion.div
        ref={ref}
        variants={staggerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  return <motion.div {...motionProps}>{children}</motion.div>;
}

// Pre-configured scroll reveal components for common patterns
export const FadeIn: React.FC<Omit<ScrollRevealProps, 'direction'>> = (props) => (
  <ScrollReveal {...props} direction="fade" />
);

export const SlideUp: React.FC<Omit<ScrollRevealProps, 'direction'>> = (props) => (
  <ScrollReveal {...props} direction="up" />
);

export const SlideDown: React.FC<Omit<ScrollRevealProps, 'direction'>> = (props) => (
  <ScrollReveal {...props} direction="down" />
);

export const SlideLeft: React.FC<Omit<ScrollRevealProps, 'direction'>> = (props) => (
  <ScrollReveal {...props} direction="left" />
);

export const SlideRight: React.FC<Omit<ScrollRevealProps, 'direction'>> = (props) => (
  <ScrollReveal {...props} direction="right" />
);

export const ScaleIn: React.FC<Omit<ScrollRevealProps, 'direction'>> = (props) => (
  <ScrollReveal {...props} direction="scale" />
);

// Stagger container for animating multiple children
interface StaggerContainerProps {
  children: ReactNode;
  delay?: number;
  staggerDelay?: number;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale' | 'fade';
}

export const StaggerContainer: React.FC<StaggerContainerProps> = ({
  children,
  delay = 0,
  staggerDelay = 0.1,
  className = '',
  direction = 'up'
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay
      }
    }
  };

  const itemVariants = getVariants(direction, 50);

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className={className}
    >
      {Array.isArray(children)
        ? children.map((child, index) => (
            <motion.div key={index} variants={itemVariants}>
              {child}
            </motion.div>
          ))
        : children}
    </motion.div>
  );
};

// Advanced reveal with custom animations
interface AdvancedRevealProps {
  children: ReactNode;
  animation?: 'bounce' | 'elastic' | 'flip' | 'zoom' | 'rotate';
  delay?: number;
  className?: string;
  once?: boolean;
}

export const AdvancedReveal: React.FC<AdvancedRevealProps> = ({
  children,
  animation = 'bounce',
  delay = 0,
  className = '',
  once = true
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: '-50px' });

  const getAdvancedVariants = (): Variants => {
    switch (animation) {
      case 'bounce':
        return {
          hidden: { opacity: 0, scale: 0.3 },
          visible: {
            opacity: 1,
            scale: 1,
            transition: {
              type: 'spring',
              damping: 10,
              stiffness: 100,
              delay
            }
          }
        };
      case 'elastic':
        return {
          hidden: { opacity: 0, scale: 0, rotate: -180 },
          visible: {
            opacity: 1,
            scale: 1,
            rotate: 0,
            transition: {
              type: 'spring',
              damping: 15,
              stiffness: 300,
              delay
            }
          }
        };
      case 'flip':
        return {
          hidden: { opacity: 0, rotateY: -90 },
          visible: {
            opacity: 1,
            rotateY: 0,
            transition: {
              type: 'spring',
              damping: 20,
              stiffness: 100,
              delay
            }
          }
        };
      case 'zoom':
        return {
          hidden: { opacity: 0, scale: 1.5 },
          visible: {
            opacity: 1,
            scale: 1,
            transition: {
              type: 'spring',
              damping: 20,
              stiffness: 100,
              delay
            }
          }
        };
      case 'rotate':
        return {
          hidden: { opacity: 0, rotate: -45, scale: 0.8 },
          visible: {
            opacity: 1,
            rotate: 0,
            scale: 1,
            transition: {
              type: 'spring',
              damping: 20,
              stiffness: 100,
              delay
            }
          }
        };
      default:
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { delay } }
        };
    }
  };

  return (
    <motion.div
      ref={ref}
      variants={getAdvancedVariants()}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Text reveal animation
interface TextRevealProps {
  children: string;
  delay?: number;
  duration?: number;
  className?: string;
  by?: 'word' | 'char';
}

export const TextReveal: React.FC<TextRevealProps> = ({
  children,
  delay = 0,
  duration = 0.5,
  className = '',
  by = 'word'
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const text = children;
  const items = by === 'word' ? text.split(' ') : text.split('');

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: by === 'word' ? 0.1 : 0.03,
        delayChildren: delay
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration }
    }
  };

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className={className}
    >
      {items.map((item, index) => (
        <motion.span
          key={index}
          variants={itemVariants}
          className="inline-block"
        >
          {item}
          {by === 'word' && index < items.length - 1 && ' '}
        </motion.span>
      ))}
    </motion.div>
  );
};