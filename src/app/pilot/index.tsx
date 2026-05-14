import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, BarChart3, FileText, ShieldCheck, ExternalLink } from 'lucide-react';
import { PilotNav } from '@/components/pilot/PilotNav';
import { DEFAULT_CONTRACT, truncateContract, stellarExpertUrl } from '@/lib/pilot/stellar';

export default function PilotLandingPage() {
  useEffect(() => {
    document.title = 'Piloto Anticorrupção | DPO2U';
  }, []);

  return (
    <main className="bg-dpo2u-ivory min-h-screen pb-24">
      <PilotNav />

      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-24">
          <div className="max-w-3xl">
            <p className="font-mono text-xs uppercase tracking-widest text-dpo2u-ink/60">
              DPO2U · Piloto Anticorrupção · Stellar37° M1
            </p>
            <h1 className="mt-4 font-display text-5xl sm:text-6xl lg:text-7xl text-dpo2u-ink leading-[1.05]">
              Selo de cera digital sobre cada decisão de pagamento.
            </h1>
            <p className="mt-6 text-xl text-dpo2u-ink/75 font-body">
              Contrato Soroban imutável em Stellar testnet registra atestações PASS/FAIL/REVIEW de
              compliance em pagamentos públicos. Qualquer auditor verifica sem cooperação do município —
              sem credencial DPO2U, sem fee, sem servidor intermediário.
            </p>
            <p className="mt-4 text-sm text-dpo2u-ink/60 font-body italic">
              Compliance is a protocol, not a PDF.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/pilot/verify"
                className="inline-flex items-center gap-2 rounded-lg bg-dpo2u-ink px-6 py-3 font-medium text-dpo2u-ivory hover:bg-dpo2u-ink/85 transition-colors"
              >
                Verificar uma atestação <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/pilot/dashboard"
                className="inline-flex items-center gap-2 rounded-lg border border-dpo2u-ink/20 px-6 py-3 font-medium text-dpo2u-ink hover:bg-dpo2u-ink/5"
              >
                Ver dashboard live
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-dpo2u-ink/10 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Search className="h-5 w-5" />}
              title="Verificação trustless"
              body="Cole use_case_id + evidence_hash → veja verdict on-chain em segundos. P4/P5 personas (TCE, TCU, CGU, jornalista, cidadão)."
              cta="Abrir verificador"
              to="/pilot/verify"
            />
            <FeatureCard
              icon={<BarChart3 className="h-5 w-5" />}
              title="Dashboard live"
              body="Indexador client-side via Horizon. Mostra todas as atestações registradas, distribuição de verdicts, filtros por use case. Polling 30s."
              cta="Ver atividade"
              to="/pilot/dashboard"
            />
            <FeatureCard
              icon={<FileText className="h-5 w-5" />}
              title="Cadastro / coordenadas"
              body="Contract id, WASM hash, network passphrase, RPC URL. JSON do SDK config copiável. QR code do explorer."
              cta="Ver contrato"
              to="/pilot/contract"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-14 sm:py-20">
        <p className="font-mono text-xs uppercase tracking-widest text-dpo2u-ink/60">
          Como funciona
        </p>
        <h2 className="mt-3 font-display text-3xl sm:text-4xl text-dpo2u-ink leading-tight">
          4 personas, 1 contrato imutável
        </h2>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <PersonaCard
            tag="P1 / P2 / P3"
            title="Operador municipal"
            body="Submete atestação via REST/MCP. O predicate engine determinístico avalia 5 critérios off-chain (CNPJ holder, canal oficial, sem mudança recente, sem pagamento iminente, banco regulado BCB). Verdict + hashes vão on-chain — payload com PII fica off-chain encriptado."
            cta="Console operator →"
            sub="(Sprint K — em construção)"
            disabled
          />
          <PersonaCard
            tag="P4 / P5"
            title="Auditor / Cidadão"
            body="Lê o estado on-chain sem credencial. CLI dpo2u-attest verify, esta UI, OU chamada direta Soroban RPC — todos retornam exatamente o mesmo veredito. O contrato é imutável e auditável bit-a-bit."
            cta="Verificar agora →"
            to="/pilot/verify"
          />
        </div>
      </section>

      <section className="border-t border-dpo2u-ink/10 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-dpo2u-verdigris" />
              <div>
                <p className="text-xs font-mono uppercase tracking-wider text-dpo2u-ink/60">
                  Contrato em produção (testnet)
                </p>
                <p className="mt-1 font-mono text-sm text-dpo2u-ink">{truncateContract(DEFAULT_CONTRACT.id)}</p>
              </div>
            </div>
            <a
              href={stellarExpertUrl('contract', DEFAULT_CONTRACT.id)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-dpo2u-indigo hover:underline"
            >
              Stellar Expert <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

interface FeatureProps {
  readonly icon: React.ReactNode;
  readonly title: string;
  readonly body: string;
  readonly cta: string;
  readonly to: string;
}

function FeatureCard({ icon, title, body, cta, to }: FeatureProps) {
  return (
    <div className="space-y-3">
      <div className="inline-flex items-center justify-center rounded-lg bg-dpo2u-ink/5 p-2.5 text-dpo2u-ink">
        {icon}
      </div>
      <h3 className="font-display text-xl text-dpo2u-ink">{title}</h3>
      <p className="text-sm text-dpo2u-ink/70 font-body">{body}</p>
      <Link to={to} className="inline-flex items-center gap-1 text-sm font-medium text-dpo2u-indigo hover:underline">
        {cta} <ArrowRight className="h-3.5 w-3.5" />
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

function PersonaCard({ tag, title, body, cta, to, sub, disabled }: PersonaProps) {
  return (
    <div className="rounded-xl border border-dpo2u-ink/10 bg-white p-6">
      <p className="font-mono text-[10px] uppercase tracking-widest text-dpo2u-ink/50">{tag}</p>
      <h3 className="mt-2 font-display text-2xl text-dpo2u-ink">{title}</h3>
      <p className="mt-3 text-sm text-dpo2u-ink/70 font-body">{body}</p>
      <div className="mt-4">
        {disabled ? (
          <p className="text-sm text-dpo2u-ink/40 italic">
            {cta} <span className="ml-1 text-xs">{sub}</span>
          </p>
        ) : (
          <Link
            to={to ?? '/'}
            className="inline-flex items-center gap-1 text-sm font-medium text-dpo2u-indigo hover:underline"
          >
            {cta}
          </Link>
        )}
      </div>
    </div>
  );
}
