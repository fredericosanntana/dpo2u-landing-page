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
  authorizeSubmitterSimulate,
  authorizeSubmitterSubmit,
  type SimulationResult,
  type SubmissionResult,
} from '@/lib/pilot/admin-tx';
import { TransactionPreview } from './TransactionPreview';

const schema = z.object({
  submitter: z.string().regex(/^G[A-Z2-7]{55}$/, 'Stellar pubkey inválido (G...)'),
  allowed: z.boolean(),
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

export function AuthorizeSubmitterForm({ admin }: Props) {
  const [state, setState] = useState<State>({ kind: 'idle' });
  const [sim, setSim] = useState<SimulationResult | null>(null);
  const [simulating, setSimulating] = useState(false);

  const form = useForm<FormInput>({
    resolver: zodResolver(schema),
    defaultValues: { submitter: '', allowed: true },
  });

  const watched = useWatch({ control: form.control });

  useEffect(() => {
    const data = form.getValues();
    if (!data.submitter || !/^G[A-Z2-7]{55}$/.test(data.submitter)) {
      setSim(null);
      return;
    }
    setSimulating(true);
    const t = setTimeout(async () => {
      const result = await authorizeSubmitterSimulate({
        admin,
        submitter: data.submitter,
        allowed: data.allowed,
      });
      setSim(result);
      setSimulating(false);
    }, 600);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watched.submitter, watched.allowed, admin]);

  const onSubmit = async (data: FormInput) => {
    setState({ kind: 'submitting' });
    try {
      const receipt = await authorizeSubmitterSubmit({ admin, submitter: data.submitter, allowed: data.allowed });
      setState({ kind: 'done', receipt });
    } catch (err) {
      setState({ kind: 'error', message: err instanceof Error ? err.message : String(err) });
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="submitter">Pubkey do submitter (G...)</Label>
          <Input
            id="submitter"
            className="font-mono text-xs"
            placeholder="GDJSDCHTR…"
            {...form.register('submitter')}
          />
          {form.formState.errors.submitter && (
            <p className="text-xs text-dpo2u-terracotta">{form.formState.errors.submitter.message}</p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Switch
            id="allowed"
            checked={form.watch('allowed')}
            onCheckedChange={(v) => form.setValue('allowed', v)}
          />
          <Label htmlFor="allowed" className="cursor-pointer">
            {form.watch('allowed') ? 'Autorizar submitter (allowed=true)' : 'Revogar submitter (allowed=false)'}
          </Label>
        </div>

        <TransactionPreview
          title="authorize_submitter"
          simulating={simulating}
          sim={sim}
          args={[
            { label: 'admin', value: admin },
            { label: 'submitter', value: form.watch('submitter') || '—' },
            { label: 'allowed', value: String(form.watch('allowed')) },
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
                Autorização registrada on-chain
              </p>
              <p className="font-display text-2xl text-dpo2u-verdigris mt-1">ledger {state.receipt.ledger ?? '—'}</p>
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
