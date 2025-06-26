import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Download, Zap, CheckCircle, Clock, Brain, Network, Database, GitBranch } from "lucide-react";
import { toast } from "sonner";
import ApiKeyManager from "./ApiKeyManager";

const InteractiveDemo = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showApiKey, setShowApiKey] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    appType: "",
    dataSource: "",
    features: [] as string[],
    additionalRequirements: ""
  });
  const [generatedResult, setGeneratedResult] = useState<{
    prompt: string;
    estimatedBuildTime: string;
    complexity: string;
    suggestedComponents: string[];
    reasoningContent?: string;
    mcpEndpoints?: string[];
    a2aProtocols?: string[];
    ragPipeline?: string;
  } | null>(null);

  const appTypes = [{
    id: "dashboard",
    label: "Business Dashboard",
    icon: "📊",
    description: "Analytics and data visualization"
  }, {
    id: "ecommerce",
    label: "E-commerce Store",
    icon: "🛒",
    description: "Online shopping platform"
  }, {
    id: "social",
    label: "Social Platform",
    icon: "👥",
    description: "Community and networking"
  }, {
    id: "productivity",
    label: "Productivity Tool",
    icon: "⚡",
    description: "Task and project management"
  }, {
    id: "portfolio",
    label: "Portfolio Site",
    icon: "🎨",
    description: "Professional showcase"
  }, {
    id: "saas",
    label: "SaaS Application",
    icon: "🚀",
    description: "Software as a Service"
  }];

  const dataSources = [{
    id: "supabase",
    label: "Supabase",
    icon: "🗄️",
    description: "Real-time database"
  }, {
    id: "api",
    label: "External API",
    icon: "🔌",
    description: "Third-party integrations"
  }, {
    id: "static",
    label: "Static Data",
    icon: "📝",
    description: "JSON or hardcoded data"
  }, {
    id: "ai",
    label: "AI-Generated",
    icon: "🤖",
    description: "Dynamic AI content"
  }];

  const features = [{
    id: "auth",
    label: "User Authentication",
    category: "Security"
  }, {
    id: "payments",
    label: "Payment Processing",
    category: "Commerce"
  }, {
    id: "realtime",
    label: "Real-time Updates",
    category: "Communication"
  }, {
    id: "mobile",
    label: "Mobile Responsive",
    category: "Design"
  }, {
    id: "search",
    label: "Search Functionality",
    category: "Features"
  }, {
    id: "analytics",
    label: "Analytics Dashboard",
    category: "Business"
  }, {
    id: "notifications",
    label: "Push Notifications",
    category: "Communication"
  }, {
    id: "file-upload",
    label: "File Upload/Storage",
    category: "Features"
  }];

  useEffect(() => {
    console.log('🎯 NoCodeLos Blueprint Stack Interactive Demo initialized with DeepSeek integration');
  }, []);

  const handleApiKeyChange = (key: string | null) => {
    if (key) {
      setShowApiKey(false);
      console.log('✅ DeepSeek API key configured for NoCodeLos Blueprint Stack');
    }
  };

  const streamChatResponse = async (
    messages: Array<{role: string, content: string}>, 
    onToken: (token: string) => void,
    onComplete?: () => void,
    onError?: (error: string) => void
  ): Promise<void> => {
    try {
      console.log('🚀 Starting RAG-enhanced DeepSeek streaming...');

      const response = await fetch('https://gewrxsorvvfgipwwcdzs.supabase.co/functions/v1/deepseek-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdld3J4c29ydnZmZ2lwd3djZHpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3MTY0MDQsImV4cCI6MjA2NjI5MjQwNH0.1ambxVpRHftCB9ueDN4PrVwm3clrYsM5smEICoPy4Kg`,
        },
        body: JSON.stringify({
          messages,
          includeContext: true
        }),
      });

      if (!response.ok) {
        throw new Error(`Edge function request failed: ${response.status} ${response.statusText}`);
      }

      if (!response.body) {
        throw new Error('No response stream available');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            console.log('✅ Stream reading completed');
            break;
          }

          buffer += decoder.decode(value, { stream: true });
          
          const parts = buffer.split('\n\n');
          buffer = parts.pop() || '';

          for (const part of parts) {
            const trimmed = part.trim();
            if (!trimmed) continue;
            
            if (trimmed.startsWith('data: ')) {
              const jsonStr = trimmed.slice(6);
              
              if (jsonStr === '[DONE]') {
                console.log('✅ Stream completed with [DONE] signal');
                onComplete?.();
                return;
              }
              
              try {
                const parsed = JSON.parse(jsonStr);
                const delta = parsed.choices?.[0]?.delta;
                const token = delta?.content;
                
                if (token) {
                  console.log('📨 Received RAG-enhanced token:', token);
                  onToken(token);
                }
                
                if (parsed.choices?.[0]?.finish_reason) {
                  console.log('✅ Stream finished with reason:', parsed.choices[0].finish_reason);
                  onComplete?.();
                  return;
                }
              } catch (parseError) {
                console.warn('⚠️ JSON parse error for line:', jsonStr, parseError);
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }

      onComplete?.();
    } catch (error) {
      console.error('❌ RAG-enhanced DeepSeek streaming failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown streaming error';
      onError?.(errorMessage);
      throw error;
    }
  };

  const generatePrompt = async () => {
    if (formData.features.length === 0) {
      toast.error('Please select at least one feature');
      return;
    }
    
    setIsGenerating(true);
    console.log('🚀 Generating NoCodeLos Blueprint Stack prompt with RAG 2.0 + MCP + A2A...');

    try {
      const systemPrompt = `You are the NoCodeLos Blueprint Stack Master AI - Supreme Application Architect with deepseek-chat integration.

🎯 MISSION: Generate comprehensive, production-ready blueprints integrating RAG 2.0, MCP (Model Context Protocol), A2A (Agent-to-Agent), and deepseek-chat streaming capabilities.

⚡ CORE REQUIREMENTS:
1. **RAG 2.0 Database Integration**
   - Dynamic retrieval pipelines with >99.9% precision
   - Advanced chunking, embedding optimization, vector databases
   - Semantic search, hybrid retrieval, query expansion

2. **MCP Protocol Implementation** 
   - Complete A2A/MCP protocols for real-time communication
   - Zero latency via atomic transactions, conflict-free replication
   - MCP server configurations, endpoint schemas, tool definitions

3. **A2A Protocol Integration**
   - Multi-agent coordination, delegation, negotiation
   - Enterprise-grade security, authentication, authorization
   - Dynamic load balancing, fault tolerance

4. **DeepSeek Chat**
   - Real-time streaming responses with deepseek-chat model
   - Advanced problem decomposition, solution synthesis
   - Production-optimized reasoning workflows

Generate comprehensive development blueprints with unlimited detail, complete implementation guidance, and enterprise-grade quality.`;

      const userQuery = `Generate a comprehensive NoCodeLos Blueprint Stack development blueprint for:

**Application Type**: ${formData.appType}
**Data Source**: ${formData.dataSource} 
**Key Features**: ${formData.features.join(', ')}
**Additional Context**: ${formData.additionalRequirements || 'None provided'}

**INTEGRATION REQUIREMENTS**:
1. **RAG 2.0 Advanced Retrieval**: Complete document processing, vector optimization, hybrid search
2. **MCP Protocol**: Full server configurations, tool definitions, capability negotiation
3. **A2A Protocol**: Agent discovery, task workflows, multi-agent coordination
4. **DeepSeek Chat**: Real-time streaming integration, conversation management

Provide complete implementation guidance with code examples, configuration files, architectural patterns, and deployment strategies.`;

      let fullResponse = '';
      
      await streamChatResponse(
        [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userQuery }
        ],
        (token) => {
          fullResponse += token;
        },
        () => {
          // Generation complete
          const complexity = assessComplexity(formData.features.length);
          const estimatedTime = estimateBuildTime(formData.features.length, complexity);
          const suggestedComponents = generateComponentSuggestions();
          const mcpEndpoints = generateMCPEndpoints();
          const a2aProtocols = generateA2AProtocols();
          const ragPipeline = generateRAGPipeline();

          setGeneratedResult({
            prompt: fullResponse,
            estimatedBuildTime: estimatedTime,
            complexity,
            suggestedComponents,
            mcpEndpoints,
            a2aProtocols,
            ragPipeline
          });
          
          setCurrentStep(4);
          setIsGenerating(false);
          console.log('✅ NoCodeLos Blueprint Stack prompt generated with full DeepSeek integration');
          toast.success('🎉 Your NoCodeLos Blueprint Stack master prompt is ready!');
        },
        (error) => {
          setIsGenerating(false);
          console.error('❌ Blueprint Stack prompt generation failed:', error);
          toast.error('Failed to generate blueprint. Please ensure your DeepSeek API key is configured.');
        }
      );
    } catch (error) {
      setIsGenerating(false);
      console.error('❌ Blueprint Stack prompt generation failed:', error);
      toast.error('Failed to generate blueprint. Please ensure your DeepSeek API key is configured.');
    }
  };

  const assessComplexity = (featureCount: number): string => {
    if (featureCount <= 2) return 'Simple';
    if (featureCount <= 4) return 'Moderate';
    if (featureCount <= 6) return 'Complex';
    return 'Advanced';
  };

  const estimateBuildTime = (featureCount: number, complexity: string): string => {
    const baseTime = {
      'Simple': 2,
      'Moderate': 5,
      'Complex': 10,
      'Advanced': 20
    };
    
    const days = baseTime[complexity as keyof typeof baseTime] || 5;
    return `${days}-${days + 3} days`;
  };

  const generateComponentSuggestions = (): string[] => {
    const components = ['Header', 'Footer', 'Layout', 'MCPClient', 'A2AAgent', 'RAGRetriever'];
    
    if (formData.features.includes('auth')) {
      components.push('AuthProvider', 'LoginForm', 'SignupForm');
    }
    
    if (formData.features.includes('payments')) {
      components.push('PaymentForm', 'PricingCard', 'CheckoutFlow');
    }
    
    if (formData.features.includes('realtime')) {
      components.push('WebSocketProvider', 'LiveChat', 'NotificationCenter');
    }
    
    if (formData.features.includes('analytics')) {
      components.push('Dashboard', 'MetricsCard', 'ChartContainer');
    }
    
    if (formData.features.includes('search')) {
      components.push('SearchBar', 'FilterPanel', 'ResultsList');
    }

    return components;
  };

  const generateMCPEndpoints = (): string[] => {
    const endpoints = ['/.well-known/mcp-manifest.json'];
    
    if (formData.features.includes('auth')) {
      endpoints.push('/mcp/auth-provider', '/mcp/user-management');
    }
    
    if (formData.features.includes('payments')) {
      endpoints.push('/mcp/payment-processor', '/mcp/billing-service');
    }
    
    if (formData.features.includes('realtime')) {
      endpoints.push('/mcp/websocket-server', '/mcp/notification-hub');
    }
    
    if (formData.features.includes('analytics')) {
      endpoints.push('/mcp/analytics-collector', '/mcp/metrics-aggregator');
    }

    endpoints.push('/mcp/rag-retriever', '/mcp/knowledge-indexer');
    
    return endpoints;
  };

  const generateA2AProtocols = (): string[] => {
    const protocols = ['agent-discovery', 'task-coordination', 'message-exchange'];
    
    if (formData.features.includes('realtime')) {
      protocols.push('real-time-collaboration', 'live-updates');
    }
    
    if (formData.features.includes('analytics')) {
      protocols.push('data-aggregation', 'cross-agent-analytics');
    }
    
    protocols.push('rag-knowledge-sharing', 'distributed-reasoning');
    
    return protocols;
  };

  const generateRAGPipeline = (): string => {
    const components = [
      'Document Ingestion → Chunking Strategy',
      'Embedding Generation → Vector Database',
      'Hybrid Search (Dense + Sparse)',
      'Re-ranking → Context Compression',
      'Query Enhancement → Response Generation'
    ];
    
    return components.join(' → ');
  };

  const handleFeatureToggle = (featureId: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(featureId) ? prev.features.filter(f => f !== featureId) : [...prev.features, featureId]
    }));
    console.log('🔄 NoCodeLos Blueprint Stack features updated:', formData.features);
  };

  const copyToClipboard = async () => {
    if (generatedResult) {
      await navigator.clipboard.writeText(generatedResult.prompt);
      toast.success('📋 NoCodeLos Blueprint Stack prompt copied to clipboard!');
      console.log('📋 Blueprint Stack prompt copied to clipboard');
    }
  };

  const downloadPrompt = () => {
    if (generatedResult) {
      const blob = new Blob([generatedResult.prompt], {
        type: 'text/plain'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'nocodelos-blueprint-stack-master-prompt.txt';
      a.click();
      URL.revokeObjectURL(url);
      toast.success('📥 NoCodeLos Blueprint Stack prompt downloaded!');
      console.log('📥 Blueprint Stack prompt file downloaded');
    }
  };

  const resetDemo = () => {
    setCurrentStep(0);
    setFormData({
      appType: "",
      dataSource: "",
      features: [],
      additionalRequirements: ""
    });
    setGeneratedResult(null);
    console.log('🔄 NoCodeLos Blueprint Stack demo reset');
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 0:
        return "Choose Your App Type";
      case 1:
        return "Select Data Source";
      case 2:
        return "Pick Key Features";
      case 3:
        return "Add Final Details";
      case 4:
        return "Your NoCodeLos Blueprint Stack Master Prompt is Ready!";
      default:
        return "";
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-purple-50">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold mb-6 text-gray-900">
              Get Your First NoCodeLos Blueprint Stack Master Prompt in{" "}
              <span className="text-purple-600">30 Seconds</span>
            </h2>
            <p className="text-xl text-gray-600 mb-4">
              Experience the power of DeepSeek Reasoner with RAG 2.0, MCP & A2A protocols
            </p>
            <div className="flex justify-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Brain className="w-4 h-4 text-purple-600" />
                <span>DeepSeek Reasoner</span>
              </div>
              <div className="flex items-center space-x-1">
                <Database className="w-4 h-4 text-blue-600" />
                <span>RAG 2.0</span>
              </div>
              <div className="flex items-center space-x-1">
                <Network className="w-4 h-4 text-green-600" />
                <span>MCP + A2A</span>
              </div>
            </div>
          </div>

          {/* API Key Setup */}
          {showApiKey && (
            <div className="mb-8">
              <ApiKeyManager onApiKeyChange={handleApiKeyChange} />
            </div>
          )}

          <Card className="shadow-2xl border-0 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <CardTitle className="text-2xl flex items-center justify-between">
                <span>Step {currentStep + 1}: {getStepTitle()}</span>
                {!showApiKey && currentStep < 4 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowApiKey(true)}
                    className="text-white hover:bg-white/20"
                  >
                    <Brain className="w-4 h-4 mr-2" />
                    Setup DeepSeek AI
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              {/* Step 0: App Type Selection */}
              {currentStep === 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {appTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          appType: type.label
                        }));
                        setCurrentStep(1);
                        console.log('📱 App type selected:', type.label);
                      }}
                      className="p-6 border-2 border-gray-200 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-all duration-300 text-center group"
                    >
                      <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                        {type.icon}
                      </div>
                      <div className="font-semibold text-gray-800 mb-2">{type.label}</div>
                      <div className="text-sm text-gray-600">{type.description}</div>
                    </button>
                  ))}
                </div>
              )}

              {/* Step 1: Data Source Selection */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <p className="text-lg text-gray-600">
                      Building: <span className="font-semibold text-purple-600">{formData.appType}</span>
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {dataSources.map((source) => (
                      <button
                        key={source.id}
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            dataSource: source.label
                          }));
                          setCurrentStep(2);
                          console.log('💾 Data source selected:', source.label);
                        }}
                        className="p-6 border-2 border-gray-200 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-all duration-300 text-center group"
                      >
                        <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                          {source.icon}
                        </div>
                        <div className="font-semibold text-gray-800 mb-2">{source.label}</div>
                        <div className="text-sm text-gray-600">{source.description}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Feature Selection */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <p className="text-lg text-gray-600">
                      Building: <span className="font-semibold text-purple-600">{formData.appType}</span> with{" "}
                      <span className="font-semibold text-purple-600">{formData.dataSource}</span>
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {features.map((feature) => (
                      <label
                        key={feature.id}
                        className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-purple-400 transition-all duration-300"
                      >
                        <input
                          type="checkbox"
                          checked={formData.features.includes(feature.id)}
                          onChange={() => handleFeatureToggle(feature.id)}
                          className="w-5 h-5 text-purple-600 rounded"
                        />
                        <div className="flex-1">
                          <span className="font-medium text-gray-800">{feature.label}</span>
                          <span className="text-xs text-purple-600 ml-2">({feature.category})</span>
                        </div>
                      </label>
                    ))}
                  </div>
                  
                  <div className="text-center">
                    <Button
                      onClick={() => setCurrentStep(3)}
                      disabled={formData.features.length === 0}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-12 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      Continue to Final Details
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Additional Requirements */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 mb-4">
                      <p className="text-lg text-gray-800 font-medium">
                        {formData.appType} • {formData.dataSource} • {formData.features.length} features
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="block">
                      <span className="text-gray-700 font-medium">Additional Requirements (Optional)</span>
                      <textarea
                        value={formData.additionalRequirements}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          additionalRequirements: e.target.value
                        }))}
                        placeholder="Any specific design preferences, integrations, or custom functionality..."
                        className="mt-2 w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent h-32 resize-none bg-white"
                      />
                    </label>
                  </div>

                  <div className="text-center">
                    <Button
                      onClick={generatePrompt}
                      disabled={isGenerating}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-12 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 min-w-[200px]"
                    >
                      {isGenerating ? (
                        <div className="flex items-center space-x-2">
                          <Brain className="w-5 h-5 animate-spin" />
                          <span>Generating Blueprint...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Zap className="w-5 h-5" />
                          <span>Generate NoCodeLos Blueprint</span>
                        </div>
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 4: Generated Result with Advanced Integration Details */}
              {currentStep === 4 && generatedResult && (
                <div className="space-y-6">
                  <div className="text-center">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Your NoCodeLos Blueprint Stack Master Prompt is Ready!
                    </h3>
                    <p className="text-gray-600">Generated with DeepSeek Reasoner + RAG 2.0 + MCP + A2A integration</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg text-center">
                      <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                      <div className="font-semibold text-blue-800">{generatedResult.estimatedBuildTime}</div>
                      <div className="text-sm text-blue-600">Build Time</div>
                    </div>
                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg text-center">
                      <Brain className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                      <div className="font-semibold text-purple-800">{generatedResult.complexity}</div>
                      <div className="text-sm text-purple-600">Complexity</div>
                    </div>
                    <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg text-center">
                      <Network className="w-6 h-6 text-green-600 mx-auto mb-2" />
                      <div className="font-semibold text-green-800">{generatedResult.mcpEndpoints?.length || 0}</div>
                      <div className="text-sm text-green-600">MCP Endpoints</div>
                    </div>
                    <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg text-center">
                      <GitBranch className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                      <div className="font-semibold text-orange-800">{generatedResult.a2aProtocols?.length || 0}</div>
                      <div className="text-sm text-orange-600">A2A Protocols</div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6">
                    <h4 className="text-xl font-bold text-gray-900 mb-4">Your NoCodeLos Blueprint Stack Master Prompt:</h4>
                    <div className="bg-white border border-gray-200 rounded-lg p-6 font-mono text-sm text-gray-800 leading-relaxed max-h-96 overflow-y-auto">
                      {generatedResult.prompt}
                    </div>
                  </div>

                  {generatedResult.ragPipeline && (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <Database className="w-5 h-5 mr-2 text-blue-600" />
                        RAG 2.0 Pipeline:
                      </h4>
                      <p className="text-sm text-gray-700 font-mono">{generatedResult.ragPipeline}</p>
                    </div>
                  )}

                  {generatedResult.mcpEndpoints && generatedResult.mcpEndpoints.length > 0 && (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <Network className="w-5 h-5 mr-2 text-green-600" />
                        MCP Endpoints:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {generatedResult.mcpEndpoints.map((endpoint, index) => (
                          <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-mono">
                            {endpoint}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {generatedResult.a2aProtocols && generatedResult.a2aProtocols.length > 0 && (
                    <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <GitBranch className="w-5 h-5 mr-2 text-orange-600" />
                        A2A Protocols:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {generatedResult.a2aProtocols.map((protocol, index) => (
                          <span key={index} className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                            {protocol}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Suggested Components:</h4>
                    <div className="flex flex-wrap gap-2">
                      {generatedResult.suggestedComponents.map((component, index) => (
                        <span key={index} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                          {component}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      onClick={copyToClipboard}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-full font-semibold"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Blueprint
                    </Button>
                    <Button
                      onClick={downloadPrompt}
                      variant="outline"
                      className="border-purple-400 text-purple-600 hover:bg-purple-50 px-8 py-3 rounded-full font-semibold"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button
                      onClick={resetDemo}
                      variant="ghost"
                      className="text-gray-600 hover:text-gray-800 px-8 py-3 rounded-full font-semibold"
                    >
                      🔄 Create Another
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default InteractiveDemo;
