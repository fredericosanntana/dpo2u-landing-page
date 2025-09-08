'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Cpu,
  HardDrive,
  Users,
  Zap,
  Clock,
  Download,
  Maximize2
} from 'lucide-react';
import type { ChartData, SystemMetrics, Agent } from '@/hooks/useDashboardData';

interface SystemChartsProps {
  chartData: ChartData[];
  metrics: SystemMetrics | null;
  agents: Agent[];
  loading?: boolean;
  onExport?: (chartType: string) => void;
}

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800/95 backdrop-blur-sm border border-slate-700 rounded-lg p-3 shadow-lg">
        <p className="text-slate-300 text-sm mb-2">
          {new Date(label).toLocaleString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
            day: '2-digit',
            month: '2-digit'
          })}
        </p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-slate-300 text-sm">
              {entry.name}: {entry.value}{entry.unit || ''}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

function ChartSkeleton() {
  return (
    <Card className="bg-slate-800/50 border-slate-700/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-32 bg-slate-700" />
          <Skeleton className="h-8 w-20 bg-slate-700" />
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-64 w-full bg-slate-700 rounded-lg" />
      </CardContent>
    </Card>
  );
}

export default function SystemCharts({ 
  chartData, 
  metrics, 
  agents, 
  loading, 
  onExport 
}: SystemChartsProps) {
  const [activeTab, setActiveTab] = useState('performance');

  if (loading || !chartData || !metrics) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <ChartSkeleton key={i} />
        ))}
      </div>
    );
  }

  // Prepare data for different charts
  const performanceData = chartData.map(item => ({
    ...item,
    time: new Date(item.timestamp).getHours() + ':00'
  }));

  const resourceData = chartData.map(item => ({
    time: new Date(item.timestamp).getHours() + ':00',
    cpu: item.cpuUsage,
    memory: item.memoryUsage,
    timestamp: item.timestamp
  }));

  const agentsData = chartData.map(item => ({
    time: new Date(item.timestamp).getHours() + ':00',
    active: item.activeAgents,
    tasks: item.tasksCompleted,
    responseTime: item.responseTime,
    timestamp: item.timestamp
  }));

  // Agent status distribution for pie chart
  const agentStatusData = [
    { name: 'Online', value: agents.filter(a => a.status === 'online').length, color: '#10b981' },
    { name: 'Busy', value: agents.filter(a => a.status === 'busy').length, color: '#f59e0b' },
    { name: 'Offline', value: agents.filter(a => a.status === 'offline').length, color: '#6b7280' },
    { name: 'Maintenance', value: agents.filter(a => a.status === 'maintenance').length, color: '#3b82f6' }
  ].filter(item => item.value > 0);

  // Agent category distribution
  const categoryData = Object.entries(
    agents.reduce((acc, agent) => {
      acc[agent.category] = (acc[agent.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([category, count]) => ({
    name: category.charAt(0).toUpperCase() + category.slice(1),
    value: count,
    color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
            <Activity className="h-5 w-5 text-emerald-400" />
            <span>Gráficos do Sistema</span>
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Visualização de dados e métricas de performance em tempo real
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onExport?.(activeTab)}
            className="text-slate-300 border-slate-600 hover:bg-slate-700"
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border-slate-700">
          <TabsTrigger value="performance" className="text-slate-300 data-[state=active]:text-white">
            Performance
          </TabsTrigger>
          <TabsTrigger value="resources" className="text-slate-300 data-[state=active]:text-white">
            Recursos
          </TabsTrigger>
          <TabsTrigger value="agents" className="text-slate-300 data-[state=active]:text-white">
            Agentes
          </TabsTrigger>
          <TabsTrigger value="distribution" className="text-slate-300 data-[state=active]:text-white">
            Distribuição
          </TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Response Time Chart */}
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-blue-400" />
                    <span>Tempo de Resposta</span>
                  </div>
                  <Badge variant="outline" className="text-xs text-blue-400 border-blue-500/30">
                    ms
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="time" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#9ca3af', fontSize: 12 }}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#9ca3af', fontSize: 12 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line 
                      type="monotone" 
                      dataKey="responseTime" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={{ fill: '#3b82f6', strokeWidth: 2 }}
                      name="Tempo de Resposta"
                      unit="ms"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Tasks Completed Chart */}
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Zap className="h-5 w-5 text-purple-400" />
                    <span>Tarefas Concluídas</span>
                  </div>
                  <Badge variant="outline" className="text-xs text-purple-400 border-purple-500/30">
                    por hora
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="time" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#9ca3af', fontSize: 12 }}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#9ca3af', fontSize: 12 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area 
                      type="monotone" 
                      dataKey="tasksCompleted" 
                      stroke="#8b5cf6" 
                      fill="#8b5cf6"
                      fillOpacity={0.3}
                      name="Tarefas"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* CPU & Memory Usage */}
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Cpu className="h-5 w-5 text-emerald-400" />
                  <span>Uso de Recursos</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={resourceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="time" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#9ca3af', fontSize: 12 }}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#9ca3af', fontSize: 12 }}
                      domain={[0, 100]}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="cpu" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      name="CPU"
                      unit="%"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="memory" 
                      stroke="#f59e0b" 
                      strokeWidth={2}
                      name="Memória"
                      unit="%"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Resource Usage Bar Chart */}
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <HardDrive className="h-5 w-5 text-orange-400" />
                  <span>Uso Atual de Recursos</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart 
                    data={[
                      { name: 'CPU', value: metrics.resources.cpu, color: '#10b981' },
                      { name: 'Memória', value: metrics.resources.memory, color: '#f59e0b' },
                      { name: 'Disco', value: 67, color: '#3b82f6' },
                      { name: 'Rede', value: 23, color: '#8b5cf6' }
                    ]}
                    layout="horizontal"
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      type="number"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#9ca3af', fontSize: 12 }}
                      domain={[0, 100]}
                    />
                    <YAxis 
                      type="category"
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#9ca3af', fontSize: 12 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                      dataKey="value" 
                      fill="#8884d8"
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="agents" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Active Agents Over Time */}
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Users className="h-5 w-5 text-cyan-400" />
                  <span>Agentes Ativos</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={agentsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="time" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#9ca3af', fontSize: 12 }}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#9ca3af', fontSize: 12 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area 
                      type="monotone" 
                      dataKey="active" 
                      stroke="#06b6d4" 
                      fill="#06b6d4"
                      fillOpacity={0.3}
                      name="Agentes Ativos"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Top Performing Agents */}
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-green-400" />
                  <span>Agentes Mais Eficientes</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {agents
                    .sort((a, b) => b.successRate - a.successRate)
                    .slice(0, 5)
                    .map((agent, index) => (
                      <div key={agent.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                            index === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                            index === 1 ? 'bg-gray-400/20 text-gray-400' :
                            index === 2 ? 'bg-orange-500/20 text-orange-400' :
                            'bg-slate-600/20 text-slate-400'
                          }`}>
                            #{index + 1}
                          </div>
                          <div>
                            <div className="text-white text-sm font-medium">
                              {agent.displayName}
                            </div>
                            <div className="text-slate-400 text-xs">
                              {agent.category}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-bold ${
                            agent.successRate >= 95 ? 'text-emerald-400' :
                            agent.successRate >= 85 ? 'text-amber-400' : 'text-red-400'
                          }`}>
                            {agent.successRate}%
                          </div>
                          <div className="text-xs text-slate-400">{agent.avgResponseTime}s avg</div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Agent Status Distribution */}
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-emerald-400" />
                  <span>Status dos Agentes</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-64">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={agentStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {agentStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {agentStatusData.map((entry, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: entry.color }}
                      />
                      <span className="text-slate-300 text-sm">
                        {entry.name}: {entry.value}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Category Distribution */}
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Users className="h-5 w-5 text-blue-400" />
                  <span>Distribuição por Categoria</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {categoryData.map((category, index) => {
                    const percentage = Math.round((category.value / agents.length) * 100);
                    return (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-300 text-sm">{category.name}</span>
                          <span className="text-slate-400 text-sm">
                            {category.value} ({percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full transition-all duration-500"
                            style={{ 
                              width: `${percentage}%`,
                              backgroundColor: category.color
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}