
interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  unit: string;
}

class PerformanceService {
  private static instance: PerformanceService;
  private metrics: PerformanceMetric[] = [];
  private observers: PerformanceObserver[] = [];

  static getInstance(): PerformanceService {
    if (!PerformanceService.instance) {
      PerformanceService.instance = new PerformanceService();
    }
    return PerformanceService.instance;
  }

  initialize() {
    this.setupPerformanceObservers();
    this.measureInitialMetrics();
    console.log('⚡ Performance monitoring initialized');
  }

  private setupPerformanceObservers() {
    // Observe navigation timing
    if ('PerformanceObserver' in window) {
      const navigationObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            this.recordNavigationMetrics(entry as PerformanceNavigationTiming);
          }
        }
      });

      try {
        navigationObserver.observe({ entryTypes: ['navigation'] });
        this.observers.push(navigationObserver);
      } catch (error) {
        console.warn('⚠️ Navigation timing not supported:', error);
      }

      // Observe paint timing
      const paintObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.addMetric(entry.name, entry.startTime, 'ms');
        }
      });

      try {
        paintObserver.observe({ entryTypes: ['paint'] });
        this.observers.push(paintObserver);
      } catch (error) {
        console.warn('⚠️ Paint timing not supported:', error);
      }

      // Observe largest contentful paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.addMetric('largest-contentful-paint', lastEntry.startTime, 'ms');
      });

      try {
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.push(lcpObserver);
      } catch (error) {
        console.warn('⚠️ LCP timing not supported:', error);
      }
    }
  }

  private measureInitialMetrics() {
    // Core Web Vitals
    this.measureCLS();
    this.measureFID();
    
    // Custom metrics
    this.measureMemoryUsage();
    this.measureConnectionSpeed();
  }

  private recordNavigationMetrics(entry: PerformanceNavigationTiming) {
    this.addMetric('dns-lookup', entry.domainLookupEnd - entry.domainLookupStart, 'ms');
    this.addMetric('tcp-connection', entry.connectEnd - entry.connectStart, 'ms');
    this.addMetric('server-response', entry.responseStart - entry.requestStart, 'ms');
    this.addMetric('dom-processing', entry.domComplete - entry.domLoading, 'ms');
    this.addMetric('page-load', entry.loadEventEnd - entry.navigationStart, 'ms');
  }

  private measureCLS() {
    // Cumulative Layout Shift
    let clsValue = 0;
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as any[]) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          this.addMetric('cumulative-layout-shift', clsValue, 'score');
        }
      }
    });

    try {
      observer.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(observer);
    } catch (error) {
      console.warn('⚠️ CLS measurement not supported:', error);
    }
  }

  private measureFID() {
    // First Input Delay
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        this.addMetric('first-input-delay', entry.processingStart - entry.startTime, 'ms');
      }
    });

    try {
      observer.observe({ entryTypes: ['first-input'] });
      this.observers.push(observer);
    } catch (error) {
      console.warn('⚠️ FID measurement not supported:', error);
    }
  }

  private measureMemoryUsage() {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      this.addMetric('memory-used', memory.usedJSHeapSize / 1024 / 1024, 'MB');
      this.addMetric('memory-total', memory.totalJSHeapSize / 1024 / 1024, 'MB');
      this.addMetric('memory-limit', memory.jsHeapSizeLimit / 1024 / 1024, 'MB');
    }
  }

  private measureConnectionSpeed() {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      if (connection) {
        this.addMetric('connection-downlink', connection.downlink, 'Mbps');
        this.addMetric('connection-rtt', connection.rtt, 'ms');
      }
    }
  }

  addMetric(name: string, value: number, unit: string) {
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now(),
      unit
    };

    this.metrics.push(metric);
    console.log(`⚡ Performance Metric - ${name}: ${value}${unit}`);
  }

  measureComponentRender(componentName: string, renderTime: number) {
    this.addMetric(`component-render-${componentName}`, renderTime, 'ms');
  }

  measureApiCall(endpoint: string, duration: number) {
    this.addMetric(`api-call-${endpoint}`, duration, 'ms');
  }

  getPerformanceReport() {
    const report = {
      timestamp: Date.now(),
      metrics: this.metrics,
      coreWebVitals: this.getCoreWebVitals(),
      summary: this.getPerformanceSummary()
    };

    console.log('📊 Performance Report:', report);
    return report;
  }

  private getCoreWebVitals() {
    const findMetric = (name: string) => this.metrics.find(m => m.name === name);
    
    return {
      lcp: findMetric('largest-contentful-paint'),
      fid: findMetric('first-input-delay'),
      cls: findMetric('cumulative-layout-shift'),
      fcp: findMetric('first-contentful-paint'),
      ttfb: findMetric('server-response')
    };
  }

  private getPerformanceSummary() {
    const pageLoad = this.metrics.find(m => m.name === 'page-load');
    const memoryUsed = this.metrics.find(m => m.name === 'memory-used');
    
    return {
      pageLoadTime: pageLoad?.value || 0,
      memoryUsage: memoryUsed?.value || 0,
      totalMetrics: this.metrics.length,
      performanceScore: this.calculatePerformanceScore()
    };
  }

  private calculatePerformanceScore(): number {
    // Simple scoring algorithm based on key metrics
    let score = 100;
    
    const lcp = this.metrics.find(m => m.name === 'largest-contentful-paint');
    if (lcp && lcp.value > 2500) score -= 20;
    else if (lcp && lcp.value > 4000) score -= 40;
    
    const fid = this.metrics.find(m => m.name === 'first-input-delay');
    if (fid && fid.value > 100) score -= 20;
    else if (fid && fid.value > 300) score -= 40;
    
    const cls = this.metrics.find(m => m.name === 'cumulative-layout-shift');
    if (cls && cls.value > 0.1) score -= 20;
    else if (cls && cls.value > 0.25) score -= 40;
    
    return Math.max(0, score);
  }

  exportPerformanceData() {
    const data = this.getPerformanceReport();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `performance_report_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    console.log('📥 Performance data exported');
  }

  cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    console.log('🧹 Performance monitoring cleaned up');
  }
}

export const performanceService = PerformanceService.getInstance();
