/**
 * Daily Counters
 * Simple in-memory counters for tracking daily metrics
 */

interface DailyCounter {
  count: number;
  lastReset: Date;
}

const counters: Map<string, DailyCounter> = new Map();

function getOrCreateCounter(key: string): DailyCounter {
  if (!counters.has(key)) {
    counters.set(key, {
      count: 0,
      lastReset: new Date()
    });
  }
  
  const counter = counters.get(key)!;
  
  // Reset counter if it's a new day
  const now = new Date();
  const lastReset = new Date(counter.lastReset);
  if (now.getDate() !== lastReset.getDate() || 
      now.getMonth() !== lastReset.getMonth() ||
      now.getFullYear() !== lastReset.getFullYear()) {
    counter.count = 0;
    counter.lastReset = now;
  }
  
  return counter;
}

export function incrementAgentExecutions(): number {
  const counter = getOrCreateCounter('agent_executions');
  counter.count++;
  return counter.count;
}

export function incrementTasks(): number {
  const counter = getOrCreateCounter('tasks');
  counter.count++;
  return counter.count;
}

export function getAgentExecutionsCount(): number {
  const counter = getOrCreateCounter('agent_executions');
  return counter.count;
}

export function getTasksCount(): number {
  const counter = getOrCreateCounter('tasks');
  return counter.count;
}

export function getAllCounters() {
  return {
    agentExecutions: getAgentExecutionsCount(),
    tasks: getTasksCount(),
    lastReset: counters.get('agent_executions')?.lastReset || new Date()
  };
}

// Alias for compatibility
export const getCurrentCounters = getAllCounters;

// Additional function for queries
export function incrementQueries(): number {
  const counter = getOrCreateCounter('queries');
  counter.count++;
  return counter.count;
}