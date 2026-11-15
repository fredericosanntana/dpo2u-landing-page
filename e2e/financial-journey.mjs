// Teste de aceitação da jornada da instituição financeira (PRD, seção "Teste de aceitação").
// Roda contra um gateway e um site já de pé:
//   SITE_URL      (padrão http://localhost:4173)
//   GATEWAY_URL   (padrão http://localhost:3999)
//   MAIL_CAPTURE_FILE  o mesmo arquivo JSONL que o gateway escreve (para ler os links mágicos)
// Usa só contas e empresas fictícias. Grava o relatório em e2e/report/financial-journey.json.
//
// Passos cobertos até agora: 1 (diagnóstico) e 2 (conta, aprovador, chave).
// Os demais entram junto com os marcos M2–M5.

import { createRequire } from 'node:module';
// require (não import) para achar o Playwright instalado globalmente ou no projeto.
const { chromium } = createRequire(import.meta.url)('playwright');
import fs from 'node:fs';
import path from 'node:path';

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
} catch {
  failed = true;
} finally {
  report.finishedAt = new Date().toISOString();
  report.passed = !failed;
  fs.writeFileSync(path.join(OUT, 'financial-journey.json'), JSON.stringify(report, null, 2));
  await browser.close();
}
process.exit(failed ? 1 : 0);
