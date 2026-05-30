// Managed-pipeline registry (Fase E activate). Client-side MVP — no GitHub App
// / CI backend yet. Registering a pipeline flips the wallet's derived tier to
// 'managed' (see tier.ts via WalletAuthProvider).

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Pipeline {
  readonly id: string;
  readonly pubkey: string;
  readonly repoUrl: string;
  readonly chains: string[];
  readonly jurisdictions: string[];
  readonly trigger: string;
  readonly createdAt: number;
}

interface PipelineState {
  readonly pipelines: Pipeline[];
  add: (p: Pipeline) => void;
  forPubkey: (pubkey: string | null) => Pipeline[];
  hasPipelineFor: (pubkey: string | null) => boolean;
  remove: (id: string) => void;
}

export const usePipelineStore = create<PipelineState>()(
  persist(
    (set, get) => ({
      pipelines: [],
      add: (p) => set((s) => ({ pipelines: [p, ...s.pipelines] })),
      forPubkey: (pubkey) => (pubkey ? get().pipelines.filter((p) => p.pubkey === pubkey) : []),
      hasPipelineFor: (pubkey) => (pubkey ? get().pipelines.some((p) => p.pubkey === pubkey) : false),
      remove: (id) => set((s) => ({ pipelines: s.pipelines.filter((p) => p.id !== id) })),
    }),
    { name: 'dpo2u.app.pipelines' },
  ),
);
