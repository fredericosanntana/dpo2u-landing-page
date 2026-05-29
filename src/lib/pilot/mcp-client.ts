// Typed REST client for the DPO2U MCP server.
//
// Endpoints consumed (all from Sprint G.4 + K.1 PRs):
//   GET  /api/v1/healthz                          — health + version
//   POST /api/v1/attestation/submit               — submit attestation
//   GET  /api/v1/attestation/{attempt_id}         — poll status
//   POST /api/v1/attestation/erasure-request      — LGPD Art. 18
//
// Auth: x-api-key header (Phase B). x-tenant-id optional.
// Errors: typed McpError with status + code + message.
// 402: special handling — return payment_required marker rather than throw.

import { useAuthStore } from './auth-store';

export type Verdict = 'PASS' | 'FAIL' | 'REVIEW';

export interface SubmitAttestationInput {
  readonly use_case_id: string;
  readonly request_id: string;
  readonly evidence: Record<string, unknown>;
  readonly callback_url?: string;
}

export interface AttestationAttempt {
  readonly attempt_id: string;
  readonly request_id: string;
  readonly use_case_id: string;
  readonly status: 'PENDING' | 'COMPLETED' | 'FAILED';
  readonly created_at: number;
  readonly updated_at: number;
  readonly result?: {
    readonly verdict: Verdict;
    readonly predicate_set_id: string;
    readonly predicate_set_version: number;
    readonly evidence_hash_hex: string;
    readonly metadata_hash_hex: string;
    readonly tx: {
      readonly feeBumpTxHash: string;
      readonly innerTxHash: string;
      readonly ledger: number;
      readonly contractId: string;
      readonly explorerUrl: string;
    };
    readonly predicate_results: ReadonlyArray<{
      readonly id: string;
      readonly verdict: Verdict;
      readonly reason: string;
    }>;
  };
  readonly error?: { readonly message: string; readonly code?: string };
}

export interface ErasureRequestInput {
  readonly original_use_case_id: string;
  readonly original_evidence_hash_hex: string;
  readonly requester_id: string;
  readonly reason: string;
  readonly municipal_ticket_id?: string;
}

export interface ErasureResponse {
  readonly attempt_id: string;
  readonly status: 'COMPLETED' | 'FAILED';
  readonly original_record: unknown;
  readonly secure_erase: { readonly erased: boolean; readonly adapter: string };
  readonly erasure_attestation?: { readonly verdict: Verdict; readonly tx?: { readonly feeBumpTxHash: string } };
}

export interface HealthzResponse {
  readonly status: 'ok' | string;
  readonly version?: string;
  readonly uptime_s?: number;
}

export interface PaymentRequiredResponse {
  readonly payment_required: true;
  readonly amount_atomic: string;
  readonly amount_decimal?: string;
  readonly asset_address: string;
  readonly recipient: string;
  readonly network: string;
  readonly use_case_id: string;
  readonly description?: string;
  readonly raw_challenge?: unknown;
}

export type SubmitResult =
  | { readonly kind: 'accepted'; readonly attempt_id: string; readonly status: AttestationAttempt['status']; readonly idempotent_replay?: boolean }
  // `raw` = corpo 402 (formato x402 oficial: { x402Version, accepts:[...] }). Use
  // `parseX402Challenge(raw)` de payment-tx.ts. `challenge` mantido p/ back-compat.
  | { readonly kind: 'payment_required'; readonly raw: unknown; readonly challenge?: PaymentRequiredResponse };

export class McpError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code:
      | 'unauthorized'
      | 'forbidden'
      | 'not_found'
      | 'rate_limited'
      | 'server_error'
      | 'network'
      | 'parse_error'
      | 'validation'
      | 'unknown',
    public readonly body?: unknown,
  ) {
    super(message);
    this.name = 'McpError';
  }
}

function classifyStatus(status: number): McpError['code'] {
  if (status === 401) return 'unauthorized';
  if (status === 403) return 'forbidden';
  if (status === 404) return 'not_found';
  if (status === 400 || status === 422) return 'validation';
  if (status === 429) return 'rate_limited';
  if (status >= 500) return 'server_error';
  return 'unknown';
}

async function authedFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const state = useAuthStore.getState();
  if (!state.apiKey) {
    throw new McpError('No API key — please log in', 401, 'unauthorized');
  }
  const url = `${state.mcpBaseUrl.replace(/\/+$/, '')}${path.startsWith('/') ? path : `/${path}`}`;
  const headers: Record<string, string> = {
    'content-type': 'application/json',
    'x-api-key': state.apiKey,
    ...(init.headers as Record<string, string> | undefined),
  };
  if (state.tenantId) {
    headers['x-tenant-id'] = state.tenantId;
  }
  let res: Response;
  try {
    res = await fetch(url, { ...init, headers });
  } catch (err) {
    throw new McpError(
      `Network failure calling ${url}: ${err instanceof Error ? err.message : String(err)}`,
      0,
      'network',
      err,
    );
  }
  return res;
}

async function parseJson<T>(res: Response): Promise<T> {
  const text = await res.text();
  try {
    return JSON.parse(text) as T;
  } catch (err) {
    throw new McpError(
      `Failed to parse JSON from MCP: ${err instanceof Error ? err.message : String(err)}`,
      res.status,
      'parse_error',
      text,
    );
  }
}

export async function healthz(): Promise<HealthzResponse> {
  const res = await authedFetch('/api/v1/healthz', { method: 'GET' });
  if (!res.ok) {
    throw new McpError(`MCP healthz returned ${res.status}`, res.status, classifyStatus(res.status));
  }
  return parseJson<HealthzResponse>(res);
}

/** Validate a candidate API key against MCP. Does NOT persist. */
export async function probeApiKey(args: { apiKey: string; mcpBaseUrl: string }): Promise<{ ok: true; payload: HealthzResponse } | { ok: false; error: McpError }> {
  const url = `${args.mcpBaseUrl.replace(/\/+$/, '')}/api/v1/healthz`;
  try {
    const res = await fetch(url, { headers: { 'x-api-key': args.apiKey } });
    if (!res.ok) {
      return { ok: false, error: new McpError(`MCP ${res.status}`, res.status, classifyStatus(res.status)) };
    }
    const body = (await res.json()) as HealthzResponse;
    return { ok: true, payload: body };
  } catch (err) {
    return {
      ok: false,
      error: new McpError(
        `Não foi possível conectar ao MCP: ${err instanceof Error ? err.message : String(err)}`,
        0,
        'network',
        err,
      ),
    };
  }
}

async function doSubmit(input: SubmitAttestationInput, extraHeaders?: Record<string, string>): Promise<SubmitResult> {
  const res = await authedFetch('/api/v1/attestation/submit', {
    method: 'POST',
    body: JSON.stringify(input),
    headers: extraHeaders,
  });
  if (res.status === 402) {
    const raw = await parseJson<unknown>(res);
    const legacy = raw as Partial<PaymentRequiredResponse>;
    return {
      kind: 'payment_required',
      raw,
      challenge: legacy && legacy.payment_required ? (legacy as PaymentRequiredResponse) : undefined,
    };
  }
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new McpError(`submit failed: ${res.status} ${body}`, res.status, classifyStatus(res.status), body);
  }
  const payload = await parseJson<{ attempt_id: string; status: AttestationAttempt['status']; idempotent_replay?: boolean }>(res);
  return {
    kind: 'accepted',
    attempt_id: payload.attempt_id,
    status: payload.status,
    idempotent_replay: payload.idempotent_replay,
  };
}

export async function submitAttestation(input: SubmitAttestationInput): Promise<SubmitResult> {
  return doSubmit(input);
}

/** Retry da submissão com o header `X-PAYMENT` (x402) já assinado pelo Freighter. */
export async function submitAttestationWithPayment(
  input: SubmitAttestationInput,
  xPaymentHeaderB64: string,
): Promise<SubmitResult> {
  return doSubmit(input, { 'x-payment': xPaymentHeaderB64 });
}

export async function getAttestation(attemptId: string): Promise<AttestationAttempt> {
  const res = await authedFetch(`/api/v1/attestation/${encodeURIComponent(attemptId)}`, { method: 'GET' });
  if (res.status === 404) {
    throw new McpError('Attestation not found', 404, 'not_found');
  }
  if (!res.ok) {
    throw new McpError(`getAttestation ${res.status}`, res.status, classifyStatus(res.status));
  }
  return parseJson<AttestationAttempt>(res);
}

export async function requestErasure(input: ErasureRequestInput): Promise<ErasureResponse> {
  const res = await authedFetch('/api/v1/attestation/erasure-request', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new McpError(`erasure failed: ${res.status} ${body}`, res.status, classifyStatus(res.status), body);
  }
  return parseJson<ErasureResponse>(res);
}

/** Stable polling helper — caller cleans up. */
export function pollAttestation(
  attemptId: string,
  onUpdate: (attempt: AttestationAttempt) => void,
  onError: (err: McpError) => void,
  opts: { readonly intervalMs?: number; readonly maxAttempts?: number } = {},
): { stop: () => void } {
  const intervalMs = opts.intervalMs ?? 3_000;
  const maxAttempts = opts.maxAttempts ?? 30;
  let count = 0;
  let stopped = false;
  const tick = async () => {
    if (stopped) return;
    count += 1;
    try {
      const attempt = await getAttestation(attemptId);
      onUpdate(attempt);
      if (attempt.status === 'COMPLETED' || attempt.status === 'FAILED') {
        stopped = true;
        return;
      }
    } catch (err) {
      onError(err instanceof McpError ? err : new McpError(String(err), 0, 'unknown'));
    }
    if (count >= maxAttempts) {
      stopped = true;
      return;
    }
    if (!stopped) {
      setTimeout(() => void tick(), intervalMs);
    }
  };
  void tick();
  return {
    stop: () => {
      stopped = true;
    },
  };
}
