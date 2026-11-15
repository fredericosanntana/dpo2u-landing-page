import React from 'react';
import { FONTS, PALETTE, SmallLabel } from '@/components/sealed/atoms';

export default function PilotV2Supplier() {
  return (
    <div className="max-w-[800px] mx-auto py-12 px-6">
      <SmallLabel style={{ color: PALETTE.terracotta }}>Pilot V2 — GovTech Escrow</SmallLabel>
      <h1 className="text-[32px] md:text-[42px] font-medium" style={{ fontFamily: FONTS.display, letterSpacing: '-0.02em', marginTop: 6 }}>
        Visão do Fornecedor<span style={{ color: PALETTE.terracotta }}>.</span>
      </h1>
      <p className="mt-4 text-[15px]" style={{ color: PALETTE.inkSoft, fontFamily: FONTS.body, lineHeight: 1.6 }}>
        Esta tela permitirá à empresa rodar o Compliance da DPO2U (motor MCP) e submeter o preço 
        junto com a ZK-Proof Hash de atestação gerada na etapa de compliance.
      </p>
      <div className="mt-10 p-6 text-center" style={{ border: `1px dashed ${PALETTE.ruleStrong}`, borderRadius: 4 }}>
        <p style={{ fontFamily: FONTS.mono, fontSize: 13, color: PALETTE.concrete }}>[ Em Desenvolvimento para a Próxima Fase da Demo ]</p>
      </div>
    </div>
  );
}
