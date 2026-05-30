/**
 * /app/evidence — audit-evidence dossier (Fase E).
 * Junta os selos desta wallet: histórico LOCAL (instantâneo — os selos Managed são
 * ancorados pela DPO2U, não pela pubkey do usuário, então não vêm pelo filtro on-chain)
 * + eventos on-chain do indexer (Horizon), dedup por hash. KPIs, breakdown por use case,
 * lista de selos com link /verify, export JSON / print PDF.
 */
import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FONTS, PALETTE, SmallLabel, Rule } from '@/components/sealed/atoms';
import { useWalletAuth } from '@/components/app/WalletAuthProvider';
import { useIndexerStore } from '@/lib/pilot/indexer-store';
import { useAttestationHistory } from '@/lib/app/attestation-history';
import { useSolanaAttestations } from '@/lib/app/solana-indexer';
import { truncateHash, stellarExpertUrl, DEFAULT_CONTRACT } from '@/lib/pilot/stellar';
import { CLUSTER, PROGRAM_IDS, explorerUrl as solExplorerUrl } from '@/lib/solana';

interface Seal {
  useCaseId: string;
  hash: string;
  verdict?: string;
  score?: number;
  txHash?: string;
  at: number; // ms
  source: 'onchain' | 'local';
  chain: 'stellar' | 'solana';
  subject?: string; // Solana: subject da PDA (link /verify/sol)
  explorerUrl?: string; // Solana: link direto pro explorer
}

export default function AppEvidence() {
  const { pubkey, chain, tier, workspace } = useWalletAuth();
  const isSolana = chain === 'solana';
  const events = useIndexerStore((s) => s.events);
  const fetchOnce = useIndexerStore((s) => s.fetchOnce);
  const history = useAttestationHistory((s) => s.refs);
  const solana = useSolanaAttestations(isSolana ? pubkey : null);
  useEffect(() => { if (!isSolana) void fetchOnce(); }, [isSolana, fetchOnce]);

  // Merge: on-chain (rico) + local (instantâneo), dedup por hash (on-chain ganha).
  // Dual-chain: em sessão Solana lê as PDAs; em Stellar lê o indexer Horizon.
  const seals = useMemo<Seal[]>(() => {
    if (!pubkey) return [];
    const byHash = new Map<string, Seal>();
    const myHistory = history.filter((h) => h.pubkey === pubkey);

    if (isSolana) {
      for (const r of myHistory.filter((h) => (h.chain ?? 'stellar') === 'solana')) {
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
    }

    for (const r of myHistory.filter((h) => (h.chain ?? 'stellar') !== 'solana')) {
      byHash.set(r.evidenceHashHex.toLowerCase(), {
        useCaseId: r.useCaseId, hash: r.evidenceHashHex, verdict: r.verdict, score: r.score,
        txHash: r.txHash, at: r.at, source: 'local', chain: 'stellar',
      });
    }
    for (const e of events.filter((e) => e.record.submitted_by === pubkey)) {
      byHash.set(e.evidence_hash_hex.toLowerCase(), {
        useCaseId: e.use_case_id, hash: e.evidence_hash_hex, verdict: e.record.verdict,
        txHash: e.tx_hash, at: e.record.timestamp * 1000, source: 'onchain', chain: 'stellar',
      });
    }
    return Array.from(byHash.values()).sort((a, b) => b.at - a.at);
  }, [events, history, pubkey, isSolana, solana.records]);

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
  // verify_url por chain: Stellar resolve por (uc,hash); Solana por (uc,hash,subject).
  const verifyUrl = (s: Seal): string =>
    s.chain === 'solana'
      ? `${origin}/verify/sol/uc/${s.useCaseId}/hash/${s.hash}/subject/${s.subject ?? ''}`
      : `${origin}/verify/uc/${s.useCaseId}/hash/${s.hash}`;

  const exportJson = () => {
    const dossier = {
      generatedAt: new Date().toISOString(),
      workspace: workspace.label,
      tier: tier.label,
      anchor: isSolana
        ? { chain: 'solana', network: `solana:${CLUSTER}`, program: PROGRAM_IDS.complianceRegistry.toBase58() }
        : { chain: 'stellar', network: 'stellar:testnet', contract: DEFAULT_CONTRACT.id },
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
          <button type="button" onClick={() => void fetchOnce()} className="py-2.5 px-5 font-mono text-[12px] uppercase tracking-[.14em]"
            style={{ border: `1px solid ${PALETTE.ruleStrong}`, color: PALETTE.ink, background: 'transparent', cursor: 'pointer' }}>Atualizar</button>
          <button type="button" onClick={exportJson} className="py-2.5 px-5 font-mono text-[12px] uppercase tracking-[.14em]"
            style={{ background: PALETTE.ink, color: PALETTE.paper, border: 'none', cursor: 'pointer' }}>Export JSON</button>
          <button type="button" onClick={() => window.print()} className="py-2.5 px-5 font-mono text-[12px] uppercase tracking-[.14em]"
            style={{ border: `1px solid ${PALETTE.ruleStrong}`, color: PALETTE.ink, background: 'transparent', cursor: 'pointer' }}>Print / PDF</button>
        </div>
      </div>

      <p className="mt-2 text-[14px]" style={{ color: PALETTE.inkSoft }}>
        {workspace.label} · {tier.label} · {seals.length} selo{seals.length === 1 ? '' : 's'} ({isSolana ? `Solana ${CLUSTER}` : 'Stellar testnet'}).
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
                    {s.chain === 'solana' ? (
                      (s.explorerUrl || s.txHash) && (
                        <a href={s.explorerUrl ?? solExplorerUrl(s.txHash!, 'tx')} target="_blank" rel="noreferrer"
                          style={{ fontFamily: FONTS.mono, fontSize: 11, color: PALETTE.concrete, textDecoration: 'underline', textUnderlineOffset: 3 }}>tx ↗</a>
                      )
                    ) : (
                      s.txHash && (
                        <a href={stellarExpertUrl('tx', s.txHash)} target="_blank" rel="noreferrer"
                          style={{ fontFamily: FONTS.mono, fontSize: 11, color: PALETTE.concrete, textDecoration: 'underline', textUnderlineOffset: 3 }}>tx ↗</a>
                      )
                    )}
                    <Link to={s.chain === 'solana' ? `/verify/sol/uc/${s.useCaseId}/hash/${s.hash}/subject/${s.subject ?? ''}` : `/verify/uc/${s.useCaseId}/hash/${s.hash}`}
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
            <SmallLabel style={{ color: 'rgba(241,236,227,.7)' }}>On-chain anchor · {isSolana ? `Solana ${CLUSTER}` : 'Stellar testnet'}</SmallLabel>
            {isSolana ? (
              <>
                <div style={{ fontFamily: FONTS.mono, fontSize: 12, marginTop: 6, wordBreak: 'break-all' }}>{PROGRAM_IDS.complianceRegistry.toBase58()}</div>
                <a href={solExplorerUrl(PROGRAM_IDS.complianceRegistry.toBase58())} target="_blank" rel="noreferrer"
                  style={{ fontFamily: FONTS.mono, fontSize: 11, color: PALETTE.terracotta, textDecoration: 'underline', textUnderlineOffset: 3 }}>
                  Ver no Solana Explorer →
                </a>
              </>
            ) : (
              <>
                <div style={{ fontFamily: FONTS.mono, fontSize: 12, marginTop: 6, wordBreak: 'break-all' }}>{DEFAULT_CONTRACT.id}</div>
                <a href={stellarExpertUrl('contract', DEFAULT_CONTRACT.id)} target="_blank" rel="noreferrer"
                  style={{ fontFamily: FONTS.mono, fontSize: 11, color: PALETTE.terracotta, textDecoration: 'underline', textUnderlineOffset: 3 }}>
                  Ver no Stellar Expert →
                </a>
              </>
            )}
          </div>

          <p className="mt-4 text-[12px]" style={{ color: PALETTE.concrete }}>
            Selective disclosure: o dossiê expõe veredito, use case, timestamp e hash da evidência — o score e os dados subjacentes permanecem privados.
          </p>
        </>
      )}
    </div>
  );
}
