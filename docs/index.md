---
sidebar_position: 0
title: 'Building a Compliance Attestation with Compact on Midnight'
description: 'Série de tutoriais end-to-end cobrindo como escrever contratos Compact, gerar zk-proofs de compliance e registrar attestations on-chain.'
tags: [tutorial, compact, midnight, zk-proofs, compliance, lgpd, gdpr]
---

# Building a Compliance Attestation with Compact on Midnight

> **Série de Tutoriais DPO2U** — Guia End-to-End  
> **Data de Publicação**: 04/03/2026  
> **Versão**: 1.0

---

## Sobre Esta Série

Esta série de tutoriais foi criada para preencher as lacunas de documentação mais críticas do protocolo DPO2U, fornecendo guias práticos e detalhados para desenvolvedores que desejam construir sobre a infraestrutura de Privacy-as-a-Service do DPO2U.

A série aborda três gaps identificados como de **alta relevância**:

| # | Gap | Tutorial |
|---|---|---|
| **1** | Nenhum tutorial hands-on de Compact — os smart contracts estão documentados conceitualmente mas não há guia passo-a-passo | [Compact Smart Contracts 101](./01-compact-smart-contracts.md) |
| **3** | Fluxo de Attestation end-to-end — como uma empresa vai do zero até ter uma attestation on-chain com zk-proof | [End-to-End Compliance Attestation Flow](./02-end-to-end-attestation-flow.md) |
| **6** | Zero-Knowledge Proofs explained — conceito mencionado em toda a docs mas sem página dedicada explicando como funciona no contexto DPO2U | [Zero-Knowledge Proofs in DPO2U](./03-zero-knowledge-proofs-in-dpo2u.md) |

---

## Pré-requisitos da Série

Para acompanhar os tutoriais de forma prática, você precisará de:

- **Compact Toolchain** instalada ([guia oficial](https://docs.midnight.network/getting-started/installation))
- **Node.js v18+** e **npm**
- Conhecimento básico de TypeScript/JavaScript
- Acesso à **Midnight Preprod Network** (rede de testes)

---

## Estrutura da Série

```
Parte 1: Compact Smart Contracts 101
  ├── Por que Compact e Midnight?
  ├── Conceitos: Ledger State, Circuits, disclose()
  ├── Escrevendo o contrato compliance-attestation.compact
  └── Compilando e entendendo os artefatos gerados

Parte 2: End-to-End Compliance Attestation Flow
  ├── O problema que estamos resolvendo
  ├── Fase 1: Preparação off-chain (estrutura do atestado JSON)
  ├── Fase 2: Interação com o contrato (script de emissão)
  ├── Fase 3: Verificação on-chain
  └── Ciclo de vida do atestado

Parte 3: Zero-Knowledge Proofs in DPO2U
  ├── O paradoxo da privacidade na blockchain
  ├── O que são ZKPs? (analogia da caverna de Ali Baba)
  ├── ZK-SNARKs: as três fases (Setup, Proof Generation, Verification)
  ├── Mapeamento ZKP → DPO2U
  └── Divulgação seletiva: casos de uso LGPD/GDPR
```

---

## Referências Gerais

- [Midnight Network Documentation](https://docs.midnight.network)
- [Midnight Developer Blog](https://midnight.network/blog)
- [Compact Language Reference](https://docs.midnight.network/compact)
- [DPO2U Protocol Documentation](https://docs.dpo2u.com)
