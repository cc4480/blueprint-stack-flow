
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Brain, Zap, Code, Settings, Wand2, Clock, Users, Database } from 'lucide-react';
import { toast } from 'sonner';
import { promptService, PromptGenerationRequest, PromptGenerationResult } from '@/services/promptService';
import ApiKeyManager from '@/components/ApiKeyManager';

const PromptStudio = () => {
  const [apiKey, setApiKey] = useState<string | null>(
    localStorage.getItem('deepseek_api_key')
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<PromptGenerationResult | null>(null);
  const [showReasoning, setShowReasoning] = useState(false);
  
  // Form state
  const [appType, setAppType] = useState('web-app');
  const [dataSource, setDataSource] = useState('database');
  const [features, setFeatures] = useState<string[]>(['auth']);
  const [platform, setPlatform] = useState('react');
  const [additionalContext, setAdditionalContext] = useState('');

  useEffect(() => {
    if (apiKey) {
      promptService.setApiKey(apiKey);
    }
  }, [apiKey]);

  const handleFeatureToggle = (feature: string) => {
    setFeatures(prev => 
      prev.includes(feature) 
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
  };

  const handleGenerate = async () => {
    if (!apiKey) {
      toast.error('Please configure your DeepSeek API key first');
      return;
    }

    setIsGenerating(true);
    try {
      const request: PromptGenerationRequest = {
        appType,
        dataSource,
        features,
        platform,
        additionalContext
      };

      const generatedResult = await promptService.generatePrompt(request);
      setResult(generatedResult);
      toast.success('Master blueprint generated successfully!');
    } catch (error) {
      console.error('Generation failed:', error);
      toast.error('Failed to generate blueprint. Please check your API key and try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleContinueConversation = async (message: string) => {
    if (!apiKey) {
      toast.error('Please configure your DeepSeek API key first');
      return;
    }

    setIsGenerating(true);
    try {
      const generatedResult = await promptService.continueConversation(message);
      setResult(generatedResult);
      toast.success('Conversation continued successfully!');
    } catch (error) {
      console.error('Conversation failed:', error);
      toast.error('Failed to continue conversation. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!apiKey) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 pt-20">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center space-x-3">
              <Brain className="w-10 h-10 text-blue-400" />
              <span>NoCodeLos Prompt Studio</span>
              <Zap className="w-8 h-8 text-yellow-400" />
            </h1>
            <p className="text-blue-200 text-lg">
              Configure your DeepSeek API key to access unlimited AI-powered blueprint generation
            </p>
          </div>
          <div className="max-w-2xl mx-auto">
            <ApiKeyManager onApiKeyChange={setApiKey} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 pt-20">
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center space-x-3">
            <Brain className="w-10 h-10 text-blue-400" />
            <span>NoCodeLos Prompt Studio</span>
            <Zap className="w-8 h-8 text-yellow-400" />
          </h1>
          <p className="text-blue-200 text-lg">
            Generate comprehensive master blueprints with DeepSeek Reasoner, RAG 2.0, MCP & A2A protocols
          </p>
        </div>

        <Tabs defaultValue="generate" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-black/20 backdrop-blur-sm border border-blue-400/30">
            <TabsTrigger 
              value="generate" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-blue-200"
            >
              <Wand2 className="w-4 h-4 mr-2" />
              Generate Blueprint
            </TabsTrigger>
            <TabsTrigger 
              value="results" 
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-blue-200"
            >
              <Code className="w-4 h-4 mr-2" />
              Results & Reasoning
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white text-blue-200"
            >
              <Settings className="w-4 h-4 mr-2" />
              API Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-2 border-blue-400/30">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <CardTitle>Application Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="space-y-2">
                    <Label htmlFor="appType">Application Type</Label>
                    <select
                      id="appType"
                      value={appType}
                      onChange={(e) => setAppType(e.target.value)}
                      className="w-full px-3 py-2 border border-blue-300/50 rounded-md focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="web-app">Web Application</option>
                      <option value="mobile-app">Mobile App</option>
                      <option value="desktop-app">Desktop Application</option>
                      <option value="api-service">API Service</option>
                      <option value="microservice">Microservice</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dataSource">Primary Data Source</Label>
                    <select
                      id="dataSource"
                      value={dataSource}
                      onChange={(e) => setDataSource(e.target.value)}
                      className="w-full px-3 py-2 border border-blue-300/50 rounded-md focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="database">Database (SQL/NoSQL)</option>
                      <option value="api">External APIs</option>
                      <option value="files">File System</option>
                      <option value="cloud">Cloud Storage</option>
                      <option value="hybrid">Hybrid Sources</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="platform">Platform/Framework</Label>
                    <select
                      id="platform"
                      value={platform}
                      onChange={(e) => setPlatform(e.target.value)}
                      className="w-full px-3 py-2 border border-blue-300/50 rounded-md focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="react">React + TypeScript</option>
                      <option value="nextjs">Next.js</option>
                      <option value="vue">Vue.js</option>
                      <option value="angular">Angular</option>
                      <option value="nodejs">Node.js</option>
                    </select>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-purple-400/30">
                <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                  <CardTitle>Feature Selection</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="space-y-3">
                    <Label>Select Features to Include</Label>
                    <div className="flex flex-wrap gap-2">
                      {['auth', 'payments', 'realtime', 'analytics', 'search', 'notifications', 'ai-chat', 'file-upload'].map((feature) => (
                        <Badge
                          key={feature}
                          variant={features.includes(feature) ? "default" : "outline"}
                          className={`cursor-pointer transition-all ${
                            features.includes(feature) 
                              ? 'bg-blue-600 hover:bg-blue-700' 
                              : 'hover:bg-blue-100'
                          }`}
                          onClick={() => handleFeatureToggle(feature)}
                        >
                          {feature.replace('-', ' ').toUpperCase()}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="context">Additional Context</Label>
                    <Textarea
                      id="context"
                      value={additionalContext}
                      onChange={(e) => setAdditionalContext(e.target.value)}
                      placeholder="Describe specific requirements, constraints, or additional details..."
                      className="min-h-[100px]"
                    />
                  </div>

                  <Button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Generating Master Blueprint...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-4 h-4 mr-2" />
                        Generate Master Blueprint
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            {result ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="border-2 border-green-400/30">
                    <CardContent className="p-4 text-center">
                      <Clock className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Estimated Build Time</p>
                      <p className="font-bold text-green-600">{result.estimatedBuildTime}</p>
                    </CardContent>
                  </Card>
                  <Card className="border-2 border-orange-400/30">
                    <CardContent className="p-4 text-center">
                      <BarChart3 className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Complexity</p>
                      <p className="font-bold text-orange-600">{result.complexity}</p>
                    </CardContent>
                  </Card>
                  <Card className="border-2 border-blue-400/30">
                    <CardContent className="p-4 text-center">
                      <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Components</p>
                      <p className="font-bold text-blue-600">{result.suggestedComponents.length}</p>
                    </CardContent>
                  </Card>
                </div>

                <Tabs defaultValue="blueprint" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="blueprint">Master Blueprint</TabsTrigger>
                    <TabsTrigger value="reasoning">AI Reasoning</TabsTrigger>
                    <TabsTrigger value="components">Components</TabsTrigger>
                    <TabsTrigger value="protocols">Protocols</TabsTrigger>
                  </TabsList>

                  <TabsContent value="blueprint">
                    <Card>
                      <CardHeader>
                        <CardTitle>Generated Master Blueprint</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                          <pre className="whitespace-pre-wrap text-sm">{result.prompt}</pre>
                        </div>
                        <div className="mt-4">
                          <Input
                            placeholder="Continue the conversation... (e.g., 'Add more security features')"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                                handleContinueConversation(e.currentTarget.value.trim());
                                e.currentTarget.value = '';
                              }
                            }}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="reasoning">
                    <Card>
                      <CardHeader>
                        <CardTitle>DeepSeek Reasoner Chain-of-Thought</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-blue-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                          <pre className="whitespace-pre-wrap text-sm text-blue-800">
                            {result.reasoningContent || 'No reasoning content available'}
                          </pre>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="components">
                    <Card>
                      <CardHeader>
                        <CardTitle>Suggested Components</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {result.suggestedComponents.map((component, index) => (
                            <Badge key={index} variant="outline" className="bg-blue-50">
                              {component}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="protocols">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-blue-600">MCP Endpoints</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {result.mcpEndpoints?.map((endpoint, index) => (
                              <div key={index} className="text-sm font-mono bg-blue-50 p-2 rounded">
                                {endpoint}
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-purple-600">A2A Protocols</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {result.a2aProtocols?.map((protocol, index) => (
                              <div key={index} className="text-sm font-mono bg-purple-50 p-2 rounded">
                                {protocol}
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-green-600">RAG Pipeline</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-sm font-mono bg-green-50 p-2 rounded">
                            {result.ragPipeline}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Database className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No results yet. Generate a blueprint to see results here.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="border-2 border-blue-400/30">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="w-5 h-5" />
                  <span>API Configuration</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="max-w-2xl">
                  <ApiKeyManager onApiKeyChange={setApiKey} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PromptStudio;
