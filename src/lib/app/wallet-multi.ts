// Wallet adapters behind a common interface. Stellar-only.
//
// O app disponibiliza apenas Stellar via Freighter (a wallet nativa Soroban).
// O adapter envolve `@/lib/pilot/freighter` (mesmo wrapper SEP-43 do piloto).
// WalletConnect/GitHub OAuth são roadmap (precisam de backend).

import type { WalletChain } from './wallet-session';
import { connect as freighterConnect, getStatus } from '@/lib/pilot/freighter';

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

// Freighter (Stellar) — extensão de browser. Conectar ancora o selo no contrato
// Soroban; a própria wallet assina (self-custody) ou prova posse da chave (managed).
export const freighterAdapter: WalletAdapter = {
  id: 'freighter',
  label: 'Freighter (Stellar)',
  chain: 'stellar',
  enabled: true,
  async isAvailable() {
    const st = await getStatus();
    return st.available;
  },
  async connect() {
    const st = await freighterConnect();
    if (!st.publicKey) {
      return { ok: false, chain: 'stellar', error: st.error ?? 'Freighter não conectou.' };
    }
    return {
      ok: true,
      chain: 'stellar',
      pubkey: st.publicKey,
      network: st.network,
      networkPassphrase: st.networkPassphrase,
    };
  },
};

export const WALLET_ADAPTERS: readonly WalletAdapter[] = [freighterAdapter];

export function getAdapter(id: string): WalletAdapter | undefined {
  return WALLET_ADAPTERS.find((a) => a.id === id);
}
