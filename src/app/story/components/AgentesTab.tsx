/**
 * Tab "Agentes" - Grid de cards com os 32 agentes
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Bot, 
  Shield, 
  Code, 
  Rocket, 
  FileText, 
  Palette,
  Search,
  Settings,
  Zap,
  Brain,
  Database,
  Monitor,
  Users,
  Clock,
  Activity,
  CheckCircle,
  AlertCircle,
  Circle
} from "lucide-react";
import { MetricsData, Agent } from "@/hooks/useMetricsAPI";

interface AgentesTabProps {
  data: MetricsData;
}

// Mapear domínios para ícones
const getDomainIcon = (domain: string, name: string) => {
  const lowerDomain = domain.toLowerCase();
  const lowerName = name.toLowerCase();
  
  if (lowerDomain.includes('security') || lowerName.includes('security')) return Shield;
  if (lowerDomain.includes('code') || lowerName.includes('code')) return Code;
  if (lowerDomain.includes('deploy') || lowerName.includes('deploy')) return Rocket;
  if (lowerDomain.includes('design') || lowerName.includes('design')) return Palette;
  if (lowerDomain.includes('content') || lowerName.includes('content')) return FileText;
  if (lowerDomain.includes('search') || lowerName.includes('search')) return Search;
  if (lowerDomain.includes('orchestrat') || lowerName.includes('orchestrat')) return Settings;
  if (lowerDomain.includes('performance') || lowerName.includes('performance')) return Zap;
  if (lowerDomain.includes('knowledge') || lowerName.includes('zettelkasten')) return Brain;
  if (lowerDomain.includes('data') || lowerName.includes('data')) return Database;
  if (lowerDomain.includes('devops') || lowerName.includes('devops')) return Monitor;
  if (lowerDomain.includes('test') || lowerName.includes('test')) return CheckCircle;
  
  return Bot; // Default icon
};

// Mapear domínios para cores
const getDomainColor = (domain: string, name: string) => {
  const lowerDomain = domain.toLowerCase();
  const lowerName = name.toLowerCase();
  
  if (lowerDomain.includes('security') || lowerName.includes('security')) return 'bg-red-500/10 text-red-500 border-red-500/20';
  if (lowerDomain.includes('code') || lowerName.includes('code')) return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
  if (lowerDomain.includes('deploy') || lowerName.includes('deploy')) return 'bg-green-500/10 text-green-500 border-green-500/20';
  if (lowerDomain.includes('design') || lowerName.includes('design')) return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
  if (lowerDomain.includes('content') || lowerName.includes('content')) return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
  if (lowerDomain.includes('orchestrat') || lowerName.includes('orchestrat')) return 'bg-primary/10 text-primary border-primary/20';
  if (lowerDomain.includes('performance') || lowerName.includes('performance')) return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
  
  return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
};

// Formatar nome do agente
const formatAgentName = (name: string) => {
  return name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Formatar última execução
const formatLastExecution = (lastExecution: string | null) => {
  if (!lastExecution) return 'Nunca executado';
  
  const date = new Date(lastExecution);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffDays > 0) return `${diffDays}d atrás`;
  if (diffHours > 0) return `${diffHours}h atrás`;
  return 'Recente';
};

export function AgentesTab({ data }: AgentesTabProps) {
  const { agents, summary } = data;
  
  // Separar agentes por status
  const activeAgents = agents.filter(agent => agent.status === 'online');
  const offlineAgents = agents.filter(agent => agent.status === 'offline');
  
  // Agrupar por domínio
  const groupedAgents = agents.reduce((acc, agent) => {
    const domain = agent.domain || 'Outros';
    if (!acc[domain]) acc[domain] = [];
    acc[domain].push(agent);
    return acc;
  }, {} as Record<string, Agent[]>);

  return (
    <div className="space-y-6">
      {/* Estatísticas gerais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <div>
              <div className="text-2xl font-bold">{summary.total_agents}</div>
              <div className="text-sm text-muted-foreground">Total de Agentes</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-green-500" />
            <div>
              <div className="text-2xl font-bold text-green-600">{summary.active_agents}</div>
              <div className="text-sm text-muted-foreground">Online</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-500" />
            <div>
              <div className="text-2xl font-bold text-orange-600">{summary.offline_agents}</div>
              <div className="text-sm text-muted-foreground">Offline</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-500" />
            <div>
              <div className="text-2xl font-bold text-blue-600">{summary.tasks_completed_today}</div>
              <div className="text-sm text-muted-foreground">Tarefas Hoje</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm">
          <Circle className="h-4 w-4 mr-1 fill-green-500 text-green-500" />
          Online ({activeAgents.length})
        </Button>
        <Button variant="outline" size="sm">
          <Circle className="h-4 w-4 mr-1 fill-red-500 text-red-500" />
          Offline ({offlineAgents.length})
        </Button>
      </div>

      {/* Grid de Agentes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {agents.map((agent) => {
          const IconComponent = getDomainIcon(agent.domain, agent.name);
          const colorClasses = getDomainColor(agent.domain, agent.name);
          
          return (
            <Card 
              key={agent.name} 
              className={`relative transition-all hover:shadow-md ${
                agent.status === 'online' ? 'ring-1 ring-green-500/20' : 'ring-1 ring-red-500/20'
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className={`p-2 rounded-lg ${colorClasses}`}>
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <Badge 
                    variant={agent.status === 'online' ? 'default' : 'secondary'}
                    className={agent.status === 'online' ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}
                  >
                    {agent.status}
                  </Badge>
                </div>
                <CardTitle className="text-base leading-tight">
                  {formatAgentName(agent.name)}
                </CardTitle>
                {agent.type && (
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {agent.type}
                  </p>
                )}
              </CardHeader>
              
              <CardContent className="pt-0 space-y-3">
                {/* Domínio */}
                {agent.domain && (
                  <div>
                    <div className="text-xs font-medium text-muted-foreground mb-1">Domínio</div>
                    <p className="text-xs line-clamp-2">{agent.domain}</p>
                  </div>
                )}
                
                {/* Métricas */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <div className="font-medium text-muted-foreground">Execuções</div>
                    <div className="font-semibold">{agent.executions}</div>
                  </div>
                  <div>
                    <div className="font-medium text-muted-foreground">Taxa Sucesso</div>
                    <div className="font-semibold">{agent.success_rate.toFixed(1)}%</div>
                  </div>
                </div>
                
                {/* Última execução */}
                <div>
                  <div className="text-xs font-medium text-muted-foreground mb-1">Última Execução</div>
                  <div className="text-xs">{formatLastExecution(agent.last_execution)}</div>
                </div>
                
                {/* Expertise */}
                {agent.expertise && (
                  <div>
                    <div className="text-xs font-medium text-muted-foreground mb-1">Especialização</div>
                    <p className="text-xs line-clamp-2 text-foreground/80">{agent.expertise}</p>
                  </div>
                )}
                
                {/* Tempo médio */}
                {agent.avg_duration > 0 && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {agent.avg_duration.toFixed(2)}s avg
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Agentes por Domínio */}
      <Card>
        <CardHeader>
          <CardTitle>Distribuição por Domínio</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.entries(groupedAgents)
              .filter(([domain]) => domain !== 'Outros' && domain !== '')
              .sort(([,a], [,b]) => b.length - a.length)
              .slice(0, 8)
              .map(([domain, domainAgents]) => (
                <div key={domain} className="flex items-center justify-between">
                  <span className="text-sm">{domain}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{domainAgents.length}</Badge>
                    <div className="flex gap-1">
                      {domainAgents.slice(0, 3).map((agent) => (
                        <div
                          key={agent.name}
                          className={`w-2 h-2 rounded-full ${
                            agent.status === 'online' ? 'bg-green-500' : 'bg-red-500'
                          }`}
                          title={formatAgentName(agent.name)}
                        />
                      ))}
                      {domainAgents.length > 3 && (
                        <div className="text-xs text-muted-foreground ml-1">
                          +{domainAgents.length - 3}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}