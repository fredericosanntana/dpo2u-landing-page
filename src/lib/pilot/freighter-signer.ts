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

/** Monta um ClientStellarSigner que delega ao Freighter (signAuthEntry + signTransaction).
 *
 * ⚠️ CONTRATO crítico: o stellar-sdk (`AssembledTransaction.signAuthEntries`, usado pelo
 * @x402/stellar exact/client) chama `signAuthEntry(preimageXdr, {address})` e lê
 * `result.signedAuthEntry` + `result.error` do RETORNO (objeto SEP-43), depois faz
 * `Buffer.from(signedAuthEntry, "base64")`. Se devolvermos a string crua, `.signedAuthEntry`
 * é undefined → "Buffer.from received undefined". Por isso retornamos o OBJETO, não a string. */
export async function freighterSigner(
  address: string,
  networkPassphrase: string,
): Promise<ClientStellarSigner> {
  const mod = (await import(/* @vite-ignore */ '@stellar/freighter-api')) as unknown as FreighterAuthApi;
  const signer = {
    address,
    signAuthEntry: async (
      entryXdr: string,
      opts?: { address?: string },
    ): Promise<{ signedAuthEntry: string; signerAddress: string }> => {
      const r = await mod.signAuthEntry(entryXdr, { address: opts?.address ?? address, networkPassphrase });
      if (r.error) throw new Error(typeof r.error === 'string' ? r.error : 'Freighter recusou a assinatura da auth entry');
      if (!r.signedAuthEntry) throw new Error('Freighter não retornou a auth entry assinada');
      // shape SEP-43 esperado pelo stellar-sdk (objeto, não string)
      return { signedAuthEntry: r.signedAuthEntry, signerAddress: r.signerAddress ?? address };
    },
    signTransaction: async (txXdr: string): Promise<string> => {
      const { signedTxXdr } = await signXdr({ xdr: txXdr, networkPassphrase, signerAddress: address });
      return signedTxXdr;
    },
  };
  return signer as unknown as ClientStellarSigner;
}
