"use client";

import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  RefreshCw, 
  AlertCircle, 
  CheckCircle2, 
  Activity, 
  Zap,
  Server,
  Brain,
  Network
} from "lucide-react";

// Import do novo hook e componentes
import { useMetricsAPI } from "@/hooks/useMetricsAPI";
import { NarrativaTab, AgentesTab, OperacaoTab } from "./components";

export default function StoryPage() {
  const { data, isLoading, error, refresh } = useMetricsAPI();

  useEffect(() => {
    console.log("DPO2U /story mounted - Real API connection established");
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
          <p className="text-muted-foreground">Conectando ao sistema multiagente...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Erro de Conexão
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Não foi possível conectar à API do sistema multiagente.
            </p>
            <p className="text-xs text-muted-foreground">
              Erro: {error}
            </p>
            <Button onClick={refresh} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Tentar Novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Nenhum dado disponível</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8 space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                DPO2U — Sistema Multiagente
              </h1>
              <p className="text-muted-foreground max-w-2xl">
                Uma narrativa viva do ecossistema híbrido: IA Brain → Orquestração → Execução → Operação.
                Conectado em tempo real ao API Gateway.
              </p>
            </div>
            
            <Button 
              onClick={refresh} 
              variant="outline" 
              size="sm"
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Atualizar
            </Button>
          </div>

          {/* Status de Conexão */}
          <div className="flex items-center gap-4">
            <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Conectado
            </Badge>
            <Badge variant="outline">
              <Activity className="h-3 w-3 mr-1" />
              Auto-refresh: 30s
            </Badge>
            <Badge variant="outline">
              <Server className="h-3 w-3 mr-1" />
              {data.summary.total_agents} Agentes
            </Badge>
            <Badge variant="outline">
              <Network className="h-3 w-3 mr-1" />
              Última atualização: {new Date(data.timestamp).toLocaleTimeString()}
            </Badge>
          </div>
        </div>

        {/* KPIs Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-lg font-bold">{data.auto_healing.success_rate}%</div>
                  <div className="text-xs text-muted-foreground">Auto-Healing</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <Activity className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <div className="text-lg font-bold">{data.summary.active_agents}/{data.summary.total_agents}</div>
                  <div className="text-xs text-muted-foreground">Agentes</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Activity className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <div className="text-lg font-bold">{data.system.cpu.percent.toFixed(1)}%</div>
                  <div className="text-xs text-muted-foreground">CPU</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <Activity className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <div className="text-lg font-bold">{data.system.memory.percent.toFixed(1)}%</div>
                  <div className="text-xs text-muted-foreground">Memória</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/10 rounded-lg">
                  <Brain className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <div className="text-lg font-bold">{data.zettelkasten.notes_count}</div>
                  <div className="text-xs text-muted-foreground">Notas Zet.</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Principais */}
        <Tabs defaultValue="narrativa" className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-12">
            <TabsTrigger value="narrativa" className="text-sm">
              <Brain className="h-4 w-4 mr-2" />
              Narrativa
            </TabsTrigger>
            <TabsTrigger value="agentes" className="text-sm">
              <Activity className="h-4 w-4 mr-2" />
              Agentes ({data.summary.total_agents})
            </TabsTrigger>
            <TabsTrigger value="operacao" className="text-sm">
              <Server className="h-4 w-4 mr-2" />
              Operação
            </TabsTrigger>
          </TabsList>

          <TabsContent value="narrativa" className="mt-6">
            <NarrativaTab data={data} />
          </TabsContent>

          <TabsContent value="agentes" className="mt-6">
            <AgentesTab data={data} />
          </TabsContent>

          <TabsContent value="operacao" className="mt-6">
            <OperacaoTab data={data} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
