/**
 * /app/escrow — B2B Escrow Management.
 * Mostra fundos travados em Smart Contracts Condicionais baseados em Compliance.
 */
import React, { useState } from 'react';
import { FONTS, PALETTE, SmallLabel, Rule } from '@/components/sealed/atoms';
import { useWalletAuth } from '@/components/app/WalletAuthProvider';
import { truncateHash } from '@/lib/solana';

export default function AppEscrow() {
  const { pubkey, workspace } = useWalletAuth();

  // Mock data — estado de exemplo dos contratos de escrow condicional (Solana).
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
    }
  ]);

  const tvl = escrows
    .filter(e => e.status === 'LOCKED')
    .reduce((acc, e) => acc + parseFloat(e.amount), 0);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  };

  return (
    <div className="max-w-[900px]">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <SmallLabel>B2B Finance</SmallLabel>
          <h1 className="text-[30px] md:text-[38px] font-medium" style={{ fontFamily: FONTS.display, letterSpacing: '-0.02em', marginTop: 6 }}>
            Compliance Escrow<span style={{ color: PALETTE.terracotta }}>.</span>
          </h1>
        </div>
        <div className="flex gap-2">
          <button type="button" 
            onClick={() => alert('Payment Link Generated: https://pay.dpo2u.com/escrow/test-123\n\nEnvie este link para seu cliente.')}
            className="py-2.5 px-5 font-mono text-[12px] uppercase tracking-[.14em]"
            style={{ background: PALETTE.ink, color: PALETTE.paper, border: 'none', cursor: 'pointer' }}>
            Generate Payment Link
          </button>
        </div>
      </div>

      <p className="mt-2 text-[14px]" style={{ color: PALETTE.inkSoft }}>
        {workspace.label} · Fundos travados em Smart Contracts na rede Solana.
        A liberação ocorre automaticamente quando o Motor MCP atesta conformidade.
      </p>

      <Rule style={{ margin: '28px 0' }} color={PALETTE.ruleStrong} />

      {/* TVL Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3" style={{ borderTop: `.5px solid ${PALETTE.ruleStrong}`, borderBottom: `.5px solid ${PALETTE.ruleStrong}` }}>
        <div style={{ padding: '18px 16px', borderRight: `.5px solid ${PALETTE.rule}` }}>
          <div style={{ fontFamily: FONTS.display, fontWeight: 500, fontSize: 28 }}>{formatCurrency(tvl)}</div>
          <SmallLabel style={{ marginTop: 6, color: PALETTE.terracotta }}>Total Value Locked (TVL)</SmallLabel>
        </div>
        <div style={{ padding: '18px 16px', borderRight: `.5px solid ${PALETTE.rule}` }}>
          <div style={{ fontFamily: FONTS.display, fontWeight: 500, fontSize: 28 }}>{escrows.filter(e => e.status === 'LOCKED').length}</div>
          <SmallLabel style={{ marginTop: 6 }}>Active Contracts</SmallLabel>
        </div>
        <div style={{ padding: '18px 16px' }}>
          <div style={{ fontFamily: FONTS.display, fontWeight: 500, fontSize: 28, color: PALETTE.verdigris }}>
            {formatCurrency(escrows.filter(e => e.status === 'RELEASED').reduce((acc, e) => acc + parseFloat(e.amount), 0))}
          </div>
          <SmallLabel style={{ marginTop: 6 }}>Total Released</SmallLabel>
        </div>
      </div>

      {/* Escrow List */}
      <div className="mt-8">
        <SmallLabel style={{ marginBottom: 12 }}>Contratos de Liquidação Condicional</SmallLabel>
        
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
                      padding: '4px 8px', borderRadius: 4
                    }}>
                      {e.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px' }}>
                    {e.status === 'LOCKED' ? (
                      <button 
                        onClick={() => {
                          setEscrows(prev => prev.map(escrow => 
                            escrow.id === e.id 
                              ? { ...escrow, status: 'RELEASED', releasedAt: Date.now(), txHash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8' } 
                              : escrow
                          ));
                          alert(`Motor MCP ativou o pipeline para ${e.funder}.\nVeredito: PASS. Fundo de ${e.amount} liberado para a sua carteira.`);
                        }}
                        className="py-1.5 px-3 font-mono text-[11px] uppercase tracking-[.12em]"
                        style={{ background: PALETTE.ink, color: PALETTE.paper, border: 'none', cursor: 'pointer' }}>
                        Run Compliance
                      </button>
                    ) : (
                      <a href="#" style={{ fontFamily: FONTS.mono, fontSize: 11, color: PALETTE.concrete, textDecoration: 'underline' }}>
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
