/**
 * Custom hook for fetching real metrics from the API endpoint
 * Connects directly to http://localhost:8097/dashboard/api/metrics
 */

import { useState, useEffect } from 'react';

export interface Agent {
  name: string;
  status: 'online' | 'offline';
  domain: string;
  expertise: string;
  type: string;
  executions: number;
  success_rate: number;
  errors: number;
  avg_duration: number;
  last_execution: string | null;
}

export interface Service {
  status: 'online' | 'offline' | 'error';
  last_check: string;
  response_time?: number;
  processes?: number;
  running?: number;
  stopped?: number;
  https_status?: string;
  notes_count?: number;
  error?: string;
}

export interface SystemMetrics {
  cpu: {
    percent: number;
    count: number;
    load_avg: {
      '1m': number;
      '5m': number;
      '15m': number;
    };
  };
  memory: {
    percent: number;
    total: number;
    used: number;
    available: number;
  };
  disk: {
    percent: number;
    total: number;
    used: number;
    free: number;
  };
  network: {
    bytes_recv: number;
    bytes_sent: number;
    packets_recv: number;
    packets_sent: number;
  };
  processes: number;
  uptime: number;
}

export interface MetricsData {
  agents: Agent[];
  auto_healing: {
    errors_detected: number;
    errors_fixed: number;
    success_rate: number;
  };
  services: {
    [key: string]: Service;
  };
  summary: {
    active_agents: number;
    offline_agents: number;
    total_agents: number;
    system_health: string;
    tasks_completed_today: number;
    uptime_hours: number;
  };
  system: SystemMetrics;
  timestamp: string;
  zettelkasten: {
    connections: number;
    daily_growth: number;
    notes_count: number;
  };
}

export function useMetricsAPI() {
  const [data, setData] = useState<MetricsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = async () => {
    try {
      const response = await fetch('/dashboard/api/metrics');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      console.error('Error fetching metrics:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch metrics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchMetrics, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return {
    data,
    isLoading,
    error,
    refresh: fetchMetrics
  };
}