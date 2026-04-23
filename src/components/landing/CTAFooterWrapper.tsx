import React from 'react';
import { Button } from '@/components/ui/button';
import { useHLSVideo } from '@/hooks/useHLSVideo';

const HLS_SRC = 'https://stream.mux.com/tLkHO1qZoaaQOUeVWo8hEBeGQfySP02EPS02BmnNFyXys.m3u8';

const FOOTER_LINKS = {
  Protocol: [
    { label: 'Solana Protocol', href: '/solana-protocol' },
    { label: 'On-chain Programs', href: '/solana-protocol#programs' },
    { label: 'SP1 v6 Verifier', href: '/solana-protocol#verifier' },
    { label: 'GitHub', href: 'https://github.com/fredericosanntana/dpo2u-solana' },
  ],
  Products: [
    { label: 'Compliance Engine', href: '/compliance-automate' },
    { label: 'MCP Brain', href: '/mcp' },
    { label: 'Live Dashboard', href: '/analise' },
    { label: 'About', href: '/about' },
  ],
  Company: [
    { label: 'About', href: '/about' },
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
    { label: 'Contact', href: 'mailto:contato@dpo2u.com.br' },
  ],
};

export default function CTAFooterWrapper() {
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
      <div className="absolute inset-0 video-overlay-cta" />

      {/* CTA */}
      <div className="relative z-10 py-32 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="liquid-glass rounded-[2rem] p-12 sm:p-20 text-center">
            <h2 className="text-3xl sm:text-5xl font-semibold text-apex-heading">
              Prove Compliance
              <br />
              Without Leaking the Score.
            </h2>
            <p className="text-zinc-400 mt-4 max-w-md mx-auto">
              Clone the repo, run <code className="text-brand-emerald-400">cargo run -p dpo2u-driver</code>, and verify a fresh LGPD attestation on Solana devnet in 60 seconds.
            </p>
            <div className="flex flex-wrap gap-4 mt-8 justify-center">
              <Button variant="hero" size="lg" onClick={() => window.open('https://github.com/fredericosanntana/dpo2u-solana', '_blank')}>
                View on GitHub
              </Button>
              <Button variant="heroSecondary" size="lg" onClick={() => window.location.href = '/solana-protocol'}>
                Explore Protocol
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.06] mt-16">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {/* Brand */}
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-b from-zinc-700 to-zinc-900 flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand-sapphire-400">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="2" x2="12" y2="22" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                  </svg>
                </div>
                <span className="text-lg font-semibold text-white">DPO2U</span>
              </div>
              <p className="text-zinc-500 text-sm max-w-xs">
                Compliance as a Protocol. Built for the Web3 Era.
              </p>
              <div className="flex gap-4 mt-4">
                <a href="https://github.com/fredericosanntana" target="_blank" rel="noopener noreferrer" className="text-zinc-600 hover:text-zinc-400 transition-colors text-sm">
                  GitHub
                </a>
                <a href="https://x.com/fredsanntana" target="_blank" rel="noopener noreferrer" className="text-zinc-600 hover:text-zinc-400 transition-colors text-sm">
                  X
                </a>
                <a href="https://linkedin.com/in/fredericosantana" target="_blank" rel="noopener noreferrer" className="text-zinc-600 hover:text-zinc-400 transition-colors text-sm">
                  LinkedIn
                </a>
              </div>
            </div>

            {/* Link Columns */}
            {Object.entries(FOOTER_LINKS).map(([title, links]) => (
              <div key={title}>
                <h4 className="text-sm font-medium text-zinc-300 mb-4">{title}</h4>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link.label}>
                      <a href={link.href} className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/[0.06] mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-zinc-600">&copy; 2026 DPO2U</p>
            <div className="flex gap-6">
              <a href="/privacy" className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">Privacy</a>
              <a href="/terms" className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">Terms</a>
              <a href="mailto:contato@dpo2u.com.br" className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </section>
  );
}
