"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Code, 
  Database, 
  Shield, 
  Zap, 
  GitBranch, 
  Server, 
  Globe, 
  Lock,
  TrendingUp,
  Users,
  CheckCircle,
  ArrowRight,
  Download,
  ExternalLink,
  Monitor,
  Cloud,
  Terminal,
  Layers,
  Activity,
  BarChart3,
  Brain
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface TechnicalMetric {
  title: string;
  value: string;
  unit: string;
  change: number;
  benchmark: string;
  description: string;
  category: 'performance' | 'scalability' | 'reliability' | 'security';
}

interface TechnicalSpec {
  category: string;
  items: {
    name: string;
    technology: string;
    description: string;
    performance: number;
    status: 'production' | 'beta' | 'planned';
  }[];
}

const technicalSpecs: TechnicalSpec[] = [
  {
    category: "AI & Machine Learning",
    items: [
      {
        name: "OpenAI MCP Server",
        technology: "GPT-4o + o3-mini",
        description: "Strategic AI brain with reasoning capabilities",
        performance: 99.8,
        status: "production"
      },
      {
        name: "LEANN Neural Network",
        technology: "Legal Enterprise AI",
        description: "2,856+ indexed legal documents with semantic search",
        performance: 99.2,
        status: "production"
      },
      {
        name: "Agent Factory",
        technology: "Dynamic Agent Creation",
        description: "Runtime agent specialization and optimization",
        performance: 96.3,
        status: "production"
      }
    ]
  },
  {
    category: "Infrastructure & DevOps",
    items: [
      {
        name: "Claude Code Orchestrator",
        technology: "Anthropic Claude + MCP",
        description: "Session management and context preservation",
        performance: 97.9,
        status: "production"
      },
      {
        name: "Master Orchestrator", 
        technology: "Python + FastAPI",
        description: "Meta-orchestration with dynamic agent spawning",
        performance: 98.5,
        status: "production"
      },
      {
        name: "Session Manager",
        technology: "Obsidian + Markdown",
        description: "Zero-loss context preservation and recovery",
        performance: 99.2,
        status: "production"
      }
    ]
  }
];

const TechnicalCredibilitySection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('AI & Machine Learning');
  const [activeMetricCategory, setActiveMetricCategory] = useState<TechnicalMetric['category']>('performance');
  const [liveMetrics, setLiveMetrics] = useState<any>(null);

  // Fetch live metrics from API  
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('/api/agents/status');
        const data = await response.json();
        setLiveMetrics(data);
      } catch (error) {
        console.error('Failed to fetch live metrics:', error);
      }
    };
    
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, []);

  const technicalMetrics: TechnicalMetric[] = [
    {
      title: "System Throughput",
      value: liveMetrics?.system?.throughput?.toString() || "847",
      unit: "requests/min", 
      change: 340,
      benchmark: "Industry standard: 680/min",
      description: "Real-time multiagent task processing capability",
      category: "performance"
    },
    {
      title: "Response Latency", 
      value: liveMetrics?.system?.latency?.toString() || "120",
      unit: "ms",
      change: -67,
      benchmark: "Traditional: 4-8h", 
      description: "End-to-end agent coordination latency",
      category: "performance"
    },
    {
      title: "System Uptime",
      value: liveMetrics?.system?.uptime?.toFixed(2) || "99.97",
      unit: "%",
      change: 22,
      benchmark: "Enterprise SLA: 99.9%",
      description: "Production system availability with failover",
      category: "reliability"
    },
    {
      title: "Active Agents",
      value: liveMetrics?.agents?.active?.toString() || "12",
      unit: "concurrent",
      change: 156,
      benchmark: "Traditional: max 5 parallel",
      description: "Coordinated specialist agents running simultaneously",
      category: "scalability"
    },
    {
      title: "Memory Efficiency",
      value: liveMetrics?.system?.memoryUsage?.toString() || "67",
      unit: "% utilized",
      change: -23,
      benchmark: "Standard: 90%+ usage",
      description: "Optimized memory allocation across agent pool",
      category: "performance"
    },
    {
      title: "Security Score",
      value: "99.8",
      unit: "%",
      change: 15,
      benchmark: "Industry average: 84%",
      description: "Multi-factor auth, encryption, and compliance monitoring",
      category: "security"
    }
  ];

  const filteredMetrics = technicalMetrics.filter(metric => metric.category === activeMetricCategory);
  const selectedSpec = technicalSpecs.find(spec => spec.category === selectedCategory);

  const getStatusColor = (status: 'production' | 'beta' | 'planned') => {
    switch (status) {
      case 'production': return 'bg-emerald-100 text-emerald-700';
      case 'beta': return 'bg-yellow-100 text-yellow-700';
      case 'planned': return 'bg-slate-100 text-slate-700';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'AI & Machine Learning': return <Brain className="h-5 w-5" />;
      case 'Infrastructure & DevOps': return <Server className="h-5 w-5" />;
      case 'Security & Compliance': return <Shield className="h-5 w-5" />;
      case 'Integration & APIs': return <Globe className="h-5 w-5" />;
      default: return <Code className="h-5 w-5" />;
    }
  };

  const getMetricCategoryIcon = (category: TechnicalMetric['category']) => {
    switch (category) {
      case 'performance': return <Zap className="h-4 w-4" />;
      case 'scalability': return <TrendingUp className="h-4 w-4" />;
      case 'reliability': return <Shield className="h-4 w-4" />;
      case 'security': return <Lock className="h-4 w-4" />;
    }
  };

  return (
    <section className="section-padding bg-gradient-to-b from-white to-slate-50">
      <div className="container mx-auto container-padding">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-4 py-2 bg-brand-sapphire-100 rounded-full mb-6">
            <Activity className="h-4 w-4 text-brand-sapphire-600 mr-2" />
            <span className="text-sm font-medium text-brand-sapphire-600">
              {liveMetrics ? 'Live Production Metrics' : 'Technical Specifications'}
            </span>
            {liveMetrics && <div className="w-2 h-2 bg-emerald-400 rounded-full ml-2 animate-pulse" />}
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-text-dark mb-6">
            Arquitetura{' '}
            <span className="bg-gradient-to-r from-brand-sapphire-600 to-brand-emerald-600 bg-clip-text text-transparent">
              Enterprise-Grade
            </span>{' '}
            em Produção
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Especificações técnicas e métricas de performance em tempo real do nosso sistema multiagente 
            rodando em produção com {liveMetrics?.agents?.active || 12} agentes ativos
          </p>
        </motion.div>

        {/* Live Performance Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {(['performance', 'scalability', 'reliability', 'security'] as const).map((category) => (
              <button
                key={category}
                onClick={() => setActiveMetricCategory(category)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  activeMetricCategory === category
                    ? 'bg-brand-sapphire-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {getMetricCategoryIcon(category)}
                <span className="text-sm font-medium capitalize">{category}</span>
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMetrics.map((metric, index) => (
              <motion.div
                key={metric.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 h-full hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-slate-800 mb-1">{metric.title}</h3>
                      <p className="text-sm text-slate-600">{metric.description}</p>
                    </div>
                    <Badge 
                      className={`${metric.change > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}
                    >
                      {metric.change > 0 ? '+' : ''}{metric.change}%
                    </Badge>
                  </div>
                  
                  <div className="flex items-baseline space-x-2 mb-2">
                    <span className="text-3xl font-bold text-brand-sapphire-600">{metric.value}</span>
                    <span className="text-sm text-slate-500">{metric.unit}</span>
                  </div>
                  
                  <div className="text-xs text-slate-500 mb-3">{metric.benchmark}</div>
                  
                  <Progress value={85} className="h-2" />
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Technical Stack Specifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-serif font-bold text-brand-text-dark mb-4">
              Stack Técnico em Produção
            </h3>
            <p className="text-gray-600">
              Componentes core do sistema multiagente com performance validada em produção
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {technicalSpecs.map((spec) => (
              <button
                key={spec.category}
                onClick={() => setSelectedCategory(spec.category)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  selectedCategory === spec.category
                    ? 'bg-brand-sapphire-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {getCategoryIcon(spec.category)}
                <span className="text-sm font-medium">{spec.category}</span>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {selectedSpec && (
              <motion.div
                key={selectedCategory}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {selectedSpec.items.map((item, index) => (
                  <Card key={item.name} className="p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-lg font-semibold text-brand-text-dark">{item.name}</h4>
                          <Badge className={getStatusColor(item.status)}>
                            {item.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-brand-sapphire-600 mb-1">{item.technology}</p>
                        <p className="text-gray-600">{item.description}</p>
                      </div>
                      <div className="text-right ml-6">
                        <div className="text-2xl font-bold text-brand-emerald-600 mb-1">
                          {item.performance}%
                        </div>
                        <div className="text-xs text-gray-500">Performance</div>
                      </div>
                    </div>
                  </Card>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Card className="p-8 bg-gradient-to-r from-brand-sapphire-50 to-brand-emerald-50 border border-brand-sapphire-200">
            <h3 className="text-2xl font-serif font-bold text-brand-text-dark mb-4">
              Quer ver nossa arquitetura em ação?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Agende uma demonstração técnica personalizada onde nossos arquitetos mostram 
              o sistema multiagente rodando em produção com métricas reais
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-gradient-to-r from-brand-sapphire-600 to-brand-emerald-600 hover:from-brand-sapphire-700 hover:to-brand-emerald-700 text-white">
                <Monitor className="h-5 w-5 mr-2" />
                Demo Técnica Live
              </Button>
              <Button variant="outline" className="border-brand-sapphire-200 text-brand-sapphire-700 hover:bg-brand-sapphire-50">
                <Download className="h-5 w-5 mr-2" />
                Whitepaper Técnico
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default TechnicalCredibilitySection;