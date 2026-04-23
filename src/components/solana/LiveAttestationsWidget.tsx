import React, { useEffect, useState } from 'react';
import { BorshCoder, Idl } from '@coral-xyz/anchor';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Fingerprint, AlertCircle, Loader2 } from 'lucide-react';
import { getConnection, explorerUrl, truncateAddress } from '@/lib/solana';
import rawIdl from '@/idl/compliance_registry.json';

type Attestation = {
  subject: Uint8Array;
  commitment: Uint8Array;
  threshold: number;
  verified: boolean;
  issuedAt: bigint;
};

type Row = {
  pda: string;
  account: Attestation;
};

const idl = rawIdl as unknown as Idl & { address: string };
const PROGRAM_ADDRESS = idl.address;
const REFRESH_MS = 30_000;

function toHex(bytes: Uint8Array, len = 8): string {
  return Array.from(bytes.slice(0, len))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function formatTimestamp(ts: bigint): string {
  const d = new Date(Number(ts) * 1000);
  if (isNaN(d.getTime())) return '—';
  return d.toISOString().replace('T', ' ').slice(0, 16) + ' UTC';
}

export default function LiveAttestationsWidget() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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
            const data = coder.accounts.decode('Attestation', acc.account.data) as {
              subject: Uint8Array | number[];
              commitment: Uint8Array | number[];
              threshold: number;
              verified: boolean;
              issued_at: bigint | number;
            };
            decoded.push({
              pda: acc.pubkey.toBase58(),
              account: {
                subject: new Uint8Array(data.subject as number[]),
                commitment: new Uint8Array(data.commitment as number[]),
                threshold: data.threshold,
                verified: data.verified,
                issuedAt: BigInt(data.issued_at as number),
              },
            });
          } catch {
            // not an Attestation account — skip
          }
        }

        decoded.sort((a, b) => Number(b.account.issuedAt - a.account.issuedAt));
        if (!cancelled) {
          setRows(decoded.slice(0, 5));
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
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-emerald-500/20 to-brand-sapphire-500/20 flex items-center justify-center">
            <Fingerprint className="w-5 h-5 text-brand-emerald-400" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Recent Attestations</h3>
            <p className="text-xs text-zinc-500">compliance-registry · devnet</p>
          </div>
        </div>
        <Badge variant={error ? 'warning' : 'status-active'} size="sm">
          {error ? 'offline' : loading ? 'loading' : 'live'}
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
          <div className="mb-2">No attestations on-chain yet.</div>
          <div className="text-xs text-zinc-600">
            Be the first: <code className="text-brand-emerald-400 font-mono">cargo run -p dpo2u-driver</code>
          </div>
        </div>
      )}

      {!error && rows && rows.length > 0 && (
        <ul className="divide-y divide-white/[0.04]">
          {rows.map((row) => (
            <li key={row.pda} className="py-3 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="text-sm text-white font-mono truncate">
                  {toHex(row.account.commitment, 8)}…
                </div>
                <div className="text-xs text-zinc-500 mt-0.5 flex items-center gap-2 flex-wrap">
                  <span>threshold: {row.account.threshold}</span>
                  <span>·</span>
                  <span>{formatTimestamp(row.account.issuedAt)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {row.account.verified && (
                  <Badge variant="success" size="sm">verified</Badge>
                )}
                <a
                  href={explorerUrl(row.pda)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-brand-sapphire-400 hover:text-brand-sapphire-300 flex items-center gap-1"
                >
                  PDA <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </li>
          ))}
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
