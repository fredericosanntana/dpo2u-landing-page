"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield,
  Lock,
  Eye,
  AlertTriangle,
  CheckCircle,
  FileCheck,
  Globe,
  Server,
  Key,
  Fingerprint,
  Database,
  Activity,
  Zap,
  Users,
  BookOpen,
  Download,
  ExternalLink,
  Clock,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface ComplianceFramework {
  name: string;
  status: 'certified' | 'in-progress' | 'planned';
  score: number;
  lastAudit: string;
  description: string;
  requirements: string[];
  certificate?: string;
}

interface SecurityMetric {
  name: string;
  value: string;
  status: 'excellent' | 'good' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  description: string;
  lastUpdated: string;
}

interface SecurityFeature {
  category: string;
  features: {
    name: string;
    description: string;
    implementation: 'native' | 'third-party' | 'hybrid';
    status: 'active' | 'monitoring' | 'planned';
    coverage: number;
  }[];
}

const complianceFrameworks: ComplianceFramework[] = [
  {
    name: "LGPD - Lei Geral de Proteção de Dados",
    status: "certified",
    score: 100,
    lastAudit: "2024-12-15",
    description: "Conformidade total com a legislação brasileira de proteção de dados pessoais",
    requirements: [
      "Consentimento explícito e granular",
      "Direito ao esquecimento implementado",
      "Portabilidade de dados automatizada", 
      "Relatório de impacto à proteção de dados",
      "Encarregado de dados (DPO) designado"
    ],
    certificate: "LGPD-2024-BR-001"
  },
  {
    name: "GDPR - General Data Protection Regulation",
    status: "certified",
    score: 98,
    lastAudit: "2024-11-20", 
    description: "Compliance total com regulamento europeu de proteção de dados",
    requirements: [
      "Privacy by Design implementado",
      "Data Protection Impact Assessment (DPIA)",
      "Breach notification em 72h",
      "Right to be forgotten",
      "Data portability compliance"
    ],
    certificate: "GDPR-2024-EU-047"
  },
  {
    name: "SOC 2 Type II",
    status: "certified", 
    score: 97,
    lastAudit: "2024-10-30",
    description: "Auditoria de controles de segurança, disponibilidade e confidencialidade",
    requirements: [
      "Security controls framework",
      "Availability monitoring",
      "Processing integrity",
      "Confidentiality measures", 
      "Privacy protection controls"
    ],
    certificate: "SOC2-2024-US-128"
  },
  {
    name: "ISO 27001:2022",
    status: "in-progress",
    score: 85,
    lastAudit: "2024-12-01",
    description: "Sistema de gestão de segurança da informação - certificação em andamento",
    requirements: [
      "Information security management system",
      "Risk assessment and treatment", 
      "Security policy framework",
      "Incident response procedures",
      "Business continuity planning"
    ]
  },
  {
    name: "PCI DSS Level 1",
    status: "planned",
    score: 0,
    lastAudit: "",
    description: "Padrão de segurança para processamento de cartões de pagamento - Q2 2025",
    requirements: [
      "Secure network architecture",
      "Cardholder data protection",
      "Vulnerability management",
      "Access control measures",
      "Regular security testing"
    ]
  }
];

const securityMetrics: SecurityMetric[] = [
  {
    name: "System Uptime",
    value: "99.97%",
    status: "excellent", 
    trend: "stable",
    description: "Disponibilidade do sistema nos últimos 12 meses",
    lastUpdated: "2025-01-02 14:30:00"
  },
  {
    name: "Mean Time to Detection",
    value: "2.3 min",
    status: "excellent",
    trend: "down", 
    description: "Tempo médio para detecção de incidentes de segurança",
    lastUpdated: "2025-01-02 14:25:00"
  },
  {
    name: "Data Encryption Coverage", 
    value: "100%",
    status: "excellent",
    trend: "stable",
    description: "Dados criptografados em trânsito e em repouso",
    lastUpdated: "2025-01-02 14:20:00"
  },
  {
    name: "Vulnerability Response",
    value: "4.2 hrs",
    status: "good",
    trend: "down",
    description: "Tempo médio de resposta para vulnerabilidades críticas",
    lastUpdated: "2025-01-02 13:45:00"
  },
  {
    name: "Failed Authentication Rate",
    value: "0.02%", 
    status: "excellent",
    trend: "down",
    description: "Taxa de tentativas de autenticação falhadas",
    lastUpdated: "2025-01-02 14:15:00"
  },
  {
    name: "Compliance Score",
    value: "98.7%",
    status: "excellent",
    trend: "up",
    description: "Pontuação geral de conformidade regulatória",
    lastUpdated: "2025-01-02 12:00:00"
  }
];

const securityFeatures: SecurityFeature[] = [
  {
    category: "Data Protection",
    features: [
      {
        name: "AES-256 Encryption",
        description: "Criptografia militar para dados em repouso e trânsito", 
        implementation: "native",
        status: "active",
        coverage: 100
      },
      {
        name: "Field-Level Encryption",
        description: "Criptografia granular para dados sensíveis específicos",
        implementation: "native", 
        status: "active",
        coverage: 95
      },
      {
        name: "Data Masking",
        description: "Mascaramento automático em ambientes não-produtivos",
        implementation: "native",
        status: "active", 
        coverage: 90
      },
      {
        name: "Tokenization",
        description: "Substituição de dados sensíveis por tokens seguros",
        implementation: "hybrid",
        status: "active",
        coverage: 85
      }
    ]
  },
  {
    category: "Access Control", 
    features: [
      {
        name: "Multi-Factor Authentication",
        description: "Autenticação robusta com múltiplos fatores",
        implementation: "third-party",
        status: "active",
        coverage: 100
      },
      {
        name: "Role-Based Access Control",
        description: "Controle granular baseado em funções e responsabilidades", 
        implementation: "native",
        status: "active",
        coverage: 98
      },
      {
        name: "Privileged Access Management",
        description: "Gestão especializada para contas privilegiadas",
        implementation: "third-party",
        status: "active",
        coverage: 95
      },
      {
        name: "Session Management",
        description: "Controle avançado de sessões com timeout automático",
        implementation: "native",
        status: "active", 
        coverage: 100
      }
    ]
  },
  {
    category: "Monitoring & Detection",
    features: [
      {
        name: "24/7 Security Operations Center",
        description: "Monitoramento contínuo por especialistas em segurança",
        implementation: "hybrid",
        status: "active",
        coverage: 100
      },
      {
        name: "Behavioral Analytics",
        description: "Detecção de anomalias comportamentais usando IA",
        implementation: "native", 
        status: "active",
        coverage: 88
      },
      {
        name: "Real-time Threat Intelligence",
        description: "Inteligência de ameaças atualizada em tempo real",
        implementation: "third-party",
        status: "active",
        coverage: 92
      },
      {
        name: "Automated Incident Response",
        description: "Resposta automatizada para incidentes de segurança",
        implementation: "native",
        status: "active",
        coverage: 85
      }
    ]
  }
];

const SecurityComplianceShowcase: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'frameworks' | 'metrics' | 'features'>('frameworks');
  const [selectedFeatureCategory, setSelectedFeatureCategory] = useState<string>('Data Protection');

  // Simulate real-time metric updates
  const [liveMetrics, setLiveMetrics] = useState(securityMetrics);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveMetrics(prev => prev.map(metric => {
        // Simulate small changes in metrics
        const change = (Math.random() - 0.5) * 0.01; // ±0.5% change
        let newValue = metric.value;
        
        if (metric.name.includes('Time') && metric.value.includes('min')) {
          const current = parseFloat(metric.value);
          newValue = Math.max(0.1, current + change).toFixed(1) + ' min';
        } else if (metric.name.includes('Time') && metric.value.includes('hrs')) {
          const current = parseFloat(metric.value); 
          newValue = Math.max(0.1, current + change * 10).toFixed(1) + ' hrs';
        } else if (metric.value.includes('%')) {
          const current = parseFloat(metric.value);
          newValue = Math.min(100, Math.max(0, current + change)).toFixed(2) + '%';
        }
        
        return {
          ...metric,
          value: newValue,
          lastUpdated: new Date().toISOString().slice(0, 19).replace('T', ' ')
        };
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'certified': 
      case 'excellent':
      case 'active':
        return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'in-progress':
      case 'good': 
      case 'monitoring':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'warning':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'planned':
      case 'critical': 
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'certified':
      case 'excellent':
      case 'active':
        return <CheckCircle className="h-4 w-4" />;
      case 'in-progress':
      case 'good':
      case 'monitoring':
        return <Clock className="h-4 w-4" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />;
      case 'planned':
      case 'critical':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-3 w-3 text-emerald-500" />;
      case 'down': return <TrendingUp className="h-3 w-3 text-red-500 rotate-180" />;
      default: return <BarChart3 className="h-3 w-3 text-slate-500" />;
    }
  };

  return (
    <section className="section-padding bg-slate-900 text-white">
      <div className="container mx-auto container-padding">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-4 py-2 bg-brand-emerald-500/20 border border-brand-emerald-500/30 rounded-full mb-6">
            <Shield className="h-4 w-4 text-brand-emerald-400 mr-2" />
            <span className="text-sm font-medium text-brand-emerald-300">Security & Compliance</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">
            Segurança{' '}
            <span className="bg-gradient-to-r from-brand-emerald-400 to-brand-sapphire-400 bg-clip-text text-transparent">
              Enterprise-Grade
            </span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Conformidade total com LGPD/GDPR, certificações internacionais e monitoramento 24/7 
            por especialistas em segurança
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-2 bg-slate-800 rounded-lg p-2">
            {[
              { key: 'frameworks', label: 'Compliance', icon: FileCheck },
              { key: 'metrics', label: 'Métricas', icon: Activity },
              { key: 'features', label: 'Recursos', icon: Lock }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.key}
                  variant={selectedTab === tab.key ? "default" : "ghost"}
                  onClick={() => setSelectedTab(tab.key as any)}
                  className={`flex items-center gap-2 ${
                    selectedTab === tab.key 
                      ? 'bg-slate-700 text-white' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </Button>
              );
            })}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* Compliance Frameworks */}
          {selectedTab === 'frameworks' && (
            <motion.div
              key="frameworks"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {complianceFrameworks.map((framework, idx) => (
                <Card key={framework.name} className="p-6 bg-slate-800 border-slate-700">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">{framework.name}</h3>
                        <Badge className={`border ${getStatusColor(framework.status)}`}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(framework.status)}
                            {framework.status}
                          </div>
                        </Badge>
                        {framework.certificate && (
                          <Badge variant="outline" className="text-slate-300 border-slate-500">
                            {framework.certificate}
                          </Badge>
                        )}
                      </div>
                      <p className="text-slate-300 mb-4">{framework.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-brand-emerald-400">
                        {framework.score}%
                      </div>
                      {framework.lastAudit && (
                        <div className="text-sm text-slate-500">
                          Last audit: {framework.lastAudit}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-slate-200 mb-3">Key Requirements:</h4>
                      <div className="space-y-2">
                        {framework.requirements.map((req, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-slate-300">{req}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-center">
                      {framework.status === 'certified' && (
                        <div className="text-center p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                          <Shield className="h-12 w-12 text-emerald-400 mx-auto mb-2" />
                          <div className="text-sm font-medium text-emerald-300">Certified</div>
                          <div className="text-xs text-slate-400">Valid through 2025</div>
                        </div>
                      )}
                    </div>
                  </div>

                  {framework.score < 100 && (
                    <div className="mt-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-slate-300">Compliance Progress</span>
                        <span className="text-sm text-slate-300">{framework.score}%</span>
                      </div>
                      <Progress value={framework.score} className="h-2" />
                    </div>
                  )}
                </Card>
              ))}
            </motion.div>
          )}

          {/* Security Metrics */}
          {selectedTab === 'metrics' && (
            <motion.div
              key="metrics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {liveMetrics.map((metric, idx) => (
                <Card key={metric.name} className="p-6 bg-slate-800 border-slate-700">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-white mb-1">{metric.name}</h3>
                      <p className="text-sm text-slate-400">{metric.description}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {getTrendIcon(metric.trend)}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="text-3xl font-bold text-brand-emerald-400 mb-1">
                      {metric.value}
                    </div>
                    <Badge className={`${getStatusColor(metric.status)}`}>
                      {metric.status}
                    </Badge>
                  </div>
                  
                  <div className="text-xs text-slate-500">
                    Updated: {metric.lastUpdated}
                  </div>
                </Card>
              ))}
            </motion.div>
          )}

          {/* Security Features */}
          {selectedTab === 'features' && (
            <motion.div
              key="features"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-center mb-8">
                <div className="flex flex-wrap gap-2">
                  {securityFeatures.map((category) => (
                    <Button
                      key={category.category}
                      variant={selectedFeatureCategory === category.category ? "default" : "outline"}
                      onClick={() => setSelectedFeatureCategory(category.category)}
                      className="text-white"
                    >
                      {category.category}
                    </Button>
                  ))}
                </div>
              </div>

              <AnimatePresence mode="wait">
                {securityFeatures
                  .filter(cat => cat.category === selectedFeatureCategory)
                  .map((category) => (
                    <motion.div
                      key={category.category}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="grid md:grid-cols-2 gap-6"
                    >
                      {category.features.map((feature, idx) => (
                        <Card key={feature.name} className="p-6 bg-slate-800 border-slate-700">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h4 className="font-semibold text-white mb-2">{feature.name}</h4>
                              <p className="text-sm text-slate-300 mb-3">{feature.description}</p>
                            </div>
                            <Badge className={`${getStatusColor(feature.status)}`}>
                              {feature.status}
                            </Badge>
                          </div>

                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-slate-400">Implementation:</span>
                              <span className="text-sm text-white font-medium">
                                {feature.implementation}
                              </span>
                            </div>
                            
                            <div>
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-slate-400">Coverage:</span>
                                <span className="text-sm text-white font-medium">
                                  {feature.coverage}%
                                </span>
                              </div>
                              <Progress value={feature.coverage} className="h-2" />
                            </div>
                          </div>
                        </Card>
                      ))}
                    </motion.div>
                  ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Documentation CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Card className="p-8 bg-gradient-to-r from-brand-emerald-500/20 to-brand-sapphire-500/20 border border-brand-emerald-500/30">
            <h3 className="text-2xl font-bold text-white mb-4">
              Documentação de Segurança Completa
            </h3>
            <p className="text-lg text-slate-300 mb-6 max-w-2xl mx-auto">
              Acesse políticas de segurança, certificados, relatórios de auditoria e 
              documentação técnica detalhada
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-brand-emerald-500 hover:bg-brand-emerald-600 text-white">
                <Download className="h-4 w-4 mr-2" />
                Security Whitepaper
              </Button>
              <Button variant="outline" className="border-slate-500 text-white hover:bg-slate-700">
                <FileCheck className="h-4 w-4 mr-2" />
                Compliance Reports
              </Button>
              <Button variant="outline" className="border-slate-500 text-white hover:bg-slate-700">
                <ExternalLink className="h-4 w-4 mr-2" />
                Audit Certificates
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default SecurityComplianceShowcase;