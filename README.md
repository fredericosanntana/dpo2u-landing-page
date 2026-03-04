# DPO2U Landing Page

Institutional website for **DPO2U** — a compliance-as-a-protocol platform combining AI, blockchain, and privacy regulation automation.

**Live**: [dpo2u.com](https://dpo2u.com)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 15.5 + React 18 |
| **Language** | TypeScript (strict mode) |
| **Styling** | Tailwind CSS 4.0 + custom design system |
| **Animations** | Framer Motion |
| **Forms** | React Hook Form + Zod validation |
| **Infrastructure** | Docker multi-stage build, Traefik reverse proxy, Let's Encrypt SSL |

## Architecture

```
src/
├── components/          # React components (Hero, Services, ROI Calculator, etc.)
├── css/                 # Global styles + design system tokens
├── pages/               # Next.js pages
├── lib/                 # Utility functions
└── public/              # Static assets
```

**Deploy pipeline**: `git push` → Docker multi-stage build → Traefik (auto-SSL) → `dpo2u.com`

## Features

- **8-section landing page**: Hero, About, Services, Benefits, How It Works, Testimonials, CTA, Footer
- **Interactive ROI Calculator**: Estimates compliance cost savings in real-time
- **Performance**: Lighthouse 95+, <2s load time, Core Web Vitals passing
- **Accessibility**: WCAG 2.2 AA compliant, semantic HTML, 4.5:1 contrast ratios
- **SEO**: Structured data (Schema.org), auto-generated sitemap, optimized meta tags

## Local Development

```bash
git clone https://github.com/fredericosanntana/dpo2u-landing-page.git
cd dpo2u-landing-page
npm install
npm run dev         # http://localhost:3000
npm run build       # Production build
```

## Docker Deploy

```bash
docker build -t dpo2u-landing .
docker run -p 3000:3000 dpo2u-landing
```

The production deployment runs behind Traefik with automatic SSL certificate provisioning via Let's Encrypt.

## License

MIT
