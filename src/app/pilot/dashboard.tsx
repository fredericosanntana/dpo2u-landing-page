import { useEffect } from 'react';
import { PilotNav } from '@/components/pilot/PilotNav';
import { DashboardStats } from '@/components/pilot/DashboardStats';
import { VerdictDistributionChart } from '@/components/pilot/VerdictDistributionChart';
import { RecentAttestationsList } from '@/components/pilot/RecentAttestationsList';
import { useIndexerStore } from '@/lib/pilot/indexer-store';
import { DEFAULT_CONTRACT, truncateContract, stellarExpertUrl } from '@/lib/pilot/stellar';

export default function PilotDashboardPage() {
  const startPolling = useIndexerStore((s) => s.startPolling);
  const stopPolling = useIndexerStore((s) => s.stopPolling);

  useEffect(() => {
    document.title = 'Dashboard | DPO2U Piloto Anticorrupção';
    startPolling(30_000);
    return () => stopPolling();
  }, [startPolling, stopPolling]);

  return (
    <main className="bg-dpo2u-ivory min-h-screen pb-24">
      <PilotNav />

      <header className="border-b border-dpo2u-ink/10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-14">
          <p className="font-mono text-xs uppercase tracking-widest text-dpo2u-ink/60">
            Atividade on-chain · público
          </p>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl text-dpo2u-ink leading-tight">
            Dashboard do contrato
          </h1>
          <p className="mt-4 max-w-2xl text-dpo2u-ink/70 font-body text-lg">
            Estado público do contrato {' '}
            <a
              href={stellarExpertUrl('contract', DEFAULT_CONTRACT.id)}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-base text-dpo2u-indigo hover:underline"
            >
              {truncateContract(DEFAULT_CONTRACT.id)}
            </a>{' '}
            indexado em tempo real via Horizon REST. Sem backend DPO2U envolvido — o navegador faz a consulta
            direto à rede pública.
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-10 space-y-8">
        <DashboardStats />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <VerdictDistributionChart />
          <div className="rounded-xl border border-dpo2u-ink/10 bg-white p-6">
            <p className="text-xs font-mono uppercase tracking-wider text-dpo2u-ink/60 mb-3">
              Como esse dashboard funciona
            </p>
            <ol className="space-y-3 text-sm text-dpo2u-ink/80 font-body">
              <li>
                <strong>1. Polling.</strong> O navegador consulta Horizon{' '}
                <code className="font-mono text-xs bg-dpo2u-ink/5 px-1 rounded">/contracts/&lt;id&gt;/operations</code>{' '}
                a cada 30 s.
              </li>
              <li>
                <strong>2. Parsing.</strong> Para cada operação invokeHostFunction, extraímos os eventos Soroban
                com topic <code className="font-mono text-xs bg-dpo2u-ink/5 px-1 rounded">attest</code>.
              </li>
              <li>
                <strong>3. Decode.</strong> O <code className="font-mono text-xs bg-dpo2u-ink/5 px-1 rounded">decodeAttestationRecord</code>{' '}
                do <code className="font-mono text-xs bg-dpo2u-ink/5 px-1 rounded">@dpo2u/stellar-sdk</code>{' '}
                converte ScVal → JS.
              </li>
              <li>
                <strong>4. Cache.</strong> Os últimos 200 eventos ficam em <code className="font-mono text-xs bg-dpo2u-ink/5 px-1 rounded">localStorage</code>{' '}
                pra hidratação rápida.
              </li>
              <li>
                <strong>5. Reprodutível.</strong> Qualquer auditor pode copiar o cURL acima e rodar
                independentemente — código deste dashboard é open source.
              </li>
            </ol>
          </div>
        </div>

        <RecentAttestationsList />
      </section>
    </main>
  );
}
