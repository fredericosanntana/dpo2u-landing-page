// Shared atoms for the DPO2U "Compliance, sealed." landing.
// Recreates sealed-shared.jsx from the design handoff bundle.
import React from 'react';

export const PALETTE = {
  paper: 'var(--dpo2u-ivory, #F1ECE3)',
  paper2: '#E8E2D5',
  ink: 'var(--dpo2u-ink, #0C0D10)',
  inkSoft: '#2A2722',
  terracotta: 'var(--dpo2u-terracotta, #C85C3B)',
  concrete: 'var(--dpo2u-concrete, #5E5E55)',
  verdigris: 'var(--dpo2u-verdigris, #4A7C74)',
  ivory: '#1A1816',
  rule: 'rgba(12,13,16,.14)',
  ruleStrong: 'rgba(12,13,16,.32)',
};

export const FONTS = {
  display: "'Fraunces', Georgia, serif",
  body: "'Inter Tight', system-ui, sans-serif",
  mono: "'JetBrains Mono', Menlo, monospace",
};

export const JURISDICTIONS = [
  { code: 'LGPD',     region: 'Brazil',         lat: '−23.5° S' },
  { code: 'GDPR',     region: 'EU',             lat: '+50.1° N' },
  { code: 'MiCAR',    region: 'EU',             lat: '+50.8° N' },
  { code: 'DPDP',     region: 'India',          lat: '+28.6° N' },
  { code: 'PDPA',     region: 'Singapore',      lat: '+1.3° N'  },
  { code: 'UAE',      region: 'U.A.E.',         lat: '+25.2° N' },
  { code: 'PDPL',     region: 'U.A.E. federal', lat: '+24.5° N' },
  { code: 'POPIA',    region: 'South Africa',   lat: '−26.2° S' },
  { code: 'NDPA',     region: 'Nigeria',        lat: '+9.1° N'  },
  { code: 'CCPA',     region: 'California',     lat: '+37.7° N' },
  { code: 'PIPEDA',   region: 'Canada',         lat: '+43.6° N' },
  { code: 'LAW25',    region: 'Quebec',         lat: '+45.5° N' },
  { code: 'PIPA',     region: 'South Korea',    lat: '+37.5° N' },
  { code: 'PDP',      region: 'Indonesia',      lat: '−6.2° S'  },
  { code: 'APPI',     region: 'Japan',          lat: '+35.7° N' },
  { code: 'LFPDPPP',  region: 'Mexico',         lat: '+19.4° N' },
  { code: 'Decree-13',region: 'Vietnam',        lat: '+21.0° N' },
  { code: 'PDPA-MY',  region: 'Malaysia',       lat: '+3.1° N'  },
];

// ─── Wax Seal ──────────────────────────────────────────────────
export function WaxSeal({
  size = 120,
  label = 'SEALED',
  stamped = true,
  style,
}: { size?: number; label?: string; stamped?: boolean; style?: React.CSSProperties }) {
  const [on, setOn] = React.useState(false);
  React.useEffect(() => {
    if (!stamped) { setOn(false); return; }
    const t = setTimeout(() => setOn(true), 120);
    return () => clearTimeout(t);
  }, [stamped]);
  return (
    <div style={{ width: size, height: size, position: 'relative', ...style }}>
      <svg
        viewBox="0 0 120 120"
        width={size}
        height={size}
        style={{
          transform: on ? 'scale(1) rotate(-6deg)' : 'scale(2.4) rotate(12deg)',
          opacity: on ? 1 : 0,
          transition:
            'transform .55s cubic-bezier(.2,.7,.2,1.4), opacity .35s ease-out',
          transformOrigin: '60px 60px',
          filter:
            'drop-shadow(0 1px 0 rgba(0,0,0,.25)) drop-shadow(0 6px 14px rgba(0,0,0,.15))',
        }}
      >
        <defs>
          <radialGradient id={`waxGrad-${size}`} cx="40%" cy="35%" r="70%">
            <stop offset="0%" stopColor={PALETTE.terracotta} stopOpacity="1" />
            <stop offset="60%" stopColor={PALETTE.terracotta} stopOpacity=".95" />
            <stop offset="100%" stopColor="#7a2a17" stopOpacity="1" />
          </radialGradient>
        </defs>
        <g fill={`url(#waxGrad-${size})`} opacity=".85">
          <path d="M60 6 C 70 12, 82 8, 92 18 C 108 26, 116 44, 112 62 C 118 74, 114 90, 100 104 C 86 118, 66 118, 58 112 C 46 118, 28 114, 20 102 C 6 90, 4 72, 10 58 C 6 40, 18 22, 34 14 C 44 6, 52 8, 60 6 Z" />
        </g>
        <circle cx="60" cy="60" r="42" fill={`url(#waxGrad-${size})`} />
        <circle cx="60" cy="60" r="42" fill="none" stroke="rgba(0,0,0,.25)" strokeWidth=".5" />
        <circle cx="60" cy="60" r="34" fill="none" stroke="rgba(255,255,255,.35)" strokeWidth=".8" />
        <circle cx="60" cy="60" r="30" fill="none" stroke="rgba(0,0,0,.25)" strokeWidth=".5" />
        {[0, 60, 120, 180, 240, 300].map((a) => (
          <g key={a} transform={`rotate(${a} 60 60) translate(60 28)`}>
            <circle r="1.1" fill="rgba(255,255,255,.5)" />
          </g>
        ))}
        <text
          x="60" y="70" textAnchor="middle"
          fontFamily="Fraunces, Georgia, serif"
          fontWeight="700" fontSize="34"
          fill="#fff3e6"
          style={{ letterSpacing: '.02em' }}
        >D</text>
        <defs>
          <path id={`waxArc-${size}`} d="M 60 60 m -26 0 a 26 26 0 1 1 52 0 a 26 26 0 1 1 -52 0" />
        </defs>
        <text
          fontFamily="Fraunces, serif"
          fontSize="5.6"
          fill="rgba(255,240,220,.85)"
          letterSpacing=".32em"
          fontWeight="600"
        >
          <textPath href={`#waxArc-${size}`} startOffset="2%">
            {`${label} · ON SOLANA · COMPLIANCE SEALED · `}
          </textPath>
        </text>
        <ellipse cx="46" cy="42" rx="14" ry="6" fill="rgba(255,255,255,.22)" />
      </svg>
    </div>
  );
}

// ─── Stamp ─────────────────────────────────────────────────────
export function Stamp({
  children, rotate = -4, scale = 1, color, style,
}: { children: React.ReactNode; rotate?: number; scale?: number; color?: string; style?: React.CSSProperties }) {
  const c = color || PALETTE.terracotta;
  return (
    <span style={{
      display: 'inline-block',
      transform: `rotate(${rotate}deg) scale(${scale})`,
      color: c,
      fontFamily: FONTS.display,
      fontWeight: 700,
      letterSpacing: '.04em',
      textTransform: 'uppercase',
      border: `2px solid ${c}`,
      padding: '4px 10px 3px',
      borderRadius: 2,
      textShadow: '0 .5px 0 rgba(255,255,255,.2)',
      opacity: .92,
      ...style,
    }}>{children}</span>
  );
}

// ─── Postal cancellation lines ─────────────────────────────────
export function Cancellation({
  width = 260, lines = 5, color, style,
}: { width?: number; lines?: number; color?: string; style?: React.CSSProperties }) {
  const c = color || PALETTE.terracotta;
  return (
    <svg width={width} height={lines * 4 + 8} style={{ opacity: .55, ...style }}>
      {Array.from({ length: lines }).map((_, i) => (
        <line key={i}
          x1="0" y1={i * 4 + 4}
          x2={width} y2={i * 4 + 4}
          stroke={c} strokeWidth="1" strokeLinecap="round"
          strokeDasharray={i % 2 ? '2 3 8 4' : '6 3 2 5'}
        />
      ))}
    </svg>
  );
}

// ─── Typed terminal ────────────────────────────────────────────
export function SealTerminal({ autoplay = true, speed = 18, style }:
  { autoplay?: boolean; speed?: number; style?: React.CSSProperties }) {
  const lines = React.useMemo(() => ([
    { t: 'prompt', text: '$ npm install dpo2u-sdk' },
    { t: 'sys',    text: 'added 1 package in 1.2s' },
    { t: 'blank',  text: '' },
    { t: 'prompt', text: '$ node' },
    { t: 'js',     text: "> import { DPO2U } from 'dpo2u-sdk'" },
    { t: 'js',     text: "> const dpo2u = new DPO2U({ network: 'solana' })" },
    { t: 'js',     text: "> await dpo2u.attest({ jurisdiction: 'LGPD', subject: 'order_9312' })" },
    { t: 'out',    text: '⌛ proving with SP1 v6 groth16 · 156,128 CU' },
    { t: 'ok',     text: '✓ sealed in 1.94s · $0.00019' },
    { t: 'obj',    text: "{ hash: 'bafkreih6f…k7q', pda: 'SEaL3…x9Q2',\n  jurisdiction: 'LGPD', status: 'sealed' }" },
  ]), []);
  const [n, setN] = React.useState(0);
  const [col, setCol] = React.useState(0);
  React.useEffect(() => {
    if (!autoplay) return;
    if (n >= lines.length) return;
    const full = lines[n].text;
    if (col < full.length) {
      const fast = ['sys', 'ok', 'out', 'obj'].includes(lines[n].t);
      const d = fast ? 6 : speed;
      const id = setTimeout(() => setCol((c) => c + 1), d);
      return () => clearTimeout(id);
    }
    const id = setTimeout(() => {
      setN((v) => v + 1); setCol(0);
    }, lines[n].t === 'blank' ? 120 : 220);
    return () => clearTimeout(id);
  }, [n, col, autoplay, lines, speed]);

  const color = (t: string) => ({
    prompt: PALETTE.ink,
    sys: PALETTE.concrete,
    js: PALETTE.ink,
    out: PALETTE.concrete,
    ok: PALETTE.verdigris,
    obj: PALETTE.terracotta,
    blank: PALETTE.ink,
  }[t] || PALETTE.ink);

  return (
    <div style={{
      background: PALETTE.paper2,
      border: `.5px solid ${PALETTE.ruleStrong}`,
      borderRadius: 4,
      padding: '14px 18px 16px',
      fontFamily: FONTS.mono,
      fontSize: 13,
      lineHeight: 1.7,
      color: PALETTE.ink,
      boxShadow:
        '0 1px 0 rgba(255,255,255,.4) inset, 0 10px 24px rgba(0,0,0,.06)',
      ...style,
    }}>
      <div style={{ display: 'flex', gap: 6, marginBottom: 10, alignItems: 'center' }}>
        <span style={{ width: 9, height: 9, borderRadius: '50%', background: PALETTE.ruleStrong, opacity: .4 }} />
        <span style={{ width: 9, height: 9, borderRadius: '50%', background: PALETTE.ruleStrong, opacity: .4 }} />
        <span style={{ width: 9, height: 9, borderRadius: '50%', background: PALETTE.ruleStrong, opacity: .4 }} />
        <span style={{ marginLeft: 'auto', fontSize: 10, letterSpacing: '.15em', color: PALETTE.concrete }}>~/dpo2u</span>
      </div>
      {lines.slice(0, n).map((l, i) => (
        <div key={i} style={{ color: color(l.t), whiteSpace: 'pre-wrap' }}>
          {l.text || ' '}
        </div>
      ))}
      {n < lines.length && (
        <div style={{ color: color(lines[n].t), whiteSpace: 'pre-wrap' }}>
          {lines[n].text.slice(0, col)}
          <span style={{
            display: 'inline-block', width: 7, height: 14, verticalAlign: -2,
            background: PALETTE.ink, marginLeft: 2,
            animation: 'sealedBlink 1s steps(2) infinite',
          }} />
          <style>{`@keyframes sealedBlink{50%{opacity:0}}`}</style>
        </div>
      )}
    </div>
  );
}

// ─── Attestation object ────────────────────────────────────────
export function Attestation({ style }: { style?: React.CSSProperties }) {
  const [hover, setHover] = React.useState(false);
  const fields: [string, string][] = [
    ['hash',         'bafkreih6f3aq…k7qv'],
    ['pda',          'SEaL3vQ…x9Q2r7'],
    ['jurisdiction', 'LGPD · Art. 37'],
    ['subject',      'order_9312'],
    ['prover',       'SP1 v6 · groth16'],
    ['cu',           '156,128'],
    ['timestamp',    '2026-04-29T14:02:11Z'],
    ['signer',       'DPO2U MCP · mcp.dpo2u.com'],
    ['status',       'SEALED'],
  ];
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative',
        padding: '28px 32px 26px',
        background: PALETTE.paper2,
        border: `.5px solid ${PALETTE.ruleStrong}`,
        borderRadius: 4,
        cursor: 'crosshair',
        ...style,
      }}
    >
      <div style={{
        position: 'absolute', top: 14, right: 18,
        fontFamily: FONTS.mono, fontSize: 10,
        letterSpacing: '.2em', color: PALETTE.concrete,
      }}>ATTESTATION · SEAL 000004821</div>
      <div style={{ position: 'absolute', top: -14, left: 24 }}>
        <WaxSeal size={60} />
      </div>
      <div style={{ height: 16 }} />
      <div style={{
        display: 'grid', gridTemplateColumns: '90px 1fr',
        rowGap: 6, columnGap: 16,
        fontFamily: FONTS.mono, fontSize: 12, color: PALETTE.inkSoft,
      }}>
        {fields.map(([k, v], i) => {
          const isRevealed = hover || i < 3;
          return (
            <React.Fragment key={k}>
              <span style={{
                color: PALETTE.concrete, letterSpacing: '.08em',
                textTransform: 'uppercase', fontSize: 10,
              }}>{k}</span>
              <span style={{
                transition: 'opacity .25s, filter .25s',
                opacity: isRevealed ? 1 : 0,
                filter: isRevealed ? 'blur(0)' : 'blur(4px)',
                transitionDelay: `${i * 30}ms`,
              }}>{v}</span>
            </React.Fragment>
          );
        })}
      </div>
      <div style={{
        marginTop: 18, display: 'flex',
        justifyContent: 'space-between', alignItems: 'flex-end',
      }}>
        <div style={{
          fontFamily: FONTS.display, fontSize: 11, letterSpacing: '.3em',
          color: PALETTE.concrete,
        }}>COMPLIANCE · SEALED · ON SOLANA</div>
        <div style={{
          fontFamily: FONTS.mono, fontSize: 10, color: PALETTE.verdigris,
        }}>✓ VERIFIED</div>
      </div>
      {!hover && (
        <div style={{
          position: 'absolute', bottom: 10, right: 14,
          fontFamily: FONTS.mono, fontSize: 10, color: PALETTE.concrete,
        }}>hover to reveal →</div>
      )}
    </div>
  );
}

// ─── small helpers ─────────────────────────────────────────────
export function SmallLabel({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      fontFamily: FONTS.mono, fontSize: 10, letterSpacing: '.25em',
      textTransform: 'uppercase', color: PALETTE.concrete, ...style,
    }}>{children}</div>
  );
}

export function Rule({ style, color }: { style?: React.CSSProperties; color?: string }) {
  return <div style={{ height: 1, width: '100%', background: color || PALETTE.rule, ...style }} />;
}

export function Button({
  children, kind = 'primary', href = '#', style,
}: { children: React.ReactNode; kind?: 'primary' | 'terracotta' | 'ghost'; href?: string; style?: React.CSSProperties }) {
  const base: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: 10,
    padding: '14px 22px',
    fontFamily: FONTS.body, fontSize: 15, fontWeight: 500,
    borderRadius: 4, textDecoration: 'none', cursor: 'pointer',
    transition: 'all .15s',
  };
  const variants: React.CSSProperties =
    kind === 'primary'
      ? { background: PALETTE.ink, color: PALETTE.paper, border: `1px solid ${PALETTE.ink}` }
      : kind === 'terracotta'
        ? { background: PALETTE.terracotta, color: '#fff3e6', border: `1px solid ${PALETTE.terracotta}` }
        : { background: 'transparent', color: PALETTE.ink, border: `1px solid ${PALETTE.ruleStrong}` };
  return <a href={href} style={{ ...base, ...variants, ...style }}>{children}</a>;
}

// ─── DPO2U wordmark / mark / lockup ────────────────────────────
export function DPO2UWordmark({
  size = 24, color, style,
}: { size?: number; color?: string; style?: React.CSSProperties }) {
  return (
    <span style={{
      fontFamily: FONTS.display, fontWeight: 600,
      fontSize: size, letterSpacing: '-0.025em',
      color: color || PALETTE.ink, lineHeight: 1, ...style,
    }}>
      DP<span style={{ color: PALETTE.terracotta }}>O</span>2U
    </span>
  );
}

// Brand mark uses the terracotta "O" — same treatment as the favicon / avatar / social kit.
export function DPO2UMark({ size = 28, style }: { size?: number; style?: React.CSSProperties }) {
  return <DPO2UWordmark size={size} style={style} />;
}

export function DPO2ULockup({ size = 28, style }: { size?: number; style?: React.CSSProperties }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', ...style }}>
      <DPO2UWordmark size={size} />
    </span>
  );
}

// ─── Caller icon (MCP grid) ────────────────────────────────────
export function CallerIcon({ kind }: {
  kind: 'web2' | 'dapps' | 'exchanges' | 'contracts' | 'agents' | 'institutional';
}) {
  const stroke = PALETTE.inkSoft;
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke={stroke} strokeWidth="1.2">
      {kind === 'web2' && (<>
        <rect x="6" y="9" width="24" height="18" rx="2" />
        <path d="M11 14 L14 17 L11 20" />
        <path d="M16 21 L24 21" />
      </>)}
      {kind === 'contracts' && (<>
        <path d="M9 6 L23 6 L27 10 L27 30 L9 30 Z" />
        <path d="M23 6 L23 10 L27 10" />
        <path d="M13 17 L23 17 M13 21 L23 21 M13 25 L19 25" />
      </>)}
      {kind === 'dapps' && (<>
        <rect x="6" y="8" width="24" height="20" rx="2" />
        <path d="M6 13 L30 13" />
        <circle cx="9" cy="10.5" r=".7" fill={stroke} />
        <circle cx="11.5" cy="10.5" r=".7" fill={stroke} />
        <path d="M12 19 L18 19 M12 22 L22 22 M12 25 L16 25" />
      </>)}
      {kind === 'exchanges' && (<>
        <path d="M8 14 L28 14 M28 14 L24 10 M28 14 L24 18" />
        <path d="M28 22 L8 22 M8 22 L12 18 M8 22 L12 26" />
      </>)}
      {kind === 'agents' && (<>
        <circle cx="18" cy="14" r="6" />
        <circle cx="15.5" cy="13" r=".9" fill={stroke} />
        <circle cx="20.5" cy="13" r=".9" fill={stroke} />
        <path d="M15 16 Q18 18 21 16" />
        <path d="M12 22 L24 22 L26 30 L10 30 Z" />
      </>)}
      {kind === 'institutional' && (<>
        <path d="M6 14 L18 7 L30 14 L30 16 L6 16 Z" />
        <path d="M9 16 L9 27 M15 16 L15 27 M21 16 L21 27 M27 16 L27 27" />
        <path d="M5 30 L31 30" />
      </>)}
    </svg>
  );
}
