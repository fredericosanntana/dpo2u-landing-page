---
sidebar_position: 2
title: 'End-to-End Compliance Attestation Flow'
description: 'Guia completo mostrando como uma empresa vai do zero até ter uma attestation de compliance on-chain com zk-proof na Midnight Network.'
tags: [attestation, compliance, midnight, lgpd, gdpr, tutorial, end-to-end]
---

# End-to-End Compliance Attestation Flow

> **Série**: Building a Compliance Attestation with Compact on Midnight — Parte 2 de 3  
> **Nível**: Intermediário  
> **Pré-requisito**: [Compact Smart Contracts 101](./01-compact-smart-contracts.md)  
> **Tempo Estimado**: 45 minutos  
> **Data de Verificação**: 04/03/2026

---

## Resumo Executivo

Este tutorial demonstra o fluxo completo para criar e registrar uma **attestation de compliance on-chain** usando a Midnight Network. Partindo do contrato `compliance-attestation.compact` criado no tutorial anterior, este guia cobre todas as etapas que uma empresa percorreria na prática: desde a coleta de dados de compliance off-chain, passando pela geração do atestado e da prova ZK, até o registro imutável na blockchain e a verificação independente por terceiros. Este é o fluxo operacional central do protocolo DPO2U.

---

## O Problema que Estamos Resolvendo

Hoje, quando uma empresa precisa demonstrar conformidade com a LGPD ou GDPR, o processo é tipicamente assim:

1. Um auditor externo solicita documentos (DPIA, inventário de dados, contratos com fornecedores).
2. A empresa envia esses documentos por e-mail ou plataformas de compartilhamento.
3. O auditor os analisa manualmente, um processo que pode levar semanas.
4. Um relatório de auditoria é emitido, que representa um **snapshot no tempo** e fica desatualizado rapidamente.

Este processo é lento, caro, expõe dados sensíveis e não é verificável por terceiros de forma independente. O DPO2U resolve todos esses problemas com um fluxo automatizado e baseado em provas criptográficas.

---

## Visão Geral do Fluxo

O fluxo end-to-end é dividido em quatro fases principais:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        FLUXO DE ATTESTATION DPO2U                          │
├──────────────┬──────────────────┬────────────────────┬─────────────────────┤
│  FASE 1      │  FASE 2          │  FASE 3            │  FASE 4             │
│  Off-Chain   │  Processamento   │  On-Chain          │  Verificação        │
│  Coleta      │  DPO2U Agent     │  Registro          │  Independente       │
├──────────────┼──────────────────┼────────────────────┼─────────────────────┤
│ • DPIA       │ • Analisa docs   │ • Invoca circuito  │ • Reguladores       │
│ • Inventário │ • Gera status    │ • Gera ZKP         │ • Parceiros         │
│ • Políticas  │ • Cria atestado  │ • Armazena hash    │ • Clientes          │
│ • Contratos  │ • Calcula hash   │ • Confirma tx      │ • Smart contracts   │
└──────────────┴──────────────────┴────────────────────┴─────────────────────┘
```

---

## Fase 1: Preparação Off-Chain

### 1.1 Estrutura do Atestado de Compliance

O DPO2U Agent gera um atestado em formato JSON que consolida o status de compliance da empresa. Este documento é **privado** e nunca é armazenado diretamente na blockchain.

```json
{
  "version": "1.0",
  "schemaType": "DPO2U_COMPLIANCE_ATTESTATION",
  "issuer": {
    "did": "did:midnight:0x1a2b3c4d...",
    "name": "DPO2U Agent",
    "version": "0.9.1"
  },
  "subject": {
    "companyId": "CNPJ-00.000.000/0001-00",
    "companyName": "Acme Corp Ltda",
    "assessmentDate": "2026-03-04T12:00:00Z"
  },
  "compliance": {
    "lgpd": {
      "status": "compliant",
      "score": 87,
      "criticalFindings": 0,
      "lastAssessment": "2026-03-04T10:00:00Z"
    },
    "gdpr": {
      "status": "compliant",
      "score": 82,
      "criticalFindings": 0,
      "lastAssessment": "2026-03-04T10:00:00Z"
    }
  },
  "evidenceHashes": {
    "dpia": "sha256:a1b2c3d4...",
    "dataInventory": "sha256:e5f6g7h8...",
    "privacyPolicy": "sha256:i9j0k1l2..."
  }
}
```

O campo `evidenceHashes` é especialmente importante: em vez de incluir os documentos completos no atestado, incluímos apenas seus hashes. Isso permite que um auditor verifique a integridade dos documentos (se eles forem fornecidos) sem que o atestado em si precise carregar dados sensíveis.

### 1.2 Calculando o Hash do Atestado

O hash do atestado é o que será armazenado publicamente on-chain. Ele serve como uma "impressão digital" do atestado, permitindo que qualquer pessoa verifique que um atestado específico corresponde ao hash registrado.

```javascript
// utils/hash.js
import { createHash } from 'crypto';

/**
 * Gera um hash SHA-256 de um objeto JSON de forma determinística.
 * A ordenação das chaves é normalizada para garantir que o mesmo objeto
 * sempre produza o mesmo hash, independentemente da ordem das propriedades.
 */
export function generateAttestationHash(attestationObject) {
  // Normaliza o JSON: ordena as chaves para garantir determinismo
  const normalizedJson = JSON.stringify(attestationObject, Object.keys(attestationObject).sort());
  return createHash('sha256').update(normalizedJson).digest('hex');
}
```

---

## Fase 2: Interação com o Contrato

### 2.1 Configurando o Ambiente

Instale as dependências necessárias no projeto:

```bash
npm install @midnight-ntwrk/midnight-js-types @midnight-ntwrk/midnight-js-network-id
```

### 2.2 Script de Emissão do Atestado

Crie o arquivo `scripts/issue-attestation.mjs` com o seguinte conteúdo:

```javascript
// scripts/issue-attestation.mjs
import { createHash } from 'crypto';
import { readFileSync } from 'fs';

// Importa a API TypeScript gerada pelo compilador Compact
// Este arquivo é criado automaticamente pelo `compact compile`
import { ComplianceAttestationContract } from '../contracts/managed/compliance-attestation/contract/index.js';

// ─────────────────────────────────────────────────────────────────────────────
// CONFIGURAÇÃO
// ─────────────────────────────────────────────────────────────────────────────

const NETWORK_CONFIG = {
  endpoint: 'https://rpc.preprod.midnight.network', // Rede de testes
  networkId: 'preprod'
};

// ─────────────────────────────────────────────────────────────────────────────
// UTILITÁRIOS
// ─────────────────────────────────────────────────────────────────────────────

function generateAttestationHash(attestationObject) {
  const normalizedJson = JSON.stringify(attestationObject, Object.keys(attestationObject).sort());
  return createHash('sha256').update(normalizedJson).digest('hex');
}

function loadAttestationData(filePath) {
  const raw = readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
}

// ─────────────────────────────────────────────────────────────────────────────
// FLUXO PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────────

async function issueComplianceAttestation() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  DPO2U — Emissão de Attestation de Compliance On-Chain   ');
  console.log('═══════════════════════════════════════════════════════════\n');

  // PASSO 1: Carregar o atestado de compliance gerado pelo DPO2U Agent
  console.log('[1/5] Carregando dados do atestado...');
  const attestationData = loadAttestationData('./attestation-data.json');
  console.log(`      Empresa: ${attestationData.subject.companyName}`);
  console.log(`      Data: ${attestationData.subject.assessmentDate}`);
  console.log(`      Status LGPD: ${attestationData.compliance.lgpd.status}`);
  console.log(`      Status GDPR: ${attestationData.compliance.gdpr.status}\n`);

  // PASSO 2: Calcular o hash do atestado
  // Este hash é o que será armazenado publicamente on-chain.
  // O atestado completo (com dados sensíveis) permanece off-chain.
  console.log('[2/5] Calculando hash do atestado (SHA-256)...');
  const attestationHash = generateAttestationHash(attestationData);
  console.log(`      Hash: ${attestationHash}\n`);

  // PASSO 3: Conectar à Midnight Network e carregar a carteira
  console.log('[3/5] Conectando à Midnight Network (Preprod)...');
  const privateKey = process.env.DPO_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error(
      'Variável de ambiente DPO_PRIVATE_KEY não definida.\n' +
      'Execute: export DPO_PRIVATE_KEY="sua-chave-privada"'
    );
  }

  // Nota: A API real do SDK da Midnight pode diferir ligeiramente.
  // Consulte https://docs.midnight.network para a versão mais atualizada.
  const provider = await ComplianceAttestationContract.createProvider(NETWORK_CONFIG);
  const wallet = provider.createWallet(privateKey);
  console.log(`      Carteira: ${wallet.publicKey}\n`);

  // PASSO 4: Instanciar o contrato e emitir o atestado
  const contractAddress = process.env.CONTRACT_ADDRESS;
  if (!contractAddress) {
    throw new Error('Variável de ambiente CONTRACT_ADDRESS não definida.');
  }

  console.log('[4/5] Invocando circuito `issueAttestation`...');
  console.log('      Gerando ZK-Proof... (pode levar alguns segundos)');

  const contract = new ComplianceAttestationContract(contractAddress, wallet);
  const timestamp = BigInt(Date.now());

  // Esta chamada:
  // 1. Envia `attestationData` como dado PRIVADO para o circuito
  // 2. O circuito gera um ZKP provando que `attestationHash` é o hash correto
  // 3. Apenas o `attestationHash` e o `timestamp` são armazenados publicamente
  const transaction = await contract.issueAttestation(
    JSON.stringify(attestationData), // Dado privado — não vai para a blockchain
    attestationHash,                  // Hash público — vai para o ledger
    timestamp,                        // Timestamp público
    wallet.privateKey                 // Chave para verificar autorização
  );

  // PASSO 5: Aguardar confirmação e exibir resultado
  console.log('      Aguardando confirmação da transação...');
  const receipt = await transaction.wait();

  console.log('\n[5/5] Attestation registrada com sucesso!\n');
  console.log('───────────────────────────────────────────────────────────');
  console.log(`  Hash da Transação: ${receipt.transactionHash}`);
  console.log(`  Bloco: ${receipt.blockNumber}`);
  console.log(`  Compliance Hash On-Chain: ${attestationHash}`);
  console.log('───────────────────────────────────────────────────────────');
  console.log('\nA attestation está agora registrada imutavelmente na');
  console.log('Midnight Network e pode ser verificada por qualquer pessoa.\n');

  return {
    transactionHash: receipt.transactionHash,
    complianceHash: attestationHash,
    blockNumber: receipt.blockNumber
  };
}

// Execução
issueComplianceAttestation()
  .then(result => {
    console.log('Resultado:', JSON.stringify(result, null, 2));
    process.exit(0);
  })
  .catch(error => {
    console.error('\n[ERRO]', error.message);
    process.exit(1);
  });
```

### 2.3 Executando o Script

```bash
# Defina as variáveis de ambiente necessárias
export DPO_PRIVATE_KEY="sua-chave-privada-midnight"
export CONTRACT_ADDRESS="0xendereço-do-contrato-deployado"

# Execute o script de emissão
node scripts/issue-attestation.mjs
```

---

## Fase 3: Verificação On-Chain

Após o registro, qualquer terceiro pode verificar o atestado de forma independente. O processo de verificação é simples e não requer acesso a nenhum dado privado.

### 3.1 Script de Verificação

```javascript
// scripts/verify-attestation.mjs
import { createHash } from 'crypto';
import { ComplianceAttestationContract } from '../contracts/managed/compliance-attestation/contract/index.js';

async function verifyAttestation(contractAddress, localAttestationData) {
  console.log('Verificando attestation on-chain...\n');

  // Conecta ao contrato (somente leitura — não precisa de chave privada)
  const provider = await ComplianceAttestationContract.createReadOnlyProvider({
    endpoint: 'https://rpc.preprod.midnight.network'
  });
  const contract = new ComplianceAttestationContract(contractAddress, provider);

  // Lê o hash armazenado on-chain
  const onChainHash = await contract.complianceHash();
  const onChainTimestamp = await contract.lastAttestationTimestamp();

  console.log(`Hash on-chain: ${onChainHash}`);
  console.log(`Timestamp: ${new Date(Number(onChainTimestamp)).toISOString()}\n`);

  // Recalcula o hash dos dados locais e compara
  const localHash = createHash('sha256')
    .update(JSON.stringify(localAttestationData, Object.keys(localAttestationData).sort()))
    .digest('hex');

  const isValid = localHash === onChainHash;

  if (isValid) {
    console.log('✓ VERIFICAÇÃO BEM-SUCEDIDA');
    console.log('  O atestado local corresponde ao hash registrado on-chain.');
    console.log('  A empresa está em conformidade conforme declarado.');
  } else {
    console.log('✗ VERIFICAÇÃO FALHOU');
    console.log('  O atestado local NÃO corresponde ao hash on-chain.');
    console.log('  O atestado pode ter sido adulterado ou está desatualizado.');
  }

  return isValid;
}
```

---

## Fase 4: Ciclo de Vida do Atestado

Um atestado de compliance não é um evento único; é um processo contínuo. O DPO2U foi projetado para suportar um ciclo de vida de attestation que se alinha com as exigências regulatórias.

| Evento | Frequência Recomendada | Ação no DPO2U |
|---|---|---|
| **Avaliação de Compliance** | Trimestral | DPO2U Agent executa nova análise e gera atestado atualizado. |
| **Atualização de Políticas** | Quando necessário | Novo atestado emitido com referência à política atualizada. |
| **Incidente de Segurança** | Imediato | Atestado de resposta a incidente registrado on-chain. |
| **Auditoria Regulatória** | Sob demanda | Regulador verifica o histórico de hashes on-chain. |
| **Renovação Anual** | Anual | Atestado completo com score atualizado. |

---

## Impacto para DPO2U

Este fluxo end-to-end transforma o DPO2U de uma ferramenta de gestão de compliance em uma **plataforma de prova de compliance**. A diferença é fundamental:

Uma ferramenta de gestão ajuda a empresa a organizar seus processos internos. Uma plataforma de prova permite que a empresa **demonstre externamente** seu estado de compliance de forma objetiva, automatizada e verificável. Isso tem implicações diretas para:

- **Relação com Reguladores**: A ANPD (Autoridade Nacional de Proteção de Dados) pode verificar o status de compliance de uma empresa sem solicitar documentos, reduzindo a carga administrativa para ambos os lados.
- **Contratos B2B**: Empresas podem exigir que fornecedores e parceiros demonstrem compliance on-chain como condição para fechar contratos, criando um ecossistema de confiança verificável.
- **Seguros de Responsabilidade**: Seguradoras podem oferecer prêmios menores para empresas que demonstram compliance contínuo e verificável, criando incentivos econômicos para a adoção.

---

## Próximos Passos Recomendados

Com o fluxo end-to-end compreendido, o próximo passo é entender a tecnologia que torna tudo isso possível. Siga para o **Parte 3: Zero-Knowledge Proofs in DPO2U** para uma explicação detalhada de como os ZKPs funcionam e por que eles são o pilar tecnológico do protocolo.

---

## Referências

[1] Chainlink. "Compliance Attestation: Onchain Verification and Standards". Acessado em 04/03/2026. [https://chain.link/article/compliance-attestation](https://chain.link/article/compliance-attestation)

[2] Midnight Docs. "Getting Started — Hello World". Acessado em 04/03/2026. [https://docs.midnight.network/getting-started/hello-world](https://docs.midnight.network/getting-started/hello-world)

[3] Chainlink. "Blockchain GDPR Compliance and Institutional Standards". Acessado em 04/03/2026. [https://chain.link/article/blockchain-gdpr-compliance-guide](https://chain.link/article/blockchain-gdpr-compliance-guide)
