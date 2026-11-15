import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { ExternalLink, Copy } from 'lucide-react';
import { useState } from 'react';
import type { AttestationEvent } from '@/lib/pilot/indexer-store';
import { stellarExpertUrl, truncateHash, truncateContract, DEFAULT_CONTRACT } from '@/lib/pilot/stellar';

interface Props {
  readonly event: AttestationEvent | null;
  readonly onClose: () => void;
}

function copy(text: string, setCopied: (v: boolean) => void): void {
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    void navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }
}

export function AttestationDetailSheet({ event, onClose }: Props) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!event) {
    return <Sheet open={false} onOpenChange={onClose}><></></Sheet>;
  }

  const ts = new Date(event.record.timestamp * 1000);
  const verdictColor =
    event.record.verdict === 'PASS'
      ? 'text-dpo2u-verdigris'
      : event.record.verdict === 'FAIL'
      ? 'text-dpo2u-terracotta'
      : 'text-dpo2u-gold';

  const copyField = (field: string, value: string) => {
    copy(value, (v) => setCopiedField(v ? field : null));
  };

  return (
    <Sheet open onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="overflow-y-auto sm:max-w-xl">
        <SheetHeader>
          <SheetTitle className="font-display text-2xl text-dpo2u-ink">
            Atestação on-chain
          </SheetTitle>
          <SheetDescription>
            Registro completo decodificado do contrato {truncateContract(DEFAULT_CONTRACT.id)}.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-5">
          <Field label="Verdict" value={event.record.verdict} mono valueClassName={`text-2xl font-display ${verdictColor}`} />

          <div className="grid grid-cols-1 gap-3">
            <Row label="Use case" value={event.use_case_id} mono onCopy={() => copyField('uc', event.use_case_id)} copied={copiedField === 'uc'} />
            <Row label="Predicate" value={`${event.record.predicate_set}@v${event.record.predicate_version}`} mono />
            <Row
              label="Evidence hash"
              value={truncateHash(event.evidence_hash_hex, 14, 10)}
              fullValue={event.evidence_hash_hex}
              mono
              onCopy={() => copyField('eh', event.evidence_hash_hex)}
              copied={copiedField === 'eh'}
            />
            <Row
              label="Metadata hash"
              value={truncateHash(event.record.metadata_hash_hex, 14, 10)}
              fullValue={event.record.metadata_hash_hex}
              mono
              onCopy={() => copyField('mh', event.record.metadata_hash_hex)}
              copied={copiedField === 'mh'}
            />
            <Row
              label="Submitter"
              value={truncateContract(event.record.submitted_by, 8, 6)}
              fullValue={event.record.submitted_by}
              mono
              onCopy={() => copyField('sub', event.record.submitted_by)}
              copied={copiedField === 'sub'}
            />
            <Row label="Timestamp on-chain" value={ts.toISOString()} />
            <Row label="Ledger" value={event.ledger > 0 ? event.ledger.toLocaleString('pt-BR') : '—'} />
          </div>

          <div className="pt-4 border-t border-dpo2u-ink/10 space-y-2">
            <a
              href={stellarExpertUrl('tx', event.tx_hash)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-2 rounded-lg bg-dpo2u-ink p-3 text-dpo2u-ivory text-sm hover:bg-dpo2u-ink/85"
            >
              <span>Ver transação no Stellar Expert</span>
              <ExternalLink className="h-4 w-4" />
            </a>
            <a
              href={`/pilot/verify?uc=${encodeURIComponent(event.use_case_id)}&hash=${event.evidence_hash_hex}`}
              className="flex items-center justify-between gap-2 rounded-lg border border-dpo2u-ink/20 p-3 text-dpo2u-ink text-sm hover:bg-dpo2u-ink/5"
            >
              <span>Reverificar este hash</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>

          <details className="pt-2">
            <summary className="cursor-pointer text-xs font-mono uppercase tracking-wider text-dpo2u-ink/60 hover:text-dpo2u-ink">
              JSON bruto
            </summary>
            <pre className="mt-2 rounded-lg bg-dpo2u-ink/5 p-3 text-[10px] leading-relaxed font-mono overflow-x-auto">
              {JSON.stringify(event.record, null, 2)}
            </pre>
          </details>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Field({ label, value, mono, valueClassName }: { label: string; value: string; mono?: boolean; valueClassName?: string }) {
  return (
    <div>
      <p className="text-xs font-mono uppercase tracking-wider text-dpo2u-ink/60">{label}</p>
      <p className={`mt-0.5 ${mono ? 'font-mono' : ''} ${valueClassName ?? 'text-dpo2u-ink'}`}>{value}</p>
    </div>
  );
}

interface RowProps {
  readonly label: string;
  readonly value: string;
  readonly fullValue?: string;
  readonly mono?: boolean;
  readonly onCopy?: () => void;
  readonly copied?: boolean;
}

function Row({ label, value, fullValue, mono, onCopy, copied }: RowProps) {
  return (
    <div className="flex items-start justify-between gap-3 text-sm">
      <div className="min-w-0 flex-1">
        <p className="text-xs text-dpo2u-ink/60 font-body">{label}</p>
        <p
          className={`mt-0.5 ${mono ? 'font-mono text-xs' : ''} text-dpo2u-ink break-all`}
          title={fullValue ?? value}
        >
          {value}
        </p>
      </div>
      {onCopy && (
        <button
          type="button"
          onClick={onCopy}
          className="shrink-0 inline-flex items-center gap-1 rounded px-2 py-1 text-xs text-dpo2u-ink/60 hover:bg-dpo2u-ink/5 hover:text-dpo2u-ink"
        >
          <Copy className="h-3 w-3" />
          {copied ? 'Copiado!' : 'Copiar'}
        </button>
      )}
    </div>
  );
}
