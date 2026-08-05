// /protocol — DPO2U compliance-as-a-protocol on Stellar (Soroban).
// Sprint Stellar (2026-06): substitui /solana-protocol. Reusa o registro de
// contratos (contracts.ts) + o indexer de eventos (indexer-store) do piloto.
// Chain-neutral na rota; o conteúdo é Stellar-native e honesto: 1 contrato
// imutável live no testnet, verificação trustless por (use_case_id, evidence_hash).
import React, { useEffect, useMemo } from 'react';
import { usePageHead } from '@/lib/page-head';
import { SmallLabel, Button, WaxSeal, FONTS, PALETTE } from '@/components/sealed/atoms';
import { DEFAULT_CONTRACT, stellarExpertUrl, truncateContract } from '@/lib/pilot/stellar';
import { useIndexerStore, selectVerdictDistribution } from '@/lib/pilot/indexer-store';

const FLOW_STEPS = [
  {
    n: '01',
    title: 'Run the predicate engine',
    desc: 'The MCP compliance engine evaluates a subject against a jurisdiction predicate set (LGPD, GDPR, MiCAR…). The verdict — PASS / FAIL / REVIEW — and an evidence hash are produced off-chain. Source data never leaves your side.',
  },
  {
    n: '02',
    title: 'register_attestation',
    desc: 'An authorized submitter anchors (use_case_id, verdict, evidence_hash, metadata_hash) into the Soroban contract. The signer satisfies submitter.require_auth() — self-custody via Freighter or gateway-signed.',
  },
  {
    n: '03',
    title: 'verify_attestation',
    desc: 'Anyone reads the contract by (use_case_id, evidence_hash) over Soroban RPC — no wallet, no fee. Returns the verdict, predicate version, submitter and timestamp. This is what /verify renders.',
  },
  {
    n: '04',
    title: 'Immutable, revocable record',
    desc: 'The attestation is an on-chain fact: auditable, timestamped, and bound to the predicate set. The score stays private; the proof of compliance is public and enforceable.',
  },
];

const ZK_BULLETS = [
  'Prove score ≥ threshold without revealing the score',
  'Public proof, private inputs — the verdict is enforceable, the number is not exposed',
  'Anti-replay binding (subject + nonce) so a proof can’t be reused',
  'The verify path stays trustless: read the contract, check the record',
];

function SectionHeader({ marker, title, lede }: { marker: string; title: React.ReactNode; lede?: string }) {
  return (
    <div>
      <SmallLabel style={{ marginBottom: 16 }}>{marker}</SmallLabel>
      <h2
        style={{ fontFamily: FONTS.display, fontWeight: 500, lineHeight: 1.05, letterSpacing: '-.03em', margin: 0 }}
        className="text-[36px] sm:text-[48px] lg:text-[60px]"
      >
        {title}
      </h2>
      {lede && (
        <p style={{ fontSize: 17, color: PALETTE.inkSoft, lineHeight: 1.6, margin: '20px 0 0', maxWidth: 640 }}>{lede}</p>
      )}
    </div>
  );
}

/** Live read-only stats from the contract events (Horizon), refreshed every 30s. */
function LiveContractStats() {
  const events = useIndexerStore((s) => s.events);
  const loading = useIndexerStore((s) => s.loading);
  const error = useIndexerStore((s) => s.error);
  const startPolling = useIndexerStore((s) => s.startPolling);
  const stopPolling = useIndexerStore((s) => s.stopPolling);

  useEffect(() => {
    startPolling(30_000);
    return () => stopPolling();
  }, [startPolling, stopPolling]);

  const dist = useMemo(() => selectVerdictDistribution({ events } as never), [events]);
  const cells: Array<[string, string]> = [
    [String(dist.total), 'attestations on-chain'],
    [String(dist.pass), 'PASS'],
    [String(dist.fail), 'FAIL'],
    [String(dist.review), 'REVIEW'],
  ];

  return (
    <div className="mt-14" style={{ border: `.5px solid ${PALETTE.ruleStrong}`, background: PALETTE.paper2 }}>
      <div className="grid grid-cols-2 sm:grid-cols-4">
        {cells.map(([v, l], i) => (
          <div key={l} style={{ padding: '24px 22px', borderRight: i < cells.length - 1 ? `.5px solid ${PALETTE.rule}` : 'none', borderTop: i >= 2 ? `.5px solid ${PALETTE.rule}` : 'none' }}>
            <div style={{ fontFamily: FONTS.display, fontSize: 32, fontWeight: 500, letterSpacing: '-.02em', lineHeight: 1.05 }}>{v}</div>
            <div style={{ fontFamily: FONTS.mono, fontSize: 10, letterSpacing: '.14em', color: PALETTE.concrete, marginTop: 10, textTransform: 'uppercase' }}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{ padding: '10px 22px', borderTop: `.5px solid ${PALETTE.rule}`, fontFamily: FONTS.mono, fontSize: 11, color: PALETTE.concrete }}>
        {error ? `indexer: ${error}` : loading ? 'reading the chain…' : `read-only · Soroban ${DEFAULT_CONTRACT.network} · refreshed every 30s`}
      </div>
    </div>
  );
}

export default function ProtocolPage() {
  usePageHead({
    title: 'Protocol — compliance on Stellar (Soroban) | DPO2U',
    description: 'DPO2U is compliance as a protocol on Stellar. An immutable Soroban contract anchors PASS/FAIL/REVIEW attestations; anyone verifies trustlessly by (use_case_id, evidence_hash) over Soroban RPC. ~$0.0002 per seal, read-only verify is free.',
    path: '/protocol',
  });

  const addr = DEFAULT_CONTRACT.id;

  return (
    <>
      {/* Hero */}
      <section className="px-6 lg:px-14 pt-16 lg:pt-24 pb-16 lg:pb-20" style={{ borderBottom: `.5px solid ${PALETTE.rule}` }}>
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-12 items-start">
          <div>
            <SmallLabel style={{ marginBottom: 16, color: PALETTE.terracotta }}>
              PROTOCOL · ON-CHAIN PRIMITIVES · STELLAR SOROBAN · LIVE TESTNET
            </SmallLabel>
            <h1
              style={{ fontFamily: FONTS.display, fontWeight: 500, lineHeight: 1.02, letterSpacing: '-.035em', margin: 0 }}
              className="text-[48px] sm:text-[64px] lg:text-[80px]"
            >
              Compliance,<br />
              <span style={{ fontStyle: 'italic', color: PALETTE.terracotta }}>as a protocol.</span>
            </h1>
            <p
              style={{ fontFamily: FONTS.body, fontSize: 19, lineHeight: 1.55, color: PALETTE.inkSoft, marginTop: 28, maxWidth: 640 }}
            >
              A compliance verdict becomes an{' '}
              <code style={{ fontFamily: FONTS.mono, color: PALETTE.terracotta, background: PALETTE.paper2, padding: '2px 6px', borderRadius: 2 }}>
                attestation
              </code>{' '}
              on an immutable Soroban contract. Anyone verifies it trustlessly by{' '}
              <code style={{ fontFamily: FONTS.mono, color: PALETTE.terracotta, background: PALETTE.paper2, padding: '2px 6px', borderRadius: 2 }}>
                (use_case_id, evidence_hash)
              </code>{' '}
              over Soroban RPC — no wallet, no fee. The source data stays off-chain; the proof of compliance is public.
            </p>
          </div>
          <div className="flex justify-center lg:justify-end pt-2">
            <WaxSeal size={180} label="PROTOCOL" />
          </div>
        </div>

        {/* Live on-chain stats */}
        <LiveContractStats />
      </section>

      {/* Flow */}
      <section className="px-6 lg:px-14 py-24" style={{ borderBottom: `.5px solid ${PALETTE.rule}` }}>
        <SectionHeader
          marker="§ I · HOW IT WORKS"
          title={<>Private input. <span style={{ fontStyle: 'italic' }}>Public proof.</span></>}
          lede="Four steps from a verdict you compute off-chain to a verifiable, immutable record anyone can check."
        />
        <ol className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FLOW_STEPS.map((step) => (
            <li key={step.n} style={{ background: PALETTE.paper2, border: `.5px solid ${PALETTE.ruleStrong}`, padding: '24px 22px', minHeight: 240 }}>
              <span style={{ fontFamily: FONTS.mono, fontSize: 12, letterSpacing: '.14em', color: PALETTE.terracotta }}>{step.n} /</span>
              <h3 style={{ fontFamily: FONTS.display, fontSize: 22, fontWeight: 500, marginTop: 14, lineHeight: 1.2 }}>{step.title}</h3>
              <p style={{ fontFamily: FONTS.body, fontSize: 14, lineHeight: 1.6, color: PALETTE.inkSoft, marginTop: 12 }}>{step.desc}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* The contract */}
      <section id="contract" className="px-6 lg:px-14 py-24" style={{ borderBottom: `.5px solid ${PALETTE.rule}` }}>
        <SectionHeader
          marker={`§ II · SOROBAN CONTRACT · STELLAR ${DEFAULT_CONTRACT.network.toUpperCase()}`}
          title={<>One contract, <span style={{ fontStyle: 'italic' }}>immutable.</span></>}
          lede="The first Soroban contract of the DPO2U compliance-as-protocol stack. Clickable to Stellar Expert. Same contract /verify and the app read end-to-end."
        />

        <div className="mt-14" style={{ border: `.5px solid ${PALETTE.ruleStrong}`, background: PALETTE.paper }}>
          <div className="px-6 py-6 lg:px-7" style={{ borderBottom: `.5px solid ${PALETTE.rule}` }}>
            <SmallLabel style={{ color: PALETTE.concrete, fontSize: 9.5, marginBottom: 4 }}>anticorruption-attestation</SmallLabel>
            <div style={{ fontFamily: FONTS.display, fontSize: 24, fontWeight: 500, letterSpacing: '-.015em' }}>{DEFAULT_CONTRACT.friendly_name}</div>
            <p style={{ fontFamily: FONTS.body, fontSize: 15, color: PALETTE.inkSoft, lineHeight: 1.55, marginTop: 10, maxWidth: 720 }}>
              {DEFAULT_CONTRACT.description}
            </p>
            <div className="mt-4 flex items-center gap-4 flex-wrap" style={{ fontFamily: FONTS.mono, fontSize: 12 }}>
              <span title={addr} style={{ color: PALETTE.ink, wordBreak: 'break-all' }}>{truncateContract(addr, 10, 8)}</span>
              <a
                href={stellarExpertUrl('contract', addr)}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: PALETTE.concrete, letterSpacing: '.12em', textTransform: 'uppercase', borderBottom: `.5px solid ${PALETTE.ruleStrong}`, paddingBottom: 1, textDecoration: 'none' }}
              >
                Stellar Expert ↗
              </a>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3">
            {[
              ['Network', `Soroban ${DEFAULT_CONTRACT.network}`],
              ['Deployed', DEFAULT_CONTRACT.deployed_at.slice(0, 10)],
              ['WASM hash', truncateContract(DEFAULT_CONTRACT.wasm_hash, 8, 6)],
            ].map(([l, v], i) => (
              <div key={l} style={{ padding: '18px 22px', borderRight: i < 2 ? `.5px solid ${PALETTE.rule}` : 'none' }}>
                <SmallLabel style={{ color: PALETTE.concrete, fontSize: 9.5 }}>{l}</SmallLabel>
                <div style={{ fontFamily: FONTS.mono, fontSize: 13, marginTop: 6, wordBreak: 'break-all' }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
        <p style={{ fontFamily: FONTS.body, fontSize: 14, color: PALETTE.concrete, lineHeight: 1.6, marginTop: 16, maxWidth: 720 }}>
          Contract methods: <code style={{ fontFamily: FONTS.mono }}>register_attestation</code>,{' '}
          <code style={{ fontFamily: FONTS.mono }}>verify_attestation</code>,{' '}
          <code style={{ fontFamily: FONTS.mono }}>configure_use_case</code>,{' '}
          <code style={{ fontFamily: FONTS.mono }}>authorize_submitter</code>. Mainnet deploy is gated behind the Sprint L ceremony.
        </p>
      </section>

      {/* ZK layer */}
      <section id="zk" className="px-6 lg:px-14 py-24" style={{ borderBottom: `.5px solid ${PALETTE.rule}` }}>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div>
            <SmallLabel style={{ marginBottom: 16, color: PALETTE.terracotta }}>§ III · ZERO-KNOWLEDGE LAYER</SmallLabel>
            <h2
              style={{ fontFamily: FONTS.display, fontWeight: 500, lineHeight: 1.08, letterSpacing: '-.025em', margin: 0 }}
              className="text-[32px] lg:text-[44px]"
            >
              Score-private. <span style={{ fontStyle: 'italic' }}>Proof-public.</span>
            </h2>
            <p style={{ fontFamily: FONTS.body, fontSize: 16, lineHeight: 1.65, color: PALETTE.inkSoft, marginTop: 24 }}>
              The B2B layer adds a zero-knowledge verifier: prove a compliance threshold is met without
              disclosing the underlying score, with anti-replay binding so a proof can’t be reused. The
              public verify path stays the same — read the contract, check the record.
            </p>
            <ul style={{ marginTop: 24, padding: 0, listStyle: 'none' }}>
              {ZK_BULLETS.map((b) => (
                <li key={b} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, fontFamily: FONTS.body, fontSize: 14.5, color: PALETTE.inkSoft, lineHeight: 1.6, marginTop: 10 }}>
                  <span aria-hidden style={{ color: PALETTE.terracotta, fontFamily: FONTS.mono, fontSize: 12 }}>—</span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <div style={{ background: PALETTE.paper2, border: `.5px solid ${PALETTE.ruleStrong}`, borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', borderBottom: `.5px solid ${PALETTE.rule}` }}>
              <span style={{ width: 9, height: 9, borderRadius: '50%', background: PALETTE.ruleStrong, opacity: .4 }} />
              <span style={{ width: 9, height: 9, borderRadius: '50%', background: PALETTE.ruleStrong, opacity: .4 }} />
              <span style={{ width: 9, height: 9, borderRadius: '50%', background: PALETTE.ruleStrong, opacity: .4 }} />
              <span style={{ marginLeft: 6, fontFamily: FONTS.mono, fontSize: 10, letterSpacing: '.14em', color: PALETTE.concrete, textTransform: 'uppercase' }}>
                dpo2u-attest verify
              </span>
            </div>
            <pre style={{ padding: 20, fontFamily: FONTS.mono, fontSize: 12.5, lineHeight: 1.7, color: PALETTE.ink, margin: 0, overflowX: 'auto', whiteSpace: 'pre' }}>
{`$ dpo2u-attest verify \\
    --use-case bank_chg \\
    --evidence-hash 0x0913644c…
┌─ DPO2U attestation ─────────────────┐
│ verdict            : PASS            │
│ predicate_set      : bank_chg        │
│ predicate_version  : 1               │
│ score              : [PRIVATE]       │
│ submitted_by       : GDJSDCHT…       │
└──────────────────────────────────────┘
✓ verified on Soroban ${DEFAULT_CONTRACT.network} [Stellar Expert↗]`}
            </pre>
          </div>
        </div>
      </section>

      {/* Use it yourself */}
      <section className="px-6 lg:px-14 py-24" style={{ borderBottom: `.5px solid ${PALETTE.rule}` }}>
        <div style={{ maxWidth: 720 }}>
          <SmallLabel style={{ marginBottom: 16 }}>§ IV · VERIFY IT YOURSELF</SmallLabel>
          <h2
            style={{ fontFamily: FONTS.display, fontWeight: 500, lineHeight: 1.05, letterSpacing: '-.03em', margin: 0 }}
            className="text-[36px] sm:text-[48px] lg:text-[56px]"
          >
            Read the chain <span style={{ fontStyle: 'italic' }}>yourself.</span>
          </h2>
          <p style={{ fontFamily: FONTS.body, fontSize: 17, lineHeight: 1.6, color: PALETTE.inkSoft, marginTop: 24 }}>
            The trustless verifier ships as an npm package. No wallet, no key — verification is a read-only
            Soroban call. Or open any{' '}
            <code style={{ fontFamily: FONTS.mono, color: PALETTE.terracotta }}>/verify</code> link in the browser.
          </p>
          <div style={{ marginTop: 24, background: PALETTE.paper2, border: `.5px solid ${PALETTE.ruleStrong}`, padding: 20, borderRadius: 4 }}>
            <pre style={{ fontFamily: FONTS.mono, fontSize: 13, lineHeight: 1.75, color: PALETTE.ink, margin: 0, overflowX: 'auto', whiteSpace: 'pre' }}>
{`npm i -g @dpo2u/stellar-sdk
dpo2u-attest verify --use-case <id> --evidence-hash <hex>`}
            </pre>
          </div>
          <div className="mt-10 flex gap-3 flex-wrap">
            <Button kind="terracotta" href="/verify">Open /verify →</Button>
            <Button kind="ghost" href="https://github.com/fredericosanntana/dpo2u-stellar">Read the SDK</Button>
          </div>
        </div>
      </section>
    </>
  );
}
