/**
 * Agent Gallery Component
 * Displays all 28 agents with their status and capabilities
 */

'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAgents, useFilters } from '@/lib/dashboard-store';
import { Agent } from '@/lib/api-client';
import { 
  Bot, 
  Search, 
  Filter, 
  Activity, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Settings,
  Zap,
  Shield,
  Code,
  Database,
  Palette,
  FileText,
  Users,
  Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AgentCardProps {
  agent: Agent;
  onClick: (agent: Agent) => void;
}

const AgentCard: React.FC<AgentCardProps> = ({ agent, onClick }) => {
  const getStatusConfig = (status: Agent['status']) => {
    switch (status) {
      case 'online':
        return {
          icon: <CheckCircle className="h-4 w-4" />,
          className: 'bg-green-100 text-green-800 border-green-200',
          label: 'Online'
        };
      case 'offline':
        return {
          icon: <XCircle className="h-4 w-4" />,
          className: 'bg-gray-100 text-gray-800 border-gray-200',
          label: 'Offline'
        };
      case 'busy':
        return {
          icon: <Activity className="h-4 w-4" />,
          className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          label: 'Executando'
        };
      case 'error':
        return {
          icon: <AlertCircle className="h-4 w-4" />,
          className: 'bg-red-100 text-red-800 border-red-200',
          label: 'Erro'
        };
      default:
        return {
          icon: <XCircle className="h-4 w-4" />,
          className: 'bg-gray-100 text-gray-800 border-gray-200',
          label: 'Desconhecido'
        };
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'architecture & coordination':
        return <Settings className="h-4 w-4" />;
      case 'development & implementation':
        return <Code className="h-4 w-4" />;
      case 'security & quality':
        return <Shield className="h-4 w-4" />;
      case 'operations & deployment':
        return <Database className="h-4 w-4" />;
      case 'content & documentation':
        return <FileText className="h-4 w-4" />;
      case 'design & brand':
        return <Palette className="h-4 w-4" />;
      case 'research':
        return <Activity className="h-4 w-4" />;
      case 'autoagents':
        return <Bot className="h-4 w-4" />;
      case 'integration & management':
        return <Globe className="h-4 w-4" />;
      default:
        return <Bot className="h-4 w-4" />;
    }
  };

  const statusConfig = getStatusConfig(agent.status);

  return (
    <Card 
      className={cn(
        'cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105',
        'bg-white/80 backdrop-blur-sm border border-white/20',
        agent.status === 'online' ? 'ring-2 ring-green-200' :
        agent.status === 'busy' ? 'ring-2 ring-yellow-200' : ''
      )}
      onClick={() => onClick(agent)}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            {getCategoryIcon(agent.category)}
            <CardTitle className="text-sm font-medium truncate">
              {agent.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </CardTitle>
          </div>
          <Badge variant="outline" className={cn('text-xs', statusConfig.className)}>
            <div className="flex items-center space-x-1">
              {statusConfig.icon}
              <span>{statusConfig.label}</span>
            </div>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-xs text-gray-600 line-clamp-2">
          {agent.description}
        </p>
        
        <div className="flex flex-wrap gap-1">
          {agent.capabilities.slice(0, 2).map((capability) => (
            <Badge key={capability} variant="secondary" className="text-xs">
              {capability}
            </Badge>
          ))}
          {agent.capabilities.length > 2 && (
            <Badge variant="secondary" className="text-xs">
              +{agent.capabilities.length - 2}
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>
              {formatDistanceToNow(new Date(agent.last_activity), { 
                addSuffix: true,
                locale: ptBR 
              })}
            </span>
          </div>
          {agent.success_rate && (
            <div className="flex items-center space-x-1">
              <Zap className="h-3 w-3" />
              <span>{agent.success_rate}%</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const AgentDetails: React.FC<{ agent: Agent }> = ({ agent }) => {
  const statusConfig = {
    online: { color: 'text-green-600', bg: 'bg-green-100' },
    offline: { color: 'text-gray-600', bg: 'bg-gray-100' },
    busy: { color: 'text-yellow-600', bg: 'bg-yellow-100' },
    error: { color: 'text-red-600', bg: 'bg-red-100' },
  }[agent.status] || { color: 'text-gray-600', bg: 'bg-gray-100' };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold">
            {agent.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </h3>
          <p className="text-sm text-gray-600 mt-1">{agent.description}</p>
        </div>
        <Badge className={cn('text-xs', statusConfig.color, statusConfig.bg)}>
          {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Informações Gerais</h4>
          <div className="space-y-1 text-sm">
            <div><strong>ID:</strong> {agent.id}</div>
            <div><strong>Categoria:</strong> {agent.category}</div>
            <div><strong>Última Atividade:</strong> {formatDistanceToNow(new Date(agent.last_activity), { addSuffix: true, locale: ptBR })}</div>
          </div>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Métricas</h4>
          <div className="space-y-1 text-sm">
            {agent.success_rate && <div><strong>Taxa de Sucesso:</strong> {agent.success_rate}%</div>}
            {agent.total_executions && <div><strong>Execuções Totais:</strong> {agent.total_executions}</div>}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="font-medium text-sm">Capacidades</h4>
        <div className="flex flex-wrap gap-2">
          {agent.capabilities.map((capability) => (
            <Badge key={capability} variant="outline">
              {capability}
            </Badge>
          ))}
        </div>
      </div>

      {agent.status === 'online' && (
        <div className="pt-4 border-t">
          <Button className="w-full" variant="default">
            <Zap className="h-4 w-4 mr-2" />
            Executar Agente
          </Button>
        </div>
      )}
    </div>
  );
};

export const AgentGallery: React.FC = () => {
  const { filteredAgents, selectedAgent, setSelectedAgent, agentsByCategory } = useAgents();
  const { 
    agentFilter, 
    agentCategoryFilter, 
    setAgentFilter, 
    setAgentCategoryFilter 
  } = useFilters();

  const [viewMode, setViewMode] = useState<'grid' | 'category'>('grid');

  const categories = Object.keys(agentsByCategory);
  const onlineCount = filteredAgents.filter(a => a.status === 'online').length;
  const busyCount = filteredAgents.filter(a => a.status === 'busy').length;
  const offlineCount = filteredAgents.filter(a => a.status === 'offline').length;

  const renderAgentGrid = (agents: Agent[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {agents.map((agent) => (
        <AgentCard
          key={agent.id}
          agent={agent}
          onClick={setSelectedAgent}
        />
      ))}
    </div>
  );

  const renderCategoryView = () => (
    <div className="space-y-8">
      {categories.map((category) => {
        const categoryAgents = agentsByCategory[category].filter(agent => 
          filteredAgents.some(filtered => filtered.id === agent.id)
        );
        
        if (categoryAgents.length === 0) return null;

        return (
          <div key={category}>
            <div className="flex items-center space-x-2 mb-4">
              <h3 className="text-lg font-semibold text-gray-800">{category}</h3>
              <Badge variant="secondary" className="text-xs">
                {categoryAgents.length} agente{categoryAgents.length !== 1 ? 's' : ''}
              </Badge>
            </div>
            {renderAgentGrid(categoryAgents)}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header with stats and filters */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">Agentes DPO2U</h2>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1 text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span>{onlineCount} Online</span>
            </div>
            <div className="flex items-center space-x-1 text-yellow-600">
              <div className="w-2 h-2 bg-yellow-500 rounded-full" />
              <span>{busyCount} Executando</span>
            </div>
            <div className="flex items-center space-x-1 text-gray-600">
              <div className="w-2 h-2 bg-gray-500 rounded-full" />
              <span>{offlineCount} Offline</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            Grade
          </Button>
          <Button
            variant={viewMode === 'category' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('category')}
          >
            Categorias
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar agentes..."
              value={agentFilter}
              onChange={(e) => setAgentFilter(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <Select value={agentCategoryFilter} onValueChange={setAgentCategoryFilter}>
          <SelectTrigger className="w-full sm:w-64">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filtrar por categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as categorias</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Agent display */}
      {filteredAgents.length === 0 ? (
        <div className="text-center py-12">
          <Bot className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Nenhum agente encontrado</p>
        </div>
      ) : viewMode === 'grid' ? renderAgentGrid(filteredAgents) : renderCategoryView()}

      {/* Agent Details Modal */}
      <Dialog open={selectedAgent !== null} onOpenChange={() => setSelectedAgent(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Agente</DialogTitle>
          </DialogHeader>
          {selectedAgent && <AgentDetails agent={selectedAgent} />}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AgentGallery;