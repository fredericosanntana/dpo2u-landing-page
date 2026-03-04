import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileCode2, ChevronDown, ChevronUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { fadeInUp } from '@/lib/animations';

interface CompactContract {
  name: string;
  description: string;
  purpose: string;
  code: string;
}

const contracts: CompactContract[] = [
  {
    name: 'ComplianceRegistry',
    description: 'ZK-verified compliance attestations',
    purpose: 'Stores compliance scores, agent DIDs, and policy CIDs on-chain without exposing private data.',
    code: `pragma language_version >= 0.19;
import CompactStandardLibrary;

export ledger attestation_scores: Map<Bytes<32>, Uint<64>>;
export ledger attestation_dids: Map<Bytes<32>, Bytes<32>>;

export circuit registerAttestation(
  company_id: Bytes<32>,
  agent_did: Bytes<32>,
  policy_cid: Bytes<32>,
  score: Uint<64>
): [] {
  assert(score <= 100, "Invalid compliance score");
  attestation_scores.insert(
    disclose(company_id), disclose(score)
  );
  attestation_dids.insert(
    disclose(company_id), disclose(agent_did)
  );
}`,
  },
  {
    name: 'AgentRegistry',
    description: 'On-chain agent identity management',
    purpose: 'Registers and manages agent identities with role-based status tracking.',
    code: `pragma language_version >= 0.19;
import CompactStandardLibrary;

export ledger agents: Map<Bytes<32>, AgentRecord>;

struct AgentRecord {
  status: Uint<8>,   // 1=active, 0=inactive
  role: Bytes<32>,   // "auditor", "deployer"
  timestamp: Uint<64>
}

export circuit registerAgent(
  agent_did: Bytes<32>,
  role: Bytes<32>
): [] {
  agents[agent_did] = AgentRecord {
    status: 1,
    role: role,
    timestamp: currentTimestamp()
  };
}`,
  },
  {
    name: 'FeeDistributor',
    description: 'Autonomous fee splitting',
    purpose: 'Orchestrates fee distribution between Expert (40%) and Auditor (60%) agents.',
    code: `pragma language_version >= 0.19;
import CompactStandardLibrary;

export ledger expert_fee_pool: Uint<64>;
export ledger auditor_fee_pool: Uint<64>;

export circuit distributeComplianceFee(
  company_id: Bytes<32>,
  expert_agent_did: Bytes<32>,
  auditor_agent_did: Bytes<32>,
  amount_night: Uint<64>
): [] {
  assert(amount_night > 0, "Fee must be > 0");
  // Expert 40% | Auditor 60%
}`,
  },
  {
    name: 'PaymentGateway',
    description: 'Corporate deposit escrow & staking',
    purpose: 'Entry point for corporate deposits and $NIGHT token staking.',
    code: `pragma language_version >= 0.19;
import CompactStandardLibrary;

export ledger protocol_treasury: Uint<64>;
export ledger total_staked_night: Uint<64>;

export circuit depositToTreasury(
  amount: Uint<64>
): [] {
  assert(amount > 0, "Deposit > 0");
}

export circuit stakeTokens(
  amount: Uint<64>
): [] {
  assert(amount > 0, "Stake > 0");
}`,
  },
  {
    name: 'AgentWalletFactory',
    description: 'Agent wallet generation',
    purpose: 'Creates and manages on-chain identity and digital vaults for autonomous agents.',
    code: `pragma language_version >= 0.19;
import CompactStandardLibrary;

export ledger last_agent_wallet: Bytes<32>;
export ledger last_agent_balance_night: Uint<64>;

export circuit registerAgent(
  agent_did: Bytes<32>,
  wallet_address: Bytes<32>
): [] { }

export circuit getAgentWallet(
  agent_did: Bytes<32>
): Bytes<32> {
  return last_agent_wallet;
}`,
  },
];

export default function CompactContractsShowcase() {
  const [expanded, setExpanded] = useState<number | null>(0);

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {contracts.map((contract, idx) => (
        <motion.div key={contract.name} variants={fadeInUp}>
          <Card className="h-full bg-slate-800/50 border-slate-700 hover:border-purple-500/40 transition-all overflow-hidden">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <FileCode2 className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">{contract.name}</h3>
                  <p className="text-xs text-purple-300">.compact</p>
                </div>
              </div>
              <p className="text-slate-400 text-sm mb-3">{contract.description}</p>
              <p className="text-slate-500 text-xs mb-4">{contract.purpose}</p>

              <button
                onClick={() => setExpanded(expanded === idx ? null : idx)}
                className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 transition-colors"
              >
                {expanded === idx ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                {expanded === idx ? 'Hide Code' : 'View Code'}
              </button>
            </div>

            {expanded === idx && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="border-t border-slate-700"
              >
                <div className="bg-slate-950 p-4 overflow-x-auto">
                  <pre className="text-xs font-mono text-purple-300 whitespace-pre">
                    {contract.code}
                  </pre>
                </div>
              </motion.div>
            )}
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
