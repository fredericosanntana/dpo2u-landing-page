import React, { ReactNode } from 'react';
import '@fontsource/geist-sans/400.css';
import '@fontsource/geist-sans/500.css';
import '@fontsource/geist-sans/600.css';
import '@fontsource/geist-sans/700.css';

import LiquidGlassNav from './LiquidGlassNav';
import CTAFooterWrapper from './CTAFooterWrapper';

type PageShellProps = {
  children: ReactNode;
  footer?: ReactNode | false;
};

export default function PageShell({ children, footer }: PageShellProps) {
  const footerNode =
    footer === false ? null : footer === undefined ? <CTAFooterWrapper /> : footer;

  return (
    <div className="apex-bg min-h-screen font-geist">
      <LiquidGlassNav />
      <main className="pt-24">{children}</main>
      {footerNode}
    </div>
  );
}
