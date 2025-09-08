/**
 * useAPIGateway Hook
 * Custom React hook for API Gateway integration with SWR
 */

import useSWR, { SWRConfiguration, mutate } from 'swr';
import { apiGateway } from '@/services/api-gateway';
import type { 
  CompleteDashboard,
  PerformanceMetrics,
  AgentDetailedMetrics,
  AgentFactoryStatus,
  AgentSpecializations,
  ActiveTasksMetrics,
  LEANNStatus,
  TaskQueueStatus,
  WorkflowStatus
} from '@/types/api-gateway';

// Default SWR configuration
const defaultConfig: SWRConfiguration = {
  refreshInterval: parseInt(process.env.NEXT_PUBLIC_METRICS_REFRESH_INTERVAL || '2000'),
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  dedupingInterval: 1000,
  errorRetryCount: 3,
  errorRetryInterval: 5000,
  shouldRetryOnError: (error) => {
    // Don't retry on 4xx errors
    if (error?.status >= 400 && error?.status < 500) {
      return false;
    }
    return true;
  }
};

/**
 * Generic hook for any API Gateway endpoint
 */
export function useAPIGateway<T = any>(
  endpoint: string | null,
  fetcher?: () => Promise<T>,
  config?: SWRConfiguration
) {
  const key = endpoint ? `api-gateway:${endpoint}` : null;
  
  const { data, error, isLoading, isValidating, mutate: revalidate } = useSWR<T>(
    key,
    fetcher || (endpoint ? () => apiGateway.get(endpoint) : null),
    { ...defaultConfig, ...config }
  );

  return {
    data,
    error,
    isLoading,
    isValidating,
    revalidate,
    isError: !!error
  };
}

/**
 * Hook for complete dashboard data
 */
export function useDashboardComplete(config?: SWRConfiguration) {
  return useAPIGateway<CompleteDashboard>(
    'dashboard-complete',
    () => apiGateway.getDashboardComplete(),
    config
  );
}

/**
 * Hook for performance metrics
 */
export function usePerformanceMetrics(config?: SWRConfiguration) {
  return useAPIGateway<PerformanceMetrics>(
    'performance-metrics',
    () => apiGateway.getPerformanceMetrics(),
    config
  );
}

/**
 * Hook for agent detailed metrics
 */
export function useAgentsDetailed(config?: SWRConfiguration) {
  return useAPIGateway<AgentDetailedMetrics>(
    'agents-detailed',
    () => apiGateway.getAgentsDetailed(),
    config
  );
}

/**
 * Hook for agent factory status
 */
export function useAgentFactory(config?: SWRConfiguration) {
  return useAPIGateway<AgentFactoryStatus>(
    'agent-factory',
    () => apiGateway.getAgentFactoryStatus(),
    config
  );
}

/**
 * Hook for active tasks metrics
 */
export function useActiveTasks(config?: SWRConfiguration) {
  return useAPIGateway<ActiveTasksMetrics>(
    'active-tasks',
    () => apiGateway.getActiveTasksMetrics(),
    config
  );
}

/**
 * Hook for LEANN status
 */
export function useLEANNStatus(config?: SWRConfiguration) {
  return useAPIGateway<LEANNStatus>(
    'leann-status',
    () => apiGateway.getLEANNStatus(),
    config
  );
}

/**
 * Hook for task queue status
 */
export function useTaskQueue(config?: SWRConfiguration) {
  return useAPIGateway<TaskQueueStatus>(
    'task-queue',
    () => apiGateway.getTaskQueue(),
    config
  );
}

/**
 * Hook for workflow status
 */
export function useWorkflowStatus(config?: SWRConfiguration) {
  return useAPIGateway<WorkflowStatus>(
    'workflow-status',
    () => apiGateway.getWorkflowStatus(),
    config
  );
}

/**
 * Hook for agent specializations
 */
export function useAgentSpecializations(config?: SWRConfiguration) {
  return useAPIGateway<AgentSpecializations>(
    'agent-specializations',
    () => apiGateway.getAgentSpecializations(),
    config
  );
}

/**
 * Hook for system health check
 */
export function useSystemHealth(config?: SWRConfiguration) {
  return useAPIGateway(
    'health',
    () => apiGateway.getSystemHealth(),
    { ...config, refreshInterval: 5000 } // Health check less frequently
  );
}

/**
 * Hook for real-time metrics with automatic refresh
 */
export function useRealTimeMetrics(refreshInterval = 2000) {
  const dashboard = useDashboardComplete({ refreshInterval });
  const performance = usePerformanceMetrics({ refreshInterval });
  const agents = useAgentsDetailed({ refreshInterval: refreshInterval * 2 }); // Less frequent
  const tasks = useActiveTasks({ refreshInterval });

  return {
    dashboard: dashboard.data,
    performance: performance.data,
    agents: agents.data,
    tasks: tasks.data,
    isLoading: dashboard.isLoading || performance.isLoading || agents.isLoading || tasks.isLoading,
    error: dashboard.error || performance.error || agents.error || tasks.error
  };
}

/**
 * Utility function to prefetch data
 */
export async function prefetchDashboard() {
  const data = await apiGateway.getDashboardComplete();
  mutate('api-gateway:dashboard-complete', data);
}

/**
 * Utility function to refresh all data
 */
export function refreshAllMetrics() {
  mutate((key) => typeof key === 'string' && key.startsWith('api-gateway:'));
}

/**
 * Utility function to clear cache
 */
export function clearAPICache() {
  apiGateway.clearCache();
  refreshAllMetrics();
}