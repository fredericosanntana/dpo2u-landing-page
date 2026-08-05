import React from 'react';
import { usePageHead } from '@/lib/page-head';
import { FONTS, PALETTE, SmallLabel, Rule } from '@/components/sealed/atoms';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginTop: 28 }}>
      <h2 style={{ fontFamily: FONTS.display, fontSize: 20, fontWeight: 500, color: PALETTE.ink, marginBottom: 8 }}>{title}</h2>
      <p style={{ fontFamily: FONTS.body, fontSize: 15, lineHeight: 1.6, color: PALETTE.inkSoft }}>{children}</p>
    </div>
  );
}

export default function TermsPage() {
  usePageHead({
    title: 'Terms of Service | DPO2U',
    description: 'Terms governing use of dpo2u.com, the public artifacts, and the DPO2U Soroban contract on Stellar testnet.',
    path: '/terms',
  });

  return (
    <section className="px-6 lg:px-14 py-20" style={{ maxWidth: 820, margin: '0 auto' }}>
      <SmallLabel>Legal</SmallLabel>
      <h1
        className="text-[36px] md:text-[48px] font-medium"
        style={{ fontFamily: FONTS.display, letterSpacing: '-0.02em', color: PALETTE.ink, marginTop: 6 }}
      >
        Terms of Use<span style={{ color: PALETTE.terracotta }}>.</span>
      </h1>
      <p style={{ fontFamily: FONTS.mono, fontSize: 12, color: PALETTE.concrete, marginTop: 12 }}>
        Last updated: {new Date().toISOString().slice(0, 10)}
      </p>

      <p style={{ fontFamily: FONTS.body, fontSize: 15, lineHeight: 1.6, color: PALETTE.inkSoft, marginTop: 24 }}>
        By accessing and using this website, you agree to these Terms. DPO2U may update these Terms as needed.
      </p>

      <Rule color={PALETTE.ruleStrong} style={{ margin: '28px 0 0' }} />

      <Section title="Use of Content">
        Content is provided for informational purposes only and does not constitute legal advice. All
        intellectual property rights remain with DPO2U.
      </Section>

      <Section title="Responsibilities">
        You agree not to use this site in any unlawful manner or in a way that violates the rights of
        third parties.
      </Section>

      <Section title="Limitation of Liability">
        DPO2U provides this website and its content "as is" without warranties of any kind. We are not
        liable for any damages arising from the use of this site.
      </Section>

      <Section title="Contact">
        For questions about these terms, please contact us at{' '}
        <a href="mailto:contato@dpo2u.com.br" style={{ color: PALETTE.terracotta, textDecoration: 'underline', textUnderlineOffset: 3 }}>
          contato@dpo2u.com.br
        </a>
        .
      </Section>
    </section>
  );
}
