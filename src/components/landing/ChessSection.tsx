import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useHLSVideo } from '@/hooks/useHLSVideo';

const HLS_SRC = 'https://stream.mux.com/1CCfG6mPC7LbMOAs6iBOfPeNd3WaKlZuHuKHp00G62j8.m3u8';

const BULLETS = [
  'SP1 v6 zero-knowledge proofs',
  'On-chain attestation PDAs on Solana',
  '~156k CU · ~$0.0002 per attestation',
];

export default function ChessSection() {
  const { videoRef } = useHLSVideo({ src: HLS_SRC });

  return (
    <section className="py-32 px-4">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
        {/* Video Left */}
        <div className="liquid-glass rounded-3xl aspect-[4/3] overflow-hidden relative">
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

        {/* Content Right */}
        <div>
          <div className="liquid-glass rounded-full px-4 py-1.5 inline-flex items-center gap-2 mb-6">
            <span className="text-sm text-zinc-300">Zero-Knowledge Proofs</span>
            <span className="text-xs text-brand-sapphire-400 flex items-center gap-1">
              Core <ChevronRight className="w-3 h-3" />
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-semibold text-apex-heading leading-tight">
            Prove Compliance
            <br />
            Without Exposing Data
          </h2>

          <p className="text-zinc-400 mt-4 leading-relaxed">
            Cryptographic attestations on Solana let you prove LGPD/GDPR compliance
            without ever revealing the underlying score. Auditors verify proofs, not documents.
          </p>

          <ul className="mt-6 space-y-3">
            {BULLETS.map((b) => (
              <li key={b} className="flex items-center gap-3 text-zinc-300 text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-emerald-400 shrink-0" />
                {b}
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-4 mt-8">
            <Button variant="hero" size="lg" onClick={() => window.location.href = '/solana-protocol'}>
              Explore Solana Protocol
            </Button>
            <Button variant="heroSecondary" size="lg" onClick={() => window.open('https://github.com/fredericosanntana/dpo2u-solana', '_blank')}>
              View the code
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
