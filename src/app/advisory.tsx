/**
 * /advisory — advisory de compliance Web3: a linha de receita mais próxima da DPO2U.
 * Voz do Frederico como Chief Compliance and Innovation Officer: quem já fez compliance
 * cripto na prática. Sem nome de parceiro ou cliente e sem número de clientes. EN e PT.
 * Contato por e-mail (contato@dpo2u.com); os preços são a proposta em aprovação.
 */
import React, { useEffect, useState } from 'react';
import { usePageHead } from '@/lib/page-head';
import { FONTS, PALETTE, Rule, SmallLabel } from '@/components/sealed/atoms';

const TERRA = '#A84A2D';
const h2: React.CSSProperties = { fontFamily: FONTS.display, fontWeight: 500, lineHeight: 1.05, letterSpacing: '-.03em', margin: 0 };
const card: React.CSSProperties = { background: PALETTE.paper2, border: `.5px solid ${PALETTE.ruleStrong}`, borderRadius: 4 };

type Lang = 'en' | 'pt';
type T = Record<Lang, string>;

interface Offer { id: string; name: T; price: T; time: T; for: T; gets: Record<Lang, string[]> }

const OFFERS: Offer[] = [
  {
    id: 'diagnostic',
    name: { en: 'Regulatory diagnostic', pt: 'Diagnóstico regulatório' },
    price: { en: 'US$ 6,000 fixed', pt: 'US$ 6.000 fechado' },
    time: { en: '2 weeks', pt: '2 semanas' },
    for: { en: 'A crypto or Web3 project that needs to know which rules apply before launch or before a raise.', pt: 'Projeto cripto ou Web3 que precisa saber quais regras valem antes de lançar ou de captar.' },
    gets: {
      en: ['Map of the rules by market: VASP licensing, Travel Rule, MiCA, LGPD and GDPR', 'Gaps ranked by risk and deadline', 'A 90-day roadmap you can hand to counsel and investors'],
      pt: ['Mapa das regras por mercado: autorização de PSAV/VASP, Travel Rule, MiCA, LGPD e GDPR', 'Lacunas em ordem de risco e prazo', 'Roteiro de 90 dias para entregar ao jurídico e aos investidores'],
    },
  },
  {
    id: 'structuring',
    name: { en: 'Compliance structuring', pt: 'Estruturação de compliance' },
    price: { en: 'From US$ 20,000', pt: 'A partir de US$ 20.000' },
    time: { en: '6 to 8 weeks', pt: '6 a 8 semanas' },
    for: { en: 'A project that will operate in a regulated market and must show the controls working.', pt: 'Projeto que vai operar em mercado regulado e precisa mostrar os controles funcionando.' },
    gets: {
      en: ['Policies: AML/CFT, Travel Rule, privacy and incident response', 'Travel Rule and data-protection flows designed into the product (privacy by design)', 'DPIA and records of processing', 'On-chain evidence of each control with the DPO2U protocol'],
      pt: ['Políticas: PLD/FT, Travel Rule, privacidade e resposta a incidentes', 'Fluxos de Travel Rule e de proteção de dados desenhados no produto (privacy by design)', 'RIPD/DPIA e registro das operações de tratamento', 'Evidência on-chain de cada controle com o protocolo DPO2U'],
    },
  },
  {
    id: 'fractional',
    name: { en: 'Fractional compliance officer', pt: 'Compliance officer fracionado' },
    price: { en: 'US$ 4,000 per month', pt: 'US$ 4.000 por mês' },
    time: { en: '3-month minimum', pt: 'Mínimo de 3 meses' },
    for: { en: 'A team that needs a compliance and privacy lead (DPO) without a full-time hire.', pt: 'Time que precisa de um responsável por compliance e privacidade (DPO) sem contratar em tempo integral.' },
    gets: {
      en: ['Named DPO and compliance contact for regulators and partners', 'Monthly review of new features, listings and markets', 'Answers to exchanges, banks and auditors on your behalf'],
      pt: ['DPO e contato de compliance nomeados para reguladores e parceiros', 'Revisão mensal de novas features, listagens e mercados', 'Respostas a exchanges, bancos e auditores em nome do projeto'],
    },
  },
];

const COPY = {
  en: {
    tag: 'Web3 compliance advisory',
    h1: 'Compliance for crypto projects, from someone who has done it.',
    lead: 'Frederico Santana, DPO and Chief Compliance and Innovation Officer at DPO2U, structures regulation and data protection for Web3 projects: VASP licensing, Travel Rule, MiCA, LGPD and GDPR for dApps. Each control can be proved on chain with the DPO2U protocol.',
    offers: 'How we work',
    for: 'For',
    gets: 'You get',
    how: 'What makes it different',
    howItems: [
      'Practice, not slides: the same rules run in the DPO2U protocol on Midnight, Stellar and Avalanche.',
      'Privacy and financial regulation together, which is where most crypto projects get stuck.',
      'Global by design: Brazil, the EU under MiCA and other markets in the same map.',
    ],
    cta: 'Talk to us',
    ctaNote: 'Tell us the project, the markets and the deadline. We answer within two business days.',
    agents: 'Building an AI agent? It checks compliance on its own, paid per call',
    note: 'Advisory on compliance and data protection. Legal opinions are given by your counsel; we work with them.',
    paid: 'Paid by bank transfer or in USDC.',
  },
  pt: {
    tag: 'Advisory de compliance Web3',
    h1: 'Compliance para projetos cripto, com quem já fez.',
    lead: 'Frederico Santana, DPO e Chief Compliance and Innovation Officer da DPO2U, estrutura a regulação e a proteção de dados de projetos Web3: autorização de PSAV/VASP, Travel Rule, MiCA, LGPD e GDPR para dApps. Cada controle pode ser provado on-chain com o protocolo DPO2U.',
    offers: 'Como trabalhamos',
    for: 'Para',
    gets: 'Você recebe',
    how: 'O que muda',
    howItems: [
      'Prática, não slides: as mesmas regras rodam no protocolo DPO2U na Midnight, na Stellar e na Avalanche.',
      'Privacidade e regulação financeira juntas, que é onde a maior parte dos projetos cripto trava.',
      'Global de origem: Brasil, União Europeia sob a MiCA e outros mercados no mesmo mapa.',
    ],
    cta: 'Fale com a gente',
    ctaNote: 'Conte o projeto, os mercados e o prazo. Respondemos em até dois dias úteis.',
    agents: 'Construindo um agente de IA? Ele confere compliance sozinho, pago por chamada',
    note: 'Advisory de compliance e proteção de dados. Parecer jurídico é do seu advogado; trabalhamos junto com ele.',
    paid: 'Pagamento por transferência ou em USDC.',
  },
} as const;

export default function AdvisoryPage() {
  const [lang, setLang] = useState<Lang>(() => (typeof navigator !== 'undefined' && navigator.language?.toLowerCase().startsWith('pt') ? 'pt' : 'en'));
  const t = COPY[lang];

  usePageHead({
    title: 'Web3 compliance advisory: VASP licensing, Travel Rule, MiCA, LGPD | DPO2U',
    description: 'Compliance and data protection for crypto and Web3 projects: regulatory diagnostic, compliance structuring and a fractional compliance officer, with on-chain proof of each control.',
    path: '/advisory',
  });

  useEffect(() => {
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';
  }, [lang]);

  const mail = `mailto:contato@dpo2u.com?subject=${encodeURIComponent(lang === 'pt' ? 'Advisory de compliance Web3' : 'Web3 compliance advisory')}`;

  return (
    <div style={{ color: PALETTE.ink, fontFamily: FONTS.body }}>
      <section className="px-6 lg:px-14 pt-16 pb-10 lg:pt-24" aria-labelledby="adv-hero">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <SmallLabel>{t.tag}</SmallLabel>
          <div role="group" aria-label="Language" className="flex gap-1">
            {(['en', 'pt'] as Lang[]).map((l) => (
              <button
                key={l}
                type="button"
                aria-pressed={lang === l}
                onClick={() => setLang(l)}
                style={{ fontFamily: FONTS.mono, fontSize: 12, padding: '6px 10px', borderRadius: 4, cursor: 'pointer', border: `1px solid ${PALETTE.ruleStrong}`, background: lang === l ? PALETTE.ink : 'transparent', color: lang === l ? PALETTE.paper : PALETTE.ink }}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        <h1 id="adv-hero" style={{ ...h2, fontSize: 'clamp(34px, 5vw, 60px)', maxWidth: 980 }}>{t.h1}</h1>
        <p style={{ fontSize: 18, lineHeight: 1.55, maxWidth: 760, marginTop: 20, color: PALETTE.inkSoft }}>{t.lead}</p>
        <p style={{ marginTop: 28 }}>
          <a href={mail} data-testid="advisory-cta" style={{ display: 'inline-block', background: PALETTE.ink, color: PALETTE.paper, padding: '12px 20px', borderRadius: 4, textDecoration: 'none', fontFamily: FONTS.mono, fontSize: 14 }}>{t.cta} →</a>
        </p>
      </section>

      <Rule />

      <section className="px-6 lg:px-14 py-12" aria-labelledby="adv-offers">
        <h2 id="adv-offers" style={{ ...h2, fontSize: 32, marginBottom: 24 }}>{t.offers}</h2>
        <ol className="grid gap-4 lg:grid-cols-3" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {OFFERS.map((o) => (
            <li key={o.id} data-offer={o.id} style={{ ...card, padding: 20, display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ ...h2, fontSize: 24 }}>{o.name[lang]}</h3>
              <div className="flex flex-wrap gap-3 items-baseline" style={{ marginTop: 10 }}>
                <span style={{ fontFamily: FONTS.mono, fontSize: 15, color: TERRA }} data-testid={`price-${o.id}`}>{o.price[lang]}</span>
                <span style={{ fontFamily: FONTS.mono, fontSize: 12, color: PALETTE.concrete }}>{o.time[lang]}</span>
              </div>
              <p style={{ marginTop: 12, color: PALETTE.inkSoft, lineHeight: 1.5 }}><strong style={{ color: PALETTE.ink }}>{t.for}:</strong> {o.for[lang]}</p>
              <p style={{ marginTop: 12, marginBottom: 6, fontWeight: 600 }}>{t.gets}</p>
              <ul style={{ margin: 0, paddingLeft: 18, color: PALETTE.inkSoft, lineHeight: 1.5 }}>
                {o.gets[lang].map((g) => <li key={g} style={{ marginTop: 4 }}>{g}</li>)}
              </ul>
            </li>
          ))}
        </ol>
        <p style={{ marginTop: 16, fontSize: 13, color: PALETTE.concrete }}>{t.paid}</p>
      </section>

      <Rule />

      <section className="px-6 lg:px-14 py-12 grid gap-8 lg:grid-cols-2" aria-labelledby="adv-how">
        <div>
          <h2 id="adv-how" style={{ ...h2, fontSize: 32 }}>{t.how}</h2>
          <ul style={{ marginTop: 16, paddingLeft: 18, color: PALETTE.inkSoft, lineHeight: 1.55 }}>
            {t.howItems.map((i) => <li key={i} style={{ marginTop: 8 }}>{i}</li>)}
          </ul>
        </div>
        <div>
          <p style={{ color: PALETTE.inkSoft, lineHeight: 1.55 }}>{t.ctaNote}</p>
          <p style={{ marginTop: 16 }}>
            <a href={mail} style={{ color: TERRA }}>contato@dpo2u.com</a>
            {' · '}
            <a href="/agents" style={{ color: TERRA }}>{t.agents}</a>
          </p>
          <p style={{ marginTop: 20, fontSize: 13, color: PALETTE.concrete }}>{t.note}</p>
        </div>
      </section>
    </div>
  );
}
