/**
 * /app/midnight — wallet-free, self-funding Midnight alpha onboarding.
 * Reuses the Stellar GitHub App (chain=midnight via .dpo2u.yml). No wallet, no fees:
 * the autonomous agent pays its own DUST. Lives OUTSIDE RequireWallet (public chrome),
 * so it renders without a connected wallet. 3 steps: Install → add .dpo2u.yml → push.
 */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FONTS, PALETTE, SmallLabel } from '@/components/sealed/atoms';
import { btnClass } from '@/components/app/ui';
import { githubInstallUrl } from '@/lib/app/github-client';
import AgentFuelWidget from '@/components/app/AgentFuelWidget';

const YML = `# .dpo2u.yml — DPO2U Continuous Compliance (Midnight alpha)
chain: midnight        # seal score-PRIVATE on Midnight (ZK) — only verdict + hashes on-chain
jurisdiction: gdpr     # or lgpd, ccpa, dpdp, micar, …
threshold: 70          # PASS >= 70
zk: true
use_cases:
  - managed_compliance_v1
`;

export default function MidnightAlpha() {
  const [copied, setCopied] = useState(false);
  const copyYml = () => {
    navigator.clipboard?.writeText(YML);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '64px 20px', fontFamily: FONTS.body, color: PALETTE.ink }}>
      <SmallLabel>Midnight · alpha · wallet-free</SmallLabel>
      <h1 style={{ fontFamily: FONTS.display, fontSize: 34, fontWeight: 500, lineHeight: 1.15, margin: '12px 0 8px' }}>
        Compliance on every commit — sealed score-private on Midnight.
      </h1>
      <p style={{ fontSize: 17, color: PALETTE.inkSoft, margin: '0 0 8px' }}>
        Install the App on your repo, add one file, push. An autonomous agent evaluates each change
        and seals a ZK proof on Midnight — your score stays private, the verdict is public.
        No wallet, no fees: the agent is self-funding.
      </p>
      <p style={{ fontFamily: FONTS.mono, fontSize: 12, color: PALETTE.concrete, margin: '0 0 32px' }}>
        Only the verdict (PASS/FAIL/REVIEW) + hashes go on-chain. The score never leaves your side.
      </p>

      <div style={{ marginBottom: 28 }}>
        <SmallLabel>Step 1 — Install the App</SmallLabel>
        <p style={{ fontSize: 15, color: PALETTE.inkSoft, margin: '8px 0 12px' }}>
          Pick the repos you want continuously attested. No wallet required.
        </p>
        <a href={githubInstallUrl()} target="_blank" rel="noreferrer" className={btnClass('terracotta')}>
          Install on GitHub →
        </a>
      </div>

      <div style={{ marginBottom: 28 }}>
        <SmallLabel>Step 2 — Add .dpo2u.yml to your repo</SmallLabel>
        <p style={{ fontSize: 15, color: PALETTE.inkSoft, margin: '8px 0 12px' }}>
          Commit this file to the repo root. <code style={{ fontFamily: FONTS.mono, fontSize: 12 }}>chain: midnight</code> opts into the wallet-free, self-funded Midnight seal.
        </p>
        <div style={{ position: 'relative' }}>
          <pre style={{ fontFamily: FONTS.mono, fontSize: 12.5, lineHeight: 1.6, background: PALETTE.paper2, border: `1px solid ${PALETTE.rule}`, borderRadius: 4, padding: 16, overflowX: 'auto', margin: 0 }}>{YML}</pre>
          <button onClick={copyYml} style={{ position: 'absolute', top: 8, right: 8, fontFamily: FONTS.mono, fontSize: 11, textTransform: 'uppercase', letterSpacing: '.1em', color: PALETTE.ink, background: PALETTE.paper, border: `1px solid ${PALETTE.rule}`, borderRadius: 4, padding: '4px 8px', cursor: 'pointer' }}>
            {copied ? 'copied ✓' : 'copy'}
          </button>
        </div>
      </div>

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
