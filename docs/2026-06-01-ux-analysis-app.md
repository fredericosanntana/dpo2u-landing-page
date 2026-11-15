# Análise UX/UI + fluxo do `/app` — atestação (repo + pontos de melhoria)

**Data:** 2026-06-01 · **Escopo:** produto autenticado `/app` (Solana-only) + gateway `mcp.dpo2u.com`
**Gatilho:** ao atestar um repositório, a atestação aparecia com pouquíssimos dados — sem identificar o repo (mostrava o genérico `managed_compliance_v1` / "managed") e sem os pontos de melhoria.

## 1. Fluxo atual
`/app/activate` (repo + CNPJ + jurisdições) → `POST /api/v1/managed/{activate,run}` → o gateway escaneia o repo (`managed-scan`), calcula score + gaps + flags por requisito, ancora o selo na Solana (`solana-driver`, PDA do compliance-registry) → responde → `/app` guarda no histórico local → `dashboard`/`evidence` listam → `/verify/sol` verifica on-chain (trustless).

## 2. Onde o dado se perdia (causa-raiz)
O backend **já produzia** dado rico (`evidence = { repo_url, jurisdiction, score, gaps[], controls{} }`), mas ele morria:
- **Resposta efêmera:** `ManagedRunResult` retornava só `verdict/score/gaps/hash/tx` — **sem `repo_url`/`controls`**.
- **On-chain mínimo (by design):** a PDA guarda `commitment + verdict + storage_uri` — sem repo/gaps/score.
- **Store server-side incompleto:** `GET /api/v1/attestation/:id` devolvia `verdict/hash/tx` — sem repo/gaps. O `evidence` completo nunca era persistido.
- **Frontend descartava:** `addHistory` só guardava `verdict/score/hash` (sem repo/gaps/jurisdição); `HistoryRef` nem tinha os campos. **Bug:** `addPipeline` gravava o **CNPJ** como `repoUrl`.
- **Exibição genérica:** dashboard/evidence rotulavam tudo por `useCaseId` (=`managed_compliance_v1`) → toda atestação parecia "managed". Sem view de detalhe; gaps em lugar nenhum.
- **Merge destrutivo:** no dedup on-chain+local, o registro on-chain (sem contexto) sobrescrevia o local.

## 3. Problemas priorizados
- **P0** repositório invisível / rótulo genérico "managed".
- **P0** pontos de melhoria (gaps) invisíveis — o valor central ("o que melhorar") não aparecia.
- **P1** sem view de detalhe da atestação; dados não-duráveis (sumiam em reload/outro device/verify).
- **P2** evidence agrupava por use_case (tudo num grupo) em vez de por repositório; empty-states/labels/onboarding.

## 4. Correções implementadas (2026-06-01)
**Backend (`pilot-gateway`):**
- `ManagedRunResult` agora retorna `repo_url`, `jurisdiction`, `controls`.
- Novo `attestation-summary-store` (JSON + mutex, em `/data`, volume persistente) — guarda `{ hash, subject, repo_url, jurisdiction, score, gaps[], controls, verdict, chain, tx, created_at }`.
- Novo `GET /api/v1/managed/attestation?hash=&subject=` → devolve o resumo (recuperável por dashboard/evidence/verify, inclusive em outro device).

**Frontend (`/app`):**
- Fix do `addPipeline` (repo real, não CNPJ) + `HistoryRef` estendido (`repo`, `gaps`, `jurisdictions`, `controls`) e captura no activate.
- Dashboard e evidence rotulam pelo **nome do repo**; merge **preserva** o enriquecimento local; linhas só-on-chain buscam o resumo via endpoint.
- Novo `AttestationDetailSheet` (drawer) com repo, veredito, score (barra), jurisdições e **lista de pontos de melhoria** com CTA "como resolver" (deep-link pro gerador de documentos).
- `dashboard` KPI "jurisdictions" → "repositories"; `evidence` "by use case" → "by repository"; export JSON inclui repo + gaps + jurisdições.
- Card de resultado do `activate` mostra repo + gaps acionáveis.
- `/verify/sol` enriquecido: além do verdict trustless da PDA, busca o resumo e mostra **repo + score + gaps** (decisão de produto — expõe no verify público; copy de disclosure atualizada).

## 5. Pendências / próximos passos
- **Privacidade:** hoje o resumo (repo/gaps/score) é exposto no `/verify` público por escolha do Shareholder. Se algum repo for privado e sensível, avaliar tornar gaps/score **opt-in** por atestação (toggle no endpoint).
- **Auth do resumo:** o GET é escopado por (hash[,subject]) sem assinatura — suficiente p/ devnet; mainnet pode exigir prova de posse da wallet.
- **Mainnet:** programa em devnet; resumo e fluxo prontos, faltam deploy mainnet + submitter fundado.
- **controls/flags:** capturados e persistidos; ainda não renderizados como checklist por-requisito no detalhe (oportunidade de UX: mostrar ✓/✗ por controle).
