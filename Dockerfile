# Build Stage
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production Stage
FROM node:20-alpine
WORKDIR /app

# Runtime deps for register-dapp pipeline:
#   - python3 → spawn smtp_sender.py from server.js
#   - git → simple-git shallow clone of submitter repos
#   - ca-certificates → HTTPS git clone + SMTP TLS
#   - bash → invoke send-email.sh / smtp_sender.py from spawn
#   - curl → send-email.sh uses curl SMTP; missing curl silently broke email delivery (2026-04-29)
#   - coreutils → busybox mktemp rejects the `mktemp /tmp/email_XXXXXX.eml` template that send-email.sh uses
RUN apk add --no-cache python3 git ca-certificates bash curl coreutils

# Install production deps (express + simple-git)
COPY package*.json ./
RUN npm install --omit=dev && npm install express simple-git helmet express-rate-limit

# Copy built assets
COPY --from=build /app/dist ./dist
COPY --from=build /app/public ./public
COPY server.js .
# server-routes/ is imported by server.js (Stripe Checkout, Sprint 1 S1.9 — 2026-05-12)
COPY server-routes ./server-routes

# Create downloads + submissions dirs
RUN mkdir -p public/downloads public/submissions && chmod 755 public/downloads public/submissions

# Security hardening (P0 2026-05-01): drop root, set ownership.
# node:20-alpine ships with `node` user (uid 1000).
RUN chown -R node:node /app
USER node

EXPOSE 3000

CMD ["node", "server.js"]
