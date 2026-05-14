// Stellar / Soroban integration for the DPO2U Anti-corruption Pilot UI.
//
// Wraps `@dpo2u/stellar-sdk` (the trustless verifier SDK shipped in Sprint G.5)
// + helpers for URL building. Single source of truth for "how does this UI
// talk to the contract" — every other pilot file imports from here.

import { AttestationClient, testnetClient, type AttestationRecord, type VerifyResult } from '@dpo2u/stellar-sdk';
import { DEFAULT_CONTRACT, contractById, type ContractMeta, type StellarNetwork } from './contracts';

let _client: AttestationClient | null = null;

/**
 * Lazy singleton — first call constructs the client; subsequent calls reuse.
 * Tied to the default (testnet) contract; admin / mainnet paths inject their
 * own clients explicitly.
 */
export function getTestnetClient(): AttestationClient {
  if (_client) return _client;
  _client = new AttestationClient(
    testnetClient({
      contractId: DEFAULT_CONTRACT.id,
      // viewerAccount uses the public deployer — wallet-less, no funds needed.
      viewerAccount: DEFAULT_CONTRACT.admin,
    }),
  );
  return _client;
}

export interface VerifyParams {
  readonly useCaseId: string;
  readonly evidenceHashHex: string;
}

/** Read-only `verify_attestation` call over Soroban RPC. No wallet, no fee. */
export async function verifyAttestation(params: VerifyParams): Promise<VerifyResult> {
  const client = getTestnetClient();
  return client.verify({
    useCaseId: params.useCaseId,
    evidenceHashHex: params.evidenceHashHex,
  });
}

export function truncateContract(id: string, head = 8, tail = 6): string {
  if (id.length <= head + tail + 1) return id;
  return `${id.slice(0, head)}…${id.slice(-tail)}`;
}

export function truncateHash(hex: string, head = 10, tail = 6): string {
  if (hex.length <= head + tail + 1) return hex;
  return `${hex.slice(0, head)}…${hex.slice(-tail)}`;
}

export function stellarExpertUrl(
  kind: 'contract' | 'tx' | 'account',
  id: string,
  contract: ContractMeta = DEFAULT_CONTRACT,
): string {
  return `${contract.explorer_base}/${kind}/${id}`;
}

export function horizonUrl(path: string, contract: ContractMeta = DEFAULT_CONTRACT): string {
  return `${contract.horizon_url}${path.startsWith('/') ? path : `/${path}`}`;
}

export function networkBadgeTone(network: StellarNetwork): 'mainnet' | 'testnet' {
  return network;
}

/** Re-exports so consumers import from a single place. */
export type { AttestationRecord, VerifyResult } from '@dpo2u/stellar-sdk';
export { contractByNetwork, contractById, TESTNET_CONTRACT, DEFAULT_CONTRACT } from './contracts';
