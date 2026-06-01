// WalletAuthProvider — app-wide wallet session + derived tier/workspace. Solana-only.
//
// Reconciles the persisted session against the live Solana wallet
// (Solflare/Phantom) on mount and on window focus. Connect/disconnect go
// through the multi-wallet adapters.

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useWalletSession } from '@/lib/app/wallet-session';
import { deriveTier, deriveWorkspace, type TierInfo, type Workspace } from '@/lib/app/tier';
import { getAdapter, solflareAdapter } from '@/lib/app/wallet-multi';
import { usePipelineStore } from '@/lib/app/pipeline-store';

interface WalletAuthValue {
  pubkey: string | null;
  chain: ReturnType<typeof useWalletSession.getState>['chain'];
  network: string | null;
  tier: TierInfo;
  workspace: Workspace;
  connecting: boolean;
  error: string | null;
  connect: (adapterId: string) => Promise<boolean>;
  disconnect: () => void;
}

const Ctx = createContext<WalletAuthValue | null>(null);

export function WalletAuthProvider({ children }: { children: React.ReactNode }) {
  const session = useWalletSession();
  const pipelines = usePipelineStore((s) => s.pipelines);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasPipeline = Boolean(session.pubkey && pipelines.some((p) => p.pubkey === session.pubkey));

  // Reconcile persisted session with the live Solana wallet (Solflare/Phantom).
  // Sessões legadas de outra chain são descartadas — o usuário reconecta
  // com uma wallet Solana.
  const reconcile = useCallback(async () => {
    if (!session.pubkey) return;
    if (session.chain && session.chain !== 'solana') {
      session.clear();
      return;
    }
    if (typeof window === 'undefined') return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    const provider = w.solflare?.isSolflare ? w.solflare : w.solana?.isPhantom ? w.solana : null;
    const livePubkey: string | undefined = provider?.publicKey?.toString?.();
    if (livePubkey && livePubkey !== session.pubkey) {
      session.setSession({
        chain: 'solana',
        pubkey: livePubkey,
        network: session.network ?? 'devnet',
        connectedAt: Date.now(),
      });
    }
  }, [session]);

  useEffect(() => {
    void reconcile();
    const onFocus = () => void reconcile();
    if (typeof window !== 'undefined') window.addEventListener('focus', onFocus);
    return () => { if (typeof window !== 'undefined') window.removeEventListener('focus', onFocus); };
  }, [reconcile]);

  const connect = useCallback(async (adapterId: string) => {
    setError(null);
    setConnecting(true);
    try {
      const adapter = getAdapter(adapterId) ?? solflareAdapter;
      const res = await adapter.connect();
      if (!res.ok || !res.pubkey) {
        setError(res.error ?? 'Falha ao conectar a wallet.');
        return false;
      }
      session.setSession({
        chain: res.chain,
        pubkey: res.pubkey,
        network: res.network,
        networkPassphrase: res.networkPassphrase,
        connectedAt: Date.now(),
      });
      return true;
    } finally {
      setConnecting(false);
    }
  }, [session]);

  const disconnect = useCallback(() => {
    session.clear();
    setError(null);
  }, [session]);

  const value = useMemo<WalletAuthValue>(() => ({
    pubkey: session.pubkey,
    chain: session.chain,
    network: session.network,
    tier: deriveTier(session.pubkey, { hasPipeline }),
    workspace: deriveWorkspace(session.pubkey),
    connecting,
    error,
    connect,
    disconnect,
  }), [session.pubkey, session.chain, session.network, hasPipeline, connecting, error, connect, disconnect]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useWalletAuth(): WalletAuthValue {
  const v = useContext(Ctx);
  if (!v) throw new Error('useWalletAuth must be used within WalletAuthProvider');
  return v;
}
