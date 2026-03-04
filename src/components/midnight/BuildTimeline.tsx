import React from 'react';
import { motion } from 'framer-motion';
import { Check, Clock, CircleDot } from 'lucide-react';
import { fadeInUp } from '@/lib/animations';

interface Phase {
  phase: string;
  title: string;
  description: string;
  status: 'complete' | 'in-progress' | 'planned';
  items: string[];
}

const phases: Phase[] = [
  {
    phase: 'Phase 0',
    title: 'Research & Design',
    status: 'complete',
    description: 'Architecture design, whitepaper v1.1, market analysis',
    items: ['Whitepaper v1.1', 'Architecture diagrams', 'Token model ($NIGHT + $DUST)', '500K market analysis'],
  },
  {
    phase: 'Phase 1',
    title: 'Technical Foundation',
    status: 'complete',
    description: 'SDK integration, Solidity contracts, MCP tools',
    items: ['@dpo2u/midnight-sdk (1,500+ lines)', '3 Solidity contracts', '2 MCP Midnight tools', '35+ test files'],
  },
  {
    phase: 'Phase 2',
    title: 'Compact Contracts',
    status: 'complete',
    description: '5 Compact contracts deployed on Midnight Preprod',
    items: ['5 Compact contracts written', 'Deployed to Preprod', '2 SDK bugs found & fixed', 'Compact compiler 0.29.0'],
  },
  {
    phase: 'Phase 3',
    title: 'LGPD Kit + MCP',
    status: 'in-progress',
    description: 'Compliance tools with ZK verification',
    items: ['generate_dpia tool', 'audit_policy tool', 'register_policy on-chain', 'Full MCP integration'],
  },
  {
    phase: 'Phase 4',
    title: 'Agent Migration',
    status: 'planned',
    description: '6 agents migrated to Midnight-native',
    items: ['Agent DID binding', 'Auto-funding via $NIGHT', 'Midnight dashboard', 'Cross-chain bridge'],
  },
  {
    phase: 'Phase 5',
    title: 'Production Ready',
    status: 'planned',
    description: 'Security audit, docs, mainnet preparation',
    items: ['Security audit', 'Full documentation', 'Tutorial series', 'Mainnet deployment prep'],
  },
];

const statusConfig = {
  complete: { icon: Check, color: 'text-brand-emerald-400', bg: 'bg-brand-emerald-500/20', border: 'border-brand-emerald-500/30' },
  'in-progress': { icon: Clock, color: 'text-brand-purple-400', bg: 'bg-brand-purple-500/20', border: 'border-brand-purple-500/30' },
  planned: { icon: CircleDot, color: 'text-brand-platinum-600', bg: 'bg-brand-platinum-800/30', border: 'border-brand-platinum-700/30' },
};

export default function BuildTimeline() {
  return (
    <div className="relative">
      {/* Connecting line */}
      <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-brand-emerald-500/50 via-brand-purple-500/50 to-brand-platinum-700/30 hidden md:block" />

      <div className="space-y-8">
        {phases.map((phase, idx) => {
          const config = statusConfig[phase.status];
          const Icon = config.icon;
          const isEven = idx % 2 === 0;

          return (
            <motion.div
              key={phase.phase}
              variants={fadeInUp}
              className={`relative flex flex-col md:flex-row items-start md:items-center gap-4 ${
                isEven ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
            >
              {/* Content */}
              <div className={`flex-1 ${isEven ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12'}`}>
                <div
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-2 ${config.bg} ${config.color} border ${config.border}`}
                >
                  {phase.phase} — {phase.status === 'complete' ? 'Complete' : phase.status === 'in-progress' ? 'In Progress' : 'Planned'}
                </div>
                <h3 className="text-lg font-bold text-white mb-1">{phase.title}</h3>
                <p className="text-brand-platinum-500 text-sm mb-3">{phase.description}</p>
                <ul className={`space-y-1 ${isEven ? 'md:ml-auto' : ''}`}>
                  {phase.items.map((item) => (
                    <li key={item} className={`text-xs text-brand-platinum-600 flex items-center gap-2 ${isEven ? 'md:justify-end' : ''}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${phase.status === 'complete' ? 'bg-brand-emerald-400' : phase.status === 'in-progress' ? 'bg-brand-purple-400' : 'bg-brand-platinum-700'}`} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Center icon */}
              <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 z-10">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${config.bg} border-2 ${config.border}`}>
                  <Icon className={`h-5 w-5 ${config.color}`} />
                </div>
              </div>

              {/* Spacer for opposite side */}
              <div className="flex-1 hidden md:block" />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
