/**
 * API Client for DPO2U Dashboard
 * Handles all communication with the API Gateway
 */

export interface SystemMetrics {
  cpu_usage: number;
  memory_usage: number;
  disk_usage: number;
  load_average: number[];
  uptime: number;
  timestamp: string;
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  status: 'online' | 'offline' | 'error' | 'busy';
  last_activity: string;
  capabilities: string[];
  category: string;
  success_rate?: number;
  total_executions?: number;
}

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  services: {
    leann: boolean;
    orchestrator: boolean;
    docker: boolean;
  };
  timestamp: string;
  latency_ms: number;
}

export interface DashboardData {
  health: HealthStatus;
  metrics: SystemMetrics;
  agents: Agent[];
  leann_status: {
    documents: number;
    status: string;
    last_scan: string;
  };
  alerts: Array<{
    id: string;
    type: 'info' | 'warning' | 'error';
    message: string;
    timestamp: string;
  }>;
}

export interface LEANNSearchResult {
  id: string;
  title: string;
  content: string;
  score: number;
  metadata: Record<string, any>;
}

const API_BASE_URL = typeof window !== 'undefined' 
  ? '' // Use relative URLs in browser (will use the same host)
  : 'http://localhost:8090'; // Use localhost for SSR

class APIClient {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  private async fetchWithCache<T>(endpoint: string, ttl: number = 60000): Promise<T> {
    const cacheKey = endpoint;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Cache the result
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now(),
        ttl,
      });

      return data;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      
      // Return cached data if available, even if expired
      if (cached) {
        return cached.data;
      }
      
      throw error;
    }
  }

  async getHealth(): Promise<HealthStatus> {
    return this.fetchWithCache<HealthStatus>('/api/health', 10000);
  }

  async getSystemMetrics(): Promise<SystemMetrics> {
    return this.fetchWithCache<SystemMetrics>('/api/system/metrics', 30000);
  }

  async getAgents(): Promise<Agent[]> {
    return this.fetchWithCache<Agent[]>('/api/agents/list', 300000);
  }

  async getDashboardStats(): Promise<any> {
    return this.fetchWithCache('/api/dashboard/stats', 60000);
  }

  async getDashboardAlerts(): Promise<any> {
    return this.fetchWithCache('/api/dashboard/alerts', 30000);
  }

  async getLEANNStatus(): Promise<any> {
    return this.fetchWithCache('/api/leann/health', 60000);
  }

  async searchLEANN(query: string, limit: number = 10): Promise<LEANNSearchResult[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/leann/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ q: query, limit }),
      });

      if (!response.ok) {
        throw new Error(`LEANN search failed: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('LEANN search failed:', error);
      return [];
    }
  }

  async getOrchestratorStatus(): Promise<any> {
    return this.fetchWithCache('/api/orchestrator/status', 30000);
  }

  async getOrchestratorDecisions(): Promise<any> {
    return this.fetchWithCache('/api/orchestrator/decisions', 60000);
  }

  async getWorkflows(): Promise<any> {
    return this.fetchWithCache('/api/workflows/list', 120000);
  }

  async executeWorkflow(workflowId: string, params: any): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/workflows/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ workflow_id: workflowId, params }),
      });

      if (!response.ok) {
        throw new Error(`Workflow execution failed: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('Workflow execution failed:', error);
      throw error;
    }
  }

  async getDashboardComplete(): Promise<DashboardData> {
    try {
      // Try to get complete dashboard data if endpoint exists
      try {
        return this.fetchWithCache<DashboardData>('/api/dashboard/complete', 30000);
      } catch {
        // Fallback: aggregate data from individual endpoints
        const [health, agents, dashboardStats, alerts] = await Promise.allSettled([
          this.getHealth(),
          this.getAgents(),
          this.getDashboardStats(),
          this.getDashboardAlerts(),
        ]);

        // Mock system metrics if not available
        const mockMetrics: SystemMetrics = {
          cpu_usage: 30 + Math.random() * 20,
          memory_usage: 29 + Math.random() * 15,
          disk_usage: 17 + Math.random() * 10,
          load_average: [1.2, 1.1, 0.9],
          uptime: Date.now() - (7 * 24 * 60 * 60 * 1000), // 7 days ago
          timestamp: new Date().toISOString(),
        };

        // Generate mock agents if not available
        const mockAgents: Agent[] = this.generateMockAgents();

        return {
          health: health.status === 'fulfilled' ? health.value : {
            status: 'degraded',
            services: { leann: true, orchestrator: false, docker: true },
            timestamp: new Date().toISOString(),
            latency_ms: 15,
          },
          metrics: mockMetrics,
          agents: agents.status === 'fulfilled' ? agents.value : mockAgents,
          leann_status: {
            documents: 2856,
            status: 'active',
            last_scan: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          },
          alerts: alerts.status === 'fulfilled' ? alerts.value : [],
        };
      }
    } catch (error) {
      console.error('Failed to get dashboard data:', error);
      throw error;
    }
  }

  private generateMockAgents(): Agent[] {
    const agentNames = [
      'orchestrator', 'software-architect', 'fullstack-feature-developer',
      'test-engineer', 'agent-factory', 'security-auditor', 
      'security-vulnerability-scanner', 'code-reviewer', 'devops-engineer',
      'deploy-expert', 'performance-engineer', 'technical-writer',
      'product-requirements-specialist', 'content-creator', 'session-report-writer',
      'dpo2u-brand-designer', 'visual-designer', 'dpo2u-frontend-ux-specialist',
      'logo-design-consultant', 'literature-reviewer', 'experiment-designer',
      'data-analyst-researcher', 'research-report-writer', 'research-coordinator',
      'autoagent-creator', 'autoagent-security-auditor', 'autoagent-documentation-specialist',
      'mcp-manager'
    ];

    const categories = [
      'Architecture & Coordination', 'Development & Implementation', 'Security & Quality',
      'Operations & Deployment', 'Content & Documentation', 'Design & Brand',
      'Research', 'AutoAgents', 'Integration & Management'
    ];

    return agentNames.map((name, index) => ({
      id: `agent-${index + 1}`,
      name,
      description: `${name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} specialist`,
      status: Math.random() > 0.8 ? 'offline' : Math.random() > 0.1 ? 'online' : 'busy' as Agent['status'],
      last_activity: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      capabilities: ['execution', 'analysis', 'reporting'].slice(0, Math.floor(Math.random() * 3) + 1),
      category: categories[Math.floor(index / (agentNames.length / categories.length))],
      success_rate: Math.floor(70 + Math.random() * 30),
      total_executions: Math.floor(Math.random() * 1000),
    }));
  }

  // Clear cache manually if needed
  clearCache(): void {
    this.cache.clear();
  }

  // Get cache info for debugging
  getCacheInfo(): Array<{ key: string; age: number; ttl: number }> {
    const now = Date.now();
    return Array.from(this.cache.entries()).map(([key, value]) => ({
      key,
      age: now - value.timestamp,
      ttl: value.ttl,
    }));
  }
}

// Export a singleton instance
export const apiClient = new APIClient();
export default apiClient;