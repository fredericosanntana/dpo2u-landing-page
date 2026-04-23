import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useHLSVideo } from '@/hooks/useHLSVideo';

const HLS_SRC = 'https://stream.mux.com/f0001qPDy00mvqP023lqK3lWx31uHvxirFCHK1yNLczzqxY.m3u8';

const STATS = [
  { value: '6', label: 'Anchor programs on devnet' },
  { value: '4', label: 'MCP compliance skills' },
  { value: '356 B', label: 'proof size' },
  { value: '< 60s', label: 'clone → verified on-chain' },
];

export default function ReverseChessSection() {
  const { videoRef } = useHLSVideo({ src: HLS_SRC });

  return (
    <section className="py-32 px-4">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
        {/* Content Left */}
        <div className="order-2 lg:order-1">
          <div className="liquid-glass rounded-full px-4 py-1.5 inline-flex items-center gap-2 mb-6">
            <span className="text-sm text-zinc-300">Agent Orchestration</span>
            <span className="text-xs text-brand-sapphire-400 flex items-center gap-1">
              Live <ChevronRight className="w-3 h-3" />
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-semibold text-apex-heading leading-tight">
            Multi-Agent
            <br />
            Intelligence
          </h2>

          <p className="text-zinc-400 mt-4 leading-relaxed">
            6 autonomous AI agents working in concert — mapping business models to regulations,
            verifying evidence against schemas, and monitoring compliance around the clock.
          </p>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 gap-4 mt-8">
            {STATS.map((s) => (
              <div key={s.label} className="liquid-glass rounded-2xl p-4">
                <p className="text-2xl font-semibold text-white">{s.value}</p>
                <p className="text-xs text-zinc-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <Button variant="hero" size="lg" onClick={() => window.location.href = '/mcp'}>
              Explore MCP Brain
            </Button>
          </div>
        </div>

        {/* Video Right */}
        <div className="order-1 lg:order-2 liquid-glass rounded-3xl aspect-[4/3] overflow-hidden relative">
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
