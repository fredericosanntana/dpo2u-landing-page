// /supervisor/:grant — acesso do supervisor por link mágico (E7). O token vem no fragmento (#t=…),
// que o navegador não manda a servidor nenhum; a página o envia só no cabeçalho x-grant-token.
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { GatewayError, supervisorApi, type LogEntry } from '@/lib/fi/gateway';
import { DPO2ULockup, FONTS, PALETTE } from '@/components/sealed/atoms';

const card: React.CSSProperties = { background: PALETTE.paper2, border: `.5px solid ${PALETTE.ruleStrong}`, borderRadius: 4, padding: 20 };
const btn: React.CSSProperties = { background: PALETTE.ink, color: '#fff', border: 0, padding: '10px 16px', borderRadius: 4, cursor: 'pointer', fontFamily: FONTS.body };
const DENIED: Record<string, string> = { not_approved: 'Este acesso ainda não foi aprovado.', revoked: 'Este acesso foi revogado pela instituição.', expired: 'Este acesso venceu.', bad_token: 'Link inválido.', not_found: 'Acesso inexistente.' };

export default function SupervisorGrantPage() {
  const { grant = '' } = useParams();
  const [token] = useState(() => new URLSearchParams(window.location.hash.slice(1)).get('t') ?? '');
  const [view, setView] = useState<{ institution?: string; scope: string[]; purpose: string; legal_basis: string; purpose_hash: string; expires_at: string; log: LogEntry[]; log_verified: boolean } | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [hash, setHash] = useState<string | null>(null);

  useEffect(() => {
    supervisorApi.view(grant, token).then(setView).catch((e) => setErr(e instanceof GatewayError ? DENIED[e.code] ?? e.message : 'Algo deu errado.'));
  }, [grant, token]);

  async function download() {
    try {
      const r = await supervisorApi.pack(grant, token);
      setHash(r.pack_hash);
      const blob = new Blob([JSON.stringify(r, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `dpo2u-evidence-${grant}.json`;
      a.click();
      URL.revokeObjectURL(a.href);
    } catch (e) {
      setErr(e instanceof GatewayError ? DENIED[e.code] ?? e.message : 'Algo deu errado.');
    }
  }

  return (
    <main style={{ background: PALETTE.paper, minHeight: '100vh', fontFamily: FONTS.body, color: PALETTE.ink }}>
      <div className="mx-auto px-4 py-8 grid gap-6" style={{ maxWidth: 820 }}>
        <div className="flex items-center justify-between"><DPO2ULockup size={24} /><span style={{ fontSize: 13, color: PALETTE.concrete }}>Acesso de supervisão</span></div>
        {err && <p role="alert" data-testid="sv-error" style={{ ...card, color: PALETTE.terracotta }}>{err}</p>}
        {view && !err && (
          <>
            <section style={card} className="grid gap-2">
              <h1 style={{ fontFamily: FONTS.display, fontSize: 28, margin: 0 }}>{view.institution}</h1>
              <div>Escopo: <strong data-testid="sv-scope">{view.scope.join(', ')}</strong></div>
              <div>Finalidade: {view.purpose}</div>
              <div>Base legal: {view.legal_basis}</div>
              <div style={{ fontSize: 13, color: PALETTE.concrete }}>Válido até {new Date(view.expires_at).toLocaleString()} · purpose_hash <code>{view.purpose_hash.slice(0, 16)}…</code></div>
              <div><button type="button" style={btn} onClick={download}>Baixar o pacote de evidências</button></div>
              {hash && <div data-testid="sv-pack-hash" style={{ fontSize: 12 }}>sha256 do pacote: <code>{hash}</code></div>}
            </section>
            <section style={card}>
              <h2 style={{ fontFamily: FONTS.display, fontSize: 20, margin: 0 }}>Registro de acessos</h2>
              <p style={{ fontSize: 13, color: view.log_verified ? PALETTE.verdigris : PALETTE.terracotta }}>{view.log_verified ? 'Cadeia de hashes íntegra.' : 'Cadeia de hashes quebrada.'}</p>
              <ol style={{ fontSize: 12, paddingLeft: 18 }}>{view.log.map((e) => <li key={e.seq}>{new Date(e.at).toLocaleString()} · {e.action} · {e.actor} · <code>{e.hash.slice(0, 12)}</code></li>)}</ol>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
