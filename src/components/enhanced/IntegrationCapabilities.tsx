"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Puzzle,
  Database,
  Cloud,
  Webhook,
  ArrowRight,
  CheckCircle,
  Settings,
  Zap,
  Shield,
  Globe,
  Server,
  Code,
  GitBranch,
  Monitor,
  Lock,
  RefreshCw,
  Layers,
  Network,
  ExternalLink,
  Users,
  Brain,
  Activity
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface IntegrationCapability {
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  status: 'production' | 'beta' | 'development';
  techSpecs: string[];
}

const integrationCapabilities: IntegrationCapability[] = [
  {
    title: "MCP Protocol Integration",
    description: "Model Context Protocol para integração profunda com sistemas de IA e automação empresarial",
    icon: <Brain className="h-8 w-8" />,
    status: "production",
    features: [
      "Claude Code MCP Server ativo",
      "OpenAI MCP integration",
      "Context preservation across sessions",
      "Real-time bi-directional communication"
    ],
    techSpecs: ["WebSocket connections", "JSON-RPC messaging", "SSL/TLS encryption", "Auto-reconnection"]
  },
  {
    title: "RESTful API Architecture",
    description: "APIs robustas para integração com qualquer sistema enterprise existente",
    icon: <Network className="h-8 w-8" />,
    status: "production",
    features: [
      "Agent status endpoints",
      "Real-time metrics API",
      "Task orchestration endpoints",
      "Webhook support"
    ],
    techSpecs: ["REST/JSON", "Rate limiting", "API versioning", "Comprehensive docs"]
  },
  {
    title: "Agent Factory Connectors",
    description: "Sistema de criação dinâmica de conectores especializados conforme necessidade",
    icon: <Settings className="h-8 w-8" />,
    status: "production",
    features: [
      "Dynamic connector generation",
      "Custom protocol adapters",
      "Legacy system compatibility",
      "No-code configuration"
    ],
    techSpecs: ["Plugin architecture", "Runtime loading", "Error handling", "Monitoring"]
  },
  {
    title: "Enterprise Security Layer",
    description: "Camada de segurança enterprise-grade para todas as integrações",
    icon: <Shield className="h-8 w-8" />,
    status: "production",
    features: [
      "Zero Trust architecture",
      "End-to-end encryption",
      "Role-based access control",
      "Compliance audit trails"
    ],
    techSpecs: ["TLS 1.3", "OAuth 2.0", "RBAC", "LDAP/AD integration"]
  }
];

const apiExamples = [
  {
    method: "GET" as const,
    path: "/api/agents/status",
    description: "Real-time agent status and metrics",
    example: "Currently active in production"
  },
  {
    method: "POST" as const,
    path: "/api/tasks/orchestrate",
    description: "Trigger multi-agent task coordination",
    example: "Agent Factory ready"
  },
  {
    method: "GET" as const,
    path: "/api/sessions/active",
    description: "Session management and context",
    example: "Obsidian integration active"
  },
  {
    method: "POST" as const,
    path: "/api/integrations/webhook",
    description: "Webhook endpoint for external systems",
    example: "Webhook infrastructure ready"
  }
];

const IntegrationCapabilities: React.FC = () => {
  const [selectedCapability, setSelectedCapability] = useState(0);
  const [showApiDocs, setShowApiDocs] = useState(false);

  const getStatusColor = (status: IntegrationCapability['status']) => {
    switch (status) {
      case 'production': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'beta': return 'bg-brand-emerald-100 text-brand-emerald-700 border-brand-emerald-200';
      case 'development': return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-green-100 text-green-700';
      case 'POST': return 'bg-blue-100 text-blue-700';
      case 'PUT': return 'bg-brand-sapphire-100 text-brand-sapphire-700';
      case 'DELETE': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
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
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full mb-6">
            <Puzzle className="h-4 w-4 text-blue-600 mr-2" />
            <span className="text-sm font-medium text-blue-600">Arquitetura de Integração</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-text-dark mb-6">
            Conecte com{' '}
            <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
              Qualquer Sistema
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Arquitetura de integração flexível baseada em MCP, APIs REST e Agent Factory
            para conectar com sua infraestrutura existente
          </p>
        </motion.div>

        {/* Integration Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-4 gap-6 mb-16"
        >
          {[
            { label: "Protocols Supported", value: "MCP + REST", desc: "Native integrations" },
            { label: "Setup Time", value: "<30min", desc: "Standard connectors" },
            { label: "API Response", value: "~200ms", desc: "Live production" },
            { label: "Monitoring", value: "24/7", desc: "Real-time status" }
          ].map((stat, idx) => (
            <Card key={idx} className="p-6 text-center border border-slate-200">
              <div className="text-2xl font-bold text-brand-sapphire-600 mb-2">{stat.value}</div>
              <div className="font-medium text-gray-900 mb-1">{stat.label}</div>
              <div className="text-sm text-gray-600">{stat.desc}</div>
            </Card>
          ))}
        </motion.div>

        {/* Integration Capabilities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Capability List */}
            <div className="space-y-4">
              {integrationCapabilities.map((capability, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    className={`p-6 cursor-pointer transition-all hover:shadow-lg ${selectedCapability === index ? 'border-brand-sapphire-300 bg-brand-sapphire-50' : ''
                      }`}
                    onClick={() => setSelectedCapability(index)}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 p-3 bg-brand-sapphire-100 rounded-lg">
                        {React.cloneElement(capability.icon as React.ReactElement, {
                          className: "h-8 w-8 text-brand-sapphire-600"
                        })}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{capability.title}</h3>
                          <Badge className={getStatusColor(capability.status)}>
                            {capability.status}
                          </Badge>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {capability.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Selected Capability Details */}
            <div className="sticky top-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedCapability}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="p-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="p-3 bg-brand-emerald-100 rounded-lg">
                        {integrationCapabilities[selectedCapability]?.icon && React.cloneElement(integrationCapabilities[selectedCapability].icon as React.ReactElement, {
                          className: "h-8 w-8 text-brand-emerald-600"
                        })}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {integrationCapabilities[selectedCapability]?.title}
                        </h3>
                        <Badge className={getStatusColor(integrationCapabilities[selectedCapability]?.status || 'development')}>
                          {integrationCapabilities[selectedCapability]?.status}
                        </Badge>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {integrationCapabilities[selectedCapability]?.description}
                    </p>

                    {/* Features */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Recursos Principais:</h4>
                      <div className="space-y-2">
                        {integrationCapabilities[selectedCapability]?.features?.map((feature, idx) => (
                          <div key={idx} className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Technical Specs */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Especificações Técnicas:</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {integrationCapabilities[selectedCapability]?.techSpecs?.map((spec, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {spec}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* API Documentation Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <Card className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <Code className="h-6 w-6 text-brand-sapphire-600" />
                <h3 className="text-xl font-semibold text-gray-900">APIs & Developer Tools</h3>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowApiDocs(!showApiDocs)}
                className="flex items-center space-x-2"
              >
                <ExternalLink className="h-4 w-4" />
                <span>{showApiDocs ? 'Hide' : 'Show'} API Examples</span>
              </Button>
            </div>

            <p className="text-gray-600 mb-6">
              APIs REST completas com documentação, exemplos de código e endpoints
              ativos para integração com a Stack de IA em produção.
            </p>

            <AnimatePresence>
              {showApiDocs && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  {apiExamples.map((api, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border">
                      <div className="flex items-center space-x-4">
                        <Badge className={getMethodColor(api.method)}>
                          {api.method}
                        </Badge>
                        <div>
                          <code className="text-sm font-mono text-gray-900">{api.path}</code>
                          <p className="text-xs text-gray-600">{api.description}</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {api.example}
                      </Badge>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Card className="p-8 bg-gradient-to-r from-brand-sapphire-50 to-brand-emerald-50 border border-brand-sapphire-200">
            <h3 className="text-2xl font-serif font-bold text-brand-text-dark mb-4">
              Precisa de Integração Personalizada?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Nossa Agent Factory pode criar conectores especializados para sua infraestrutura.
              Desenvolvimento sob medida com nossa arquitetura soberana.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-gradient-to-r from-brand-sapphire-600 to-brand-emerald-600 hover:from-brand-sapphire-700 hover:to-brand-emerald-700 text-white">
                <Settings className="h-5 w-5 mr-2" />
                Discutir Integração Custom
              </Button>
              <Button variant="outline" className="border-brand-sapphire-200 text-brand-sapphire-700 hover:bg-brand-sapphire-50">
                <Code className="h-5 w-5 mr-2" />
                Ver Documentação API
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default IntegrationCapabilities;