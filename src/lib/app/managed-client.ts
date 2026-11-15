// managed-client.ts — cliente do tier Managed (gateway /api/v1/managed/*). Stellar-only.
//
// O pagamento na Stellar é via x402 (USDC SAC): quando a chamada retorna 402, o
// `withX402` conecta o Freighter, assina o pagamento e reenvia com o header X-PAYMENT.
// O gateway tem `chain` default 'stellar' + middleware x402 nos endpoints managed.

import { parseX402Challenge, type X402Challenge } from '@/lib/pilot/payment-tx';
import { payX402WithFreighter } from '@/lib/app/x402-pay';

const BASE = (import.meta.env.VITE_MCP_BASE_URL as string | undefined) ?? 'https://mcp.dpo2u.com';

function authHeaders(apiKey?: string | null): Record<string, string> {
  const h: Record<string, string> = { 'content-type': 'application/json' };
  if (apiKey) h['x-api-key'] = apiKey;
  return h;
}

export type ManagedCall =
  | { kind: 'ok'; data: Record<string, unknown> }
  | { kind: 'payment_required'; challenge: X402Challenge }
  | { kind: 'cancelled' }
  | { kind: 'error'; status: number; message: string };

async function post(path: string, body: unknown, apiKey?: string | null, xPayment?: string): Promise<ManagedCall> {
  const headers = authHeaders(apiKey);
  if (xPayment) headers['x-payment'] = xPayment;
  let res: Response;
  try {
    res = await fetch(`${BASE.replace(/\/+$/, '')}${path}`, { method: 'POST', headers, body: JSON.stringify(body) });
  } catch (e) {
    return { kind: 'error', status: 0, message: e instanceof Error ? e.message : String(e) };
  }
  if (res.status === 402) {
    const challenge = parseX402Challenge(await res.json().catch(() => null));
    if (!challenge) return { kind: 'error', status: 402, message: 'Malformed x402 challenge.' };
    return { kind: 'payment_required', challenge };
  }
  const json = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (!res.ok) return { kind: 'error', status: res.status, message: String(json.message || json.error || `HTTP ${res.status}`) };
  return { kind: 'ok', data: json };
}

/**
 * Runs a managed call, resolving the x402 paywall automatically: if the gateway
 * answers 402, sign the payment with Freighter and retry with X-PAYMENT. If x402
 * is disabled server-side, the first call already returns `ok` (no charge).
 *
 * `opts.onChallenge` is invoked with the server's real 402 challenge BEFORE
 * signing — use it to show the price and require confirmation. Returning false
 * (or resolving false) aborts with `{ kind: 'cancelled' }` and no signature.
 */
export async function withX402(
  call: (xPayment?: string) => Promise<ManagedCall>,
  opts?: { onChallenge?: (c: X402Challenge) => Promise<boolean> | boolean },
): Promise<ManagedCall> {
  const first = await call();
  if (first.kind !== 'payment_required') return first;
  if (opts?.onChallenge) {
    const ok = await opts.onChallenge(first.challenge);
    if (!ok) return { kind: 'cancelled' };
  }
  const { header } = await payX402WithFreighter(first.challenge);
  return call(header);
}

export type ManagedChain = 'stellar';
export interface ActivateBody { repo_url: string; jurisdiction?: string; email?: string; pubkey: string; chain?: ManagedChain }
export interface RunBody { pipeline_id?: string; repo_url?: string; jurisdiction?: string; pubkey?: string; chain?: ManagedChain }

export const managedActivate = (body: ActivateBody, apiKey?: string | null, xPayment?: string): Promise<ManagedCall> =>
  post('/api/v1/managed/activate', body, apiKey, xPayment);

export const managedRun = (body: RunBody, apiKey?: string | null, xPayment?: string): Promise<ManagedCall> =>
  post('/api/v1/managed/run', body, apiKey, xPayment);

// Add-on pago de documentos (x402 por documento). DPIA exige campos estruturais em `params`.
export type DocType = 'dpia' | 'privacy_policy' | 'security_policy' | 'retention_policy';
export interface DocAddonBody {
  pubkey: string;
  repo_url: string;
  doc_type: DocType;
  jurisdiction?: string;
  chain?: ManagedChain;
  params?: Record<string, unknown>;
}
export const managedGenerateDoc = (body: DocAddonBody, apiKey?: string | null, xPayment?: string): Promise<ManagedCall> =>
  post('/api/v1/managed/docs', body, apiKey, xPayment);

// Pacote de remediação (x402, 1 cobrança): gera TODOS os artefatos que fecham os gaps
// observáveis num PR único. Resposta: { score_now, score_projected, will_pass, files[], pr_url }.
export interface RemediateBody {
  pubkey: string;
  repo_url: string;
  jurisdiction?: string;
  chain?: ManagedChain;
  email?: string;
}
export const managedRemediate = (body: RemediateBody, apiKey?: string | null, xPayment?: string): Promise<ManagedCall> =>
  post('/api/v1/managed/remediate', body, apiKey, xPayment);

export interface ManagedReceipt { resource: string; payer: string; amount: string; asset: string; txHash: string; paidAt: number }
export interface ManagedUsage { pubkey: string; receipts: ManagedReceipt[]; pipelines: Array<Record<string, unknown>> }

/** Uso real (billing) — ledger x402 + pipelines da pubkey. Read-only, sem pagamento.
 * Passa `chain` para o gateway validar a pubkey no formato Stellar (G…). */
export async function getUsage(pubkey: string, chain: ManagedChain = 'stellar'): Promise<ManagedUsage | null> {
  try {
    const qs = `pubkey=${encodeURIComponent(pubkey)}&chain=${encodeURIComponent(chain)}`;
    const res = await fetch(`${BASE.replace(/\/+$/, '')}/api/v1/managed/usage?${qs}`);
    if (!res.ok) return null;
    return (await res.json()) as ManagedUsage;
  } catch {
    return null;
  }
}
