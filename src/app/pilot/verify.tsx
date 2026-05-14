import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PilotNav } from '@/components/pilot/PilotNav';
import { VerifyForm } from '@/components/pilot/VerifyForm';
import { DEFAULT_CONTRACT, truncateContract, stellarExpertUrl } from '@/lib/pilot/stellar';

export default function PilotVerifyPage() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    document.title = 'Verificar atestação | DPO2U Piloto Anticorrupção';
  }, []);

  // Future: support deep-link queries `?uc=bank_chg&hash=…` for citations.
  const _qpUseCase = searchParams.get('uc');
  const _qpHash = searchParams.get('hash');

  return (
    <main className="bg-dpo2u-ivory min-h-screen pb-24">
      <PilotNav />

      <header className="border-b border-dpo2u-ink/10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
          <p className="font-mono text-xs uppercase tracking-widest text-dpo2u-ink/60">
            Verificação trustless · P4 / P5 personas
          </p>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl text-dpo2u-ink leading-tight">
            Verifique uma atestação on-chain
          </h1>
          <p className="mt-4 max-w-2xl text-dpo2u-ink/70 font-body text-lg">
            Cole o <strong>use_case_id</strong> e o <strong>evidence_hash</strong> que o operador municipal te
            forneceu. A consulta vai direto à blockchain Stellar testnet — nenhuma credencial DPO2U, nenhum
            servidor intermediário, nenhum fee.
          </p>
          <p className="mt-2 max-w-2xl text-sm text-dpo2u-ink/60 font-body">
            Esta é a <em>propriedade trustless</em> que diferencia compliance-as-protocol de compliance-as-PDF:
            qualquer auditor, jornalista ou cidadão pode confirmar a decisão sem precisar pedir nada ao
            município ou à DPO2U.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
        <div className="bg-white rounded-2xl border border-dpo2u-ink/10 p-6 sm:p-10 shadow-sm">
          <VerifyForm />
        </div>

        <aside className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-body text-dpo2u-ink/70">
          <div className="rounded-lg border border-dpo2u-ink/10 bg-white p-4">
            <p className="text-xs font-mono uppercase tracking-wider text-dpo2u-ink/60">Contrato consultado</p>
            <p className="mt-1.5 font-mono text-xs text-dpo2u-ink break-all">{truncateContract(DEFAULT_CONTRACT.id)}</p>
            <a
              href={stellarExpertUrl('contract', DEFAULT_CONTRACT.id)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-xs text-dpo2u-indigo hover:underline"
            >
              Ver no Stellar Expert →
            </a>
          </div>
          <div className="rounded-lg border border-dpo2u-ink/10 bg-white p-4">
            <p className="text-xs font-mono uppercase tracking-wider text-dpo2u-ink/60">Network</p>
            <p className="mt-1.5 text-dpo2u-ink">{DEFAULT_CONTRACT.network_passphrase}</p>
            <p className="mt-2 text-xs text-dpo2u-ink/60">
              Testnet ainda — mainnet liga em Sprint L (M7 do Stellar37°).
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
