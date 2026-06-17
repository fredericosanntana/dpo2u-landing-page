/**
 * Tab "Operations" — operational metrics with charts and service status
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Server, 
  Cpu, 
  MemoryStick, 
  HardDrive, 
  Network,
  Clock,
  Activity,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Zap,
  Globe,
  Database,
  Code,
  Settings
} from "lucide-react";
import { MetricsData, Service } from "@/hooks/useMetricsAPI";

interface OperacaoTabProps {
  data: MetricsData;
}

// Format bytes for display
const formatBytes = (bytes: number) => {
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 B';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
};

// Format uptime
const formatUptime = (seconds: number) => {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};

// Service icon
const getServiceIcon = (serviceName: string) => {
  switch (serviceName.toLowerCase()) {
    case 'nginx': return Globe;
    case 'pm2': return Code;
    case 'leann': return Database;
    case 'api_gateway': return Settings;
    case 'auto_healing': return Zap;
    case 'zettelkasten': return Activity;
    default: return Server;
  }
};

// Status color
const getStatusColor = (status: string) => {
  switch (status) {
    case 'online': return 'text-brand-emerald-600 bg-brand-emerald-500/10 border-brand-emerald-500/20';
    case 'offline': return 'text-red-600 bg-red-500/10 border-red-500/20';
    case 'error': return 'text-orange-600 bg-orange-500/10 border-orange-500/20';
    default: return 'text-brand-gray-600 bg-brand-gray-500/10 border-brand-gray-500/20';
  }
};

// Status icon
const getStatusIcon = (status: string) => {
  switch (status) {
    case 'online': return CheckCircle;
    case 'offline': return XCircle;
    case 'error': return AlertTriangle;
    default: return Activity;
  }
};

export function OperacaoTab({ data }: OperacaoTabProps) {
  const { system, services, summary } = data;

  return (
    <div className="space-y-6">
      {/* System metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CPU */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Cpu className="h-4 w-4 text-brand-sapphire-500" />
              CPU
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Progress value={system.cpu.percent} className="h-2" />
              <div className="flex justify-between text-xs">
                <span>{system.cpu.percent.toFixed(1)}%</span>
                <span>{system.cpu.count} cores</span>
              </div>
            </div>
            <div className="text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Load 1m:</span>
                <span>{system.cpu.load_avg['1m'].toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Load 5m:</span>
                <span>{system.cpu.load_avg['5m'].toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Load 15m:</span>
                <span>{system.cpu.load_avg['15m'].toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Memory */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <MemoryStick className="h-4 w-4 text-brand-emerald-500" />
              Memory
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Progress value={system.memory.percent} className="h-2" />
              <div className="flex justify-between text-xs">
                <span>{system.memory.percent.toFixed(1)}%</span>
                <span>{formatBytes(system.memory.total)}</span>
              </div>
            </div>
            <div className="text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Used:</span>
                <span>{formatBytes(system.memory.used)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Available:</span>
                <span>{formatBytes(system.memory.available)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Disk */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <HardDrive className="h-4 w-4 text-brand-purple-500" />
              Disk
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Progress value={system.disk.percent} className="h-2" />
              <div className="flex justify-between text-xs">
                <span>{system.disk.percent.toFixed(1)}%</span>
                <span>{formatBytes(system.disk.total)}</span>
              </div>
            </div>
            <div className="text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Used:</span>
                <span>{formatBytes(system.disk.used)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Free:</span>
                <span>{formatBytes(system.disk.free)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Network */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Network className="h-4 w-4 text-orange-500" />
              Network
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Received:</span>
                <span>{formatBytes(system.network.bytes_recv)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sent:</span>
                <span>{formatBytes(system.network.bytes_sent)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pkt Recv:</span>
                <span>{system.network.packets_recv.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pkt Sent:</span>
                <span>{system.network.packets_sent.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Service status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            Service Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(services).map(([serviceName, service]) => {
              const IconComponent = getServiceIcon(serviceName);
              const StatusIcon = getStatusIcon(service.status);
              const statusColor = getStatusColor(service.status);
              
              return (
                <Card key={serviceName} className={`p-4 border ${statusColor.includes('green') ? 'border-brand-emerald-500/20' : statusColor.includes('red') ? 'border-red-500/20' : 'border-orange-500/20'}`}>
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <IconComponent className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium capitalize">
                          {serviceName.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <Badge className={statusColor}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {service.status}
                      </Badge>
                    </div>

                    {/* Service details */}
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Last check:</span>
                        <span>{new Date(service.last_check).toLocaleTimeString()}</span>
                      </div>
                      
                      {service.response_time && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Response time:</span>
                          <span>{(service.response_time * 1000).toFixed(1)}ms</span>
                        </div>
                      )}
                      
                      {service.processes !== undefined && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Processes:</span>
                          <span>{service.processes}</span>
                        </div>
                      )}
                      
                      {service.running !== undefined && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Running:</span>
                          <span className="text-brand-emerald-600">{service.running}</span>
                        </div>
                      )}
                      
                      {service.stopped !== undefined && service.stopped > 0 && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Stopped:</span>
                          <span className="text-red-600">{service.stopped}</span>
                        </div>
                      )}
                      
                      {service.https_status && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">HTTPS:</span>
                          <span className={service.https_status === 'working' ? 'text-brand-emerald-600' : 'text-red-600'}>
                            {service.https_status}
                          </span>
                        </div>
                      )}
                      
                      {service.notes_count !== undefined && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Notes:</span>
                          <span>{service.notes_count}</span>
                        </div>
                      )}
                      
                      {service.error && (
                        <div className="text-red-600 text-xs">
                          Error: {service.error}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* System information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Clock className="h-4 w-4 text-brand-sapphire-500" />
              Uptime
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatUptime(system.uptime)}</div>
            <div className="text-xs text-muted-foreground">
              {summary.uptime_hours.toFixed(1)} hours
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Activity className="h-4 w-4 text-brand-emerald-500" />
              Processes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{system.processes}</div>
            <div className="text-xs text-muted-foreground">Total running</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-brand-emerald-500" />
              Overall Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className={`text-sm ${summary.system_health === 'excellent' ? 'bg-brand-emerald-500/10 text-brand-emerald-600' : 'bg-orange-500/10 text-orange-600'}`}>
              {summary.system_health}
            </Badge>
            <div className="text-xs text-muted-foreground mt-1">
              System operational
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent logs (placeholder) */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-brand-emerald-500" />
              <span className="text-muted-foreground">{new Date().toLocaleTimeString()}</span>
              <span>System running normally - CPU: {system.cpu.percent.toFixed(1)}%</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Activity className="h-4 w-4 text-brand-sapphire-500" />
              <span className="text-muted-foreground">{new Date(Date.now() - 60000).toLocaleTimeString()}</span>
              <span>Auto-refresh complete - {summary.active_agents} agents online</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Database className="h-4 w-4 text-brand-purple-500" />
              <span className="text-muted-foreground">{new Date(Date.now() - 120000).toLocaleTimeString()}</span>
              <span>LEANN synced - {services.leann?.notes_count || 0} documents indexed</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}