
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Brain, Zap, Settings, Save, Play, Download, Square, MessageSquare } from 'lucide-react';
import ApiKeyManager from '@/components/ApiKeyManager';
import { promptService } from '@/services/promptService';
import { toast } from 'sonner';

const PromptStudio = () => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState('You are a helpful AI assistant specialized in the NoCodeLos Blueprint Stack with RAG 2.0, MCP, and A2A protocol integration.');
  const responseRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (responseRef.current && isStreaming) {
      responseRef.current.scrollTop = responseRef.current.scrollHeight;
    }
  }, [response, isStreaming]);

  const handleApiKeyChange = (key: string | null) => {
    setApiKey(key);
    if (key) {
      promptService.setApiKey(key);
    }
  };

  const executePrompt = async () => {
    if (!apiKey || !prompt.trim()) {
      toast.error('Please enter your API key and prompt');
      return;
    }
    
    setIsStreaming(true);
    setResponse('');
    abortControllerRef.current = new AbortController();
    
    try {
      console.log('🚀 Starting deepseek-chat streaming...');
      
      await promptService.streamChatResponse(
        [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        (token: string) => {
          setResponse(prev => prev + token);
        },
        () => {
          setIsStreaming(false);
          toast.success('✅ Response completed');
          console.log('✅ Streaming completed successfully');
        },
        (error: string) => {
          setIsStreaming(false);
          toast.error(`❌ Streaming error: ${error}`);
          console.error('❌ Streaming error:', error);
        }
      );
    } catch (error) {
      setIsStreaming(false);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setResponse(`Error: ${errorMessage}`);
      toast.error('❌ Failed to execute prompt');
      console.error('❌ Execute prompt failed:', error);
    }
  };

  const stopStreaming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsStreaming(false);
      toast.info('Streaming stopped');
    }
  };

  const clearResponse = () => {
    setResponse('');
  };

  const exportResponse = () => {
    if (!response) return;
    
    const blob = new Blob([response], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `deepseek-response-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Response exported successfully');
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold gradient-logo-text mb-4">
            DeepSeek Chat Studio
          </h1>
          <p className="text-purple-300 text-lg">
            Real-time streaming with deepseek-chat integration
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
                  Chat Configuration
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
                  <Label htmlFor="user-prompt">User Message</Label>
                  <Textarea
                    id="user-prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Enter your message here..."
                    className="mt-2 bg-black border-purple-400/30"
                    rows={8}
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {!isStreaming ? (
                    <Button 
                      onClick={executePrompt}
                      disabled={!prompt.trim()}
                      className="bg-gradient-to-r from-blue-500 via-purple-500 to-red-500"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start Chat
                    </Button>
                  ) : (
                    <Button 
                      onClick={stopStreaming}
                      variant="destructive"
                    >
                      <Square className="w-4 h-4 mr-2" />
                      Stop
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    className="border-blue-400/50"
                    onClick={clearResponse}
                    disabled={!response}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Clear
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
                <CardTitle className="flex items-center gap-2 justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-green-400" />
                    <span>DeepSeek Response</span>
                  </div>
                  {isStreaming && (
                    <div className="flex items-center gap-2 text-sm text-green-400">
                      <div className="animate-pulse w-2 h-2 bg-green-400 rounded-full"></div>
                      Streaming...
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  ref={responseRef}
                  value={response}
                  readOnly
                  className="bg-black border-green-400/30 text-green-300 font-mono text-sm"
                  rows={12}
                  placeholder="DeepSeek chat response will stream here in real-time..."
                />
                {response && (
                  <div className="flex gap-2 mt-4">
                    <Button 
                      variant="outline" 
                      className="border-green-400/50"
                      onClick={exportResponse}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export Response
                    </Button>
                    <Button 
                      variant="outline" 
                      className="border-green-400/50"
                      onClick={() => {
                        navigator.clipboard.writeText(response);
                        toast.success('Response copied to clipboard');
                      }}
                    >
                      Copy to Clipboard
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Status Information */}
        {apiKey && (
          <Card className="bg-gray-900 border-purple-400/30">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-blue-400 font-semibold">Model</div>
                  <div className="text-gray-300">deepseek-chat</div>
                </div>
                <div className="text-center">
                  <div className="text-purple-400 font-semibold">Integration</div>
                  <div className="text-gray-300">Real-time Streaming</div>
                </div>
                <div className="text-center">
                  <div className="text-green-400 font-semibold">Status</div>
                  <div className="text-gray-300">
                    {isStreaming ? 'Streaming Active' : 'Ready'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PromptStudio;
