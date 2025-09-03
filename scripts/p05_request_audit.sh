#!/usr/bin/env bash
set -euo pipefail

# P05 — Solicitação de auditoria (pós-execução)
# Requisitos: task-agents CLI instalado e agentes registrados

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
PROJECT_DIR="$ROOT_DIR"
TS="$(date +%Y%m%d_%H%M%S)"
OUTPUT_DIR="$PROJECT_DIR/agents_outputs/audits_$TS"
mkdir -p "$OUTPUT_DIR"

export PROJECT_DIR
export OUTPUT_DIR
export VAULT_PATH="/root/workspace/obsidian-deploy/obsidian-vaults/NexusCerebral"
if [ -f "/root/secrets/OPENAI_API_KEY" ]; then
  export OPENAI_API_KEY="$(cat /root/secrets/OPENAI_API_KEY)"
fi

echo "[P05] Diretório do projeto: $PROJECT_DIR"

request_audit() {
  local agent="$1"; shift
  local desc="$1"; shift
  local prompt="$*"
  echo "\n▶ Solicitando auditoria: $agent — $desc"
  echo "Prompt:\n$prompt\n"
  local log_file="$OUTPUT_DIR/${agent// /_}.log"
  local out_file="$OUTPUT_DIR/${agent// /_}.out.md"
  (
    echo "# Audit Agent: $agent"
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

request_audit security-auditor "P05 Auditoria Segurança & LGPD" \
  "Auditar P05 (LGPD, CSP, coleta de dados, consentimento). Entregar relatório executivo com severidades e ações."

request_audit performance-engineer "P05 Auditoria Performance" \
  "Lighthouse (Desktop/Mobile), gargalos de renderização, bundle, imagens, animações. Anexar relatório e checklist de otimização."

request_audit dpo2u-brand-designer "P05 Auditoria Brand" \
  "Checar consistência visual, cores (#0066CC), contraste, dark mode, assets públicos e og-image."

request_audit code-reviewer "P05 Code Review Final" \
  "Revisão do diff consolidado; validar escopo mínimo, nomeação e legibilidade. Aprovação final com TODOs."

echo "\n✅ Solicitações de auditoria disparadas (se task-agents estiver configurado)."
echo "📁 Artefatos: $OUTPUT_DIR"
