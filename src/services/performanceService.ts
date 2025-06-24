
interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: number;
}

class PerformanceService {
  private static instance: PerformanceService;
  private metrics: PerformanceMetric[] = [];
  private observer: PerformanceObserver | null = null;

  constructor() {
    this.setupPerformanceObserver();
  }

  static getInstance(): PerformanceService {
    if (!PerformanceService.instance) {
      PerformanceService.instance = new PerformanceService();
    }
    return PerformanceService.instance;
  }

  initialize() {
    this.measureInitialMetrics();
    this.startContinuousMonitoring();
    console.log('⚡ Performance monitoring initialized');
  }

  private setupPerformanceObserver() {
    if ('PerformanceObserver' in window) {
      this.observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          this.processPerformanceEntry(entry);
        });
      });

      this.observer.observe({ entryTypes: ['navigation', 'measure', 'paint'] });
    }
  }

  private processPerformanceEntry(entry: PerformanceEntry) {
    const metric: PerformanceMetric = {
      name: entry.name,
      value: entry.duration || entry.startTime,
      unit: 'ms',
      timestamp: Date.now()
    };

    this.metrics.push(metric);
    console.log(`⚡ Performance Metric - ${entry.name}: ${metric.value}${metric.unit}`);
  }

  private measureInitialMetrics() {
    // Memory usage
    if ('memory' in performance) {
      const memoryInfo = (performance as any).memory;
      this.recordMetric('memory-used', memoryInfo.usedJSHeapSize / 1024 / 1024, 'MB');
      this.recordMetric('memory-total', memoryInfo.totalJSHeapSize / 1024 / 1024, 'MB');
      this.recordMetric('memory-limit', memoryInfo.jsHeapSizeLimit / 1024 / 1024, 'MB');
    }

    // Connection information
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      if (connection) {
        this.recordMetric('connection-downlink', connection.downlink, 'Mbps');
        this.recordMetric('connection-rtt', connection.rtt, 'ms');
      }
    }

    // Navigation timing
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      this.recordMetric('dom-content-loaded', navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart, 'ms');
      this.recordMetric('page-load', navigation.loadEventEnd - navigation.loadEventStart, 'ms');
    }
  }

  private startContinuousMonitoring() {
    // Monitor Core Web Vitals
    this.measureCLS();
    this.measureLCP();
    this.measureFID();
  }

  private measureCLS() {
    let clsValue = 0;
    let clsEntries: any[] = [];

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsEntries.push(entry);
          clsValue += (entry as any).value;
        }
      }
      this.recordMetric('cumulative-layout-shift', clsValue, 'score');
    });

    observer.observe({ type: 'layout-shift', buffered: true });
  }

  private measureLCP() {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.recordMetric('largest-contentful-paint', lastEntry.startTime, 'ms');
    });

    observer.observe({ type: 'largest-contentful-paint', buffered: true });
  }

  private measureFID() {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        this.recordMetric('first-input-delay', (entry as any).processingStart - entry.startTime, 'ms');
      }
    });

    observer.observe({ type: 'first-input', buffered: true });
  }

  recordMetric(name: string, value: number, unit: string) {
    const metric: PerformanceMetric = {
      name,
      value,
      unit,
      timestamp: Date.now()
    };

    this.metrics.push(metric);
    console.log(`⚡ Performance Metric - ${name}: ${value}${unit}`);
  }

  getMetrics() {
    return this.metrics;
  }

  getMetricsSummary() {
    const summary = this.metrics.reduce((acc, metric) => {
      if (!acc[metric.name]) {
        acc[metric.name] = [];
      }
      acc[metric.name].push(metric.value);
      return acc;
    }, {} as Record<string, number[]>);

    const averages = Object.entries(summary).map(([name, values]) => ({
      name,
      average: values.reduce((sum, val) => sum + val, 0) / values.length,
      count: values.length
    }));

    console.log('⚡ Performance Summary:', averages);
    return averages;
  }

  cleanup() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

export const performanceService = PerformanceService.getInstance();
