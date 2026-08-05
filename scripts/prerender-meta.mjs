#!/usr/bin/env node
/**
 * prerender-meta.mjs — postbuild crude prerender (cycle 2 fallback for F001/F016)
 *
 * What this does:
 *   For each known route, copy `dist/index.html` to `dist/<route>/index.html`
 *   with the <title>, <meta name="description">, canonical, and OG/Twitter
 *   tags replaced for that route. This gives crawlers (Googlebot first-pass,
 *   LLM crawlers without JS) a unique pre-hydration head per route.
 *
 * Why crude (not vite-plugin-prerender / react-snap):
 *   We tried react-snap; the headless-Chrome dependency was brittle in the
 *   container environment and `@unhead/react` doesn't SSR cleanly against
 *   our current `usePageHead` flow. This script ships the unique meta SEO
 *   crawlers need without re-rendering the React tree. Hydration still
 *   runs normally on the client; @unhead/react updates DOM post-hydration.
 *
 * Limitation honestly noted:
 *   The <body> still ships an empty <div id="root"></div> — semantic
 *   landmarks (F016) are still post-hydration only. F001 (per-route head)
 *   is closed; F016 is still partial. Cycle 3 can revisit a real prerender
 *   pass once the toolchain stabilises.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const indexPath = path.join(dist, 'index.html');
const SITE_BASE = 'https://dpo2u.com';

if (!fs.existsSync(indexPath)) {
  console.error('[prerender-meta] dist/index.html not found — did you run vite build?');
  process.exit(1);
}

const indexHtml = fs.readFileSync(indexPath, 'utf8');

/**
 * Per-route head data — must match `usePageHead({...})` calls in src/app/*.tsx.
 * Keep these in sync; add a route here when you add one to the router.
 */
const ROUTES = [
  {
    path: '/',
    title: 'DPO2U — Compliance as a protocol.',
    description: 'The HTTPS of compliance, for Web3. Provable, on-chain compliance for anything that processes data, issues tokens, or runs AI — natively on Stellar (Soroban). The only protocol that seals both regimes: data privacy and AI governance. 24 jurisdictions, 70+ countries, 8 AI-governance frameworks. Score private, proof public. 1.94s · $0.0002 per seal · since 2021.',
  },
  {
    path: '/verify',
    title: 'Verify an attestation — DPO2U',
    description: 'Public, trustless verification of any DPO2U compliance attestation, read directly from the contract on-chain. The verdict, jurisdiction, timestamp and evidence hash are public; the score stays private.',
  },
  {
    path: '/dpa',
    title: 'Data Processing Agreement (DPA) — DPO2U',
    description: 'DPO2U processor DPA template — GDPR Art. 28 + LGPD Art. 39: documented instruction, confidentiality, security (Art. 32), sub-processors, data-subject assistance, breach notification, deletion/return, audit, and international transfers.',
  },
  {
    path: '/protocol',
    title: 'Protocol — compliance on Stellar (Soroban) | DPO2U',
    description: 'DPO2U is compliance as a protocol on Stellar. An immutable Soroban contract anchors PASS/FAIL/REVIEW attestations; anyone verifies trustlessly by (use_case_id, evidence_hash) over Soroban RPC. ~$0.0002 per seal, read-only verify is free.',
  },
  // /mcp removed 2026-04-29 — Sealed globalization sprint. Content lives on
  // home (#mcp) + /research#mcp-reference. server.js issues a 301 → /#mcp.
  {
    path: '/about',
    title: 'About — Origin story & F13 manifesto | DPO2U',
    description: 'DPO2U started in 2021 as twenty lines in a Zettelkasten. Today: a publish-first compliance research house with a Soroban compliance protocol on Stellar and a typed MCP tool suite. The full story.',
  },
  {
    path: '/research',
    title: 'Research — Whitepaper & accumulation | DPO2U',
    description: 'Whitepaper, public Zettelkasten, and the publish-first principle in practice. The full DPO2U research surface — primitives before product.',
  },
  {
    path: '/privacy',
    title: 'Privacy Policy | DPO2U',
    description: 'How DPO2U handles personal data on its own surfaces. Minimal collection, no tracking by default, and full LGPD/GDPR rights.',
  },
  {
    path: '/terms',
    title: 'Terms of Service | DPO2U',
    description: 'Terms governing use of dpo2u.com, the public artifacts, and the DPO2U Soroban contract on Stellar testnet.',
  },
  {
    path: '/alpha-signup',
    title: 'Alpha signup — DPO2U',
    description: 'Three fields. Submit your project, we run the MCP chain on your repo, and we book a call with the result.',
  },
  {
    path: '/alpha',
    title: 'Alpha — Showcase | DPO2U',
    description: 'Public showcase of dApps attested through the DPO2U alpha pipeline. Names only. Scores stay private. Proof is public.',
  },
  {
    path: '/coverage',
    title: 'Coverage — Twenty-four jurisdictions, one primitive | DPO2U',
    description: 'Visual map of twenty-four regulatory regimes covered in code: LGPD, GDPR, MiCAR, MiCA Title V (CASP), DPDP, PDPA, UAE, PDPL, POPIA, NDPA, CCPA, PIPEDA, LAW25, PIPA, PDP, APPI, LFPDPPP (Mexico), Decree 13 (Vietnam), PDPA-MY (Malaysia), Kenya DPA, Ghana DPA, Colombia Ley 1581, Tanzania PDPA, and Uganda DPPA — plus 8 AI-governance frameworks. EMEA + Americas + APAC + LatAm in one composition step.',
  },
  {
    path: '/pricing',
    title: 'Pricing — Open Source, Managed, DPO-as-a-Service | DPO2U',
    description: 'Open-core ladder for on-chain compliance: Open Source (free SDK + $0.0002 per attestation), Managed Protocol, and DPO-as-a-Service. The attestation is the unit of billing. 24 jurisdictions, 8 AI-governance frameworks. Managed/DPO pricing in calibration — talk to us.',
  },
  // Sprint M (2026-05-26) — alias público do painel de alertas anticorrupção
  {
    path: '/sentinela-anticorrupcao',
    title: 'Sentinela Anticorrupção — alertas D+0 nacional | DPO2U',
    description: 'Painel público de alertas anticorrupção em contratações públicas brasileiras. Cruzamento D+0 entre vencedoras de pregão (PNCP, cobertura nacional) e sanções vigentes (CEIS/CNEP/CEPIM da CGU). Atestação on-chain Stellar Soroban testnet. 1.273 alertas detectados; R$ 1,39M em risco mapeados na Sprint M.',
  },
  {
    path: '/pilot/alertas',
    title: 'Painel de alertas do piloto — DPO2U Stellar',
    description: 'Painel interno do piloto anticorrupção: 1.273 alertas reais (sanction_check + overpricing + leniency), severidade ponderada, atestações on-chain Stellar testnet.',
  },
  // Per-jurisdiction prerender entries (added 2026-05-11) — Sprint 3 KB add
  // (Mexico/Vietnam/Malaysia). Server serves dist/coverage/<code>/index.html
  // com meta tags SEO-targeted; React Router /coverage/:code route renderiza
  // CoveragePage normalmente, com scroll-to-card opcional via useParams.
  // Goal: ranquear pra queries específicas tipo "LFPDPPP compliance Solana"
  // ou "Vietnam Decree 13 DPIA on-chain", sem precisar de página dedicada.
  {
    path: '/coverage/mexico',
    title: 'LFPDPPP (Mexico) — Compliance kit for fintech ITF | DPO2U',
    description: 'Mexico LFPDPPP compliance on Stellar — INAI authority, ARCO rights (Acceso/Rectificación/Cancelación/Oposición), Art. 36 cross-border adequacy. Built for 8 ITF fintech licenses + 3M crypto retail wallets. 17 jurisdictions, 6 AI gov frameworks.',
  },
  {
    path: '/coverage/vietnam',
    title: 'Vietnam Decree 13 / Law 91/2025 — Cross-border DPIA on-chain | DPO2U',
    description: 'Vietnam Personal Data Protection Decree 13/2023 + Law 91/2025 compliance on Stellar — MPS authority, Art. 25 cross-border DPIA mandatória, Art. 23 breach 72h notification. Most restrictive APAC cross-border regime, attested on-chain.',
  },
  {
    path: '/coverage/malaysia',
    title: 'PDPA-MY 2024 — DPO mandatory + Data portability on-chain | DPO2U',
    description: 'Malaysia PDPA 2010 + Amendment 2024 compliance on Stellar — PDPC authority, s. 12A DPO mandatory (NEW 2024), s. 43A data portability (NEW), s. 12B breach 72h. First SEA regime com DPO mandatory; built for 5 SC-licensed crypto RMOs + Malaysian Web3 builders.',
  },
];

function escapeHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function rewriteHead(html, { title, description, url, image }) {
  let out = html;
  const t = escapeHtml(title);
  const d = escapeHtml(description);
  const u = escapeHtml(url);
  const i = escapeHtml(image);

  // <title>
  out = out.replace(/<title>[^<]*<\/title>/i, `<title>${t}</title>`);

  // <meta name="description" content="...">
  out = out.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="description" content="${d}" />`
  );

  // <link rel="canonical" href="...">
  out = out.replace(
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i,
    `<link rel="canonical" href="${u}" />`
  );

  // og:title / og:description / og:url
  out = out.replace(
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:title" content="${t}" />`
  );
  out = out.replace(
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:description" content="${d}" />`
  );
  out = out.replace(
    /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:url" content="${u}" />`
  );
  out = out.replace(
    /<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:image" content="${i}" />`
  );

  // twitter:title / description / image
  out = out.replace(
    /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:title" content="${t}" />`
  );
  out = out.replace(
    /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:description" content="${d}" />`
  );
  out = out.replace(
    /<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:image" content="${i}" />`
  );

  return out;
}

// Crawler/LLM body content — injected into <div id="root">. React's createRoot()
// REPLACES #root children on mount, so users get the live SPA while JS-less crawlers
// (GPTBot/ClaudeBot/PerplexityBot, Bing, social unfurlers) read real, citeable prose.
const W = 'style="max-width:820px;margin:40px auto;padding:0 24px;font-family:Georgia,serif;color:#0C0D10;line-height:1.5"';
const BODY = {
  '/': `<main ${W}><h1>Compliance as a protocol</h1>
<p>DPO2U turns regulatory compliance into a verifiable, on-chain attestation — the score stays private, the proof is public. The HTTPS of compliance, for Web3.</p>
<p>The only protocol that seals both regimes — data privacy and AI governance — across 24 jurisdictions and 8 AI-governance frameworks. Provable compliance for anything that processes data, issues tokens, or runs AI, natively on Stellar (Soroban).</p>
<h2>Two ways in</h2><ul><li><strong>I'm building</strong> — run the open-source SDK and DPO2U's compliance primitives inside your own CI/CD.</li><li><strong>Run it for me</strong> — we execute the pipeline for you, or become your accountable DPO of record.</li></ul>
<h2>The open-core ladder</h2><ul><li><strong>Open Source</strong> — free SDK + $0.0002 per on-chain attestation.</li><li><strong>Managed Protocol</strong> — we run the pipeline (platform pricing in calibration).</li><li><strong>DPO-as-a-Service</strong> — a named, accountable DPO of record.</li></ul>
<p>Independent research house since 2021. Founder: Frederico Santana — DPO for 15 years, FGV Master's in Law, Technology & Innovation, co-author of ERC-8004. 1.94s per seal · $0.0002 per attestation · 70+ countries.</p></main>`,
  '/coverage': `<main ${W}><h1>Twenty-four jurisdictions, one primitive layer</h1>
<p>Each regime is a typed compliance primitive in one engine. Data-protection jurisdictions: LGPD (Brazil), GDPR (EU), MiCAR and MiCA Title V CASP (EU), DPDP (India), PDPA (Singapore), UAE (ADGM/VARA), PDPL (UAE federal), POPIA (South Africa), NDPA (Nigeria), CCPA (California), PIPEDA (Canada), Quebec Law 25, PIPA (South Korea), PDP (Indonesia), APPI (Japan), LFPDPPP (Mexico), Decree 13 (Vietnam), PDPA (Malaysia), and the data-protection acts of Kenya, Ghana, Colombia, Tanzania and Uganda.</p>
<p>Plus eight AI-governance frameworks: Japan AI Promotion Act, Hiroshima ICOC (G7), EU AI Act, Korea AI Basic Act, CAIDP Universal Guidelines, UNESCO Recommendation on the Ethics of AI, Singapore IMDA MGF-Agentic v1.0, and the L1-L5 AI Governance Stack — aligned with the CAIDP submission to the UN Global Dialogue on AI Governance (UN GA Resolution 79/325).</p></main>`,
  '/pricing': `<main ${W}><h1>Pricing — the attestation is the unit of billing</h1>
<p>An open-core ladder, defined by who runs the primitives and who stands behind the result:</p>
<ul><li><strong>Open Source</strong> — free SDK (npm + cargo) + $0.0002 per on-chain attestation. You run it yourself and hold the keys.</li><li><strong>Managed Protocol</strong> — connect your repo, we execute the pipeline and anchor every seal. Platform pricing in calibration — talk to us.</li><li><strong>DPO-as-a-Service</strong> — a named, accountable DPO of record, audit defense and regulator interface. Custom retainer.</li></ul>
<p>The on-chain seal costs $0.0002 per attestation. 24 jurisdictions, 8 AI-governance frameworks.</p></main>`,
  '/research': `<main ${W}><h1>Compliance as a computable primitive</h1>
<p>DPO2U is the research house that ships code. Compliance is exposed three ways: an open-source SDK, an MCP server, and on-chain attestation. The score stays private; the cryptographic proof of conformance is public (selective disclosure / zero-knowledge).</p>
<p>Coverage spans 24 jurisdictions and 8 AI-governance frameworks, with each rule expressed as a typed, testable primitive anchored to a verifiable on-chain attestation.</p></main>`,
  '/verify': `<main ${W}><h1>Verify an attestation</h1>
<p>Public, trustless verification of any DPO2U compliance attestation, read directly from the contract on-chain — no DPO2U credential required. Verification is keyed by use-case id and evidence hash; the verdict, jurisdiction/predicate, timestamp and evidence hash are public, while the score and underlying data stay private. Score private, proof public.</p></main>`,
  '/dpa': `<main ${W}><h1>Data Processing Agreement (DPA)</h1>
<p>DPO2U's standard processor DPA template — GDPR Article 28 and LGPD Article 39: processing only on documented instruction, confidentiality, security (GDPR Art. 32), sub-processors, assistance with data-subject rights, breach notification, deletion/return on termination, audit rights, and international transfers. Executed by signed contract — accessing this page does not, by itself, form a binding agreement. Contact dpo@dpo2u.com.</p></main>`,
};

let written = 0;
for (const route of ROUTES) {
  const url = `${SITE_BASE}${route.path}`;
  const image = `${SITE_BASE}/og-image.png`;
  let html = rewriteHead(indexHtml, {
    title: route.title,
    description: route.description,
    url,
    image,
  });
  // Inject crawler-readable body for key routes (React replaces it on mount).
  if (BODY[route.path]) {
    html = html.replace('<div id="root"></div>', `<div id="root">${BODY[route.path]}</div>`);
  }

  const targetDir = path.join(dist, route.path.replace(/^\/+/, ''));
  fs.mkdirSync(targetDir, { recursive: true });
  fs.writeFileSync(path.join(targetDir, 'index.html'), html, 'utf8');
  written += 1;
  console.log(`[prerender-meta]  ${route.path} → ${path.relative(root, path.join(targetDir, 'index.html'))}`);
}

console.log(`[prerender-meta] Wrote ${written} per-route HTML files (F001 closed; F016 still partial).`);
