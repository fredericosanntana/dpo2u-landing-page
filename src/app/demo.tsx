/**
 * /demo — Interactive "Try the LGPD audit" 90s flow.
 *
 * 5-field form → POST /api/demo/audit → rendered DPIA markdown com watermark
 * "DEMO — Not for production". Fecha gap FTUE 3/10 do roast.
 *
 * Backend route /api/demo/audit é rate-limited 5/h/IP (server.js).
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePageHead } from '@/lib/page-head';
import { FONTS, PALETTE } from '@/components/sealed/atoms';

type DemoState =
  | { status: 'idle' }
  | { status: 'submitting'; step: string }
  | { status: 'success'; dpia: string; ticketId: string }
  | { status: 'error'; message: string };

const Field: React.FC<{
  label: string;
  hint?: string;
  children: React.ReactNode;
}> = ({ label, hint, children }) => (
  <label className="block mb-5">
    <span
      className="block mb-2"
      style={{
        fontFamily: FONTS.display,
        fontSize: 14,
        fontWeight: 500,
        letterSpacing: '-0.005em',
        color: PALETTE.ink,
      }}
    >
      {label}
    </span>
    {children}
    {hint && (
      <span className="block font-mono text-[11px] text-dpo2u-ink/70 mt-1.5">{hint}</span>
    )}
  </label>
);

const inputCls =
  'w-full bg-[#E8E2D5] border border-[rgba(12,13,16,.32)] px-3 py-2.5 text-[15px] font-body text-dpo2u-ink placeholder:text-dpo2u-ink/55 placeholder:font-mono placeholder:text-[13px] focus:outline-none focus:border-dpo2u-terracotta focus:ring-1 focus:ring-dpo2u-terracotta';

const JURISDICTIONS = [
  { code: 'LGPD', label: 'LGPD (Brazil)' },
  { code: 'GDPR', label: 'GDPR (EU)' },
  { code: 'DPDP', label: 'DPDP (India)' },
  { code: 'PDPA', label: 'PDPA (Singapore)' },
  { code: 'CCPA', label: 'CCPA (California)' },
  { code: 'PIPEDA', label: 'PIPEDA (Canada)' },
  { code: 'POPIA', label: 'POPIA (South Africa)' },
  { code: 'APPI', label: 'APPI (Japan)' },
  { code: 'PIPA', label: 'PIPA (South Korea)' },
  { code: 'PDP', label: 'PDP (Indonesia)' },
  { code: 'UAE', label: 'UAE/PDPL (UAE)' },
  { code: 'NDPA', label: 'NDPA (Nigeria)' },
  { code: 'LAW25', label: 'Law 25 (Quebec)' },
  { code: 'MICAR', label: 'MICAR (EU crypto)' },
  { code: 'MEXICO', label: 'LFPDPPP (Mexico)' },
  { code: 'VIETNAM', label: 'Decree 13 (Vietnam)' },
  { code: 'MALAYSIA', label: 'PDPA-MY (Malaysia)' },
];

export default function DemoPage() {
  usePageHead({
    title: 'Try the audit — DPO2U demo',
    description:
      'Generate a real DPIA in 90 seconds. 5 fields, 17 jurisdictions, no signup. Output watermarked DEMO (not for production). Real audit via /alpha-signup.',
    path: '/demo',
  });

  const [companyName, setCompanyName] = useState('');
  const [jurisdiction, setJurisdiction] = useState('LGPD');
  const [processingActivity, setProcessingActivity] = useState('');
  const [dataSubjects, setDataSubjects] = useState('');
  const [purpose, setPurpose] = useState('');
  const [state, setState] = useState<DemoState>({ status: 'idle' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState({ status: 'submitting', step: 'Loading jurisdiction KB…' });

    // Cosmetic UX steps (real backend returns when ready; this just makes the
    // wait feel intentional rather than blank)
    setTimeout(() => {
      setState((s) => (s.status === 'submitting' ? { status: 'submitting', step: 'Running compliance check…' } : s));
    }, 1200);
    setTimeout(() => {
      setState((s) => (s.status === 'submitting' ? { status: 'submitting', step: 'Generating DPIA markdown…' } : s));
    }, 3000);

    try {
      const res = await fetch('/api/demo/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName,
          jurisdiction,
          processingActivity,
          dataSubjects,
          purpose,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
        throw new Error(err.error || `HTTP ${res.status}`);
      }
      const data = await res.json();
      setState({ status: 'success', dpia: data.dpia_md || '', ticketId: data.ticket_id || '' });
    } catch (err: any) {
      setState({ status: 'error', message: err?.message || 'Unknown error' });
    }
  };

  return (
    <div className="min-h-screen bg-dpo2u-ivory text-dpo2u-ink" style={{ fontFamily: FONTS.body }}>
      <div className="max-w-[920px] mx-auto px-6 md:px-10 py-16 md:py-24">
        <header className="mb-12">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-dpo2u-ink/70 mb-4">
            — Live demo —
          </p>
          <h1
            className="text-[44px] md:text-[60px] leading-[1.04] font-medium"
            style={{ fontFamily: FONTS.display, letterSpacing: '-0.02em' }}
          >
            Try the audit.
          </h1>
          <p className="mt-6 max-w-[60ch] text-[17px] md:text-[19px] text-dpo2u-ink/75">
            Five fields. Ninety seconds. Real DPIA generated by the same MCP server
            that powers production. The output is marked DEMO — for real attestation
            and on-chain anchor, see{' '}
            <Link to="/pricing" className="underline decoration-dpo2u-terracotta">
              pricing
            </Link>
            .
          </p>
        </header>

        {state.status === 'idle' || state.status === 'error' ? (
          <form onSubmit={handleSubmit} className="max-w-[640px]">
            <Field label="Company / project name" hint="Will appear in the generated DPIA header.">
              <input
                className={inputCls}
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Acme Labs"
                required
                maxLength={120}
              />
            </Field>
            <Field label="Jurisdiction" hint="17 supported. Pick the one closest to your users.">
              <select
                className={inputCls}
                value={jurisdiction}
                onChange={(e) => setJurisdiction(e.target.value)}
                required
              >
                {JURISDICTIONS.map(({ code, label }) => (
                  <option key={code} value={code}>
                    {label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Processing activity" hint="What does your project do with user data?">
              <input
                className={inputCls}
                type="text"
                value={processingActivity}
                onChange={(e) => setProcessingActivity(e.target.value)}
                placeholder="On-chain identity attestation + email-based auth"
                required
                maxLength={240}
              />
            </Field>
            <Field label="Data subjects" hint="Who are the people whose data you process?">
              <input
                className={inputCls}
                type="text"
                value={dataSubjects}
                onChange={(e) => setDataSubjects(e.target.value)}
                placeholder="dApp users, wallet holders, KYC subjects"
                required
                maxLength={240}
              />
            </Field>
            <Field label="Purpose" hint="Why are you processing this data? (legal basis)">
              <input
                className={inputCls}
                type="text"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="Compliance attestation, KYC verification, audit trail"
                required
                maxLength={240}
              />
            </Field>

            {state.status === 'error' && (
              <div
                className="mb-5 p-3 border font-mono text-[12px] text-dpo2u-terracotta"
                style={{ borderColor: PALETTE.terracotta, background: 'rgba(200,92,59,0.06)' }}
              >
                Error: {state.message}
                {/^HTTP 429/.test(state.message) && (
                  <span className="block mt-2 text-dpo2u-ink/70">
                    Demo is rate-limited 5×/hour per IP. Try again later, or sign up at /alpha-signup for full access.
                  </span>
                )}
              </div>
            )}

            <button
              type="submit"
              className="block py-3 px-7 font-mono text-[13px] uppercase tracking-[0.14em]"
              style={{ background: PALETTE.terracotta, color: PALETTE.paper, border: 'none' }}
            >
              Generate DPIA →
            </button>
            <p className="mt-4 font-mono text-[11px] text-dpo2u-ink/60">
              Rate-limited 5 generations / hour / IP. Cached per session.
            </p>
          </form>
        ) : state.status === 'submitting' ? (
          <div className="py-20">
            <p className="font-mono text-[13px] uppercase tracking-[0.18em] text-dpo2u-terracotta mb-4">
              — {state.step} —
            </p>
            <div
              className="h-1 w-full bg-[rgba(12,13,16,.08)] relative overflow-hidden"
              aria-hidden="true"
            >
              <div
                className="absolute h-1 w-1/3 animate-pulse"
                style={{ background: PALETTE.terracotta }}
              />
            </div>
            <p className="mt-6 max-w-[50ch] text-[15px] text-dpo2u-ink/70">
              Generating a real DPIA for {companyName || 'your project'} under {jurisdiction}.
              This takes about 30-90 seconds.
            </p>
          </div>
        ) : (
          /* success */
          <div>
            <div
              className="mb-6 p-3 font-mono text-[12px] uppercase tracking-[0.14em] flex items-center gap-3"
              style={{ background: PALETTE.terracotta, color: PALETTE.paper }}
            >
              <span>⚠ Demo output</span>
              <span className="text-[11px] opacity-80 normal-case tracking-normal">
                Not for production. For real audit + on-chain anchor, see{' '}
                <Link to="/pricing" className="underline">
                  pricing
                </Link>
                .
              </span>
            </div>

            <pre
              className="bg-[#E8E2D5] border p-6 overflow-x-auto text-[13px] leading-[1.6] whitespace-pre-wrap"
              style={{ borderColor: PALETTE.rule, fontFamily: FONTS.mono }}
            >
              {state.dpia}
            </pre>

            {state.ticketId && (
              <p className="mt-3 font-mono text-[11px] text-dpo2u-ink/60">
                Demo ticket: {state.ticketId}
              </p>
            )}

            <div className="mt-10 flex flex-col md:flex-row gap-4">
              <Link
                to="/alpha-signup"
                className="inline-block py-3 px-7 font-mono text-[13px] uppercase tracking-[0.14em] transition-colors"
                style={{ background: PALETTE.ink, color: PALETTE.paper }}
              >
                Get the real audit →
              </Link>
              <button
                onClick={() => setState({ status: 'idle' })}
                className="inline-block py-3 px-7 font-mono text-[13px] uppercase tracking-[0.14em]"
                style={{ background: 'transparent', color: PALETTE.ink, border: `1px solid ${PALETTE.ink}` }}
              >
                ↺ Generate another
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
