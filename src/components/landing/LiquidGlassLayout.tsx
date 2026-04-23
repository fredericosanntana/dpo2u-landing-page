import React from 'react';
import LiquidGlassNav from './LiquidGlassNav';

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

interface LiquidGlassLayoutProps {
  children: React.ReactNode;
}

export default function LiquidGlassLayout({ children }: LiquidGlassLayoutProps) {
  return (
    <div className="apex-bg min-h-screen font-geist">
      <LiquidGlassNav />

      <main className="pt-24">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
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
                <a href="https://github.com/fredericosanntana" target="_blank" rel="noopener noreferrer" className="text-zinc-600 hover:text-zinc-400 transition-colors text-sm">GitHub</a>
                <a href="https://x.com/fredsanntana" target="_blank" rel="noopener noreferrer" className="text-zinc-600 hover:text-zinc-400 transition-colors text-sm">X</a>
                <a href="https://linkedin.com/in/fredericosantana" target="_blank" rel="noopener noreferrer" className="text-zinc-600 hover:text-zinc-400 transition-colors text-sm">LinkedIn</a>
              </div>
            </div>

            {Object.entries(FOOTER_LINKS).map(([title, links]) => (
              <div key={title}>
                <h4 className="text-sm font-medium text-zinc-300 mb-4">{title}</h4>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link.label}>
                      <a href={link.href} className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">{link.label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-white/[0.06] mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-zinc-600">&copy; 2026 DPO2U. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="/privacy" className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">Privacy</a>
              <a href="/terms" className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">Terms</a>
              <a href="mailto:contato@dpo2u.com.br" className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
