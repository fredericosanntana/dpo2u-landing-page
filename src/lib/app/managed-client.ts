// managed-client.ts — cliente do tier Managed (gateway /api/v1/managed/*).
//
// Reusa o protocolo x402 (payment-tx) + o exact/client @x402/stellar + Freighter signer
// (mesmo padrão do PaymentModal do piloto), mas auto-contido pro app — não toca o fluxo
// do piloto. Fluxo: POST → se 402, parse challenge → assina X-PAYMENT → reenvia.

import { ExactStellarScheme } from '@x402/stellar/exact/client';
import { x402Version as X402_VERSION } from '@x402/core';
import { freighterSigner } from '@/lib/pilot/freighter-signer';
import {
  parseX402Challenge,
  toOfficialRequirement,
  encodeFullPayload,
  stellarNet,
  type X402Challenge,
} from '@/lib/pilot/payment-tx';

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

/** Assina o pagamento x402 com Freighter e devolve o header X-PAYMENT. */
export async function signX402Header(challenge: X402Challenge, payer: string): Promise<string> {
  const net = stellarNet(challenge.network);
  const requirement = toOfficialRequirement(challenge);
  const signer = await freighterSigner(payer, net.passphrase);
  const scheme = new ExactStellarScheme(signer, { url: net.rpcUrl });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const partial = await scheme.createPaymentPayload(X402_VERSION, requirement as any);
  return encodeFullPayload({ x402Version: X402_VERSION, accepted: requirement, payload: partial.payload });
}

export type ManagedChain = 'stellar' | 'solana';
/** Coordenadas da Invoice do payment-gateway (Solana) após a wallet assinar settle_invoice. */
export interface SolanaPayment { tool_name: string; nonce: number | string }
export interface ActivateBody { repo_url: string; jurisdiction?: string; email?: string; pubkey: string; chain?: ManagedChain; solana_payment?: SolanaPayment }
export interface RunBody { pipeline_id?: string; repo_url?: string; jurisdiction?: string; pubkey?: string; chain?: ManagedChain; solana_payment?: SolanaPayment }

export const managedActivate = (body: ActivateBody, apiKey?: string | null, xPayment?: string): Promise<ManagedCall> =>
  post('/api/v1/managed/activate', body, apiKey, xPayment);

export const managedRun = (body: RunBody, apiKey?: string | null, xPayment?: string): Promise<ManagedCall> =>
  post('/api/v1/managed/run', body, apiKey, xPayment);

export interface ManagedReceipt { resource: string; payer: string; amount: string; asset: string; txHash: string; paidAt: number }
export interface ManagedUsage { pubkey: string; receipts: ManagedReceipt[]; pipelines: Array<Record<string, unknown>> }

/** Uso real (billing) — ledger x402 + pipelines da pubkey. Read-only, sem pagamento.
 * Passa `chain` para o gateway validar a pubkey no formato certo (G… vs base58). */
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
