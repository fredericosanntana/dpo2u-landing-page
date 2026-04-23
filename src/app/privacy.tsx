import React from 'react';
import LiquidGlassLayout from '@/components/landing/LiquidGlassLayout';

export default function PrivacyPage() {
  return (
    <LiquidGlassLayout>
      <div className="py-16 px-4">
        <div className="max-w-3xl mx-auto liquid-glass rounded-3xl p-8 sm:p-12">
          <h1 className="text-3xl md:text-4xl font-semibold text-white mb-2">
            Privacy Policy
          </h1>
          <p className="text-zinc-500 text-sm mb-8">
            Last updated: {new Date().toISOString().slice(0, 10)}
          </p>

          <p className="text-zinc-300 mb-6 leading-relaxed">
            This policy describes how DPO2U handles personal data in compliance with
            LGPD (Law 13.709/2018) and, where applicable, the GDPR.
          </p>

          <div className="border-t border-white/10 my-6" />

          <h2 className="text-lg font-semibold text-white mb-3">Data Controller</h2>
          <p className="text-zinc-300 leading-relaxed">
            DPO2U — Frederico Santana, Sole Proprietor.
            <br />
            Contact: <a href="mailto:contato@dpo2u.com.br" className="text-brand-sapphire-400 hover:underline">contato@dpo2u.com.br</a>
          </p>

          <div className="border-t border-white/10 my-6" />

          <h2 className="text-lg font-semibold text-white mb-3">Purposes</h2>
          <ul className="space-y-2">
            <li className="flex items-start gap-2 text-zinc-300 text-sm"><span className="w-1.5 h-1.5 rounded-full bg-brand-sapphire-400 mt-1.5 shrink-0" />Respond to inquiries and contact requests.</li>
            <li className="flex items-start gap-2 text-zinc-300 text-sm"><span className="w-1.5 h-1.5 rounded-full bg-brand-sapphire-400 mt-1.5 shrink-0" />Measure site audience (analytics) with your consent.</li>
            <li className="flex items-start gap-2 text-zinc-300 text-sm"><span className="w-1.5 h-1.5 rounded-full bg-brand-sapphire-400 mt-1.5 shrink-0" />Provide services and relevant content (marketing) with your consent.</li>
          </ul>

          <div className="border-t border-white/10 my-6" />

          <h2 className="text-lg font-semibold text-white mb-3">Data Subject Rights</h2>
          <p className="text-zinc-300 text-sm leading-relaxed">
            You may request access, correction, anonymization, portability, deletion,
            and information about data sharing at any time by contacting us.
          </p>

          <div className="border-t border-white/10 my-6" />

          <h2 className="text-lg font-semibold text-white mb-3">Cookies &amp; Consent</h2>
          <p className="text-zinc-300 text-sm leading-relaxed">
            We use cookies for essential functionality, analytics, and marketing.
            You can accept, reject, or customize your preferences via the cookie banner.
          </p>

          <div className="border-t border-white/10 my-6" />

          <h2 className="text-lg font-semibold text-white mb-3">Data Security</h2>
          <p className="text-zinc-300 text-sm leading-relaxed">
            We implement appropriate technical and organizational measures to protect your
            personal data, including encryption in transit (TLS) and at rest.
          </p>
        </div>
      </div>
    </LiquidGlassLayout>
  );
}
