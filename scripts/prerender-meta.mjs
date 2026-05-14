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
    path: '/solana-protocol',
    title: 'Solana Protocol — 12 ZK programs on devnet | DPO2U',
    description: 'Twelve DPO2U Solana programs across compliance, consent, MiCAR ART, agent infra, and 4 jurisdiction-specific (POPIA, CCPA, PIPEDA, PIPA Korea) — SP1 Groth16 proofs. ~$0.0002/attestation, 156k CU, 356-byte proofs.',
  },
  // /mcp removed 2026-04-29 — Sealed globalization sprint. Content lives on
  // home (#mcp) + /research#mcp-reference. server.js issues a 301 → /#mcp.
  {
    path: '/about',
    title: 'About — Origin story & F13 manifesto | DPO2U',
    description: 'DPO2U started in 2021 as twenty lines in a Zettelkasten. Today: a publish-first compliance research house with twelve Solana programs and 54 typed MCP tools. The full story.',
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
    description: 'Terms governing use of dpo2u.com, the public artifacts, and the DPO2U Solana programs on devnet.',
  },
  {
    path: '/register-dapp',
    title: 'Register a dApp — Alpha intake | DPO2U',
    description: 'Submit your dApp to the DPO2U alpha registry. Seven-step LGPD diligence + Solana metadata. Compliance attested on-chain.',
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
    title: 'Coverage — Seventeen jurisdictions, one primitive | DPO2U',
    description: 'Visual map of seventeen regulatory regimes covered in code: LGPD, GDPR, MiCAR, DPDP, PDPA, UAE, PDPL, POPIA, NDPA, CCPA, PIPEDA, LAW25, PIPA, PDP, APPI, LFPDPPP (Mexico), Decree 13 (Vietnam), and PDPA-MY (Malaysia). EMEA + Americas + APAC + LatAm in one composition step.',
  },
  {
    path: '/pricing',
    title: 'Pricing — Free, Builder $29, Team $199 | DPO2U',
    description: 'Honest pricing for on-chain compliance. Free tier (3 generations/month, 1 jurisdiction), Builder $29/mo (50 generations, on-chain anchor), Team $199/mo (unlimited, all 17 jurisdictions, white-label, self-host). Pilot pricing — Stripe billing live phase 2.',
  },
  {
    path: '/demo',
    title: 'Try the audit — DPO2U demo',
    description: 'Generate a real DPIA in 90 seconds. 5 fields, 17 jurisdictions, no signup. Output watermarked DEMO (not for production). Real audit + on-chain anchor via /pricing.',
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
    description: 'Mexico LFPDPPP compliance on Solana — INAI authority, ARCO rights (Acceso/Rectificación/Cancelación/Oposición), Art. 36 cross-border adequacy. Built for 8 ITF fintech licenses + 3M crypto retail wallets. 17 jurisdictions, 6 AI gov frameworks.',
  },
  {
    path: '/coverage/vietnam',
    title: 'Vietnam Decree 13 / Law 91/2025 — Cross-border DPIA on-chain | DPO2U',
    description: 'Vietnam Personal Data Protection Decree 13/2023 + Law 91/2025 compliance on Solana — MPS authority, Art. 25 cross-border DPIA mandatória, Art. 23 breach 72h notification. Most restrictive APAC cross-border regime, attested on-chain.',
  },
  {
    path: '/coverage/malaysia',
    title: 'PDPA-MY 2024 — DPO mandatory + Data portability on-chain | DPO2U',
    description: 'Malaysia PDPA 2010 + Amendment 2024 compliance on Solana — PDPC authority, s. 12A DPO mandatory (NEW 2024), s. 43A data portability (NEW), s. 12B breach 72h. First SEA regime com DPO mandatory; built for 5 SC-licensed crypto RMOs + Malaysian Web3 builders.',
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

let written = 0;
for (const route of ROUTES) {
  const url = `${SITE_BASE}${route.path}`;
  const image = `${SITE_BASE}/og-image.png`;
  const html = rewriteHead(indexHtml, {
    title: route.title,
    description: route.description,
    url,
    image,
  });

  const targetDir = path.join(dist, route.path.replace(/^\/+/, ''));
  fs.mkdirSync(targetDir, { recursive: true });
  fs.writeFileSync(path.join(targetDir, 'index.html'), html, 'utf8');
  written += 1;
  console.log(`[prerender-meta]  ${route.path} → ${path.relative(root, path.join(targetDir, 'index.html'))}`);
}

console.log(`[prerender-meta] Wrote ${written} per-route HTML files (F001 closed; F016 still partial).`);
