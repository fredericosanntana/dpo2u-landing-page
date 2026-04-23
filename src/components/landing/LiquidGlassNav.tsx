import React, { useState, useRef, useEffect } from 'react';
import { Shield, Brain, Fingerprint, ChevronDown } from 'lucide-react';

const PRODUCTS = [
  { num: '01', name: 'Solana Protocol',   desc: 'SP1 v6 ZK verifier + 6 Anchor programs on devnet', href: '/solana-protocol',     icon: Fingerprint, color: 'text-brand-purple-400' },
  { num: '02', name: 'MCP Brain',         desc: 'Model Context Protocol tools for compliance agents', href: '/mcp',                 icon: Brain,       color: 'text-brand-sapphire-400' },
  { num: '03', name: 'Compliance Engine', desc: 'LGPD/GDPR automated audit wizard',                   href: '/compliance-automate', icon: Shield,      color: 'text-brand-emerald-400' },
];

const NAV_LINKS = [
  { label: 'Protocol', href: '/solana-protocol' },
  { label: 'MCP',      href: '/mcp' },
  { label: 'About',    href: '/about' },
];

export default function LiquidGlassNav() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setDropdownOpen(false); setMobileOpen(false); }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4">
        <div className="liquid-glass-nav rounded-3xl px-6 py-3 flex items-center gap-6 max-w-[900px] w-full">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-b from-zinc-700 to-zinc-900 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand-sapphire-400">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="2" x2="12" y2="22" />
                <line x1="2" y1="12" x2="22" y2="12" />
              </svg>
            </div>
            <span className="text-xl font-semibold text-white">DPO2U</span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
            {/* Products Dropdown */}
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="text-sm text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
              >
                Products
                <ChevronDown className={`w-3 h-3 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[340px] liquid-glass-nav rounded-2xl p-2 border border-white/10">
                  {PRODUCTS.map((p) => (
                    <a
                      key={p.href}
                      href={p.href}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors group"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <div className={`w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center ${p.color} group-hover:bg-white/10 transition-colors`}>
                        <p.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm text-white font-medium">{p.name}</div>
                        <div className="text-xs text-zinc-500">{p.desc}</div>
                      </div>
                      <span className="text-[10px] text-zinc-600 ml-auto font-mono">{p.num}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Static Links */}
            {NAV_LINKS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            <a
              href="https://dpo2u.com.br"
              className="text-xs text-zinc-500 hover:text-zinc-300 border border-white/10 rounded-full px-3 py-1 transition-colors"
            >
              🇧🇷 PT
            </a>
            <a
              href="mailto:contato@dpo2u.com.br"
              className="bg-gradient-to-r from-brand-sapphire-500 to-brand-emerald-500 text-white rounded-full px-4 py-1.5 text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Get in Touch
            </a>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden flex flex-col gap-1 p-2 ml-auto"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            <span className="block w-5 h-0.5 bg-zinc-400 rounded" />
            <span className="block w-5 h-0.5 bg-zinc-400 rounded" />
            <span className="block w-5 h-0.5 bg-zinc-400 rounded" />
          </button>
        </div>
      </nav>

      {/* Mobile Nav Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[99] bg-[#050510]/95 backdrop-blur-xl flex flex-col items-center justify-center gap-6">
          <button
            className="absolute top-6 right-6 text-zinc-400 text-2xl"
            onClick={() => setMobileOpen(false)}
          >
            &times;
          </button>
          <p className="text-xs text-zinc-600 uppercase tracking-widest mb-2">Products</p>
          {PRODUCTS.map((p) => (
            <a
              key={p.href}
              href={p.href}
              className="text-lg text-white font-medium hover:text-brand-sapphire-400 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {p.name}
            </a>
          ))}
          <div className="w-16 h-px bg-white/10 my-2" />
          {NAV_LINKS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-lg text-zinc-400 hover:text-white transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <div className="flex gap-3 mt-4">
            <a href="https://dpo2u.com.br" className="text-sm text-zinc-500 border border-white/10 rounded-full px-4 py-2">🇧🇷 PT</a>
            <a href="mailto:contato@dpo2u.com.br" className="text-sm bg-gradient-to-r from-brand-sapphire-500 to-brand-emerald-500 text-white rounded-full px-4 py-2">Get in Touch</a>
          </div>
        </div>
      )}
    </>
  );
}
