import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { ContractMeta } from '@/lib/pilot/contracts';
import { stellarExpertUrl, truncateContract, truncateHash } from '@/lib/pilot/stellar';

interface Props {
  readonly contract: ContractMeta;
}

function copy(text: string, setCopied: (v: boolean) => void): void {
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    void navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }
}

interface FieldProps {
  readonly label: string;
  readonly value: string;
  readonly displayValue?: string;
  readonly mono?: boolean;
  readonly small?: boolean;
}

function CopyableField({ label, value, displayValue, mono, small }: FieldProps) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex items-start justify-between gap-3 py-3 border-b border-dpo2u-ink/5 last:border-0">
      <div className="min-w-0 flex-1">
        <p className="text-xs font-mono uppercase tracking-wider text-dpo2u-ink/60">{label}</p>
        <p
          className={`mt-1 text-dpo2u-ink break-all ${mono ? 'font-mono' : ''} ${
            small ? 'text-xs' : 'text-sm'
          }`}
        >
          {displayValue ?? value}
        </p>
      </div>
      <button
        type="button"
        onClick={() => copy(value, setCopied)}
        className="shrink-0 inline-flex items-center gap-1 rounded px-2 py-1 text-xs text-dpo2u-ink/60 hover:bg-dpo2u-ink/5 hover:text-dpo2u-ink"
      >
        <Copy className="h-3 w-3" />
        {copied ? 'Copiado!' : 'Copiar'}
      </button>
    </div>
  );
}

export function ContractMetaCard({ contract }: Props) {
  const deployedAt = new Date(contract.deployed_at);
  const explorerUrl = stellarExpertUrl('contract', contract.id, contract);

  const clientConfigJson = JSON.stringify(
    {
      rpcUrl: contract.rpc_url,
      networkPassphrase: contract.network_passphrase,
      contractId: contract.id,
      viewerAccount: contract.admin,
    },
    null,
    2,
  );
  const [configCopied, setConfigCopied] = useState(false);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-dpo2u-ink/10 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <p className="text-xs font-mono uppercase tracking-wider text-dpo2u-ink/60">
              Contrato Soroban
            </p>
            <h2 className="mt-2 font-display text-2xl sm:text-3xl text-dpo2u-ink">
              {contract.friendly_name}
            </h2>
          </div>
          <Badge
            variant="outline"
            className={
              contract.network === 'mainnet'
                ? 'border-dpo2u-verdigris/40 text-dpo2u-verdigris'
                : 'border-dpo2u-gold/40 text-dpo2u-gold'
            }
          >
            {contract.network.toUpperCase()}
          </Badge>
        </div>

        <p className="text-sm text-dpo2u-ink/70 font-body mb-6">{contract.description}</p>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-start">
          <div className="min-w-0">
            <CopyableField label="Contract ID" value={contract.id} displayValue={truncateContract(contract.id, 14, 10)} mono />
            <CopyableField label="WASM hash" value={contract.wasm_hash} displayValue={truncateHash(contract.wasm_hash, 14, 10)} mono small />
            <CopyableField label="Network passphrase" value={contract.network_passphrase} />
            <CopyableField label="Soroban RPC" value={contract.rpc_url} mono small />
            <CopyableField label="Admin (deployer)" value={contract.admin} displayValue={truncateContract(contract.admin, 8, 6)} mono />
            <div className="flex items-start justify-between gap-3 py-3">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-mono uppercase tracking-wider text-dpo2u-ink/60">
                  Deploy
                </p>
                <p className="mt-1 text-sm text-dpo2u-ink">{deployedAt.toISOString()}</p>
                <p className="text-xs text-dpo2u-ink/50">
                  {deployedAt.toLocaleString('pt-BR', { dateStyle: 'long', timeStyle: 'short' })}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3 shrink-0">
            <div className="rounded-2xl bg-white p-4 border border-dpo2u-ink/10">
              <QRCodeSVG
                value={explorerUrl}
                size={180}
                bgColor="#FFFFFF"
                fgColor="#0C0D10"
                level="M"
              />
            </div>
            <p className="text-xs text-dpo2u-ink/60 font-body text-center max-w-[180px]">
              Aponte a câmera pra abrir o contrato no Stellar Expert
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          <a
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-dpo2u-ink px-4 py-2 text-sm font-medium text-dpo2u-ivory hover:bg-dpo2u-ink/85 transition-colors"
          >
            Stellar Expert <ExternalLink className="h-3.5 w-3.5" />
          </a>
          <button
            type="button"
            onClick={() => copy(clientConfigJson, setConfigCopied)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-dpo2u-ink/20 px-4 py-2 text-sm text-dpo2u-ink hover:bg-dpo2u-ink/5"
          >
            <Copy className="h-3.5 w-3.5" />
            {configCopied ? 'JSON copiado!' : 'Copiar config JSON (SDK)'}
          </button>
        </div>
      </div>
    </div>
  );
}
