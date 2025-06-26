
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Key, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface ApiKeyManagerProps {
  onApiKeyChange: (key: string | null) => void;
}

const ApiKeyManager: React.FC<ApiKeyManagerProps> = ({ onApiKeyChange }) => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    // Check if API key is already stored
    const storedKey = localStorage.getItem('deepseek_api_key');
    if (storedKey && storedKey !== 'sk-your-api-key-here') {
      setIsConfigured(true);
      onApiKeyChange(storedKey);
    }
  }, [onApiKeyChange]);

  const handleSaveKey = () => {
    if (!apiKey.trim()) {
      toast.error('Please enter a valid DeepSeek API key');
      return;
    }

    if (!apiKey.startsWith('sk-')) {
      toast.error('DeepSeek API key should start with "sk-"');
      return;
    }

    localStorage.setItem('deepseek_api_key', apiKey);
    setIsConfigured(true);
    onApiKeyChange(apiKey);
    toast.success('🔑 DeepSeek API key configured successfully');
    setApiKey(''); // Clear the input for security
  };

  const handleClearKey = () => {
    localStorage.removeItem('deepseek_api_key');
    setIsConfigured(false);
    setApiKey('');
    onApiKeyChange(null);
    toast.info('DeepSeek API key cleared');
  };

  if (isConfigured) {
    return (
      <Card className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">DeepSeek API Key Configured</span>
          </div>
          <p className="text-sm text-green-600 dark:text-green-300 mt-2 mb-4">
            Your API key is securely stored and ready for direct streaming
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleClearKey}
            className="border-green-300 text-green-700 hover:bg-green-100 dark:border-green-700 dark:text-green-400 dark:hover:bg-green-900/30"
          >
            Clear API Key
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <Key className="w-5 h-5" />
          Configure DeepSeek API Key
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="api-key" className="text-amber-700 dark:text-amber-300">
            DeepSeek API Key
          </Label>
          <div className="relative mt-2">
            <Input
              id="api-key"
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="pr-10 border-amber-300 focus:border-amber-500 dark:border-amber-700"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
              onClick={() => setShowKey(!showKey)}
            >
              {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </div>
        </div>
        
        <div className="text-sm text-amber-700 dark:text-amber-300">
          <p>Get your API key from:</p>
          <a 
            href="https://platform.deepseek.com/api-keys" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
          >
            DeepSeek Platform → API Keys
          </a>
        </div>
        
        <Button 
          onClick={handleSaveKey}
          className="w-full bg-amber-600 hover:bg-amber-700 text-white dark:bg-amber-700 dark:hover:bg-amber-800"
        >
          Save API Key
        </Button>
      </CardContent>
    </Card>
  );
};

export default ApiKeyManager;
