import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Brain, Zap, Settings, Save, Play, Download, Square, MessageSquare, Database, BarChart3, Clock } from 'lucide-react';
import ApiKeyManager from '@/components/ApiKeyManager';
import { promptService } from '@/services/promptService';
import { toast } from 'sonner';

const PromptStudio = () => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [includeContext, setIncludeContext] = useState(true);
  const [maxTokens, setMaxTokens] = useState([8192]); // Fixed: Changed from 16384 to 8192
  const [temperature, setTemperature] = useState([0.7]);
  const [extendedOutput, setExtendedOutput] = useState(true);
  const [tokenCount, setTokenCount] = useState(0);
  const [responseLength, setResponseLength] = useState(0);
  const [streamingTime, setStreamingTime] = useState(0);
  const [systemPrompt, setSystemPrompt] = useState('You are the NoCodeLos Blueprint Stack Master AI with comprehensive RAG 2.0, MCP, and A2A protocol integration. You have access to real-time system data and can provide detailed, extensive responses leveraging all available context. Generate comprehensive responses with detailed implementation guidance, architectural patterns, and complete code examples.');
  
  const responseRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const streamStartTime = useRef<number>(0);

  useEffect(() => {
    if (responseRef.current && isStreaming) {
      responseRef.current.scrollTop = responseRef.current.scrollHeight;
    }
  }, [response, isStreaming]);

  // Update streaming time
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isStreaming) {
      interval = setInterval(() => {
        setStreamingTime(Date.now() - streamStartTime.current);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isStreaming]);

  const handleApiKeyChange = (key: string | null) => {
    setApiKey(key);
    if (key) {
      promptService.setApiKey(key);
    }
  };

  const executePrompt = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }
    
    setIsStreaming(true);
    setResponse('');
    setTokenCount(0);
    setResponseLength(0);
    setStreamingTime(0);
    streamStartTime.current = Date.now();
    abortControllerRef.current = new AbortController();
    
    try {
      console.log('🚀 Starting enhanced DeepSeek streaming with corrected max_tokens...');
      
      await promptService.streamChatResponse(
        [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        (token: string) => {
          setResponse(prev => prev + token);
          setTokenCount(prev => prev + 1);
          setResponseLength(prev => prev + token.length);
        },
        () => {
          setIsStreaming(false);
          const finalTime = Date.now() - streamStartTime.current;
          setStreamingTime(finalTime);
          toast.success(`✅ DeepSeek response completed: ${tokenCount} tokens in ${(finalTime / 1000).toFixed(1)}s`);
          console.log('✅ Enhanced DeepSeek streaming completed successfully');
        },
        (error: string) => {
          setIsStreaming(false);
          toast.error(`❌ DeepSeek streaming error: ${error}`);
          console.error('❌ DeepSeek streaming error:', error);
        },
        includeContext,
        {
          maxTokens: maxTokens[0],
          temperature: temperature[0],
          enableExtendedOutput: extendedOutput
        }
      );
    } catch (error) {
      setIsStreaming(false);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setResponse(`DeepSeek Error: ${errorMessage}`);
      toast.error('❌ Failed to execute DeepSeek prompt');
      console.error('❌ Execute DeepSeek prompt failed:', error);
    }
  };

  const stopStreaming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsStreaming(false);
      toast.info('DeepSeek streaming stopped');
    }
  };

  const clearResponse = () => {
    setResponse('');
    setTokenCount(0);
    setResponseLength(0);
    setStreamingTime(0);
  };

  const exportResponse = () => {
    if (!response) return;
    
    const blob = new Blob([response], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `deepseek-enhanced-response-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('DeepSeek response exported successfully');
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
  };

  const calculateTokensPerSecond = () => {
    if (streamingTime > 0 && tokenCount > 0) {
      return (tokenCount / (streamingTime / 1000)).toFixed(1);
    }
    return '0';
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold gradient-logo-text mb-4">
            Enhanced DeepSeek Chat Studio
          </h1>
          <p className="text-purple-300 text-lg">
            Real-time streaming with comprehensive RAG 2.0, MCP & A2A integration
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Enhanced Configuration Panel */}
          <Card className="bg-gray-900 border-blue-400/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-blue-400" />
                Enhanced DeepSeek Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <ApiKeyManager onApiKeyChange={handleApiKeyChange} />
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="include-context"
                  checked={includeContext}
                  onCheckedChange={setIncludeContext}
                />
                <Label htmlFor="include-context" className="flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  Include Comprehensive RAG+MCP+A2A Context
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="extended-output"
                  checked={extendedOutput}
                  onCheckedChange={setExtendedOutput}
                />
                <Label htmlFor="extended-output" className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Enable Extended Output
                </Label>
              </div>

              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Max Tokens: {maxTokens[0]}
                </Label>
                <Slider
                  value={maxTokens}
                  onValueChange={setMaxTokens}
                  max={8192}
                  min={1024}
                  step={512}
                  className="w-full"
                />
                <div className="text-xs text-gray-400 flex justify-between">
                  <span>1K</span>
                  <span>4K</span>
                  <span>8K</span>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Temperature: {temperature[0]}
                </Label>
                <Slider
                  value={temperature}
                  onValueChange={setTemperature}
                  max={1.0}
                  min={0.0}
                  step={0.1}
                  className="w-full"
                />
                <div className="text-xs text-gray-400 flex justify-between">
                  <span>Focused</span>
                  <span>Balanced</span>
                  <span>Creative</span>
                </div>
              </div>
              
              <div>
                <Label htmlFor="system-prompt">Enhanced System Prompt</Label>
                <Textarea
                  id="system-prompt"
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  className="mt-2 bg-black border-purple-400/30"
                  rows={4}
                />
              </div>
              
              <div>
                <Label htmlFor="user-prompt">User Message</Label>
                <Textarea
                  id="user-prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Ask for comprehensive analysis, detailed implementation guidance, complete architectural blueprints..."
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
                    Start DeepSeek Chat
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

          {/* Enhanced Response Output */}
          <Card className="bg-gray-900 border-green-400/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-green-400" />
                  <span>DeepSeek Response Output</span>
                </div>
                {isStreaming && (
                  <div className="flex items-center gap-2 text-sm text-green-400">
                    <Database className="w-3 h-3 animate-pulse" />
                    <div className="animate-pulse w-2 h-2 bg-green-400 rounded-full"></div>
                    Streaming DeepSeek Response...
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
                placeholder="Enhanced DeepSeek response with comprehensive RAG+MCP+A2A context will stream here..."
              />
              
              {/* Enhanced Statistics */}
              <div className="grid grid-cols-4 gap-4 mt-4 text-sm">
                <div className="text-center">
                  <div className="text-blue-400 font-semibold">Tokens</div>
                  <div className="text-gray-300">{tokenCount.toLocaleString()}</div>
                </div>
                <div className="text-center">
                  <div className="text-purple-400 font-semibold">Characters</div>
                  <div className="text-gray-300">{responseLength.toLocaleString()}</div>
                </div>
                <div className="text-center">
                  <div className="text-green-400 font-semibold">Time</div>
                  <div className="text-gray-300">{formatTime(streamingTime)}</div>
                </div>
                <div className="text-center">
                  <div className="text-orange-400 font-semibold">Speed</div>
                  <div className="text-gray-300">{calculateTokensPerSecond()} t/s</div>
                </div>
              </div>
              
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
                      toast.success('DeepSeek response copied to clipboard');
                    }}
                  >
                    Copy to Clipboard
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Status Information */}
        <Card className="bg-gray-900 border-purple-400/30">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 text-sm">
              <div className="text-center">
                <div className="text-blue-400 font-semibold">Model</div>
                <div className="text-gray-300">deepseek-chat</div>
              </div>
              <div className="text-center">
                <div className="text-purple-400 font-semibold">Integration</div>
                <div className="text-gray-300">Enhanced Streaming</div>
              </div>
              <div className="text-center">
                <div className="text-green-400 font-semibold">Context</div>
                <div className="text-gray-300">
                  {includeContext ? 'Comprehensive RAG+MCP+A2A' : 'Basic'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-orange-400 font-semibold">Output Mode</div>
                <div className="text-gray-300">
                  {extendedOutput ? 'Extended' : 'Standard'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-red-400 font-semibold">Max Tokens</div>
                <div className="text-gray-300">{maxTokens[0].toLocaleString()}</div>
              </div>
              <div className="text-center">
                <div className="text-cyan-400 font-semibold">Status</div>
                <div className="text-gray-300">
                  {isStreaming ? 'Streaming Active' : 'Ready'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PromptStudio;
