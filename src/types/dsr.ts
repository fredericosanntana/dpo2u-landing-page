/**
 * DSR ticket shape — consumed by /dsr (Data Subject Rights history portal).
 *
 * Source: DPO2U MCP server `/api/v1/dsr/*` endpoints (Sprint 2 milestone S2.5).
 * Spec basis: LGPD Art. 18 (Brazil), GDPR Arts. 15-22 (EU), CCPA §1798.110-130 (US).
 *
 * v0 = read-only history. Submission flow (POST /api/v1/dsr/:request_type) is v1.
 */

export type DSRRequestType =
  | 'access'         // LGPD Art. 18 II / GDPR Art. 15 — right of access
  | 'correction'     // LGPD Art. 18 III / GDPR Art. 16 — rectification
  | 'erasure'        // LGPD Art. 18 VI / GDPR Art. 17 — erasure / "right to be forgotten"
  | 'portability'    // LGPD Art. 18 V / GDPR Art. 20 — data portability
  | 'objection'      // LGPD Art. 18 § 2º / GDPR Art. 21 — objection to processing
  | 'restriction';   // GDPR Art. 18 — restriction of processing

export type DSRStatus =
  | 'received'       // ticket created, not yet triaged
  | 'processing'     // assigned + actively worked
  | 'resolved'       // closed with response delivered
  | 'rejected';      // closed with refusal (e.g. retention legal basis trumps erasure)

export type DSRJurisdiction = 'LGPD' | 'GDPR' | 'CCPA' | 'OTHER';

export interface DSRTicket {
  /** Public ticket id (human-readable, e.g. "ACC-2026-001"). */
  id: string;
  /** Tenant scope (off-chain id, here mapped to login email for v0). */
  tenantId: string;
  /** Type of request — drives applicable article + SLA. */
  type: DSRRequestType;
  /** Jurisdiction the request is filed under — drives SLA. */
  jurisdiction: DSRJurisdiction;
  /** Email of the data subject. */
  email: string;
  /** Optional full name. */
  fullName?: string;
  /** Free-text description from the subject. */
  description?: string;
  /** ISO-8601 UTC timestamp of submission. */
  submittedAt: string;
  /** ISO-8601 UTC timestamp of last status change. */
  updatedAt?: string;
  /** Current status. */
  status: DSRStatus;
  /**
   * SLA deadline (ISO-8601). LGPD = 15 business days from submittedAt
   * (per ANPD guidance); GDPR = 30 calendar days (Art. 12(3)).
   */
  slaDueAt: string;
  /** Resolution note shown when status === 'resolved' or 'rejected'. */
  resolutionNote?: string;
  /** Optional on-chain attestation linking the resolution (e.g. erasure PDA). */
  attestationPda?: string;
}

export interface DSRListResponse {
  tenantId: string;
  count: number;
  items: DSRTicket[];
}

/**
 * Sample tickets surfaced when the backend `GET /api/v1/dsr/tickets` endpoint
 * is not yet live (HTTP 404) or auth is missing (HTTP 401). The PASS criteria
 * for S2.5 requires "login dummy mostra 1 ticket fake" — these cover that.
 *
 * Marked clearly with `id` prefix "SAMPLE-" so UX never confuses sample with real.
 */
export const SAMPLE_DSR_TICKETS: DSRTicket[] = [
  {
    id: 'SAMPLE-ACC-2026-001',
    tenantId: 'sample',
    type: 'access',
    jurisdiction: 'LGPD',
    email: 'sample@dpo2u.com',
    fullName: 'Maria S.',
    description: 'Solicito cópia de todos os dados pessoais tratados.',
    submittedAt: '2026-04-15T09:12:00Z',
    updatedAt: '2026-04-18T16:40:00Z',
    status: 'resolved',
    slaDueAt: '2026-05-06T09:12:00Z',
    resolutionNote: 'Entregue via portal seguro em 3 dias úteis. Pacote PDF + JSON.',
    attestationPda: 'SEaL3vQ…x9Q2r7',
  },
  {
    id: 'SAMPLE-ERA-2026-002',
    tenantId: 'sample',
    type: 'erasure',
    jurisdiction: 'LGPD',
    email: 'sample@dpo2u.com',
    description: 'Pedido de exclusão (LGPD Art. 18 VI).',
    submittedAt: '2026-05-02T14:03:00Z',
    updatedAt: '2026-05-05T10:21:00Z',
    status: 'processing',
    slaDueAt: '2026-05-23T14:03:00Z',
    resolutionNote: 'Em triagem — dados de tx on-chain têm base legal de retenção (5 anos).',
  },
];
