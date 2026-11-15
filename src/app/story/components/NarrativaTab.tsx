/**
 * Tab "Narrative" — living history of the system with real metrics
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Zap, Brain, Users, Clock, Database, Activity } from "lucide-react";
import { MetricsData } from "@/hooks/useMetricsAPI";

interface NarrativaTabProps {
  data: MetricsData;
}

export function NarrativaTab({ data }: NarrativaTabProps) {
  const { summary, system, auto_healing, zettelkasten, services } = data;
  
  const formatUptime = (hours: number) => {
    const days = Math.floor(hours / 24);
    const remainingHours = Math.floor(hours % 24);
    return `${days}d ${remainingHours}h`;
  };

  return (
    <div className="grid gap-6">
      {/* Hero Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{auto_healing.success_rate}%</div>
                <div className="text-sm text-muted-foreground">Auto-Healing</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-secondary/10 rounded-lg">
                <Database className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{services.leann?.notes_count || 0}</div>
                <div className="text-sm text-muted-foreground">Docs LEANN</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-brand-emerald-500/10 to-brand-emerald-500/5 border-brand-emerald-500/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-brand-emerald-500/10 rounded-lg">
                <Users className="h-6 w-6 text-brand-emerald-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">{summary.active_agents}/{summary.total_agents}</div>
                <div className="text-sm text-muted-foreground">Active Agents</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dynamic narrative */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            The Living History of the DPO2U System
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                Chapter I: The AI Brain
              </Badge>
              <div className="flex-1 h-px bg-border" />
            </div>
            <p className="text-sm leading-relaxed text-foreground/80">
              At the heart of the DPO2U system pulses a distributed artificial intelligence. With{' '}
              <span className="font-semibold text-primary">{summary.total_agents} specialized agents</span>,
              of which <span className="font-semibold text-brand-emerald-600">{summary.active_agents} are active</span>,
              the system keeps an impressive self-healing rate of{' '}
              <span className="font-semibold text-primary">{auto_healing.success_rate}%</span>.
            </p>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-secondary/10 text-secondary">
                Chapter II: The Collective Memory
              </Badge>
              <div className="flex-1 h-px bg-border" />
            </div>
            <p className="text-sm leading-relaxed text-foreground/80">
              LEANN, our semantic search system, indexed{' '}
              <span className="font-semibold text-secondary">{services.leann?.notes_count || 0} documents</span>,
              building a neural network of knowledge. The Zettelkasten expanded with{' '}
              <span className="font-semibold text-brand-emerald-600">{zettelkasten.notes_count} interconnected notes</span>
              {zettelkasten.daily_growth > 0 && (
                <span> (+{zettelkasten.daily_growth} today)</span>
              )}.
            </p>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-orange-500/10 text-orange-500">
                Chapter III: The Operational Pulse
              </Badge>
              <div className="flex-1 h-px bg-border" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">CPU</div>
                <Progress value={system.cpu.percent} className="h-2" />
                <div className="text-xs font-medium">{system.cpu.percent.toFixed(1)}%</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Memory</div>
                <Progress value={system.memory.percent} className="h-2" />
                <div className="text-xs font-medium">{system.memory.percent.toFixed(1)}%</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Disk</div>
                <Progress value={system.disk.percent} className="h-2" />
                <div className="text-xs font-medium">{system.disk.percent.toFixed(1)}%</div>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-foreground/80">
              For <span className="font-semibold text-brand-sapphire-600">{formatUptime(summary.uptime_hours)}</span> the system has been
              running uninterrupted, processing <span className="font-semibold">{system.processes} processes</span> with
              health classified as <Badge variant="outline" className="text-brand-emerald-600">{summary.system_health}</Badge>.
            </p>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-brand-purple-500/10 text-brand-purple-500">
                Chapter IV: Continuous Evolution
              </Badge>
              <div className="flex-1 h-px bg-border" />
            </div>
            <p className="text-sm leading-relaxed text-foreground/80">
              Every interaction feeds the collective learning. With{' '}
              <span className="font-semibold text-brand-purple-600">{summary.tasks_completed_today} tasks completed today</span>,
              the system evolves continuously, refining decision patterns and raising its operational efficiency.
              This narrative rewrites itself every cycle, a symphony of code and intelligence.
            </p>
          </section>
        </CardContent>
      </Card>

      {/* System health status */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <span className="text-sm font-medium">System</span>
            <Badge variant={summary.system_health === 'excellent' ? 'default' : 'secondary'}>
              {summary.system_health}
            </Badge>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">Uptime</span>
            <span className="text-sm text-muted-foreground">{formatUptime(summary.uptime_hours)}</span>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            <span className="text-sm font-medium">Auto-Heal</span>
            <span className="text-sm font-semibold text-brand-emerald-600">{auto_healing.success_rate}%</span>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            <span className="text-sm font-medium">Connected</span>
            <div className="w-2 h-2 bg-brand-emerald-500 rounded-full" />
          </div>
        </Card>
      </div>
    </div>
  );
}