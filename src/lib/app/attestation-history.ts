// Local history of attestations the user submitted through the app. Stellar-only.
//
// On-chain, the submitter is the DPO2U gateway account, not necessarily the
// user's wallet — so we keep a client-side record of (useCaseId, hash) the user
// originated, keyed by their pubkey. The dashboard merges these with on-chain
// attestations read from the Soroban contract events (stellar-indexer).

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface HistoryRef {
  readonly pubkey: string;
  readonly useCaseId: string;
  readonly evidenceHashHex: string;
  readonly txHash?: string;
  readonly verdict?: string;
  readonly score?: number;
  readonly at: number;
  readonly source: 'activate' | 'manual' | 'github-ci';
  // Stellar-only: o selo é ancorado no contrato Soroban.
  readonly chain?: 'stellar';
  // Link direto pro Stellar Expert.
  readonly explorerUrl?: string;
  // Contexto rico (capturado do gateway) — identifica o repo e os pontos de melhoria.
  readonly repo?: string; // ex.: github.com/owner/repo
  readonly jurisdictions?: string[];
  readonly gaps?: string[];
  readonly controls?: Record<string, boolean>;
}

interface HistoryState {
  readonly refs: HistoryRef[];
  add: (ref: HistoryRef) => void;
  forPubkey: (pubkey: string | null) => HistoryRef[];
  clear: () => void;
}

export const useAttestationHistory = create<HistoryState>()(
  persist(
    (set, get) => ({
      refs: [],
      add: (ref) =>
        set((s) => {
          const key = `${ref.useCaseId}:${ref.evidenceHashHex}`.toLowerCase();
          const exists = s.refs.some(
            (r) => `${r.useCaseId}:${r.evidenceHashHex}`.toLowerCase() === key,
          );
          return exists ? s : { refs: [ref, ...s.refs].slice(0, 200) };
        }),
      forPubkey: (pubkey) => (pubkey ? get().refs.filter((r) => r.pubkey === pubkey) : []),
      clear: () => set({ refs: [] }),
    }),
    { name: 'dpo2u.app.attestation-history' },
  ),
);
