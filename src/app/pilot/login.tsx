import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { PilotNav } from '@/components/pilot/PilotNav';
import { ApiKeyForm } from '@/components/pilot/operator/ApiKeyForm';
import { useAuthStore } from '@/lib/pilot/auth-store';

export default function PilotLoginPage() {
  useEffect(() => {
    document.title = 'Console do operador | DPO2U Piloto';
  }, []);
  const apiKey = useAuthStore((s) => s.apiKey);
  if (apiKey) return <Navigate to="/pilot/operator" replace />;

  return (
    <main className="bg-dpo2u-ivory min-h-screen pb-24">
      <PilotNav />
      <header className="border-b border-dpo2u-ink/10">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12 sm:py-16">
          <p className="font-mono text-xs uppercase tracking-widest text-dpo2u-ink/60">
            Acesso · personas P1 / P2 / P3 (CGM, operador, IT)
          </p>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl text-dpo2u-ink leading-tight">
            Console do operador
          </h1>
          <p className="mt-4 text-dpo2u-ink/70 font-body text-lg">
            Submeta atestações ao contrato Soroban via REST, monitore o histórico, e exerça LGPD Art. 18 (eliminação)
            quando o titular dos dados solicitar.
          </p>
        </div>
      </header>
      <section className="mx-auto max-w-2xl px-4 sm:px-6 py-10">
        <div className="bg-white rounded-2xl border border-dpo2u-ink/10 p-6 sm:p-10 shadow-sm">
          <ApiKeyForm />
        </div>
        <p className="mt-6 text-xs text-dpo2u-ink/50 font-body italic text-center">
          A API key é provisionada pela DPO2U na contratação do piloto. Se você não tem uma, pegue o sales-pack em{' '}
          <a href="/pilot" className="text-dpo2u-indigo hover:underline">/pilot</a>.
        </p>
      </section>
    </main>
  );
}
