// AppLayout — authenticated app shell (sidebar 240px + main).
// Reuses sealed design tokens; renders <Outlet/> for /app/* children.
import React from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { FONTS, PALETTE, SmallLabel, DPO2UWordmark } from '@/components/sealed/atoms';
import { useWalletAuth } from './WalletAuthProvider';
import { truncatePubkey } from '@/lib/app/wallet-session';

const NAV: { to: string; label: string }[] = [
  { to: '/app', label: 'Overview' },
  { to: '/app/activate', label: 'Activate' },
  { to: '/app/evidence', label: 'Audit evidence' },
  { to: '/app/escrow', label: 'Escrow (B2B)' },
  { to: '/app/billing', label: 'Billing' },
  { to: '/app/settings', label: 'Settings' },
];

export default function AppLayout() {
  const { pubkey, network, tier, workspace, disconnect } = useWalletAuth();
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen"
      style={{ background: PALETTE.paper, color: PALETTE.ink, fontFamily: FONTS.body }}
    >
      <div className="grid" style={{ gridTemplateColumns: 'minmax(0,240px) 1fr', minHeight: '100vh' }}>
        {/* Sidebar */}
        <aside
          className="hidden md:flex flex-col p-6"
          style={{ borderRight: `.5px solid ${PALETTE.ruleStrong}`, background: PALETTE.paper2 }}
        >
          <Link to="/" className="mb-8 inline-block"><DPO2UWordmark size={22} /></Link>

          <div
            className="mb-6 p-3"
            style={{ border: `.5px solid ${PALETTE.rule}`, borderRadius: 4, background: PALETTE.paper }}
          >
            <SmallLabel>Workspace</SmallLabel>
            <div style={{ fontFamily: FONTS.mono, fontSize: 13, marginTop: 4 }}>{workspace.label}</div>
            <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: PALETTE.concrete, marginTop: 2 }}>
              {tier.label}
            </div>
          </div>

          <nav className="flex flex-col gap-1 flex-1">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === '/app'}
                style={({ isActive }) => ({
                  fontFamily: FONTS.body,
                  fontSize: 14,
                  padding: '8px 10px',
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

          <div className="mt-6 pt-4" style={{ borderTop: `.5px solid ${PALETTE.rule}` }}>
            <SmallLabel>Connected</SmallLabel>
            <div style={{ fontFamily: FONTS.mono, fontSize: 11, marginTop: 4, wordBreak: 'break-all' }}>
              {truncatePubkey(pubkey)}
            </div>
            <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: PALETTE.concrete }}>
              {network ?? 'solana'}
            </div>
            <button
              type="button"
              onClick={() => { disconnect(); navigate('/'); }}
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
        </aside>

        {/* Main */}
        <main className="px-6 md:px-10 py-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
