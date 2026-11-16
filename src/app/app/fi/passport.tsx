// /app/fi/passport — assistente do passaporte de parceiro (E3, Res. BCB 520 arts. 32-42).
//
// Os documentos são lidos e resumidos (sha256) no navegador: só o hash vai ao gateway.
// Passos: selar a evidência → preparar o run → pedir revisão humana à DPO2U.
import React, { useEffect, useState } from 'react';
import { GatewayError, passportApi, sha256File, type ReviewRequestView, type SubmitBody, type Tier } from '@/lib/fi/gateway';
import { useFiSession } from '@/components/fi/FiSession';
import { FONTS, PALETTE } from '@/components/sealed/atoms';

const card: React.CSSProperties = { background: PALETTE.paper2, border: `.5px solid ${PALETTE.ruleStrong}`, borderRadius: 4, padding: 20 };
const field: React.CSSProperties = { padding: '9px 11px', border: `1px solid ${PALETTE.ruleStrong}`, borderRadius: 4, fontFamily: FONTS.body, fontSize: 14, width: '100%' };
const btn: React.CSSProperties = { background: PALETTE.ink, color: '#fff', border: 0, padding: '10px 16px', borderRadius: 4, cursor: 'pointer', fontFamily: FONTS.body };

const DOCS: { key: string; label: string; art: string }[] = [
  { key: 'due_diligence', label: 'Verificação prévia do parceiro (due diligence)', art: 'art. 34' },
  { key: 'contract', label: 'Contrato com o parceiro', art: 'arts. 35-40' },
  { key: 'client_disclosure', label: 'Aviso ao cliente sobre o parceiro', art: 'art. 41' },
  { key: 'director_designation', label: 'Designação do diretor responsável', art: 'art. 42' },
  { key: 'partner_kyc', label: 'KYC/KYB do parceiro', art: 'art. 34' },
];
const CLAUSES: { key: string; label: string }[] = [
  { key: 'acts_on_behalf', label: 'O parceiro atua por conta e sob diretrizes da instituição (art. 35)' },
  { key: 'no_direct_charge', label: 'O parceiro não cobra diretamente os clientes (art. 37)' },
  { key: 'bcb_access', label: 'O BCB tem acesso à documentação e às dependências do parceiro (art. 40)' },
];
const CATEGORIES = ['custody', 'liquidity', 'market_maker', 'emoney_account', 'technology', 'other'];
const STATUS_PT: Record<string, string> = { pending: 'em revisão', issued: 'emitido', returned: 'devolvido', blocked: 'bloqueado' };
const CHAIN = (import.meta.env.VITE_FI_CHAIN as string | undefined) || undefined;

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function FiPassportPage() {
  const { session } = useFiSession();
  const [partner, setPartner] = useState('');
  const [category, setCategory] = useState('technology');
  const [scope, setScope] = useState('');
  const [hashes, setHashes] = useState<Record<string, string>>({});
  const [clauses, setClauses] = useState<Set<string>>(new Set());
  const [tier, setTier] = useState<Tier>('tier1');
  const [busy, setBusy] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [requests, setRequests] = useState<ReviewRequestView[]>([]);

  const load = () => passportApi.myRequests().then((r) => setRequests(r.requests)).catch(() => setRequests([]));
  useEffect(() => { void load(); }, []);
  if (!session) return null;

  async function onFile(key: string, f: File | undefined) {
    if (!f) return;
    const h = await sha256File(f);
    setHashes((s) => ({ ...s, [key]: h }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    try {
      const body: SubmitBody = {
        use_case_id: 'psav_partner_br_v1',
        request_id: `fi-${session!.workspace.id}-${Date.now()}`.slice(0, 64),
        evidence: { partner, sponsor: session!.workspace.id, service_category: category, service_scope: scope, documents: hashes, contract_clauses: [...clauses] },
        ...(CHAIN ? { chain: CHAIN } : {}),
      };
      setBusy('Selando a evidência na rede…');
      const sub = await passportApi.submit(body);
      let att = await passportApi.attempt(sub.attempt_id);
      for (let i = 0; i < 60 && att.status !== 'COMPLETED' && att.status !== 'FAILED'; i++) {
        await wait(2000);
        att = await passportApi.attempt(sub.attempt_id);
      }
      if (att.status !== 'COMPLETED') throw new Error(att.status === 'FAILED' ? `O selo falhou: ${typeof att.error === 'string' ? att.error : (att.error?.message ?? att.error?.code ?? '')}` : 'O selo ainda não terminou. Tente de novo em alguns minutos.');
      setBusy('Preparando o pedido…');
      const prep = await passportApi.prepare(sub.attempt_id, body);
      await passportApi.requestReview(prep.run_id, tier);
      setBusy(null);
      await load();
    } catch (e2) {
      setBusy(null);
      setErr(e2 instanceof GatewayError || e2 instanceof Error ? e2.message : 'Algo deu errado.');
    }
  }

  return (
    <div className="grid gap-8" style={{ maxWidth: 860 }}>
      <section style={card} aria-labelledby="pp-requests">
        <h2 id="pp-requests" style={{ fontFamily: FONTS.display, fontSize: 24, margin: 0 }}>Pedidos de passaporte</h2>
        <table style={{ width: '100%', marginTop: 12, borderCollapse: 'collapse', fontSize: 14 }} data-testid="pp-requests">
          <tbody>
            {requests.map((r) => (
              <tr key={r.id} style={{ borderTop: `1px solid ${PALETTE.rule}` }} data-status={r.status}>
                <td style={{ padding: '8px 0' }}>{new Date(r.requested_at).toLocaleString()}</td>
                <td>{r.packs.map((p) => p.id).join(', ')}</td>
                <td>{r.tier}</td>
                <td style={{ color: r.status === 'issued' ? PALETTE.verdigris : PALETTE.ink }}>{STATUS_PT[r.status]}</td>
                <td>{r.passport_id ? <a href={`/verify/passport/${encodeURIComponent(r.passport_id)}`}>ver passaporte</a> : r.note ?? `${r.to_review.length} regra(s) com o revisor`}</td>
              </tr>
            ))}
            {requests.length === 0 && <tr><td style={{ padding: '8px 0', color: PALETTE.concrete }}>Nenhum pedido ainda.</td></tr>}
          </tbody>
        </table>
      </section>

      <form style={card} onSubmit={submit} aria-labelledby="pp-new" className="grid gap-4">
        <h2 id="pp-new" style={{ fontFamily: FONTS.display, fontSize: 24, margin: 0 }}>Novo passaporte de parceiro</h2>
        <p style={{ fontSize: 13, color: PALETTE.concrete, margin: 0 }}>
          Os arquivos ficam no seu computador. O navegador calcula o hash de cada um e só o hash vai para a DPO2U. Um revisor nomeado decide as regras humanas e assina.
        </p>
        <label className="grid gap-1">Parceiro (nome ou identificador interno)
          <input required name="partner" value={partner} onChange={(e) => setPartner(e.target.value)} style={field} />
        </label>
        <label className="grid gap-1">Categoria do serviço
          <select name="service_category" value={category} onChange={(e) => setCategory(e.target.value)} style={field}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
        <label className="grid gap-1">Escopo do serviço
          <input required name="service_scope" value={scope} onChange={(e) => setScope(e.target.value)} style={field} />
        </label>
        <fieldset className="grid gap-2" style={{ border: 0, padding: 0 }}>
          <legend style={{ fontWeight: 600 }}>Documentos</legend>
          {DOCS.map((d) => (
            <label key={d.key} className="grid gap-1" style={{ fontSize: 14 }}>
              {d.label} <span style={{ color: PALETTE.concrete, fontSize: 12 }}>({d.art})</span>
              <input type="file" name={`doc_${d.key}`} onChange={(e) => void onFile(d.key, e.target.files?.[0])} />
              {hashes[d.key] && <code style={{ fontSize: 11, color: PALETTE.concrete }}>sha256 {hashes[d.key].slice(0, 16)}…</code>}
            </label>
          ))}
        </fieldset>
        <fieldset className="grid gap-2" style={{ border: 0, padding: 0 }}>
          <legend style={{ fontWeight: 600 }}>Cláusulas do contrato</legend>
          {CLAUSES.map((c) => (
            <label key={c.key} className="flex gap-2" style={{ fontSize: 14 }}>
              <input type="checkbox" name={`clause_${c.key}`} checked={clauses.has(c.key)} onChange={(e) => setClauses((s) => { const n = new Set(s); if (e.target.checked) n.add(c.key); else n.delete(c.key); return n; })} />
              {c.label}
            </label>
          ))}
        </fieldset>
        <label className="grid gap-1">Nível
          <select name="tier" value={tier} onChange={(e) => setTier(e.target.value as Tier)} style={field}>
            <option value="tier1">Tier 1 (validade de 12 meses)</option>
            <option value="tier2">Tier 2 (validade de 31 dias)</option>
          </select>
        </label>
        <div><button type="submit" style={btn} disabled={Boolean(busy)}>{busy ?? 'Selar e pedir revisão'}</button></div>
        {err && <p role="alert" style={{ color: PALETTE.terracotta }}>{err}</p>}
      </form>
    </div>
  );
}
