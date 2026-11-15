import { useEffect, useState } from 'react';
import { useIndexerStore } from '@/lib/pilot/indexer-store';
import { useAuthStore } from '@/lib/pilot/auth-store';
import { truncateHash, truncateContract, stellarExpertUrl } from '@/lib/pilot/stellar';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';

const VERDICT_COLORS = {
  PASS: 'bg-dpo2u-verdigris/15 text-dpo2u-verdigris border-dpo2u-verdigris/30',
  FAIL: 'bg-dpo2u-terracotta/15 text-dpo2u-terracotta border-dpo2u-terracotta/30',
  REVIEW: 'bg-dpo2u-gold/15 text-dpo2u-gold border-dpo2u-gold/30',
};

/**
 * History via event indexer (same source as the public dashboard) — Phase B
 * doesn't introduce a new MCP "list" endpoint. The operator filters by their
 * own tenant via the auth store's tenant id when present, falling back to
 * "show everything submitted to this contract" otherwise.
 *
 * When MCP exposes `/api/v1/attestation?tenant_id=…` we swap this list out.
 */
export function SubmissionHistoryTable() {
  const events = useIndexerStore((s) => s.events);
  const loading = useIndexerStore((s) => s.loading);
  const error = useIndexerStore((s) => s.error);
  const lastFetchedAt = useIndexerStore((s) => s.lastFetchedAt);
  const startPolling = useIndexerStore((s) => s.startPolling);
  const stopPolling = useIndexerStore((s) => s.stopPolling);
  const tenantLabel = useAuthStore((s) => s.tenantLabel);

  const [showFailedOnly, setShowFailedOnly] = useState(false);

  useEffect(() => {
    startPolling(20_000);
    return () => stopPolling();
  }, [startPolling, stopPolling]);

  const filtered = events.filter((e) => (showFailedOnly ? e.record.verdict !== 'PASS' : true));
  const showSkeleton = loading && events.length === 0 && !lastFetchedAt;

  return (
    <div className="rounded-xl border border-dpo2u-ink/10 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 p-5 border-b border-dpo2u-ink/10">
        <div>
          <p className="text-xs font-mono uppercase tracking-wider text-dpo2u-ink/60">
            Histórico de atestações
          </p>
          <p className="mt-1 font-display text-xl text-dpo2u-ink">
            {filtered.length} {filtered.length === 1 ? 'registro' : 'registros'}
            {tenantLabel ? ` · ${tenantLabel}` : ''}
          </p>
        </div>
        <label className="flex items-center gap-2 text-sm text-dpo2u-ink/70 cursor-pointer">
          <input
            type="checkbox"
            checked={showFailedOnly}
            onChange={(e) => setShowFailedOnly(e.target.checked)}
            className="rounded border-dpo2u-ink/30"
          />
          Só FAIL / REVIEW
        </label>
      </div>

      {error && (
        <div className="border-b border-dpo2u-terracotta/30 bg-dpo2u-terracotta/10 px-5 py-3">
          <p className="text-xs text-dpo2u-terracotta font-mono">
            Indexer reportou erro: {error}. Dados podem estar desatualizados.
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
              ? 'Nenhuma atestação registrada ainda. Submeta a primeira em "Submeter atestação".'
              : 'Nenhum registro para o filtro atual.'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-dpo2u-ink/60 border-b border-dpo2u-ink/5">
                <th className="px-5 py-3 font-mono">Quando</th>
                <th className="px-5 py-3 font-mono">Use case</th>
                <th className="px-5 py-3 font-mono">Verdict</th>
                <th className="px-5 py-3 font-mono">Evidence hash</th>
                <th className="px-5 py-3 font-mono">Tx</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dpo2u-ink/5">
              {filtered.slice(0, 100).map((evt) => (
                <tr key={evt.id} className="hover:bg-dpo2u-ink/5">
                  <td className="px-5 py-3 text-dpo2u-ink/80 whitespace-nowrap">
                    {formatRelative(evt.created_at)}
                  </td>
                  <td className="px-5 py-3 font-mono text-dpo2u-ink">{evt.use_case_id}</td>
                  <td className="px-5 py-3">
                    <Badge
                      variant="outline"
                      className={`font-mono text-[10px] ${VERDICT_COLORS[evt.record.verdict]}`}
                    >
                      {evt.record.verdict}
                    </Badge>
                  </td>
                  <td className="px-5 py-3 font-mono text-xs text-dpo2u-ink/80">
                    {truncateHash(evt.evidence_hash_hex)}
                  </td>
                  <td className="px-5 py-3">
                    {evt.tx_hash && evt.tx_hash !== 'unknown' ? (
                      <a
                        href={stellarExpertUrl('tx', evt.tx_hash)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-dpo2u-indigo hover:underline"
                      >
                        {truncateContract(evt.tx_hash, 6, 4)} <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      <span className="text-xs text-dpo2u-ink/40">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {lastFetchedAt && (
        <div className="border-t border-dpo2u-ink/5 px-5 py-2.5">
          <p className="text-[10px] font-mono uppercase tracking-wider text-dpo2u-ink/40">
            Última sync: {new Date(lastFetchedAt).toLocaleTimeString('pt-BR')} · polling 20 s
          </p>
        </div>
      )}
    </div>
  );
}

function formatRelative(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diff = Math.max(0, Math.floor((now - then) / 1000));
  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}min`;
  if (diff < 86_400) return `${Math.floor(diff / 3600)}h`;
  return new Date(iso).toISOString().split('T')[0];
}
