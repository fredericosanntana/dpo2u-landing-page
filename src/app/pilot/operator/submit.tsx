import { useEffect } from 'react';
import { PilotNav } from '@/components/pilot/PilotNav';
import { OperatorTopBar } from '@/components/pilot/operator/OperatorTopBar';
import { RequireApiKey } from '@/components/pilot/operator/RequireApiKey';
import { SubmitAttestationForm } from '@/components/pilot/operator/SubmitAttestationForm';

export default function PilotOperatorSubmit() {
  useEffect(() => {
    document.title = 'Submeter atestação | DPO2U Piloto';
  }, []);
  return (
    <RequireApiKey>
      <main className="bg-dpo2u-ivory min-h-screen pb-24">
        <PilotNav />
        <OperatorTopBar />
        <header className="border-b border-dpo2u-ink/10">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
            <h1 className="font-display text-4xl text-dpo2u-ink leading-tight">Submeter atestação</h1>
            <p className="mt-3 text-dpo2u-ink/70 font-body">
              O servidor calcula o hash da evidência, roda o predicate engine, e registra o veredito on-chain.
              Veja o tx hash logo abaixo do formulário em ~10-60 s.
            </p>
          </div>
        </header>
        <section className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
          <div className="bg-white rounded-2xl border border-dpo2u-ink/10 p-6 sm:p-10 shadow-sm">
            <SubmitAttestationForm />
          </div>
        </section>
      </main>
    </RequireApiKey>
  );
}
