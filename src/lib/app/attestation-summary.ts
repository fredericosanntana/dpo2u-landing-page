// attestation-summary.ts — client do GET /api/v1/managed/attestation?hash=&subject=.
// Recupera o RESUMO rico (repo, jurisdição, score, gaps, controls) de uma atestação a
// partir do hash — usado quando o dado não está no histórico local (ex.: linha lida só
// da chain, outro device, ou a página pública /verify/sol).

const BASE = (import.meta.env.VITE_MCP_BASE_URL as string | undefined) ?? 'https://mcp.dpo2u.com';

export interface AttestationSummary {
  evidence_hash_hex: string;
  subject_pubkey?: string;
  repo_url: string;
  jurisdiction: string;
  score: number;
  gaps: string[];
  controls?: Record<string, boolean>;
  verdict: string;
  use_case_id: string;
  chain: string;
  created_at: number;
}

export async function fetchAttestationSummary(
  hash: string,
  subject?: string,
): Promise<AttestationSummary | null> {
  try {
    const qs = new URLSearchParams({ hash });
    if (subject) qs.set('subject', subject);
    const res = await fetch(`${BASE.replace(/\/+$/, '')}/api/v1/managed/attestation?${qs.toString()}`);
    if (!res.ok) return null;
    return (await res.json()) as AttestationSummary;
  } catch {
    return null;
  }
}
