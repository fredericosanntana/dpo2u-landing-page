// Hook de leitura das atestações Stellar de um subject (dashboard/evidence).
// Lê os eventos do contrato anticorrupção (indexer-store, via Horizon) e filtra
// por `submitted_by === subject`. O poll de 30s já é provido pelo indexer-store.

import { useCallback, useEffect, useMemo } from 'react';
import { useIndexerStore } from '@/lib/pilot/indexer-store';
import { eventToRecord, type StellarAttestationRecord } from '@/lib/app/stellar-attestation';

export interface StellarIndexerState {
  readonly records: StellarAttestationRecord[];
  readonly loading: boolean;
  readonly error: string | null;
  refetch: () => void;
}

export function useStellarAttestations(subject: string | null): StellarIndexerState {
  const events = useIndexerStore((s) => s.events);
  const loading = useIndexerStore((s) => s.loading);
  const error = useIndexerStore((s) => s.error);
  const fetchOnce = useIndexerStore((s) => s.fetchOnce);
  const startPolling = useIndexerStore((s) => s.startPolling);
  const stopPolling = useIndexerStore((s) => s.stopPolling);

  useEffect(() => {
    startPolling(30_000);
    return () => stopPolling();
  }, [startPolling, stopPolling]);

  const records = useMemo<StellarAttestationRecord[]>(() => {
    if (!subject) return [];
    return events
      .filter((e) => e.record.submitted_by === subject)
      .map(eventToRecord)
      .sort((a, b) => (b.issuedAt ?? 0) - (a.issuedAt ?? 0));
  }, [events, subject]);

  const refetch = useCallback(() => { void fetchOnce(); }, [fetchOnce]);
  return { records, loading, error, refetch };
}
