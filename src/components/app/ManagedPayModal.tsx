// ManagedPayModal — modal x402 genérico do app (Managed). Conecta Freighter, mostra o
// desafio (setup fee ou per-attestation) e devolve o header X-PAYMENT assinado via onPaid.
// Auto-contido (não toca o PaymentModal do piloto). Design selado.
import React, { useState } from 'react';
import { FONTS, PALETTE } from '@/components/sealed/atoms';
import { connect as freighterConnect, getStatus } from '@/lib/pilot/freighter';
import { humanAmount, type X402Challenge } from '@/lib/pilot/payment-tx';
import { signX402Header } from '@/lib/app/managed-client';

export interface ManagedPayModalProps {
  readonly title: string;
  readonly challenge: X402Challenge;
  readonly onPaid: (xPaymentHeader: string, payer: string) => void;
  readonly onCancel: () => void;
}

export function ManagedPayModal({ title, challenge, onPaid, onCancel }: ManagedPayModalProps) {
  const [payer, setPayer] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const assetCode = String(challenge.extra?.assetCode || 'XLM');

  const onConnect = async () => {
    setError(null);
    setConnecting(true);
    try {
      const st = await freighterConnect();
      const pk = st.publicKey ?? (await getStatus()).publicKey;
      if (!pk) { setError(st.error ?? 'Não foi possível conectar o Freighter.'); return; }
      setPayer(pk);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Falha ao conectar o Freighter.');
    } finally {
      setConnecting(false);
    }
  };

  const onPay = async () => {
    if (!payer) return;
    setBusy(true);
    setError(null);
    try {
      const header = await signX402Header(challenge, payer);
      onPaid(header, payer);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(12,13,16,.45)' }}>
      <div className="w-full max-w-md p-6 space-y-4" style={{ background: PALETTE.paper, borderRadius: 6, border: `1px solid ${PALETTE.ruleStrong}`, fontFamily: FONTS.body }}>
        <div className="flex items-start justify-between">
          <h3 style={{ fontFamily: FONTS.display, fontSize: 20, fontWeight: 500 }}>{title}</h3>
          <button type="button" onClick={onCancel} aria-label="Fechar" style={{ background: 'none', border: 'none', cursor: 'pointer', color: PALETTE.concrete }}>✕</button>
        </div>
        <dl className="grid grid-cols-2 gap-2 text-sm">
          <div><dt style={{ fontSize: 11, color: PALETTE.concrete }}>Valor</dt><dd>{humanAmount(challenge)} {assetCode}</dd></div>
          <div><dt style={{ fontSize: 11, color: PALETTE.concrete }}>Network</dt><dd>{challenge.network}</dd></div>
          <div className="col-span-2"><dt style={{ fontSize: 11, color: PALETTE.concrete }}>Destinatário (treasury)</dt><dd style={{ fontFamily: FONTS.mono, fontSize: 11, wordBreak: 'break-all' }}>{challenge.payTo}</dd></div>
        </dl>
        {!payer ? (
          <button type="button" onClick={onConnect} disabled={connecting} className="w-full py-3" style={{ background: PALETTE.ink, color: PALETTE.paper, border: 'none', borderRadius: 4, cursor: connecting ? 'wait' : 'pointer', fontFamily: FONTS.body, fontSize: 15, opacity: connecting ? 0.7 : 1 }}>
            {connecting ? 'Conectando…' : 'Conectar Freighter'}
          </button>
        ) : (
          <>
            <p style={{ fontSize: 12, color: PALETTE.concrete }}>Pagador: <span style={{ fontFamily: FONTS.mono }}>{payer.slice(0, 10)}…</span></p>
            <button type="button" onClick={onPay} disabled={busy} className="w-full py-3" style={{ background: PALETTE.terracotta, color: '#fff', border: 'none', borderRadius: 4, cursor: busy ? 'wait' : 'pointer', fontFamily: FONTS.body, fontSize: 15 }}>
              {busy ? 'Pagando…' : `Pagar ${humanAmount(challenge)} ${assetCode} & continuar`}
            </button>
          </>
        )}
        {error && <p style={{ fontSize: 12, color: PALETTE.terracotta, fontFamily: FONTS.mono }}>{error}</p>}
      </div>
    </div>
  );
}
