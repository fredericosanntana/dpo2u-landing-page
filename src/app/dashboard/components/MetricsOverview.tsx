'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Activity,
  TrendingUp,
  TrendingDown,
  Users,
  Zap,
  Shield,
  Clock,
  AlertTriangle,
  CheckCircle,
  Server,
  Database,
  Cpu,
  HardDrive
} from 'lucide-react';
import type { SystemMetrics } from '@/hooks/useDashboardData';

interface MetricsOverviewProps {
  metrics: SystemMetrics;
  loading?: boolean;
}

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'slate';
  progress?: number;
  badge?: {
    text: string;
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
  };
}

const colorClasses = {
  blue: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    icon: 'text-blue-500',
    progress: 'bg-blue-500'
  },
  green: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    icon: 'text-emerald-500',
    progress: 'bg-emerald-500'
  },
  purple: {
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    icon: 'text-purple-500',
    progress: 'bg-purple-500'
  },
  orange: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    icon: 'text-emerald-500',
    progress: 'bg-emerald-500'
  },
  red: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    icon: 'text-red-500',
    progress: 'bg-red-500'
  },
  slate: {
    bg: 'bg-slate-500/10',
    border: 'border-slate-500/20',
    icon: 'text-slate-400',
    progress: 'bg-slate-500'
  }
};

function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  color,
  progress,
  badge
}: MetricCardProps) {
  const classes = colorClasses[color];

  return (
    <Card className={`${classes.bg} ${classes.border} border backdrop-blur-sm hover:bg-opacity-80 transition-all duration-300 group`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-slate-300">{title}</CardTitle>
          <div className={`p-2 rounded-lg ${classes.bg} group-hover:scale-110 transition-transform duration-200`}>
            <Icon className={`h-4 w-4 ${classes.icon}`} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <div className="text-2xl font-bold text-white mb-1">{value}</div>
            {subtitle && (
              <p className="text-xs text-slate-400">{subtitle}</p>
            )}
          </div>

          {progress !== undefined && (
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Utilização</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className={`h-2 ${classes.progress}`} />
            </div>
          )}

          <div className="flex items-center justify-between">
            {badge && (
              <Badge variant={badge.variant} className="text-xs">
                {badge.text}
              </Badge>
            )}

            {trend && trendValue && (
              <div className={`flex items-center space-x-1 text-xs ${trend === 'up' ? 'text-emerald-400' :
                  trend === 'down' ? 'text-red-400' : 'text-slate-400'
                }`}>
                {trend === 'up' ? (
                  <TrendingUp className="h-3 w-3" />
                ) : trend === 'down' ? (
                  <TrendingDown className="h-3 w-3" />
                ) : null}
                <span>{trendValue}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MetricCardSkeleton() {
  return (
    <Card className="bg-slate-800/50 border-slate-700/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-20 bg-slate-700" />
          <Skeleton className="h-8 w-8 rounded-lg bg-slate-700" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <Skeleton className="h-6 w-16 bg-slate-700 mb-1" />
            <Skeleton className="h-3 w-24 bg-slate-700" />
          </div>
          <Skeleton className="h-2 w-full bg-slate-700 rounded-full" />
          <div className="flex justify-between">
            <Skeleton className="h-4 w-12 bg-slate-700 rounded" />
            <Skeleton className="h-4 w-10 bg-slate-700 rounded" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function getHealthColor(status: string): 'green' | 'orange' | 'red' | 'slate' {
  switch (status) {
    case 'excellent': return 'green';
    case 'good': return 'green';
    case 'fair': return 'orange';
    case 'poor': return 'red';
    default: return 'slate';
  }
}

function getHealthBadge(status: string) {
  switch (status) {
    case 'excellent':
      return { text: 'Excelente', variant: 'default' as const };
    case 'good':
      return { text: 'Bom', variant: 'secondary' as const };
    case 'fair':
      return { text: 'Regular', variant: 'outline' as const };
    case 'poor':
      return { text: 'Crítico', variant: 'destructive' as const };
    default:
      return { text: 'Desconhecido', variant: 'outline' as const };
  }
}

export default function MetricsOverview({ metrics, loading }: MetricsOverviewProps) {
  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Skeleton className="h-5 w-5 bg-slate-700" />
            <Skeleton className="h-6 w-32 bg-slate-700" />
          </div>
          <Skeleton className="h-4 w-64 bg-slate-700 mb-6" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <MetricCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center space-x-2 mb-2">
          <Activity className="h-5 w-5 text-purple-400" />
          <h2 className="text-xl font-semibold text-white">Visão Geral do Sistema</h2>
        </div>
        <p className="text-slate-400">
          Métricas em tempo real dos componentes principais do sistema multiagente
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* System Health */}
        <MetricCard
          title="Status do Sistema"
          value={metrics.systemHealth.status}
          subtitle={`Uptime: ${metrics.systemHealth.uptime}`}
          icon={metrics.systemHealth.status === 'excellent' ? CheckCircle :
            metrics.systemHealth.status === 'poor' ? AlertTriangle : Activity}
          color={getHealthColor(metrics.systemHealth.status)}
          badge={getHealthBadge(metrics.systemHealth.status)}
        />

        {/* Active Agents */}
        <MetricCard
          title="Agentes Ativos"
          value={`${metrics.agentsStatus.active}/${metrics.agentsStatus.total}`}
          subtitle={`${metrics.agentsStatus.busy} ocupados`}
          icon={Users}
          color="blue"
          progress={Math.round((metrics.agentsStatus.active / metrics.agentsStatus.total) * 100)}
          trend="up"
          trendValue={`+${metrics.agentsStatus.active - metrics.agentsStatus.inactive}`}
        />

        {/* CPU Usage */}
        <MetricCard
          title="CPU"
          value={`${metrics.resources.cpu}%`}
          subtitle="Utilização média"
          icon={Cpu}
          color={metrics.resources.cpu > 80 ? 'red' : metrics.resources.cpu > 60 ? 'orange' : 'green'}
          progress={metrics.resources.cpu}
          trend={metrics.resources.cpu > 70 ? 'up' : 'stable'}
          trendValue={metrics.resources.cpu > 70 ? 'Alto' : 'Normal'}
        />

        {/* Memory Usage */}
        <MetricCard
          title="Memória"
          value={`${metrics.resources.memory}%`}
          subtitle={`${metrics.resources.memoryUsed}GB / ${metrics.resources.memoryTotal}GB`}
          icon={HardDrive}
          color={metrics.resources.memory > 80 ? 'red' : metrics.resources.memory > 60 ? 'orange' : 'green'}
          progress={metrics.resources.memory}
        />

        {/* Tasks Completed Today */}
        <MetricCard
          title="Tarefas Concluídas"
          value={metrics.performance.tasksCompletedToday.toLocaleString()}
          subtitle="Hoje"
          icon={CheckCircle}
          color="green"
          trend="up"
          trendValue="+23%"
        />

        {/* Average Response Time */}
        <MetricCard
          title="Tempo de Resposta"
          value={`${metrics.performance.avgResponseTime}ms`}
          subtitle="Média global"
          icon={Clock}
          color={metrics.performance.avgResponseTime > 1000 ? 'red' :
            metrics.performance.avgResponseTime > 500 ? 'orange' : 'green'}
          trend={metrics.performance.avgResponseTime < 500 ? 'down' : 'up'}
          trendValue={metrics.performance.avgResponseTime < 500 ? 'Rápido' : 'Lento'}
        />

        {/* Success Rate */}
        <MetricCard
          title="Taxa de Sucesso"
          value={`${metrics.performance.successRate}%`}
          subtitle="Últimas 24h"
          icon={TrendingUp}
          color={metrics.performance.successRate > 90 ? 'green' :
            metrics.performance.successRate > 75 ? 'orange' : 'red'}
          progress={metrics.performance.successRate}
          badge={metrics.performance.successRate > 90 ?
            { text: 'Excelente', variant: 'default' } :
            metrics.performance.successRate > 75 ?
              { text: 'Bom', variant: 'secondary' } :
              { text: 'Precisa Atenção', variant: 'destructive' }}
        />

        {/* Error Rate */}
        <MetricCard
          title="Taxa de Erro"
          value={`${metrics.performance.errorRate}%`}
          subtitle="Últimas 24h"
          icon={AlertTriangle}
          color={metrics.performance.errorRate < 5 ? 'green' :
            metrics.performance.errorRate < 15 ? 'orange' : 'red'}
          trend={metrics.performance.errorRate < 10 ? 'down' : 'up'}
          trendValue={metrics.performance.errorRate < 10 ? 'Baixa' : 'Alta'}
          badge={metrics.performance.errorRate < 5 ?
            { text: 'Baixa', variant: 'default' } :
            { text: 'Atenção', variant: 'destructive' }}
        />
      </div>

      {/* Quick Actions */}
      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Zap className="h-5 w-5 text-yellow-400" />
            <span>Status dos Serviços</span>
          </CardTitle>
          <CardDescription className="text-slate-400">
            Monitoramento dos componentes críticos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-sm text-slate-300">API Gateway</span>
              <Badge variant="outline" className="text-xs text-emerald-400 border-emerald-500/30">
                Online
              </Badge>
            </div>

            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
              <span className="text-sm text-slate-300">LEANN Service</span>
              <Badge variant="outline" className="text-xs text-amber-400 border-amber-500/30">
                Degraded
              </Badge>
            </div>

            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-sm text-slate-300">Task Master</span>
              <Badge variant="outline" className="text-xs text-emerald-400 border-emerald-500/30">
                Online
              </Badge>
            </div>

            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-sm text-slate-300">Auto-Healing</span>
              <Badge variant="outline" className="text-xs text-emerald-400 border-emerald-500/30">
                Active
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}