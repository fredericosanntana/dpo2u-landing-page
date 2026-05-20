// /pilot/dashboard — live indexer dashboard.
// Editorial Sealed pattern aligned 2026-05-14.

import { useEffect } from 'react';
import { PilotNav } from '@/components/pilot/PilotNav';
import { DashboardStats } from '@/components/pilot/DashboardStats';
import { VerdictDistributionChart } from '@/components/pilot/VerdictDistributionChart';
import { RecentAttestationsList } from '@/components/pilot/RecentAttestationsList';
import { useIndexerStore } from '@/lib/pilot/indexer-store';
import { SmallLabel, Rule, FONTS, PALETTE } from '@/components/sealed/atoms';
import { DEFAULT_CONTRACT, truncateContract, stellarExpertUrl } from '@/lib/pilot/stellar';

export default function PilotDashboardPage() {
  const startPolling = useIndexerStore((s) => s.startPolling);
  const stopPolling = useIndexerStore((s) => s.stopPolling);

  useEffect(() => {
    document.title = 'Dashboard | DPO2U Piloto Anticorrupção';
    startPolling(30_000);
    return () => stopPolling();
  }, [startPolling, stopPolling]);

  const monoCode: React.CSSProperties = {
    fontFamily: FONTS.mono,
    fontSize: 11,
    background: PALETTE.paper2,
    padding: '1px 5px',
    color: PALETTE.ink,
  };

  return (
    <main style={{ background: PALETTE.paper, minHeight: '100vh', paddingBottom: 96 }}>
      <PilotNav />

      {/* Header */}
      <section className="px-6 lg:px-14 pt-[56px] pb-[40px]">
        <div className="mx-auto max-w-[920px]">
          <SmallLabel style={{ marginBottom: 16 }}>
            § Atividade on-chain · público
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
            Dashboard do <span style={{ fontStyle: 'italic' }}>contrato</span>
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
            Estado público do contrato{' '}
            <a
              href={stellarExpertUrl('contract', DEFAULT_CONTRACT.id)}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: FONTS.mono,
                fontSize: 14,
                color: PALETTE.ink,
                textDecoration: 'none',
                borderBottom: `1px solid ${PALETTE.ink}`,
              }}
            >
              {truncateContract(DEFAULT_CONTRACT.id)}
            </a>{' '}
            indexado em tempo real via Horizon REST. Sem backend DPO2U envolvido — o navegador faz a consulta
            direto à rede pública.
          </p>
        </div>
      </section>

      <Rule />

      {/* Stats + chart + explanation */}
      <section className="px-6 lg:px-14 py-12">
        <div className="mx-auto max-w-[1200px] space-y-12">
          <DashboardStats />

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-10">
            <VerdictDistributionChart />
            <div>
              <SmallLabel style={{ marginBottom: 12 }}>
                § Como esse dashboard funciona
              </SmallLabel>
              <ol
                style={{
                  fontFamily: FONTS.body,
                  fontSize: 14,
                  lineHeight: 1.7,
                  color: PALETTE.inkSoft,
                  paddingLeft: 18,
                  margin: 0,
                }}
              >
                <li style={{ marginBottom: 10 }}>
                  <strong style={{ color: PALETTE.ink }}>Polling.</strong> O navegador consulta Horizon{' '}
                  <code style={monoCode}>/contracts/&lt;id&gt;/operations</code> a cada 30 s.
                </li>
                <li style={{ marginBottom: 10 }}>
                  <strong style={{ color: PALETTE.ink }}>Parsing.</strong> Para cada operação invokeHostFunction,
                  extraímos os eventos Soroban com topic <code style={monoCode}>attest</code>.
                </li>
                <li style={{ marginBottom: 10 }}>
                  <strong style={{ color: PALETTE.ink }}>Decode.</strong> O{' '}
                  <code style={monoCode}>decodeAttestationRecord</code> do{' '}
                  <code style={monoCode}>@dpo2u/stellar-sdk</code> converte ScVal → JS.
                </li>
                <li style={{ marginBottom: 10 }}>
                  <strong style={{ color: PALETTE.ink }}>Cache.</strong> Os últimos 200 eventos ficam em{' '}
                  <code style={monoCode}>localStorage</code> pra hidratação rápida.
                </li>
                <li>
                  <strong style={{ color: PALETTE.ink }}>Reprodutível.</strong> Qualquer auditor pode copiar o
                  cURL e rodar independentemente — código deste dashboard é open source.
                </li>
              </ol>
            </div>
          </div>

          <Rule />

          <RecentAttestationsList />
        </div>
      </section>
    </main>
  );
}
