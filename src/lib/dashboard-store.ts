/**
 * Dashboard State Management Store using Zustand
 */

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { apiClient, DashboardData, Agent, SystemMetrics, HealthStatus } from './api-client';

export interface DashboardState {
  // Data state
  dashboardData: DashboardData | null;
  agents: Agent[];
  metrics: SystemMetrics | null;
  health: HealthStatus | null;
  
  // UI state
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  autoRefresh: boolean;
  refreshInterval: number; // milliseconds
  
  // Filter and search state
  agentFilter: string;
  agentCategoryFilter: string;
  searchQuery: string;
  
  // Selected items
  selectedAgent: Agent | null;
  
  // Actions
  fetchDashboardData: () => Promise<void>;
  refreshData: () => Promise<void>;
  setAutoRefresh: (enabled: boolean) => void;
  setRefreshInterval: (interval: number) => void;
  setAgentFilter: (filter: string) => void;
  setAgentCategoryFilter: (category: string) => void;
  setSearchQuery: (query: string) => void;
  setSelectedAgent: (agent: Agent | null) => void;
  clearError: () => void;
  
  // Computed getters
  filteredAgents: () => Agent[];
  getAgentsByCategory: () => Record<string, Agent[]>;
  getSystemStatus: () => 'healthy' | 'degraded' | 'unhealthy';
  getActiveAlertsCount: () => number;
}

export const useDashboardStore = create<DashboardState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    dashboardData: null,
    agents: [],
    metrics: null,
    health: null,
    
    loading: false,
    error: null,
    lastUpdated: null,
    autoRefresh: true,
    refreshInterval: 5000, // 5 seconds
    
    agentFilter: '',
    agentCategoryFilter: 'all',
    searchQuery: '',
    
    selectedAgent: null,
    
    // Actions
    fetchDashboardData: async () => {
      const currentState = get();
      
      if (currentState.loading) return; // Prevent concurrent requests
      
      set({ loading: true, error: null });
      
      try {
        const data = await apiClient.getDashboardComplete();
        
        set({
          dashboardData: data,
          agents: data.agents || [],
          metrics: data.metrics,
          health: data.health,
          loading: false,
          lastUpdated: new Date(),
        });
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        set({
          error: error instanceof Error ? error.message : 'Failed to fetch dashboard data',
          loading: false,
        });
      }
    },
    
    refreshData: async () => {
      const { fetchDashboardData } = get();
      apiClient.clearCache(); // Force fresh data
      await fetchDashboardData();
    },
    
    setAutoRefresh: (enabled: boolean) => {
      set({ autoRefresh: enabled });
    },
    
    setRefreshInterval: (interval: number) => {
      set({ refreshInterval: Math.max(1000, interval) }); // Minimum 1 second
    },
    
    setAgentFilter: (filter: string) => {
      set({ agentFilter: filter });
    },
    
    setAgentCategoryFilter: (category: string) => {
      set({ agentCategoryFilter: category });
    },
    
    setSearchQuery: (query: string) => {
      set({ searchQuery: query });
    },
    
    setSelectedAgent: (agent: Agent | null) => {
      set({ selectedAgent: agent });
    },
    
    clearError: () => {
      set({ error: null });
    },
    
    // Computed getters
    filteredAgents: () => {
      const { agents, agentFilter, agentCategoryFilter, searchQuery } = get();
      
      return agents.filter(agent => {
        // Text filter
        if (agentFilter && !agent.name.toLowerCase().includes(agentFilter.toLowerCase()) && 
            !agent.description.toLowerCase().includes(agentFilter.toLowerCase())) {
          return false;
        }
        
        // Category filter
        if (agentCategoryFilter !== 'all' && agent.category !== agentCategoryFilter) {
          return false;
        }
        
        // Search query
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          return agent.name.toLowerCase().includes(query) ||
                 agent.description.toLowerCase().includes(query) ||
                 agent.capabilities.some(cap => cap.toLowerCase().includes(query));
        }
        
        return true;
      });
    },
    
    getAgentsByCategory: () => {
      const { agents } = get();
      const categories: Record<string, Agent[]> = {};
      
      agents.forEach(agent => {
        if (!categories[agent.category]) {
          categories[agent.category] = [];
        }
        categories[agent.category].push(agent);
      });
      
      return categories;
    },
    
    getSystemStatus: () => {
      const { health } = get();
      return health?.status || 'unhealthy';
    },
    
    getActiveAlertsCount: () => {
      const { dashboardData } = get();
      return dashboardData?.alerts?.filter(alert => alert.type === 'error' || alert.type === 'warning').length || 0;
    },
  }))
);

// Auto-refresh hook
let refreshTimer: NodeJS.Timeout | null = null;

export const startAutoRefresh = () => {
  const store = useDashboardStore.getState();
  
  if (refreshTimer) {
    clearInterval(refreshTimer);
  }
  
  if (store.autoRefresh) {
    refreshTimer = setInterval(async () => {
      const currentState = useDashboardStore.getState();
      if (currentState.autoRefresh && !currentState.loading) {
        await currentState.fetchDashboardData();
      }
    }, store.refreshInterval);
  }
};

export const stopAutoRefresh = () => {
  if (refreshTimer) {
    clearInterval(refreshTimer);
    refreshTimer = null;
  }
};

// Subscribe to refresh interval changes
useDashboardStore.subscribe(
  (state) => state.refreshInterval,
  () => {
    if (useDashboardStore.getState().autoRefresh) {
      startAutoRefresh();
    }
  }
);

// Subscribe to auto-refresh changes
useDashboardStore.subscribe(
  (state) => state.autoRefresh,
  (autoRefresh) => {
    if (autoRefresh) {
      startAutoRefresh();
    } else {
      stopAutoRefresh();
    }
  }
);

// Utility hooks for common patterns
export const useDashboardData = () => {
  const dashboardData = useDashboardStore((state) => state.dashboardData);
  const loading = useDashboardStore((state) => state.loading);
  const error = useDashboardStore((state) => state.error);
  const lastUpdated = useDashboardStore((state) => state.lastUpdated);
  const fetchData = useDashboardStore((state) => state.fetchDashboardData);
  const refreshData = useDashboardStore((state) => state.refreshData);
  
  return {
    data: dashboardData,
    loading,
    error,
    lastUpdated,
    fetchData,
    refreshData,
  };
};

export const useAgents = () => {
  const agents = useDashboardStore((state) => state.agents);
  const filteredAgents = useDashboardStore((state) => state.filteredAgents());
  const selectedAgent = useDashboardStore((state) => state.selectedAgent);
  const setSelectedAgent = useDashboardStore((state) => state.setSelectedAgent);
  const agentsByCategory = useDashboardStore((state) => state.getAgentsByCategory());
  
  return {
    agents,
    filteredAgents,
    selectedAgent,
    setSelectedAgent,
    agentsByCategory,
  };
};

export const useSystemMetrics = () => {
  const metrics = useDashboardStore((state) => state.metrics);
  const health = useDashboardStore((state) => state.health);
  const systemStatus = useDashboardStore((state) => state.getSystemStatus());
  
  return {
    metrics,
    health,
    systemStatus,
  };
};

export const useFilters = () => {
  const agentFilter = useDashboardStore((state) => state.agentFilter);
  const agentCategoryFilter = useDashboardStore((state) => state.agentCategoryFilter);
  const searchQuery = useDashboardStore((state) => state.searchQuery);
  const setAgentFilter = useDashboardStore((state) => state.setAgentFilter);
  const setAgentCategoryFilter = useDashboardStore((state) => state.setAgentCategoryFilter);
  const setSearchQuery = useDashboardStore((state) => state.setSearchQuery);
  
  return {
    agentFilter,
    agentCategoryFilter,
    searchQuery,
    setAgentFilter,
    setAgentCategoryFilter,
    setSearchQuery,
  };
};