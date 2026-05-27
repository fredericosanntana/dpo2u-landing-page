// Hardcoded allowlist of Stellar accounts authorized to use the admin UI.
//
// SECURITY MODEL:
//   - The contract's `Admin` storage key is the actual on-chain gate. Even
//     if a random user gets the admin UI to render, the contract will
//     revert `AdminOnly` (#5) on submission unless the signing account is
//     the on-chain admin.
//   - This allowlist exists to HIDE the UI from non-admins (UX guardrail)
//     and to prevent accidental setOptions / authorize_submitter attempts
//     from non-admin keys (no on-chain damage, but wasted fees).
//
// Update this list when admin rotation happens (Sprint L hardware wallet
// ceremony OR mid-pilot admin transfer).

import { DEFAULT_CONTRACT } from './contracts';

export const ADMIN_ALLOWLIST: ReadonlySet<string> = new Set([
  DEFAULT_CONTRACT.admin, // testnet deployer
  // Add mainnet admin during Sprint L ceremony.
]);

export function isAdminPubkey(pubkey: string | null | undefined): boolean {
  if (!pubkey) return false;
  return ADMIN_ALLOWLIST.has(pubkey);
}

/**
 * Master feature flag. Admin UI only renders when:
 *   1. VITE_ADMIN_UI=1 at build time (env opt-in)
 *   2. Connected Freighter pubkey is in the allowlist
 *
 * Both checks must pass — env flag alone is insufficient.
 */
export function isAdminUiEnabled(): boolean {
  return (import.meta.env.VITE_ADMIN_UI as string | undefined) === '1';
}
