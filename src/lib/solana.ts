/// <reference types="vite/client" />
import { Connection, PublicKey, type Commitment } from '@solana/web3.js';

export type Cluster = 'devnet' | 'mainnet-beta' | 'testnet';

const env = (import.meta as unknown as { env: Record<string, string | undefined> }).env ?? {};

export const CLUSTER: Cluster = (env.VITE_SOLANA_CLUSTER as Cluster | undefined) ?? 'devnet';

export const RPC_URL = env.VITE_SOLANA_RPC ?? 'https://api.devnet.solana.com';

const COMMITMENT: Commitment = 'confirmed';

let singleton: Connection | null = null;
export function getConnection(): Connection {
  if (!singleton) {
    singleton = new Connection(RPC_URL, COMMITMENT);
  }
  return singleton;
}

export const PROGRAM_IDS = {
  complianceRegistry: new PublicKey('7q19zbMMFCPSDhJhh3cfUVJstin6r1Q4dgmeDAuQERyK'),
  complianceVerifier: new PublicKey('5xrWphWXoFnXJh7jYt3tyWZAwX1itbyyxJQs8uumiRTW'),
  agentRegistry: new PublicKey('5qeuUAaJi9kTzsfmiphQ89PNrpqy7xW7sCvhBZQ6mya7'),
  agentWalletFactory: new PublicKey('AjRqmxyieQieov2qsNefdYpa6HbPhzciED7s5TfZi1in'),
  feeDistributor: new PublicKey('88eKEEMMnugv8AFWRvqa4i7LEiL7tM9bEuPTVkRbD76x'),
  paymentGateway: new PublicKey('4Qj6GziMjUfh4TszuSnasnEqnASqQBS6SHw6YAu9U23Q'),
} as const;

export type ProgramKey = keyof typeof PROGRAM_IDS;

export interface ProgramMeta {
  key: ProgramKey;
  displayName: string;
  tagline: string;
  programId: PublicKey;
}

export const PROGRAMS: ProgramMeta[] = [
  {
    key: 'complianceRegistry',
    displayName: 'Compliance Registry',
    tagline: 'ZK-verified LGPD attestations as PDAs — subject, threshold, commitment, timestamp.',
    programId: PROGRAM_IDS.complianceRegistry,
  },
  {
    key: 'complianceVerifier',
    displayName: 'Compliance Verifier',
    tagline: 'SP1 v6 Groth16 verifier. Checks alt_bn128 pairing on-chain in ~156k CU.',
    programId: PROGRAM_IDS.complianceVerifier,
  },
  {
    key: 'agentRegistry',
    displayName: 'Agent Registry',
    tagline: 'DPO agent DIDs with capability bitmask (auditor, expert, monitor). Register / revoke.',
    programId: PROGRAM_IDS.agentRegistry,
  },
  {
    key: 'agentWalletFactory',
    displayName: 'Agent Wallet Factory',
    tagline: 'Deterministic PDA wallet per agent seed. SOL transfers supported.',
    programId: PROGRAM_IDS.agentWalletFactory,
  },
  {
    key: 'paymentGateway',
    displayName: 'Payment Gateway',
    tagline: 'Idempotent invoicing for MCP tool-calls. Nonce-based, replay-protected.',
    programId: PROGRAM_IDS.paymentGateway,
  },
  {
    key: 'feeDistributor',
    displayName: 'Fee Distributor',
    tagline: '70/20/10 split — treasury / operator / reserve. Stateless, event-driven.',
    programId: PROGRAM_IDS.feeDistributor,
  },
];

export function explorerUrl(
  address: PublicKey | string,
  kind: 'address' | 'tx' = 'address',
  cluster: Cluster = CLUSTER,
): string {
  const a = typeof address === 'string' ? address : address.toBase58();
  return `https://explorer.solana.com/${kind}/${a}?cluster=${cluster}`;
}

export function truncateAddress(address: PublicKey | string, head = 4, tail = 4): string {
  const a = typeof address === 'string' ? address : address.toBase58();
  if (a.length <= head + tail + 1) return a;
  return `${a.slice(0, head)}…${a.slice(-tail)}`;
}

/** Trunca um hash hex (evidência/commitment) p/ exibição. Neutro de chain. */
export function truncateHash(hash: string, head = 8, tail = 8): string {
  if (!hash || hash.length <= head + tail + 1) return hash;
  return `${hash.slice(0, head)}…${hash.slice(-tail)}`;
}
