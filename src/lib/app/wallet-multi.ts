// Multi-wallet adapters behind a common interface.
//
// MVP: Freighter (Stellar) is the validated path — delegates to the pilot's
// freighter adapter (src/lib/pilot/freighter.ts), 100% reuse. Phantom (Solana)
// is behind VITE_WALLET_SOLANA; WalletConnect/GitHub OAuth are roadmap (need
// backend) and render disabled in the UI.

import { connect as freighterConnect, getStatus as freighterStatus } from '@/lib/pilot/freighter';
import type { WalletChain } from './wallet-session';

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

const SOLANA_ENABLED = (import.meta.env.VITE_WALLET_SOLANA as string | undefined) === '1';

export const freighterAdapter: WalletAdapter = {
  id: 'freighter',
  label: 'Freighter (Stellar)',
  chain: 'stellar',
  enabled: true,
  async isAvailable() {
    const s = await freighterStatus();
    return s.available;
  },
  async connect() {
    const s = await freighterConnect();
    if (!s.publicKey) {
      return { ok: false, chain: 'stellar', error: s.error ?? 'Conexão recusada ou rede indisponível.' };
    }
    return {
      ok: true,
      chain: 'stellar',
      pubkey: s.publicKey,
      network: s.network,
      networkPassphrase: s.networkPassphrase,
    };
  },
};

// Phantom (Solana) — minimal, dynamic so @solana/web3.js doesn't load unless used.
export const phantomAdapter: WalletAdapter = {
  id: 'phantom',
  label: 'Phantom (Solana)',
  chain: 'solana',
  enabled: SOLANA_ENABLED,
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
      return { ok: true, chain: 'solana', pubkey, network: 'mainnet-beta' };
    } catch (e) {
      return { ok: false, chain: 'solana', error: e instanceof Error ? e.message : 'Conexão recusada.' };
    }
  },
};

// Solflare (Solana) — habilitada por padrão (tração). window.solflare injeta isSolflare +
// connect() + publicKey. No fluxo Managed dual-chain, conectar Solflare ancora o selo na
// Solana (gateway assina; ver activate.tsx + solana-driver no gateway) — NÃO toca Freighter/XLM.
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
      return { ok: true, chain: 'solana', pubkey, network: 'mainnet-beta' };
    } catch (e) {
      return { ok: false, chain: 'solana', error: e instanceof Error ? e.message : 'Conexão recusada.' };
    }
  },
};

export const WALLET_ADAPTERS: readonly WalletAdapter[] = [freighterAdapter, solflareAdapter, phantomAdapter];

export function getAdapter(id: string): WalletAdapter | undefined {
  return WALLET_ADAPTERS.find((a) => a.id === id);
}
