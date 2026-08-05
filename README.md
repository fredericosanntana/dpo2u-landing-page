# DPO2U Landing Page

> **Compliance, computed.** (F2)
> DPO2U is the compliance research house that ships code. (F13)

**Live**: [dpo2u.com](https://dpo2u.com)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Vite 5 + React 18 + React Router 6 |
| **Language** | TypeScript (strict mode) |
| **Styling** | Tailwind CSS 3.4 + Radix/shadcn design tokens |
| **Animations** | Framer Motion |
| **Forms** | React Hook Form + Zod 4 |
| **Server** | Express 4 (SPA + `/api/*` endpoints) |
| **Repo ingestion** | `simple-git` (shallow clone for `/api/register-dapp`) |
| **Infrastructure** | Docker multi-stage, Traefik reverse proxy, Let's Encrypt SSL |

---

## Architecture

```
src/
├── app/                # Page components (Vite-style routing via React Router)
│   ├── page.tsx        # Homepage (F2 hero + F13 sub-hero)
│   ├── research.tsx    # Research house (F5 — Compliance as a Computable Primitive)
│   ├── protocol.tsx    # Compliance-as-protocol on Stellar (Soroban) — live contract + verify
│   ├── mcp.tsx         # 66 MCP tools across 17 jurisdictions + 6 AI gov frameworks
│   ├── about.tsx       # Origin story, manifesto, F13
│   ├── register-dapp.tsx   # Alpha registry intake — Wizard, ~58 fields
│   ├── alpha.tsx       # Showcase — names only, scores stay private
│   ├── privacy.tsx     # Site privacy (DPO2U eats own dog food)
│   └── terms.tsx
├── components/
│   ├── landing/        # Editorial primitives (PageShell, LiquidGlassNav, Manifesto, …)
│   ├── ui/             # shadcn/Radix base components (40+)
│   └── solana/         # Live attestations, agents-registered widgets
├── lib/
│   └── registerDappSchema.ts # Zod schema mirrored in dpo2u-cli wizard
├── styles/colors.css   # Single source of truth for color tokens
└── App.tsx             # Routing + redirects (legacy → canonical)

server.js               # Express SPA server + /api/register-dapp + /api/alpha-list +
                        # /api/analise/generate (legacy preserved)
```

**Deploy**: `git push` → Docker multi-stage build (Vite + Express) → Traefik → `dpo2u.com` (auto-SSL via Let's Encrypt).

---

## Brand canon

Source-of-truth: [`/root/DPO2U/06-Memory/Strategic/2026-04-24-dpo2u-parent-rebrand-FINAL.md`](../DPO2U/06-Memory/Strategic/2026-04-24-dpo2u-parent-rebrand-FINAL.md) (mono-brand DPO2U, Sealed sub-brand sunset, identity absorbed).

### 6 taglines in 6 contexts

| Context | Tagline | ID |
|---|---|---|
| Hero homepage + social bio | **Compliance, computed.** | F2 |
| Sub-hero + about | DPO2U is the research house that ships code. | F13 |
| Manifesto + newsletter | Research first. Primitive next. Product third. | F3 |
| Investor one-pager | Institutional trust, computed. | F10 |
| GitHub + dev docs | The DPO that ships code. | F9 |
| Whitepaper | Compliance as a Computable Primitive. | F5 |

### Palette (FINAL §3.4)

| Token | Hex | Role |
|---|---|---|
| `--dpo2u-ivory` | `#F1ECE3` | Primary background (paper) |
| `--dpo2u-ink` | `#0C0D10` | Text (warm near-black) |
| `--dpo2u-indigo` | `#2B3A67` | Editorial accent (headers, hairlines) |
| `--dpo2u-gold` | `#C4A962` | Institutional accent (rare) |
| `--dpo2u-terracotta` | `#C85C3B` | **`--color-primary` (CTAs, focus rings)** ¹ |
| `--dpo2u-verdigris` | `#4A7C74` | Restricted accent (aging/permanence) |

¹ **DEVIATION 2026-04-28**: terracotta promoted from "restricted accent" to `--color-primary` per Chairman directive (sealed-origin metaphor as hero motif). Pending Gate review.

### Typography

- **Display**: Fraunces (serif, hero/headers)
- **Body**: Inter Tight (paragraphs)
- **Mono**: JetBrains Mono (code, labels, numerals)

Type scale (clamp-based): `hero` / `section` / `body` / `small` / `micro`. Containers: `76ch` for editorial corpus, `1200px` for marketing.

### Voice — 5 principles

1. Editorial, not corporate (numbers before adjectives, no buzzwords).
2. Publish-first (research/GitHub link before sales CTA).
3. Antithetical (1-of-3 communications names the opposite — "we're not Vanta").
4. Proof > promise (every technical claim has a verifiable link).
5. Patient (enterprise contracting cycle, 6-18 months — not weekly sprint).

Anti-patterns blocked (also enforced by content pipeline linter at `/root/DPO2U/03-Ferramentas/Scripts/social/email_publisher.py`): `we believe`, `seamless`, `empowers`, `revolutionary`, `disruptive`, `synergy`, `digital transformation`, `enterprise-grade`, `talk to sales`, dashboard mockups in hero, `Discord` (we don't have one).

---

## Local Development

```bash
npm install
npm run dev         # http://localhost:3000 (Vite dev server)
npm run build       # Production build (tsc + vite build)
```

## Docker Deploy

```bash
docker-compose up -d --build
# host port 3003 → container port 3000
```

The container installs `python3` + `git` for `/api/register-dapp` (spawns `smtp_sender.py` for Chairman notification, `simple-git` for shallow repo clone).

### Volume mounts (production)

| Host path | Container path | Purpose |
|---|---|---|
| `./public/downloads` | `/app/public/downloads` | Generated reports, paper PDF |
| `./public/submissions` | `/app/public/submissions` | Alpha registry submission JSONs |
| `/root/DPO2U/03-Ferramentas/Scripts/social` | `/dpo2u-scripts:ro` | SMTP sender script |
| `/root/DPO2U/.agent-smtp-credentials.env` | `/dpo2u-creds/smtp.env:ro` | SMTP credentials |
| `/tmp/dpo2u-alpha` | `/tmp/dpo2u-alpha` | Cloned alpha-tester repos |

---

## API

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/register-dapp` | POST | Alpha registry intake — clones repo, persists submission, emails Chairman |
| `/api/alpha-list` | GET | Showcase data — `processed && showPublicly` only, names + jurisdictions |
| `/api/analise/generate` | POST | Legacy LGPD diligence (preserved for backward compatibility) |
| `/api/agents` | GET | Internal agent registry mock |

Submissions are processed manually by the Chairman via:

```bash
python3 /root/DPO2U/03-Ferramentas/Scripts/social/process_submission.py --id <uuid>
python3 /root/DPO2U/03-Ferramentas/Scripts/social/process_submission.py --id <uuid> --finalize --score 78 --show-publicly
```

CLI alternative (single pipeline — same `/api/register-dapp` backend):

```bash
python3 /root/DPO2U/03-Ferramentas/Scripts/social/dpo2u_register_wizard.py --endpoint http://localhost:3003
```

---

## License

MIT
