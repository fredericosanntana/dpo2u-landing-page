import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, ShieldX, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  requestErasure,
  McpError,
  type ErasureResponse,
} from '@/lib/pilot/mcp-client';

const schema = z.object({
  original_use_case_id: z.string().min(1).max(32).regex(/^[a-zA-Z0-9_]+$/),
  original_evidence_hash_hex: z
    .string()
    .length(64, 'Hash precisa ter 64 hex chars')
    .regex(/^[0-9a-fA-F]{64}$/, 'Apenas dígitos hex'),
  requester_id: z.string().min(1, 'Identifique quem está pedindo a eliminação').max(128),
  reason: z
    .string()
    .min(1, 'Informe a fundamentação Art. 18')
    .max(280, 'Máximo 280 caracteres'),
  municipal_ticket_id: z.string().max(128).regex(/^[A-Za-z0-9_.\-:]*$/).optional().or(z.literal('')),
});

type FormInput = z.infer<typeof schema>;

type State =
  | { kind: 'idle' }
  | { kind: 'submitting' }
  | { kind: 'done'; response: ErasureResponse }
  | { kind: 'error'; message: string };

export function ErasureRequestForm() {
  const [state, setState] = useState<State>({ kind: 'idle' });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      original_use_case_id: '',
      original_evidence_hash_hex: '',
      requester_id: '',
      reason: '',
      municipal_ticket_id: '',
    },
  });

  const onSubmit = async (data: FormInput) => {
    setState({ kind: 'submitting' });
    try {
      const response = await requestErasure({
        original_use_case_id: data.original_use_case_id,
        original_evidence_hash_hex: data.original_evidence_hash_hex,
        requester_id: data.requester_id,
        reason: data.reason,
        municipal_ticket_id: data.municipal_ticket_id?.trim() || undefined,
      });
      setState({ kind: 'done', response });
    } catch (err) {
      const e = err as McpError;
      setState({
        kind: 'error',
        message: `${e.status === 0 ? 'Rede' : `HTTP ${e.status}`} · ${e.message}`,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-dpo2u-gold/30 bg-dpo2u-gold/5 p-4">
        <p className="text-sm text-dpo2u-ink/80 font-body">
          <strong>LGPD Art. 18 §1 — gratuito por lei.</strong> O contrato é imutável; a "eliminação" registra
          uma atestação <code className="bg-dpo2u-ink/5 px-1 rounded font-mono text-xs">erasure_v1</code> sob o mesmo
          hash da original. Off-chain payload é secure-erased <strong>antes</strong> da submissão on-chain — se
          o secure-erase falhar, o servidor retorna 503 e <strong>nada</strong> é registrado.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_2fr] gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="original_use_case_id">Use case original</Label>
            <Input
              id="original_use_case_id"
              className="font-mono"
              placeholder="bank_chg"
              {...register('original_use_case_id')}
            />
            {errors.original_use_case_id && (
              <p className="text-xs text-dpo2u-terracotta">{errors.original_use_case_id.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="original_evidence_hash_hex">Evidence hash original</Label>
            <Input
              id="original_evidence_hash_hex"
              className="font-mono text-xs"
              placeholder="64 hex"
              {...register('original_evidence_hash_hex')}
            />
            {errors.original_evidence_hash_hex && (
              <p className="text-xs text-dpo2u-terracotta">{errors.original_evidence_hash_hex.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="requester_id">Identificador do titular dos dados</Label>
          <Input
            id="requester_id"
            placeholder="CPF / protocolo do DSR / e-mail mascarado"
            {...register('requester_id')}
          />
          {errors.requester_id && <p className="text-xs text-dpo2u-terracotta">{errors.requester_id.message}</p>}
          <p className="text-xs text-dpo2u-ink/60">
            Hash SHA-256 desse valor entra na metadata; raw never goes on-chain.
          </p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="reason">Fundamentação LGPD (Art. 18 II/III/IV/VI)</Label>
          <Textarea
            id="reason"
            rows={3}
            placeholder="ex.: Titular exerceu direito de eliminação (Art. 18 VI) via protocolo CGM-2026-005."
            {...register('reason')}
          />
          {errors.reason && <p className="text-xs text-dpo2u-terracotta">{errors.reason.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="municipal_ticket_id">Protocolo municipal <span className="text-dpo2u-ink/50 font-normal">(opcional)</span></Label>
          <Input
            id="municipal_ticket_id"
            className="font-mono"
            placeholder="CGM-2026-005"
            {...register('municipal_ticket_id')}
          />
        </div>

        <Button
          type="submit"
          disabled={state.kind === 'submitting'}
          className="bg-dpo2u-ink text-dpo2u-ivory hover:bg-dpo2u-ink/85"
        >
          {state.kind === 'submitting' ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" /> Processando…
            </>
          ) : (
            <>
              <ShieldX className="h-4 w-4 mr-2" /> Solicitar eliminação
            </>
          )}
        </Button>
      </form>

      {state.kind === 'error' && (
        <div className="rounded-lg border border-dpo2u-terracotta/30 bg-dpo2u-terracotta/5 p-4">
          <p className="flex items-start gap-2 text-sm text-dpo2u-terracotta">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{state.message}</span>
          </p>
        </div>
      )}

      {state.kind === 'done' && (
        <div className="rounded-xl border border-dpo2u-verdigris/30 bg-dpo2u-verdigris/5 p-5 space-y-3">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-6 w-6 text-dpo2u-verdigris shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-dpo2u-ink/60">Eliminação processada</p>
              <p className="font-display text-2xl text-dpo2u-verdigris">{state.response.status}</p>
            </div>
          </div>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <Detail label="Attempt ID" value={state.response.attempt_id} mono />
            <Detail label="Secure erase" value={state.response.secure_erase.erased ? 'OK' : 'FALHOU'} />
            <Detail label="Adapter" value={state.response.secure_erase.adapter} mono />
            {state.response.erasure_attestation?.tx?.feeBumpTxHash && (
              <Detail label="Tx erasure_v1" value={state.response.erasure_attestation.tx.feeBumpTxHash} mono />
            )}
          </dl>
        </div>
      )}
    </div>
  );
}

interface DetailProps {
  readonly label: string;
  readonly value: string;
  readonly mono?: boolean;
}

function Detail({ label, value, mono }: DetailProps) {
  return (
    <div className="min-w-0">
      <dt className="text-xs text-dpo2u-ink/60">{label}</dt>
      <dd className={`text-dpo2u-ink ${mono ? 'font-mono text-xs break-all' : ''}`}>{value}</dd>
    </div>
  );
}
