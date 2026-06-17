// /app/run/:vertical — Act 2 (Execution) LIVE. Form → gateway
// (/api/v1/attestation/submit) → the engine runs (resolvers + predicates) → seals on
// Soroban → navigates to the dossier (/app/proof). Closes the Start→Execution→Proof loop
// with a REAL on-chain attestation (testnet). Honest: the agent depends on the mcp-server.
import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FONTS, PALETTE, SmallLabel } from '@/components/sealed/atoms';
import { ProgressSteps, Banner, btnClass, Field, Input, AppButton } from '@/components/app/ui';
import { StatusBadge } from '@/components/app/ui/StatusBadge';
import { OBLIGATIONS } from '@/lib/status-registry';
import { submitAttestation, pollAttestation, McpError } from '@/lib/pilot/mcp-client';
import { useAuthStore } from '@/lib/pilot/auth-store';
import { useAttestationHistory } from '@/lib/app/attestation-history';
import { useWalletAuth } from '@/components/app/WalletAuthProvider';

type Phase = 'idle' | 'submitting' | 'sealing' | 'error';

// Fields per vertical (defaults = healthy example → PASS verdict in one click).
const FORMS: Record<string, { useCaseId: string; fields: { k: string; label: string; type: 'text' | 'num' | 'bool'; def: string | number | boolean }[] }> = {
  vasp: {
    useCaseId: 'vasp_por_br_v1',
    fields: [
      { k: 'psav', label: 'VASP (institution)', type: 'text', def: 'Demo Exchange BR LTDA' },
      { k: 'reserve_amount', label: 'Reserve (atomic)', type: 'num', def: 10500000 },
      { k: 'outstanding_supply', label: 'Client obligations', type: 'num', def: 10000000 },
      { k: 'capital_buffer_bps', label: 'Capital buffer (bps)', type: 'num', def: 350 },
      { k: 'client_assets_segregated', label: 'Asset segregation (BCB 520)', type: 'bool', def: true },
    ],
  },
  cvm: {
    useCaseId: 'cvm_token_v1',
    fields: [
      { k: 'token_id', label: 'Token', type: 'text', def: 'RWA-fund-demo' },
      { k: 'has_distribution', label: 'Distribution (common enterprise)', type: 'bool', def: true },
      { k: 'has_governance', label: 'Governance (expectation of return)', type: 'bool', def: true },
      { k: 'has_disclosure', label: 'Disclosure (Parecer 40)', type: 'bool', def: true },
      { k: 'has_investor_limits', label: 'Investor limits (Res. 88)', type: 'bool', def: true },
      { k: 'has_lockup', label: 'Lock-up', type: 'bool', def: true },
    ],
  },
  agent: {
    useCaseId: 'agent_runtime_v1',
    fields: [
      { k: 'agent_id', label: 'Agent ID', type: 'text', def: 'treasury-agent-demo' },
      { k: 'organization', label: 'Organization', type: 'text', def: 'DPO2U' },
      { k: 'uses_prohibited_category', label: 'Uses prohibited category (red-line)', type: 'bool', def: false },
    ],
  },
};

function buildEvidence(vertical: string, v: Record<string, string | boolean>): Record<string, unknown> {
  if (vertical === 'vasp') {
    return {
      psav: v.psav, reserve_amount: Number(v.reserve_amount), outstanding_supply: Number(v.outstanding_supply),
      capital_buffer_bps: Number(v.capital_buffer_bps), liquidity_bps: 2000, daily_cap: 1000000,
      client_assets_segregated: !!v.client_assets_segregated, token_id: 'BRL-stable-demo',
    };
  }
  if (vertical === 'cvm') {
    return {
      token_id: v.token_id,
      tokenomics: { totalSupply: 1000000, distribution: v.has_distribution ? { team: 0.2, public: 0.8 } : {}, governance: v.has_governance ? { dao: true } : undefined },
      has_disclosure: !!v.has_disclosure, has_investor_limits: !!v.has_investor_limits, has_lockup: !!v.has_lockup,
    };
  }
  // agent
  return {
    agent_id: v.agent_id, organization: v.organization, framework: 'MGF-AGENTIC',
    capabilities: ['A2', 'A4'], toolset_description: 'treasury agent (x402 + Soroban)',
    deployment_tier: 'pilot', uses_prohibited_category: !!v.uses_prohibited_category,
  };
}

export default function AppRun() {
  const { vertical = '' } = useParams();
  const navigate = useNavigate();
  const o = OBLIGATIONS.find((x) => x.key === vertical);
  const cfg = FORMS[vertical];
  const apiKey = useAuthStore((s) => s.apiKey);
  const addHistory = useAttestationHistory((s) => s.add);
  const { pubkey } = useWalletAuth();

  const [vals, setVals] = useState<Record<string, string | boolean>>(() =>
    cfg ? Object.fromEntries(cfg.fields.map((f) => [f.k, typeof f.def === 'number' ? String(f.def) : f.def])) : {},
  );
  const [phase, setPhase] = useState<Phase>('idle');
  const [msg, setMsg] = useState<string | null>(null);

  if (!o) {
    return <Banner tone="error">Unknown obligation. <Link to="/app/start" style={{ color: PALETTE.terracotta }}>Back →</Link></Banner>;
  }

  // Verticals with no form here: data → existing managed pipeline; filing → engine (being wired).
  if (o.route === '/app/activate') {
    return (
      <div className="max-w-[720px]">
        <SmallLabel>Execution · {o.title}</SmallLabel>
        <h1 className="text-[28px] md:text-[34px] font-medium mt-2" style={{ fontFamily: FONTS.display }}>{o.title}</h1>
        <Banner tone="info">This flow runs through the managed pipeline (generates the DPIA/policy, seals and pins the evidence on IPFS).</Banner>
        <div className="mt-5"><Link to="/app/activate" className={btnClass('ink')}>Run pipeline →</Link></div>
      </div>
    );
  }
  if (!cfg) {
    return (
      <div className="max-w-[720px]">
        <SmallLabel>Execution · {o.title}</SmallLabel>
        <h1 className="text-[28px] md:text-[34px] font-medium mt-2" style={{ fontFamily: FONTS.display }}>{o.title}</h1>
        <Banner tone="info">The live trigger for this vertical (engine 5710/5711) is being wired. See the proof already sealed on-chain:</Banner>
        {o.useCaseId && o.proofHash && (
          <div className="mt-5"><Link to={`/app/proof/uc/${o.useCaseId}/hash/${o.proofHash}`} className={btnClass('ink')}>View proof →</Link></div>
        )}
      </div>
    );
  }

  const run = async () => {
    if (!apiKey) { setMsg('Set your API key in Settings to seal.'); setPhase('error'); return; }
    setPhase('submitting'); setMsg(null);
    try {
      const evidence = buildEvidence(vertical, vals);
      const request_id = `app-${vertical}-${Date.now()}`;
      const r = await submitAttestation({ use_case_id: cfg.useCaseId, request_id, evidence });
      if (r.kind === 'payment_required') {
        setPhase('error');
        setMsg('x402 payment required — pay through billing and try again (payment flow being wired here).');
        return;
      }
      setPhase('sealing');
      pollAttestation(
        r.attempt_id,
        (att) => {
          if (att.status === 'COMPLETED' && att.result) {
            const { verdict, evidence_hash_hex, tx } = att.result;
            addHistory({ pubkey: pubkey ?? '', useCaseId: cfg.useCaseId, evidenceHashHex: evidence_hash_hex, verdict, at: Date.now(), explorerUrl: tx?.explorerUrl, repo: o.title } as never);
            navigate(`/app/proof/uc/${cfg.useCaseId}/hash/${evidence_hash_hex}`);
          } else if (att.status === 'FAILED') {
            setPhase('error'); setMsg(att.error?.message ?? 'Failed to seal.');
          }
        },
        (err: McpError) => { setPhase('error'); setMsg(err.message); },
      );
    } catch (e) {
      setPhase('error');
      setMsg(e instanceof McpError ? e.message : e instanceof Error ? e.message : String(e));
    }
  };

  const stepIdx = phase === 'submitting' ? 1 : phase === 'sealing' ? 2 : 0;

  return (
    <div className="max-w-[720px]">
      <SmallLabel>Execution · Step 2 of 3</SmallLabel>
      <div className="flex items-start justify-between gap-4 mt-2">
        <h1 className="text-[28px] md:text-[34px] font-medium" style={{ fontFamily: FONTS.display, letterSpacing: '-0.02em' }}>{o.title}</h1>
        <StatusBadge status={o.status} />
      </div>
      <p className="mt-2 text-[14px]" style={{ color: PALETTE.inkSoft }}>{o.blurb}</p>

      <div className="mt-7"><ProgressSteps steps={['Prepare', 'Run engine', 'Seal on-chain', 'Proof']} current={stepIdx} failed={phase === 'error'} /></div>

      <div className="mt-7 p-5" style={{ border: `.5px solid ${PALETTE.ruleStrong}`, borderRadius: 6, background: PALETTE.paper2 }}>
        {cfg.fields.map((f) => (
          <div key={f.k} className="mb-3">
            {f.type === 'bool' ? (
              <label className="flex items-center gap-2" style={{ fontSize: 14 }}>
                <input type="checkbox" checked={!!vals[f.k]} onChange={(e) => setVals((s) => ({ ...s, [f.k]: e.target.checked }))} />
                {f.label}
              </label>
            ) : (
              <Field label={f.label}>
                <Input
                  value={String(vals[f.k] ?? '')}
                  inputMode={f.type === 'num' ? 'numeric' : 'text'}
                  onChange={(e) => setVals((s) => ({ ...s, [f.k]: e.target.value }))}
                />
              </Field>
            )}
          </div>
        ))}
      </div>

      {vertical === 'agent' && (
        <Banner tone="info" glyph>The agent is evaluated by the real mcp-server (assess_agent_capability + runtime plan). If the MCP does not respond, the seal comes out as REVIEW/FAIL — honest, no pretending.</Banner>
      )}
      {msg && <div className="mt-4"><Banner tone={phase === 'error' ? 'error' : 'info'}>{msg}</Banner></div>}

      <div className="mt-6 flex flex-wrap gap-3">
        <AppButton onClick={run} disabled={phase === 'submitting' || phase === 'sealing'}>
          {phase === 'submitting' ? 'Submitting…' : phase === 'sealing' ? 'Sealing on-chain…' : 'Run + seal →'}
        </AppButton>
        <Link to="/app/start" className={btnClass('ghost')}>Switch obligation</Link>
      </div>
      <p className="mt-5 text-[12px]" style={{ color: PALETTE.concrete, fontFamily: FONTS.mono }}>
        Seals a REAL attestation on Soroban testnet (gateway-signed). Private score, public proof.
      </p>
    </div>
  );
}
