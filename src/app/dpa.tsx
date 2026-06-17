/**
 * /dpa — Data Processing Agreement (template).
 *
 * Legal page in the sealed design. GDPR Art. 28 + LGPD Art. 39 processor clauses,
 * with honest framing: it is DPO2U's standard template, executed by a signed contract
 * (access alone does not automatically bind). Phase 0 / gate G6 —
 * "non-negotiable for a compliance company".
 */
import React from 'react';
import { usePageHead } from '@/lib/page-head';
import { FONTS, PALETTE, SmallLabel, Rule } from '@/components/sealed/atoms';

const CLAUSES: { h: string; b: string }[] = [
  {
    h: '1. Subject matter, duration and nature of processing',
    b: 'This Data Processing Agreement (DPA) governs the processing of personal data carried out by DPO2U ("Processor" / "Operador") on behalf of the Client ("Controller" / "Controlador") within the scope of the contracted services (DPIA/audit generation, on-chain compliance attestation and associated services). The duration follows the main contract. The categories of data subjects and of data are those described in the contract/service order.',
  },
  {
    h: '2. Processing only on documented instructions — GDPR Art. 28(3)(a) · LGPD Art. 39',
    b: 'The Processor processes personal data only on documented instructions from the Controller, including with regard to international transfers, unless required to do so by law — in which case the Processor informs the Controller before processing, unless the law prohibits it.',
  },
  {
    h: '3. Confidentiality — GDPR Art. 28(3)(b)',
    b: 'The Processor ensures that persons authorized to process the personal data have committed themselves to confidentiality or are under an appropriate statutory obligation of confidentiality.',
  },
  {
    h: '4. Security of processing — GDPR Art. 32 · LGPD Art. 46-49',
    b: 'The Processor implements technical and organizational measures appropriate to the risk: encryption in transit and at rest where applicable, role-based access control, audit logging, and — where the product requires it — minimization by design (the attestation anchors a hash/commitment, not cleartext PII). The score stays private; the proof is public.',
  },
  {
    h: '5. Subprocessors — GDPR Art. 28(2)(4)',
    b: 'The Processor engages subprocessors only with the Controller’s authorization (general or specific), imposing on them by contract the same data-protection obligations. The list of subprocessors and any changes are communicated to the Controller, who may object.',
  },
  {
    h: '6. Assistance to the Controller — GDPR Art. 28(3)(e)(f)',
    b: 'The Processor assists the Controller, as far as possible, in responding to data-subject requests (access, rectification, erasure, portability, objection — GDPR Art. 15-22 / LGPD Art. 18), and in meeting its obligations of security, breach notification, DPIA/RIPD and prior consultation (GDPR Art. 32-36 / LGPD Art. 38, 48).',
  },
  {
    h: '7. Breach notification — GDPR Art. 33 · LGPD Art. 48',
    b: 'The Processor notifies the Controller without undue delay after becoming aware of a personal data breach, providing sufficient information for the Controller to meet its obligations to notify the supervisory authority (ANPD/DPA) and the data subjects within the statutory deadlines.',
  },
  {
    h: '8. Deletion or return on termination — GDPR Art. 28(3)(g)',
    b: 'On termination of the service, the Processor, at the Controller’s choice, deletes or returns the personal data and erases existing copies, save for retention required by law. For data anchored on-chain, the documented erasure strategy applies (off-chain + hash / cryptographic shredding / tombstone), preserving the immutability of the record without exposing PII.',
  },
  {
    h: '9. Audit and inspection — GDPR Art. 28(3)(h)',
    b: 'The Processor makes available to the Controller the information necessary to demonstrate compliance and allows for and contributes to audits/inspections. The on-chain attestation itself (a publicly verifiable seal) serves as continuous, independent evidence of the compliance state.',
  },
  {
    h: '10. International transfers',
    b: 'Any international transfer occurs only under appropriate safeguards (standard contractual clauses, adequacy or another legal basis), as instructed by the Controller and per the applicable jurisdiction among the 24 covered.',
  },
];

export default function DPAPage() {
  usePageHead({
    title: 'Data Processing Agreement (DPA) — DPO2U',
    description:
      'DPO2U Data Processing Agreement (DPA) template — GDPR Art. 28 + LGPD Art. 39 processor clauses: documented instructions, confidentiality, security (Art. 32), subprocessors, data-subject assistance, breach notification, deletion/return, audit and international transfers.',
    path: '/dpa',
  });

  return (
    <div
      className="min-h-screen"
      style={{ background: PALETTE.paper, color: PALETTE.ink, fontFamily: FONTS.body }}
    >
      <div className="max-w-[820px] mx-auto px-6 md:px-10 py-16 md:py-24">
        <SmallLabel style={{ marginBottom: 16 }}>§ LEGAL · DPA</SmallLabel>
        <h1
          className="text-[40px] md:text-[56px] leading-[1.04] font-medium"
          style={{ fontFamily: FONTS.display, letterSpacing: '-0.02em', margin: 0 }}
        >
          Data Processing<br />
          <span style={{ fontStyle: 'italic' }}>Agreement</span>
          <span style={{ color: PALETTE.terracotta }}>.</span>
        </h1>
        <p className="mt-4 font-mono text-[12px] uppercase tracking-[0.16em]" style={{ color: PALETTE.concrete }}>
          Template · GDPR Art. 28 + LGPD Art. 39 · last updated {new Date().toISOString().slice(0, 10)}
        </p>
        <p className="mt-6 max-w-[64ch] text-[17px] leading-[1.6]" style={{ color: PALETTE.inkSoft }}>
          This is DPO2U’s standard DPA template as a data Processor. It is executed by a signed
          contract between Controller and Processor — accessing this page does not, by itself,
          constitute a binding agreement. To execute a DPA, contact{' '}
          <a href="mailto:dpo@dpo2u.com" style={{ color: PALETTE.terracotta, textDecoration: 'underline' }}>dpo@dpo2u.com</a>.
        </p>

        <Rule style={{ margin: '40px 0' }} color={PALETTE.ruleStrong} />

        <div className="space-y-8">
          {CLAUSES.map(({ h, b }) => (
            <section key={h}>
              <h2
                className="text-[19px] md:text-[21px] mb-2 font-medium"
                style={{ fontFamily: FONTS.display, letterSpacing: '-0.01em' }}
              >
                {h}
              </h2>
              <p className="text-[15px] leading-[1.6]" style={{ color: PALETTE.inkSoft }}>{b}</p>
            </section>
          ))}
        </div>

        <Rule style={{ margin: '40px 0 24px' }} color={PALETTE.ruleStrong} />
        <p className="text-[13px]" style={{ color: PALETTE.concrete }}>
          This is not legal advice. Template document; the executable version is provided and
          signed at onboarding. See also{' '}
          <a href="/privacy" style={{ color: PALETTE.terracotta, textDecoration: 'underline' }}>Privacy</a>{' '}
          and <a href="/terms" style={{ color: PALETTE.terracotta, textDecoration: 'underline' }}>Terms</a>.
        </p>
      </div>
    </div>
  );
}
