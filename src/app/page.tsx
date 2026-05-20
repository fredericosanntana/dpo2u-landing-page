// HomePage — DPO2U "Compliance, sealed." landing.
// Renders the sealed-design sections in order. The outer paper wrapper,
// sticky SealedNav, and SealedFooter come from SealedLayout (App.tsx),
// which now applies to every route — not just `/`.
//
// Updated 2026-04-29 — Sealed globalization sprint.
import React from 'react';

import Hero           from '@/components/sealed/sections/Hero';
import Marquee        from '@/components/sealed/sections/Marquee';
import Problem        from '@/components/sealed/sections/Problem';
import Product        from '@/components/sealed/sections/Product';
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
    title: 'DPO2U — Compliance, sealed.',
    description:
      'Regulatory compliance as on-chain primitives. For every Solana project that processes data, issues tokens, or runs AI — 17 jurisdictions, 70+ countries, 8 AI governance frameworks (including Singapore IMDA MGF-Agentic v1.0). 15 legal-source manifests hash-anchored on-chain · 5 jurisdictional programs cross-reference via Anchor seeds::program. From DPIA generation to MICA proof-of-reserve. Automated, auditable, proven on-chain. 1.94s · $0.0002 · 5 years since 2021.',
    path: '/',
  });
  return (
    <>
      <Hero />
      <Marquee />
      <Problem />
      <Product />
      <SDK />
      <MCP />
      <Jurisdictions />
      <Architecture />
      <Traction />
      <Team />
      <Roadmap />
      <Manifesto />
      <CTA />
    </>
  );
}
