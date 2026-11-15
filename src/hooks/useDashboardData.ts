'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';

export interface Agent {
  id: string;
  name: string;
  displayName: string;
  description: string;
  status: 'online' | 'offline' | 'busy' | 'maintenance';
  category: 'coordination' | 'architecture' | 'development' | 'security' | 'operations' | 'documentation' | 'research' | 'design' | 'content';
  lastActivity: string;
  tasksCompleted: number;
  avgResponseTime: number;
  successRate: number;
  version: string;
  resources: {
    cpu: number;
    memory: number;
  };
  capabilities: string[];
}

export interface SystemMetrics {
  totalAgents: number;
  activeAgents: number;
  busyAgents: number;
  offlineAgents: number;
  tasksCompleted: number;
  tasksInProgress: number;
  systemHealth: {
    status: 'excellent' | 'good' | 'fair' | 'poor';
    uptime: string;
  };
  resources: {
    cpu: number;
    memory: number;
    memoryUsed: number;
    memoryTotal: number;
  };
  performance: {
    tasksCompletedToday: number;
    avgResponseTime: number;
    successRate: number;
    errorRate: number;
  };
  agentsStatus: {
    active: number;
    inactive: number;
    busy: number;
    total: number;
  };
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  networkLatency: number;
  uptime: string;
  lastUpdate: string;
  errorsLast24h: number;
  warningsLast24h: number;
}

export interface AutoHealingEvent {
  id: string;
  timestamp: string;
  type: 'fix' | 'detection' | 'alert' | 'recovery';
  component: string;
  description: string;
  status: 'resolved' | 'in_progress' | 'failed';
  duration?: number;
}

export interface ChartData {
  timestamp: string;
  cpuUsage: number;
  memoryUsage: number;
  activeAgents: number;
  tasksCompleted: number;
  responseTime: number;
}

export interface DashboardData {
  agents: Agent[];
  metrics: SystemMetrics;
  autoHealingEvents: AutoHealingEvent[];
  chartData: ChartData[];
  alerts: Array<{
    id: string;
    type: 'info' | 'warning' | 'error' | 'success';
    message: string;
    timestamp: string;
  }>;
}

const MOCK_AGENTS: Agent[] = [
  {
    id: 'orchestrator',
    name: 'orchestrator',
    displayName: 'Master Orchestrator',
    description: 'Coordenação híbrida e delegação inteligente de tarefas complexas',
    status: 'online',
    category: 'coordination',
    lastActivity: '2024-01-15T10:30:00Z',
    tasksCompleted: 247,
    avgResponseTime: 1.2,
    successRate: 98.5,
    version: '2.1.0',
    resources: { cpu: 25, memory: 32 },
    capabilities: ['task_delegation', 'workflow_orchestration', 'multi_agent_coordination']
  },
  {
    id: 'software-architect',
    name: 'software-architect',
    displayName: 'Software Architect',
    description: 'Design de sistemas e arquitetura SOLID com padrões enterprise',
    status: 'online',
    category: 'architecture',
    lastActivity: '2024-01-15T10:25:00Z',
    tasksCompleted: 189,
    avgResponseTime: 2.1,
    successRate: 96.8,
    version: '1.8.3',
    resources: { cpu: 18, memory: 28 },
    capabilities: ['system_design', 'pattern_recognition', 'architecture_review']
  },
  {
    id: 'security-auditor',
    name: 'security-auditor',
    displayName: 'Security Auditor',
    description: 'Auditoria LGPD, OWASP e compliance com análise avançada',
    status: 'busy',
    category: 'security',
    lastActivity: '2024-01-15T10:28:00Z',
    tasksCompleted: 156,
    avgResponseTime: 3.4,
    successRate: 99.2,
    version: '2.0.1',
    resources: { cpu: 42, memory: 45 },
    capabilities: ['security_audit', 'compliance_check', 'vulnerability_assessment']
  },
  {
    id: 'fullstack-developer',
    name: 'fullstack-feature-developer',
    displayName: 'Fullstack Developer',
    description: 'Desenvolvimento full-stack com Next.js, TypeScript e integração completa',
    status: 'online',
    category: 'development',
    lastActivity: '2024-01-15T10:32:00Z',
    tasksCompleted: 312,
    avgResponseTime: 1.8,
    successRate: 94.7,
    version: '1.9.2',
    resources: { cpu: 35, memory: 38 },
    capabilities: ['frontend_development', 'backend_apis', 'database_design']
  },
  {
    id: 'devops-engineer',
    name: 'devops-engineer',
    displayName: 'DevOps Engineer',
    description: 'Infraestrutura, deployment automatizado e monitoramento 24/7',
    status: 'online',
    category: 'operations',
    lastActivity: '2024-01-15T10:27:00Z',
    tasksCompleted: 203,
    avgResponseTime: 2.9,
    successRate: 97.3,
    version: '1.7.5',
    resources: { cpu: 22, memory: 26 },
    capabilities: ['ci_cd', 'infrastructure', 'monitoring']
  },
  {
    id: 'auto-healing',
    name: 'auto-healing',
    displayName: 'Auto-Healing System',
    description: 'Detecção e correção automática de erros sem intervenção manual',
    status: 'online',
    category: 'operations',
    lastActivity: '2024-01-15T10:33:00Z',
    tasksCompleted: 89,
    avgResponseTime: 0.8,
    successRate: 99.8,
    version: '1.2.0',
    resources: { cpu: 15, memory: 20 },
    capabilities: ['error_detection', 'auto_fix', 'system_recovery']
  }
];

const MOCK_AUTO_HEALING_EVENTS: AutoHealingEvent[] = [
  {
    id: '1',
    timestamp: '2024-01-15T10:30:00Z',
    type: 'fix',
    component: 'LEANN Service',
    description: 'Reiniciado serviço LEANN após detecção de timeout',
    status: 'resolved',
    duration: 45
  },
  {
    id: '2',
    timestamp: '2024-01-15T09:15:00Z',
    type: 'recovery',
    component: 'API Gateway',
    description: 'Restaurado API Gateway após falha de conexão',
    status: 'resolved',
    duration: 120
  },
  {
    id: '3',
    timestamp: '2024-01-15T08:45:00Z',
    type: 'detection',
    component: 'SSL Certificate',
    description: 'Detectado certificado SSL próximo ao vencimento',
    status: 'in_progress'
  }
];

export function useDashboardData(autoRefresh: boolean = true, interval: number = 30000) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const generateChartData = useCallback((): ChartData[] => {
    const now = new Date();
    const data: ChartData[] = [];
    
    for (let i = 23; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000).toISOString();
      data.push({
        timestamp,
        cpuUsage: Math.floor(Math.random() * 40) + 20,
        memoryUsage: Math.floor(Math.random() * 30) + 25,
        activeAgents: Math.floor(Math.random() * 5) + 28,
        tasksCompleted: Math.floor(Math.random() * 20) + 10,
        responseTime: Math.random() * 2 + 0.5
      });
    }
    
    return data;
  }, []);

  const fetchDashboardData = useCallback(async () => {
    try {
      setError(null);
      
      // Simular chamada de API com delay realístico
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const mockMetrics: SystemMetrics = {
        totalAgents: 38,
        activeAgents: 32,
        busyAgents: 4,
        offlineAgents: 2,
        tasksCompleted: 1847,
        tasksInProgress: 12,
        systemHealth: {
          status: 'excellent',
          uptime: '15 days, 7 hours, 23 minutes'
        },
        resources: {
          cpu: 31,
          memory: 34,
          memoryUsed: 2.8,
          memoryTotal: 8.0
        },
        performance: {
          tasksCompletedToday: 147,
          avgResponseTime: 245,
          successRate: 94,
          errorRate: 3
        },
        agentsStatus: {
          active: 32,
          inactive: 2,
          busy: 4,
          total: 38
        },
        cpuUsage: 31,
        memoryUsage: 34,
        diskUsage: 18,
        networkLatency: 12,
        uptime: '15 days, 7 hours, 23 minutes',
        lastUpdate: new Date().toISOString(),
        errorsLast24h: 3,
        warningsLast24h: 8
      };

      const mockAlerts = [
        {
          id: '1',
          type: 'success' as const,
          message: 'Sistema operando normalmente - 97.8% de saúde',
          timestamp: new Date().toISOString()
        },
        {
          id: '2',
          type: 'info' as const,
          message: 'Auto-healing corrigiu 2 problemas nas últimas 24h',
          timestamp: new Date(Date.now() - 3600000).toISOString()
        }
      ];

      const dashboardData: DashboardData = {
        agents: MOCK_AGENTS,
        metrics: mockMetrics,
        autoHealingEvents: MOCK_AUTO_HEALING_EVENTS,
        chartData: generateChartData(),
        alerts: mockAlerts
      };

      setData(dashboardData);
      setLastUpdate(new Date());
    } catch (err) {
      setError('Falha ao carregar dados do dashboard');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  }, [generateChartData]);

  // Filtros e ordenação
  const filterData = useCallback((
    agents: Agent[],
    statusFilter?: string,
    categoryFilter?: string,
    sortBy: 'name' | 'status' | 'category' | 'performance' = 'name'
  ) => {
    let filtered = [...agents];

    if (statusFilter && statusFilter !== 'all') {
      filtered = filtered.filter(agent => agent.status === statusFilter);
    }

    if (categoryFilter && categoryFilter !== 'all') {
      filtered = filtered.filter(agent => agent.category === categoryFilter);
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.displayName.localeCompare(b.displayName);
        case 'status':
          return a.status.localeCompare(b.status);
        case 'category':
          return a.category.localeCompare(b.category);
        case 'performance':
          return b.successRate - a.successRate;
        default:
          return 0;
      }
    });

    return filtered;
  }, []);

  // Export functions
  const exportToCSV = useCallback(() => {
    if (!data?.agents) return;
    
    const headers = ['Nome', 'Status', 'Categoria', 'Tarefas', 'Taxa de Sucesso', 'Tempo de Resposta'];
    const rows = data.agents.map(agent => [
      agent.displayName,
      agent.status,
      agent.category,
      agent.tasksCompleted.toString(),
      `${agent.successRate}%`,
      `${agent.avgResponseTime}s`
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard-data-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [data?.agents]);

  const exportToJSON = useCallback(() => {
    if (!data) return;
    
    const exportData = {
      ...data,
      exportedAt: new Date().toISOString(),
      version: '1.0.0'
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [data]);

  // Computed values
  const healthStatus = useMemo(() => {
    if (!data?.metrics?.systemHealth) return 'unknown';
    return data.metrics.systemHealth.status;
  }, [data?.metrics?.systemHealth]);

  const agentCategories = useMemo(() => {
    if (!data?.agents) return [];
    const categories = [...new Set(data.agents.map(agent => agent.category))];
    return categories.sort();
  }, [data?.agents]);

  // Effects
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  useEffect(() => {
    if (!autoRefresh) return;

    const intervalId = setInterval(fetchDashboardData, interval);
    return () => clearInterval(intervalId);
  }, [autoRefresh, interval, fetchDashboardData]);

  return {
    data,
    loading,
    error,
    lastUpdate,
    healthStatus,
    agentCategories,
    refetch: fetchDashboardData,
    filterData,
    exportToCSV,
    exportToJSON
  };
}