/**
 * /financial-institutions — porta de entrada da instituição financeira (E1 do PRD da jornada).
 *
 * EN, PT e ES, com seletor de mercado. O CTA leva ao diagnóstico (POST /api/v1/diagnostics),
 * não a e-mail; o resultado lista os pacotes e as lacunas com citação, e o botão
 * "Criar workspace" leva o lead para o cadastro por link mágico (E2).
 */
import React, { useEffect, useState } from 'react';
import { usePageHead } from '@/lib/page-head';
import { FONTS, PALETTE, Rule, SmallLabel } from '@/components/sealed/atoms';
import { api, rememberLead, type DiagnosticReport } from '@/lib/fi/gateway';
import { COPY, detectLang, INSTITUTION_TYPES, LABELS, MARKETS, SERVICES, type Lang } from '@/lib/fi/copy';

const TERRA = '#A84A2D';
const h2: React.CSSProperties = { fontFamily: FONTS.display, fontWeight: 500, lineHeight: 1.05, letterSpacing: '-.03em', margin: 0 };
const card: React.CSSProperties = { background: PALETTE.paper2, border: `.5px solid ${PALETTE.ruleStrong}`, borderRadius: 4 };
const field: React.CSSProperties = { width: '100%', padding: '10px 12px', border: `1px solid ${PALETTE.ruleStrong}`, borderRadius: 4, fontFamily: FONTS.body, fontSize: 15, background: '#fff', color: PALETTE.ink };
const btn: React.CSSProperties = { background: TERRA, color: '#fff', border: `1px solid ${TERRA}`, padding: '12px 20px', borderRadius: 4, fontFamily: FONTS.body, fontSize: 15, fontWeight: 500, cursor: 'pointer' };
const SEV_COLOR: Record<string, string> = { critical: TERRA, high: '#8A5A00', medium: PALETTE.concrete, low: PALETTE.concrete, info: PALETTE.concrete };

export function marketFromLang(lang: Lang): string {
  return lang === 'pt' ? 'BR' : lang === 'es' ? 'ES' : 'EU';
}

export default function FinancialInstitutionsPage({ initialLang }: { initialLang?: Lang }) {
  const [lang, setLang] = useState<Lang>(initialLang ?? detectLang());
  const t = COPY[lang];
  const L = LABELS[lang];
  const [market, setMarket] = useState(marketFromLang(lang));
  const [type, setType] = useState<string>(lang === 'pt' ? 'psav' : 'vasp');
  const [services, setServices] = useState<string[]>(['exchange', 'custody', 'transfer']);
  const [partners, setPartners] = useState(false);
  const [volume, setVolume] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<DiagnosticReport | null>(null);
  const [leadId, setLeadId] = useState<string | null>(null);
  const [signup, setSignup] = useState({ email: '', name: '', sent: false, busy: false });

  usePageHead({
    title: 'For financial institutions: Travel Rule, partner passports and supervisor evidence | DPO2U',
    description: 'Compliance operator for VASPs, CASPs, PSAVs and payment institutions. Run a free diagnostic of the rules that apply in your market.',
    path: '/financial-institutions',
  });

  useEffect(() => {
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : lang;
  }, [lang]);

  const toggle = (s: string) => setServices((cur) => (cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]));

  async function run(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const vol = Number(volume.replace(/[^0-9.]/g, ''));
      const out = await api.diagnose({
        market,
        institution_type: type,
        services,
        uses_partners: partners,
        lang,
        ...(volume && Number.isFinite(vol) ? { monthly_volume_usd: vol } : {}),
        ...(email && consent ? { contact: { email, consent: true as const, ...(company ? { company } : {}) } } : {}),
      });
      setReport(out.report);
      setLeadId(out.lead_id);
      rememberLead(out.lead_id, out.report);
      setSignup((s) => ({ ...s, email: s.email || email, name: s.name || company }));
      setTimeout(() => document.getElementById('fi-result')?.scrollIntoView({ behavior: 'smooth' }), 50);
    } catch {
      setError(t.error);
    } finally {
      setBusy(false);
    }
  }

  async function createWorkspace(e: React.FormEvent) {
    e.preventDefault();
    setSignup((s) => ({ ...s, busy: true }));
    try {
      await api.magicLink({ email: signup.email, workspace_name: signup.name, ...(leadId ? { lead_id: leadId } : {}) });
      setSignup((s) => ({ ...s, sent: true, busy: false }));
    } catch {
      setError(t.error);
      setSignup((s) => ({ ...s, busy: false }));
    }
  }

  const invited = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('invite') : null;
  const signupCard = (
          <div style={{ ...card, padding: 24, marginTop: 32, maxWidth: 640 }}>
            <h3 style={{ ...h2, fontSize: 26 }}>{t.createH}</h3>
            <p style={{ marginTop: 8, color: PALETTE.inkSoft }}>{t.createP}</p>
            {signup.sent ? (
              <p role="status" style={{ marginTop: 16 }}>{t.sent}</p>
            ) : (
              <form onSubmit={createWorkspace} className="grid gap-3 mt-4">
                <input required placeholder={t.wsName} value={signup.name} onChange={(e) => setSignup((s) => ({ ...s, name: e.target.value }))} style={field} name="workspace_name" />
                <input required type="email" placeholder="email" value={signup.email} onChange={(e) => setSignup((s) => ({ ...s, email: e.target.value }))} style={field} name="signup_email" autoComplete="email" />
                <div><button type="submit" disabled={signup.busy} style={btn}>{t.create}</button></div>
              </form>
            )}
          </div>
  );

  return (
    <div style={{ color: PALETTE.ink, fontFamily: FONTS.body }}>
      <section className="px-6 lg:px-14 pt-16 pb-10 lg:pt-24" aria-labelledby="fi-hero">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <SmallLabel>{t.tag}</SmallLabel>
          <div role="group" aria-label="Language" className="flex gap-1">
            {(['en', 'pt', 'es'] as Lang[]).map((l) => (
              <button
                key={l}
                type="button"
                aria-pressed={lang === l}
                onClick={() => { setLang(l); setMarket(marketFromLang(l)); }}
                style={{ fontFamily: FONTS.mono, fontSize: 12, padding: '6px 10px', borderRadius: 4, cursor: 'pointer', border: `1px solid ${PALETTE.ruleStrong}`, background: lang === l ? PALETTE.ink : 'transparent', color: lang === l ? PALETTE.paper : PALETTE.ink }}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        <h1 id="fi-hero" style={{ ...h2, fontSize: 'clamp(34px, 5vw, 60px)', maxWidth: 980 }}>{t.h1}</h1>
        <p style={{ fontSize: 18, lineHeight: 1.55, maxWidth: 760, marginTop: 20, color: PALETTE.inkSoft }}>{t.lead}</p>
        <a href="#fi-diagnostic" style={{ ...btn, display: 'inline-block', marginTop: 28, textDecoration: 'none' }}>{t.cta}</a>
        <p style={{ marginTop: 16, fontSize: 14 }}>
          <a href="/agents" style={{ color: TERRA }}>{lang === 'pt' ? 'Construindo um agente de IA? Ele faz a jornada sozinho, pago por chamada' : lang === 'es' ? '¿Construye un agente de IA? Hace el recorrido solo, pago por llamada' : 'Building an AI agent? It can run the journey on its own, paid per call'} →</a>
        </p>
      </section>

      <Rule />

      {invited && !report && (
        <section id="fi-signup" className="px-6 lg:px-14 py-12" aria-label={t.createH}>
          <p style={{ color: PALETTE.inkSoft, maxWidth: 640 }}>{t.invited}</p>
          {signupCard}
        </section>
      )}
      <section id="fi-diagnostic" className="px-6 lg:px-14 py-12" aria-labelledby="fi-diag-h">
        <h2 id="fi-diag-h" style={{ ...h2, fontSize: 32, marginBottom: 24 }}>{t.cta}</h2>
        <form onSubmit={run} className="grid gap-5" style={{ maxWidth: 760 }}>
          <label className="grid gap-2">
            <span>{t.market}</span>
            <select value={market} onChange={(e) => setMarket(e.target.value)} style={field} name="market">
              {MARKETS.map((m) => <option key={m.code} value={m.code}>{m.label[lang]}</option>)}
            </select>
          </label>
          <label className="grid gap-2">
            <span>{t.type}</span>
            <select value={type} onChange={(e) => setType(e.target.value)} style={field} name="institution_type">
              {INSTITUTION_TYPES.map((x) => <option key={x} value={x}>{L[x] ?? x}</option>)}
            </select>
          </label>
          <fieldset className="grid gap-2">
            <legend style={{ marginBottom: 8 }}>{t.services}</legend>
            <div className="flex flex-wrap gap-2">
              {SERVICES.map((s) => (
                <label key={s} style={{ ...card, padding: '8px 12px', cursor: 'pointer', display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input type="checkbox" checked={services.includes(s)} onChange={() => toggle(s)} name={`service-${s}`} />
                  {L[s] ?? s}
                </label>
              ))}
            </div>
          </fieldset>
          <label className="flex gap-2 items-start">
            <input type="checkbox" checked={partners} onChange={(e) => setPartners(e.target.checked)} name="uses_partners" style={{ marginTop: 4 }} />
            <span>{t.partners}</span>
          </label>
          <label className="grid gap-2">
            <span>{t.volume}</span>
            <input inputMode="numeric" value={volume} onChange={(e) => setVolume(e.target.value)} style={field} name="volume" />
          </label>
          <div className="grid gap-3 md:grid-cols-2">
            <label className="grid gap-2">
              <span>{t.email}</span>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={field} name="email" autoComplete="email" />
            </label>
            <label className="grid gap-2">
              <span>{t.company}</span>
              <input value={company} onChange={(e) => setCompany(e.target.value)} style={field} name="company" autoComplete="organization" />
            </label>
          </div>
          {email && (
            <label className="flex gap-2 items-start" style={{ fontSize: 14 }}>
              <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} name="consent" style={{ marginTop: 3 }} />
              <span>{t.consent}</span>
            </label>
          )}
          <div>
            <button type="submit" disabled={busy || services.length === 0} style={{ ...btn, opacity: busy ? 0.6 : 1 }}>{busy ? t.running : t.run}</button>
          </div>
          {error && <p role="alert" style={{ color: TERRA }}>{error}</p>}
        </form>
      </section>

      {report && (
        <section id="fi-result" className="px-6 lg:px-14 pb-16" aria-labelledby="fi-result-h">
          <Rule style={{ marginBottom: 32 }} />
          <h2 id="fi-result-h" style={{ ...h2, fontSize: 32 }}>{t.result}</h2>
          <p style={{ marginTop: 10, color: PALETTE.concrete }} data-testid="fi-totals">
            {report.packs.length} · {report.totals.gaps} {t.gaps} · {report.totals.critical} {t.critical}
          </p>
          <div className="grid gap-5 mt-6">
            {report.packs.map((p) => (
              <article key={p.id} style={{ ...card, padding: 20 }} data-pack={p.id}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 style={{ fontFamily: FONTS.display, fontSize: 22, margin: 0 }}>{p.title}</h3>
                  <code style={{ fontFamily: FONTS.mono, fontSize: 12 }}>{p.id}{p.generic ? ` · ${t.generic}` : ''}</code>
                </div>
                <p style={{ marginTop: 6, color: PALETTE.inkSoft }}>{p.why}</p>
                <p style={{ marginTop: 4, fontSize: 13, color: PALETTE.concrete }}>{p.covered}/{p.rules} {t.covered}</p>
                <ul style={{ marginTop: 12, paddingLeft: 0, listStyle: 'none' }} className="grid gap-2">
                  {p.gaps.map((g) => (
                    <li key={g.ruleId} style={{ borderLeft: `3px solid ${SEV_COLOR[g.severity] ?? PALETTE.concrete}`, paddingLeft: 12 }}>
                      <strong>{g.title}</strong>
                      <span style={{ fontFamily: FONTS.mono, fontSize: 11, marginLeft: 8, color: SEV_COLOR[g.severity] }}>{g.severity}</span>
                      <div style={{ fontSize: 13, color: PALETTE.concrete }}>{g.citation}</div>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <p style={{ marginTop: 16, fontSize: 13, color: PALETTE.concrete }}>{t.disclaimer}</p>

          {signupCard}
        </section>
      )}
    </div>
  );
}
