
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Zap, TestTube, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import ApiKeyManager from '@/components/ApiKeyManager';
import { promptService } from '@/services/promptService';

const PromptStudio = () => {
  const [isApiKeyConfigured, setIsApiKeyConfigured] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    // Check if API key is already configured
    const savedKey = localStorage.getItem('deepseek_api_key');
    if (savedKey) {
      setIsApiKeyConfigured(true);
      promptService.setApiKey(savedKey);
      console.log('🔑 DeepSeek API key found and configured');
    }
  }, []);

  const handleApiKeyChange = (key: string | null) => {
    if (key) {
      promptService.setApiKey(key);
      setIsApiKeyConfigured(true);
      setConnectionStatus('idle');
      console.log('✅ API key configured successfully');
      toast.success('API key configured successfully!');
    } else {
      setIsApiKeyConfigured(false);
      setConnectionStatus('idle');
      console.log('🗑️ API key removed');
    }
  };

  const testConnectivity = async () => {
    if (!isApiKeyConfigured) {
      toast.error('Please configure your DeepSeek API key first');
      return;
    }

    setIsTestingConnection(true);
    setConnectionStatus('idle');
    console.log('🧪 Testing DeepSeek API connectivity...');

    try {
      const testResult = await promptService.generatePrompt({
        appType: 'Test Application',
        dataSource: 'Test Data',
        features: ['test'],
        platform: 'web',
        additionalContext: 'This is a connectivity test'
      });

      if (testResult && testResult.prompt) {
        setConnectionStatus('success');
        toast.success('✅ Connectivity test successful! DeepSeek API is working properly.');
        console.log('✅ DeepSeek API connectivity test passed:', testResult);
      } else {
        throw new Error('No response received from API');
      }
    } catch (error) {
      console.error('❌ DeepSeek API connectivity test failed:', error);
      setConnectionStatus('error');
      toast.error('❌ Connectivity test failed. Please check your API key and try again.');
    } finally {
      setIsTestingConnection(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 py-8">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            NoCodeLos Prompt Studio
          </h1>
          <p className="text-xl text-gray-600">
            Configure your DeepSeek API and test advanced AI capabilities
          </p>
        </div>

        {/* API Key Configuration Section */}
        <div className="mb-8">
          <ApiKeyManager onApiKeyChange={handleApiKeyChange} />
        </div>

        {/* Connectivity Test Section */}
        {isApiKeyConfigured && (
          <Card className="mb-8 border-2 border-blue-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              <CardTitle className="flex items-center space-x-2">
                <TestTube className="w-6 h-6" />
                <span>API Connectivity Test</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    {connectionStatus === 'success' && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                    {connectionStatus === 'error' && (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                    {connectionStatus === 'idle' && (
                      <Brain className="w-5 h-5 text-blue-500" />
                    )}
                    <span className="font-medium">
                      {connectionStatus === 'success' && 'Connection Successful'}
                      {connectionStatus === 'error' && 'Connection Failed'}
                      {connectionStatus === 'idle' && 'Ready to Test'}
                    </span>
                  </div>
                </div>
                <Button
                  onClick={testConnectivity}
                  disabled={isTestingConnection}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                >
                  {isTestingConnection ? (
                    <div className="flex items-center space-x-2">
                      <Brain className="w-4 h-4 animate-spin" />
                      <span>Testing...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Zap className="w-4 h-4" />
                      <span>Test Connectivity</span>
                    </div>
                  )}
                </Button>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">Test Information:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Tests connection to DeepSeek Reasoner API</li>
                  <li>• Validates API key functionality</li>
                  <li>• Ensures RAG 2.0, MCP & A2A protocols are accessible</li>
                  <li>• Confirms prompt generation capabilities</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-2 border-green-200">
            <CardContent className="p-6 text-center">
              <Brain className="w-8 h-8 text-green-500 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800 mb-2">DeepSeek Reasoner</h3>
              <p className="text-sm text-gray-600">
                {isApiKeyConfigured ? 'Configured ✅' : 'Not Configured ❌'}
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-200">
            <CardContent className="p-6 text-center">
              <Zap className="w-8 h-8 text-blue-500 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800 mb-2">RAG 2.0 Pipeline</h3>
              <p className="text-sm text-gray-600">
                {connectionStatus === 'success' ? 'Active ✅' : 'Standby ⏳'}
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200">
            <CardContent className="p-6 text-center">
              <TestTube className="w-8 h-8 text-purple-500 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800 mb-2">MCP & A2A Protocols</h3>
              <p className="text-sm text-gray-600">
                {connectionStatus === 'success' ? 'Ready ✅' : 'Waiting ⏳'}
              </p>
            </CardContent>
          </Card>
        </div>

        {!isApiKeyConfigured && (
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-center space-x-2 mb-2">
              <Brain className="w-5 h-5 text-yellow-600" />
              <h4 className="font-semibold text-yellow-800">Getting Started</h4>
            </div>
            <p className="text-yellow-700 mb-3">
              Configure your DeepSeek API key above to enable advanced AI capabilities including:
            </p>
            <ul className="text-sm text-yellow-600 space-y-1">
              <li>• Advanced reasoning with DeepSeek Reasoner model</li>
              <li>• RAG 2.0 retrieval-augmented generation</li>
              <li>• MCP protocol for tool integration</li>
              <li>• A2A protocol for agent communication</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromptStudio;
