// DPO2U Site Optimizer - Performance and SEO Enhancements
// Implements lazy loading, prefetching, and runtime optimizations

(function() {
    'use strict';

    // Performance Observer for metrics
    class PerformanceMonitor {
        constructor() {
            this.metrics = {};
            this.init();
        }
        
        init() {
            // Observe Core Web Vitals
            if ('PerformanceObserver' in window) {
                // Largest Contentful Paint
                try {
                    const lcpObserver = new PerformanceObserver((list) => {
                        const entries = list.getEntries();
                        const lastEntry = entries[entries.length - 1];
                        this.metrics.lcp = lastEntry.renderTime || lastEntry.loadTime;
                    });
                    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
                } catch (e) {}
                
                // First Input Delay
                try {
                    const fidObserver = new PerformanceObserver((list) => {
                        const entries = list.getEntries();
                        entries.forEach(entry => {
                            this.metrics.fid = entry.processingStart - entry.startTime;
                        });
                    });
                    fidObserver.observe({ entryTypes: ['first-input'] });
                } catch (e) {}
                
                // Cumulative Layout Shift
                try {
                    const clsObserver = new PerformanceObserver((list) => {
                        let cls = 0;
                        list.getEntries().forEach(entry => {
                            if (!entry.hadRecentInput) {
                                cls += entry.value;
                            }
                        });
                        this.metrics.cls = cls;
                    });
                    clsObserver.observe({ entryTypes: ['layout-shift'] });
                } catch (e) {}
            }
        }
        
        getMetrics() {
            return this.metrics;
        }
    }
    
    // Lazy Loading for Images
    class LazyImageLoader {
        constructor() {
            this.imageObserver = null;
            this.init();
        }
        
        init() {
            if ('IntersectionObserver' in window) {
                this.imageObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            this.loadImage(entry.target);
                            this.imageObserver.unobserve(entry.target);
                        }
                    });
                }, {
                    rootMargin: '50px 0px',
                    threshold: 0.01
                });
                
                this.observeImages();
            } else {
                // Fallback for older browsers
                this.loadAllImages();
            }
        }
        
        observeImages() {
            const images = document.querySelectorAll('img[data-src]');
            images.forEach(img => this.imageObserver.observe(img));
        }
        
        loadImage(img) {
            const src = img.getAttribute('data-src');
            if (src) {
                img.src = src;
                img.removeAttribute('data-src');
                img.classList.add('loaded');
            }
        }
        
        loadAllImages() {
            const images = document.querySelectorAll('img[data-src]');
            images.forEach(img => this.loadImage(img));
        }
    }
    
    // Prefetch Strategy
    class PrefetchManager {
        constructor() {
            this.prefetched = new Set();
            this.init();
        }
        
        init() {
            // Prefetch on hover
            document.addEventListener('mouseover', (e) => {
                const link = e.target.closest('a');
                if (link && link.href && !this.prefetched.has(link.href)) {
                    this.prefetchLink(link.href);
                }
            }, { passive: true });
            
            // Prefetch visible links when idle
            if ('requestIdleCallback' in window) {
                requestIdleCallback(() => this.prefetchVisibleLinks());
            }
        }
        
        prefetchLink(url) {
            if (url.startsWith('http') && !url.includes(location.hostname)) return;
            
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = url;
            document.head.appendChild(link);
            this.prefetched.add(url);
        }
        
        prefetchVisibleLinks() {
            const links = document.querySelectorAll('a[href]');
            const visibleLinks = Array.from(links).filter(link => {
                const rect = link.getBoundingClientRect();
                return rect.top < window.innerHeight && rect.bottom > 0;
            });
            
            visibleLinks.slice(0, 3).forEach(link => {
                if (!this.prefetched.has(link.href)) {
                    this.prefetchLink(link.href);
                }
            });
        }
    }
    
    // Service Worker Registration
    class ServiceWorkerManager {
        constructor() {
            this.init();
        }
        
        init() {
            if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                    this.register();
                });
            }
        }
        
        async register() {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js');
                console.log('ServiceWorker registered:', registration.scope);
            } catch (error) {
                // Service worker not available, continue without it
            }
        }
    }
    
    // Resource Hints
    class ResourceHints {
        constructor() {
            this.addHints();
        }
        
        addHints() {
            // DNS Prefetch for external resources
            const dnsPrefetch = [
                'https://fonts.googleapis.com',
                'https://fonts.gstatic.com'
            ];
            
            dnsPrefetch.forEach(domain => {
                const link = document.createElement('link');
                link.rel = 'dns-prefetch';
                link.href = domain;
                document.head.appendChild(link);
            });
            
            // Preconnect for critical third-party origins
            const preconnect = [
                'https://fonts.googleapis.com',
                'https://fonts.gstatic.com'
            ];
            
            preconnect.forEach(origin => {
                const link = document.createElement('link');
                link.rel = 'preconnect';
                link.href = origin;
                link.crossOrigin = 'anonymous';
                document.head.appendChild(link);
            });
        }
    }
    
    // SEO Enhancements
    class SEOEnhancer {
        constructor() {
            this.enhance();
        }
        
        enhance() {
            // Add structured data
            this.addStructuredData();
            
            // Add Open Graph tags
            this.addOpenGraphTags();
            
            // Add Twitter Card tags
            this.addTwitterCardTags();
            
            // Generate and add JSON-LD for breadcrumbs
            this.addBreadcrumbSchema();
        }
        
        addStructuredData() {
            if (document.querySelector('script[type="application/ld+json"]')) return;
            
            const schema = {
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "DPO2U",
                "url": "https://dpo2u.com",
                "logo": "https://dpo2u.com/logo.png",
                "description": "Especialistas em Proteção de Dados e LGPD com Plataforma IA No-Code",
                "contactPoint": {
                    "@type": "ContactPoint",
                    "telephone": "+55-11-0000-0000",
                    "contactType": "customer service",
                    "availableLanguage": ["Portuguese", "English"]
                },
                "sameAs": [
                    "https://linkedin.com/company/dpo2u"
                ]
            };
            
            const script = document.createElement('script');
            script.type = 'application/ld+json';
            script.textContent = JSON.stringify(schema);
            document.head.appendChild(script);
        }
        
        addOpenGraphTags() {
            const ogTags = {
                'og:title': document.title,
                'og:description': 'Plataforma de IA No-Code para conformidade LGPD',
                'og:type': 'website',
                'og:url': window.location.href,
                'og:image': 'https://dpo2u.com/og-image.jpg',
                'og:site_name': 'DPO2U'
            };
            
            Object.entries(ogTags).forEach(([property, content]) => {
                if (!document.querySelector(`meta[property="${property}"]`)) {
                    const meta = document.createElement('meta');
                    meta.setAttribute('property', property);
                    meta.setAttribute('content', content);
                    document.head.appendChild(meta);
                }
            });
        }
        
        addTwitterCardTags() {
            const twitterTags = {
                'twitter:card': 'summary_large_image',
                'twitter:title': document.title,
                'twitter:description': 'Plataforma de IA No-Code para conformidade LGPD',
                'twitter:image': 'https://dpo2u.com/twitter-card.jpg'
            };
            
            Object.entries(twitterTags).forEach(([name, content]) => {
                if (!document.querySelector(`meta[name="${name}"]`)) {
                    const meta = document.createElement('meta');
                    meta.setAttribute('name', name);
                    meta.setAttribute('content', content);
                    document.head.appendChild(meta);
                }
            });
        }
        
        addBreadcrumbSchema() {
            const breadcrumb = {
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": [{
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": "https://dpo2u.com"
                }]
            };
            
            const script = document.createElement('script');
            script.type = 'application/ld+json';
            script.textContent = JSON.stringify(breadcrumb);
            document.head.appendChild(script);
        }
    }
    
    // Initialize all optimizations
    class DPO2USiteOptimizer {
        constructor() {
            this.performanceMonitor = new PerformanceMonitor();
            this.lazyImageLoader = new LazyImageLoader();
            this.prefetchManager = new PrefetchManager();
            this.serviceWorkerManager = new ServiceWorkerManager();
            this.resourceHints = new ResourceHints();
            this.seoEnhancer = new SEOEnhancer();
            
            // Add performance tracking
            this.trackPerformance();
            
            // Optimize critical rendering path
            this.optimizeCriticalPath();
        }
        
        trackPerformance() {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const metrics = this.performanceMonitor.getMetrics();
                    console.log('Core Web Vitals:', metrics);
                    
                    // Send to analytics if available
                    if (window.gtag) {
                        window.gtag('event', 'web_vitals', metrics);
                    }
                }, 3000);
            });
        }
        
        optimizeCriticalPath() {
            // Defer non-critical CSS
            const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
            stylesheets.forEach(stylesheet => {
                if (!stylesheet.href.includes('enhanced-styles.css')) {
                    stylesheet.media = 'print';
                    stylesheet.addEventListener('load', function() {
                        this.media = 'all';
                    });
                }
            });
            
            // Load fonts with font-display: swap
            const fontLinks = document.querySelectorAll('link[href*="fonts.googleapis.com"]');
            fontLinks.forEach(link => {
                if (!link.href.includes('&display=swap')) {
                    link.href += '&display=swap';
                }
            });
        }
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.DPO2U = window.DPO2U || {};
            window.DPO2U.optimizer = new DPO2USiteOptimizer();
        });
    } else {
        window.DPO2U = window.DPO2U || {};
        window.DPO2U.optimizer = new DPO2USiteOptimizer();
    }
})();