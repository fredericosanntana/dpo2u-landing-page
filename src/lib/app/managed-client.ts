// managed-client.ts — cliente do tier Managed (gateway /api/v1/managed/*). Solana-only.
//
// O pagamento na Solana é resolvido server-side pelo payment-gateway (Invoice USDC SPL);
// o app não assina pagamento client-side. Fluxo: POST → se 402, devolve o desafio pra UI
// (que orienta o pagamento via gateway). parseX402Challenge é só parse de protocolo.

import { parseX402Challenge, type X402Challenge } from '@/lib/pilot/payment-tx';

const BASE = (import.meta.env.VITE_MCP_BASE_URL as string | undefined) ?? 'https://mcp.dpo2u.com';

function authHeaders(apiKey?: string | null): Record<string, string> {
  const h: Record<string, string> = { 'content-type': 'application/json' };
  if (apiKey) h['x-api-key'] = apiKey;
  return h;
}

export type ManagedCall =
  | { kind: 'ok'; data: Record<string, unknown> }
  | { kind: 'payment_required'; challenge: X402Challenge }
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
    if (!challenge) return { kind: 'error', status: 402, message: 'desafio x402 malformado' };
    return { kind: 'payment_required', challenge };
  }
  const json = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (!res.ok) return { kind: 'error', status: res.status, message: String(json.message || json.error || `HTTP ${res.status}`) };
  return { kind: 'ok', data: json };
}

export type ManagedChain = 'solana';
/** Coordenadas da Invoice do payment-gateway (Solana) após a wallet assinar settle_invoice. */
export interface SolanaPayment { tool_name: string; nonce: number | string }
export interface ActivateBody { repo_url: string; jurisdiction?: string; email?: string; pubkey: string; chain?: ManagedChain; solana_payment?: SolanaPayment }
export interface RunBody { pipeline_id?: string; repo_url?: string; jurisdiction?: string; pubkey?: string; chain?: ManagedChain; solana_payment?: SolanaPayment }

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
  solana_payment?: SolanaPayment;
}
export const managedGenerateDoc = (body: DocAddonBody, apiKey?: string | null, xPayment?: string): Promise<ManagedCall> =>
  post('/api/v1/managed/docs', body, apiKey, xPayment);

export interface ManagedReceipt { resource: string; payer: string; amount: string; asset: string; txHash: string; paidAt: number }
export interface ManagedUsage { pubkey: string; receipts: ManagedReceipt[]; pipelines: Array<Record<string, unknown>> }

/** Uso real (billing) — ledger x402 + pipelines da pubkey. Read-only, sem pagamento.
 * Passa `chain` para o gateway validar a pubkey no formato Solana (base58). */
export async function getUsage(pubkey: string, chain: ManagedChain = 'solana'): Promise<ManagedUsage | null> {
  try {
    const qs = `pubkey=${encodeURIComponent(pubkey)}&chain=${encodeURIComponent(chain)}`;
    const res = await fetch(`${BASE.replace(/\/+$/, '')}/api/v1/managed/usage?${qs}`);
    if (!res.ok) return null;
    return (await res.json()) as ManagedUsage;
  } catch {
    return null;
  }
}
