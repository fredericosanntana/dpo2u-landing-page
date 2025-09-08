/**
 * Tab "Narrativa" - História viva do sistema com métricas reais
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

        <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Users className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">{summary.active_agents}/{summary.total_agents}</div>
                <div className="text-sm text-muted-foreground">Agentes Ativos</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Narrativa Dinâmica */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            A História Viva do Sistema DPO2U
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                Capítulo I: O Cérebro IA
              </Badge>
              <div className="flex-1 h-px bg-border" />
            </div>
            <p className="text-sm leading-relaxed text-foreground/80">
              No coração do sistema DPO2U pulsa uma inteligência artificial distribuída. Com{' '}
              <span className="font-semibold text-primary">{summary.total_agents} agentes especializados</span>,
              dos quais <span className="font-semibold text-green-600">{summary.active_agents} estão ativos</span>,
              o sistema mantém uma taxa de auto-cura impressionante de{' '}
              <span className="font-semibold text-primary">{auto_healing.success_rate}%</span>.
            </p>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-secondary/10 text-secondary">
                Capítulo II: A Memória Coletiva
              </Badge>
              <div className="flex-1 h-px bg-border" />
            </div>
            <p className="text-sm leading-relaxed text-foreground/80">
              O LEANN, nosso sistema de busca semântica, indexou{' '}
              <span className="font-semibold text-secondary">{services.leann?.notes_count || 0} documentos</span>,
              criando uma rede neural de conhecimento. O Zettelkasten expandiu com{' '}
              <span className="font-semibold text-green-600">{zettelkasten.notes_count} notas interconectadas</span>
              {zettelkasten.daily_growth > 0 && (
                <span> (+{zettelkasten.daily_growth} hoje)</span>
              )}.
            </p>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-orange-500/10 text-orange-500">
                Capítulo III: O Pulso Operacional
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
                <div className="text-xs text-muted-foreground">Memória</div>
                <Progress value={system.memory.percent} className="h-2" />
                <div className="text-xs font-medium">{system.memory.percent.toFixed(1)}%</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Disco</div>
                <Progress value={system.disk.percent} className="h-2" />
                <div className="text-xs font-medium">{system.disk.percent.toFixed(1)}%</div>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-foreground/80">
              Há <span className="font-semibold text-blue-600">{formatUptime(summary.uptime_hours)}</span> o sistema opera
              ininterruptamente, processando <span className="font-semibold">{system.processes} processos</span> com
              saúde classificada como <Badge variant="outline" className="text-green-600">{summary.system_health}</Badge>.
            </p>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-purple-500/10 text-purple-500">
                Capítulo IV: A Evolução Contínua
              </Badge>
              <div className="flex-1 h-px bg-border" />
            </div>
            <p className="text-sm leading-relaxed text-foreground/80">
              Cada interação alimenta o aprendizado coletivo. Com{' '}
              <span className="font-semibold text-purple-600">{summary.tasks_completed_today} tarefas completadas hoje</span>,
              o sistema evolui continuamente, refinando padrões de decisão e elevando sua eficiência operacional.
              Esta narrativa se reescreve a cada ciclo, uma sinfonia de código e inteligência.
            </p>
          </section>
        </CardContent>
      </Card>

      {/* Status da Saúde do Sistema */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <span className="text-sm font-medium">Sistema</span>
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
            <span className="text-sm font-semibold text-green-600">{auto_healing.success_rate}%</span>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            <span className="text-sm font-medium">Conectado</span>
            <div className="w-2 h-2 bg-green-500 rounded-full" />
          </div>
        </Card>
      </div>
    </div>
  );
}