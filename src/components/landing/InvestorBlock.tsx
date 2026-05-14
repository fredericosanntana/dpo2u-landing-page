import React from 'react';
import { motion } from 'framer-motion';
import { fadeIn, viewportOnce } from '@/lib/animations';

interface Column {
  title: string;
  body: string;
}

const COLUMNS: Column[] = [
  {
    title: 'What we do',
    body: 'Compliance research house. Publish research, ship code. Seventeen jurisdictions + AI Governance vertical (six frameworks) in code: LGPD, GDPR, MiCAR, DPDP, PDPA, UAE, PDPL, POPIA, NDPA, CCPA, PIPEDA, LAW25, PIPA, PDP, APPI, MEXICO, VIETNAM, MALAYSIA + Japan AI Promotion Act, Hiroshima ICOC G7, EU AI Act, Korea AI Basic Act, CAIDP Universal Guidelines, UNESCO RAM. 66 MCP tools. 14 Anchor programs on Solana. Aligned with CAIDP submission to UN Global Dialogue on AI Governance (UN GA Res 79/325). Five years of research.',
  },
  {
    title: 'Why it matters',
    body: 'Compliance is still sold as consulting-by-hour or SaaS-dashboards. DPO2U defines a third category: compliance-as-primitive. ZK proof > auditor PDF. Cross-jurisdictional > vendor-per-country.',
  },
  {
    title: 'The moat',
    body: 'Editorial accumulation. 6,586+ Zettelkasten notes. Weekly newsletter. Quarterly whitepapers. Fortnightly podcast. Not replicable in six months.',
  },
];

export default function InvestorBlock() {
  return (
    <section className="bg-dpo2u-ivory border-b border-dpo2u-ink/10">
      <div className="mx-auto max-w-[1200px] px-6 sm:px-8 lg:px-10 py-24 md:py-32">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={viewportOnce}
          variants={fadeIn}
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-dpo2u-ink/70 mb-6">
            — For investors —
          </p>
          <h2 className="font-display text-section text-dpo2u-ink font-medium max-w-[22ch]">
            Institutional trust, computed.
          </h2>
        </motion.div>

        {/* Three editorial columns */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
          {COLUMNS.map((col, i) => (
            <motion.article
              key={col.title}
              initial="initial"
              whileInView="animate"
              viewport={viewportOnce}
              variants={fadeIn}
              transition={{ delay: 0.08 * i }}
              className="border-t-2 border-dpo2u-indigo pt-6"
            >
              <h3 className="font-mono text-[11px] uppercase tracking-[0.16em] text-dpo2u-indigo mb-4">
                {col.title}
              </h3>
              <p className="font-display text-[17px] leading-[1.55] text-dpo2u-ink/85">
                {col.body}
              </p>
            </motion.article>
          ))}
        </div>

        {/* Investor footer block */}
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={viewportOnce}
          variants={fadeIn}
          className="mt-20 pt-10 border-t border-dpo2u-ink/15 grid grid-cols-1 md:grid-cols-2 gap-8 items-end"
        >
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-dpo2u-ink/70 mb-2">
              18-month target
            </p>
            <p className="font-display text-[32px] md:text-[40px] leading-none tracking-[-0.02em] text-dpo2u-ink font-medium">
              $1.3–5M ARR
            </p>
            <p className="mt-3 font-body text-[14px] text-dpo2u-ink/70">
              Low burn. High leverage. Enterprise-first 70-80%.
            </p>
          </div>
          <div className="md:text-right">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-dpo2u-ink/70 mb-2">
              Contact
            </p>
            <a
              href="mailto:fredericosanntana@gmail.com"
              className="font-display text-[22px] md:text-[24px] text-dpo2u-ink hover:text-dpo2u-indigo transition-colors border-b border-dpo2u-ink/20 hover:border-dpo2u-indigo pb-1"
            >
              fredericosanntana@gmail.com
            </a>
            <p className="mt-3 font-body text-[14px] text-dpo2u-ink/70">
              Frederico Santana · Founder
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
