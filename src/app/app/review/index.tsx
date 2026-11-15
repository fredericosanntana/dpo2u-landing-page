// /app/review — fila do revisor nomeado (E3). Acesso só com a chave de API do operador DPO2U.
//
// A chave privada Ed25519 do revisor é usada só nesta aba (WebCrypto) e nunca é enviada.
// Quem preferir assina fora com scripts/psav-review-sign.ts e cola a assinatura.
import React, { useEffect, useState } from 'react';
import { GatewayError, reviewApi, signEd25519, type ReviewRequestView } from '@/lib/fi/gateway';
import { DPO2ULockup, FONTS, PALETTE } from '@/components/sealed/atoms';

const card: React.CSSProperties = { background: PALETTE.paper2, border: `.5px solid ${PALETTE.ruleStrong}`, borderRadius: 4, padding: 20 };
const field: React.CSSProperties = { padding: '9px 11px', border: `1px solid ${PALETTE.ruleStrong}`, borderRadius: 4, fontFamily: FONTS.body, fontSize: 14, width: '100%' };
const btn: React.CSSProperties = { background: PALETTE.ink, color: '#fff', border: 0, padding: '10px 16px', borderRadius: 4, cursor: 'pointer', fontFamily: FONTS.body };
const ghost: React.CSSProperties = { ...btn, background: 'transparent', color: PALETTE.ink, border: `1px solid ${PALETTE.ruleStrong}` };
const KEY_STORE = 'dpo2u.review.operatorKey';

function readKey(): string {
  try { return sessionStorage.getItem(KEY_STORE) ?? ''; } catch { return ''; }
}

function RequestCard({ r, apiKey, onDone }: { r: ReviewRequestView; apiKey: string; onDone: (msg: string) => void }) {
  const [verdicts, setVerdicts] = useState<Record<string, 'PASS' | 'FAIL'>>(() => Object.fromEntries(r.to_review.map((x) => [x.id, 'PASS'])));
  const [reviewerId, setReviewerId] = useState(() => { try { return localStorage.getItem('dpo2u.review.reviewerId') ?? ''; } catch { return ''; } });
  const [pem, setPem] = useState('');
  const [signature, setSignature] = useState('');
  const [payload, setPayload] = useState<string | null>(null);
  const [reason, setReason] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const fail = (e: unknown) => setErr(e instanceof GatewayError || e instanceof Error ? e.message : 'Algo deu errado.');

  async function makePayload() {
    setErr(null);
    try { setPayload((await reviewApi.payload(apiKey, r.id, verdicts)).payload); } catch (e) { fail(e); }
  }
  async function decide() {
    setErr(null);
    try {
      const p = payload ?? (await reviewApi.payload(apiKey, r.id, verdicts)).payload;
      const sig = signature.trim() || (pem.trim() ? await signEd25519(pem, p) : '');
      if (!sig) throw new Error('Cole a chave privada do revisor ou a assinatura.');
      try { localStorage.setItem('dpo2u.review.reviewerId', reviewerId); } catch { /* sem storage */ }
      const out = await reviewApi.decide(apiKey, r.id, { reviewer_id: reviewerId, verdicts, signature: sig });
      setPem('');
      onDone(`Passaporte ${out.passport.id} emitido (${out.passport.status}, ${out.passport.tier}).`);
    } catch (e) { fail(e); }
  }

  return (
    <article style={card} data-request={r.id} className="grid gap-3">
      <header>
        <h3 style={{ fontFamily: FONTS.display, fontSize: 20, margin: 0 }}>{r.client_id}</h3>
        <p style={{ fontSize: 13, color: PALETTE.concrete, margin: 0 }}>{r.packs.map((p) => p.id).join(', ')} · {r.tier} · pedido em {new Date(r.requested_at).toLocaleString()}</p>
      </header>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
        <tbody>
          {r.to_review.map((x) => (
            <tr key={x.id} style={{ borderTop: `1px solid ${PALETTE.rule}` }}>
              <td style={{ padding: '6px 0' }}><code>{x.id}</code><div style={{ fontSize: 12, color: PALETTE.concrete }}>{x.citation}</div></td>
              <td style={{ whiteSpace: 'nowrap' }}>
                {(['PASS', 'FAIL'] as const).map((v) => (
                  <label key={v} style={{ marginLeft: 8 }}>
                    <input type="radio" name={`${r.id}-${x.id}`} value={v} checked={verdicts[x.id] === v} onChange={() => { setVerdicts((s) => ({ ...s, [x.id]: v })); setPayload(null); }} /> {v}
                  </label>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <label className="grid gap-1">Id do revisor<input name="reviewer_id" value={reviewerId} onChange={(e) => setReviewerId(e.target.value)} style={field} /></label>
      <div className="flex gap-2"><button type="button" style={ghost} onClick={makePayload}>Ver o que vou assinar</button></div>
      {payload && <pre data-testid="review-payload" style={{ fontSize: 11, whiteSpace: 'pre-wrap', wordBreak: 'break-all', background: '#fff', padding: 8, border: `1px solid ${PALETTE.rule}` }}>{payload}</pre>}
      <label className="grid gap-1">Chave privada Ed25519 do revisor (PEM, fica só nesta aba)
        <textarea name="reviewer_pem" rows={3} value={pem} onChange={(e) => setPem(e.target.value)} style={{ ...field, fontFamily: 'monospace', fontSize: 12 }} autoComplete="off" spellCheck={false} />
      </label>
      <label className="grid gap-1">ou assinatura base64 feita fora (scripts/psav-review-sign.ts)
        <input name="reviewer_signature" value={signature} onChange={(e) => setSignature(e.target.value)} style={field} />
      </label>
      <div className="flex flex-wrap gap-2">
        <button type="button" style={btn} onClick={decide} disabled={!reviewerId}>Assinar e emitir</button>
        <input name="return_reason" placeholder="motivo da devolução" value={reason} onChange={(e) => setReason(e.target.value)} style={{ ...field, width: 260 }} />
        <button type="button" style={ghost} disabled={reason.trim().length < 3} onClick={() => reviewApi.giveBack(apiKey, r.id, reason).then(() => onDone('Pedido devolvido ao cliente.')).catch(fail)}>Devolver</button>
      </div>
      {err && <p role="alert" style={{ color: PALETTE.terracotta }}>{err}</p>}
    </article>
  );
}

export default function ReviewQueuePage() {
  const [apiKey, setApiKey] = useState(readKey);
  const [draft, setDraft] = useState('');
  const [items, setItems] = useState<ReviewRequestView[] | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const load = (k = apiKey) => reviewApi.queue(k).then((r) => setItems(r.requests)).catch((e) => { setItems(null); setMsg(e instanceof GatewayError && e.status === 403 ? 'Esta chave não é de operador.' : 'Chave inválida.'); });
  useEffect(() => { if (apiKey) void load(); }, [apiKey]);

  return (
    <main style={{ background: PALETTE.paper, minHeight: '100vh', fontFamily: FONTS.body, color: PALETTE.ink }}>
      <div className="mx-auto px-4 py-8 grid gap-6" style={{ maxWidth: 900 }}>
        <div className="flex items-center justify-between"><DPO2ULockup size={24} /><span style={{ fontSize: 13, color: PALETTE.concrete }}>Fila de revisão</span></div>
        {!apiKey ? (
          <form style={card} className="grid gap-3" onSubmit={(e) => { e.preventDefault(); try { sessionStorage.setItem(KEY_STORE, draft); } catch { /* sem storage */ } setApiKey(draft); }}>
            <h1 style={{ fontFamily: FONTS.display, fontSize: 28, margin: 0 }}>Revisão de passaportes</h1>
            <label className="grid gap-1">Chave de API do operador<input name="operator_key" type="password" required value={draft} onChange={(e) => setDraft(e.target.value)} style={field} autoComplete="off" /></label>
            <div><button type="submit" style={btn}>Entrar</button></div>
            {msg && <p role="alert">{msg}</p>}
          </form>
        ) : (
          <>
            <div className="flex justify-between items-center">
              <h1 style={{ fontFamily: FONTS.display, fontSize: 28, margin: 0 }}>Pendentes ({items?.length ?? 0})</h1>
              <button type="button" style={ghost} onClick={() => { try { sessionStorage.removeItem(KEY_STORE); } catch { /* */ } setApiKey(''); setItems(null); }}>Sair</button>
            </div>
            {msg && <p role="status" data-testid="review-msg">{msg}</p>}
            {items?.map((r) => <RequestCard key={r.id} r={r} apiKey={apiKey} onDone={(m) => { setMsg(m); void load(); }} />)}
            {items?.length === 0 && <p style={{ color: PALETTE.concrete }}>Nada na fila.</p>}
          </>
        )}
      </div>
    </main>
  );
}
