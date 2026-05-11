// /solana-protocol — DPO2U Solana programs page.
// Re-skinned 2026-04-29 with the Sealed editorial cartorial vocabulary.
// LiquidGlassNav + CTAFooterWrapper removed; SealedLayout (App.tsx) now wraps
// every route with SealedNav + SealedFooter.
import React, { Suspense, lazy } from 'react';
import { PROGRAMS, explorerUrl, truncateAddress } from '@/lib/solana';
import { usePageHead } from '@/lib/page-head';
import {
  SmallLabel,
  Rule,
  Button,
  WaxSeal,
  FONTS,
  PALETTE,
} from '@/components/sealed/atoms';

const LiveAttestationsWidget = lazy(() =>
  import('@/components/solana/LiveAttestationsWidget'),
);
const AgentsRegisteredWidget = lazy(() =>
  import('@/components/solana/AgentsRegisteredWidget'),
);

const HEADLINE_STATS = [
  { label: 'Cost / attestation', value: '$0.0002' },
  { label: 'Compute units',      value: '~156k CU' },
  { label: 'Proof size',         value: '356 B' },
  { label: 'Prover',             value: 'SP1 v6' },
];

const FLOW_STEPS = [
  {
    n: '01',
    title: 'Prove locally (SP1 zkVM)',
    desc: 'Private inputs (compliance score, salt) enter the RISC-V program. SP1 emits a Groth16 proof + five public values (subject, threshold, meets, vkRoot, nonce).',
  },
  {
    n: '02',
    title: 'Submit Solana transaction',
    desc: 'TypeScript client sends proof (~356 B) + public values (~160 B) to the compliance verifier. Fits in one transaction.',
  },
  {
    n: '03',
    title: 'Verifier CPIs registry',
    desc: 'Verifier checks alt_bn128 pairing on-chain (~156k CU) and CPIs into compliance-registry to write the attestation PDA.',
  },
  {
    n: '04',
    title: 'Attestation PDA lives on-chain',
    desc: 'Auditable, revocable, linked to the subject DID (did:br:cnpj:…). Score stays private. Proof is public. Enforceable on-chain.',
  },
];

const SP1_BULLETS = [
  '120 LOC, backward-compatible via separate entry points',
  'PublicValuesStruct ABI (subject, threshold, meets, vkRoot, nonce)',
  'Groth16 verification via native alt_bn128 syscall — no BPF bloat',
  'Upstream PR ready to open on succinctlabs/sp1-solana',
];

function SectionHeader({ marker, title, lede }: { marker: string; title: React.ReactNode; lede?: string }) {
  return (
    <div>
      <SmallLabel style={{ marginBottom: 16 }}>{marker}</SmallLabel>
      <h2
        style={{
          fontFamily: FONTS.display, fontWeight: 500,
          lineHeight: 1.05, letterSpacing: '-.03em',
          margin: 0,
        }}
        className="text-[36px] sm:text-[48px] lg:text-[60px]"
      >
        {title}
      </h2>
      {lede && (
        <p style={{ fontSize: 17, color: PALETTE.inkSoft, lineHeight: 1.6, margin: '20px 0 0', maxWidth: 640 }}>
          {lede}
        </p>
      )}
    </div>
  );
}

export default function SolanaProtocolPage() {
  usePageHead({
    title: 'Solana Protocol — 14 ZK programs on devnet | DPO2U',
    description: 'Fourteen DPO2U Solana programs across compliance, consent, MiCAR ART, agent infra, 4 jurisdiction-specific (POPIA, CCPA, PIPEDA, PIPA Korea) and the Hiroshima ICOC G7 attestation — SP1 Groth16 proofs. ~$0.0002/attestation, 156k CU, 356-byte proofs.',
    path: '/solana-protocol',
  });

  return (
    <>
      {/* Hero */}
      <section className="px-6 lg:px-14 pt-16 lg:pt-24 pb-16 lg:pb-20" style={{ borderBottom: `.5px solid ${PALETTE.rule}` }}>
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-12 items-start">
          <div>
            <SmallLabel style={{ marginBottom: 16, color: PALETTE.terracotta }}>
              PROTOCOL · ON-CHAIN PRIMITIVES · LIVE DEVNET
            </SmallLabel>
            <h1
              style={{
                fontFamily: FONTS.display, fontWeight: 500,
                lineHeight: 1.02, letterSpacing: '-.035em',
                margin: 0,
              }}
              className="text-[48px] sm:text-[64px] lg:text-[80px]"
            >
              Fourteen programs.<br />
              <span style={{ fontStyle: 'italic', color: PALETTE.terracotta }}>One protocol.</span>
            </h1>
            <p
              style={{
                fontFamily: FONTS.body,
                fontSize: 19, lineHeight: 1.55,
                color: PALETTE.inkSoft,
                marginTop: 28,
                maxWidth: 640,
              }}
            >
              Prove{' '}
              <code style={{ fontFamily: FONTS.mono, color: PALETTE.terracotta, background: PALETTE.paper2, padding: '2px 6px', borderRadius: 2 }}>
                score ≥ threshold
              </code>{' '}
              to an auditor without revealing the score. Groth16 via SP1 v6, verified by the native{' '}
              <code style={{ fontFamily: FONTS.mono, color: PALETTE.terracotta, background: PALETTE.paper2, padding: '2px 6px', borderRadius: 2 }}>
                alt_bn128
              </code>{' '}
              syscall in ~156k CU, recorded as an immutable attestation PDA.
            </p>
          </div>
          <div className="flex justify-center lg:justify-end pt-2">
            <WaxSeal size={180} label="PROTOCOL" />
          </div>
        </div>

        {/* Stats — paper-2 cards */}
        <div
          className="mt-14 grid grid-cols-2 sm:grid-cols-4"
          style={{ border: `.5px solid ${PALETTE.ruleStrong}`, background: PALETTE.paper2 }}
        >
          {HEADLINE_STATS.map((s, i) => (
            <div
              key={s.label}
              style={{
                padding: '24px 22px',
                borderRight: i < HEADLINE_STATS.length - 1 ? `.5px solid ${PALETTE.rule}` : 'none',
              }}
            >
              <div style={{ fontFamily: FONTS.display, fontSize: 32, fontWeight: 500, letterSpacing: '-.02em', lineHeight: 1.05 }}>
                {s.value}
              </div>
              <div style={{ fontFamily: FONTS.mono, fontSize: 10, letterSpacing: '.14em', color: PALETTE.concrete, marginTop: 10, textTransform: 'uppercase' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Flow */}
      <section className="px-6 lg:px-14 py-24" style={{ borderBottom: `.5px solid ${PALETTE.rule}` }}>
        <SectionHeader
          marker="§ I · HOW IT WORKS"
          title={<>Private score. <span style={{ fontStyle: 'italic' }}>Public proof.</span></>}
          lede="Four steps from a number you can't share to a verifiable artefact you can."
        />
        <ol className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FLOW_STEPS.map((step) => (
            <li
              key={step.n}
              style={{
                background: PALETTE.paper2,
                border: `.5px solid ${PALETTE.ruleStrong}`,
                padding: '24px 22px',
                minHeight: 220,
              }}
            >
              <span style={{ fontFamily: FONTS.mono, fontSize: 12, letterSpacing: '.14em', color: PALETTE.terracotta }}>
                {step.n} /
              </span>
              <h3 style={{ fontFamily: FONTS.display, fontSize: 22, fontWeight: 500, marginTop: 14, lineHeight: 1.2 }}>
                {step.title}
              </h3>
              <p style={{ fontFamily: FONTS.body, fontSize: 14, lineHeight: 1.6, color: PALETTE.inkSoft, marginTop: 12 }}>
                {step.desc}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* Programs */}
      <section id="programs" className="px-6 lg:px-14 py-24" style={{ borderBottom: `.5px solid ${PALETTE.rule}` }}>
        <SectionHeader
          marker="§ II · FOURTEEN ANCHOR PROGRAMS · SOLANA DEVNET"
          title={<>Proof points, <span style={{ fontStyle: 'italic' }}>on-chain.</span></>}
          lede="Every program ID below is live on devnet and clickable to Solana Explorer. Same infrastructure the demo reproduces end-to-end in 60 seconds."
        />

        <div
          className="mt-14"
          style={{
            border: `.5px solid ${PALETTE.ruleStrong}`,
            background: PALETTE.paper,
          }}
        >
          {PROGRAMS.map((p, i) => {
            const num = String(i + 1).padStart(2, '0');
            const addr = p.programId.toBase58();
            return (
              <div
                key={p.key}
                className="grid grid-cols-1 lg:grid-cols-[80px_1fr_1.4fr_1.1fr] gap-3 lg:gap-8 items-start lg:items-center px-6 py-6 lg:px-7"
                style={{
                  borderBottom: i < PROGRAMS.length - 1 ? `.5px solid ${PALETTE.rule}` : 'none',
                }}
              >
                <div style={{ fontFamily: FONTS.mono, fontSize: 12, letterSpacing: '.14em', color: PALETTE.terracotta }}>
                  {num} /
                </div>
                <div>
                  <SmallLabel style={{ color: PALETTE.concrete, fontSize: 9.5, marginBottom: 4 }}>
                    {p.key}
                  </SmallLabel>
                  <div style={{ fontFamily: FONTS.display, fontSize: 22, fontWeight: 500, letterSpacing: '-.015em' }}>
                    {p.displayName}
                  </div>
                </div>
                <div style={{ fontFamily: FONTS.display, fontStyle: 'italic', fontSize: 16, color: PALETTE.inkSoft, lineHeight: 1.5 }}>
                  {p.tagline}
                </div>
                <div className="flex items-center gap-4 flex-wrap" style={{ fontFamily: FONTS.mono, fontSize: 11.5 }}>
                  <span title={addr} style={{ color: PALETTE.ink }}>
                    {truncateAddress(addr, 6, 6)}
                  </span>
                  <a
                    href={explorerUrl(p.programId)}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: PALETTE.concrete,
                      letterSpacing: '.12em',
                      textTransform: 'uppercase',
                      borderBottom: `.5px solid ${PALETTE.ruleStrong}`,
                      paddingBottom: 1,
                      textDecoration: 'none',
                    }}
                  >
                    Explorer ↗
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Live widgets */}
      <section id="attestations" className="px-6 lg:px-14 py-24" style={{ borderBottom: `.5px solid ${PALETTE.rule}` }}>
        <SectionHeader
          marker="§ III · LIVE · SOLANA DEVNET RPC"
          title={<>Read the chain, <span style={{ fontStyle: 'italic' }}>right now.</span></>}
          lede="Widgets fetch on-chain accounts directly from Solana devnet every 30 seconds. Read-only. No wallet connect. No tracking."
        />

        <div className="mt-14 grid lg:grid-cols-2 gap-6">
          <Suspense
            fallback={
              <div
                style={{
                  background: PALETTE.paper2,
                  border: `.5px solid ${PALETTE.ruleStrong}`,
                  height: 256,
                }}
              />
            }
          >
            <LiveAttestationsWidget />
          </Suspense>
          <Suspense
            fallback={
              <div
                style={{
                  background: PALETTE.paper2,
                  border: `.5px solid ${PALETTE.ruleStrong}`,
                  height: 256,
                }}
              />
            }
          >
            <AgentsRegisteredWidget />
          </Suspense>
        </div>
      </section>

      {/* SP1 patch */}
      <section id="sp1" className="px-6 lg:px-14 py-24" style={{ borderBottom: `.5px solid ${PALETTE.rule}` }}>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div>
            <SmallLabel style={{ marginBottom: 16, color: PALETTE.terracotta }}>
              § IV · UPSTREAM-WORTHY PATCH
            </SmallLabel>
            <h2
              style={{
                fontFamily: FONTS.display, fontWeight: 500,
                lineHeight: 1.08, letterSpacing: '-.025em',
                margin: 0,
              }}
              className="text-[32px] lg:text-[44px]"
            >
              We patched <code style={{ fontFamily: FONTS.mono, fontSize: '.85em' }}>sp1-solana</code> for SP1 v6.
            </h2>
            <p
              style={{
                fontFamily: FONTS.body, fontSize: 16, lineHeight: 1.65,
                color: PALETTE.inkSoft, marginTop: 24,
              }}
            >
              Upstream{' '}
              <code style={{ fontFamily: FONTS.mono, color: PALETTE.terracotta }}>sp1-solana</code>{' '}
              only supported SP1 up to v5. Our patch (~120 LOC, backward-compatible) extends it to v6
              with five public inputs and a versioned envelope — separate entry points keep v5 behavior
              intact.
            </p>
            <ul style={{ marginTop: 24, padding: 0, listStyle: 'none' }}>
              {SP1_BULLETS.map((b) => (
                <li
                  key={b}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: 12,
                    fontFamily: FONTS.body, fontSize: 14.5, color: PALETTE.inkSoft,
                    lineHeight: 1.6, marginTop: 10,
                  }}
                >
                  <span aria-hidden style={{ color: PALETTE.terracotta, fontFamily: FONTS.mono, fontSize: 12 }}>—</span>
                  {b}
                </li>
              ))}
            </ul>
          </div>

          <div
            style={{
              background: PALETTE.paper2,
              border: `.5px solid ${PALETTE.ruleStrong}`,
              borderRadius: 4,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '12px 16px',
                borderBottom: `.5px solid ${PALETTE.rule}`,
              }}
            >
              <span style={{ width: 9, height: 9, borderRadius: '50%', background: PALETTE.ruleStrong, opacity: .4 }} />
              <span style={{ width: 9, height: 9, borderRadius: '50%', background: PALETTE.ruleStrong, opacity: .4 }} />
              <span style={{ width: 9, height: 9, borderRadius: '50%', background: PALETTE.ruleStrong, opacity: .4 }} />
              <span style={{ marginLeft: 6, fontFamily: FONTS.mono, fontSize: 10, letterSpacing: '.14em', color: PALETTE.concrete, textTransform: 'uppercase' }}>
                dpo2u-driver output
              </span>
            </div>
            <pre
              style={{
                padding: 20,
                fontFamily: FONTS.mono,
                fontSize: 12.5, lineHeight: 1.7,
                color: PALETTE.ink,
                margin: 0,
                overflowX: 'auto',
                whiteSpace: 'pre',
              }}
            >
{`$ cargo run -p dpo2u-driver -- --verbose
┌─ DPO2U compliance proof ────────────┐
│ threshold          : 70              │
│ subject_commitment : 0x0913644c…     │
│ meets_threshold    : true            │
│ score              : [PRIVATE]       │
│ proof size         : 356 bytes       │
└──────────────────────────────────────┘
✓ on-chain verification succeeded
✓ attestation PDA: 71b2EPzr… [Explorer↗]`}
            </pre>
          </div>
        </div>
      </section>

      {/* Run it yourself */}
      <section className="px-6 lg:px-14 py-24" style={{ borderBottom: `.5px solid ${PALETTE.rule}` }}>
        <div style={{ maxWidth: 720 }}>
          <SmallLabel style={{ marginBottom: 16 }}>§ V · 60-SECOND DEMO</SmallLabel>
          <h2
            style={{
              fontFamily: FONTS.display, fontWeight: 500,
              lineHeight: 1.05, letterSpacing: '-.03em',
              margin: 0,
            }}
            className="text-[36px] sm:text-[48px] lg:text-[56px]"
          >
            Run the proof <span style={{ fontStyle: 'italic' }}>yourself.</span>
          </h2>
          <p style={{ fontFamily: FONTS.body, fontSize: 17, lineHeight: 1.6, color: PALETTE.inkSoft, marginTop: 24 }}>
            No SP1 setup. No validator config. Fixtures committed to the repo — clone,{' '}
            <code style={{ fontFamily: FONTS.mono, color: PALETTE.terracotta }}>cargo run</code>, watch the Explorer link print in your terminal.
          </p>
          <div
            style={{
              marginTop: 24,
              background: PALETTE.paper2,
              border: `.5px solid ${PALETTE.ruleStrong}`,
              padding: 20,
              borderRadius: 4,
            }}
          >
            <pre
              style={{
                fontFamily: FONTS.mono,
                fontSize: 13, lineHeight: 1.75,
                color: PALETTE.ink, margin: 0,
                overflowX: 'auto',
                whiteSpace: 'pre',
              }}
            >
{`git clone https://github.com/fredericosanntana/coming-soon-dpo2u-solana
cd coming-soon-dpo2u-solana && cargo run -p dpo2u-driver`}
            </pre>
          </div>
          <div className="mt-10 flex gap-3 flex-wrap">
            <Button kind="terracotta" href="https://github.com/fredericosanntana/dpo2u-solana">
              Clone the repo →
            </Button>
            <Button kind="ghost" href="https://github.com/fredericosanntana/dpo2u-solana/blob/main/docs/HACKATHON.md">
              Read the pitch
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
