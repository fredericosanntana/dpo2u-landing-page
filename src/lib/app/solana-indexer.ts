// Hook de leitura das atestações Solana de um subject (dashboard).
// Lê via getProgramAccounts no compliance-registry (devnet). Auto-refresh a cada 30s.

import { useCallback, useEffect, useState } from 'react';
import {
  fetchSolanaAttestationsBySubject,
  type SolanaAttestationRecord,
} from '@/lib/app/solana-attestation';

export interface SolanaIndexerState {
  readonly records: SolanaAttestationRecord[];
  readonly loading: boolean;
  readonly error: string | null;
  refetch: () => void;
}

const REFRESH_MS = 30_000;

export function useSolanaAttestations(subject: string | null): SolanaIndexerState {
  const [records, setRecords] = useState<SolanaAttestationRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const refetch = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    if (!subject) {
      setRecords([]);
      setError(null);
      return;
    }
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const recs = await fetchSolanaAttestationsBySubject(subject);
        if (!cancelled) {
          // mais recentes primeiro
          recs.sort((a, b) => (b.issuedAt ?? 0) - (a.issuedAt ?? 0));
          setRecords(recs);
          setError(null);
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void load();
    const id = setInterval(load, REFRESH_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [subject, tick]);

  return { records, loading, error, refetch };
}
