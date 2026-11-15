import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Settings2, UserCog, ShieldAlert } from 'lucide-react';
import { PilotNav } from '@/components/pilot/PilotNav';
import { FreighterConnect } from '@/components/pilot/admin/FreighterConnect';
import { isAdminPubkey, isAdminUiEnabled } from '@/lib/pilot/admin-allowlist';
import type { FreighterStatus } from '@/lib/pilot/freighter';

export default function PilotAdminIndex() {
  useEffect(() => {
    document.title = 'Console admin | DPO2U Piloto';
  }, []);
  const [walletStatus, setWalletStatus] = useState<FreighterStatus | null>(null);

  if (!isAdminUiEnabled()) {
    return <AdminUiDisabled />;
  }

  const isAdmin = isAdminPubkey(walletStatus?.publicKey);

  return (
    <main className="bg-dpo2u-ivory min-h-screen pb-24">
      <PilotNav />
      <header className="border-b border-dpo2u-ink/10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
          <p className="font-mono text-xs uppercase tracking-widest text-dpo2u-ink/60">
            Console admin · DPO2U super-admin
          </p>
          <h1 className="mt-3 font-display text-4xl text-dpo2u-ink leading-tight">
            Administração do contrato
          </h1>
          <p className="mt-3 text-dpo2u-ink/70 font-body text-lg">
            Configurar use cases + autorizar/revogar submitters. As assinaturas vão pela sua wallet Freighter.
            Sprint L muda pra multisig 2-of-3 com Ledger.
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-8 space-y-6">
        <FreighterConnect onChange={setWalletStatus} />

        {isAdmin ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              to="/pilot/admin/configure-use-case"
              className="rounded-xl border border-dpo2u-ink/10 bg-white p-5 hover:border-dpo2u-indigo/40 transition-colors block"
            >
              <Settings2 className="h-5 w-5 text-dpo2u-ink" />
              <h2 className="mt-3 font-display text-xl text-dpo2u-ink">configure_use_case</h2>
              <p className="mt-1 text-sm text-dpo2u-ink/70 font-body">
                Ativar/desativar um use case + amarrar predicate_set + versão.
              </p>
            </Link>
            <Link
              to="/pilot/admin/authorize-submitter"
              className="rounded-xl border border-dpo2u-ink/10 bg-white p-5 hover:border-dpo2u-indigo/40 transition-colors block"
            >
              <UserCog className="h-5 w-5 text-dpo2u-ink" />
              <h2 className="mt-3 font-display text-xl text-dpo2u-ink">authorize_submitter</h2>
              <p className="mt-1 text-sm text-dpo2u-ink/70 font-body">
                Adicionar ou revogar pubkeys da whitelist de submitters.
              </p>
            </Link>
          </div>
        ) : (
          <div className="rounded-lg border border-dpo2u-ink/10 bg-white p-5 text-sm text-dpo2u-ink/60 font-body">
            Conecte uma wallet admin do contrato pra desbloquear as ações.
          </div>
        )}
      </section>
    </main>
  );
}

function AdminUiDisabled() {
  return (
    <main className="bg-dpo2u-ivory min-h-screen pb-24">
      <PilotNav />
      <section className="mx-auto max-w-2xl px-4 sm:px-6 py-16">
        <div className="rounded-xl border border-dpo2u-ink/10 bg-white p-8 text-center">
          <ShieldAlert className="h-8 w-8 text-dpo2u-ink/40 mx-auto" />
          <h1 className="mt-3 font-display text-2xl text-dpo2u-ink">Console admin desabilitado</h1>
          <p className="mt-2 text-sm text-dpo2u-ink/60 font-body">
            Este build não tem o feature flag <code className="font-mono bg-dpo2u-ink/5 px-1 rounded">VITE_ADMIN_UI=1</code> ativado. Apenas
            o DPO2U super-admin opera estas rotas.
          </p>
        </div>
      </section>
    </main>
  );
}
