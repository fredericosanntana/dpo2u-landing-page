// DPO2U Dashboard Component - Real-time metrics display
// Integrates with API Gateway for live data

class DPO2UDashboard {
    constructor(containerId = 'dashboard-container') {
        this.container = document.getElementById(containerId);
        this.api = window.DPO2U?.API || new DPO2UApiClient();
        this.updateInterval = null;
        this.charts = {};
        this.state = {
            loading: true,
            error: null,
            data: null,
            lastUpdate: null
        };
    }
    
    // Initialize dashboard
    async init() {
        this.render();
        await this.loadData();
        this.startAutoUpdate();
        this.attachEventListeners();
    }
    
    // Load dashboard data
    async loadData() {
        this.setState({ loading: true, error: null });
        
        try {
            const [dashboard, health, agents] = await Promise.allSettled([
                this.api.getDashboard(),
                this.api.getHealth(),
                this.api.getAgents()
            ]);
            
            const data = {
                dashboard: dashboard.status === 'fulfilled' ? dashboard.value : null,
                health: health.status === 'fulfilled' ? health.value : null,
                agents: agents.status === 'fulfilled' ? agents.value : null
            };
            
            this.setState({
                loading: false,
                data,
                lastUpdate: new Date()
            });
            
            this.updateMetrics(data);
            
        } catch (error) {
            console.error('Dashboard load error:', error);
            this.setState({
                loading: false,
                error: 'Falha ao carregar dados do dashboard'
            });
        }
    }
    
    // Update metrics display
    updateMetrics(data) {
        if (!data.dashboard) return;
        
        const metrics = data.dashboard;
        
        // Update metric cards
        this.updateMetricCard('throughput', metrics.throughput, 'req/s');
        this.updateMetricCard('latency', metrics.latency, 'ms');
        this.updateMetricCard('errorRate', (metrics.errorRate * 100).toFixed(2), '%');
        this.updateMetricCard('uptime', metrics.uptime, '%');
        
        // Update agent status
        this.updateAgentStatus(metrics.activeAgents, metrics.totalAgents);
        
        // Update service status
        this.updateServiceStatus(metrics);
        
        // Update performance gauges
        this.updatePerformanceGauges(metrics);
    }
    
    // Update individual metric card
    updateMetricCard(id, value, unit) {
        const element = document.getElementById(`metric-${id}`);
        if (element) {
            const valueEl = element.querySelector('.metric-value');
            const unitEl = element.querySelector('.metric-unit');
            
            if (valueEl) {
                valueEl.textContent = value;
                valueEl.classList.add('metric-updated');
                setTimeout(() => valueEl.classList.remove('metric-updated'), 300);
            }
            
            if (unitEl) unitEl.textContent = unit;
        }
    }
    
    // Update agent status display
    updateAgentStatus(active, total) {
        const statusEl = document.getElementById('agent-status');
        if (statusEl) {
            statusEl.innerHTML = `
                <div class="agent-status-bar">
                    <div class="agent-active" style="width: ${(active/total) * 100}%">
                        ${active} ativos
                    </div>
                    <div class="agent-total">${total} total</div>
                </div>
            `;
        }
    }
    
    // Update service status indicators
    updateServiceStatus(metrics) {
        const services = [
            { id: 'api-gateway', status: metrics.apiGatewayStatus === 'Online' },
            { id: 'leann', status: metrics.leannStatus === 'online' },
            { id: 'services', status: metrics.servicesHealthy }
        ];
        
        services.forEach(service => {
            const el = document.getElementById(`service-${service.id}`);
            if (el) {
                el.className = `service-indicator ${service.status ? 'online' : 'offline'}`;
                el.title = service.status ? 'Online' : 'Offline';
            }
        });
    }
    
    // Update performance gauges
    updatePerformanceGauges(metrics) {
        this.updateGauge('cpu-gauge', metrics.cpuUsage);
        this.updateGauge('memory-gauge', metrics.memoryUsage);
    }
    
    // Update circular gauge
    updateGauge(id, value) {
        const gauge = document.getElementById(id);
        if (gauge) {
            const circle = gauge.querySelector('.gauge-fill');
            const text = gauge.querySelector('.gauge-text');
            
            if (circle) {
                const circumference = 2 * Math.PI * 45;
                const offset = circumference - (value / 100) * circumference;
                circle.style.strokeDashoffset = offset;
            }
            
            if (text) {
                text.textContent = `${value}%`;
            }
        }
    }
    
    // Set component state
    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.render();
    }
    
    // Render dashboard HTML
    render() {
        if (!this.container) return;
        
        if (this.state.loading) {
            this.container.innerHTML = this.renderLoading();
            return;
        }
        
        if (this.state.error) {
            this.container.innerHTML = this.renderError();
            return;
        }
        
        this.container.innerHTML = this.renderDashboard();
    }
    
    // Render loading state
    renderLoading() {
        return `
            <div class="dashboard-loading">
                <div class="spinner"></div>
                <p>Carregando métricas...</p>
            </div>
        `;
    }
    
    // Render error state
    renderError() {
        return `
            <div class="dashboard-error">
                <svg class="error-icon" width="48" height="48" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                    <path d="M12 8v4m0 4h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <h3>Erro ao carregar dashboard</h3>
                <p>${this.state.error}</p>
                <button onclick="window.DPO2U.dashboard.loadData()" class="retry-btn">
                    Tentar novamente
                </button>
            </div>
        `;
    }
    
    // Render main dashboard
    renderDashboard() {
        return `
            <div class="dashboard-grid">
                <!-- Header -->
                <div class="dashboard-header">
                    <h2>Central de Comando DPO2U</h2>
                    <div class="dashboard-actions">
                        <button class="refresh-btn" onclick="window.DPO2U.dashboard.loadData()">
                            ↻ Atualizar
                        </button>
                        <span class="last-update">
                            Última atualização: ${this.formatTime(this.state.lastUpdate)}
                        </span>
                    </div>
                </div>
                
                <!-- Metrics Grid -->
                <div class="metrics-grid">
                    ${this.renderMetricCard('throughput', 'Throughput', '0', 'req/s', 'primary')}
                    ${this.renderMetricCard('latency', 'Latência', '0', 'ms', 'warning')}
                    ${this.renderMetricCard('errorRate', 'Taxa de Erro', '0', '%', 'danger')}
                    ${this.renderMetricCard('uptime', 'Uptime', '0', '%', 'success')}
                </div>
                
                <!-- Services Status -->
                <div class="services-section">
                    <h3>Status dos Serviços</h3>
                    <div class="services-grid">
                        ${this.renderServiceCard('api-gateway', 'API Gateway', true)}
                        ${this.renderServiceCard('leann', 'LEANN', true)}
                        ${this.renderServiceCard('services', 'Serviços', true)}
                    </div>
                </div>
                
                <!-- Agent Status -->
                <div class="agents-section">
                    <h3>Status dos Agentes</h3>
                    <div id="agent-status" class="agent-status-container"></div>
                </div>
                
                <!-- Performance Gauges -->
                <div class="performance-section">
                    <h3>Performance do Sistema</h3>
                    <div class="gauges-grid">
                        ${this.renderGauge('cpu-gauge', 'CPU', 0)}
                        ${this.renderGauge('memory-gauge', 'Memória', 0)}
                    </div>
                </div>
            </div>
        `;
    }
    
    // Render metric card
    renderMetricCard(id, label, value, unit, type = 'default') {
        return `
            <div id="metric-${id}" class="metric-card metric-${type}">
                <div class="metric-label">${label}</div>
                <div class="metric-content">
                    <span class="metric-value">${value}</span>
                    <span class="metric-unit">${unit}</span>
                </div>
            </div>
        `;
    }
    
    // Render service card
    renderServiceCard(id, label, status) {
        return `
            <div class="service-card">
                <div id="service-${id}" class="service-indicator ${status ? 'online' : 'offline'}"></div>
                <span class="service-label">${label}</span>
            </div>
        `;
    }
    
    // Render gauge
    renderGauge(id, label, value) {
        return `
            <div class="gauge-container">
                <svg id="${id}" class="gauge" width="120" height="120">
                    <circle class="gauge-bg" cx="60" cy="60" r="45" />
                    <circle class="gauge-fill" cx="60" cy="60" r="45" />
                    <text class="gauge-text" x="60" y="65" text-anchor="middle">${value}%</text>
                </svg>
                <div class="gauge-label">${label}</div>
            </div>
        `;
    }
    
    // Format time
    formatTime(date) {
        if (!date) return 'N/A';
        return new Intl.DateTimeFormat('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        }).format(date);
    }
    
    // Start auto-update
    startAutoUpdate(interval = 5000) {
        this.stopAutoUpdate();
        this.updateInterval = setInterval(() => this.loadData(), interval);
    }
    
    // Stop auto-update
    stopAutoUpdate() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }
    
    // Attach event listeners
    attachEventListeners() {
        // Visibility change - pause updates when tab is hidden
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.stopAutoUpdate();
            } else {
                this.startAutoUpdate();
            }
        });
        
        // Network status
        window.addEventListener('online', () => this.loadData());
        window.addEventListener('offline', () => {
            this.setState({ error: 'Sem conexão com a internet' });
        });
    }
    
    // Destroy dashboard
    destroy() {
        this.stopAutoUpdate();
        if (this.container) {
            this.container.innerHTML = '';
        }
    }
}

// Initialize dashboard when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDashboard);
} else {
    initDashboard();
}

function initDashboard() {
    // Create dashboard container if it doesn't exist
    if (!document.getElementById('dashboard-container')) {
        const container = document.createElement('div');
        container.id = 'dashboard-container';
        container.className = 'dpo2u-dashboard';
        
        // Find insertion point
        const mainContent = document.querySelector('.main-content') || 
                          document.querySelector('main') || 
                          document.body;
        
        if (mainContent) {
            mainContent.appendChild(container);
        }
    }
    
    // Initialize dashboard
    window.DPO2U = window.DPO2U || {};
    window.DPO2U.dashboard = new DPO2UDashboard('dashboard-container');
    window.DPO2U.dashboard.init();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DPO2UDashboard;
}