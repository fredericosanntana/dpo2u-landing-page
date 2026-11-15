// /app/fi — painel da instituição. Nesta etapa (M1): workspace e próximos passos.
// Passaporte, transferências, grants e faturas entram nos marcos seguintes (E3–E9).
import React from 'react';
import { Link } from 'react-router-dom';
import { useFiSession } from '@/components/fi/FiSession';
import { recallLead } from '@/lib/fi/gateway';
import { FONTS, PALETTE } from '@/components/sealed/atoms';

const card: React.CSSProperties = { background: PALETTE.paper2, border: `.5px solid ${PALETTE.ruleStrong}`, borderRadius: 4, padding: 20 };

export default function FiDashboardPage() {
  const { session } = useFiSession();
  const lead = recallLead();
  if (!session) return null;
  const hasApprover = session.workspace.members.some((m) => m.role === 'approver' && m.status === 'active');
  const steps = [
    { done: true, label: 'Workspace criado' },
    { done: hasApprover, label: 'Aprovador convidado e ativo', to: '/app/fi/workspace' },
    { done: false, label: 'Passaporte da instituição (em breve)' },
  ];
  return (
    <div className="grid gap-6" style={{ maxWidth: 860 }}>
      <h1 style={{ fontFamily: FONTS.display, fontSize: 34, margin: 0 }}>{session.workspace.name}</h1>
      <section style={card}>
        <h2 style={{ fontFamily: FONTS.display, fontSize: 22, margin: 0 }}>Próximos passos</h2>
        <ol className="grid gap-2 mt-3" style={{ paddingLeft: 18 }}>
          {steps.map((s) => (
            <li key={s.label} style={{ color: s.done ? PALETTE.verdigris : PALETTE.ink }}>
              {s.done ? '✓ ' : ''}{s.to && !s.done ? <Link to={s.to}>{s.label}</Link> : s.label}
            </li>
          ))}
        </ol>
      </section>
      {lead && (
        <section style={card}>
          <h2 style={{ fontFamily: FONTS.display, fontSize: 22, margin: 0 }}>Seu diagnóstico</h2>
          <p style={{ marginTop: 6 }}>{lead.report.packs.map((p) => p.id).join(' · ')}</p>
          <p style={{ fontSize: 13, color: PALETTE.concrete }}>{lead.report.totals.gaps} lacunas, {lead.report.totals.critical} críticas</p>
        </section>
      )}
    </div>
  );
}
