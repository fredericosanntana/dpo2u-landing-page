// github-client.ts — cliente do GitHub App (gateway /api/v1/github/*).
//
// Após o usuário autorizar a instalação do App, o GitHub redireciona pro callback
// (/app/activate) com ?installation_id=…&setup_action=install[&code=…]. Este módulo
// liga essa instalação ao workspace (a pubkey da wallet conectada) via /connect, e lê
// o /status (binding + créditos de CI). Read/POST simples — sem x402.

const BASE = (import.meta.env.VITE_MCP_BASE_URL as string | undefined) ?? 'https://mcp.dpo2u.com';

export interface GithubStatus {
  enabled: boolean;
  bound: boolean;
  credits: number;
  install?: { installation_id: number; account_login: string; pubkey: string; chain: 'stellar' | 'solana' } | null;
}

export interface GithubConnectResult {
  ok: boolean;
  installation_id?: number;
  pubkey?: string;
  chain?: 'stellar' | 'solana';
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
      chain: json.chain === 'solana' ? 'solana' : 'stellar',
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

/** Lê installation_id + setup_action + code dos query params do callback do GitHub. */
export function parseGithubCallback(search: string): { installationId: number; setupAction: string | null; code: string | null } | null {
  const p = new URLSearchParams(search);
  const idRaw = p.get('installation_id');
  if (!idRaw) return null;
  const installationId = Number(idRaw);
  if (!Number.isFinite(installationId) || installationId <= 0) return null;
  return { installationId, setupAction: p.get('setup_action'), code: p.get('code') };
}
