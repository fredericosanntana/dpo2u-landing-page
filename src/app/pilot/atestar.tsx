// /pilot/atestar — formulário cliente-facing de atestação de conformidade B2B.
//
// O cliente declara a postura de conformidade da organização; a página calcula
// o veredito previsto do use case `compliance_attestation_v1` (espelha a lógica
// dos predicados) e mostra a evidência selável + o caminho on-chain. É uma
// ferramenta de pré-visualização — selar de fato exige credencial de piloto.

import { useEffect, useMemo, useState } from 'react';
import { PilotNav } from '@/components/pilot/PilotNav';
import { SmallLabel, FONTS, PALETTE } from '@/components/sealed/atoms';

const mono = (size = 11): React.CSSProperties => ({ fontFamily: FONTS.mono, fontSize: size, color: PALETTE.ink });

// As 16 jurisdições de proteção de dados do catálogo (compliance_attestation_v1).
const JURISDICTIONS: Array<{ code: string; label: string }> = [
  { code: 'lgpd', label: 'Brasil · LGPD' },
  { code: 'gdpr', label: 'União Europeia · GDPR' },
  { code: 'ccpa', label: 'Califórnia · CCPA/CPRA' },
  { code: 'pipeda', label: 'Canadá · PIPEDA' },
  { code: 'law25', label: 'Quebec · Lei 25' },
  { code: 'appi', label: 'Japão · APPI' },
  { code: 'pipa', label: 'Coreia do Sul · PIPA' },
  { code: 'pdp', label: 'Indonésia · UU PDP' },
  { code: 'pdpa', label: 'Singapura · PDPA' },
  { code: 'dpdp', label: 'Índia · DPDP' },
  { code: 'uae', label: 'Emirados · PDPL/ADGM' },
  { code: 'popia', label: 'África do Sul · POPIA' },
  { code: 'ndpa', label: 'Nigéria · NDPA' },
  { code: 'mexico', label: 'México · LFPDPPP' },
  { code: 'vietnam', label: 'Vietnã · Decreto 13' },
  { code: 'malaysia', label: 'Malásia · PDPA' },
];

// Os 6 controles nucleares — chave de evidência ↔ rótulo.
const CONTROLS: Array<{ key: string; label: string }> = [
  { key: 'has_officer', label: 'Encarregado / DPO designado' },
  { key: 'has_lawful_basis', label: 'Registro de base legal de tratamento' },
  { key: 'has_dsr_process', label: 'Processo de direitos do titular' },
  { key: 'has_impact_assessment', label: 'Avaliação de impacto (DPIA/RIPD)' },
  { key: 'has_breach_procedure', label: 'Procedimento de notificação de violação' },
  { key: 'has_transfer_safeguards', label: 'Salvaguardas de transferência internacional' },
];

type Tri = 'yes' | 'no' | 'unset';
type Verdict = 'PASS' | 'FAIL' | 'REVIEW';

const VERDICT_COLOR: Record<Verdict, string> = {
  PASS: PALETTE.verdigris,
  FAIL: PALETTE.terracotta,
  REVIEW: PALETTE.concrete,
};

interface Result {
  verdict: Verdict;
  score: number;
  documented: number;
  evidence: Record<string, unknown>;
}

export default function PilotAtestarPage() {
  useEffect(() => {
    document.title = 'Atestar conformidade | DPO2U Piloto';
  }, []);

  const [org, setOrg] = useState('');
  const [jurisdiction, setJurisdiction] = useState('lgpd');
  const [controls, setControls] = useState<Record<string, Tri>>(
    Object.fromEntries(CONTROLS.map((c) => [c.key, 'unset'])),
  );
  const [result, setResult] = useState<Result | null>(null);

  const canSubmit = org.trim().length > 0;

  const computed = useMemo(() => {
    // Espelha compliance_attestation_v1: any FALSE → FAIL; senão any UNSET →
    // REVIEW; senão PASS. Score = controles documentados / 6.
    let documented = 0;
    let anyFalse = false;
    let anyUnset = false;
    const evidence: Record<string, unknown> = {
      organization: org.trim(),
      jurisdiction,
      attestation_kind: 'compliance-audit',
    };
    for (const c of CONTROLS) {
      const v = controls[c.key];
      if (v === 'yes') {
        evidence[c.key] = true;
        documented += 1;
      } else if (v === 'no') {
        evidence[c.key] = false;
        anyFalse = true;
      } else {
        anyUnset = true;
      }
    }
    const score = Math.round((documented / CONTROLS.length) * 100);
    evidence.maturity_score = score;
    const verdict: Verdict = anyFalse ? 'FAIL' : anyUnset ? 'REVIEW' : 'PASS';
    return { verdict, score, documented, evidence };
  }, [org, jurisdiction, controls]);

  return (
    <main style={{ background: PALETTE.paper, minHeight: '100vh', paddingBottom: 96 }}>
      <PilotNav />

      {/* Header */}
      <section className="px-6 lg:px-14 pt-[56px] pb-[28px]">
        <div className="mx-auto max-w-[1180px]">
          <SmallLabel style={{ marginBottom: 16 }}>§ Camada B2B · atestação de conformidade</SmallLabel>
          <h1
            className="text-[40px] sm:text-[56px] lg:text-[64px]"
            style={{ fontFamily: FONTS.display, fontWeight: 500, lineHeight: 0.98, letterSpacing: '-.028em', margin: 0, color: PALETTE.ink }}
          >
            Atestar <span style={{ fontStyle: 'italic' }}>conformidade</span>
            <span style={{ color: PALETTE.terracotta }}>.</span>
          </h1>
          <p style={{ fontFamily: FONTS.body, fontSize: 16, lineHeight: 1.6, marginTop: 20, maxWidth: 680, color: PALETTE.inkSoft }}>
            Declare a postura de conformidade da organização contra uma das 16
            jurisdições. A página calcula o veredito previsto do use case
            <span style={{ ...mono(12) }}> compliance_attestation_v1</span> e
            monta a evidência selável on-chain.
          </p>
        </div>
      </section>

      {/* Formulário */}
      <section className="px-6 lg:px-14">
        <div className="mx-auto max-w-[1180px] grid gap-px lg:grid-cols-2" style={{ background: PALETTE.rule }}>
          {/* Coluna esquerda — entrada */}
          <div style={{ background: PALETTE.paper, padding: '26px 24px' }}>
            <SmallLabel style={{ marginBottom: 14 }}>1 · Organização e jurisdição</SmallLabel>
            <label style={{ ...mono(10), color: PALETTE.concrete, display: 'block', marginBottom: 4 }}>ORGANIZAÇÃO</label>
            <input
              value={org}
              onChange={(e) => setOrg(e.target.value)}
              placeholder="Razão social"
              style={{
                width: '100%', fontFamily: FONTS.body, fontSize: 14, padding: '9px 11px',
                border: `1px solid ${PALETTE.ink}`, background: PALETTE.paper, color: PALETTE.ink, marginBottom: 16,
              }}
            />
            <label style={{ ...mono(10), color: PALETTE.concrete, display: 'block', marginBottom: 4 }}>JURISDIÇÃO</label>
            <select
              value={jurisdiction}
              onChange={(e) => setJurisdiction(e.target.value)}
              style={{
                width: '100%', fontFamily: FONTS.body, fontSize: 14, padding: '9px 11px',
                border: `1px solid ${PALETTE.ink}`, background: PALETTE.paper, color: PALETTE.ink,
              }}
            >
              {JURISDICTIONS.map((j) => (
                <option key={j.code} value={j.code}>{j.label}</option>
              ))}
            </select>

            <SmallLabel style={{ margin: '24px 0 14px' }}>2 · Controles de proteção de dados</SmallLabel>
            {CONTROLS.map((c) => (
              <div key={c.key} style={{ marginBottom: 12 }}>
                <div style={{ fontFamily: FONTS.body, fontSize: 13, color: PALETTE.ink, marginBottom: 5 }}>{c.label}</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {(['yes', 'no', 'unset'] as Tri[]).map((opt) => {
                    const active = controls[c.key] === opt;
                    const txt = opt === 'yes' ? 'Sim' : opt === 'no' ? 'Não' : 'Não informado';
                    return (
                      <button
                        key={opt}
                        onClick={() => setControls((s) => ({ ...s, [c.key]: opt }))}
                        style={{
                          ...mono(10), padding: '5px 10px', cursor: 'pointer',
                          border: `1px solid ${active ? PALETTE.ink : PALETTE.rule}`,
                          background: active ? PALETTE.ink : PALETTE.paper,
                          color: active ? PALETTE.paper : PALETTE.concrete,
                        }}
                      >
                        {txt}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            <button
              onClick={() => setResult(computed)}
              disabled={!canSubmit}
              style={{
                ...mono(11), marginTop: 14, padding: '11px 20px', width: '100%',
                border: `1px solid ${PALETTE.ink}`, cursor: canSubmit ? 'pointer' : 'not-allowed',
                background: canSubmit ? PALETTE.terracotta : PALETTE.rule,
                color: canSubmit ? PALETTE.paper : PALETTE.concrete, letterSpacing: '0.1em', textTransform: 'uppercase',
              }}
            >
              Calcular veredito
            </button>
          </div>

          {/* Coluna direita — resultado */}
          <div style={{ background: PALETTE.paper, padding: '26px 24px' }}>
            <SmallLabel style={{ marginBottom: 14 }}>3 · Veredito previsto</SmallLabel>
            {!result ? (
              <p style={{ fontFamily: FONTS.body, fontSize: 13, color: PALETTE.concrete, lineHeight: 1.6 }}>
                Preencha a organização e os controles, depois calcule o veredito.
                Nenhum dado sai do navegador nesta pré-visualização.
              </p>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 6 }}>
                  <span style={{ fontFamily: FONTS.display, fontSize: 40, fontWeight: 500, color: VERDICT_COLOR[result.verdict] }}>
                    {result.verdict}
                  </span>
                  <span style={{ ...mono(12), color: PALETTE.concrete }}>
                    maturidade {result.score}% · {result.documented}/6 controles
                  </span>
                </div>
                <p style={{ fontFamily: FONTS.body, fontSize: 12.5, color: PALETTE.inkSoft, lineHeight: 1.55, marginBottom: 16 }}>
                  {result.verdict === 'PASS' && 'Todos os 6 controles documentados — atestação selaria como PASS.'}
                  {result.verdict === 'FAIL' && 'Um ou mais controles ausentes — a atestação selaria como FAIL (postura honesta, não fabricada).'}
                  {result.verdict === 'REVIEW' && 'Controles não informados — a atestação selaria como REVIEW até serem documentados.'}
                </p>
                <div style={{ ...mono(10), color: PALETTE.concrete, marginBottom: 4 }}>EVIDÊNCIA (compliance_attestation_v1)</div>
                <pre
                  style={{
                    ...mono(10.5), background: PALETTE.ink, color: PALETTE.paper, padding: '12px 14px',
                    overflowX: 'auto', lineHeight: 1.5, margin: 0,
                  }}
                >
{JSON.stringify(result.evidence, null, 2)}
                </pre>
                <p style={{ fontFamily: FONTS.body, fontSize: 12, color: PALETTE.concrete, lineHeight: 1.55, marginTop: 14 }}>
                  Para selar on-chain: <span style={mono(11)}>POST /api/v1/attestation/submit</span> com
                  <span style={mono(11)}> use_case_id=compliance_attestation_v1</span> e esta evidência —
                  requer credencial de piloto. O contrato sela o veredito + o hash da evidência na testnet Stellar.
                </p>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
