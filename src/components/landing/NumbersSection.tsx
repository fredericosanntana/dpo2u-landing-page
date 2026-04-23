import React from 'react';
import { useHLSVideo } from '@/hooks/useHLSVideo';

const HLS_SRC = 'https://stream.mux.com/Kec29dVyJgiPdtWaQtPuEiiGHkJIYQAVUJcNiIHUYeo.m3u8';

export default function NumbersSection() {
  const { videoRef } = useHLSVideo({ src: HLS_SRC });

  return (
    <section className="relative overflow-hidden">
      {/* Background Video */}
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 video-overlay-numbers" />

      {/* Content */}
      <div className="relative z-10 py-32 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Hero Metric */}
          <div className="text-center mb-24">
            <p className="text-7xl sm:text-[8rem] lg:text-[10rem] font-semibold tracking-tighter text-white leading-none">
              $0.0002
            </p>
            <p className="text-xl text-zinc-300 mt-4">per on-chain attestation</p>
            <p className="text-zinc-500 mt-2 max-w-md mx-auto">
              SP1 v6 Groth16 proofs verified on Solana in ~156k compute units — auditable compliance at scale, anywhere in the world.
            </p>
          </div>

          {/* Bottom Metrics */}
          <div className="liquid-glass rounded-3xl p-12 grid md:grid-cols-2">
            <div className="text-center md:text-left md:border-r border-white/10 md:pr-12">
              <p className="text-5xl sm:text-6xl font-semibold text-white tracking-tight">6</p>
              <p className="text-zinc-400 mt-2">Anchor programs live on devnet</p>
            </div>
            <div className="text-center md:text-left md:pl-12 mt-8 md:mt-0">
              <p className="text-5xl sm:text-6xl font-semibold text-white tracking-tight">356 B</p>
              <p className="text-zinc-400 mt-2">proof size, one Solana tx</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
