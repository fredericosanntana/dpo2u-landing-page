// Client-side indexer for the pilot dashboard.
//
// Polls Horizon `/contracts/{id}/effects` (or `/operations`) every 30s,
// extracts Soroban contract events, filters by `attest` topic, decodes via
// the @dpo2u/stellar-sdk decoder, and exposes a normalised list for the
// dashboard charts + recent-list.
//
// Strategy:
//   - Initial fetch on startPolling() → 200 most recent operations.
//   - Cache the resulting AttestationEvent[] in localStorage keyed by
//     contract id. Persisted across reloads = fast dashboard hydration.
//   - Subsequent polls only fetch cursor-newer entries.
//   - Soft-degrades on network failure (lastError captured, UI shows
//     stale-with-warning banner).

import { create } from 'zustand';
import { xdr } from '@stellar/stellar-sdk';
import { decodeAttestationRecord, type AttestationRecord } from '@dpo2u/stellar-sdk';
import { DEFAULT_CONTRACT, type ContractMeta } from './contracts';
import { horizonUrl } from './stellar';

export interface AttestationEvent {
  /** Stable identifier — Horizon operation id. */
  readonly id: string;
  /** Use case id from the event topic. */
  readonly use_case_id: string;
  /** Evidence hash from the event topic (lowercase hex). */
  readonly evidence_hash_hex: string;
  /** Decoded AttestationRecord. */
  readonly record: AttestationRecord;
  /** ISO 8601 timestamp from Horizon. */
  readonly created_at: string;
  /** Stellar tx hash that produced this event. */
  readonly tx_hash: string;
  /** Ledger sequence. */
  readonly ledger: number;
}

interface IndexerState {
  readonly events: AttestationEvent[];
  readonly loading: boolean;
  readonly error: string | null;
  readonly lastFetchedAt: number | null;
  readonly contract: ContractMeta;
  fetchOnce: () => Promise<void>;
  startPolling: (intervalMs?: number) => void;
  stopPolling: () => void;
  clear: () => void;
}

let pollTimer: ReturnType<typeof setInterval> | null = null;

const STORAGE_KEY = (contractId: string) => `dpo2u.pilot.events.${contractId}`;

function loadCache(contractId: string): AttestationEvent[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY(contractId));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as { events: AttestationEvent[] };
    return Array.isArray(parsed.events) ? parsed.events : [];
  } catch {
    return [];
  }
}

function saveCache(contractId: string, events: AttestationEvent[]): void {
  if (typeof window === 'undefined') return;
  try {
    const trimmed = events.slice(0, 200); // cap to 200 most recent
    window.localStorage.setItem(STORAGE_KEY(contractId), JSON.stringify({ events: trimmed }));
  } catch {
    // localStorage full / private mode — ignore.
  }
}

interface HorizonOperationsResponse {
  readonly _embedded?: {
    readonly records?: ReadonlyArray<{
      readonly id?: string;
      readonly transaction_hash?: string;
      readonly created_at?: string;
      readonly ledger?: number;
      readonly type?: string;
      readonly function?: string;
      readonly contract?: { readonly events?: ReadonlyArray<RawSorobanEvent> };
      // Soroban events sometimes appear under different keys depending on
      // the Horizon version — we probe a few.
      readonly events?: ReadonlyArray<RawSorobanEvent>;
    }>;
  };
}

interface RawSorobanEvent {
  readonly type?: string;
  readonly topics?: ReadonlyArray<string>;
  readonly value?: string;
  readonly transaction_hash?: string;
  readonly created_at?: string;
  readonly ledger?: number;
}

function decodeScValFromBase64(b64: string | undefined): xdr.ScVal | null {
  if (!b64) return null;
  try {
    return xdr.ScVal.fromXDR(b64, 'base64');
  } catch {
    return null;
  }
}

function topicMatchesAttest(topics: ReadonlyArray<string> | undefined): {
  isAttest: boolean;
  useCaseId?: string;
  evidenceHashHex?: string;
} {
  if (!topics || topics.length < 3) return { isAttest: false };
  const head = decodeScValFromBase64(topics[0]);
  if (!head || head.switch().name !== 'scvSymbol') return { isAttest: false };
  if (head.sym().toString() !== 'attest') return { isAttest: false };
  const ucScv = decodeScValFromBase64(topics[1]);
  const hashScv = decodeScValFromBase64(topics[2]);
  if (!ucScv || ucScv.switch().name !== 'scvSymbol') return { isAttest: true };
  if (!hashScv || hashScv.switch().name !== 'scvBytes') return { isAttest: true };
  return {
    isAttest: true,
    useCaseId: ucScv.sym().toString(),
    evidenceHashHex: Buffer.from(hashScv.bytes()).toString('hex'),
  };
}

function parseEvent(
  op: NonNullable<HorizonOperationsResponse['_embedded']>['records'][number],
  raw: RawSorobanEvent,
): AttestationEvent | null {
  const topicInfo = topicMatchesAttest(raw.topics);
  if (!topicInfo.isAttest || !topicInfo.useCaseId || !topicInfo.evidenceHashHex) return null;

  const recordScv = decodeScValFromBase64(raw.value);
  // The SDK has its own (structurally identical) copy of @stellar/stellar-base.
  // Cast to bridge; runtime is the same xdr decoding.
  const record = decodeAttestationRecord(recordScv as unknown as Parameters<typeof decodeAttestationRecord>[0]);
  if (!record) return null;

  return {
    id: op.id ?? raw.transaction_hash ?? `${raw.ledger ?? 'unknown'}-${topicInfo.evidenceHashHex.slice(0, 8)}`,
    use_case_id: topicInfo.useCaseId,
    evidence_hash_hex: topicInfo.evidenceHashHex,
    record,
    created_at: op.created_at ?? raw.created_at ?? new Date().toISOString(),
    tx_hash: op.transaction_hash ?? raw.transaction_hash ?? 'unknown',
    ledger: op.ledger ?? raw.ledger ?? 0,
  };
}

async function fetchEvents(contract: ContractMeta): Promise<AttestationEvent[]> {
  const url = horizonUrl(`/contracts/${contract.id}/operations?limit=200&order=desc`, contract);
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Horizon ${res.status}: ${res.statusText}`);
  }
  const json: HorizonOperationsResponse = await res.json();
  const records = json._embedded?.records ?? [];
  const out: AttestationEvent[] = [];
  for (const op of records) {
    const opEvents = op.contract?.events ?? op.events ?? [];
    for (const raw of opEvents) {
      const parsed = parseEvent(op, raw);
      if (parsed) out.push(parsed);
    }
  }
  return out;
}

export const useIndexerStore = create<IndexerState>((set, get) => ({
  events: loadCache(DEFAULT_CONTRACT.id),
  loading: false,
  error: null,
  lastFetchedAt: null,
  contract: DEFAULT_CONTRACT,
  fetchOnce: async () => {
    const { loading, contract } = get();
    if (loading) return;
    set({ loading: true, error: null });
    try {
      const events = await fetchEvents(contract);
      saveCache(contract.id, events);
      set({ events, loading: false, lastFetchedAt: Date.now(), error: null });
    } catch (err) {
      set({
        loading: false,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  },
  startPolling: (intervalMs = 30_000) => {
    if (pollTimer) clearInterval(pollTimer);
    void get().fetchOnce();
    pollTimer = setInterval(() => {
      void get().fetchOnce();
    }, intervalMs);
  },
  stopPolling: () => {
    if (pollTimer) {
      clearInterval(pollTimer);
      pollTimer = null;
    }
  },
  clear: () => {
    set({ events: [], error: null, lastFetchedAt: null });
    saveCache(DEFAULT_CONTRACT.id, []);
  },
}));

/** Derived selectors — useful for components that don't want full state. */
export function selectVerdictDistribution(state: IndexerState): {
  pass: number;
  fail: number;
  review: number;
  total: number;
} {
  let pass = 0;
  let fail = 0;
  let review = 0;
  for (const e of state.events) {
    if (e.record.verdict === 'PASS') pass += 1;
    else if (e.record.verdict === 'FAIL') fail += 1;
    else if (e.record.verdict === 'REVIEW') review += 1;
  }
  return { pass, fail, review, total: pass + fail + review };
}

export function selectDistinctUseCases(state: IndexerState): string[] {
  const set = new Set<string>();
  for (const e of state.events) set.add(e.use_case_id);
  return Array.from(set).sort();
}

export function selectFilteredEvents(
  state: IndexerState,
  filterUseCase?: string,
  filterVerdict?: AttestationRecord['verdict'],
): AttestationEvent[] {
  return state.events.filter((e) => {
    if (filterUseCase && e.use_case_id !== filterUseCase) return false;
    if (filterVerdict && e.record.verdict !== filterVerdict) return false;
    return true;
  });
}
