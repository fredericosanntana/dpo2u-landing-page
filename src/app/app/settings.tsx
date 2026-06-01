/**
 * /app/settings — wallet, workspace, tier + OSS API key (Fase E).
 * The wallet session is client-only; the OSS API key (reused from the pilot
 * auth-store) is what authorizes writes to the gateway until wallet-signature
 * auth exists server-side.
 */
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FONTS, PALETTE, SmallLabel, Rule } from '@/components/sealed/atoms';
import { useWalletAuth } from '@/components/app/WalletAuthProvider';
import { useAuthStore, maskApiKey } from '@/lib/pilot/auth-store';
import { githubStatus, githubRepos, startGithubInstall, githubInstallUrl, type GithubStatus, type GithubRepo } from '@/lib/app/github-client';
import { truncatePubkey } from '@/lib/app/wallet-session';

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <SmallLabel>{label}</SmallLabel>
      <div style={{ fontFamily: FONTS.mono, fontSize: 13, marginTop: 4, wordBreak: 'break-all' }}>{value}</div>
    </div>
  );
}

export default function AppSettings() {
  const { pubkey, chain, network, tier, workspace, disconnect } = useWalletAuth();
  const navigate = useNavigate();
  const apiKey = useAuthStore((s) => s.apiKey);
  const setSession = useAuthStore((s) => s.setSession);
  const clearKey = useAuthStore((s) => s.clear);
  const [keyInput, setKeyInput] = useState('');
  const [gh, setGh] = useState<GithubStatus | null>(null);
  const [repos, setRepos] = useState<GithubRepo[] | null>(null);
  useEffect(() => {
    if (!pubkey) { setGh(null); setRepos(null); return; }
    let alive = true;
    void githubStatus(pubkey).then((s) => { if (alive) setGh(s); });
    void githubRepos(pubkey).then((r) => { if (alive) setRepos(r?.repos ?? null); });
    return () => { alive = false; };
  }, [pubkey]);

  return (
    <div className="max-w-[720px]">
      <SmallLabel>Settings</SmallLabel>
      <h1 className="text-[30px] md:text-[38px] font-medium" style={{ fontFamily: FONTS.display, letterSpacing: '-0.02em', marginTop: 6 }}>
        Workspace<span style={{ color: PALETTE.terracotta }}>.</span>
      </h1>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Field label="Workspace" value={workspace.label} />
        <Field label="Plan / tier" value={tier.label} />
        <Field label="Wallet" value={pubkey ?? '—'} />
        <Field label="Chain · network" value={`${chain ?? '—'} · ${network ?? '—'}`} />
      </div>

      <div className="mt-6">
        <button type="button" onClick={() => { disconnect(); navigate('/'); }} className="py-2.5 px-5 font-mono text-[12px] uppercase tracking-[.14em]"
          style={{ border: `1px solid ${PALETTE.ruleStrong}`, color: PALETTE.ink, background: 'transparent', cursor: 'pointer' }}>
          Disconnect wallet
        </button>
      </div>

      <Rule style={{ margin: '32px 0' }} color={PALETTE.ruleStrong} />

      <SmallLabel style={{ marginBottom: 8 }}>GitHub / CI</SmallLabel>
      {gh?.install ? (
        <div className="p-4" style={{ border: `1px solid ${PALETTE.verdigris}`, borderRadius: 4, background: 'rgba(74,124,116,.08)' }}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Conta GitHub" value={gh.install.account_login || '—'} />
            <Field label="Installation" value={String(gh.install.installation_id)} />
            <Field label="Créditos CI" value={String(gh.credits)} />
          </div>
          {repos && repos.length > 0 && (
            <div className="mt-4" style={{ border: `.5px solid ${PALETTE.rule}`, borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ padding: '8px 12px', background: PALETTE.paper, borderBottom: `.5px solid ${PALETTE.rule}` }}>
                <SmallLabel>Repositórios conectados · {repos.length}</SmallLabel>
              </div>
              {repos.slice(0, 20).map((r) => (
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
              {repos.length > 20 && <div style={{ padding: '6px 12px', borderTop: `.5px solid ${PALETTE.rule}`, fontFamily: FONTS.mono, fontSize: 11, color: PALETTE.concrete }}>+{repos.length - 20} mais…</div>}
            </div>
          )}
          <div className="mt-4 flex gap-3 flex-wrap">
            <a href={githubInstallUrl()} target="_blank" rel="noreferrer" className="py-2 px-4 font-mono text-[11px] uppercase tracking-[.14em]"
              style={{ border: `1px solid ${PALETTE.ruleStrong}`, color: PALETTE.ink, textDecoration: 'none' }}>Gerenciar repos ↗</a>
            <Link to="/app/billing" className="py-2 px-4 font-mono text-[11px] uppercase tracking-[.14em]"
              style={{ background: PALETTE.ink, color: PALETTE.paper, textDecoration: 'none' }}>Recarregar créditos →</Link>
          </div>
        </div>
      ) : (
        <div className="p-4" style={{ border: `1px solid ${PALETTE.ruleStrong}`, borderRadius: 4, background: PALETTE.paper2 }}>
          <p className="text-[14px] mb-3" style={{ color: PALETTE.inkSoft }}>
            Esta wallet (<b style={{ fontFamily: FONTS.mono }}>{truncatePubkey(pubkey)}</b>) ainda não tem GitHub conectado.
            O vínculo é <b>por wallet</b> — se você conectou com outra wallet, troque para ela na carteira; ou conecte aqui (re-vincula a instalação a esta wallet).
          </p>
          <button type="button" onClick={() => startGithubInstall(pubkey ?? undefined)} disabled={!pubkey}
            className="py-2.5 px-5 font-mono text-[12px] uppercase tracking-[.14em]"
            style={{ background: pubkey ? PALETTE.terracotta : PALETTE.ruleStrong, color: '#fff', border: 'none', cursor: pubkey ? 'pointer' : 'not-allowed' }}>
            Conectar GitHub →
          </button>
        </div>
      )}

      <Rule style={{ margin: '32px 0' }} color={PALETTE.ruleStrong} />

      <SmallLabel style={{ marginBottom: 8 }}>OSS gateway API key</SmallLabel>
      <p className="text-[13px] mb-3" style={{ color: PALETTE.inkSoft }}>
        Escrita no gateway (submit/erasure) ainda usa chave API OSS — auth por assinatura de wallet é roadmap. Atual: <b style={{ fontFamily: FONTS.mono }}>{maskApiKey(apiKey)}</b>.
      </p>
      <div className="flex gap-2 flex-wrap">
        <input value={keyInput} onChange={(e) => setKeyInput(e.target.value)} placeholder="dpo2u_sk_…" className="px-4 py-2.5 flex-1 min-w-[220px]"
          style={{ border: `1px solid ${PALETTE.ruleStrong}`, borderRadius: 4, background: PALETTE.paper, fontFamily: FONTS.mono, fontSize: 13 }} />
        <button type="button" onClick={() => { if (keyInput.trim()) { setSession({ apiKey: keyInput.trim() }); setKeyInput(''); } }}
          className="py-2.5 px-5 font-mono text-[12px] uppercase tracking-[.14em]" style={{ background: PALETTE.ink, color: PALETTE.paper, border: 'none', cursor: 'pointer' }}>
          Save key
        </button>
        {apiKey && (
          <button type="button" onClick={() => clearKey()} className="py-2.5 px-5 font-mono text-[12px] uppercase tracking-[.14em]"
            style={{ border: `1px solid ${PALETTE.ruleStrong}`, color: PALETTE.concrete, background: 'transparent', cursor: 'pointer' }}>
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
