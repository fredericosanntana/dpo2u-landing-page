import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type PageSectionProps = {
  children: ReactNode;
  id?: string;
  className?: string;
  innerClassName?: string;
};

export default function PageSection({
  children,
  id,
  className,
  innerClassName,
}: PageSectionProps) {
  return (
    <section id={id} className={cn('py-32 px-4', className)}>
      <div className={cn('max-w-6xl mx-auto', innerClassName)}>{children}</div>
    </section>
  );
}
