import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Check, Loader2, Fingerprint, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

type ZKStatus = 'idle' | 'auditing' | 'compiling' | 'proving' | 'submitting' | 'verified';

const CONTRACT_ADDRESS = 'ec6860dde1162bf56ee9877fbbcddaa5396515fee4b7963a13cce7e0976c3701';

export default function MidnightZKDemo() {
  const [status, setStatus] = useState<ZKStatus>('idle');
  const [proofData, setProofData] = useState<{
    score: number;
    proofHash: string;
    timestamp: string;
    txId: string;
  } | null>(null);

  const runSimulation = () => {
    setStatus('auditing');
    setTimeout(() => {
      setStatus('compiling');
      setTimeout(() => {
        setStatus('proving');
        setTimeout(() => {
          setStatus('submitting');
          setTimeout(() => {
            setProofData({
              score: 97,
              proofHash: `0x${CONTRACT_ADDRESS.slice(0, 64)}`,
              timestamp: new Date().toISOString(),
              txId: `midnight://tx/${CONTRACT_ADDRESS.slice(0, 16)}`,
            });
            setStatus('verified');
          }, 1200);
        }, 1500);
      }, 1800);
    }, 1400);
  };

  const getStepStatus = (step: ZKStatus) => {
    const order: ZKStatus[] = ['idle', 'auditing', 'compiling', 'proving', 'submitting', 'verified'];
    const currentIdx = order.indexOf(status);
    const stepIdx = order.indexOf(step);
    if (stepIdx < currentIdx) return 'done';
    if (stepIdx === currentIdx && status !== 'idle') return 'active';
    return 'pending';
  };

  return (
    <Card className="bg-slate-950 border-purple-500/30 overflow-hidden shadow-2xl relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 blur-[80px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-sapphire-600/10 blur-[80px] rounded-full pointer-events-none"></div>

      <div className="p-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-2 flex items-center">
              <Fingerprint className="h-6 w-6 text-purple-400 mr-2" />
              Interactive ZK Proof Demo
            </h3>
            <p className="text-slate-400 text-sm">
              Compact compiler 0.29.0 &middot; Halo2 circuit &middot; k=9, rows=305
            </p>
          </div>
          <Button
            onClick={runSimulation}
            disabled={status !== 'idle' && status !== 'verified'}
            className="bg-purple-600 hover:bg-purple-500 text-white min-w-[200px]"
          >
            {status === 'idle' ? (
              <>
                <Terminal className="mr-2 h-4 w-4" />
                Run ZK Audit
              </>
            ) : status === 'verified' ? (
              'Run Again'
            ) : (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            )}
          </Button>
        </div>

        {/* Step indicators */}
        <div className="grid grid-cols-5 gap-2 mb-6">
          {[
            { key: 'auditing' as ZKStatus, label: 'Audit' },
            { key: 'compiling' as ZKStatus, label: 'Compile' },
            { key: 'proving' as ZKStatus, label: 'Prove' },
            { key: 'submitting' as ZKStatus, label: 'Submit' },
            { key: 'verified' as ZKStatus, label: 'Verify' },
          ].map((step) => {
            const s = getStepStatus(step.key);
            return (
              <div key={step.key} className="text-center">
                <div
                  className={`h-1 rounded-full mb-2 transition-all duration-500 ${
                    s === 'done'
                      ? 'bg-emerald-400'
                      : s === 'active'
                      ? 'bg-purple-400 animate-pulse'
                      : 'bg-slate-700'
                  }`}
                />
                <span
                  className={`text-xs ${
                    s === 'done' ? 'text-emerald-400' : s === 'active' ? 'text-purple-400' : 'text-slate-600'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Terminal output */}
        <div className="bg-slate-900 rounded-lg p-6 font-mono text-sm border border-slate-800 min-h-[220px] flex flex-col justify-center">
          {status === 'idle' && (
            <div className="text-slate-500 text-center flex flex-col items-center">
              <Shield className="h-12 w-12 mb-4 opacity-20" />
              <span>Ready to generate ZK compliance proof. Click &quot;Run ZK Audit&quot; to start.</span>
            </div>
          )}
          {status === 'auditing' && (
            <div className="space-y-2 text-slate-300">
              <p className="text-purple-400">$ midnight-audit --schema dpo2u/lgpd/v1</p>
              <p className="animate-pulse">Analyzing compliance rules against policy document...</p>
              <p className="text-slate-500">→ Loading ComplianceRegistry.compact</p>
            </div>
          )}
          {status === 'compiling' && (
            <div className="space-y-2 text-slate-300">
              <p className="text-emerald-400">✓ Audit complete — 15 rules evaluated</p>
              <p className="text-purple-400">$ compactc --circuit getComplianceStatus</p>
              <p className="animate-pulse">Compiling Halo2 circuit (k=9)...</p>
              <p className="text-slate-500">→ Generating .zkir payload</p>
            </div>
          )}
          {status === 'proving' && (
            <div className="space-y-2 text-slate-300">
              <p className="text-emerald-400">✓ Circuit compiled — 305 rows</p>
              <p className="text-purple-400">$ proof-server generate --port 6300</p>
              <p className="animate-pulse">Generating ZK-SNARK proof...</p>
              <p className="text-slate-500">→ Private inputs: company_data, policy_hash</p>
              <p className="text-slate-500">→ Public outputs: score, agent_did</p>
            </div>
          )}
          {status === 'submitting' && (
            <div className="space-y-2 text-slate-300">
              <p className="text-emerald-400">✓ Proof generated in 8ms</p>
              <p className="text-purple-400">$ midnight-submit --network preprod</p>
              <p className="animate-pulse">Broadcasting to Midnight Ledger via wss://rpc.preprod.midnight.network...</p>
              <p className="text-slate-500">→ Contract: {CONTRACT_ADDRESS.slice(0, 16)}...</p>
            </div>
          )}
          {status === 'verified' && proofData && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="flex items-center text-emerald-400 font-bold text-lg mb-2">
                <Check className="h-6 w-6 mr-2" />
                ZK PROOF VERIFIED ON MIDNIGHT LEDGER
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-800/50 p-3 rounded">
                  <span className="text-slate-500 block text-xs mb-1">Compliance Score</span>
                  <span className="text-white text-lg">{proofData.score}/100 — Compliant</span>
                </div>
                <div className="bg-slate-800/50 p-3 rounded">
                  <span className="text-slate-500 block text-xs mb-1">Timestamp</span>
                  <span className="text-white text-sm">{proofData.timestamp}</span>
                </div>
                <div className="bg-slate-800/50 p-3 rounded col-span-1 md:col-span-2 overflow-hidden">
                  <span className="text-slate-500 block text-xs mb-1">Contract Address</span>
                  <span className="text-purple-300 text-xs break-all font-mono">{CONTRACT_ADDRESS}</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </Card>
  );
}
