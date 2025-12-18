"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Brain,
  Activity,
  Server,
  Zap,
  Box,
  CheckCircle,
  AlertTriangle,
  Cpu
} from 'lucide-react';

interface SystemStatus {
  timestamp: string;
  system: {
    status: string;
    throughput: number;
    latency: number;
    uptime: number;
  };
  infrastructure: {
    cpu_usage: number;
    memory_usage: number;
    containers_active: number;
    total_containers: number;
  };
  security: {
    ssl_status: string;
    firewall_active: boolean;
    threats_blocked: number;
  };
}

const LiveSystemStatusDashboard: React.FC = () => {
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // Mock data generator for visual demonstration
  useEffect(() => {
    const fetchData = () => {
      // Simulate live metrics
      const mockData: SystemStatus = {
        timestamp: new Date().toISOString(),
        system: {
          status: 'operational',
          throughput: Math.floor(Math.random() * (1200 - 800) + 800),
          latency: Math.floor(Math.random() * (45 - 25) + 25),
          uptime: 99.99
        },
        infrastructure: {
          cpu_usage: Math.floor(Math.random() * (45 - 15) + 15),
          memory_usage: 32, // Percentage
          containers_active: 12,
          total_containers: 12
        },
        security: {
          ssl_status: 'valid',
          firewall_active: true,
          threats_blocked: 1420
        }
      };

      setSystemStatus(mockData);
      setLastUpdate(new Date());
      setIsLoading(false);
    };

    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading || !systemStatus) {
    return (
      <div className="relative w-full h-96 lg:h-[500px]">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 rounded-3xl backdrop-blur-lg border border-white/20 shadow-2xl flex items-center justify-center">
          <div className="flex items-center space-x-3 text-white">
            <Activity className="h-6 w-6 animate-pulse" />
            <span className="text-lg">Conectando à infraestrutura...</span>
          </div>
        </div>
      </div>
    );
  }

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
                <div className="text-white font-semibold">Infraestrutura Privada</div>
                <div className="text-xs text-gray-400">Monitoramento em Tempo Real</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <div className="text-xs text-emerald-400 font-medium">ONLINE</div>
            </div>
          </div>

          {/* Live Metrics Grid */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* CPU Usage */}
            <motion.div
              className="bg-brand-sapphire-900/40 rounded-xl p-4 border border-brand-sapphire-500/30"
              animate={{ borderColor: ['rgba(59, 130, 246, 0.3)', 'rgba(59, 130, 246, 0.6)', 'rgba(59, 130, 246, 0.3)'] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="text-blue-300 text-sm font-medium">CPU Load</div>
                <Cpu className="h-4 w-4 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-white">{systemStatus.infrastructure.cpu_usage}%</div>
              <div className="text-xs text-blue-300">4 vCores Active</div>
            </motion.div>

            {/* Latency */}
            <motion.div
              className="bg-emerald-900/40 rounded-xl p-4 border border-emerald-500/30"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="text-emerald-300 text-sm font-medium">Latência API</div>
                <Zap className="h-4 w-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-white">{systemStatus.system.latency}ms</div>
              <div className="text-xs text-emerald-300">p99 response</div>
            </motion.div>
          </div>

          {/* Docker Status */}
          <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-600/30 mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-slate-300 text-sm font-medium">Containers Docker</div>
              <Box className="h-4 w-4 text-slate-400" />
            </div>
            <div className="flex items-center space-x-4">
              <div>
                <div className="text-xl font-bold text-white max-w-[60px]">{systemStatus.infrastructure.containers_active}</div>
                <div className="text-xs text-slate-400">Serviços</div>
              </div>
              <div className="flex-1">
                <div className="bg-slate-700/50 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className="bg-gradient-to-r from-blue-500 to-emerald-500 h-full rounded-full"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Security & Throughput */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-indigo-900/40 rounded-xl p-3 border border-indigo-500/25">
              <div className="flex items-center space-x-2 mb-1">
                <Shield className="h-4 w-4 text-indigo-400" />
                <div className="text-indigo-300 text-sm font-medium">Security</div>
              </div>
              <div className="text-lg font-bold text-white">Ativo</div>
              <div className="text-xs text-indigo-300">Firewall + SSL</div>
            </div>

            <div className="bg-teal-900/40 rounded-xl p-3 border border-teal-500/25">
              <div className="flex items-center space-x-2 mb-1">
                <Activity className="h-4 w-4 text-teal-400" />
                <div className="text-teal-300 text-sm font-medium">Requests</div>
              </div>
              <div className="text-lg font-bold text-white">{systemStatus.system.throughput}</div>
              <div className="text-xs text-teal-300">req/min</div>
            </div>
          </div>

          {/* System Info Footer */}
          <div className="absolute bottom-6 right-6 text-right">
            <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">System Health</div>
            <div className="flex items-center justify-end space-x-1 text-emerald-400/80 text-xs">
              <CheckCircle className="h-3 w-3" />
              <span>All Systems Operational</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveSystemStatusDashboard;