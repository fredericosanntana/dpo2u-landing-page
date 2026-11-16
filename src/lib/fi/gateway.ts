// Cliente do gateway para a jornada da instituição financeira (/financial-institutions e /app/fi).
// Sessão em cookie httpOnly do gateway: toda chamada vai com credentials: 'include'.

export const GATEWAY_BASE = (
  (import.meta.env.VITE_GATEWAY_BASE_URL as string | undefined) ??
  (import.meta.env.VITE_MCP_BASE_URL as string | undefined) ??
  'https://mcp.dpo2u.com'
).replace(/\/+$/, '');

export class GatewayError extends Error {
  constructor(readonly status: number, readonly code: string, message: string, readonly body: Record<string, unknown> = {}) {
    super(message);
  }
}

export async function gw<T>(path: string, init: { method?: string; body?: unknown; apiKey?: string; payment?: string; grantToken?: string } = {}): Promise<T> {
  const headers: Record<string, string> = {};
  if (init.body !== undefined) headers['content-type'] = 'application/json';
  if (init.apiKey) headers['x-api-key'] = init.apiKey;
  if (init.payment) headers['x-payment'] = init.payment;
  if (init.grantToken) headers['x-grant-token'] = init.grantToken;
  const res = await fetch(`${GATEWAY_BASE}${path}`, {
    method: init.method ?? (init.body === undefined ? 'GET' : 'POST'),
    // Chave de operador nunca vai junto com o cookie da instituição.
    credentials: init.apiKey || init.grantToken ? 'omit' : 'include',
    headers,
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
  });
  if (res.status === 204) return undefined as T;
  const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (!res.ok) throw new GatewayError(res.status, String(data.error ?? 'error'), String(data.message ?? data.error ?? `HTTP ${res.status}`), data);
  return data as T;
}

export type Role = 'owner' | 'approver' | 'client_reviewer';
export interface Member { id: string; email: string; role: Role; status: 'invited' | 'active' }
export interface Workspace { id: string; name: string; created_at: string; self_company_id?: string; members: Member[] }
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
  /** Língua do relatório; o gateway traduz títulos, motivos, notas e o e-mail. */
  lang?: 'en' | 'pt' | 'es';
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

// ── E3: passaporte e fila de revisão ─────────────────────────────────────────
export type Tier = 'tier1-machine-only' | 'tier1' | 'tier2' | 'tier3';
export interface SubmitBody { use_case_id: string; request_id: string; evidence: Record<string, unknown>; chain?: string }
export interface Attempt { attempt_id: string; status: string; result?: { verdict: string; evidence_hash_hex: string; predicate_results: { id: string; verdict: string; reason: string }[]; tx?: { explorerUrl?: string } }; error?: string | { message?: string; code?: string } }
export interface Prepared { run_id: string; packs: { id: string; hash: string }[]; verdicts: Record<string, string>; to_review: { id: string; origin: string; citation: string }[] }
export interface ReviewRequestView {
  id: string; client_id: string; run_id: string; tier: Tier; packs: { id: string; hash: string }[];
  to_review: { id: string; origin: string; citation: string }[]; server_verdicts: Record<string, string>;
  status: 'pending' | 'issued' | 'returned' | 'blocked'; requested_at: string; decided_at?: string; passport_id?: string; note?: string;
}
export interface PassportView { id: string; status: string; tier: Tier; verdicts: { pass: number; pending: number }; reviewer?: { id: string; name: string }; issuedAt: string; expiresAt: string }

export const passportApi = {
  submit: (body: SubmitBody) => gw<{ attempt_id: string; status: string }>('/api/v1/attestation/submit', { body }),
  attempt: (id: string) => gw<Attempt>(`/api/v1/attestation/${encodeURIComponent(id)}`),
  prepare: (attempt_id: string, submit_body: SubmitBody) => gw<Prepared>('/api/v1/psav/passports/prepare', { body: { attempt_id, submit_body } }),
  requestReview: (run_id: string, tier: Tier) => gw<ReviewRequestView>('/api/v1/psav/review-requests', { body: { run_id, tier } }),
  myRequests: () => gw<{ requests: ReviewRequestView[] }>('/api/v1/psav/review-requests'),
  passport: (id: string) => gw<PassportView>(`/api/v1/psav/passports/${encodeURIComponent(id)}`),
};

export const reviewApi = {
  queue: (apiKey: string) => gw<{ requests: ReviewRequestView[] }>('/api/v1/review/queue', { apiKey }),
  payload: (apiKey: string, id: string, verdicts: Record<string, 'PASS' | 'FAIL'>) => gw<{ payload: string }>(`/api/v1/review/requests/${encodeURIComponent(id)}/payload`, { apiKey, body: { verdicts } }),
  decide: (apiKey: string, id: string, body: { reviewer_id: string; verdicts: Record<string, 'PASS' | 'FAIL'>; signature: string }) =>
    gw<{ passport: PassportView; midnight?: { status: string }; avalanche?: { status: string } }>(`/api/v1/review/requests/${encodeURIComponent(id)}/decision`, { apiKey, body }),
  giveBack: (apiKey: string, id: string, reason: string) => gw<ReviewRequestView>(`/api/v1/review/requests/${encodeURIComponent(id)}/return`, { apiKey, body: { reason } }),
};

// ── E8: planos e cobrança x402 ──────────────────────────────────────────────
export interface PlanView { id: string; name: string; annual_usd: number; monthly_usd: number; limits: { passportsPerYear: number; transfersPerMonth: number; members: number } }
export interface BillingView {
  state: 'trial' | 'active' | 'expired'; trial_ends_at: string; days_left: number;
  plan: { id: string; name: string; period: 'annual' | 'monthly'; paid_through: string } | null;
  invoices: { id: string; plan: string; period: string; amount_usd: number; asset: string; network: string; tx_hash: string; paid_at: string; period_end: string }[];
}
export const billingApi = {
  get: () => gw<{ plans: PlanView[]; subscription: BillingView; usage?: { transfers_30d: number; pass: number; fail: number; review: number }; payment: { method: string; asset: string; network: string; available: boolean } }>('/api/v1/billing'),
  /** Sem payment: o gateway responde 402 com o desafio x402 (vem em GatewayError.body). */
  buy: (plan: string, period: 'annual' | 'monthly', payment?: string) => gw<{ subscription: BillingView }>('/api/v1/billing/plan', { body: { plan, period }, payment }),
};

// ── E5: patrocínio por convite ──────────────────────────────────────────────
export interface InviteView {
  id: string; sponsor: { id: string; name?: string }; partner_email: string; partner_workspace_id?: string;
  required_packs: string[]; min_tier: Tier; accountable_director: string;
  status: 'invited' | 'proposed' | 'active' | 'suspended' | 'ended'; created_at: string; accepted_at?: string; passport: PassportView | null;
}
export const sponsorshipApi = {
  list: () => gw<{ sent: InviteView[]; received: InviteView[] }>('/api/v1/sponsorship-invites'),
  invite: (body: { partner_email: string; accountable_director: string; min_tier?: Tier }) => gw<InviteView>('/api/v1/sponsorship-invites', { body }),
  accept: (id: string) => gw<InviteView>(`/api/v1/sponsorship-invites/${encodeURIComponent(id)}/accept`, { body: {} }),
};

// ── E6: Travel Rule e casos ─────────────────────────────────────────────────
export interface TransferView {
  id: string; transfer_ref: string; verdict: 'PASS' | 'FAIL' | 'REVIEW'; status: string;
  reasons: { code: string; ruleId?: string; detail: string }[]; amount_usd: number; market: string; threshold_usd: number;
  counterparty: { type: string; passport_id?: string; passport_status?: string }; case_id?: string; created_at: string; latency_ms: number;
}
export interface CaseView {
  id: string; transferId: string; verdict: 'FAIL' | 'REVIEW'; status: 'open' | 'released' | 'kept_blocked'; ownerEmail?: string; dueAt: string;
  reasons: TransferView['reasons']; history: { at: string; by: string; action: string; justification?: string }[]; createdAt: string; transfer: TransferView | null;
}
export const travelRuleApi = {
  transfers: () => gw<{ transfers: TransferView[] }>('/api/v1/travel-rule/transfers'),
  cases: () => gw<{ cases: CaseView[] }>('/api/v1/travel-rule/cases'),
  decide: (id: string, action: 'release' | 'keep_blocked', justification: string) => gw<CaseView>(`/api/v1/travel-rule/cases/${encodeURIComponent(id)}/decision`, { body: { action, justification } }),
  webhookSecret: () => gw<{ secret: string; header: string; scheme: string }>('/api/v1/workspace/webhook-secret'),
};

// ── E7: portal do supervisor ────────────────────────────────────────────────
export type DisclosureScope = 'passports' | 'transfers' | 'cases' | 'sponsorships';
export interface LogEntry { seq: number; at: string; action: string; actor: string; detail?: string; prev: string; hash: string }
export interface GrantView {
  id: string; supervisor_email: string; scope: DisclosureScope[]; from?: string; to?: string; purpose: string; legal_basis: string; purpose_hash: string;
  status: 'pending' | 'approved' | 'rejected' | 'revoked' | 'expired'; expires_at: string; requested_by: string; approved_by?: string; created_at: string; accesses: number;
  log: LogEntry[]; log_verified: boolean;
}
export const disclosureApi = {
  list: () => gw<{ grants: GrantView[] }>('/api/v1/disclosure/grants'),
  create: (body: { supervisor_email: string; scope: DisclosureScope[]; purpose: string; legal_basis: string; expires_at: string }) => gw<GrantView>('/api/v1/disclosure/grants', { body }),
  approve: (id: string) => gw<GrantView>(`/api/v1/disclosure/grants/${encodeURIComponent(id)}/approve`, { body: {} }),
  reject: (id: string) => gw<GrantView>(`/api/v1/disclosure/grants/${encodeURIComponent(id)}/reject`, { body: {} }),
  revoke: (id: string) => gw<GrantView>(`/api/v1/disclosure/grants/${encodeURIComponent(id)}/revoke`, { body: {} }),
};
export const supervisorApi = {
  view: (id: string, token: string) => gw<{ institution?: string; scope: DisclosureScope[]; purpose: string; legal_basis: string; purpose_hash: string; expires_at: string; log: LogEntry[]; log_verified: boolean }>(`/api/v1/supervisor/grants/${encodeURIComponent(id)}`, { grantToken: token }),
  pack: (id: string, token: string) => gw<{ pack: Record<string, unknown>; pack_hash: string }>(`/api/v1/supervisor/grants/${encodeURIComponent(id)}/pack`, { grantToken: token }),
};

/** sha256 hex de um arquivo, calculado no navegador. O arquivo nunca sai da máquina. */
export async function sha256File(file: Blob): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', await file.arrayBuffer());
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

/** Assina com Ed25519 (WebCrypto) a partir de uma chave PKCS#8 PEM. A chave fica só na memória da aba. */
export async function signEd25519(pkcs8Pem: string, message: string): Promise<string> {
  const b64 = pkcs8Pem.replace(/-----[^-]+-----/g, '').replace(/\s+/g, '');
  const der = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
  const key = await crypto.subtle.importKey('pkcs8', der, { name: 'Ed25519' }, false, ['sign']);
  const sig = await crypto.subtle.sign({ name: 'Ed25519' }, key, new TextEncoder().encode(message));
  return btoa(String.fromCharCode(...new Uint8Array(sig)));
}

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

// ── E9: painel ─────────────────────────────────────────────────────────────
export interface DashboardView {
  workspace: { id: string; name: string };
  passports: { items: { id: string; status: string; tier: string; packs: string[]; issued_at: string; expires_at: string; days_left: number }[]; pending_reviews: number };
  sponsorships: { as_sponsor: Record<string, number>; as_partner: Record<string, number> };
  transfers_30d: { total: number; by_status: Record<string, number>; dust_spent: number };
  cases: { open: number; overdue: number };
  grants: { pending: number; active: number };
  billing: BillingView;
}
export const dashboardApi = { get: () => gw<DashboardView>('/api/v1/workspace/dashboard') };
