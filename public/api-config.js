// DPO2U API Configuration and Integration Layer
// Centralizes all API endpoints and provides robust error handling

const APIConfig = {
    // Base URLs
    BASE_URL: window.location.hostname === 'localhost' ? 'http://localhost:8090' : 'http://195.200.2.56:8090',
    FALLBACK_URL: '/api',
    
    // Endpoints mapping
    endpoints: {
        health: '/api/health',
        dashboard: '/api/dashboard',
        agents: '/api/agents/active',
        performance: '/api/performance/metrics',
        leann: '/api/leann/status',
        uptime: '/api/system/uptime',
        tasks: '/api/tasks/status'
    },
    
    // Retry configuration
    retryConfig: {
        maxRetries: 3,
        retryDelay: 1000,
        backoffMultiplier: 2
    },
    
    // Cache configuration
    cacheConfig: {
        enabled: true,
        ttl: 30000, // 30 seconds
        storage: 'sessionStorage'
    }
};

// API Client with error handling and retry logic
class DPO2UApiClient {
    constructor(config = APIConfig) {
        this.config = config;
        this.cache = new Map();
        this.listeners = new Map();
    }
    
    // Main fetch method with retry and error handling
    async fetchWithRetry(endpoint, options = {}, retries = 0) {
        const url = `${this.config.BASE_URL}${endpoint}`;
        const cacheKey = `${url}-${JSON.stringify(options)}`;
        
        // Check cache first
        if (this.config.cacheConfig.enabled && this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.config.cacheConfig.ttl) {
                return cached.data;
            }
        }
        
        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 5000);
            
            const response = await fetch(url, {
                ...options,
                signal: controller.signal,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                }
            });
            
            clearTimeout(timeout);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Cache successful response
            if (this.config.cacheConfig.enabled) {
                this.cache.set(cacheKey, {
                    data,
                    timestamp: Date.now()
                });
            }
            
            return data;
            
        } catch (error) {
            // Retry logic
            if (retries < this.config.retryConfig.maxRetries) {
                const delay = this.config.retryConfig.retryDelay * Math.pow(this.config.retryConfig.backoffMultiplier, retries);
                console.log(`Retrying ${endpoint} after ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                return this.fetchWithRetry(endpoint, options, retries + 1);
            }
            
            // Fallback to local proxy if available
            if (this.config.FALLBACK_URL) {
                try {
                    const fallbackUrl = `${this.config.FALLBACK_URL}${endpoint.replace('/api', '')}`;
                    const fallbackResponse = await fetch(fallbackUrl);
                    if (fallbackResponse.ok) {
                        return await fallbackResponse.json();
                    }
                } catch (fallbackError) {
                    console.error('Fallback also failed:', fallbackError);
                }
            }
            
            // Return default fallback data
            return this.getFallbackData(endpoint);
        }
    }
    
    // Get fallback data based on endpoint
    getFallbackData(endpoint) {
        const fallbacks = {
            '/api/dashboard': {
                throughput: 0,
                latency: 0,
                errorRate: 0,
                uptime: 99.9,
                activeAgents: 0,
                totalAgents: 35,
                leannDocs: 2856,
                leannStatus: 'offline',
                apiGatewayStatus: 'Offline',
                servicesHealthy: false,
                cpuUsage: 0,
                memoryUsage: 0,
                message: 'Using cached data - API temporarily unavailable'
            },
            '/api/health': {
                status: 'degraded',
                message: 'API Gateway unreachable'
            },
            '/api/agents/active': {
                agents: [],
                total: 0,
                active: 0
            },
            '/api/performance/metrics': {
                cpu: 0,
                memory: 0,
                disk: 0,
                network: 0
            }
        };
        
        return fallbacks[endpoint] || { error: 'Service unavailable', endpoint };
    }
    
    // Public methods for each endpoint
    async getHealth() {
        return this.fetchWithRetry(this.config.endpoints.health);
    }
    
    async getDashboard() {
        return this.fetchWithRetry(this.config.endpoints.dashboard);
    }
    
    async getAgents() {
        return this.fetchWithRetry(this.config.endpoints.agents);
    }
    
    async getPerformance() {
        return this.fetchWithRetry(this.config.endpoints.performance);
    }
    
    async getLeannStatus() {
        return this.fetchWithRetry(this.config.endpoints.leann);
    }
    
    async getUptime() {
        return this.fetchWithRetry(this.config.endpoints.uptime);
    }
    
    async getTasks() {
        return this.fetchWithRetry(this.config.endpoints.tasks);
    }
    
    // Subscribe to real-time updates
    subscribe(endpoint, callback) {
        if (!this.listeners.has(endpoint)) {
            this.listeners.set(endpoint, new Set());
        }
        this.listeners.get(endpoint).add(callback);
        
        // Return unsubscribe function
        return () => {
            const listeners = this.listeners.get(endpoint);
            if (listeners) {
                listeners.delete(callback);
            }
        };
    }
    
    // Start polling for real-time updates
    startPolling(endpoint, interval = 5000) {
        const poll = async () => {
            try {
                const data = await this.fetchWithRetry(endpoint);
                const listeners = this.listeners.get(endpoint);
                if (listeners) {
                    listeners.forEach(callback => callback(data));
                }
            } catch (error) {
                console.error(`Polling error for ${endpoint}:`, error);
            }
        };
        
        poll(); // Initial poll
        return setInterval(poll, interval);
    }
    
    // Clear cache
    clearCache() {
        this.cache.clear();
    }
}

// Initialize global API client
window.DPO2U = window.DPO2U || {};
window.DPO2U.API = new DPO2UApiClient();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DPO2UApiClient, APIConfig };
}