// Teste de aceitação da jornada da instituição financeira (PRD, seção "Teste de aceitação").
// Roda contra um gateway e um site já de pé:
//   SITE_URL      (padrão http://localhost:4173)
//   GATEWAY_URL   (padrão http://localhost:3999)
//   MAIL_CAPTURE_FILE  o mesmo arquivo JSONL que o gateway escreve (para ler os links mágicos)
// Usa só contas e empresas fictícias. Grava o relatório em e2e/report/financial-journey.json.
//
// Passos cobertos até agora: 1 (diagnóstico), 2 (conta, aprovador, chave) e
// 3 (passaporte de parceiro com revisão humana assinada). Os demais entram com M3–M5.
//   E2E_OPERATOR_KEY    chave de API do operador (fila de revisão)
//   E2E_SEEDED_ATTEMPT  teste local: tentativa já selada de e2e/fixtures/partner-submit.json
//   E2E_FULL_SEAL=1     preview: o assistente sela de verdade na rede de teste

import { createRequire } from 'node:module';
// require (não import) para achar o Playwright instalado globalmente ou no projeto.
const { chromium } = createRequire(import.meta.url)('playwright');
import fs from 'node:fs';
import path from 'node:path';
import { generateKeyPairSync } from 'node:crypto';

const SITE = process.env.SITE_URL ?? 'http://localhost:4173';
const GW = process.env.GATEWAY_URL ?? 'http://localhost:3999';
const MAILS = process.env.MAIL_CAPTURE_FILE;
if (!MAILS) throw new Error('MAIL_CAPTURE_FILE é obrigatório');
const OUT = path.resolve('e2e/report');
fs.mkdirSync(OUT, { recursive: true });

const run = Date.now().toString(36);
const OWNER = `owner-${run}@licenciada.test`;
const APPROVER = `aprovador-${run}@licenciada.test`;
const report = { startedAt: new Date().toISOString(), site: SITE, gateway: GW, steps: [] };

function linkFor(to) {
  const lines = fs.existsSync(MAILS) ? fs.readFileSync(MAILS, 'utf-8').trim().split('\n') : [];
  const rec = lines.map((l) => JSON.parse(l)).reverse().find((m) => m.to === to);
  const m = rec?.text.match(/https?:\/\/\S+token=[A-Za-z0-9_%-]+/);
  if (!m) throw new Error(`sem link mágico para ${to}`);
  return m[0].replace(/^https?:\/\/[^/]+/, SITE);
}

async function step(name, fn) {
  const t0 = Date.now();
  try {
    const detail = await fn();
    report.steps.push({ name, ok: true, ms: Date.now() - t0, ...(detail ? { detail } : {}) });
    console.log(`✓ ${name} (${Date.now() - t0} ms)`);
  } catch (err) {
    report.steps.push({ name, ok: false, ms: Date.now() - t0, error: String(err?.message ?? err) });
    await page.screenshot({ path: path.join(OUT, 'falha.png'), fullPage: true }).catch(() => {});
    console.error(`✗ ${name}: ${err?.message ?? err}`);
    throw err;
  }
}

const browser = await chromium.launch();
const owner = await browser.newContext();
const page = await owner.newPage();
let failed = false;
try {
  await step('1. diagnóstico Brasil lista os três pacotes PSAV', async () => {
    await page.goto(`${SITE}/financial-institutions`);
    // Banner de cookies: o teste recusa (não precisa de analytics).
    await page.getByRole('button', { name: 'Reject All' }).click({ timeout: 5000 }).catch(() => {});
    await page.getByRole('button', { name: 'PT', exact: true }).click();
    await page.selectOption('select[name=market]', 'BR');
    await page.selectOption('select[name=institution_type]', 'psav');
    await page.getByRole('button', { name: 'Ver o que se aplica' }).click();
    await page.waitForSelector('[data-pack="psav-safeguard-br@1.1.0"]');
    for (const id of ['psav-travel-rule-br@1.0.0', 'psav-privacidade-br@0.2.0']) await page.waitForSelector(`[data-pack="${id}"]`);
    await page.screenshot({ path: path.join(OUT, '01-diagnostico.png'), fullPage: true });
    return { totals: await page.textContent('[data-testid=fi-totals]') };
  });

  await step('2a. cria conta por link mágico', async () => {
    await page.fill('input[name=workspace_name]', `Licenciada ${run} (fictitious)`);
    await page.fill('input[name=signup_email]', OWNER);
    await page.getByRole('button', { name: 'Criar workspace' }).click();
    await page.waitForSelector('text=o link está a caminho');
    await page.goto(linkFor(OWNER));
    await page.waitForURL(/\/app\/fi\/workspace/);
    await page.waitForSelector('text=Membros');
  });

  await step('2b. convida o aprovador (outra pessoa) e ele entra', async () => {
    await page.fill('input[name=invite_email]', APPROVER);
    await page.getByRole('button', { name: 'Convidar' }).click();
    await page.waitForSelector('text=Convite enviado.');
    const ap = await (await browser.newContext()).newPage();
    await ap.goto(linkFor(APPROVER));
    await ap.waitForURL(/\/app\/fi/);
    await ap.close();
  });

  await step('2c. gera chave de API que autentica /psav/passports/prepare', async () => {
    await page.fill('input[name=key_label]', 'e2e');
    await page.getByRole('button', { name: 'Gerar chave' }).click();
    const key = (await page.textContent('[data-testid=new-api-key]'))?.trim();
    const r = await fetch(`${GW}/api/v1/psav/passports/prepare`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': key },
      body: JSON.stringify({ attempt_id: 'att-e2e-nao-existe', submit_body: {} }),
    });
    if (r.status !== 404) throw new Error(`esperava 404 (autenticado), veio ${r.status}`);
    await page.screenshot({ path: path.join(OUT, '02-workspace.png'), fullPage: true });
  });

  const OP = process.env.E2E_OPERATOR_KEY;
  if (!OP) throw new Error('E2E_OPERATOR_KEY é obrigatório');
  await step('3a. pede o passaporte do parceiro (documentos resumidos no navegador)', async () => {
    await page.goto(`${SITE}/app/fi/passport`);
    await page.waitForSelector('text=Novo passaporte de parceiro');
    const tmp = path.join(OUT, 'doc-ficticio.txt');
    fs.writeFileSync(tmp, `documento fictício ${run}`);
    await page.setInputFiles('input[name=doc_contract]', tmp);
    await page.waitForSelector('text=/sha256 [0-9a-f]{16}/');
    if (process.env.E2E_FULL_SEAL === '1') {
      await page.fill('input[name=partner]', `parceiro-ficticio-${run}`);
      await page.fill('input[name=service_scope]', 'Onboarding (fictício)');
      for (const d of ['due_diligence', 'client_disclosure', 'director_designation', 'partner_kyc']) await page.setInputFiles(`input[name=doc_${d}]`, tmp);
      for (const c of ['acts_on_behalf', 'no_direct_charge', 'bcb_access']) await page.check(`input[name=clause_${c}]`);
      await page.getByRole('button', { name: 'Selar e pedir revisão' }).click();
    } else {
      // Local: o selo na rede é substituído pela tentativa semeada; o resto segue o mesmo caminho do assistente.
      const body = JSON.parse(fs.readFileSync(path.resolve('e2e/fixtures/partner-submit.json'), 'utf-8'));
      const res = await page.evaluate(async ({ gw, attempt, body }) => {
        const post = (p, b) => fetch(`${gw}${p}`, { method: 'POST', credentials: 'include', headers: { 'content-type': 'application/json' }, body: JSON.stringify(b) }).then(async (r) => ({ s: r.status, b: await r.json() }));
        const prep = await post('/api/v1/psav/passports/prepare', { attempt_id: attempt, submit_body: body });
        if (prep.s !== 200) return prep;
        return post('/api/v1/psav/review-requests', { run_id: prep.b.run_id, tier: 'tier1' });
      }, { gw: GW, attempt: process.env.E2E_SEEDED_ATTEMPT, body });
      if (res.s !== 201) throw new Error(`pedido de revisão: ${res.s} ${JSON.stringify(res.b)}`);
      await page.reload();
    }
    await page.waitForSelector('[data-testid=pp-requests] tr[data-status=pending]', { timeout: 180_000 });
    await page.screenshot({ path: path.join(OUT, '03a-pedido.png'), fullPage: true });
  });

  await step('3b. revisor nomeado assina no navegador e o passaporte sai', async () => {
    const { publicKey, privateKey } = generateKeyPairSync('ed25519');
    const reg = await fetch(`${GW}/api/v1/psav/reviewers`, {
      method: 'POST', headers: { 'content-type': 'application/json', 'x-api-key': OP },
      body: JSON.stringify({ name: `Revisora Ficticia ${run}`, public_key_pem: publicKey.export({ type: 'spki', format: 'pem' }) }),
    });
    if (reg.status !== 201) throw new Error(`cadastro do revisor: ${reg.status}`);
    const { reviewer_id } = await reg.json();
    const rv = await (await browser.newContext()).newPage();
    await rv.goto(`${SITE}/app/review`);
    await rv.getByRole('button', { name: 'Reject All' }).click({ timeout: 3000 }).catch(() => {});
    await rv.fill('input[name=operator_key]', OP);
    await rv.getByRole('button', { name: 'Entrar' }).click();
    const card = rv.locator('article[data-request]').first();
    await card.waitFor();
    await card.locator('input[name=reviewer_id]').fill(reviewer_id);
    await card.getByRole('button', { name: 'Ver o que vou assinar' }).click();
    await card.locator('[data-testid=review-payload]').waitFor();
    await card.locator('textarea[name=reviewer_pem]').fill(String(privateKey.export({ type: 'pkcs8', format: 'pem' })));
    await card.getByRole('button', { name: 'Assinar e emitir' }).click();
    await rv.waitForSelector('[data-testid=review-msg]:has-text("emitido (valid, tier1)")');
    await rv.screenshot({ path: path.join(OUT, '03b-revisor.png'), fullPage: true });
    await rv.close();
    await page.reload();
    await page.waitForSelector('[data-testid=pp-requests] tr[data-status=issued]');
    const href = await page.getAttribute('[data-testid=pp-requests] tr[data-status=issued] a', 'href');
    const id = decodeURIComponent(String(href).split('/').pop());
    const pub = await (await fetch(`${GW}/api/v1/psav/passports/${encodeURIComponent(id)}`)).json();
    if (pub.status !== 'valid' || pub.reviewer?.id !== reviewer_id) throw new Error(`passaporte público inesperado: ${JSON.stringify(pub)}`);
    if (JSON.stringify(pub).includes('parceiro-ficticio')) throw new Error('o passaporte público vazou evidência');
    await page.screenshot({ path: path.join(OUT, '03c-passaporte.png'), fullPage: true });
    return { passport: id, verdicts: pub.verdicts };
  });
} catch {
  failed = true;
} finally {
  report.finishedAt = new Date().toISOString();
  report.passed = !failed;
  fs.writeFileSync(path.join(OUT, 'financial-journey.json'), JSON.stringify(report, null, 2));
  await browser.close();
}
process.exit(failed ? 1 : 0);
