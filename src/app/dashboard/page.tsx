'use client';

/**
 * DPO2U Dashboard v2.0
 * Modern dashboard with glassmorphism design, advanced metrics, and real-time monitoring
 */

import React, { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import {
  RefreshCw,
  Download,
  Settings,
  Bell,
  TrendingUp,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  Zap,
  Filter,
  Eye,
  EyeOff
} from 'lucide-react';
import { useDashboardData } from '@/hooks/useDashboardData';
import MetricsOverview from './components/MetricsOverview';
import AgentsGrid from './components/AgentsGrid';
import SystemCharts from './components/SystemCharts';
import AutoHealingTimeline from './components/AutoHealingTimeline';

export default function DashboardPage() {
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showAlerts, setShowAlerts] = useState(true);
  
  const {
    data,
    loading,
    error,
    lastUpdate,
    agentCategories,
    refetch,
    filterData,
    exportToCSV,
    exportToJSON
  } = useDashboardData(autoRefresh, 30000);

  // Memoized filtered agents for performance
  const filteredAgents = useMemo(() => {
    if (!data?.agents) return [];
    return filterData(data.agents, 'all', 'all', 'performance');
  }, [data?.agents, filterData]);

  // Handle agent actions
  const handleAgentAction = useCallback((agentId: string, action: 'start' | 'stop' | 'configure') => {
    toast({
      title: `Ação do Agente`,
      description: `${action === 'start' ? 'Iniciando' : action === 'stop' ? 'Pausando' : 'Configurando'} agente ${agentId}...`,
      duration: 3000,
    });
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Sucesso",
        description: `Agente ${agentId} ${action === 'start' ? 'iniciado' : action === 'stop' ? 'pausado' : 'configurado'} com sucesso.`,
        duration: 3000,
      });
    }, 1500);
  }, []);

  // Handle chart export
  const handleChartExport = useCallback((chartType: string) => {
    toast({
      title: "Exportando Gráfico",
      description: `Preparando export do gráfico ${chartType}...`,
      duration: 3000,
    });
  }, []);

  // Handle manual refresh
  const handleRefresh = useCallback(() => {
    toast({
      title: "Atualizando Dashboard",
      description: "Carregando dados mais recentes...",
      duration: 2000,
    });
    refetch();
  }, [refetch]);

  // Get health status styling
  const getHealthStatusStyle = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30';
      case 'good':
        return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'fair':
        return 'text-amber-400 bg-amber-500/20 border-amber-500/30';
      case 'poor':
        return 'text-red-400 bg-red-500/20 border-red-500/30';
      default:
        return 'text-slate-400 bg-slate-500/20 border-slate-500/30';
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Card className="max-w-md bg-slate-800/50 border-slate-700/50">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <AlertCircle className="h-12 w-12 text-red-500" />
              <div className="text-center">
                <h3 className="text-lg font-semibold text-white mb-2">Erro ao Carregar Dashboard</h3>
                <p className="text-slate-400 mb-4">{error}</p>
                <Button onClick={handleRefresh} variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Tentar Novamente
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <span>Command Center</span>
          </h1>
          <p className="text-slate-400 flex items-center space-x-2">
            <span>Sistema Multiagentes Híbrido DPO2U</span>
            <Badge 
              variant="outline" 
              className={`border ${getHealthStatusStyle(data?.metrics?.systemHealth?.status || 'poor')} text-xs`}
            >
              <div className={`w-2 h-2 rounded-full mr-2 ${
                data?.metrics?.systemHealth?.status === 'excellent' || data?.metrics?.systemHealth?.status === 'good' ? 'bg-emerald-500 animate-pulse' :
                data?.metrics?.systemHealth?.status === 'fair' ? 'bg-amber-500' : 'bg-red-500'
              }`} />
              {data?.metrics?.systemHealth?.status === 'excellent' ? 'Excelente' :
               data?.metrics?.systemHealth?.status === 'good' ? 'Bom' :
               data?.metrics?.systemHealth?.status === 'fair' ? 'Regular' : 'Crítico'}
            </Badge>
          </p>
        </div>
        
        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Auto-refresh Toggle */}
          <div className="flex items-center space-x-2 text-sm text-slate-300">
            <RefreshCw className={`h-4 w-4 ${autoRefresh ? 'animate-spin text-purple-400' : 'text-slate-500'}`} />
            <span>Auto-refresh</span>
            <Switch 
              checked={autoRefresh} 
              onCheckedChange={setAutoRefresh}
              className="data-[state=checked]:bg-purple-500"
            />
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={loading}
              className="border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={exportToJSON}
              className="border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAlerts(!showAlerts)}
              className="text-slate-400 hover:text-white"
            >
              {showAlerts ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Last Update Info */}
      <div className="flex justify-between items-center text-xs text-slate-500">
        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>Última atualização: {lastUpdate.toLocaleTimeString('pt-BR')}</span>
          </span>
          {data?.agents && (
            <span>{data.agents.length} agentes registrados</span>
          )}
        </div>
        
        {data?.metrics && (
          <span>Uptime: {data.metrics.uptime}</span>
        )}
      </div>

      {/* Alerts Banner */}
      {showAlerts && data?.alerts && data.alerts.length > 0 && (
        <div className="space-y-2">
          {data.alerts.map((alert) => (
            <Card key={alert.id} className={`border-l-4 ${
              alert.type === 'success' ? 'border-l-emerald-500 bg-emerald-500/5' :
              alert.type === 'warning' ? 'border-l-amber-500 bg-amber-500/5' :
              alert.type === 'error' ? 'border-l-red-500 bg-red-500/5' :
              'border-l-blue-500 bg-blue-500/5'
            } bg-slate-800/30 border-slate-700/50`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    {alert.type === 'success' ? <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5" /> :
                     alert.type === 'warning' ? <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" /> :
                     alert.type === 'error' ? <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" /> :
                     <Bell className="h-5 w-5 text-blue-500 mt-0.5" />}
                    <div>
                      <p className="text-white text-sm">{alert.message}</p>
                      <p className="text-slate-400 text-xs mt-1">
                        {new Date(alert.timestamp).toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Main Dashboard Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-2 lg:grid-cols-4 bg-slate-800/50 border-slate-700">
          <TabsTrigger value="overview" className="data-[state=active]:bg-purple-500/20">
            <Activity className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="agents" className="data-[state=active]:bg-purple-500/20">
            <Zap className="h-4 w-4 mr-2" />
            Agentes
          </TabsTrigger>
          <TabsTrigger value="charts" className="data-[state=active]:bg-purple-500/20">
            <TrendingUp className="h-4 w-4 mr-2" />
            Gráficos
          </TabsTrigger>
          <TabsTrigger value="healing" className="data-[state=active]:bg-purple-500/20">
            <CheckCircle className="h-4 w-4 mr-2" />
            Auto-Healing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Metrics Overview */}
          <MetricsOverview 
            metrics={data?.metrics || null}
            loading={loading}
          />
          
          {/* Quick Agent Overview */}
          {data?.agents && (
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <span>Agentes em Destaque</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setActiveTab('agents')}
                    className="text-slate-400 hover:text-white"
                  >
                    Ver Todos
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredAgents.slice(0, 6).map((agent) => (
                    <div 
                      key={agent.id} 
                      className="p-4 bg-slate-700/20 rounded-lg border border-slate-700/50 hover:bg-slate-700/30 transition-all duration-200 cursor-pointer"
                      onClick={() => setActiveTab('agents')}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-white text-sm truncate">{agent.displayName}</h4>
                        <div className={`w-2 h-2 rounded-full ${
                          agent.status === 'online' ? 'bg-emerald-500 animate-pulse' :
                          agent.status === 'busy' ? 'bg-amber-500' :
                          agent.status === 'offline' ? 'bg-slate-500' : 'bg-blue-500'
                        }`} />
                      </div>
                      <p className="text-xs text-slate-400 mb-3 line-clamp-2">{agent.description}</p>
                      <div className="flex justify-between items-center text-xs">
                        <Badge variant="outline" className="text-[10px] border-slate-600 text-slate-400">
                          {agent.category}
                        </Badge>
                        <span className={`font-semibold ${
                          agent.successRate >= 95 ? 'text-emerald-400' :
                          agent.successRate >= 85 ? 'text-amber-400' : 'text-red-400'
                        }`}>
                          {agent.successRate}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="agents" className="space-y-6">
          {data?.agents && (
            <AgentsGrid 
              agents={data.agents}
              loading={loading}
              onAgentAction={handleAgentAction}
            />
          )}
        </TabsContent>

        <TabsContent value="charts" className="space-y-6">
          {data && (
            <SystemCharts
              chartData={data.chartData}
              metrics={data.metrics}
              agents={data.agents}
              loading={loading}
              onExport={handleChartExport}
            />
          )}
        </TabsContent>

        <TabsContent value="healing" className="space-y-6">
          {data?.autoHealingEvents && (
            <AutoHealingTimeline
              events={data.autoHealingEvents}
              loading={loading}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}