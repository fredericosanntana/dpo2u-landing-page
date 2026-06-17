/**
 * /app/evidence — audit-evidence dossier (Phase E). Stellar-only.
 * Gathers this wallet's seals: LOCAL history (instant — Managed seals are anchored by
 * DPO2U, not by the user's pubkey) + on-chain attestations read from the Soroban
 * contract events (filtered by submitted_by), deduped by hash. KPIs, breakdown by use
 * case, list of seals with /verify link, export JSON / print PDF.
 */
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FONTS, PALETTE, SmallLabel, Rule } from '@/components/sealed/atoms';
import { KpiGrid, btnClass } from '@/components/app/ui';
import { useWalletAuth } from '@/components/app/WalletAuthProvider';
import { DocAddonPanel } from '@/components/app/DocAddonPanel';
import { useAttestationHistory } from '@/lib/app/attestation-history';
import { useStellarAttestations } from '@/lib/app/stellar-indexer';
import { stellarExpertUrl, truncateHash, DEFAULT_CONTRACT } from '@/lib/pilot/stellar';
import { AttestationDetailSheet, type AttestationDetail, shortRepo } from '@/components/app/AttestationDetailSheet';

interface Seal {
  useCaseId: string;
  hash: string;
  verdict?: string;
  score?: number;
  txHash?: string;
  at: number; // ms
  source: 'onchain' | 'local';
  chain: 'stellar';
  subject?: string; // Stellar: submitter account (submitted_by)
  explorerUrl?: string; // direct link to Stellar Expert
  repo?: string;
  gaps?: string[];
  jurisdictions?: string[];
}

export default function AppEvidence() {
  const { pubkey, tier, workspace } = useWalletAuth();
  const history = useAttestationHistory((s) => s.refs);
  const stellar = useStellarAttestations(pubkey);
  const [detail, setDetail] = React.useState<AttestationDetail | null>(null);

  // Merge: on-chain (verdict/tx authority) + local (rich context repo/gaps/score), dedup
  // by hash. On-chain does NOT erase the local enrichment — it preserves repo/gaps/score.
  const seals = useMemo<Seal[]>(() => {
    if (!pubkey) return [];
    const byHash = new Map<string, Seal>();
    const myHistory = history.filter((h) => h.pubkey === pubkey);
    for (const r of myHistory) {
      byHash.set(r.evidenceHashHex.toLowerCase(), {
        useCaseId: r.useCaseId, hash: r.evidenceHashHex, verdict: r.verdict, score: r.score,
        repo: r.repo, gaps: r.gaps, jurisdictions: r.jurisdictions,
        txHash: r.txHash, at: r.at, source: 'local', chain: 'stellar', subject: r.pubkey, explorerUrl: r.explorerUrl,
      });
    }
    for (const a of stellar.records) {
      const key = a.evidenceHashHex.toLowerCase();
      const local = byHash.get(key);
      byHash.set(key, {
        useCaseId: a.useCaseId, hash: a.evidenceHashHex,
        verdict: a.verdict ?? local?.verdict, score: local?.score,
        repo: local?.repo, gaps: local?.gaps, jurisdictions: local?.jurisdictions,
        txHash: a.txHash ?? local?.txHash, at: a.issuedAt ?? local?.at ?? 0, source: 'onchain', chain: 'stellar',
        subject: a.submittedBy ?? local?.subject, explorerUrl: a.explorerUrl ?? local?.explorerUrl,
      });
    }
    return Array.from(byHash.values()).sort((a, b) => b.at - a.at);
  }, [history, pubkey, stellar.records]);

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
  // verify_url Stellar (trustless): resolves by (uc, hash) via verify_attestation on the contract.
  const verifyUrl = (s: Seal): string =>
    `${origin}/verify/uc/${s.useCaseId}/hash/${s.hash}`;
  const toDetail = (s: Seal): AttestationDetail => ({
    repo: s.repo, useCaseId: s.useCaseId, verdict: s.verdict, score: s.score, gaps: s.gaps,
    jurisdictions: s.jurisdictions, hash: s.hash, subject: s.subject, txHash: s.txHash, explorerUrl: s.explorerUrl, at: s.at, onchain: s.source === 'onchain',
  });

  const exportJson = () => {
    const dossier = {
      generatedAt: new Date().toISOString(),
      workspace: workspace.label,
      tier: tier.label,
      anchor: { chain: 'stellar', network: `stellar:${DEFAULT_CONTRACT.network}`, contract: DEFAULT_CONTRACT.id },
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
          <button type="button" onClick={() => stellar.refetch()} className={btnClass('ghost')}>Refresh</button>
          <button type="button" onClick={exportJson} className={btnClass('ink')}>Export JSON</button>
          <button type="button" onClick={() => window.print()} className={btnClass('ghost')}>Print / PDF</button>
        </div>
      </div>

      <p className="mt-2 text-[14px]" style={{ color: PALETTE.inkSoft }}>
        {workspace.label} · {tier.label} · {seals.length} seal{seals.length === 1 ? '' : 's'} (Stellar {DEFAULT_CONTRACT.network}).
      </p>

      <Rule style={{ margin: '28px 0' }} color={PALETTE.ruleStrong} />

      {/* KPIs */}
      <KpiGrid items={[
        { value: String(seals.length), label: 'seals' },
        { value: String(byRepo.length), label: 'repositories' },
        { value: String(seals.filter((s) => s.verdict === 'PASS').length), label: 'PASS' },
        { value: String(seals.filter((s) => s.verdict && s.verdict !== 'PASS').length), label: 'fail / review' },
      ]} />

      {seals.length === 0 ? (
        <p className="mt-8 text-[14px]" style={{ color: PALETTE.inkSoft }}>
          No seals yet. Activate a pipeline — DPO2U runs the compliance checks and anchors the first seal on-chain.
          {' '}<Link to="/app/activate" style={{ color: PALETTE.terracotta }}>Activate →</Link>
        </p>
      ) : (
        <>
          {/* Seal list */}
          <div className="mt-8">
            <SmallLabel style={{ marginBottom: 12 }}>Anchored seals</SmallLabel>
            <div style={{ border: `.5px solid ${PALETTE.rule}`, borderRadius: 4, overflow: 'hidden' }}>
              {seals.map((s) => (
                <div key={`${s.useCaseId}:${s.hash}`} className="appui-row flex items-center justify-between gap-3 flex-wrap"
                  tabIndex={0} role="button" aria-label={`Seal ${shortRepo(s.repo)} — open details`}
                  onClick={() => setDetail(toDetail(s))}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setDetail(toDetail(s)); } }}
                  style={{ padding: '12px 14px', borderBottom: `.5px solid ${PALETTE.rule}` }}>
                  <div style={{ minWidth: 0 }}>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span style={{ fontFamily: FONTS.mono, fontSize: 11, fontWeight: 600, color: verdictColor(s.verdict) }}>
                        {s.verdict ?? '—'}{typeof s.score === 'number' ? ` · ${s.score}/100` : ''}
                      </span>
                      <span style={{ fontSize: 13, fontWeight: 500 }}>{shortRepo(s.repo)}</span>
                      {s.gaps && s.gaps.length > 0 && (
                        <span style={{ fontFamily: FONTS.mono, fontSize: 10, color: PALETTE.terracotta, border: `1px solid ${PALETTE.terracotta}`, borderRadius: 999, padding: '1px 7px' }}>{s.gaps.length} to improve</span>
                      )}
                    </div>
                    <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: PALETTE.concrete, wordBreak: 'break-all' }}>{truncateHash(s.hash)}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    {(s.explorerUrl || s.txHash) && (
                      <a href={s.explorerUrl ?? stellarExpertUrl('tx', s.txHash!)} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}
                        style={{ fontFamily: FONTS.mono, fontSize: 11, color: PALETTE.concrete, textDecoration: 'underline', textUnderlineOffset: 3 }}>tx ↗</a>
                    )}
                    <span aria-hidden className={btnClass('ink', 'sm')}>Detail →</span>
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

          {/* On-chain anchor — per chain */}
          <div className="mt-6 p-4" style={{ background: PALETTE.ink, color: PALETTE.paper, borderRadius: 4 }}>
            <SmallLabel style={{ color: 'rgba(241,236,227,.7)' }}>On-chain anchor · Stellar {DEFAULT_CONTRACT.network}</SmallLabel>
            <div style={{ fontFamily: FONTS.mono, fontSize: 12, marginTop: 6, wordBreak: 'break-all' }}>{DEFAULT_CONTRACT.id}</div>
            <a href={stellarExpertUrl('contract', DEFAULT_CONTRACT.id)} target="_blank" rel="noreferrer"
              style={{ fontFamily: FONTS.mono, fontSize: 11, color: PALETTE.terracotta, textDecoration: 'underline', textUnderlineOffset: 3 }}>
              View on Stellar Expert →
            </a>
          </div>

          <p className="mt-4 text-[12px]" style={{ color: PALETTE.concrete }}>
            The dossier exposes repository, verdict, score, jurisdictions and improvement points — each seal is publicly verifiable at <Link to="/verify" style={{ color: PALETTE.terracotta }}>/verify</Link>. The repository's source data stays off-chain.
          </p>
        </>
      )}

      <DocAddonPanel />

      {detail && <AttestationDetailSheet detail={detail} onClose={() => setDetail(null)} />}
    </div>
  );
}
