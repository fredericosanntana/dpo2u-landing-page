import React from 'react';
import { ChevronRight, Shield, Brain, Cpu, Database } from 'lucide-react';
import { useHLSVideo } from '@/hooks/useHLSVideo';

const HLS_SRC = 'https://stream.mux.com/Jwr2RhmsNrd6GEspBNgm02vJsRZAGlaoQIh4AucGdASw.m3u8';

const FEATURES = [
  {
    icon: Shield,
    title: 'ZK Compliance Engine',
    desc: 'LGPD and GDPR guardrails compiled into zero-knowledge proofs. Prove the score meets the threshold without leaking the score itself.',
    statValue: '~156k CU',
    statLabel: 'per on-chain attestation',
  },
  {
    icon: Cpu,
    title: 'SP1 v6 Verifier on Solana',
    desc: 'Groth16 proof verified natively via alt_bn128 syscall. Our upstream-worthy patch (~120 LOC) brings SP1 v6 support to sp1-solana.',
    statValue: '356 B',
    statLabel: 'proof size, one Solana tx',
  },
  {
    icon: Brain,
    title: 'MCP Compliance Brain',
    desc: 'LGPD, GDPR, DPDP, MiCAR, PDPA, and UAE skills exposed as typed MCP tools. Plug into Claude, ChatGPT, or custom agents.',
    statValue: '6',
    statLabel: 'jurisdictions covered',
  },
  {
    icon: Database,
    title: 'Attestation Registry',
    desc: 'Every proof becomes an immutable PDA on Solana devnet. Subject DID, threshold, timestamp, revocation — audit-ready by default.',
    statValue: '$0.0002',
    statLabel: 'cost per attestation',
  },
];

export default function FeaturesSection() {
  const { videoRef } = useHLSVideo({ src: HLS_SRC });

  return (
    <section id="architecture" className="relative py-32 px-4 overflow-hidden">
      {/* Background Video */}
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlays */}
      <div className="absolute inset-0 bg-apex-bg/40" />
      <div className="absolute top-0 left-0 right-0 h-[40%] video-overlay-top" />
      <div className="absolute bottom-0 left-0 right-0 h-[40%] video-overlay-bottom" />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="liquid-glass rounded-full px-4 py-1.5 inline-flex items-center gap-2 mb-6">
            <span className="text-sm text-zinc-300">Core Protocol</span>
            <span className="text-xs text-brand-sapphire-400 flex items-center gap-1">
              Overview <ChevronRight className="w-3 h-3" />
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-semibold text-apex-heading">
            Compliance, cryptographically
            <br />
            verifiable on Solana.
          </h2>
          <p className="text-zinc-400 mt-4 max-w-lg mx-auto">
            From SP1 zkVM prover to on-chain registry — every layer is purpose-built for auditable LGPD / GDPR compliance that preserves business privacy.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="liquid-glass rounded-3xl p-8 hover:bg-white/[0.03] transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-4">
                <f.icon className="w-5 h-5 text-brand-sapphire-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed mb-6">{f.desc}</p>
              <div className="border-t border-white/10 pt-4">
                <p className="text-2xl font-semibold text-white">{f.statValue}</p>
                <p className="text-xs text-zinc-500 mt-1">{f.statLabel}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
