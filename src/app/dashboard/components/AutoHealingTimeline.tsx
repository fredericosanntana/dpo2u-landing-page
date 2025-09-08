'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Shield,
  CheckCircle,
  AlertTriangle,
  Clock,
  Zap,
  RefreshCw,
  Activity,
  ChevronRight,
  Filter,
  Calendar,
  TrendingUp,
  Server,
  Database,
  Globe,
  Lock
} from 'lucide-react';
import type { AutoHealingEvent } from '@/hooks/useDashboardData';

interface AutoHealingTimelineProps {
  events: AutoHealingEvent[];
  loading?: boolean;
}

const eventTypeIcons = {
  fix: CheckCircle,
  detection: AlertTriangle,
  alert: AlertTriangle,
  recovery: RefreshCw
};

const eventTypeColors = {
  fix: {
    bg: 'bg-emerald-500/20',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
    icon: 'text-emerald-500'
  },
  detection: {
    bg: 'bg-amber-500/20',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
    icon: 'text-amber-500'
  },
  alert: {
    bg: 'bg-red-500/20',
    text: 'text-red-400',
    border: 'border-red-500/30',
    icon: 'text-red-500'
  },
  recovery: {
    bg: 'bg-blue-500/20',
    text: 'text-blue-400',
    border: 'border-blue-500/30',
    icon: 'text-blue-500'
  }
};

const statusColors = {
  resolved: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/20'
  },
  in_progress: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/20'
  },
  failed: {
    bg: 'bg-red-500/10',
    text: 'text-red-400',
    border: 'border-red-500/20'
  }
};

const componentIcons = {
  'LEANN Service': Database,
  'API Gateway': Server,
  'SSL Certificate': Lock,
  'System Monitor': Activity,
  'Load Balancer': Globe,
  default: Shield
};

function getComponentIcon(component: string) {
  const key = Object.keys(componentIcons).find(k => 
    component.toLowerCase().includes(k.toLowerCase())
  );
  return key ? componentIcons[key as keyof typeof componentIcons] : componentIcons.default;
}

function formatDuration(duration?: number): string {
  if (!duration) return 'N/A';
  
  if (duration < 60) return `${duration}s`;
  if (duration < 3600) return `${Math.floor(duration / 60)}m ${duration % 60}s`;
  
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  return `${hours}h ${minutes}m`;
}

function formatRelativeTime(timestamp: string): string {
  const now = new Date();
  const eventTime = new Date(timestamp);
  const diffMs = now.getTime() - eventTime.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return 'Agora mesmo';
  if (diffMins < 60) return `${diffMins}m atrás`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h atrás`;
  
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d atrás`;
}

function EventItem({ event, isLast }: { event: AutoHealingEvent; isLast: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const EventIcon = eventTypeIcons[event.type];
  const ComponentIcon = getComponentIcon(event.component);
  const typeStyle = eventTypeColors[event.type];
  const statusStyle = statusColors[event.status];

  return (
    <div className="relative">
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-slate-700" />
      )}
      
      <div className="flex space-x-4">
        {/* Event icon */}
        <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full ${typeStyle.bg} ${typeStyle.border} border-2`}>
          <EventIcon className={`h-6 w-6 ${typeStyle.icon}`} />
        </div>
        
        {/* Event content */}
        <div className="flex-1 pb-8">
          <Card className={`bg-slate-800/30 border-slate-700/50 hover:bg-slate-800/50 transition-all duration-200 ${expanded ? 'shadow-lg' : ''}`}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <ComponentIcon className="h-4 w-4 text-slate-400" />
                    <CardTitle className="text-sm font-medium text-white">
                      {event.component}
                    </CardTitle>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border} border`}
                    >
                      {event.status === 'resolved' ? 'Resolvido' :
                       event.status === 'in_progress' ? 'Em Progresso' : 'Falhou'}
                    </Badge>
                  </div>
                  
                  <CardDescription className="text-slate-300 text-sm leading-relaxed">
                    {event.description}
                  </CardDescription>
                  
                  <div className="flex items-center space-x-4 mt-3 text-xs text-slate-400">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{formatRelativeTime(event.timestamp)}</span>
                    </div>
                    
                    {event.duration && (
                      <div className="flex items-center space-x-1">
                        <Zap className="h-3 w-3" />
                        <span>Duração: {formatDuration(event.duration)}</span>
                      </div>
                    )}
                    
                    <Badge 
                      variant="secondary" 
                      className={`text-[10px] ${typeStyle.bg} ${typeStyle.text} ${typeStyle.border} border bg-opacity-50`}
                    >
                      {event.type === 'fix' ? 'Correção' :
                       event.type === 'detection' ? 'Detecção' :
                       event.type === 'alert' ? 'Alerta' : 'Recuperação'}
                    </Badge>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setExpanded(!expanded)}
                  className="text-slate-400 hover:text-white ml-2"
                >
                  <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`} />
                </Button>
              </div>
            </CardHeader>
            
            {expanded && (
              <CardContent className="pt-0">
                <div className="space-y-3 text-sm">
                  <div className="grid grid-cols-2 gap-4 p-3 bg-slate-700/20 rounded-lg">
                    <div>
                      <span className="text-slate-400">Timestamp:</span>
                      <div className="text-slate-300 font-mono text-xs">
                        {new Date(event.timestamp).toLocaleString('pt-BR')}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-400">ID do Evento:</span>
                      <div className="text-slate-300 font-mono text-xs">
                        {event.id}
                      </div>
                    </div>
                  </div>
                  
                  {event.status === 'resolved' && event.duration && (
                    <div className="flex items-center space-x-2 p-2 bg-emerald-500/5 border border-emerald-500/20 rounded-lg">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      <span className="text-emerald-400 text-sm">
                        Problema resolvido automaticamente em {formatDuration(event.duration)}
                      </span>
                    </div>
                  )}
                  
                  {event.status === 'in_progress' && (
                    <div className="flex items-center space-x-2 p-2 bg-amber-500/5 border border-amber-500/20 rounded-lg">
                      <RefreshCw className="h-4 w-4 text-amber-500 animate-spin" />
                      <span className="text-amber-400 text-sm">
                        Sistema trabalhando na resolução...
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

function EventSkeleton({ isLast }: { isLast: boolean }) {
  return (
    <div className="relative">
      {!isLast && (
        <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-slate-700" />
      )}
      
      <div className="flex space-x-4">
        <Skeleton className="w-12 h-12 rounded-full bg-slate-700" />
        
        <div className="flex-1 pb-8">
          <Card className="bg-slate-800/30 border-slate-700/50">
            <CardHeader className="pb-3">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-4 bg-slate-700" />
                  <Skeleton className="h-4 w-32 bg-slate-700" />
                  <Skeleton className="h-5 w-16 bg-slate-700 rounded" />
                </div>
                <Skeleton className="h-10 w-full bg-slate-700" />
                <div className="flex space-x-4">
                  <Skeleton className="h-3 w-20 bg-slate-700" />
                  <Skeleton className="h-3 w-24 bg-slate-700" />
                  <Skeleton className="h-4 w-16 bg-slate-700 rounded" />
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function AutoHealingTimeline({ events, loading }: AutoHealingTimelineProps) {
  const [filter, setFilter] = useState<'all' | 'fix' | 'detection' | 'alert' | 'recovery'>('all');
  
  const filteredEvents = filter === 'all' 
    ? events 
    : events.filter(event => event.type === filter);

  const stats = {
    total: events.length,
    resolved: events.filter(e => e.status === 'resolved').length,
    inProgress: events.filter(e => e.status === 'in_progress').length,
    fixes: events.filter(e => e.type === 'fix').length
  };

  if (loading) {
    return (
      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-5 w-5 bg-slate-700" />
              <Skeleton className="h-6 w-40 bg-slate-700" />
            </div>
            <Skeleton className="h-8 w-20 bg-slate-700" />
          </div>
          <Skeleton className="h-4 w-64 bg-slate-700" />
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <EventSkeleton key={i} isLast={i === 2} />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="text-white flex items-center space-x-2 mb-2">
              <Shield className="h-5 w-5 text-blue-400" />
              <span>Sistema Auto-Healing</span>
            </CardTitle>
            <CardDescription className="text-slate-400">
              Monitoramento e correção automática de problemas do sistema
            </CardDescription>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant={filter === 'all' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setFilter('all')}
              className="text-xs"
            >
              Todos ({stats.total})
            </Button>
            <Button
              variant={filter === 'fix' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setFilter('fix')}
              className="text-xs"
            >
              Correções ({stats.fixes})
            </Button>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
          <div className="text-center p-3 bg-slate-700/20 rounded-lg">
            <div className="text-xl font-bold text-white">{stats.total}</div>
            <div className="text-xs text-slate-400">Total de Eventos</div>
          </div>
          <div className="text-center p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
            <div className="text-xl font-bold text-emerald-400">{stats.resolved}</div>
            <div className="text-xs text-slate-400">Resolvidos</div>
          </div>
          <div className="text-center p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
            <div className="text-xl font-bold text-amber-400">{stats.inProgress}</div>
            <div className="text-xs text-slate-400">Em Progresso</div>
          </div>
          <div className="text-center p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <div className="text-xl font-bold text-blue-400">
              {stats.resolved > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0}%
            </div>
            <div className="text-xs text-slate-400">Taxa de Sucesso</div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {filteredEvents.length > 0 ? (
          <ScrollArea className="h-96">
            <div className="space-y-6">
              {filteredEvents
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .map((event, index) => (
                  <EventItem 
                    key={event.id} 
                    event={event} 
                    isLast={index === filteredEvents.length - 1}
                  />
                ))
              }
            </div>
          </ScrollArea>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <Shield className="h-12 w-12 text-slate-500 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Nenhum evento encontrado</h3>
            <p className="text-slate-400 text-center">
              {filter === 'all' 
                ? 'Nenhum evento de auto-healing registrado ainda.'
                : `Nenhum evento do tipo "${filter}" encontrado.`
              }
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}