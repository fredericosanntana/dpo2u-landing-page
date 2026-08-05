/**
 * /app — dashboard (Stellar-only). Fase D: real data.
 * Source: on-chain attestations lidas dos eventos do contrato Soroban (filtradas
 * por submitted_by) merged com o histórico local da wallet. KPIs derivados; log
 * deep-links pra /verify. Empty-state quando a wallet ainda não tem atestações.
 */
import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FONTS, PALETTE, SmallLabel } from '@/components/sealed/atoms';
import { KpiGrid, btnClass } from '@/components/app/ui';
import { useWalletAuth } from '@/components/app/WalletAuthProvider';
import { useAttestationHistory } from '@/lib/app/attestation-history';
import { useStellarAttestations } from '@/lib/app/stellar-indexer';
import { githubStatus, type GithubStatus } from '@/lib/app/github-client';
import { AttestationDetailSheet, type AttestationDetail, shortRepo } from '@/components/app/AttestationDetailSheet';
import { truncateHash } from '@/lib/pilot/stellar';

const SEAL_PRICE = 0.0002;

interface Row {
  useCaseId: string;
  evidenceHashHex: string;
  verdict: string | null;
  ts: number | null;
  onchain: boolean;
  chain: 'stellar';
  subject?: string; // Stellar: conta submitter (submitted_by)
  explorerUrl?: string; // link direto pro Stellar Expert
  repo?: string; // contexto rico (do histórico local / summary)
  score?: number;
  gaps?: string[];
  jurisdictions?: string[];
}

function EmptyState() {
  const STEPS = [
    { n: 1, h: 'Choose what to prove', p: 'VASP PoR, CVM token, agent runtime, data-protection, or a BCB 5710/5711 filing — we run the engine and seal it.', to: '/app/start', cta: 'Start →' },
    { n: 2, h: 'Or run the SDK yourself', p: 'Anchor seals from your own CI/CD. $0.0002 per attestation.', to: '/research', cta: 'Read the docs →' },
    { n: 3, h: 'Share a public proof', p: 'Every seal gets a shareable, trustless /verify link.', to: '/verify', cta: 'See verify →' },
  ];
  return (
    <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
      {STEPS.map((s) => (
        <div key={s.n} className="flex flex-col p-6" style={{ border: `.5px solid ${PALETTE.ruleStrong}`, borderRadius: 4, background: PALETTE.paper2 }}>
          <div className="flex items-center justify-center mb-4" style={{ width: 32, height: 32, borderRadius: '50%', border: `1px solid ${PALETTE.terracotta}`, color: PALETTE.terracotta, fontFamily: FONTS.mono, fontSize: 14 }}>{s.n}</div>
          <h3 style={{ fontFamily: FONTS.display, fontSize: 18, fontWeight: 500 }}>{s.h}</h3>
          <p className="mt-2 text-[14px] leading-[1.5]" style={{ color: PALETTE.inkSoft, flex: 1 }}>{s.p}</p>
          <Link to={s.to} className="mt-4" style={{ fontFamily: FONTS.body, fontSize: 14, fontWeight: 500, color: PALETTE.ink, textDecoration: 'none', borderBottom: `1px solid ${PALETTE.terracotta}`, paddingBottom: 2, alignSelf: 'flex-start' }}>{s.cta}</Link>
        </div>
      ))}
    </div>
  );
}

export default function AppDashboard() {
  const { pubkey, tier, workspace } = useWalletAuth();
  const history = useAttestationHistory((s) => s.refs);
  const clearHistory = useAttestationHistory((s) => s.clear);
  // Stellar: lê os eventos do contrato Soroban e filtra por submitted_by === pubkey.
  const stellar = useStellarAttestations(pubkey);
  // Status da conexão GitHub (chip no header).
  const [gh, setGh] = React.useState<GithubStatus | null>(null);
  useEffect(() => {
    if (!pubkey) { setGh(null); return; }
    let alive = true;
    void githubStatus(pubkey).then((s) => { if (alive) setGh(s); });
    return () => { alive = false; };
  }, [pubkey]);

  const loading = stellar.loading;

  const [detail, setDetail] = React.useState<AttestationDetail | null>(null);

  const rows = useMemo<Row[]>(() => {
    const histMine = pubkey ? history.filter((h) => h.pubkey === pubkey) : [];
    // Enriquecimento: o registro on-chain (autoridade do verdict/tx) é casado com o
    // histórico local pelo hash p/ recuperar repo/score/gaps/jurisdições.
    const byHash = new Map(histMine.map((h) => [h.evidenceHashHex.toLowerCase(), h]));
    const onchain: Row[] = stellar.records.map((r) => {
      const local = byHash.get(r.evidenceHashHex.toLowerCase());
      return {
        useCaseId: r.useCaseId,
        evidenceHashHex: r.evidenceHashHex,
        verdict: r.verdict,
        ts: r.issuedAt,
        onchain: true,
        chain: 'stellar' as const,
        subject: r.submittedBy,
        explorerUrl: r.explorerUrl,
        repo: local?.repo,
        score: local?.score,
        gaps: local?.gaps,
        jurisdictions: local?.jurisdictions,
      };
    });
    const seen = new Set(stellar.records.map((r) => r.evidenceHashHex.toLowerCase()));
    const hist = histMine
      .filter((h) => !seen.has(h.evidenceHashHex.toLowerCase()))
      .map<Row>((h) => ({
        useCaseId: h.useCaseId, evidenceHashHex: h.evidenceHashHex, verdict: h.verdict ?? null,
        ts: h.at, onchain: false, chain: 'stellar', subject: h.pubkey, explorerUrl: h.explorerUrl,
        repo: h.repo, score: h.score, gaps: h.gaps, jurisdictions: h.jurisdictions,
      }));
    return [...onchain, ...hist].sort((a, b) => (b.ts ?? 0) - (a.ts ?? 0));
  }, [history, pubkey, stellar.records]);

  const toDetail = (r: Row): AttestationDetail => ({
    repo: r.repo, useCaseId: r.useCaseId, verdict: r.verdict, score: r.score, gaps: r.gaps,
    jurisdictions: r.jurisdictions, hash: r.evidenceHashHex, subject: r.subject, explorerUrl: r.explorerUrl, at: r.ts, onchain: r.onchain,
  });

  const count = rows.length;
  const spend = (count * SEAL_PRICE).toFixed(4);
  const repos = new Set(rows.map((r) => r.repo).filter(Boolean)).size;
  const flagged = rows.filter((r) => r.verdict === 'FAIL' || r.verdict === 'REVIEW').length;

  return (
    <div className="max-w-[1000px]">
      <SmallLabel>Overview</SmallLabel>
      <h1 className="text-[32px] md:text-[40px] font-medium" style={{ fontFamily: FONTS.display, letterSpacing: '-0.02em', marginTop: 6 }}>
        {count > 0 ? 'Your attestations' : 'Welcome to your workspace'}<span style={{ color: PALETTE.terracotta }}>.</span>
      </h1>
      <p className="mt-2 text-[15px]" style={{ color: PALETTE.inkSoft }}>
        {workspace.label} · {tier.label} · {count > 0 ? `${count} attestation${count === 1 ? '' : 's'}` : 'no attestations yet'}
        {loading ? ' · syncing…' : ''}
      </p>
      <div className="mt-3">
        {gh?.install ? (
          <Link to="/app/settings" style={{ fontFamily: FONTS.mono, fontSize: 11, color: PALETTE.verdigris, border: `1px solid ${PALETTE.verdigris}`, borderRadius: 999, padding: '3px 10px', textDecoration: 'none' }}>
            ● GitHub connected · {gh.credits} CI credits
          </Link>
        ) : (
          <Link to="/app/activate" style={{ fontFamily: FONTS.mono, fontSize: 11, color: PALETTE.concrete, border: `1px solid ${PALETTE.ruleStrong}`, borderRadius: 999, padding: '3px 10px', textDecoration: 'none' }}>
            ○ GitHub not connected · connect →
          </Link>
        )}
      </div>

      <div className="mt-8">
        <KpiGrid items={[
          { value: String(count), label: 'attestations' },
          { value: `${spend} USDC`, label: 'seal spend (testnet)' },
          { value: repos ? String(repos) : '—', label: 'repositories' },
          { value: flagged ? String(flagged) : '✓', label: flagged ? 'flagged (fail/review)' : 'all clear' },
        ]} />
      </div>

      {count === 0 ? (
        <EmptyState />
      ) : (
        <div className="mt-8" style={{ border: `.5px solid ${PALETTE.rule}`, borderRadius: 4, overflow: 'hidden' }}>
          <table className="w-full" style={{ borderCollapse: 'collapse', fontFamily: FONTS.body }}>
            <thead>
              <tr style={{ background: PALETTE.paper2, borderBottom: `.5px solid ${PALETTE.ruleStrong}` }}>
                {['Repository', 'Verdict', 'Score', 'When', ''].map((h) => (
                  <th key={h} className="text-left" style={{ padding: '10px 14px', fontFamily: FONTS.mono, fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: PALETTE.concrete }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr
                  key={`${r.useCaseId}-${r.evidenceHashHex}-${i}`}
                  className="appui-row"
                  tabIndex={0}
                  role="button"
                  aria-label={`Attestation ${shortRepo(r.repo)} — open details`}
                  onClick={() => setDetail(toDetail(r))}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setDetail(toDetail(r)); } }}
                  style={{ borderBottom: `.5px solid ${PALETTE.rule}` }}
                >
                  <td style={{ padding: '10px 14px', fontSize: 13, fontWeight: 500 }}>
                    {shortRepo(r.repo)}
                    {!r.repo && <span style={{ fontFamily: FONTS.mono, fontSize: 10, color: PALETTE.concrete }}> · {truncateHash(r.evidenceHashHex)}</span>}
                  </td>
                  <td style={{ padding: '10px 14px', fontSize: 13, color: r.verdict === 'PASS' ? PALETTE.verdigris : r.verdict === 'FAIL' ? PALETTE.terracotta : PALETTE.concrete }}>
                    {r.verdict ?? (r.onchain ? '—' : 'local')}
                  </td>
                  <td style={{ padding: '10px 14px', fontFamily: FONTS.mono, fontSize: 13, color: PALETTE.inkSoft }}>{typeof r.score === 'number' ? `${r.score}/100` : '—'}</td>
                  <td style={{ padding: '10px 14px', fontSize: 12, color: PALETTE.concrete }}>{r.ts ? new Date(r.ts).toISOString().slice(0, 10) : '—'}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <span aria-hidden style={{ fontFamily: FONTS.mono, fontSize: 11, color: PALETTE.terracotta, textDecoration: 'underline', textUnderlineOffset: 3 }}>detail →</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/app/start" className={btnClass('ink')}>Prove something →</Link>
        <Link to="/app/activate" className={btnClass('ghost')}>Activate pipeline</Link>
        <Link to="/app/evidence" className={btnClass('ghost')}>Audit evidence</Link>
        {count > 0 && (
          <button
            type="button"
            onClick={() => { if (window.confirm('Clear this browser’s local attestation history? (does not affect on-chain seals or the server)')) clearHistory(); }}
            className={btnClass('ghost')}
          >
            Clear history
          </button>
        )}
      </div>
      <p className="mt-6 text-[12px]" style={{ color: PALETTE.concrete, fontFamily: FONTS.mono }}>
        Shows on-chain seals anchored by this wallet plus your local history. Select a row to see the repository and its improvement points.
      </p>

      {detail && <AttestationDetailSheet detail={detail} onClose={() => setDetail(null)} />}
    </div>
  );
}
