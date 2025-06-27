interface ErrorDetails {
  message: string;
  stack?: string;
  timestamp: number;
  context?: Record<string, any>;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

class ErrorHandler {
  private static instance: ErrorHandler;
  private errors: ErrorDetails[] = [];

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  logError(error: Error | string, context?: Record<string, any>, severity: ErrorDetails['severity'] = 'medium') {
    const errorDetails: ErrorDetails = {
      message: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: Date.now(),
      context,
      severity
    };

    this.errors.push(errorDetails);
    
    // Log to console for development
    if (severity === 'critical' || severity === 'high') {
      console.error('🔥 Error captured:', errorDetails);
    } else {
      console.warn('⚠️ Warning captured:', errorDetails);
    }

    // In production, you would send this to an error monitoring service
    this.reportToService(errorDetails);
  }

  private reportToService(error: ErrorDetails) {
    // Mock error reporting - in production this would go to Sentry, LogRocket, etc.
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.track('error_occurred', 'system', error.message);
    }
  }

  getRecentErrors(limit: number = 10): ErrorDetails[] {
    return this.errors
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  clearErrors() {
    this.errors = [];
  }
}

export const errorHandler = ErrorHandler.getInstance();