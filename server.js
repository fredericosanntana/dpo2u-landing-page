import express from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { exec, spawn, execSync, execFile } from 'child_process';
import util from 'util';
import { fileURLToPath } from 'url';
import simpleGit from 'simple-git';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { registerStripeRoutes } from './server-routes/stripe-checkout.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const execPromise = util.promisify(exec);
const execFileP = util.promisify(execFile);
const app = express();
const PORT = 3000;

// Security hardening (F009, F021).
// CSP runs in report-only mode (cycle 2): observe violations before enforcement.
// Hosts allow-listed: Solana RPC (devnet+mainnet), Mixpanel ingest+CDN, GA tag manager.
// COEP off because Solana wallet adapters and SP1 verifier widgets need eval/iframe.
app.disable('x-powered-by');
app.use(helmet({
    contentSecurityPolicy: {
        useDefaults: true,
        // CSP enforce (P0 fix 2026-05-01 pre-Alpha public). Era report-only;
        // Alpha cohort exige enforcement real. Se quebrar widget, ajustar
        // directives específicas em vez de relaxar tudo.
        reportOnly: process.env.CSP_REPORT_ONLY === '1',
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: [
                "'self'",
                "'unsafe-inline'",
                'https://cdn.mxpnl.com',
                'https://www.googletagmanager.com',
                'https://www.google-analytics.com',
            ],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", 'data:', 'https:'],
            fontSrc: ["'self'", 'data:'],
            connectSrc: [
                "'self'",
                'https://api.devnet.solana.com',
                'https://api.mainnet-beta.solana.com',
                'https://soroban-testnet.stellar.org',
                'https://horizon-testnet.stellar.org',
                'https://stellar.expert',
                // Pilot operator console fetches the gateway here (Sprint K).
                'https://mcp.dpo2u.com',
                'https://api.mxpnl.com',
                'https://api-js.mixpanel.com',
                'https://www.google-analytics.com',
            ],
            frameAncestors: ["'self'"],
            baseUri: ["'self'"],
            objectSrc: ["'none'"],
            // upgradeInsecureRequests removed in dev; Helmet's default keeps it for prod
        },
    },
    crossOriginEmbedderPolicy: false,
}));

// F009-PP — Permissions-Policy: disable features the site never uses.
app.use((_req, res, next) => {
    res.setHeader(
        'Permissions-Policy',
        'camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=(), interest-cohort=()'
    );
    next();
});

// Stripe Checkout routes — registradas ANTES do express.json() global pq
// /api/stripe/webhook precisa raw body pra signature verification do Stripe.
// Cada route da Stripe declara seu próprio body parser (json pra create-session,
// raw pro webhook). Se app.use(express.json()) rodar primeiro, ele parseia o
// body do webhook e quebra constructEvent() com "Payload was provided as a parsed
// JavaScript object instead."
registerStripeRoutes(app, express);

// Limit JSON payload (~58 fields, but inventories can be large)
app.use(express.json({ limit: '2mb' }));

// /mcp legacy route — REMOVED 2026-04-29 (Sealed globalization sprint).
// MCP content now lives as a section on home (#mcp) and as the
// MCP Tool Reference section on /research. Issue a 301 to /#mcp so any
// inbound link, sitemap entry, or social share keeps working without a 404.
// Placed BEFORE express.static + the prerender lookup so neither serves the
// stale dist/mcp/index.html if it lingers between builds.
app.get('/mcp', (req, res) => res.redirect(301, '/#mcp'));
app.head('/mcp', (req, res) => res.redirect(301, '/#mcp'));

// Pre-app intake retired (2026-05-29) — superseded by the functional app.
// 301 (not a soft-404) preserves link equity from inbound links / SEO history.
app.get('/register-dapp', (req, res) => res.redirect(301, '/app/activate'));
app.head('/register-dapp', (req, res) => res.redirect(301, '/app/activate'));
app.get('/demo', (req, res) => res.redirect(301, '/login'));
app.head('/demo', (req, res) => res.redirect(301, '/login'));

// `/downloads` MUST come before `dist/` static — vite copies public/ into
// dist/ at build time, so without this priority the baked-in dist/downloads/*
// would shadow the volume-mounted public/downloads/* (which is the live source
// of truth, e.g. when we swap demo videos without rebuilding the image).
// Bug surfaced 2026-05-08: dpo2u-demo-2026.mp4 swapped on disk but Express kept
// serving the old build-time copy from dist/.
app.use('/downloads', express.static(path.join(__dirname, 'public/downloads')));

// `redirect: false` prevents express.static from emitting 301s for the
// per-route prerendered directories (e.g. /protocol → /protocol/).
// We resolve those in the SPA fallback below so the canonical /protocol
// URL stays without a trailing slash.
app.use(express.static(path.join(__dirname, 'dist'), { redirect: false }));

// API: Agents List
app.get('/api/agents', (req, res) => {
    try {
        const registryPath = '/root/.claude/config/agent_registry.json';
        if (fs.existsSync(registryPath)) {
            const registryData = JSON.parse(fs.readFileSync(registryPath, 'utf-8'));
            // ... (Logic from route.ts - simplified for brevity, assume raw list or implement transformation if critical)
            // For now, returning the raw list or a mocked list to match previous logic's fallback
            return res.json({ total: registryData.agents?.length || 0, agents: registryData.agents || [] });
        }

        // Fallback Agents (copied from route.ts)
        const agents = [
            { id: "orchestrator", name: "Master Orchestrator", status: "available" },
            // ... Add more if needed, but for now minimal fallback to ensure UI doesn't crash
        ];
        res.json({ total: agents.length, agents });
    } catch (error) {
        console.error('Error fetching agents:', error);
        res.status(500).json({ error: 'Failed to fetch agents' });
    }
});

// API: Analise Generate
app.post('/api/analise/generate', async (req, res) => {
    try {
        const data = req.body;
        console.log('Received analysis request', data?.step1_company?.nome);

        // Basic Validation
        if (!data.step1_company || !data.step1_company.nome || !data.step1_company.cnpj) {
            return res.status(400).json({ error: 'Dados da empresa incompletos' });
        }

        const timestamp = Date.now();
        const cnpjNumbers = data.step1_company.cnpj.replace(/\D/g, '') || '00000000000000';
        const id = `report-${cnpjNumbers}-${timestamp}`;
        const inputPath = path.join('/tmp', `temp-${id}.json`);

        // Ensure downloads dir exists
        const publicDownloadDir = path.resolve(__dirname, 'public', 'downloads', id);
        fs.mkdirSync(publicDownloadDir, { recursive: true });

        // Save Input JSON
        fs.writeFileSync(inputPath, JSON.stringify(data, null, 2));

        // CLI Path
        // Check if we are in the container structure
        const cliPath = '/app/libs/dpo2u-mcp/dist/cli.js';

        if (!fs.existsSync(cliPath)) {
            console.error(`CLI not found at ${cliPath}`);
            // Fallback for dev/testing if not mounted
            return res.status(500).json({ error: 'CLI tool not available' });
        }

        const env = { ...process.env };
        if (data.apiKey) env.GEMINI_API_KEY = data.apiKey;

        const command = `node ${cliPath} adequacao --input ${inputPath} --output ${publicDownloadDir} --provider gemini --model gemini-2.0-flash`;
        console.log(`Executing: ${command}`);

        const { stdout, stderr } = await execPromise(command, { env, timeout: 300000 });
        console.log('CLI Output:', stdout);

        // Find ZIP
        let relativeZipPath = '';
        const contents = fs.readdirSync(publicDownloadDir);
        for (const item of contents) {
            if (item.endsWith('.zip')) {
                relativeZipPath = item;
                break;
            }
            // Check subdirs if needed, matching original logic
            const itemPath = path.join(publicDownloadDir, item);
            if (fs.statSync(itemPath).isDirectory()) {
                if (fs.existsSync(path.join(itemPath, 'pacote-final.zip'))) {
                    relativeZipPath = `${item}/pacote-final.zip`;
                    break;
                }
            }
        }

        if (!relativeZipPath) {
            throw new Error('ZIP not found in output');
        }

        const downloadUrl = `/downloads/${id}/${relativeZipPath}`;
        res.json({ success: true, downloadUrl, logs: stdout });

    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ error: error instanceof Error ? error.message : 'Internal Server Error' });
    }
});

// =============================================================================
// /api/register-dapp — alpha registry intake (TheGarage cohort)
//
// Receives the 7-step CompleteFormData + step7_web3 payload, performs a
// shallow git clone of the submitter's GitHub repo, persists the submission
// JSON, and notifies the Chairman by email. Processing is gated — Chairman
// runs `process_submission.py --id <uuid>` manually to invoke the MCP chain.
// =============================================================================
app.post('/api/register-dapp', async (req, res) => {
    try {
        const data = req.body;

        // --- Basic server-side validation (Zod runs client-side) -----------
        const c = data?.step1_company || {};
        const w = data?.step7_web3 || {};
        const missing = [];
        if (!c.nome) missing.push('step1_company.nome');
        if (!c.email) missing.push('step1_company.email');
        if (!w.dappName) missing.push('step7_web3.dappName');
        if (!w.githubRepo) missing.push('step7_web3.githubRepo');
        if (!Array.isArray(w.framework) || w.framework.length === 0) missing.push('step7_web3.framework');
        if (missing.length) {
            return res.status(400).json({ error: 'Missing required fields', missing });
        }
        // GitHub URL sanity check
        if (!/^https?:\/\/(www\.)?github\.com\//i.test(w.githubRepo)) {
            return res.status(400).json({ error: 'githubRepo must be a github.com URL' });
        }

        const submissionId = crypto.randomUUID();
        const submittedAt = new Date().toISOString();
        const cloneDir = `/tmp/dpo2u-alpha/${submissionId}`;
        let cloneStatus = 'pending';
        let codeFiles = [];

        // --- Shallow clone with size + timeout guards -----------------------
        try {
            fs.mkdirSync(cloneDir, { recursive: true });
            const git = simpleGit({ baseDir: cloneDir });
            // GIT_TERMINAL_PROMPT=0 prevents auth prompts on private repos
            process.env.GIT_TERMINAL_PROMPT = '0';
            await Promise.race([
                git.clone(w.githubRepo, cloneDir, ['--depth=1', '--single-branch']),
                new Promise((_, rej) => setTimeout(() => rej(new Error('clone-timeout-60s')), 60_000)),
            ]);
            const sizeBytes = parseInt(execSync(`du -sb ${cloneDir} | cut -f1`).toString().trim(), 10);
            if (sizeBytes > 50 * 1024 * 1024) throw new Error('repo-too-large-50mb');
            // List contract files (max 200 for sanity)
            try {
                const findOut = execSync(
                    `find ${cloneDir} -type f \\( -name '*.rs' -o -name '*.sol' -o -name '*.compact' \\) | head -200`
                ).toString();
                codeFiles = findOut.split('\n').filter(Boolean).map(p => p.replace(`${cloneDir}/`, ''));
            } catch (_) { /* find may fail on empty repo — non-fatal */ }
            cloneStatus = 'cloned';
        } catch (e) {
            cloneStatus = `failed:${(e && e.message) || 'unknown'}`;
            console.error(`[register-dapp] clone failed for ${submissionId}:`, e?.message || e);
            // Do NOT fail the submission — Chairman can review manually
        }

        // --- Persist submission JSON ----------------------------------------
        const submissionDir = path.resolve(__dirname, 'public', 'submissions');
        fs.mkdirSync(submissionDir, { recursive: true });
        const record = {
            id: submissionId,
            submittedAt,
            status: 'submitted',          // submitted → processing → processed | failed
            showPublicly: false,           // Chairman flips to true post-processing
            form: data,
            cloneStatus,
            cloneDir: cloneStatus === 'cloned' ? cloneDir : null,
            codeFiles,
            processing: null,
        };
        fs.writeFileSync(
            path.join(submissionDir, `${submissionId}.json`),
            JSON.stringify(record, null, 2),
            'utf-8'
        );

        // --- Notify Chairman via spawn(smtp_sender.py) ----------------------
        const subject = `[DPO2U Register] ${c.nome} — ${w.dappName} (${submissionId.slice(0, 8)})`;
        const body = [
            `New dApp submission to the alpha registry.`,
            ``,
            `Company: ${c.nome} (CNPJ ${c.cnpj || 'n/a'})`,
            `dApp:    ${w.dappName}`,
            `Repo:    ${w.githubRepo}`,
            `Type:    ${w.projectType || 'n/a'}`,
            `Frameworks: ${w.framework.join(', ')}`,
            `Contact: ${c.email}`,
            `Clone:   ${cloneStatus}`,
            `Files:   ${codeFiles.length} (.rs/.sol/.compact)`,
            ``,
            `Process with:`,
            `  python3 /root/DPO2U/03-Ferramentas/Scripts/social/process_submission.py --id ${submissionId}`,
            ``,
            `JSON: /root/dpo2u-landing-page/public/submissions/${submissionId}.json`,
            `Clone dir: ${cloneDir}`,
        ].join('\n');

        // Mounted via docker-compose volumes:
        //   /dpo2u-scripts (read-only) → /root/DPO2U/03-Ferramentas/Scripts/social
        const sendEmail = '/dpo2u-scripts/send-email.sh';
        try {
            const child = spawn(
                'bash',
                [sendEmail, '--from', 'cmo', '--to', 'fredericosanntana@gmail.com',
                 '--subject', subject, '--body', body],
                { detached: true, stdio: ['ignore', 'pipe', 'pipe'] }
            );
            // Log notify result async (don't block response)
            let stderr = '';
            child.stderr.on('data', d => { stderr += d.toString(); });
            child.on('exit', code => {
                if (code !== 0) {
                    fs.appendFileSync('/tmp/register-notify.log',
                        `[${new Date().toISOString()}] ${submissionId} notify exit=${code} stderr=${stderr.slice(0, 500)}\n`);
                }
            });
            child.unref();
        } catch (e) {
            console.error('[register-dapp] notify spawn failed:', e?.message || e);
        }

        res.json({ submissionId, status: 'submitted' });
    } catch (error) {
        console.error('[register-dapp] error:', error);
        res.status(500).json({ error: error instanceof Error ? error.message : 'Internal Server Error' });
    }
});

// =============================================================================
// /api/alpha-signup — slim 3-field intake (alpha cohort)
//
// Captures projectName + githubRepo + contactEmail. Shallow-clones the repo,
// persists the submission JSON, and sends TWO emails synchronously:
//   1. Chairman gets the data + the process_submission.py command.
//   2. Alpha user gets a short confirmation.
//
// The previous wizard handler used spawn().unref() and silently swallowed
// failures (curl was missing from the container — the 2026-04-28 submission
// got persisted but no email was ever sent). This route awaits both email
// sends and returns 500 if either fails, so we don't lie to the user.
//
// 2026-05-01: rate limit added (5 req / 1h / IP). Memory store ok pra alpha
// (single instance); migrar pra Redis pré-mainnet.
// =============================================================================
const alphaSignupLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: 'rate_limit_exceeded',
        message: 'Limite de 5 cadastros por hora atingido para este IP. Tente novamente em alguns minutos.',
        retryAfterSeconds: 3600,
    },
    skipSuccessfulRequests: false,
});

app.post('/api/alpha-signup', alphaSignupLimiter, async (req, res) => {
    const data = req.body || {};
    const projectName = String(data.projectName || '').trim();
    const githubRepo = String(data.githubRepo || '').trim();
    const contactEmail = String(data.contactEmail || '').trim();

    // --- Validation (Zod runs client-side; mirror the basics here) ----------
    const missing = [];
    if (projectName.length < 2 || projectName.length > 80) missing.push('projectName');
    if (!githubRepo) missing.push('githubRepo');
    if (!contactEmail) missing.push('contactEmail');
    if (missing.length) return res.status(400).json({ error: 'Missing or invalid fields', missing });
    if (!/^https?:\/\/(www\.)?github\.com\//i.test(githubRepo)) {
        return res.status(400).json({ error: 'githubRepo must be a github.com URL' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
        return res.status(400).json({ error: 'contactEmail must be a valid email' });
    }

    const submissionId = crypto.randomUUID();
    const submittedAt = new Date().toISOString();
    const cloneDir = `/tmp/dpo2u-alpha/${submissionId}`;
    let cloneStatus = 'pending';
    let codeFiles = [];

    // --- Shallow clone (best-effort; never blocks the email) ----------------
    try {
        fs.mkdirSync(cloneDir, { recursive: true });
        process.env.GIT_TERMINAL_PROMPT = '0';
        const git = simpleGit({ baseDir: cloneDir });
        await Promise.race([
            git.clone(githubRepo, cloneDir, ['--depth=1', '--single-branch']),
            new Promise((_, rej) => setTimeout(() => rej(new Error('clone-timeout-60s')), 60_000)),
        ]);
        const sizeBytes = parseInt(execSync(`du -sb ${cloneDir} | cut -f1`).toString().trim(), 10);
        if (sizeBytes > 50 * 1024 * 1024) throw new Error('repo-too-large-50mb');
        try {
            const findOut = execSync(
                `find ${cloneDir} -type f \\( -name '*.rs' -o -name '*.sol' -o -name '*.compact' -o -name '*.ts' -o -name '*.py' \\) | head -200`
            ).toString();
            codeFiles = findOut.split('\n').filter(Boolean).map(p => p.replace(`${cloneDir}/`, ''));
        } catch (_) { /* find may fail on empty repo — non-fatal */ }
        cloneStatus = 'cloned';
    } catch (e) {
        cloneStatus = `failed:${(e && e.message) || 'unknown'}`;
        console.error(`[alpha-signup] clone failed for ${submissionId}:`, e?.message || e);
    }

    // --- Persist submission JSON --------------------------------------------
    // Must always respond JSON: if the bind-mounted submissions dir is not
    // writable (host-side perms regression — happened 2026-05-12 after the
    // P0 "drop root" Dockerfile change), Express's default error handler
    // would render HTML, and the frontend's `await res.json()` would explode
    // with "Unexpected token '<'". Wrap and return structured JSON instead.
    const submissionDir = path.resolve(__dirname, 'public', 'submissions');
    const record = {
        id: submissionId,
        submittedAt,
        source: 'alpha-signup',
        status: 'submitted',
        showPublicly: false,
        form: { projectName, githubRepo, contactEmail },
        cloneStatus,
        cloneDir: cloneStatus === 'cloned' ? cloneDir : null,
        codeFiles,
        processing: null,
    };
    try {
        fs.mkdirSync(submissionDir, { recursive: true });
        fs.writeFileSync(
            path.join(submissionDir, `${submissionId}.json`),
            JSON.stringify(record, null, 2),
            'utf-8'
        );
    } catch (e) {
        console.error(`[alpha-signup] persist failed for ${submissionId}:`, e?.message || e);
        return res.status(500).json({
            error: 'persist_failed',
            message: 'Submission could not be saved server-side. Email fredericosanntana@gmail.com and we will book the call manually.',
            submissionId,
        });
    }

    // --- Send both emails synchronously -------------------------------------
    const sendEmail = '/dpo2u-scripts/send-email.sh';

    // Branded HTML email templates. Inline styles only (Gmail/Outlook strip
    // <style> in <head>); table-based layout for max client compatibility;
    // safe font fallbacks (Georgia / Helvetica) since Gmail blocks web fonts.
    // Palette mirrors the dpo2u.com Sealed system: ivory paper / ink / terracotta.
    const esc = (s) => String(s)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

    const wordmark = `DPO<span style="color:#C85C3B;">2</span>U`;
    const brandFooter = `
        <tr><td style="padding:0 32px;"><div style="height:1px;background:rgba(12,13,16,.14);margin:24px 0;"></div></td></tr>
        <tr><td style="padding:0 32px 32px;font-family:'JetBrains Mono',Menlo,monospace;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#5E5E55;">
            <a href="https://dpo2u.com" style="color:#5E5E55;text-decoration:none;border-bottom:1px solid rgba(94,94,85,.4);">dpo2u.com</a>
            &nbsp;·&nbsp; Compliance, sealed. &nbsp;·&nbsp; Est. MMXXI · São Paulo
        </td></tr>`;

    const chairmanSubject = `[DPO2U Alpha] ${projectName} — ${githubRepo} (${submissionId.slice(0, 8)})`;
    const chairmanBody = [
        `New alpha-cohort signup.`,
        ``,
        `Project: ${projectName}`,
        `Repo:    ${githubRepo}`,
        `Contact: ${contactEmail}`,
        `Clone:   ${cloneStatus}`,
        `Files:   ${codeFiles.length} (.rs/.sol/.compact/.ts/.py)`,
        ``,
        `Process with:`,
        `  python3 /root/DPO2U/03-Ferramentas/Scripts/social/process_submission.py --id ${submissionId}`,
        ``,
        `JSON: /root/dpo2u-landing-page/public/submissions/${submissionId}.json`,
        `Clone dir: ${cloneDir}`,
    ].join('\n');

    const chairmanHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F1ECE3;font-family:'Inter Tight',Helvetica,Arial,sans-serif;color:#0C0D10;">
<div style="display:none;max-height:0;overflow:hidden;">New alpha signup: ${esc(projectName)} — run process_submission.py to invoke the MCP chain.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F1ECE3;">
  <tr><td align="center" style="padding:32px 16px;">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="background:#F1ECE3;border:1px solid rgba(12,13,16,.14);max-width:600px;width:100%;">
      <tr><td style="padding:28px 32px 8px;">
        <div style="font-family:Georgia,'Fraunces',serif;font-weight:600;font-size:22px;letter-spacing:-.025em;line-height:1;">${wordmark}</div>
        <div style="font-family:'JetBrains Mono',Menlo,monospace;font-size:10px;letter-spacing:.25em;text-transform:uppercase;color:#C85C3B;margin-top:14px;">§ ALPHA SIGNUP — INTAKE</div>
      </td></tr>
      <tr><td style="padding:8px 32px 0;">
        <h1 style="margin:8px 0 0;font-family:Georgia,'Fraunces',serif;font-weight:500;font-size:30px;line-height:1.1;letter-spacing:-.025em;color:#0C0D10;">
          New submission. <span style="font-style:italic;color:#2A2722;">Repo cloned.</span>
        </h1>
        <p style="margin:14px 0 0;font-size:15px;line-height:1.55;color:#2A2722;">
          A new alpha-cohort project landed in the queue. Run <code style="background:#E8E2D5;padding:2px 6px;border-radius:2px;font-family:'JetBrains Mono',Menlo,monospace;font-size:13px;color:#C85C3B;">process_submission.py</code> to kick off the MCP chain.
        </p>
      </td></tr>
      <tr><td style="padding:24px 32px 0;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#E8E2D5;border:1px solid rgba(12,13,16,.14);">
          <tr><td style="padding:18px 22px;font-family:'JetBrains Mono',Menlo,monospace;font-size:13px;line-height:1.7;color:#0C0D10;">
            <div><span style="color:#5E5E55;">project</span>&nbsp;&nbsp;&nbsp;${esc(projectName)}</div>
            <div><span style="color:#5E5E55;">repo</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="${esc(githubRepo)}" style="color:#C85C3B;text-decoration:none;border-bottom:1px solid rgba(200,92,59,.4);">${esc(githubRepo)}</a></div>
            <div><span style="color:#5E5E55;">contact</span>&nbsp;&nbsp;&nbsp;<a href="mailto:${esc(contactEmail)}" style="color:#0C0D10;text-decoration:none;border-bottom:1px solid rgba(12,13,16,.3);">${esc(contactEmail)}</a></div>
            <div><span style="color:#5E5E55;">clone</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${esc(cloneStatus)}</div>
            <div><span style="color:#5E5E55;">files</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${codeFiles.length} (.rs/.sol/.compact/.ts/.py)</div>
            <div><span style="color:#5E5E55;">ref</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${esc(submissionId.slice(0, 8))}</div>
          </td></tr>
        </table>
      </td></tr>
      <tr><td style="padding:24px 32px 0;">
        <div style="font-family:'JetBrains Mono',Menlo,monospace;font-size:10px;letter-spacing:.25em;text-transform:uppercase;color:#5E5E55;margin-bottom:8px;">Process with</div>
        <div style="background:#0C0D10;color:#F1ECE3;padding:14px 18px;font-family:'JetBrains Mono',Menlo,monospace;font-size:12px;line-height:1.5;border-radius:2px;overflow-wrap:break-word;word-break:break-all;">
          $ python3 /root/DPO2U/03-Ferramentas/Scripts/social/process_submission.py --id ${esc(submissionId)}
        </div>
      </td></tr>
      <tr><td style="padding:18px 32px 0;font-family:'JetBrains Mono',Menlo,monospace;font-size:11px;line-height:1.7;color:#5E5E55;">
        <div>json:&nbsp;&nbsp;&nbsp;public/submissions/${esc(submissionId)}.json</div>
        <div>clone:&nbsp;&nbsp;${esc(cloneDir)}</div>
      </td></tr>
      ${brandFooter}
    </table>
  </td></tr>
</table>
</body></html>`;

    const userSubject = `[DPO2U] Recebemos seu cadastro — ${projectName}`;
    const userBody = [
        `Hi,`,
        ``,
        `We received your alpha signup for "${projectName}".`,
        ``,
        `Next steps:`,
        `  1. We clone your repo (${githubRepo}) and run the MCP compliance chain on it.`,
        `  2. We email you back with a call slot in up to 2 business days.`,
        `  3. On the call we walk you through the findings and the on-chain attestation flow.`,
        ``,
        `Reference: ${submissionId.slice(0, 8)}`,
        ``,
        `— DPO2U`,
        `https://dpo2u.com`,
    ].join('\n');

    const userHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F1ECE3;font-family:'Inter Tight',Helvetica,Arial,sans-serif;color:#0C0D10;">
<div style="display:none;max-height:0;overflow:hidden;">We got your alpha signup. Cloning ${esc(projectName)}, running the MCP chain, and emailing you a call slot in up to 2 business days.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F1ECE3;">
  <tr><td align="center" style="padding:32px 16px;">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="background:#F1ECE3;border:1px solid rgba(12,13,16,.14);max-width:600px;width:100%;">
      <tr><td style="padding:28px 32px 8px;">
        <div style="font-family:Georgia,'Fraunces',serif;font-weight:600;font-size:22px;letter-spacing:-.025em;line-height:1;">${wordmark}</div>
        <div style="font-family:'JetBrains Mono',Menlo,monospace;font-size:10px;letter-spacing:.25em;text-transform:uppercase;color:#C85C3B;margin-top:14px;">§ SUBMISSION RECEIVED</div>
      </td></tr>
      <tr><td style="padding:8px 32px 0;">
        <h1 style="margin:8px 0 0;font-family:Georgia,'Fraunces',serif;font-weight:500;font-size:30px;line-height:1.1;letter-spacing:-.025em;color:#0C0D10;">
          We've got <span style="font-style:italic;color:#C85C3B;">${esc(projectName)}</span>.
        </h1>
        <p style="margin:14px 0 0;font-size:15px;line-height:1.55;color:#2A2722;">
          Thanks for submitting. Here's exactly what happens next — no waiting in a black box.
        </p>
      </td></tr>
      <tr><td style="padding:24px 32px 0;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr><td style="padding:0 0 14px;vertical-align:top;width:32px;font-family:Georgia,'Fraunces',serif;font-size:18px;font-weight:600;color:#C85C3B;line-height:1.3;">1.</td>
              <td style="padding:0 0 14px;vertical-align:top;font-size:15px;line-height:1.55;color:#0C0D10;">
                We shallow-clone your repo (<a href="${esc(githubRepo)}" style="color:#0C0D10;text-decoration:none;border-bottom:1px solid rgba(12,13,16,.3);">${esc(githubRepo)}</a>) and run the MCP compliance chain on the codebase.
              </td></tr>
          <tr><td style="padding:0 0 14px;vertical-align:top;font-family:Georgia,'Fraunces',serif;font-size:18px;font-weight:600;color:#C85C3B;line-height:1.3;">2.</td>
              <td style="padding:0 0 14px;vertical-align:top;font-size:15px;line-height:1.55;color:#0C0D10;">
                We email you back with a call slot — usually within 2 business days.
              </td></tr>
          <tr><td style="padding:0 0 14px;vertical-align:top;font-family:Georgia,'Fraunces',serif;font-size:18px;font-weight:600;color:#C85C3B;line-height:1.3;">3.</td>
              <td style="padding:0 0 14px;vertical-align:top;font-size:15px;line-height:1.55;color:#0C0D10;">
                On the call we walk you through the findings and the on-chain attestation flow.
              </td></tr>
        </table>
      </td></tr>
      <tr><td style="padding:8px 32px 0;">
        <div style="background:#E8E2D5;border-left:3px solid #C85C3B;padding:12px 16px;font-family:'JetBrains Mono',Menlo,monospace;font-size:12px;color:#0C0D10;">
          <span style="color:#5E5E55;">ref&nbsp;&nbsp;</span>${esc(submissionId.slice(0, 8))}
        </div>
      </td></tr>
      <tr><td style="padding:24px 32px 0;font-size:13px;line-height:1.6;color:#5E5E55;">
        Questions before the call? Just reply to this email.
      </td></tr>
      ${brandFooter}
    </table>
  </td></tr>
</table>
</body></html>`;

    try {
        await execFileP('bash', [
            sendEmail,
            '--from', 'cmo',
            '--to', 'fredericosanntana@gmail.com',
            '--subject', chairmanSubject,
            '--body', chairmanBody,
            '--html', chairmanHtml,
        ], { timeout: 30_000 });
    } catch (e) {
        console.error('[alpha-signup] chairman email failed:', e?.stderr || e?.message || e);
        return res.status(500).json({
            error: 'Submission saved but Chairman notification failed. Try again or email fredericosanntana@gmail.com directly.',
            submissionId,
        });
    }

    try {
        await execFileP('bash', [
            sendEmail,
            '--from', 'cmo',
            '--to', contactEmail,
            '--subject', userSubject,
            '--body', userBody,
            '--html', userHtml,
        ], { timeout: 30_000 });
    } catch (e) {
        console.error('[alpha-signup] user confirmation failed:', e?.stderr || e?.message || e);
        // Chairman email worked — the submission is real and findable.
        // Surface a soft warning so the user knows to check spam / re-send.
        return res.status(200).json({
            submissionId,
            status: 'submitted',
            warning: 'Submission received but confirmation email failed to send. Check your spam folder, or contact fredericosanntana@gmail.com.',
        });
    }

    res.json({ submissionId, status: 'submitted' });
});

// =============================================================================
// =============================================================================
// /api/demo/audit — Interactive landing demo (90s DPIA generation, watermarked)
// =============================================================================
// Generates a template-filled markdown DPIA from 5 form fields. NÃO chama o
// MCP real — é uma demo honest:
//   - input → fill template → return DPIA-shaped markdown with "DEMO" header/footer
//   - real DPIA generation (via mcp-server generate_dpia tool) é tier Builder+/Team
//
// Por que template em vez de subprocess pra MCP: (a) sem auth complexity, (b)
// determinístico/sem latência variável, (c) zero risco de leakage pra
// production MCP (demo é completamente isolado), (d) honesto — output marcado
// DEMO desde o byte 0.
//
// Rate-limited 5/hour/IP (mesma policy do alpha-signup).
// =============================================================================
const demoAuditLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: 'rate_limit_exceeded',
        message: 'Demo limit 5 requests/hour/IP. Sign up at /alpha-signup for full access.',
        retryAfterSeconds: 3600,
    },
});

const JURISDICTION_AUTHORITIES = {
    LGPD: { authority: 'ANPD (Autoridade Nacional de Proteção de Dados)', law: 'Lei 13.709/2018', country: 'Brazil' },
    GDPR: { authority: 'EDPB + national DPAs', law: 'Regulation (EU) 2016/679', country: 'EU' },
    DPDP: { authority: 'Data Protection Board of India', law: 'DPDP Act 2023', country: 'India' },
    PDPA: { authority: 'PDPC Singapore', law: 'PDPA 2012 (rev. 2021/2023)', country: 'Singapore' },
    CCPA: { authority: 'CPPA (California Privacy Protection Agency)', law: 'CCPA + CPRA', country: 'California, US' },
    PIPEDA: { authority: 'OPC (Office of the Privacy Commissioner of Canada)', law: 'PIPEDA + DPA 2018', country: 'Canada' },
    POPIA: { authority: 'Information Regulator', law: 'Act 4 of 2013', country: 'South Africa' },
    APPI: { authority: 'PPC (Personal Information Protection Commission)', law: 'Act 57/2003 + 2022 amendment', country: 'Japan' },
    PIPA: { authority: 'PIPC (Personal Information Protection Commission)', law: 'Act 16930/2020', country: 'South Korea' },
    PDP: { authority: 'MCI Indonesia', law: 'UU 27/2022 PDP Law', country: 'Indonesia' },
    UAE: { authority: 'ADGM + UAE Data Office', law: 'PDPL Federal Decree-Law 45/2021 + ADGM DPR 2021', country: 'United Arab Emirates' },
    NDPA: { authority: 'NDPC (Nigeria Data Protection Commission)', law: 'NDPA 2023', country: 'Nigeria' },
    LAW25: { authority: 'CAI (Commission d\'accès à l\'information)', law: 'Quebec Law 25 (Bill 64)', country: 'Quebec, Canada' },
    MICAR: { authority: 'ESMA + EBA + national NCAs', law: 'MICA Regulation (EU) 2023/1114', country: 'EU' },
    MEXICO: { authority: 'INAI (Instituto Nacional de Transparencia)', law: 'LFPDPPP 2010', country: 'Mexico' },
    VIETNAM: { authority: 'Ministry of Public Security (MPS)', law: 'Decree 13/2023 + Law 91/2025', country: 'Vietnam' },
    MALAYSIA: { authority: 'PDPC Malaysia', law: 'PDPA 2010 + Amendment 2024', country: 'Malaysia' },
};

function buildDemoDpia({ companyName, jurisdiction, processingActivity, dataSubjects, purpose, ticketId, generatedAt }) {
    const j = JURISDICTION_AUTHORITIES[jurisdiction] || JURISDICTION_AUTHORITIES.LGPD;
    const lines = [
        '# Data Protection Impact Assessment (DPIA)',
        '',
        '> **⚠️ DEMO OUTPUT — Not for production use.**',
        '> This document is template-filled from the public demo at https://dpo2u.com/demo.',
        '> Generated content is illustrative only and does NOT constitute legal advice.',
        '> For a real audit + on-chain attestation, see https://dpo2u.com/pricing.',
        '',
        `**Subject**: ${companyName}`,
        `**Jurisdiction**: ${jurisdiction} (${j.country})`,
        `**Generated**: ${generatedAt}`,
        `**Demo ticket**: ${ticketId}`,
        '',
        '---',
        '',
        '## 1. Description of processing',
        '',
        `### 1.1 Processing activity`,
        `${processingActivity}`,
        '',
        `### 1.2 Data subjects`,
        `${dataSubjects}`,
        '',
        `### 1.3 Purpose`,
        `${purpose}`,
        '',
        '### 1.4 Regulatory regime',
        `- **Law**: ${j.law}`,
        `- **Supervisory authority**: ${j.authority}`,
        `- **Country**: ${j.country}`,
        '',
        '---',
        '',
        '## 2. Necessity and proportionality assessment',
        '',
        '### 2.1 Lawful basis',
        'Pending — to be assessed against the applicable lawful bases in ' + j.law + '.',
        'Real audit (Tier Builder+) maps each processing activity to specific legal bases',
        'with article-level citations.',
        '',
        '### 2.2 Data minimization',
        'Pending — real audit identifies which data fields can be reduced or pseudonymized.',
        '',
        '### 2.3 Retention period',
        'Pending — to be defined per data category. See `generate_retention_policy` tool',
        '(Tier Builder+) for granular matrix.',
        '',
        '---',
        '',
        '## 3. Risk assessment',
        '',
        '| Risk | Likelihood | Severity | Mitigation |',
        '|---|---|---|---|',
        '| Unauthorized access | Medium | High | (real audit defines) |',
        '| Data breach notification gap | Low | High | (real audit defines) |',
        '| Cross-border transfer non-compliance | Medium | Medium | (real audit defines) |',
        '| Data subject rights friction | Medium | Medium | (real audit defines) |',
        '',
        '---',
        '',
        '## 4. Compliance gaps (DEMO PLACEHOLDER)',
        '',
        'Real audit identifies specific gaps with article-level citations:',
        '- Consent management workflow review',
        '- Breach notification SLA monitoring',
        '- Cross-border transfer impact assessment',
        '- DPO appointment (if mandatory in your jurisdiction)',
        '- Records of Processing Activities (RoPA) maintenance',
        '',
        '---',
        '',
        '## 5. Recommendations',
        '',
        'Demo recommendations are generic. Real audit (Tier Team) produces:',
        '- Article-by-article compliance checklist with score',
        '- On-chain attestation (Stellar Soroban — testnet today, mainnet phase 2)',
        '- White-label PDF + machine-readable JSON output',
        '- Cross-jurisdiction matrix if you operate in multiple regimes',
        '',
        '---',
        '',
        '## DEMO FOOTER',
        '',
        `> This is a DEMO output for ${companyName} under ${jurisdiction}.`,
        '> For real audit + on-chain anchor, see https://dpo2u.com/pricing',
        `> Demo ticket: ${ticketId} · Generated: ${generatedAt}`,
        '',
        '— DPO2U · Compliance, sealed.',
    ];
    return lines.join('\n');
}

app.post('/api/demo/audit', demoAuditLimiter, (req, res) => {
    const data = req.body || {};
    const companyName = String(data.companyName || '').trim().slice(0, 120);
    const jurisdiction = String(data.jurisdiction || 'LGPD').trim().toUpperCase().slice(0, 24);
    const processingActivity = String(data.processingActivity || '').trim().slice(0, 240);
    const dataSubjects = String(data.dataSubjects || '').trim().slice(0, 240);
    const purpose = String(data.purpose || '').trim().slice(0, 240);

    if (!companyName || !processingActivity || !dataSubjects || !purpose) {
        return res.status(400).json({ error: 'All fields required (companyName, processingActivity, dataSubjects, purpose)' });
    }
    if (!JURISDICTION_AUTHORITIES[jurisdiction]) {
        return res.status(400).json({ error: `Unknown jurisdiction: ${jurisdiction}. Supported: ${Object.keys(JURISDICTION_AUTHORITIES).join(', ')}` });
    }

    const ticketId = crypto.randomUUID();
    const generatedAt = new Date().toISOString();
    const dpia_md = buildDemoDpia({
        companyName,
        jurisdiction,
        processingActivity,
        dataSubjects,
        purpose,
        ticketId,
        generatedAt,
    });

    return res.json({
        ok: true,
        ticket_id: ticketId,
        generated_at: generatedAt,
        watermark: 'DEMO',
        dpia_md,
        note: 'Template-filled DPIA. Real audit via mcp-server generate_dpia (Tier Builder+/Team).',
    });
});

// /api/alpha-list — public showcase, names-only
//
// Returns processed submissions with showPublicly=true. NEVER exposes scores,
// gaps, code, repo URLs, or contact info. "Names only. Scores stay private.
// Proof is public." (Sealed §3.2 absorbed into DPO2U canon.)
// =============================================================================
app.get('/api/alpha-list', (_req, res) => {
    try {
        const dir = path.resolve(__dirname, 'public', 'submissions');
        if (!fs.existsSync(dir)) return res.json({ items: [] });
        const items = fs.readdirSync(dir)
            .filter(f => f.endsWith('.json'))
            .map(f => {
                try { return JSON.parse(fs.readFileSync(path.join(dir, f), 'utf-8')); }
                catch (_) { return null; }
            })
            .filter(s => s && s.status === 'processed' && s.showPublicly === true)
            .map(s => ({
                dappName: s.form?.step7_web3?.dappName || 'Unknown',
                attestedAt: s.processing?.attestedAt || s.submittedAt,
                projectType: s.form?.step7_web3?.projectType || null,
                jurisdictions: s.form?.step7_web3?.framework || [],
            }))
            .sort((a, b) => (b.attestedAt || '').localeCompare(a.attestedAt || ''));
        res.json({ items });
    } catch (error) {
        console.error('[alpha-list] error:', error);
        res.status(500).json({ error: 'Failed to load alpha list' });
    }
});

// SPA Fallback — prefers per-route prerendered HTML when present
// (F001 closed via dist/<route>/index.html with unique <title>/<meta>/canonical/OG).
// Falls back to dist/index.html for any unknown route. SPA hydration runs
// client-side as before — the prerendered HTML only changes the <head>.
//
// REG-1 fix (cycle 3): explicitly set res.status(200) before sendFile on
// prerendered hits — express.static() falls through to this middleware with
// res.statusCode = 404 for any path it didn't directly serve (because the
// dist/<route>/ directory has no auto-index served), and sendFile() preserves
// that statusCode unless we override it. Without this, Googlebot sees the
// correct unique HTML body served under HTTP 404 and treats the page as
// "do not index", silently neutering cycle 2's per-route prerender SEO win.
//
// Truly unknown routes (no prerendered HTML AND not a valid SPA route) keep
// the 404 status so crawlers can correctly de-index them — we still serve
// the SPA shell so client-side nav from a 404 page still hydrates.
app.use((req, res) => {
    // Allow GET and HEAD — crawlers (and HTTP probes like curl -I) use HEAD
    // to check status before fetching. Treat HEAD identically to GET so we
    // don't 404 prerendered routes for status-code probes.
    if ((req.method !== 'GET' && req.method !== 'HEAD') || req.path.startsWith('/api')) {
        return res.status(404).json({ error: 'Not Found' });
    }
    // Try prerendered per-route HTML first
    const safePath = req.path.replace(/\/+$/, '').replace(/[^a-zA-Z0-9/_-]/g, '');
    const prerendered = path.join(__dirname, 'dist', safePath, 'index.html');
    if (safePath && safePath !== '/' && fs.existsSync(prerendered)) {
        return res.status(200).sendFile(prerendered);
    }
    // Valid client-side SPA routes without a prerendered dir (dynamic params or
    // app/legal pages) — serve the shell with 200, not a soft-404. /verify is
    // shareable; /dpa is a linked legal page; /app + /login are the auth'd app.
    const SPA_OK = ['/verify', '/dpa', '/login', '/app', '/midnight'];
    if (SPA_OK.some((p) => req.path === p || req.path.startsWith(`${p}/`))) {
        return res.status(200).sendFile(path.join(__dirname, 'dist', 'index.html'));
    }
    // Unknown path — serve SPA shell with 404 so crawlers de-index correctly.
    // The React app still hydrates and renders NotFoundPage on the client.
    res.status(404).sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
