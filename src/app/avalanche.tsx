/**
 * /avalanche — DPO2U on Avalanche (C-Chain, Fuji testnet).
 *
 * Shared with the Team1 Brazil chapter and used as evidence for the Team1 mini grant.
 * Sealed editorial vocabulary, same as /protocol and /psav. Every address and tx
 * below comes from dpo2u-avalanche/deployments/fuji.json and is verified on Snowtrace.
 *
 * Copy rule (from /psav): the seal proves integrity and date of an evaluation;
 * it does not, on its own, prove compliance.
 */
import React from 'react';
import { usePageHead } from '@/lib/page-head';
import { Button, FONTS, PALETTE, Rule, SmallLabel, WaxSeal } from '@/components/sealed/atoms';

const SNOWTRACE = 'https://testnet.snowtrace.io';
const REPO = 'https://github.com/fredericosanntana/dpo2u-avalanche';
const CONTACT = 'mailto:contato@dpo2u.com.br?subject=' + encodeURIComponent('DPO2U on Avalanche');

// Same darker terracotta as /psav: the global token misses 4.5:1 on small text.
const TERRA = '#A84A2D';
const terraButton: React.CSSProperties = { background: TERRA, border: `1px solid ${TERRA}` };

const STATS = [
  { value: '7', label: 'contracts live on Fuji, verified on Snowtrace' },
  { value: 'SP1 v6.1', label: 'Groth16 proofs verified on the C-Chain' },
  { value: '122', label: 'tests in the open-source repo (MIT)' },
  { value: '3', label: 'use cases configured: PSAV partner, safeguard, Travel Rule' },
];

const STEPS = [
  { n: '01', h: 'Evaluate', p: 'The DPO2U gateway runs versioned rule packs (PSAV partner, safeguard, Travel Rule) over the evidence. Only hashes leave the client. The pack hash goes on-chain.' },
  { n: '02', h: 'Prove', p: 'An SP1 zero-knowledge proof shows the result (score ≥ threshold, reserves ≥ liabilities) without revealing the inputs.' },
  { n: '03', h: 'Seal', p: 'The C-Chain verifies the Groth16 proof and writes a seal with origin, pack version and a mandatory expiry.' },
  { n: '04', h: 'Enforce', p: 'Any contract asks the PassportOracle or the TravelRuleGate before it settles. No valid passport, no transfer.' },
];

const CONTRACTS = [
  { name: 'SP1Verifier', note: 'Groth16, SP1 v6.1.0', address: '0xA9EF51126b02DDb8C284C424EfC4C54893d5979E', p: 'Verifies SP1 zero-knowledge proofs on the C-Chain. Vendored unmodified from Succinct.' },
  { name: 'ComplianceRegistry', note: 'the seal', address: '0xc997C83FbF40c70867b9A969a2AC2ee2Ae87C4cE', p: 'PASS, FAIL or REVIEW per subject and use case, with origin, pack hash, mandatory expiry and revocation.' },
  { name: 'ZkThresholdAttestor', note: 'score stays private', address: '0x0a48471953bEFaEDE2f75E0D9A54f0EAFe68B9B7', p: 'Proves score ≥ threshold with a Groth16 proof and seals a machine-origin PASS. The score never touches the chain.' },
  { name: 'PassportOracle', note: 'admin: 2-of-3 Safe', address: '0x27bb394d3fFdD7DDc5bb67F8C8Ee64073BeDF2b2', p: 'Conformity passport per counterparty, issued only on top of a usable seal. Contracts call isValid() before dealing.' },
  { name: 'TravelRuleGate', note: 'travel_rule_v1', address: '0xCB53038Bf6105F00F9FD48Fa22d0f77b6BE93834', p: 'An operator action runs only with operator, validity, anti-replay, intent binding and a Travel Rule PASS.' },
  { name: 'SolvencyRegistry', note: 'proof of reserves', address: '0x92d194d2766394F917Aca20c6b8881De1F5db97b', p: 'Solvent or not, proven with SP1 over signed custody and ledger feeds, without exposing balances.' },
  { name: 'MidnightRelay', note: 'k-of-n relayers', address: '0xeF52a2F26E0A5E558A87b34Bd98E910F3F64D845', p: 'Brings private compliance seals from Midnight to Avalanche. Each operator runs its own key and node.' },
];

const PROOFS = [
  { h: 'Real SP1 Groth16 proof verified on-chain', tx: '0xbb82fac5972b72f930538d404afb941be3a7e12d46578d4c2185987c5e630706' },
  { h: 'First solvency seal (SP1 proof of reserves, labelled test data)', tx: '0x0663f0c23fc7a2435d54fcd1f892ad5be62933bc428ab53ae9ef8548f59593a2' },
  { h: 'First Midnight → Fuji relayed seal (labelled test subject)', tx: '0x66f356b299fae0271be3e305f69b883bae0fe6e0d11a46042a6a75d4be2a1e4a' },
];

const ROADMAP = [
  { tag: 'Done', color: PALETTE.verdigris, h: 'C-Chain core', items: ['SP1 verifier and compliance registry', 'ZK threshold attestor', 'PassportOracle, admin under a 2-of-3 Safe', 'Travel Rule gate', 'Solvency registry (SP1 proof of reserves)', 'Midnight → Avalanche relay'] },
  { tag: 'Next', color: TERRA, h: 'Real institutions', items: ['First PSAV seal with a real partner and a named reviewer', 'Solvency with real custody and ledger feeds', 'Legal source manifest on-chain', 'SDK and docs for integrators'] },
  { tag: 'Then', color: PALETTE.concrete, h: 'Compliance L1', items: ['Permissioned Avalanche L1 for institutions', 'Validator governance and allowlists', 'Passport mirrored across L1s via ICM / Teleporter', 'Native token design'] },
];

const INVARIANTS = [
  'REVIEW and FAIL are never valid. Every seal expires. A seal is written once.',
  'Verifier and program keys are immutable.',
  'Without a real proof or signer, the system records REVIEW. It never fakes a PASS.',
  'The seal proves the integrity and date of an evaluation. On its own, it does not prove compliance.',
];

const h2: React.CSSProperties = { fontFamily: FONTS.display, fontWeight: 500, lineHeight: 1.05, letterSpacing: '-.03em', margin: 0 };
const card: React.CSSProperties = { background: PALETTE.paper2, border: `.5px solid ${PALETTE.ruleStrong}`, borderRadius: 4 };
const mono: React.CSSProperties = { fontFamily: FONTS.mono, fontSize: 12, letterSpacing: '.12em', textTransform: 'uppercase', color: TERRA };
const short = (a: string) => `${a.slice(0, 6)}…${a.slice(-4)}`;
const ext = { target: '_blank', rel: 'noreferrer' } as const;

export default function AvalanchePage() {
  usePageHead({
    title: 'DPO2U on Avalanche — compliance seals on the C-Chain | DPO2U',
    description: 'DPO2U on Avalanche Fuji: seven verified contracts. SP1 Groth16 proofs verified on the C-Chain, a compliance registry, a conformity passport any contract can check, a Travel Rule gate, proof of reserves and a Midnight relay.',
    path: '/avalanche',
  });

  return (
    <div style={{ color: PALETTE.ink, fontFamily: FONTS.body }}>
      {/* Hero */}
      <section className="px-6 lg:px-14 pt-16 lg:pt-24 pb-16" aria-labelledby="avax-hero">
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-12 items-start">
          <div>
            <SmallLabel style={{ marginBottom: 16, color: TERRA }}>Protocol · Avalanche C-Chain · Live on Fuji</SmallLabel>
            <h1 id="avax-hero" style={{ ...h2, lineHeight: 1.02, letterSpacing: '-.035em' }} className="text-[44px] sm:text-[60px] lg:text-[76px]">
              Compliance as a protocol.<br />
              <span style={{ fontStyle: 'italic', color: TERRA }}>On Avalanche.</span>
            </h1>
            <p className="mt-7 text-[18px] leading-[1.6] max-w-[60ch]" style={{ color: PALETTE.inkSoft }}>
              DPO2U turns regulation into seals that any smart contract can check. Institutions, banks and crypto asset service
              providers prove the result of a compliance evaluation with a zero-knowledge proof. The verdict is public; the data stays with them.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button kind="terracotta" href="#contracts" style={terraButton}>See it on-chain →</Button>
              <Button kind="ghost" href={REPO}>Read the code</Button>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end pt-2">
            <WaxSeal size={180} label="AVALANCHE" />
          </div>
        </div>

        <div className="mt-14 grid grid-cols-2 lg:grid-cols-4" style={{ border: `.5px solid ${PALETTE.ruleStrong}`, background: PALETTE.paper2 }}>
          {STATS.map((s, i) => (
            <div key={s.label} style={{ padding: '24px 22px', borderRight: i < STATS.length - 1 ? `.5px solid ${PALETTE.rule}` : 'none' }}>
              <div style={{ fontFamily: FONTS.display, fontSize: 32, fontWeight: 500, letterSpacing: '-.02em', lineHeight: 1.05 }}>{s.value}</div>
              <div className="mt-2 text-[14px] leading-[1.45]" style={{ color: PALETTE.inkSoft }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <Rule />

      {/* Problem */}
      <section className="px-6 lg:px-14 py-16 lg:py-20" aria-labelledby="avax-problem">
        <SmallLabel style={{ marginBottom: 16 }}>§ 01 · The problem</SmallLabel>
        <h2 id="avax-problem" style={h2} className="text-[30px] sm:text-[40px] max-w-[26ch]">
          Regulation lives in PDFs. Smart contracts cannot read it<span style={{ color: TERRA }}>.</span>
        </h2>
        <p className="mt-6 text-[17px] leading-[1.6] max-w-[68ch]" style={{ color: PALETTE.inkSoft }}>
          Brazil's Central Bank rules for virtual asset providers (Res. BCB 519, 520 and 521/2025), the Travel Rule and the LGPD make every
          institution answer for its counterparties. Today that diligence is questionnaires, PDFs and trust: nothing a settlement contract can
          check before it moves value, and nothing an institution can publish without exposing client data.
        </p>
      </section>

      <Rule />

      {/* How it works */}
      <section className="px-6 lg:px-14 py-16 lg:py-20" aria-labelledby="avax-how">
        <SmallLabel style={{ marginBottom: 16 }}>§ 02 · How it works</SmallLabel>
        <h2 id="avax-how" style={h2} className="text-[30px] sm:text-[40px]">Four steps<span style={{ color: TERRA }}>.</span></h2>
        <ol className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-0 list-none">
          {STEPS.map((s) => (
            <li key={s.n} className="p-6" style={card}>
              <div style={{ fontFamily: FONTS.mono, fontSize: 13, color: TERRA }}>{s.n}</div>
              <h3 className="mt-2 text-[22px]" style={{ fontFamily: FONTS.display, fontWeight: 500, margin: 0 }}>{s.h}</h3>
              <p className="mt-2 text-[15px] leading-[1.55]" style={{ color: PALETTE.inkSoft }}>{s.p}</p>
            </li>
          ))}
        </ol>
      </section>

      <Rule />

      {/* Contracts */}
      <section id="contracts" className="px-6 lg:px-14 py-16 lg:py-20" aria-labelledby="avax-live">
        <SmallLabel style={{ marginBottom: 16 }}>§ 03 · Live on Fuji · chain 43113</SmallLabel>
        <h2 id="avax-live" style={h2} className="text-[30px] sm:text-[40px] max-w-[24ch]">
          Seven contracts, verified on Snowtrace<span style={{ color: TERRA }}>.</span>
        </h2>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CONTRACTS.map((c) => (
            <a key={c.address} href={`${SNOWTRACE}/address/${c.address}`} {...ext} className="p-6 block" style={{ ...card, color: PALETTE.ink, textDecoration: 'none' }}>
              <div style={mono}>{c.note}</div>
              <h3 className="mt-2 text-[20px]" style={{ fontFamily: FONTS.display, fontWeight: 500, margin: 0 }}>{c.name}</h3>
              <p className="mt-2 text-[14.5px] leading-[1.55]" style={{ color: PALETTE.inkSoft }}>{c.p}</p>
              <div className="mt-4" style={{ fontFamily: FONTS.mono, fontSize: 13, color: PALETTE.concrete }}>{short(c.address)} ↗</div>
            </a>
          ))}
        </div>

        <h3 className="text-[24px]" style={{ fontFamily: FONTS.display, fontWeight: 500, margin: "56px 0 0" }}>Proof it runs</h3>
        <div className="mt-6" style={{ borderTop: `.5px solid ${PALETTE.ruleStrong}` }}>
          {PROOFS.map((p) => (
            <a key={p.tx} href={`${SNOWTRACE}/tx/${p.tx}`} {...ext}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-4"
              style={{ borderBottom: `.5px solid ${PALETTE.ruleStrong}`, color: PALETTE.ink, textDecoration: 'none' }}>
              <span className="text-[16px]">{p.h}</span>
              <span style={{ fontFamily: FONTS.mono, fontSize: 13, color: TERRA }}>tx {short(p.tx)} ↗</span>
            </a>
          ))}
        </div>
      </section>

      <Rule />

      {/* Invariants */}
      <section className="px-6 lg:px-14 py-16 lg:py-20" aria-labelledby="avax-trust">
        <SmallLabel style={{ marginBottom: 16 }}>§ 04 · Invariants</SmallLabel>
        <h2 id="avax-trust" style={h2} className="text-[30px] sm:text-[40px] max-w-[24ch]">
          No pending verdict ever shows as approved<span style={{ color: TERRA }}>.</span>
        </h2>
        <ul className="mt-8 pl-5 text-[15.5px] leading-[1.75] max-w-[72ch]">
          {INVARIANTS.map((i) => <li key={i}>{i}</li>)}
        </ul>
      </section>

      <Rule />

      {/* Roadmap */}
      <section className="px-6 lg:px-14 py-16 lg:py-20" aria-labelledby="avax-roadmap">
        <SmallLabel style={{ marginBottom: 16 }}>§ 05 · Roadmap</SmallLabel>
        <h2 id="avax-roadmap" style={h2} className="text-[30px] sm:text-[40px] max-w-[24ch]">
          From testnet to a compliance L1<span style={{ color: TERRA }}>.</span>
        </h2>
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-4">
          {ROADMAP.map((r) => (
            <div key={r.h} className="p-6" style={{ ...card, borderTop: `3px solid ${r.color}` }}>
              <div style={{ ...mono, color: r.color }}>{r.tag}</div>
              <h3 className="mt-2 text-[20px]" style={{ fontFamily: FONTS.display, fontWeight: 500, margin: 0 }}>{r.h}</h3>
              <ul className="mt-4 pl-5 text-[14.5px] leading-[1.7]" style={{ color: PALETTE.inkSoft }}>
                {r.items.map((i) => <li key={i}>{i}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <Rule />

      {/* Team + CTA */}
      <section className="px-6 lg:px-14 py-16 lg:py-20" aria-labelledby="avax-team">
        <SmallLabel style={{ marginBottom: 16 }}>§ 06 · Who builds it</SmallLabel>
        <h2 id="avax-team" style={h2} className="text-[30px] sm:text-[40px] max-w-[24ch]">
          Built in Brazil, for Avalanche<span style={{ color: TERRA }}>.</span>
        </h2>
        <p className="mt-6 text-[17px] leading-[1.6] max-w-[68ch]" style={{ color: PALETTE.inkSoft }}>
          Founded by Frederico Santana, a DPO with 15 years in data protection and co-author of the ERC-8004 specification. Collaborator in the
          Team1 Brazil chapter. The same compliance engine already anchors seals on Midnight, Stellar and Solana; Avalanche is its first full
          reference implementation on an EVM chain.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button kind="terracotta" href={CONTACT} style={terraButton}>Talk to us →</Button>
          <Button kind="ghost" href={REPO}>dpo2u-avalanche on GitHub</Button>
          <Button kind="ghost" href="/psav">The PSAV-partner standard</Button>
        </div>
      </section>

      <section className="px-6 lg:px-14 pb-16" aria-label="Notice">
        <Rule style={{ marginBottom: 20 }} />
        <p className="text-[13px] leading-[1.6]" style={{ color: PALETTE.concrete }}>
          Testnet deployment on Avalanche Fuji (chain 43113). Not on mainnet. Seals marked as test data use labelled test subjects and no real
          documents. Addresses and transactions come from the repository's deployments/fuji.json. Page updated on 11/11/2026.
        </p>
      </section>
    </div>
  );
}
