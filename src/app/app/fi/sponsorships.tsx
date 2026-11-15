// /app/fi/sponsorships — patrocínio por convite (E5). A licenciada convida e acompanha;
// o parceiro aceita depois de ter o passaporte. A licenciada vê só status e validade.
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GatewayError, sponsorshipApi, type InviteView } from '@/lib/fi/gateway';
import { useFiSession } from '@/components/fi/FiSession';
import { FONTS, PALETTE } from '@/components/sealed/atoms';

const card: React.CSSProperties = { background: PALETTE.paper2, border: `.5px solid ${PALETTE.ruleStrong}`, borderRadius: 4, padding: 20 };
const field: React.CSSProperties = { padding: '9px 11px', border: `1px solid ${PALETTE.ruleStrong}`, borderRadius: 4, fontFamily: FONTS.body, fontSize: 14 };
const btn: React.CSSProperties = { background: PALETTE.ink, color: '#fff', border: 0, padding: '10px 16px', borderRadius: 4, cursor: 'pointer', fontFamily: FONTS.body };
const STATUS_PT: Record<string, string> = { invited: 'convidado', proposed: 'aguardando passaporte', active: 'ativo', suspended: 'suspenso', ended: 'encerrado' };
const COLOR: Record<string, string> = { active: PALETTE.verdigris, suspended: PALETTE.terracotta };

export default function FiSponsorshipsPage() {
  const { session } = useFiSession();
  const [data, setData] = useState<{ sent: InviteView[]; received: InviteView[] }>({ sent: [], received: [] });
  const [form, setForm] = useState({ partner_email: '', accountable_director: '' });
  const [msg, setMsg] = useState<string | null>(null);
  const load = () => sponsorshipApi.list().then(setData).catch(() => undefined);
  useEffect(() => { void load(); }, []);
  if (!session) return null;
  const isOwner = session.member.role === 'owner';
  const fail = (e: unknown) => setMsg(e instanceof GatewayError ? e.message : 'Algo deu errado.');

  return (
    <div className="grid gap-8" style={{ maxWidth: 900 }}>
      {data.received.length > 0 && (
        <section style={card} aria-labelledby="sp-received">
          <h2 id="sp-received" style={{ fontFamily: FONTS.display, fontSize: 24, margin: 0 }}>Convites recebidos</h2>
          {data.received.map((i) => (
            <div key={i.id} data-invite={i.id} data-status={i.status} className="flex flex-wrap items-center gap-3" style={{ borderTop: `1px solid ${PALETTE.rule}`, paddingTop: 10, marginTop: 10 }}>
              <div style={{ flex: 1 }}>
                <strong>{i.sponsor.name ?? i.sponsor.id}</strong> quer patrociná-lo · {i.required_packs.join(', ')} · {i.min_tier} ou acima
                <div style={{ fontSize: 12, color: PALETTE.concrete }}>Diretor responsável: {i.accountable_director}</div>
              </div>
              <span style={{ color: COLOR[i.status] ?? PALETTE.ink }}>{STATUS_PT[i.status]}</span>
              {i.status !== 'active' && isOwner && (
                <button type="button" style={btn} onClick={() => sponsorshipApi.accept(i.id).then(() => { setMsg('Patrocínio ativo.'); return load(); }).catch((e) => {
                  if (e instanceof GatewayError && e.code === 'passport_required') setMsg('Faça o passaporte de parceiro antes de aceitar.');
                  else fail(e);
                })}>Aceitar e compartilhar o status</button>
              )}
            </div>
          ))}
          <p style={{ fontSize: 12, color: PALETTE.concrete, marginTop: 10 }}>Ao aceitar, a licenciada passa a ver o status e a validade do seu passaporte. A evidência continua só com você. Sem passaporte ainda? <Link to="/app/fi/passport">Faça agora</Link>.</p>
        </section>
      )}

      <section style={card} aria-labelledby="sp-sent">
        <h2 id="sp-sent" style={{ fontFamily: FONTS.display, fontSize: 24, margin: 0 }}>Parceiros patrocinados</h2>
        <table style={{ width: '100%', marginTop: 12, borderCollapse: 'collapse', fontSize: 14 }} data-testid="sp-sent">
          <tbody>
            {data.sent.map((i) => (
              <tr key={i.id} data-status={i.status} style={{ borderTop: `1px solid ${PALETTE.rule}` }}>
                <td style={{ padding: '8px 0' }}>{i.partner_email}</td>
                <td style={{ color: COLOR[i.status] ?? PALETTE.ink }}>{STATUS_PT[i.status]}</td>
                <td>{i.passport ? `passaporte ${i.passport.status}, vence ${new Date(i.passport.expiresAt).toLocaleDateString()}` : 'sem passaporte'}</td>
              </tr>
            ))}
            {data.sent.length === 0 && <tr><td style={{ padding: '8px 0', color: PALETTE.concrete }}>Nenhum parceiro convidado ainda.</td></tr>}
          </tbody>
        </table>
        {isOwner && (
          <form className="flex flex-wrap gap-2 mt-4" onSubmit={(e) => { e.preventDefault(); setMsg(null); sponsorshipApi.invite(form).then(() => { setForm({ partner_email: '', accountable_director: '' }); setMsg('Convite enviado.'); return load(); }).catch(fail); }}>
            <input required type="email" name="partner_email" placeholder="e-mail do parceiro" value={form.partner_email} onChange={(e) => setForm((s) => ({ ...s, partner_email: e.target.value }))} style={{ ...field, minWidth: 240 }} />
            <input required name="accountable_director" placeholder="diretor responsável (art. 42)" value={form.accountable_director} onChange={(e) => setForm((s) => ({ ...s, accountable_director: e.target.value }))} style={{ ...field, minWidth: 240 }} />
            <button type="submit" style={btn}>Convidar parceiro</button>
          </form>
        )}
      </section>
      {msg && <p role="status" data-testid="sp-msg">{msg}</p>}
    </div>
  );
}
