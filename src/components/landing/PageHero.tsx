import React, { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type HeroCta = {
  label: string;
  href: string;
  variant?: 'hero' | 'heroSecondary';
  external?: boolean;
};

type PageHeroProps = {
  badge?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  ctas?: HeroCta[];
  children?: ReactNode;
  className?: string;
};

export default function PageHero({
  badge,
  title,
  subtitle,
  ctas,
  children,
  className,
}: PageHeroProps) {
  return (
    <section className={cn('relative px-4 pt-20 pb-24 sm:pt-28 sm:pb-32', className)}>
      <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
        {badge ? (
          <div className="liquid-glass rounded-full px-4 py-1.5 flex items-center gap-2 mb-8 text-sm text-zinc-300">
            {badge}
          </div>
        ) : null}

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-semibold leading-[1.05] tracking-tight text-apex-heading">
          {title}
        </h1>

        {subtitle ? (
          <p className="text-lg max-w-2xl mt-6 opacity-80 text-zinc-400">
            {subtitle}
          </p>
        ) : null}

        {ctas && ctas.length > 0 ? (
          <div className="flex flex-wrap gap-4 mt-8 justify-center">
            {ctas.map((cta, i) => (
              <Button
                key={i}
                variant={cta.variant ?? (i === 0 ? 'hero' : 'heroSecondary')}
                size="lg"
                onClick={() => {
                  if (cta.external) {
                    window.open(cta.href, '_blank');
                  } else {
                    window.location.href = cta.href;
                  }
                }}
              >
                {cta.label}
              </Button>
            ))}
          </div>
        ) : null}

        {children ? <div className="mt-10 w-full">{children}</div> : null}
      </div>
    </section>
  );
}
