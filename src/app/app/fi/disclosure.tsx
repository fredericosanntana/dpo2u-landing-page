// /app/fi/disclosure — acesso de supervisor (E7). Pedir, aprovar (quatro olhos), revogar e ver o log encadeado.
import React, { useEffect, useState } from 'react';
import { disclosureApi, GatewayError, type DisclosureScope, type GrantView } from '@/lib/fi/gateway';
import { useFiSession } from '@/components/fi/FiSession';
import { FONTS, PALETTE } from '@/components/sealed/atoms';

const card: React.CSSProperties = { background: PALETTE.paper2, border: `.5px solid ${PALETTE.ruleStrong}`, borderRadius: 4, padding: 20 };
const field: React.CSSProperties = { padding: '9px 11px', border: `1px solid ${PALETTE.ruleStrong}`, borderRadius: 4, fontFamily: FONTS.body, fontSize: 14, width: '100%' };
const btn: React.CSSProperties = { background: PALETTE.ink, color: '#fff', border: 0, padding: '8px 14px', borderRadius: 4, cursor: 'pointer', fontFamily: FONTS.body };
const ghost: React.CSSProperties = { ...btn, background: 'transparent', color: PALETTE.ink, border: `1px solid ${PALETTE.ruleStrong}` };
const SCOPE_PT: Record<DisclosureScope, string> = { passports: 'Passaportes', transfers: 'Transferências', cases: 'Casos', sponsorships: 'Patrocínios' };
const STATUS_PT: Record<string, string> = { pending: 'aguardando aprovação', approved: 'aprovado', rejected: 'recusado', revoked: 'revogado', expired: 'vencido' };

export default function FiDisclosurePage() {
  const { session } = useFiSession();
  const [grants, setGrants] = useState<GrantView[]>([]);
  const [form, setForm] = useState({ supervisor_email: '', purpose: '', legal_basis: '', days: 7, scope: new Set<DisclosureScope>(['passports']) });
  const [msg, setMsg] = useState<string | null>(null);
  const load = () => disclosureApi.list().then((r) => setGrants(r.grants)).catch(() => undefined);
  useEffect(() => { void load(); }, []);
  if (!session) return null;
  const role = session.member.role;
  const fail = (e: unknown) => setMsg(e instanceof GatewayError ? e.message : 'Algo deu errado.');
  const act = (p: Promise<unknown>, m: string) => p.then(() => { setMsg(m); return load(); }).catch(fail);

  return (
    <div className="grid gap-8" style={{ maxWidth: 900 }}>
      <form style={card} className="grid gap-3" onSubmit={(e) => {
        e.preventDefault();
        setMsg(null);
        act(disclosureApi.create({ supervisor_email: form.supervisor_email, scope: [...form.scope], purpose: form.purpose, legal_basis: form.legal_basis, expires_at: new Date(Date.now() + form.days * 86_400_000).toISOString() }), 'Pedido criado. O aprovador recebeu o e-mail.');
      }}>
        <h2 style={{ fontFamily: FONTS.display, fontSize: 24, margin: 0 }}>Dar acesso a um supervisor</h2>
        <label className="grid gap-1">E-mail do supervisor<input required type="email" name="supervisor_email" value={form.supervisor_email} onChange={(e) => setForm((s) => ({ ...s, supervisor_email: e.target.value }))} style={field} /></label>
        <fieldset className="flex flex-wrap gap-4" style={{ border: 0, padding: 0 }}>
          <legend style={{ fontWeight: 600, marginBottom: 4 }}>Escopo</legend>
          {(Object.keys(SCOPE_PT) as DisclosureScope[]).map((k) => (
            <label key={k} className="flex gap-1"><input type="checkbox" name={`scope_${k}`} checked={form.scope.has(k)} onChange={(e) => setForm((s) => { const n = new Set(s.scope); if (e.target.checked) n.add(k); else n.delete(k); return { ...s, scope: n }; })} />{SCOPE_PT[k]}</label>
          ))}
        </fieldset>
        <label className="grid gap-1">Finalidade<input required minLength={10} name="purpose" value={form.purpose} onChange={(e) => setForm((s) => ({ ...s, purpose: e.target.value }))} style={field} /></label>
        <label className="grid gap-1">Base legal<input required name="legal_basis" value={form.legal_basis} onChange={(e) => setForm((s) => ({ ...s, legal_basis: e.target.value }))} style={field} /></label>
        <label className="grid gap-1">Prazo (dias, até 90)<input required type="number" min={1} max={90} name="days" value={form.days} onChange={(e) => setForm((s) => ({ ...s, days: Number(e.target.value) }))} style={{ ...field, width: 120 }} /></label>
        <div><button type="submit" style={btn} disabled={form.scope.size === 0}>Pedir acesso</button></div>
        <p style={{ fontSize: 12, color: PALETTE.concrete, margin: 0 }}>O link só sai depois que o aprovador do workspace (outra pessoa) aprovar. Cada acesso fica num log encadeado que você e o supervisor podem verificar.</p>
      </form>

      <section className="grid gap-3" aria-labelledby="ds-list">
        <h2 id="ds-list" style={{ fontFamily: FONTS.display, fontSize: 24, margin: 0 }}>Pedidos</h2>
        {grants.map((g) => (
          <article key={g.id} style={card} data-grant={g.id} data-status={g.status} className="grid gap-2">
            <header className="flex flex-wrap justify-between gap-2">
              <strong>{g.supervisor_email}</strong>
              <span>{STATUS_PT[g.status]} · {g.accesses} acesso(s) · até {new Date(g.expires_at).toLocaleDateString()}</span>
            </header>
            <div style={{ fontSize: 13 }}>{g.scope.map((s) => SCOPE_PT[s]).join(', ')} · {g.purpose} · {g.legal_basis}</div>
            <div style={{ fontSize: 12, color: g.log_verified ? PALETTE.verdigris : PALETTE.terracotta }} data-testid="log-verified">{g.log_verified ? `Log íntegro (${g.log.length} registros)` : 'Log com quebra na cadeia'}</div>
            <details><summary style={{ fontSize: 13, cursor: 'pointer' }}>Ver log</summary>
              <ol style={{ fontSize: 12, paddingLeft: 18 }}>{g.log.map((e) => <li key={e.seq}>{new Date(e.at).toLocaleString()} · {e.action} · {e.actor}{e.detail ? ` · ${e.detail}` : ''} · <code>{e.hash.slice(0, 12)}</code></li>)}</ol>
            </details>
            <div className="flex gap-2">
              {g.status === 'pending' && role === 'approver' && g.requested_by !== session.member.email && (
                <>
                  <button type="button" style={btn} onClick={() => act(disclosureApi.approve(g.id), 'Aprovado. O supervisor recebeu o link.')}>Aprovar</button>
                  <button type="button" style={ghost} onClick={() => act(disclosureApi.reject(g.id), 'Recusado.')}>Recusar</button>
                </>
              )}
              {(g.status === 'approved' || g.status === 'pending') && role !== 'client_reviewer' && <button type="button" style={ghost} onClick={() => act(disclosureApi.revoke(g.id), 'Acesso revogado.')}>Revogar</button>}
            </div>
          </article>
        ))}
        {grants.length === 0 && <p style={{ color: PALETTE.concrete }}>Nenhum pedido ainda.</p>}
      </section>
      {msg && <p role="status" data-testid="ds-msg">{msg}</p>}
    </div>
  );
}
