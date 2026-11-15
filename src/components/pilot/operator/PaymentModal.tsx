// Modal x402 — "Pagar com Freighter" (Stellar USDC) quando a submissão retorna 402.
//
// Conecta Freighter (real), mostra o desafio x402 oficial e, ao pagar, constrói o
// header X-PAYMENT e reenvia a submissão. A CONSTRUÇÃO ON-CHAIN do pagamento USDC
// (transfer no SAC + auth) é o seam de go-live (`signPayment`) — integra o
// `@x402/stellar` exact/client contra o facilitator real. A conexão da wallet e o
// reenvio com X-PAYMENT já estão prontos.

import { useState } from 'react';
import { Loader2, CreditCard, Wallet, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ExactStellarScheme } from '@x402/stellar/exact/client';
import { x402Version as X402_VERSION } from '@x402/core';
import { connect as freighterConnect, getStatus } from '@/lib/pilot/freighter';
import { freighterSigner } from '@/lib/pilot/freighter-signer';
import {
  toOfficialRequirement,
  encodeFullPayload,
  stellarNet,
  humanAmount,
  type X402Challenge,
} from '@/lib/pilot/payment-tx';
import {
  submitAttestationWithPayment,
  type SubmitAttestationInput,
  type SubmitResult,
} from '@/lib/pilot/mcp-client';

export interface PaymentModalProps {
  readonly challenge: X402Challenge;
  readonly input: SubmitAttestationInput;
  readonly onPaid: (result: SubmitResult) => void;
  readonly onCancel: () => void;
}

export function PaymentModal({ challenge, input, onPaid, onCancel }: PaymentModalProps) {
  const [payer, setPayer] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onConnect = async () => {
    setError(null);
    const st = await freighterConnect();
    if (!st.publicKey) {
      const s2 = await getStatus();
      if (!s2.publicKey) { setError(st.error ?? 'Não foi possível conectar o Freighter.'); return; }
      setPayer(s2.publicKey);
      return;
    }
    setPayer(st.publicKey);
  };

  const onPay = async () => {
    if (!payer) return;
    setBusy(true);
    setError(null);
    try {
      // Constrói+assina o pagamento USDC via SDK oficial @x402/stellar + Freighter,
      // monta o PaymentPayload oficial e reenvia com X-PAYMENT.
      const net = stellarNet(challenge.network);
      const requirement = toOfficialRequirement(challenge);
      const signer = await freighterSigner(payer, net.passphrase);
      const scheme = new ExactStellarScheme(signer, { url: net.rpcUrl });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const partial = await scheme.createPaymentPayload(X402_VERSION, requirement as any);
      const header = encodeFullPayload({ x402Version: X402_VERSION, accepted: requirement, payload: partial.payload });
      const result = await submitAttestationWithPayment(input, header);
      onPaid(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-dpo2u-gold" />
            <h3 className="font-display text-lg text-dpo2u-ink">Pagar com Freighter (x402)</h3>
          </div>
          <button type="button" onClick={onCancel} aria-label="Fechar"><X className="h-5 w-5 text-dpo2u-ink/50" /></button>
        </div>

        <dl className="grid grid-cols-2 gap-2 text-sm">
          <div><dt className="text-xs text-dpo2u-ink/60">Valor</dt><dd className="text-dpo2u-ink">{humanAmount(challenge)} USDC</dd></div>
          <div><dt className="text-xs text-dpo2u-ink/60">Network</dt><dd className="text-dpo2u-ink">{challenge.network}</dd></div>
          <div className="col-span-2"><dt className="text-xs text-dpo2u-ink/60">Destinatário</dt><dd className="font-mono text-xs break-all text-dpo2u-ink">{challenge.payTo}</dd></div>
          <div className="col-span-2"><dt className="text-xs text-dpo2u-ink/60">Asset (USDC SAC)</dt><dd className="font-mono text-xs break-all text-dpo2u-ink">{challenge.asset}</dd></div>
        </dl>

        {!payer ? (
          <Button onClick={onConnect} className="w-full bg-dpo2u-ink text-dpo2u-ivory hover:bg-dpo2u-ink/85">
            <Wallet className="h-4 w-4 mr-2" /> Conectar Freighter
          </Button>
        ) : (
          <>
            <p className="text-xs text-dpo2u-ink/60">Pagador: <span className="font-mono">{payer.slice(0, 10)}…</span></p>
            <Button onClick={onPay} disabled={busy} className="w-full bg-dpo2u-gold text-dpo2u-ink hover:bg-dpo2u-gold/90">
              {busy ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Pagando…</> : <>Pagar {humanAmount(challenge)} USDC & reenviar</>}
            </Button>
          </>
        )}

        {error && <p className="text-xs text-dpo2u-terracotta">{error}</p>}
      </div>
    </div>
  );
}
