
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Brain, Zap, Settings, Save, Play, Download } from 'lucide-react';
import ApiKeyManager from '@/components/ApiKeyManager';

const PromptStudio = () => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState('You are a helpful AI assistant specialized in the NoCodeLos Blueprint Stack.');

  const handleApiKeyChange = (key: string | null) => {
    setApiKey(key);
  };

  const executePrompt = async () => {
    if (!apiKey || !prompt.trim()) return;
    
    setIsLoading(true);
    try {
      // This would connect to the DeepSeek API via edge function
      setResponse('Demo response from DeepSeek Reasoner - full integration pending API key configuration');
    } catch (error) {
      setResponse('Error executing prompt. Please check your API key and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold gradient-logo-text mb-4">
            Prompt Engineering Studio
          </h1>
          <p className="text-purple-300 text-lg">
            Advanced prompt crafting with DeepSeek Reasoner integration
          </p>
        </div>

        {!apiKey ? (
          <div className="flex justify-center">
            <ApiKeyManager onApiKeyChange={handleApiKeyChange} />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Prompt Input */}
            <Card className="bg-gray-900 border-blue-400/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-blue-400" />
                  Prompt Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="system-prompt">System Prompt</Label>
                  <Textarea
                    id="system-prompt"
                    value={systemPrompt}
                    onChange={(e) => setSystemPrompt(e.target.value)}
                    className="mt-2 bg-black border-purple-400/30"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="user-prompt">User Prompt</Label>
                  <Textarea
                    id="user-prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Enter your prompt here..."
                    className="mt-2 bg-black border-purple-400/30"
                    rows={8}
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={executePrompt}
                    disabled={isLoading || !prompt.trim()}
                    className="bg-gradient-to-r from-blue-500 via-purple-500 to-red-500"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {isLoading ? 'Processing...' : 'Execute'}
                  </Button>
                  <Button variant="outline" className="border-blue-400/50">
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Response Output */}
            <Card className="bg-gray-900 border-green-400/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-green-400" />
                  AI Response
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={response}
                  readOnly
                  className="bg-black border-green-400/30 text-green-300"
                  rows={12}
                  placeholder="AI response will appear here..."
                />
                {response && (
                  <Button variant="outline" className="mt-4 border-green-400/50">
                    <Download className="w-4 h-4 mr-2" />
                    Export Response
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromptStudio;
