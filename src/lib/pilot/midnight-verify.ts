// midnight-verify.ts — read a Midnight attestation as JSON so the SAME public /verify UI
// (VerifyResultCard) renders it, just like the Stellar/Soroban read. Trustless-adjacent: the
// webhook joins its local record with the on-chain seal (tx/block) + deploy provenance; the
// card shows the independent verify-seal command for full reproducibility.
const MIDNIGHT_BASE =
  (import.meta.env.VITE_MIDNIGHT_BASE_URL as string | undefined) ?? 'https://midnight.dpo2u.com';

export interface MidnightVerify {
  found: boolean;
  chain: 'midnight';
  network: string;
  use_case_id: string;
  evidence_hash: string;
  verdict: 'PASS' | 'FAIL' | 'REVIEW' | null;
  repo: string | null;
  sha: string | null;
  score_private: boolean;
  sealed: boolean;
  tx: string | null;
  block: number | null;
  submitted_by: string | null;
  contract_id: string | null;
  metadata_hash: string;
  timestamp: number | null; // unix seconds
  indexer: string;
}

export async function verifyAttestationMidnight(uc: string, hash: string): Promise<MidnightVerify | null> {
  try {
    const r = await fetch(`${MIDNIGHT_BASE}/api/attestation/${encodeURIComponent(uc)}/${encodeURIComponent(hash)}`);
    if (!r.ok) return null;
    const j = (await r.json()) as MidnightVerify;
    return j && j.found ? j : null;
  } catch {
    return null;
  }
}

export const midnightVerifyBase = MIDNIGHT_BASE;
