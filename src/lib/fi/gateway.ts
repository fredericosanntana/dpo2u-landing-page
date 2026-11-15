// Cliente do gateway para a jornada da instituição financeira (/financial-institutions e /app/fi).
// Sessão em cookie httpOnly do gateway: toda chamada vai com credentials: 'include'.

export const GATEWAY_BASE = (
  (import.meta.env.VITE_GATEWAY_BASE_URL as string | undefined) ??
  (import.meta.env.VITE_MCP_BASE_URL as string | undefined) ??
  'https://mcp.dpo2u.com'
).replace(/\/+$/, '');

export class GatewayError extends Error {
  constructor(readonly status: number, readonly code: string, message: string) {
    super(message);
  }
}

export async function gw<T>(path: string, init: { method?: string; body?: unknown } = {}): Promise<T> {
  const res = await fetch(`${GATEWAY_BASE}${path}`, {
    method: init.method ?? (init.body === undefined ? 'GET' : 'POST'),
    credentials: 'include',
    headers: init.body === undefined ? undefined : { 'content-type': 'application/json' },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
  });
  if (res.status === 204) return undefined as T;
  const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (!res.ok) throw new GatewayError(res.status, String(data.error ?? 'error'), String(data.message ?? data.error ?? `HTTP ${res.status}`));
  return data as T;
}

export type Role = 'owner' | 'approver' | 'client_reviewer';
export interface Member { id: string; email: string; role: Role; status: 'invited' | 'active' }
export interface Workspace { id: string; name: string; created_at: string; members: Member[] }
export interface SessionView { member: Member; workspace: Workspace }

export interface DiagnosticGap { ruleId: string; title: string; citation: string; severity: string; origin: string }
export interface DiagnosticPack { id: string; title: string; jurisdiction: string; why: string; generic: boolean; rules: number; covered: number; gaps: DiagnosticGap[] }
export interface DiagnosticReport {
  market: string;
  region: 'BR' | 'EU' | 'OTHER';
  institutionType: string;
  travelRuleThresholdUsd: number;
  packs: DiagnosticPack[];
  totals: { rules: number; covered: number; gaps: number; critical: number };
  notes: string[];
}

export interface DiagnosticRequest {
  market: string;
  institution_type: string;
  services: string[];
  uses_partners: boolean;
  monthly_volume_usd?: number;
  contact?: { email: string; consent: true; name?: string; company?: string };
}

export const api = {
  diagnose: (body: DiagnosticRequest) => gw<{ lead_id: string; report: DiagnosticReport }>('/api/v1/diagnostics', { body }),
  magicLink: (body: { email: string; workspace_name?: string; lead_id?: string }) => gw<{ status: string }>('/api/v1/auth/magic-link', { body }),
  verify: (token: string) => gw<{ workspace: Workspace; member: Member; created: boolean }>('/api/v1/auth/verify', { body: { token } }),
  session: () => gw<SessionView>('/api/v1/auth/session'),
  logout: () => gw<void>('/api/v1/auth/logout', { body: {} }),
  invite: (email: string, role: Role) => gw<{ member: Member }>('/api/v1/workspace/invites', { body: { email, role } }),
  listKeys: () => gw<{ api_keys: { id: string; label?: string; createdAt: number | string; lastUsed?: number; requestCount: number }[] }>('/api/v1/workspace/api-keys'),
  createKey: (label: string) => gw<{ api_key: string; user_id: string; label: string }>('/api/v1/workspace/api-keys', { body: { label } }),
  revokeKey: (id: string) => gw<{ revoked: true }>(`/api/v1/workspace/api-keys/${encodeURIComponent(id)}/revoke`, { body: {} }),
};

/** Guarda o lead do diagnóstico para o cadastro levar junto. */
export const LEAD_KEY = 'dpo2u.fi.lead';
export function rememberLead(id: string, report: DiagnosticReport): void {
  try {
    sessionStorage.setItem(LEAD_KEY, JSON.stringify({ id, report }));
  } catch {
    /* storage indisponível: o cadastro segue sem o lead */
  }
}
export function recallLead(): { id: string; report: DiagnosticReport } | null {
  try {
    const raw = sessionStorage.getItem(LEAD_KEY);
    return raw ? (JSON.parse(raw) as { id: string; report: DiagnosticReport }) : null;
  } catch {
    return null;
  }
}
