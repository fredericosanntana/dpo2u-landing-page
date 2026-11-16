/**
 * /rwa — monitor público e gratuito de compliance de ativos tokenizados (RWA).
 *
 * Lê um snapshot estático (formato dpo2u.rwa-monitor/0) gerado pelo repositório público
 * fredericosanntana/dpo2u-rwa a partir da API de RWA da CoinMarketCap e do registro de emissores.
 * Decisões do Frederico (16/11/2026):
 *  - grátis, sem paywall;
 *  - o resultado só aparece contra a política de referência publicada ("meets / attention /
 *    does not meet" o perfil "VASP, investidor de varejo"), nunca como PASS/WARN/BLOCK cru nem nota;
 *  - texto neutro, disclaimer do próprio snapshot, metodologia com a política e as fontes, e um
 *    contato para o emissor corrigir dados.
 * Os rótulos de resultado e de critério vêm dos dados (policy.outcomes / policy.criteria), para a
 * política poder ganhar critérios ou resultados sem mudar a página. Só em inglês, como /agents.
 * Para atualizar: copiar snapshots/latest.json, policy/reference-v0.json e registry/issuers.json do
 * dpo2u-rwa para public/rwa/data/ (snapshot.json, policy.json, issuers.json).
 */
import React, { useEffect, useMemo, useState } from 'react';
import { usePageHead } from '@/lib/page-head';
import { FONTS, PALETTE, Rule, SmallLabel } from '@/components/sealed/atoms';

const TERRA = '#A84A2D';
const AMBER = '#8A6A1F';
const GREEN = '#3F6E66';
const h2: React.CSSProperties = { fontFamily: FONTS.display, fontWeight: 500, lineHeight: 1.05, letterSpacing: '-.03em', margin: 0 };
const card: React.CSSProperties = { background: PALETTE.paper2, border: `.5px solid ${PALETTE.ruleStrong}`, borderRadius: 4 };
const mono: React.CSSProperties = { fontFamily: FONTS.mono, fontSize: 12 };
const REPO = 'https://github.com/fredericosanntana/dpo2u-rwa';
const DATA = '/rwa/data';

// ---------------------------------------------------------------- tipos do snapshot

type Status = 'pass' | 'warn' | 'fail' | string;
interface Signal { id: string; status: Status; detail: string; evidence?: Record<string, unknown>; sources?: string[] }
interface Verdict {
  subject: { rwa_symbol: string; rwa_name: string; asset_type: string; token_symbol: string; token_name: string; crypto_id: number; issuer_name?: string | null; contracts?: { chain: string; address: string }[] };
  outcome: string;
  signals: Signal[];
  market?: { price?: number | null; volume_24h?: number | null; market_cap?: number | null; as_of?: string };
  data_source?: string;
  evaluated_at?: string;
  digest?: string;
  policy?: { id: string; version: string; hash: string };
}
interface Snapshot {
  format: string;
  generated_at: string;
  policy: { id: string; version: string; hash: string };
  profile: { client: string; investor_type: string; investor_country: string };
  summary: Record<string, unknown> & { assets: number; tokens: number };
  assets: { rwa_symbol: string; rwa_name: string; asset_type: string; tokenized_market_cap?: number; verdicts: Verdict[] }[];
  alerts: { token_symbol: string; rwa_symbol: string; kind: string; message: string }[];
  disclaimer: string;
  limitations?: string[];
}
interface Policy {
  id: string; version: string; title: string;
  profile: Snapshot['profile'];
  thresholds?: Record<string, number>;
  outcomes: Record<string, string>;
  criteria: { id: string; title: string; pass?: string; warn?: string; fail?: string }[];
  disclaimer?: string;
  limitations?: string[];
}
interface Issuer {
  cmc_issuer_name: string; legal_entity?: string | null; jurisdiction?: string | null; regulator?: string | null;
  licence?: { type?: string | null; reference?: string | null; url?: string | null } | null;
  custodian?: string | null;
  sale_restrictions?: { who: string; source?: string; countries?: string[] }[];
  sale_terms_complete?: boolean | null; products?: string[]; confidence?: string | null; notes?: string | null; sources?: string[]; reviewed_at?: string | null;
}
interface Registry { version: string; reviewed_at: string; method: string; issuers: Issuer[] }

// ---------------------------------------------------------------- rótulos (data-driven)

const humanize = (s: string) => s.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase());
/** Texto do resultado: sempre "contra a política de referência", nunca uma nota. */
const OUTCOME_TEXT: Record<string, string> = { meets: 'Meets the policy', attention: 'Needs attention', does_not_meet: 'Does not meet the policy' };
const outcomeText = (o: string) => OUTCOME_TEXT[o] ?? humanize(o);
const OUTCOME_COLOR: Record<string, string> = { meets: GREEN, attention: AMBER, does_not_meet: TERRA };
const outcomeColor = (o: string) => OUTCOME_COLOR[o] ?? PALETTE.concrete;
const STATUS_TEXT: Record<string, string> = { pass: 'Met', warn: 'Not confirmed', fail: 'Not met' };
const STATUS_COLOR: Record<string, string> = { pass: GREEN, warn: AMBER, fail: TERRA };
const statusText = (s: Status) => STATUS_TEXT[s] ?? humanize(String(s));
const STATUS_MARK: Record<string, string> = { pass: '●', warn: '◐', fail: '○' };

const COUNTRY: Record<string, string> = { BR: 'Brazil', US: 'the United States' };
const usd = (n?: number | null) => (typeof n === 'number' ? `US$ ${n >= 1e6 ? `${(n / 1e6).toLocaleString('en-US', { maximumFractionDigits: 1 })}M` : n.toLocaleString('en-US', { maximumFractionDigits: n < 10 ? 4 : 0 })}` : 'n/a');
const day = (iso?: string) => (iso ? new Date(iso).toUTCString().replace(/:\d\d GMT$/, ' UTC') : '');
const host = (u: string) => { try { return new URL(u).host.replace(/^www\./, ''); } catch { return u; } };
const anchor = (id: number) => `token-${id}`;
const issuerAnchor = (name: string) => `issuer-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

function Badge({ outcome }: { outcome: string }) {
  const c = outcomeColor(outcome);
  return (
    <span data-outcome={outcome} style={{ ...mono, color: c, border: `1px solid ${c}`, borderRadius: 3, padding: '2px 7px', whiteSpace: 'nowrap' }}>{outcomeText(outcome)}</span>
  );
}

function SignalDots({ signals, titles }: { signals: Signal[]; titles: Record<string, string> }) {
  return (
    <span aria-label={signals.map((s) => `${titles[s.id] ?? humanize(s.id)}: ${statusText(s.status)}`).join('; ')} style={{ letterSpacing: 3, fontSize: 13, whiteSpace: 'nowrap' }}>
      {signals.map((s) => (
        <span key={s.id} title={`${titles[s.id] ?? humanize(s.id)}: ${statusText(s.status)}`} style={{ color: STATUS_COLOR[s.status] ?? PALETTE.concrete }}>{STATUS_MARK[s.status] ?? '·'}</span>
      ))}
    </span>
  );
}

function Sources({ list }: { list?: string[] }) {
  if (!list?.length) return null;
  return (
    <span style={{ ...mono, fontSize: 11 }}>
      {list.map((u, i) => (
        <React.Fragment key={u}>{i > 0 && ' · '}<a href={u} target="_blank" rel="noopener noreferrer" style={{ color: TERRA }}>{host(u)}</a></React.Fragment>
      ))}
    </span>
  );
}

function Dossier({ v, titles }: { v: Verdict; titles: Record<string, string> }) {
  const s = v.subject;
  return (
    <div style={{ padding: '14px 4px 18px' }} data-testid={`dossier-${s.crypto_id}`}>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 10 }}>
        {v.signals.map((g) => (
          <li key={g.id} style={{ display: 'grid', gridTemplateColumns: 'minmax(150px, 220px) 1fr', gap: 12 }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{titles[g.id] ?? humanize(g.id)}</div>
              <div style={{ ...mono, color: STATUS_COLOR[g.status] ?? PALETTE.concrete }}>{STATUS_MARK[g.status]} {statusText(g.status)}</div>
            </div>
            <div style={{ fontSize: 14, lineHeight: 1.5, color: PALETTE.inkSoft, overflowWrap: 'anywhere' }}>
              {g.detail} <Sources list={g.sources} />
            </div>
          </li>
        ))}
      </ul>
      <div style={{ ...mono, color: PALETTE.concrete, marginTop: 14, lineHeight: 1.7, overflowWrap: 'anywhere' }}>
        {v.market && <>Price {usd(v.market.price)} · 24h volume {usd(v.market.volume_24h)} · market cap {usd(v.market.market_cap)}{v.data_source ? ` · ${v.data_source}` : ''}<br /></>}
        {s.contracts?.length ? <>Contracts: {s.contracts.map((c) => `${c.chain} ${c.address}`).join(' · ')}<br /></> : null}
        Evaluated {day(v.evaluated_at)}{v.policy ? ` against ${v.policy.id}@${v.policy.version}` : ''}
        {v.digest ? <><br />Verdict digest (sha256): {v.digest}</> : null}
        {s.issuer_name && <><br /><a href={`#${issuerAnchor(s.issuer_name)}`} style={{ color: TERRA }}>Issuer sheet: {s.issuer_name}</a></>}
      </div>
    </div>
  );
}

const PAGE = 40;

export default function RwaMonitorPage() {
  usePageHead({
    title: 'RWA compliance monitor: tokenized assets against a published policy | DPO2U',
    description: 'Free public monitor of tokenized real-world assets: issuer, licence, sanctions, sale restrictions, liquidity and price, checked daily against a published reference policy, with sources.',
    path: '/rwa',
  });
  useEffect(() => { document.documentElement.lang = 'en'; }, []);

  const [snap, setSnap] = useState<Snapshot | null>(null);
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [registry, setRegistry] = useState<Registry | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState('');
  const [outcome, setOutcome] = useState('all');
  const [type, setType] = useState('all');
  const [open, setOpen] = useState<number | null>(null);
  const [shown, setShown] = useState(PAGE);

  useEffect(() => {
    const get = (f: string) => fetch(`${DATA}/${f}`).then((r) => { if (!r.ok) throw new Error(`${f}: HTTP ${r.status}`); return r.json(); });
    Promise.all([get('snapshot.json'), get('policy.json'), get('issuers.json')])
      .then(([s, p, r]) => { setSnap(s); setPolicy(p); setRegistry(r); })
      .catch((e) => setError(String(e?.message ?? e)));
  }, []);

  // Deep link: /rwa#token-<crypto_id> abre o dossiê.
  useEffect(() => {
    if (!snap) return;
    const m = /^#token-(\d+)$/.exec(window.location.hash);
    if (m) { setOpen(Number(m[1])); setShown(Infinity); setTimeout(() => document.getElementById(window.location.hash.slice(1))?.scrollIntoView({ block: 'start' }), 50); }
  }, [snap]);

  const titles = useMemo(() => Object.fromEntries((policy?.criteria ?? []).map((c) => [c.id, c.title])), [policy]);
  const rows = useMemo(() => (snap ? snap.assets.flatMap((a) => a.verdicts) : []), [snap]);
  const outcomes = useMemo(() => {
    const fromPolicy = policy ? Object.values(policy.outcomes) : [];
    return [...new Set([...fromPolicy, ...rows.map((r) => r.outcome)])];
  }, [policy, rows]);
  const types = useMemo(() => [...new Set(rows.map((r) => r.subject.asset_type))], [rows]);
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return rows.filter((r) =>
      (outcome === 'all' || r.outcome === outcome) &&
      (type === 'all' || r.subject.asset_type === type) &&
      (!needle || [r.subject.token_symbol, r.subject.token_name, r.subject.rwa_symbol, r.subject.rwa_name, r.subject.issuer_name ?? ''].some((s) => s.toLowerCase().includes(needle))));
  }, [rows, q, outcome, type]);
  const counts = useMemo(() => Object.fromEntries(outcomes.map((o) => [o, rows.filter((r) => r.outcome === o).length])), [outcomes, rows]);
  const issuersInSnapshot = useMemo(() => {
    const names = new Set(rows.map((r) => r.subject.issuer_name).filter(Boolean) as string[]);
    return (registry?.issuers ?? []).filter((i) => names.has(i.cmc_issuer_name)).sort((a, b) => a.cmc_issuer_name.localeCompare(b.cmc_issuer_name));
  }, [registry, rows]);
  const tokensByIssuer = useMemo(() => {
    const m: Record<string, number> = {};
    for (const r of rows) if (r.subject.issuer_name) m[r.subject.issuer_name] = (m[r.subject.issuer_name] ?? 0) + 1;
    return m;
  }, [rows]);

  // Limitações conhecidas (ex.: autorização de oferta local não checada): do snapshot, ou da política.
  const limitations = snap?.limitations ?? policy?.limitations ?? [];
  const profile = snap?.profile ?? policy?.profile;
  const profileText = profile ? `${profile.client.toUpperCase()} serving ${profile.investor_type} investors in ${COUNTRY[profile.investor_country] ?? profile.investor_country}` : '';
  const mail = `mailto:contato@dpo2u.com?subject=${encodeURIComponent('RWA monitor: data correction')}`;
  const sel: React.CSSProperties = { ...mono, fontSize: 13, padding: '8px 10px', border: `.5px solid ${PALETTE.ruleStrong}`, borderRadius: 4, background: PALETTE.paper, color: PALETTE.ink };

  return (
    <div style={{ color: PALETTE.ink, fontFamily: FONTS.body }}>
      <section className="px-6 lg:px-14 pt-16 pb-10 lg:pt-24" aria-labelledby="rwa-hero">
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <SmallLabel>RWA compliance monitor · free and public</SmallLabel>
        </div>
        <h1 id="rwa-hero" style={{ ...h2, fontSize: 'clamp(34px, 5vw, 60px)', maxWidth: 980 }}>Tokenized assets, checked against a published policy.</h1>
        <p style={{ fontSize: 18, lineHeight: 1.55, maxWidth: 780, marginTop: 20, color: PALETTE.inkSoft }}>
          Every day DPO2U takes the tokenized real-world assets listed by CoinMarketCap and checks each token against six criteria:
          who issues it, under which licence, sanctions, who may buy it, liquidity and price. Each result names its sources, so you can verify it yourself.
        </p>
        {snap && (
          <p style={{ ...mono, marginTop: 18, color: PALETTE.concrete, lineHeight: 1.7 }} data-testid="rwa-meta">
            Snapshot {day(snap.generated_at)} · {snap.summary.tokens} tokens of {snap.summary.assets} assets · reference profile: {profileText} · policy {snap.policy.id}@{snap.policy.version}
          </p>
        )}
      </section>

      <Rule />

      {error && (
        <section className="px-6 lg:px-14 py-10"><p style={{ color: TERRA }}>The snapshot could not be loaded ({error}). Try again later.</p></section>
      )}
      {!snap && !error && <section className="px-6 lg:px-14 py-10"><p style={{ color: PALETTE.concrete }}>Loading the latest snapshot…</p></section>}

      {snap && (
        <>
          <section className="px-6 lg:px-14 py-10" aria-labelledby="rwa-summary">
            <h2 id="rwa-summary" className="sr-only">Summary</h2>
            <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
              <div style={{ ...card, padding: 16 }}>
                <div style={{ ...mono, color: PALETTE.concrete }}>Tokens checked</div>
                <div style={{ ...h2, fontSize: 36, marginTop: 6 }}>{snap.summary.tokens}</div>
              </div>
              {outcomes.map((o) => (
                <button key={o} type="button" onClick={() => { setOutcome(outcome === o ? 'all' : o); setShown(PAGE); }} aria-pressed={outcome === o}
                  style={{ ...card, padding: 16, textAlign: 'left', cursor: 'pointer', outline: outcome === o ? `2px solid ${outcomeColor(o)}` : 'none' }}>
                  <div style={{ ...mono, color: outcomeColor(o) }}>{outcomeText(o)}</div>
                  <div style={{ ...h2, fontSize: 36, marginTop: 6 }} data-testid={`count-${o}`}>{counts[o] ?? 0}</div>
                </button>
              ))}
            </div>
            <p style={{ marginTop: 14, fontSize: 13, color: PALETTE.concrete, maxWidth: 820 }}>{snap.disclaimer} The result says whether a token meets this one published policy for this one profile; another profile or policy can give a different result.</p>
            {limitations.length > 0 && (
              <div role="note" data-testid="rwa-limitations" style={{ marginTop: 12, maxWidth: 820, borderLeft: `3px solid ${AMBER}`, padding: '8px 12px', background: PALETTE.paper2 }}>
                <div style={{ ...mono, color: AMBER }}>What this does not check yet</div>
                <ul style={{ margin: '6px 0 0', paddingLeft: 18, fontSize: 14, lineHeight: 1.5, color: PALETTE.inkSoft }}>
                  {limitations.map((l) => <li key={l}>{l}</li>)}
                </ul>
              </div>
            )}
          </section>

          <Rule />

          <section className="px-6 lg:px-14 py-10" aria-labelledby="rwa-table">
            <h2 id="rwa-table" style={{ ...h2, fontSize: 32 }}>Tokens</h2>
            <div className="flex flex-wrap gap-3" style={{ marginTop: 18 }}>
              <input aria-label="Search token, asset or issuer" placeholder="Search token, asset or issuer" value={q} onChange={(e) => { setQ(e.target.value); setShown(PAGE); }} style={{ ...sel, minWidth: 240, flex: '1 1 240px' }} />
              <select aria-label="Result" value={outcome} onChange={(e) => { setOutcome(e.target.value); setShown(PAGE); }} style={sel}>
                <option value="all">All results</option>
                {outcomes.map((o) => <option key={o} value={o}>{outcomeText(o)}</option>)}
              </select>
              <select aria-label="Asset type" value={type} onChange={(e) => { setType(e.target.value); setShown(PAGE); }} style={sel}>
                <option value="all">All asset types</option>
                {types.map((t) => <option key={t} value={t}>{humanize(t)}</option>)}
              </select>
            </div>
            <p style={{ ...mono, color: PALETTE.concrete, marginTop: 12 }}>
              {filtered.length} of {rows.length} tokens · signals in policy order: {(policy?.criteria ?? []).map((c) => c.title).join(', ')} · {STATUS_MARK.pass} met {STATUS_MARK.warn} not confirmed {STATUS_MARK.fail} not met
            </p>
            <div style={{ overflowX: 'auto', marginTop: 10, width: '100%', maxWidth: 'calc(100vw - 48px)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, minWidth: 680 }}>
                <thead>
                  <tr style={{ textAlign: 'left', borderBottom: `1px solid ${PALETTE.ruleStrong}` }}>
                    {['Token', 'Asset', 'Issuer', 'Result', 'Signals'].map((h) => <th key={h} scope="col" style={{ ...mono, color: PALETTE.concrete, fontWeight: 500, padding: '8px 8px 8px 0' }}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {filtered.slice(0, shown).map((v) => {
                    const s = v.subject;
                    const isOpen = open === s.crypto_id;
                    return (
                      <React.Fragment key={s.crypto_id}>
                        <tr id={anchor(s.crypto_id)} data-testid="rwa-row" style={{ borderBottom: isOpen ? 'none' : `.5px solid ${PALETTE.rule}`, cursor: 'pointer', scrollMarginTop: 80 }} onClick={() => setOpen(isOpen ? null : s.crypto_id)}>
                          <td style={{ padding: '10px 8px 10px 0' }}>
                            <button type="button" aria-expanded={isOpen} aria-controls={`d-${s.crypto_id}`} style={{ background: 'none', border: 0, padding: 0, textAlign: 'left', cursor: 'pointer', color: PALETTE.ink }}>
                              <strong>{s.token_symbol}</strong> <span style={{ color: PALETTE.concrete }}>{s.token_name}</span>
                            </button>
                          </td>
                          <td style={{ padding: '10px 8px 10px 0', color: PALETTE.inkSoft }}>{s.rwa_name} <span style={{ ...mono, color: PALETTE.concrete }}>{humanize(s.asset_type)}</span></td>
                          <td style={{ padding: '10px 8px 10px 0', color: PALETTE.inkSoft }}>{s.issuer_name ?? <span style={{ color: PALETTE.concrete }}>not identified</span>}</td>
                          <td style={{ padding: '10px 8px 10px 0' }}><Badge outcome={v.outcome} /></td>
                          <td style={{ padding: '10px 0' }}><SignalDots signals={v.signals} titles={titles} /></td>
                        </tr>
                        {isOpen && (
                          <tr id={`d-${s.crypto_id}`} style={{ borderBottom: `.5px solid ${PALETTE.rule}` }}>
                            <td colSpan={5}><Dossier v={v} titles={titles} /></td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {filtered.length > shown && (
              <p style={{ marginTop: 16 }}>
                <button type="button" onClick={() => setShown((n) => n + PAGE)} style={{ ...sel, cursor: 'pointer' }}>Show {Math.min(PAGE, filtered.length - shown)} more</button>
              </p>
            )}
          </section>

          <Rule />

          <section className="px-6 lg:px-14 py-10 grid gap-10 lg:grid-cols-2" aria-labelledby="rwa-alerts">
            <div>
              <h2 id="rwa-alerts" style={{ ...h2, fontSize: 32 }}>Alerts</h2>
              <p style={{ marginTop: 10, color: PALETTE.inkSoft, lineHeight: 1.5 }}>Data points in this snapshot that need a second look before anyone relies on them.</p>
              {snap.alerts.length === 0 ? (
                <p style={{ marginTop: 16, color: PALETTE.concrete }}>No alerts in this snapshot.</p>
              ) : (
                <ul style={{ listStyle: 'none', padding: 0, margin: '16px 0 0', display: 'grid', gap: 10 }} data-testid="rwa-alerts">
                  {snap.alerts.map((a, i) => {
                    const v = rows.find((r) => r.subject.token_symbol === a.token_symbol && r.subject.rwa_symbol === a.rwa_symbol);
                    return (
                      <li key={`${a.token_symbol}-${a.kind}-${i}`} style={{ ...card, padding: 12 }}>
                        <div style={{ ...mono, color: AMBER }}>{humanize(a.kind)} · {a.rwa_symbol}</div>
                        <div style={{ marginTop: 4, fontSize: 14, lineHeight: 1.5, color: PALETTE.inkSoft }}>
                          {a.message}{' '}
                          {v && <a href={`#${anchor(v.subject.crypto_id)}`} onClick={() => { setOpen(v.subject.crypto_id); setShown(Infinity); setOutcome('all'); setType('all'); setQ(''); }} style={{ color: TERRA }}>Open the token</a>}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <div aria-labelledby="rwa-method">
              <h2 id="rwa-method" style={{ ...h2, fontSize: 32 }}>Methodology</h2>
              {policy && (
                <>
                  <p style={{ marginTop: 10, color: PALETTE.inkSoft, lineHeight: 1.5 }}>
                    {policy.title}, version {policy.version}. A token <strong>meets the policy</strong> when every criterion is met; it <strong>needs attention</strong> when something could not be confirmed; it <strong>does not meet the policy</strong> when a criterion is not met.
                  </p>
                  <ol style={{ marginTop: 14, paddingLeft: 18, lineHeight: 1.5, color: PALETTE.inkSoft }}>
                    {policy.criteria.map((c) => (
                      <li key={c.id} style={{ marginTop: 10 }}>
                        <strong style={{ color: PALETTE.ink }}>{c.title}.</strong>{' '}
                        {c.pass && <>Met: {c.pass.toLowerCase()}. </>}
                        {c.warn && <>Not confirmed: {c.warn.toLowerCase()}. </>}
                        {c.fail && <>Not met: {c.fail.toLowerCase()}.</>}
                      </li>
                    ))}
                  </ol>
                  {policy.thresholds && (
                    <p style={{ ...mono, marginTop: 12, color: PALETTE.concrete, lineHeight: 1.7 }}>
                      Thresholds: {Object.entries(policy.thresholds).map(([k, v]) => `${humanize(k)} ${k.includes('usd') ? usd(v) : k.includes('deviation') ? `${(v * 100).toFixed(0)}%` : v}`).join(' · ')}
                    </p>
                  )}
                </>
              )}
              <p style={{ marginTop: 14, color: PALETTE.inkSoft, lineHeight: 1.5 }}>
                Market data: CoinMarketCap Pro API (real-world assets). Issuers, licences and sale restrictions: the DPO2U issuer registry{registry ? `, reviewed ${registry.reviewed_at}` : ''}. {registry?.method}
              </p>
              <p style={{ ...mono, marginTop: 12, lineHeight: 1.9 }}>
                <a href={`${DATA}/policy.json`} style={{ color: TERRA }}>Reference policy (JSON)</a>{' · '}
                <a href={`${DATA}/snapshot.json`} style={{ color: TERRA }}>Full snapshot (JSON)</a>{' · '}
                <a href={`${DATA}/issuers.json`} style={{ color: TERRA }}>Issuer registry (JSON)</a>{' · '}
                <a href={REPO} target="_blank" rel="noopener noreferrer" style={{ color: TERRA }}>Open-source code</a>
              </p>
              <p style={{ ...mono, marginTop: 8, color: PALETTE.concrete, overflowWrap: 'anywhere' }}>Policy hash (sha256): {snap.policy.hash}</p>
            </div>
          </section>

          <Rule />

          <section className="px-6 lg:px-14 py-10" aria-labelledby="rwa-issuers">
            <h2 id="rwa-issuers" style={{ ...h2, fontSize: 32 }}>Issuers</h2>
            <p style={{ marginTop: 10, color: PALETTE.inkSoft, lineHeight: 1.5, maxWidth: 820 }}>What the registry found for each issuer in this snapshot, from primary sources. A missing field means it was not found, never that it was assumed.</p>
            <div className="grid gap-4 lg:grid-cols-2" style={{ marginTop: 18 }}>
              {issuersInSnapshot.map((i) => (
                <article key={i.cmc_issuer_name} id={issuerAnchor(i.cmc_issuer_name)} style={{ ...card, padding: 18, scrollMarginTop: 80, minWidth: 0, overflowWrap: 'anywhere' }} data-testid="rwa-issuer">
                  <h3 style={{ ...h2, fontSize: 22 }}>{i.cmc_issuer_name}</h3>
                  <p style={{ ...mono, color: PALETTE.concrete, marginTop: 6 }}>{tokensByIssuer[i.cmc_issuer_name] ?? 0} tokens in this snapshot{i.reviewed_at ? ` · reviewed ${i.reviewed_at}` : ''}</p>
                  <dl style={{ marginTop: 10, fontSize: 14, lineHeight: 1.5, color: PALETTE.inkSoft, display: 'grid', gridTemplateColumns: 'minmax(80px, max-content) minmax(0, 1fr)', columnGap: 12, rowGap: 6 }}>
                    <dt style={{ fontWeight: 600, color: PALETTE.ink }}>Legal entity</dt><dd style={{ margin: 0 }}>{i.legal_entity ?? 'not found'}{i.jurisdiction ? ` (${i.jurisdiction})` : ''}</dd>
                    <dt style={{ fontWeight: 600, color: PALETTE.ink }}>Regulator</dt><dd style={{ margin: 0 }}>{i.regulator ?? 'not found'}</dd>
                    <dt style={{ fontWeight: 600, color: PALETTE.ink }}>Licence</dt><dd style={{ margin: 0, overflowWrap: 'anywhere' }}>{i.licence?.type ?? 'not found'}{i.licence?.reference ? ` · ${i.licence.reference}` : ''}{i.licence?.url ? <> · <a href={i.licence.url} target="_blank" rel="noopener noreferrer" style={{ color: TERRA }}>{host(i.licence.url)}</a></> : null}</dd>
                    <dt style={{ fontWeight: 600, color: PALETTE.ink }}>Custodian</dt><dd style={{ margin: 0 }}>{i.custodian ?? 'not found'}</dd>
                    <dt style={{ fontWeight: 600, color: PALETTE.ink }}>Sale restrictions</dt>
                    <dd style={{ margin: 0 }}>
                      {i.sale_restrictions?.length ? (
                        <ul style={{ margin: 0, paddingLeft: 16 }}>
                          {i.sale_restrictions.map((r, k) => <li key={k}>{r.who}{r.source ? <> · <a href={r.source} target="_blank" rel="noopener noreferrer" style={{ color: TERRA }}>{host(r.source)}</a></> : null}</li>)}
                        </ul>
                      ) : 'none found'}
                      {i.sale_terms_complete === false && <div style={{ ...mono, color: AMBER, marginTop: 4 }}>Full eligibility terms not found</div>}
                    </dd>
                  </dl>
                  {i.notes && <p style={{ marginTop: 10, fontSize: 13, color: PALETTE.concrete, lineHeight: 1.5 }}>{i.notes}</p>}
                  {i.sources?.length ? <p style={{ marginTop: 8 }}><Sources list={i.sources} /></p> : null}
                </article>
              ))}
            </div>
          </section>

          <Rule />

          <section className="px-6 lg:px-14 py-12" aria-labelledby="rwa-correct">
            <h2 id="rwa-correct" style={{ ...h2, fontSize: 32 }}>Issuers: correct your data</h2>
            <p style={{ marginTop: 12, color: PALETTE.inkSoft, lineHeight: 1.55, maxWidth: 820 }}>
              If a licence, a sale restriction or any other field about your company is missing or wrong, send the public source and we update the registry in the next snapshot.
              Corrections are free and do not depend on any commercial relationship.
            </p>
            <p style={{ marginTop: 16 }}>
              <a href={mail} data-testid="rwa-correct" style={{ display: 'inline-block', background: PALETTE.ink, color: PALETTE.paper, padding: '12px 20px', borderRadius: 4, textDecoration: 'none', fontFamily: FONTS.mono, fontSize: 14 }}>contato@dpo2u.com →</a>
            </p>
            <p style={{ marginTop: 20, fontSize: 13, color: PALETTE.concrete, maxWidth: 820 }}>{policy?.disclaimer ?? snap.disclaimer}</p>
          </section>
        </>
      )}
    </div>
  );
}
