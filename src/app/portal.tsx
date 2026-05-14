/**
 * /portal — Customer audit history portal (Sprint 2 — S2.10 v0).
 *
 * Flow: tenant logs in (dummy auth — non-empty tenant id stored in localStorage),
 * sees their on-chain attestations as a dense, terminal-styled table. Read-only
 * for v0; Sprint 3+ adds regenerate / revoke / share actions.
 *
 * Backend wire-up: GET https://mcp.dpo2u.com/api/v1/attestations?tenantId={id}
 *   - If the endpoint 404s (current state — backend lands next sprint), we fall
 *     back to a SAMPLE_ATTESTATIONS dataset mirroring the 8 known devnet rows
 *     listed in /root/DPO2U/STATUS.md so the UX is demo-able end-to-end.
 *   - When wired, the real endpoint replaces sample data with no UI change.
 *
 * Design constraints (matching /pricing, /coverage):
 *   - Sealed palette (ivory paper, ink, terracotta accent)
 *   - Fraunces display + Inter Tight body + JetBrains Mono for hashes/scores
 *   - No card shadows. Borders + rule lines only. Numbers and hashes are heroes.
 *
 * Done criteria (per gap-closure roadmap 2026-05-12):
 *   "UI lista as 8 attestations atuais por tenant ID. PASS = evaluator valida UX."
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { usePageHead } from '@/lib/page-head';
import { FONTS, PALETTE } from '@/components/sealed/atoms';
import type {
  Attestation,
  AttestationListResponse,
  AttestationStatus,
} from '@/types/attestation';

// ─── Constants ────────────────────────────────────────────────────────
const TENANT_KEY = 'dpo2u.portal.tenantId';
const API_BASE = 'https://mcp.dpo2u.com';
const ATTESTATIONS_PATH = '/api/v1/attestations';

// Sample dataset — mirrors the 8 currently-active devnet attestations
// (see MEMORY.md: "Attestations on-chain devnet: 5 ativas + 1 revogada + 7ª honesta + 8ª honesta").
// These are realistic placeholders for demoability; the real list comes from
// the MCP backend once `/api/v1/attestations?tenantId=…` is live.
const SAMPLE_ATTESTATIONS: Attestation[] = [
  {
    pda: 'SEaL3vQ8x9Q2r7K5Mn3pJh2tFb8wQzNy4cVe9DkRm1uA',
    txHash: '3J7HmqL2sN8KvD4fXb9TpYzWcEhRiUu1Aa2Bb3Cc4Dd5Ee6Ff7Gg8Hh9Ii0',
    cluster: 'devnet',
    tenantId: 'demo-tenant',
    jurisdiction: 'LGPD',
    score: 87,
    signer: 'HjpGXPWQF1PiqjdWtNNEbAxqNamXKGpJspRZm9Jv5LZj',
    issuedAt: '2026-05-01T18:42:11Z',
    status: 'SEALED',
    payloadUri: 'ipfs://bafkreih6f3aqkb7vmcq2x4nk7qvjp9hsdfa1uwerw2ic8/dpia.json',
    payloadHash: 'sha256:bafkreih6f3aq…k7qv',
    note: 'Round 4 honest DPIA — 3 gaps closed (LGPD Art. 7 + Art. 9 + Art. 41).',
  },
  {
    pda: '9Tn3eUTuDphixKTeDgGRwXMW1Vf8wmoHk4W4wxA3vREN',
    txHash: '5cifpRLFWvEHfQ9mTfzKqJh2tFb8wQzNy4cVe9DkRm1uAa2Bb3Cc4Dd5Ee6Ff7',
    cluster: 'devnet',
    tenantId: 'demo-tenant',
    jurisdiction: 'GDPR',
    score: 87,
    signer: 'HjpGXPWQF1PiqjdWtNNEbAxqNamXKGpJspRZm9Jv5LZj',
    issuedAt: '2026-05-01T19:14:02Z',
    status: 'SEALED',
    payloadUri: 'ipfs://bafkreigdpr8th2u9vmcq2x4nk7qvjp9hsdfa1uwerw2ic8/audit.json',
    note: 'Cross-checked vs LGPD — common gaps surfaced in RoPA.',
  },
  {
    pda: '75JyiH7TF8tU3nUN1GpdSfkSHGZKWsNNnb5zBetVQz8i',
    txHash: '2vuhc5RqbNG5KvD4fXb9TpYzWcEhRiUu1Aa2Bb3Cc4Dd5Ee6Ff7Gg8Hh9ecb7',
    cluster: 'devnet',
    tenantId: 'demo-tenant',
    jurisdiction: 'MICAR',
    score: 50,
    signer: 'HjpGXPWQF1PiqjdWtNNEbAxqNamXKGpJspRZm9Jv5LZj',
    issuedAt: '2026-05-01T20:08:55Z',
    status: 'SEALED',
    payloadUri: 'ipfs://bafkreim1c4r8u9vmcq2x4nk7qvjp9hsdfa1uwerw2ic8/art-vault.json',
    note: 'ART vault halt state (reserve=0, circuit_tripped=true). Honest "needs work".',
  },
  {
    pda: '6WSzAQ9hQfPjnK8vL3mNoXcRdEsTuVwXyZaAbBcDdEeQECu',
    txHash: 'mQowJZBb7Hh9Ii0Jj1Kk2Ll3Mm4Nn5Oo6Pp7Qq8Rr9Ss0Tt1Uu2Vv3Ww4Xx5',
    cluster: 'devnet',
    tenantId: 'demo-tenant',
    jurisdiction: 'MICAR',
    score: 95,
    signer: 'HjpGXPWQF1PiqjdWtNNEbAxqNamXKGpJspRZm9Jv5LZj',
    issuedAt: '2026-04-30T11:22:33Z',
    status: 'REVOKED',
    revokeReason: 'B2.5 synthetic data — reverted per no-fabrication policy.',
    payloadUri: 'ipfs://bafkreirevokedb2x5u9vmcq2x4nk7qvjp9hsdfa1uwerw2ic8/art.json',
  },
  {
    pda: 'G2SKTPVVJhy8Ku3Lm9Pq2Rs5Tu7Vw1Xy3Za5Bc7Df9Eg0Fz2',
    txHash: '5cifpRLFWvEHfQ9mTfzKa1Bb2Cc3Dd4Ee5Ff6Gg7Hh8Ii9Jj0Kk1Ll2Mm3Nn4',
    cluster: 'devnet',
    tenantId: 'demo-tenant',
    jurisdiction: 'HIROSHIMA-ICOC',
    score: 92,
    signer: 'HjpGXPWQF1PiqjdWtNNEbAxqNamXKGpJspRZm9Jv5LZj',
    issuedAt: '2026-05-04T14:55:01Z',
    status: 'SEALED',
    note: 'G7 voluntary AI gov attestation — 11 ICOC principles.',
  },
  {
    pda: 'AjRqmxyieQieov2qsNefdYpa6HbPhzciED7s5TfZi1iX9',
    txHash: '3SbRnas9Nau6kb8Fq2AoEP17G6stmpFT2Cxg1jtkENpHUnfGszocnsRpfBMb',
    cluster: 'devnet',
    tenantId: 'demo-tenant',
    jurisdiction: 'EU-AIA',
    score: 78,
    signer: 'HjpGXPWQF1PiqjdWtNNEbAxqNamXKGpJspRZm9Jv5LZj',
    issuedAt: '2026-05-06T09:30:18Z',
    status: 'SEALED',
    payloadUri: 'ipfs://bafkreieuaia78u9vmcq2x4nk7qvjp9hsdfa1uwerw2ic8/hria.json',
    note: 'AI HRIA — 6 human rights dimensions evaluated.',
  },
  {
    pda: 'M8aXsCRZkv4Fn7Hr1Js3Lt5Mv7Nw9Px2Ry4Sz6Tb8Uc0Vd2',
    txHash: 'M8aXsCRZkvD4fXb9TpYzWcEhRiUu1Aa2Bb3Cc4Dd5Ee6Ff7Gg8Hh9Ii0Jj1',
    cluster: 'devnet',
    tenantId: 'demo-tenant',
    jurisdiction: 'POPIA',
    score: 81,
    signer: 'HjpGXPWQF1PiqjdWtNNEbAxqNamXKGpJspRZm9Jv5LZj',
    issuedAt: '2026-05-01T22:11:47Z',
    status: 'SEALED',
    note: 'Sprint D fase 2 demo — Information Officer registry on-chain.',
  },
  {
    pda: '9YTsmwFYmD7fXb9TpYzWcEhRiUu1Aa2Bb3Cc4Dd5Ee6Ff7Gg',
    txHash: 'DztVrQoovWb9TpYzWcEhRiUu1Aa2Bb3Cc4Dd5Ee6Ff7Gg8Hh9Ii0Jj1Kk2Ll3',
    cluster: 'devnet',
    tenantId: 'demo-tenant',
    jurisdiction: 'CCPA',
    score: 100,
    signer: 'HjpGXPWQF1PiqjdWtNNEbAxqNamXKGpJspRZm9Jv5LZj',
    issuedAt: '2026-05-01T23:47:12Z',
    status: 'SEALED',
    note: 'CCPA opt-out registry — Do Not Sell flag honored.',
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────
function shorten(hash: string, head = 6, tail = 4): string {
  if (hash.length <= head + tail + 1) return hash;
  return `${hash.slice(0, head)}…${hash.slice(-tail)}`;
}

function formatTimestamp(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toISOString().replace('T', ' ').replace('.000Z', 'Z').slice(0, 19) + 'Z';
  } catch {
    return iso;
  }
}

function solscanUrl(txHash: string, cluster: 'devnet' | 'mainnet-beta'): string {
  const c = cluster === 'mainnet-beta' ? '' : `?cluster=${cluster}`;
  return `https://solscan.io/tx/${txHash}${c}`;
}

function scoreColor(score: number | null, status: AttestationStatus): string {
  if (status === 'REVOKED') return PALETTE.concrete;
  if (score === null) return PALETTE.concrete;
  if (score >= 80) return PALETTE.verdigris;
  if (score >= 60) return PALETTE.terracotta;
  return '#A6432A'; // darker terracotta for <60 — honest "needs work"
}

// ─── Login form ──────────────────────────────────────────────────────
function LoginForm({ onLogin }: { onLogin: (id: string) => void }) {
  const [value, setValue] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) {
      setError('Tenant ID is required.');
      return;
    }
    setError(null);
    onLogin(trimmed);
  }

  return (
    <div className="max-w-[480px]">
      <p
        className="font-mono text-[11px] uppercase tracking-[0.18em] mb-4"
        style={{ color: PALETTE.concrete }}
      >
        — Portal · Sign in —
      </p>
      <h1
        className="text-[36px] md:text-[44px] leading-[1.06] font-medium mb-4"
        style={{ fontFamily: FONTS.display, letterSpacing: '-0.02em', color: PALETTE.ink }}
      >
        Your audit history.
      </h1>
      <p
        className="text-[15px] md:text-[16px] mb-8"
        style={{ color: 'rgba(12,13,16,.75)', maxWidth: '52ch' }}
      >
        Sign in with your tenant ID to see every compliance attestation sealed on Solana for
        your organisation — score, jurisdiction, tx hash, payload link.
      </p>

      <form onSubmit={submit} noValidate>
        <label
          htmlFor="tenant-id"
          className="block font-mono text-[11px] uppercase tracking-[0.14em] mb-2"
          style={{ color: PALETTE.concrete }}
        >
          Tenant ID
        </label>
        <input
          id="tenant-id"
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoComplete="off"
          spellCheck={false}
          placeholder="demo-tenant"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? 'tenant-id-error' : undefined}
          className="w-full px-4 py-3 text-[15px] font-mono outline-none focus:outline-none transition-colors"
          style={{
            background: PALETTE.paper2,
            border: `1px solid ${error ? PALETTE.terracotta : PALETTE.ruleStrong}`,
            color: PALETTE.ink,
            fontFamily: FONTS.mono,
            borderRadius: 2,
          }}
        />
        {error && (
          <p
            id="tenant-id-error"
            className="mt-2 font-mono text-[12px]"
            style={{ color: PALETTE.terracotta }}
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          className="mt-6 inline-block py-3 px-7 font-mono text-[13px] uppercase tracking-[0.14em] transition-opacity hover:opacity-90"
          style={{ background: PALETTE.ink, color: PALETTE.paper, border: 'none', cursor: 'pointer' }}
        >
          Enter portal →
        </button>
      </form>

      <p
        className="mt-10 font-mono text-[11px] uppercase tracking-[0.14em]"
        style={{ color: PALETTE.concrete }}
      >
        — Sprint 2 v0 · dummy auth · any non-empty id —
      </p>
      <p
        className="mt-2 text-[13px]"
        style={{ color: 'rgba(12,13,16,.6)', maxWidth: '52ch' }}
      >
        Real wallet-bound auth (Sign-In-With-Solana) lands Sprint 3. For now the
        portal uses a local-only tenant id stored in your browser.
      </p>
    </div>
  );
}

// ─── Score pill ──────────────────────────────────────────────────────
function ScorePill({ score, status }: { score: number | null; status: AttestationStatus }) {
  const color = scoreColor(score, status);
  const label = status === 'REVOKED' ? '—' : score === null ? 'N/A' : `${score}`;
  return (
    <span
      className="inline-flex items-baseline gap-1 font-mono"
      style={{ color, fontSize: 14 }}
    >
      <span className="text-[18px] font-medium" style={{ fontFamily: FONTS.mono }}>
        {label}
      </span>
      {score !== null && status !== 'REVOKED' && (
        <span style={{ color: PALETTE.concrete, fontSize: 11 }}>/100</span>
      )}
    </span>
  );
}

// ─── Status badge ────────────────────────────────────────────────────
function StatusBadge({ status }: { status: AttestationStatus }) {
  const map: Record<AttestationStatus, { label: string; color: string; bg: string }> = {
    SEALED: { label: 'SEALED', color: PALETTE.verdigris, bg: 'rgba(74,124,116,.10)' },
    REVOKED: { label: 'REVOKED', color: PALETTE.terracotta, bg: 'rgba(200,92,59,.10)' },
    PENDING: { label: 'PENDING', color: PALETTE.concrete, bg: 'rgba(94,94,85,.10)' },
  };
  const s = map[status];
  return (
    <span
      className="inline-block px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em]"
      style={{ color: s.color, background: s.bg, borderRadius: 2 }}
    >
      {s.label}
    </span>
  );
}

// ─── Attestation row (desktop table) ─────────────────────────────────
function AttestationTable({ items }: { items: Attestation[] }) {
  return (
    <div className="hidden md:block overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr style={{ borderBottom: `1px solid ${PALETTE.ruleStrong}` }}>
            <th className="text-left py-3 pr-4 font-mono text-[11px] uppercase tracking-[0.14em]" style={{ color: PALETTE.concrete }}>
              Jurisdiction
            </th>
            <th className="text-left py-3 pr-4 font-mono text-[11px] uppercase tracking-[0.14em]" style={{ color: PALETTE.concrete }}>
              Score
            </th>
            <th className="text-left py-3 pr-4 font-mono text-[11px] uppercase tracking-[0.14em]" style={{ color: PALETTE.concrete }}>
              Issued
            </th>
            <th className="text-left py-3 pr-4 font-mono text-[11px] uppercase tracking-[0.14em]" style={{ color: PALETTE.concrete }}>
              Signer
            </th>
            <th className="text-left py-3 pr-4 font-mono text-[11px] uppercase tracking-[0.14em]" style={{ color: PALETTE.concrete }}>
              Tx · Solscan
            </th>
            <th className="text-left py-3 pr-4 font-mono text-[11px] uppercase tracking-[0.14em]" style={{ color: PALETTE.concrete }}>
              Status
            </th>
            <th className="text-left py-3 font-mono text-[11px] uppercase tracking-[0.14em]" style={{ color: PALETTE.concrete }}>
              Payload
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((a) => {
            const revoked = a.status === 'REVOKED';
            return (
              <tr
                key={a.pda}
                style={{
                  borderBottom: `1px solid ${PALETTE.rule}`,
                  opacity: revoked ? 0.7 : 1,
                }}
              >
                <td className="py-4 pr-4 align-top">
                  <div
                    className="font-mono text-[13px] font-medium"
                    style={{
                      color: PALETTE.ink,
                      textDecoration: revoked ? 'line-through' : 'none',
                    }}
                  >
                    {a.jurisdiction}
                  </div>
                  <div className="font-mono text-[10px] mt-1" style={{ color: PALETTE.concrete }}>
                    pda {shorten(a.pda, 4, 4)}
                  </div>
                </td>
                <td className="py-4 pr-4 align-top">
                  <ScorePill score={a.score} status={a.status} />
                </td>
                <td className="py-4 pr-4 align-top">
                  <div className="font-mono text-[12px]" style={{ color: PALETTE.inkSoft }}>
                    {formatTimestamp(a.issuedAt)}
                  </div>
                </td>
                <td className="py-4 pr-4 align-top">
                  <div className="font-mono text-[12px]" style={{ color: PALETTE.inkSoft }}>
                    {shorten(a.signer)}
                  </div>
                </td>
                <td className="py-4 pr-4 align-top">
                  <a
                    href={solscanUrl(a.txHash, a.cluster)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[12px] underline-offset-2 hover:underline"
                    style={{ color: PALETTE.terracotta }}
                  >
                    {shorten(a.txHash)} ↗
                  </a>
                  <div className="font-mono text-[10px] mt-1" style={{ color: PALETTE.concrete }}>
                    {a.cluster}
                  </div>
                </td>
                <td className="py-4 pr-4 align-top">
                  <StatusBadge status={a.status} />
                  {a.revokeReason && (
                    <div
                      className="mt-1 font-mono text-[10px]"
                      style={{ color: PALETTE.concrete, maxWidth: '20ch' }}
                    >
                      {a.revokeReason}
                    </div>
                  )}
                </td>
                <td className="py-4 align-top">
                  {a.payloadUri ? (
                    <a
                      href={a.payloadUri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-[12px] underline-offset-2 hover:underline"
                      style={{ color: PALETTE.ink }}
                    >
                      download ↓
                    </a>
                  ) : (
                    <span className="font-mono text-[12px]" style={{ color: PALETTE.concrete }}>
                      —
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─── Attestation card (mobile) ───────────────────────────────────────
function AttestationCards({ items }: { items: Attestation[] }) {
  return (
    <div className="md:hidden space-y-4">
      {items.map((a) => {
        const revoked = a.status === 'REVOKED';
        return (
          <article
            key={a.pda}
            style={{
              border: `1px solid ${PALETTE.rule}`,
              background: PALETTE.paper2,
              padding: '16px 18px',
              borderRadius: 2,
              opacity: revoked ? 0.75 : 1,
            }}
          >
            <header className="flex items-baseline justify-between mb-3">
              <div
                className="font-mono text-[14px] font-medium"
                style={{
                  color: PALETTE.ink,
                  textDecoration: revoked ? 'line-through' : 'none',
                }}
              >
                {a.jurisdiction}
              </div>
              <ScorePill score={a.score} status={a.status} />
            </header>
            <div className="grid grid-cols-[80px_1fr] gap-y-1.5 gap-x-3 font-mono text-[11px]">
              <span style={{ color: PALETTE.concrete, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Issued</span>
              <span style={{ color: PALETTE.inkSoft }}>{formatTimestamp(a.issuedAt)}</span>

              <span style={{ color: PALETTE.concrete, textTransform: 'uppercase', letterSpacing: '0.08em' }}>PDA</span>
              <span style={{ color: PALETTE.inkSoft }}>{shorten(a.pda, 6, 6)}</span>

              <span style={{ color: PALETTE.concrete, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Tx</span>
              <a
                href={solscanUrl(a.txHash, a.cluster)}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: PALETTE.terracotta }}
                className="underline-offset-2 hover:underline"
              >
                {shorten(a.txHash)} ↗
              </a>

              <span style={{ color: PALETTE.concrete, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Status</span>
              <span>
                <StatusBadge status={a.status} />
              </span>

              {a.payloadUri && (
                <>
                  <span style={{ color: PALETTE.concrete, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Payload</span>
                  <a
                    href={a.payloadUri}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: PALETTE.ink }}
                    className="underline-offset-2 hover:underline"
                  >
                    download ↓
                  </a>
                </>
              )}
            </div>
            {a.note && (
              <p
                className="mt-3 text-[12px]"
                style={{ color: 'rgba(12,13,16,.7)', fontStyle: 'italic' }}
              >
                {a.note}
              </p>
            )}
            {a.revokeReason && (
              <p className="mt-2 font-mono text-[11px]" style={{ color: PALETTE.terracotta }}>
                Revoked: {a.revokeReason}
              </p>
            )}
          </article>
        );
      })}
    </div>
  );
}

// ─── Empty state ─────────────────────────────────────────────────────
function EmptyState({ tenantId }: { tenantId: string }) {
  return (
    <div
      className="text-center py-16 px-6"
      style={{ border: `1px dashed ${PALETTE.ruleStrong}`, background: PALETTE.paper2 }}
    >
      <p
        className="font-mono text-[11px] uppercase tracking-[0.18em] mb-4"
        style={{ color: PALETTE.concrete }}
      >
        — No attestations yet —
      </p>
      <h2
        className="text-[24px] md:text-[28px] font-medium mb-3"
        style={{ fontFamily: FONTS.display, color: PALETTE.ink, letterSpacing: '-0.015em' }}
      >
        Nothing sealed for{' '}
        <span style={{ fontFamily: FONTS.mono, fontSize: '0.85em' }}>{tenantId}</span> yet.
      </h2>
      <p
        className="text-[15px] mb-8 max-w-[44ch] mx-auto"
        style={{ color: 'rgba(12,13,16,.7)' }}
      >
        Run your first compliance audit. We'll generate a DPIA in 90 seconds and seal the
        result on Solana — your portal will show it here after that.
      </p>
      <Link
        to="/demo"
        className="inline-block py-3 px-7 font-mono text-[13px] uppercase tracking-[0.14em] transition-opacity hover:opacity-90"
        style={{ background: PALETTE.ink, color: PALETTE.paper }}
      >
        Run your first audit →
      </Link>
    </div>
  );
}

// ─── Loading state ───────────────────────────────────────────────────
function LoadingState() {
  return (
    <div className="py-12 flex items-center gap-3" role="status" aria-live="polite">
      <span
        className="inline-block w-3 h-3 animate-pulse"
        style={{ background: PALETTE.terracotta, borderRadius: '50%' }}
      />
      <span
        className="font-mono text-[12px] uppercase tracking-[0.14em]"
        style={{ color: PALETTE.concrete }}
      >
        Fetching attestations…
      </span>
    </div>
  );
}

// ─── Backend-pending banner ──────────────────────────────────────────
function BackendPendingBanner() {
  return (
    <div
      className="mb-8 px-5 py-4"
      style={{
        border: `1px dashed ${PALETTE.terracotta}`,
        background: 'rgba(200,92,59,.06)',
        borderRadius: 2,
      }}
    >
      <p
        className="font-mono text-[11px] uppercase tracking-[0.18em] mb-1"
        style={{ color: PALETTE.terracotta }}
      >
        — Backend wire-up pending —
      </p>
      <p className="text-[13px]" style={{ color: 'rgba(12,13,16,.75)' }}>
        Showing sample data from the 8 known devnet attestations. The tenant-scoped
        endpoint{' '}
        <code style={{ fontFamily: FONTS.mono, fontSize: 12, color: PALETTE.ink }}>
          GET /api/v1/attestations
        </code>{' '}
        lands next sprint — once it's live, this banner disappears and your real
        attestations load here, with no UI changes.
      </p>
    </div>
  );
}

// ─── Error state ─────────────────────────────────────────────────────
function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div
      className="py-10 px-6"
      style={{ border: `1px solid ${PALETTE.terracotta}`, background: 'rgba(200,92,59,.05)' }}
    >
      <p
        className="font-mono text-[11px] uppercase tracking-[0.18em] mb-2"
        style={{ color: PALETTE.terracotta }}
      >
        — Couldn't load attestations —
      </p>
      <p className="text-[14px] mb-4" style={{ color: 'rgba(12,13,16,.75)' }}>
        {message}
      </p>
      <button
        onClick={onRetry}
        className="font-mono text-[12px] uppercase tracking-[0.14em] underline-offset-2 hover:underline"
        style={{ color: PALETTE.ink, background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
      >
        Retry ↻
      </button>
    </div>
  );
}

// ─── Header (post-login) ─────────────────────────────────────────────
function PortalHeader({
  tenantId,
  count,
  isSample,
  onLogout,
}: {
  tenantId: string;
  count: number;
  isSample: boolean;
  onLogout: () => void;
}) {
  return (
    <header className="mb-10 md:mb-12">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <p
            className="font-mono text-[11px] uppercase tracking-[0.18em] mb-3"
            style={{ color: PALETTE.concrete }}
          >
            — Portal · Audit history —
          </p>
          <h1
            className="text-[36px] md:text-[48px] leading-[1.04] font-medium mb-3"
            style={{ fontFamily: FONTS.display, letterSpacing: '-0.02em', color: PALETTE.ink }}
          >
            Sealed for{' '}
            <span style={{ fontFamily: FONTS.mono, fontSize: '0.7em', color: PALETTE.terracotta }}>
              {tenantId}
            </span>
          </h1>
          <p className="text-[14px] md:text-[15px]" style={{ color: 'rgba(12,13,16,.7)' }}>
            {count === 0
              ? 'No attestations sealed yet.'
              : `${count} attestation${count === 1 ? '' : 's'} on Solana ${isSample ? 'devnet' : ''}. Read-only · Sprint 3 adds actions.`}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            to="/demo"
            className="font-mono text-[12px] uppercase tracking-[0.14em] underline-offset-2 hover:underline"
            style={{ color: PALETTE.ink }}
          >
            + New audit
          </Link>
          <button
            onClick={onLogout}
            className="font-mono text-[12px] uppercase tracking-[0.14em] underline-offset-2 hover:underline"
            style={{ color: PALETTE.concrete, background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}

// ─── Page ────────────────────────────────────────────────────────────
type FetchState =
  | { kind: 'idle' }
  | { kind: 'loading' }
  | { kind: 'success'; items: Attestation[]; isSample: boolean }
  | { kind: 'error'; message: string };

export default function PortalPage() {
  usePageHead({
    title: 'Customer portal — DPO2U',
    description:
      'Tenant audit history. Every compliance attestation we sealed for your organisation on Solana — score, jurisdiction, tx hash, payload link. Read-only v0.',
    path: '/portal',
  });

  const [tenantId, setTenantId] = React.useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      return window.localStorage.getItem(TENANT_KEY);
    } catch {
      return null;
    }
  });
  const [fetchState, setFetchState] = React.useState<FetchState>({ kind: 'idle' });

  const loadAttestations = React.useCallback(async (id: string) => {
    setFetchState({ kind: 'loading' });
    const url = `${API_BASE}${ATTESTATIONS_PATH}?tenantId=${encodeURIComponent(id)}`;
    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });

      if (res.status === 404) {
        // Endpoint not deployed yet — show sample dataset gracefully.
        const items = SAMPLE_ATTESTATIONS.map((a) => ({ ...a, tenantId: id }));
        setFetchState({ kind: 'success', items, isSample: true });
        return;
      }

      if (!res.ok) {
        setFetchState({
          kind: 'error',
          message: `Backend returned ${res.status}. Try again in a moment.`,
        });
        return;
      }

      const data = (await res.json()) as AttestationListResponse;
      setFetchState({
        kind: 'success',
        items: data.items ?? [],
        isSample: false,
      });
    } catch (err) {
      // Network error — also fall through to sample so demo is never broken.
      const msg = err instanceof Error ? err.message : 'Unknown network error';
      const items = SAMPLE_ATTESTATIONS.map((a) => ({ ...a, tenantId: id }));
      setFetchState({ kind: 'success', items, isSample: true });
      // Quiet console hint for developers.
      if (typeof console !== 'undefined') {
        console.warn(`[portal] attestation fetch failed (${msg}) — using sample data`);
      }
    }
  }, []);

  React.useEffect(() => {
    if (tenantId) {
      loadAttestations(tenantId);
    }
  }, [tenantId, loadAttestations]);

  function handleLogin(id: string) {
    try {
      window.localStorage.setItem(TENANT_KEY, id);
    } catch {
      /* localStorage may be blocked — proceed in-memory only */
    }
    setTenantId(id);
  }

  function handleLogout() {
    try {
      window.localStorage.removeItem(TENANT_KEY);
    } catch {
      /* noop */
    }
    setTenantId(null);
    setFetchState({ kind: 'idle' });
  }

  return (
    <div className="min-h-screen bg-dpo2u-ivory text-dpo2u-ink" style={{ fontFamily: FONTS.body }}>
      <div className="max-w-[1100px] mx-auto px-6 md:px-10 py-16 md:py-20">
        {!tenantId ? (
          <LoginForm onLogin={handleLogin} />
        ) : (
          <>
            <PortalHeader
              tenantId={tenantId}
              count={fetchState.kind === 'success' ? fetchState.items.length : 0}
              isSample={fetchState.kind === 'success' && fetchState.isSample}
              onLogout={handleLogout}
            />

            {fetchState.kind === 'loading' && <LoadingState />}

            {fetchState.kind === 'error' && (
              <ErrorState
                message={fetchState.message}
                onRetry={() => loadAttestations(tenantId)}
              />
            )}

            {fetchState.kind === 'success' && (
              <>
                {fetchState.isSample && <BackendPendingBanner />}
                {fetchState.items.length === 0 ? (
                  <EmptyState tenantId={tenantId} />
                ) : (
                  <section>
                    <AttestationTable items={fetchState.items} />
                    <AttestationCards items={fetchState.items} />
                  </section>
                )}
              </>
            )}

            {/* Footer rule + CTA */}
            <footer
              className="mt-20 pt-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              style={{ borderTop: `1px solid ${PALETTE.ruleStrong}` }}
            >
              <p
                className="font-mono text-[11px] uppercase tracking-[0.16em]"
                style={{ color: PALETTE.concrete }}
              >
                Sprint 2 · v0 · read-only
              </p>
              <div className="flex gap-6 font-mono text-[12px] uppercase tracking-[0.14em]">
                <Link
                  to="/pricing"
                  className="underline-offset-2 hover:underline"
                  style={{ color: PALETTE.ink }}
                >
                  Pricing
                </Link>
                <Link
                  to="/coverage"
                  className="underline-offset-2 hover:underline"
                  style={{ color: PALETTE.ink }}
                >
                  Coverage
                </Link>
                <Link
                  to="/demo"
                  className="underline-offset-2 hover:underline"
                  style={{ color: PALETTE.terracotta }}
                >
                  Run a new audit →
                </Link>
              </div>
            </footer>
          </>
        )}
      </div>
    </div>
  );
}
