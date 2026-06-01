/**
 * /app/activate — Managed onboarding REAL (Fase 1/2): conecta repo → registra o pipeline
 * → "Run now" executa o pipeline no servidor e ancora o selo na Solana. O pagamento
 * (USDC SPL) é resolvido server-side pelo payment-gateway — o app não assina client-side.
 */
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FONTS, PALETTE, SmallLabel } from '@/components/sealed/atoms';
import { useWalletAuth } from '@/components/app/WalletAuthProvider';
import { useAuthStore } from '@/lib/pilot/auth-store';
import { usePipelineStore } from '@/lib/app/pipeline-store';
import { useAttestationHistory } from '@/lib/app/attestation-history';
import { managedActivate, managedRun, type ManagedCall } from '@/lib/app/managed-client';
import { githubConnect, parseGithubCallback, githubStatus, githubRepos, startGithubInstall, githubInstallUrl, type GithubStatus, type GithubRepo } from '@/lib/app/github-client';
import { truncatePubkey } from '@/lib/app/wallet-session';

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export default function AppActivate() {
  const { pubkey } = useWalletAuth();
  // Solana-only: o selo é ancorado na Solana; o pagamento (USDC SPL) é server-side.
  const managedChain = 'solana' as const;
  const apiKey = useAuthStore((s) => s.apiKey);
  const addPipeline = usePipelineStore((s) => s.add);
  const addHistory = useAttestationHistory((s) => s.add);

  const [companyId, setCompanyId] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [countries, setCountries] = useState<string[]>(['LGPD']);
  const [evaluateAi, setEvaluateAi] = useState(false);
  const [email, setEmail] = useState('');
  const [pipelineId, setPipelineId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [runResult, setRunResult] = useState<Record<string, unknown> | null>(null);
  // Porta B repo privado: quando o repo é privado, em vez de mandar pra Porta A, mostramos
  // um painel que redireciona direto pro grant do GitHub. granted=true após o retorno.
  const [privateRepo, setPrivateRepo] = useState<{ repo: string; granted: boolean } | null>(null);
  // GitHub App callback (instalação → workspace). null = sem callback pendente.
  const [githubMsg, setGithubMsg] = useState<{ kind: 'ok' | 'err' | 'pending'; text: string } | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  // Estado da conexão GitHub (Porta A — DPO-as-a-Service). Lê o binding + créditos.
  const [gh, setGh] = useState<GithubStatus | null>(null);
  const [repos, setRepos] = useState<GithubRepo[] | null>(null);
  useEffect(() => {
    if (!pubkey) { setGh(null); setRepos(null); return; }
    let alive = true;
    void githubStatus(pubkey).then((s) => { if (alive) setGh(s); });
    void githubRepos(pubkey).then((r) => { if (alive) setRepos(r?.repos ?? null); });
    return () => { alive = false; };
    // re-busca quando a wallet muda OU quando um callback acabou de ligar (githubMsg ok).
  }, [pubkey, githubMsg?.kind]);

  // Callback do GitHub App: o GitHub redireciona pra cá com ?installation_id=…&setup_action=install
  // após o usuário autorizar. Liga a instalação ao workspace (a pubkey da wallet conectada).
  useEffect(() => {
    const cb = parseGithubCallback(window.location.search);
    if (!cb) return;
    if (!pubkey) {
      setGithubMsg({ kind: 'err', text: 'Conecte a wallet primeiro para vincular a instalação do GitHub ao seu workspace.' });
      return;
    }
    let cancelled = false;
    setGithubMsg({ kind: 'pending', text: 'Vinculando a instalação do GitHub ao seu workspace…' });
    void githubConnect({ installationId: cb.installationId, pubkey }).then((res) => {
      if (cancelled) return;
      if (res.ok) {
        setGithubMsg({ kind: 'ok', text: `GitHub conectado (instalação ${cb.installationId}). A DPO2U passa a atestar cada PR automaticamente — recarregue créditos em Billing.` });
      } else {
        setGithubMsg({ kind: 'err', text: `Falha ao vincular a instalação do GitHub: ${res.error ?? 'erro desconhecido'}` });
      }
      // Limpa os query params do callback da URL (evita re-disparar no refresh).
      const next = new URLSearchParams(searchParams);
      ['installation_id', 'setup_action', 'code', 'state'].forEach((k) => next.delete(k));
      setSearchParams(next, { replace: true });
    });
    return () => { cancelled = true; };
    // Só depende de pubkey: roda quando a wallet resolve (o callback vem na 1ª render).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pubkey]);

  const normRepo = repoUrl.replace(/^https?:\/\//, '').replace(/^github\.com\//, '').replace(/\.git$/, '');
  const emailValid = EMAIL_RE.test(email.trim());
  const canActivate = companyId.trim().length > 2 && normRepo.includes('/') && emailValid;

  const handle = (c: ManagedCall, onOk: (data: Record<string, unknown>) => void) => {
    if (c.kind === 'ok') { onOk(c.data); return true; }
    // Solana: o pagamento é via payment-gateway (USDC SPL), resolvido server-side.
    if (c.kind === 'payment_required') { setErr('O pagamento na Solana é via gateway (USDC SPL) e está em calibração no devnet. Tente novamente em instantes.'); return false; }
    // Repo privado (gateway /run → 409): em vez de erro seco, abre o painel de "disponibilizar acesso".
    if (c.kind === 'error' && c.status === 409) { setPrivateRepo({ repo: normRepo, granted: false }); return false; }
    setErr(c.message);
    return false;
  };

  // Abre o grant do GitHub em NOVA ABA (não navega a aba atual). Como esta aba não sai, o
  // estado React (form + pipelineId) fica intacto — sem necessidade de sessionStorage. O
  // binding instalação→wallet é feito pela própria aba nova ao voltar pra /app/activate.
  const onGrantPrivateAccess = () => {
    if (!pubkey) { setErr('Conecte a wallet primeiro.'); return; }
    window.open(githubInstallUrl({ state: pubkey }), '_blank', 'noopener,noreferrer');
    // Revela o "Tentar novamente" — o usuário volta aqui depois de autorizar na outra aba.
    setPrivateRepo((prev) => prev ? { ...prev, granted: true } : { repo: normRepo, granted: true });
  };

  // Após conceder o acesso e voltar: re-dispara a atestação naquele repo (agora legível via App).
  const onRetryPrivate = () => {
    setPrivateRepo(null);
    setErr(null);
    if (pipelineId) void onRun();
    else void onActivate();
  };

  // "Editar repositório": descarta o estado de privado E o pipeline, devolvendo o formulário.
  const onEditPrivateRepo = () => { setPrivateRepo(null); setPipelineId(null); setErr(null); };

  const onActivate = async () => {
    setErr(null); setBusy(true);
    try {
      if (!pubkey) { setErr('Conecte a wallet.'); return; }
      const payload = { company_id: companyId.trim(), repo_url: normRepo, countries, evaluate_ai: evaluateAi, email: email.trim(), pubkey, chain: managedChain };
      // O backend legado ainda pode checar repo_url
      const res = await managedActivate(payload as any, apiKey);
      handle(res, (data) => {
        const pid = String(data.pipeline_id || '');
        setPipelineId(pid);
        addPipeline({ id: pid, pubkey, repoUrl: companyId.trim(), chains: ['Solana'], jurisdictions: data.jurisdiction ? [String(data.jurisdiction)] : countries, trigger: 'managed', createdAt: Date.now() });
        // o setup já roda a 1ª atestação e ancora o selo — mostra a evidência na hora
        const fr = data.first_run as Record<string, unknown> | null | undefined;
        if (fr && fr.evidence_hash_hex) {
          setRunResult(fr);
          const frTx = (fr.tx ?? {}) as { innerTxHash?: string; explorerUrl?: string };
          addHistory({ pubkey, useCaseId: 'managed_compliance_v1', evidenceHashHex: String(fr.evidence_hash_hex), txHash: frTx.innerTxHash, verdict: fr.verdict ? String(fr.verdict) : undefined, score: typeof fr.score === 'number' ? fr.score : undefined, at: Date.now(), source: 'activate', chain: managedChain, explorerUrl: frTx.explorerUrl });
        } else if (data.first_run_error_code === 'repo_private_connect_github') {
          // Repo privado: abre o painel de "disponibilizar acesso no GitHub" (não manda pra Porta A).
          setPrivateRepo({ repo: normRepo, granted: false });
        } else {
          // pipeline registrado mas a 1ª atestação não concluiu — avisa e oferece re-rodar
          const why = data.first_run_error ? `: ${String(data.first_run_error)}` : '.';
          setErr(`Pipeline registrado, mas a 1ª atestação não concluiu${why} Clique em "Run pipeline now" para ancorar o selo.`);
        }
      });
    } finally { setBusy(false); }
  };

  const onRun = async () => {
    setErr(null); setBusy(true); setRunResult(null);
    try {
      const res = await managedRun({ pipeline_id: pipelineId || undefined, repo_url: pipelineId ? undefined : normRepo, company_id: companyId.trim(), countries, evaluate_ai: evaluateAi, pubkey: pubkey || undefined, chain: managedChain } as any, apiKey);
      handle(res, (data) => {
        setRunResult(data);
        if (pubkey && data.evidence_hash_hex) {
          const tx = data.tx as { innerTxHash?: string; explorerUrl?: string } | undefined;
          addHistory({ pubkey, useCaseId: 'managed_compliance_v1', evidenceHashHex: String(data.evidence_hash_hex), txHash: tx?.innerTxHash, verdict: data.verdict ? String(data.verdict) : undefined, score: typeof data.score === 'number' ? data.score : undefined, at: Date.now(), source: 'activate', chain: managedChain, explorerUrl: tx?.explorerUrl });
        }
      });
    } finally { setBusy(false); }
  };

  return (
    <div className="max-w-[760px]">
      <SmallLabel>Activate · Managed Protocol</SmallLabel>
      {githubMsg && (
        <div
          role="status"
          className="mt-3 p-3 text-[13px]"
          style={{
            border: `1px solid ${githubMsg.kind === 'err' ? PALETTE.terracotta : PALETTE.verdigris}`,
            borderRadius: 4,
            background: githubMsg.kind === 'err' ? 'rgba(193,84,57,.06)' : 'rgba(74,124,116,.08)',
            color: PALETTE.inkSoft,
            fontFamily: FONTS.mono,
          }}
        >
          {githubMsg.kind === 'pending' ? '⏳ ' : githubMsg.kind === 'ok' ? '✓ ' : '⚠ '}
          {githubMsg.text}
        </div>
      )}
      <h1 className="text-[30px] md:text-[38px] font-medium" style={{ fontFamily: FONTS.display, letterSpacing: '-0.02em', marginTop: 6 }}>
        Activate<span style={{ color: PALETTE.terracotta }}>.</span>
      </h1>
      <p className="mt-2 text-[15px]" style={{ color: PALETTE.inkSoft }}>
        Duas formas de selar compliance on-chain. <b>Conecte o GitHub</b> para a DPO2U atestar cada PR
        automaticamente (DPO-as-a-Service), ou <b>rode uma atestação única</b> num repositório agora.
      </p>

      {/* PORTA A — DPO-as-a-Service (GitHub contínuo). Só no estado inicial. */}
      {!pipelineId && !runResult && !busy && !privateRepo && (
        <div className="mt-8 p-6" style={{ border: `1px solid ${gh?.install ? PALETTE.verdigris : PALETTE.ruleStrong}`, borderRadius: 4, background: PALETTE.paper2 }}>
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <SmallLabel style={{ color: gh?.install ? PALETTE.verdigris : PALETTE.terracotta }}>Porta A · DPO-as-a-Service</SmallLabel>
              <h2 className="mt-1 text-[20px] font-medium" style={{ fontFamily: FONTS.display }}>Compliance contínuo no GitHub</h2>
            </div>
            {gh?.install && (
              <span style={{ fontFamily: FONTS.mono, fontSize: 11, color: PALETTE.verdigris, border: `1px solid ${PALETTE.verdigris}`, borderRadius: 999, padding: '3px 10px' }}>
                ✓ conectado
              </span>
            )}
          </div>

          {gh?.install ? (
            <>
              <p className="mt-3 text-[14px]" style={{ color: PALETTE.inkSoft }}>
                Conectado a <b style={{ fontFamily: FONTS.mono }}>{gh.install.account_login || 'sua conta'}</b> ·{' '}
                <b>{gh.credits}</b> crédito{gh.credits === 1 ? '' : 's'} de CI. Cada PR vira um selo (Check Run) e debita 1 crédito.
              </p>
              {repos && repos.length > 0 && (
                <div className="mt-4" style={{ border: `.5px solid ${PALETTE.rule}`, borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ padding: '8px 12px', background: PALETTE.paper, borderBottom: `.5px solid ${PALETTE.rule}` }}>
                    <SmallLabel>Repositórios conectados · {repos.length}</SmallLabel>
                  </div>
                  {repos.slice(0, 12).map((r) => (
                    <div key={`${r.installation_id}:${r.full_name}`} className="flex items-center justify-between gap-3"
                      style={{ padding: '8px 12px', borderTop: `.5px solid ${PALETTE.rule}` }}>
                      <span style={{ fontFamily: FONTS.mono, fontSize: 12, color: PALETTE.ink, wordBreak: 'break-all' }}>{r.full_name}</span>
                      <span className="flex items-center gap-2" style={{ flexShrink: 0 }}>
                        <span style={{ fontFamily: FONTS.mono, fontSize: 10, color: r.private ? PALETTE.terracotta : PALETTE.verdigris, border: `1px solid ${r.private ? PALETTE.terracotta : PALETTE.verdigris}`, borderRadius: 999, padding: '1px 8px' }}>
                          {r.private ? 'private' : 'public'}
                        </span>
                        <a href={r.html_url} target="_blank" rel="noreferrer" style={{ fontFamily: FONTS.mono, fontSize: 11, color: PALETTE.concrete, textDecoration: 'underline', textUnderlineOffset: 3 }}>↗</a>
                      </span>
                    </div>
                  ))}
                  {repos.length > 12 && <div style={{ padding: '6px 12px', borderTop: `.5px solid ${PALETTE.rule}`, fontFamily: FONTS.mono, fontSize: 11, color: PALETTE.concrete }}>+{repos.length - 12} mais…</div>}
                </div>
              )}
              <div className="mt-4 flex gap-3 flex-wrap">
                <a href={githubInstallUrl()} target="_blank" rel="noreferrer" className="py-2.5 px-5 font-mono text-[12px] uppercase tracking-[.14em]"
                  style={{ border: `1px solid ${PALETTE.ruleStrong}`, color: PALETTE.ink, textDecoration: 'none' }}>
                  Adicionar / gerenciar repos ↗
                </a>
                <Link to="/app/billing" className="py-2.5 px-5 font-mono text-[12px] uppercase tracking-[.14em]"
                  style={{ background: PALETTE.ink, color: PALETTE.paper, textDecoration: 'none' }}>
                  Recarregar créditos →
                </Link>
              </div>
            </>
          ) : (
            <>
              <p className="mt-3 text-[14px]" style={{ color: PALETTE.inkSoft }}>
                Conecte seus repositórios uma vez. A cada push/PR, a DPO2U roda o pipeline de compliance,
                posta um Check Run no PR e ancora um selo on-chain verificável em <code style={{ fontFamily: FONTS.mono }}>/verify</code>.
              </p>
              <p className="mt-2 text-[12px]" style={{ color: PALETTE.concrete }}>
                O GitHub fica vinculado <b>a esta wallet</b> ({truncatePubkey(pubkey)}). Se você já conectou com outra wallet,
                troque para ela na carteira para ver os repositórios — ou conecte aqui para re-vincular.
              </p>
              <button type="button" onClick={() => startGithubInstall(pubkey ?? undefined)} disabled={!pubkey}
                className="mt-4 py-3 px-6 font-mono text-[13px] uppercase tracking-[.14em]"
                style={{ background: pubkey ? PALETTE.terracotta : PALETTE.ruleStrong, color: '#fff', border: 'none', cursor: pubkey ? 'pointer' : 'not-allowed' }}>
                Conectar GitHub →
              </button>
              {!pubkey && <p className="mt-2 text-[11px]" style={{ color: PALETTE.concrete }}>Conecte a wallet primeiro.</p>}
            </>
          )}
        </div>
      )}

      {busy && (
        <div className="mt-8 p-6 flex items-center gap-4" style={{ border: `1px solid ${PALETTE.ruleStrong}`, borderRadius: 4, background: PALETTE.paper2 }}>
          <span aria-hidden style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${PALETTE.ruleStrong}`, borderTopColor: PALETTE.terracotta, display: 'inline-block', animation: 'dpo2u-spin 0.8s linear infinite' }} />
          <div>
            <SmallLabel>Processando</SmallLabel>
            <p className="mt-1 text-[14px]" style={{ color: PALETTE.inkSoft }}>A DPO2U está conectando, cobrando e ancorando o selo on-chain. Pode levar alguns segundos — não feche a aba.</p>
          </div>
          <style>{`@keyframes dpo2u-spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {!pipelineId && !runResult && !busy && !privateRepo && (
        <div className="mt-8 flex flex-col gap-5">
          <div style={{ borderTop: `.5px solid ${PALETTE.ruleStrong}`, paddingTop: 20 }}>
            <SmallLabel style={{ color: PALETTE.terracotta }}>Porta B · Attestation</SmallLabel>
            <h2 className="mt-1 text-[20px] font-medium" style={{ fontFamily: FONTS.display }}>Atestar um repositório agora</h2>
            <p className="mt-1 text-[13px]" style={{ color: PALETTE.inkSoft }}>
              Atestação única, sob demanda — paga por atestação · Solana devnet (Solflare / Phantom).
              {' '}Repo público: direto. Repo <b>privado</b>: a DPO2U te leva ao GitHub para autorizar o acesso e então atesta.
            </p>
          </div>
          <label className="flex flex-col gap-2">
            <SmallLabel>Company ID (CNPJ / VAT / DID)</SmallLabel>
            <input value={companyId} onChange={(e) => setCompanyId(e.target.value)} placeholder="00.000.000/0001-00"
              className="px-4 py-3" style={{ border: `1px solid ${PALETTE.ruleStrong}`, borderRadius: 4, background: PALETTE.paper, fontFamily: FONTS.mono, fontSize: 14 }} />
          </label>
          <label className="flex flex-col gap-2">
            <SmallLabel>Repository URL</SmallLabel>
            <input value={repoUrl} onChange={(e) => setRepoUrl(e.target.value)} placeholder="github.com/your-org/your-repo"
              className="px-4 py-3" style={{ border: `1px solid ${PALETTE.ruleStrong}`, borderRadius: 4, background: PALETTE.paper, fontFamily: FONTS.mono, fontSize: 14 }} />
            <span className="text-[11px]" style={{ color: PALETTE.concrete }}>Necessário para atestar o compliance diretamente no código-fonte.</span>
          </label>
          <label className="flex flex-col gap-2">
            <SmallLabel>Jurisdictions (Multiple Selection)</SmallLabel>
            <div className="flex flex-col gap-2 p-3" style={{ border: `1px solid ${PALETTE.ruleStrong}`, borderRadius: 4, background: PALETTE.paper }}>
              {[
                { id: 'LGPD', label: 'Brasil (LGPD)' },
                { id: 'CCPA', label: 'USA / California (CCPA)' },
                { id: 'GDPR', label: 'Europe (GDPR)' },
                { id: 'PIPEDA', label: 'Canada (PIPEDA)' },
                { id: 'LAW25', label: 'Quebec (Law 25)' },
                { id: 'POPIA', label: 'South Africa (POPIA)' },
                { id: 'UAE', label: 'Abu Dhabi / Dubai (ADGM/UAE)' },
                { id: 'MICAR', label: 'MiCAR (Crypto EU - ART)' },
                { id: 'MICAR-CASP', label: 'MiCAR (Crypto EU - CASP)' },
                { id: 'DPDP', label: 'India (DPDP)' },
                { id: 'PDPA', label: 'Singapore (PDPA)' },
                { id: 'NDPA', label: 'Nigeria (NDPA)' },
                { id: 'PIPA', label: 'South Korea (PIPA)' },
                { id: 'PDP', label: 'Indonesia (PDP)' },
                { id: 'APPI', label: 'Japan (APPI)' },
                { id: 'MEXICO', label: 'Mexico (LFPDPPP)' },
                { id: 'VIETNAM', label: 'Vietnam (Decree 13)' },
                { id: 'MALAYSIA', label: 'Malaysia (PDPA)' },
                { id: 'KENYA', label: 'Kenya (DPA)' },
                { id: 'GHANA', label: 'Ghana (DPA)' },
                { id: 'COLOMBIA', label: 'Colombia (Ley 1581)' },
                { id: 'TANZANIA', label: 'Tanzania (PDPA)' },
                { id: 'RWANDA', label: 'Rwanda (Law 058)' },
                { id: 'UGANDA', label: 'Uganda (DPPA)' },
              ].map((j) => (
                <label key={j.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={countries.includes(j.id)}
                    onChange={(e) => {
                      if (e.target.checked) setCountries((prev) => [...prev, j.id]);
                      else setCountries((prev) => prev.filter((c) => c !== j.id));
                    }}
                    style={{ accentColor: PALETTE.terracotta }}
                  />
                  <span style={{ fontFamily: FONTS.mono, fontSize: 13, color: PALETTE.ink }}>{j.label}</span>
                </label>
              ))}
            </div>
            <span className="text-[11px]" style={{ color: PALETTE.concrete }}>O motor IA executará em paralelo para cada país selecionado.</span>
          </label>
          <label className="flex items-center gap-3 mt-2 cursor-pointer">
            <input
              type="checkbox"
              checked={evaluateAi}
              onChange={(e) => setEvaluateAi(e.target.checked)}
              style={{ accentColor: PALETTE.terracotta, width: 16, height: 16 }}
            />
            <div className="flex flex-col">
              <span style={{ fontFamily: FONTS.body, fontSize: 14, fontWeight: 500, color: PALETTE.ink }}>Evaluate AI Frameworks</span>
              <span className="text-[11px]" style={{ color: PALETTE.concrete }}>Valida aderência a CAIDP AI Index e Hiroshima Process.</span>
            </div>
          </label>
          <label className="flex flex-col gap-2">
            <SmallLabel>Email</SmallLabel>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@empresa.com"
              className="px-4 py-3" style={{ border: `1px solid ${PALETTE.ruleStrong}`, borderRadius: 4, background: PALETTE.paper, fontFamily: FONTS.mono, fontSize: 14 }} />
            <span className="text-[11px]" style={{ color: PALETTE.concrete }}>Pra te enviarmos o relatório e atualizações.</span>
          </label>
          {err && <p style={{ color: PALETTE.terracotta, fontFamily: FONTS.mono, fontSize: 13 }}>{err}</p>}
          <button type="button" disabled={!canActivate} onClick={() => void onActivate()} className="py-3 px-6 font-mono text-[13px] uppercase tracking-[.14em]"
            style={{ background: canActivate ? PALETTE.terracotta : PALETTE.ruleStrong, color: '#fff', border: 'none', cursor: canActivate ? 'pointer' : 'not-allowed', alignSelf: 'flex-start' }}>
            Activate (pay setup) →
          </button>
        </div>
      )}

      {/* Repo privado → disponibilizar acesso no GitHub (precede o card "Pipeline registered"). */}
      {privateRepo && !busy && (
        <div className="mt-8 p-6" style={{ border: `1px solid ${privateRepo.granted ? PALETTE.verdigris : PALETTE.terracotta}`, borderRadius: 4, background: privateRepo.granted ? 'rgba(74,124,116,.08)' : 'rgba(193,84,57,.06)' }}>
          <SmallLabel style={{ color: privateRepo.granted ? PALETTE.verdigris : PALETTE.terracotta }}>
            {privateRepo.granted ? 'Acesso concedido' : 'Repositório privado'}
          </SmallLabel>
          <h2 className="mt-1 text-[20px] font-medium" style={{ fontFamily: FONTS.display }}>
            {privateRepo.granted ? 'Pronto para atestar' : 'Autorize o acesso no GitHub'}
          </h2>
          <p className="mt-2 text-[14px]" style={{ color: PALETTE.inkSoft }}>
            {privateRepo.granted ? (
              <>Depois de autorizar <b style={{ fontFamily: FONTS.mono }}>{privateRepo.repo}</b> na aba do GitHub, volte aqui e clique em <b>Tentar novamente</b>. (Se o repositório ainda aparecer como privado, confirme que ele foi incluído na autorização.)</>
            ) : (
              <>A DPO2U não consegue ler <b style={{ fontFamily: FONTS.mono }}>{privateRepo.repo}</b> porque o repositório é <b>privado</b>.
              {' '}Abrimos o GitHub <b>numa nova aba</b> para você autorizar o acesso (você escolhe exatamente quais repositórios liberar); depois volte a esta aba.</>
            )}
          </p>
          <div className="mt-4 flex gap-3 flex-wrap">
            {privateRepo.granted ? (
              <>
                <button type="button" onClick={onRetryPrivate} className="py-2.5 px-5 font-mono text-[12px] uppercase tracking-[.14em]"
                  style={{ background: PALETTE.ink, color: PALETTE.paper, border: 'none', cursor: 'pointer' }}>
                  Tentar novamente →
                </button>
                <button type="button" onClick={onGrantPrivateAccess} disabled={!pubkey} className="py-2.5 px-5 font-mono text-[12px] uppercase tracking-[.14em]"
                  style={{ border: `1px solid ${PALETTE.ruleStrong}`, color: PALETTE.ink, background: 'transparent', cursor: pubkey ? 'pointer' : 'not-allowed' }}>
                  Abrir GitHub de novo ↗
                </button>
              </>
            ) : (
              <button type="button" onClick={onGrantPrivateAccess} disabled={!pubkey} className="py-2.5 px-5 font-mono text-[12px] uppercase tracking-[.14em]"
                style={{ background: pubkey ? PALETTE.terracotta : PALETTE.ruleStrong, color: '#fff', border: 'none', cursor: pubkey ? 'pointer' : 'not-allowed' }}>
                Disponibilizar acesso no GitHub ↗ (nova aba)
              </button>
            )}
            <button type="button" onClick={onEditPrivateRepo} className="py-2.5 px-5 font-mono text-[12px] uppercase tracking-[.14em]"
              style={{ border: `1px solid ${PALETTE.ruleStrong}`, color: PALETTE.ink, background: 'transparent', cursor: 'pointer' }}>
              Editar repositório
            </button>
          </div>
          {!pubkey && !privateRepo.granted && <p className="mt-2 text-[11px]" style={{ color: PALETTE.concrete }}>Conecte a wallet primeiro.</p>}
        </div>
      )}

      {pipelineId && !runResult && !busy && !privateRepo && (
        <div className="mt-8 p-6" style={{ border: `1px solid ${PALETTE.verdigris}`, borderRadius: 4, background: 'rgba(74,124,116,.08)' }}>
          <SmallLabel style={{ color: PALETTE.verdigris }}>Pipeline registered</SmallLabel>
          <h2 className="mt-2 text-[20px] font-medium" style={{ fontFamily: FONTS.display }}>{companyId}</h2>
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
    </div>
  );
}
