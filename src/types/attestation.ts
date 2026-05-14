/**
 * Attestation shape — consumed by /portal (customer audit history) and
 * any future surface that reads on-chain compliance attestations.
 *
 * Source: `compliance_registry` + `aiverify_attestation` + `hiroshima_ai_process_attestation`
 * Solana programs on devnet. The MCP server exposes `/tools/fetch_compliance_attestation`
 * and (soon) a tenant-scoped `/api/v1/attestations?tenantId=…` endpoint.
 *
 * Sprint 2 (S2.10) — read-only. Sprint 3+ adds revoke / regenerate actions.
 */

export type AttestationStatus = 'SEALED' | 'REVOKED' | 'PENDING';

export type Jurisdiction =
  | 'LGPD'
  | 'GDPR'
  | 'MICAR'
  | 'DPDP'
  | 'PDPA'
  | 'UAE'
  | 'PDPL'
  | 'POPIA'
  | 'NDPA'
  | 'CCPA'
  | 'PIPEDA'
  | 'LAW25'
  | 'PIPA'
  | 'PDP'
  | 'APPI'
  | 'LFPDPPP'
  | 'VIETNAM'
  | 'MALAYSIA'
  // AI governance frameworks (parallel vertical)
  | 'EU-AIA'
  | 'JAPAN'
  | 'KOREA'
  | 'HIROSHIMA-ICOC'
  | 'CAIDP-UG'
  | 'UNESCO-RAM';

export interface Attestation {
  /** PDA (Program Derived Address) on Solana — the canonical on-chain id. */
  pda: string;
  /** Tx signature for the submit instruction. */
  txHash: string;
  /** Cluster — 'devnet' today, 'mainnet-beta' phase 2. */
  cluster: 'devnet' | 'mainnet-beta';
  /** Tenant scope (off-chain id, mapped to wallet at issue-time). */
  tenantId: string;
  /** Jurisdiction or AI gov framework code. */
  jurisdiction: Jurisdiction;
  /** Numeric compliance score 0–100. May be null for honest "insufficient data". */
  score: number | null;
  /** Wallet pubkey of the signer (DPO2U MCP service account on devnet). */
  signer: string;
  /** ISO-8601 UTC timestamp. */
  issuedAt: string;
  /** Status. REVOKED rows show with strikethrough + reason. */
  status: AttestationStatus;
  /** Optional human reason if revoked (e.g. "B2.5 synthetic — reverted"). */
  revokeReason?: string;
  /** Off-chain payload URI (IPFS / Lighthouse / Shadow Drive). Optional — pinning is paid-tier. */
  payloadUri?: string;
  /** Optional content hash (sha256 / blake3) of the payload — for verification. */
  payloadHash?: string;
  /** Free-form note from issuer ("Round 2 honest run", "MICAR halt state", etc). */
  note?: string;
}

export interface AttestationListResponse {
  tenantId: string;
  count: number;
  items: Attestation[];
}
