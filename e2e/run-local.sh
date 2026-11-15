#!/usr/bin/env bash
# Sobe o gateway (../DPO2U/packages/pilot-gateway, já buildado) e o site em preview,
# roda o teste de aceitação e derruba tudo. Uso: GATEWAY_DIR=/caminho/pilot-gateway e2e/run-local.sh
set -euo pipefail
GATEWAY_DIR=${GATEWAY_DIR:?defina GATEWAY_DIR}
TMP=$(mktemp -d)
export MAIL_CAPTURE_FILE="$TMP/mail.jsonl"
(
  cd "$GATEWAY_DIR"
  PORT=3999 NODE_ENV=test MAIL_DISABLED=1 SESSION_COOKIE_INSECURE=1 APP_BASE_URL=http://localhost:4173 \
  CORS_ALLOWED_ORIGINS=http://localhost:4173 API_KEYS_FILE="$TMP/api-keys.json" ATTESTATIONS_FILE="$TMP/att.json" \
  CONTROL_PLANE_STORE_DIR="$TMP/cp" LOG_FILE="$TMP/gw.log" RATE_LIMIT_MAX=1000 AUTH_RATE_LIMIT=100 \
  exec node dist/index.js >"$TMP/gw.out" 2>&1
) &
GW_PID=$!
VITE_GATEWAY_BASE_URL=http://localhost:3999 npx vite build >/dev/null
npx vite preview --port 4173 --strictPort >"$TMP/site.out" 2>&1 &
SITE_PID=$!
trap 'kill $GW_PID 2>/dev/null; pkill -P $SITE_PID 2>/dev/null; kill $SITE_PID 2>/dev/null; pkill -f "vite preview --port 4173" 2>/dev/null || true' EXIT
for i in $(seq 1 60); do curl -sf http://localhost:3999/health >/dev/null && curl -sf http://localhost:4173 >/dev/null && break; sleep 1; done
node e2e/financial-journey.mjs || { echo "--- mail:"; head -c 600 "$MAIL_CAPTURE_FILE" 2>/dev/null; echo "--- gw:"; grep -iE "error|warn" "$TMP/gw.out" | tail -5; exit 1; }
