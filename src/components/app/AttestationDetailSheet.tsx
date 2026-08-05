// AttestationDetailSheet — drawer de detalhe de uma atestação (Stellar). Mostra o REPO,
// veredito, score, jurisdições e os PONTOS DE MELHORIA (gaps) com CTA de "como resolver".
// Auto-contido (overlay selado, sem dependência de Radix). Se faltarem gaps/repo (linha lida
// só da chain / outro device), busca o resumo no gateway via fetchAttestationSummary.
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FONTS, PALETTE, SmallLabel } from '@/components/sealed/atoms';
import { truncateHash, stellarExpertUrl } from '@/lib/pilot/stellar';
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

// Recognizable gap → action (deep-link to the doc generator at /app/evidence?repo=).
// Matches both the English gap keys returned by the gateway and any legacy PT text.
function gapAction(gap: string): string | null {
  const g = gap.toLowerCase();
  if (g.includes('privacy') || g.includes('privacidade')) return 'Generate Privacy Policy';
  if (g.includes('security') || g.includes('segurança')) return 'Generate Security Policy';
  return null;
}

function scoreColor(s: number): string {
  // gold-leaf (#c4a962) p/ faixa intermediária — não exposto no PALETTE selado.
  return s >= 70 ? PALETTE.verdigris : s >= 40 ? '#c4a962' : PALETTE.terracotta;
}

export function AttestationDetailSheet({ detail, onClose }: { detail: AttestationDetail; onClose: () => void }) {
  const [d, setD] = useState<AttestationDetail>(detail);
  const closeRef = React.useRef<HTMLButtonElement>(null);

  // Dialog a11y: focus the close button on open, restore on unmount, Esc to close.
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); prev?.focus?.(); };
  }, [onClose]);

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

  const verifyTo = `/verify/uc/${encodeURIComponent(d.useCaseId)}/hash/${encodeURIComponent(d.hash)}`;
  const repoLabel = shortRepo(d.repo);
  const repoHref = d.repo ? `https://${d.repo.replace(/^https?:\/\//, '')}` : undefined;
  const txHref = d.explorerUrl ?? (d.txHash ? stellarExpertUrl('tx', d.txHash) : undefined);

  return (
    <div onClick={onClose} className="fixed inset-0 z-50 flex justify-end" style={{ background: 'rgba(12,13,16,.45)' }}>
      <div role="dialog" aria-modal="true" aria-label={`Attestation ${repoLabel}`} onClick={(e) => e.stopPropagation()} className="h-full w-full max-w-[520px] overflow-y-auto"
        style={{ background: PALETTE.paper, borderLeft: `1px solid ${PALETTE.ruleStrong}`, fontFamily: FONTS.body }}>
        <div className="flex items-start justify-between p-6" style={{ borderBottom: `1px solid ${PALETTE.rule}` }}>
          <div style={{ minWidth: 0 }}>
            <SmallLabel>Attestation</SmallLabel>
            <h2 style={{ fontFamily: FONTS.display, fontSize: 26, fontWeight: 500, letterSpacing: '-0.01em', wordBreak: 'break-all', marginTop: 4 }}>{repoLabel}</h2>
            {repoHref && <a href={repoHref} target="_blank" rel="noreferrer" style={{ fontFamily: FONTS.mono, fontSize: 12, color: PALETTE.concrete, textDecoration: 'underline', textUnderlineOffset: 3 }}>{d.repo} ↗</a>}
          </div>
          <button ref={closeRef} onClick={onClose} aria-label="Close" style={{ background: 'none', border: 'none', cursor: 'pointer', color: PALETTE.concrete, fontSize: 18, lineHeight: 1 }}>✕</button>
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
              <SmallLabel>Jurisdictions</SmallLabel>
              <div className="mt-2" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {d.jurisdictions.map((j) => (
                  <span key={j} style={{ fontFamily: FONTS.mono, fontSize: 12, border: `1px solid ${PALETTE.ruleStrong}`, borderRadius: 999, padding: '3px 10px', color: PALETTE.inkSoft }}>{j}</span>
                ))}
              </div>
            </div>
          )}

          <div>
            <SmallLabel>Improvement points{d.gaps ? ` · ${d.gaps.length}` : ''}</SmallLabel>
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
                {d.verdict === 'PASS' ? 'No pending points — compliance is adequate.' : 'Details for this attestation aren’t available (attested on another device or before enrichment).'}
              </p>
            )}
          </div>

          <div style={{ borderTop: `1px solid ${PALETTE.rule}`, paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
              <SmallLabel>Evidence hash</SmallLabel>
              <span style={{ fontFamily: FONTS.mono, fontSize: 12, color: PALETTE.inkSoft, wordBreak: 'break-all' }}>{truncateHash(d.hash)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <SmallLabel>Anchored</SmallLabel>
              <span style={{ fontFamily: FONTS.mono, fontSize: 12, color: PALETTE.concrete }}>{d.at ? new Date(d.at).toISOString().slice(0, 10) : '—'} · Stellar</span>
            </div>
            <div className="flex gap-3" style={{ marginTop: 6 }}>
              {txHref && <a href={txHref} target="_blank" rel="noreferrer" className="py-2 px-4 font-mono text-[11px] uppercase tracking-[.12em]" style={{ border: `1px solid ${PALETTE.ruleStrong}`, color: PALETTE.ink, textDecoration: 'none' }}>tx ↗</a>}
              <Link to={verifyTo} onClick={onClose} className="py-2 px-4 font-mono text-[11px] uppercase tracking-[.12em]" style={{ background: PALETTE.ink, color: PALETTE.paper, textDecoration: 'none' }}>View proof /verify →</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
