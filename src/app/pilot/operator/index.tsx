import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileCheck2, History, ShieldX, ArrowRight, ShieldCheck } from 'lucide-react';
import { PilotNav } from '@/components/pilot/PilotNav';
import { OperatorTopBar } from '@/components/pilot/operator/OperatorTopBar';
import { RequireApiKey } from '@/components/pilot/operator/RequireApiKey';
import { useAuthStore, maskApiKey } from '@/lib/pilot/auth-store';
import { DEFAULT_CONTRACT, truncateContract } from '@/lib/pilot/stellar';

export default function PilotOperatorIndex() {
  useEffect(() => {
    document.title = 'Console do operador | DPO2U Piloto';
  }, []);
  const apiKey = useAuthStore((s) => s.apiKey);
  const tenantLabel = useAuthStore((s) => s.tenantLabel);

  return (
    <RequireApiKey>
      <main className="bg-dpo2u-ivory min-h-screen pb-24">
        <PilotNav />
        <OperatorTopBar />
        <header className="border-b border-dpo2u-ink/10">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
            <p className="font-mono text-xs uppercase tracking-widest text-dpo2u-ink/60">
              Sessão ativa · {maskApiKey(apiKey)} {tenantLabel ? `· ${tenantLabel}` : ''}
            </p>
            <h1 className="mt-3 font-display text-4xl text-dpo2u-ink leading-tight">
              Console do operador
            </h1>
            <p className="mt-3 text-dpo2u-ink/70 font-body text-lg">
              Selo de cera digital sobre cada decisão de pagamento. Selecione uma ação abaixo.
            </p>
          </div>
        </header>
        <section className="mx-auto max-w-6xl px-4 sm:px-6 py-10 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <ActionCard
              icon={<FileCheck2 className="h-5 w-5" />}
              title="Submeter atestação"
              body="Envia uma decisão de compliance ao predicate engine. Retorna verdict + tx hash."
              to="/pilot/operator/submit"
            />
            <ActionCard
              icon={<History className="h-5 w-5" />}
              title="Histórico"
              body="Lista de todas as atestações registradas no contrato — filtro por FAIL/REVIEW."
              to="/pilot/operator/history"
            />
            <ActionCard
              icon={<ShieldX className="h-5 w-5" />}
              title="LGPD Art. 18 — eliminação"
              body="Eliminação on-chain (append-only erasure_v1) + secure-erase do payload off-chain."
              to="/pilot/operator/erasure"
              accent="terracotta"
            />
          </div>

          <div className="rounded-xl border border-dpo2u-ink/10 bg-white p-5 flex flex-wrap items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-dpo2u-verdigris" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-mono uppercase tracking-wider text-dpo2u-ink/60">
                Contrato em uso
              </p>
              <p className="mt-1 font-mono text-sm text-dpo2u-ink">
                {truncateContract(DEFAULT_CONTRACT.id, 12, 8)} ·{' '}
                <span className="text-dpo2u-ink/60">{DEFAULT_CONTRACT.network}</span>
              </p>
            </div>
            <Link
              to="/pilot/contract"
              className="text-xs text-dpo2u-indigo hover:underline whitespace-nowrap"
            >
              Detalhes →
            </Link>
          </div>
        </section>
      </main>
    </RequireApiKey>
  );
}

interface CardProps {
  readonly icon: React.ReactNode;
  readonly title: string;
  readonly body: string;
  readonly to: string;
  readonly accent?: 'default' | 'terracotta';
}

function ActionCard({ icon, title, body, to, accent = 'default' }: CardProps) {
  return (
    <Link
      to={to}
      className={`rounded-xl border bg-white p-5 hover:border-dpo2u-indigo/40 transition-colors block ${
        accent === 'terracotta' ? 'border-dpo2u-terracotta/30' : 'border-dpo2u-ink/10'
      }`}
    >
      <div className="inline-flex items-center justify-center rounded-lg bg-dpo2u-ink/5 p-2 text-dpo2u-ink">
        {icon}
      </div>
      <h3 className="mt-3 font-display text-xl text-dpo2u-ink">{title}</h3>
      <p className="mt-1.5 text-sm text-dpo2u-ink/70 font-body">{body}</p>
      <p className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-dpo2u-indigo">
        Abrir <ArrowRight className="h-3.5 w-3.5" />
      </p>
    </Link>
  );
}
