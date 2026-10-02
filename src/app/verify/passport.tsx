/**
 * /verify/passport/:id — passaporte público do padrão PSAV-parceiro.
 *
 * Sem login, compartilhável. Mostra veredito, tier, validade, versão e hash de
 * cada pack, de onde vem o veredito (máquina, revisor humano, terceiro) e o
 * histórico. Nunca mostra evidência. Suspenso, expirado e revogado aparecem em
 * destaque e nunca são omitidos. Texto em PT-BR (mercado regulado pelo BCB).
 */
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { usePageHead } from '@/lib/page-head';
import { FONTS, PALETTE, SmallLabel, Rule } from '@/components/sealed/atoms';
import { fetchPassport, originPercent, statusCopy, TIER_LABEL, type FetchPassport } from '@/lib/psav/passport';

const HISTORY_LABEL: Record<string, string> = {
  'passport.issued': 'Emitido',
  'passport.suspended': 'Suspenso',
  'passport.expired': 'Expirado',
  'passport.revoked': 'Revogado',
};

function fmt(iso: string): string {
  return new Date(iso).toLocaleString('pt-BR', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'America/Sao_Paulo' });
}

export default function PassportPage() {
  const { id = '' } = useParams<{ id: string }>();
  const [state, setState] = useState<FetchPassport | null>(null);

  usePageHead({
    title: 'Passaporte de conformidade PSAV — DPO2U',
    description: 'Verificação pública do passaporte de conformidade de um prestador contratado por SPSAV (Res. BCB 520).',
  });

  useEffect(() => {
    let alive = true;
    void fetchPassport(id).then((r) => alive && setState(r));
    return () => {
      alive = false;
    };
  }, [id]);

  const wrap: React.CSSProperties = { maxWidth: 760, margin: '0 auto', padding: '48px 16px 96px', fontFamily: FONTS.body, color: PALETTE.ink };

  if (!state) return <main style={wrap}><p aria-live="polite">Consultando o passaporte…</p></main>;
  if (state.ok === false) {
    return (
      <main style={wrap}>
        <h1 style={{ fontFamily: FONTS.display, fontSize: 32 }}>Passaporte não encontrado</h1>
        <p>{state.reason === 'not-found' ? 'Nenhum passaporte com este identificador.' : 'Não foi possível consultar agora. Tente de novo em instantes.'}</p>
        <Link to="/verify">Verificar uma atestação</Link>
      </main>
    );
  }

  const p = state.passport;
  const st = statusCopy(p.status);
  const pct = originPercent(p.origin);
  const alert = st.tone === 'alert';

  return (
    <main style={wrap}>
      <SmallLabel>Passaporte de conformidade · padrão PSAV-parceiro</SmallLabel>
      <h1 style={{ fontFamily: FONTS.display, fontSize: 'clamp(26px, 6vw, 36px)', margin: '8px 0 4px' }}>{TIER_LABEL[p.tier]}</h1>
      <p style={{ fontFamily: FONTS.mono, fontSize: 13, color: PALETTE.concrete, wordBreak: 'break-all' }}>{p.id}</p>

      <section
        role={alert ? 'alert' : 'status'}
        style={{
          margin: '24px 0',
          padding: 16,
          border: `2px solid ${alert ? PALETTE.terracotta : PALETTE.verdigris}`,
          background: alert ? 'rgba(200,92,59,.08)' : 'rgba(74,124,116,.08)',
        }}
      >
        <strong style={{ fontSize: 20, color: alert ? PALETTE.terracotta : PALETTE.verdigris }}>{st.label}</strong>
        <p style={{ margin: '4px 0 0' }}>{st.detail}</p>
        <p style={{ margin: '8px 0 0', fontSize: 14 }}>Emitido em {fmt(p.issuedAt)} · válido até {fmt(p.expiresAt)}</p>
      </section>

      <h2 style={{ fontFamily: FONTS.display, fontSize: 22 }}>Regras verificadas</h2>
      <p>
        {p.verdicts.pass} aprovadas · {p.verdicts.pending} pendentes de revisão
        {p.verdicts.pending > 0 ? ' (pendente não conta como aprovado)' : ''}
      </p>

      <h2 style={{ fontFamily: FONTS.display, fontSize: 22 }}>De onde vem o veredito</h2>
      <div aria-hidden="true" style={{ display: 'flex', height: 12, margin: '8px 0', background: PALETTE.paper2 }}>
        <div style={{ width: `${pct.machine}%`, background: PALETTE.verdigris }} />
        <div style={{ width: `${pct.human}%`, background: PALETTE.concrete }} />
        <div style={{ width: `${pct.third_party}%`, background: PALETTE.terracotta }} />
      </div>
      <ul style={{ paddingLeft: 18 }}>
        <li>Máquina, reproduzível por qualquer um na mesma rede: {pct.machine}% ({p.origin.machine} regras)</li>
        <li>Revisor humano nomeado: {pct.human}% ({p.origin.human} regras)</li>
        <li>Terceiro independente (auditor, parecer): {pct.third_party}% ({p.origin.third_party} regras)</li>
      </ul>

      <h2 style={{ fontFamily: FONTS.display, fontSize: 22 }}>Padrão avaliado</h2>
      <ul style={{ paddingLeft: 18 }}>
        {p.packs.map((x) => (
          <li key={x.id}>
            <code>{x.id}</code> · hash <code style={{ wordBreak: 'break-all' }}>{x.hash}</code>
          </li>
        ))}
      </ul>

      <h2 style={{ fontFamily: FONTS.display, fontSize: 22 }}>Selo na rede</h2>
      <p>
        Rede: {p.attestation.chainTarget}
        {p.attestation.txSig ? <> · transação <code style={{ wordBreak: 'break-all' }}>{p.attestation.txSig}</code></> : null}
      </p>
      {p.attestation.explorerUrl ? (
        <p><a href={p.attestation.explorerUrl} target="_blank" rel="noreferrer">Abrir no explorador da rede</a></p>
      ) : null}

      <Rule style={{ margin: '32px 0' }} />
      <h2 style={{ fontFamily: FONTS.display, fontSize: 22 }}>Histórico</h2>
      <ol style={{ paddingLeft: 18 }}>
        {p.history.map((h, i) => (
          <li key={`${h.type}-${i}`}>
            {HISTORY_LABEL[h.type] ?? h.type} em {fmt(h.at)}
            {h.reason ? ` — ${h.reason}` : ''}
          </li>
        ))}
      </ol>

      <p style={{ marginTop: 32, fontSize: 13, color: PALETTE.concrete }}>
        Esta página mostra só o veredito. A evidência fica com o parceiro e com a patrocinadora autorizada.
        O passaporte apoia a diligência da SPSAV (Res. BCB 520, arts. 32–42), não a substitui.
      </p>
    </main>
  );
}
