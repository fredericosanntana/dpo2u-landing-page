/**
 * /app/evidence — audit-evidence dossier (Fase E). Solana-only.
 * Junta os selos desta wallet: histórico LOCAL (instantâneo — os selos Managed são
 * ancorados pela DPO2U, não pela pubkey do usuário) + atestações on-chain lidas das
 * PDAs do compliance-registry (Solana), dedup por hash. KPIs, breakdown por use case,
 * lista de selos com link /verify/sol, export JSON / print PDF.
 */
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FONTS, PALETTE, SmallLabel, Rule } from '@/components/sealed/atoms';
import { useWalletAuth } from '@/components/app/WalletAuthProvider';
import { DocAddonPanel } from '@/components/app/DocAddonPanel';
import { useAttestationHistory } from '@/lib/app/attestation-history';
import { useSolanaAttestations } from '@/lib/app/solana-indexer';
import { CLUSTER, PROGRAM_IDS, explorerUrl as solExplorerUrl, truncateHash } from '@/lib/solana';
import { AttestationDetailSheet, type AttestationDetail, shortRepo } from '@/components/app/AttestationDetailSheet';

interface Seal {
  useCaseId: string;
  hash: string;
  verdict?: string;
  score?: number;
  txHash?: string;
  at: number; // ms
  source: 'onchain' | 'local';
  chain: 'solana';
  subject?: string; // Solana: subject da PDA (link /verify/sol)
  explorerUrl?: string; // Solana: link direto pro explorer
  repo?: string;
  gaps?: string[];
  jurisdictions?: string[];
}

export default function AppEvidence() {
  const { pubkey, tier, workspace } = useWalletAuth();
  const history = useAttestationHistory((s) => s.refs);
  const solana = useSolanaAttestations(pubkey);
  const [detail, setDetail] = React.useState<AttestationDetail | null>(null);

  // Merge: on-chain (autoridade verdict/tx) + local (contexto rico repo/gaps/score), dedup
  // por hash. O on-chain NÃO apaga o enriquecimento local — preserva repo/gaps/score.
  const seals = useMemo<Seal[]>(() => {
    if (!pubkey) return [];
    const byHash = new Map<string, Seal>();
    const myHistory = history.filter((h) => h.pubkey === pubkey);
    for (const r of myHistory) {
      byHash.set(r.evidenceHashHex.toLowerCase(), {
        useCaseId: r.useCaseId, hash: r.evidenceHashHex, verdict: r.verdict, score: r.score,
        repo: r.repo, gaps: r.gaps, jurisdictions: r.jurisdictions,
        txHash: r.txHash, at: r.at, source: 'local', chain: 'solana', subject: r.pubkey, explorerUrl: r.explorerUrl,
      });
    }
    for (const a of solana.records) {
      const key = (a.evidenceHashHex ?? a.commitmentHex).toLowerCase();
      const local = byHash.get(key);
      byHash.set(key, {
        useCaseId: 'managed_compliance_v1', hash: a.evidenceHashHex ?? a.commitmentHex,
        verdict: a.verdict ?? local?.verdict, score: local?.score,
        repo: local?.repo, gaps: local?.gaps, jurisdictions: local?.jurisdictions,
        txHash: local?.txHash, at: a.issuedAt ?? local?.at ?? 0, source: 'onchain', chain: 'solana',
        subject: a.subject ?? local?.subject, explorerUrl: a.explorerUrl ?? local?.explorerUrl,
      });
    }
    return Array.from(byHash.values()).sort((a, b) => b.at - a.at);
  }, [history, pubkey, solana.records]);

  const byRepo = useMemo(() => {
    const m = new Map<string, { total: number; pass: number; fail: number; review: number }>();
    for (const s of seals) {
      const key = shortRepo(s.repo);
      const cur = m.get(key) ?? { total: 0, pass: 0, fail: 0, review: 0 };
      cur.total += 1;
      if (s.verdict === 'PASS') cur.pass += 1;
      else if (s.verdict === 'FAIL') cur.fail += 1;
      else if (s.verdict === 'REVIEW') cur.review += 1;
      m.set(key, cur);
    }
    return Array.from(m.entries());
  }, [seals]);

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  // verify_url Solana: resolve por (uc, hash, subject).
  const verifyUrl = (s: Seal): string =>
    `${origin}/verify/sol/uc/${s.useCaseId}/hash/${s.hash}/subject/${s.subject ?? ''}`;
  const toDetail = (s: Seal): AttestationDetail => ({
    repo: s.repo, useCaseId: s.useCaseId, verdict: s.verdict, score: s.score, gaps: s.gaps,
    jurisdictions: s.jurisdictions, hash: s.hash, subject: s.subject, txHash: s.txHash, explorerUrl: s.explorerUrl, at: s.at, onchain: s.source === 'onchain',
  });

  const exportJson = () => {
    const dossier = {
      generatedAt: new Date().toISOString(),
      workspace: workspace.label,
      tier: tier.label,
      anchor: { chain: 'solana', network: `solana:${CLUSTER}`, program: PROGRAM_IDS.complianceRegistry.toBase58() },
      total: seals.length,
      attestations: seals.map((s) => ({
        chain: s.chain,
        use_case_id: s.useCaseId,
        repo: s.repo,
        jurisdictions: s.jurisdictions,
        evidence_hash_hex: s.hash,
        verdict: s.verdict,
        score: s.score,
        gaps: s.gaps,
        tx_hash: s.txHash,
        explorer_url: s.explorerUrl,
        timestamp: new Date(s.at).toISOString(),
        verify_url: verifyUrl(s),
      })),
    };
    const blob = new Blob([JSON.stringify(dossier, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `dpo2u-evidence-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const verdictColor = (v?: string) =>
    v === 'PASS' ? PALETTE.verdigris : v === 'FAIL' ? PALETTE.terracotta : PALETTE.concrete;

  return (
    <div className="max-w-[900px]">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <SmallLabel>Audit evidence</SmallLabel>
          <h1 className="text-[30px] md:text-[38px] font-medium" style={{ fontFamily: FONTS.display, letterSpacing: '-0.02em', marginTop: 6 }}>
            Compliance dossier<span style={{ color: PALETTE.terracotta }}>.</span>
          </h1>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => solana.refetch()} className="py-2.5 px-5 font-mono text-[12px] uppercase tracking-[.14em]"
            style={{ border: `1px solid ${PALETTE.ruleStrong}`, color: PALETTE.ink, background: 'transparent', cursor: 'pointer' }}>Atualizar</button>
          <button type="button" onClick={exportJson} className="py-2.5 px-5 font-mono text-[12px] uppercase tracking-[.14em]"
            style={{ background: PALETTE.ink, color: PALETTE.paper, border: 'none', cursor: 'pointer' }}>Export JSON</button>
          <button type="button" onClick={() => window.print()} className="py-2.5 px-5 font-mono text-[12px] uppercase tracking-[.14em]"
            style={{ border: `1px solid ${PALETTE.ruleStrong}`, color: PALETTE.ink, background: 'transparent', cursor: 'pointer' }}>Print / PDF</button>
        </div>
      </div>

      <p className="mt-2 text-[14px]" style={{ color: PALETTE.inkSoft }}>
        {workspace.label} · {tier.label} · {seals.length} selo{seals.length === 1 ? '' : 's'} (Solana {CLUSTER}).
      </p>

      <Rule style={{ margin: '28px 0' }} color={PALETTE.ruleStrong} />

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4" style={{ borderTop: `.5px solid ${PALETTE.ruleStrong}`, borderBottom: `.5px solid ${PALETTE.ruleStrong}` }}>
        {[
          [String(seals.length), 'selos'],
          [String(byRepo.length), 'repositórios'],
          [String(seals.filter((s) => s.verdict === 'PASS').length), 'PASS'],
          [String(seals.filter((s) => s.verdict && s.verdict !== 'PASS').length), 'fail / review'],
        ].map(([n, l], i) => (
          <div key={l} style={{ padding: '18px 16px', borderRight: i < 3 ? `.5px solid ${PALETTE.rule}` : 'none' }}>
            <div style={{ fontFamily: FONTS.display, fontWeight: 500, fontSize: 28 }}>{n}</div>
            <SmallLabel style={{ marginTop: 6 }}>{l}</SmallLabel>
          </div>
        ))}
      </div>

      {seals.length === 0 ? (
        <p className="mt-8 text-[14px]" style={{ color: PALETTE.inkSoft }}>
          Nenhum selo ainda. Ative um pipeline — a DPO2U roda a compliance e ancora o primeiro selo on-chain.
          {' '}<Link to="/app/activate" style={{ color: PALETTE.terracotta }}>Activate →</Link>
        </p>
      ) : (
        <>
          {/* Lista de selos */}
          <div className="mt-8">
            <SmallLabel style={{ marginBottom: 12 }}>Selos ancorados</SmallLabel>
            <div style={{ border: `.5px solid ${PALETTE.rule}`, borderRadius: 4, overflow: 'hidden' }}>
              {seals.map((s) => (
                <div key={`${s.useCaseId}:${s.hash}`} onClick={() => setDetail(toDetail(s))} className="flex items-center justify-between gap-3 flex-wrap"
                  style={{ padding: '12px 14px', borderBottom: `.5px solid ${PALETTE.rule}`, cursor: 'pointer' }}>
                  <div style={{ minWidth: 0 }}>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span style={{ fontFamily: FONTS.mono, fontSize: 11, fontWeight: 600, color: verdictColor(s.verdict) }}>
                        {s.verdict ?? '—'}{typeof s.score === 'number' ? ` · ${s.score}/100` : ''}
                      </span>
                      <span style={{ fontSize: 13, fontWeight: 500 }}>{shortRepo(s.repo)}</span>
                      {s.gaps && s.gaps.length > 0 && (
                        <span style={{ fontFamily: FONTS.mono, fontSize: 10, color: PALETTE.terracotta, border: `1px solid ${PALETTE.terracotta}`, borderRadius: 999, padding: '1px 7px' }}>{s.gaps.length} a melhorar</span>
                      )}
                    </div>
                    <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: PALETTE.concrete, wordBreak: 'break-all' }}>{truncateHash(s.hash)}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    {(s.explorerUrl || s.txHash) && (
                      <a href={s.explorerUrl ?? solExplorerUrl(s.txHash!, 'tx')} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}
                        style={{ fontFamily: FONTS.mono, fontSize: 11, color: PALETTE.concrete, textDecoration: 'underline', textUnderlineOffset: 3 }}>tx ↗</a>
                    )}
                    <button type="button" onClick={(e) => { e.stopPropagation(); setDetail(toDetail(s)); }}
                      className="py-1.5 px-3 font-mono text-[11px] uppercase tracking-[.12em]"
                      style={{ background: PALETTE.ink, color: PALETTE.paper, border: 'none', cursor: 'pointer' }}>Detalhe →</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* By repository */}
          <div className="mt-8">
            <SmallLabel style={{ marginBottom: 12 }}>By repository</SmallLabel>
            <div style={{ border: `.5px solid ${PALETTE.rule}`, borderRadius: 4, overflow: 'hidden' }}>
              <table className="w-full" style={{ borderCollapse: 'collapse', fontFamily: FONTS.body }}>
                <thead>
                  <tr style={{ background: PALETTE.paper2, borderBottom: `.5px solid ${PALETTE.ruleStrong}` }}>
                    {['Repository', 'Total', 'PASS', 'FAIL', 'REVIEW'].map((h) => (
                      <th key={h} className="text-left" style={{ padding: '8px 14px', fontFamily: FONTS.mono, fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: PALETTE.concrete }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {byRepo.map(([repo, s]) => (
                    <tr key={repo} style={{ borderBottom: `.5px solid ${PALETTE.rule}` }}>
                      <td style={{ padding: '8px 14px', fontFamily: FONTS.mono, fontSize: 13 }}>{repo}</td>
                      <td style={{ padding: '8px 14px', fontSize: 13 }}>{s.total}</td>
                      <td style={{ padding: '8px 14px', fontSize: 13, color: PALETTE.verdigris }}>{s.pass}</td>
                      <td style={{ padding: '8px 14px', fontSize: 13, color: PALETTE.terracotta }}>{s.fail}</td>
                      <td style={{ padding: '8px 14px', fontSize: 13, color: PALETTE.concrete }}>{s.review}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* On-chain anchor — por chain */}
          <div className="mt-6 p-4" style={{ background: PALETTE.ink, color: PALETTE.paper, borderRadius: 4 }}>
            <SmallLabel style={{ color: 'rgba(241,236,227,.7)' }}>On-chain anchor · Solana {CLUSTER}</SmallLabel>
            <div style={{ fontFamily: FONTS.mono, fontSize: 12, marginTop: 6, wordBreak: 'break-all' }}>{PROGRAM_IDS.complianceRegistry.toBase58()}</div>
            <a href={solExplorerUrl(PROGRAM_IDS.complianceRegistry.toBase58())} target="_blank" rel="noreferrer"
              style={{ fontFamily: FONTS.mono, fontSize: 11, color: PALETTE.terracotta, textDecoration: 'underline', textUnderlineOffset: 3 }}>
              Ver no Solana Explorer →
            </a>
          </div>

          <p className="mt-4 text-[12px]" style={{ color: PALETTE.concrete }}>
            O dossiê expõe repositório, veredito, score, jurisdições e os pontos de melhoria — selo verificável publicamente em <Link to="/verify" style={{ color: PALETTE.terracotta }}>/verify</Link>. Os dados-fonte do repositório permanecem fora da chain.
          </p>
        </>
      )}

      <DocAddonPanel />

      {detail && <AttestationDetailSheet detail={detail} onClose={() => setDetail(null)} />}
    </div>
  );
}
