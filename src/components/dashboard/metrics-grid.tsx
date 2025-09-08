/**
 * Metrics Grid Component
 * Displays system metrics in a responsive grid layout
 */

'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useSystemMetrics } from '@/lib/dashboard-store';
import { 
  Cpu, 
  MemoryStick, 
  HardDrive, 
  Activity, 
  Clock, 
  Zap,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  progress?: number;
  icon: React.ElementType;
  status?: 'healthy' | 'warning' | 'error';
  trend?: 'up' | 'down' | 'stable';
  description?: string;
  className?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit = '',
  progress,
  icon: Icon,
  status = 'healthy',
  trend = 'stable',
  description,
  className,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4" />;
      case 'error':
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-3 w-3 text-green-500" />;
      case 'down':
        return <TrendingUp className="h-3 w-3 text-red-500 rotate-180" />;
      default:
        return null;
    }
  };

  return (
    <Card className={cn(
      'hover:shadow-lg transition-all duration-300 backdrop-blur-sm',
      'bg-white/80 border border-white/20',
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-700">
          {title}
        </CardTitle>
        <div className="flex items-center space-x-2">
          <Icon className="h-4 w-4 text-gray-500" />
          {getStatusIcon(status)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-baseline space-x-1">
            <div className="text-2xl font-bold text-gray-900">
              {value}
            </div>
            {unit && (
              <div className="text-sm text-gray-500">
                {unit}
              </div>
            )}
          </div>
          {getTrendIcon(trend)}
        </div>
        
        {progress !== undefined && (
          <div className="mt-3">
            <Progress 
              value={progress} 
              className={cn(
                "h-2",
                progress > 80 ? 'text-red-500' :
                progress > 60 ? 'text-yellow-500' :
                'text-green-500'
              )}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0%</span>
              <span>100%</span>
            </div>
          </div>
        )}
        
        {description && (
          <p className="text-xs text-gray-500 mt-2">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

const StatusBadge: React.FC<{ 
  status: 'healthy' | 'degraded' | 'unhealthy';
  services: { leann: boolean; orchestrator: boolean; docker: boolean; };
}> = ({ status, services }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'healthy':
        return { 
          label: 'Sistema Operacional', 
          className: 'bg-green-100 text-green-800 border-green-200' 
        };
      case 'degraded':
        return { 
          label: 'Serviços Degradados', 
          className: 'bg-yellow-100 text-yellow-800 border-yellow-200' 
        };
      case 'unhealthy':
        return { 
          label: 'Sistema Indisponível', 
          className: 'bg-red-100 text-red-800 border-red-200' 
        };
      default:
        return { 
          label: 'Status Desconhecido', 
          className: 'bg-gray-100 text-gray-800 border-gray-200' 
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <div className="space-y-2">
      <Badge variant="outline" className={config.className}>
        {config.label}
      </Badge>
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className={cn(
          'flex items-center space-x-1 p-1 rounded',
          services.leann ? 'text-green-600' : 'text-red-600'
        )}>
          <div className={cn(
            'w-2 h-2 rounded-full',
            services.leann ? 'bg-green-500' : 'bg-red-500'
          )} />
          <span>LEANN</span>
        </div>
        <div className={cn(
          'flex items-center space-x-1 p-1 rounded',
          services.orchestrator ? 'text-green-600' : 'text-red-600'
        )}>
          <div className={cn(
            'w-2 h-2 rounded-full',
            services.orchestrator ? 'bg-green-500' : 'bg-red-500'
          )} />
          <span>Orchestrator</span>
        </div>
        <div className={cn(
          'flex items-center space-x-1 p-1 rounded',
          services.docker ? 'text-green-600' : 'text-red-600'
        )}>
          <div className={cn(
            'w-2 h-2 rounded-full',
            services.docker ? 'bg-green-500' : 'bg-red-500'
          )} />
          <span>Docker</span>
        </div>
      </div>
    </div>
  );
};

export const MetricsGrid: React.FC = () => {
  const { metrics, health, systemStatus } = useSystemMetrics();

  // Format uptime
  const formatUptime = (uptime: number): string => {
    const days = Math.floor(uptime / (1000 * 60 * 60 * 24));
    const hours = Math.floor((uptime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${days}d ${hours}h`;
  };

  // Format load average
  const formatLoadAverage = (loadAvg: number[]): string => {
    return loadAvg.map(load => load.toFixed(1)).join(' / ');
  };

  if (!metrics || !health) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="space-y-0 pb-2">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const cpuStatus = metrics.cpu_usage > 80 ? 'error' : metrics.cpu_usage > 60 ? 'warning' : 'healthy';
  const memoryStatus = metrics.memory_usage > 85 ? 'error' : metrics.memory_usage > 70 ? 'warning' : 'healthy';
  const diskStatus = metrics.disk_usage > 90 ? 'error' : metrics.disk_usage > 75 ? 'warning' : 'healthy';

  return (
    <div className="space-y-6">
      {/* System Status Overview */}
      <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-white/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Status do Sistema DPO2U</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <StatusBadge status={systemStatus} services={health.services} />
        </CardContent>
      </Card>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="CPU Usage"
          value={metrics.cpu_usage.toFixed(1)}
          unit="%"
          progress={metrics.cpu_usage}
          icon={Cpu}
          status={cpuStatus}
          trend={metrics.cpu_usage > 50 ? 'up' : 'stable'}
          description="Utilização do processador"
        />

        <MetricCard
          title="Memory Usage"
          value={metrics.memory_usage.toFixed(1)}
          unit="%"
          progress={metrics.memory_usage}
          icon={MemoryStick}
          status={memoryStatus}
          trend={metrics.memory_usage > 60 ? 'up' : 'stable'}
          description="Utilização da memória RAM"
        />

        <MetricCard
          title="Disk Usage"
          value={metrics.disk_usage.toFixed(1)}
          unit="%"
          progress={metrics.disk_usage}
          icon={HardDrive}
          status={diskStatus}
          trend="stable"
          description="Espaço em disco utilizado"
        />

        <MetricCard
          title="Load Average"
          value={formatLoadAverage(metrics.load_average)}
          icon={Zap}
          status="healthy"
          trend="stable"
          description="Carga média do sistema (1m/5m/15m)"
        />

        <MetricCard
          title="System Uptime"
          value={formatUptime(Date.now() - metrics.uptime)}
          icon={Clock}
          status="healthy"
          trend="up"
          description="Tempo de funcionamento"
        />

        <MetricCard
          title="LEANN Documents"
          value="2,856"
          icon={Activity}
          status="healthy"
          trend="up"
          description="Documentos indexados no LEANN"
        />

        <MetricCard
          title="API Latency"
          value={health.latency_ms}
          unit="ms"
          icon={Zap}
          status={health.latency_ms > 100 ? 'warning' : 'healthy'}
          trend={health.latency_ms > 50 ? 'up' : 'stable'}
          description="Latência da API Gateway"
        />

        <MetricCard
          title="Active Agents"
          value="28"
          icon={Activity}
          status="healthy"
          trend="stable"
          description="Agentes registrados no sistema"
        />
      </div>
    </div>
  );
};

export default MetricsGrid;