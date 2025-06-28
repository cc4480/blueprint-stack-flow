interface BugReport {
  id: string;
  type: 'error' | 'warning' | 'performance' | 'validation';
  component: string;
  message: string;
  stack?: string;
  context: Record<string, any>;
  timestamp: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  resolved: boolean;
}

class BugTracker {
  private static instance: BugTracker;
  private bugs: BugReport[] = [];
  private observers: ((bugs: BugReport[]) => void)[] = [];

  static getInstance(): BugTracker {
    if (!BugTracker.instance) {
      BugTracker.instance = new BugTracker();
    }
    return BugTracker.instance;
  }

  constructor() {
    this.setupAutoCapture();
  }

  private setupAutoCapture() {
    // Capture React errors
    window.addEventListener('error', (event) => {
      this.reportBug({
        type: 'error',
        component: 'global',
        message: event.error?.message || 'Unknown error',
        stack: event.error?.stack,
        context: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          userAgent: navigator.userAgent,
          url: window.location.href
        },
        severity: 'high'
      });
    });

    // Capture unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.reportBug({
        type: 'error',
        component: 'async',
        message: event.reason?.message || 'Unhandled promise rejection',
        stack: event.reason?.stack,
        context: {
          reason: event.reason,
          userAgent: navigator.userAgent,
          url: window.location.href
        },
        severity: 'high'
      });
    });

    // Monitor performance issues
    if ('performance' in window && 'getEntriesByType' in performance) {
      setTimeout(() => {
        this.checkPerformanceIssues();
      }, 5000);
    }
  }

  private checkPerformanceIssues() {
    try {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
      
      // Check for slow page load
      const loadTime = navigation.loadEventEnd - navigation.fetchStart;
      if (loadTime > 5000) {
        this.reportBug({
          type: 'performance',
          component: 'page-load',
          message: 'Slow page load detected',
          context: {
            loadTime,
            domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
            firstPaint: navigation.responseEnd - navigation.fetchStart
          },
          severity: 'medium'
        });
      }

      // Check for poor LCP
      if (lcpEntries.length > 0) {
        const lcp = lcpEntries[lcpEntries.length - 1] as PerformanceEntry;
        if (lcp.startTime > 2500) {
          this.reportBug({
            type: 'performance',
            component: 'lcp',
            message: 'Poor Largest Contentful Paint',
            context: {
              lcpTime: lcp.startTime,
              element: (lcp as any).element?.tagName
            },
            severity: 'medium'
          });
        }
      }

      // Check memory usage
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        const memoryUsage = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
        
        if (memoryUsage > 0.9) {
          this.reportBug({
            type: 'performance',
            component: 'memory',
            message: 'High memory usage detected',
            context: {
              usedHeapSize: memory.usedJSHeapSize,
              totalHeapSize: memory.totalJSHeapSize,
              heapSizeLimit: memory.jsHeapSizeLimit,
              usagePercentage: memoryUsage * 100
            },
            severity: 'high'
          });
        }
      }
    } catch (error) {
      console.warn('Performance monitoring failed:', error);
    }
  }

  reportBug(bugData: Omit<BugReport, 'id' | 'timestamp' | 'resolved'>) {
    const bug: BugReport = {
      ...bugData,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      resolved: false
    };

    this.bugs.push(bug);
    
    // Keep only last 100 bugs
    if (this.bugs.length > 100) {
      this.bugs = this.bugs.slice(-100);
    }

    // Log to console based on severity
    if (bug.severity === 'critical' || bug.severity === 'high') {
      console.error(`🔥 Bug Report [${bug.severity.toUpperCase()}]:`, bug);
    } else {
      console.warn(`⚠️ Bug Report [${bug.severity.toUpperCase()}]:`, bug);
    }

    // Store in localStorage for persistence
    this.persistBugs();
    
    // Notify observers
    this.notifyObservers();

    return bug.id;
  }

  resolveBug(bugId: string) {
    const bug = this.bugs.find(b => b.id === bugId);
    if (bug) {
      bug.resolved = true;
      this.persistBugs();
      this.notifyObservers();
    }
  }

  getBugs(filter?: {
    type?: BugReport['type'];
    severity?: BugReport['severity'];
    resolved?: boolean;
    component?: string;
  }): BugReport[] {
    let filtered = this.bugs;

    if (filter) {
      if (filter.type) filtered = filtered.filter(b => b.type === filter.type);
      if (filter.severity) filtered = filtered.filter(b => b.severity === filter.severity);
      if (filter.resolved !== undefined) filtered = filtered.filter(b => b.resolved === filter.resolved);
      if (filter.component) {
        const componentFilter = filter.component;
        filtered = filtered.filter(b => b.component && b.component.includes(componentFilter));
      }
    }

    return filtered.sort((a, b) => b.timestamp - a.timestamp);
  }

  getStats() {
    const total = this.bugs.length;
    const resolved = this.bugs.filter(b => b.resolved).length;
    const byType = this.bugs.reduce((acc, bug) => {
      acc[bug.type] = (acc[bug.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const bySeverity = this.bugs.reduce((acc, bug) => {
      acc[bug.severity] = (acc[bug.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total,
      resolved,
      pending: total - resolved,
      byType,
      bySeverity
    };
  }

  subscribe(observer: (bugs: BugReport[]) => void) {
    this.observers.push(observer);
    return () => {
      this.observers = this.observers.filter(obs => obs !== observer);
    };
  }

  private notifyObservers() {
    this.observers.forEach(observer => observer(this.bugs));
  }

  private persistBugs() {
    try {
      localStorage.setItem('nocodelos_bugs', JSON.stringify(this.bugs.slice(-50)));
    } catch (error) {
      console.warn('Failed to persist bugs:', error);
    }
  }

  loadPersistedBugs() {
    try {
      const saved = localStorage.getItem('nocodelos_bugs');
      if (saved) {
        this.bugs = JSON.parse(saved);
        this.notifyObservers();
      }
    } catch (error) {
      console.warn('Failed to load persisted bugs:', error);
    }
  }

  exportBugs() {
    const data = {
      timestamp: new Date().toISOString(),
      stats: this.getStats(),
      bugs: this.bugs
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bug-report-${Date.now()}.json`;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  clearResolvedBugs() {
    this.bugs = this.bugs.filter(bug => !bug.resolved);
    this.persistBugs();
    this.notifyObservers();
  }
}

export const bugTracker = BugTracker.getInstance();

import { useState, useEffect } from 'react';

// React hook for bug tracking
export const useBugTracker = () => {
  const [bugs, setBugs] = useState<BugReport[]>([]);

  useEffect(() => {
    // Load persisted bugs
    bugTracker.loadPersistedBugs();
    
    // Subscribe to updates
    const unsubscribe = bugTracker.subscribe(setBugs);
    
    return unsubscribe;
  }, []);

  return {
    bugs,
    reportBug: bugTracker.reportBug.bind(bugTracker),
    resolveBug: bugTracker.resolveBug.bind(bugTracker),
    getBugs: bugTracker.getBugs.bind(bugTracker),
    getStats: bugTracker.getStats.bind(bugTracker),
    exportBugs: bugTracker.exportBugs.bind(bugTracker),
    clearResolvedBugs: bugTracker.clearResolvedBugs.bind(bugTracker)
  };
};

// Type guard functions
export const isNetworkError = (error: Error): boolean => {
  return error.message.includes('fetch') || 
         error.message.includes('network') ||
         error.message.includes('Connection') ||
         error.name === 'NetworkError';
};

export const isValidationError = (error: Error): boolean => {
  return error.message.includes('validation') ||
         error.message.includes('invalid') ||
         error.message.includes('required');
};

export const isTimeoutError = (error: Error): boolean => {
  return error.message.includes('timeout') ||
         error.message.includes('aborted') ||
         error.name === 'AbortError';
};