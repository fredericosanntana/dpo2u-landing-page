import React from 'react';

const TESTIMONIALS = [
  {
    quote: 'DPO2U transformed how we handle LGPD compliance. Zero-knowledge attestations mean our clients\' data never leaves their environment during audits.',
    name: 'Maria Silva',
    role: 'CTO, FinTech Brasil',
    initials: 'MS',
  },
  {
    quote: 'The autonomous agents reduced our compliance overhead by 80%. What used to take weeks of manual auditing now runs continuously on autopilot.',
    name: 'Carlos Mendes',
    role: 'DPO, DataGuard',
    initials: 'CM',
  },
  {
    quote: 'The self-funding tokenomics model is brilliant. The protocol literally pays for its own ZK computation — no monthly SaaS fees eating into margins.',
    name: 'Ana Ferreira',
    role: 'CEO, ChainAudit',
    initials: 'AF',
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-32 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-semibold text-apex-heading">
            Trusted by Compliance
            <br />
            Leaders Everywhere
          </h2>
          <p className="text-zinc-400 mt-4">
            Hear from teams building on the protocol.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={t.name}
              className={`liquid-glass rounded-3xl p-8 ${i === 1 ? 'md:-translate-y-6' : ''}`}
            >
              <p className="text-zinc-300 text-sm leading-relaxed italic">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="border-t border-white/10 mt-6 pt-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-sm font-medium text-zinc-300">
                  {t.initials}
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{t.name}</p>
                  <p className="text-zinc-500 text-xs">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
