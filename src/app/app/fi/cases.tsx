// /app/fi/cases — transferências dos últimos 30 dias e casos de Travel Rule (E6).
// Todo FAIL ou REVIEW abre um caso com dono e prazo; só o aprovador decide, com justificativa.
import React, { useEffect, useState } from 'react';
import { GatewayError, travelRuleApi, type CaseView, type TransferView } from '@/lib/fi/gateway';
import { useFiSession } from '@/components/fi/FiSession';
import { FONTS, PALETTE } from '@/components/sealed/atoms';

const card: React.CSSProperties = { background: PALETTE.paper2, border: `.5px solid ${PALETTE.ruleStrong}`, borderRadius: 4, padding: 20 };
const btn: React.CSSProperties = { background: PALETTE.ink, color: '#fff', border: 0, padding: '8px 14px', borderRadius: 4, cursor: 'pointer', fontFamily: FONTS.body };
const ghost: React.CSSProperties = { ...btn, background: 'transparent', color: PALETTE.ink, border: `1px solid ${PALETTE.ruleStrong}` };
const VERDICT_COLOR: Record<string, string> = { PASS: PALETTE.verdigris, FAIL: PALETTE.terracotta, REVIEW: PALETTE.ink };
const CASE_PT: Record<string, string> = { open: 'aberto', released: 'liberado', kept_blocked: 'mantido bloqueado' };

function CaseCard({ c, canDecide, onDone }: { c: CaseView; canDecide: boolean; onDone: (m: string) => void }) {
  const [just, setJust] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const late = c.status === 'open' && new Date(c.dueAt).getTime() < Date.now();
  const decide = (a: 'release' | 'keep_blocked') => travelRuleApi.decide(c.id, a, just).then(() => onDone(a === 'release' ? 'Caso liberado.' : 'Mantido bloqueado.')).catch((e) => setErr(e instanceof GatewayError ? e.message : 'Algo deu errado.'));
  return (
    <article style={card} data-case={c.id} data-status={c.status} className="grid gap-2">
      <header className="flex flex-wrap justify-between gap-2">
        <strong style={{ color: VERDICT_COLOR[c.verdict] }}>{c.verdict} · {c.transfer?.transfer_ref} · {c.transfer?.amount_usd} USD</strong>
        <span style={{ fontSize: 13, color: late ? PALETTE.terracotta : PALETTE.concrete }}>{CASE_PT[c.status]} · prazo {new Date(c.dueAt).toLocaleString()}{late ? ' (atrasado)' : ''}</span>
      </header>
      <ul style={{ fontSize: 13, margin: 0, paddingLeft: 18 }}>
        {c.reasons.map((r, i) => <li key={i}><code>{r.code}</code>{r.ruleId ? ` (${r.ruleId})` : ''}: {r.detail}</li>)}
      </ul>
      <div style={{ fontSize: 12, color: PALETTE.concrete }}>Responsável: {c.ownerEmail ?? '-'}</div>
      {c.history.length > 1 && (
        <ol style={{ fontSize: 12, margin: 0, paddingLeft: 18 }}>
          {c.history.slice(1).map((h, i) => <li key={i}>{new Date(h.at).toLocaleString()} · {h.by} · {h.action}{h.justification ? `: ${h.justification}` : ''}</li>)}
        </ol>
      )}
      {c.status === 'open' && canDecide && (
        <div className="grid gap-2">
          <textarea name="justification" rows={2} placeholder="justificativa (vai para o pacote de evidências)" value={just} onChange={(e) => setJust(e.target.value)} style={{ padding: 8, border: `1px solid ${PALETTE.ruleStrong}`, borderRadius: 4, fontFamily: FONTS.body }} />
          <div className="flex gap-2">
            <button type="button" style={btn} disabled={just.trim().length < 10} onClick={() => decide('release')}>Liberar</button>
            <button type="button" style={ghost} disabled={just.trim().length < 10} onClick={() => decide('keep_blocked')}>Manter bloqueado</button>
          </div>
        </div>
      )}
      {err && <p role="alert" style={{ color: PALETTE.terracotta, margin: 0 }}>{err}</p>}
    </article>
  );
}

export default function FiCasesPage() {
  const { session } = useFiSession();
  const [transfers, setTransfers] = useState<TransferView[]>([]);
  const [cases, setCases] = useState<CaseView[]>([]);
  const [msg, setMsg] = useState<string | null>(null);
  const load = () => Promise.all([travelRuleApi.transfers().then((r) => setTransfers(r.transfers)), travelRuleApi.cases().then((r) => setCases(r.cases))]).catch(() => undefined);
  useEffect(() => { void load(); }, []);
  if (!session) return null;
  const isApprover = session.member.role === 'approver';
  const open = cases.filter((c) => c.status === 'open');

  return (
    <div className="grid gap-8" style={{ maxWidth: 960 }}>
      <section className="grid gap-3" aria-labelledby="cs-open">
        <h2 id="cs-open" style={{ fontFamily: FONTS.display, fontSize: 24, margin: 0 }}>Casos abertos ({open.length})</h2>
        {!isApprover && open.length > 0 && <p style={{ fontSize: 13, color: PALETTE.concrete, margin: 0 }}>Só o aprovador do workspace decide os casos (quatro olhos).</p>}
        {open.map((c) => <CaseCard key={c.id} c={c} canDecide={isApprover} onDone={(m) => { setMsg(m); void load(); }} />)}
        {open.length === 0 && <p style={{ color: PALETTE.concrete }}>Nenhum caso aberto.</p>}
      </section>

      <section style={card} aria-labelledby="cs-tr">
        <h2 id="cs-tr" style={{ fontFamily: FONTS.display, fontSize: 24, margin: 0 }}>Transferências (30 dias)</h2>
        <table style={{ width: '100%', marginTop: 12, borderCollapse: 'collapse', fontSize: 14 }} data-testid="tr-list">
          <tbody>
            {transfers.map((t) => (
              <tr key={t.id} data-verdict={t.verdict} style={{ borderTop: `1px solid ${PALETTE.rule}` }}>
                <td style={{ padding: '8px 0' }}>{new Date(t.created_at).toLocaleString()}</td>
                <td>{t.transfer_ref}</td>
                <td>{t.amount_usd} USD</td>
                <td style={{ color: VERDICT_COLOR[t.verdict] }}>{t.verdict}</td>
                <td>{t.status}</td>
                <td style={{ fontSize: 12, color: PALETTE.concrete }}>{t.latency_ms} ms</td>
              </tr>
            ))}
            {transfers.length === 0 && <tr><td style={{ padding: '8px 0', color: PALETTE.concrete }}>Nenhuma transferência ainda. Use a API ou o SDK @dpo2u/travel-rule com uma chave do workspace.</td></tr>}
          </tbody>
        </table>
      </section>

      {cases.some((c) => c.status !== 'open') && (
        <section className="grid gap-3" aria-labelledby="cs-closed">
          <h2 id="cs-closed" style={{ fontFamily: FONTS.display, fontSize: 22, margin: 0 }}>Casos encerrados</h2>
          {cases.filter((c) => c.status !== 'open').map((c) => <CaseCard key={c.id} c={c} canDecide={false} onDone={() => undefined} />)}
        </section>
      )}
      {msg && <p role="status" data-testid="cs-msg">{msg}</p>}
    </div>
  );
}
