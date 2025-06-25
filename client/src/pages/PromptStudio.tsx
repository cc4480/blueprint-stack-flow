
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Brain, Zap, Save, Play, Download, Loader2 } from 'lucide-react';
import ApiKeyManager from '@/components/ApiKeyManager';

const PromptStudio = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('You are a helpful AI assistant specialized in the NoCodeLos Blueprint Stack.');

  const handleApiKeyChange = (key: string | null) => {
    // API key is now handled server-side
    console.log('API key configured');
  };

  const executePrompt = async () => {
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    setResponse('');
    setStreamingText('');
    
    // Add streaming messages like Interactive Demo
    const streamingMessages = [
      'Initializing DeepSeek Reasoner...',
      'Processing system context...',
      'Analyzing user prompt...',
      'Generating reasoning chain...',
      'Crafting comprehensive response...',
      'Finalizing output...'
    ];
    
    let messageIndex = 0;
    const streamInterval = setInterval(() => {
      if (messageIndex < streamingMessages.length) {
        setStreamingText(streamingMessages[messageIndex]);
        messageIndex++;
      } else {
        setStreamingText('Processing advanced reasoning... This may take a moment for complex queries.');
      }
    }, 2000);
    
    try {
      const response = await fetch('/api/deepseek/reason', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-session-id': `prompt-studio-${Date.now()}`
        },
        body: JSON.stringify({
          prompt,
          systemPrompt,
          temperature: 0.7,
          maxSteps: 10
        })
      });

      const data = await response.json();
      
      clearInterval(streamInterval);
      setStreamingText('');
      
      if (!response.ok) {
        setResponse(`Error: ${data.error}`);
        return;
      }

      setResponse(data.reasoning || data.finalAnswer || 'Response received successfully');
    } catch (error) {
      clearInterval(streamInterval);
      setStreamingText('');
      setResponse('Error executing prompt. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-6 px-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold gradient-logo-text mb-4">
            Prompt Engineering Studio v4.0
          </h1>
          <p className="text-purple-300 text-lg">
            AI Master Blueprint generation with DeepSeek reasoning and real-time streaming
          </p>
        </div>

        <div className="mb-6 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-900/30 border border-green-400/30 rounded-lg">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <p className="text-green-400">DeepSeek API configured with AI Master Blueprint Template v4.0</p>
          </div>
          
          <div className="max-w-2xl mx-auto p-4 bg-blue-900/20 border border-blue-400/30 rounded-lg">
            <h3 className="text-blue-300 font-medium mb-2">AI Master Blueprint Template v4.0 Features:</h3>
            <div className="grid grid-cols-2 gap-2 text-sm text-blue-200">
              <div>✓ AI-native architecture patterns</div>
              <div>✓ Production-ready code examples</div>
              <div>✓ RAG 2.0 integration guides</div>
              <div>✓ MCP protocol implementations</div>
              <div>✓ A2A agent coordination</div>
              <div>✓ Complete deployment strategies</div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                  placeholder="Example: Create a comprehensive e-commerce platform with AI-powered product recommendations, real-time inventory management, secure payment processing, and advanced analytics dashboard. Include user authentication, order tracking, and responsive design for mobile and desktop."
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

          <Card className="bg-gray-900 border-green-400/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-green-400" />
                AI Response
                {isLoading && <Loader2 className="w-4 h-4 animate-spin text-blue-400" />}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Enhanced streaming status display */}
              {isLoading && streamingText && (
                <div className="mb-4 p-4 bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-400/40 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
                        <div className="absolute inset-0 w-5 h-5 rounded-full border-2 border-blue-400/20 animate-pulse"></div>
                      </div>
                      <div>
                        <span className="text-blue-300 font-medium text-sm">{streamingText}</span>
                        <div className="text-xs text-blue-400/70 mt-1">DeepSeek Reasoner Active</div>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-100"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-200"></div>
                    </div>
                  </div>
                  <div className="mt-3 w-full bg-gray-800 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full animate-pulse"></div>
                  </div>
                </div>
              )}
              
              <Textarea
                value={response}
                readOnly
                className="bg-black border-green-400/30 text-green-300"
                rows={12}
                placeholder={isLoading ? "DeepSeek is processing your request..." : "AI response will appear here..."}
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
      </div>
    </div>
  );
};

export default PromptStudio;
