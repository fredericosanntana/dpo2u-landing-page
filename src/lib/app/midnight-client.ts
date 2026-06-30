// midnight-client.ts — read-only client for the self-funding Midnight agent (no wallet, no auth).
// Powers the wallet-free /app/midnight onboarding (DUST health + agent address + faucet CTA).
const MIDNIGHT_BASE =
  (import.meta.env.VITE_MIDNIGHT_BASE_URL as string | undefined) ?? 'https://midnight.dpo2u.com';

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

export const midnightBase = MIDNIGHT_BASE;
