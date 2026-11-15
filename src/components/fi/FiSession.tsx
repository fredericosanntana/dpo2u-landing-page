// Sessão da área /app/fi: cookie httpOnly do gateway, sem carteira (E2).
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Link, Navigate, Outlet, useLocation } from 'react-router-dom';
import { api, type SessionView } from '@/lib/fi/gateway';
import { DPO2ULockup, FONTS, PALETTE } from '@/components/sealed/atoms';

interface Ctx { session: SessionView | null; loading: boolean; refresh: () => Promise<void> }
const FiCtx = createContext<Ctx>({ session: null, loading: true, refresh: async () => {} });
export const useFiSession = () => useContext(FiCtx);

export function FiSessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<SessionView | null>(null);
  const [loading, setLoading] = useState(true);
  const refresh = useCallback(async () => {
    try {
      setSession(await api.session());
    } catch {
      setSession(null);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => { void refresh(); }, [refresh]);
  return <FiCtx.Provider value={{ session, loading, refresh }}>{children}</FiCtx.Provider>;
}

const NAV = [
  { to: '/app/fi', label: 'Painel' },
  { to: '/app/fi/workspace', label: 'Workspace' },
  { to: '/app/fi/passport', label: 'Passaporte' },
  { to: '/app/fi/sponsorships', label: 'Parceiros' },
  { to: '/app/fi/cases', label: 'Transferências' },
  { to: '/app/fi/disclosure', label: 'Supervisor' },
  { to: '/app/fi/billing', label: 'Plano' },
];

export function FiLayout() {
  const { session, loading } = useFiSession();
  const loc = useLocation();
  if (loading) return <div style={{ padding: 48, fontFamily: FONTS.body }}>…</div>;
  if (!session) return <Navigate to={`/financial-institutions?next=${encodeURIComponent(loc.pathname)}#fi-diagnostic`} replace />;
  return (
    <div style={{ minHeight: '100vh', background: PALETTE.paper, color: PALETTE.ink, fontFamily: FONTS.body }}>
      <header className="px-6 lg:px-10 py-4 flex flex-wrap items-center justify-between gap-4" style={{ borderBottom: `1px solid ${PALETTE.rule}` }}>
        <div className="flex items-center gap-6">
          <Link to="/" aria-label="DPO2U"><DPO2ULockup size={24} /></Link>
          <nav className="flex gap-4" aria-label="Área da instituição">
            {NAV.map((n) => (
              <Link key={n.to} to={n.to} style={{ color: loc.pathname === n.to ? PALETTE.ink : PALETTE.concrete, fontWeight: loc.pathname === n.to ? 600 : 400, textDecoration: 'none' }}>{n.label}</Link>
            ))}
          </nav>
        </div>
        <div style={{ fontSize: 13, color: PALETTE.concrete }}>
          {session.workspace.name} · {session.member.email} ·{' '}
          <button type="button" onClick={() => void api.logout().then(() => window.location.assign('/financial-institutions'))} style={{ background: 'none', border: 0, color: PALETTE.ink, textDecoration: 'underline', cursor: 'pointer' }}>sair</button>
        </div>
      </header>
      <main className="px-6 lg:px-10 py-10"><Outlet /></main>
    </div>
  );
}
