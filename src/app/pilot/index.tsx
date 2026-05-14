// Pilot landing — Anti-corruption pilot via Stellar Soroban testnet.
// Editorial Sealed pattern: SmallLabel eyebrows, Fraunces display, Rule
// separators, Button atom variants, no decorative icons. Aligned with
// dpo2u.com look-and-feel 2026-05-14.

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PilotNav } from '@/components/pilot/PilotNav';
import {
  SmallLabel,
  Rule,
  Button,
  FONTS,
  PALETTE,
} from '@/components/sealed/atoms';
import { DEFAULT_CONTRACT, truncateContract, stellarExpertUrl } from '@/lib/pilot/stellar';

export default function PilotLandingPage() {
  useEffect(() => {
    document.title = 'Piloto Anticorrupção | DPO2U';
  }, []);

  return (
    <main style={{ background: PALETTE.paper, minHeight: '100vh', paddingBottom: 96 }}>
      <PilotNav />

      {/* Hero — matches the Sealed Hero rhythm: SmallLabel eyebrow, display
          headline with terracotta period, body in inkSoft, Button kind atoms. */}
      <section className="px-6 lg:px-14 pt-[64px] pb-[72px]">
        <div className="mx-auto max-w-[920px]">
          <SmallLabel style={{ marginBottom: 24 }}>
            DPO2U · PILOTO ANTICORRUPÇÃO · STELLAR37° M1 · SÃO PAULO · 2026
          </SmallLabel>
          <h1
            style={{
              fontFamily: FONTS.display,
              fontWeight: 500,
              lineHeight: 0.92,
              letterSpacing: '-.034em',
              margin: 0,
              color: PALETTE.ink,
            }}
            className="text-[52px] sm:text-[76px] lg:text-[104px]"
          >
            Selo de cera digital<br />
            <span style={{ fontStyle: 'italic' }}>sobre cada</span> decisão de pagamento
            <span style={{ color: PALETTE.terracotta }}>.</span>
          </h1>
          <p
            style={{
              fontFamily: FONTS.body,
              fontSize: 18,
              lineHeight: 1.55,
              marginTop: 32,
              maxWidth: 640,
              color: PALETTE.inkSoft,
            }}
          >
            Contrato Soroban imutável em Stellar testnet registra atestações <strong>PASS/FAIL/REVIEW</strong> de
            compliance em pagamentos públicos. Qualquer auditor verifica sem cooperação do município —
            sem credencial DPO2U, sem fee, sem servidor intermediário.
          </p>
          <p
            style={{
              fontFamily: FONTS.body,
              fontSize: 13,
              fontStyle: 'italic',
              marginTop: 12,
              color: PALETTE.inkSoft,
            }}
          >
            Compliance is a protocol, not a PDF.
          </p>
          <div style={{ marginTop: 36, display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <Button href="/pilot/verify" kind="terracotta">
              Verificar uma atestação →
            </Button>
            <Button href="/pilot/dashboard" kind="ghost">
              Ver dashboard live
            </Button>
          </div>
        </div>
      </section>

      <Rule />

      {/* Three feature sections — editorial rhythm with SmallLabel + display + body.
          No icon chips, no card backgrounds — borders + whitespace do the work. */}
      <section className="px-6 lg:px-14 py-16">
        <SmallLabel style={{ marginBottom: 12 }}>§ 01 · O que está aberto</SmallLabel>
        <div className="mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-10 mt-8">
          <FeatureBlock
            number="i."
            title="Verificação trustless"
            body="Cole use_case_id + evidence_hash. Receba o veredito on-chain em segundos. P4/P5 (TCE, TCU, CGU, jornalistas, cidadãos)."
            cta="Abrir verificador →"
            to="/pilot/verify"
          />
          <FeatureBlock
            number="ii."
            title="Dashboard live"
            body="Indexador client-side via Horizon. Todas as atestações registradas, distribuição de verdicts, filtros por use case. Polling 30s."
            cta="Ver atividade →"
            to="/pilot/dashboard"
          />
          <FeatureBlock
            number="iii."
            title="Cadastro do contrato"
            body="Contract id, WASM hash, network passphrase, RPC URL. JSON do SDK config copiável. QR code do explorer."
            cta="Ver contrato →"
            to="/pilot/contract"
          />
        </div>
      </section>

      <Rule />

      {/* Personas — 2 columns, editorial */}
      <section className="px-6 lg:px-14 py-16">
        <SmallLabel style={{ marginBottom: 12 }}>§ 02 · Como funciona</SmallLabel>
        <h2
          style={{
            fontFamily: FONTS.display,
            fontSize: 44,
            lineHeight: 0.98,
            margin: '8px 0 0 0',
            letterSpacing: '-.022em',
            color: PALETTE.ink,
          }}
        >
          4 personas. 1 contrato imutável.
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mt-10">
          <PersonaBlock
            tag="P1 / P2 / P3"
            title="Operador municipal"
            body="Submete atestação via REST/MCP. O predicate engine determinístico avalia 5 critérios off-chain (CNPJ holder, canal oficial, sem mudança recente, sem pagamento iminente, banco regulado BCB). Verdict + hashes vão on-chain — payload com PII fica off-chain encriptado."
            cta="Console operator"
            sub="Sprint K — em construção"
            disabled
          />
          <PersonaBlock
            tag="P4 / P5"
            title="Auditor / Cidadão"
            body={`Lê o estado on-chain sem credencial. CLI \`dpo2u-attest verify\`, esta UI, OU chamada direta Soroban RPC — todos retornam exatamente o mesmo veredito. O contrato é imutável e auditável bit-a-bit.`}
            cta="Verificar agora →"
            to="/pilot/verify"
          />
        </div>
      </section>

      <Rule />

      {/* Contract footer — editorial coda */}
      <section className="px-6 lg:px-14 py-12">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <SmallLabel style={{ marginBottom: 6 }}>
              CONTRATO EM PRODUÇÃO · TESTNET
            </SmallLabel>
            <p
              style={{
                fontFamily: FONTS.mono,
                fontSize: 14,
                color: PALETTE.ink,
                margin: 0,
              }}
            >
              {truncateContract(DEFAULT_CONTRACT.id)}
            </p>
          </div>
          <a
            href={stellarExpertUrl('contract', DEFAULT_CONTRACT.id)}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: FONTS.mono,
              fontSize: 11,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: PALETTE.ink,
              textDecoration: 'none',
              borderBottom: `1px solid ${PALETTE.ink}`,
              paddingBottom: 2,
            }}
          >
            Stellar Expert ↗
          </a>
        </div>
      </section>
    </main>
  );
}

interface FeatureProps {
  readonly number: string;
  readonly title: string;
  readonly body: string;
  readonly cta: string;
  readonly to: string;
}

function FeatureBlock({ number, title, body, cta, to }: FeatureProps) {
  return (
    <div>
      <span
        style={{
          fontFamily: FONTS.display,
          fontStyle: 'italic',
          fontSize: 22,
          color: PALETTE.terracotta,
          display: 'block',
          marginBottom: 8,
        }}
      >
        {number}
      </span>
      <h3
        style={{
          fontFamily: FONTS.display,
          fontSize: 22,
          lineHeight: 1.1,
          margin: 0,
          color: PALETTE.ink,
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontFamily: FONTS.body,
          fontSize: 14,
          lineHeight: 1.55,
          color: PALETTE.inkSoft,
          marginTop: 12,
          marginBottom: 16,
        }}
      >
        {body}
      </p>
      <Link
        to={to}
        style={{
          fontFamily: FONTS.mono,
          fontSize: 11,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: PALETTE.ink,
          textDecoration: 'none',
          borderBottom: `1px solid ${PALETTE.ink}`,
          paddingBottom: 2,
        }}
      >
        {cta}
      </Link>
    </div>
  );
}

interface PersonaProps {
  readonly tag: string;
  readonly title: string;
  readonly body: string;
  readonly cta: string;
  readonly to?: string;
  readonly sub?: string;
  readonly disabled?: boolean;
}

function PersonaBlock({ tag, title, body, cta, to, sub, disabled }: PersonaProps) {
  return (
    <div>
      <SmallLabel style={{ marginBottom: 8, color: PALETTE.terracotta }}>{tag}</SmallLabel>
      <h3
        style={{
          fontFamily: FONTS.display,
          fontSize: 32,
          lineHeight: 1.05,
          letterSpacing: '-.018em',
          margin: 0,
          color: PALETTE.ink,
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontFamily: FONTS.body,
          fontSize: 15.5,
          lineHeight: 1.6,
          marginTop: 16,
          color: PALETTE.inkSoft,
        }}
      >
        {body}
      </p>
      <div style={{ marginTop: 16 }}>
        {disabled ? (
          <span
            style={{
              fontFamily: FONTS.mono,
              fontSize: 11,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: PALETTE.inkSoft,
              fontStyle: 'italic',
            }}
          >
            {cta} · {sub}
          </span>
        ) : (
          <Link
            to={to ?? '/'}
            style={{
              fontFamily: FONTS.mono,
              fontSize: 11,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: PALETTE.ink,
              textDecoration: 'none',
              borderBottom: `1px solid ${PALETTE.ink}`,
              paddingBottom: 2,
            }}
          >
            {cta}
          </Link>
        )}
      </div>
    </div>
  );
}
