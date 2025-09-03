#!/usr/bin/env bash
set -euo pipefail

# P05 — Orquestração de agentes (execução)
# Requisitos: task-agents CLI instalado e agentes registrados

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
PROJECT_DIR="$ROOT_DIR"
TS="$(date +%Y%m%d_%H%M%S)"
OUTPUT_DIR="$PROJECT_DIR/agents_outputs/$TS"
mkdir -p "$OUTPUT_DIR"

# Export common env for agents
export PROJECT_DIR
export OUTPUT_DIR
export VAULT_PATH="/root/workspace/obsidian-deploy/obsidian-vaults/NexusCerebral"
if [ -f "/root/secrets/OPENAI_API_KEY" ]; then
  export OPENAI_API_KEY="$(cat /root/secrets/OPENAI_API_KEY)"
fi

echo "[P05] Diretório do projeto: $PROJECT_DIR"

run_agent() {
  local agent="$1"; shift
  local desc="$1"; shift
  local prompt="$*"
  echo "\n▶ Executando agente: $agent — $desc"
  echo "Prompt:\n$prompt\n"
  # Observação: a execução real depende do ambiente e registro de agentes
  local log_file="$OUTPUT_DIR/${agent// /_}.log"
  local out_file="$OUTPUT_DIR/${agent// /_}.out.md"
  # Captura a saída integral em arquivo
  (
    echo "# Agent: $agent"
    echo "## Description"
    echo "$desc"
    echo "\n## Prompt"
    echo '```'
    echo "$prompt"
    echo '```'
    echo "\n## Execution"
    task-agents --subagent-type "$agent" --description "$desc" --prompt "$prompt"
  ) 2>&1 | tee "$log_file" > "$out_file"
}

# 1) Frontend UX — implementar consentimento LGPD, páginas legais e fixes de acessibilidade
run_agent dpo2u-frontend-ux-specialist "P05 UX Implementações" \
  "Contexto: P05 Landing Page em $PROJECT_DIR.\n\nTarefas: \n- Implementar banner de cookies com consentimento (opt-in) bloqueando GA/Pixel/HubSpot até consentir.\n- Criar páginas /privacy e /terms com conteúdo placeholder semântico.\n- Substituir /api/placeholder/... por ícones estáticos ou rota mínima funcional.\n- Adicionar aria-hidden a ícones decorativos.\n- Não adicionar vercel.json.\n\nCritérios: sem 404 de assets/placeholder; /privacy e /terms acessíveis; lighthouse a11y > 95; CSP compatível."

# 2) Copywriter — consolidação de copy e conteúdos legais
run_agent copywriter-seo-geo "P05 Conteúdo & SEO" \
  "Consolidar copy para reduzir redundância entre seções (Hero/About/Architecture/Benefits).\nPreparar conteúdo para Política de Privacidade e Termos de Uso (PT-BR, LGPD), mantendo tom DPO2U.\nRevisar títulos e descrições para SEO e clareza."

# 3) Brand Designer — assets de marca
run_agent dpo2u-brand-designer "P05 Assets de Marca" \
  "Entregar favicons (16/32), apple-touch-icon.png, safari-pinned-tab.svg e og-image.jpg (1200x630).\nPrimário #0066CC; estilo professional-legal-design; checar contraste e dark mode."

# 4) Test Engineer — testes mínimos
run_agent test-engineer "P05 Testes" \
  "Criar testes: unit (render home) e E2E (home carrega; /robots.txt e /sitemap.xml; /privacy e /terms).\nScripts npm run test e npm run test:e2e devem passar localmente."

# 5) Performance Engineer — auditoria Lighthouse
run_agent performance-engineer "P05 Performance" \
  "Rodar Lighthouse local (porta 3000 salvo override). Registrar relatórios e sugerir otimizações (lazy-load, imagens, animações).\nAlvos: Perf ≥ 90, A11y ≥ 95, SEO ≥ 95."

# 6) Security Auditor — LGPD/CSP
run_agent security-auditor "P05 Segurança & LGPD" \
  "Auditar consentimento LGPD, políticas/termos, CSP/headers (next.config.js) e coleta de dados (formulário).\nEmitir recomendações e validar riscos comuns (XSS, leakage)."

# 7) Code Reviewer — revisão final
run_agent code-reviewer "P05 Code Review" \
  "Revisão final do diff: mudanças mínimas, nomes coerentes, organização, checklist de aceite, TODOs finais."

echo "\n✅ Disparo de agentes concluído (se task-agents estiver configurado no ambiente)."
echo "📁 Artefatos: $OUTPUT_DIR"
