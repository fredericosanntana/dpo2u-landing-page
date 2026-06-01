// AttestationDetailSheet — drawer de detalhe de uma atestação (Solana). Mostra o REPO,
// veredito, score, jurisdições e os PONTOS DE MELHORIA (gaps) com CTA de "como resolver".
// Auto-contido (overlay selado, sem dependência de Radix). Se faltarem gaps/repo (linha lida
// só da chain / outro device), busca o resumo no gateway via fetchAttestationSummary.
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FONTS, PALETTE, SmallLabel } from '@/components/sealed/atoms';
import { truncateHash, explorerUrl as solExplorerUrl } from '@/lib/solana';
import { fetchAttestationSummary } from '@/lib/app/attestation-summary';

export interface AttestationDetail {
  repo?: string;
  useCaseId: string;
  verdict?: string | null;
  score?: number;
  gaps?: string[];
  jurisdictions?: string[];
  hash: string;
  subject?: string;
  txHash?: string;
  explorerUrl?: string;
  at?: number | null;
  onchain?: boolean;
}

/** github.com/owner/repo → owner/repo (rótulo amigável; fallback "Managed compliance"). */
export function shortRepo(repo?: string): string {
  if (!repo) return 'Managed compliance';
  return repo.replace(/^https?:\/\//, '').replace(/^github\.com\//, '');
}

// gap reconhecível → ação (deep-link pro gerador de doc no /app/evidence?repo=).
function gapAction(gap: string): string | null {
  const g = gap.toLowerCase();
  if (g.includes('privacidade')) return 'Gerar Política de Privacidade';
  if (g.includes('security') || g.includes('segurança')) return 'Gerar Política de Segurança';
  return null;
}

function scoreColor(s: number): string {
  // gold-leaf (#c4a962) p/ faixa intermediária — não exposto no PALETTE selado.
  return s >= 70 ? PALETTE.verdigris : s >= 40 ? '#c4a962' : PALETTE.terracotta;
}

export function AttestationDetailSheet({ detail, onClose }: { detail: AttestationDetail; onClose: () => void }) {
  const [d, setD] = useState<AttestationDetail>(detail);

  useEffect(() => {
    setD(detail);
    if ((!detail.gaps || !detail.repo) && detail.hash) {
      let alive = true;
      void fetchAttestationSummary(detail.hash, detail.subject).then((s) => {
        if (!alive || !s) return;
        setD((cur) => ({
          ...cur,
          repo: cur.repo ?? s.repo_url,
          gaps: cur.gaps ?? s.gaps,
          score: cur.score ?? s.score,
          verdict: cur.verdict ?? s.verdict,
          jurisdictions: cur.jurisdictions ?? (s.jurisdiction ? [s.jurisdiction.toUpperCase()] : undefined),
        }));
      });
      return () => { alive = false; };
    }
  }, [detail]);

  const verifyTo = `/verify/sol/uc/${encodeURIComponent(d.useCaseId)}/hash/${encodeURIComponent(d.hash)}/subject/${encodeURIComponent(d.subject ?? '')}`;
  const repoLabel = shortRepo(d.repo);
  const repoHref = d.repo ? `https://${d.repo.replace(/^https?:\/\//, '')}` : undefined;
  const txHref = d.explorerUrl ?? (d.txHash ? solExplorerUrl(d.txHash, 'tx') : undefined);

  return (
    <div onClick={onClose} className="fixed inset-0 z-50 flex justify-end" style={{ background: 'rgba(12,13,16,.45)' }}>
      <div onClick={(e) => e.stopPropagation()} className="h-full w-full max-w-[520px] overflow-y-auto"
        style={{ background: PALETTE.paper, borderLeft: `1px solid ${PALETTE.ruleStrong}`, fontFamily: FONTS.body }}>
        <div className="flex items-start justify-between p-6" style={{ borderBottom: `1px solid ${PALETTE.rule}` }}>
          <div style={{ minWidth: 0 }}>
            <SmallLabel>Atestação</SmallLabel>
            <h2 style={{ fontFamily: FONTS.display, fontSize: 26, fontWeight: 500, letterSpacing: '-0.01em', wordBreak: 'break-all', marginTop: 4 }}>{repoLabel}</h2>
            {repoHref && <a href={repoHref} target="_blank" rel="noreferrer" style={{ fontFamily: FONTS.mono, fontSize: 12, color: PALETTE.concrete, textDecoration: 'underline', textUnderlineOffset: 3 }}>{d.repo} ↗</a>}
          </div>
          <button onClick={onClose} aria-label="Fechar" style={{ background: 'none', border: 'none', cursor: 'pointer', color: PALETTE.concrete, fontSize: 18, lineHeight: 1 }}>✕</button>
        </div>

        <div className="p-6" style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
              <span style={{ fontFamily: FONTS.display, fontSize: 34, fontWeight: 700, color: d.verdict === 'PASS' ? PALETTE.verdigris : d.verdict === 'FAIL' ? PALETTE.terracotta : PALETTE.concrete }}>{d.verdict ?? '—'}</span>
              {typeof d.score === 'number' && <span style={{ fontFamily: FONTS.mono, fontSize: 15, color: PALETTE.inkSoft }}>score {d.score}/100</span>}
            </div>
            {typeof d.score === 'number' && (
              <div style={{ height: 6, background: PALETTE.paper2, borderRadius: 3, overflow: 'hidden', marginTop: 10 }}>
                <div style={{ height: '100%', width: `${Math.max(0, Math.min(100, d.score))}%`, background: scoreColor(d.score) }} />
              </div>
            )}
          </div>

          {d.jurisdictions && d.jurisdictions.length > 0 && (
            <div>
              <SmallLabel>Jurisdições</SmallLabel>
              <div className="mt-2" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {d.jurisdictions.map((j) => (
                  <span key={j} style={{ fontFamily: FONTS.mono, fontSize: 12, border: `1px solid ${PALETTE.ruleStrong}`, borderRadius: 999, padding: '3px 10px', color: PALETTE.inkSoft }}>{j}</span>
                ))}
              </div>
            </div>
          )}

          <div>
            <SmallLabel>Pontos de melhoria{d.gaps ? ` · ${d.gaps.length}` : ''}</SmallLabel>
            {d.gaps && d.gaps.length > 0 ? (
              <ul className="mt-2" style={{ display: 'flex', flexDirection: 'column', gap: 10, listStyle: 'none', padding: 0 }}>
                {d.gaps.map((g, i) => {
                  const act = gapAction(g);
                  return (
                    <li key={i} style={{ border: `1px solid ${PALETTE.rule}`, borderRadius: 8, padding: '10px 12px' }}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <span style={{ color: PALETTE.terracotta, flex: 'none' }}>•</span>
                        <span style={{ fontSize: 14, color: PALETTE.ink, lineHeight: 1.45 }}>{g}</span>
                      </div>
                      {act && (
                        <Link to={`/app/evidence?repo=${encodeURIComponent(shortRepo(d.repo))}`} onClick={onClose}
                          style={{ display: 'inline-block', marginTop: 8, marginLeft: 16, fontFamily: FONTS.mono, fontSize: 11, color: PALETTE.terracotta, textDecoration: 'underline', textUnderlineOffset: 3 }}>{act} →</Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="mt-2 text-[13px]" style={{ color: PALETTE.concrete }}>
                {d.verdict === 'PASS' ? 'Sem pontos pendentes — conformidade adequada.' : 'Detalhes desta atestação não disponíveis (atestada em outro device ou antes do enriquecimento).'}
              </p>
            )}
          </div>

          <div style={{ borderTop: `1px solid ${PALETTE.rule}`, paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
              <SmallLabel>Evidence hash</SmallLabel>
              <span style={{ fontFamily: FONTS.mono, fontSize: 12, color: PALETTE.inkSoft, wordBreak: 'break-all' }}>{truncateHash(d.hash)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <SmallLabel>Ancorado</SmallLabel>
              <span style={{ fontFamily: FONTS.mono, fontSize: 12, color: PALETTE.concrete }}>{d.at ? new Date(d.at).toISOString().slice(0, 10) : '—'} · Solana</span>
            </div>
            <div className="flex gap-3" style={{ marginTop: 6 }}>
              {txHref && <a href={txHref} target="_blank" rel="noreferrer" className="py-2 px-4 font-mono text-[11px] uppercase tracking-[.12em]" style={{ border: `1px solid ${PALETTE.ruleStrong}`, color: PALETTE.ink, textDecoration: 'none' }}>tx ↗</a>}
              <Link to={verifyTo} onClick={onClose} className="py-2 px-4 font-mono text-[11px] uppercase tracking-[.12em]" style={{ background: PALETTE.ink, color: PALETTE.paper, textDecoration: 'none' }}>Ver prova /verify →</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
