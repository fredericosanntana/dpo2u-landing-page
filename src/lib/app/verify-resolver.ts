// Public attestation resolver for /verify/:id.
//
// On-chain verification is keyed by (useCaseId, evidenceHashHex) — there is no
// verify-by-attempt-id on the contract. So a shareable /verify/:id resolves the
// attempt id → (use_case_id, evidence_hash_hex) via the Pilot Gateway, then the
// page re-verifies on-chain (trustless) through src/lib/pilot/stellar.ts.
//
// The /verify/uc/:uc/hash/:hash route needs no gateway at all (pure trustless).

const GATEWAY_BASE =
  (import.meta.env.VITE_MCP_BASE_URL as string | undefined) ?? 'https://mcp.dpo2u.com';

export interface ResolvedRef {
  readonly useCaseId: string;
  readonly evidenceHashHex: string;
  readonly txHash?: string;
  readonly status?: string;
}

export type ResolveReason = 'ok' | 'not-found' | 'no-hash' | 'auth' | 'network';

/** Flat result (no discriminated-union narrowing). `ref` is set iff reason === 'ok'. */
export interface ResolveResult {
  readonly ref: ResolvedRef | null;
  readonly reason: ResolveReason;
  readonly detail?: string;
}

/** Resolve an attempt/attestation id to its on-chain (useCaseId, hash) pair. Public GET. */
export async function resolveById(id: string): Promise<ResolveResult> {
  const url = `${GATEWAY_BASE.replace(/\/+$/, '')}/api/v1/attestation/${encodeURIComponent(id)}`;
  let res: Response;
  try {
    res = await fetch(url, { method: 'GET', headers: { accept: 'application/json' } });
  } catch (e) {
    return { ref: null, reason: 'network', detail: e instanceof Error ? e.message : String(e) };
  }
  if (res.status === 401 || res.status === 403) return { ref: null, reason: 'auth' };
  if (res.status === 404) return { ref: null, reason: 'not-found' };
  if (!res.ok) return { ref: null, reason: 'network', detail: `HTTP ${res.status}` };

  let data: Record<string, unknown>;
  try {
    data = (await res.json()) as Record<string, unknown>;
  } catch {
    return { ref: null, reason: 'network', detail: 'invalid json' };
  }

  const result = (data.result ?? data) as Record<string, unknown>;
  const useCaseId =
    (data.use_case_id as string | undefined) ?? (result.use_case_id as string | undefined);
  const evidenceHashHex =
    (result.evidence_hash_hex as string | undefined) ??
    (data.evidence_hash_hex as string | undefined);
  const txHash = (result.tx as string | undefined) ?? (result.tx_hash as string | undefined);
  const status = (data.status as string | undefined) ?? (result.status as string | undefined);

  if (!useCaseId || !evidenceHashHex) return { ref: null, reason: 'no-hash', detail: status };
  return { ref: { useCaseId, evidenceHashHex, txHash, status }, reason: 'ok' };
}
