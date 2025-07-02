
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('🚨 Error Boundary Caught:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // Log error to analytics
    if (window.analytics) {
      window.analytics.track('error_boundary_triggered', 'error', error.message);
    }

    // Send error to external error tracking service
    this.logErrorToService(error, errorInfo);
  }

  private logErrorToService(error: Error, errorInfo: ErrorInfo) {
    const errorData = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    // Store locally for debugging
    try {
      const existingErrors = JSON.parse(localStorage.getItem('nocodelos_errors') || '[]');
      existingErrors.push(errorData);
      localStorage.setItem('nocodelos_errors', JSON.stringify(existingErrors.slice(-10))); // Keep last 10 errors
    } catch (e) {
      console.warn('⚠️ Could not store error data:', e);
    }

    console.log('💾 Error logged:', errorData);
  }

  private handleRefresh = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  private handleHome = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  private handleReportError = () => {
    const errorReport = {
      error: this.state.error?.message,
      stack: this.state.error?.stack,
      componentStack: this.state.errorInfo?.componentStack,
      timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(errorReport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `error_report_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    console.log('📥 Error report downloaded');
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-6">
          <div className="max-w-2xl w-full">
            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-red-100">
              <div className="text-center mb-8">
                <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Oops! Something went wrong
                </h1>
                <p className="text-lg text-gray-600">
                  The NoCodeLos Blueprint Stack encountered an unexpected error
                </p>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
                <h2 className="text-lg font-semibold text-red-800 mb-2">Error Details:</h2>
                <p className="text-red-700 font-mono text-sm">
                  {this.state.error?.message || 'Unknown error occurred'}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                <Button
                  onClick={this.handleRefresh}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh Page
                </Button>
                
                <Button
                  onClick={this.handleHome}
                  variant="outline"
                  className="border-purple-400 text-purple-600 hover:bg-purple-50"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Go Home
                </Button>
                
                <Button
                  onClick={this.handleReportError}
                  variant="ghost"
                  className="text-gray-600 hover:text-gray-800"
                >
                  📥 Download Error Report
                </Button>
              </div>

              <div className="text-center text-sm text-gray-500">
                <p>This error has been automatically logged for debugging.</p>
                <p className="mt-2">
                  Need help? Visit{' '}
                  <a 
                    href="https://discord.gg/nocodelos" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-purple-600 hover:underline"
                  >
                    our Discord community
                  </a>
                </p>
              </div>

              {process.env.NODE_ENV === 'development' && (
                <details className="mt-8 text-xs">
                  <summary className="cursor-pointer text-gray-600 hover:text-gray-800">
                    🐛 Developer Details (Development Mode)
                  </summary>
                  <div className="mt-4 bg-gray-100 p-4 rounded font-mono text-xs overflow-auto max-h-40">
                    <div className="mb-2">
                      <strong>Stack Trace:</strong>
                    </div>
                    <pre>{this.state.error?.stack}</pre>
                    {this.state.errorInfo && (
                      <>
                        <div className="mt-4 mb-2">
                          <strong>Component Stack:</strong>
                        </div>
                        <pre>{this.state.errorInfo.componentStack}</pre>
                      </>
                    )}
                  </div>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Extend Window interface for analytics
declare global {
  interface Window {
    analytics?: any;
  }
}

export default ErrorBoundary;
