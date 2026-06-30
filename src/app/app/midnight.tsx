/**
 * /app/midnight — wallet-free, self-funding Midnight alpha onboarding.
 * Config lives 100% here (no .dpo2u.yml, no buyer-set threshold — the PASS bar is a DPO2U-fixed
 * standard). The buyer only declares jurisdictions (which laws apply) via a picker. Reuses the
 * Stellar GitHub App; opt-in is a per-installation preference. Lives OUTSIDE RequireWallet.
 *
 * Flow: Install the App (state=midnight → GitHub callback bounces here with ?installation_id) →
 * pick jurisdictions → Activate → push. The agent self-funds the seal; /verify shows the proof.
 */
import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FONTS, PALETTE, SmallLabel } from '@/components/sealed/atoms';
import { AppButton, Card, Banner, btnClass } from '@/components/app/ui';
import { githubInstallUrl } from '@/lib/app/github-client';
import { activateMidnight, midnightStatus } from '@/lib/app/midnight-client';
import AgentFuelWidget from '@/components/app/AgentFuelWidget';

const JURISDICTIONS: { code: string; label: string }[] = [
  { code: 'gdpr', label: 'EU · GDPR' },
  { code: 'lgpd', label: 'Brazil · LGPD' },
  { code: 'ccpa', label: 'USA · California (CCPA)' },
  { code: 'pipeda', label: 'Canada · PIPEDA' },
  { code: 'dpdp', label: 'India · DPDP' },
  { code: 'pdpa', label: 'Singapore · PDPA' },
  { code: 'micar', label: 'EU · MiCAR' },
  { code: 'popia', label: 'South Africa · POPIA' },
];

export default function MidnightAlpha() {
  const [params] = useSearchParams();
  const installationId = Number(params.get('installation_id') || 0) || null;

  const [selected, setSelected] = useState<string[]>(['gdpr']);
  const [activating, setActivating] = useState(false);
  const [activated, setActivated] = useState<{ jurisdictions: string[] } | null>(null);
  const [err, setErr] = useState<string | null>(null);

  // If this installation already opted in, reflect it.
  useEffect(() => {
    if (!installationId) return;
    let alive = true;
    midnightStatus(installationId).then((s) => {
      if (alive && s?.active) setActivated({ jurisdictions: s.jurisdictions });
    });
    return () => { alive = false; };
  }, [installationId]);

  const toggle = (code: string) =>
    setSelected((cur) => (cur.includes(code) ? cur.filter((c) => c !== code) : [...cur, code]));

  const onActivate = async () => {
    if (!installationId) return;
    setActivating(true);
    setErr(null);
    const r = await activateMidnight(installationId, selected.length ? selected : ['gdpr']);
    setActivating(false);
    if (r.ok) setActivated({ jurisdictions: r.jurisdictions ?? selected });
    else setErr(r.error ?? 'activation failed');
  };

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '64px 20px', fontFamily: FONTS.body, color: PALETTE.ink }}>
      <SmallLabel>Midnight · alpha · wallet-free</SmallLabel>
      <h1 style={{ fontFamily: FONTS.display, fontSize: 34, fontWeight: 500, lineHeight: 1.15, margin: '12px 0 8px' }}>
        Compliance on every commit — sealed score-private on Midnight.
      </h1>
      <p style={{ fontSize: 17, color: PALETTE.inkSoft, margin: '0 0 8px' }}>
        Install the App on your repo, pick which laws apply, push. An autonomous agent evaluates
        each change and seals a ZK proof on Midnight — your score stays private, the verdict is
        public. No wallet, no fees, no config files: the agent is self-funding.
      </p>
      <p style={{ fontFamily: FONTS.mono, fontSize: 12, color: PALETTE.concrete, margin: '0 0 32px' }}>
        The PASS bar is a fixed DPO2U standard — you can't (and shouldn't) tune your own audit.
        Only the verdict + hashes go on-chain; the score never leaves your side.
      </p>

      {/* Step 1 — Install */}
      <div style={{ marginBottom: 28 }}>
        <SmallLabel>Step 1 — Install the App</SmallLabel>
        <p style={{ fontSize: 15, color: PALETTE.inkSoft, margin: '8px 0 12px' }}>
          Pick the repos you want continuously attested. No wallet required.
        </p>
        <a href={githubInstallUrl({ state: 'midnight' })} className={btnClass('terracotta')}>
          Install on GitHub →
        </a>
      </div>

      {/* Step 2 — Activate (only after the install callback gives us the installation) */}
      <div style={{ marginBottom: 28 }}>
        <SmallLabel>Step 2 — Choose jurisdictions &amp; activate</SmallLabel>
        {!installationId ? (
          <p style={{ fontSize: 15, color: PALETTE.concrete, margin: '8px 0 0' }}>
            After installing, GitHub brings you back here to finish — pick the laws that apply and activate.
          </p>
        ) : activated ? (
          <Banner tone="success">
            Midnight is active for this installation ({activated.jurisdictions.map((j) => j.toUpperCase()).join(', ')}).
            Push to any installed repo and the agent seals it automatically.
          </Banner>
        ) : (
          <>
            <p style={{ fontSize: 15, color: PALETTE.inkSoft, margin: '8px 0 12px' }}>
              Which laws apply to you? (You declare scope — you never set the pass threshold.)
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
              {JURISDICTIONS.map((j) => {
                const on = selected.includes(j.code);
                return (
                  <button
                    key={j.code}
                    onClick={() => toggle(j.code)}
                    style={{
                      fontFamily: FONTS.mono, fontSize: 12, padding: '6px 12px', borderRadius: 4, cursor: 'pointer',
                      border: `1px solid ${on ? PALETTE.verdigris : PALETTE.rule}`,
                      background: on ? 'rgba(74,124,116,.10)' : PALETTE.paper,
                      color: on ? PALETTE.verdigris : PALETTE.ink,
                    }}
                  >
                    {on ? '✓ ' : ''}{j.label}
                  </button>
                );
              })}
            </div>
            {err && <div style={{ marginBottom: 12 }}><Banner tone="error">Activation failed: {err}</Banner></div>}
            <AppButton variant="ink" onClick={onActivate} loading={activating} disabled={selected.length === 0}>
              Activate Midnight →
            </AppButton>
          </>
        )}
      </div>

      {/* Step 3 — Push */}
      <div style={{ marginBottom: 36 }}>
        <SmallLabel>Step 3 — Push</SmallLabel>
        <p style={{ fontSize: 15, color: PALETTE.inkSoft, margin: '8px 0 0' }}>
          Every push/PR posts a DPO2U Check Run with the verdict + a link to the on-chain proof.
          Watch it appear at <Link to="/verify" style={{ color: PALETTE.terracotta, borderBottom: `1px solid ${PALETTE.terracotta}` }}>/verify</Link> within ~2 minutes.
        </p>
      </div>

      <AgentFuelWidget />

      <p style={{ fontFamily: FONTS.mono, fontSize: 11, color: PALETTE.concrete, marginTop: 28 }}>
        Alpha · Midnight preview testnet · open access. The agent self-funds from staked NIGHT;
        when DUST runs low, the faucet keeps the alpha sealing for everyone.
      </p>
    </div>
  );
}
