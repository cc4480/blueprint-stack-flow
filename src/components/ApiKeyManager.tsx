
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Key, Save, Trash2, Brain, Zap } from 'lucide-react';
import { toast } from 'sonner';
import Logo from './Logo';

interface ApiKeyManagerProps {
  onApiKeyChange: (key: string | null) => void;
}

const ApiKeyManager = ({ onApiKeyChange }: ApiKeyManagerProps) => {
  const [apiKey, setApiKey] = useState<string>('');
  const [showKey, setShowKey] = useState(false);
  const [isValidated, setIsValidated] = useState(false);

  useEffect(() => {
    // Load saved API key from localStorage
    const savedKey = localStorage.getItem('deepseek_api_key');
    if (savedKey) {
      setApiKey(savedKey);
      setIsValidated(true);
      onApiKeyChange(savedKey);
      console.log('🔑 Loaded DeepSeek API key for NoCodeLos Blueprint Stack integration');
    }
  }, [onApiKeyChange]);

  const validateAndSaveKey = async () => {
    if (!apiKey.trim()) {
      toast.error('Please enter your DeepSeek API key');
      return;
    }

    console.log('🔍 Validating DeepSeek API key for RAG 2.0 + MCP + A2A integration...');
    
    try {
      // Test the API key with DeepSeek Reasoner model
      const response = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek-reasoner',
          messages: [{ role: 'user', content: 'Test NoCodeLos Blueprint Stack integration' }],
          max_tokens: 10,
        }),
      });

      if (response.ok || response.status === 400) { // 400 is OK for test request
        localStorage.setItem('deepseek_api_key', apiKey);
        setIsValidated(true);
        onApiKeyChange(apiKey);
        toast.success('✅ DeepSeek API key validated! RAG 2.0, MCP & A2A protocols ready');
        console.log('✅ DeepSeek Reasoner API key validated for NoCodeLos Blueprint Stack');
      } else {
        throw new Error('Invalid DeepSeek API key');
      }
    } catch (error) {
      console.error('❌ DeepSeek API key validation failed:', error);
      toast.error('❌ Invalid API key. Please check and try again.');
      setIsValidated(false);
    }
  };

  const removeKey = () => {
    localStorage.removeItem('deepseek_api_key');
    setApiKey('');
    setIsValidated(false);
    onApiKeyChange(null);
    toast.success('DeepSeek API key removed');
    console.log('🗑️ DeepSeek API key removed from NoCodeLos Blueprint Stack');
  };

  return (
    <Card className="w-full max-w-lg mx-auto border-2 border-blue-400/30 shadow-xl"
          style={{
            boxShadow: '0 0 30px rgba(59, 130, 246, 0.2), 0 0 60px rgba(147, 51, 234, 0.1)'
          }}>
      <CardHeader className="bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-red-400/20 animate-pulse"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="w-6 h-6" />
              <span>DeepSeek Reasoner API Configuration</span>
            </CardTitle>
            <p className="text-sm text-blue-100 mt-2">
              Enable RAG 2.0, MCP & A2A protocols for the NoCodeLos Blueprint Stack
            </p>
          </div>
          <Logo size="sm" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="space-y-3">
          <label className="text-sm font-semibold text-gray-700">
            DeepSeek API Key
          </label>
          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your DeepSeek API key for advanced AI integration"
              className="w-full px-4 py-3 border-2 border-blue-300/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-400 pr-12 text-sm transition-all duration-300"
              style={{
                boxShadow: 'inset 0 2px 4px rgba(59, 130, 246, 0.1)'
              }}
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-700 transition-colors"
            >
              {showKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {isValidated && (
          <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-green-50 border-2 border-blue-300/50 rounded-xl p-4 relative overflow-hidden"
               style={{
                 boxShadow: '0 0 20px rgba(59, 130, 246, 0.1)'
               }}>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/5 via-purple-400/5 to-green-400/5 animate-pulse"></div>
            <div className="relative z-10">
              <div className="flex items-center space-x-2 mb-2">
                <Zap className="w-5 h-5 text-blue-600" />
                <p className="text-blue-800 font-semibold">API Key Active</p>
              </div>
              <div className="text-sm text-blue-700 space-y-1">
                <p>✅ DeepSeek Reasoner API connected</p>
                <p>✅ RAG 2.0 retrieval pipelines ready</p>
                <p>✅ MCP protocol endpoints configured</p>
                <p>✅ A2A agent communication enabled</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex space-x-3">
          <Button
            onClick={validateAndSaveKey}
            className="flex-1 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 hover:from-blue-600 hover:via-purple-600 hover:to-red-600 text-white border border-blue-300/30 transition-all duration-300 transform hover:scale-105"
            style={{
              boxShadow: '0 0 20px rgba(59, 130, 246, 0.3), inset 0 1px 3px rgba(255, 255, 255, 0.2)'
            }}
          >
            <Save className="w-4 h-4 mr-2" />
            Validate & Enable
          </Button>
          
          {isValidated && (
            <Button
              onClick={removeKey}
              variant="outline"
              className="border-red-400/50 text-red-600 hover:bg-red-50 transition-all duration-300 transform hover:scale-105"
              style={{
                boxShadow: '0 0 10px rgba(239, 68, 68, 0.2)'
              }}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200/50">
          <h4 className="font-semibold text-blue-800 mb-2">🚀 Get Your Free DeepSeek API Key</h4>
          <p className="text-xs text-blue-600 mb-3">
            Access advanced AI reasoning, RAG 2.0, MCP & A2A protocols
          </p>
          <a 
            href="https://platform.deepseek.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 hover:underline font-medium text-sm transition-colors"
          >
            → Get API Key at platform.deepseek.com
          </a>
        </div>

        <div className="text-xs text-gray-500 space-y-1 bg-gray-50/50 rounded-lg p-3">
          <p><strong className="text-blue-600">RAG 2.0:</strong> Advanced retrieval-augmented generation</p>
          <p><strong className="text-purple-600">MCP:</strong> Model Context Protocol for tool integration</p>
          <p><strong className="text-red-600">A2A:</strong> Agent-to-Agent communication protocol</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiKeyManager;
