// /pilot/compliance — a camada B2B do dpo2u-stellar.
//
// O contrato de atestação é genérico: sela tanto a detecção de irregularidade
// em compras públicas (B2G) quanto a conformidade de organizações (B2B). Esta
// página apresenta a camada B2B — os 7 use cases de compliance e a prova
// on-chain de uma atestação real.

import { useEffect } from 'react';
import { PilotNav } from '@/components/pilot/PilotNav';
import { SmallLabel, Rule, FONTS, PALETTE } from '@/components/sealed/atoms';

interface UC {
  id: string;
  label: string;
  desc: string;
}

const B2G: UC[] = [
  { id: 'sanction_check_v1', label: 'Fornecedor sancionado', desc: 'Sanção CEIS/CNEP/CEPIM vigente em contratação pública.' },
  { id: 'overpricing_v1', label: 'Sobrepreço', desc: 'Preço unitário outlier (Z-modificado) contra a cesta de mercado.' },
  { id: 'divergent_payee_v1', label: 'Favorecido divergente', desc: 'Favorecido da ordem bancária diverge do contratado.' },
  { id: 'leniency_flag_v1', label: 'Acordo de leniência', desc: 'Fornecedor sob leniência (Lei 12.846) ainda contratando.' },
  { id: 'winner_rotation_v1', label: 'Rodízio de vencedores', desc: 'Rodízio de vencedores num grupo recorrente de licitantes.' },
  { id: 'bank_chg', label: 'Troca de conta bancária', desc: 'Verificação anti-fraude de troca de conta de fornecedor.' },
];

const B2B: UC[] = [
  { id: 'lgpd_compliance_v1', label: 'Conformidade LGPD', desc: 'Maturidade do programa de privacidade — Lei 13.709/2018.' },
  { id: 'gdpr_compliance_v1', label: 'Conformidade GDPR', desc: 'Maturidade do programa de proteção de dados — GDPR.' },
  { id: 'consent_record_v1', label: 'Registro de consentimento', desc: 'Selo de um evento de consentimento — DPDP Índia / LGPD.' },
  { id: 'ccpa_optout_v1', label: 'Opt-out CCPA', desc: 'Selo de um opt-out de consumidor — CCPA/CPRA, Califórnia.' },
  { id: 'popia_officer_v1', label: 'Information Officer POPIA', desc: 'Selo da nomeação do Information Officer — POPIA.' },
  { id: 'pipeda_consent_v1', label: 'Consentimento PIPEDA', desc: 'Selo de um registro de consentimento — PIPEDA, Canadá.' },
  { id: 'pipa_identity_v1', label: 'Identidade PIPA', desc: 'Identidade alternativa ao RRN — PIPA, Coreia do Sul.' },
];

const CONTRACT = 'CC4TJGDRWZOPGBWOOHBJF3N2VKUQRNIW6C6PTYHD7ZI3D42GBQRRZHM5';
const DEMO_TX = 'eb990b44ee41e6787048e034fa11d201266d970ca352aaba1efdcf2148416fb0';

const mono = (size = 11): React.CSSProperties => ({ fontFamily: FONTS.mono, fontSize: size, color: PALETTE.ink });

function UseCaseCard({ uc, accent }: { uc: UC; accent: string }) {
  return (
    <div style={{ border: `1px solid ${PALETTE.rule}`, background: PALETTE.paper, padding: '14px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: accent, display: 'inline-block' }} />
        <span style={{ fontFamily: FONTS.body, fontSize: 14, color: PALETTE.ink, fontWeight: 600 }}>{uc.label}</span>
      </div>
      <div style={{ ...mono(10), color: PALETTE.concrete, marginTop: 4 }}>{uc.id}</div>
      <div style={{ fontFamily: FONTS.body, fontSize: 12.5, color: PALETTE.inkSoft, lineHeight: 1.5, marginTop: 7 }}>
        {uc.desc}
      </div>
    </div>
  );
}

export default function PilotCompliancePage() {
  useEffect(() => {
    document.title = 'Compliance B2B | DPO2U Piloto';
  }, []);

  return (
    <main style={{ background: PALETTE.paper, minHeight: '100vh', paddingBottom: 96 }}>
      <PilotNav />

      {/* Header */}
      <section className="px-6 lg:px-14 pt-[56px] pb-[36px]">
        <div className="mx-auto max-w-[1180px]">
          <SmallLabel style={{ marginBottom: 16 }}>§ Camada B2B · compliance de organizações</SmallLabel>
          <h1
            className="text-[40px] sm:text-[56px] lg:text-[66px]"
            style={{
              fontFamily: FONTS.display,
              fontWeight: 500,
              lineHeight: 0.98,
              letterSpacing: '-.028em',
              margin: 0,
              color: PALETTE.ink,
            }}
          >
            Compliance, <span style={{ fontStyle: 'italic' }}>selado</span>
            <span style={{ color: PALETTE.terracotta }}>.</span>
          </h1>
          <p
            style={{
              fontFamily: FONTS.body,
              fontSize: 17,
              lineHeight: 1.6,
              marginTop: 22,
              maxWidth: 680,
              color: PALETTE.inkSoft,
            }}
          >
            O contrato de atestação do DPO2U é genérico. O mesmo selo on-chain que
            sela a detecção de irregularidade em compras públicas (B2G) sela a
            conformidade de uma organização (B2B) — LGPD, GDPR e os registros
            jurisdicionais. Treze use cases, um contrato.
          </p>
        </div>
      </section>

      {/* Dois colunas — B2G / B2B */}
      <section className="px-6 lg:px-14">
        <div className="mx-auto max-w-[1180px] grid gap-10" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))' }}>
          <div>
            <SmallLabel style={{ marginBottom: 6 }}>B2G · piloto anticorrupção</SmallLabel>
            <p style={{ ...mono(10), color: PALETTE.concrete, margin: '0 0 14px' }}>
              {B2G.length} use cases · compras públicas
            </p>
            <div style={{ display: 'grid', gap: 10 }}>
              {B2G.map((uc) => (
                <UseCaseCard key={uc.id} uc={uc} accent={PALETTE.verdigris} />
              ))}
            </div>
          </div>
          <div>
            <SmallLabel style={{ marginBottom: 6 }}>B2B · compliance de organizações</SmallLabel>
            <p style={{ ...mono(10), color: PALETTE.concrete, margin: '0 0 14px' }}>
              {B2B.length} use cases · privacidade e proteção de dados
            </p>
            <div style={{ display: 'grid', gap: 10 }}>
              {B2B.map((uc) => (
                <UseCaseCard key={uc.id} uc={uc} accent={PALETTE.terracotta} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Prova on-chain */}
      <section className="px-6 lg:px-14 pt-[52px]">
        <div className="mx-auto max-w-[1180px]">
          <SmallLabel style={{ marginBottom: 6 }}>Prova on-chain · atestação B2B selada</SmallLabel>
          <p style={{ ...mono(10), color: PALETTE.concrete, margin: '0 0 16px' }}>
            contrato {CONTRACT.slice(0, 12)}… · testnet Stellar
          </p>
          <a
            href={`https://stellar.expert/explorer/testnet/tx/${DEMO_TX}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'block',
              border: `1px solid ${PALETTE.ink}`,
              background: PALETTE.paper,
              padding: '20px 22px',
              textDecoration: 'none',
            }}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'baseline' }}>
              <span
                style={{
                  ...mono(10),
                  color: PALETTE.paper,
                  background: PALETTE.concrete,
                  padding: '2px 7px',
                  textTransform: 'uppercase',
                  letterSpacing: '.08em',
                }}
              >
                Review
              </span>
              <span style={{ fontFamily: FONTS.body, fontSize: 15, color: PALETTE.ink }}>
                DPO2U — auto-atestação de conformidade GDPR
              </span>
              <span style={{ ...mono(10), color: PALETTE.concrete }}>gdpr_compliance_v1</span>
            </div>
            <div style={{ fontFamily: FONTS.body, fontSize: 13, color: PALETTE.inkSoft, lineHeight: 1.55, marginTop: 10 }}>
              Veredito honesto: 3 controles confirmados (DPO, processo de direitos
              do titular, DPIA), 3 a documentar formalmente. O score fica privado;
              só o veredito e o hash da evidência vão para a chain.
            </div>
            <div style={{ ...mono(10), color: PALETTE.verdigris, marginTop: 12, wordBreak: 'break-all' }}>
              tx {DEMO_TX}
            </div>
          </a>
          <Rule style={{ margin: '20px 0' }} />
          <p style={{ fontFamily: FONTS.body, fontSize: 13, fontStyle: 'italic', color: PALETTE.verdigris, margin: 0 }}>
            Qualquer auditor verifica a atestação no contrato com um comando —
            sem credencial, sem depender do DPO2U.
          </p>
        </div>
      </section>
    </main>
  );
}
