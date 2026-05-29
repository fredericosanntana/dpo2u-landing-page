// ClientStellarSigner (SEP-43) lastreado no Freighter — para o cliente x402
// (@x402/stellar exact/client). ExactStellarScheme exige `address` + `signAuthEntry`
// (+ signTransaction opcional). O Freighter v6 implementa SEP-43 (signAuthEntry).
//
// ⚠️ Só roda em BROWSER com a extensão Freighter — validação runtime é no go-live.
// Tipos do SDK (SignAuthEntry) são opacos no .d.ts → cast controlado p/ ClientStellarSigner.

import type { ClientStellarSigner } from '@x402/stellar';
import { signXdr } from './freighter';

interface FreighterAuthApi {
  signAuthEntry: (
    entryXdr: string,
    opts?: { address?: string; networkPassphrase?: string },
  ) => Promise<{ signedAuthEntry: string | null; signerAddress?: string; error?: string }>;
}

/** Monta um ClientStellarSigner que delega ao Freighter (signAuthEntry + signTransaction). */
export async function freighterSigner(
  address: string,
  networkPassphrase: string,
): Promise<ClientStellarSigner> {
  const mod = (await import(/* @vite-ignore */ '@stellar/freighter-api')) as unknown as FreighterAuthApi;
  const signer = {
    address,
    signAuthEntry: async (entryXdr: string): Promise<string> => {
      const r = await mod.signAuthEntry(entryXdr, { address, networkPassphrase });
      if (!r.signedAuthEntry) throw new Error(r.error ?? 'Freighter recusou a assinatura da auth entry');
      return r.signedAuthEntry;
    },
    signTransaction: async (txXdr: string): Promise<string> => {
      const { signedTxXdr } = await signXdr({ xdr: txXdr, networkPassphrase, signerAddress: address });
      return signedTxXdr;
    },
  };
  return signer as unknown as ClientStellarSigner;
}
