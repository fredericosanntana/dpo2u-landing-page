/**
 * System Monitor Component
 * Real-time monitoring with charts and alerts
 */

'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useDashboardData, useDashboardStore, startAutoRefresh, stopAutoRefresh } from '@/lib/dashboard-store';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';
import { 
  Activity, 
  RefreshCw, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Zap,
  Database,
  Users,
  Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Mock historical data for charts
const generateMockHistoricalData = (points: number = 20) => {
  const data = [];
  const now = Date.now();
  
  for (let i = points - 1; i >= 0; i--) {
    const timestamp = now - (i * 30000); // 30 seconds apart
    data.push({
      time: new Date(timestamp).toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      }),
      timestamp,
      cpu: Math.max(10, Math.min(90, 30 + Math.sin(i * 0.3) * 15 + Math.random() * 10)),
      memory: Math.max(15, Math.min(85, 45 + Math.cos(i * 0.2) * 20 + Math.random() * 8)),
      disk: Math.max(10, Math.min(50, 25 + Math.sin(i * 0.1) * 5 + Math.random() * 5)),
      agents_online: Math.floor(20 + Math.random() * 8),
    });
  }
  
  return data;
};

const RealTimeChart: React.FC<{
  title: string;
  data: any[];
  dataKey: string;
  color: string;
  unit?: string;
  max?: number;
}> = ({ title, data, dataKey, color, unit = '%', max = 100 }) => {
  const formatValue = (value: number) => {
    return dataKey === 'agents_online' ? value.toString() : `${value.toFixed(1)}${unit}`;
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-white/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={color} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="time" hide />
              <YAxis hide domain={[0, max]} />
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <Tooltip 
                formatter={(value: number) => [formatValue(value), title]}
                labelStyle={{ color: '#374151' }}
              />
              <Area 
                type="monotone" 
                dataKey={dataKey} 
                stroke={color} 
                strokeWidth={2}
                fill={`url(#gradient-${dataKey})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 text-right">
          <span className="text-xl font-bold" style={{ color }}>
            {data.length > 0 ? formatValue(data[data.length - 1][dataKey]) : '---'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

const AgentStatusPieChart: React.FC<{ agents: any[] }> = ({ agents }) => {
  const statusCounts = {
    online: agents.filter(a => a.status === 'online').length,
    busy: agents.filter(a => a.status === 'busy').length,
    offline: agents.filter(a => a.status === 'offline').length,
  };

  const data = [
    { name: 'Online', value: statusCounts.online, color: '#10B981' },
    { name: 'Executando', value: statusCounts.busy, color: '#F59E0B' },
    { name: 'Offline', value: statusCounts.offline, color: '#6B7280' },
  ];

  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-white/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Status dos Agentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={20}
                outerRadius={50}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center space-x-4 text-xs mt-2">
          {data.map((entry) => (
            <div key={entry.name} className="flex items-center space-x-1">
              <div 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span>{entry.name}: {entry.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const AlertsPanel: React.FC<{ alerts: any[] }> = ({ alerts = [] }) => {
  const prioritizedAlerts = alerts.slice(0, 5); // Show only top 5

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-white/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <span>Alertas do Sistema</span>
          <Badge variant={alerts.length > 0 ? 'destructive' : 'secondary'} className="text-xs">
            {alerts.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {prioritizedAlerts.length === 0 ? (
          <div className="flex items-center justify-center py-4 text-gray-500">
            <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
            <span className="text-sm">Sistema estável</span>
          </div>
        ) : (
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {prioritizedAlerts.map((alert) => (
              <div key={alert.id} className="flex items-start space-x-2 p-2 rounded bg-gray-50">
                {getAlertIcon(alert.type)}
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-800 line-clamp-2">{alert.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDistanceToNow(new Date(alert.timestamp), { 
                      addSuffix: true,
                      locale: ptBR 
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const SystemMonitor: React.FC = () => {
  const { data, loading, error, lastUpdated, fetchData, refreshData } = useDashboardData();
  const autoRefresh = useDashboardStore((state) => state.autoRefresh);
  const refreshInterval = useDashboardStore((state) => state.refreshInterval);
  const setAutoRefresh = useDashboardStore((state) => state.setAutoRefresh);
  const setRefreshInterval = useDashboardStore((state) => state.setRefreshInterval);
  
  const [historicalData, setHistoricalData] = useState(() => generateMockHistoricalData());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Update historical data when new metrics arrive
  useEffect(() => {
    if (data?.metrics) {
      setHistoricalData(prev => {
        const newData = [...prev];
        const now = Date.now();
        
        // Add new data point
        newData.push({
          time: new Date(now).toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
          }),
          timestamp: now,
          cpu: data.metrics.cpu_usage,
          memory: data.metrics.memory_usage,
          disk: data.metrics.disk_usage,
          agents_online: data.agents.filter(a => a.status === 'online').length,
        });
        
        // Keep only last 20 points
        return newData.slice(-20);
      });
    }
  }, [data]);

  // Auto-refresh management
  useEffect(() => {
    if (autoRefresh) {
      startAutoRefresh();
    } else {
      stopAutoRefresh();
    }
    
    return () => stopAutoRefresh();
  }, [autoRefresh]);

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshData();
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleIntervalChange = (value: string) => {
    const interval = parseInt(value);
    setRefreshInterval(interval * 1000); // Convert to milliseconds
  };

  if (error) {
    return (
      <Card className="bg-red-50 border-red-200">
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <XCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <p className="text-red-700 font-medium">Erro ao carregar dados</p>
            <p className="text-red-600 text-sm mt-1">{error}</p>
            <Button onClick={handleRefresh} variant="outline" size="sm" className="mt-4">
              <RefreshCw className="h-4 w-4 mr-2" />
              Tentar Novamente
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-white/20 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Monitor do Sistema</span>
            </CardTitle>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Label htmlFor="auto-refresh" className="text-sm">
                  Auto-refresh
                </Label>
                <Switch
                  id="auto-refresh"
                  checked={autoRefresh}
                  onCheckedChange={setAutoRefresh}
                />
              </div>
              
              <select
                value={refreshInterval / 1000}
                onChange={(e) => handleIntervalChange(e.target.value)}
                className="text-sm border rounded px-2 py-1"
                disabled={!autoRefresh}
              >
                <option value="5">5s</option>
                <option value="10">10s</option>
                <option value="30">30s</option>
                <option value="60">1min</option>
              </select>

              <Button 
                onClick={handleRefresh} 
                disabled={isRefreshing || loading}
                variant="outline"
                size="sm"
              >
                <RefreshCw className={cn(
                  'h-4 w-4 mr-2', 
                  (isRefreshing || loading) && 'animate-spin'
                )} />
                Atualizar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>
                Última atualização: {lastUpdated ? 
                  formatDistanceToNow(lastUpdated, { addSuffix: true, locale: ptBR }) : 
                  'Nunca'
                }
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Database className="h-4 w-4" />
                <span>LEANN: 2,856 docs</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>28 agentes</span>
              </div>
              <div className="flex items-center space-x-1">
                <Globe className="h-4 w-4" />
                <span>API Gateway ativo</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Real-time Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <RealTimeChart
          title="CPU Usage"
          data={historicalData}
          dataKey="cpu"
          color="#EF4444"
          unit="%"
        />
        <RealTimeChart
          title="Memory Usage"
          data={historicalData}
          dataKey="memory"
          color="#F59E0B"
          unit="%"
        />
        <RealTimeChart
          title="Disk Usage"
          data={historicalData}
          dataKey="disk"
          color="#10B981"
          unit="%"
        />
        <RealTimeChart
          title="Agentes Online"
          data={historicalData}
          dataKey="agents_online"
          color="#3B82F6"
          unit=""
          max={30}
        />
      </div>

      {/* Additional Monitors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AgentStatusPieChart agents={data?.agents || []} />
        <AlertsPanel alerts={data?.alerts || []} />
      </div>

      {/* System Health Overview */}
      <Card className="bg-white/80 backdrop-blur-sm border border-white/20">
        <CardHeader>
          <CardTitle className="text-lg">Visão Geral do Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {data?.health?.services ? 
                  Object.values(data.health.services).filter(Boolean).length : 0
                }
                /{data?.health?.services ? Object.keys(data.health.services).length : 0}
              </div>
              <p className="text-sm text-gray-600 mt-1">Serviços Ativos</p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {data?.agents?.filter(a => a.status === 'online').length || 0}
              </div>
              <p className="text-sm text-gray-600 mt-1">Agentes Online</p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {data?.health?.latency_ms || 0}ms
              </div>
              <p className="text-sm text-gray-600 mt-1">Latência API</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemMonitor;