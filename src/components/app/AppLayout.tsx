// AppLayout — authenticated app shell. Sidebar (240px) on desktop; a top bar +
// slide-over drawer on mobile so every screen + disconnect stay reachable on a
// phone. Mounts the toast + payment-confirm hosts once. Reuses sealed tokens.
import React, { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FONTS, PALETTE, SmallLabel, DPO2UWordmark } from '@/components/sealed/atoms';
import { useWalletAuth } from './WalletAuthProvider';
import { truncatePubkey } from '@/lib/app/wallet-session';
import { ToastViewport, PaymentConfirmHost } from '@/components/app/ui';

// Funil Meta→Execução→Prova: "Prove something" é a entrada (Ato 1); Proofs = dossiês.
const NAV: { to: string; label: string }[] = [
  { to: '/app', label: 'Overview' },
  { to: '/app/start', label: 'Prove something' },
  { to: '/app/evidence', label: 'Proofs · dossiers' },
  { to: '/app/activate', label: 'Pipelines' },
  { to: '/app/escrow', label: 'Escrow (B2B)' },
  { to: '/app/billing', label: 'Billing' },
  { to: '/app/settings', label: 'Settings' },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1 flex-1">
      {NAV.map((n) => (
        <NavLink
          key={n.to}
          to={n.to}
          end={n.to === '/app'}
          onClick={onNavigate}
          style={({ isActive }) => ({
            fontFamily: FONTS.body,
            fontSize: 14,
            padding: '10px 10px',
            borderRadius: 4,
            textDecoration: 'none',
            color: isActive ? PALETTE.terracotta : PALETTE.ink,
            background: isActive ? 'rgba(200,92,59,.08)' : 'transparent',
            fontWeight: isActive ? 600 : 400,
          })}
        >
          {n.label}
        </NavLink>
      ))}
    </nav>
  );
}

function WorkspaceCard({ label, tierLabel }: { label: string; tierLabel: string }) {
  return (
    <div className="mb-6 p-3" style={{ border: `.5px solid ${PALETTE.rule}`, borderRadius: 4, background: PALETTE.paper }}>
      <SmallLabel>Workspace</SmallLabel>
      <div style={{ fontFamily: FONTS.mono, fontSize: 13, marginTop: 4 }}>{label}</div>
      <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: PALETTE.concrete, marginTop: 2 }}>{tierLabel}</div>
    </div>
  );
}

function ConnectedBlock({ pubkey, network, onDisconnect }: { pubkey: string | null; network?: string | null; onDisconnect: () => void }) {
  return (
    <div className="mt-6 pt-4" style={{ borderTop: `.5px solid ${PALETTE.rule}` }}>
      <SmallLabel>Connected</SmallLabel>
      <div style={{ fontFamily: FONTS.mono, fontSize: 11, marginTop: 4, wordBreak: 'break-all' }}>{truncatePubkey(pubkey)}</div>
      <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: PALETTE.concrete }}>{network ?? 'testnet'}</div>
      <button
        type="button"
        onClick={onDisconnect}
        className="mt-3 text-left"
        style={{
          fontFamily: FONTS.mono, fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase',
          color: PALETTE.concrete, background: 'transparent', border: 'none', cursor: 'pointer',
          textDecoration: 'underline', textUnderlineOffset: 3, padding: 0,
        }}
      >
        Disconnect
      </button>
    </div>
  );
}

export default function AppLayout() {
  const { pubkey, network, tier, workspace, disconnect } = useWalletAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Close the mobile drawer on route change + on Escape.
  useEffect(() => { setDrawerOpen(false); }, [location.pathname]);
  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setDrawerOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [drawerOpen]);

  const onDisconnect = () => { disconnect(); navigate('/'); };

  return (
    <div className="min-h-screen" style={{ background: PALETTE.paper, color: PALETTE.ink, fontFamily: FONTS.body }}>
      <div className="md:grid" style={{ gridTemplateColumns: 'minmax(0,240px) 1fr', minHeight: '100vh' }}>
        {/* Desktop sidebar */}
        <aside className="hidden md:flex flex-col p-6" style={{ borderRight: `.5px solid ${PALETTE.ruleStrong}`, background: PALETTE.paper2 }}>
          <Link to="/" className="mb-8 inline-block"><DPO2UWordmark size={22} /></Link>
          <WorkspaceCard label={workspace.label} tierLabel={tier.label} />
          <NavLinks />
          <ConnectedBlock pubkey={pubkey} network={network} onDisconnect={onDisconnect} />
        </aside>

        {/* Mobile top bar */}
        <header
          className="md:hidden flex items-center justify-between px-5"
          style={{ height: 56, borderBottom: `.5px solid ${PALETTE.ruleStrong}`, background: PALETTE.paper2, position: 'sticky', top: 0, zIndex: 40 }}
        >
          <Link to="/"><DPO2UWordmark size={20} /></Link>
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
            aria-expanded={drawerOpen}
            style={{ display: 'inline-flex', flexDirection: 'column', gap: 4, background: 'none', border: 'none', cursor: 'pointer', padding: 6 }}
          >
            {[0, 1, 2].map((i) => <span key={i} style={{ width: 22, height: 2, background: PALETTE.ink, display: 'block' }} />)}
          </button>
        </header>

        {/* Mobile drawer */}
        {drawerOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex" onClick={() => setDrawerOpen(false)} style={{ background: 'rgba(12,13,16,.45)' }}>
            <aside
              onClick={(e) => e.stopPropagation()}
              className="flex flex-col p-6 h-full w-[78%] max-w-[300px] overflow-y-auto"
              style={{ background: PALETTE.paper2, borderRight: `1px solid ${PALETTE.ruleStrong}` }}
            >
              <div className="flex items-center justify-between mb-8">
                <DPO2UWordmark size={22} />
                <button type="button" onClick={() => setDrawerOpen(false)} aria-label="Close menu"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: PALETTE.concrete, fontSize: 20, lineHeight: 1 }}>✕</button>
              </div>
              <WorkspaceCard label={workspace.label} tierLabel={tier.label} />
              <NavLinks onNavigate={() => setDrawerOpen(false)} />
              <ConnectedBlock pubkey={pubkey} network={network} onDisconnect={onDisconnect} />
            </aside>
          </div>
        )}

        {/* Main */}
        <main className="px-5 sm:px-6 md:px-10 py-8 md:py-10">
          <Outlet />
        </main>
      </div>

      <ToastViewport />
      <PaymentConfirmHost />
    </div>
  );
}
