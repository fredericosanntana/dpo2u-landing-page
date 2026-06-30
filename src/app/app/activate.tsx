/**
 * /app/activate — Managed onboarding (Phase 1/2). Two doors:
 *  · Door A (continuous): connect GitHub → DPO2U attests every PR.
 *  · Door B (one-time): connect a repo → "Run now" executes the pipeline on the
 *    server and anchors the seal on Stellar (Soroban).
 * Payment is x402 (USDC SAC): on a 402 the app shows the exact price
 * (requestPaymentConfirm), signs with Freighter (withX402) and retries with X-PAYMENT.
 *
 * Note: the jurisdiction `id`s below are the codes the gateway expects (e.g. MEXICO,
 * VIETNAM, KENYA) — they intentionally differ from the JURISDICTIONS labels in
 * atoms.tsx, so they're kept local to preserve the API contract.
 */
import React, { useMemo, useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FONTS, PALETTE, SmallLabel } from '@/components/sealed/atoms';
import { AppButton, Card, Banner, Input, Field, ProgressSteps, btnClass, requestPaymentConfirm, toast } from '@/components/app/ui';
import { useWalletAuth } from '@/components/app/WalletAuthProvider';
import { useAuthStore } from '@/lib/pilot/auth-store';
import { usePipelineStore } from '@/lib/app/pipeline-store';
import { useAttestationHistory } from '@/lib/app/attestation-history';
import { managedActivate, managedRun, managedRemediate, withX402, type ManagedCall } from '@/lib/app/managed-client';
import { githubConnect, parseGithubCallback, githubStatus, githubRepos, startGithubInstall, githubInstallUrl, type GithubStatus, type GithubRepo } from '@/lib/app/github-client';
import { truncatePubkey } from '@/lib/app/wallet-session';

// Backend-accepted jurisdiction codes, grouped by region for the picker.
const JUR_GROUPS: { region: string; items: { id: string; label: string }[] }[] = [
  { region: 'Americas', items: [
    { id: 'LGPD', label: 'Brazil (LGPD)' },
    { id: 'CCPA', label: 'USA · California (CCPA)' },
    { id: 'PIPEDA', label: 'Canada (PIPEDA)' },
    { id: 'LAW25', label: 'Quebec (Law 25)' },
    { id: 'MEXICO', label: 'Mexico (LFPDPPP)' },
    { id: 'COLOMBIA', label: 'Colombia (Ley 1581)' },
  ] },
  { region: 'Europe', items: [
    { id: 'GDPR', label: 'Europe (GDPR)' },
    { id: 'MICAR', label: 'MiCAR · Crypto EU (ART)' },
    { id: 'MICAR-CASP', label: 'MiCAR · Crypto EU (CASP)' },
  ] },
  { region: 'Africa', items: [
    { id: 'POPIA', label: 'South Africa (POPIA)' },
    { id: 'NDPA', label: 'Nigeria (NDPA)' },
    { id: 'KENYA', label: 'Kenya (DPA)' },
    { id: 'GHANA', label: 'Ghana (DPA)' },
    { id: 'TANZANIA', label: 'Tanzania (PDPA)' },
    { id: 'RWANDA', label: 'Rwanda (Law 058)' },
    { id: 'UGANDA', label: 'Uganda (DPPA)' },
  ] },
  { region: 'Middle East', items: [
    { id: 'UAE', label: 'Abu Dhabi / Dubai (ADGM/UAE)' },
  ] },
  { region: 'Asia-Pacific', items: [
    { id: 'DPDP', label: 'India (DPDP)' },
    { id: 'PDPA', label: 'Singapore (PDPA)' },
    { id: 'PIPA', label: 'South Korea (PIPA)' },
    { id: 'PDP', label: 'Indonesia (PDP)' },
    { id: 'APPI', label: 'Japan (APPI)' },
    { id: 'VIETNAM', label: 'Vietnam (Decree 13)' },
    { id: 'MALAYSIA', label: 'Malaysia (PDPA)' },
  ] },
];

const PAY_STEPS = ['Prepare', 'Pay', 'Anchor'];

export default function AppActivate() {
  const { pubkey } = useWalletAuth();
  // Stellar-only: the seal is anchored on the Soroban contract; payment is x402 (USDC SAC).
  const managedChain = 'stellar' as const;
  const apiKey = useAuthStore((s) => s.apiKey);
  const addPipeline = usePipelineStore((s) => s.add);
  const addHistory = useAttestationHistory((s) => s.add);

  // mode: which door is open in the initial state (null = path chooser).
  const [mode, setMode] = useState<null | 'github' | 'attest'>(null);
  const [companyId, setCompanyId] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [countries, setCountries] = useState<string[]>(['LGPD']);
  const [jurFilter, setJurFilter] = useState('');
  const [evaluateAi, setEvaluateAi] = useState(false);
  const [pipelineId, setPipelineId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [payStep, setPayStep] = useState(0);
  const [err, setErr] = useState<string | null>(null);
  const [runResult, setRunResult] = useState<Record<string, unknown> | null>(null);
  // Remediation bundle: generates every missing artifact in a PR + projects the post-merge score.
  const [rem, setRem] = useState<Record<string, unknown> | null>(null);
  const [remBusy, setRemBusy] = useState(false);
  const [remErr, setRemErr] = useState<string | null>(null);
  // Door B private repo: when the repo is private, show a panel that redirects to the
  // GitHub grant instead of routing to Door A. granted=true after the return.
  const [privateRepo, setPrivateRepo] = useState<{ repo: string; granted: boolean } | null>(null);
  // GitHub App callback (installation → workspace). null = no pending callback.
  const [githubMsg, setGithubMsg] = useState<{ kind: 'ok' | 'err' | 'pending'; text: string } | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  // GitHub connection state (Door A — DPO-as-a-Service). Reads the binding + credits.
  const [gh, setGh] = useState<GithubStatus | null>(null);
  const [repos, setRepos] = useState<GithubRepo[] | null>(null);
  useEffect(() => {
    if (!pubkey) { setGh(null); setRepos(null); return; }
    let alive = true;
    void githubStatus(pubkey).then((s) => { if (alive) setGh(s); });
    void githubRepos(pubkey).then((r) => { if (alive) setRepos(r?.repos ?? null); });
    return () => { alive = false; };
    // re-fetch when the wallet changes OR a callback just connected (githubMsg ok).
  }, [pubkey, githubMsg?.kind]);

  // GitHub App callback: GitHub redirects here with ?installation_id=…&setup_action=install
  // after the user authorizes. Binds that installation to the workspace (connected wallet pubkey).
  useEffect(() => {
    const cb = parseGithubCallback(window.location.search);
    if (!cb) return;
    // Midnight alpha is wallet-free — bounce its install callback to /app/midnight (no wallet bind).
    if (new URLSearchParams(window.location.search).get('state') === 'midnight') {
      window.location.replace(`/app/midnight?installation_id=${cb.installationId}`);
      return;
    }
    if (!pubkey) {
      setGithubMsg({ kind: 'err', text: 'Connect your wallet first to bind the GitHub installation to your workspace. (Midnight alpha needs no wallet — go to /app/midnight.)' });
      return;
    }
    let cancelled = false;
    setGithubMsg({ kind: 'pending', text: 'Binding the GitHub installation to your workspace…' });
    void githubConnect({ installationId: cb.installationId, pubkey }).then((res) => {
      if (cancelled) return;
      if (res.ok) {
        setGithubMsg({ kind: 'ok', text: `GitHub connected (installation ${cb.installationId}). DPO2U now attests every PR automatically — recharge credits in Billing.` });
        setMode('github');
      } else {
        setGithubMsg({ kind: 'err', text: `Failed to bind the GitHub installation: ${res.error ?? 'unknown error'}` });
      }
      // Clear the callback query params from the URL (avoid re-firing on refresh).
      const next = new URLSearchParams(searchParams);
      ['installation_id', 'setup_action', 'code', 'state'].forEach((k) => next.delete(k));
      setSearchParams(next, { replace: true });
    });
    return () => { cancelled = true; };
    // Only depends on pubkey: runs when the wallet resolves (the callback arrives on first render).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pubkey]);

  const normRepo = repoUrl.replace(/^https?:\/\//, '').replace(/^github\.com\//, '').replace(/\.git$/, '');
  const repoInvalid = repoUrl.trim().length > 0 && !normRepo.includes('/');
  const canActivate = companyId.trim().length > 2 && normRepo.includes('/');

  // Payment confirm hook: shows the price, advances the stepper to "Anchor" once confirmed.
  const confirmPay = async (c: Parameters<typeof requestPaymentConfirm>[0]): Promise<boolean> => {
    setPayStep(1);
    const ok = await requestPaymentConfirm(c);
    if (ok) setPayStep(2);
    return ok;
  };

  const handle = (c: ManagedCall, onOk: (data: Record<string, unknown>) => void) => {
    if (c.kind === 'ok') { onOk(c.data); return true; }
    if (c.kind === 'cancelled') { return false; }
    // withX402 already resolves the 402 (signs with Freighter and retries); a remaining
    // payment_required means the x402 paywall didn't settle.
    if (c.kind === 'payment_required') { setErr('The x402 payment (USDC SAC) did not settle in Freighter. Try again.'); return false; }
    // Private repo (gateway /run → 409): instead of a dry error, open the "grant access" panel.
    if (c.kind === 'error' && c.status === 409) { setPrivateRepo({ repo: normRepo, granted: false }); return false; }
    setErr(c.message);
    return false;
  };

  // Opens the GitHub grant in a NEW TAB (doesn't navigate this tab). Since this tab stays put,
  // React state (form + pipelineId) is preserved — no sessionStorage needed. The new tab does
  // the installation→wallet binding when it returns to /app/activate.
  const onGrantPrivateAccess = () => {
    if (!pubkey) { setErr('Connect your wallet first.'); return; }
    window.open(githubInstallUrl({ state: pubkey }), '_blank', 'noopener,noreferrer');
    // Reveal "Try again" — the user returns here after authorizing in the other tab.
    setPrivateRepo((prev) => prev ? { ...prev, granted: true } : { repo: normRepo, granted: true });
  };

  // After granting access and returning: re-fire the attestation on that repo (now readable via the App).
  const onRetryPrivate = () => {
    setPrivateRepo(null);
    setErr(null);
    if (pipelineId) void onRun();
    else void onActivate();
  };

  // "Edit repository": discard the private state AND the pipeline, returning the form.
  const onEditPrivateRepo = () => { setPrivateRepo(null); setPipelineId(null); setErr(null); };

  const onActivate = async () => {
    setErr(null); setBusy(true); setPayStep(0);
    try {
      if (!pubkey) { setErr('Connect your wallet.'); return; }
      const payload = { company_id: companyId.trim(), repo_url: normRepo, countries, evaluate_ai: evaluateAi, pubkey, chain: managedChain };
      // The legacy backend may still check repo_url. withX402 resolves the paywall (Freighter).
      const res = await withX402((xp) => managedActivate(payload as any, apiKey, xp), { onChallenge: confirmPay });
      handle(res, (data) => {
        const pid = String(data.pipeline_id || '');
        setPipelineId(pid);
        addPipeline({ id: pid, pubkey, repoUrl: `github.com/${normRepo}`, companyId: companyId.trim(), chains: ['Stellar'], jurisdictions: data.jurisdiction ? [String(data.jurisdiction)] : countries, trigger: 'managed', createdAt: Date.now() });
        // setup already runs the 1st attestation and anchors the seal — show the evidence now
        const fr = data.first_run as Record<string, unknown> | null | undefined;
        if (fr && fr.evidence_hash_hex) {
          // issue_number/issue_url come at the top level of the /activate response (siblings of first_run).
          setRunResult({ ...fr, issue_number: data.issue_number, issue_url: data.issue_url });
          const frTx = (fr.tx ?? {}) as { innerTxHash?: string; explorerUrl?: string };
          addHistory({ pubkey, useCaseId: 'managed_compliance_v1', evidenceHashHex: String(fr.evidence_hash_hex), txHash: frTx.innerTxHash, verdict: fr.verdict ? String(fr.verdict) : undefined, score: typeof fr.score === 'number' ? fr.score : undefined, at: Date.now(), source: 'activate', chain: managedChain, explorerUrl: frTx.explorerUrl, repo: fr.repo_url ? String(fr.repo_url) : `github.com/${normRepo}`, jurisdictions: countries, gaps: Array.isArray(fr.gaps) ? (fr.gaps as unknown[]).map(String) : undefined, controls: fr.controls && typeof fr.controls === 'object' ? (fr.controls as Record<string, boolean>) : undefined });
          toast.success(`Pipeline activated · ${String(fr.verdict ?? 'seal')} anchored on-chain.`);
        } else if (data.first_run_error_code === 'repo_private_connect_github') {
          // Private repo: open the "grant access on GitHub" panel (don't route to Door A).
          setPrivateRepo({ repo: normRepo, granted: false });
        } else {
          // pipeline registered but the 1st attestation didn't finish — warn and offer a re-run
          const why = data.first_run_error ? `: ${String(data.first_run_error)}` : '.';
          setErr(`Pipeline registered, but the first attestation didn't finish${why} Click "Run pipeline now" to anchor the seal.`);
        }
      });
    } catch (e) { setErr(`Failed: ${e instanceof Error ? e.message : String(e)}`); } finally { setBusy(false); setPayStep(0); }
  };

  const onRun = async () => {
    setErr(null); setBusy(true); setPayStep(0); setRunResult(null); setRem(null); setRemErr(null);
    try {
      const res = await withX402((xp) => managedRun({ pipeline_id: pipelineId || undefined, repo_url: pipelineId ? undefined : normRepo, company_id: companyId.trim(), countries, evaluate_ai: evaluateAi, pubkey: pubkey || undefined, chain: managedChain } as any, apiKey, xp), { onChallenge: confirmPay });
      handle(res, (data) => {
        setRunResult(data);
        if (pubkey && data.evidence_hash_hex) {
          const tx = data.tx as { innerTxHash?: string; explorerUrl?: string } | undefined;
          addHistory({ pubkey, useCaseId: 'managed_compliance_v1', evidenceHashHex: String(data.evidence_hash_hex), txHash: tx?.innerTxHash, verdict: data.verdict ? String(data.verdict) : undefined, score: typeof data.score === 'number' ? data.score : undefined, at: Date.now(), source: 'activate', chain: managedChain, explorerUrl: tx?.explorerUrl, repo: data.repo_url ? String(data.repo_url) : (normRepo ? `github.com/${normRepo}` : undefined), jurisdictions: countries, gaps: Array.isArray(data.gaps) ? (data.gaps as unknown[]).map(String) : undefined, controls: data.controls && typeof data.controls === 'object' ? (data.controls as Record<string, boolean>) : undefined });
          toast.success(`Attestation ${String(data.verdict ?? '')} · sealed on-chain.`);
        }
      });
    } catch (e) { setErr(`Failed: ${e instanceof Error ? e.message : String(e)}`); } finally { setBusy(false); setPayStep(0); }
  };

  // Generates the remediation bundle (all missing artifacts in a PR) and projects the post-merge score.
  const onRemediate = async () => {
    if (!pubkey) { setRemErr('Connect your wallet.'); return; }
    const repo = String(runResult?.repo_url || (normRepo ? `github.com/${normRepo}` : ''));
    if (!repo) { setRemErr('Repository undefined.'); return; }
    setRemErr(null); setRemBusy(true); setRem(null);
    try {
      const res = await withX402((xp) => managedRemediate(
        { pubkey, repo_url: repo, jurisdiction: (countries[0] || 'gdpr').toLowerCase(), chain: managedChain },
        apiKey,
        xp,
      ), { onChallenge: requestPaymentConfirm });
      if (res.kind === 'cancelled') return;
      if (res.kind === 'payment_required') { setRemErr('The x402 payment for the bundle did not settle in Freighter — try again.'); return; }
      if (res.kind === 'error') { setRemErr(res.status === 409 ? 'Install the DPO2U App on this repository (Door A) to open the remediation PR.' : `Failed: ${res.message}`); return; }
      setRem(res.data);
      toast.success('Remediation bundle generated.');
    } catch (e) { setRemErr(`Payment failed: ${e instanceof Error ? e.message : String(e)}`); } finally { setRemBusy(false); }
  };

  const selectedJur = useMemo(() => {
    const f = jurFilter.trim().toLowerCase();
    return JUR_GROUPS.map((g) => ({
      region: g.region,
      items: g.items.filter((j) => !f || j.label.toLowerCase().includes(f) || j.id.toLowerCase().includes(f)),
    })).filter((g) => g.items.length > 0);
  }, [jurFilter]);

  const toggleJur = (id: string) =>
    setCountries((prev) => prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]);

  const isInitial = !pipelineId && !runResult && !busy && !privateRepo;

  return (
    <div className="max-w-[760px]">
      <SmallLabel>Activate · Managed Protocol</SmallLabel>
      {githubMsg && (
        <div className="mt-3">
          <Banner tone={githubMsg.kind === 'err' ? 'error' : githubMsg.kind === 'ok' ? 'success' : 'info'} glyph={githubMsg.kind !== 'pending'}>
            {githubMsg.kind === 'pending' ? '⏳ ' : ''}{githubMsg.text}
          </Banner>
        </div>
      )}
      <h1 className="text-[30px] md:text-[38px] font-medium" style={{ fontFamily: FONTS.display, letterSpacing: '-0.02em', marginTop: 6 }}>
        Activate<span style={{ color: PALETTE.terracotta }}>.</span>
      </h1>
      <p className="mt-2 text-[15px]" style={{ color: PALETTE.inkSoft }}>
        Two ways to seal compliance on-chain. <b>Connect GitHub</b> so DPO2U attests every PR automatically
        (DPO-as-a-Service), or <b>run a one-time attestation</b> on a repository now.
      </p>

      {/* PATH CHOOSER — initial state only. */}
      {isInitial && mode === null && (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button type="button" onClick={() => setMode('github')} className="appui-choice text-left p-6"
            style={{ border: `1px solid ${gh?.install ? PALETTE.verdigris : PALETTE.ruleStrong}`, borderRadius: 4, background: PALETTE.paper2 }}>
            <SmallLabel style={{ color: gh?.install ? PALETTE.verdigris : PALETTE.terracotta }}>Door A · Continuous</SmallLabel>
            <h2 className="mt-1 text-[20px] font-medium" style={{ fontFamily: FONTS.display }}>Connect GitHub</h2>
            <p className="mt-2 text-[13px]" style={{ color: PALETTE.inkSoft }}>
              DPO2U attests every PR, posts a Check Run and anchors a seal on-chain. {gh?.install ? 'Connected ✓' : 'Best for ongoing compliance.'}
            </p>
            <span className="inline-block mt-3" style={{ fontFamily: FONTS.mono, fontSize: 12, color: PALETTE.terracotta }}>Choose →</span>
          </button>
          <button type="button" onClick={() => setMode('attest')} className="appui-choice text-left p-6"
            style={{ border: `1px solid ${PALETTE.ruleStrong}`, borderRadius: 4, background: PALETTE.paper2 }}>
            <SmallLabel style={{ color: PALETTE.terracotta }}>Door B · One-time</SmallLabel>
            <h2 className="mt-1 text-[20px] font-medium" style={{ fontFamily: FONTS.display }}>Attest a repository</h2>
            <p className="mt-2 text-[13px]" style={{ color: PALETTE.inkSoft }}>
              A single on-demand attestation, paid per run. Public repo: direct. Private: authorize access on GitHub first.
            </p>
            <span className="inline-block mt-3" style={{ fontFamily: FONTS.mono, fontSize: 12, color: PALETTE.terracotta }}>Choose →</span>
          </button>
        </div>
      )}

      {/* DOOR A — DPO-as-a-Service (continuous GitHub). */}
      {isInitial && mode === 'github' && (
        <div className="mt-8">
          <button type="button" onClick={() => setMode(null)} className="mb-3" style={{ fontFamily: FONTS.mono, fontSize: 11, color: PALETTE.concrete, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 3, padding: 0 }}>← back</button>
          <Card accent={gh?.install ? 'verdigris' : 'rule'}>
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div>
                <SmallLabel style={{ color: gh?.install ? PALETTE.verdigris : PALETTE.terracotta }}>Door A · DPO-as-a-Service</SmallLabel>
                <h2 className="mt-1 text-[20px] font-medium" style={{ fontFamily: FONTS.display }}>Continuous compliance on GitHub</h2>
              </div>
              {gh?.install && (
                <span style={{ fontFamily: FONTS.mono, fontSize: 11, color: PALETTE.verdigris, border: `1px solid ${PALETTE.verdigris}`, borderRadius: 999, padding: '3px 10px' }}>✓ connected</span>
              )}
            </div>

            {gh?.install ? (
              <>
                <p className="mt-3 text-[14px]" style={{ color: PALETTE.inkSoft }}>
                  Connected to <b style={{ fontFamily: FONTS.mono }}>{gh.install.account_login || 'your account'}</b> ·{' '}
                  <b>{gh.credits}</b> CI credit{gh.credits === 1 ? '' : 's'}. Each PR becomes a seal (Check Run) and debits 1 credit.
                </p>
                {repos && repos.length > 0 && (
                  <div className="mt-4" style={{ border: `.5px solid ${PALETTE.rule}`, borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ padding: '8px 12px', background: PALETTE.paper, borderBottom: `.5px solid ${PALETTE.rule}` }}>
                      <SmallLabel>Connected repositories · {repos.length}</SmallLabel>
                    </div>
                    {repos.slice(0, 12).map((r) => (
                      <div key={`${r.installation_id}:${r.full_name}`} className="flex items-center justify-between gap-3" style={{ padding: '8px 12px', borderTop: `.5px solid ${PALETTE.rule}` }}>
                        <span style={{ fontFamily: FONTS.mono, fontSize: 12, color: PALETTE.ink, wordBreak: 'break-all' }}>{r.full_name}</span>
                        <span className="flex items-center gap-2" style={{ flexShrink: 0 }}>
                          <span style={{ fontFamily: FONTS.mono, fontSize: 10, color: r.private ? PALETTE.terracotta : PALETTE.verdigris, border: `1px solid ${r.private ? PALETTE.terracotta : PALETTE.verdigris}`, borderRadius: 999, padding: '1px 8px' }}>{r.private ? 'private' : 'public'}</span>
                          <a href={r.html_url} target="_blank" rel="noreferrer" style={{ fontFamily: FONTS.mono, fontSize: 11, color: PALETTE.concrete, textDecoration: 'underline', textUnderlineOffset: 3 }}>↗</a>
                        </span>
                      </div>
                    ))}
                    {repos.length > 12 && <div style={{ padding: '6px 12px', borderTop: `.5px solid ${PALETTE.rule}`, fontFamily: FONTS.mono, fontSize: 11, color: PALETTE.concrete }}>+{repos.length - 12} more…</div>}
                  </div>
                )}
                <div className="mt-4 flex gap-3 flex-wrap">
                  <a href={githubInstallUrl()} target="_blank" rel="noreferrer" className={btnClass('ghost')}>Add / manage repos ↗</a>
                  <Link to="/app/billing" className={btnClass('ink')}>Recharge credits →</Link>
                </div>
              </>
            ) : (
              <>
                <p className="mt-3 text-[14px]" style={{ color: PALETTE.inkSoft }}>
                  Connect your repositories once. On every push/PR, DPO2U runs the compliance pipeline, posts a Check Run on the PR, and anchors a verifiable on-chain seal at <code style={{ fontFamily: FONTS.mono }}>/verify</code>.
                </p>
                <p className="mt-2 text-[12px]" style={{ color: PALETTE.concrete }}>
                  GitHub is bound <b>to this wallet</b> ({truncatePubkey(pubkey)}). If you already connected with another wallet, switch to it to see those repositories — or connect here to re-bind.
                </p>
                <AppButton variant="terracotta" disabled={!pubkey} onClick={() => startGithubInstall(pubkey ?? undefined)} className="mt-4">Connect GitHub →</AppButton>
                {!pubkey && <p className="mt-2 text-[11px]" style={{ color: PALETTE.concrete }}>Connect your wallet first.</p>}
              </>
            )}
          </Card>
        </div>
      )}

      {/* Long operation — progress stepper. */}
      {busy && (
        <Card className="mt-8">
          <SmallLabel>Working</SmallLabel>
          <div className="mt-3"><ProgressSteps steps={PAY_STEPS} current={payStep} /></div>
          <p className="mt-3 text-[14px]" style={{ color: PALETTE.inkSoft }}>
            DPO2U is connecting, charging and anchoring the seal on-chain. This can take a few seconds — you can keep this tab open.
          </p>
        </Card>
      )}

      {/* DOOR B — one-time attestation form. */}
      {isInitial && mode === 'attest' && (
        <div className="mt-8 flex flex-col gap-5">
          <div>
            <button type="button" onClick={() => setMode(null)} className="mb-3" style={{ fontFamily: FONTS.mono, fontSize: 11, color: PALETTE.concrete, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 3, padding: 0 }}>← back</button>
            <SmallLabel style={{ color: PALETTE.terracotta }}>Door B · Attestation</SmallLabel>
            <h2 className="mt-1 text-[20px] font-medium" style={{ fontFamily: FONTS.display }}>Attest a repository now</h2>
            <p className="mt-1 text-[13px]" style={{ color: PALETTE.inkSoft }}>
              One-time, on-demand attestation — paid per attestation · Stellar testnet (Freighter).
              {' '}Public repo: direct. <b>Private</b> repo: DPO2U takes you to GitHub to authorize access, then attests.
            </p>
          </div>

          <Field label="Company ID (CNPJ / VAT / DID)">
            <Input value={companyId} onChange={(e) => setCompanyId(e.target.value)} placeholder="00.000.000/0001-00" />
          </Field>

          <Field label="Repository URL" hint="Needed to attest compliance directly against the source code." error={repoInvalid ? 'Use the owner/repo form, e.g. github.com/your-org/your-repo.' : null}>
            <Input value={repoUrl} onChange={(e) => setRepoUrl(e.target.value)} placeholder="github.com/your-org/your-repo" invalid={repoInvalid} />
          </Field>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <SmallLabel>Jurisdictions · {countries.length} selected</SmallLabel>
              <input value={jurFilter} onChange={(e) => setJurFilter(e.target.value)} placeholder="Search…" className="appui-input" style={{ width: 160, padding: '6px 10px', fontSize: 12 }} />
            </div>
            <div className="flex flex-col gap-3 p-3" style={{ border: `1px solid ${PALETTE.ruleStrong}`, borderRadius: 4, background: PALETTE.paper }}>
              {selectedJur.length === 0 && <span className="text-[12px]" style={{ color: PALETTE.concrete }}>No jurisdictions match “{jurFilter}”.</span>}
              {selectedJur.map((g) => (
                <div key={g.region}>
                  <div style={{ fontFamily: FONTS.mono, fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: PALETTE.concrete, marginBottom: 6 }}>{g.region}</div>
                  <div className="flex flex-wrap gap-2">
                    {g.items.map((j) => {
                      const on = countries.includes(j.id);
                      return (
                        <button key={j.id} type="button" onClick={() => toggleJur(j.id)} aria-pressed={on}
                          className="appui-choice px-3 py-1.5"
                          style={{ borderRadius: 999, fontFamily: FONTS.mono, fontSize: 12, border: `1px solid ${on ? PALETTE.terracotta : PALETTE.ruleStrong}`, background: on ? 'rgba(200,92,59,.1)' : 'transparent', color: on ? PALETTE.terracotta : PALETTE.ink }}>
                          {on ? '✓ ' : ''}{j.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            <span className="text-[11px]" style={{ color: PALETTE.concrete }}>The AI engine runs in parallel for each selected jurisdiction. One seal covers all; the verdict is per jurisdiction.</span>
          </div>

          <label className="flex items-center gap-3 mt-2 cursor-pointer">
            <input type="checkbox" checked={evaluateAi} onChange={(e) => setEvaluateAi(e.target.checked)} style={{ accentColor: PALETTE.terracotta, width: 16, height: 16 }} />
            <div className="flex flex-col">
              <span style={{ fontFamily: FONTS.body, fontSize: 14, fontWeight: 500, color: PALETTE.ink }}>Evaluate AI frameworks</span>
              <span className="text-[11px]" style={{ color: PALETTE.concrete }}>Validates adherence to CAIDP AI Index and the Hiroshima Process.</span>
            </div>
          </label>

          {err && <p style={{ color: PALETTE.terracotta, fontFamily: FONTS.mono, fontSize: 13 }}>{err}</p>}
          <AppButton variant="terracotta" disabled={!canActivate} onClick={() => void onActivate()} style={{ alignSelf: 'flex-start' }}>Activate (pay setup) →</AppButton>
        </div>
      )}

      {/* Private repo → grant access on GitHub (precedes the "Pipeline registered" card). */}
      {privateRepo && !busy && (
        <Card className="mt-8" accent={privateRepo.granted ? 'verdigris' : 'terracotta'}>
          <SmallLabel style={{ color: privateRepo.granted ? PALETTE.verdigris : PALETTE.terracotta }}>
            {privateRepo.granted ? 'Access granted' : 'Private repository'}
          </SmallLabel>
          <h2 className="mt-1 text-[20px] font-medium" style={{ fontFamily: FONTS.display }}>
            {privateRepo.granted ? 'Ready to attest' : 'Authorize access on GitHub'}
          </h2>
          <p className="mt-2 text-[14px]" style={{ color: PALETTE.inkSoft }}>
            {privateRepo.granted ? (
              <>After authorizing <b style={{ fontFamily: FONTS.mono }}>{privateRepo.repo}</b> in the GitHub tab, come back here and click <b>Try again</b>. (If the repo still shows as private, confirm it was included in the authorization.)</>
            ) : (
              <>DPO2U can't read <b style={{ fontFamily: FONTS.mono }}>{privateRepo.repo}</b> because the repository is <b>private</b>.
              {' '}We opened GitHub in a <b>new tab</b> so you can authorize access (you choose exactly which repos to grant); then return to this tab.</>
            )}
          </p>
          <div className="mt-4 flex gap-3 flex-wrap">
            {privateRepo.granted ? (
              <>
                <AppButton onClick={onRetryPrivate}>Try again →</AppButton>
                <AppButton variant="ghost" disabled={!pubkey} onClick={onGrantPrivateAccess}>Open GitHub again ↗</AppButton>
              </>
            ) : (
              <AppButton variant="terracotta" disabled={!pubkey} onClick={onGrantPrivateAccess}>Grant access on GitHub ↗ (new tab)</AppButton>
            )}
            <AppButton variant="ghost" onClick={onEditPrivateRepo}>Edit repository</AppButton>
          </div>
          {!pubkey && !privateRepo.granted && <p className="mt-2 text-[11px]" style={{ color: PALETTE.concrete }}>Connect your wallet first.</p>}
        </Card>
      )}

      {pipelineId && !runResult && !busy && !privateRepo && (
        <Card className="mt-8" accent="verdigris">
          <SmallLabel style={{ color: PALETTE.verdigris }}>Pipeline registered</SmallLabel>
          <h2 className="mt-2 text-[20px] font-medium" style={{ fontFamily: FONTS.display }}>{companyId}</h2>
          <p className="mt-2 text-[14px]" style={{ color: PALETTE.inkSoft }}>Tier is now <b>Managed</b>. Run the pipeline so DPO2U executes it and anchors the first seal.</p>
          {err && <p style={{ color: PALETTE.terracotta, fontFamily: FONTS.mono, fontSize: 13 }}>{err}</p>}
          <div className="mt-4 flex gap-3">
            <AppButton loading={busy} onClick={() => void onRun()}>Run pipeline now (pay per-attestation) →</AppButton>
            <Link to="/app" className={btnClass('ghost')}>Dashboard</Link>
          </div>
        </Card>
      )}

      {runResult && (
        <Card className="mt-8">
          <SmallLabel>Seal anchored</SmallLabel>
          <div className="mt-1 text-[14px]" style={{ fontFamily: FONTS.mono, color: PALETTE.ink, wordBreak: 'break-all' }}>
            {String(runResult.repo_url || (normRepo ? `github.com/${normRepo}` : '—'))}
          </div>
          <h2 className="mt-2 text-[22px] font-medium" style={{ fontFamily: FONTS.display, color: runResult.verdict === 'PASS' ? PALETTE.verdigris : runResult.verdict === 'FAIL' ? PALETTE.terracotta : PALETTE.ink }}>
            {String(runResult.verdict)} · score {String(runResult.score)}/100
          </h2>
          {Array.isArray(runResult.jurisdictions) && (runResult.jurisdictions as unknown[]).length > 0 && (
            <div className="mt-3">
              <SmallLabel>Jurisdictions attested · {(runResult.jurisdictions as unknown[]).length}</SmallLabel>
              <div className="mt-2 flex flex-col gap-1" style={{ fontFamily: FONTS.mono, fontSize: 13, maxWidth: 380 }}>
                {(runResult.jurisdictions as Array<{ code: string; score: number; verdict: string }>).map((j) => (
                  <div key={j.code} className="flex items-center justify-between">
                    <span style={{ textTransform: 'uppercase', color: PALETTE.ink }}>{j.code}</span>
                    <span style={{ color: j.verdict === 'PASS' ? PALETTE.verdigris : j.verdict === 'FAIL' ? PALETTE.terracotta : PALETTE.concrete }}>{j.verdict} · {j.score}/100</span>
                  </div>
                ))}
              </div>
              <p className="mt-1 text-[11px]" style={{ color: PALETTE.concrete }}>One seal covers all; the verdict is per jurisdiction.</p>
            </div>
          )}
          {Array.isArray(runResult.gaps) && (runResult.gaps as unknown[]).length > 0 && (
            <div className="mt-4">
              <SmallLabel>Improvement points · {(runResult.gaps as unknown[]).length}</SmallLabel>
              <ul className="mt-2" style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {(runResult.gaps as unknown[]).map((g, i) => (
                  <li key={i} style={{ display: 'flex', gap: 8, fontSize: 14, color: PALETTE.inkSoft }}>
                    <span style={{ color: PALETTE.terracotta, flex: 'none' }}>•</span><span>{String(g)}</span>
                  </li>
                ))}
              </ul>
              {/* Remediation bundle — closes ALL gaps in a PR; projects the post-merge score */}
              <div className="mt-4 p-3" style={{ border: `1px solid ${PALETTE.ruleStrong}`, borderRadius: 6, background: PALETTE.paper2 }}>
                {!rem ? (
                  <>
                    <p className="text-[13px]" style={{ color: PALETTE.inkSoft }}>
                      Generate <strong>all the documentation</strong> that closes these gaps (privacy, security, license, CI, on-chain disclosure) in a single PR. After merge, re-run to raise the seal.
                    </p>
                    <AppButton variant="terracotta" loading={remBusy} onClick={() => void onRemediate()} className="mt-3">
                      {remBusy ? 'Generating bundle…' : 'Generate remediation bundle →'}
                    </AppButton>
                    {remErr && <p className="mt-2 text-[12px]" style={{ fontFamily: FONTS.mono, color: PALETTE.terracotta }}>{remErr}</p>}
                    <Link to={`/app/evidence?repo=${encodeURIComponent(normRepo)}`} className="block mt-2 font-mono text-[11px]" style={{ color: PALETTE.concrete, textDecoration: 'underline', textUnderlineOffset: 3 }}>
                      or generate individual documents (DPIA, retention) →
                    </Link>
                  </>
                ) : (
                  <div style={{ fontFamily: FONTS.mono, fontSize: 13 }}>
                    {rem.pr_url ? (
                      <a href={String(rem.pr_url)} target="_blank" rel="noreferrer" style={{ color: PALETTE.verdigris, textDecoration: 'underline' }}>
                        ✓ PR #{String(rem.pr_number)} opened ({Array.isArray(rem.files) ? (rem.files as unknown[]).length : 0} files) ↗
                      </a>
                    ) : (
                      <span style={{ color: PALETTE.concrete }}>{String(rem.message || 'Nothing to remediate.')}</span>
                    )}
                    <div className="mt-2" style={{ color: PALETTE.ink }}>
                      Projection: <strong>{String(rem.score_now)}</strong> → <strong style={{ color: rem.will_pass ? PALETTE.verdigris : PALETTE.ink }}>{String(rem.score_projected)}/100{rem.will_pass ? ' · PASS' : ''}</strong>
                    </div>
                    {rem.pr_url ? <p className="mt-1 text-[12px]" style={{ color: PALETTE.concrete }}>Merge the PR and re-run the attestation to lock in the seal.</p> : null}
                  </div>
                )}
              </div>
            </div>
          )}
          <p className="mt-3 text-[12px]" style={{ fontFamily: FONTS.mono, color: PALETTE.concrete, wordBreak: 'break-all' }}>hash: {String(runResult.evidence_hash_hex || '').slice(0, 24)}…</p>
          {runResult.issue_url ? (
            <p className="mt-2 text-[12px]" style={{ fontFamily: FONTS.mono }}>
              <a href={String(runResult.issue_url)} target="_blank" rel="noreferrer" style={{ color: PALETTE.verdigris, textDecoration: 'underline' }}>
                ✓ Compliance issue #{String(runResult.issue_number)} opened/updated on GitHub ↗
              </a>
            </p>
          ) : null}
          <div className="mt-4 flex gap-3 flex-wrap">
            {runResult.verify_path && <Link to={String(runResult.verify_path)} className={btnClass('ink')}>View proof /verify →</Link>}
            <AppButton variant="ghost" onClick={() => { setRunResult(null); setRem(null); setRemErr(null); }}>Run again</AppButton>
            <Link to="/app" className={btnClass('ghost')}>Dashboard</Link>
          </div>
        </Card>
      )}
    </div>
  );
}
