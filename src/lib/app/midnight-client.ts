// midnight-client.ts — clients for the wallet-free Midnight alpha.
//  · agent self-funding status  → the Midnight webhook (midnight.dpo2u.com)
//  · activate / status (opt-in)  → the pilot-gateway (mcp.dpo2u.com), wallet-free, NO threshold
const MIDNIGHT_BASE =
  (import.meta.env.VITE_MIDNIGHT_BASE_URL as string | undefined) ?? 'https://midnight.dpo2u.com';
const GATEWAY_BASE =
  (import.meta.env.VITE_MCP_BASE_URL as string | undefined) ?? 'https://mcp.dpo2u.com';

export interface AgentStatus {
  address: string | null;
  network?: string;
  dust: string;
  dustHuman: string;
  floor: string;
  healthy: boolean;
  lowFuel: boolean;
  sealsToday?: number;
  queue?: number;
  faucetUrl: string;
}

export async function fetchAgentStatus(): Promise<AgentStatus | null> {
  try {
    const r = await fetch(`${MIDNIGHT_BASE}/agent/status`);
    return r.ok ? ((await r.json()) as AgentStatus) : null;
  } catch {
    return null;
  }
}

export interface MidnightActivation {
  ok: boolean;
  installation_id?: number;
  jurisdictions?: string[];
  chain?: string;
  error?: string;
}

/** Wallet-free opt-in: seal this installation's repos on Midnight. NO pubkey, NO threshold. */
export async function activateMidnight(installationId: number, jurisdictions: string[]): Promise<MidnightActivation> {
  try {
    const r = await fetch(`${GATEWAY_BASE}/api/v1/github/midnight/activate`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ installation_id: installationId, jurisdictions }),
    });
    const j = (await r.json().catch(() => ({}))) as MidnightActivation;
    return r.ok ? { ...j, ok: true } : { ok: false, error: j.error ?? `HTTP ${r.status}` };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'network error' };
  }
}

export interface MidnightStatus { enabled: boolean; active: boolean; jurisdictions: string[] }

export async function midnightStatus(installationId: number): Promise<MidnightStatus | null> {
  try {
    const r = await fetch(`${GATEWAY_BASE}/api/v1/github/midnight/status?installation_id=${installationId}`);
    return r.ok ? ((await r.json()) as MidnightStatus) : null;
  } catch {
    return null;
  }
}

export const midnightBase = MIDNIGHT_BASE;
