// /app/fi — painel da instituição (E9): passaporte e dias restantes, patrocínios,
// transferências de 30 dias, casos, grants do supervisor e plano. Próximos passos no topo.
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useFiSession } from '@/components/fi/FiSession';
import { dashboardApi, recallLead, type DashboardView } from '@/lib/fi/gateway';
import { FONTS, PALETTE } from '@/components/sealed/atoms';

const card: React.CSSProperties = { background: PALETTE.paper2, border: `.5px solid ${PALETTE.ruleStrong}`, borderRadius: 4, padding: 20 };
const h2: React.CSSProperties = { fontFamily: FONTS.display, fontSize: 22, margin: 0 };
const muted: React.CSSProperties = { fontSize: 13, color: PALETTE.concrete };

const STATUS: Record<string, string> = { valid: 'válido', expired: 'vencido', suspended: 'suspenso', revoked: 'revogado', proposed: 'proposto', active: 'ativo', ended: 'encerrado', cleared: 'liberadas', blocked: 'bloqueadas', held: 'retidas', released: 'liberadas no caso', kept_blocked: 'mantidas bloqueadas' };
const tr = (k: string) => STATUS[k] ?? k;
const fmt = (iso?: string) => (iso ? new Date(iso).toLocaleDateString('pt-BR') : '-');
const counts = (m: Record<string, number>) => Object.entries(m).map(([k, v]) => `${v} ${tr(k)}`).join(' · ') || 'nenhum';

function Tile({ title, to, children, testid }: { title: string; to: string; children: React.ReactNode; testid: string }) {
  return (
    <section style={card} data-testid={testid}>
      <h2 style={h2}><Link to={to}>{title}</Link></h2>
      <div className="mt-3 grid gap-1">{children}</div>
    </section>
  );
}

export default function FiDashboardPage() {
  const { session } = useFiSession();
  const lead = recallLead();
  const [d, setD] = useState<DashboardView | null>(null);
  const [err, setErr] = useState(false);
  useEffect(() => {
    if (session) dashboardApi.get().then(setD, () => setErr(true));
  }, [session]);
  if (!session) return null;

  const hasApprover = session.workspace.members.some((m) => m.role === 'approver' && m.status === 'active');
  const valid = d?.passports.items.find((p) => p.status === 'valid');
  const steps = [
    { done: true, label: 'Workspace criado' },
    { done: hasApprover, label: 'Aprovador convidado e ativo', to: '/app/fi/workspace' },
    { done: !!valid, label: 'Ter um passaporte válido', to: '/app/fi/passport' },
    { done: (d?.transfers_30d.total ?? 0) > 0, label: 'Mandar a primeira transferência pela API', to: '/app/fi/cases' },
  ];
  const b = d?.billing;

  return (
    <div className="grid gap-6" style={{ maxWidth: 960 }}>
      <h1 style={{ fontFamily: FONTS.display, fontSize: 34, margin: 0 }}>{session.workspace.name}</h1>
      {steps.some((s) => !s.done) && (
        <section style={card}>
          <h2 style={h2}>Próximos passos</h2>
          <ol className="grid gap-2 mt-3" style={{ paddingLeft: 18 }}>
            {steps.map((s) => (
              <li key={s.label} style={{ color: s.done ? PALETTE.verdigris : PALETTE.ink }}>
                {s.done ? '✓ ' : ''}{s.to && !s.done ? <Link to={s.to}>{s.label}</Link> : s.label}
              </li>
            ))}
          </ol>
        </section>
      )}
      {err && <p role="alert" style={{ color: PALETTE.terracotta }}>Não deu para carregar o painel agora.</p>}
      {d && (
        <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
          <Tile title="Passaporte" to="/app/fi/passport" testid="dash-passport">
            {valid ? (
              <>
                <p style={{ margin: 0, fontSize: 28, fontFamily: FONTS.display }} data-testid="dash-days-left">{valid.days_left} dias</p>
                <p style={muted}>válido até {fmt(valid.expires_at)} · {valid.tier}</p>
              </>
            ) : (
              <p style={{ margin: 0 }} data-testid="dash-passport-status">{d.passports.items[0] ? `Último ${tr(d.passports.items[0].status)} em ${fmt(d.passports.items[0].expires_at)}` : 'Nenhum passaporte ainda'}</p>
            )}
            {d.passports.pending_reviews > 0 && <p style={muted}>{d.passports.pending_reviews} em revisão</p>}
          </Tile>
          <Tile title="Patrocínios" to="/app/fi/sponsorships" testid="dash-sponsorships">
            <p style={{ margin: 0 }}>Como licenciada: {counts(d.sponsorships.as_sponsor)}</p>
            <p style={{ margin: 0 }}>Como parceiro: {counts(d.sponsorships.as_partner)}</p>
          </Tile>
          <Tile title="Transferências (30 dias)" to="/app/fi/cases" testid="dash-transfers">
            <p style={{ margin: 0, fontSize: 28, fontFamily: FONTS.display }}>{d.transfers_30d.total}</p>
            <p style={muted}>{counts(d.transfers_30d.by_status)}</p>
            {d.transfers_30d.dust_spent > 0 && <p style={muted}>{d.transfers_30d.dust_spent} DUST na Midnight</p>}
          </Tile>
          <Tile title="Casos" to="/app/fi/cases" testid="dash-cases">
            <p style={{ margin: 0 }}>{d.cases.open} abertos</p>
            {d.cases.overdue > 0 && <p style={{ margin: 0, color: PALETTE.terracotta }}>{d.cases.overdue} com prazo vencido</p>}
          </Tile>
          <Tile title="Supervisor" to="/app/fi/disclosure" testid="dash-grants">
            <p style={{ margin: 0 }}>{d.grants.active} acessos ativos</p>
            {d.grants.pending > 0 && <p style={muted}>{d.grants.pending} esperando aprovação</p>}
          </Tile>
          {b && (
            <Tile title="Plano" to="/app/fi/billing" testid="dash-billing">
              <p style={{ margin: 0 }}>
                {b.state === 'trial' ? `Trial: ${b.days_left} dias` : b.state === 'active' ? `${b.plan?.name} até ${fmt(b.plan?.paid_through)}` : 'Sem plano ativo'}
              </p>
              {b.invoices.length > 0 && <p style={muted}>última fatura {fmt(b.invoices[b.invoices.length - 1].paid_at)}, US$ {b.invoices[b.invoices.length - 1].amount_usd.toLocaleString('pt-BR')}</p>}
            </Tile>
          )}
        </div>
      )}
      {lead && (
        <section style={card}>
          <h2 style={h2}>Seu diagnóstico</h2>
          <p style={{ marginTop: 6 }}>{lead.report.packs.map((p) => p.id).join(' · ')}</p>
          <p style={muted}>{lead.report.totals.gaps} lacunas, {lead.report.totals.critical} críticas</p>
        </section>
      )}
    </div>
  );
}
