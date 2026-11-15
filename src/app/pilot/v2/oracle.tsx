import React, { useState } from 'react';
import { FONTS, PALETTE, SmallLabel, Rule } from '@/components/sealed/atoms';
import { truncateHash } from '@/lib/pilot/stellar';

export default function PilotV2Oracle() {
  const [settled, setSettled] = useState(false);
  
  // Dados simulados da Soroban na rede Stellar (obtidos on-chain)
  const tender = {
    id: 'BID-2026-001',
    gov: 'Secretaria de Fazenda (SP)',
    maxPrice: 50000,
    requirements: 'LGPD, ISO27001, Criptografia End-to-End',
    status: settled ? 'SETTLED' : 'AWAITING_BIDS',
    winner: settled ? '0x88F...4A1B (CyberDef)' : null,
  };

  const bids = [
    { id: 'b_001', company: 'TechCorp', cnpj: '11.222.333/0001-44', price: 48000, evidence: 'e3b0c44298fc1c14', valid: true },
    { id: 'b_002', company: 'InovaData', cnpj: '55.666.777/0001-88', price: 42000, evidence: null, valid: false }, // Tentou burlar (sem selo)
    { id: 'b_003', company: 'CyberDef', cnpj: '99.888.777/0001-66', price: 44500, evidence: '8d969eef6ecad3c2', valid: true },
    { id: 'b_004', company: 'AlphaSec', cnpj: '44.333.222/0001-11', price: 51000, evidence: 'a4b5c6d7e8f90011', valid: true }, // Preço acima do teto
  ];

  return (
    <div className="max-w-[900px] mx-auto py-12 px-6">
      <div className="mb-10">
        <SmallLabel style={{ color: PALETTE.terracotta }}>Pilot V2 — Oracle Settlement</SmallLabel>
        <h1 className="text-[32px] md:text-[42px] font-medium" style={{ fontFamily: FONTS.display, letterSpacing: '-0.02em', marginTop: 6 }}>
          Oráculo de Liquidação<span style={{ color: PALETTE.terracotta }}>.</span>
        </h1>
        <p className="mt-4 text-[15px]" style={{ color: PALETTE.inkSoft, fontFamily: FONTS.body, lineHeight: 1.6 }}>
          Visão do Smart Contract (Soroban). Esta tela simula a função <strong><code>settle_winner()</code></strong>: o momento em que 
          a rede cruza as propostas criptográficas, filtra fornecedores atestados pela DPO2U e liquida o prêmio de forma autônoma.
        </p>
      </div>

      {/* Info do Edital */}
      <div className="p-6 mb-8" style={{ border: `1px solid ${PALETTE.ruleStrong}`, borderRadius: 4, background: PALETTE.paper2 }}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="font-mono text-[13px] text-dpo2u-terracotta">{tender.id}</div>
            <h2 className="text-[20px] font-medium mt-1">{tender.gov}</h2>
          </div>
          <div className="text-right">
            <SmallLabel>Teto Orçamentário</SmallLabel>
            <div className="text-[24px] font-mono text-dpo2u-verdigris">{tender.maxPrice.toLocaleString()} USDC</div>
          </div>
        </div>
        <p className="text-[13px] font-mono text-dpo2u-inkSoft">Requisitos: {tender.requirements}</p>
        <p className="text-[13px] font-mono text-dpo2u-inkSoft mt-1">Status Contrato: <strong>{tender.status}</strong></p>
      </div>

      <Rule color={PALETTE.ruleStrong} style={{ margin: '32px 0' }} />

      <SmallLabel style={{ marginBottom: 12 }}>Propostas Submetidas (Bids)</SmallLabel>
      
      {/* Tabela de Lances */}
      <div style={{ border: `1px solid ${PALETTE.rule}`, borderRadius: 4, overflow: 'hidden' }}>
        <table className="w-full" style={{ borderCollapse: 'collapse', fontFamily: FONTS.body }}>
          <thead>
            <tr style={{ background: PALETTE.paper2, borderBottom: `1px solid ${PALETTE.ruleStrong}` }}>
              <th className="text-left" style={{ padding: '12px 16px', fontFamily: FONTS.mono, fontSize: 11, color: PALETTE.concrete, textTransform: 'uppercase' }}>Empresa</th>
              <th className="text-left" style={{ padding: '12px 16px', fontFamily: FONTS.mono, fontSize: 11, color: PALETTE.concrete, textTransform: 'uppercase' }}>Valor Oferta</th>
              <th className="text-left" style={{ padding: '12px 16px', fontFamily: FONTS.mono, fontSize: 11, color: PALETTE.concrete, textTransform: 'uppercase' }}>Selo MCP (ZK-Proof)</th>
              <th className="text-left" style={{ padding: '12px 16px', fontFamily: FONTS.mono, fontSize: 11, color: PALETTE.concrete, textTransform: 'uppercase' }}>Status On-Chain</th>
            </tr>
          </thead>
          <tbody>
            {bids.map(b => {
              const isOverBudget = b.price > tender.maxPrice;
              const hasEvidence = !!b.evidence;
              
              let tagLabel = 'VÁLIDO';
              let tagColor = PALETTE.verdigris;
              
              if (!hasEvidence) {
                tagLabel = 'REJEITADO (Sem Selo)';
                tagColor = PALETTE.terracotta;
              } else if (isOverBudget) {
                tagLabel = 'REJEITADO (Acima Teto)';
                tagColor = PALETTE.terracotta;
              }

              // Highlight da ganhadora se estiver Settled
              const isWinner = settled && b.id === 'b_003';

              return (
                <tr key={b.id} style={{ 
                  borderBottom: `1px solid ${PALETTE.rule}`,
                  background: isWinner ? 'rgba(74,124,116,.08)' : 'transparent' 
                }}>
                  <td style={{ padding: '16px' }}>
                    <div className="font-medium text-[14px]">{b.company}</div>
                    <div className="font-mono text-[11px] text-dpo2u-inkSoft mt-1">{b.cnpj}</div>
                  </td>
                  <td style={{ padding: '16px', fontFamily: FONTS.mono, fontSize: 14 }}>
                    <span style={{ color: isOverBudget ? PALETTE.terracotta : PALETTE.ink }}>{b.price.toLocaleString()} USDC</span>
                  </td>
                  <td style={{ padding: '16px', fontFamily: FONTS.mono, fontSize: 12 }}>
                    {hasEvidence ? (
                      <span className="bg-dpo2u-paper2 px-2 py-1 rounded text-dpo2u-concrete border border-dpo2u-rule">
                        {truncateHash(b.evidence)}
                      </span>
                    ) : (
                      <span className="text-dpo2u-terracotta">None</span>
                    )}
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ 
                      fontFamily: FONTS.mono, fontSize: 10, fontWeight: 600,
                      color: isWinner ? '#fff' : tagColor,
                      background: isWinner ? PALETTE.verdigris : 'transparent',
                      border: `1px solid ${isWinner ? 'transparent' : tagColor}`,
                      padding: '4px 8px', borderRadius: 4 
                    }}>
                      {isWinner ? 'VENCEDOR' : tagLabel}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Ação de Liquidação */}
      <div className="mt-8 flex justify-end">
        {!settled ? (
          <button 
            onClick={() => setSettled(true)}
            className="py-3 px-6 font-mono text-[13px] uppercase tracking-[.14em]"
            style={{ background: PALETTE.ink, color: PALETTE.paper, border: 'none', cursor: 'pointer', borderRadius: 4 }}>
            Executar Liquidação Soroban
          </button>
        ) : (
          <div className="text-right p-4 rounded" style={{ background: PALETTE.paper2, border: `1px solid ${PALETTE.verdigris}` }}>
            <div className="font-mono text-[12px] text-dpo2u-verdigris uppercase tracking-[.14em] mb-2">Transação Confirmada na Rede</div>
            <p className="font-body text-[14px]">
              O Contrato cruzou as propostas. <strong>TechCorp</strong> (48k) perdeu no preço. <strong>InovaData</strong> (42k) tinha o menor preço, 
              mas o contrato abortou porque ela <strong>não possuía o ZK-Proof do motor de Compliance</strong>. <br/><br/>
              A vencedora legítima e atestada foi a <strong>CyberDef (44.500 USDC)</strong>. <br/>
              O prêmio de 44.500 USDC foi depositado e 5.500 USDC retornou aos cofres públicos.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
