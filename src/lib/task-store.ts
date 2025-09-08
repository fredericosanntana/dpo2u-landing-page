// Global Task Store for Real-Time Data Management
import { create } from 'zustand'
import { TaskExecution } from '@/types/task-agent'

interface TaskStats {
  totalAgents: number
  availableAgents: number
  activeExecutions: number
  completedToday: number
  totalCompleted: number
  totalFailed: number
  averageExecutionTime: number
  tasksPerMinute?: number
}

interface TaskStore {
  // Task executions
  activeExecutions: TaskExecution[]
  completedExecutions: TaskExecution[]
  failedExecutions: TaskExecution[]
  
  // Statistics
  stats: TaskStats
  
  // Performance metrics (real data)
  performanceMetrics: {
    cpuUsage: number
    memoryUsage: number
    tasksPerMinute: number
    avgResponseTime: number
    systemLoad: number
    successRate: number
    errorRate: number
  }
  
  // Actions
  addExecution: (execution: TaskExecution) => void
  updateExecution: (taskId: string, updates: Partial<TaskExecution>) => void
  completeExecution: (taskId: string) => void
  failExecution: (taskId: string, error: string) => void
  updatePerformanceMetrics: (metrics: Partial<TaskStore['performanceMetrics']>) => void
  getRealtimeStats: () => TaskStats
  resetDailyStats: () => void
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  // Initial state
  activeExecutions: [],
  completedExecutions: [],
  failedExecutions: [],
  
  stats: {
    totalAgents: 28, // Updated based on registered agents
    availableAgents: 28,
    activeExecutions: 0,
    completedToday: 0,
    totalCompleted: 0,
    totalFailed: 0,
    averageExecutionTime: 0
  },
  
  performanceMetrics: {
    cpuUsage: 0,
    memoryUsage: 0,
    tasksPerMinute: 0,
    avgResponseTime: 0,
    systemLoad: 0,
    successRate: 100,
    errorRate: 0
  },
  
  // Add new execution
  addExecution: (execution) => set((state) => {
    const now = new Date()
    const executionWithTime = { ...execution, startTime: execution.startTime || now }
    
    return {
      activeExecutions: [...state.activeExecutions, executionWithTime],
      stats: {
        ...state.stats,
        activeExecutions: state.stats.activeExecutions + 1,
        availableAgents: Math.max(0, state.stats.availableAgents - 1)
      }
    }
  }),
  
  // Update existing execution
  updateExecution: (taskId, updates) => set((state) => ({
    activeExecutions: state.activeExecutions.map(exec =>
      exec.taskId === taskId ? { ...exec, ...updates } : exec
    )
  })),
  
  // Complete execution
  completeExecution: (taskId) => set((state) => {
    const execution = state.activeExecutions.find(e => e.taskId === taskId)
    if (!execution) return state
    
    const completed = { ...execution, status: 'completed' as const, endTime: new Date() }
    const executionTime = execution.startTime 
      ? (new Date().getTime() - new Date(execution.startTime).getTime()) / 1000
      : 0
    
    // Update average execution time
    const totalExecutions = state.stats.totalCompleted + 1
    const newAvgTime = (state.stats.averageExecutionTime * state.stats.totalCompleted + executionTime) / totalExecutions
    
    return {
      activeExecutions: state.activeExecutions.filter(e => e.taskId !== taskId),
      completedExecutions: [...state.completedExecutions, completed],
      stats: {
        ...state.stats,
        activeExecutions: Math.max(0, state.stats.activeExecutions - 1),
        availableAgents: Math.min(22, state.stats.availableAgents + 1),
        completedToday: state.stats.completedToday + 1,
        totalCompleted: totalExecutions,
        averageExecutionTime: newAvgTime
      },
      performanceMetrics: {
        ...state.performanceMetrics,
        successRate: (totalExecutions / (totalExecutions + state.stats.totalFailed)) * 100,
        errorRate: (state.stats.totalFailed / (totalExecutions + state.stats.totalFailed)) * 100
      }
    }
  }),
  
  // Fail execution
  failExecution: (taskId, error) => set((state) => {
    const execution = state.activeExecutions.find(e => e.taskId === taskId)
    if (!execution) return state
    
    const failed = { ...execution, status: 'failed' as const, error, endTime: new Date() }
    const totalAttempts = state.stats.totalCompleted + state.stats.totalFailed + 1
    
    return {
      activeExecutions: state.activeExecutions.filter(e => e.taskId !== taskId),
      failedExecutions: [...state.failedExecutions, failed],
      stats: {
        ...state.stats,
        activeExecutions: Math.max(0, state.stats.activeExecutions - 1),
        availableAgents: Math.min(22, state.stats.availableAgents + 1),
        totalFailed: state.stats.totalFailed + 1
      },
      performanceMetrics: {
        ...state.performanceMetrics,
        successRate: (state.stats.totalCompleted / totalAttempts) * 100,
        errorRate: ((state.stats.totalFailed + 1) / totalAttempts) * 100
      }
    }
  }),
  
  // Update performance metrics with real data
  updatePerformanceMetrics: (metrics) => set((state) => ({
    performanceMetrics: {
      ...state.performanceMetrics,
      ...metrics
    }
  })),
  
  // Get real-time statistics
  getRealtimeStats: () => {
    const state = get()
    
    // Calculate tasks per minute based on recent completions
    const recentCompletions = state.completedExecutions.filter(e => {
      if (!e.endTime) return false
      const endTime = new Date(e.endTime).getTime()
      const oneMinuteAgo = Date.now() - 60000
      return endTime > oneMinuteAgo
    })
    
    return {
      ...state.stats,
      tasksPerMinute: recentCompletions.length
    }
  },
  
  // Reset daily statistics (can be called at midnight)
  resetDailyStats: () => set((state) => ({
    stats: {
      ...state.stats,
      completedToday: 0
    }
  }))
}))