# DPO2U — SEO & GEO analysis (2026-05-29)

Scope: `dpo2u.com` (Vite + React SPA, Express server, prerendered `<head>` per route).
Done this session: title/meta/OG/Twitter/JSON-LD reconciled to "Compliance as a protocol" +
24 jurisdictions; `sitemap.xml` created; `robots.txt` fixed (right domain, gated routes blocked,
AI bots welcomed); `llms.txt` created; soft-404 → 200/301 fixed; legacy intake → 301 to app.

---

## TL;DR — the one finding that dominates both SEO and GEO

**The page body is not in the HTML.** `prerender-meta.mjs` injects only the `<head>` (title,
meta, canonical, OG/Twitter, JSON-LD); the `<body>` ships `<div id="root"></div>` and all prose
renders client-side after hydration (the script says so, lines 19–20). Consequences:

- **SEO:** Googlebot executes JS and will index the rendered body (with a render-budget delay),
  but Bing, social unfurlers, and many secondary engines see an empty body → weak/again-delayed indexing.
- **GEO (AI answer engines):** **GPTBot, ClaudeBot, PerplexityBot, CCBot largely do NOT execute JS.**
  They see only `<head>` + JSON-LD + `/llms.txt`. The actual claims, the ladder, the coverage prose —
  the stuff that gets *quoted* in an AI answer — is invisible to them today.

**Highest-impact fix:** prerender (or SSR) the real body content of the key public routes
(/, /coverage, /pricing, /research, /solana-protocol, /verify, /dpa). Until then, `llms.txt` +
JSON-LD are the mitigation (both now in place), but body prose is what earns citations and rich snippets.

---

## SEO — state & actions

**Working well**
- Per-route `<head>` prerender (title/desc/canonical/OG/Twitter) — F001 closed.
- Rich JSON-LD (Organization/WebSite/FAQ-ish prose) — reconciled to 24 juris / 8 AI frameworks / "as a protocol".
- `robots.txt` fixed: canonical host `dpo2u.com` (was `.com.br`), gated `/app`,`/login`,`/pilot/operator|admin`,`/portal`,`/dsr` disallowed; legacy `/servicos`,`/sobre`,`/blog` removed.
- `sitemap.xml` created — 16 indexable public URLs, excludes gated/dynamic/retired.
- Retired intake (`/demo`,`/register-dapp`) → **301** (link equity preserved), not soft-404.

**To fix (ranked)**
1. **Prerender the body** of key routes (react-snap/`vite-react-ssg`/Puppeteer postbuild). #1 lever. (was tried via react-snap; revisit with `vite-react-ssg` or a Puppeteer postbuild in CI.)
2. **`og-image.png` is MISSING** in `public/` but referenced in `index.html` → broken social/AI preview card. Generate a 1200×630 OG image ("Compliance as a protocol") and add it. Quick + high ROI.
3. **Bundle weight**: `contracts.js` ≈ 1.96 MB (gzip 536 KB) — LCP/INP risk on mobile → Core Web Vitals → ranking. Code-split the Solana contracts chunk off the critical path (it's only needed on /solana-protocol and the app).
4. **Long-tail coverage pages**: only 3 of 24 jurisdiction sub-pages are prerendered (mexico/vietnam/malaysia). Prerender all 24 (`/coverage/lgpd`, `/coverage/gdpr`, …) with unique meta + body → big long-tail ("LGPD compliance on-chain", "MiCAR reserve attestation", etc.). Add them to sitemap once they have unique content.
5. **Verify `dpo2u.com.br` → 301 → `dpo2u.com`** (if owned) to consolidate authority.
6. **HEAD on retired routes**: 301 already added for GET+HEAD on /demo,/register-dapp. Good.

---

## GEO — Generative Engine Optimization (being cited by ChatGPT / Claude / Perplexity / Google AI)

**Working well**
- `/llms.txt` (llmstxt.org spec) now ships a curated, factual map with citeable stats + a "notes for AI assistants" section (don't quote in-calibration pricing; app is gated; mainnet billing off).
- `robots.txt` explicitly Allows GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-Web, PerplexityBot, Google-Extended, CCBot.
- Strong **entity/authority signals**: Frederico Santana (DPO 15y, FGV, co-author ERC-8004), founded 2021 — citeable E-E-A-T.
- Crisp **definitional, quotable lines**: "Compliance as a protocol", "the HTTPS of compliance for Web3", "score private, proof public" — exactly the shape LLMs extract.
- Quotable **stats**: 24 jurisdictions, 8 AI-governance frameworks, $0.0002/attestation, 1.94s/seal.
- `/verify` = unique, *verifiable* primary-source content (on-chain proof) — high-trust, citeable.

**To improve (ranked)**
1. **Get the body into HTML** (same #1 as SEO) — LLM crawlers don't run JS; without prerendered body they can only cite `<head>` + `llms.txt` + JSON-LD. This caps citation richness.
2. **Add `FAQPage` JSON-LD** to home/pricing/coverage (What is DPO2U? What does it cost? Which chains? What's "both regimes"?). FAQ schema is disproportionately quoted in AI answers and rich results.
3. **Keep one canonical fact set** across `llms.txt`, JSON-LD, body, and social — drift (e.g., 17 vs 24, $99 vs in-calibration) makes engines hedge or mis-cite. (Reconciled this session; keep a single source of truth.)
4. **Definitional H2/H3 + short factual paragraphs** in the body ("DPO2U is …", "It costs …", "It covers …") — extractable answer units.
5. **Surface proof inline**: link on-chain attestations / explorer from prose, not just the app — LLMs weight verifiable claims.
6. **Monitor**: server-log GPTBot/ClaudeBot/PerplexityBot hits; periodically ask the engines "what is DPO2U?" to catch mis-citations (e.g., a stale price).

---

## Quick wins shipped vs pending

| Item | Status |
|---|---|
| robots.txt (domain, gated routes, AI bots) | ✅ shipped |
| sitemap.xml (clean, public-only) | ✅ shipped |
| llms.txt | ✅ shipped |
| Meta/OG/Twitter/JSON-LD reconciled | ✅ shipped |
| soft-404 → 200/301 | ✅ shipped |
| **og-image.png (missing)** | ⏳ pending — generate 1200×630 |
| **Prerender body of key routes** | ⏳ pending — #1 lever (SEO + GEO) |
| **FAQPage JSON-LD** | ⏳ pending |
| **Code-split contracts.js (CWV)** | ⏳ pending |
| **Prerender all 24 coverage sub-pages** | ⏳ pending (long-tail) |
