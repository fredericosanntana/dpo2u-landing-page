export interface Agent {
  id: string;
  name: string;
  type: string;
  domain: string;
  category: 'development' | 'devops' | 'security' | 'design' | 'documentation' | 'architecture' | 'management' | 'general' | 'orchestration';
  description: string;
  capabilities: string[];
  status: 'available' | 'busy' | 'offline';
  averageExecutionTime: number; // seconds
  successRate: number; // percentage
}

export interface Task {
  id: string;
  agentId: string;
  prompt: string;
  description?: string;
  status: 'pending' | 'queued' | 'running' | 'completed' | 'failed';
  progress: number; // 0-100
  output: string[];
  startTime?: Date;
  endTime?: Date;
  estimatedCompletion?: Date;
  leannContext?: SemanticResult[];
}

export interface SemanticResult {
  id: string;
  content: string;
  relevanceScore: number;
  source: string;
  metadata?: Record<string, unknown>;
}

export interface TaskExecution {
  taskId: string;
  agent: Agent;
  status: 'queued' | 'running' | 'completed' | 'failed';
  progress: number;
  output: string[];
  startTime: Date;
  endTime?: Date;
  estimatedCompletion?: Date;
}

export interface WebSocketMessage {
  type: 'task_update' | 'task_output' | 'agent_status' | 'ping' | 'pong';
  data: unknown;
  timestamp: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  estimatedTimeSeconds: number;
  agentId: string;
  agentName: string;
}