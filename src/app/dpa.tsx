/**
 * /dpa — Data Processing Agreement (template).
 *
 * Página legal no design selado. Cláusulas de processador GDPR Art. 28 + LGPD
 * Art. 39 (operador), com enquadramento honesto: é o template padrão da DPO2U,
 * executado por contrato assinado (não vincula automaticamente pelo acesso).
 * Phase 0 / gate G6 — "non-negotiable for a compliance company".
 */
import React from 'react';
import { usePageHead } from '@/lib/page-head';
import { FONTS, PALETTE, SmallLabel, Rule } from '@/components/sealed/atoms';

const CLAUSES: { h: string; b: string }[] = [
  {
    h: '1. Objeto, duração e natureza do tratamento',
    b: 'Este Acordo de Processamento de Dados (DPA) rege o tratamento de dados pessoais realizado pela DPO2U ("Operador" / "Processor") por conta do Cliente ("Controlador" / "Controller") no escopo dos serviços contratados (geração de DPIA/auditoria, atestação de compliance on-chain e serviços associados). A duração acompanha o contrato principal. As categorias de titulares e de dados são as descritas no contrato/ordem de serviço.',
  },
  {
    h: '2. Tratamento apenas sob instrução documentada — GDPR Art. 28(3)(a) · LGPD Art. 39',
    b: 'O Operador trata os dados pessoais somente com base em instruções documentadas do Controlador, inclusive quanto a transferências internacionais, salvo obrigação legal — caso em que o Operador informa o Controlador antes do tratamento, exceto se a lei o proibir.',
  },
  {
    h: '3. Confidencialidade — GDPR Art. 28(3)(b)',
    b: 'O Operador assegura que as pessoas autorizadas a tratar os dados se comprometeram com a confidencialidade ou estão sob dever legal de sigilo.',
  },
  {
    h: '4. Segurança do tratamento — GDPR Art. 32 · LGPD Art. 46-49',
    b: 'O Operador implementa medidas técnicas e organizacionais adequadas ao risco: criptografia em trânsito e em repouso quando aplicável, controle de acesso baseado em papéis, registro de auditoria, e — onde o produto exige — minimização via design (atestação ancora hash/commitment, não PII em claro). O score permanece privado; a prova é pública.',
  },
  {
    h: '5. Subprocessadores — GDPR Art. 28(2)(4)',
    b: 'O Operador só contrata subprocessadores mediante autorização (geral ou específica) do Controlador, impondo-lhes por contrato as mesmas obrigações de proteção de dados. A lista de subprocessadores e quaisquer alterações são comunicadas ao Controlador, que pode objetar.',
  },
  {
    h: '6. Assistência ao Controlador — GDPR Art. 28(3)(e)(f)',
    b: 'O Operador auxilia o Controlador, na medida do possível, a responder a pedidos de titulares (acesso, correção, eliminação, portabilidade, oposição — GDPR Art. 15-22 / LGPD Art. 18), e a cumprir os deveres de segurança, notificação de incidente, DPIA/RIPD e consulta prévia (GDPR Art. 32-36 / LGPD Art. 38, 48).',
  },
  {
    h: '7. Notificação de incidente — GDPR Art. 33 · LGPD Art. 48',
    b: 'O Operador notifica o Controlador sem demora injustificada ao tomar conhecimento de violação de dados pessoais, fornecendo informações suficientes para que o Controlador cumpra suas obrigações de comunicação à autoridade (ANPD/DPA) e aos titulares nos prazos legais.',
  },
  {
    h: '8. Eliminação ou devolução ao término — GDPR Art. 28(3)(g)',
    b: 'Encerrado o serviço, o Operador, a critério do Controlador, elimina ou devolve os dados pessoais e apaga as cópias existentes, salvo retenção exigida por lei. Para dados ancorados on-chain, aplica-se a estratégia de erasure documentada (off-chain + hash / cryptographic shredding / tombstone), preservando a imutabilidade do registro sem expor PII.',
  },
  {
    h: '9. Auditoria e inspeção — GDPR Art. 28(3)(h)',
    b: 'O Operador disponibiliza ao Controlador as informações necessárias para demonstrar conformidade e permite auditorias/inspeções. A própria atestação on-chain (selo verificável publicamente) serve como evidência contínua e independente do estado de compliance.',
  },
  {
    h: '10. Transferências internacionais',
    b: 'Qualquer transferência internacional ocorre apenas mediante salvaguardas adequadas (cláusulas-padrão, adequação ou outra base legal), conforme instrução do Controlador e a jurisdição aplicável dentre as 24 cobertas.',
  },
];

export default function DPAPage() {
  usePageHead({
    title: 'Data Processing Agreement (DPA) — DPO2U',
    description:
      'Template de Acordo de Processamento de Dados (DPA) da DPO2U — cláusulas de operador GDPR Art. 28 + LGPD Art. 39: instrução documentada, confidencialidade, segurança (Art. 32), subprocessadores, assistência ao titular, notificação de incidente, eliminação/devolução, auditoria e transferências internacionais.',
    path: '/dpa',
  });

  return (
    <div
      className="min-h-screen"
      style={{ background: PALETTE.paper, color: PALETTE.ink, fontFamily: FONTS.body }}
    >
      <div className="max-w-[820px] mx-auto px-6 md:px-10 py-16 md:py-24">
        <SmallLabel style={{ marginBottom: 16 }}>§ LEGAL · DPA</SmallLabel>
        <h1
          className="text-[40px] md:text-[56px] leading-[1.04] font-medium"
          style={{ fontFamily: FONTS.display, letterSpacing: '-0.02em', margin: 0 }}
        >
          Data Processing<br />
          <span style={{ fontStyle: 'italic' }}>Agreement</span>
          <span style={{ color: PALETTE.terracotta }}>.</span>
        </h1>
        <p className="mt-4 font-mono text-[12px] uppercase tracking-[0.16em]" style={{ color: PALETTE.concrete }}>
          Template · GDPR Art. 28 + LGPD Art. 39 · last updated {new Date().toISOString().slice(0, 10)}
        </p>
        <p className="mt-6 max-w-[64ch] text-[17px] leading-[1.6]" style={{ color: PALETTE.inkSoft }}>
          Este é o template padrão de DPA da DPO2U enquanto Operador de dados. Ele é executado por
          contrato assinado entre Controlador e Operador — o acesso a esta página não constitui, por si,
          um acordo vinculante. Para executar um DPA, fale com{' '}
          <a href="mailto:dpo@dpo2u.com" style={{ color: PALETTE.terracotta, textDecoration: 'underline' }}>dpo@dpo2u.com</a>.
        </p>

        <Rule style={{ margin: '40px 0' }} color={PALETTE.ruleStrong} />

        <div className="space-y-8">
          {CLAUSES.map(({ h, b }) => (
            <section key={h}>
              <h2
                className="text-[19px] md:text-[21px] mb-2 font-medium"
                style={{ fontFamily: FONTS.display, letterSpacing: '-0.01em' }}
              >
                {h}
              </h2>
              <p className="text-[15px] leading-[1.6]" style={{ color: PALETTE.inkSoft }}>{b}</p>
            </section>
          ))}
        </div>

        <Rule style={{ margin: '40px 0 24px' }} color={PALETTE.ruleStrong} />
        <p className="text-[13px]" style={{ color: PALETTE.concrete }}>
          Não constitui aconselhamento jurídico. Documento-modelo; a versão executável é fornecida e
          assinada no onboarding. Ver também{' '}
          <a href="/privacy" style={{ color: PALETTE.terracotta, textDecoration: 'underline' }}>Privacy</a>{' '}
          e <a href="/terms" style={{ color: PALETTE.terracotta, textDecoration: 'underline' }}>Terms</a>.
        </p>
      </div>
    </div>
  );
}
