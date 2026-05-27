// Auth state for the operator console (Phase B).
//
// Single-tenant API key flow:
//   - User pastes API key on /pilot/login
//   - Frontend calls MCP /api/v1/healthz with the key (pre-flight check)
//   - On 2xx, persist to localStorage + redirect to /pilot/operator
//   - On 401, surface error + don't persist
//
// Sprint K postgres migration adds per-tenant API keys + scopes. For
// Phase B we treat the key as opaque — server decides what it can do.

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  readonly apiKey: string | null;
  readonly tenantId: string | null;
  readonly tenantLabel: string | null;
  readonly mcpBaseUrl: string;
  setSession: (args: { apiKey: string; tenantId?: string; tenantLabel?: string }) => void;
  setMcpBaseUrl: (url: string) => void;
  clear: () => void;
}

const DEFAULT_MCP_BASE = (import.meta.env.VITE_MCP_BASE_URL as string | undefined) ?? 'https://mcp.dpo2u.com';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      apiKey: null,
      tenantId: null,
      tenantLabel: null,
      mcpBaseUrl: DEFAULT_MCP_BASE,
      setSession: ({ apiKey, tenantId, tenantLabel }) =>
        set({ apiKey, tenantId: tenantId ?? null, tenantLabel: tenantLabel ?? null }),
      setMcpBaseUrl: (url) => set({ mcpBaseUrl: url }),
      clear: () => set({ apiKey: null, tenantId: null, tenantLabel: null }),
    }),
    {
      name: 'dpo2u.pilot.auth',
      partialize: (state) => ({
        apiKey: state.apiKey,
        tenantId: state.tenantId,
        tenantLabel: state.tenantLabel,
        mcpBaseUrl: state.mcpBaseUrl,
      }),
    },
  ),
);

/** Display helper — show first 4 + last 4, mask middle. */
export function maskApiKey(key: string | null): string {
  if (!key) return '—';
  if (key.length <= 12) return '••••';
  return `${key.slice(0, 4)}…${key.slice(-4)}`;
}

export function isAuthenticated(state: AuthState): boolean {
  return Boolean(state.apiKey);
}
