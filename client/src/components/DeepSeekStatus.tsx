
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Loader2, Zap, Activity } from 'lucide-react';

const DeepSeekStatus = () => {
  const [status, setStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [lastResponse, setLastResponse] = useState<string>('');
  const [responseTime, setResponseTime] = useState<number>(0);
  const [testing, setTesting] = useState(false);

  const testConnection = async () => {
    setTesting(true);
    setStatus('checking');
    const startTime = Date.now();

    try {
      const response = await fetch('/api/deepseek/reason', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-session-id': `status-check-${Date.now()}`
        },
        body: JSON.stringify({
          prompt: 'Respond with "DeepSeek API is working correctly" to confirm connectivity.',
          systemPrompt: 'You are a connectivity test assistant.',
          temperature: 0.3,
          maxSteps: 1
        })
      });

      const endTime = Date.now();
      setResponseTime(endTime - startTime);

      if (response.ok) {
        const data = await response.json();
        setStatus('connected');
        setLastResponse(data.reasoning || 'Connected successfully');
      } else {
        setStatus('disconnected');
        const errorData = await response.json();
        setLastResponse(errorData.error || 'Connection failed');
      }
    } catch (error) {
      setStatus('disconnected');
      setLastResponse(`Connection error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setResponseTime(0);
    } finally {
      setTesting(false);
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  const getStatusIcon = () => {
    switch (status) {
      case 'checking':
        return <Loader2 className="w-5 h-5 text-yellow-400 animate-spin" />;
      case 'connected':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'disconnected':
        return <XCircle className="w-5 h-5 text-red-400" />;
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'checking':
        return <Badge variant="outline" className="border-yellow-400 text-yellow-400">Checking...</Badge>;
      case 'connected':
        return <Badge className="bg-green-600">Connected</Badge>;
      case 'disconnected':
        return <Badge variant="destructive">Disconnected</Badge>;
    }
  };

  return (
    <Card className="bg-gray-900 border-blue-400/30">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            DeepSeek API Status
          </div>
          {getStatusBadge()}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-400">Response Time</p>
            <p className="text-lg font-semibold">
              {responseTime > 0 ? `${responseTime}ms` : 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400">API Model</p>
            <p className="text-lg font-semibold">deepseek-reasoner</p>
          </div>
        </div>

        {lastResponse && (
          <div className="mt-4">
            <p className="text-sm text-gray-400 mb-2">Last Response:</p>
            <div className="bg-black border border-gray-700 rounded p-3 text-sm">
              <pre className="whitespace-pre-wrap text-gray-300">{lastResponse}</pre>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button 
            onClick={testConnection}
            disabled={testing}
            variant="outline"
            className="border-blue-400/50"
          >
            {testing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Testing...
              </>
            ) : (
              <>
                <Activity className="w-4 h-4 mr-2" />
                Test Connection
              </>
            )}
          </Button>
          
          {status === 'connected' && (
            <Button 
              onClick={() => window.location.href = '/prompt-studio'}
              className="bg-gradient-to-r from-blue-500 to-purple-500"
            >
              <Zap className="w-4 h-4 mr-2" />
              Try Prompt Studio
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DeepSeekStatus;
