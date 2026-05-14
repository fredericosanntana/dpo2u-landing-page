import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PilotNav } from '@/components/pilot/PilotNav';
import { ContractMetaCard } from '@/components/pilot/ContractMetaCard';
import { DEFAULT_CONTRACT, contractById, type ContractMeta } from '@/lib/pilot/contracts';

export default function PilotContractPage() {
  const params = useParams<{ contract_id?: string }>();
  const contract: ContractMeta = (params.contract_id && contractById(params.contract_id)) || DEFAULT_CONTRACT;

  useEffect(() => {
    document.title = `Contrato ${contract.network} | DPO2U Piloto`;
  }, [contract.network]);

  return (
    <main className="bg-dpo2u-ivory min-h-screen pb-24">
      <PilotNav />

      <header className="border-b border-dpo2u-ink/10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-14">
          <p className="font-mono text-xs uppercase tracking-widest text-dpo2u-ink/60">
            Cadastro / coordenadas on-chain
          </p>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl text-dpo2u-ink leading-tight">
            Detalhes do contrato
          </h1>
          <p className="mt-4 max-w-2xl text-dpo2u-ink/70 font-body text-lg">
            Tudo que um auditor precisa pra verificar independentemente o piloto: contract id, WASM hash,
            network passphrase, RPC URL, admin pubkey e timestamp do deploy. JSON do SDK config pronto pra
            copiar.
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
        <ContractMetaCard contract={contract} />

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <a
            href="/pilot/verify"
            className="rounded-xl border border-dpo2u-ink/10 bg-white p-5 hover:border-dpo2u-indigo/40 transition-colors"
          >
            <p className="text-xs font-mono uppercase tracking-wider text-dpo2u-ink/60">Próximo passo</p>
            <p className="mt-2 font-display text-xl text-dpo2u-ink">Verificar uma atestação →</p>
            <p className="mt-1 text-sm text-dpo2u-ink/60 font-body">
              Cole o hash que o operador municipal te forneceu e veja o veredito on-chain.
            </p>
          </a>
          <a
            href="/pilot/dashboard"
            className="rounded-xl border border-dpo2u-ink/10 bg-white p-5 hover:border-dpo2u-indigo/40 transition-colors"
          >
            <p className="text-xs font-mono uppercase tracking-wider text-dpo2u-ink/60">Ver atividade</p>
            <p className="mt-2 font-display text-xl text-dpo2u-ink">Dashboard de atestações →</p>
            <p className="mt-1 text-sm text-dpo2u-ink/60 font-body">
              Lista live de todas as atestações registradas, com distribuição de verdicts.
            </p>
          </a>
        </div>
      </section>
    </main>
  );
}
