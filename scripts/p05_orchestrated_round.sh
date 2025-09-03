#!/usr/bin/env bash
set -euo pipefail

# P05 — Rodada orquestrada: Orchestrator + especialistas com prompts específicos

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
PROJECT_DIR="$ROOT_DIR"
TS="$(date +%Y%m%d_%H%M%S)"
OUTPUT_DIR="$PROJECT_DIR/agents_outputs/orchestrated_$TS"
mkdir -p "$OUTPUT_DIR"

export PROJECT_DIR
export OUTPUT_DIR
export VAULT_PATH="/root/workspace/obsidian-deploy/obsidian-vaults/NexusCerebral"
if [ -f "/root/secrets/OPENAI_API_KEY" ]; then
  export OPENAI_API_KEY="$(cat /root/secrets/OPENAI_API_KEY)"
fi

echo "[P05] Rodada orquestrada — Artefatos: $OUTPUT_DIR"

run_agent() {
  local agent="$1"; shift
  local desc="$1"; shift
  local prompt="$*"
  local log_file="$OUTPUT_DIR/${agent// /_}.log"
  local out_file="$OUTPUT_DIR/${agent// /_}.out.md"
  echo -e "\n▶ $agent — $desc\n"
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

# Orchestrator overview
run_agent orchestrator "P05 Orchestrator – Coordenação de Correções" \
"Objective: Avaliar e corrigir a landing P05 com foco em UX/UI, acessibilidade, deduplicação de seções e remoção de elementos internos.\n\nScope: src/app/page.tsx, components/*, enhanced/*, lib/agents.ts.\n\nIssues-chave:\n- Dark mode inconsistente; header incompleto; páginas legais (Privacidade/Termos/LGPD) não acessíveis por navegação.\n- Modal de agentes (Arquitetura de Classes) vazio, mas agentes listados em outra seção (duplicidade).\n- 'Technical Deep Dive' em inglês; 'Arquitetura em 4 níveis' duplicada com live production.\n- 'Orquestração Final Concluída' é output interno – remover do site.\n- 'Sistema Multiagente ao Vivo' deve estar em 'Sistema Multiagentes – Live Production'.\n- FAQ desatualizado.\n\nSuccess criteria: A11y ≥ 95; SEO ≥ 95; Perf ≥ 90; sem duplicação; navegação para políticas e termos; dark mode coerente.\nDeliverable: plano de ação por agente + checklist final."

# UX/UI + Frontend (dark mode, header, remoções, âncoras)
run_agent dpo2u-frontend-ux-specialist "P05 UX – Dark mode, header, remoções" \
"Tarefas:\n- Aplicar dark mode consistente (corrigir seções com bg-* sem dark:*).\n- Completar header (links, aria, foco, mobile) e incluir links para /privacy e /terms.\n- Remover 'Orquestração Final Concluída' do site público.\n- Mover/ajustar 'Sistema Multiagente ao Vivo' para seção 'Sistema Multiagentes – Live Production'.\n- Garantir CSP compatível após alterações.\nOutput: notas e diffs propostos."

# Frontend – Modal de agentes + deduplicação
run_agent software-architect "P05 Arquitetura – Modal de Agentes & Deduplicação" \
"Tarefas:\n- Popular o modal 'Arquitetura de Classes' a partir de src/lib/agents.ts.\n- Evitar duplicidade com a outra seção de agentes; fonte única de dados.\n- Consolidar 'Arquitetura em 4 níveis' e evitar repetição com live production.\nOutput: proposta de estrutura e diffs."

# Conteúdo – Deep Dive PT-BR e FAQ
run_agent technical-writer "P05 Conteúdo – PT-BR Deep Dive" \
"Tarefas:\n- Localizar 'Technical Deep Dive' para PT-BR com terminologia consistente.\n- Revisar páginas legais (Privacidade/Termos/LGPD) – clareza e aderência.\nOutput: texto final PT-BR e notas."

run_agent copywriter-seo-geo "P05 Conteúdo – FAQ atualizado" \
"Tarefas:\n- Atualizar FAQ para refletir o restante do site (métricas, ofertas, LGPD).\n- Remover redundâncias ('145+'/'ROI 400%') em excesso.\nOutput: FAQ proposto revisado."

# Acessibilidade
run_agent accessibility-design-specialist "P05 A11y – Aria/Headings/Contrast" \
"Tarefas:\n- Aria-hidden para ícones decorativos restantes; revisão de headings H1/H2; contrastes; foco visível.\n- Links descritivos e nomes acessíveis para navegação.\nOutput: checklist A11y e recomendações."

# Performance
run_agent performance-engineer "P05 Performance – Lighthouse" \
"Tarefas:\n- Rodar Lighthouse (desktop/mobile); sugerir lazy-load e otimizações (imagens/animações).\nTargets: Perf ≥ 90; A11y ≥ 95; SEO ≥ 95.\nOutput: relatório e ações."

# Segurança/LGPD
run_agent security-auditor "P05 Segurança & LGPD – Consent/CSP" \
"Tarefas:\n- Validar consentimento/cookies, páginas legais acessíveis, CSP, coleta no formulário.\n- Riscos comuns (XSS/leakage) e mitigação.\nOutput: relatório executivo com severidades."

# QA/Code Review
run_agent test-engineer "P05 Testes – E2E mínimos" \
"Tarefas:\n- Planejar E2E cobrindo header/nav, dark mode, /privacy, /terms, modal agentes, remoções ('Orquestração Final Concluída'), 'Live Production', FAQ.\nOutput: plano de testes e casos prioritários."

run_agent code-reviewer "P05 Code Review – Verificação das mudanças" \
"Tarefas:\n- Revisar diffs e consistência das mudanças propostas; nomes, escopo mínimo e padrões.\nOutput: parecer final com TODOs."

echo -e "\n✅ Rodada orquestrada disparada. Artefatos em: $OUTPUT_DIR"

