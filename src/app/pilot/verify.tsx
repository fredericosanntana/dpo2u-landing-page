// /pilot/verify — trustless verification UI for P4/P5 personas.
// Editorial Sealed pattern: SmallLabel eyebrow, Fraunces display headline,
// Rule separators, ivory paper background, inline styles with PALETTE/FONTS.
// Aligned with /pilot landing 2026-05-14.

import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PilotNav } from '@/components/pilot/PilotNav';
import { VerifyForm } from '@/components/pilot/VerifyForm';
import { SmallLabel, Rule, FONTS, PALETTE } from '@/components/sealed/atoms';
import { DEFAULT_CONTRACT, truncateContract, stellarExpertUrl } from '@/lib/pilot/stellar';

export default function PilotVerifyPage() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    document.title = 'Verificar atestação | DPO2U Piloto Anticorrupção';
  }, []);

  // Future: support deep-link queries `?uc=bank_chg&hash=…` for citations.
  const _qpUseCase = searchParams.get('uc');
  const _qpHash = searchParams.get('hash');

  return (
    <main style={{ background: PALETTE.paper, minHeight: '100vh', paddingBottom: 96 }}>
      <PilotNav />

      {/* Header — editorial */}
      <section className="px-6 lg:px-14 pt-[56px] pb-[48px]">
        <div className="mx-auto max-w-[920px]">
          <SmallLabel style={{ marginBottom: 16 }}>
            § Verificação trustless · P4 / P5 personas
          </SmallLabel>
          <h1
            style={{
              fontFamily: FONTS.display,
              fontWeight: 500,
              lineHeight: 0.96,
              letterSpacing: '-.028em',
              margin: 0,
              color: PALETTE.ink,
            }}
            className="text-[40px] sm:text-[56px] lg:text-[72px]"
          >
            Verifique uma atestação <span style={{ fontStyle: 'italic' }}>on-chain</span>
            <span style={{ color: PALETTE.terracotta }}>.</span>
          </h1>
          <p
            style={{
              fontFamily: FONTS.body,
              fontSize: 17,
              lineHeight: 1.6,
              marginTop: 24,
              maxWidth: 640,
              color: PALETTE.inkSoft,
            }}
          >
            Cole o <strong>use_case_id</strong> e o <strong>evidence_hash</strong> que o operador municipal te
            forneceu. A consulta vai direto à blockchain Stellar testnet — nenhuma credencial DPO2U, nenhum
            servidor intermediário, nenhum fee.
          </p>
          <p
            style={{
              fontFamily: FONTS.body,
              fontSize: 13,
              fontStyle: 'italic',
              marginTop: 12,
              maxWidth: 640,
              color: PALETTE.inkSoft,
            }}
          >
            Esta é a propriedade trustless que diferencia compliance-as-protocol de compliance-as-PDF:
            qualquer auditor, jornalista ou cidadão pode confirmar a decisão sem precisar pedir nada ao
            município ou à DPO2U.
          </p>
        </div>
      </section>

      <Rule />

      {/* Form — sem card, borda só na seção */}
      <section className="px-6 lg:px-14 py-12">
        <div className="mx-auto max-w-[720px]">
          <div
            style={{
              border: `1px solid ${PALETTE.ink}`,
              padding: '32px 28px',
              background: PALETTE.paper,
            }}
          >
            <VerifyForm />
          </div>

          {/* Sidebar info — editorial 2-col, no cards */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12">
            <div>
              <SmallLabel style={{ marginBottom: 6 }}>Contrato consultado</SmallLabel>
              <p
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 13,
                  color: PALETTE.ink,
                  margin: '6px 0 8px 0',
                  wordBreak: 'break-all',
                }}
              >
                {truncateContract(DEFAULT_CONTRACT.id)}
              </p>
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
            <div>
              <SmallLabel style={{ marginBottom: 6 }}>Network</SmallLabel>
              <p
                style={{
                  fontFamily: FONTS.body,
                  fontSize: 14,
                  color: PALETTE.ink,
                  margin: '6px 0 8px 0',
                }}
              >
                {DEFAULT_CONTRACT.network_passphrase}
              </p>
              <p
                style={{
                  fontFamily: FONTS.body,
                  fontSize: 12,
                  color: PALETTE.inkSoft,
                  margin: 0,
                  fontStyle: 'italic',
                }}
              >
                Testnet ainda — mainnet liga em Sprint L (M7 do Stellar37°).
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
