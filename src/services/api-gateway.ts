/**
 * API Gateway Service
 * Centralized service for all API Gateway communications
 */

import type {
  CompleteDashboard,
  PerformanceMetrics,
  AgentDetailedMetrics,
  AgentFactoryStatus,
  AgentSpecializations,
  ActiveTasksMetrics,
  HealthCheck,
  LEANNStatus,
  TaskQueueStatus,
  WorkflowStatus,
  UptimeInfo,
  ActiveAgents,
  DiskUsage,
  NetworkStats,
  LoadAverage,
  ProcessStats
} from '@/types/api-gateway';

class APIGatewayService {
  private baseURL: string;
  private timeout: number;
  private maxRetries: number;
  private cacheEnabled: boolean;
  private cache: Map<string, { data: any; timestamp: number }>;
  private cacheTTL: number;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:8090';
    this.timeout = parseInt(process.env.API_REQUEST_TIMEOUT || '5000');
    this.maxRetries = parseInt(process.env.MAX_RETRIES || '3');
    this.cacheEnabled = process.env.ENABLE_API_CACHE === 'true';
    this.cacheTTL = parseInt(process.env.CACHE_TTL || '60000');
    this.cache = new Map();
  }

  /**
   * Fetch with retry logic and timeout
   */
  private async fetchWithRetry(url: string, options: RequestInit = {}): Promise<Response> {
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt < this.maxRetries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);
        
        const response = await fetch(url, {
          ...options,
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok && response.status >= 500) {
          throw new Error(`Server error: ${response.status}`);
        }
        
        return response;
      } catch (error) {
        lastError = error as Error;
        
        // Don't retry on client errors
        if (error instanceof Error && error.message.includes('4')) {
          throw error;
        }
        
        // Exponential backoff
        if (attempt < this.maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      }
    }
    
    throw lastError || new Error('Max retries exceeded');
  }

  /**
   * Get from cache if available and not expired
   */
  private getCached<T>(key: string): T | null {
    if (!this.cacheEnabled) return null;
    
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    const now = Date.now();
    if (now - cached.timestamp > this.cacheTTL) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data as T;
  }

  /**
   * Set cache
   */
  private setCache(key: string, data: any): void {
    if (!this.cacheEnabled) return;
    
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  /**
   * Generic GET request (public for hook usage)
   */
  public async get<T>(endpoint: string, useCache = true): Promise<T> {
    const cacheKey = `GET:${endpoint}`;
    
    // Check cache
    if (useCache) {
      const cached = this.getCached<T>(cacheKey);
      if (cached) return cached;
    }
    
    const url = `${this.baseURL}${endpoint}`;
    const response = await this.fetchWithRetry(url);
    const data = await response.json();
    
    // Cache successful responses
    if (useCache) {
      this.setCache(cacheKey, data);
    }
    
    return data as T;
  }

  /**
   * Generic POST request
   */
  private async post<T>(endpoint: string, body: any): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const response = await this.fetchWithRetry(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    
    return response.json() as Promise<T>;
  }

  // =================== Dashboard Endpoints ===================

  async getDashboardComplete(): Promise<CompleteDashboard> {
    return this.get<CompleteDashboard>('/api/dashboard/complete');
  }

  async getSystemHealth(): Promise<HealthCheck> {
    return this.get<HealthCheck>('/api/health');
  }

  async getSystemUptime(): Promise<UptimeInfo> {
    return this.get<UptimeInfo>('/api/system/uptime');
  }

  async getDiskUsage(): Promise<DiskUsage> {
    return this.get<DiskUsage>('/api/system/disk');
  }

  async getNetworkStats(): Promise<NetworkStats> {
    return this.get<NetworkStats>('/api/system/network');
  }

  async getLoadAverage(): Promise<LoadAverage> {
    return this.get<LoadAverage>('/api/system/load');
  }

  async getProcessStats(): Promise<ProcessStats> {
    return this.get<ProcessStats>('/api/system/processes');
  }

  // =================== Performance Endpoints ===================

  async getPerformanceMetrics(): Promise<PerformanceMetrics> {
    return this.get<PerformanceMetrics>('/api/performance/metrics');
  }

  async getThroughput(): Promise<PerformanceMetrics['throughput']> {
    return this.get<PerformanceMetrics['throughput']>('/api/performance/throughput');
  }

  async getLatency(): Promise<PerformanceMetrics['latency']> {
    return this.get<PerformanceMetrics['latency']>('/api/performance/latency');
  }

  async getUptimeMetrics(): Promise<PerformanceMetrics['uptime']> {
    return this.get<PerformanceMetrics['uptime']>('/api/performance/uptime');
  }

  async getActiveTasksMetrics(): Promise<ActiveTasksMetrics> {
    return this.get<ActiveTasksMetrics>('/api/performance/tasks');
  }

  // =================== Agent Endpoints ===================

  async getAgentsDetailed(): Promise<AgentDetailedMetrics> {
    return this.get<AgentDetailedMetrics>('/api/agents/detailed');
  }

  async getActiveAgents(): Promise<ActiveAgents> {
    return this.get<ActiveAgents>('/api/agents/active');
  }

  async getAgentFactoryStatus(): Promise<AgentFactoryStatus> {
    return this.get<AgentFactoryStatus>('/api/agents/factory');
  }

  async getAgentSpecializations(): Promise<AgentSpecializations> {
    return this.get<AgentSpecializations>('/api/agents/specializations');
  }

  async getAgentPerformanceHistory(): Promise<any> {
    return this.get<any>('/api/agents/performance-history');
  }

  async getSpecificAgentMetrics(agentName: string): Promise<any> {
    return this.get<any>(`/api/agents/${agentName}/metrics`);
  }

  async executeAgent(agent: string, description: string, prompt: string): Promise<any> {
    return this.post('/api/agents/execute', { agent, description, prompt });
  }

  // =================== Task Endpoints ===================

  async getTaskQueue(): Promise<TaskQueueStatus> {
    return this.get<TaskQueueStatus>('/api/tasks/queue');
  }

  async getTaskMasterTasks(): Promise<any> {
    return this.get<any>('/api/taskmaster/tasks');
  }

  async executeTask(taskId: number): Promise<any> {
    return this.post(`/api/taskmaster/task/${taskId}/execute`, {});
  }

  // =================== Workflow Endpoints ===================

  async getWorkflowStatus(): Promise<WorkflowStatus> {
    return this.get<WorkflowStatus>('/api/workflows/status');
  }

  // =================== LEANN Endpoints ===================

  async getLEANNStatus(): Promise<LEANNStatus> {
    return this.get<LEANNStatus>('/api/leann/status');
  }

  // =================== Logs Endpoints ===================

  async getSessionLogs(): Promise<any> {
    return this.get<any>('/api/logs/sessions');
  }

  async getSystemLogs(): Promise<any> {
    return this.get<any>('/api/logs/system');
  }

  async getAllReports(): Promise<any> {
    return this.get<any>('/api/logs/reports');
  }

  // =================== Learning Endpoints ===================

  async getLearningStatus(): Promise<any> {
    return this.get<any>('/api/learning/status');
  }

  // =================== ML Endpoints ===================

  async getMLMetrics(): Promise<any> {
    return this.get<any>('/api/ml/metrics');
  }

  async getMLPatterns(): Promise<any> {
    return this.get<any>('/api/ml/patterns');
  }

  async predictML(input: any): Promise<any> {
    return this.post('/api/ml/predict', input);
  }

  // =================== Stats Endpoints ===================

  async getStatsSummary(): Promise<any> {
    return this.get<any>('/api/stats/summary');
  }

  // =================== Utility Methods ===================

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get cache size
   */
  getCacheSize(): number {
    return this.cache.size;
  }

  /**
   * Check if API Gateway is reachable
   */
  async isReachable(): Promise<boolean> {
    try {
      const health = await this.getSystemHealth();
      return health.status !== 'unhealthy';
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const apiGateway = new APIGatewayService();

// Export class for testing
export default APIGatewayService;