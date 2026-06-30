import { CheckCircle2, XCircle, AlertTriangle, FileSearch, ExternalLink, Copy } from 'lucide-react';
import { useState } from 'react';
import type { VerifyResult } from '@dpo2u/stellar-sdk';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { truncateContract, truncateHash, DEFAULT_CONTRACT, stellarExpertUrl } from '@/lib/pilot/stellar';
import { type MidnightVerify, midnightVerifyBase } from '@/lib/pilot/midnight-verify';

interface Props {
  readonly result: VerifyResult;
  readonly useCaseId: string;
  readonly evidenceHashHex: string;
  readonly chain?: 'stellar' | 'midnight';
  readonly midnight?: MidnightVerify;
}

function copyToClipboard(text: string, onDone: () => void): void {
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    void navigator.clipboard.writeText(text).then(onDone);
  }
}

export function VerifyResultCard({ result, useCaseId, evidenceHashHex, chain = 'stellar', midnight }: Props) {
  const [copiedCitation, setCopiedCitation] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);

  if (!result.found) {
    return (
      <div className="rounded-xl border border-dpo2u-ink/10 bg-dpo2u-ivory p-6 sm:p-8 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="rounded-full bg-dpo2u-ink/5 p-3 shrink-0">
            <FileSearch className="h-6 w-6 text-dpo2u-ink/60" />
          </div>
          <div className="flex-1 space-y-3">
            <h3 className="font-display text-2xl text-dpo2u-ink">Atestação não encontrada</h3>
            <p className="text-dpo2u-ink/70 font-body">
              Nenhum registro on-chain para o par{' '}
              <code className="rounded bg-dpo2u-ink/5 px-1.5 py-0.5 text-xs font-mono">{useCaseId}</code>{' '}
              + <code className="rounded bg-dpo2u-ink/5 px-1.5 py-0.5 text-xs font-mono">{truncateHash(evidenceHashHex)}</code>.
            </p>
            <p className="text-sm text-dpo2u-ink/60 font-body">
              Possíveis causas: hash incorreto, use_case_id errado, ou a atestação ainda não foi submetida ao
              contrato. Confira diretamente no explorer público:
            </p>
            <a
              href={stellarExpertUrl('contract', result.contract_id)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-dpo2u-indigo hover:underline"
            >
              Ver contrato no Stellar Expert <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  const r = result.record!;
  const isPass = r.verdict === 'PASS';
  const isFail = r.verdict === 'FAIL';
  const isReview = r.verdict === 'REVIEW';

  const accent = isPass
    ? 'bg-dpo2u-verdigris/10 border-dpo2u-verdigris/30'
    : isFail
    ? 'bg-dpo2u-terracotta/10 border-dpo2u-terracotta/30'
    : 'bg-dpo2u-gold/10 border-dpo2u-gold/30';
  const Icon = isPass ? CheckCircle2 : isFail ? XCircle : AlertTriangle;
  const iconColor = isPass
    ? 'text-dpo2u-verdigris'
    : isFail
    ? 'text-dpo2u-terracotta'
    : 'text-dpo2u-gold';

  const isMn = chain === 'midnight' && !!midnight;
  const ts = new Date(r.timestamp * 1000);
  const citation = isMn
    ? `Verificado on-chain (Midnight ${midnight!.network}): ${useCaseId} @ ${truncateHash(evidenceHashHex)} → ${r.verdict}. tx ${midnight!.tx} · block ${midnight!.block}. ComplianceRegistry ${result.contract_id}. Score privado (ZK).`
    : `Verificado on-chain (Stellar testnet): ${useCaseId} @ ${truncateHash(evidenceHashHex)} → ${r.verdict} (predicate ${r.predicate_set}@v${r.predicate_version}, ${ts.toISOString()}). Contract ${result.contract_id}. ${stellarExpertUrl('contract', result.contract_id)}`;

  return (
    <div className={cn('rounded-xl border p-6 sm:p-8 shadow-sm', accent)}>
      <div className="flex items-start gap-4">
        <div className={cn('rounded-full bg-white/60 p-3 shrink-0')}>
          <Icon className={cn('h-7 w-7', iconColor)} />
        </div>
        <div className="flex-1 space-y-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-wider text-dpo2u-ink/60 font-mono">
              Veredito on-chain
            </p>
            <h3 className={cn('font-display text-3xl sm:text-4xl', iconColor)}>{r.verdict}</h3>
          </div>

          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm font-body">
            <div>
              <dt className="text-dpo2u-ink/60">Predicate</dt>
              <dd className="text-dpo2u-ink font-mono">
                {r.predicate_set}@v{r.predicate_version}
              </dd>
            </div>
            <div>
              <dt className="text-dpo2u-ink/60">Submitter</dt>
              <dd className="text-dpo2u-ink font-mono break-all">{truncateContract(r.submitted_by, 6, 6)}</dd>
            </div>
            <div>
              <dt className="text-dpo2u-ink/60">Timestamp on-chain</dt>
              <dd className="text-dpo2u-ink">{ts.toISOString()}</dd>
            </div>
            <div>
              <dt className="text-dpo2u-ink/60">Metadata hash</dt>
              <dd className="text-dpo2u-ink font-mono text-xs break-all">{truncateHash(r.metadata_hash_hex, 12, 8)}</dd>
            </div>
            {isMn && (
              <>
                <div>
                  <dt className="text-dpo2u-ink/60">Network</dt>
                  <dd className="text-dpo2u-ink font-mono">Midnight {midnight!.network}</dd>
                </div>
                {midnight!.repo && (
                  <div>
                    <dt className="text-dpo2u-ink/60">Repository</dt>
                    <dd className="text-dpo2u-ink font-mono break-all">{midnight!.repo}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-dpo2u-ink/60">Transaction</dt>
                  <dd className="text-dpo2u-ink font-mono text-xs break-all">{truncateHash(midnight!.tx ?? '', 10, 8)}</dd>
                </div>
                <div>
                  <dt className="text-dpo2u-ink/60">Block</dt>
                  <dd className="text-dpo2u-ink font-mono">{midnight!.block ?? '—'}</dd>
                </div>
              </>
            )}
          </dl>

          <div className="flex flex-wrap items-center gap-2 pt-2">
            <a
              href={isMn ? `${midnightVerifyBase}/verify/${useCaseId}/${evidenceHashHex}` : stellarExpertUrl('contract', result.contract_id)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-dpo2u-ink px-4 py-2 text-sm font-medium text-dpo2u-ivory hover:bg-dpo2u-ink/85 transition-colors"
            >
              {isMn ? 'Ver registro on-chain (Midnight)' : 'Ver no Stellar Expert'} <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <Button
              variant="outline"
              size="sm"
              className="border-dpo2u-ink/20"
              onClick={() => copyToClipboard(citation, () => {
                setCopiedCitation(true);
                setTimeout(() => setCopiedCitation(false), 2000);
              })}
            >
              <Copy className="h-3.5 w-3.5 mr-1.5" />
              {copiedCitation ? 'Copiado!' : 'Citar este resultado'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(evidenceHashHex, () => {
                setCopiedHash(true);
                setTimeout(() => setCopiedHash(false), 2000);
              })}
            >
              <Copy className="h-3.5 w-3.5 mr-1.5" />
              {copiedHash ? 'Copiado!' : 'Copiar hash'}
            </Button>
          </div>

          <div className="pt-2 border-t border-dpo2u-ink/10">
            {isMn ? (
              <p className="text-xs text-dpo2u-ink/60 font-body italic">
                Verificação direta contra a ComplianceRegistry {truncateContract(result.contract_id)} na Midnight {midnight!.network}.
                O score é privado (ZK) — só o veredito + hashes vão à cadeia. Reproduza com{' '}
                <code className="bg-dpo2u-ink/5 px-1 py-0.5 rounded font-mono text-[10px]">npx tsx scripts/verify-seal.ts &lt;ComplianceRegistry&gt; {truncateHash(evidenceHashHex, 6, 4)}</code>{' '}
                ou consulte o indexer público.
              </p>
            ) : (
              <p className="text-xs text-dpo2u-ink/60 font-body italic">
                Verificação feita diretamente contra o contrato {truncateContract(result.contract_id)} via Soroban
                RPC pública. Nenhuma credencial DPO2U foi usada. Você pode reproduzir essa consulta com{' '}
                <code className="bg-dpo2u-ink/5 px-1 py-0.5 rounded font-mono text-[10px]">npm i -g @dpo2u/stellar-sdk</code> e{' '}
                <code className="bg-dpo2u-ink/5 px-1 py-0.5 rounded font-mono text-[10px]">dpo2u-attest verify {useCaseId} {truncateHash(evidenceHashHex, 6, 4)}</code>.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
