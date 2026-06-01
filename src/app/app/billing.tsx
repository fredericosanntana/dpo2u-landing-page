/**
 * /app/billing — uso REAL (Fase E). Puxa o ledger do gateway (GET /managed/usage)
 * filtrado pela pubkey: setup fee + per-attestation em USDC (Solana), com links de tx.
 * Preço final do tier Managed/DPO segue "em calibração" (gate G1).
 */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FONTS, PALETTE, SmallLabel, Rule } from '@/components/sealed/atoms';
import { useWalletAuth } from '@/components/app/WalletAuthProvider';
import { getUsage, type ManagedUsage, type ManagedReceipt } from '@/lib/app/managed-client';
import { githubStatus, rechargeCredits } from '@/lib/app/github-client';
import { explorerUrl as solExplorerUrl } from '@/lib/solana';

// O ledger grava amount em DECIMAL (ex.: "2", "0.1") — NÃO atômico.
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
    void getUsage(pubkey, 'solana').then((u) => { if (alive) { setUsage(u); setLoading(false); } });
    void githubStatus(pubkey).then((s) => { if (alive) setGithubCredits(s?.credits ?? null); });
    return () => { alive = false; };
  }, [pubkey, rechargeMsg]);

  // Recarrega créditos de CI. O pagamento na Solana é via gateway (USDC SPL), server-side.
  const onRecharge = async () => {
    if (!pubkey) { setRechargeMsg('Conecte a wallet.'); return; }
    setRechargeBusy(true); setRechargeMsg(null);
    try {
      const r = await rechargeCredits(pubkey);
      if (r.kind === 'payment_required') { setRechargeMsg('Recarga via gateway Solana (USDC SPL) em calibração no devnet.'); return; }
      if (r.kind === 'error') { setRechargeMsg(`Falha na recarga: ${r.message}`); return; }
      setRechargeMsg(`✓ +${r.added} créditos · saldo ${r.balance}.`);
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
        A atestação é a unidade de cobrança. Plano atual: <b>{tier.label}</b>. (Solana devnet)
      </p>
      <div className="mt-4 p-4" style={{ border: `1px solid ${PALETTE.ruleStrong}`, borderRadius: 4, background: PALETTE.paper2 }}>
        <SmallLabel>Pagamento na Solana</SmallLabel>
        <p className="mt-1 text-[14px]" style={{ color: PALETTE.inkSoft }}>
          O pagamento é via <b>payment-gateway</b> (Invoice on-chain em USDC SPL), resolvido server-side —
          e está <b>em calibração no devnet</b> por ora.
        </p>
      </div>

      {/* Usage real (ledger x402) + créditos de CI (GitHub App) */}
      <div className="mt-8 grid grid-cols-2 lg:grid-cols-4" style={{ borderTop: `.5px solid ${PALETTE.ruleStrong}`, borderBottom: `.5px solid ${PALETTE.ruleStrong}` }}>
        {[
          [String(receipts.length), 'pagamentos'],
          [`${totalAmt} USDC`, 'total pago (devnet)'],
          [String(pipelines), 'pipelines'],
          [githubCredits === null ? '—' : String(githubCredits), 'créditos CI (GitHub)'],
        ].map(([n, l], i) => (
          <div key={l} style={{ padding: '18px 16px', borderRight: i < 3 ? `.5px solid ${PALETTE.rule}` : 'none' }}>
            <div style={{ fontFamily: FONTS.display, fontWeight: 500, fontSize: 26 }}>{n}</div>
            <SmallLabel style={{ marginTop: 6 }}>{l}</SmallLabel>
          </div>
        ))}
      </div>

      {/* Recarga de créditos de CI (GitHub App) — pagamento via gateway Solana (USDC SPL). */}
      <div className="mt-4 flex items-center gap-3 flex-wrap">
        <button type="button" disabled={!pubkey || rechargeBusy} onClick={() => void onRecharge()}
          className="py-2.5 px-5 font-mono text-[12px] uppercase tracking-[.14em]"
          style={{ background: pubkey && !rechargeBusy ? PALETTE.ink : PALETTE.ruleStrong, color: PALETTE.paper, border: 'none', cursor: pubkey && !rechargeBusy ? 'pointer' : 'not-allowed' }}>
          {rechargeBusy ? 'Recarregando…' : 'Recarregar créditos CI →'}
        </button>
        <span className="text-[12px]" style={{ color: PALETTE.concrete }}>
          1 pacote = 10 créditos · 1 crédito por Check Run · saldo <b>vinculado à wallet {pubkey ? `${pubkey.slice(0, 4)}…${pubkey.slice(-4)}` : '—'}</b>.
        </span>
      </div>
      {rechargeMsg && (
        <p className="mt-2 text-[13px]" style={{ fontFamily: FONTS.mono, color: rechargeMsg.startsWith('✓') ? PALETTE.verdigris : PALETTE.terracotta }}>{rechargeMsg}</p>
      )}

      {/* Recibos */}
      <div className="mt-6">
        <SmallLabel style={{ marginBottom: 10 }}>Recibos</SmallLabel>
        {loading ? (
          <p className="text-[13px]" style={{ color: PALETTE.concrete }}>Carregando uso…</p>
        ) : receipts.length === 0 ? (
          <p className="text-[14px]" style={{ color: PALETTE.inkSoft }}>
            Nenhum pagamento ainda. <Link to="/app/activate" style={{ color: PALETTE.terracotta }}>Ative um pipeline →</Link>
          </p>
        ) : (
          <div style={{ border: `.5px solid ${PALETTE.rule}`, borderRadius: 4, overflow: 'hidden' }}>
            <table className="w-full" style={{ borderCollapse: 'collapse', fontFamily: FONTS.body }}>
              <thead>
                <tr style={{ background: PALETTE.paper2, borderBottom: `.5px solid ${PALETTE.ruleStrong}` }}>
                  {['Recurso', 'Valor', 'Tx', 'Data'].map((h) => (
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
                      <a href={solExplorerUrl(r.txHash, 'tx')} target="_blank" rel="noreferrer" style={{ fontFamily: FONTS.mono, color: PALETTE.terracotta, textDecoration: 'underline', textUnderlineOffset: 3 }}>{r.txHash.slice(0, 8)}… ↗</a>
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
        <SmallLabel>Preço (Managed / DPO)</SmallLabel>
        <p className="mt-1 text-[14px]" style={{ color: PALETTE.inkSoft }}>
          Devnet: setup + por atestação em <b>USDC</b>. O preço público final está <b>em calibração</b> (gate G1) —
          validando disposição-a-pagar antes de fixar. Fale conosco para um plano.
        </p>
      </div>

      <Rule style={{ margin: '32px 0 20px' }} color={PALETTE.ruleStrong} />

      <SmallLabel style={{ marginBottom: 12 }}>The ladder</SmallLabel>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { n: 'Open Source', p: 'Free SDK + custo de selo on-chain', d: 'You run the primitives.' },
          { n: 'Managed', p: 'Setup + por atestação (em calibração)', d: 'We run the pipeline.' },
          { n: 'DPO-aaS', p: 'Retainer + por atestação', d: 'We’re your DPO of record.' },
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
