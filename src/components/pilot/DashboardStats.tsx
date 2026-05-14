import { useIndexerStore, selectVerdictDistribution, selectDistinctUseCases } from '@/lib/pilot/indexer-store';
import { Skeleton } from '@/components/ui/skeleton';

export function DashboardStats() {
  const events = useIndexerStore((s) => s.events);
  const loading = useIndexerStore((s) => s.loading);
  const lastFetchedAt = useIndexerStore((s) => s.lastFetchedAt);

  const dist = selectVerdictDistribution({ events } as any);
  const useCases = selectDistinctUseCases({ events } as any);

  const passRate = dist.total > 0 ? Math.round((dist.pass / dist.total) * 100) : 0;

  const hasData = events.length > 0;
  const showSkeleton = loading && !hasData && !lastFetchedAt;

  if (showSkeleton) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-32 rounded-xl bg-dpo2u-ink/5" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Tile
        label="Atestações registradas"
        value={dist.total.toLocaleString('pt-BR')}
        sub={dist.total === 0 ? 'Nenhum registro ainda' : `${dist.pass} PASS · ${dist.fail} FAIL · ${dist.review} REVIEW`}
      />
      <Tile
        label="Pass rate"
        value={dist.total > 0 ? `${passRate}%` : '—'}
        sub={dist.total > 0 ? `${dist.pass} de ${dist.total} aprovadas` : 'Aguardando dados'}
        tone={dist.total > 0 && passRate < 90 ? 'warn' : 'ok'}
      />
      <Tile
        label="Use cases ativos"
        value={useCases.length.toLocaleString('pt-BR')}
        sub={useCases.length > 0 ? useCases.slice(0, 3).join(' · ') + (useCases.length > 3 ? '…' : '') : 'Aguardando dados'}
      />
    </div>
  );
}

interface TileProps {
  readonly label: string;
  readonly value: string;
  readonly sub: string;
  readonly tone?: 'ok' | 'warn';
}

function Tile({ label, value, sub, tone = 'ok' }: TileProps) {
  const valueColor = tone === 'warn' ? 'text-dpo2u-terracotta' : 'text-dpo2u-ink';
  return (
    <div className="rounded-xl border border-dpo2u-ink/10 bg-white p-5 shadow-sm">
      <p className="text-xs font-mono uppercase tracking-wider text-dpo2u-ink/60">{label}</p>
      <p className={`mt-2 font-display text-4xl tabular-nums ${valueColor}`}>{value}</p>
      <p className="mt-1 text-xs text-dpo2u-ink/60 font-body">{sub}</p>
    </div>
  );
}
