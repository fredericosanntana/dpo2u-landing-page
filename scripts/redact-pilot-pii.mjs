// Remove nomes de PESSOAS FÍSICAS dos dados públicos do painel /pilot/alertas.
//
// Motivo (LGPD): fontes públicas de compras/sanções (CEIS/CNEP, Compras.gov.br,
// PNCP) trazem firmas individuais — MEI / empresário individual — cuja "razão
// social" É o nome civil da pessoa. Sob a LGPD (art. 5º, I) isso é dado pessoal.
// A pessoa jurídica (razão social de empresa) não é dado pessoal e permanece.
//
// Estratégia: NÃO removemos a linha do alerta — o sinal anticorrupção (sanção,
// sobrepreço, órgão, UF, valor) continua público e auditável. Removemos só a
// IDENTIDADE: o nome vira um rótulo neutro e o CNPJ é zerado (um CNPJ de MEI
// reidentifica a pessoa via Receita). Idempotente.
//
// Uso:  node scripts/redact-pilot-pii.mjs        (aplica em public/pilot/*.json)
// Também é importado por build-pilot-data.mjs para manter rebuilds limpos.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

export const LABEL = 'Pessoa física — nome removido (LGPD)';

// Conjunto verificado manualmente nome-a-nome sobre o run do piloto (2026-07-10):
// 32 firmas individuais / pessoas físicas (nome civil como razão social), das
// quais 2 são "nome/iniciais + palavra de ramo" (MEI/empresário individual,
// tratados como PF por precaução).
//
// Guardamos apenas o SHA-256 de cada nome (não o nome em claro) — o objetivo do
// trabalho é justamente NÃO reter esses nomes no sistema; o hash basta para o
// matching determinístico e não reidentifica a pessoa.
const NATURAL_PERSON_HASHES = new Set([
  'bcfa65b9225a3f4e4ab26ee2da745152dcb05a3649d51adf134b43b05ea0b021',
  'a6233dec9b8685561717b991c6b7689974ca01a19735bb225259ae276d965982',
  'cce82bc1f7cf56cf48c334858912923e9a8340b17e1bc0f46dd19e89c64dde26',
  '822a4783231ab27539c67f4ac9b5cbd04cfc5286c381456c58e6a9e7c3b84968',
  '8e8d8dd4bb0331b7c53172a7fa1e37f7dcfd70736a28759caad41d6a400817df',
  '663019f57e9a4ab2e98a22279c225d0daf33bbb70d055cfe78df99b080a9010a',
  '4b8aebbeded4d1981884bb88843bdda64a96ead9fc6c54b8a4b2f40867078bfe',
  'fb8e784f8e5dfdeb945270105069a6f8bc7b568667d86389b6cfc1288642a8be',
  'a31496f76c534e6f503a4b6bf4d53f7ed3b44f8a7928ff9aed9754409cb2d845',
  'a25c0c425dd287de754112cd236d02820620554937979797c043dc98be089dcc',
  'c6c46f94a9a763958959df8d04155d2693dbd30c1595a2d9499f5bfe5a38df13',
  'a77310f562bb91de9f20cdbaf18fd3c689e352976b7ac7eb5220662829219cfa',
  'c43ebac8aecf8997ebbe6e40015185704e004b7481c52ec71745d60373058d93',
  '32884c6bc2b5c3dc8418884f5613915c69919ba16f4620f0da55fed5629c447e',
  '5fef6e4a8b6c4d56e1314bf6ae39c895ad8cbc35c249251ebe8a9e1f2f93e0c5',
  'b1fd0513a244bdb90d29730a35cd1b4e5c71682dbb2850e514509ae7bda54a82',
  '8cac95e381c991165c3438f8ffef5844c3fae55a47cd0aed21f0c7c6152ba146',
  'dc59c5f85fd7113f563e2050fde29584c796df5b180b9c9bbe5d78907bfbb9e5',
  '9f4d471555e9c026dfe1fedfc1d717ee4d893f7872e31c8ce6d0b9fab73f641a',
  'ca53d05c69223ffefa963e748ee5685dbd8fea7ee00dfb230b9a2f5113fea2e9',
  '92486e7ebd66bcdbe19a09250f053141595bfbb31bab65729d11906f573ae12c',
  '7d6a2772eaf2169ce0637fde93400f4559814187057eb65cc9437e8799216f91',
  '54e67210f6e3351f65f44fe31b8bc14129eea7ea27bff519aebe481d9669db7e',
  '2f14f4fd47a78a3f6afb6c00baf860aaa298d770dfad6338aae7ce0cdbe5dc3a',
  'aa3703920c839a29ffa8e69e974557ee1d3d9d79d8368b537dfd8d9bf53201bf',
  '0675d5fcecaf369158db4ffc7c26b85825f11ef0f4b20e65b35c21c257697d26',
  'c0b6d42c2a23cff8b06156fa123b09693bdb9599eba4a5d276dadafbb7bdb44f',
  'e424583b0cecf629608593eb5052875c747d39295dedbe45b7a506d52ce89fd6',
  '56b72a2199e679bc9db931d216f03fd67d0a7c91b6431fa45809a854e420e336',
  '67f7be80dcd4784f508826b8725de05c9bb9f1bf77b4cab68ccc9f351f1b9129',
  'f309b5e76f8d47645f29b910cd08d340279cb61d5b5e7f451ef2486e18d1aa34',
  '0eea9b3c7450000be3b0779ab6ecd5fea7a44f8df967e53da54fa08b3cc99825',
]);

// Defesa em profundidade p/ dados futuros (rebuild): pega padrões inequívocos
// de pessoa física mesmo que o nome não esteja no conjunto acima —
//  - CPF embutido na string (11 dígitos ou formatado)
//  - prefixo de CNPJ "NN.NNN.NNN " + nome (formato Receita de firma individual)
const CPF_RE = /\b\d{11}\b|\b\d{3}\.\d{3}\.\d{3}-\d{2}\b/;
const MEI_PREFIX_RE = /^\d{2}\.\d{3}\.\d{3}\s+\p{Lu}/u;

export function isNaturalPerson(name) {
  const s = (name || '').trim();
  if (!s) return false;
  const h = createHash('sha256').update(s).digest('hex');
  if (NATURAL_PERSON_HASHES.has(h)) return true;
  if (CPF_RE.test(s)) return true;
  if (MEI_PREFIX_RE.test(s)) return true;
  return false;
}

// Redige um alerta (objeto com supplier/cnpj). Retorna { changed, alert }.
export function redactAlert(a) {
  if (!isNaturalPerson(a.supplier)) return { changed: false, alert: a };
  return { changed: true, alert: { ...a, supplier: LABEL, cnpj: '' } };
}

// Redige uma linha de atestado (só tem supplier, sem cnpj).
export function redactAttested(a) {
  if (!isNaturalPerson(a.supplier)) return { changed: false, row: a };
  return { changed: true, row: { ...a, supplier: LABEL } };
}

// --- CLI: transforma os JSON já buildados em public/pilot/ ---------------------
function main() {
  const OUT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'public', 'pilot');
  const alertsPath = path.join(OUT, 'alerts.json');
  const statsPath = path.join(OUT, 'stats.json');

  const alertsDoc = JSON.parse(fs.readFileSync(alertsPath, 'utf8'));
  let nA = 0;
  alertsDoc.alerts = alertsDoc.alerts.map((a) => {
    const { changed, alert } = redactAlert(a);
    if (changed) nA++;
    return alert;
  });
  // alerts.json é servido compacto (sem indentação), igual ao gerador.
  fs.writeFileSync(alertsPath, JSON.stringify(alertsDoc));

  const statsDoc = JSON.parse(fs.readFileSync(statsPath, 'utf8'));
  let nS = 0;
  if (Array.isArray(statsDoc.attested)) {
    statsDoc.attested = statsDoc.attested.map((a) => {
      const { changed, row } = redactAttested(a);
      if (changed) nS++;
      return row;
    });
  }
  // stats.json é servido com indentação 1, igual ao gerador.
  fs.writeFileSync(statsPath, JSON.stringify(statsDoc, null, 1));

  console.log(`[redact-pilot-pii] alerts.json: ${nA} linhas redigidas (PII removida)`);
  console.log(`[redact-pilot-pii] stats.json (atestados): ${nS} linhas redigidas`);
}

if (import.meta.url === `file://${process.argv[1]}`) main();
