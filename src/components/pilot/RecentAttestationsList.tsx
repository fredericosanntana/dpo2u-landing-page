import { useState, useMemo } from 'react';
import { useIndexerStore, selectFilteredEvents, type AttestationEvent } from '@/lib/pilot/indexer-store';
import { truncateHash, truncateContract } from '@/lib/pilot/stellar';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { UseCaseFilter } from './UseCaseFilter';
import { AttestationDetailSheet } from './AttestationDetailSheet';

function VerdictBadge({ verdict }: { verdict: AttestationEvent['record']['verdict'] }) {
  const variants = {
    PASS: 'bg-dpo2u-verdigris/15 text-dpo2u-verdigris border-dpo2u-verdigris/30',
    FAIL: 'bg-dpo2u-terracotta/15 text-dpo2u-terracotta border-dpo2u-terracotta/30',
    REVIEW: 'bg-dpo2u-gold/15 text-dpo2u-gold border-dpo2u-gold/30',
  };
  return (
    <Badge
      variant="outline"
      className={`font-mono text-[10px] tracking-wider ${variants[verdict]}`}
    >
      {verdict}
    </Badge>
  );
}

function formatRelativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diffSec = Math.max(0, Math.floor((now - then) / 1000));
  if (diffSec < 60) return `${diffSec}s atrás`;
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)} min atrás`;
  if (diffSec < 86_400) return `${Math.floor(diffSec / 3_600)} h atrás`;
  return new Date(iso).toISOString().split('T')[0];
}

export function RecentAttestationsList() {
  const events = useIndexerStore((s) => s.events);
  const loading = useIndexerStore((s) => s.loading);
  const error = useIndexerStore((s) => s.error);
  const lastFetchedAt = useIndexerStore((s) => s.lastFetchedAt);

  const [filterUseCase, setFilterUseCase] = useState<string | undefined>(undefined);
  const [selectedEvent, setSelectedEvent] = useState<AttestationEvent | null>(null);

  const filtered = useMemo(() => selectFilteredEvents({ events } as any, filterUseCase), [events, filterUseCase]);
  const showSkeleton = loading && events.length === 0 && !lastFetchedAt;

  return (
    <div className="rounded-xl border border-dpo2u-ink/10 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 p-5 border-b border-dpo2u-ink/10">
        <div>
          <p className="text-xs font-mono uppercase tracking-wider text-dpo2u-ink/60">
            Atestações recentes
          </p>
          <p className="mt-1 font-display text-xl text-dpo2u-ink">
            {filtered.length > 0
              ? `${filtered.length} ${filtered.length === 1 ? 'registro' : 'registros'}`
              : 'Aguardando dados on-chain'}
          </p>
        </div>
        <UseCaseFilter value={filterUseCase} onChange={setFilterUseCase} />
      </div>

      {error && (
        <div className="border-b border-dpo2u-terracotta/30 bg-dpo2u-terracotta/10 px-5 py-3">
          <p className="text-xs text-dpo2u-terracotta font-mono">
            Horizon retornou erro: {error}. Dados podem estar desatualizados.
          </p>
        </div>
      )}

      {showSkeleton ? (
        <ul className="divide-y divide-dpo2u-ink/5">
          {[0, 1, 2, 3, 4].map((i) => (
            <li key={i} className="p-4">
              <Skeleton className="h-10 w-full bg-dpo2u-ink/5" />
            </li>
          ))}
        </ul>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center">
          <p className="text-sm text-dpo2u-ink/60 font-body italic">
            {events.length === 0
              ? 'Ainda não há atestações registradas no contrato.'
              : 'Nenhuma atestação para o filtro atual.'}
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-dpo2u-ink/5 max-h-[600px] overflow-y-auto">
          {filtered.slice(0, 50).map((evt) => (
            <li key={evt.id}>
              <button
                type="button"
                onClick={() => setSelectedEvent(evt)}
                className="w-full text-left p-4 hover:bg-dpo2u-ink/5 transition-colors flex items-center justify-between gap-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <VerdictBadge verdict={evt.record.verdict} />
                    <span className="font-mono text-sm text-dpo2u-ink truncate">
                      {evt.use_case_id}
                    </span>
                    <span className="text-xs text-dpo2u-ink/50">→</span>
                    <span className="font-mono text-xs text-dpo2u-ink/70 truncate">
                      {truncateHash(evt.evidence_hash_hex)}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-dpo2u-ink/50 font-body">
                    {formatRelativeTime(evt.created_at)} · submitter {truncateContract(evt.record.submitted_by, 6, 4)}
                  </p>
                </div>
                <span className="text-xs text-dpo2u-ink/40 shrink-0">→</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {lastFetchedAt && (
        <div className="border-t border-dpo2u-ink/5 px-5 py-2.5">
          <p className="text-[10px] font-mono uppercase tracking-wider text-dpo2u-ink/40">
            Última sincronização: {new Date(lastFetchedAt).toLocaleTimeString('pt-BR')} · polling 30s · cache local
          </p>
        </div>
      )}

      <AttestationDetailSheet event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </div>
  );
}
