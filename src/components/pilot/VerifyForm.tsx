import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Search, Sparkles } from 'lucide-react';
import type { VerifyResult } from '@dpo2u/stellar-sdk';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { verifyAttestation } from '@/lib/pilot/stellar';
import { verifyFormSchema, VERIFY_SAMPLE, type VerifyFormInput } from '@/lib/pilot/schemas';
import { VerifyResultCard } from './VerifyResultCard';

export function VerifyForm() {
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [lastQuery, setLastQuery] = useState<VerifyFormInput | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<VerifyFormInput>({
    resolver: zodResolver(verifyFormSchema),
    defaultValues: { use_case_id: '', evidence_hash_hex: '' },
  });

  const onSubmit = async (data: VerifyFormInput) => {
    setSubmitting(true);
    setError(null);
    try {
      const r = await verifyAttestation({
        useCaseId: data.use_case_id,
        evidenceHashHex: data.evidence_hash_hex,
      });
      setResult(r);
      setLastQuery(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setResult(null);
    } finally {
      setSubmitting(false);
    }
  };

  const useSample = () => {
    setValue('use_case_id', VERIFY_SAMPLE.use_case_id);
    setValue('evidence_hash_hex', VERIFY_SAMPLE.evidence_hash_hex);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="use_case_id" className="text-dpo2u-ink font-medium">
            Use case ID
          </Label>
          <Input
            id="use_case_id"
            placeholder="ex.: bank_chg"
            className="font-mono"
            {...register('use_case_id')}
          />
          <p className="text-xs text-dpo2u-ink/60 font-body">
            Identificador Soroban Symbol (até 32 caracteres, [a-zA-Z0-9_]).
          </p>
          {errors.use_case_id && (
            <p className="text-xs text-dpo2u-terracotta">{errors.use_case_id.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="evidence_hash_hex" className="text-dpo2u-ink font-medium">
            Evidence hash (SHA-256)
          </Label>
          <Input
            id="evidence_hash_hex"
            placeholder="64 caracteres hexadecimais"
            className="font-mono text-xs"
            {...register('evidence_hash_hex')}
          />
          <p className="text-xs text-dpo2u-ink/60 font-body">
            SHA-256 do payload de evidência. PII nunca vai on-chain — apenas o hash.
          </p>
          {errors.evidence_hash_hex && (
            <p className="text-xs text-dpo2u-terracotta">{errors.evidence_hash_hex.message}</p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="submit"
            disabled={submitting}
            className="bg-dpo2u-ink text-dpo2u-ivory hover:bg-dpo2u-ink/85"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Consultando blockchain…
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Verificar atestação
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={useSample}
            disabled={submitting}
            className="border-dpo2u-ink/20"
          >
            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
            Usar exemplo (demo M1)
          </Button>
        </div>
      </form>

      {error && (
        <div className="rounded-lg border border-dpo2u-terracotta/30 bg-dpo2u-terracotta/10 p-4">
          <p className="text-sm text-dpo2u-terracotta font-medium">Erro ao consultar Stellar RPC</p>
          <p className="text-xs text-dpo2u-ink/70 font-mono mt-1">{error}</p>
        </div>
      )}

      {result && lastQuery && (
        <VerifyResultCard
          result={result}
          useCaseId={lastQuery.use_case_id}
          evidenceHashHex={lastQuery.evidence_hash_hex}
        />
      )}
    </div>
  );
}
