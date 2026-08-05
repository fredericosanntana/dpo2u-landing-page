/**
 * DocAddonPanel — compliance-document add-on (paid via x402 on Stellar, USDC SAC).
 * Self-contained: reads ?repo= from the deep-link (issue CTA), collects the doc type
 * + jurisdiction, calls the gateway /api/v1/managed/docs (which runs the real generator
 * in mcp-server). Payment is x402: on 402 the app shows the price (requestPaymentConfirm)
 * then signs with Freighter (withX402) and retries. DPIA requires real fields (we never
 * fabricate). Embeddable on any /app page.
 */
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FONTS, PALETTE, SmallLabel } from '@/components/sealed/atoms';
import { AppButton, Input, requestPaymentConfirm, toast } from '@/components/app/ui';
import { useWalletAuth } from '@/components/app/WalletAuthProvider';
import { managedGenerateDoc, managedRemediate, withX402, type DocType } from '@/lib/app/managed-client';
import { githubInstallUrl } from '@/lib/app/github-client';

const DOC_OPTIONS: { id: DocType; label: string }[] = [
  { id: 'privacy_policy', label: 'Privacy Policy' },
  { id: 'security_policy', label: 'Security Policy' },
  { id: 'dpia', label: 'DPIA' },
];

interface DocResult { title?: string; markdown?: string; cid?: string; url?: string; pr_number?: number | null; pr_url?: string | null }

export function DocAddonPanel() {
  const { pubkey } = useWalletAuth();
  const [params] = useSearchParams();
  const [repo, setRepo] = useState(params.get('repo') ?? '');
  // Pre-fill the repo when arriving via deep-link (?repo=) from a gap CTA.
  const repoParam = params.get('repo');
  useEffect(() => { if (repoParam) setRepo(repoParam); }, [repoParam]);
  const [docType, setDocType] = useState<DocType>('privacy_policy');
  const [jurisdiction, setJurisdiction] = useState('lgpd');
  const [dpia, setDpia] = useState({ processingActivity: '', dataTypes: '', dataSubjects: '', purpose: '' });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [result, setResult] = useState<DocResult | null>(null);
  // Remediation bundle: generates ALL missing artifacts in one PR + projects the score.
  const [bundle, setBundle] = useState<Record<string, unknown> | null>(null);
  const [bundleBusy, setBundleBusy] = useState(false);
  // When the App lacks contents:write/pull_requests:write the gateway returns 403 →
  // we offer the re-authorization link instead of a dead-end red error.
  const [reauthUrl, setReauthUrl] = useState<string | null>(null);

  const runBundle = async () => {
    if (!pubkey) { setMsg('Connect your wallet first.'); return; }
    if (!repo.trim()) { setMsg('Enter the repository (github.com/owner/repo).'); return; }
    setBundleBusy(true); setMsg(null); setBundle(null); setReauthUrl(null);
    try {
      const r = await withX402(
        (xp) => managedRemediate({ pubkey, repo_url: repo.trim(), jurisdiction, chain: 'stellar' }, null, xp),
        { onChallenge: requestPaymentConfirm },
      );
      if (r.kind === 'cancelled') return;
      if (r.kind === 'payment_required') { setMsg('The x402 payment for the bundle did not settle in Freighter — try again.'); return; }
      if (r.kind === 'error') {
        // 403 on remediate = App lacks write permission → re-authorization CTA.
        if (r.status === 403) {
          setMsg('The App needs write access (contents + pull requests) to open the PR. Re-authorize and try again.');
          setReauthUrl(githubInstallUrl(pubkey ? { state: pubkey } : undefined));
          return;
        }
        setMsg(r.status === 409 ? 'Install the DPO2U App on this repository (Door A) to open the PR.' : `Failed: ${r.message}`);
        return;
      }
      setBundle(r.data);
      toast.success('Remediation bundle generated.');
    } catch (e) { setMsg(`Payment failed: ${e instanceof Error ? e.message : String(e)}`); } finally { setBundleBusy(false); }
  };

  const buildParams = (): Record<string, unknown> =>
    docType === 'dpia'
      ? {
          processingActivity: dpia.processingActivity.trim(),
          dataTypes: dpia.dataTypes.split(',').map((s) => s.trim()).filter(Boolean),
          dataSubjects: dpia.dataSubjects.split(',').map((s) => s.trim()).filter(Boolean),
          purpose: dpia.purpose.trim(),
        }
      : {};

  const run = async (dt: DocType) => {
    if (!pubkey) { setMsg('Connect your wallet first.'); return; }
    if (!repo.trim()) { setMsg('Enter the repository (github.com/owner/repo).'); return; }
    setBusy(true); setMsg(null);
    try {
      const r = await withX402(
        (xp) => managedGenerateDoc(
          { pubkey, repo_url: repo.trim(), doc_type: dt, jurisdiction, chain: 'stellar', params: buildParams() },
          null,
          xp,
        ),
        { onChallenge: requestPaymentConfirm },
      );
      if (r.kind === 'cancelled') return;
      if (r.kind === 'payment_required') { setMsg('The x402 payment (USDC SAC) did not settle in Freighter — try again.'); return; }
      if (r.kind === 'error') { setMsg(`Failed: ${r.message}`); return; }
      setResult(r.data as DocResult);
      toast.success('Document generated.');
    } catch (e) { setMsg(`Payment failed: ${e instanceof Error ? e.message : String(e)}`); } finally { setBusy(false); }
  };

  const dpiaIncomplete = docType === 'dpia' && (!dpia.processingActivity || !dpia.purpose || !dpia.dataTypes || !dpia.dataSubjects);

  return (
    <div className="mt-10">
      <div style={{ borderTop: `1px solid ${PALETTE.ruleStrong}`, margin: '8px 0 20px' }} />
      <SmallLabel>Compliance documents · add-on</SmallLabel>
      <h2 className="text-[22px] md:text-[26px] font-medium" style={{ fontFamily: FONTS.display, letterSpacing: '-0.01em', marginTop: 6 }}>
        Generate the document, paid per piece<span style={{ color: PALETTE.terracotta }}>.</span>
      </h2>
      <p className="mt-2 text-[14px]" style={{ color: PALETTE.inkSoft }}>
        Paid via x402 (USDC SAC) per document, signed with Freighter. If the repository is connected (Door A) to this wallet, the document is attached to the repo's compliance issue.
        {' '}(Stellar testnet for now.)
      </p>

      {/* Full bundle: closes ALL observable gaps in one PR + projects the post-merge score */}
      <div className="mt-4 p-4" style={{ border: `1px solid ${PALETTE.verdigris}`, borderRadius: 6, background: 'rgba(74,124,116,.06)', maxWidth: 560 }}>
        <SmallLabel>Remediation bundle · closes everything in one PR</SmallLabel>
        <p className="mt-1 text-[13px]" style={{ color: PALETTE.inkSoft }}>
          Instead of one policy at a time, generate <strong>all</strong> the missing artifacts (privacy, security, license, CI, on-chain disclosure) in a single PR — in the paths the scanner can see. After merge, re-run the attestation to raise the seal.
        </p>
        {!bundle ? (
          <AppButton variant="terracotta" loading={bundleBusy} onClick={() => void runBundle()} className="mt-3">
            {bundleBusy ? 'Generating bundle…' : 'Generate full bundle →'}
          </AppButton>
        ) : (
          <div className="mt-2" style={{ fontFamily: FONTS.mono, fontSize: 13 }}>
            {bundle.pr_url ? (
              <a href={String(bundle.pr_url)} target="_blank" rel="noreferrer" style={{ color: PALETTE.verdigris, textDecoration: 'underline' }}>
                ✓ PR #{String(bundle.pr_number)} opened ({Array.isArray(bundle.files) ? (bundle.files as unknown[]).length : 0} files) ↗
              </a>
            ) : (
              <span style={{ color: PALETTE.concrete }}>{String(bundle.message || 'Nothing to remediate.')}</span>
            )}
            <div className="mt-1" style={{ color: PALETTE.ink }}>
              Projection: <strong>{String(bundle.score_now)}</strong> → <strong style={{ color: bundle.will_pass ? PALETTE.verdigris : PALETTE.ink }}>{String(bundle.score_projected)}/100{bundle.will_pass ? ' · PASS' : ''}</strong>
            </div>
          </div>
        )}
      </div>

      <div className="mt-5 grid gap-3" style={{ maxWidth: 560 }}>
        <label className="text-[12px]" style={{ color: PALETTE.concrete }}>
          Repository
          <Input value={repo} onChange={(e) => setRepo(e.target.value)} placeholder="github.com/owner/repo" className="mt-1" />
        </label>

        <div className="flex gap-2 flex-wrap items-center">
          {DOC_OPTIONS.map((o) => (
            <button key={o.id} type="button" onClick={() => { setDocType(o.id); setResult(null); }}
              className="appui-choice px-3 py-2 text-[12px]"
              style={{
                border: `1px solid ${docType === o.id ? PALETTE.ink : PALETTE.ruleStrong}`,
                background: docType === o.id ? PALETTE.ink : 'transparent',
                color: docType === o.id ? PALETTE.paper : PALETTE.ink,
                borderRadius: 4, fontFamily: FONTS.mono,
              }}>
              {o.label}
            </button>
          ))}
          <label className="text-[12px] flex items-center gap-2" style={{ color: PALETTE.concrete }}>
            jurisdiction
            <input value={jurisdiction} onChange={(e) => setJurisdiction(e.target.value.toLowerCase())} className="appui-input"
              style={{ width: 90, padding: '4px 8px', fontSize: 12 }} />
          </label>
        </div>

        {docType === 'dpia' && (
          <div className="grid gap-2 p-3" style={{ border: `1px dashed ${PALETTE.ruleStrong}`, borderRadius: 4 }}>
            <p className="text-[11px]" style={{ color: PALETTE.concrete }}>The DPIA requires real processing details (we don't make them up).</p>
            <Input value={dpia.processingActivity} onChange={(e) => setDpia({ ...dpia, processingActivity: e.target.value })} placeholder="Processing activity" />
            <Input value={dpia.purpose} onChange={(e) => setDpia({ ...dpia, purpose: e.target.value })} placeholder="Purpose" />
            <Input value={dpia.dataTypes} onChange={(e) => setDpia({ ...dpia, dataTypes: e.target.value })} placeholder="Data types (comma-separated)" />
            <Input value={dpia.dataSubjects} onChange={(e) => setDpia({ ...dpia, dataSubjects: e.target.value })} placeholder="Data subjects (comma-separated)" />
          </div>
        )}

        <div>
          <AppButton disabled={!pubkey || dpiaIncomplete} loading={busy} onClick={() => void run(docType)}>
            {busy ? 'Generating…' : 'Generate document →'}
          </AppButton>
        </div>
        {msg && (
          <div>
            <p className="text-[13px]" style={{ fontFamily: FONTS.mono, color: PALETTE.terracotta }}>{msg}</p>
            {reauthUrl && (
              <a href={reauthUrl} target="_blank" rel="noreferrer"
                className="inline-block mt-2 py-2 px-4 font-mono text-[12px] uppercase tracking-[.14em]"
                style={{ border: `1px solid ${PALETTE.verdigris}`, color: PALETTE.verdigris, textDecoration: 'none' }}>
                Re-authorize the App ↗
              </a>
            )}
          </div>
        )}
      </div>

      {result && (
        <div className="mt-5 p-4" style={{ border: `1px solid ${PALETTE.verdigris}`, borderRadius: 6, background: 'rgba(74,124,116,.06)', maxWidth: 760 }}>
          <SmallLabel>{result.title || 'Document generated'}</SmallLabel>
          <div className="mt-2 flex gap-4 flex-wrap text-[12px]" style={{ fontFamily: FONTS.mono }}>
            {result.pr_url
              ? <a href={result.pr_url} target="_blank" rel="noreferrer" style={{ color: PALETTE.verdigris, textDecoration: 'underline' }}>✓ PR #{result.pr_number} opened ↗</a>
              : <span style={{ color: PALETTE.concrete }}>install the DPO2U App on this repository (Door A) to open an automatic PR</span>}
            {result.cid && <span style={{ color: PALETTE.concrete }}>IPFS: {result.cid.slice(0, 16)}…</span>}
            {result.url && <a href={result.url} target="_blank" rel="noreferrer" style={{ color: PALETTE.terracotta, textDecoration: 'underline' }}>open ↗</a>}
          </div>
          <pre className="mt-3 p-3 text-[12px]" style={{ background: PALETTE.paper2, borderRadius: 4, maxHeight: 320, overflow: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {result.markdown}
          </pre>
        </div>
      )}
    </div>
  );
}
