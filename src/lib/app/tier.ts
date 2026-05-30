// D5 (client-side): wallet → tier + workspace.
//
// MVP derivation, no backend:
//   - 'dpo'     if pubkey ∈ DPO_ALLOWLIST (named accountable DPO engagements)
//   - 'managed' if the wallet has an active managed pipeline (Fase E pipeline-store)
//   - 'oss'     default
// Real tier mapping moves server-side once wallet-signature auth exists.

import { truncatePubkey } from './wallet-session';

export type Tier = 'oss' | 'managed' | 'dpo';

// Filled as DPO-aaS clients are signed. Empty in the MVP.
const DPO_ALLOWLIST: ReadonlySet<string> = new Set<string>([]);

export interface TierInfo {
  readonly tier: Tier;
  readonly label: string;
}

export function deriveTier(pubkey: string | null, opts?: { hasPipeline?: boolean }): TierInfo {
  if (pubkey && DPO_ALLOWLIST.has(pubkey)) return { tier: 'dpo', label: 'DPO-as-a-Service' };
  if (opts?.hasPipeline) return { tier: 'managed', label: 'Managed Protocol' };
  return { tier: 'oss', label: 'Open Source' };
}

export interface Workspace {
  readonly id: string;
  readonly label: string;
}

export function deriveWorkspace(pubkey: string | null): Workspace {
  if (!pubkey) return { id: 'anon', label: 'No wallet' };
  return { id: pubkey, label: truncatePubkey(pubkey) };
}
