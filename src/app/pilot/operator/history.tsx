import { useEffect } from 'react';
import { PilotNav } from '@/components/pilot/PilotNav';
import { OperatorTopBar } from '@/components/pilot/operator/OperatorTopBar';
import { RequireApiKey } from '@/components/pilot/operator/RequireApiKey';
import { SubmissionHistoryTable } from '@/components/pilot/operator/SubmissionHistoryTable';

export default function PilotOperatorHistory() {
  useEffect(() => {
    document.title = 'Histórico | DPO2U Piloto operador';
  }, []);
  return (
    <RequireApiKey>
      <main className="bg-dpo2u-ivory min-h-screen pb-24">
        <PilotNav />
        <OperatorTopBar />
        <header className="border-b border-dpo2u-ink/10">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
            <h1 className="font-display text-4xl text-dpo2u-ink leading-tight">Histórico</h1>
            <p className="mt-3 text-dpo2u-ink/70 font-body">
              Lista das atestações registradas no contrato (fonte: indexer client-side via Horizon, polling 20 s).
            </p>
          </div>
        </header>
        <section className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
          <SubmissionHistoryTable />
        </section>
      </main>
    </RequireApiKey>
  );
}
