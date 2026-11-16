/**
 * /agents — porta de entrada da machine economy: um agente de IA faz a jornada sozinho,
 * sem conta, pagando cada passo por chamada via x402 (USDC na Stellar).
 *
 * Os passos e preços vêm do catálogo do gateway (GET /api/v1/agent); sem o gateway, a página
 * mostra os padrões. Só em inglês (pedido do Frederico, 16/11/2026: oferta global).
 */
import React, { useEffect, useState } from 'react';
import { usePageHead } from '@/lib/page-head';
import { FONTS, PALETTE, Rule, SmallLabel } from '@/components/sealed/atoms';
import { GATEWAY_BASE } from '@/lib/fi/gateway';

const TERRA = '#A84A2D';
const h2: React.CSSProperties = { fontFamily: FONTS.display, fontWeight: 500, lineHeight: 1.05, letterSpacing: '-.03em', margin: 0 };
const card: React.CSSProperties = { background: PALETTE.paper2, border: `.5px solid ${PALETTE.ruleStrong}`, borderRadius: 4 };
const code: React.CSSProperties = { fontFamily: FONTS.mono, fontSize: 13, lineHeight: 1.55, background: PALETTE.ink, color: PALETTE.paper, padding: 16, borderRadius: 4, overflowX: 'auto', whiteSpace: 'pre' };

type Lang = 'en';

interface Step { id: string; path: string; mcp: string; price: string; title: Record<Lang, string>; does: Record<Lang, string> }

const STEPS: Step[] = [
  {
    id: 'check', path: 'POST /api/v1/agent/check', mcp: 'dpo2u_check_counterparty', price: '0.01',
    title: { en: 'Check before you pay' },
    does: { en: 'Before paying or transferring, confirm the counterparty holds a valid DPO2U passport. PASS or FAIL, reasons, policy hash and the on-chain proof.' },
  },
  {
    id: 'compliance', path: 'POST /api/v1/agent/compliance', mcp: 'dpo2u_agent_compliance', price: '0.10',
    title: { en: 'Your own compliance and privacy' },
    does: { en: 'The rule packs that apply to your owner in the market (LGPD, GDPR, Travel Rule, MiCA), the gaps, and an optional scan of a public repository.' },
  },
  {
    id: 'due-diligence', path: 'POST /api/v1/agent/due-diligence', mcp: 'dpo2u_counterparty_due_diligence', price: '1',
    title: { en: 'Counterparty due diligence' },
    does: { en: 'Passport, the packs the market requires and what it covers, active sponsorships, history and proof. The report hash is your receipt.' },
  },
  {
    id: 'pentest', path: 'POST /api/v1/agent/pentest', mcp: 'dpo2u_pentest', price: '1 / 500',
    title: { en: 'Pentest' },
    does: { en: 'Prove you own the domain first (HTTP or DNS); nothing is charged before that. Passive: a configuration check right away. Full: a deposit and a pentest scheduled with a partner.' },
  },
];

const COPY = {
  en: {
    tag: 'For AI agents and dApps',
    h1: 'Compliance as a protocol for the machine economy.',
    lead: 'Your agent checks before it pays. No account and no contract: every step is one HTTP or MCP call, paid per call in USDC on Stellar through x402. The verdict is the receipt and the proof.',
    steps: 'The journey',
    how: 'How an agent pays',
    howP: 'Call without payment and get HTTP 402 with the x402 requirements. Sign the payment with any x402 client and repeat the call with the X-PAYMENT header. The answer carries the result and X-PAYMENT-RESPONSE with the settlement transaction. Input is validated before you are charged.',
    mcp: 'Over MCP',
    mcpP: 'The same steps are MCP tools on mcp.dpo2u.com. Without x_payment a tool returns payment_required with the x402 requirements; call it again with x_payment.',
    catalog: 'Live catalog',
    institutions: 'Are you a financial institution? Start with the diagnostic',
    price: 'USDC per call',
    note: 'Indicative checks, not legal advice. Nothing personal goes on chain.',
  },
} as const;

interface Catalog { steps: { id: string; price_usdc: string | { passive: string; full: string } }[] }

export default function AgentsPage() {
  const lang: Lang = 'en';
  const [prices, setPrices] = useState<Record<string, string>>({});
  const t = COPY[lang];

  usePageHead({
    title: 'For AI agents: check before you pay, pay per call via x402 | DPO2U',
    description: 'Compliance as a protocol for the machine economy. Counterparty check, LGPD and regulation, due diligence and pentest, paid per call in USDC on Stellar via x402.',
    path: '/agents',
  });

  useEffect(() => {
    document.documentElement.lang = 'en';
  }, []);

  useEffect(() => {
    fetch(`${GATEWAY_BASE}/api/v1/agent`)
      .then((r) => (r.ok ? (r.json() as Promise<Catalog>) : null))
      .then((c) => {
        if (!c) return;
        setPrices(Object.fromEntries(c.steps.map((s) => [s.id, typeof s.price_usdc === 'string' ? s.price_usdc : `${s.price_usdc.passive} / ${s.price_usdc.full}`])));
      })
      .catch(() => undefined);
  }, []);

  const flow = `# 1. no payment: HTTP 402 with the x402 requirements
curl -s -X POST ${GATEWAY_BASE}/api/v1/agent/check \\
  -H 'content-type: application/json' \\
  -d '{"passport_id":"<counterparty passport>","market":"BR"}'

# 2. sign with an x402 client (Stellar, USDC) and repeat
curl -s -X POST ${GATEWAY_BASE}/api/v1/agent/check \\
  -H 'content-type: application/json' -H "X-PAYMENT: $PAYMENT" \\
  -d '{"passport_id":"<counterparty passport>","market":"BR"}'
# → {"verdict":"PASS","policy_hash":"…","verify_url":"…","proof":{…}}`;

  return (
    <div style={{ color: PALETTE.ink, fontFamily: FONTS.body }}>
      <section className="px-6 lg:px-14 pt-16 pb-10 lg:pt-24" aria-labelledby="ag-hero">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <SmallLabel>{t.tag}</SmallLabel>
        </div>
        <h1 id="ag-hero" style={{ ...h2, fontSize: 'clamp(34px, 5vw, 60px)', maxWidth: 980 }}>{t.h1}</h1>
        <p style={{ fontSize: 18, lineHeight: 1.55, maxWidth: 760, marginTop: 20, color: PALETTE.inkSoft }}>{t.lead}</p>
      </section>

      <Rule />

      <section className="px-6 lg:px-14 py-12" aria-labelledby="ag-steps">
        <h2 id="ag-steps" style={{ ...h2, fontSize: 32, marginBottom: 24 }}>{t.steps}</h2>
        <ol className="grid gap-4 md:grid-cols-2" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {STEPS.map((s, i) => (
            <li key={s.id} data-step={s.id} style={{ ...card, padding: 20 }}>
              <div style={{ fontFamily: FONTS.mono, fontSize: 12, color: PALETTE.concrete }}>0{i + 1} · {s.path}</div>
              <h3 style={{ ...h2, fontSize: 24, marginTop: 8 }}>{s.title[lang]}</h3>
              <p style={{ marginTop: 8, color: PALETTE.inkSoft, lineHeight: 1.5 }}>{s.does[lang]}</p>
              <div className="flex flex-wrap gap-3 items-baseline" style={{ marginTop: 12 }}>
                <span style={{ fontFamily: FONTS.mono, fontSize: 15, color: TERRA }} data-testid={`price-${s.id}`}>{prices[s.id] ?? s.price} {t.price}</span>
                <span style={{ fontFamily: FONTS.mono, fontSize: 12, color: PALETTE.concrete }}>MCP: {s.mcp}</span>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <Rule />

      <section className="px-6 lg:px-14 py-12 grid gap-8 lg:grid-cols-2" aria-labelledby="ag-how">
        <div>
          <h2 id="ag-how" style={{ ...h2, fontSize: 32 }}>{t.how}</h2>
          <p style={{ marginTop: 12, color: PALETTE.inkSoft, lineHeight: 1.55 }}>{t.howP}</p>
          <h3 style={{ ...h2, fontSize: 24, marginTop: 28 }}>{t.mcp}</h3>
          <p style={{ marginTop: 8, color: PALETTE.inkSoft, lineHeight: 1.55 }}>{t.mcpP}</p>
          <p style={{ marginTop: 20 }}>
            <a href={`${GATEWAY_BASE}/api/v1/agent`} style={{ color: TERRA }}>{t.catalog}</a>
            {' · '}
            <a href="/financial-institutions" style={{ color: TERRA }}>{t.institutions}</a>
          </p>
          <p style={{ marginTop: 20, fontSize: 13, color: PALETTE.concrete }}>{t.note}</p>
        </div>
        <pre style={code} aria-label="x402 flow">{flow}</pre>
      </section>
    </div>
  );
}
