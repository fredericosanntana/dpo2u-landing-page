// Registry of DPO2U Anti-corruption Pilot contracts.
//
// Source of truth for which contract instances are deployed across
// networks + their metadata. As new contracts land (mainnet ceremony,
// new use cases, separate municípios), add entries here.

import { Networks } from '@stellar/stellar-sdk';

export type StellarNetwork = 'testnet' | 'mainnet';

export interface ContractMeta {
  readonly id: string;
  readonly network: StellarNetwork;
  readonly network_passphrase: string;
  readonly rpc_url: string;
  readonly horizon_url: string;
  readonly explorer_base: string;
  readonly deployed_at: string;
  readonly wasm_hash: string;
  readonly admin: string;
  readonly friendly_name: string;
  readonly description: string;
  readonly source_commit?: string;
}

export const TESTNET_CONTRACT: ContractMeta = {
  id: 'CC4TJGDRWZOPGBWOOHBJF3N2VKUQRNIW6C6PTYHD7ZI3D42GBQRRZHM5',
  network: 'testnet',
  network_passphrase: Networks.TESTNET,
  rpc_url: 'https://soroban-testnet.stellar.org',
  horizon_url: 'https://horizon-testnet.stellar.org',
  explorer_base: 'https://stellar.expert/explorer/testnet',
  deployed_at: '2026-05-12T18:26:40Z',
  wasm_hash: 'd706a07161d784dcf2790c95c5e5e516c0993dfbbd0c8eb7a61cdefd4a6d7595',
  admin: 'GDJSDCHTRQYZNKJMUFZ76NAIZ3ZNMBWWAPQ5UHI3JUSOFPSB7NEGQ6UN',
  friendly_name: 'DPO2U Piloto Anticorrupção (testnet)',
  description:
    'Primeiro contrato Soroban da pilha compliance-as-protocol da DPO2U. Imutável, registra atestações PASS/FAIL/REVIEW de decisões de compliance em pagamentos públicos brasileiros.',
};

// Mainnet placeholder — populated during Sprint L ceremony (M7).
export const MAINNET_CONTRACT: ContractMeta | null = null;

export function contractByNetwork(network: StellarNetwork): ContractMeta | null {
  if (network === 'testnet') return TESTNET_CONTRACT;
  return MAINNET_CONTRACT;
}

export function contractById(id: string): ContractMeta | null {
  if (id === TESTNET_CONTRACT.id) return TESTNET_CONTRACT;
  if (MAINNET_CONTRACT && id === MAINNET_CONTRACT.id) return MAINNET_CONTRACT;
  return null;
}

export const DEFAULT_CONTRACT = TESTNET_CONTRACT;
