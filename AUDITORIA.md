# Auditoria de Frontend — DPO2U Landing Page

**Data:** 04/03/2026  
**Versão analisada:** repositório `fredericosanntana/dpo2u-landing-page`  
**Stack:** React 18 + Vite + TypeScript + TailwindCSS + Radix UI + Framer Motion

---

## Resumo Executivo

A landing page possui uma base técnica sólida (design system bem estruturado, tokens de cor centralizados, componentes reutilizáveis), mas apresenta **inconsistências críticas** que comprometem a identidade visual, a manutenibilidade e a experiência do usuário. Os principais problemas são: **conflito de sistemas de cores**, **mistura de tokens de design**, **duplicação de seções** e **uso de classes Tailwind hardcoded** em vez dos tokens definidos.

---

## Problemas Identificados

### 1. Conflito de Sistemas de Cores (Crítico)

O projeto possui **três sistemas de cores paralelos e conflitantes**:

| Sistema | Localização | Cor Primária |
|---|---|---|
| `colors.css` (fonte de verdade declarada) | `--color-primary: #006dff` | Azul `#006dff` |
| `globals.css` (CSS variables) | `--dpo2u-blue: #4F46E5` | Indigo `#4F46E5` |
| `tailwind.config.ts` | `brand-blue-500: #0066CC` | Azul `#0066CC` |

**Impacto:** O mesmo botão `bg-primary` renderiza cores diferentes dependendo de qual variável CSS está em cascata. O `--primary` no `@layer base` usa HSL `222.2 47.4% 11.2%` (quase preto), enquanto o segundo bloco `:root` define `--primary: 0 109 255` (azul). Há dois blocos `:root` no mesmo arquivo `globals.css`.

### 2. Duplicação de Blocos `:root` em globals.css (Crítico)

O arquivo `globals.css` contém dois blocos `:root` separados:
- Linhas 9–36: Variáveis Radix/shadcn (HSL format)
- Linhas 73–130: Variáveis DPO2U brand (RGB format)

Isso causa conflito de especificidade e valores inconsistentes para as mesmas propriedades (`--primary`, `--secondary`, `--accent`, etc.).

### 3. Mistura de Tokens de Cor nos Componentes (Alto)

Nos componentes, há uso simultâneo e inconsistente de:
- `text-brand-blue-600` (Tailwind brand token)
- `text-blue-600` (Tailwind padrão)
- `text-primary` (CSS variable)
- `text-[#006dff]` (hardcoded)
- `color: var(--dpo2u-blue)` (CSS variable direta)

**Exemplos encontrados:**
- `Header.tsx`: `text-brand-blue-600` e `text-brand-emerald-600`
- `FAQSection.tsx`: `text-blue-600`, `from-blue-600 to-purple-600` (hardcoded)
- `page.tsx`: `text-green-600`, `text-blue-600`, `text-purple-600` (hardcoded)
- `Footer.tsx`: `bg-gradient-to-r from-brand-blue-500 to-brand-green-500`

### 4. Duplicação de Seção "Technology" (Alto)

Em `page.tsx`, há **duas seções** com `id="technology"` e conteúdo similar (linhas 327 e 424), o que viola acessibilidade (IDs únicos) e confunde o usuário com conteúdo repetido.

### 5. Tipografia Inconsistente (Médio)

- Títulos usam `font-serif` em alguns lugares e `font-display` em outros
- O design system define `font-display: 'Outfit'` mas os componentes usam `font-serif` (que não é mapeado para Outfit)
- `h1` em `page.tsx` usa `font-serif font-bold` mas o `globals.css` define headings com `font-family: var(--font-display)`

### 6. Header com Navegação Excessiva (Médio)

O `Header.tsx` possui **9 links de navegação** em desktop, tornando a barra de navegação sobrecarregada e difícil de usar. Links como "Privacidade", "Termos" e "LGPD" deveriam estar no footer.

### 7. Gradientes Hardcoded Inconsistentes (Médio)

- Hero usa `bg-gradient-premium` (definido no Tailwind)
- Seções internas usam `bg-gradient-to-b from-white to-slate-50` (hardcoded)
- CTA final usa `bg-brand-sapphire-800` mas o footer usa `bg-brand-sapphire-900`
- FAQSection usa `from-blue-50 to-purple-50` (hardcoded, fora do design system)

### 8. Página em Branco no Carregamento (Crítico)

A aplicação renderiza uma página em branco. Investigação indica possível erro de runtime silencioso no carregamento dos módulos. O `root` div permanece vazio após o carregamento.

### 9. Botões Inconsistentes (Médio)

- `FAQSection.tsx` usa `<button>` nativo com classes hardcoded em vez do componente `<Button>` do design system
- `page.tsx` usa `Button` com classes inline sobrescrevendo o design system
- Mistura de `variant="primary"` e `variant="cta-primary"` para o mesmo propósito

### 10. Seções com IDs Duplicados (Alto)

```
id="technology" — aparece 2x em page.tsx (linhas 327 e 424)
```

---

## Correções Implementadas

Veja o arquivo `CHANGELOG.md` para detalhes das alterações.
