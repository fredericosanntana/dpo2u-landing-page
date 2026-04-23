import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LiquidGlassNav from './LiquidGlassNav';

const HERO_VIDEO = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260309_042944_4a2205b7-b061-490a-852b-92d9e9955ce9.mp4';

const BRANDS = [
  'Solana',
  'SP1 v6',
  'Zero-Knowledge',
  'LGPD/GDPR',
  'Anchor',
  'MCP Protocol',
];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={HERO_VIDEO} type="video/mp4" />
      </video>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 video-overlay-hero pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <LiquidGlassNav />

        {/* Hero Content */}
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
          {/* Announcement Badge */}
          <a
            href="/solana-protocol"
            className="liquid-glass rounded-full px-4 py-1.5 flex items-center gap-2 mb-8 hover:bg-white/[0.04] transition-colors"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-emerald-500"></span>
            </span>
            <span className="text-sm text-zinc-300">Live on Solana Devnet</span>
            <span className="shimmer-badge rounded-full px-2 py-0.5 text-xs text-brand-sapphire-400 flex items-center gap-1">
              Explore <ChevronRight className="w-3 h-3" />
            </span>
          </a>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-semibold leading-[1.05] tracking-tight max-w-5xl text-apex-heading">
            Compliance as a Protocol.
            <br />
            <span className="bg-gradient-to-r from-brand-emerald-400 to-brand-sapphire-400 bg-clip-text text-transparent">
              Proven on Solana.
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg max-w-2xl mt-4 opacity-80 text-zinc-400">
            DPO2U delivers the first LGPD-native zero-knowledge compliance attestation
            stack on Solana. Prove <code className="text-brand-emerald-400 font-mono">score ≥ threshold</code> on-chain
            in ~156k CU (~$0.0002) — private inputs, public proof, immutable attestation.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 mt-8 justify-center">
            <Button variant="hero" size="lg" onClick={() => window.location.href = '/solana-protocol'}>
              See on Solana Devnet
            </Button>
            <Button
              variant="heroSecondary"
              size="lg"
              onClick={() => window.open('https://github.com/fredericosanntana/dpo2u-solana', '_blank')}
            >
              View on GitHub
            </Button>
          </div>
        </div>

        {/* Social Proof Bar */}
        <div className="pb-8 px-4">
          <div className="max-w-6xl mx-auto flex items-center gap-8">
            <p className="text-foreground/50 text-sm leading-tight shrink-0 hidden sm:block">
              Powered by cutting-edge
              <br />
              protocol technology
            </p>
            <div className="flex-1 overflow-hidden">
              <div className="flex animate-marquee gap-8">
                {[...BRANDS, ...BRANDS].map((brand, i) => (
                  <div key={i} className="flex items-center gap-2 shrink-0">
                    <div className="liquid-glass w-6 h-6 rounded-lg flex items-center justify-center text-xs text-zinc-400 font-medium">
                      {brand[0]}
                    </div>
                    <span className="text-sm text-zinc-500 whitespace-nowrap">{brand}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
