// Só para o teste local (sem rede de blockchain): grava no ATTESTATIONS_FILE uma
// tentativa já selada para e2e/fixtures/partner-submit.json, com o mesmo cálculo
// de hash e predicados do gateway. Rodar com cwd = pilot-gateway buildado.
// No preview o teste usa o selo real (E2E_FULL_SEAL=1) e este script não roda.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const [fixture, ...attemptIds] = process.argv.slice(2);
const dist = (p) => pathToFileURL(path.resolve('dist', p)).href;
const { insertAttempt } = await import(dist('lib/attestation-store.js'));
const { hashCanonical } = await import(dist('lib/canonical-json.js'));
const { evaluate } = await import(dist('lib/predicates.js'));
const { submitSchema } = await import(dist('routes/attestation.js'));
const H = (c) => c.repeat(64);
for (const attemptId of attemptIds) {
// request_id único por tentativa: <request_id do fixture>-<attemptId>
const raw = JSON.parse(fs.readFileSync(fixture, 'utf-8'));
raw.request_id = `${raw.request_id}-${attemptId}`.slice(0, 64);
const body = submitSchema.parse(raw);
const p = evaluate(body.use_case_id, body.evidence);
await insertAttempt({
  attempt_id: attemptId, request_id: body.request_id, use_case_id: body.use_case_id, status: 'COMPLETED',
  created_at: Date.now(), updated_at: Date.now(), request_body_hash: hashCanonical(body), chain: 'stellar',
  result: {
    verdict: p.verdict, predicate_set_id: p.set_id, predicate_set_version: p.version,
    evidence_hash_hex: H('9'), metadata_hash_hex: H('8'), predicate_results: p.results,
    tx: { feeBumpTxHash: H('7'), innerTxHash: H('6'), ledger: 1, contractId: 'C-e2e', explorerUrl: 'https://example.invalid/e2e' },
  },
});
}
process.exit(0);
