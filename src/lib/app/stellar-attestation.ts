// Primitivas de atestação Stellar no browser — compartilhadas por submit (self-custody),
// leitura (dashboard/evidence) e indexer. Reusa o pipeline Soroban do /pilot:
// `register_attestation` via Freighter (attestation-tx) + leitura dos eventos do contrato
// (indexer-store) filtrada por `submitted_by` — a conta que assinou (= a wallet conectada).

import { registerAttestationSubmit, type AttestationVerdict } from '@/lib/pilot/attestation-tx';
import { stellarExpertUrl } from '@/lib/pilot/stellar';
import type { AttestationEvent } from '@/lib/pilot/indexer-store';
import type { SubmissionResult } from '@/lib/pilot/admin-tx';

export type Verdict = 'PASS' | 'FAIL' | 'REVIEW';

export interface StellarAttestationRecord {
  readonly useCaseId: string;
  readonly evidenceHashHex: string;
  readonly verdict: Verdict | null;
  readonly submittedBy: string; // conta Stellar (G…) que ancorou o selo
  readonly metadataHashHex: string;
  readonly issuedAt: number | null; // ms epoch
  readonly txHash: string;
  readonly ledger: number;
  readonly explorerUrl: string; // link da tx no Stellar Expert
}

/** PASS/FAIL/REVIEW (UI) → Pass/Fail/Review (variante do enum on-chain). */
export function toOnchainVerdict(v: Verdict): AttestationVerdict {
  return (v.charAt(0) + v.slice(1).toLowerCase()) as AttestationVerdict;
}

/** Mapeia um evento de atestação (indexer-store) pro shape consumido pelas páginas. */
export function eventToRecord(e: AttestationEvent): StellarAttestationRecord {
  const tsMs = e.record.timestamp ? e.record.timestamp * 1000 : (Date.parse(e.created_at) || null);
  return {
    useCaseId: e.use_case_id,
    evidenceHashHex: e.evidence_hash_hex,
    verdict: e.record.verdict ?? null,
    submittedBy: e.record.submitted_by,
    metadataHashHex: e.record.metadata_hash_hex,
    issuedAt: tsMs,
    txHash: e.tx_hash,
    ledger: e.ledger,
    explorerUrl: stellarExpertUrl('tx', e.tx_hash),
  };
}

/**
 * Self-custody: a própria wallet (Freighter) assina e envia a tx de
 * `register_attestation` no contrato Soroban. A conta conectada vira `submitted_by`
 * (satisfaz `submitter.require_auth()`), então a leitura do dashboard a recupera.
 * Caminho do power-user/OSS; o fluxo padrão do app é managed via gateway.
 */
export async function submitSelfCustodyAttestation(args: {
  submitter: string;
  useCaseId: string;
  evidenceHashHex: string;
  verdict: Verdict;
  metadataHashHex?: string;
}): Promise<SubmissionResult> {
  return registerAttestationSubmit({
    submitter: args.submitter,
    useCaseId: args.useCaseId,
    verdict: toOnchainVerdict(args.verdict),
    evidenceHashHex: args.evidenceHashHex,
    metadataHashHex: args.metadataHashHex ?? '0'.repeat(64),
  });
}
