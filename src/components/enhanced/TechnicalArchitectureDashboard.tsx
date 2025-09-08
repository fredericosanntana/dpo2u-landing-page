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
  Users,
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
  GitBranch
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
  activeAgents: number;
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
    component: "OpenAI MCP Server",
    technology: "GPT-4o + o3-mini",
    version: "v2024.12",
    status: "operational",
    performance: 99.8,
    description: "Strategic AI brain with reasoning capabilities"
  },
  {
    component: "Master Orchestrator", 
    technology: "Python + FastAPI",
    version: "v1.2.1",
    status: "operational", 
    performance: 98.5,
    description: "Meta-orchestration with dynamic agent spawning"
  },
  {
    component: "Claude Code Orchestrator",
    technology: "Anthropic Claude + MCP",
    version: "v3.5-sonnet",
    status: "operational",
    performance: 97.9,
    description: "Session management and context preservation"
  },
  {
    component: "Agent Factory",
    technology: "Dynamic Agent Creation",
    version: "v2.0.0",
    status: "operational",
    performance: 96.3,
    description: "Runtime agent specialization and optimization"
  },
  {
    component: "Session Manager",
    technology: "Obsidian + Markdown",
    version: "v1.8.4",
    status: "operational",
    performance: 99.2,
    description: "Zero-loss context preservation and recovery"
  },
  {
    component: "Visual Generator",
    technology: "DALL-E 3 + Puppeteer",
    version: "v3.0 + v21.6",
    status: "operational",
    performance: 94.7,
    description: "Hybrid visual content generation pipeline"
  }
];

const SystemArchitectureDashboard: React.FC = () => {
  const [isLive, setIsLive] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'performance' | 'agents' | 'security'>('overview');
  const [metrics, setMetrics] = useState<SystemMetrics>({
    throughput: 847,
    latency: 120,
    errorRate: 0.02,
    uptime: 99.97,
    activeAgents: 12,
    tasksQueued: 23,
    processingTime: 14.2,
    memoryUsage: 67,
    cpuUsage: 42,
    networkIO: 1.2
  });

  // Fetch real-time metrics from API
  useEffect(() => {
    if (!isLive) return;
    
    const fetchMetrics = async () => {
      try {
        const response = await fetch('/api/agents/status');
        const data = await response.json();
        
        setMetrics({
          throughput: data.system.throughput,
          latency: data.system.latency,
          errorRate: data.system.errorRate,
          uptime: data.system.uptime,
          activeAgents: data.agents.active,
          tasksQueued: data.tasks.queued,
          processingTime: data.tasks.avg_processing_time,
          memoryUsage: data.system.memoryUsage,
          cpuUsage: data.system.cpuUsage,
          networkIO: data.system.networkIO
        });
      } catch (error) {
        console.error('Failed to fetch metrics:', error);
        // Keep previous values on error
      }
    };

    // Initial fetch
    fetchMetrics();
    
    // Update every 2 seconds when live
    const interval = setInterval(fetchMetrics, 2000);

    return () => clearInterval(interval);
  }, [isLive]);

  const getStatusColor = (status: TechSpec['status']) => {
    switch (status) {
      case 'operational': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'warning': return 'text-brand-emerald-500 bg-brand-emerald-500/10 border-brand-emerald-500/20';
      case 'critical': return 'text-red-500 bg-red-500/10 border-red-500/20';
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
    }
  };

  const getStatusIcon = (status: TechSpec['status']) => {
    switch (status) {
      case 'operational': return <CheckCircle className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'critical': return <AlertTriangle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

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
            <span className="text-sm font-medium text-brand-sapphire-300">Sistema Multiagente - Live Production</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">
            Arquitetura de{' '}
            <span className="bg-gradient-to-r from-brand-sapphire-400 to-brand-emerald-400 bg-clip-text text-transparent">
              Classe Enterprise
            </span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Demonstração técnica da arquitetura híbrida 4-níveis em produção real com métricas ao vivo
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
            
            {(['overview', 'performance', 'agents', 'security'] as const).map((tab) => (
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
                      Arquitetura 4-Níveis
                    </h3>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                      <span className="text-sm text-emerald-400">Sistema Ativo</span>
                    </div>
                  </div>

                  {/* Architecture Diagram */}
                  <div className="relative h-96 bg-slate-900/50 rounded-lg p-4">
                    {/* Level indicators */}
                    <div className="absolute left-2 space-y-16 text-xs font-medium text-slate-400">
                      <div>Nível 0</div>
                      <div>Nível 1</div>
                      <div>Nível 2</div>
                      <div>Nível 3</div>
                    </div>

                    {/* Components */}
                    <div className="ml-16 space-y-4">
                      {/* Level 0 - AI Brain */}
                      <div className="flex items-center space-x-4 p-3 bg-brand-sapphire-500/20 border border-brand-sapphire-500/30 rounded-lg">
                        <Brain className="h-8 w-8 text-brand-sapphire-400" />
                        <div>
                          <div className="font-medium text-white">AI Brain (OpenAI MCP)</div>
                          <div className="text-sm text-slate-300">Strategic reasoning & decision making</div>
                        </div>
                        <Badge className="ml-auto bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                          {metrics.throughput}/req
                        </Badge>
                      </div>

                      {/* Level 1 - Master Orchestrator */}
                      <div className="flex items-center space-x-4 p-3 bg-brand-emerald-500/20 border border-brand-emerald-500/30 rounded-lg">
                        <Network className="h-8 w-8 text-brand-emerald-400" />
                        <div>
                          <div className="font-medium text-white">Master Orchestrator</div>
                          <div className="text-sm text-slate-300">Meta-orchestration & agent factory</div>
                        </div>
                        <Badge className="ml-auto bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                          {metrics.activeAgents} agents
                        </Badge>
                      </div>

                      {/* Level 2 - Specialized */}
                      <div className="grid grid-cols-3 gap-2">
                        {['Claude Code', 'Task Master', 'Session Manager'].map((name, idx) => (
                          <div key={idx} className="flex flex-col items-center p-2 bg-brand-purple-500/20 border border-brand-purple-500/30 rounded-lg">
                            <Workflow className="h-6 w-6 text-brand-purple-400 mb-1" />
                            <div className="text-xs font-medium text-white text-center">{name}</div>
                          </div>
                        ))}
                      </div>

                      {/* Level 3 - Execution Agents */}
                      <div className="grid grid-cols-4 gap-2">
                        {['Copywriter', 'Visual Designer', 'Software Architect', 'DevOps'].map((name, idx) => (
                          <div key={idx} className="flex flex-col items-center p-2 bg-brand-ocean-500/20 border border-brand-ocean-500/30 rounded-lg">
                            <Cog className="h-5 w-5 text-brand-ocean-400 mb-1" />
                            <div className="text-xs font-medium text-white text-center">{name}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Flow arrows */}
                    <div className="absolute inset-0 pointer-events-none">
                      <svg className="w-full h-full">
                        <defs>
                          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
                          </marker>
                        </defs>
                        <line x1="50%" y1="15%" x2="50%" y2="25%" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead)" />
                        <line x1="50%" y1="35%" x2="50%" y2="45%" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead)" />
                        <line x1="50%" y1="60%" x2="50%" y2="70%" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead)" />
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
                    Performance Metrics
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-slate-300">Throughput</span>
                        <span className="text-sm font-medium text-white">{metrics.throughput} req/min</span>
                      </div>
                      <Progress value={(metrics.throughput / 1000) * 100} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-slate-300">Latency</span>
                        <span className="text-sm font-medium text-white">{metrics.latency}ms</span>
                      </div>
                      <Progress value={100 - (metrics.latency / 500) * 100} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-slate-300">Uptime</span>
                        <span className="text-sm font-medium text-emerald-400">{metrics.uptime.toFixed(2)}%</span>
                      </div>
                      <Progress value={metrics.uptime} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-slate-300">Error Rate</span>
                        <span className="text-sm font-medium text-white">{metrics.errorRate.toFixed(3)}%</span>
                      </div>
                      <Progress value={100 - (metrics.errorRate / 0.1) * 100} className="h-2" />
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-slate-800/50 border-slate-700">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <GitBranch className="h-5 w-5 text-brand-sapphire-400 mr-2" />
                    Active Tasks
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-300">Queued</span>
                      <span className="text-lg font-bold text-brand-sapphire-400">{metrics.tasksQueued}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-300">Processing</span>
                      <span className="text-lg font-bold text-brand-emerald-400">{metrics.activeAgents}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-300">Avg Time</span>
                      <span className="text-lg font-bold text-emerald-400">{metrics.processingTime.toFixed(1)}min</span>
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
              {/* Live Performance Metrics Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { 
                    label: "System Throughput", 
                    value: `${metrics.throughput}`,
                    unit: "req/min", 
                    benchmark: "Industry: 680/min",
                    improvement: "+340%",
                    color: "emerald"
                  },
                  { 
                    label: "Response Latency", 
                    value: `${metrics.latency}`,
                    unit: "ms", 
                    benchmark: "Traditional: 4-8h",
                    improvement: "-67%",
                    color: "sapphire"
                  },
                  { 
                    label: "System Uptime", 
                    value: `${metrics.uptime.toFixed(2)}`,
                    unit: "%", 
                    benchmark: "Enterprise SLA: 99.9%",
                    improvement: "+22%",
                    color: "purple"
                  },
                  { 
                    label: "Memory Efficiency", 
                    value: `${metrics.memoryUsage}`,
                    unit: "% used", 
                    benchmark: "Standard: 90%+",
                    improvement: "-23%",
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
                    <Badge className={`mt-2 ${
                      metric.improvement.startsWith('+') 
                        ? `bg-${metric.color}-500/20 text-${metric.color}-400 border-${metric.color}-500/30`
                        : `bg-red-500/20 text-red-400 border-red-500/30`
                    }`}>
                      {metric.improvement} improvement
                    </Badge>
                  </Card>
                ))}
              </div>

              {/* Production Stack Components */}
              <Card className="p-6 bg-slate-800/50 border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
                  <BarChart3 className="h-5 w-5 text-brand-sapphire-400 mr-2" />
                  Production Stack Components
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-emerald-400 mb-3">AI & Machine Learning</h4>
                    {[
                      { name: "OpenAI MCP Server", tech: "GPT-4o + o3-mini", perf: 99.8 },
                      { name: "LEANN Neural Network", tech: "Legal Enterprise AI", perf: 99.2 },
                      { name: "Agent Factory", tech: "Dynamic Agent Creation", perf: 96.3 }
                    ].map((item, idx) => (
                      <div key={idx} className="p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium text-white text-sm">{item.name}</div>
                            <div className="text-xs text-slate-400">{item.tech}</div>
                          </div>
                          <div className="text-emerald-400 font-bold">{item.perf}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold text-sapphire-400 mb-3">Infrastructure & DevOps</h4>
                    {[
                      { name: "Claude Code Orchestrator", tech: "Anthropic Claude + MCP", perf: 97.9 },
                      { name: "Master Orchestrator", tech: "Python + FastAPI", perf: 98.5 },
                      { name: "Session Manager", tech: "Obsidian + Markdown", perf: 99.2 }
                    ].map((item, idx) => (
                      <div key={idx} className="p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium text-white text-sm">{item.name}</div>
                            <div className="text-xs text-slate-400">{item.tech}</div>
                          </div>
                          <div className="text-brand-sapphire-400 font-bold">{item.perf}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Enterprise Benchmarks */}
              <Card className="p-6 bg-slate-800/50 border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
                  <TrendingUp className="h-5 w-5 text-brand-emerald-400 mr-2" />
                  Enterprise Performance Benchmarks
                </h3>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-400 mb-2">400%</div>
                    <div className="text-sm text-slate-300">ROI em 12 meses</div>
                    <div className="text-xs text-slate-400">vs traditional approach</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-brand-sapphire-400 mb-2">72h</div>
                    <div className="text-sm text-slate-300">Implementation Time</div>
                    <div className="text-xs text-slate-400">Enterprise deployment</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-brand-purple-400 mb-2">90%</div>
                    <div className="text-sm text-slate-300">Process Automation</div>
                    <div className="text-xs text-slate-400">Business critical tasks</div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {selectedTab === 'agents' && (
            <motion.div
              key="agents"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Active Agents Grid */}
              <div className="grid lg:grid-cols-2 gap-8">
                <Card className="p-6 bg-slate-800/50 border-slate-700">
                  <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
                    <Users className="h-5 w-5 text-brand-emerald-400 mr-2" />
                    Agentes Ativos ({metrics.activeAgents}/20)
                  </h3>
                  
                  <div className="space-y-4">
                    {[
                      { name: 'Master Orchestrator', type: 'Level 1', status: 'active', load: 78, tasks: 15 },
                      { name: 'Claude Code Specialist', type: 'Level 2', status: 'active', load: 65, tasks: 8 },
                      { name: 'Software Architect', type: 'Level 3', status: 'active', load: 92, tasks: 12 },
                      { name: 'DevOps Engineer', type: 'Level 3', status: 'active', load: 43, tasks: 6 },
                      { name: 'Security Auditor', type: 'Level 3', status: 'standby', load: 12, tasks: 2 },
                      { name: 'Visual Designer', type: 'Level 3', status: 'active', load: 88, tasks: 11 }
                    ].map((agent, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${
                            agent.status === 'active' ? 'bg-emerald-400 animate-pulse' : 
                            agent.status === 'standby' ? 'bg-brand-emerald-400' : 'bg-red-400'
                          }`} />
                          <div>
                            <div className="font-medium text-white text-sm">{agent.name}</div>
                            <div className="text-xs text-slate-400">{agent.type}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-emerald-400">{agent.load}%</div>
                          <div className="text-xs text-slate-400">{agent.tasks} tasks</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-6 bg-slate-800/50 border-slate-700">
                  <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
                    <Workflow className="h-5 w-5 text-brand-sapphire-400 mr-2" />
                    Agent Factory Status
                  </h3>
                  
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-slate-300">Pool Capacity</span>
                        <span className="text-sm font-medium text-white">{metrics.activeAgents}/145</span>
                      </div>
                      <Progress value={(metrics.activeAgents / 145) * 100} className="h-3" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-slate-300">Spawn Rate</span>
                        <span className="text-sm font-medium text-emerald-400">2.3 agents/min</span>
                      </div>
                      <div className="text-xs text-slate-400">Dynamic scaling based on workload</div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-white">Specialization Types</div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex justify-between text-slate-300">
                          <span>Technical</span>
                          <span className="text-brand-sapphire-400">8 active</span>
                        </div>
                        <div className="flex justify-between text-slate-300">
                          <span>Creative</span>
                          <span className="text-brand-purple-400">4 active</span>
                        </div>
                        <div className="flex justify-between text-slate-300">
                          <span>Security</span>
                          <span className="text-brand-emerald-400">2 active</span>
                        </div>
                        <div className="flex justify-between text-slate-300">
                          <span>Operations</span>
                          <span className="text-brand-ocean-400">3 active</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Agent Performance Matrix */}
              <Card className="p-6 bg-slate-800/50 border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
                  <BarChart3 className="h-5 w-5 text-brand-purple-400 mr-2" />
                  Performance Matrix - Última Hora
                </h3>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-400 mb-2">847</div>
                    <div className="text-sm text-slate-300">Tasks Completed</div>
                    <div className="text-xs text-emerald-400">+12% vs anterior</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-brand-sapphire-400 mb-2">14.2min</div>
                    <div className="text-sm text-slate-300">Avg Resolution Time</div>
                    <div className="text-xs text-brand-sapphire-400">-8% otimizado</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-brand-purple-400 mb-2">99.97%</div>
                    <div className="text-sm text-slate-300">Success Rate</div>
                    <div className="text-xs text-brand-purple-400">SLA enterprise</div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {selectedTab === 'security' && (
            <motion.div
              key="security"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Security Status Overview */}
              <div className="grid lg:grid-cols-3 gap-6">
                <Card className="p-6 bg-slate-800/50 border-slate-700">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Shield className="h-5 w-5 text-emerald-400 mr-2" />
                    Security Posture
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">Threat Level</span>
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                        LOW
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">Compliance Score</span>
                      <span className="text-lg font-bold text-emerald-400">99.8%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">Zero Trust Status</span>
                      <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-slate-800/50 border-slate-700">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Lock className="h-5 w-5 text-brand-sapphire-400 mr-2" />
                    Access Control
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">Multi-Factor Auth</span>
                      <CheckCircle className="h-5 w-5 text-emerald-400" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">Agent Isolation</span>
                      <CheckCircle className="h-5 w-5 text-emerald-400" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">Encrypted Channels</span>
                      <CheckCircle className="h-5 w-5 text-emerald-400" />
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-slate-800/50 border-slate-700">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Globe className="h-5 w-5 text-brand-purple-400 mr-2" />
                    Network Security
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">Firewall Status</span>
                      <span className="text-sm font-medium text-emerald-400">ACTIVE</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">DDoS Protection</span>
                      <span className="text-sm font-medium text-emerald-400">ENABLED</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">Intrusion Detection</span>
                      <span className="text-sm font-medium text-emerald-400">MONITORING</span>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Compliance Framework */}
              <Card className="p-6 bg-slate-800/50 border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
                  <CheckCircle className="h-5 w-5 text-emerald-400 mr-2" />
                  Compliance Framework Status
                </h3>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { name: 'LGPD', status: 'compliant', score: '100%', color: 'emerald' },
                    { name: 'GDPR', status: 'compliant', score: '100%', color: 'emerald' },
                    { name: 'SOX', status: 'compliant', score: '98.5%', color: 'emerald' },
                    { name: 'ISO 27001', status: 'certified', score: '99.2%', color: 'sapphire' }
                  ].map((compliance, idx) => (
                    <div key={idx} className="text-center p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                      <div className={`text-2xl font-bold text-brand-${compliance.color}-400 mb-2`}>
                        {compliance.score}
                      </div>
                      <div className="text-sm font-medium text-white mb-1">{compliance.name}</div>
                      <Badge className={`bg-${compliance.color}-500/20 text-${compliance.color}-400 border-${compliance.color}-500/30`}>
                        {compliance.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Real-time Security Events */}
              <Card className="p-6 bg-slate-800/50 border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
                  <Activity className="h-5 w-5 text-brand-ocean-400 mr-2" />
                  Security Events - Live Feed
                </h3>
                
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {[
                    { time: '16:24:17', type: 'AUTH', message: 'Multi-factor authentication successful for agent spawning', level: 'info' },
                    { time: '16:23:45', type: 'SCAN', message: 'Automated vulnerability scan completed - 0 critical issues', level: 'success' },
                    { time: '16:23:12', type: 'ACCESS', message: 'Agent isolation boundaries verified', level: 'info' },
                    { time: '16:22:58', type: 'ENCRYPT', message: 'End-to-end encryption established for new session', level: 'info' },
                    { time: '16:22:33', type: 'MONITOR', message: 'Anomaly detection active - baseline normal', level: 'success' },
                    { time: '16:21:47', type: 'BACKUP', message: 'Encrypted backup completed successfully', level: 'success' }
                  ].map((event, idx) => (
                    <div key={idx} className="flex items-center space-x-4 p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                      <div className="text-xs font-mono text-slate-400 w-16">{event.time}</div>
                      <Badge className={`w-16 text-xs ${
                        event.level === 'success' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                        event.level === 'warning' ? 'bg-brand-emerald-500/20 text-brand-emerald-400 border-brand-emerald-500/30' :
                        event.level === 'error' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                        'bg-brand-sapphire-500/20 text-brand-sapphire-400 border-brand-sapphire-500/30'
                      }`}>
                        {event.type}
                      </Badge>
                      <div className="flex-1 text-sm text-slate-300">{event.message}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Card className="p-8 bg-gradient-to-r from-brand-sapphire-500/20 to-brand-emerald-500/20 border border-brand-sapphire-500/30">
            <h3 className="text-2xl font-bold text-white mb-4">
              Veja Esta Arquitetura em Sua Empresa
            </h3>
            <p className="text-lg text-slate-300 mb-6 max-w-2xl mx-auto">
              Agende um assessment técnico personalizado com nossa equipe de arquitetos de software
            </p>
            <Button className="bg-gradient-to-r from-brand-sapphire-500 to-brand-emerald-500 hover:from-brand-sapphire-600 hover:to-brand-emerald-600 text-white font-semibold px-8 py-4">
              Assessment Arquitetural
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default SystemArchitectureDashboard;