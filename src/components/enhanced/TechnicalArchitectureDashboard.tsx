"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Network,
  Workflow,
  Cog,
  Zap,
  TrendingUp,
  Shield,
  Box,
  ArrowRight,
  Play,
  Pause,
  Activity,
  Database,
  Server,
  Globe,
  Lock,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Layers,
  GitBranch,
  Cpu
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

// Performance metrics data structure
interface SystemMetrics {
  throughput: number;
  latency: number;
  errorRate: number;
  uptime: number;
  activeContainers: number;
  tasksQueued: number;
  processingTime: number;
  memoryUsage: number;
  cpuUsage: number;
  networkIO: number;
}

// Technical specifications
interface TechSpec {
  component: string;
  technology: string;
  version: string;
  status: 'operational' | 'warning' | 'critical';
  performance: number;
  description: string;
}

const techSpecs: TechSpec[] = [
  {
    component: "Traefik Router",
    technology: "Traefik Proxy v3",
    version: "v3.1.2",
    status: "operational",
    performance: 99.9,
    description: "Cloud-native application proxy & load balancer"
  },
  {
    component: "Container Engine",
    technology: "Docker Swarm",
    version: "v27.1.1",
    status: "operational",
    performance: 99.9,
    description: "Orchestration for secure container deployment"
  },
  {
    component: "Git Server",
    technology: "Gitea",
    version: "v1.22.1",
    status: "operational",
    performance: 99.5,
    description: "Self-hosted secure code repository"
  },
  {
    component: "Backend API",
    technology: "FastAPI / Python",
    version: "v0.112",
    status: "operational",
    performance: 98.8,
    description: "High-performance async API gateway"
  },
  {
    component: "Vector Database",
    technology: "Qdrant / PGVector",
    version: "v1.10.1",
    status: "operational",
    performance: 99.2,
    description: "Knowledge base embedding storage"
  },
  {
    component: "Frontend App",
    technology: "Next.js",
    version: "v14.2",
    status: "operational",
    performance: 99.7,
    description: "React-based UI with server-side rendering"
  }
];

const SystemArchitectureDashboard: React.FC = () => {
  const [isLive, setIsLive] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'performance' | 'services' | 'security'>('overview');
  const [metrics, setMetrics] = useState<SystemMetrics>({
    throughput: 1240,
    latency: 45,
    errorRate: 0.001,
    uptime: 99.99,
    activeContainers: 14,
    tasksQueued: 8,
    processingTime: 120, // ms
    memoryUsage: 32,
    cpuUsage: 28,
    networkIO: 1.2
  });

  // Fetch real-time metrics from API
  useEffect(() => {
    if (!isLive) return;

    // Simulate live data changes
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        throughput: Math.floor(prev.throughput + (Math.random() * 100 - 50)),
        latency: Math.floor(35 + Math.random() * 20),
        cpuUsage: Math.floor(20 + Math.random() * 15),
        memoryUsage: Math.floor(30 + Math.random() * 5),
        networkIO: Number((1.0 + Math.random()).toFixed(2))
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [isLive]);

  return (
    <section className="section-padding bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="container mx-auto container-padding">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center px-4 py-2 bg-brand-sapphire-500/20 border border-brand-sapphire-500/30 rounded-full mb-6">
            <Server className="h-4 w-4 text-brand-sapphire-400 mr-2" />
            <span className="text-sm font-medium text-brand-sapphire-300">Infraestrutura Privada - Live Monitor</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">
            Stack
            <span className="bg-gradient-to-r from-brand-sapphire-400 to-brand-emerald-400 bg-clip-text text-transparent">
              {' '}Full-Control{' '}
            </span>
            em Produção
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Visão em tempo real da sua VPS dedicada operando com máxima segurança e performance de serviços containerizados.
          </p>
        </motion.div>

        {/* Controls */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4 bg-slate-800/50 backdrop-blur rounded-lg p-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsLive(!isLive)}
              className={`flex items-center gap-2 ${isLive ? 'text-emerald-400' : 'text-slate-400'}`}
            >
              {isLive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {isLive ? 'Live' : 'Paused'}
            </Button>

            <div className="h-4 w-px bg-slate-600" />

            {(['overview', 'performance', 'services', 'security'] as const).map((tab) => (
              <Button
                key={tab}
                variant="ghost"
                size="sm"
                onClick={() => setSelectedTab(tab)}
                className={`${selectedTab === tab
                  ? 'text-white bg-slate-700'
                  : 'text-slate-400 hover:text-white'
                  }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {selectedTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid lg:grid-cols-3 gap-8"
            >
              {/* System Architecture Visual */}
              <div className="lg:col-span-2">
                <Card className="p-6 bg-slate-800/50 border-slate-700">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-white flex items-center">
                      <Layers className="h-5 w-5 text-brand-sapphire-400 mr-2" />
                      Arquitetura 4-Camadas
                    </h3>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                      <span className="text-sm text-emerald-400">Online</span>
                    </div>
                  </div>

                  {/* Architecture Diagram */}
                  <div className="relative h-96 bg-slate-900/50 rounded-lg p-4">
                    {/* Level indicators */}
                    <div className="absolute left-2 space-y-16 text-xs font-medium text-slate-400">
                      <div>Camada 4</div>
                      <div>Camada 3</div>
                      <div>Camada 2</div>
                      <div>Camada 1</div>
                    </div>

                    {/* Components */}
                    <div className="ml-16 space-y-4">
                      {/* Level 4 - App */}
                      <div className="flex items-center space-x-4 p-3 bg-brand-sapphire-500/20 border border-brand-sapphire-500/30 rounded-lg">
                        <Globe className="h-8 w-8 text-brand-sapphire-400" />
                        <div>
                          <div className="font-medium text-white">Application Layer</div>
                          <div className="text-sm text-slate-300">Next.js UI & User Interfaces</div>
                        </div>
                        <Badge className="ml-auto bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                          {metrics.throughput} req/min
                        </Badge>
                      </div>

                      {/* Level 3 - Routing */}
                      <div className="flex items-center space-x-4 p-3 bg-brand-emerald-500/20 border border-brand-emerald-500/30 rounded-lg">
                        <Network className="h-8 w-8 text-brand-emerald-400" />
                        <div>
                          <div className="font-medium text-white">Routing & Security</div>
                          <div className="text-sm text-slate-300">Traefik + SSL + Firewall</div>
                        </div>
                        <Badge className="ml-auto bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                          {metrics.latency} ms
                        </Badge>
                      </div>

                      {/* Level 2 - Docker */}
                      <div className="grid grid-cols-3 gap-2">
                        {['Services', 'Database', 'Cache'].map((name, idx) => (
                          <div key={idx} className="flex flex-col items-center p-2 bg-brand-purple-500/20 border border-brand-purple-500/30 rounded-lg">
                            <Box className="h-6 w-6 text-brand-purple-400 mb-1" />
                            <div className="text-xs font-medium text-white text-center">{name}</div>
                          </div>
                        ))}
                      </div>

                      {/* Level 1 - Infrastructure */}
                      <div className="grid grid-cols-4 gap-2">
                        {['VPS Host', 'Disk I/O', 'Memory', 'Network'].map((name, idx) => (
                          <div key={idx} className="flex flex-col items-center p-2 bg-brand-ocean-500/20 border border-brand-ocean-500/30 rounded-lg">
                            <Server className="h-5 w-5 text-brand-ocean-400 mb-1" />
                            <div className="text-xs font-medium text-white text-center">{name}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Flow arrows */}
                    <div className="absolute inset-0 pointer-events-none">
                      <svg className="w-full h-full">
                        <line x1="50%" y1="18%" x2="50%" y2="28%" stroke="#64748b" strokeWidth="2" strokeDasharray="4" />
                        <line x1="50%" y1="40%" x2="50%" y2="50%" stroke="#64748b" strokeWidth="2" strokeDasharray="4" />
                        <line x1="50%" y1="65%" x2="50%" y2="75%" stroke="#64748b" strokeWidth="2" strokeDasharray="4" />
                      </svg>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Live Metrics */}
              <div className="space-y-6">
                <Card className="p-6 bg-slate-800/50 border-slate-700">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Activity className="h-5 w-5 text-emerald-400 mr-2" />
                    VPS Metrics
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-slate-300">CPU Usage</span>
                        <span className="text-sm font-medium text-white">{metrics.cpuUsage}%</span>
                      </div>
                      <Progress value={metrics.cpuUsage} className="h-2" />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-slate-300">Memory (RAM)</span>
                        <span className="text-sm font-medium text-white">{metrics.memoryUsage}%</span>
                      </div>
                      <Progress value={metrics.memoryUsage} className="h-2" />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-slate-300">Disk I/O</span>
                        <span className="text-sm font-medium text-emerald-400">Good</span>
                      </div>
                      <Progress value={20} className="h-2" />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-slate-300">Network Load</span>
                        <span className="text-sm font-medium text-white">{metrics.networkIO} MB/s</span>
                      </div>
                      <Progress value={metrics.networkIO * 10} className="h-2" />
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-slate-800/50 border-slate-700">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Box className="h-5 w-5 text-brand-sapphire-400 mr-2" />
                    Swarm Status
                  </h3>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-300">Services</span>
                      <span className="text-lg font-bold text-brand-sapphire-400">{metrics.activeContainers}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-300">Replicas Running</span>
                      <span className="text-lg font-bold text-brand-emerald-400">14/14</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-300">Manager Status</span>
                      <span className="text-lg font-bold text-emerald-400">Ready</span>
                    </div>
                  </div>
                </Card>
              </div>
            </motion.div>
          )}

          {selectedTab === 'performance' && (
            <motion.div
              key="performance"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    label: "API Throughput",
                    value: `${metrics.throughput}`,
                    unit: "req/min",
                    benchmark: "VPS Std: 800",
                    improvement: "+55%",
                    color: "emerald"
                  },
                  {
                    label: "Internal Latency",
                    value: `${metrics.latency}`,
                    unit: "ms",
                    benchmark: "Cloud: ~80ms",
                    improvement: "-45%",
                    color: "sapphire"
                  },
                  {
                    label: "Uptime",
                    value: `${metrics.uptime.toFixed(2)}`,
                    unit: "%",
                    benchmark: "Hosting: 99.9%",
                    improvement: "+0.07%",
                    color: "purple"
                  },
                  {
                    label: "Memory Footprint",
                    value: `${metrics.memoryUsage}`,
                    unit: "% used",
                    benchmark: "Avg: 60%",
                    improvement: "-46%",
                    color: "emerald"
                  }
                ].map((metric, idx) => (
                  <Card key={idx} className="p-6 bg-slate-800/50 border-slate-700 text-center">
                    <div className={`text-3xl font-bold text-brand-${metric.color}-400 mb-2`}>
                      {metric.value}
                      <span className="text-sm ml-1">{metric.unit}</span>
                    </div>
                    <div className="text-sm font-medium text-white mb-1">{metric.label}</div>
                    <div className="text-xs text-slate-400">{metric.benchmark}</div>
                    <Badge className={`mt-2 bg-${metric.color}-500/20 text-${metric.color}-400 border-${metric.color}-500/30`}>
                      {metric.improvement} improved
                    </Badge>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {selectedTab === 'services' && (
            <motion.div key="services" className="space-y-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card className="p-6 bg-slate-800/50 border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
                  <Box className="h-5 w-5 text-brand-emerald-400 mr-2" />
                  Active Services ({metrics.activeContainers})
                </h3>
                <div className="space-y-4">
                  {[
                    { name: 'traefik_proxy', type: 'Routing', status: 'active', load: 12, mem: '64MB' },
                    { name: 'gitea_web', type: 'DevTools', status: 'active', load: 4, mem: '256MB' },
                    { name: 'postgres_db', type: 'Database', status: 'active', load: 8, mem: '512MB' },
                    { name: 'app_frontend', type: 'Application', status: 'active', load: 2, mem: '128MB' },
                    { name: 'api_backend', type: 'Application', status: 'active', load: 15, mem: '210MB' },
                    { name: 'portainer_agent', type: 'System', status: 'active', load: 1, mem: '32MB' }
                  ].map((agent, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                        <div>
                          <div className="font-medium text-white text-sm">{agent.name}</div>
                          <div className="text-xs text-slate-400">{agent.type}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-emerald-400">{agent.load}% CPU</div>
                        <div className="text-xs text-slate-400">{agent.mem}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {selectedTab === 'security' && (
            <motion.div key="security" className="space-y-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card className="p-6 bg-slate-800/50 border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Shield className="h-5 w-5 text-emerald-400 mr-2" />
                  Security Hardening Status
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">Firewall (UFW)</span>
                    <Badge className="bg-emerald-500/20 text-emerald-400">ACTIVE</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">SSH Root Login</span>
                    <Badge className="bg-emerald-500/20 text-emerald-400">DISABLED</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">Docker Socket</span>
                    <Badge className="bg-emerald-500/20 text-emerald-400">PROTECTED</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">SSL Certificates</span>
                    <Badge className="bg-emerald-500/20 text-emerald-400">AUTO-RENEW</Badge>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default SystemArchitectureDashboard;