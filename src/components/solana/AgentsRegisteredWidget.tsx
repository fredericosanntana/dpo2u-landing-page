import React, { useEffect, useState } from 'react';
import { BorshCoder, Idl } from '@coral-xyz/anchor';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Users, AlertCircle, Loader2 } from 'lucide-react';
import { getConnection, explorerUrl, truncateAddress } from '@/lib/solana';
import rawIdl from '@/idl/agent_registry.json';

type Agent = {
  authority: string;
  name: string;
  permissions: number;
  createdAt: bigint;
};

type Row = {
  pda: string;
  account: Agent;
};

const idl = rawIdl as unknown as Idl & { address: string };
const PROGRAM_ADDRESS = idl.address;
const REFRESH_MS = 30_000;

const CAPABILITIES: { bit: number; label: string }[] = [
  { bit: 0x01, label: 'read' },
  { bit: 0x02, label: 'write' },
  { bit: 0x04, label: 'treasury' },
  { bit: 0x08, label: 'deploy' },
  { bit: 0x10, label: 'governance' },
];

function decodePermissions(perms: number): string[] {
  return CAPABILITIES.filter((c) => (perms & c.bit) !== 0).map((c) => c.label);
}

function formatTimestamp(ts: bigint): string {
  const d = new Date(Number(ts) * 1000);
  if (isNaN(d.getTime())) return '—';
  return d.toISOString().slice(0, 10);
}

export default function AgentsRegisteredWidget() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setError(null);
        const connection = getConnection();
        const coder = new BorshCoder(idl);
        const { PublicKey } = await import('@solana/web3.js');
        const programPk = new PublicKey(PROGRAM_ADDRESS);
        const accounts = await connection.getProgramAccounts(programPk, {
          commitment: 'confirmed',
          filters: [],
        });

        const decoded: Row[] = [];
        for (const acc of accounts) {
          try {
            const data = coder.accounts.decode('Agent', acc.account.data) as {
              authority: { toBase58: () => string };
              name: string;
              permissions: number;
              created_at: bigint | number;
            };
            decoded.push({
              pda: acc.pubkey.toBase58(),
              account: {
                authority: data.authority.toBase58(),
                name: data.name,
                permissions: data.permissions,
                createdAt: BigInt(data.created_at as number),
              },
            });
          } catch {
            // not an Agent account
          }
        }

        decoded.sort((a, b) => Number(b.account.createdAt - a.account.createdAt));
        if (!cancelled) {
          setRows(decoded.slice(0, 5));
          setTotal(decoded.length);
          setLoading(false);
        }
      } catch (e) {
        if (!cancelled) {
          setError((e as Error).message ?? 'Failed to reach Solana devnet');
          setLoading(false);
        }
      }
    }

    load();
    const id = setInterval(load, REFRESH_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return (
    <Card className="h-full p-6 bg-white/[0.02] border border-white/[0.06]">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-purple-500/20 to-brand-sapphire-500/20 flex items-center justify-center">
            <Users className="w-5 h-5 text-brand-purple-400" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Registered DPO Agents</h3>
            <p className="text-xs text-zinc-500">agent-registry · devnet</p>
          </div>
        </div>
        <Badge variant={error ? 'warning' : 'status-active'} size="sm">
          {error ? 'offline' : loading ? 'loading' : `${total} total`}
        </Badge>
      </div>

      {loading && !rows && (
        <div className="flex items-center justify-center py-10 text-zinc-500 text-sm">
          <Loader2 className="w-4 h-4 animate-spin mr-2" /> Reading devnet…
        </div>
      )}

      {error && (
        <div className="flex items-start gap-3 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-200 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <div className="font-medium mb-1">Devnet RPC unavailable</div>
            <div className="text-yellow-300/70">
              Program ID {truncateAddress(PROGRAM_ADDRESS)}. Try the
              <a
                href={explorerUrl(PROGRAM_ADDRESS)}
                className="underline mx-1 hover:text-yellow-100"
                target="_blank"
                rel="noopener noreferrer"
              >
                Explorer
              </a>
              directly.
            </div>
          </div>
        </div>
      )}

      {!error && rows && rows.length === 0 && (
        <div className="py-10 text-center text-zinc-500 text-sm">
          <div className="mb-2">No agents registered yet.</div>
          <div className="text-xs text-zinc-600">
            Use <code className="text-brand-emerald-400 font-mono">dpo2u-cli register-agent</code>
          </div>
        </div>
      )}

      {!error && rows && rows.length > 0 && (
        <ul className="divide-y divide-white/[0.04]">
          {rows.map((row) => {
            const caps = decodePermissions(row.account.permissions);
            return (
              <li key={row.pda} className="py-3 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-sm text-white truncate">{row.account.name || '(unnamed)'}</div>
                  <div className="text-xs text-zinc-500 mt-0.5 flex items-center gap-2 flex-wrap">
                    <span className="font-mono">{truncateAddress(row.account.authority)}</span>
                    <span>·</span>
                    <span>{formatTimestamp(row.account.createdAt)}</span>
                  </div>
                  {caps.length > 0 && (
                    <div className="flex gap-1 mt-1.5 flex-wrap">
                      {caps.map((c) => (
                        <span key={c} className="text-[10px] px-1.5 py-0.5 rounded bg-brand-purple-500/15 text-brand-purple-300 font-mono uppercase tracking-wider">
                          {c}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <a
                  href={explorerUrl(row.pda)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-brand-sapphire-400 hover:text-brand-sapphire-300 flex items-center gap-1 shrink-0"
                >
                  PDA <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            );
          })}
        </ul>
      )}

      <div className="mt-5 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-600">
        <span>Auto-refreshes every 30s</span>
        <a
          href={explorerUrl(PROGRAM_ADDRESS)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-sapphire-400 hover:text-brand-sapphire-300 flex items-center gap-1"
        >
          View program <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </Card>
  );
}
