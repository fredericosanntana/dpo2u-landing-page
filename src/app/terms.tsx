import React from 'react';
import LiquidGlassLayout from '@/components/landing/LiquidGlassLayout';

export default function TermsPage() {
  return (
    <LiquidGlassLayout>
      <div className="py-16 px-4">
        <div className="max-w-3xl mx-auto liquid-glass rounded-3xl p-8 sm:p-12">
          <h1 className="text-3xl md:text-4xl font-semibold text-white mb-2">
            Terms of Use
          </h1>
          <p className="text-zinc-500 text-sm mb-8">
            Last updated: {new Date().toISOString().slice(0, 10)}
          </p>

          <p className="text-zinc-300 mb-6 leading-relaxed">
            By accessing and using this website, you agree to these Terms.
            DPO2U may update these Terms as needed.
          </p>

          <div className="border-t border-white/10 my-6" />

          <h2 className="text-lg font-semibold text-white mb-3">Use of Content</h2>
          <p className="text-zinc-300 text-sm leading-relaxed">
            Content is provided for informational purposes only and does not constitute legal advice.
            All intellectual property rights remain with DPO2U.
          </p>

          <div className="border-t border-white/10 my-6" />

          <h2 className="text-lg font-semibold text-white mb-3">Responsibilities</h2>
          <p className="text-zinc-300 text-sm leading-relaxed">
            You agree not to use this site in any unlawful manner or in a way that
            violates the rights of third parties.
          </p>

          <div className="border-t border-white/10 my-6" />

          <h2 className="text-lg font-semibold text-white mb-3">Limitation of Liability</h2>
          <p className="text-zinc-300 text-sm leading-relaxed">
            DPO2U provides this website and its content "as is" without warranties of any kind.
            We are not liable for any damages arising from the use of this site.
          </p>

          <div className="border-t border-white/10 my-6" />

          <h2 className="text-lg font-semibold text-white mb-3">Contact</h2>
          <p className="text-zinc-300 text-sm leading-relaxed">
            For questions about these terms, please contact us at{' '}
            <a href="mailto:contato@dpo2u.com.br" className="text-brand-sapphire-400 hover:underline">contato@dpo2u.com.br</a>.
          </p>
        </div>
      </div>
    </LiquidGlassLayout>
  );
}
