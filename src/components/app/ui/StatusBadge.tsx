// StatusBadge — selo de status honesto (Live testnet / Roadmap / Gated), no estilo
// selado. Lê o vocabulário do status-registry (fonte = auditoria). Usado em todo o /app.
import React from 'react';
import { PALETTE, FONTS } from '@/components/sealed/atoms';
import type { Status } from '@/lib/status-registry';
import { STATUS_LABEL } from '@/lib/status-registry';

const TONE: Record<Status, { fg: string; bd: string; bg: string; dot: string }> = {
  live: { fg: PALETTE.verdigris, bd: PALETTE.verdigris, bg: 'rgba(58,110,90,.08)', dot: PALETTE.verdigris },
  roadmap: { fg: PALETTE.concrete, bd: PALETTE.ruleStrong, bg: 'transparent', dot: PALETTE.concrete },
  gated: { fg: PALETTE.terracotta, bd: PALETTE.terracotta, bg: 'rgba(200,92,59,.07)', dot: PALETTE.terracotta },
};

export function StatusBadge({ status, label }: { status: Status; label?: string }) {
  const t = TONE[status];
  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        fontFamily: FONTS.mono, fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase',
        color: t.fg, border: `1px solid ${t.bd}`, background: t.bg, borderRadius: 999, padding: '3px 9px',
      }}
    >
      <span aria-hidden style={{ width: 6, height: 6, borderRadius: '50%', background: t.dot, display: 'inline-block' }} />
      {label ?? STATUS_LABEL[status]}
    </span>
  );
}
