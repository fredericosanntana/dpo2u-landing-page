// SealedLayout — global wrapper. Renderiza SealedNav fixo no topo,
// children no meio, SealedFooter embaixo. Não aplica background — body
// já tem bg via globals.css. Recovery 2026-05-14.

import React from 'react';
import SealedNav from './sections/SealedNav';
import SealedFooter from './sections/SealedFooter';

interface SealedLayoutProps {
  children: React.ReactNode;
}

export default function SealedLayout({ children }: SealedLayoutProps) {
  return (
    <>
      <SealedNav />
      {children}
      <SealedFooter />
    </>
  );
}
