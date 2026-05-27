// Global sticky nav for DPO2U "Compliance, sealed." — route-aware.
// Replaces the in-page anchor links with five react-router routes so the
// nav surfaces every actual page on the site. Active route is underlined
// in terracotta. Mobile (<lg) collapses links into a hamburger menu.
//
// Updated 2026-04-29 — Sealed globalization sprint.
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { DPO2ULockup, Button, PALETTE, FONTS } from '../atoms';

interface NavLinkSpec {
  label: string;
  to: string;
}

const NAV_LINKS: NavLinkSpec[] = [
  { label: 'Protocol',     to: '/solana-protocol' },
  { label: 'Coverage',     to: '/coverage' },
  { label: 'Pricing',      to: '/pricing' },
  { label: 'Try the audit', to: '/demo' },
  { label: 'About',        to: '/about' },
  { label: 'Docs',         to: '/research' },
  { label: 'Alpha signup', to: '/alpha-signup' },
];

function NavLinkItem({ link, active, onClick }: { link: NavLinkSpec; active: boolean; onClick?: () => void }) {
  return (
    <Link
      to={link.to}
      onClick={onClick}
      style={{
        color: active ? PALETTE.terracotta : PALETTE.inkSoft,
        textDecoration: 'none',
        borderBottom: active ? `1.5px solid ${PALETTE.terracotta}` : '1.5px solid transparent',
        paddingBottom: 2,
        transition: 'color .15s, border-color .15s',
      }}
    >
      {link.label}
    </Link>
  );
}

export default function SealedNav() {
  const location = useLocation();
  const [open, setOpen] = React.useState(false);

  // Close mobile menu when route changes
  React.useEffect(() => { setOpen(false); }, [location.pathname]);

  const isActive = (to: string) => {
    if (to === '/') return location.pathname === '/';
    return location.pathname === to || location.pathname.startsWith(to + '/');
  };

  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        background: 'rgba(255, 255, 255, 0.88)',
        borderBottom: `.5px solid ${PALETTE.rule}`,
      }}
      className="px-6 py-[18px] lg:px-14"
    >
      <div className="flex items-center justify-between gap-4">
        <Link
          to="/"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 0, textDecoration: 'none', color: 'inherit' }}
          aria-label="DPO2U — home"
          className="flex items-center gap-3 lg:gap-[14px]"
        >
          <DPO2ULockup size={26} />
          <span
            className="hidden md:inline-block"
            style={{
              fontFamily: FONTS.mono,
              fontSize: 9.5,
              letterSpacing: '.25em',
              color: PALETTE.concrete,
              textTransform: 'uppercase',
              paddingLeft: 12,
              marginLeft: 4,
              borderLeft: `.5px solid ${PALETTE.ruleStrong}`,
            }}
          >
            compliance, sealed · est. 2021
          </span>
        </Link>

        <div
          className="hidden lg:flex"
          style={{ gap: 28, fontSize: 13.5 }}
        >
          {NAV_LINKS.map((l) => (
            <NavLinkItem key={l.to} link={l} active={isActive(l.to)} />
          ))}
        </div>

        <div className="hidden md:flex gap-2 lg:gap-[10px]">
          <Button
            kind="ghost"
            href="https://github.com/fredericosanntana"
            style={{ padding: '8px 14px', fontSize: 13 }}
          >
            GitHub
          </Button>
          <Button
            kind="primary"
            href="https://www.npmjs.com/"
            style={{ padding: '8px 14px', fontSize: 13 }}
          >
            <span style={{ fontFamily: FONTS.mono, fontSize: 12 }}>
              npm i dpo2u-sdk
            </span>
          </Button>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden inline-flex flex-col justify-center items-center"
          style={{
            width: 36, height: 36,
            background: 'transparent',
            border: `.5px solid ${PALETTE.ruleStrong}`,
            borderRadius: 2,
            gap: 4,
            cursor: 'pointer',
          }}
        >
          <span style={{ display: 'block', width: 18, height: 1.5, background: PALETTE.ink, transition: 'transform .2s, opacity .2s', transform: open ? 'translateY(5.5px) rotate(45deg)' : 'none' }} />
          <span style={{ display: 'block', width: 18, height: 1.5, background: PALETTE.ink, transition: 'opacity .2s', opacity: open ? 0 : 1 }} />
          <span style={{ display: 'block', width: 18, height: 1.5, background: PALETTE.ink, transition: 'transform .2s', transform: open ? 'translateY(-5.5px) rotate(-45deg)' : 'none' }} />
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div
          className="lg:hidden"
          style={{
            marginTop: 14,
            borderTop: `.5px solid ${PALETTE.rule}`,
            paddingTop: 14,
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            fontSize: 15,
          }}
        >
          {NAV_LINKS.map((l) => (
            <NavLinkItem key={l.to} link={l} active={isActive(l.to)} onClick={() => setOpen(false)} />
          ))}
          <div
            className="flex flex-col sm:flex-row gap-2 pt-2"
            style={{ borderTop: `.5px solid ${PALETTE.rule}`, marginTop: 6 }}
          >
            <Button
              kind="ghost"
              href="https://github.com/fredericosanntana"
              style={{ padding: '10px 14px', fontSize: 13, justifyContent: 'center' }}
            >
              GitHub
            </Button>
            <Button
              kind="primary"
              href="https://www.npmjs.com/"
              style={{ padding: '10px 14px', fontSize: 13, justifyContent: 'center' }}
            >
              <span style={{ fontFamily: FONTS.mono, fontSize: 12 }}>npm i dpo2u-sdk</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
