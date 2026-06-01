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
}

export default function AppEvidence() {
  const { pubkey, tier, workspace } = useWalletAuth();
  const history = useAttestationHistory((s) => s.refs);
  const solana = useSolanaAttestations(pubkey);

  // Merge: on-chain (PDAs, rico) + local (instantâneo), dedup por hash (on-chain ganha).
  const seals = useMemo<Seal[]>(() => {
    if (!pubkey) return [];
    const byHash = new Map<string, Seal>();
    const myHistory = history.filter((h) => h.pubkey === pubkey);
    for (const r of myHistory) {
      byHash.set(r.evidenceHashHex.toLowerCase(), {
        useCaseId: r.useCaseId, hash: r.evidenceHashHex, verdict: r.verdict, score: r.score,
        txHash: r.txHash, at: r.at, source: 'local', chain: 'solana', subject: r.pubkey, explorerUrl: r.explorerUrl,
      });
    }
    for (const a of solana.records) {
      const key = (a.evidenceHashHex ?? a.commitmentHex).toLowerCase();
      byHash.set(key, {
        useCaseId: 'managed_compliance_v1', hash: a.evidenceHashHex ?? a.commitmentHex,
        verdict: a.verdict ?? undefined, at: a.issuedAt ?? 0, source: 'onchain', chain: 'solana',
        subject: a.subject, explorerUrl: a.explorerUrl,
      });
    }
    return Array.from(byHash.values()).sort((a, b) => b.at - a.at);
  }, [history, pubkey, solana.records]);

  const byJuris = useMemo(() => {
    const m = new Map<string, { total: number; pass: number; fail: number; review: number }>();
    for (const s of seals) {
      const cur = m.get(s.useCaseId) ?? { total: 0, pass: 0, fail: 0, review: 0 };
      cur.total += 1;
      if (s.verdict === 'PASS') cur.pass += 1;
      else if (s.verdict === 'FAIL') cur.fail += 1;
      else if (s.verdict === 'REVIEW') cur.review += 1;
      m.set(s.useCaseId, cur);
    }
    return Array.from(m.entries());
  }, [seals]);

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  // verify_url Solana: resolve por (uc, hash, subject).
  const verifyUrl = (s: Seal): string =>
    `${origin}/verify/sol/uc/${s.useCaseId}/hash/${s.hash}/subject/${s.subject ?? ''}`;

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
        evidence_hash_hex: s.hash,
        verdict: s.verdict,
        score: s.score,
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
          [String(byJuris.length), 'use cases'],
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
                <div key={`${s.useCaseId}:${s.hash}`} className="flex items-center justify-between gap-3 flex-wrap"
                  style={{ padding: '12px 14px', borderBottom: `.5px solid ${PALETTE.rule}` }}>
                  <div style={{ minWidth: 0 }}>
                    <div className="flex items-center gap-2">
                      <span style={{ fontFamily: FONTS.mono, fontSize: 11, fontWeight: 600, color: verdictColor(s.verdict) }}>
                        {s.verdict ?? '—'}{typeof s.score === 'number' ? ` · ${s.score}/100` : ''}
                      </span>
                      <span style={{ fontFamily: FONTS.mono, fontSize: 12 }}>{s.useCaseId}</span>
                    </div>
                    <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: PALETTE.concrete, wordBreak: 'break-all' }}>{truncateHash(s.hash)}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    {(s.explorerUrl || s.txHash) && (
                      <a href={s.explorerUrl ?? solExplorerUrl(s.txHash!, 'tx')} target="_blank" rel="noreferrer"
                        style={{ fontFamily: FONTS.mono, fontSize: 11, color: PALETTE.concrete, textDecoration: 'underline', textUnderlineOffset: 3 }}>tx ↗</a>
                    )}
                    <Link to={`/verify/sol/uc/${s.useCaseId}/hash/${s.hash}/subject/${s.subject ?? ''}`}
                      className="py-1.5 px-3 font-mono text-[11px] uppercase tracking-[.12em]"
                      style={{ background: PALETTE.ink, color: PALETTE.paper, textDecoration: 'none' }}>Ver prova →</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* By use case */}
          <div className="mt-8">
            <SmallLabel style={{ marginBottom: 12 }}>By use case</SmallLabel>
            <div style={{ border: `.5px solid ${PALETTE.rule}`, borderRadius: 4, overflow: 'hidden' }}>
              <table className="w-full" style={{ borderCollapse: 'collapse', fontFamily: FONTS.body }}>
                <thead>
                  <tr style={{ background: PALETTE.paper2, borderBottom: `.5px solid ${PALETTE.ruleStrong}` }}>
                    {['Use case', 'Total', 'PASS', 'FAIL', 'REVIEW'].map((h) => (
                      <th key={h} className="text-left" style={{ padding: '8px 14px', fontFamily: FONTS.mono, fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: PALETTE.concrete }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {byJuris.map(([uc, s]) => (
                    <tr key={uc} style={{ borderBottom: `.5px solid ${PALETTE.rule}` }}>
                      <td style={{ padding: '8px 14px', fontFamily: FONTS.mono, fontSize: 13 }}>{uc}</td>
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
            Selective disclosure: o dossiê expõe veredito, use case, timestamp e hash da evidência — o score e os dados subjacentes permanecem privados.
          </p>
        </>
      )}

      <DocAddonPanel />
    </div>
  );
}
