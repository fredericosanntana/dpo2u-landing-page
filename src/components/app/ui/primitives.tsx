// Sealed app UI primitives — brand-styled building blocks shared by every /app
// screen. Replaces the ~30 copy-pasted inline button/input/table styles with a
// small, consistent, accessible set. Visual language follows sealed/atoms.tsx.
import React from 'react';
import { FONTS, PALETTE, SmallLabel } from '@/components/sealed/atoms';
import './ui.css';

export type BtnVariant = 'ink' | 'terracotta' | 'ghost';
export type BtnSize = 'sm' | 'md';

/** Class string for the sealed button look — reuse on <Link>/<a> for navigation CTAs. */
export function btnClass(variant: BtnVariant = 'ink', size: BtnSize = 'md'): string {
  return `appui-btn appui-btn--${variant}${size === 'sm' ? ' appui-btn--sm' : ''}`;
}

export interface AppButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  variant?: BtnVariant;
  size?: BtnSize;
  type?: 'button' | 'submit';
  disabled?: boolean;
  loading?: boolean;
  title?: string;
  className?: string;
  style?: React.CSSProperties;
}

/** Action button (onClick). For navigation, use `<Link className={btnClass(...)}>`. */
export function AppButton({
  children, onClick, variant = 'ink', size = 'md', type = 'button',
  disabled = false, loading = false, title, className, style,
}: AppButtonProps) {
  const isOff = disabled || loading;
  return (
    <button
      type={type}
      title={title}
      onClick={onClick}
      disabled={isOff}
      aria-disabled={isOff || undefined}
      aria-busy={loading || undefined}
      className={`${btnClass(variant, size)}${className ? ` ${className}` : ''}`}
      style={style}
    >
      {loading && <Spinner size={size === 'sm' ? 12 : 14} />}
      {children}
    </button>
  );
}

/** Inline spinner — inherits currentColor so it reads on any button. */
export function Spinner({ size = 16, color }: { size?: number; color?: string }) {
  return (
    <span
      aria-hidden
      className="appui-spin"
      style={{
        width: size, height: size, borderRadius: '50%', display: 'inline-block',
        border: `2px solid ${color ? 'transparent' : 'rgba(127,127,127,.35)'}`,
        borderTopColor: color ?? PALETTE.terracotta, flex: 'none',
      }}
    />
  );
}

/** Bordered panel — the repeated `border .5px ruleStrong, radius 4, paper2 bg` pattern. */
export function Card({
  children, accent, className, style,
}: {
  children: React.ReactNode;
  accent?: 'rule' | 'verdigris' | 'terracotta';
  className?: string;
  style?: React.CSSProperties;
}) {
  const border =
    accent === 'verdigris' ? PALETTE.verdigris
    : accent === 'terracotta' ? PALETTE.terracotta
    : PALETTE.ruleStrong;
  const bg =
    accent === 'verdigris' ? 'rgba(74,124,116,.08)'
    : accent === 'terracotta' ? 'rgba(193,84,57,.06)'
    : PALETTE.paper2;
  return (
    <div
      className={className}
      style={{ border: `1px solid ${border}`, borderRadius: 4, background: bg, padding: 24, ...style }}
    >
      {children}
    </div>
  );
}

/** Labeled text input with optional hint + error. */
export function Field({
  label, hint, error, children,
}: {
  label: string;
  hint?: string;
  error?: string | null;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <SmallLabel>{label}</SmallLabel>
      {children}
      {error
        ? <span style={{ fontFamily: FONTS.mono, fontSize: 11, color: PALETTE.terracotta }}>{error}</span>
        : hint
          ? <span className="text-[11px]" style={{ color: PALETTE.concrete }}>{hint}</span>
          : null}
    </label>
  );
}

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }>(
  function Input({ invalid, className, ...rest }, ref) {
    return (
      <input
        ref={ref}
        aria-invalid={invalid || undefined}
        className={`appui-input${className ? ` ${className}` : ''}`}
        {...rest}
      />
    );
  },
);

/** 2–4 up metric strip (the repeated KPI grid). */
export function KpiGrid({ items }: { items: Array<{ value: React.ReactNode; label: string }> }) {
  return (
    <div
      className="grid grid-cols-2 lg:grid-cols-4"
      style={{ borderTop: `.5px solid ${PALETTE.ruleStrong}`, borderBottom: `.5px solid ${PALETTE.ruleStrong}` }}
    >
      {items.map((it, i) => (
        <div key={it.label} style={{ padding: '20px 18px', borderRight: i < items.length - 1 ? `.5px solid ${PALETTE.rule}` : 'none' }}>
          <div style={{ fontFamily: FONTS.display, fontWeight: 500, fontSize: 30, letterSpacing: '-.02em' }}>{it.value}</div>
          <SmallLabel style={{ marginTop: 6 }}>{it.label}</SmallLabel>
        </div>
      ))}
    </div>
  );
}

export type Tone = 'info' | 'success' | 'error';

const TONE = {
  info: { border: PALETTE.ruleStrong, bg: PALETTE.paper2, glyph: '' },
  success: { border: PALETTE.verdigris, bg: 'rgba(74,124,116,.08)', glyph: '✓ ' },
  error: { border: PALETTE.terracotta, bg: 'rgba(193,84,57,.06)', glyph: '⚠ ' },
} as const;

/** Inline status banner (replaces ad-hoc err/ok strings). role=status for SR. */
export function Banner({ tone = 'info', children, glyph = true }: { tone?: Tone; children: React.ReactNode; glyph?: boolean }) {
  const t = TONE[tone];
  return (
    <div
      role="status"
      className="p-3 text-[13px]"
      style={{ border: `1px solid ${t.border}`, borderRadius: 4, background: t.bg, color: PALETTE.inkSoft, fontFamily: FONTS.mono }}
    >
      {glyph ? t.glyph : ''}{children}
    </div>
  );
}

/** Small pill — verdict/status chips. */
export function Badge({ tone = 'neutral', children }: { tone?: 'neutral' | 'success' | 'error' | 'experimental'; children: React.ReactNode }) {
  const color =
    tone === 'success' ? PALETTE.verdigris
    : tone === 'error' ? PALETTE.terracotta
    : tone === 'experimental' ? '#c4a962'
    : PALETTE.concrete;
  return (
    <span style={{ fontFamily: FONTS.mono, fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', color, border: `1px solid ${color}`, borderRadius: 999, padding: '2px 9px', whiteSpace: 'nowrap' }}>
      {children}
    </span>
  );
}

/** Horizontal step indicator for long operations (connect → pay → anchor). */
export function ProgressSteps({ steps, current, failed = false }: { steps: string[]; current: number; failed?: boolean }) {
  return (
    <div className="flex items-center gap-2 flex-wrap" style={{ fontFamily: FONTS.mono, fontSize: 11 }}>
      {steps.map((s, i) => {
        const done = i < current;
        const active = i === current;
        const isFail = failed && active;
        const color = isFail ? PALETTE.terracotta : done ? PALETTE.verdigris : active ? PALETTE.ink : PALETTE.concrete;
        return (
          <React.Fragment key={s}>
            {i > 0 && <span style={{ width: 16, height: 1, background: PALETTE.rule }} />}
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color }}>
              <span style={{ width: 16, height: 16, borderRadius: '50%', border: `1.5px solid ${color}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 9 }}>
                {done ? '✓' : isFail ? '✕' : i + 1}
              </span>
              {active && !done ? <Spinner size={11} color={isFail ? PALETTE.terracotta : PALETTE.ink} /> : null}
              <span style={{ textTransform: 'uppercase', letterSpacing: '.1em' }}>{s}</span>
            </span>
          </React.Fragment>
        );
      })}
    </div>
  );
}

/** Skeleton placeholder block. */
export function Skeleton({ width = '100%', height = 14, style }: { width?: number | string; height?: number; style?: React.CSSProperties }) {
  return <div className="animate-pulse" style={{ width, height, borderRadius: 4, background: PALETTE.paper2, ...style }} />;
}
