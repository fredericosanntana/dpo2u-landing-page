// Wallet session for the authenticated app (Fase C). Stellar-only.
//
// Client-only: connecting a Stellar wallet (Freighter) proves key possession
// and opens the app. No backend auth in the MVP — writes to the gateway still
// use the OSS API key path. Persisted separately from the pilot operator
// session (key `dpo2u.app.wallet`, distinct from `dpo2u.pilot.auth`).

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type WalletChain = 'stellar';

interface WalletState {
  readonly chain: WalletChain | null;
  readonly pubkey: string | null;
  readonly network: string | null;
  readonly networkPassphrase: string | null;
  readonly connectedAt: number | null;
  setSession: (args: {
    chain: WalletChain;
    pubkey: string;
    network?: string | null;
    networkPassphrase?: string | null;
    connectedAt: number;
  }) => void;
  clear: () => void;
}

export const useWalletSession = create<WalletState>()(
  persist(
    (set) => ({
      chain: null,
      pubkey: null,
      network: null,
      networkPassphrase: null,
      connectedAt: null,
      setSession: ({ chain, pubkey, network, networkPassphrase, connectedAt }) =>
        set({
          chain,
          pubkey,
          network: network ?? null,
          networkPassphrase: networkPassphrase ?? null,
          connectedAt,
        }),
      clear: () =>
        set({ chain: null, pubkey: null, network: null, networkPassphrase: null, connectedAt: null }),
    }),
    {
      name: 'dpo2u.app.wallet',
      partialize: (s) => ({
        chain: s.chain,
        pubkey: s.pubkey,
        network: s.network,
        networkPassphrase: s.networkPassphrase,
        connectedAt: s.connectedAt,
      }),
    },
  ),
);

export function truncatePubkey(pk: string | null, head = 6, tail = 6): string {
  if (!pk) return '—';
  if (pk.length <= head + tail + 1) return pk;
  return `${pk.slice(0, head)}…${pk.slice(-tail)}`;
}
