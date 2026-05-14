import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Send, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  configureUseCaseSimulate,
  configureUseCaseSubmit,
  type SimulationResult,
  type SubmissionResult,
} from '@/lib/pilot/admin-tx';
import { TransactionPreview } from './TransactionPreview';

const schema = z.object({
  useCaseId: z
    .string()
    .min(1, 'Informe o use_case_id')
    .max(32)
    .regex(/^[a-zA-Z0-9_]+$/, 'Apenas [a-zA-Z0-9_]'),
  predicateSet: z
    .string()
    .min(1, 'Informe o predicate_set')
    .max(32)
    .regex(/^[a-zA-Z0-9_]+$/, 'Apenas [a-zA-Z0-9_]'),
  predicateVersion: z.number().int().min(1, 'Versão >= 1').max(10_000),
  active: z.boolean(),
});

type FormInput = z.infer<typeof schema>;

interface Props {
  readonly admin: string;
}

type State =
  | { kind: 'idle' }
  | { kind: 'submitting' }
  | { kind: 'done'; receipt: SubmissionResult }
  | { kind: 'error'; message: string };

export function ConfigureUseCaseForm({ admin }: Props) {
  const [state, setState] = useState<State>({ kind: 'idle' });
  const [sim, setSim] = useState<SimulationResult | null>(null);
  const [simulating, setSimulating] = useState(false);

  const form = useForm<FormInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema) as any,
    defaultValues: { useCaseId: 'bank_chg', predicateSet: 'bank_chg', predicateVersion: 1, active: true },
  });

  const watched = useWatch({ control: form.control });

  useEffect(() => {
    const data = form.getValues();
    if (!data.useCaseId || !data.predicateSet) {
      setSim(null);
      return;
    }
    setSimulating(true);
    const t = setTimeout(async () => {
      const result = await configureUseCaseSimulate({
        admin,
        useCaseId: data.useCaseId,
        predicateSet: data.predicateSet,
        predicateVersion: Number(data.predicateVersion ?? 1),
        active: data.active,
      });
      setSim(result);
      setSimulating(false);
    }, 600);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watched.useCaseId, watched.predicateSet, watched.predicateVersion, watched.active, admin]);

  const onSubmit = async (data: FormInput) => {
    setState({ kind: 'submitting' });
    try {
      const receipt = await configureUseCaseSubmit({
        admin,
        useCaseId: data.useCaseId,
        predicateSet: data.predicateSet,
        predicateVersion: data.predicateVersion,
        active: data.active,
      });
      setState({ kind: 'done', receipt });
    } catch (err) {
      setState({ kind: 'error', message: err instanceof Error ? err.message : String(err) });
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="useCaseId">Use case ID</Label>
            <Input id="useCaseId" className="font-mono" {...form.register('useCaseId')} />
            {form.formState.errors.useCaseId && (
              <p className="text-xs text-dpo2u-terracotta">{form.formState.errors.useCaseId.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="predicateSet">Predicate set</Label>
            <Input id="predicateSet" className="font-mono" {...form.register('predicateSet')} />
            {form.formState.errors.predicateSet && (
              <p className="text-xs text-dpo2u-terracotta">{form.formState.errors.predicateSet.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
          <div className="space-y-1.5">
            <Label htmlFor="predicateVersion">Versão</Label>
            <Input
              id="predicateVersion"
              type="number"
              min={1}
              {...form.register('predicateVersion', { valueAsNumber: true })}
            />
            {form.formState.errors.predicateVersion && (
              <p className="text-xs text-dpo2u-terracotta">{form.formState.errors.predicateVersion.message}</p>
            )}
          </div>
          <div className="flex items-center gap-3 pb-2">
            <Switch
              id="active"
              checked={form.watch('active')}
              onCheckedChange={(v) => form.setValue('active', v)}
            />
            <Label htmlFor="active" className="cursor-pointer">
              Ativo
            </Label>
          </div>
        </div>

        <TransactionPreview
          title="configure_use_case"
          simulating={simulating}
          sim={sim}
          args={[
            { label: 'admin', value: admin },
            { label: 'use_case_id', value: form.watch('useCaseId') },
            { label: 'active', value: String(form.watch('active')) },
            { label: 'predicate_set', value: form.watch('predicateSet') },
            { label: 'predicate_version', value: String(form.watch('predicateVersion')) },
          ]}
        />

        <Button
          type="submit"
          disabled={state.kind === 'submitting' || !sim?.success}
          className="bg-dpo2u-ink text-dpo2u-ivory hover:bg-dpo2u-ink/85"
        >
          {state.kind === 'submitting' ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Aguardando Freighter…
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Assinar + submeter
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
              <p className="text-xs font-mono uppercase tracking-wider text-dpo2u-ink/60">
                Configuração registrada on-chain
              </p>
              <p className="font-display text-2xl text-dpo2u-verdigris mt-1">
                ledger {state.receipt.ledger ?? '—'}
              </p>
            </div>
          </div>
          <p className="font-mono text-xs text-dpo2u-ink/80 break-all">tx: {state.receipt.hash}</p>
          <a
            href={state.receipt.explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-dpo2u-ink px-4 py-2 text-sm font-medium text-dpo2u-ivory hover:bg-dpo2u-ink/85"
          >
            Ver no Stellar Expert <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      )}
    </div>
  );
}
