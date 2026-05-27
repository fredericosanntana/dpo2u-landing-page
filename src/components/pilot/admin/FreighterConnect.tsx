import { useEffect, useState } from 'react';
import { Wallet, AlertCircle, ExternalLink, ShieldCheck, ShieldX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { connect, getStatus, type FreighterStatus } from '@/lib/pilot/freighter';
import { isAdminPubkey } from '@/lib/pilot/admin-allowlist';
import { DEFAULT_CONTRACT, truncateContract } from '@/lib/pilot/stellar';

interface Props {
  readonly onChange: (status: FreighterStatus) => void;
}

export function FreighterConnect({ onChange }: Props) {
  const [status, setStatus] = useState<FreighterStatus | null>(null);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    void getStatus().then((s) => {
      setStatus(s);
      onChange(s);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onClick = async () => {
    setConnecting(true);
    const s = await connect();
    setStatus(s);
    onChange(s);
    setConnecting(false);
  };

  if (!status) {
    return <div className="text-sm text-dpo2u-ink/50 font-body">Detectando carteira…</div>;
  }

  if (!status.available) {
    return (
      <div className="rounded-lg border border-dpo2u-terracotta/30 bg-dpo2u-terracotta/5 p-4">
        <p className="flex items-start gap-2 text-sm text-dpo2u-terracotta">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>
            Freighter não detectado. Instale a extensão para assinar transações on-chain.
          </span>
        </p>
        <a
          href="https://freighter.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-dpo2u-indigo hover:underline"
        >
          Instalar Freighter <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    );
  }

  if (!status.publicKey) {
    return (
      <div className="rounded-lg border border-dpo2u-ink/10 bg-white p-4 flex flex-wrap items-center gap-3">
        <Wallet className="h-5 w-5 text-dpo2u-ink/60" />
        <span className="text-sm text-dpo2u-ink/70">Freighter detectado — conecte sua wallet.</span>
        <Button onClick={onClick} disabled={connecting} size="sm" className="bg-dpo2u-ink text-dpo2u-ivory hover:bg-dpo2u-ink/85 ml-auto">
          {connecting ? 'Conectando…' : 'Conectar Freighter'}
        </Button>
      </div>
    );
  }

  const isAdmin = isAdminPubkey(status.publicKey);
  const networkMatches = status.networkPassphrase === DEFAULT_CONTRACT.network_passphrase;

  return (
    <div className="space-y-2">
      <div
        className={`rounded-lg border p-4 flex flex-wrap items-center gap-3 ${
          isAdmin
            ? 'border-dpo2u-verdigris/30 bg-dpo2u-verdigris/5'
            : 'border-dpo2u-terracotta/30 bg-dpo2u-terracotta/5'
        }`}
      >
        {isAdmin ? (
          <ShieldCheck className="h-5 w-5 text-dpo2u-verdigris" />
        ) : (
          <ShieldX className="h-5 w-5 text-dpo2u-terracotta" />
        )}
        <div className="min-w-0 flex-1">
          <p className="text-xs font-mono uppercase tracking-wider text-dpo2u-ink/60">
            {isAdmin ? 'Admin reconhecido' : 'Carteira NÃO está na allowlist'}
          </p>
          <p className="mt-0.5 font-mono text-sm text-dpo2u-ink break-all">
            {truncateContract(status.publicKey, 12, 8)}
          </p>
        </div>
        {!isAdmin && (
          <p className="text-xs text-dpo2u-terracotta">
            Esta carteira não pode operar admin no contrato {truncateContract(DEFAULT_CONTRACT.id, 8, 6)}.
          </p>
        )}
      </div>

      {!networkMatches && (
        <div className="rounded-lg border border-dpo2u-gold/30 bg-dpo2u-gold/5 p-3">
          <p className="flex items-start gap-2 text-xs text-dpo2u-gold">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>
              Carteira está na rede <strong>{status.network}</strong> — contrato esperado em{' '}
              <strong>{DEFAULT_CONTRACT.network}</strong>. Troque o network no Freighter antes de submeter.
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
