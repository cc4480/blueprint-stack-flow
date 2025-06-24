
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Key, Save, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

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
      console.log('🔑 Loaded saved DeepSeek API key');
    }
  }, [onApiKeyChange]);

  const validateAndSaveKey = async () => {
    if (!apiKey.trim()) {
      toast.error('Please enter an API key');
      return;
    }

    console.log('🔍 Validating DeepSeek API key...');
    
    try {
      // Test the API key with a simple request
      const response = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [{ role: 'user', content: 'Test' }],
          max_tokens: 1,
        }),
      });

      if (response.ok || response.status === 400) { // 400 is OK for test request
        localStorage.setItem('deepseek_api_key', apiKey);
        setIsValidated(true);
        onApiKeyChange(apiKey);
        toast.success('✅ API key validated and saved');
        console.log('✅ DeepSeek API key validated successfully');
      } else {
        throw new Error('Invalid API key');
      }
    } catch (error) {
      console.error('❌ API key validation failed:', error);
      toast.error('❌ Invalid API key. Please check and try again.');
      setIsValidated(false);
    }
  };

  const removeKey = () => {
    localStorage.removeItem('deepseek_api_key');
    setApiKey('');
    setIsValidated(false);
    onApiKeyChange(null);
    toast.success('API key removed');
    console.log('🗑️ DeepSeek API key removed');
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Key className="w-5 h-5" />
          <span>DeepSeek API Configuration</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">API Key</label>
          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your DeepSeek API key"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-10"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {isValidated && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-green-800 text-sm">✅ API key validated and active</p>
          </div>
        )}

        <div className="flex space-x-2">
          <Button
            onClick={validateAndSaveKey}
            className="flex-1 bg-purple-600 hover:bg-purple-700"
          >
            <Save className="w-4 h-4 mr-2" />
            Save & Validate
          </Button>
          
          {isValidated && (
            <Button
              onClick={removeKey}
              variant="outline"
              className="border-red-300 text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>

        <div className="text-xs text-gray-500">
          <p>Get your free API key at{' '}
            <a 
              href="https://platform.deepseek.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-purple-600 hover:underline"
            >
              platform.deepseek.com
            </a>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiKeyManager;
