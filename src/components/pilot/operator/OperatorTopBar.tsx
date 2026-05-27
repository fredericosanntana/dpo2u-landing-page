import { Link, useNavigate } from 'react-router-dom';
import { LogOut, KeyRound, FileCheck2, History, ShieldX } from 'lucide-react';
import { useAuthStore, maskApiKey } from '@/lib/pilot/auth-store';
import { Button } from '@/components/ui/button';

export function OperatorTopBar() {
  const apiKey = useAuthStore((s) => s.apiKey);
  const tenantLabel = useAuthStore((s) => s.tenantLabel);
  const mcpBaseUrl = useAuthStore((s) => s.mcpBaseUrl);
  const clear = useAuthStore((s) => s.clear);
  const navigate = useNavigate();

  const onLogout = () => {
    clear();
    navigate('/pilot/login', { replace: true });
  };

  return (
    <div className="border-b border-dpo2u-ink/10 bg-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-3 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-sm">
          <KeyRound className="h-4 w-4 text-dpo2u-ink/50" />
          <span className="font-mono text-xs text-dpo2u-ink/70">{maskApiKey(apiKey)}</span>
          {tenantLabel && (
            <span className="text-xs text-dpo2u-ink/60 ml-1">
              · <span className="font-medium text-dpo2u-ink">{tenantLabel}</span>
            </span>
          )}
          <span className="hidden sm:inline text-[10px] font-mono text-dpo2u-ink/40 ml-2">
            via {new URL(mcpBaseUrl).hostname}
          </span>
        </div>

        <nav className="flex items-center gap-1 ml-auto">
          <Link
            to="/pilot/operator/submit"
            className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-dpo2u-ink/70 hover:bg-dpo2u-ink/5 hover:text-dpo2u-ink"
          >
            <FileCheck2 className="h-3.5 w-3.5" /> Submeter
          </Link>
          <Link
            to="/pilot/operator/history"
            className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-dpo2u-ink/70 hover:bg-dpo2u-ink/5 hover:text-dpo2u-ink"
          >
            <History className="h-3.5 w-3.5" /> Histórico
          </Link>
          <Link
            to="/pilot/operator/erasure"
            className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-dpo2u-ink/70 hover:bg-dpo2u-ink/5 hover:text-dpo2u-ink"
          >
            <ShieldX className="h-3.5 w-3.5" /> Erasure
          </Link>
        </nav>

        <Button
          variant="ghost"
          size="sm"
          onClick={onLogout}
          className="text-dpo2u-ink/60 hover:text-dpo2u-terracotta hover:bg-dpo2u-terracotta/5"
        >
          <LogOut className="h-3.5 w-3.5 mr-1" /> Sair
        </Button>
      </div>
    </div>
  );
}
