import React from 'react';

interface ErrorMetrics {
  totalErrors: number;
  errorsByType: Record<string, number>;
  errorsByComponent: Record<string, number>;
  recentErrors: ErrorReport[];
}

interface ErrorReport {
  id: string;
  type: 'network' | 'validation' | 'runtime' | 'permission' | 'timeout';
  component: string;
  message: string;
  stack?: string;
  context: Record<string, any>;
  timestamp: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  resolved: boolean;
  retryCount: number;
}

class ErrorHandler {
  private static instance: ErrorHandler;
  private errors: ErrorReport[] = [];
  private maxErrors = 100;
  private retryAttempts = 3;
  private retryDelay = 1000; // 1 second

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  constructor() {
    this.setupErrorListeners();
  }

  private setupErrorListeners() {
    // Global error handler
    window.addEventListener('error', (event) => {
      this.handleError({
        type: 'runtime',
        component: 'global',
        message: event.error?.message || 'Unknown error',
        stack: event.error?.stack,
        context: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          url: window.location.href
        },
        severity: 'high'
      });
    });

    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError({
        type: 'runtime',
        component: 'promise',
        message: event.reason?.message || 'Unhandled promise rejection',
        stack: event.reason?.stack,
        context: {
          reason: event.reason,
          url: window.location.href
        },
        severity: 'high'
      });
    });
  }

  handleError(errorData: Omit<ErrorReport, 'id' | 'timestamp' | 'resolved' | 'retryCount'>): string {
    const error: ErrorReport = {
      ...errorData,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      resolved: false,
      retryCount: 0
    };

    this.errors.push(error);

    // Keep only recent errors
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(-this.maxErrors);
    }

    // Log error based on severity
    this.logError(error);

    // Attempt auto-recovery for certain error types
    this.attemptAutoRecovery(error);

    // Persist errors
    this.persistErrors();

    return error.id;
  }

  private logError(error: ErrorReport) {
    const logMessage = `[${error.severity.toUpperCase()}] ${error.component}: ${error.message}`;
    
    switch (error.severity) {
      case 'critical':
        console.error('🔥', logMessage, error);
        break;
      case 'high':
        console.error('❌', logMessage, error);
        break;
      case 'medium':
        console.warn('⚠️', logMessage, error);
        break;
      case 'low':
        console.info('ℹ️', logMessage, error);
        break;
    }
  }

  private async attemptAutoRecovery(error: ErrorReport) {
    if (error.retryCount >= this.retryAttempts) {
      return;
    }

    // Auto-retry for network errors
    if (error.type === 'network' && error.context.retryable) {
      setTimeout(async () => {
        try {
          error.retryCount++;
          
          if (error.context.retryFunction) {
            await error.context.retryFunction();
            this.resolveError(error.id);
            console.log(`✅ Auto-recovery successful for: ${error.message}`);
          }
        } catch (retryError) {
          console.log(`🔄 Auto-recovery failed, attempt ${error.retryCount}/${this.retryAttempts}`);
        }
      }, this.retryDelay * error.retryCount);
    }
  }

  resolveError(errorId: string) {
    const error = this.errors.find(e => e.id === errorId);
    if (error) {
      error.resolved = true;
      this.persistErrors();
    }
  }

  getErrors(filter?: {
    type?: ErrorReport['type'];
    severity?: ErrorReport['severity'];
    resolved?: boolean;
    component?: string;
  }): ErrorReport[] {
    let filtered = this.errors;

    if (filter) {
      if (filter.type) filtered = filtered.filter(e => e.type === filter.type);
      if (filter.severity) filtered = filtered.filter(e => e.severity === filter.severity);
      if (filter.resolved !== undefined) filtered = filtered.filter(e => e.resolved === filter.resolved);
      if (filter.component) filtered = filtered.filter(e => e.component && e.component.includes(filter.component));
    }

    return filtered.sort((a, b) => b.timestamp - a.timestamp);
  }

  getMetrics(): ErrorMetrics {
    const totalErrors = this.errors.length;
    const recentErrors = this.errors.slice(-10);
    
    const errorsByType = this.errors.reduce((acc, error) => {
      acc[error.type] = (acc[error.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const errorsByComponent = this.errors.reduce((acc, error) => {
      acc[error.component] = (acc[error.component] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalErrors,
      errorsByType,
      errorsByComponent,
      recentErrors
    };
  }

  // Network error helper
  handleNetworkError(endpoint: string, error: any, retryFunction?: () => Promise<any>) {
    return this.handleError({
      type: 'network',
      component: 'api',
      message: `Network request failed: ${endpoint}`,
      context: {
        endpoint,
        error: error.message,
        retryable: true,
        retryFunction
      },
      severity: 'medium'
    });
  }

  // Validation error helper
  handleValidationError(component: string, field: string, message: string) {
    return this.handleError({
      type: 'validation',
      component,
      message: `Validation failed for ${field}: ${message}`,
      context: { field },
      severity: 'low'
    });
  }

  // Permission error helper
  handlePermissionError(component: string, action: string) {
    return this.handleError({
      type: 'permission',
      component,
      message: `Permission denied for action: ${action}`,
      context: { action },
      severity: 'medium'
    });
  }

  // Timeout error helper
  handleTimeoutError(component: string, operation: string, timeout: number) {
    return this.handleError({
      type: 'timeout',
      component,
      message: `Operation timed out: ${operation} (${timeout}ms)`,
      context: { operation, timeout },
      severity: 'medium'
    });
  }

  private persistErrors() {
    try {
      const recentErrors = this.errors.slice(-50);
      localStorage.setItem('nocodelos_errors', JSON.stringify(recentErrors));
    } catch (error) {
      console.warn('Failed to persist errors:', error);
    }
  }

  loadPersistedErrors() {
    try {
      const saved = localStorage.getItem('nocodelos_errors');
      if (saved) {
        const savedErrors = JSON.parse(saved);
        this.errors = [...this.errors, ...savedErrors];
      }
    } catch (error) {
      console.warn('Failed to load persisted errors:', error);
    }
  }

  clearResolvedErrors() {
    this.errors = this.errors.filter(error => !error.resolved);
    this.persistErrors();
  }

  exportErrors() {
    const data = {
      timestamp: new Date().toISOString(),
      metrics: this.getMetrics(),
      errors: this.errors
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `error-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
}

export const errorHandler = ErrorHandler.getInstance();

// React hook for error handling
export const useErrorHandler = () => {
  return {
    handleError: errorHandler.handleError.bind(errorHandler),
    handleNetworkError: errorHandler.handleNetworkError.bind(errorHandler),
    handleValidationError: errorHandler.handleValidationError.bind(errorHandler),
    handlePermissionError: errorHandler.handlePermissionError.bind(errorHandler),
    handleTimeoutError: errorHandler.handleTimeoutError.bind(errorHandler),
    getErrors: errorHandler.getErrors.bind(errorHandler),
    getMetrics: errorHandler.getMetrics.bind(errorHandler),
    resolveError: errorHandler.resolveError.bind(errorHandler),
    exportErrors: errorHandler.exportErrors.bind(errorHandler)
  };
};