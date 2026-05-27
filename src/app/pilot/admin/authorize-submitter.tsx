import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { PilotNav } from '@/components/pilot/PilotNav';
import { FreighterConnect } from '@/components/pilot/admin/FreighterConnect';
import { AuthorizeSubmitterForm } from '@/components/pilot/admin/AuthorizeSubmitterForm';
import type { FreighterStatus } from '@/lib/pilot/freighter';
import { isAdminPubkey, isAdminUiEnabled } from '@/lib/pilot/admin-allowlist';

export default function PilotAdminAuthorizeSubmitter() {
  useEffect(() => {
    document.title = 'authorize_submitter | DPO2U admin';
  }, []);
  const [wallet, setWallet] = useState<FreighterStatus | null>(null);

  if (!isAdminUiEnabled()) return <Navigate to="/pilot/admin" replace />;

  const isAdmin = isAdminPubkey(wallet?.publicKey);

  return (
    <main className="bg-dpo2u-ivory min-h-screen pb-24">
      <PilotNav />
      <header className="border-b border-dpo2u-ink/10">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
          <p className="font-mono text-xs uppercase tracking-widest text-dpo2u-ink/60">
            Admin · authorize_submitter
          </p>
          <h1 className="mt-3 font-display text-4xl text-dpo2u-ink leading-tight">
            Autorizar / revogar submitter
          </h1>
          <p className="mt-3 text-dpo2u-ink/70 font-body">
            Whitelist de pubkeys autorizadas a chamar register_attestation. Revogar é o "kill switch"
            quando há suspeita de comprometimento.
          </p>
        </div>
      </header>
      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-10 space-y-6">
        <FreighterConnect onChange={setWallet} />
        {isAdmin && wallet?.publicKey ? (
          <div className="bg-white rounded-2xl border border-dpo2u-ink/10 p-6 sm:p-10 shadow-sm">
            <AuthorizeSubmitterForm admin={wallet.publicKey} />
          </div>
        ) : (
          <div className="rounded-lg border border-dpo2u-ink/10 bg-white p-5 text-sm text-dpo2u-ink/60 font-body">
            Conecte uma wallet admin para usar este formulário.
          </div>
        )}
      </section>
    </main>
  );
}
