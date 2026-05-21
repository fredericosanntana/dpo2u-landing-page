// Projeta o artefato do run do piloto (dpo2u-stellar) em dois JSONs estáticos
// servidos como assets do site para o painel /pilot/alertas.
//
//   public/pilot/alerts.json  — lista enxuta dos 1.142 alertas (tabela + filtros)
//   public/pilot/stats.json   — panorama estatístico + 6 alertas atestados on-chain
//
// Os dados de compras públicas e sanções já são públicos (Compras.gov.br,
// Portal da Transparência) — não há PII além do que já é aberto.
//
// Uso: node scripts/build-pilot-data.mjs

import fs from 'node:fs';
import path from 'node:path';

const RUNS = '/root/dpo2u-stellar/docs/demos/runs';
const FULL = path.join(RUNS, '2026-05-21-real-pilot-alerts-full.json');
const MAIN = path.join(RUNS, '2026-05-21-real-pilot.json');
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
  return 'Triagem';
}

function mainReason(a) {
  const key = a.use_case === 'overpricing_v1' ? 'o4_not_statistical_outlier' : null;
  if (key) return a.predicate_results.find((p) => p.id === key)?.reason || '';
  // sanção: primeiro predicado não-PASS
  return a.predicate_results.find((p) => p.verdict !== 'PASS')?.reason || '';
}

function leanAlert(a, i) {
  const e = a.evidence;
  return {
    id: i,
    use_case: a.use_case,
    verdict: a.verdict,
    severity: severity(a),
    cnpj: e.supplier_cnpj || '',
    supplier: e.supplier_name || '',
    organ: e.organ || '',
    uf: e.uf || '',
    municipio: e.municipio || '',
    date: e.purchase_date || '',
    catmat: e.catmat ?? null,
    item: e.item_desc || '',
    value: typeof e.value === 'number' ? e.value : null,
    unit_price: typeof e.unit_price === 'number' ? e.unit_price : null,
    z: a.use_case === 'overpricing_v1' ? Number(zOf(a).toFixed(2)) : null,
    basket_n: e.basket?.n ?? null,
    basket_median: e.basket?.median ?? null,
    prospective: e.prospective === true,
    reason: mainReason(a),
  };
}

const full = JSON.parse(fs.readFileSync(FULL, 'utf8'));
const main = JSON.parse(fs.readFileSync(MAIN, 'utf8'));

const alerts = [
  ...full.sanction_alerts.map((a, i) => leanAlert(a, i)),
  ...full.overpricing_alerts.map((a, i) => leanAlert(a, full.sanction_alerts.length + i)),
];

const attested = (main.attested_alerts || []).map((a) => ({
  use_case: a.use_case,
  verdict: a.verdict,
  supplier: a.evidence.supplier_name || '',
  organ: a.evidence.organ || '',
  uf: a.evidence.uf || '',
  item: a.evidence.item_desc || '',
  evidence_hash: a.attestation?.evidence_hash_hex || '',
  tx: a.attestation?.tx_hash || '',
  explorer: a.attestation?.tx_hash
    ? `https://stellar.expert/explorer/testnet/tx/${a.attestation.tx_hash}`
    : '',
}));

fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'alerts.json'), JSON.stringify({ generated_at: full.generated_at, alerts }));
fs.writeFileSync(
  path.join(OUT, 'stats.json'),
  JSON.stringify(
    {
      generated_at: full.generated_at,
      contract: 'CC4TJGDRWZOPGBWOOHBJF3N2VKUQRNIW6C6PTYHD7ZI3D42GBQRRZHM5',
      sources: full.sources,
      summary: full.summary,
      statistics: full.statistics,
      attested,
    },
    null,
    1,
  ),
);

console.log(`[build-pilot-data] ${alerts.length} alertas → public/pilot/alerts.json`);
console.log(`[build-pilot-data] ${attested.length} atestados → public/pilot/stats.json`);
