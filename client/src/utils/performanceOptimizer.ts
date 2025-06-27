interface PerformanceMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
  memoryUsage: number;
  bundleSize: number;
}

interface OptimizationSuggestion {
  id: string;
  type: 'critical' | 'warning' | 'suggestion';
  category: 'performance' | 'memory' | 'network' | 'rendering';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'high' | 'medium' | 'low';
  implementation: string;
  codeExample?: string;
}

class PerformanceOptimizer {
  private static instance: PerformanceOptimizer;
  private metrics: PerformanceMetrics | null = null;
  private suggestions: OptimizationSuggestion[] = [];
  private observer: PerformanceObserver | null = null;

  static getInstance(): PerformanceOptimizer {
    if (!PerformanceOptimizer.instance) {
      PerformanceOptimizer.instance = new PerformanceOptimizer();
    }
    return PerformanceOptimizer.instance;
  }

  constructor() {
    this.startMonitoring();
  }

  private startMonitoring() {
    // Monitor Core Web Vitals
    if ('PerformanceObserver' in window) {
      this.observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.processPerformanceEntry(entry);
        }
      });

      // Observe different performance metrics
      try {
        this.observer.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint', 'first-input', 'layout-shift'] });
      } catch (error) {
        console.warn('Performance observation failed:', error);
      }
    }

    // Check metrics periodically
    setInterval(() => {
      this.collectMetrics();
      this.generateOptimizationSuggestions();
    }, 30000); // Every 30 seconds
  }

  private processPerformanceEntry(entry: PerformanceEntry) {
    switch (entry.entryType) {
      case 'largest-contentful-paint':
        console.log(`⚡ Performance Alert - ${entry.entryType}: ${entry.startTime}ms`);
        if (entry.startTime > 2500) {
          console.warn('⚠️ LCP is slow:', entry.startTime);
        }
        break;
      case 'first-input':
        console.log(`⚡ Performance Alert - ${entry.entryType}: ${(entry as any).processingStart - entry.startTime}ms`);
        break;
      case 'layout-shift':
        if (!(entry as any).hadRecentInput) {
          console.log(`⚡ Performance Alert - ${entry.entryType}: ${(entry as any).value}score`);
        }
        break;
    }
  }

  private collectMetrics() {
    try {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByType('paint');
      const lcp = performance.getEntriesByType('largest-contentful-paint');
      
      let fcpValue = 0;
      let lcpValue = 0;
      
      // Get FCP
      const fcpEntry = paint.find(entry => entry.name === 'first-contentful-paint');
      if (fcpEntry) {
        fcpValue = fcpEntry.startTime;
      }

      // Get LCP
      if (lcp.length > 0) {
        lcpValue = lcp[lcp.length - 1].startTime;
      }

      // Calculate memory usage
      let memoryUsage = 0;
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        memoryUsage = memory.usedJSHeapSize / 1024 / 1024; // MB
      }

      this.metrics = {
        fcp: fcpValue,
        lcp: lcpValue,
        fid: 0, // Will be updated by first-input observer
        cls: 0, // Will be updated by layout-shift observer
        ttfb: navigation.responseStart - navigation.requestStart,
        memoryUsage,
        bundleSize: 0 // Would need additional tracking
      };

    } catch (error) {
      console.warn('Failed to collect performance metrics:', error);
    }
  }

  private generateOptimizationSuggestions() {
    const suggestions: OptimizationSuggestion[] = [];

    if (!this.metrics) return;

    // FCP optimization
    if (this.metrics.fcp > 1500) {
      suggestions.push({
        id: 'optimize-fcp',
        type: 'warning',
        category: 'performance',
        title: 'Optimize First Contentful Paint',
        description: 'FCP is above 1.5s threshold. Consider code splitting and lazy loading.',
        impact: 'high',
        effort: 'medium',
        implementation: 'Implement React.lazy() for route-based code splitting',
        codeExample: `
const LazyComponent = React.lazy(() => import('./Component'));

<Suspense fallback={<div>Loading...</div>}>
  <LazyComponent />
</Suspense>`
      });
    }

    // LCP optimization
    if (this.metrics.lcp > 2500) {
      suggestions.push({
        id: 'optimize-lcp',
        type: 'critical',
        category: 'performance',
        title: 'Optimize Largest Contentful Paint',
        description: 'LCP is above 2.5s threshold. Optimize critical images and fonts.',
        impact: 'high',
        effort: 'medium',
        implementation: 'Add preload hints for critical resources',
        codeExample: `
<link rel="preload" href="/critical-image.jpg" as="image">
<link rel="preload" href="/critical-font.woff2" as="font" type="font/woff2" crossorigin>`
      });
    }

    // Memory optimization
    if (this.metrics.memoryUsage > 50) {
      suggestions.push({
        id: 'optimize-memory',
        type: 'warning',
        category: 'memory',
        title: 'High Memory Usage Detected',
        description: `Memory usage is ${this.metrics.memoryUsage.toFixed(1)}MB. Consider cleanup strategies.`,
        impact: 'medium',
        effort: 'medium',
        implementation: 'Add proper cleanup in useEffect hooks',
        codeExample: `
useEffect(() => {
  const interval = setInterval(() => {}, 1000);
  
  return () => {
    clearInterval(interval); // Cleanup
  };
}, []);`
      });
    }

    // TTFB optimization
    if (this.metrics.ttfb > 200) {
      suggestions.push({
        id: 'optimize-ttfb',
        type: 'suggestion',
        category: 'network',
        title: 'Optimize Time to First Byte',
        description: 'TTFB is above 200ms. Consider server-side optimizations.',
        impact: 'medium',
        effort: 'high',
        implementation: 'Implement CDN and server-side caching',
        codeExample: `
// Add Cache-Control headers
response.setHeader('Cache-Control', 'public, max-age=31536000');

// Use CDN for static assets
<img src="https://cdn.example.com/image.jpg" />`
      });
    }

    // React-specific optimizations
    suggestions.push({
      id: 'react-memo',
      type: 'suggestion',
      category: 'rendering',
      title: 'Optimize React Renders',
      description: 'Use React.memo and useMemo for expensive computations.',
      impact: 'medium',
      effort: 'low',
      implementation: 'Wrap components in React.memo and use useMemo for calculations',
      codeExample: `
const ExpensiveComponent = React.memo(({ data }) => {
  const computedValue = useMemo(() => {
    return expensiveCalculation(data);
  }, [data]);
  
  return <div>{computedValue}</div>;
});`
    });

    // Bundle size optimization
    suggestions.push({
      id: 'bundle-optimization',
      type: 'suggestion',
      category: 'performance',
      title: 'Optimize Bundle Size',
      description: 'Implement tree shaking and remove unused dependencies.',
      impact: 'high',
      effort: 'medium',
      implementation: 'Use dynamic imports and analyze bundle size',
      codeExample: `
// Dynamic imports for large libraries
const heavyLibrary = await import('heavy-library');

// Tree shaking friendly imports
import { specificFunction } from 'library';`
    });

    this.suggestions = suggestions;
  }

  getMetrics(): PerformanceMetrics | null {
    return this.metrics;
  }

  getSuggestions(): OptimizationSuggestion[] {
    return this.suggestions;
  }

  getPerformanceScore(): number {
    if (!this.metrics) return 0;

    // Calculate score based on Core Web Vitals
    let score = 100;

    // FCP penalty
    if (this.metrics.fcp > 1500) score -= 20;
    else if (this.metrics.fcp > 1000) score -= 10;

    // LCP penalty
    if (this.metrics.lcp > 2500) score -= 30;
    else if (this.metrics.lcp > 1500) score -= 15;

    // Memory penalty
    if (this.metrics.memoryUsage > 100) score -= 20;
    else if (this.metrics.memoryUsage > 50) score -= 10;

    // TTFB penalty
    if (this.metrics.ttfb > 500) score -= 15;
    else if (this.metrics.ttfb > 200) score -= 5;

    return Math.max(0, Math.min(100, score));
  }

  applySuggestion(suggestionId: string): boolean {
    const suggestion = this.suggestions.find(s => s.id === suggestionId);
    if (!suggestion) return false;

    console.log(`Applying optimization: ${suggestion.title}`);
    
    // Here you would implement the actual optimization
    // For now, we'll just mark it as applied
    this.suggestions = this.suggestions.filter(s => s.id !== suggestionId);
    
    return true;
  }

  // Performance monitoring utilities
  measureComponentRender(componentName: string, renderFunction: () => void) {
    const start = performance.now();
    renderFunction();
    const end = performance.now();
    
    const renderTime = end - start;
    console.log(`📊 Component render time - ${componentName}: ${renderTime.toFixed(2)}ms`);
    
    if (renderTime > 16) { // Slower than 60fps
      console.warn(`⚠️ Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`);
    }
    
    return renderTime;
  }

  trackAsyncOperation(operationName: string, operation: () => Promise<any>) {
    const start = performance.now();
    
    return operation().finally(() => {
      const end = performance.now();
      const duration = end - start;
      console.log(`⏱️ Async operation - ${operationName}: ${duration.toFixed(2)}ms`);
    });
  }

  // Resource loading optimization
  preloadCriticalResources(resources: string[]) {
    resources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource;
      
      if (resource.endsWith('.css')) {
        link.as = 'style';
      } else if (resource.match(/\.(jpg|jpeg|png|webp)$/)) {
        link.as = 'image';
      } else if (resource.match(/\.(woff|woff2|ttf)$/)) {
        link.as = 'font';
        link.crossOrigin = 'anonymous';
      }
      
      document.head.appendChild(link);
    });
  }

  // Cleanup
  cleanup() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }

  // Export performance report
  exportReport(): string {
    const report = {
      timestamp: new Date().toISOString(),
      metrics: this.metrics,
      score: this.getPerformanceScore(),
      suggestions: this.suggestions,
      recommendations: {
        critical: this.suggestions.filter(s => s.type === 'critical').length,
        warnings: this.suggestions.filter(s => s.type === 'warning').length,
        suggestions: this.suggestions.filter(s => s.type === 'suggestion').length
      }
    };

    return JSON.stringify(report, null, 2);
  }
}

export const performanceOptimizer = PerformanceOptimizer.getInstance();

import { useEffect } from 'react';

// React hook for performance monitoring
export const usePerformanceMonitoring = (componentName: string) => {
  useEffect(() => {
    const start = performance.now();
    
    return () => {
      const end = performance.now();
      const renderTime = end - start;
      
      if (renderTime > 100) {
        console.warn(`⚠️ Long component lifecycle - ${componentName}: ${renderTime.toFixed(2)}ms`);
      }
    };
  }, [componentName]);

  return {
    measureRender: (fn: () => void) => performanceOptimizer.measureComponentRender(componentName, fn),
    trackAsync: (name: string, operation: () => Promise<any>) => performanceOptimizer.trackAsyncOperation(name, operation)
  };
};