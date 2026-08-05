/**
 * /app/escrow — B2B compliance escrow (PREVIEW).
 * Conditional smart-contract payments on Stellar/Soroban that release when the MCP
 * engine attests compliance. This screen runs on SAMPLE data — clearly flagged
 * Experimental — until the on-chain escrow program is wired.
 */
import React, { useState } from 'react';
import { FONTS, PALETTE, SmallLabel, Rule } from '@/components/sealed/atoms';
import { Badge, Banner, AppButton, btnClass, toast } from '@/components/app/ui';
import { useWalletAuth } from '@/components/app/WalletAuthProvider';
import { truncateHash } from '@/lib/pilot/stellar';

export default function AppEscrow() {
  const { workspace } = useWalletAuth();

  // Sample data — illustrative conditional escrow contracts (Stellar/Soroban).
  const [escrows, setEscrows] = useState([
    {
      id: 'escrow_1A2b3C',
      funder: 'Fintech Partner S.A.',
      funderId: 'CNPJ: 12.345.678/0001-99',
      amount: '5000.00 USDC',
      condition: 'Pass LGPD (BR)',
      status: 'LOCKED', // LOCKED, RELEASED, REFUNDED
      createdAt: Date.now() - 86400000 * 2,
    },
    {
      id: 'escrow_9X8y7Z',
      funder: 'Global Enterprise LLC',
      funderId: 'VAT: GB123456789',
      amount: '12500.00 USDC',
      condition: 'Pass GDPR (EU)',
      status: 'RELEASED',
      createdAt: Date.now() - 86400000 * 15,
      releasedAt: Date.now() - 86400000 * 14,
      txHash: 'a1b2c3d4e5f6g7h8i9j0',
    },
  ]);

  const tvl = escrows.filter((e) => e.status === 'LOCKED').reduce((acc, e) => acc + parseFloat(e.amount), 0);
  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  const onGenerateLink = () => {
    toast.info('Preview only — payment links activate when the on-chain escrow program ships.');
  };

  const onRunCompliance = (id: string, funder: string, amount: string) => {
    setEscrows((prev) => prev.map((e) =>
      e.id === id
        ? { ...e, status: 'RELEASED', releasedAt: Date.now(), txHash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8' }
        : e,
    ));
    toast.success(`Preview: MCP engine ran for ${funder} — verdict PASS, ${amount} released.`);
  };

  return (
    <div className="max-w-[900px]">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-3">
            <SmallLabel>B2B Finance</SmallLabel>
            <Badge tone="experimental">Experimental</Badge>
          </div>
          <h1 className="text-[30px] md:text-[38px] font-medium" style={{ fontFamily: FONTS.display, letterSpacing: '-0.02em', marginTop: 6 }}>
            Compliance Escrow<span style={{ color: PALETTE.terracotta }}>.</span>
          </h1>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={onGenerateLink} className={btnClass('ink')}>Generate payment link</button>
        </div>
      </div>

      <p className="mt-2 text-[14px]" style={{ color: PALETTE.inkSoft }}>
        {workspace.label} · Funds locked in smart contracts on Stellar.
        Release happens automatically when the MCP engine attests compliance.
      </p>

      <div className="mt-4">
        <Banner tone="info">
          Preview with sample data. The on-chain escrow program isn't live yet — actions here don't move real funds.
        </Banner>
      </div>

      <Rule style={{ margin: '28px 0' }} color={PALETTE.ruleStrong} />

      {/* TVL Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3" style={{ borderTop: `.5px solid ${PALETTE.ruleStrong}`, borderBottom: `.5px solid ${PALETTE.ruleStrong}` }}>
        <div style={{ padding: '18px 16px', borderRight: `.5px solid ${PALETTE.rule}` }}>
          <div style={{ fontFamily: FONTS.display, fontWeight: 500, fontSize: 28 }}>{formatCurrency(tvl)}</div>
          <SmallLabel style={{ marginTop: 6, color: PALETTE.terracotta }}>Total Value Locked (TVL)</SmallLabel>
        </div>
        <div style={{ padding: '18px 16px', borderRight: `.5px solid ${PALETTE.rule}` }}>
          <div style={{ fontFamily: FONTS.display, fontWeight: 500, fontSize: 28 }}>{escrows.filter((e) => e.status === 'LOCKED').length}</div>
          <SmallLabel style={{ marginTop: 6 }}>Active Contracts</SmallLabel>
        </div>
        <div style={{ padding: '18px 16px' }}>
          <div style={{ fontFamily: FONTS.display, fontWeight: 500, fontSize: 28, color: PALETTE.verdigris }}>
            {formatCurrency(escrows.filter((e) => e.status === 'RELEASED').reduce((acc, e) => acc + parseFloat(e.amount), 0))}
          </div>
          <SmallLabel style={{ marginTop: 6 }}>Total Released</SmallLabel>
        </div>
      </div>

      {/* Escrow List */}
      <div className="mt-8">
        <SmallLabel style={{ marginBottom: 12 }}>Conditional settlement contracts</SmallLabel>

        <div style={{ border: `.5px solid ${PALETTE.rule}`, borderRadius: 4, overflow: 'hidden' }}>
          <table className="w-full" style={{ borderCollapse: 'collapse', fontFamily: FONTS.body }}>
            <thead>
              <tr style={{ background: PALETTE.paper2, borderBottom: `.5px solid ${PALETTE.ruleStrong}` }}>
                {['Funder', 'Amount', 'Condition', 'Status', 'Action'].map((h) => (
                  <th key={h} className="text-left" style={{ padding: '10px 14px', fontFamily: FONTS.mono, fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: PALETTE.concrete }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {escrows.map((e) => (
                <tr key={e.id} style={{ borderBottom: `.5px solid ${PALETTE.rule}` }}>
                  <td style={{ padding: '14px', fontSize: 13 }}>
                    <div style={{ fontWeight: 500 }}>{e.funder}</div>
                    <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: PALETTE.concrete, marginTop: 2 }}>{e.funderId}</div>
                  </td>
                  <td style={{ padding: '14px', fontFamily: FONTS.mono, fontSize: 13, fontWeight: 600 }}>{e.amount}</td>
                  <td style={{ padding: '14px', fontFamily: FONTS.mono, fontSize: 12, color: PALETTE.inkSoft }}>{e.condition}</td>
                  <td style={{ padding: '14px' }}>
                    <span style={{
                      fontFamily: FONTS.mono, fontSize: 11, fontWeight: 600,
                      color: e.status === 'LOCKED' ? PALETTE.terracotta : e.status === 'RELEASED' ? PALETTE.verdigris : PALETTE.concrete,
                      background: e.status === 'LOCKED' ? 'rgba(193,84,57,.1)' : e.status === 'RELEASED' ? 'rgba(74,124,116,.1)' : 'rgba(0,0,0,0.05)',
                      padding: '4px 8px', borderRadius: 4,
                    }}>
                      {e.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px' }}>
                    {e.status === 'LOCKED' ? (
                      <AppButton size="sm" onClick={() => onRunCompliance(e.id, e.funder, e.amount)}>Run compliance</AppButton>
                    ) : (
                      <a href={e.txHash ? `https://stellar.expert/explorer/testnet/tx/${e.txHash}` : '#'} target="_blank" rel="noreferrer"
                        style={{ fontFamily: FONTS.mono, fontSize: 11, color: PALETTE.concrete, textDecoration: 'underline' }}>
                        tx: {truncateHash(e.txHash ?? '')} ↗
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
