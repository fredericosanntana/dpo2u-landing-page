import { useEffect } from 'react';
import { PilotNav } from '@/components/pilot/PilotNav';
import { OperatorTopBar } from '@/components/pilot/operator/OperatorTopBar';
import { RequireApiKey } from '@/components/pilot/operator/RequireApiKey';
import { ErasureRequestForm } from '@/components/pilot/operator/ErasureRequestForm';

export default function PilotOperatorErasure() {
  useEffect(() => {
    document.title = 'LGPD Art. 18 | DPO2U Piloto';
  }, []);
  return (
    <RequireApiKey>
      <main className="bg-dpo2u-ivory min-h-screen pb-24">
        <PilotNav />
        <OperatorTopBar />
        <header className="border-b border-dpo2u-ink/10">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
            <p className="font-mono text-xs uppercase tracking-widest text-dpo2u-ink/60">
              LGPD Art. 18 IV / VI · direito à eliminação
            </p>
            <h1 className="mt-3 font-display text-4xl text-dpo2u-ink leading-tight">
              Solicitação de eliminação
            </h1>
            <p className="mt-3 text-dpo2u-ink/70 font-body">
              O fluxo registra uma atestação <code className="bg-dpo2u-ink/5 px-1 rounded font-mono text-sm">erasure_v1</code> sob o mesmo
              hash do registro original (append-only sobre o contrato imutável). Off-chain payload é secure-erased ANTES da submissão on-chain.
            </p>
          </div>
        </header>
        <section className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
          <div className="bg-white rounded-2xl border border-dpo2u-ink/10 p-6 sm:p-10 shadow-sm">
            <ErasureRequestForm />
          </div>
        </section>
      </main>
    </RequireApiKey>
  );
}
