// github-client.ts — cliente do GitHub App (gateway /api/v1/github/*).
//
// Após o usuário autorizar a instalação do App, o GitHub redireciona pro callback
// (/app/activate) com ?installation_id=…&setup_action=install[&code=…]. Este módulo
// liga essa instalação ao workspace (a pubkey da wallet conectada) via /connect, e lê
// o /status (binding + créditos de CI). Read/POST simples — sem x402.

import { parseX402Challenge, type X402Challenge } from '@/lib/pilot/payment-tx';

const BASE = (import.meta.env.VITE_MCP_BASE_URL as string | undefined) ?? 'https://mcp.dpo2u.com';

export type GithubCreditsCall =
  | { kind: 'ok'; balance: number; added: number }
  | { kind: 'payment_required'; challenge: X402Challenge }
  | { kind: 'error'; message: string };

/** Recarrega créditos de CI. O pagamento na Solana é via gateway (USDC SPL),
 *  resolvido server-side. 1 pagamento = 1 pack de créditos. */
export async function rechargeCredits(pubkey: string, xPayment?: string): Promise<GithubCreditsCall> {
  try {
    const headers: Record<string, string> = { 'content-type': 'application/json' };
    if (xPayment) headers['x-payment'] = xPayment;
    const res = await fetch(`${BASE.replace(/\/+$/, '')}/api/v1/github/credits`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ pubkey }),
    });
    if (res.status === 402) {
      const challenge = parseX402Challenge(await res.json().catch(() => null));
      if (!challenge) return { kind: 'error', message: 'desafio x402 malformado' };
      return { kind: 'payment_required', challenge };
    }
    const json = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    if (!res.ok) return { kind: 'error', message: String(json.message || json.error || `HTTP ${res.status}`) };
    return { kind: 'ok', balance: Number(json.balance ?? 0), added: Number(json.added ?? 0) };
  } catch (e) {
    return { kind: 'error', message: e instanceof Error ? e.message : String(e) };
  }
}

// Slug do GitHub App (a URL pública é github.com/apps/<slug>). Configurável por env pro
// build; default = 'dpo2u-compliance' (slug provável do App "DPO2U Compliance" 3918317).
export function githubAppSlug(): string {
  return (import.meta.env.VITE_GITHUB_APP_SLUG as string | undefined) ?? 'dpo2u-compliance';
}

/** URL de instalação do App — abre a tela de consentimento do GitHub (escolher repos).
 *  `state` opcional volta no callback (ex.: a pubkey, pra robustez futura). */
export function githubInstallUrl(opts?: { state?: string }): string {
  const base = `https://github.com/apps/${githubAppSlug()}/installations/new`;
  return opts?.state ? `${base}?state=${encodeURIComponent(opts.state)}` : base;
}

/** Inicia o fluxo de conexão: redireciona o browser pro consentimento do GitHub.
 *  Ao terminar, o GitHub volta pro callback (/app/activate?installation_id=…). */
export function startGithubInstall(state?: string): void {
  if (typeof window !== 'undefined') window.location.href = githubInstallUrl({ state });
}

export interface GithubStatus {
  enabled: boolean;
  bound: boolean;
  credits: number;
  install?: { installation_id: number; account_login: string; pubkey: string; chain: 'solana' } | null;
}

export interface GithubConnectResult {
  ok: boolean;
  installation_id?: number;
  pubkey?: string;
  chain?: 'solana';
  error?: string;
}

/** Liga a instalação do App ao workspace (pubkey). Chamado no callback do /app/activate. */
export async function githubConnect(args: {
  installationId: number;
  accountLogin?: string;
  pubkey: string;
}): Promise<GithubConnectResult> {
  try {
    const res = await fetch(`${BASE.replace(/\/+$/, '')}/api/v1/github/connect`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        installation_id: args.installationId,
        account_login: args.accountLogin ?? '',
        pubkey: args.pubkey,
      }),
    });
    const json = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    if (!res.ok) return { ok: false, error: String(json.message || json.error || `HTTP ${res.status}`) };
    return {
      ok: true,
      installation_id: typeof json.installation_id === 'number' ? json.installation_id : undefined,
      pubkey: typeof json.pubkey === 'string' ? json.pubkey : undefined,
      chain: 'solana',
    };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

/** Lê o status do binding + créditos pra esta pubkey/instalação. Read-only. */
export async function githubStatus(pubkey?: string, installationId?: number): Promise<GithubStatus | null> {
  try {
    const qs = new URLSearchParams();
    if (pubkey) qs.set('pubkey', pubkey);
    if (installationId) qs.set('installation_id', String(installationId));
    const res = await fetch(`${BASE.replace(/\/+$/, '')}/api/v1/github/status?${qs.toString()}`);
    if (!res.ok) return null;
    return (await res.json()) as GithubStatus;
  } catch {
    return null;
  }
}

export interface GithubRepo {
  full_name: string;
  private: boolean;
  html_url: string;
  pushed_at: string | null;
  installation_id: number;
}
export interface GithubReposResult { enabled: boolean; total: number; repos: GithubRepo[] }

/** Lista os repositórios conectados à DPO2U p/ esta wallet (read-only). */
export async function githubRepos(pubkey: string): Promise<GithubReposResult | null> {
  try {
    const res = await fetch(`${BASE.replace(/\/+$/, '')}/api/v1/github/repos?pubkey=${encodeURIComponent(pubkey)}`);
    if (!res.ok) return null;
    return (await res.json()) as GithubReposResult;
  } catch {
    return null;
  }
}

/** Lê installation_id + setup_action + code dos query params do callback do GitHub. */
export function parseGithubCallback(search: string): { installationId: number; setupAction: string | null; code: string | null } | null {
  const p = new URLSearchParams(search);
  const idRaw = p.get('installation_id');
  if (!idRaw) return null;
  const installationId = Number(idRaw);
  if (!Number.isFinite(installationId) || installationId <= 0) return null;
  return { installationId, setupAction: p.get('setup_action'), code: p.get('code') };
}
