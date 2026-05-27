// /pilot/alertas — painel de alertas do Piloto Anticorrupção.
//
// Visualiza os 1.142 alertas reais do run de dados abertos (sanction_check_v1 +
// overpricing_v1): KPIs, histograma de severidade (Z-modificado), cobertura por
// UF, tabela filtrável e a prova on-chain dos alertas atestados na testnet.
//
// Dados: assets estáticos public/pilot/{alerts,stats}.json, gerados por
// scripts/build-pilot-data.mjs a partir do artefato do run (dpo2u-stellar).

import { useEffect, useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { PilotNav } from '@/components/pilot/PilotNav';
import { SmallLabel, Rule, FONTS, PALETTE } from '@/components/sealed/atoms';

interface Alert {
  id: number;
  use_case: 'sanction_check_v1' | 'overpricing_v1';
  verdict: string;
  severity: 'Triagem' | 'Atenção' | 'Alta' | 'Crítica';
  cnpj: string;
  supplier: string;
  organ: string;
  uf: string;
  municipio: string;
  date: string;
  catmat: number | null;
  item: string;
  value: number | null;
  unit_price: number | null;
  z: number | null;
  basket_n: number | null;
  basket_median: number | null;
  prospective: boolean;
  reason: string;
}

interface Attested {
  use_case: string;
  verdict: string;
  supplier: string;
  organ: string;
  uf: string;
  item: string;
  evidence_hash: string;
  tx: string;
  explorer: string;
}

interface Stats {
  generated_at: string;
  contract: string;
  summary: Record<string, number>;
  statistics: {
    sanction: { total: number; fail: number; review: number; prospective_fail: number };
    overpricing: {
      total: number;
      z_bands: Record<string, number>;
      z_median: number;
      z_max: number;
      basket_size: { min: number; median: number; max: number };
    };
    coverage: {
      by_uf: Record<string, number>;
      distinct_uf: number;
      temporal: { earliest: string; latest: string };
    };
  };
  attested: Attested[];
}

const SEV_COLOR: Record<Alert['severity'], string> = {
  Triagem: PALETTE.concrete,
  Atenção: '#C4A962',
  Alta: PALETTE.terracotta,
  Crítica: '#7a2a17',
};

const UC_LABEL: Record<string, string> = {
  sanction_check_v1: 'Sanção',
  overpricing_v1: 'Sobrepreço',
  leniency_flag_v1: 'Leniência',
  divergent_payee_v1: 'Favorecido divergente',
  winner_rotation_v1: 'Rodízio de vencedores',
};
const ucLabel = (id: string): string => UC_LABEL[id] || id;

const PAGE_SIZE = 40;

const mono = (size = 11): React.CSSProperties => ({
  fontFamily: FONTS.mono,
  fontSize: size,
  color: PALETTE.ink,
});

function fmtCnpj(c: string): string {
  if (c.length !== 14) return c;
  return `${c.slice(0, 2)}.${c.slice(2, 5)}.${c.slice(5, 8)}/${c.slice(8, 12)}-${c.slice(12)}`;
}

function KpiCard({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: string }) {
  return (
    <div style={{ border: `1px solid ${PALETTE.rule}`, background: PALETTE.paper, padding: '18px 20px' }}>
      <SmallLabel style={{ marginBottom: 10 }}>{label}</SmallLabel>
      <div style={{ fontFamily: FONTS.display, fontSize: 38, lineHeight: 1, color: accent || PALETTE.ink }}>
        {value}
      </div>
      {sub && <div style={{ ...mono(11), color: PALETTE.concrete, marginTop: 8 }}>{sub}</div>}
    </div>
  );
}

export default function PilotAlertasPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Filtros.
  const [useCase, setUseCase] = useState<string>('all');
  const [severity, setSeverity] = useState<string>('all');
  const [uf, setUf] = useState<string>('all');
  const [query, setQuery] = useState<string>('');
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<Alert | null>(null);

  useEffect(() => {
    document.title = 'Alertas | DPO2U Piloto Anticorrupção';
    Promise.all([
      fetch('/pilot/alerts.json').then((r) => r.json()),
      fetch('/pilot/stats.json').then((r) => r.json()),
    ])
      .then(([a, s]) => {
        setAlerts(a.alerts);
        setStats(s);
      })
      .catch((e) => setError(String(e)));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return alerts.filter((a) => {
      if (useCase !== 'all' && a.use_case !== useCase) return false;
      if (severity !== 'all' && a.severity !== severity) return false;
      if (uf !== 'all' && a.uf !== uf) return false;
      if (q && !(`${a.supplier} ${a.cnpj} ${a.organ} ${a.item}`.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [alerts, useCase, severity, uf, query]);

  useEffect(() => setPage(0), [useCase, severity, uf, query]);

  const pageRows = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  const zBandData = useMemo(() => {
    if (!stats) return [];
    const b = stats.statistics.overpricing.z_bands;
    const map: [string, Alert['severity']][] = [
      ['3.5-10', 'Triagem'],
      ['10-30', 'Atenção'],
      ['30-100', 'Alta'],
      ['>100', 'Crítica'],
    ];
    return map.map(([band, sev]) => ({ band, sev, n: b[band] || 0 }));
  }, [stats]);

  const ufData = useMemo(() => {
    if (!stats) return [];
    return Object.entries(stats.statistics.coverage.by_uf)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12);
  }, [stats]);
  const ufMax = ufData[0]?.[1] || 1;

  const ufOptions = useMemo(
    () => (stats ? Object.keys(stats.statistics.coverage.by_uf).sort() : []),
    [stats],
  );

  if (error) {
    return (
      <main style={{ background: PALETTE.paper, minHeight: '100vh' }}>
        <PilotNav />
        <div className="px-6 lg:px-14 pt-16" style={{ ...mono(13), color: PALETTE.terracotta }}>
          Falha ao carregar os dados do piloto: {error}
        </div>
      </main>
    );
  }

  return (
    <main style={{ background: PALETTE.paper, minHeight: '100vh', paddingBottom: 96 }}>
      <PilotNav />

      {/* Header */}
      <section className="px-6 lg:px-14 pt-[56px] pb-[36px]">
        <div className="mx-auto max-w-[1180px]">
          <SmallLabel style={{ marginBottom: 16 }}>§ Alertas · dados abertos reais · público</SmallLabel>
          <h1
            className="text-[40px] sm:text-[56px] lg:text-[68px]"
            style={{
              fontFamily: FONTS.display,
              fontWeight: 500,
              lineHeight: 0.96,
              letterSpacing: '-.028em',
              margin: 0,
              color: PALETTE.ink,
            }}
          >
            Alertas do <span style={{ fontStyle: 'italic' }}>piloto</span>
            <span style={{ color: PALETTE.terracotta }}>.</span>
          </h1>
          <p
            style={{
              fontFamily: FONTS.body,
              fontSize: 17,
              lineHeight: 1.6,
              marginTop: 22,
              maxWidth: 660,
              color: PALETTE.inkSoft,
            }}
          >
            Irregularidades detectadas sobre compras públicas reais — sanções vigentes
            (CEIS/CNEP/CEPIM) e sobrepreço estatístico (Z-modificado, TCU Acórdão
            1875/2021). Cada alerta é rastreável à compra de origem; os representativos
            estão selados na testnet Stellar.
          </p>
        </div>
      </section>

      {!stats ? (
        <div className="px-6 lg:px-14" style={{ ...mono(12), color: PALETTE.concrete }}>
          carregando run…
        </div>
      ) : (
        <>
          {/* KPIs */}
          <section className="px-6 lg:px-14">
            <div
              className="mx-auto max-w-[1180px] grid gap-px"
              style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', background: PALETTE.rule }}
            >
              <KpiCard
                label="Alertas no run"
                value={(stats.statistics.sanction.total + stats.statistics.overpricing.total).toLocaleString('pt-BR')}
                sub="sobre 14.430 registros reais"
              />
              <KpiCard
                label="Sanção · FAIL"
                value={String(stats.statistics.sanction.fail)}
                sub={`${stats.statistics.sanction.review} em REVIEW`}
                accent={PALETTE.terracotta}
              />
              <KpiCard
                label="FAIL prospectivo"
                value={String(stats.statistics.sanction.prospective_fail)}
                sub="compra após a sanção"
                accent="#7a2a17"
              />
              <KpiCard
                label="Sobrepreço · FAIL"
                value={stats.statistics.overpricing.total.toLocaleString('pt-BR')}
                sub={`Z mediana ${stats.statistics.overpricing.z_median.toFixed(1)} · máx ${stats.statistics.overpricing.z_max.toFixed(0)}`}
                accent={PALETTE.terracotta}
              />
              <KpiCard
                label="Selados on-chain"
                value={String(stats.attested.length)}
                sub="testnet Stellar · verificável"
                accent={PALETTE.verdigris}
              />
            </div>
          </section>

          {/* Charts */}
          <section className="px-6 lg:px-14 pt-[44px]">
            <div className="mx-auto max-w-[1180px] grid gap-10" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))' }}>
              {/* Z histogram */}
              <div>
                <SmallLabel style={{ marginBottom: 6 }}>Sobrepreço · severidade por Z-modificado</SmallLabel>
                <p style={{ ...mono(10), color: PALETTE.concrete, margin: '0 0 12px' }}>
                  threshold 3,5 é piso de triagem — a fila do auditor prioriza as faixas altas
                </p>
                <div style={{ height: 220, border: `1px solid ${PALETTE.rule}`, padding: '12px 8px 4px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={zBandData} margin={{ top: 4, right: 8, bottom: 4, left: 0 }}>
                      <XAxis
                        dataKey="band"
                        tick={{ fontFamily: FONTS.mono, fontSize: 10, fill: PALETTE.concrete }}
                        axisLine={{ stroke: PALETTE.rule }}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fontFamily: FONTS.mono, fontSize: 10, fill: PALETTE.concrete }}
                        axisLine={false}
                        tickLine={false}
                        width={36}
                      />
                      <Tooltip
                        cursor={{ fill: PALETTE.paper2 }}
                        contentStyle={{ fontFamily: FONTS.mono, fontSize: 11, border: `1px solid ${PALETTE.ink}` }}
                        formatter={(v: number, _n, p: { payload?: { sev?: string } }) => [`${v} alertas`, p.payload?.sev]}
                      />
                      <Bar dataKey="n" radius={[2, 2, 0, 0]}>
                        {zBandData.map((d) => (
                          <Cell key={d.band} fill={SEV_COLOR[d.sev]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* UF coverage */}
              <div>
                <SmallLabel style={{ marginBottom: 6 }}>Cobertura geográfica · top 12 UFs</SmallLabel>
                <p style={{ ...mono(10), color: PALETTE.concrete, margin: '0 0 12px' }}>
                  {stats.statistics.coverage.distinct_uf} UFs · janela{' '}
                  {stats.statistics.coverage.temporal.earliest} a {stats.statistics.coverage.temporal.latest}
                </p>
                <div style={{ border: `1px solid ${PALETTE.rule}`, padding: '12px 14px' }}>
                  {ufData.map(([code, n]) => (
                    <div key={code} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 7 }}>
                      <span style={{ ...mono(11), width: 28 }}>{code}</span>
                      <div style={{ flex: 1, height: 10, background: PALETTE.paper2 }}>
                        <div style={{ width: `${(n / ufMax) * 100}%`, height: '100%', background: PALETTE.terracotta }} />
                      </div>
                      <span style={{ ...mono(10), color: PALETTE.concrete, width: 36, textAlign: 'right' }}>{n}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Filtros + tabela */}
          <section className="px-6 lg:px-14 pt-[44px]">
            <div className="mx-auto max-w-[1180px]">
              <SmallLabel style={{ marginBottom: 14 }}>
                Alertas · {filtered.length.toLocaleString('pt-BR')} de {alerts.length.toLocaleString('pt-BR')}
              </SmallLabel>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
                <Select value={useCase} onChange={setUseCase} options={[
                  ['all', 'Todos os use cases'],
                  ['sanction_check_v1', 'Sanção'],
                  ['overpricing_v1', 'Sobrepreço'],
                  ['leniency_flag_v1', 'Leniência'],
                ]} />
                <Select value={severity} onChange={setSeverity} options={[
                  ['all', 'Toda severidade'],
                  ['Crítica', 'Crítica'],
                  ['Alta', 'Alta'],
                  ['Atenção', 'Atenção'],
                  ['Triagem', 'Triagem'],
                ]} />
                <Select value={uf} onChange={setUf} options={[['all', 'Todas as UFs'], ...ufOptions.map((u) => [u, u] as [string, string])]} />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="fornecedor, CNPJ, órgão, item…"
                  style={{
                    ...mono(11),
                    flex: '1 1 200px',
                    padding: '7px 10px',
                    border: `1px solid ${PALETTE.rule}`,
                    background: PALETTE.paper,
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ border: `1px solid ${PALETTE.ink}`, overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', ...mono(11) }}>
                  <thead>
                    <tr style={{ background: PALETTE.ink, color: PALETTE.paper }}>
                      {['Severidade', 'Use case', 'Fornecedor', 'Órgão', 'UF', 'Data', 'Sinal'].map((h) => (
                        <th key={h} style={{ textAlign: 'left', padding: '8px 10px', fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', fontWeight: 400 }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {pageRows.map((a) => (
                      <tr
                        key={a.id}
                        onClick={() => setSelected(a)}
                        style={{ borderTop: `1px solid ${PALETTE.rule}`, cursor: 'pointer' }}
                      >
                        <td style={{ padding: '8px 10px' }}>
                          <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: SEV_COLOR[a.severity], marginRight: 7 }} />
                          {a.severity}
                          {a.prospective && <span style={{ color: '#7a2a17', marginLeft: 6 }}>· prosp.</span>}
                        </td>
                        <td style={{ padding: '8px 10px', color: PALETTE.concrete }}>
                          {ucLabel(a.use_case)}
                        </td>
                        <td style={{ padding: '8px 10px', maxWidth: 240, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {a.supplier}
                        </td>
                        <td style={{ padding: '8px 10px', maxWidth: 220, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: PALETTE.concrete }}>
                          {a.organ}
                        </td>
                        <td style={{ padding: '8px 10px' }}>{a.uf}</td>
                        <td style={{ padding: '8px 10px', color: PALETTE.concrete }}>{a.date}</td>
                        <td style={{ padding: '8px 10px' }}>
                          {a.use_case === 'overpricing_v1'
                            ? `Z ${a.z}`
                            : a.verdict}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Paginação */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 14, ...mono(11) }}>
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  style={pagerBtn(page === 0)}
                >
                  ← anterior
                </button>
                <span style={{ color: PALETTE.concrete }}>
                  página {page + 1} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  style={pagerBtn(page >= totalPages - 1)}
                >
                  próxima →
                </button>
              </div>
            </div>
          </section>

          {/* Atestados on-chain */}
          <section className="px-6 lg:px-14 pt-[52px]">
            <div className="mx-auto max-w-[1180px]">
              <SmallLabel style={{ marginBottom: 6 }}>Prova on-chain · testnet Stellar</SmallLabel>
              <p style={{ ...mono(10), color: PALETTE.concrete, margin: '0 0 16px' }}>
                contrato {stats.contract.slice(0, 10)}… · qualquer auditor verifica sem credencial
              </p>
              <div style={{ display: 'grid', gap: 1, background: PALETTE.rule }}>
                {stats.attested.map((at) => (
                  <a
                    key={at.tx}
                    href={at.explorer}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'block',
                      background: PALETTE.paper,
                      padding: '14px 16px',
                      textDecoration: 'none',
                      color: PALETTE.ink,
                    }}
                  >
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'baseline' }}>
                      <span
                        style={{
                          ...mono(10),
                          color: PALETTE.paper,
                          background: at.verdict === 'Review' ? PALETTE.concrete : PALETTE.terracotta,
                          padding: '2px 7px',
                          textTransform: 'uppercase',
                          letterSpacing: '.08em',
                        }}
                      >
                        {at.verdict}
                      </span>
                      <span style={{ fontFamily: FONTS.body, fontSize: 14 }}>{at.supplier}</span>
                      <span style={{ ...mono(10), color: PALETTE.concrete }}>
                        {ucLabel(at.use_case)}{at.uf ? ` · ${at.uf}` : ''}
                      </span>
                    </div>
                    <div style={{ ...mono(10), color: PALETTE.verdigris, marginTop: 6, wordBreak: 'break-all' }}>
                      tx {at.tx}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* Drill-down */}
      {selected && <AlertDetail alert={selected} onClose={() => setSelected(null)} />}
    </main>
  );
}

function pagerBtn(disabled: boolean): React.CSSProperties {
  return {
    fontFamily: FONTS.mono,
    fontSize: 11,
    padding: '6px 12px',
    border: `1px solid ${disabled ? PALETTE.rule : PALETTE.ink}`,
    background: PALETTE.paper,
    color: disabled ? PALETTE.concrete : PALETTE.ink,
    cursor: disabled ? 'default' : 'pointer',
  };
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: [string, string][];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        fontFamily: FONTS.mono,
        fontSize: 11,
        padding: '7px 10px',
        border: `1px solid ${PALETTE.rule}`,
        background: PALETTE.paper,
        color: PALETTE.ink,
        outline: 'none',
      }}
    >
      {options.map(([v, label]) => (
        <option key={v} value={v}>
          {label}
        </option>
      ))}
    </select>
  );
}

function AlertDetail({ alert, onClose }: { alert: Alert; onClose: () => void }) {
  const rows: [string, string][] = [
    ['Fornecedor', alert.supplier],
    ['CNPJ', fmtCnpj(alert.cnpj)],
    ['Órgão comprador', alert.organ],
    ['Município / UF', `${alert.municipio} · ${alert.uf}`],
    ['Data da compra', alert.date],
    ['Item (CATMAT)', `${alert.item}${alert.catmat ? ` · ${alert.catmat}` : ''}`],
  ];
  if (alert.use_case === 'overpricing_v1') {
    rows.push(['Preço unitário', alert.unit_price != null ? `R$ ${alert.unit_price.toFixed(4)}` : '—']);
    rows.push([
      'Mediana de mercado',
      alert.basket_median != null ? `R$ ${alert.basket_median.toFixed(4)} (cesta n=${alert.basket_n})` : '—',
    ]);
    rows.push(['Z-modificado', alert.z != null ? String(alert.z) : '—']);
  } else {
    rows.push(['Valor da compra', alert.value != null ? `R$ ${alert.value.toLocaleString('pt-BR')}` : '—']);
    rows.push(['Veredito', alert.verdict]);
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(12,13,16,.55)',
        display: 'flex',
        justifyContent: 'flex-end',
        zIndex: 60,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 'min(480px, 92vw)',
          background: PALETTE.paper,
          height: '100%',
          overflowY: 'auto',
          padding: '28px 26px',
          borderLeft: `1px solid ${PALETTE.ink}`,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <SmallLabel>
            {ucLabel(alert.use_case)} · {alert.severity}
          </SmallLabel>
          <button
            onClick={onClose}
            style={{ ...mono(13), border: 'none', background: 'none', cursor: 'pointer', color: PALETTE.concrete }}
          >
            ✕
          </button>
        </div>
        <h2
          style={{
            fontFamily: FONTS.display,
            fontSize: 26,
            lineHeight: 1.1,
            margin: '14px 0 4px',
            color: PALETTE.ink,
          }}
        >
          {alert.supplier}
        </h2>
        {alert.prospective && (
          <div style={{ ...mono(10), color: '#7a2a17', marginBottom: 8 }}>
            FAIL prospectivo — compra posterior ao início da sanção
          </div>
        )}
        <Rule style={{ margin: '16px 0' }} />
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            {rows.map(([k, v]) => (
              <tr key={k} style={{ verticalAlign: 'top' }}>
                <td style={{ ...mono(10), color: PALETTE.concrete, padding: '5px 12px 5px 0', whiteSpace: 'nowrap', textTransform: 'uppercase', letterSpacing: '.08em' }}>
                  {k}
                </td>
                <td style={{ fontFamily: FONTS.body, fontSize: 13, color: PALETTE.ink, padding: '5px 0' }}>{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Rule style={{ margin: '16px 0' }} />
        <SmallLabel style={{ marginBottom: 8 }}>Motivo do flag</SmallLabel>
        <p style={{ fontFamily: FONTS.body, fontSize: 13, lineHeight: 1.55, color: PALETTE.inkSoft, margin: 0 }}>
          {alert.reason}
        </p>
        <Rule style={{ margin: '16px 0' }} />
        <SmallLabel style={{ marginBottom: 8 }}>Ação sugerida — pedido LAI</SmallLabel>
        <p style={{ fontFamily: FONTS.body, fontSize: 13, lineHeight: 1.55, color: PALETTE.inkSoft, margin: 0 }}>
          {alert.use_case === 'overpricing_v1'
            ? 'Solicitar ao órgão a pesquisa de preços que fundamentou a contratação (Lei 14.133/2021, art. 23).'
            : 'Solicitar ao órgão o processo administrativo da contratação e a verificação de idoneidade do fornecedor (Lei 12.527/2011).'}
        </p>
      </div>
    </div>
  );
}
