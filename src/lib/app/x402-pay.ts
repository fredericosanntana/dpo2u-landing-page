// x402-pay.ts — paga um desafio x402 (Stellar USDC) com Freighter e devolve o
// header X-PAYMENT pronto pra reenviar a chamada managed. Mesmo fluxo do
// PaymentModal do piloto (ExactStellarScheme + freighterSigner). Os pacotes
// @x402/* são importados dinamicamente pra não pesar o bundle de quem só lê.

import { connect as freighterConnect, getStatus } from '@/lib/pilot/freighter';
import { freighterSigner } from '@/lib/pilot/freighter-signer';
import { toOfficialRequirement, encodeFullPayload, stellarNet, type X402Challenge } from '@/lib/pilot/payment-tx';

export interface X402PayResult {
  readonly header: string;
  readonly payer: string;
}

/** Conecta o Freighter, assina o pagamento USDC via @x402/stellar e devolve o header X-PAYMENT. */
export async function payX402WithFreighter(challenge: X402Challenge): Promise<X402PayResult> {
  const st = await freighterConnect();
  const payer = st.publicKey ?? (await getStatus()).publicKey;
  if (!payer) throw new Error(st.error ?? 'Freighter did not connect.');

  const [{ ExactStellarScheme }, { x402Version: X402_VERSION }] = await Promise.all([
    import('@x402/stellar/exact/client'),
    import('@x402/core'),
  ]);

  const net = stellarNet(challenge.network);
  const requirement = toOfficialRequirement(challenge);
  const signer = await freighterSigner(payer, net.passphrase);
  const scheme = new ExactStellarScheme(signer, { url: net.rpcUrl });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const partial = await scheme.createPaymentPayload(X402_VERSION, requirement as any);
  const header = encodeFullPayload({ x402Version: X402_VERSION, accepted: requirement, payload: partial.payload });
  return { header, payer };
}
