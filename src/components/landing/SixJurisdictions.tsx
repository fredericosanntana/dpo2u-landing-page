import React from 'react';
import { motion } from 'framer-motion';
import { fadeIn, viewportOnce } from '@/lib/animations';

interface Jurisdiction {
  code: string;
  region: string;
  year: string;
  statute: string;
  mcpTool: string;
}

const JURISDICTIONS: Jurisdiction[] = [
  { code: 'LGPD',  region: 'Brasil',         year: '2018', statute: 'Lei 13.709',                           mcpTool: 'lgpd_gap_analysis' },
  { code: 'GDPR',  region: 'European Union', year: '2018', statute: 'Regulation 2016/679',                   mcpTool: 'gdpr_dpia' },
  { code: 'MiCAR', region: 'European Union', year: '2024', statute: 'Regulation 2023/1114',                  mcpTool: 'micar_art_audit' },
  { code: 'DPDP',  region: 'India',          year: '2023', statute: 'Digital Personal Data Protection Act', mcpTool: 'dpdp_consent' },
  { code: 'PDPA',  region: 'Singapore',      year: '2012', statute: 'Act 26 of 2012',                        mcpTool: 'pdpa_transfer' },
  { code: 'UAE',   region: 'ADGM + VARA',    year: '2021', statute: 'Data Protection Regulations',          mcpTool: 'adgm_foundation' },
];

export default function SixJurisdictions() {
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
            — Scope · Fifteen regulations + six AI governance frameworks in code —
          </p>
          <h2 className="font-display text-section text-dpo2u-ink font-medium max-w-[24ch]">
            Seventeen jurisdictions, computed.
          </h2>
          <p className="mt-6 font-body text-[17px] leading-relaxed text-dpo2u-ink/70 max-w-[56ch]">
            Each jurisdiction is a typed MCP tool: arguments, return shape, and attestation hash.
            Cross-jurisdictional work is a single compose step, not fifteen vendor contracts.
            AI Governance vertical adds six frameworks (Japan, Hiroshima ICOC, EU AI Act, Korea, CAIDP UG, UNESCO RAM) callable from the same surface.
          </p>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
          {JURISDICTIONS.map((j, i) => (
            <motion.article
              key={j.code}
              initial="initial"
              whileInView="animate"
              viewport={viewportOnce}
              variants={fadeIn}
              transition={{ delay: 0.05 * i }}
              className="border-t border-dpo2u-ink/15 pt-5"
            >
              <div className="flex items-baseline justify-between flex-wrap gap-3">
                <h3 className="font-display text-[28px] md:text-[32px] text-dpo2u-ink font-medium leading-none">
                  {j.code}
                </h3>
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-dpo2u-ink/70">
                  {j.region} · {j.year}
                </span>
              </div>
              <p className="mt-2 font-display italic text-[15px] text-dpo2u-ink/65">
                {j.statute}
              </p>
              <p className="mt-3 font-mono text-[11px] tracking-[0.04em] text-dpo2u-indigo">
                → MCP tool: <span className="text-dpo2u-ink/80">{j.mcpTool}</span>
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
