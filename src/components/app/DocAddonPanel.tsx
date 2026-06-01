/**
 * DocAddonPanel — add-on de documentos de compliance (pago via gateway USDC SPL).
 * Auto-contido: lê ?repo= do deep-link (issue CTA), coleta o tipo de doc + jurisdição,
 * dispara o gateway /api/v1/managed/docs (que chama o gerador real no mcp-server). O
 * pagamento na Solana é server-side. DPIA pede campos reais (não fabricamos). Embutível
 * em qualquer página do /app (usado no /app/evidence).
 */
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FONTS, PALETTE, SmallLabel } from '@/components/sealed/atoms';
import { useWalletAuth } from '@/components/app/WalletAuthProvider';
import { managedGenerateDoc, type DocType } from '@/lib/app/managed-client';

const DOC_OPTIONS: { id: DocType; label: string }[] = [
  { id: 'privacy_policy', label: 'Política de Privacidade' },
  { id: 'security_policy', label: 'Política de Segurança' },
  { id: 'dpia', label: 'DPIA' },
];

interface DocResult { title?: string; markdown?: string; cid?: string; url?: string; pr_number?: number | null; pr_url?: string | null }

export function DocAddonPanel() {
  const { pubkey } = useWalletAuth();
  const [params] = useSearchParams();
  const [repo, setRepo] = useState(params.get('repo') ?? '');
  // Pré-preenche o repo quando chega via deep-link (?repo=) de um CTA de "gap".
  const repoParam = params.get('repo');
  useEffect(() => { if (repoParam) setRepo(repoParam); }, [repoParam]);
  const [docType, setDocType] = useState<DocType>('privacy_policy');
  const [jurisdiction, setJurisdiction] = useState('lgpd');
  const [dpia, setDpia] = useState({ processingActivity: '', dataTypes: '', dataSubjects: '', purpose: '' });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [result, setResult] = useState<DocResult | null>(null);

  const buildParams = (): Record<string, unknown> =>
    docType === 'dpia'
      ? {
          processingActivity: dpia.processingActivity.trim(),
          dataTypes: dpia.dataTypes.split(',').map((s) => s.trim()).filter(Boolean),
          dataSubjects: dpia.dataSubjects.split(',').map((s) => s.trim()).filter(Boolean),
          purpose: dpia.purpose.trim(),
        }
      : {};

  const run = async (dt: DocType) => {
    if (!pubkey) { setMsg('Conecte a wallet.'); return; }
    if (!repo.trim()) { setMsg('Informe o repositório (github.com/owner/repo).'); return; }
    setBusy(true); setMsg(null);
    try {
      const r = await managedGenerateDoc(
        { pubkey, repo_url: repo.trim(), doc_type: dt, jurisdiction, chain: 'solana', params: buildParams() },
        null,
      );
      if (r.kind === 'payment_required') { setMsg('Pagamento via gateway Solana (USDC SPL) em calibração no devnet — tente novamente em instantes.'); return; }
      if (r.kind === 'error') { setMsg(`Falha: ${r.message}`); return; }
      setResult(r.data as DocResult);
    } finally { setBusy(false); }
  };

  const dpiaIncomplete = docType === 'dpia' && (!dpia.processingActivity || !dpia.purpose || !dpia.dataTypes || !dpia.dataSubjects);
  const inputStyle: React.CSSProperties = { border: `1px solid ${PALETTE.ruleStrong}`, borderRadius: 4, padding: '8px 12px', fontSize: 13 };

  return (
    <div className="mt-10">
      <div style={{ borderTop: `1px solid ${PALETTE.ruleStrong}`, margin: '8px 0 20px' }} />
      <SmallLabel>Documentos de compliance · add-on</SmallLabel>
      <h2 className="text-[22px] md:text-[26px] font-medium" style={{ fontFamily: FONTS.display, letterSpacing: '-0.01em', marginTop: 6 }}>
        Gere o documento, pago por peça<span style={{ color: PALETTE.terracotta }}>.</span>
      </h2>
      <p className="mt-2 text-[14px]" style={{ color: PALETTE.inkSoft }}>
        Pagamento via gateway (USDC SPL) por documento. Se o repositório estiver conectado (Porta A) a esta wallet, o documento é anexado ao issue de compliance do repo.
        {' '}(Solana devnet: gerado sem cobrança por ora.)
      </p>

      <div className="mt-5 grid gap-3" style={{ maxWidth: 560 }}>
        <label className="text-[12px]" style={{ color: PALETTE.concrete }}>
          Repositório
          <input value={repo} onChange={(e) => setRepo(e.target.value)} placeholder="github.com/owner/repo"
            className="mt-1 w-full" style={{ ...inputStyle, fontFamily: FONTS.mono }} />
        </label>

        <div className="flex gap-2 flex-wrap items-center">
          {DOC_OPTIONS.map((o) => (
            <button key={o.id} type="button" onClick={() => { setDocType(o.id); setResult(null); }}
              className="px-3 py-2 text-[12px]"
              style={{
                border: `1px solid ${docType === o.id ? PALETTE.ink : PALETTE.ruleStrong}`,
                background: docType === o.id ? PALETTE.ink : 'transparent',
                color: docType === o.id ? PALETTE.paper : PALETTE.ink,
                borderRadius: 4, cursor: 'pointer', fontFamily: FONTS.mono,
              }}>
              {o.label}
            </button>
          ))}
          <label className="text-[12px] flex items-center gap-2" style={{ color: PALETTE.concrete }}>
            jurisdição
            <input value={jurisdiction} onChange={(e) => setJurisdiction(e.target.value.toLowerCase())}
              style={{ ...inputStyle, fontFamily: FONTS.mono, width: 90, padding: '4px 8px', fontSize: 12 }} />
          </label>
        </div>

        {docType === 'dpia' && (
          <div className="grid gap-2 p-3" style={{ border: `1px dashed ${PALETTE.ruleStrong}`, borderRadius: 4 }}>
            <p className="text-[11px]" style={{ color: PALETTE.concrete }}>O DPIA exige detalhes reais do tratamento (não inventamos).</p>
            <input value={dpia.processingActivity} onChange={(e) => setDpia({ ...dpia, processingActivity: e.target.value })} placeholder="Atividade de tratamento" style={inputStyle} />
            <input value={dpia.purpose} onChange={(e) => setDpia({ ...dpia, purpose: e.target.value })} placeholder="Finalidade" style={inputStyle} />
            <input value={dpia.dataTypes} onChange={(e) => setDpia({ ...dpia, dataTypes: e.target.value })} placeholder="Tipos de dado (vírgula)" style={inputStyle} />
            <input value={dpia.dataSubjects} onChange={(e) => setDpia({ ...dpia, dataSubjects: e.target.value })} placeholder="Titulares (vírgula)" style={inputStyle} />
          </div>
        )}

        <div>
          <button type="button" disabled={!pubkey || busy || dpiaIncomplete} onClick={() => void run(docType)}
            className="py-2.5 px-5 font-mono text-[12px] uppercase tracking-[.14em]"
            style={{ background: !pubkey || busy || dpiaIncomplete ? PALETTE.ruleStrong : PALETTE.ink, color: PALETTE.paper, border: 'none', cursor: !pubkey || busy || dpiaIncomplete ? 'not-allowed' : 'pointer' }}>
            {busy ? 'Gerando…' : 'Gerar documento →'}
          </button>
        </div>
        {msg && <p className="text-[13px]" style={{ fontFamily: FONTS.mono, color: PALETTE.terracotta }}>{msg}</p>}
      </div>

      {result && (
        <div className="mt-5 p-4" style={{ border: `1px solid ${PALETTE.verdigris}`, borderRadius: 6, background: 'rgba(74,124,116,.06)', maxWidth: 760 }}>
          <SmallLabel>{result.title || 'Documento gerado'}</SmallLabel>
          <div className="mt-2 flex gap-4 flex-wrap text-[12px]" style={{ fontFamily: FONTS.mono }}>
            {result.pr_url
              ? <a href={result.pr_url} target="_blank" rel="noreferrer" style={{ color: PALETTE.verdigris, textDecoration: 'underline' }}>✓ PR aberto #{result.pr_number} ↗</a>
              : <span style={{ color: PALETTE.concrete }}>conecte o repositório (Porta A) para abrir um PR automático</span>}
            {result.cid && <span style={{ color: PALETTE.concrete }}>IPFS: {result.cid.slice(0, 16)}…</span>}
            {result.url && <a href={result.url} target="_blank" rel="noreferrer" style={{ color: PALETTE.terracotta, textDecoration: 'underline' }}>abrir ↗</a>}
          </div>
          <pre className="mt-3 p-3 text-[12px]" style={{ background: PALETTE.paper2, borderRadius: 4, maxHeight: 320, overflow: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {result.markdown}
          </pre>
        </div>
      )}
    </div>
  );
}
