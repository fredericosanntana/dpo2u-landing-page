// Freighter wallet adapter — read-only typed wrapper over window.freighter*.
//
// We import `@stellar/freighter-api` LAZILY (dynamic import inside each
// function) so the admin UI bundle doesn't bloat the public landing.
// Tests + non-admin deployments never pay the cost.
//
// Freighter is a browser extension; on the server (SSR/prerender)
// `window.freighter` is undefined. We probe gracefully.

export interface FreighterStatus {
  readonly available: boolean;
  readonly connected: boolean;
  readonly publicKey: string | null;
  readonly network: string | null;
  readonly networkPassphrase: string | null;
  readonly error?: string;
}

type FreighterModule = {
  isConnected: () => Promise<boolean>;
  isAllowed: () => Promise<boolean>;
  requestAccess: () => Promise<string>;
  getAddress: () => Promise<{ address: string; error?: string }>;
  getNetworkDetails: () => Promise<{ network: string; networkPassphrase: string; networkUrl?: string }>;
  signTransaction: (xdr: string, opts?: { networkPassphrase?: string; address?: string }) => Promise<{ signedTxXdr: string; signerAddress?: string }>;
};

async function loadFreighter(): Promise<FreighterModule | null> {
  if (typeof window === 'undefined') return null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mod: any = await import(/* @vite-ignore */ '@stellar/freighter-api');
    return mod as FreighterModule;
  } catch {
    return null;
  }
}

export async function getStatus(): Promise<FreighterStatus> {
  const f = await loadFreighter();
  if (!f) {
    return {
      available: false,
      connected: false,
      publicKey: null,
      network: null,
      networkPassphrase: null,
    };
  }
  try {
    const connected = await f.isConnected();
    if (!connected) {
      return { available: true, connected: false, publicKey: null, network: null, networkPassphrase: null };
    }
    const allowed = await f.isAllowed().catch(() => false);
    if (!allowed) {
      return { available: true, connected: true, publicKey: null, network: null, networkPassphrase: null };
    }
    const addr = await f.getAddress();
    const net = await f.getNetworkDetails();
    return {
      available: true,
      connected: true,
      publicKey: addr.address ?? null,
      network: net.network ?? null,
      networkPassphrase: net.networkPassphrase ?? null,
      error: addr.error,
    };
  } catch (err) {
    return {
      available: true,
      connected: false,
      publicKey: null,
      network: null,
      networkPassphrase: null,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

export async function connect(): Promise<FreighterStatus> {
  const f = await loadFreighter();
  if (!f) {
    return {
      available: false,
      connected: false,
      publicKey: null,
      network: null,
      networkPassphrase: null,
      error: 'Freighter extension not detected. Install via https://freighter.app/',
    };
  }
  try {
    await f.requestAccess();
  } catch (err) {
    return {
      available: true,
      connected: false,
      publicKey: null,
      network: null,
      networkPassphrase: null,
      error: err instanceof Error ? err.message : 'User rejected access',
    };
  }
  return getStatus();
}

export async function signXdr(args: {
  xdr: string;
  networkPassphrase: string;
  signerAddress?: string;
}): Promise<{ signedTxXdr: string }> {
  const f = await loadFreighter();
  if (!f) throw new Error('Freighter not available');
  const signed = await f.signTransaction(args.xdr, {
    networkPassphrase: args.networkPassphrase,
    address: args.signerAddress,
  });
  return { signedTxXdr: signed.signedTxXdr };
}
