// status-registry.ts — single source of truth for the /app status labels, derived from
// the audit (DPO2U/02-Projects/vasp-pivot/auditoria-completa.md). Nothing fabricated:
// 'live' = works end-to-end today (testnet); 'gated' = real once the service comes up;
// 'roadmap' = not built. The UI reads from here — it never diverges from the audit.

export type Status = 'live' | 'roadmap' | 'gated';

export const STATUS_LABEL: Record<Status, string> = {
  live: 'Live · testnet',
  roadmap: 'Roadmap',
  gated: 'Gated',
};

const EXPLORER = 'https://stellar.expert/explorer/testnet/tx/';

/** The obligations the user can prove (Act 1 — Start). */
export interface Obligation {
  key: string;
  title: string;
  blurb: string;
  status: Status;
  /** on-chain use_case_id (when applicable). */
  useCaseId?: string;
  /** real tx of a seal (live proof, testnet). */
  proofTx?: string;
  /** example evidence_hash for deep-linking into /verify. */
  proofHash?: string;
  /** where the chooser routes to. */
  route: string;
}

export const OBLIGATIONS: Obligation[] = [
  {
    key: 'vasp',
    title: 'VASP — Proof of Reserve + segregation',
    blurb: 'BCB Res 519/520/521. Prove that reserves cover the obligations + asset segregation.',
    status: 'live',
    useCaseId: 'vasp_por_br_v1',
    proofTx: '63428437efdf890c87934d916c02cdc292f9bf9d8624b9a84baf0489643a2b38',
    proofHash: 'c8105d0aa89145a8954be7d6aea8fa46e482c8e9129eaf866bb753c0c167f355',
    route: '/app/run/vasp',
  },
  {
    key: 'cvm',
    title: 'CVM — Tokenization (Howey)',
    blurb: 'Parecer 40/2022. Classifies the token + validates offering rules (Res. 88/175).',
    status: 'live',
    useCaseId: 'cvm_token_v1',
    proofTx: 'b725b0dc4119e7b1cb46501f9711e913a6bb88faf296d6d5b73e14c93e452529',
    proofHash: '8466c056a98abd42c11083d333b89da2e8c07ae0b4542ec8fc708174f3df2f31',
    route: '/app/run/cvm',
  },
  {
    key: 'agent',
    title: 'Agent — Runtime governance',
    blurb: 'Compliance the machine enforces AND proves on-chain (A1–A5 assessment + enforcement plan).',
    status: 'live',
    useCaseId: 'agent_runtime_v1',
    proofTx: '9fccd0d4a857d2a9e862c75a0094bb542ab9098c6afef29daa9164c16fdce900',
    proofHash: '20360375ad0be759fcee99463011c8ac334589434c89ac6d3da30497b45bd28c',
    route: '/app/run/agent',
  },
  {
    key: 'data',
    title: 'Data protection (LGPD/GDPR…)',
    blurb: 'DPIA, policy, privacy score — 24 jurisdictions. Evidence encrypted on IPFS.',
    status: 'live',
    route: '/app/activate',
  },
  {
    key: 'filing',
    title: 'BCB 5710/5711 filing',
    blurb: 'Engine: on-chain balance → BRL value (Reflector) → triple reconciliation → seal + STA package.',
    status: 'live',
    useCaseId: 'por_filing',
    proofTx: 'dbc8489524fc874f2ee3db9b072f96f312281ae9572c761e6a77079419f14a17',
    route: '/app/run/filing',
  },
];

/** Infrastructure capabilities (transparency / badges). */
export interface Capability {
  key: string;
  label: string;
  status: Status;
  note: string;
}

export const CAPABILITIES: Capability[] = [
  { key: 'seal', label: 'On-chain seal (Soroban testnet)', status: 'live', note: 'anticorruption CC4TJGDR… + por_filing CCUYKSMQHQ…' },
  { key: 'verify', label: 'Public verification /verify', status: 'live', note: 'trustless read by (use_case_id, evidence_hash)' },
  { key: 'ipfs', label: 'Evidence on IPFS (Lighthouse/Filecoin)', status: 'live', note: 'AES-256 + CID; fail-closed (no fabricated CID)' },
  { key: 'zk', label: 'ZK private score (ceremony done)', status: 'live', note: 'Groth16/BLS12-381; vk from the May 29 ceremony (drand)' },
  { key: 'x402', label: 'x402 payment (USDC)', status: 'live', note: 'price-before-sign via Freighter' },
  { key: 'fhe', label: 'FHE (computes over encrypted data)', status: 'live', note: 'OpenFHE healthy + OPENFHE_USE_MOCK=false + network ok; never decrypts the data' },
  { key: 'wdk', label: 'Connectors EVM/BTC/Tron (WDK)', status: 'gated', note: 'requires WDK Indexer onboarding' },
  { key: 'mainnet', label: 'Mainnet', status: 'roadmap', note: 'gated on audit + multisig + ceremony' },
  { key: 'escrow', label: 'B2B escrow', status: 'roadmap', note: 'placeholder; on-chain contract pending' },
];

export function txExplorerUrl(tx: string): string {
  return `${EXPLORER}${tx}`;
}
