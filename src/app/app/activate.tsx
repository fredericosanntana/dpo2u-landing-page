/**
 * /app/activate — Managed onboarding REAL (Fase 1/2): conecta repo → paga setup fee (x402)
 * → DPO2U registra o pipeline → "Run now" paga per-attestation, executa o pipeline no
 * servidor e ancora o selo. Reusa o x402/Freighter via ManagedPayModal + managed-client.
 */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FONTS, PALETTE, SmallLabel } from '@/components/sealed/atoms';
import { useWalletAuth } from '@/components/app/WalletAuthProvider';
import { useAuthStore } from '@/lib/pilot/auth-store';
import { usePipelineStore } from '@/lib/app/pipeline-store';
import { useAttestationHistory } from '@/lib/app/attestation-history';
import { ManagedPayModal } from '@/components/app/ManagedPayModal';
import { managedActivate, managedRun, type ManagedCall } from '@/lib/app/managed-client';
import type { X402Challenge } from '@/lib/pilot/payment-tx';

type Pending = { challenge: X402Challenge; kind: 'activate' | 'run' } | null;

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export default function AppActivate() {
  const { pubkey, chain } = useWalletAuth();
  // Dual-chain: a chain ativa decide o caminho de atestação. Solana NÃO usa Freighter/XLM
  // (corrige o bug: Solflare cobrava XLM e abria Freighter). Default stellar.
  const managedChain: 'stellar' | 'solana' = chain === 'solana' ? 'solana' : 'stellar';
  const apiKey = useAuthStore((s) => s.apiKey);
  const addPipeline = usePipelineStore((s) => s.add);
  const addHistory = useAttestationHistory((s) => s.add);

  const [repoUrl, setRepoUrl] = useState('');
  const [email, setEmail] = useState('');
  const [pipelineId, setPipelineId] = useState<string | null>(null);
  const [pending, setPending] = useState<Pending>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [runResult, setRunResult] = useState<Record<string, unknown> | null>(null);

  const normRepo = repoUrl.replace(/^https?:\/\//, '').replace(/^github\.com\//, '').replace(/\.git$/, '');
  const emailValid = EMAIL_RE.test(email.trim());
  const canActivate = normRepo.includes('/') && emailValid;

  const handle = (c: ManagedCall, onOk: (data: Record<string, unknown>) => void, kind: 'activate' | 'run') => {
    if (c.kind === 'ok') { onOk(c.data); return true; }
    if (c.kind === 'payment_required') { setPending({ challenge: c.challenge, kind }); return false; }
    setErr(c.message);
    return false;
  };

  const onActivate = async (xPayment?: string) => {
    setErr(null); setBusy(true);
    try {
      if (!pubkey) { setErr('Conecte a wallet.'); return; }
      const res = await managedActivate({ repo_url: normRepo, email: email.trim(), pubkey, chain: managedChain }, apiKey, xPayment);
      handle(res, (data) => {
        const pid = String(data.pipeline_id || '');
        setPipelineId(pid);
        setPending(null);
        addPipeline({ id: pid, pubkey, repoUrl: normRepo, chains: [managedChain === 'solana' ? 'Solana' : 'Stellar'], jurisdictions: [String(data.jurisdiction || 'gdpr')], trigger: 'managed', createdAt: Date.now() });
        // o setup já roda a 1ª atestação e ancora o selo — mostra a evidência na hora
        const fr = data.first_run as Record<string, unknown> | null | undefined;
        if (fr && fr.evidence_hash_hex) {
          setRunResult(fr);
          const frTx = (fr.tx ?? {}) as { innerTxHash?: string; explorerUrl?: string };
          addHistory({ pubkey, useCaseId: 'managed_compliance_v1', evidenceHashHex: String(fr.evidence_hash_hex), txHash: frTx.innerTxHash, verdict: fr.verdict ? String(fr.verdict) : undefined, score: typeof fr.score === 'number' ? fr.score : undefined, at: Date.now(), source: 'activate', chain: managedChain, explorerUrl: frTx.explorerUrl });
        } else {
          // setup cobrado mas a 1ª atestação não concluiu — avisa e oferece re-rodar (sem novo setup)
          const why = data.first_run_error ? `: ${String(data.first_run_error)}` : '.';
          setErr(`Setup pago e pipeline registrado, mas a 1ª atestação não concluiu${why} Clique em "Run pipeline now" para ancorar o selo.`);
        }
      }, 'activate');
    } finally { setBusy(false); }
  };

  const onRun = async (xPayment?: string) => {
    setErr(null); setBusy(true); setRunResult(null);
    try {
      const res = await managedRun({ pipeline_id: pipelineId || undefined, repo_url: pipelineId ? undefined : normRepo, pubkey: pubkey || undefined, chain: managedChain }, apiKey, xPayment);
      handle(res, (data) => {
        setPending(null);
        setRunResult(data);
        if (pubkey && data.evidence_hash_hex) {
          const tx = data.tx as { innerTxHash?: string; explorerUrl?: string } | undefined;
          addHistory({ pubkey, useCaseId: 'managed_compliance_v1', evidenceHashHex: String(data.evidence_hash_hex), txHash: tx?.innerTxHash, verdict: data.verdict ? String(data.verdict) : undefined, score: typeof data.score === 'number' ? data.score : undefined, at: Date.now(), source: 'activate', chain: managedChain, explorerUrl: tx?.explorerUrl });
        }
      }, 'run');
    } finally { setBusy(false); }
  };

  const onPaid = (header: string) => {
    const kind = pending?.kind;
    setPending(null);
    if (kind === 'activate') void onActivate(header);
    else if (kind === 'run') void onRun(header);
  };

  return (
    <div className="max-w-[760px]">
      <SmallLabel>Activate · Managed Protocol</SmallLabel>
      <h1 className="text-[30px] md:text-[38px] font-medium" style={{ fontFamily: FONTS.display, letterSpacing: '-0.02em', marginTop: 6 }}>
        Connect a repository<span style={{ color: PALETTE.terracotta }}>.</span>
      </h1>
      <p className="mt-2 text-[15px]" style={{ color: PALETTE.inkSoft }}>
        Conecte o repositório e o email. A DPO2U roda o pipeline de compliance e ancora o primeiro selo on-chain
        {managedChain === 'solana'
          ? ' na Solana (devnet) — assinatura via Solflare, sem XLM/Freighter.'
          : ' na Stellar (testnet) — pagamento do setup via Freighter (x402, quando habilitado).'}
      </p>

      {busy && !pending && (
        <div className="mt-8 p-6 flex items-center gap-4" style={{ border: `1px solid ${PALETTE.ruleStrong}`, borderRadius: 4, background: PALETTE.paper2 }}>
          <span aria-hidden style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${PALETTE.ruleStrong}`, borderTopColor: PALETTE.terracotta, display: 'inline-block', animation: 'dpo2u-spin 0.8s linear infinite' }} />
          <div>
            <SmallLabel>Processando</SmallLabel>
            <p className="mt-1 text-[14px]" style={{ color: PALETTE.inkSoft }}>A DPO2U está conectando, cobrando e ancorando o selo on-chain. Pode levar alguns segundos — não feche a aba.</p>
          </div>
          <style>{`@keyframes dpo2u-spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {!pipelineId && !runResult && !busy && (
        <div className="mt-8 flex flex-col gap-5">
          <label className="flex flex-col gap-2">
            <SmallLabel>Repository</SmallLabel>
            <input value={repoUrl} onChange={(e) => setRepoUrl(e.target.value)} placeholder="github.com/your-org/your-repo"
              className="px-4 py-3" style={{ border: `1px solid ${PALETTE.ruleStrong}`, borderRadius: 4, background: PALETTE.paper, fontFamily: FONTS.mono, fontSize: 14 }} />
          </label>
          <label className="flex flex-col gap-2">
            <SmallLabel>Email</SmallLabel>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@empresa.com"
              className="px-4 py-3" style={{ border: `1px solid ${PALETTE.ruleStrong}`, borderRadius: 4, background: PALETTE.paper, fontFamily: FONTS.mono, fontSize: 14 }} />
            <span className="text-[11px]" style={{ color: PALETTE.concrete }}>Pra te enviarmos o relatório e atualizações do pipeline.</span>
          </label>
          {err && <p style={{ color: PALETTE.terracotta, fontFamily: FONTS.mono, fontSize: 13 }}>{err}</p>}
          <button type="button" disabled={!canActivate} onClick={() => void onActivate()} className="py-3 px-6 font-mono text-[13px] uppercase tracking-[.14em]"
            style={{ background: canActivate ? PALETTE.terracotta : PALETTE.ruleStrong, color: '#fff', border: 'none', cursor: canActivate ? 'pointer' : 'not-allowed', alignSelf: 'flex-start' }}>
            Activate (pay setup) →
          </button>
        </div>
      )}

      {pipelineId && !runResult && !busy && (
        <div className="mt-8 p-6" style={{ border: `1px solid ${PALETTE.verdigris}`, borderRadius: 4, background: 'rgba(74,124,116,.08)' }}>
          <SmallLabel style={{ color: PALETTE.verdigris }}>Pipeline registered</SmallLabel>
          <h2 className="mt-2 text-[20px] font-medium" style={{ fontFamily: FONTS.display }}>{normRepo}</h2>
          <p className="mt-2 text-[14px]" style={{ color: PALETTE.inkSoft }}>Tier agora é <b>Managed</b>. Rode o pipeline pra a DPO2U executar e ancorar o primeiro selo.</p>
          {err && <p style={{ color: PALETTE.terracotta, fontFamily: FONTS.mono, fontSize: 13 }}>{err}</p>}
          <div className="mt-4 flex gap-3">
            <button type="button" disabled={busy} onClick={() => void onRun()} className="py-2.5 px-5 font-mono text-[12px] uppercase tracking-[.14em]"
              style={{ background: PALETTE.ink, color: PALETTE.paper, border: 'none', cursor: busy ? 'wait' : 'pointer' }}>
              {busy ? 'Executando…' : 'Run pipeline now (pay per-attestation) →'}
            </button>
            <Link to="/app" className="py-2.5 px-5 font-mono text-[12px] uppercase tracking-[.14em]" style={{ border: `1px solid ${PALETTE.ruleStrong}`, color: PALETTE.ink, textDecoration: 'none' }}>Dashboard</Link>
          </div>
        </div>
      )}

      {runResult && (
        <div className="mt-8 p-6" style={{ border: `1px solid ${PALETTE.ruleStrong}`, borderRadius: 4, background: PALETTE.paper2 }}>
          <SmallLabel>Selo ancorado</SmallLabel>
          <h2 className="mt-2 text-[22px] font-medium" style={{ fontFamily: FONTS.display, color: runResult.verdict === 'PASS' ? PALETTE.verdigris : runResult.verdict === 'FAIL' ? PALETTE.terracotta : PALETTE.ink }}>
            {String(runResult.verdict)} · score {String(runResult.score)}/100
          </h2>
          <p className="mt-1 text-[12px]" style={{ fontFamily: FONTS.mono, color: PALETTE.concrete, wordBreak: 'break-all' }}>hash: {String(runResult.evidence_hash_hex || '').slice(0, 24)}…</p>
          <div className="mt-4 flex gap-3 flex-wrap">
            {runResult.verify_path && <Link to={String(runResult.verify_path)} className="py-2.5 px-5 font-mono text-[12px] uppercase tracking-[.14em]" style={{ background: PALETTE.ink, color: PALETTE.paper, textDecoration: 'none' }}>Ver prova /verify →</Link>}
            <button type="button" onClick={() => { setRunResult(null); }} className="py-2.5 px-5 font-mono text-[12px] uppercase tracking-[.14em]" style={{ border: `1px solid ${PALETTE.ruleStrong}`, color: PALETTE.ink, background: 'transparent', cursor: 'pointer' }}>Run again</button>
            <Link to="/app" className="py-2.5 px-5 font-mono text-[12px] uppercase tracking-[.14em]" style={{ border: `1px solid ${PALETTE.ruleStrong}`, color: PALETTE.ink, textDecoration: 'none' }}>Dashboard</Link>
          </div>
        </div>
      )}

      {pending && (
        <ManagedPayModal
          title={pending.kind === 'activate' ? 'Setup fee — Managed' : 'Per-attestation — Managed run'}
          challenge={pending.challenge}
          onPaid={onPaid}
          onCancel={() => setPending(null)}
        />
      )}
    </div>
  );
}
