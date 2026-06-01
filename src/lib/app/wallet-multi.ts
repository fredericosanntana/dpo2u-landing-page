// Multi-wallet adapters behind a common interface. Solana-only.
//
// O app disponibiliza apenas Solana: Solflare e Phantom (wallets nativas Solana).
// O caminho da chain antiga foi removido daqui (continua só no /pilot).
// WalletConnect/GitHub OAuth são roadmap (precisam de backend).

import type { WalletChain } from './wallet-session';

// Cluster Solana configurado (default devnet) — lido sem carregar @solana/web3.js.
const SOLANA_CLUSTER = (import.meta.env.VITE_SOLANA_CLUSTER as string | undefined) ?? 'devnet';

export interface WalletConnectResult {
  readonly ok: boolean;
  readonly chain: WalletChain;
  readonly pubkey?: string;
  readonly network?: string | null;
  readonly networkPassphrase?: string | null;
  readonly error?: string;
}

export interface WalletAdapter {
  readonly id: string;
  readonly label: string;
  readonly chain: WalletChain;
  readonly enabled: boolean;
  isAvailable(): Promise<boolean>;
  connect(): Promise<WalletConnectResult>;
}

// Phantom (Solana) — minimal, dynamic so @solana/web3.js doesn't load unless used.
export const phantomAdapter: WalletAdapter = {
  id: 'phantom',
  label: 'Phantom (Solana)',
  chain: 'solana',
  enabled: true,
  async isAvailable() {
    if (typeof window === 'undefined') return false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return Boolean((window as any).solana?.isPhantom);
  },
  async connect() {
    if (typeof window === 'undefined') return { ok: false, chain: 'solana', error: 'No window' };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sol = (window as any).solana;
    if (!sol?.isPhantom) return { ok: false, chain: 'solana', error: 'Phantom não detectado.' };
    try {
      const res = await sol.connect();
      const pubkey = res?.publicKey?.toString?.() ?? sol.publicKey?.toString?.();
      if (!pubkey) return { ok: false, chain: 'solana', error: 'Sem pubkey.' };
      return { ok: true, chain: 'solana', pubkey, network: SOLANA_CLUSTER };
    } catch (e) {
      return { ok: false, chain: 'solana', error: e instanceof Error ? e.message : 'Conexão recusada.' };
    }
  },
};

// Solflare (Solana) — habilitada por padrão. window.solflare injeta isSolflare +
// connect() + publicKey. Conectar Solflare ancora o selo na Solana (o gateway assina;
// ver activate.tsx + solana-driver no gateway).
export const solflareAdapter: WalletAdapter = {
  id: 'solflare',
  label: 'Solflare (Solana)',
  chain: 'solana',
  enabled: true,
  async isAvailable() {
    if (typeof window === 'undefined') return false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return Boolean((window as any).solflare?.isSolflare);
  },
  async connect() {
    if (typeof window === 'undefined') return { ok: false, chain: 'solana', error: 'No window' };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sf = (window as any).solflare;
    if (!sf?.isSolflare) return { ok: false, chain: 'solana', error: 'Solflare não detectada — instale a extensão.' };
    try {
      await sf.connect();
      const pubkey = sf.publicKey?.toString?.();
      if (!pubkey) return { ok: false, chain: 'solana', error: 'Sem pubkey.' };
      return { ok: true, chain: 'solana', pubkey, network: SOLANA_CLUSTER };
    } catch (e) {
      return { ok: false, chain: 'solana', error: e instanceof Error ? e.message : 'Conexão recusada.' };
    }
  },
};

export const WALLET_ADAPTERS: readonly WalletAdapter[] = [solflareAdapter, phantomAdapter];

export function getAdapter(id: string): WalletAdapter | undefined {
  return WALLET_ADAPTERS.find((a) => a.id === id);
}
