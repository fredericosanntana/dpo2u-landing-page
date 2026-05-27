// /pilot/contract — on-chain contract metadata / coordinates.
// Editorial Sealed pattern aligned 2026-05-14.

import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PilotNav } from '@/components/pilot/PilotNav';
import { ContractMetaCard } from '@/components/pilot/ContractMetaCard';
import { SmallLabel, Rule, FONTS, PALETTE } from '@/components/sealed/atoms';
import { DEFAULT_CONTRACT, contractById, type ContractMeta } from '@/lib/pilot/contracts';

export default function PilotContractPage() {
  const params = useParams<{ contract_id?: string }>();
  const contract: ContractMeta =
    (params.contract_id && contractById(params.contract_id)) || DEFAULT_CONTRACT;

  useEffect(() => {
    document.title = `Contrato ${contract.network} | DPO2U Piloto`;
  }, [contract.network]);

  return (
    <main style={{ background: PALETTE.paper, minHeight: '100vh', paddingBottom: 96 }}>
      <PilotNav />

      {/* Header */}
      <section className="px-6 lg:px-14 pt-[56px] pb-[40px]">
        <div className="mx-auto max-w-[920px]">
          <SmallLabel style={{ marginBottom: 16 }}>
            § Cadastro / coordenadas on-chain
          </SmallLabel>
          <h1
            style={{
              fontFamily: FONTS.display,
              fontWeight: 500,
              lineHeight: 0.96,
              letterSpacing: '-.028em',
              margin: 0,
              color: PALETTE.ink,
            }}
            className="text-[40px] sm:text-[56px] lg:text-[72px]"
          >
            Detalhes do <span style={{ fontStyle: 'italic' }}>contrato</span>
            <span style={{ color: PALETTE.terracotta }}>.</span>
          </h1>
          <p
            style={{
              fontFamily: FONTS.body,
              fontSize: 17,
              lineHeight: 1.6,
              marginTop: 24,
              maxWidth: 640,
              color: PALETTE.inkSoft,
            }}
          >
            Tudo que um auditor precisa pra verificar independentemente o piloto: contract id, WASM hash,
            network passphrase, RPC URL, admin pubkey e timestamp do deploy. JSON do SDK config pronto pra
            copiar.
          </p>
        </div>
      </section>

      <Rule />

      {/* Contract meta — fica como ContractMetaCard mas dentro de section editorial */}
      <section className="px-6 lg:px-14 py-12">
        <div className="mx-auto max-w-[1200px]">
          <ContractMetaCard contract={contract} />

          {/* Next steps — sem cards, sem hover transitions Tailwind. SmallLabel + display + body. */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-10 sm:gap-14">
            <NextStepBlock
              tag="Próximo passo"
              title="Verificar uma atestação"
              body="Cole o hash que o operador municipal te forneceu e veja o veredito on-chain."
              to="/pilot/verify"
            />
            <NextStepBlock
              tag="Ver atividade"
              title="Dashboard de atestações"
              body="Lista live de todas as atestações registradas, com distribuição de verdicts."
              to="/pilot/dashboard"
            />
          </div>
        </div>
      </section>
    </main>
  );
}

interface NextStepProps {
  readonly tag: string;
  readonly title: string;
  readonly body: string;
  readonly to: string;
}

function NextStepBlock({ tag, title, body, to }: NextStepProps) {
  return (
    <Link
      to={to}
      style={{
        textDecoration: 'none',
        color: PALETTE.ink,
        display: 'block',
        borderTop: `1px solid ${PALETTE.ink}`,
        paddingTop: 18,
      }}
    >
      <SmallLabel style={{ marginBottom: 8, color: PALETTE.terracotta }}>{tag}</SmallLabel>
      <h3
        style={{
          fontFamily: FONTS.display,
          fontSize: 28,
          lineHeight: 1.05,
          letterSpacing: '-.018em',
          margin: '0 0 12px 0',
          color: PALETTE.ink,
        }}
      >
        {title} →
      </h3>
      <p
        style={{
          fontFamily: FONTS.body,
          fontSize: 14.5,
          lineHeight: 1.55,
          color: PALETTE.inkSoft,
          margin: 0,
        }}
      >
        {body}
      </p>
    </Link>
  );
}
