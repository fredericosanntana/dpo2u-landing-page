/**
 * /app/billing — real usage (Phase E). Pulls the gateway ledger (GET /managed/usage)
 * filtered by pubkey: setup fee + per-attestation in USDC (Stellar x402), with tx links.
 * The final Managed/DPO tier price stays "calibrating" (gate G1).
 */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FONTS, PALETTE, SmallLabel, Rule } from '@/components/sealed/atoms';
import { AppButton, KpiGrid, requestPaymentConfirm, toast } from '@/components/app/ui';
import { useWalletAuth } from '@/components/app/WalletAuthProvider';
import { getUsage, type ManagedUsage, type ManagedReceipt } from '@/lib/app/managed-client';
import { githubStatus, rechargeCredits } from '@/lib/app/github-client';
import { payX402WithFreighter } from '@/lib/app/x402-pay';
import { stellarExpertUrl } from '@/lib/pilot/stellar';

// The ledger stores amount as DECIMAL (e.g. "2", "0.1") — NOT atomic.
const fmtAmount = (amount: string): string => {
  const n = Number(amount);
  return Number.isFinite(n) ? String(n) : amount;
};

export default function AppBilling() {
  const { pubkey, tier } = useWalletAuth();
  const [usage, setUsage] = useState<ManagedUsage | null>(null);
  const [loading, setLoading] = useState(false);
  const [githubCredits, setGithubCredits] = useState<number | null>(null);
  const [rechargeBusy, setRechargeBusy] = useState(false);
  const [rechargeMsg, setRechargeMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!pubkey) { setUsage(null); setGithubCredits(null); return; }
    let alive = true;
    setLoading(true);
    void getUsage(pubkey, 'stellar').then((u) => { if (alive) { setUsage(u); setLoading(false); } });
    void githubStatus(pubkey).then((s) => { if (alive) setGithubCredits(s?.credits ?? null); });
    return () => { alive = false; };
  }, [pubkey, rechargeMsg]);

  // Recharge CI credits. Payment on Stellar is via x402 (USDC SAC): on 402 we show the
  // price (requestPaymentConfirm), the app signs with Freighter and retries.
  const onRecharge = async () => {
    if (!pubkey) { setRechargeMsg('Connect your wallet first.'); return; }
    setRechargeBusy(true); setRechargeMsg(null);
    try {
      let r = await rechargeCredits(pubkey);
      if (r.kind === 'payment_required') {
        const ok = await requestPaymentConfirm(r.challenge);
        if (!ok) { setRechargeBusy(false); return; }
        const { header } = await payX402WithFreighter(r.challenge);
        r = await rechargeCredits(pubkey, header);
      }
      if (r.kind === 'payment_required') { setRechargeMsg('The x402 payment did not settle — try again.'); return; }
      if (r.kind === 'error') { setRechargeMsg(`Recharge failed: ${r.message}`); toast.error('Recharge failed.'); return; }
      setRechargeMsg(`✓ +${r.added} credits · balance ${r.balance}.`);
      toast.success(`+${r.added} CI credits added · balance ${r.balance}.`);
    } catch (e) {
      setRechargeMsg(`Payment failed: ${e instanceof Error ? e.message : String(e)}`);
    } finally { setRechargeBusy(false); }
  };

  const receipts: ManagedReceipt[] = usage?.receipts ?? [];
  const total = receipts.reduce((acc, r) => acc + (Number(r.amount) || 0), 0);
  const totalAmt = total.toFixed(2).replace(/\.?0+$/, '');
  const pipelines = usage?.pipelines?.length ?? 0;

  return (
    <div className="max-w-[820px]">
      <SmallLabel>Billing</SmallLabel>
      <h1 className="text-[30px] md:text-[38px] font-medium" style={{ fontFamily: FONTS.display, letterSpacing: '-0.02em', marginTop: 6 }}>
        Usage &amp; plan<span style={{ color: PALETTE.terracotta }}>.</span>
      </h1>
      <p className="mt-2 text-[15px]" style={{ color: PALETTE.inkSoft }}>
        Attestation is the unit of billing. Current plan: <b>{tier.label}</b>. (Stellar testnet)
      </p>
      <div className="mt-4 p-4" style={{ border: `1px solid ${PALETTE.ruleStrong}`, borderRadius: 4, background: PALETTE.paper2 }}>
        <SmallLabel>Payment on Stellar</SmallLabel>
        <p className="mt-1 text-[14px]" style={{ color: PALETTE.inkSoft }}>
          Payment is via <b>x402</b> (USDC SAC on-chain) — the app shows you the exact amount, you sign in Freighter,
          and it retries with the X-PAYMENT header. Running on <b>testnet</b> for now.
        </p>
      </div>

      {/* Real usage (x402 ledger) + CI credits (GitHub App) */}
      <div className="mt-8">
        <KpiGrid items={[
          { value: String(receipts.length), label: 'payments' },
          { value: `${totalAmt} USDC`, label: 'total paid (testnet)' },
          { value: String(pipelines), label: 'pipelines' },
          { value: githubCredits === null ? '—' : String(githubCredits), label: 'CI credits (GitHub)' },
        ]} />
      </div>

      {/* Recharge CI credits (GitHub App) — payment via x402 on Stellar (USDC SAC). */}
      <div className="mt-4 flex items-center gap-3 flex-wrap">
        <AppButton disabled={!pubkey} loading={rechargeBusy} onClick={() => void onRecharge()}>
          {rechargeBusy ? 'Recharging…' : 'Recharge CI credits →'}
        </AppButton>
        <span className="text-[12px]" style={{ color: PALETTE.concrete }}>
          1 pack = 10 credits · 1 credit per Check Run · balance <b>bound to wallet {pubkey ? `${pubkey.slice(0, 4)}…${pubkey.slice(-4)}` : '—'}</b>.
        </span>
      </div>
      {rechargeMsg && (
        <p className="mt-2 text-[13px]" style={{ fontFamily: FONTS.mono, color: rechargeMsg.startsWith('✓') ? PALETTE.verdigris : PALETTE.terracotta }}>{rechargeMsg}</p>
      )}

      {/* Receipts */}
      <div className="mt-6">
        <SmallLabel style={{ marginBottom: 10 }}>Receipts</SmallLabel>
        {loading ? (
          <p className="text-[13px]" style={{ color: PALETTE.concrete }}>Loading usage…</p>
        ) : receipts.length === 0 ? (
          <p className="text-[14px]" style={{ color: PALETTE.inkSoft }}>
            No payments yet. <Link to="/app/activate" style={{ color: PALETTE.terracotta }}>Activate a pipeline →</Link>
          </p>
        ) : (
          <div style={{ border: `.5px solid ${PALETTE.rule}`, borderRadius: 4, overflow: 'hidden' }}>
            <table className="w-full" style={{ borderCollapse: 'collapse', fontFamily: FONTS.body }}>
              <thead>
                <tr style={{ background: PALETTE.paper2, borderBottom: `.5px solid ${PALETTE.ruleStrong}` }}>
                  {['Resource', 'Amount', 'Tx', 'Date'].map((h) => (
                    <th key={h} className="text-left" style={{ padding: '8px 14px', fontFamily: FONTS.mono, fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: PALETTE.concrete }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {receipts.slice().sort((a, b) => b.paidAt - a.paidAt).map((r) => (
                  <tr key={r.txHash} style={{ borderBottom: `.5px solid ${PALETTE.rule}` }}>
                    <td style={{ padding: '8px 14px', fontFamily: FONTS.mono, fontSize: 12 }}>{r.resource.replace('managed/', '')}</td>
                    <td style={{ padding: '8px 14px', fontSize: 13 }}>{fmtAmount(r.amount)} {r.asset || 'USDC'}</td>
                    <td style={{ padding: '8px 14px', fontSize: 12 }}>
                      <a href={stellarExpertUrl('tx', r.txHash)} target="_blank" rel="noreferrer" style={{ fontFamily: FONTS.mono, color: PALETTE.terracotta, textDecoration: 'underline', textUnderlineOffset: 3 }}>{r.txHash.slice(0, 8)}… ↗</a>
                    </td>
                    <td style={{ padding: '8px 14px', fontSize: 12, color: PALETTE.concrete }}>{new Date(r.paidAt).toISOString().slice(0, 10)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-6 p-4" style={{ border: `1px solid ${PALETTE.verdigris}`, borderRadius: 4, background: 'rgba(74,124,116,.08)' }}>
        <SmallLabel>Pricing (Managed / DPO)</SmallLabel>
        <p className="mt-1 text-[14px]" style={{ color: PALETTE.inkSoft }}>
          Testnet: setup + per attestation in <b>USDC</b>. The final public price is <b>calibrating</b> (gate G1) —
          validating willingness-to-pay before fixing it. Talk to us for a plan.
        </p>
      </div>

      <Rule style={{ margin: '32px 0 20px' }} color={PALETTE.ruleStrong} />

      <SmallLabel style={{ marginBottom: 12 }}>The ladder</SmallLabel>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { n: 'Open Source', p: 'Free SDK + on-chain seal cost', d: 'You run the primitives.' },
          { n: 'Managed', p: 'Setup + per attestation (calibrating)', d: 'We run the pipeline.' },
          { n: 'DPO-aaS', p: 'Retainer + per attestation', d: 'We’re your DPO of record.' },
        ].map((t) => (
          <div key={t.n} className="p-5" style={{ border: `.5px solid ${PALETTE.ruleStrong}`, borderRadius: 4, background: PALETTE.paper2 }}>
            <h3 style={{ fontFamily: FONTS.display, fontSize: 18, fontWeight: 500 }}>{t.n}</h3>
            <div style={{ fontFamily: FONTS.mono, fontSize: 12, color: PALETTE.concrete, marginTop: 6 }}>{t.p}</div>
            <p className="mt-2 text-[13px]" style={{ color: PALETTE.inkSoft }}>{t.d}</p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <Link to="/pricing" style={{ fontFamily: FONTS.body, fontSize: 14, fontWeight: 500, color: PALETTE.ink, textDecoration: 'none', borderBottom: `1px solid ${PALETTE.terracotta}`, paddingBottom: 2 }}>
          Full pricing →
        </Link>
      </div>
    </div>
  );
}
