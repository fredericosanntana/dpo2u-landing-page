// /app/fi/billing — plano, trial e faturas (E8). Pagamento x402 em USDC na Stellar com Freighter.
import React, { useEffect, useState } from 'react';
import { ExactStellarScheme } from '@x402/stellar/exact/client';
import { x402Version as X402_VERSION } from '@x402/core';
import { billingApi, GatewayError, type BillingView, type PlanView } from '@/lib/fi/gateway';
import { useFiSession } from '@/components/fi/FiSession';
import { connect as freighterConnect } from '@/lib/pilot/freighter';
import { freighterSigner } from '@/lib/pilot/freighter-signer';
import { encodeFullPayload, humanAmount, parseX402Challenge, stellarNet, toOfficialRequirement } from '@/lib/pilot/payment-tx';
import { FONTS, PALETTE } from '@/components/sealed/atoms';

const card: React.CSSProperties = { background: PALETTE.paper2, border: `.5px solid ${PALETTE.ruleStrong}`, borderRadius: 4, padding: 20 };
const btn: React.CSSProperties = { background: PALETTE.ink, color: '#fff', border: 0, padding: '10px 16px', borderRadius: 4, cursor: 'pointer', fontFamily: FONTS.body };
const usd = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
const STATE_PT = { trial: 'Trial', active: 'Ativo', expired: 'Vencido' } as const;

export default function FiBillingPage() {
  const { session } = useFiSession();
  const [data, setData] = useState<{ plans: PlanView[]; subscription: BillingView; usage?: { transfers_30d: number; pass: number; fail: number; review: number }; payment: { available: boolean; network: string; asset: string } } | null>(null);
  const [period, setPeriod] = useState<'annual' | 'monthly'>('annual');
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const load = () => billingApi.get().then(setData).catch(() => setData(null));
  useEffect(() => { void load(); }, []);
  if (!session || !data) return null;
  const isOwner = session.member.role === 'owner';
  const sub = data.subscription;

  async function buy(plan: PlanView) {
    setMsg(null);
    try {
      setBusy(plan.id);
      // 1. pede o desafio x402 (402)
      let challengeBody: unknown;
      try {
        await billingApi.buy(plan.id, period);
        return void (await load());
      } catch (e) {
        if (!(e instanceof GatewayError) || e.status !== 402) throw e;
        challengeBody = e.body;
      }
      const challenge = parseX402Challenge(challengeBody);
      if (!challenge) throw new Error('Desafio de pagamento inválido.');
      if (!window.confirm(`Pagar ${humanAmount(challenge)} ${challenge.extra?.assetCode ?? 'USDC'} na ${challenge.network} pelo plano ${plan.name}?`)) return;
      // 2. assina com Freighter e reenvia com X-PAYMENT
      const st = await freighterConnect();
      if (!st.publicKey) throw new Error(st.error ?? 'Conecte a carteira Freighter para pagar.');
      const net = stellarNet(challenge.network);
      const requirement = toOfficialRequirement(challenge);
      const scheme = new ExactStellarScheme(await freighterSigner(st.publicKey, net.passphrase), { url: net.rpcUrl });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const partial = await scheme.createPaymentPayload(X402_VERSION, requirement as any);
      await billingApi.buy(plan.id, period, encodeFullPayload({ x402Version: X402_VERSION, accepted: requirement, payload: partial.payload }));
      setMsg(`Plano ${plan.name} ativo.`);
      await load();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Algo deu errado.');
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="grid gap-8" style={{ maxWidth: 960 }}>
      <section style={card} data-testid="billing-state" data-state={sub.state}>
        <h2 style={{ fontFamily: FONTS.display, fontSize: 24, margin: 0 }}>Plano: {STATE_PT[sub.state]}{sub.plan ? `, ${sub.plan.name}` : ''}</h2>
        <p style={{ marginTop: 6, fontSize: 14 }}>
          {sub.state === 'trial' && `Faltam ${sub.days_left} dias de trial (até ${new Date(sub.trial_ends_at).toLocaleDateString()}).`}
          {sub.state === 'active' && sub.plan && `Pago até ${new Date(sub.plan.paid_through).toLocaleDateString()}.`}
          {sub.state === 'expired' && 'O trial terminou. Escolha um plano para continuar pedindo passaportes.'}
        </p>
        {data.usage && <p data-testid="billing-usage" style={{ fontSize: 13, color: PALETTE.concrete, marginTop: 4 }}>Transferências avaliadas nos últimos 30 dias: {data.usage.transfers_30d} ({data.usage.pass} PASS, {data.usage.fail} FAIL, {data.usage.review} em revisão). Incluídas no plano; FAIL custa o mesmo que PASS.</p>}
      </section>

      <section aria-labelledby="bl-plans" className="grid gap-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 id="bl-plans" style={{ fontFamily: FONTS.display, fontSize: 24, margin: 0 }}>Planos</h2>
          <label style={{ fontSize: 14 }}>Período{' '}
            <select name="period" value={period} onChange={(e) => setPeriod(e.target.value as 'annual' | 'monthly')} style={{ padding: 6 }}>
              <option value="annual">anual</option>
              <option value="monthly">mensal</option>
            </select>
          </label>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {data.plans.map((p) => (
            <article key={p.id} style={card} data-plan={p.id} className="grid gap-2">
              <h3 style={{ fontFamily: FONTS.display, fontSize: 22, margin: 0 }}>{p.name}</h3>
              <div style={{ fontSize: 20 }}>{usd(period === 'annual' ? p.annual_usd : p.monthly_usd)}<span style={{ fontSize: 13, color: PALETTE.concrete }}> / {period === 'annual' ? 'ano' : 'mês'} por entidade</span></div>
              <ul style={{ fontSize: 13, paddingLeft: 16, margin: 0 }}>
                <li>{p.limits.passportsPerYear.toLocaleString()} passaportes por ano</li>
                <li>{p.limits.transfersPerMonth.toLocaleString()} transferências por mês</li>
                <li>{p.limits.members} membros</li>
              </ul>
              {isOwner && (
                <button type="button" style={btn} disabled={!data.payment.available || Boolean(busy)} onClick={() => void buy(p)}>
                  {busy === p.id ? 'Processando…' : sub.plan?.id === p.id && sub.state === 'active' ? 'Renovar' : 'Contratar'}
                </button>
              )}
            </article>
          ))}
        </div>
        <p style={{ fontSize: 12, color: PALETTE.concrete }}>
          {data.payment.available ? `Pagamento em ${data.payment.asset} na rede ${data.payment.network}, pelo protocolo x402, com a carteira Freighter.` : 'A cobrança ainda não está aberta. Durante o trial tudo funciona; a DPO2U avisa quando a contratação abrir.'}
        </p>
      </section>

      {sub.invoices.length > 0 && (
        <section style={card} aria-labelledby="bl-inv">
          <h2 id="bl-inv" style={{ fontFamily: FONTS.display, fontSize: 22, margin: 0 }}>Faturas</h2>
          <table style={{ width: '100%', marginTop: 12, borderCollapse: 'collapse', fontSize: 14 }}>
            <tbody>
              {sub.invoices.map((i) => (
                <tr key={i.id} style={{ borderTop: `1px solid ${PALETTE.rule}` }}>
                  <td style={{ padding: '8px 0' }}>{new Date(i.paid_at).toLocaleDateString()}</td>
                  <td>{i.plan} ({i.period})</td>
                  <td>{usd(i.amount_usd)}</td>
                  <td><code style={{ fontSize: 11 }}>{i.tx_hash.slice(0, 16)}…</code></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
      {msg && <p role="status">{msg}</p>}
    </div>
  );
}
