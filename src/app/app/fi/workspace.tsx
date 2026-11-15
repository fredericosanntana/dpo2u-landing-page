// /app/fi/workspace — membros, convites (quatro olhos) e chaves de API (E2).
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api, GatewayError, type Role } from '@/lib/fi/gateway';
import { useFiSession } from '@/components/fi/FiSession';
import { FONTS, PALETTE } from '@/components/sealed/atoms';

const card: React.CSSProperties = { background: PALETTE.paper2, border: `.5px solid ${PALETTE.ruleStrong}`, borderRadius: 4, padding: 20 };
const field: React.CSSProperties = { padding: '9px 11px', border: `1px solid ${PALETTE.ruleStrong}`, borderRadius: 4, fontFamily: FONTS.body, fontSize: 14 };
const btn: React.CSSProperties = { background: PALETTE.ink, color: '#fff', border: 0, padding: '10px 16px', borderRadius: 4, cursor: 'pointer', fontFamily: FONTS.body };
const ROLE_LABEL: Record<Role, string> = { owner: 'Owner', approver: 'Aprovador', client_reviewer: 'Revisor' };

type Key = { id: string; label?: string; createdAt: number | string; lastUsed?: number; requestCount: number };

export default function FiWorkspacePage() {
  const { session, refresh } = useFiSession();
  const [params] = useSearchParams();
  const [keys, setKeys] = useState<Key[]>([]);
  const [newKey, setNewKey] = useState<string | null>(null);
  const [label, setLabel] = useState('');
  const [invite, setInvite] = useState<{ email: string; role: Role }>({ email: '', role: 'approver' });
  const [msg, setMsg] = useState<string | null>(null);
  const isOwner = session?.member.role === 'owner';

  const loadKeys = () => api.listKeys().then((r) => setKeys(r.api_keys)).catch(() => setKeys([]));
  useEffect(() => { void loadKeys(); }, []);
  if (!session) return null;

  const fail = (e: unknown) => setMsg(e instanceof GatewayError ? e.message : 'Algo deu errado.');

  return (
    <div className="grid gap-8" style={{ maxWidth: 860 }}>
      {params.get('welcome') && (
        <div role="status" style={{ ...card, borderColor: PALETTE.verdigris }}>
          Workspace <strong>{session.workspace.name}</strong> criado. Próximos passos: convide um aprovador (outra pessoa) e gere uma chave de API.
        </div>
      )}
      <section style={card} aria-labelledby="ws-members">
        <h2 id="ws-members" style={{ fontFamily: FONTS.display, fontSize: 24, margin: 0 }}>Membros</h2>
        <p style={{ fontSize: 13, color: PALETTE.concrete, marginTop: 4 }}>Identificador da instituição: <code>{session.workspace.id}</code></p>
        <table style={{ width: '100%', marginTop: 12, borderCollapse: 'collapse', fontSize: 14 }}>
          <tbody>
            {session.workspace.members.map((m) => (
              <tr key={m.id} style={{ borderTop: `1px solid ${PALETTE.rule}` }}>
                <td style={{ padding: '8px 0' }}>{m.email}</td>
                <td>{ROLE_LABEL[m.role]}</td>
                <td style={{ color: m.status === 'active' ? PALETTE.verdigris : PALETTE.concrete }}>{m.status === 'active' ? 'ativo' : 'convidado'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {isOwner && (
          <form
            className="flex flex-wrap gap-2 mt-4"
            onSubmit={(e) => {
              e.preventDefault();
              setMsg(null);
              api.invite(invite.email, invite.role).then(() => { setInvite({ email: '', role: 'approver' }); setMsg('Convite enviado.'); return refresh(); }).catch(fail);
            }}
          >
            <input required type="email" placeholder="e-mail" value={invite.email} onChange={(e) => setInvite((s) => ({ ...s, email: e.target.value }))} style={{ ...field, minWidth: 240 }} name="invite_email" />
            <select value={invite.role} onChange={(e) => setInvite((s) => ({ ...s, role: e.target.value as Role }))} style={field} name="invite_role">
              <option value="approver">Aprovador</option>
              <option value="client_reviewer">Revisor</option>
            </select>
            <button type="submit" style={btn}>Convidar</button>
          </form>
        )}
        <p style={{ fontSize: 12, color: PALETTE.concrete, marginTop: 8 }}>O aprovador aprova divulgações a supervisores e transferências retidas. Ele tem de ser outra pessoa (quatro olhos).</p>
      </section>

      <section style={card} aria-labelledby="ws-keys">
        <h2 id="ws-keys" style={{ fontFamily: FONTS.display, fontSize: 24, margin: 0 }}>Chaves de API</h2>
        {newKey && (
          <div role="status" style={{ marginTop: 12, padding: 12, background: '#fff', border: `1px solid ${PALETTE.verdigris}`, borderRadius: 4 }}>
            <div style={{ fontSize: 13 }}>Guarde agora. A chave não é mostrada de novo.</div>
            <code data-testid="new-api-key" style={{ wordBreak: 'break-all', fontSize: 12 }}>{newKey}</code>
          </div>
        )}
        <table style={{ width: '100%', marginTop: 12, borderCollapse: 'collapse', fontSize: 14 }}>
          <tbody>
            {keys.map((k) => (
              <tr key={k.id} style={{ borderTop: `1px solid ${PALETTE.rule}` }}>
                <td style={{ padding: '8px 0' }}>{k.label}</td>
                <td><code>{k.id}…</code></td>
                <td>{k.requestCount} chamadas</td>
                <td>{isOwner && <button type="button" style={{ ...btn, background: 'transparent', color: PALETTE.ink, border: `1px solid ${PALETTE.ruleStrong}` }} onClick={() => api.revokeKey(k.id).then(loadKeys).catch(fail)}>Revogar</button>}</td>
              </tr>
            ))}
            {keys.length === 0 && <tr><td style={{ padding: '8px 0', color: PALETTE.concrete }}>Nenhuma chave ainda.</td></tr>}
          </tbody>
        </table>
        {isOwner && (
          <form
            className="flex flex-wrap gap-2 mt-4"
            onSubmit={(e) => {
              e.preventDefault();
              api.createKey(label).then((r) => { setNewKey(r.api_key); setLabel(''); return loadKeys(); }).catch(fail);
            }}
          >
            <input required placeholder="nome da chave (ex.: produção)" value={label} onChange={(e) => setLabel(e.target.value)} style={{ ...field, minWidth: 240 }} name="key_label" />
            <button type="submit" style={btn}>Gerar chave</button>
          </form>
        )}
      </section>
      {msg && <p role="status">{msg}</p>}
    </div>
  );
}
