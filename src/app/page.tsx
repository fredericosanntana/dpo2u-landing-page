// HomePage — DPO2U "Compliance, sealed." landing.
// Renders the sealed-design sections in order. The outer paper wrapper,
// sticky SealedNav, and SealedFooter come from SealedLayout (App.tsx),
// which now applies to every route — not just `/`.
//
// Updated 2026-04-29 — Sealed globalization sprint.
import React from 'react';

import Hero           from '@/components/sealed/sections/Hero';
import TwoDoors       from '@/components/sealed/sections/TwoDoors';
import Marquee        from '@/components/sealed/sections/Marquee';
import Problem        from '@/components/sealed/sections/Problem';
import Product        from '@/components/sealed/sections/Product';
import Ladder         from '@/components/sealed/sections/Ladder';
import DPOCta         from '@/components/sealed/sections/DPOCta';
import SDK            from '@/components/sealed/sections/SDK';
import MCP            from '@/components/sealed/sections/MCP';
import Jurisdictions  from '@/components/sealed/sections/Jurisdictions';
import Architecture   from '@/components/sealed/sections/Architecture';
import Traction       from '@/components/sealed/sections/Traction';
import Team           from '@/components/sealed/sections/Team';
import Roadmap        from '@/components/sealed/sections/Roadmap';
import Manifesto      from '@/components/sealed/sections/Manifesto';
import CTA            from '@/components/sealed/sections/CTA';

import { usePageHead } from '@/lib/page-head';

export default function HomePage() {
  usePageHead({
    title: 'DPO2U — Compliance as a protocol.',
    description:
      'DPO2U is the compliance operator offering Compliance as Protocol on Midnight. We turn regulation into tested rules with source and date, prove them with zero-knowledge on Midnight, and stand behind them as the accountable compliance operator — for VASPs and the banks that serve them in Brazil and Argentina. Selective disclosure by design.',
    path: '/',
  });
  return (
    <>
      <Hero />
      <TwoDoors />
      <Marquee />
      <Problem />
      <Product />
      <Ladder />
      <SDK />
      <MCP />
      <Jurisdictions />
      <Architecture />
      <Traction />
      <Team />
      <DPOCta />
      <Roadmap />
      <Manifesto />
      <CTA />
    </>
  );
}
