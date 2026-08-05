import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { usePageHead } from '@/lib/page-head';
import { FONTS, PALETTE, SmallLabel } from '@/components/sealed/atoms';
import JurisdictionMap from '@/components/sealed/sections/JurisdictionMap';

// Aliases pra URL slugs longos → codes existentes. Suporta /coverage/mexico
// e /coverage/lfpdppp etc. Sem match, scroll é no-op (página normal).
const URL_SLUG_TO_CODE: Record<string, string> = {
  mexico: 'MEXICO',
  lfpdppp: 'MEXICO',
  vietnam: 'VIETNAM',
  'decree-13': 'VIETNAM',
  decree13: 'VIETNAM',
  malaysia: 'MALAYSIA',
  'pdpa-my': 'MALAYSIA',
  japan: 'APPI',
  appi: 'APPI',
  brazil: 'LGPD',
  lgpd: 'LGPD',
  eu: 'GDPR',
  gdpr: 'GDPR',
};

interface JurisdictionCard {
  code: string;
  flag: string;
  region: string;
  law: string;
  primaryArticle: string;
  authority: string;
  position: string;
}

// Editorial cards mirror the kb JSONs at packages/mcp-server/src/kb/jurisdictions/.
// Updated 2026-04-29 — POPIA, NDPA, PDPL added in the EMEA expansion sprint.
const COVERAGE: JurisdictionCard[] = [
  {
    code: 'LGPD',
    flag: '🇧🇷',
    region: 'Brazil · São Paulo (HQ)',
    law: 'Lei 13.709/2018',
    primaryArticle: 'Art. 18 — data subject rights · Art. 38 — DPIA',
    authority: 'ANPD',
    position: 'Home market · primary issuer · Art. 18 right-to-erasure on-chain.',
  },
  {
    code: 'GDPR',
    flag: '🇪🇺',
    region: 'European Union',
    law: 'Regulation (EU) 2016/679',
    primaryArticle: 'Art. 22 — automated decisions · Art. 25 — privacy by design',
    authority: 'National DPAs (CSSF lead for EU passport)',
    position: 'Cross-border EU compliance · CASP passport via MiCAR.',
  },
  {
    code: 'MiCAR',
    flag: '🇪🇺',
    region: 'EU crypto',
    law: 'Regulation (EU) 2023/1114',
    primaryArticle: 'Art. 23/35/36/39 — ART vault: PoR, liquidity, capital, velocity',
    authority: 'EBA / ESMA',
    position: 'EU stablecoin reserve audits — MiCAR ART vault primitive.',
  },
  {
    code: 'DPDP',
    flag: '🇮🇳',
    region: 'India',
    law: 'DPDP Act 2023 + Rules 2025',
    primaryArticle: '§6 consent · Capítulo 2 — Consent Manager registry',
    authority: 'Data Protection Board (DPBI)',
    position: 'Mass-market PaaS · first on-chain DPDP Consent Manager.',
  },
  {
    code: 'PDPA',
    flag: '🇸🇬',
    region: 'Singapore',
    law: 'PDPA 2012 (rev. 2021/2023)',
    primaryArticle: '§11 DPO · §26A breach (3d) · §26B portability',
    authority: 'PDPC',
    position: 'Institutional DeFi · AI Verify 2.0 seal of trust.',
  },
  {
    code: 'UAE',
    flag: '🇦🇪',
    region: 'Abu Dhabi · Dubai',
    law: 'ADGM DLT Foundations + VARA',
    primaryArticle: 'ADGM Reg. 2023 · VARA Rulebook',
    authority: 'ADGM FSRA · VARA',
    position: 'Foundation/DAO legal wrapper · ownerless protocol charter.',
  },
  {
    code: 'PDPL',
    flag: '🇦🇪',
    region: 'UAE federal',
    law: 'Federal Decree-Law 45/2021',
    primaryArticle: 'Art. 10 DPO · Art. 22 cross-border',
    authority: 'UAE Data Office',
    position: 'Federal data protection layer for UAE-domiciled CASPs.',
  },
  {
    code: 'POPIA',
    flag: '🇿🇦',
    region: 'South Africa · Johannesburg',
    law: 'Act 4 of 2013',
    primaryArticle: '§19 security · §22 breach · §71 automated decisions',
    authority: 'Information Regulator (SA)',
    position: 'SADC gateway · POPIA-compliant ZK feeds for Standard Bank / Absa.',
  },
  {
    code: 'NDPA',
    flag: '🇳🇬',
    region: 'Nigeria · Lagos',
    law: 'Nigeria Data Protection Act 2023',
    primaryArticle: '§28 rights · §37 automated · §40 breach (72h)',
    authority: 'NDPC',
    position: 'West Africa fintech · Flutterwave / Paystack / Chipper integration.',
  },
  {
    code: 'CCPA',
    flag: '🇺🇸',
    region: 'California · San Francisco',
    law: 'CCPA (2018) + CPRA (2023)',
    primaryArticle: '§1798.100 know · §1798.105 delete · §1798.121 sensitive PI · CPPA ADM Rules 2025',
    authority: 'CPPA + California AG',
    position: 'US enterprise market entry · primary ZK alternative to Vanta/OneTrust/Drata.',
  },
  {
    code: 'PIPEDA',
    flag: '🇨🇦',
    region: 'Canada federal · Toronto',
    law: 'PIPEDA (S.C. 2000, c. 5)',
    primaryArticle: 'Principle 4.3 consent · §10.1 breach (RROSH) · CSA 21-327 crypto',
    authority: 'OPC (Office of the Privacy Commissioner)',
    position: 'EU-adequate Americas bridge · cross-Atlantic data flow primitive.',
  },
  {
    code: 'LAW25',
    flag: '🇨🇦',
    region: 'Quebec · Montréal',
    law: 'Loi 25 — CQLR c P-39.1 (full enforcement Sept 2023)',
    primaryArticle: '§3.1 DPO · §12.1 ADM · §3.3 PIA · §28.1 right to de-indexation',
    authority: 'CAI (Commission d\'accès à l\'information)',
    position: 'First North American GDPR-equivalent · 4% global turnover penalties.',
  },
  {
    code: 'PIPA',
    flag: '🇰🇷',
    region: 'South Korea · Seoul',
    law: 'PIPA (reform Mar 2026, in force 11 Sept 2026)',
    primaryArticle: 'Art. 31 CPO · Art. 37-2 ADM · Art. 34 breach 72h · Art. 31-2 domestic rep',
    authority: 'PIPC (Personal Information Protection Commission)',
    position: 'Northeast Asia gateway · 10% revenue fines + personal CEO accountability post-09/2026.',
  },
  {
    code: 'PDP',
    flag: '🇮🇩',
    region: 'Indonesia · Jakarta',
    law: 'UU PDP — Law 27/2022 (fully in force Oct 2024)',
    primaryArticle: 'Art. 22 consent · Art. 46 breach 72h · Art. 53 DPO (Const. Court 2025) · Art. 2(2) extraterritorial',
    authority: 'PDP Agency (provisional MOCD/Komdigi)',
    position: '270M+ users · SE Asia largest economy · Constitutional Court expanded DPO scope.',
  },
  {
    code: 'APPI',
    flag: '🇯🇵',
    region: 'Japan · Tokyo',
    law: 'APPI (Act 57/2003, amend. 2022) + AI Promotion Act (Act 53/2025) + My Number Act',
    primaryArticle: 'Art. 17/18 purpose · Art. 26 breach · Art. 28 cross-border · Art. 40 EU/UK adequacy · §§19-22 My Number',
    authority: 'PPC (Personal Information Protection Commission)',
    position: 'G7 first comprehensive AI law · APPI + Hiroshima ICOC G7 · EU+UK dual adequacy · CAIO mandate FY2026.',
  },
  {
    code: 'MEXICO',
    flag: '🇲🇽',
    region: 'Mexico · Mexico City',
    law: 'LFPDPPP (2010) + Reglamento 2011 + Ley Fintech 2018 (sector financeiro)',
    primaryArticle: 'Art. 22-32 ARCO · Art. 8-9 consent (11 lawful bases) · Art. 36 cross-border · Art. 20 breach',
    authority: 'INAI (Instituto Nacional de Transparencia)',
    position: 'Largest LatAm crypto retail market · 8 ITF licenses ativas · LGPD-LFPDPPP 85% cross-mapping.',
  },
  {
    code: 'VIETNAM',
    flag: '🇻🇳',
    region: 'Vietnam · Hanoi',
    law: 'Decree 13/2023 NĐ-CP + Personal Data Protection Law 91/2025',
    primaryArticle: 'Art. 25 cross-border DPIA mandatória · Art. 23 breach 72h · Art. 11 consent explícito · Art. 28 DPO',
    authority: 'MPS (Ministry of Public Security · A05)',
    position: 'Most restrictive cross-border data transfer regime in Asia · Web3 gaming + remittance vertical.',
  },
  {
    code: 'MALAYSIA',
    flag: '🇲🇾',
    region: 'Malaysia · Kuala Lumpur',
    law: 'PDPA 2010 + Amendment 2024 (DPO mandatory + portability + 72h breach)',
    primaryArticle: '7 PDPPs · s. 12A DPO mandatory · s. 12B breach 72h · s. 43A portability · s. 129 cross-border',
    authority: 'PDPC Malaysia (Personal Data Protection Commission)',
    position: 'First SEA regime com DPO mandatory + data portability · 5 SC-licensed crypto RMOs.',
  },
  {
    code: 'KENYA',
    flag: '🇰🇪',
    region: 'Kenya · Nairobi',
    law: 'Data Protection Act 2019 + Regulations 2021',
    primaryArticle: 's. 25 principles · s. 31 DPIA · s. 43 breach · controller/processor registration (ODPC)',
    authority: 'ODPC (Office of the Data Protection Commissioner)',
    position: 'East Africa fintech hub · M-Pesa / crypto on-ramp corridor.',
  },
  {
    code: 'GHANA',
    flag: '🇬🇭',
    region: 'Ghana · Accra',
    law: 'Data Protection Act 2012 (Act 843)',
    primaryArticle: 's. 17 principles · s. 28 registration · data controller accountability',
    authority: 'Data Protection Commission (DPC)',
    position: 'West Africa remittance + agri-fintech rail.',
  },
  {
    code: 'COLOMBIA',
    flag: '🇨🇴',
    region: 'Colombia · Bogotá',
    law: 'Ley 1581 de 2012 + Decreto 1377/2013 (Habeas Data)',
    primaryArticle: 'Art. 8 derechos del titular · Art. 17 deberes · registro RNBD',
    authority: 'SIC (Superintendencia de Industria y Comercio)',
    position: 'LatAm Andina market · cross-mapping com LGPD/LFPDPPP.',
  },
  {
    code: 'TANZANIA',
    flag: '🇹🇿',
    region: 'Tanzania · Dodoma',
    law: 'Personal Data Protection Act 2022 (Act 11/2022) + Regs 2023',
    primaryArticle: 's. 23 principles · registration of collectors/processors · cross-border safeguards',
    authority: 'PDPC (Personal Data Protection Commission)',
    position: 'East Africa expansion · DPA + NDPA/POPIA proxy coverage.',
  },
  {
    code: 'UGANDA',
    flag: '🇺🇬',
    region: 'Uganda · Kampala',
    law: 'Data Protection and Privacy Act 2019 + Regs 2021',
    primaryArticle: 's. 3 principles · s. 29 security · registration with PDPO',
    authority: 'PDPO / NITA-U (Personal Data Protection Office)',
    position: 'East Africa diaspora remittance corridor.',
  },
  {
    code: 'MICAR-CASP',
    flag: '🇪🇺',
    region: 'EU · crypto-asset service providers',
    law: 'Regulation (EU) 2023/1114 — Title V',
    primaryArticle: 'Art. 60-61 authorization · Art. 68 governance · Art. 75 segregation · Art. 76-79 transparency · Art. 86-92 market abuse',
    authority: 'National NCAs / ESMA',
    position: 'CASP authorization layer — custody, exchange, trading-platform, placement (distinct from Title III ART).',
  },
];

export default function CoveragePage() {
  const params = useParams<{ code?: string }>();
  const slugCode = params.code?.toLowerCase();
  const targetCode = slugCode ? URL_SLUG_TO_CODE[slugCode] : undefined;

  usePageHead({
    title: 'Coverage — Twenty-four jurisdictions, one primitive | DPO2U',
    description:
      'Visual map of the twenty-four regulatory regimes DPO2U covers in code: LGPD, GDPR, MiCAR, MiCA Title V (CASP), DPDP, PDPA, UAE, PDPL, POPIA, NDPA, CCPA, PIPEDA, LAW25, PIPA, PDP, APPI, LFPDPPP (Mexico), Decree 13 (Vietnam), PDPA-MY (Malaysia), Kenya DPA, Ghana DPA, Colombia Ley 1581, Tanzania PDPA, and Uganda DPPA. Plus the AI Governance vertical (eight frameworks): Japan AI Promotion Act, Hiroshima ICOC G7, EU AI Act, Korea AI Basic Act, CAIDP Universal Guidelines for AI, UNESCO Recommendation on Ethics of AI, Singapore IMDA Model AI Governance Framework for Agentic AI v1.0, and the L1-L5 AI Governance Stack methodology (Kenney 2026). Aligned with CAIDP submission to UN Global Dialogue on AI Governance (UN GA Resolution 79/325). Legal-source manifests anchored on Stellar (Soroban) testnet, referenced by the attestation contract. EMEA + Americas + APAC + LatAm in one composition step.',
    path: params.code ? `/coverage/${slugCode}` : '/coverage',
  });

  // Scroll-to-card quando /coverage/:code é hit. Defer pra após hydration
  // pra garantir DOM tá pronto.
  useEffect(() => {
    if (!targetCode) return;
    const el = document.getElementById(`card-${targetCode.toLowerCase()}`);
    if (el) {
      // Pequeno delay pra animations/lazy components terminarem
      setTimeout(() => {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 200);
    }
  }, [targetCode]);

  return (
    <article className="pb-24">
      {/* Hero */}
      <section
        className="px-6 lg:px-14 pt-16 lg:pt-24 pb-12"
        style={{ borderBottom: `.5px solid ${PALETTE.rule}` }}
      >
        <SmallLabel style={{ marginBottom: 16 }}>§ COVERAGE</SmallLabel>
        <h1
          className="text-[40px] sm:text-[56px] lg:text-[72px]"
          style={{
            fontFamily: FONTS.display,
            fontWeight: 500,
            lineHeight: 1.02,
            letterSpacing: '-.03em',
            margin: 0,
          }}
        >
          Twenty-four jurisdictions.
          <br />
          <span style={{ fontStyle: 'italic' }}>One primitive layer.</span>
        </h1>
        <p
          style={{
            fontFamily: FONTS.body,
            fontSize: 18,
            lineHeight: 1.55,
            color: PALETTE.inkSoft,
            marginTop: 28,
            maxWidth: 640,
          }}
        >
          Each code below is a typed MCP tool, a Zod-validated knowledge base entry, and an
          on-chain attestation schema — all anchored to a single São Paulo hub.
          São Paulo to Seoul, San Francisco to Jakarta, Toronto to Montréal,
          Brussels to Lagos to Dubai — settled in one composition step.
        </p>
        <p
          style={{
            fontFamily: FONTS.mono,
            fontSize: 12,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: PALETTE.concrete,
            marginTop: 28,
          }}
        >
          — Soroban compliance contract · 70 MCP tools · 8 AI governance frameworks · legal-source manifests anchored on-chain · trustless verify by (use_case_id, evidence_hash) · Stellar testnet live · last updated 2026-06-05 —
        </p>
      </section>

      {/* Map */}
      <section
        className="px-6 lg:px-14 py-16"
        style={{ background: PALETTE.paper, borderBottom: `.5px solid ${PALETTE.rule}` }}
      >
        <SmallLabel style={{ marginBottom: 24 }}>§ HUB — SÃO PAULO</SmallLabel>

        <div
          style={{
            border: `.5px solid ${PALETTE.rule}`,
            background: PALETTE.paper,
            aspectRatio: '980 / 540',
          }}
        >
          <JurisdictionMap />
        </div>

        <p
          style={{
            fontFamily: FONTS.mono,
            fontSize: 11,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: PALETTE.concrete,
            marginTop: 16,
          }}
        >
          — Natural Earth projection · 110m world atlas · terracotta = privacy regime · verdigris = HAIP endorser · hatched = both —
        </p>
      </section>

      {/* AI Governance — Hiroshima Process callout. Verdigris is the second
          accent in the palette; matches the G7 stroke + UK diamond on the map. */}
      <section
        className="px-6 lg:px-14 py-16"
        style={{ background: PALETTE.paper, borderBottom: `.5px solid ${PALETTE.rule}` }}
      >
        <SmallLabel style={{ marginBottom: 24 }}>§ AI GOVERNANCE — HIROSHIMA PROCESS</SmallLabel>
        <h2
          className="text-[28px] sm:text-[36px] lg:text-[44px]"
          style={{
            fontFamily: FONTS.display,
            fontWeight: 500,
            lineHeight: 1.05,
            letterSpacing: '-.02em',
            margin: '0 0 24px',
            maxWidth: '24ch',
          }}
        >
          Seven G7 founders.
          <br />
          <span style={{ fontStyle: 'italic' }}>Sixty-six members and counting.</span>
        </h2>
        <p
          style={{
            fontFamily: FONTS.body,
            fontSize: 17,
            lineHeight: 1.6,
            color: PALETTE.inkSoft,
            margin: '0 0 28px',
            maxWidth: 640,
          }}
        >
          Verdigris fill on the map: the wider Friends of HAIP group — sixty-five
          countries plus the European Union, per Japan&apos;s MIC supporters page
          (May 2026 snapshot). Bold verdigris border: the seven G7 countries that
          launched the Hiroshima AI Process International Code of Conduct in
          October 2023. Diagonal hatch: countries that are both a DPO2U privacy
          regime and a HAIP endorser — the overlap layer where compliance and AI
          governance fuse. The HAIP reporting framework has been operational since
          February 2025; the code is embedded in Japan&apos;s AI Business Operator
          Guidelines v1.1 (Part D) and referenced by the EU AI Act&apos;s GPAI
          obligations.
        </p>
        <dl
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 24,
            margin: '0 0 24px',
            maxWidth: 880,
          }}
        >
          {[
            { k: 'Founders', v: 'G7 (US · UK · CA · FR · DE · IT · JP) + EU observer' },
            { k: 'Friends Group', v: '65 countries + EU = 66 members' },
            { k: 'Principles', v: '11 guiding · embedded in Japan AIBOG v1.1' },
            { k: 'Linked privacy codes', v: 'GDPR · APPI · PIPA · CCPA · PIPEDA · LAW25' },
          ].map(({ k, v }) => (
            <div key={k}>
              <dt
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 10,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: PALETTE.concrete,
                  marginBottom: 6,
                }}
              >
                {k}
              </dt>
              <dd
                style={{
                  margin: 0,
                  fontFamily: FONTS.body,
                  fontSize: 14,
                  lineHeight: 1.45,
                  color: PALETTE.ink,
                }}
              >
                {v}
              </dd>
            </div>
          ))}
        </dl>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
          <a
            href="/protocol"
            style={{
              fontFamily: FONTS.mono,
              fontSize: 11,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: PALETTE.verdigris,
              borderBottom: `.5px solid ${PALETTE.verdigris}`,
              paddingBottom: 2,
            }}
          >
            → Live attestation on Stellar · /protocol
          </a>
          <a
            href="https://www.soumu.go.jp/hiroshimaaiprocess/en/supporters.html"
            target="_blank"
            rel="noreferrer"
            style={{
              fontFamily: FONTS.mono,
              fontSize: 11,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: PALETTE.concrete,
              borderBottom: `.5px solid ${PALETTE.concrete}`,
              paddingBottom: 2,
            }}
          >
            ↗ Source: Japan MIC supporters list
          </a>
        </div>
      </section>

      {/* AI Governance — CAIDP + UNESCO + UN Global Dialogue alignment.
          Operationalizes CAIDP April 2026 comments to the UN Global Dialogue
          (UN GA Res 79/325). 12 universal guidelines, 7 red lines with
          termination obligation, 10 AI Index indicators, UNESCO RAM 6
          dimensions. */}
      <section
        className="px-6 lg:px-14 py-16"
        style={{ background: PALETTE.paper, borderBottom: `.5px solid ${PALETTE.rule}` }}
      >
        <SmallLabel style={{ marginBottom: 24 }}>§ AI GOVERNANCE — CAIDP + UNESCO + UN ALIGNMENT</SmallLabel>
        <h2
          className="text-[28px] sm:text-[36px] lg:text-[44px]"
          style={{
            fontFamily: FONTS.display,
            fontWeight: 500,
            lineHeight: 1.05,
            letterSpacing: '-.02em',
            margin: '0 0 24px',
            maxWidth: '24ch',
          }}
        >
          Red lines, computed.
          <br />
          <span style={{ fontStyle: 'italic' }}>Termination, attested.</span>
        </h2>
        <p
          style={{
            fontFamily: FONTS.body,
            fontSize: 17,
            lineHeight: 1.6,
            color: PALETTE.inkSoft,
            margin: '0 0 28px',
            maxWidth: 640,
          }}
        >
          The Center for AI and Digital Policy (CAIDP) submitted three core
          recommendations to the UN Global Dialogue on AI Governance in April
          2026: a UN Special Rapporteur on AI and Human Rights, bridging the
          AI safety and fairness agendas, and explicit red lines plus
          termination obligation for pseudoscientific and discriminatory AI.
          DPO2U operationalizes that submission. Seven canonical red-line
          categories — emotion analysis, biometric categorization, biometric
          mass surveillance, predictive policing, child targeting, social
          scoring, subliminal manipulation — are typed flags on every
          aiModelConfig and audited against EU AI Act Article 5 plus the
          CAIDP Universal Guidelines. UNESCO RAM&apos;s six readiness
          dimensions and the AI Index 2026&apos;s ten indicators are wired
          into <code style={{ fontFamily: FONTS.mono, fontSize: 14 }}>caidp_ai_index_score</code>.
          Termination obligation is anchored on-chain via a rapporteur-gated
          instruction on the Hiroshima program — irreversible per AI system,
          designed to receive a UN-level authority once the Special Rapporteur
          mandate is established.
        </p>
        <dl
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 24,
            margin: '0 0 24px',
            maxWidth: 880,
          }}
        >
          {[
            { k: 'CAIDP Universal Guidelines', v: '12 principles · ratified 2018 · 250+ expert endorsers' },
            { k: 'Red lines', v: '7 categories · termination obligation per CAIDP UG Princípio 12' },
            { k: 'AI Index 2026', v: '10 indicators · 90-country baseline · human rights + democratic principles' },
            { k: 'UNESCO RAM', v: '6 dimensions · legal · institutional · social · scientific · economic · technical' },
            { k: 'UN GA Resolution 79/325', v: 'Established Global Dialogue on AI Governance · Sept 2025' },
            { k: 'Hiroshima program upgrade', v: '8 attestation types · RapporteurConfig · TerminationOrder · rapporteur-gated termination instruction' },
          ].map(({ k, v }) => (
            <div key={k}>
              <dt
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 10,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: PALETTE.concrete,
                  marginBottom: 6,
                }}
              >
                {k}
              </dt>
              <dd
                style={{
                  margin: 0,
                  fontFamily: FONTS.body,
                  fontSize: 14,
                  lineHeight: 1.45,
                  color: PALETTE.ink,
                }}
              >
                {v}
              </dd>
            </div>
          ))}
        </dl>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
          <a
            href="/mcp"
            style={{
              fontFamily: FONTS.mono,
              fontSize: 11,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: PALETTE.verdigris,
              borderBottom: `.5px solid ${PALETTE.verdigris}`,
              paddingBottom: 2,
            }}
          >
            → 4 new MCP tools · /mcp
          </a>
          <a
            href="https://www.caidp.org/universal-guidelines-for-ai/"
            target="_blank"
            rel="noreferrer"
            style={{
              fontFamily: FONTS.mono,
              fontSize: 11,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: PALETTE.concrete,
              borderBottom: `.5px solid ${PALETTE.concrete}`,
              paddingBottom: 2,
            }}
          >
            ↗ Source: CAIDP Universal Guidelines
          </a>
          <a
            href="https://www.un.org/global-dialogue-ai-governance/en"
            target="_blank"
            rel="noreferrer"
            style={{
              fontFamily: FONTS.mono,
              fontSize: 11,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: PALETTE.concrete,
              borderBottom: `.5px solid ${PALETTE.concrete}`,
              paddingBottom: 2,
            }}
          >
            ↗ UN Global Dialogue on AI
          </a>
        </div>
      </section>

      {/* Coverage list */}
      <section className="px-6 lg:px-14 py-20" style={{ background: PALETTE.paper2 }}>
        <SmallLabel style={{ marginBottom: 16 }}>§ CODES — KB SNAPSHOT</SmallLabel>
        <h2
          className="text-[32px] sm:text-[40px] lg:text-[48px]"
          style={{
            fontFamily: FONTS.display,
            fontWeight: 500,
            lineHeight: 1.05,
            letterSpacing: '-.02em',
            margin: '0 0 40px',
            maxWidth: '24ch',
          }}
        >
          Each code, one tool.
          <br />
          <span style={{ fontStyle: 'italic' }}>Same primitive layer.</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12">
          {COVERAGE.map((c) => (
            <article
              key={c.code}
              id={`card-${c.code.toLowerCase()}`}
              style={{
                borderTop: `.5px solid ${PALETTE.rule}`,
                paddingTop: 20,
              }}
            >
              <div className="flex items-baseline justify-between mb-4">
                <span
                  style={{
                    fontFamily: FONTS.display,
                    fontSize: 26,
                    fontWeight: 500,
                    letterSpacing: '-.01em',
                    color: PALETTE.ink,
                  }}
                >
                  {c.code}
                </span>
                <span style={{ fontSize: 22 }} aria-hidden>
                  {c.flag}
                </span>
              </div>
              <p
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 11,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: PALETTE.concrete,
                  marginBottom: 12,
                }}
              >
                {c.region}
              </p>
              <dl style={{ fontFamily: FONTS.body, fontSize: 14, lineHeight: 1.55, color: PALETTE.inkSoft }}>
                <dt
                  style={{
                    fontFamily: FONTS.mono,
                    fontSize: 10,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: PALETTE.concrete,
                    marginTop: 8,
                  }}
                >
                  Law
                </dt>
                <dd style={{ margin: 0 }}>{c.law}</dd>
                <dt
                  style={{
                    fontFamily: FONTS.mono,
                    fontSize: 10,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: PALETTE.concrete,
                    marginTop: 12,
                  }}
                >
                  Authority
                </dt>
                <dd style={{ margin: 0 }}>{c.authority}</dd>
                <dt
                  style={{
                    fontFamily: FONTS.mono,
                    fontSize: 10,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: PALETTE.concrete,
                    marginTop: 12,
                  }}
                >
                  Primary article
                </dt>
                <dd style={{ margin: 0 }}>{c.primaryArticle}</dd>
              </dl>
              <p
                style={{
                  fontFamily: FONTS.body,
                  fontStyle: 'italic',
                  fontSize: 14,
                  lineHeight: 1.55,
                  color: PALETTE.ink,
                  marginTop: 18,
                  paddingTop: 14,
                  borderTop: `.5px dashed ${PALETTE.rule}`,
                }}
              >
                {c.position}
              </p>
            </article>
          ))}
        </div>
      </section>


      {/* Footer note */}
      <section
        className="px-6 lg:px-14 py-16"
        style={{ background: PALETTE.paper, borderTop: `.5px solid ${PALETTE.rule}` }}
      >
        <p
          style={{
            fontFamily: FONTS.body,
            fontSize: 16,
            lineHeight: 1.6,
            color: PALETTE.inkSoft,
            maxWidth: 640,
          }}
        >
          Source of truth lives in{' '}
          <code
            style={{
              fontFamily: FONTS.mono,
              fontSize: 13,
              background: PALETTE.paper2,
              padding: '2px 6px',
              border: `.5px solid ${PALETTE.rule}`,
            }}
          >
            packages/mcp-server/src/kb/jurisdictions/
          </code>
          {' '}— twenty-four Zod-validated JSONs, addressable by
          code or alias (PDPL → UAE, ZA → POPIA, NG → NDPA, US/CA-US → CCPA, CA → PIPEDA, QC → LAW25, JP/JAPAN → APPI, CASP → MiCA Title V).
          Each entry powers <em>compare_jurisdictions</em>,{' '}
          <em>check_compliance</em>, and the on-chain attestation schemas in the
          DPO2U Soroban contract on Stellar.
        </p>
      </section>
    </article>
  );
}
