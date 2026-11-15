// WalletAuthProvider — app-wide wallet session + derived tier/workspace. Stellar-only.
//
// Reconciles the persisted session against the live Stellar wallet (Freighter)
// on mount and on window focus. Connect/disconnect go through the wallet adapters.

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useWalletSession } from '@/lib/app/wallet-session';
import { deriveTier, deriveWorkspace, type TierInfo, type Workspace } from '@/lib/app/tier';
import { getAdapter, freighterAdapter } from '@/lib/app/wallet-multi';
import { getStatus as freighterStatus } from '@/lib/pilot/freighter';
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

  // Reconcile persisted session with the live Stellar wallet (Freighter).
  // Sessões legadas de outra chain são descartadas — o usuário reconecta
  // com o Freighter.
  const reconcile = useCallback(async () => {
    if (!session.pubkey) return;
    if (session.chain && session.chain !== 'stellar') {
      session.clear();
      return;
    }
    if (typeof window === 'undefined') return;
    // getStatus só devolve a pubkey se o app já tem acesso liberado; quando a
    // extensão está travada/ausente mantemos a sessão persistida (reconecta no /login).
    const st = await freighterStatus();
    if (st.publicKey && st.publicKey !== session.pubkey) {
      session.setSession({
        chain: 'stellar',
        pubkey: st.publicKey,
        network: st.network ?? session.network ?? 'testnet',
        networkPassphrase: st.networkPassphrase ?? session.networkPassphrase,
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
      const adapter = getAdapter(adapterId) ?? freighterAdapter;
      const res = await adapter.connect();
      if (!res.ok || !res.pubkey) {
        setError(res.error ?? 'Failed to connect the wallet.');
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
