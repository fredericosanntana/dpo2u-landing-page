/**
 * API Gateway TypeScript Definitions
 * Complete type definitions for all API Gateway endpoints
 */

// System Metrics
export interface SystemMetrics {
  cpu: number;
  memory: number;
  disk: number;
  processes: number;
  timestamp: string;
}

// Uptime Information
export interface UptimeInfo {
  days: number;
  hours: number;
  minutes: number;
  formatted: string;
  total_seconds: number;
}

// Active Agents
export interface ActiveAgents {
  count: number;
  agents: string[];
  total_registered: number;
}

// Response Time Metrics
export interface ResponseTimeMetrics {
  average: number;
  min: number;
  max: number;
  unit: string;
}

// LEANN Status
export interface LEANNStatus {
  documents_indexed: number;
  queries_today: number;
  status: 'online' | 'offline';
  memory_mb?: number;
  has_index?: boolean;
  vault_path?: string;
}

// Task Queue Status
export interface TaskQueueStatus {
  queue_length: number;
  completed_today: number;
  running: number;
  ready: number;
  total: number;
  pending: number;
  completed: number;
  failed: number;
}

// Workflow Status
export interface WorkflowStatus {
  completed: number;
  running: number;
  total: number;
  recent: Array<{
    id: string;
    type: string;
    status: string;
    timestamp: string;
  }>;
}

// Disk Usage
export interface DiskUsage {
  total_gb: number;
  used_gb: number;
  free_gb: number;
  percent: number;
}

// Network Statistics
export interface NetworkStats {
  bytes_in: number;
  bytes_out: number;
  packets_in: number;
  packets_out: number;
  formatted: {
    bytes_in: string;
    bytes_out: string;
  };
}

// Load Average
export interface LoadAverage {
  '1min': number;
  '5min': number;
  '15min': number;
}

// Process Statistics
export interface ProcessStats {
  total: number;
  running: number;
  sleeping: number;
}

// Complete Dashboard Response
export interface CompleteDashboard {
  cpu: number;
  memory: number;
  uptime: UptimeInfo;
  active_agents: ActiveAgents;
  response_time: ResponseTimeMetrics;
  leann_search: LEANNStatus;
  tasks: TaskQueueStatus;
  workflows: WorkflowStatus;
  disk_usage: DiskUsage;
  network: NetworkStats;
  load_average: LoadAverage;
  processes: ProcessStats;
  error_rate: number;
  timestamp: string;
}

// Performance Metrics
export interface PerformanceMetrics {
  throughput: {
    value: number;
    unit: string;
    max_recorded: number;
  };
  latency: {
    average: number;
    p95: number;
    p99: number;
    unit: string;
  };
  uptime: {
    percentage: number;
    hours: number;
    downtime_minutes: number;
  };
  error_rate: {
    percentage: number;
    errors: number;
    total_requests: number;
  };
  timestamp: string;
}

// Agent Details
export interface AgentDetail {
  name: string;
  level: number;
  performance: number;
  tasks_completed: number;
  status: 'active' | 'idle';
  specialization: string;
  script_path?: string;
  functional?: boolean;
}

// Agent Detailed Metrics
export interface AgentDetailedMetrics {
  agents_active: {
    current: number;
    total: number;
    ratio: string;
  };
  agents: AgentDetail[];
  summary: {
    active: number;
    idle: number;
    total_tasks: number;
    avg_performance: number;
  };
  timestamp: string;
}

// Agent Factory Status
export interface AgentFactoryStatus {
  pool: {
    current: number;
    capacity: number;
    utilization: number;
    available: number;
  };
  spawn: {
    rate: number;
    unit: string;
    total_spawned_today: number;
    scaling: string;
  };
  performance: {
    avg_spawn_time: number;
    success_rate: number;
    failed_spawns: number;
  };
  timestamp: string;
}

// Agent Specializations
export interface AgentSpecializations {
  specializations: {
    [key: string]: {
      active: number;
      agents: string[];
      percentage?: number;
      utilization?: number;
    };
  };
  summary: {
    total_active: number;
    total_types: number;
    most_active: string;
    least_active: string;
  };
  timestamp: string;
}

// Active Tasks Metrics
export interface ActiveTasksMetrics {
  active_tasks: {
    queued: number;
    processing: number;
    completed: number;
    total: number;
  };
  performance: {
    avg_processing_time: number;
    min_time: number;
    max_time: number;
    unit: string;
  };
  throughput: {
    tasks_per_hour: number;
    completion_rate: number;
  };
  timestamp: string;
}

// Health Check Response
export interface HealthCheck {
  status: 'healthy' | 'degraded' | 'unhealthy';
  services: {
    leann: boolean;
    orchestrator: boolean;
    docker: boolean;
  };
  timestamp: string;
}

// API Response Wrapper
export interface APIResponse<T> {
  status: 'success' | 'error' | 'no_data';
  data?: T;
  error?: string;
  message?: string;
  timestamp?: string;
}