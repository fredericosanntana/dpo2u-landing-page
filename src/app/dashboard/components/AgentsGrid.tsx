'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import {
  Search,
  Filter,
  MoreVertical,
  Play,
  Pause,
  Settings,
  TrendingUp,
  Clock,
  Cpu,
  HardDrive,
  Brain,
  Code,
  Shield,
  Server,
  FileText,
  Users,
  Palette,
  Search as SearchIcon,
  Grid3X3,
  List
} from 'lucide-react';
import type { Agent } from '@/hooks/useDashboardData';

interface AgentsGridProps {
  agents: Agent[];
  loading?: boolean;
  onAgentAction?: (agentId: string, action: 'start' | 'stop' | 'configure') => void;
  onFilterChange?: (filters: AgentFilters) => void;
}

interface AgentFilters {
  search: string;
  status: string;
  category: string;
  sortBy: 'name' | 'status' | 'category' | 'performance';
}

const categoryIcons = {
  coordination: Brain,
  architecture: Code,
  development: Code,
  security: Shield,
  operations: Server,
  documentation: FileText,
  research: SearchIcon,
  design: Palette,
  content: FileText
};

const statusColors = {
  online: {
    bg: 'bg-emerald-500/20',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
    dot: 'bg-emerald-500'
  },
  busy: {
    bg: 'bg-amber-500/20',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
    dot: 'bg-amber-500'
  },
  offline: {
    bg: 'bg-slate-500/20',
    text: 'text-slate-400',
    border: 'border-slate-500/30',
    dot: 'bg-slate-500'
  },
  maintenance: {
    bg: 'bg-blue-500/20',
    text: 'text-blue-400',
    border: 'border-blue-500/30',
    dot: 'bg-blue-500'
  }
};

const categoryColors = {
  coordination: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  architecture: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  development: 'bg-green-500/10 text-green-400 border-green-500/30',
  security: 'bg-red-500/10 text-red-400 border-red-500/30',
  operations: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
  documentation: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
  research: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
  design: 'bg-pink-500/10 text-pink-400 border-pink-500/30',
  content: 'bg-teal-500/10 text-teal-400 border-teal-500/30'
};

function AgentCard({ agent, onAction }: { agent: Agent; onAction?: (action: string) => void }) {
  const Icon = categoryIcons[agent.category];
  const statusStyle = statusColors[agent.status];
  const categoryStyle = categoryColors[agent.category];

  const getPerformanceColor = (rate: number) => {
    if (rate >= 95) return 'text-emerald-400';
    if (rate >= 85) return 'text-amber-400';
    return 'text-red-400';
  };

  return (
    <Card className="group bg-slate-800/50 border-slate-700/50 hover:bg-slate-800/70 hover:border-slate-600/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${statusStyle.bg} ${statusStyle.border} border`}>
              <Icon className={`h-4 w-4 ${statusStyle.text}`} />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-sm font-medium text-white truncate">
                {agent.displayName}
              </CardTitle>
              <div className="flex items-center space-x-2 mt-1">
                <div className={`w-2 h-2 rounded-full ${statusStyle.dot} animate-pulse`}></div>
                <span className={`text-xs font-medium ${statusStyle.text} capitalize`}>
                  {agent.status}
                </span>
              </div>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-slate-400 hover:text-white"
            onClick={() => onAction?.('configure')}
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <CardDescription className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
          {agent.description}
        </CardDescription>

        <Badge 
          variant="outline" 
          className={`text-xs border ${categoryStyle} bg-opacity-50`}
        >
          {agent.category}
        </Badge>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-400">Taxa de Sucesso</span>
              <div className={`font-semibold ${getPerformanceColor(agent.successRate)}`}>
                {agent.successRate}%
              </div>
            </div>
            <div>
              <span className="text-slate-400">Tempo Médio</span>
              <div className="font-semibold text-slate-300">
                {agent.avgResponseTime}s
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-400">Tarefas</span>
              <div className="font-semibold text-slate-300">
                {agent.tasksCompleted.toLocaleString()}
              </div>
            </div>
            <div>
              <span className="text-slate-400">Versão</span>
              <div className="font-semibold text-slate-300">
                v{agent.version}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 flex items-center space-x-1">
              <Cpu className="h-3 w-3" />
              <span>CPU</span>
            </span>
            <span className="text-slate-300">{agent.resources.cpu}%</span>
          </div>
          <Progress value={agent.resources.cpu} className="h-1" />
          
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 flex items-center space-x-1">
              <HardDrive className="h-3 w-3" />
              <span>Memória</span>
            </span>
            <span className="text-slate-300">{agent.resources.memory}%</span>
          </div>
          <Progress value={agent.resources.memory} className="h-1" />
        </div>

        <div>
          <div className="text-xs text-slate-400 mb-2">Capacidades</div>
          <div className="flex flex-wrap gap-1">
            {agent.capabilities.slice(0, 2).map((capability, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="text-[10px] px-1.5 py-0.5 bg-slate-700/50 text-slate-300 border-slate-600"
              >
                {capability.replace('_', ' ')}
              </Badge>
            ))}
            {agent.capabilities.length > 2 && (
              <Badge 
                variant="secondary" 
                className="text-[10px] px-1.5 py-0.5 bg-slate-700/50 text-slate-300 border-slate-600"
              >
                +{agent.capabilities.length - 2}
              </Badge>
            )}
          </div>
        </div>

        <div className="flex space-x-2 pt-2">
          {agent.status === 'online' ? (
            <Button
              size="sm"
              variant="outline"
              className="flex-1 text-xs border-slate-600 hover:bg-slate-700"
              onClick={() => onAction?.('stop')}
            >
              <Pause className="h-3 w-3 mr-1" />
              Pausar
            </Button>
          ) : (
            <Button
              size="sm"
              variant="outline"
              className="flex-1 text-xs border-slate-600 hover:bg-slate-700"
              onClick={() => onAction?.('start')}
            >
              <Play className="h-3 w-3 mr-1" />
              Iniciar
            </Button>
          )}
          
          <Button
            size="sm"
            variant="ghost"
            className="text-xs text-slate-400 hover:text-white hover:bg-slate-700"
            onClick={() => onAction?.('configure')}
          >
            <Settings className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AgentsGrid({ 
  agents, 
  loading, 
  onAgentAction, 
  onFilterChange 
}: AgentsGridProps) {
  const [filters, setFilters] = useState<AgentFilters>({
    search: '',
    status: 'all',
    category: 'all',
    sortBy: 'name'
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredAndSortedAgents = useMemo(() => {
    let filtered = [...agents];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(agent => 
        agent.displayName.toLowerCase().includes(searchLower) ||
        agent.description.toLowerCase().includes(searchLower) ||
        agent.category.toLowerCase().includes(searchLower)
      );
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter(agent => agent.status === filters.status);
    }

    if (filters.category !== 'all') {
      filtered = filtered.filter(agent => agent.category === filters.category);
    }

    filtered.sort((a, b) => {
      switch (filters.sortBy) {
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
  }, [agents, filters]);

  const handleFilterChange = (key: keyof AgentFilters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const categories = [...new Set(agents.map(agent => agent.category))].sort();
  const statuses = [...new Set(agents.map(agent => agent.status))].sort();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <Skeleton className="h-10 flex-1 bg-slate-700" />
          <Skeleton className="h-10 w-32 bg-slate-700" />
          <Skeleton className="h-10 w-32 bg-slate-700" />
          <Skeleton className="h-10 w-32 bg-slate-700" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="bg-slate-800/50 border-slate-700/50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="h-8 w-8 rounded-lg bg-slate-700" />
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-24 bg-slate-700" />
                      <Skeleton className="h-3 w-16 bg-slate-700" />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-10 w-full bg-slate-700" />
                <Skeleton className="h-5 w-20 bg-slate-700 rounded" />
                <div className="grid grid-cols-2 gap-3">
                  <Skeleton className="h-8 bg-slate-700" />
                  <Skeleton className="h-8 bg-slate-700" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Buscar agentes..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder-slate-400 focus:border-purple-500"
          />
        </div>

        <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
          <SelectTrigger className="w-32 bg-slate-800/50 border-slate-700 text-white">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            <SelectItem value="all" className="text-white hover:bg-slate-700">Todos</SelectItem>
            {statuses.map(status => (
              <SelectItem 
                key={status} 
                value={status} 
                className="text-white hover:bg-slate-700 capitalize"
              >
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex border border-slate-700 rounded-lg overflow-hidden bg-slate-800/50">
          <Button
            variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className="rounded-none border-none"
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
            className="rounded-none border-none"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex justify-between items-center text-sm text-slate-400">
        <span>
          {filteredAndSortedAgents.length} de {agents.length} agentes
          {filters.search && ` • Busca: "${filters.search}"`}
          {filters.status !== 'all' && ` • Status: ${filters.status}`}
          {filters.category !== 'all' && ` • Categoria: ${filters.category}`}
        </span>
      </div>

      {filteredAndSortedAgents.length > 0 ? (
        <div className={viewMode === 'grid' ? 
          "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" : 
          "space-y-4"
        }>
          {filteredAndSortedAgents.map((agent) => (
            <AgentCard 
              key={agent.id} 
              agent={agent} 
              onAction={(action) => onAgentAction?.(agent.id, action as any)} 
            />
          ))}
        </div>
      ) : (
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-slate-500 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Nenhum agente encontrado</h3>
            <p className="text-slate-400 text-center">
              Tente ajustar os filtros ou o termo de busca.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}