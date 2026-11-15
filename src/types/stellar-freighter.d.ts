declare module '@stellar/freighter-api' {
  export function isConnected(): Promise<boolean>;
  export function isAllowed(): Promise<boolean>;
  export function requestAccess(): Promise<string>;
  export function getAddress(): Promise<{ address: string; error?: string }>;
  export function getNetworkDetails(): Promise<{ network: string; networkPassphrase: string; networkUrl?: string }>;
  export function signTransaction(xdr: string, opts?: { networkPassphrase?: string; address?: string }): Promise<{ signedTxXdr: string; signerAddress?: string }>;
}
