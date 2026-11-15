// PilotNav — sub-nav inside the /pilot/* section. Matches the SealedNav
// language (thin terracotta underline on active, mono uppercase labels,
// no pill backgrounds) so the pilot feels editorial-consistent with the
// rest of dpo2u.com rather than a SaaS dashboard layer on top.
//
// Aligned with sealed design pattern 2026-05-14.

import { NavLink } from 'react-router-dom';
import { FONTS, PALETTE, SmallLabel } from '@/components/sealed/atoms';

interface NavSpec {
  to: string;
  label: string;
  exact?: boolean;
}

const LINKS: NavSpec[] = [
  { to: '/pilot',           label: 'Visão geral',  exact: true },
  { to: '/pilot/alertas',   label: 'Alertas' },
  { to: '/pilot/compliance', label: 'Compliance B2B' },
  { to: '/pilot/atestar',   label: 'Atestar' },
  { to: '/pilot/verify',    label: 'Verificar' },
  { to: '/pilot/dashboard', label: 'Dashboard' },
  { to: '/pilot/contract',  label: 'Contrato' },
];

export function PilotNav() {
  return (
    <nav
      style={{
        borderTop: `1px solid ${PALETTE.ink}`,
        borderBottom: `1px solid ${PALETTE.ink}`,
        background: PALETTE.paper,
      }}
      aria-label="Piloto Anticorrupção"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4 flex flex-wrap items-center gap-x-8 gap-y-2">
        <SmallLabel style={{ marginRight: 8, color: PALETTE.inkSoft }}>
          § Piloto · Stellar Soroban
        </SmallLabel>
        <ul className="flex flex-wrap items-center gap-x-6 gap-y-1" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {LINKS.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.exact}
                style={({ isActive }) => ({
                  fontFamily: FONTS.mono,
                  fontSize: 11,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  color: PALETTE.ink,
                  padding: '4px 0',
                  borderBottom: isActive ? `2px solid ${PALETTE.terracotta}` : '2px solid transparent',
                  transition: 'border-color .15s',
                })}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
