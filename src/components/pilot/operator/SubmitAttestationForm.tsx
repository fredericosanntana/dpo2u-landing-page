import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Send, AlertCircle, CheckCircle2, ExternalLink, CreditCard, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  submitAttestation,
  pollAttestation,
  McpError,
  type AttestationAttempt,
  type SubmitResult,
  type PaymentRequiredResponse,
} from '@/lib/pilot/mcp-client';
import { stellarExpertUrl } from '@/lib/pilot/stellar';

const schema = z.object({
  use_case_id: z
    .string()
    .min(1, 'Informe o use_case_id')
    .max(32)
    .regex(/^[a-zA-Z0-9_]+$/, 'Apenas [a-zA-Z0-9_], até 32 chars'),
  request_id: z
    .string()
    .min(1, 'Informe o request_id')
    .max(128)
    .regex(/^[A-Za-z0-9_.\-:]+$/, 'Apenas [A-Za-z0-9_.\\-:], até 128 chars'),
  evidence_json: z.string().min(2, 'Cole o JSON da evidência'),
  callback_url: z.string().url('URL inválida').or(z.literal('')).optional(),
});

type FormInput = z.infer<typeof schema>;

const SAMPLE_EVIDENCE = JSON.stringify(
  {
    supplier_cnpj: '11.222.333/0001-81',
    new_account_holder_cnpj: '11.222.333/0001-81',
    new_account_bank_ispb: '60701190',
    request_channel: 'portal_oficial',
    sender_email_domain: 'prefeitura.example.gov.br',
    expected_municipal_domain: 'prefeitura.example.gov.br',
  },
  null,
  2,
);

type ResultState =
  | { readonly kind: 'idle' }
  | { readonly kind: 'submitting' }
  | { readonly kind: 'pending'; readonly attempt: AttestationAttempt }
  | { readonly kind: 'completed'; readonly attempt: AttestationAttempt }
  | { readonly kind: 'failed'; readonly attempt?: AttestationAttempt; readonly errorMessage?: string }
  | { readonly kind: 'payment_required'; readonly challenge: PaymentRequiredResponse }
  | { readonly kind: 'error'; readonly message: string };

export function SubmitAttestationForm() {
  const [state, setState] = useState<ResultState>({ kind: 'idle' });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      use_case_id: 'bank_chg',
      request_id: '',
      evidence_json: '',
      callback_url: '',
    },
  });

  const onSample = () => {
    setValue('use_case_id', 'bank_chg');
    setValue('request_id', `demo-${Date.now()}`);
    setValue('evidence_json', SAMPLE_EVIDENCE);
  };

  const onSubmit = async (data: FormInput) => {
    setState({ kind: 'submitting' });
    let evidence: Record<string, unknown>;
    try {
      evidence = JSON.parse(data.evidence_json) as Record<string, unknown>;
    } catch (err) {
      setState({
        kind: 'error',
        message: `Evidence JSON inválido: ${err instanceof Error ? err.message : String(err)}`,
      });
      return;
    }
    let result: SubmitResult;
    try {
      result = await submitAttestation({
        use_case_id: data.use_case_id,
        request_id: data.request_id,
        evidence,
        callback_url: data.callback_url || undefined,
      });
    } catch (err) {
      const e = err as McpError;
      setState({
        kind: 'error',
        message: `${e.status === 0 ? 'Rede' : `HTTP ${e.status}`} · ${e.message}`,
      });
      return;
    }
    if (result.kind === 'payment_required') {
      setState({ kind: 'payment_required', challenge: result.challenge });
      return;
    }
    // Accepted — poll status until terminal.
    const attemptShim: AttestationAttempt = {
      attempt_id: result.attempt_id,
      request_id: data.request_id,
      use_case_id: data.use_case_id,
      status: result.status,
      created_at: Date.now(),
      updated_at: Date.now(),
    };
    setState({ kind: 'pending', attempt: attemptShim });
    pollAttestation(
      result.attempt_id,
      (attempt) => {
        if (attempt.status === 'COMPLETED') {
          setState({ kind: 'completed', attempt });
        } else if (attempt.status === 'FAILED') {
          setState({ kind: 'failed', attempt, errorMessage: attempt.error?.message });
        } else {
          setState({ kind: 'pending', attempt });
        }
      },
      (err) => {
        setState({
          kind: 'failed',
          errorMessage: `Polling falhou: ${err.message}`,
        });
      },
      { intervalMs: 3_000, maxAttempts: 40 },
    );
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_2fr] gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="use_case_id">Use case</Label>
            <Input
              id="use_case_id"
              className="font-mono"
              placeholder="bank_chg"
              {...register('use_case_id')}
            />
            {errors.use_case_id && (
              <p className="text-xs text-dpo2u-terracotta">{errors.use_case_id.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="request_id">Request ID (correlação)</Label>
            <Input
              id="request_id"
              className="font-mono"
              placeholder="ex.: req-2026-05-14-001"
              {...register('request_id')}
            />
            {errors.request_id && (
              <p className="text-xs text-dpo2u-terracotta">{errors.request_id.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="evidence_json">Evidence (JSON)</Label>
            <button
              type="button"
              onClick={onSample}
              className="text-xs text-dpo2u-indigo hover:underline inline-flex items-center gap-1"
            >
              <Sparkles className="h-3 w-3" /> Carregar exemplo bank_chg
            </button>
          </div>
          <Textarea
            id="evidence_json"
            rows={10}
            className="font-mono text-xs"
            placeholder="Cole o JSON da evidência (sem PII em campos sensíveis se possível)"
            {...register('evidence_json')}
          />
          {errors.evidence_json && (
            <p className="text-xs text-dpo2u-terracotta">{errors.evidence_json.message}</p>
          )}
          <p className="text-xs text-dpo2u-ink/60 font-body">
            O servidor calcula SHA-256(canonical JSON) → vai on-chain. PII opcional aqui fica off-chain apenas.
          </p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="callback_url">Callback URL <span className="text-dpo2u-ink/50 font-normal text-xs">(opcional)</span></Label>
          <Input
            id="callback_url"
            placeholder="https://seu-sistema/dpo2u/cb"
            {...register('callback_url')}
          />
        </div>

        <Button
          type="submit"
          disabled={state.kind === 'submitting' || state.kind === 'pending'}
          className="bg-dpo2u-ink text-dpo2u-ivory hover:bg-dpo2u-ink/85"
        >
          {state.kind === 'submitting' || state.kind === 'pending' ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              {state.kind === 'submitting' ? 'Enviando…' : 'Aguardando blockchain…'}
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" /> Submeter atestação
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

      {state.kind === 'payment_required' && (
        <div className="rounded-lg border border-dpo2u-gold/30 bg-dpo2u-gold/5 p-5 space-y-3">
          <div className="flex items-start gap-2">
            <CreditCard className="h-5 w-5 text-dpo2u-gold shrink-0 mt-0.5" />
            <div>
              <p className="font-display text-lg text-dpo2u-ink">Pagamento requerido (x402)</p>
              <p className="text-sm text-dpo2u-ink/70 font-body mt-1">
                Este use case exige pagamento on-chain antes do registro. Faça o pagamento via Stellar (cliente x402) e
                reenvie a request.
              </p>
            </div>
          </div>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <Detail label="Valor" value={state.challenge.amount_decimal ?? state.challenge.amount_atomic} />
            <Detail label="Asset" value={state.challenge.asset_address} mono />
            <Detail label="Destinatário" value={state.challenge.recipient} mono />
            <Detail label="Network" value={state.challenge.network} />
          </dl>
          {state.challenge.description && (
            <p className="text-xs text-dpo2u-ink/60 italic">{state.challenge.description}</p>
          )}
        </div>
      )}

      {state.kind === 'pending' && (
        <div className="rounded-lg border border-dpo2u-ink/10 bg-white p-4">
          <p className="flex items-center gap-2 text-sm text-dpo2u-ink">
            <Loader2 className="h-4 w-4 animate-spin" />
            Atestação <code className="bg-dpo2u-ink/5 px-1 rounded font-mono text-xs">{state.attempt.attempt_id.slice(0, 8)}…</code> em processamento. Verdict + tx hash chegam em ~10–60 s.
          </p>
        </div>
      )}

      {state.kind === 'completed' && state.attempt.result && (
        <div className="rounded-xl border border-dpo2u-verdigris/30 bg-dpo2u-verdigris/5 p-5 space-y-3">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-6 w-6 text-dpo2u-verdigris shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-dpo2u-ink/60">Atestação registrada</p>
              <p className="font-display text-2xl text-dpo2u-verdigris">{state.attempt.result.verdict}</p>
            </div>
          </div>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <Detail label="Predicate" value={`${state.attempt.result.predicate_set_id}@v${state.attempt.result.predicate_set_version}`} mono />
            <Detail label="Ledger" value={String(state.attempt.result.tx.ledger)} mono />
            <Detail label="Evidence hash" value={state.attempt.result.evidence_hash_hex} mono />
            <Detail label="Tx hash" value={state.attempt.result.tx.feeBumpTxHash} mono />
          </dl>
          <a
            href={state.attempt.result.tx.explorerUrl || stellarExpertUrl('tx', state.attempt.result.tx.feeBumpTxHash)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-dpo2u-ink px-4 py-2 text-sm font-medium text-dpo2u-ivory hover:bg-dpo2u-ink/85"
          >
            Ver no Stellar Expert <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      )}

      {state.kind === 'failed' && (
        <div className="rounded-lg border border-dpo2u-terracotta/30 bg-dpo2u-terracotta/5 p-4">
          <p className="flex items-start gap-2 text-sm text-dpo2u-terracotta">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>
              Atestação falhou
              {state.errorMessage ? `: ${state.errorMessage}` : '. Verifique o histórico para detalhes.'}
            </span>
          </p>
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
