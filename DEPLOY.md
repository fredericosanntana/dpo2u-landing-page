---
title: 🚀 Deploy Guide - DPO2U Landing Page
tipo: projeto
tags: [lgpd, performance, security]
updated_at: 2025-09-01
---
# 🚀 Deploy Guide - DPO2U Landing Page

**Projeto**: Landing Page Institucional DPO2U  
**Stack**: Next.js 15 + TypeScript + Tailwind CSS 4.0  
**Status**: ✅ **Pronto para Deploy**

## Pré-requisitos

### Tecnologias Necessárias
- **Node.js**: >= 18.17.0
- **npm**: >= 9.0.0  
- **Docker**: >= 20.10.0 (opcional)
- **Docker Compose**: >= 2.0.0 (opcional)

### Dependências do Sistema
```bash
# Ubuntu/Debian
sudo apt update && sudo apt install -y nodejs npm docker.io docker-compose

# CentOS/RHEL
sudo yum install -y nodejs npm docker docker-compose

# macOS (com Homebrew)
brew install node docker docker-compose
```

## Desenvolvimento Local

### 1. Instalação das Dependências
```bash
# Clone ou navegue até o diretório do projeto
cd P05_DPO2U_Landing_Page

# Instalar dependências
npm install

# Verificar versões
node --version  # v18.17.0+
npm --version   # 9.0.0+
```

### 2. Executar em Modo Desenvolvimento
```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Acessar aplicação
# http://localhost:3000
```

### 3. Scripts Disponíveis
```bash
# Desenvolvimento
npm run dev          # Servidor de desenvolvimento com hot reload
npm run build        # Build de produção
npm run start        # Servidor de produção
npm run lint         # ESLint check
npm run type-check   # TypeScript check

# Testing
npm run test         # Testes unitários (Vitest)
npm run test:ui      # Interface dos testes
npm run test:e2e     # Testes E2E (Playwright)

# Performance
npm run analyze      # Bundle analyzer
npm run lighthouse   # Lighthouse CI
```

## Deploy em Produção

### Opção 1: Deploy Tradicional (VPS/Servidor)

#### 1.1 Build da Aplicação
```bash
# Build otimizado para produção
npm run build

# Testar build localmente
npm run start
```

#### 1.2 Deploy no Servidor
```bash
# Transferir arquivos para servidor
scp -r . user@server:/opt/dpo2u-landing/

# No servidor
cd /opt/dpo2u-landing/
npm ci --only=production
npm run build

# Configurar PM2 (processo manager)
npm install -g pm2
pm2 start npm --name "dpo2u-landing" -- start
pm2 startup
pm2 save
```

#### 1.3 Configuração Nginx
```nginx
# /etc/nginx/sites-available/dpo2u.com.br
server {
    listen 80;
    server_name dpo2u.com.br www.dpo2u.com.br;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name dpo2u.com.br www.dpo2u.com.br;
    
    # SSL Configuration
    ssl_certificate /path/to/ssl/cert.pem;
    ssl_certificate_key /path/to/ssl/key.pem;
    
    # Security headers
    add_header X-Frame-Options SAMEORIGIN;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    
    # Cache static files
    location /_next/static/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Proxy to Next.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Opção 2: Deploy com Docker

#### 2.1 Build da Imagem Docker
```bash
# Build da imagem
docker build -t dpo2u-landing:latest .

# Ou usar docker-compose
docker-compose build
```

#### 2.2 Executar com Docker Compose
```bash
# Iniciar todos os serviços
docker-compose up -d

# Verificar logs
docker-compose logs -f dpo2u-landing

# Parar serviços
docker-compose down
```

#### 2.3 Configuração Docker em Produção
```bash
# Criar network personalizada
docker network create dpo2u-network

# Executar com configurações de produção
docker run -d \
  --name dpo2u-landing \
  --network dpo2u-network \
  -p 3000:3000 \
  --restart unless-stopped \
  -e NODE_ENV=production \
  dpo2u-landing:latest
```

### Opção 3: Deploy na Vercel (Recomendado)

#### 3.1 Configuração Vercel
```bash
# Instalar Vercel CLI
npm install -g vercel

# Login na Vercel
vercel login

# Deploy
vercel --prod
```

#### 3.2 Configuração do Projeto (vercel.json)
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "routes": [
    {
      "src": "/robots.txt",
      "dest": "/robots.txt"
    },
    {
      "src": "/sitemap.xml", 
      "dest": "/api/sitemap"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "SAMEORIGIN"
        },
        {
          "key": "X-Content-Type-Options", 
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

## Configuração de Environment

### Variáveis de Ambiente
```bash
# .env.local (desenvolvimento)
NODE_ENV=development
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_FACEBOOK_PIXEL_ID=000000000000000
NEXT_PUBLIC_HUBSPOT_PORTAL_ID=00000000

# .env.production (produção)
NODE_ENV=production
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX  # Google Analytics
NEXT_PUBLIC_FACEBOOK_PIXEL_ID=000000000000000  # Facebook Pixel
NEXT_PUBLIC_HUBSPOT_PORTAL_ID=00000000  # HubSpot
NEXT_PUBLIC_SITE_URL=https://dpo2u.com.br
```

## SSL/TLS Configuration

### Certificado SSL Gratuito (Let's Encrypt)
```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx

# Obter certificado
sudo certbot --nginx -d dpo2u.com.br -d www.dpo2u.com.br

# Renovação automática
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

## Performance Optimization

### 1. Lighthouse Audit
```bash
# Executar audit de performance
npm run lighthouse

# Targets:
# Performance: >95
# Accessibility: >95  
# Best Practices: >90
# SEO: >95
```

### 2. Bundle Analysis
```bash
# Analisar tamanho do bundle
npm run analyze

# Targets:
# Initial bundle: <300KB
# Total JavaScript: <1MB
# First Contentful Paint: <2s
```

### 3. Monitoramento Contínuo
- **Core Web Vitals**: Monitoramento via Google Search Console
- **Real User Monitoring**: Vercel Analytics ou Google Analytics
- **Error Tracking**: Sentry.io ou LogRocket
- **Uptime Monitoring**: Pingdom ou UptimeRobot

## Analytics & Tracking Setup

### Google Analytics 4
```html
<!-- gtag.js -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Facebook Pixel
```html
<!-- Meta Pixel -->
<script>
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', '000000000000000');
  fbq('track', 'PageView');
</script>
```

## Security Checklist

### ✅ Headers de Segurança
- [x] X-Frame-Options: SAMEORIGIN
- [x] X-Content-Type-Options: nosniff  
- [x] Referrer-Policy: strict-origin-when-cross-origin
- [x] Content-Security-Policy: Configurado

### ✅ SSL/TLS
- [x] HTTPS Only (Force redirect)
- [x] TLS 1.2+ apenas
- [x] HSTS Header habilitado
- [x] Certificado válido e confiável

### ✅ Dados e Privacidade
- [x] LGPD Compliance (Cookie Policy)
- [x] GDPR Ready (Privacy Policy)
- [x] Consentimento de cookies
- [x] Opt-out analytics disponível

## Troubleshooting

### Problemas Comuns

#### 1. Build Failures
```bash
# Limpar cache
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

#### 2. Performance Issues
```bash
# Verificar bundle size
npm run analyze

# Verificar lighthouse
npm run lighthouse

# Check Core Web Vitals
npx @next/bundle-analyzer
```

#### 3. Docker Issues
```bash
# Rebuild imagem
docker-compose build --no-cache

# Verificar logs
docker-compose logs dpo2u-landing

# Restart services
docker-compose restart
```

### Logs e Monitoramento
```bash
# PM2 logs
pm2 logs dpo2u-landing

# Docker logs
docker logs dpo2u-landing

# Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

## Maintenance

### Updates Regulares
```bash
# Atualizar dependências (mensal)
npm audit
npm update

# Atualizar Next.js (trimestral)
npm install next@latest react@latest react-dom@latest

# Build e test
npm run build && npm run test
```

### Backup Strategy
- **Código**: Git repository (GitHub/GitLab)
- **Assets**: CDN/Cloud Storage backup
- **Analytics Data**: Export regular (Google Analytics)
- **SSL Certs**: Automatic renewal + backup

---

## 🎯 Success Metrics

### Performance Targets
- **Lighthouse Score**: >95 em todas as métricas
- **Core Web Vitals**: Todos "Good"
- **Page Load Time**: <2 segundos
- **Time to Interactive**: <3 segundos

### Business Targets  
- **Conversion Rate**: >3%
- **Lead Generation**: +150% vs baseline
- **SEO Ranking**: Top 3 para keywords principais
- **User Engagement**: >2 min tempo na página

**Deploy Guide criado pelo Orchestrator Master**  
*Landing page DPO2U pronta para transformar compliance em vantagem competitiva*  
*Stack: Next.js 15 + Performance Excellence + Brand Compliance 100%*