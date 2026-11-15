// Projeta os artefatos de run do piloto (dpo2u-stellar) em dois JSONs estáticos
// servidos como assets do site para o painel /pilot/alertas.
//
//   public/pilot/alerts.json  — lista enxuta dos alertas (tabela + filtros)
//   public/pilot/stats.json   — panorama estatístico + alertas atestados on-chain
//
// Fontes: o run v2 (sanção + sobrepreço) e o run gov.br (leniência). Todos os
// dados já são públicos (Compras.gov.br, Portal da Transparência).
//
// Uso: node scripts/build-pilot-data.mjs

import fs from 'node:fs';
import path from 'node:path';
// LGPD: remove nomes de pessoas físicas (firmas individuais) dos dados públicos.
import { redactAlert, redactAttested } from './redact-pilot-pii.mjs';

const RUNS = '/root/dpo2u-stellar/docs/demos/runs';
const FULL = path.join(RUNS, '2026-05-21-real-pilot-alerts-full.json');
const MAIN = path.join(RUNS, '2026-05-21-real-pilot.json');
const LENIENCY = path.join(RUNS, '2026-05-21-leniency-check.json');
// Sprint M (2026-05-26): scan PNCP nacional via proxy Tailscale — vencedoras
// sancionadas (CEIS/CNEP/CEPIM) em qualquer plataforma de pregão.
const SANCTION_PNCP = '/tmp/sanction-pncp-90d.json';
const OUT = path.join(process.cwd(), 'public', 'pilot');

const zOf = (a) => {
  const o4 = a.predicate_results?.find((p) => p.id === 'o4_not_statistical_outlier');
  const m = o4?.reason.match(/Z-modificado (-?[\d.]+)/);
  return m ? Math.abs(Number(m[1])) : 0;
};

// Faixa de severidade — alinhada ao relatório v2 §6.2.
function severity(a) {
  if (a.use_case === 'overpricing_v1') {
    const z = zOf(a);
    if (z >= 100) return 'Crítica';
    if (z >= 30) return 'Alta';
    if (z >= 10) return 'Atenção';
    return 'Triagem';
  }
  if (a.evidence.prospective) return 'Crítica';
  if (a.verdict === 'FAIL') return 'Alta';
  return a.verdict === 'REVIEW' ? 'Atenção' : 'Triagem';
}

function mainReason(a) {
  if (a.use_case === 'overpricing_v1') {
    return a.predicate_results.find((p) => p.id === 'o4_not_statistical_outlier')?.reason || '';
  }
  return a.predicate_results.find((p) => p.verdict !== 'PASS')?.reason || '';
}

function leanAlert(a, i) {
  const e = a.evidence;
  const isLeniency = a.use_case === 'leniency_flag_v1';
  const leniencyOrgan = Array.isArray(e.leniency_hits) && e.leniency_hits[0]
    ? e.leniency_hits[0].orgaoResponsavel
    : '';
  return {
    id: i,
    use_case: a.use_case,
    verdict: a.verdict,
    severity: severity(a),
    cnpj: e.supplier_cnpj || '',
    supplier: e.supplier_name || '',
    organ: e.organ || leniencyOrgan || '',
    uf: e.uf || '',
    municipio: e.municipio || '',
    date: e.purchase_date || '',
    catmat: e.catmat ?? null,
    item: e.item_desc || (isLeniency ? 'Acordo de leniência — Lei 12.846' : ''),
    value: typeof e.value === 'number' ? e.value : null,
    unit_price: typeof e.unit_price === 'number' ? e.unit_price : null,
    z: a.use_case === 'overpricing_v1' ? Number(zOf(a).toFixed(2)) : null,
    basket_n: e.basket?.n ?? null,
    basket_median: e.basket?.median ?? null,
    prospective: e.prospective === true || e.still_contracting === true,
    reason: mainReason(a),
  };
}

const full = JSON.parse(fs.readFileSync(FULL, 'utf8'));
const main = JSON.parse(fs.readFileSync(MAIN, 'utf8'));
const leniency = fs.existsSync(LENIENCY) ? JSON.parse(fs.readFileSync(LENIENCY, 'utf8')) : { alerts: [], attested_alerts: [] };

let idx = 0;
const alerts = [
  ...full.sanction_alerts.map((a) => leanAlert(a, idx++)),
  ...full.overpricing_alerts.map((a) => leanAlert(a, idx++)),
  ...(leniency.alerts || []).map((a) => leanAlert(a, idx++)),
];

// Sprint M: integra alertas do scan PNCP nacional (sanção × vencedora D+0).
const sanctionPncp = fs.existsSync(SANCTION_PNCP) ? JSON.parse(fs.readFileSync(SANCTION_PNCP, 'utf8')) : { alerts: [] };
for (const a of (sanctionPncp.alerts || [])) {
  alerts.push({
    id: idx++,
    use_case: 'sanction_check_v1',
    verdict: 'FAIL',
    severity: 'Crítica',
    cnpj: a.vencedora?.cnpj || '',
    supplier: a.vencedora?.nome || '',
    organ: a.orgao,
    uf: a.uf,
    municipio: a.municipio,
    date: (a.dataPublicacaoPncp || '').slice(0, 10),
    catmat: null,
    item: (a.objeto || '').slice(0, 80),
    value: a.valor_homologado || null,
    unit_price: null,
    z: null,
    basket_n: null,
    basket_median: null,
    prospective: true,
    reason: `Vencedora sancionada em ${a.sanctions_active.map((s) => `${s.list.toUpperCase()} (${s.categoria}, ${s.dataInicio}→${s.dataFinal || 'vigente'})`).join('; ')}. PNCP: ${a.contratacaoId}.`,
  });
}

function attestedRow(a) {
  return {
    use_case: a.use_case,
    verdict: a.verdict,
    supplier: a.evidence.supplier_name || a.evidence.payee_name || '',
    organ: a.evidence.organ
      || (Array.isArray(a.evidence.leniency_hits) && a.evidence.leniency_hits[0]
        ? a.evidence.leniency_hits[0].orgaoResponsavel : '') || '',
    uf: a.evidence.uf || '',
    item: a.evidence.item_desc || (a.use_case === 'leniency_flag_v1' ? 'Acordo de leniência' : ''),
    evidence_hash: a.attestation?.evidence_hash_hex || '',
    tx: a.attestation?.tx_hash || '',
    explorer: a.attestation?.tx_hash
      ? `https://stellar.expert/explorer/testnet/tx/${a.attestation.tx_hash}`
      : '',
  };
}

const attested = [
  ...(main.attested_alerts || []).map(attestedRow),
  ...(leniency.attested_alerts || []).map(attestedRow),
].filter((a) => a.tx);

// LGPD: redige pessoas físicas antes de projetar os assets públicos.
const alertsPublic = alerts.map((a) => redactAlert(a).alert);
const attestedPublic = attested.map((a) => redactAttested(a).row);

fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'alerts.json'), JSON.stringify({ generated_at: full.generated_at, alerts: alertsPublic }));
fs.writeFileSync(
  path.join(OUT, 'stats.json'),
  JSON.stringify(
    {
      generated_at: full.generated_at,
      contract: 'CC4TJGDRWZOPGBWOOHBJF3N2VKUQRNIW6C6PTYHD7ZI3D42GBQRRZHM5',
      sources: full.sources,
      summary: full.summary,
      statistics: full.statistics,
      govbr: {
        leniency_alerts: (leniency.alerts || []).length,
        leniency_fail: leniency.summary?.fail_active_agreement ?? 0,
        leniency_still_contracting: leniency.summary?.still_contracting_or_receiving ?? 0,
      },
      sprint_m_pncp: {
        sanction_pncp_alerts: (sanctionPncp.alerts || []).length,
        sanction_pncp_valor_em_risco: sanctionPncp.summary?.valor_total_em_risco ?? 0,
        sanction_pncp_window_days: sanctionPncp.window_days ?? null,
      },
      attested: attestedPublic,
    },
    null,
    1,
  ),
);

console.log(`[build-pilot-data] ${alerts.length} alertas → public/pilot/alerts.json`);
console.log(`[build-pilot-data] ${attested.length} atestados → public/pilot/stats.json`);
