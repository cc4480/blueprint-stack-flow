import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, AlertTriangle, RefreshCw, Zap } from 'lucide-react';
import { componentValidator } from '../utils/componentValidator';
import { performanceService } from '../services/performanceService';

interface SystemStatus {
  api: 'healthy' | 'warning' | 'error';
  database: 'healthy' | 'warning' | 'error';
  performance: 'healthy' | 'warning' | 'error';
  components: 'healthy' | 'warning' | 'error';
}

const SystemHealthMonitor: React.FC = () => {
  const [status, setStatus] = useState<SystemStatus>({
    api: 'healthy',
    database: 'healthy',
    performance: 'healthy',
    components: 'healthy'
  });
  const [isChecking, setIsChecking] = useState(false);
  const [lastCheck, setLastCheck] = useState<number>(Date.now());

  const checkSystemHealth = async () => {
    setIsChecking(true);
    const newStatus: SystemStatus = {
      api: 'healthy',
      database: 'healthy',
      performance: 'healthy',
      components: 'healthy'
    };

    try {
      // Check API health
      const apiResponse = await fetch('/api/health');
      newStatus.api = apiResponse.ok ? 'healthy' : 'error';
    } catch (error) {
      newStatus.api = 'error';
    }

    try {
      // Check database health
      const dbResponse = await fetch('/api/db/health');
      newStatus.database = dbResponse.ok ? 'healthy' : 'error';
    } catch (error) {
      newStatus.database = 'warning'; // Database might be unavailable but not critical
    }

    // Check performance metrics
    const performanceMetrics = performanceService.getMetricsSummary();
    const clsMetrics = performanceMetrics.find(m => m.name === 'cumulative-layout-shift');
    newStatus.performance = clsMetrics && clsMetrics.average > 0.1 ? 'warning' : 'healthy';

    // Check component health
    const componentHealth = componentValidator.getSystemHealth();
    newStatus.components = componentHealth.overall;

    setStatus(newStatus);
    setLastCheck(Date.now());
    setIsChecking(false);
  };

  useEffect(() => {
    checkSystemHealth();
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(checkSystemHealth, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy':
        return <Badge className="bg-green-600">Healthy</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-600">Warning</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const overallStatus = Object.values(status).includes('error') ? 'error' :
                       Object.values(status).includes('warning') ? 'warning' : 'healthy';

  return (
    <Card className="bg-gray-900 border-blue-400/30">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon(overallStatus)}
            System Health Monitor
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge(overallStatus)}
            <Button
              onClick={checkSystemHealth}
              disabled={isChecking}
              size="sm"
              variant="outline"
              className="border-blue-400/50"
            >
              {isChecking ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">API Services</span>
              {getStatusIcon(status.api)}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Database</span>
              {getStatusIcon(status.database)}
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Performance</span>
              {getStatusIcon(status.performance)}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Components</span>
              {getStatusIcon(status.components)}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-700">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Last checked: {new Date(lastCheck).toLocaleTimeString()}</span>
            <span>NoCodeLos Stack v4.0</span>
          </div>
        </div>

        {overallStatus === 'healthy' && (
          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3">
            <div className="flex items-center gap-2 text-green-200">
              <Zap className="w-4 h-4" />
              <span className="text-sm font-medium">All systems operational</span>
            </div>
          </div>
        )}

        {overallStatus !== 'healthy' && (
          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3">
            <div className="text-yellow-200">
              <h4 className="text-sm font-medium mb-1">System Issues Detected</h4>
              <ul className="text-xs space-y-1">
                {status.api === 'error' && <li>• API services are unavailable</li>}
                {status.database === 'error' && <li>• Database connection failed</li>}
                {status.performance === 'warning' && <li>• Performance metrics above threshold</li>}
                {status.components === 'error' && <li>• Component validation errors detected</li>}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SystemHealthMonitor;