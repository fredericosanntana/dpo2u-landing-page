import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLocation, useNavigate } from 'react-router-dom';
import { Loader2, KeyRound, ShieldCheck, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/lib/pilot/auth-store';
import { probeApiKey, McpError } from '@/lib/pilot/mcp-client';

const schema = z.object({
  apiKey: z.string().trim().min(8, 'API key precisa ter no mínimo 8 caracteres').max(256, 'Máximo 256 caracteres'),
  tenantLabel: z.string().trim().max(64, 'Máximo 64 caracteres').optional().or(z.literal('')),
  mcpBaseUrl: z
    .string()
    .trim()
    .url('Informe uma URL válida')
    .max(256)
    .or(z.literal(''))
    .optional(),
});

type FormInput = z.infer<typeof schema>;

interface State {
  readonly status: 'idle' | 'probing' | 'ok' | 'err';
  readonly message?: string;
  readonly serverVersion?: string;
}

export function ApiKeyForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const setSession = useAuthStore((s) => s.setSession);
  const currentBase = useAuthStore((s) => s.mcpBaseUrl);
  const setMcpBaseUrl = useAuthStore((s) => s.setMcpBaseUrl);

  const [state, setState] = useState<State>({ status: 'idle' });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInput>({
    resolver: zodResolver(schema),
    defaultValues: { apiKey: '', tenantLabel: '', mcpBaseUrl: '' },
  });

  const intendedFrom = (location.state as { from?: string } | null)?.from;

  const onSubmit = async (data: FormInput) => {
    setState({ status: 'probing' });
    const baseUrl = data.mcpBaseUrl?.trim() || currentBase;
    const probe = await probeApiKey({ apiKey: data.apiKey, mcpBaseUrl: baseUrl });
    if (probe.ok === false) {
      const e = (probe as { ok: false; error: McpError }).error;
      setState({
        status: 'err',
        message:
          e.code === 'unauthorized'
            ? 'API key recusada pelo MCP (401). Confira com o IT do município.'
            : e.code === 'network'
            ? 'Não foi possível conectar ao MCP. Verifique a URL e CORS.'
            : `Erro ${e.status}: ${e.message}`,
      });
      return;
    }
    setMcpBaseUrl(baseUrl);
    setSession({
      apiKey: data.apiKey,
      tenantLabel: data.tenantLabel?.trim() || undefined,
    });
    setState({ status: 'ok', serverVersion: probe.payload.version });
    setTimeout(() => {
      navigate(intendedFrom ?? '/pilot/operator', { replace: true });
    }, 600);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="apiKey" className="text-dpo2u-ink font-medium">
          API key do município
        </Label>
        <Input
          id="apiKey"
          type="password"
          autoComplete="off"
          spellCheck={false}
          placeholder="Cole o token DPO2U que o IT te forneceu"
          {...register('apiKey')}
        />
        {errors.apiKey && <p className="text-xs text-dpo2u-terracotta">{errors.apiKey.message}</p>}
        <p className="text-xs text-dpo2u-ink/60 font-body">
          A chave fica armazenada apenas no <code className="bg-dpo2u-ink/5 px-1 rounded font-mono">localStorage</code> deste navegador.
        </p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="tenantLabel" className="text-dpo2u-ink font-medium">
          Nome do município <span className="text-dpo2u-ink/50 font-normal">(opcional, só display)</span>
        </Label>
        <Input
          id="tenantLabel"
          placeholder="ex.: Prefeitura de Itacaré"
          {...register('tenantLabel')}
        />
      </div>

      <details className="text-sm">
        <summary className="cursor-pointer text-xs font-mono uppercase tracking-wider text-dpo2u-ink/60 hover:text-dpo2u-ink">
          Avançado · MCP base URL
        </summary>
        <div className="mt-3 space-y-1.5">
          <Label htmlFor="mcpBaseUrl" className="text-dpo2u-ink/70 font-medium text-xs">
            MCP server (default: <code className="bg-dpo2u-ink/5 px-1 rounded font-mono">{currentBase}</code>)
          </Label>
          <Input
            id="mcpBaseUrl"
            placeholder="https://mcp.dpo2u.com"
            className="font-mono text-xs"
            {...register('mcpBaseUrl')}
          />
          {errors.mcpBaseUrl && (
            <p className="text-xs text-dpo2u-terracotta">{errors.mcpBaseUrl.message}</p>
          )}
        </div>
      </details>

      {state.status === 'err' && state.message && (
        <div className="rounded-lg border border-dpo2u-terracotta/30 bg-dpo2u-terracotta/5 p-3">
          <p className="flex items-start gap-2 text-sm text-dpo2u-terracotta">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{state.message}</span>
          </p>
        </div>
      )}

      {state.status === 'ok' && (
        <div className="rounded-lg border border-dpo2u-verdigris/30 bg-dpo2u-verdigris/5 p-3">
          <p className="flex items-start gap-2 text-sm text-dpo2u-verdigris">
            <ShieldCheck className="h-4 w-4 shrink-0 mt-0.5" />
            <span>
              Conectado{state.serverVersion ? ` (MCP ${state.serverVersion})` : ''}. Redirecionando…
            </span>
          </p>
        </div>
      )}

      <Button
        type="submit"
        disabled={state.status === 'probing' || state.status === 'ok'}
        className="bg-dpo2u-ink text-dpo2u-ivory hover:bg-dpo2u-ink/85"
      >
        {state.status === 'probing' ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" /> Validando…
          </>
        ) : (
          <>
            <KeyRound className="h-4 w-4 mr-2" /> Entrar no console
          </>
        )}
      </Button>
    </form>
  );
}
