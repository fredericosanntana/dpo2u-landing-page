// passport.ts — leitura pública do passaporte do padrão PSAV-parceiro.
// GET /api/v1/psav/passports/:id (pilot-gateway) — sem auth, sem evidência.

const GATEWAY_BASE =
  (import.meta.env.VITE_MCP_BASE_URL as string | undefined) ?? 'https://mcp.dpo2u.com';

export type PassportStatus = 'valid' | 'suspended' | 'expired' | 'revoked';
export type PassportTier = 'tier1-machine-only' | 'tier1' | 'tier2' | 'tier3';

export interface PassportView {
  id: string;
  status: PassportStatus;
  tier: PassportTier;
  packs: { id: string; hash: string }[];
  origin: { machine: number; human: number; third_party: number };
  verdicts: { pass: number; pending: number };
  issuedAt: string;
  expiresAt: string;
  attestation: { id: string; chainTarget: string; txSig?: string; explorerUrl?: string; verifyHandle: string };
  history: { type: string; at: string; reason?: string }[];
}

export type FetchPassport =
  | { ok: true; passport: PassportView }
  | { ok: false; reason: 'not-found' | 'network'; detail?: string };

export async function fetchPassport(id: string): Promise<FetchPassport> {
  const url = `${GATEWAY_BASE.replace(/\/+$/, '')}/api/v1/psav/passports/${encodeURIComponent(id)}`;
  let res: Response;
  try {
    res = await fetch(url, { headers: { accept: 'application/json' } });
  } catch (e) {
    return { ok: false, reason: 'network', detail: e instanceof Error ? e.message : String(e) };
  }
  if (res.status === 404) return { ok: false, reason: 'not-found' };
  if (!res.ok) return { ok: false, reason: 'network', detail: `HTTP ${res.status}` };
  return { ok: true, passport: (await res.json()) as PassportView };
}

/** Texto e tom do status. Suspenso/expirado/revogado em destaque — nunca omitidos. */
export function statusCopy(s: PassportStatus): { label: string; tone: 'ok' | 'alert'; detail: string } {
  switch (s) {
    case 'valid':
      return { label: 'Válido', tone: 'ok', detail: 'Selado na rede e dentro da validade.' };
    case 'suspended':
      return { label: 'Suspenso', tone: 'alert', detail: 'Uma condição deixou de ser atendida. A patrocinadora foi notificada.' };
    case 'expired':
      return { label: 'Expirado', tone: 'alert', detail: 'Sem nova verificação dentro da janela. Silêncio não conta como válido.' };
    case 'revoked':
      return { label: 'Revogado', tone: 'alert', detail: 'Retirado de forma definitiva.' };
  }
}

export const TIER_LABEL: Record<PassportTier, string> = {
  'tier1-machine-only': 'Tier 1 — somente máquina (parte documental pendente)',
  tier1: 'Tier 1 — prontidão',
  tier2: 'Tier 2 — supervisão contínua',
  tier3: 'Tier 3 — integrado',
};

/** Percentuais de origem que somam 100 (arredondamento pelo maior resto). */
export function originPercent(o: PassportView['origin']): { machine: number; human: number; third_party: number } {
  const total = o.machine + o.human + o.third_party;
  if (!total) return { machine: 0, human: 0, third_party: 0 };
  const keys = ['machine', 'human', 'third_party'] as const;
  const raw = keys.map((k) => (o[k] / total) * 100);
  const floor = raw.map(Math.floor);
  let rest = 100 - floor.reduce((a, b) => a + b, 0);
  const order = raw.map((r, i) => [r - floor[i]!, i] as const).sort((a, b) => b[0] - a[0]);
  for (const [, i] of order) if (rest-- > 0) floor[i]! += 1;
  return { machine: floor[0]!, human: floor[1]!, third_party: floor[2]! };
}
