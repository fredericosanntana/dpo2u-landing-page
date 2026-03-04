---
sidebar_position: 1
title: 'Compact Smart Contracts 101'
description: 'Guia prático para escrever, compilar e entender contratos Compact na Midnight Network, com foco em casos de uso de compliance para o DPO2U.'
tags: [compact, midnight, smart-contracts, zk-proofs, tutorial]
---

# Compact Smart Contracts 101

> **Série**: Building a Compliance Attestation with Compact on Midnight — Parte 1 de 3  
> **Nível**: Iniciante a Intermediário  
> **Tempo Estimado**: 30 minutos  
> **Data de Verificação**: 04/03/2026

---

## Resumo Executivo

Este tutorial é o ponto de partida para desenvolvedores que desejam construir sobre a **Midnight Network** usando **Compact**, a linguagem de smart contracts nativa da plataforma. Diferente de linguagens como Solidity, Compact foi projetada desde o início para incorporar **zero-knowledge proofs (ZKPs)** como um primitivo de primeira classe, não como uma adição posterior. Ao final deste guia, você será capaz de escrever um smart contract funcional que armazena um atestado de compliance, entender a distinção entre estado público e privado, compilar o contrato em ZK-circuits e interpretar os artefatos gerados. Este é o alicerce técnico sobre o qual o DPO2U constrói seu protocolo de Privacy-as-a-Service.

---

## Por que Compact? A Escolha Técnica do DPO2U

A escolha da Midnight Network e do Compact como infraestrutura do DPO2U não é acidental. Ela resolve um problema fundamental que outras blockchains não conseguem endereçar adequadamente: **como provar conformidade com a LGPD/GDPR sem expor os dados que a lei visa proteger?**

Blockchains públicas tradicionais, como Ethereum, armazenam dados de forma transparente. Qualquer pessoa pode ler o estado de um smart contract. Para um protocolo de compliance, isso é um paradoxo: para provar que você protege dados, você precisaria expor esses dados. O Compact resolve isso através do conceito de **divulgação seletiva** (selective disclosure).

> "Um smart contract da Midnight usa zero-knowledge proofs (ZKPs) para manter a confidencialidade dos dados enquanto prova a correção da computação. A proposta de valor central é a divulgação seletiva, onde os usuários podem provar informações específicas enquanto mantêm dados sensíveis privados." [1]

No Compact, cada variável, cada parâmetro de função e cada operação tem uma classificação de privacidade explícita. O compilador verifica essas classificações e garante que nenhum dado privado "vaze" para o estado público sem uma instrução explícita do desenvolvedor.

---

## Conceitos Fundamentais

Antes de escrever código, é essencial entender os três pilares do modelo de programação do Compact.

### 1. Ledger State (Estado do Ledger)

O estado on-chain de um contrato Compact é declarado com a palavra-chave `ledger`. Este estado é **público** e **persistente** na blockchain. Qualquer pessoa pode ler os valores armazenados no ledger.

```typescript
export ledger complianceHash: Opaque<"string">;
export ledger owner: PublicKey;
```

O tipo `Opaque<"string">` é particularmente importante: ele representa um dado externo (uma string JavaScript) que o Compact pode armazenar e transmitir sem precisar interpretar sua estrutura interna. Isso é útil para armazenar hashes, identificadores e outros dados opacos.

### 2. Circuits (Circuitos)

Circuitos são as funções de um smart contract Compact. Eles definem a lógica que modifica o estado ou realiza computações. Crucialmente, os circuitos são **compilados em ZK-circuits**, o que significa que sua execução pode ser provada criptograficamente.

```typescript
export circuit issueAttestation(attestationData: Opaque<"string">): [] {
  // lógica aqui
}
```

Os parâmetros de um circuito são **privados por padrão**. Isso significa que `attestationData` no exemplo acima é um dado que o chamador do contrato fornece, mas que não fica visível publicamente na blockchain.

### 3. A Função `disclose()`

Esta é a função mais importante para entender o modelo de privacidade do Compact. Ela é a "ponte" entre o mundo privado (parâmetros de circuito) e o mundo público (ledger state). Tentar atribuir um valor privado a uma variável de ledger sem usar `disclose()` resulta em um **erro de compilação**, garantindo que vazamentos de dados sejam impossíveis por design.

```typescript
// ERRO: Tentativa de atribuir valor privado ao ledger
complianceHash = attestationData; // ← Erro de compilação

// CORRETO: Usando disclose() para tornar o valor público explicitamente
complianceHash = disclose(attestationData); // ← Compila com sucesso
```

---

## Pré-requisitos

| Requisito | Descrição |
|---|---|
| **Compact Toolchain** | Siga o [guia de instalação](https://docs.midnight.network/getting-started/installation) oficial. |
| **Node.js (v18+)** | Para interação com os artefatos gerados pelo compilador. |
| **Editor de Código** | Visual Studio Code com a extensão Compact (recomendado). |
| **Conhecimento Básico de TypeScript** | O Compact tem sintaxe similar ao TypeScript. |

---

## Passo 1: Estrutura do Projeto

Crie a estrutura de diretórios para o projeto de contrato de compliance:

```bash
mkdir dpo2u-compliance-contract
cd dpo2u-compliance-contract
mkdir -p contracts
```

Seu projeto deve ter a seguinte estrutura inicial:

```
dpo2u-compliance-contract/
└── contracts/
```

---

## Passo 2: Escrevendo o Contrato de Compliance

Crie o arquivo do contrato:

```bash
touch contracts/compliance-attestation.compact
```

Adicione o seguinte código ao arquivo. Cada linha é comentada para máxima clareza:

```typescript
// contracts/compliance-attestation.compact

// Versão do compilador Compact. Protege contra breaking changes em versões futuras.
pragma language_version 0.20;

// ─────────────────────────────────────────────────────────────────────────────
// LEDGER STATE (Estado Público On-Chain)
// Estes valores são visíveis para qualquer pessoa na blockchain.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Hash SHA-256 do atestado de compliance mais recente.
 * O hash é público (verificável), mas o conteúdo do atestado é privado.
 */
export ledger complianceHash: Opaque<"string">;

/**
 * Chave pública do proprietário do contrato (DPO ou empresa).
 * Apenas o proprietário pode emitir novos atestados.
 */
export ledger owner: PublicKey;

/**
 * Timestamp do último atestado emitido.
 * Permite auditoria temporal do histórico de compliance.
 */
export ledger lastAttestationTimestamp: Uint64;

// ─────────────────────────────────────────────────────────────────────────────
// CIRCUITS (Funções do Contrato)
// Os parâmetros são PRIVADOS por padrão — não ficam visíveis na blockchain.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Inicializa o contrato, definindo o proprietário.
 * Deve ser chamado uma única vez durante o deploy.
 *
 * @param ownerKey - A chave pública do DPO ou da empresa (PRIVADA durante a chamada).
 */
export circuit initialize(ownerKey: PublicKey): [] {
  // Usa disclose() para mover o valor do domínio privado para o ledger público.
  owner = disclose(ownerKey);
}

/**
 * Emite um novo atestado de compliance.
 * O `attestationData` permanece PRIVADO; apenas seu hash é armazenado publicamente.
 *
 * @param attestationData - JSON com o status de compliance (PRIVADO).
 * @param attestationHash - Hash SHA-256 do attestationData (tornará-se PÚBLICO).
 * @param timestamp       - Timestamp da emissão (tornará-se PÚBLICO).
 * @param signerKey       - Chave privada para verificar que o chamador é o owner.
 */
export circuit issueAttestation(
  attestationData: Opaque<"string">,
  attestationHash: Opaque<"string">,
  timestamp: Uint64,
  signerKey: PrivateKey
): [] {
  // Verifica que o chamador é o proprietário do contrato.
  // `publicKey(signerKey)` deriva a chave pública da chave privada fornecida.
  // `checkSignature` verifica se a chave pública derivada corresponde ao `owner`.
  assert(checkSignature(publicKey(signerKey), owner));

  // Armazena o hash do atestado publicamente.
  // O `attestationData` original NUNCA toca o ledger público.
  complianceHash = disclose(attestationHash);

  // Registra o timestamp da emissão.
  lastAttestationTimestamp = disclose(timestamp);
}
```

---

## Passo 3: Compilando o Contrato

A compilação é o processo que transforma o código Compact em ZK-circuits, gera as chaves criptográficas e cria as APIs TypeScript para o DApp.

Execute o compilador a partir da raiz do projeto:

```bash
compact compile contracts/compliance-attestation.compact contracts/managed/compliance-attestation
```

A saída esperada é algo como:

```
Compiling 2 circuits:
  circuit "initialize" (k=4, rows=12)
  circuit "issueAttestation" (k=8, rows=64)
```

### Artefatos Gerados

Após a compilação, a seguinte estrutura será criada em `contracts/managed/`:

```
contracts/
├── managed/
│   └── compliance-attestation/
│       ├── contract/       ← API TypeScript/JavaScript para o DApp
│       ├── keys/           ← Chaves criptográficas (proving e verifying keys)
│       ├── zkir/           ← Representação Intermediária ZK
│       └── compiler/       ← Metadados do compilador
└── compliance-attestation.compact
```

A tabela abaixo descreve o papel de cada diretório:

| Diretório | Conteúdo | Para que serve? |
|---|---|---|
| `contract/` | `index.js`, `index.d.ts` | API para o DApp chamar os circuitos do contrato. |
| `keys/` | `*.pk`, `*.vk` | **Proving Key** (usada para gerar provas) e **Verifying Key** (usada para verificar provas). |
| `zkir/` | Arquivos `.zkir` | Representação Intermediária ZK — a ponte entre o Compact e o backend criptográfico. |
| `compiler/` | Arquivos JSON | Metadados estruturais do contrato para uso por outras ferramentas. |

---

## Impacto para DPO2U

Este contrato, embora simples, encapsula o mecanismo central do protocolo DPO2U. A separação entre `attestationData` (privado) e `complianceHash` (público) é a implementação técnica do princípio de **Privacy by Design** exigido pelo Art. 25 do GDPR e pelo Art. 46 da LGPD.

Uma empresa que usa o DPO2U pode, a qualquer momento, provar a um regulador ou parceiro de negócios que possui um atestado de compliance válido, simplesmente apontando para o `complianceHash` on-chain. O regulador pode verificar a prova criptograficamente, sem que a empresa precise revelar seu inventário de dados, seus contratos com fornecedores ou qualquer outro documento sensível.

---

## Próximos Passos Recomendados

Agora que você tem o contrato compilado, o próximo passo é integrá-lo a um fluxo de aplicação real. Siga para o **Parte 2: End-to-End Compliance Attestation Flow** para aprender como interagir com este contrato a partir de um script, gerar a prova e registrar o atestado on-chain.

---

## Referências

[1] Midnight Docs. "Create your first Midnight contract". Acessado em 04/03/2026. [https://docs.midnight.network/getting-started/hello-world](https://docs.midnight.network/getting-started/hello-world)

[2] Midnight Network. "Compact, the smart contract language of Midnight". Acessado em 04/03/2026. [https://midnight.network/blog/compact-the-smart-contract-language-of-midnight](https://midnight.network/blog/compact-the-smart-contract-language-of-midnight)

[3] Midnight Docs. "Smart contracts on Midnight". Acessado em 04/03/2026. [https://docs.midnight.network/concepts/how-midnight-works/smart-contracts](https://docs.midnight.network/concepts/how-midnight-works/smart-contracts)
