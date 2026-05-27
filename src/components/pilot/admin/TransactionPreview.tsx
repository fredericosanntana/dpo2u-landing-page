import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import type { SimulationResult } from '@/lib/pilot/admin-tx';

interface Props {
  readonly title: string;
  readonly simulating: boolean;
  readonly sim: SimulationResult | null;
  readonly args: ReadonlyArray<{ readonly label: string; readonly value: string }>;
}

export function TransactionPreview({ title, simulating, sim, args }: Props) {
  return (
    <div className="rounded-lg border border-dpo2u-ink/10 bg-white p-4 space-y-3">
      <p className="text-xs font-mono uppercase tracking-wider text-dpo2u-ink/60">
        Simulação · {title}
      </p>

      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
        {args.map((a) => (
          <div key={a.label} className="min-w-0">
            <dt className="text-xs text-dpo2u-ink/60 font-body">{a.label}</dt>
            <dd className="text-dpo2u-ink font-mono text-xs break-all">{a.value}</dd>
          </div>
        ))}
      </dl>

      <div className="pt-3 border-t border-dpo2u-ink/5">
        {simulating ? (
          <p className="flex items-center gap-2 text-xs text-dpo2u-ink/60">
            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Simulando contra Soroban RPC…
          </p>
        ) : sim?.success ? (
          <p className="flex items-center gap-2 text-xs text-dpo2u-verdigris">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Simulação OK · fee mínima estimada{' '}
            <code className="font-mono text-[10px] bg-dpo2u-verdigris/10 px-1 rounded">{sim.minFee} stroops</code>
          </p>
        ) : sim ? (
          <p className="flex items-start gap-2 text-xs text-dpo2u-terracotta">
            <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
            <span>Simulação falhou: {sim.error}</span>
          </p>
        ) : (
          <p className="text-xs text-dpo2u-ink/50">Aguardando preview…</p>
        )}
      </div>
    </div>
  );
}
