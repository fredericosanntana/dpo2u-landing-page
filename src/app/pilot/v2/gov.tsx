import React, { useState } from 'react';
import { FONTS, PALETTE, SmallLabel, Rule } from '@/components/sealed/atoms';

export default function PilotV2Gov() {
  const [tenderId, setTenderId] = useState('');
  const [amount, setAmount] = useState('');
  const [requirements, setRequirements] = useState('LGPD,ISO27001');
  const [created, setCreated] = useState(false);

  return (
    <div className="max-w-[800px] mx-auto py-12 px-6">
      <div className="mb-10">
        <SmallLabel style={{ color: PALETTE.terracotta }}>Pilot V2 — GovTech Escrow</SmallLabel>
        <h1 className="text-[32px] md:text-[42px] font-medium" style={{ fontFamily: FONTS.display, letterSpacing: '-0.02em', marginTop: 6 }}>
          Portal de Licitação<span style={{ color: PALETTE.terracotta }}>.</span>
        </h1>
        <p className="mt-4 text-[15px]" style={{ color: PALETTE.inkSoft, fontFamily: FONTS.body, lineHeight: 1.6 }}>
          Crie um Edital Inteligente na rede Stellar (Soroban). Defina as regras de compliance exigidas 
          e trave o orçamento. A liquidação será autônoma.
        </p>
      </div>

      <div style={{ border: `1px solid ${PALETTE.ruleStrong}`, borderRadius: 4, background: PALETTE.paper, padding: '24px' }}>
        <h2 className="text-[18px] mb-6 font-medium" style={{ fontFamily: FONTS.body }}>Novo Edital On-Chain</h2>
        
        <div className="flex flex-col gap-5">
          <label className="flex flex-col gap-2">
            <SmallLabel>ID do Edital</SmallLabel>
            <input 
              value={tenderId} onChange={(e) => setTenderId(e.target.value)} 
              placeholder="Ex: BID-2026-001"
              className="px-4 py-3" 
              style={{ border: `1px solid ${PALETTE.rule}`, borderRadius: 4, background: PALETTE.paper2, fontFamily: FONTS.mono, fontSize: 13 }} 
            />
          </label>

          <label className="flex flex-col gap-2">
            <SmallLabel>Orçamento (USDC)</SmallLabel>
            <input 
              value={amount} onChange={(e) => setAmount(e.target.value)} 
              placeholder="Ex: 50000"
              className="px-4 py-3" 
              style={{ border: `1px solid ${PALETTE.rule}`, borderRadius: 4, background: PALETTE.paper2, fontFamily: FONTS.mono, fontSize: 13 }} 
            />
          </label>

          <label className="flex flex-col gap-2">
            <SmallLabel>Requisitos de Compliance (Separados por vírgula)</SmallLabel>
            <input 
              value={requirements} onChange={(e) => setRequirements(e.target.value)} 
              placeholder="LGPD, ISO27001, CCPA"
              className="px-4 py-3" 
              style={{ border: `1px solid ${PALETTE.rule}`, borderRadius: 4, background: PALETTE.paper2, fontFamily: FONTS.mono, fontSize: 13 }} 
            />
          </label>

          <button 
            onClick={() => {
              if(!tenderId || !amount) return alert('Preencha os campos');
              alert(`Edital ${tenderId} criado! Fundo de ${amount} USDC travado no Smart Contract Soroban.`);
              setCreated(true);
            }}
            className="mt-4 py-3 px-6 font-mono text-[12px] uppercase tracking-[.14em] text-center"
            style={{ background: PALETTE.ink, color: PALETTE.paper, border: 'none', cursor: 'pointer', borderRadius: 4 }}>
            Travar Fundos e Lançar Edital
          </button>
        </div>
      </div>

      {created && (
        <div className="mt-8 p-6" style={{ background: 'rgba(74,124,116,.1)', borderRadius: 4, border: `1px solid ${PALETTE.verdigris}` }}>
          <SmallLabel style={{ color: PALETTE.verdigris }}>Status: AWAITING_BIDS</SmallLabel>
          <p className="mt-2 text-[14px]" style={{ fontFamily: FONTS.body, color: PALETTE.ink }}>
            O contrato Escrow <strong>{tenderId}</strong> está no ar. Os fornecedores já podem acessar a visão de Empresas para submeterem propostas. 
            Elas serão bloqueadas pela rede Stellar se não possuírem o Selo de Compliance DPO2U (Atestação ZK-Proof).
          </p>
          <div className="mt-4">
            <a href="/pilot/v2/supplier" className="underline font-mono text-[12px]" style={{ color: PALETTE.verdigris }}>
              Simular visão do Fornecedor ↗
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
