"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Brain, 
  Activity, 
  Server,
  Zap,
  Users,
  CheckCircle,
  AlertTriangle,
  Globe
} from 'lucide-react';

interface SystemStatus {
  timestamp: string;
  system: {
    status: string;
    throughput: number;
    latency: number;
    errorRate: number;
    uptime: number;
    memoryUsage: number;
    cpuUsage: number;
    networkIO: number;
  };
  agents: {
    total: number;
    active: number;
    available: number;
    spawned_last_hour: number;
  };
  tasks: {
    queued: number;
    processing: number;
    completed_last_hour: number;
    avg_processing_time: number;
  };
  leann: {
    status: string;
    indexed_documents: number;
    search_rate: number;
    avg_response_time: number;
  };
}

const LiveSystemStatusDashboard: React.FC = () => {
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // Fetch live system status
  useEffect(() => {
    const fetchSystemStatus = async () => {
      try {
        const response = await fetch('/api/agents/status');
        const data = await response.json();
        setSystemStatus(data);
        setLastUpdate(new Date());
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch system status:', error);
        setIsLoading(false);
      }
    };

    // Initial fetch
    fetchSystemStatus();

    // Update every 2 seconds
    const interval = setInterval(fetchSystemStatus, 2000);

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="relative w-full h-96 lg:h-[500px]">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 rounded-3xl backdrop-blur-lg border border-white/20 shadow-2xl">
          <div className="p-6 h-full flex items-center justify-center">
            <div className="flex items-center space-x-3 text-white">
              <Activity className="h-6 w-6 animate-pulse" />
              <span className="text-lg">Conectando ao sistema...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!systemStatus) {
    return (
      <div className="relative w-full h-96 lg:h-[500px]">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 rounded-3xl backdrop-blur-lg border border-white/20 shadow-2xl">
          <div className="p-6 h-full flex items-center justify-center">
            <div className="flex items-center space-x-3 text-white">
              <AlertTriangle className="h-6 w-6 text-brand-emerald-400" />
              <span className="text-lg">Sistema temporariamente indisponível</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'operational':
      case 'active':
        return 'text-emerald-400 bg-emerald-400';
      case 'warning':
        return 'text-brand-emerald-400 bg-brand-emerald-400';
      case 'critical':
        return 'text-red-400 bg-red-400';
      default:
        return 'text-blue-400 bg-blue-400';
    }
  };

  return (
    <div className="relative w-full h-96 lg:h-[500px]">
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 rounded-3xl backdrop-blur-lg border border-white/20 shadow-2xl">
        <div className="p-6 h-full">
          {/* Dashboard Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-brand-sapphire-500 to-brand-emerald-500 rounded-lg flex items-center justify-center">
                <Server className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-white font-semibold">Sistema Multiagente</div>
                <div className="text-xs text-gray-400">Live Production Status</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full animate-pulse ${getStatusColor(systemStatus.system.status).split(' ')[1]}`}></div>
              <div className="text-xs text-gray-300">
                {lastUpdate && `Atualizado ${lastUpdate.toLocaleTimeString()}`}
              </div>
            </div>
          </div>
          
          {/* Live Metrics Grid */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* System Performance */}
            <motion.div 
              className="bg-emerald-500/15 rounded-xl p-4 border border-emerald-500/25"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="text-emerald-300 text-sm font-medium">Throughput</div>
                <Zap className="h-4 w-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-white">{systemStatus.system.throughput}</div>
              <div className="text-xs text-emerald-300">req/min</div>
            </motion.div>

            <motion.div 
              className="bg-blue-500/15 rounded-xl p-4 border border-blue-500/25"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="text-blue-300 text-sm font-medium">Latência</div>
                <Activity className="h-4 w-4 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-white">{systemStatus.system.latency}ms</div>
              <div className="text-xs text-blue-300">avg response</div>
            </motion.div>
          </div>

          {/* Agents Status */}
          <div className="bg-slate-500/15 rounded-xl p-4 border border-slate-500/25 mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-slate-300 text-sm font-medium">Agentes Ativos</div>
              <Users className="h-4 w-4 text-slate-400" />
            </div>
            <div className="flex items-center space-x-4">
              <div>
                <div className="text-xl font-bold text-white">{systemStatus.agents.active}</div>
                <div className="text-xs text-slate-300">de {systemStatus.agents.total} disponíveis</div>
              </div>
              <div className="flex-1">
                <div className="bg-slate-600/30 rounded-full h-2">
                  <motion.div 
                    className="bg-gradient-to-r from-brand-sapphire-500 to-brand-emerald-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(systemStatus.agents.active / systemStatus.agents.total) * 100}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* LEANN & System Health */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-purple-500/15 rounded-xl p-3 border border-purple-500/25">
              <div className="flex items-center space-x-2 mb-1">
                <Brain className="h-4 w-4 text-purple-400" />
                <div className="text-purple-300 text-sm font-medium">LEANN</div>
              </div>
              <div className="text-lg font-bold text-white">{systemStatus.leann.indexed_documents.toLocaleString()}</div>
              <div className="text-xs text-purple-300">docs indexados</div>
            </div>

            <div className="bg-emerald-500/15 rounded-xl p-3 border border-emerald-500/25">
              <div className="flex items-center space-x-2 mb-1">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                <div className="text-emerald-300 text-sm font-medium">Uptime</div>
              </div>
              <div className="text-lg font-bold text-white">{systemStatus.system.uptime.toFixed(2)}%</div>
              <div className="text-xs text-emerald-300">disponibilidade</div>
            </div>
          </div>

          {/* Live indicator */}
          <div className="absolute top-2 right-2">
            <div className="flex items-center space-x-1 text-xs text-emerald-400">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span>LIVE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveSystemStatusDashboard;