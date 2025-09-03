---
title: P05 — Agent Missions (Execução + Auditoria)
updated_at: 2025-09-03
status: ready
---

# P05 — Agent Missions (Execução + Auditoria)

Objetivo: acionar os agentes do ecossistema para fechar os gaps do P05 (Landing Page DPO2U) e, em seguida, solicitar auditoria técnica/brand/compliance.

Referências de gaps levantados
- API placeholders 404; assets públicos ausentes (favicons, og-image)
- Páginas legais ausentes (Privacy/Terms) + consentimento LGPD
- Integrações analytics/marketing condicionadas a consentimento
- Repetição de claims (145+, ROI 400%) entre seções
- Testes mínimos (unit/E2E) e verificação Lighthouse
- Docker compose (nginx) incompleto; sem vercel.json por opção

Escopo do repositório alvo
- Repo: P05_DPO2U_Landing_Page
- Path: workspace/obsidian-deploy/obsidian-vaults/NexusCerebral/1_Projetos/P05_DPO2U_Landing_Page

Como usar (via task-agents)
- Listar agentes: `task-agents --list`
- Executar missão com artefatos: `scripts/p05_run_agents.sh`
- Solicitar auditorias com artefatos: `scripts/p05_request_audit.sh`

Saída de artefatos (logs e respostas)
- Diretório: `agents_outputs/<timestamp>/`
- Formato: `*.out.md` (resposta) e `*.log` (log de execução)

Missions por agente

1) dpo2u-frontend-ux-specialist
- Missão: Implementar banner de cookies com consentimento (opt-in) e bloquear GA/Pixel/HubSpot até consentir; adicionar páginas `privacy` e `terms` com conteúdo placeholder e marcação semântica; substituir referências `/api/placeholder/32/32` por ícones estáticos ou rota funcional mínima; acrescentar `aria-hidden` em ícones decorativos. Não adicionar vercel.json.
- Critérios: sem 404 em assets/placeholder; navegação para /privacy e /terms; Lighthouse A11y > 95; CSP compatível com scripts condicionais.

2) copywriter-seo-geo
- Missão: Consolidar copy para reduzir redundância entre seções (Hero/About/Architecture/Benefits), preparar conteúdos para páginas “Política de Privacidade” e “Termos de Uso” (BR, LGPD), revisar títulos/descrições para SEO; atualizar meta description se necessário mantendo posicionamento.
- Critérios: leitura fluida por seção; densidade de keywords natural; H1/H2 coerentes; conteúdo legal claro (não jurídico formal excessivo) e alinhado a LGPD.

3) dpo2u-brand-designer
- Missão: Entregar conjunto de favicons (16/32), `apple-touch-icon.png`, `safari-pinned-tab.svg`, `og-image.jpg` (1200×630) com identidade DPO2U (primário #0066CC, estilo professional-legal-design). Validar contrastes e aparência em dark mode.
- Critérios: zero 404 de assets; og-image coerente; contrastes ≥ 4.5:1.

4) test-engineer
- Missão: Criar teste unitário mínimo (render do Home) e E2E Playwright validando: carregamento da home (hero/CTA), existência de `/robots.txt` e `/sitemap.xml`, navegação para `/privacy` e `/terms`.
- Critérios: testes passando localmente; scripts `npm run test` e `npm run test:e2e` funcionais.

5) performance-engineer
- Missão: Rodar Lighthouse local em `http://localhost:3000` (ou porta configurada), registrar relatórios e sugerir lazy-loading/otimizações (imagens, framer-motion quando fora de viewport, etc.).
- Critérios: Performance ≥ 90; Acessibilidade ≥ 95; SEO ≥ 95.

6) security-auditor
- Missão: Revisar LGPD (consentimento, política, termos), CSP/headers do `next.config.js`, pontos de coleta (formulário), e riscos comuns (XSS, mixed content, leakage). Emitir relatório com recomendações.
- Critérios: Itens de alto risco endereçados; CSP compatível com scripts necessários; consentimento efetivo.

7) code-reviewer
- Missão: Revisão final do diff de implementação (mudanças mínimas e coerentes), estilo, nomes e organização; checklist de aceite.
- Critérios: aprovação com notas e TODOs finais.

8) content-creator
- Missão: Integrar artefatos e relatórios no Obsidian (PARA), criar cross-links com P05 docs, salvar relatórios de auditoria e métricas.
- Critérios: sessão registrada; links corretos; materiais localizáveis.

Auditoria pós-execução (pedir aos agentes)
- Security + Performance + Brand + Code Review: solicitar auditoria e consolidar em um único relatório executivo anexado ao vault (Areas/Session_Logs e na pasta do P05).

Observações
- Não adicionar vercel.json (requisito do solicitante).
- Se docker-compose/nginx forem mantidos: fornecer `nginx.conf` de exemplo em docs, não em produção.
