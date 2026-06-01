/**
 * /app — dashboard (Solana-only). Fase D: real data.
 * Source: on-chain attestations lidas das PDAs do compliance-registry (Solana)
 * merged com o histórico local da wallet. KPIs derivados; log deep-links pra
 * /verify/sol. Empty-state quando a wallet ainda não tem atestações.
 */
import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FONTS, PALETTE, SmallLabel } from '@/components/sealed/atoms';
import { useWalletAuth } from '@/components/app/WalletAuthProvider';
import { useAttestationHistory } from '@/lib/app/attestation-history';
import { useSolanaAttestations } from '@/lib/app/solana-indexer';
import { githubStatus, type GithubStatus } from '@/lib/app/github-client';
import { truncateHash } from '@/lib/solana';

const SEAL_PRICE = 0.0002;

interface Row {
  useCaseId: string;
  evidenceHashHex: string;
  verdict: string | null;
  ts: number | null;
  onchain: boolean;
  chain: 'solana';
  subject?: string; // Solana: subject da PDA (p/ link /verify/sol)
  explorerUrl?: string; // Solana: link direto pro explorer quando não há /verify
}

function EmptyState() {
  const STEPS = [
    { n: 1, h: 'Connect a repository', p: 'Activate a managed pipeline — we execute the primitives and seal each event.', to: '/app/activate', cta: 'Activate →' },
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
  // Solana: lê as PDAs do subject via getProgramAccounts (devnet).
  const solana = useSolanaAttestations(pubkey);
  // Status da conexão GitHub (chip no header).
  const [gh, setGh] = React.useState<GithubStatus | null>(null);
  useEffect(() => {
    if (!pubkey) { setGh(null); return; }
    let alive = true;
    void githubStatus(pubkey).then((s) => { if (alive) setGh(s); });
    return () => { alive = false; };
  }, [pubkey]);

  const loading = solana.loading;

  const rows = useMemo<Row[]>(() => {
    const histMine = pubkey ? history.filter((h) => h.pubkey === pubkey) : [];
    // On-chain: PDAs lidas do compliance-registry (Solana). Local: histórico da wallet.
    const onchain: Row[] = solana.records.map((r) => ({
      useCaseId: 'managed_compliance_v1',
      evidenceHashHex: r.evidenceHashHex ?? r.commitmentHex,
      verdict: r.verdict,
      ts: r.issuedAt,
      onchain: true,
      chain: 'solana',
      subject: r.subject,
      explorerUrl: r.explorerUrl,
    }));
    const seen = new Set(solana.records.map((r) => (r.evidenceHashHex ?? r.commitmentHex).toLowerCase()));
    const hist = histMine
      .filter((h) => !seen.has(h.evidenceHashHex.toLowerCase()))
      .map<Row>((h) => ({
        useCaseId: h.useCaseId, evidenceHashHex: h.evidenceHashHex, verdict: h.verdict ?? null,
        ts: h.at, onchain: false, chain: 'solana', subject: h.pubkey, explorerUrl: h.explorerUrl,
      }));
    return [...onchain, ...hist].sort((a, b) => (b.ts ?? 0) - (a.ts ?? 0));
  }, [history, pubkey, solana.records]);

  const count = rows.length;
  const spend = (count * SEAL_PRICE).toFixed(4);
  const jurisdictions = new Set(rows.map((r) => r.useCaseId)).size;
  const flagged = rows.filter((r) => r.verdict === 'FAIL' || r.verdict === 'REVIEW').length;

  return (
    <div className="max-w-[1000px]">
      <SmallLabel>Overview</SmallLabel>
      <h1 className="text-[32px] md:text-[40px] font-medium" style={{ fontFamily: FONTS.display, letterSpacing: '-0.02em', marginTop: 6 }}>
        {count > 0 ? 'Your attestations' : 'Welcome to your workspace'}<span style={{ color: PALETTE.terracotta }}>.</span>
      </h1>
      <p className="mt-2 text-[15px]" style={{ color: PALETTE.inkSoft }}>
        {workspace.label} · {tier.label} · {count > 0 ? `${count} attestation${count === 1 ? '' : 's'}` : 'nenhuma atestação ainda'}
        {loading ? ' · sincronizando…' : ''}
      </p>
      <div className="mt-3">
        {gh?.install ? (
          <Link to="/app/settings" style={{ fontFamily: FONTS.mono, fontSize: 11, color: PALETTE.verdigris, border: `1px solid ${PALETTE.verdigris}`, borderRadius: 999, padding: '3px 10px', textDecoration: 'none' }}>
            ● GitHub conectado · {gh.credits} créditos CI
          </Link>
        ) : (
          <Link to="/app/activate" style={{ fontFamily: FONTS.mono, fontSize: 11, color: PALETTE.concrete, border: `1px solid ${PALETTE.ruleStrong}`, borderRadius: 999, padding: '3px 10px', textDecoration: 'none' }}>
            ○ GitHub não conectado · conectar →
          </Link>
        )}
      </div>

      <div className="mt-8 grid grid-cols-2 lg:grid-cols-4" style={{ borderTop: `.5px solid ${PALETTE.ruleStrong}`, borderBottom: `.5px solid ${PALETTE.ruleStrong}` }}>
        {[[String(count), 'attestations'], [`$${spend}`, 'seal spend'], [String(jurisdictions), 'jurisdictions'], [flagged ? String(flagged) : '✓', flagged ? 'flagged (fail/review)' : 'all clear']].map(([n, l], i) => (
          <div key={l} style={{ padding: '20px 18px', borderRight: i < 3 ? `.5px solid ${PALETTE.rule}` : 'none' }}>
            <div style={{ fontFamily: FONTS.display, fontWeight: 500, fontSize: 30, letterSpacing: '-.02em' }}>{n}</div>
            <SmallLabel style={{ marginTop: 6 }}>{l}</SmallLabel>
          </div>
        ))}
      </div>

      {count === 0 ? (
        <EmptyState />
      ) : (
        <div className="mt-8" style={{ border: `.5px solid ${PALETTE.rule}`, borderRadius: 4, overflow: 'hidden' }}>
          <table className="w-full" style={{ borderCollapse: 'collapse', fontFamily: FONTS.body }}>
            <thead>
              <tr style={{ background: PALETTE.paper2, borderBottom: `.5px solid ${PALETTE.ruleStrong}` }}>
                {['Use case', 'Verdict', 'Evidence hash', 'When', ''].map((h) => (
                  <th key={h} className="text-left" style={{ padding: '10px 14px', fontFamily: FONTS.mono, fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: PALETTE.concrete }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={`${r.useCaseId}-${r.evidenceHashHex}-${i}`} style={{ borderBottom: `.5px solid ${PALETTE.rule}` }}>
                  <td style={{ padding: '10px 14px', fontFamily: FONTS.mono, fontSize: 13 }}>{r.useCaseId}</td>
                  <td style={{ padding: '10px 14px', fontSize: 13, color: r.verdict === 'PASS' ? PALETTE.verdigris : r.verdict === 'FAIL' ? PALETTE.terracotta : PALETTE.concrete }}>
                    {r.verdict ?? (r.onchain ? '—' : 'local')}
                  </td>
                  <td style={{ padding: '10px 14px', fontFamily: FONTS.mono, fontSize: 12, color: PALETTE.inkSoft }}>{truncateHash(r.evidenceHashHex)}</td>
                  <td style={{ padding: '10px 14px', fontSize: 12, color: PALETTE.concrete }}>{r.ts ? new Date(r.ts).toISOString().slice(0, 10) : '—'}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <Link to={`/verify/sol/uc/${encodeURIComponent(r.useCaseId)}/hash/${encodeURIComponent(r.evidenceHashHex)}/subject/${encodeURIComponent(r.subject ?? '')}`} style={{ fontFamily: FONTS.mono, fontSize: 11, color: PALETTE.terracotta, textDecoration: 'underline', textUnderlineOffset: 3 }}>verify →</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/app/activate" className="py-2.5 px-5 font-mono text-[12px] uppercase tracking-[.14em]" style={{ background: PALETTE.ink, color: PALETTE.paper, textDecoration: 'none' }}>Activate pipeline →</Link>
        <Link to="/app/evidence" className="py-2.5 px-5 font-mono text-[12px] uppercase tracking-[.14em]" style={{ border: `1px solid ${PALETTE.ruleStrong}`, color: PALETTE.ink, textDecoration: 'none' }}>Audit evidence</Link>
      </div>
      <p className="mt-6 text-[12px]" style={{ color: PALETTE.concrete, fontFamily: FONTS.mono }}>
        Mostra atestações on-chain ancoradas por esta wallet + seu histórico local. Atestações executadas pela DPO2U (Managed) aparecem por correlação de histórico.
      </p>
    </div>
  );
}
