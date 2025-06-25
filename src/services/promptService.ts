export interface PromptGenerationRequest {
  appType: string;
  dataSource: string;
  features: string[];
  platform: string;
  additionalContext?: string;
}

export interface PromptGenerationResult {
  prompt: string;
  estimatedBuildTime: string;
  complexity: string;
  suggestedComponents: string[];
  reasoningContent?: string;
  mcpEndpoints?: string[];
  a2aProtocols?: string[];
  ragPipeline?: string;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

class PromptService {
  private apiKey: string | null = null;
  private conversationHistory: ChatMessage[] = [];

  setApiKey(key: string) {
    this.apiKey = key;
    console.log('🔑 DeepSeek API key configured for deepseek-chat streaming integration');
  }

  async streamChatResponse(
    messages: ChatMessage[], 
    onToken: (token: string) => void,
    onComplete?: () => void,
    onError?: (error: string) => void
  ): Promise<void> {
    if (!this.apiKey) {
      const error = 'DeepSeek API key not configured. Please set your API key to enable deepseek-chat streaming.';
      onError?.(error);
      throw new Error(error);
    }

    try {
      console.log('🚀 Starting deepseek-chat streaming with messages:', messages);

      const response = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages,
          temperature: 0.7,
          stream: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`DeepSeek API request failed: ${response.status} ${response.statusText}`);
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
          
          // Process complete lines ending with \n\n
          const lines = buffer.split('\n');
          buffer = lines.pop() || ''; // Keep incomplete line in buffer

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;
            
            if (trimmed.startsWith('data: ')) {
              const jsonStr = trimmed.slice(6); // Remove 'data: ' prefix
              
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
                  console.log('📨 Received token:', token);
                  onToken(token);
                }
                
                // Check if the stream is finished
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
      console.error('❌ DeepSeek streaming failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown streaming error';
      onError?.(errorMessage);
      throw error;
    }
  }

  async executePrompt(systemPrompt: string, userPrompt: string): Promise<void> {
    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];

    // This will be handled by the streaming method
    return this.streamChatResponse(messages, () => {}, () => {});
  }

  async generatePrompt(request: PromptGenerationRequest): Promise<PromptGenerationResult> {
    console.log('🚀 Generating NoCodeLos Blueprint Stack prompt with deepseek-chat');

    if (!this.apiKey) {
      throw new Error('DeepSeek API key not configured. Please set your API key to enable deepseek-chat integration.');
    }

    const systemPrompt = this.buildMasterSystemPrompt();
    const userQuery = this.buildComprehensiveQuery(request);
    
    let fullResponse = '';
    
    await this.streamChatResponse(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userQuery }
      ],
      (token) => {
        fullResponse += token;
      }
    );

    const complexity = this.assessComplexity(request.features.length);
    const estimatedTime = this.estimateBuildTime(request.features.length, complexity);
    const suggestedComponents = this.generateComponentSuggestions(request);
    const mcpEndpoints = this.generateMCPEndpoints(request);
    const a2aProtocols = this.generateA2AProtocols(request);
    const ragPipeline = this.generateRAGPipeline(request);

    return {
      prompt: fullResponse,
      estimatedBuildTime: estimatedTime,
      complexity,
      suggestedComponents,
      mcpEndpoints,
      a2aProtocols,
      ragPipeline
    };
  }

  private buildMasterSystemPrompt(): string {
    return `You are the NoCodeLos Blueprint Stack Master AI - Supreme Application Architect with deepseek-chat integration.

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
  }

  private buildComprehensiveQuery(request: PromptGenerationRequest): string {
    return `Generate a comprehensive NoCodeLos Blueprint Stack development blueprint for:

**Application Type**: ${request.appType}
**Data Source**: ${request.dataSource} 
**Key Features**: ${request.features.join(', ')}
**Additional Context**: ${request.additionalContext || 'None provided'}

**INTEGRATION REQUIREMENTS**:
1. **RAG 2.0 Advanced Retrieval**: Complete document processing, vector optimization, hybrid search
2. **MCP Protocol**: Full server configurations, tool definitions, capability negotiation
3. **A2A Protocol**: Agent discovery, task workflows, multi-agent coordination
4. **DeepSeek Chat**: Real-time streaming integration, conversation management

Provide complete implementation guidance with code examples, configuration files, architectural patterns, and deployment strategies.`;
  }

  private generateMCPEndpoints(request: PromptGenerationRequest): string[] {
    const endpoints = ['/.well-known/mcp-manifest.json'];
    
    if (request.features.includes('auth')) {
      endpoints.push('/mcp/auth-provider', '/mcp/user-management');
    }
    
    if (request.features.includes('payments')) {
      endpoints.push('/mcp/payment-processor', '/mcp/billing-service');
    }
    
    if (request.features.includes('realtime')) {
      endpoints.push('/mcp/websocket-server', '/mcp/notification-hub');
    }
    
    if (request.features.includes('analytics')) {
      endpoints.push('/mcp/analytics-collector', '/mcp/metrics-aggregator');
    }

    endpoints.push('/mcp/rag-retriever', '/mcp/knowledge-indexer');
    
    return endpoints;
  }

  private generateA2AProtocols(request: PromptGenerationRequest): string[] {
    const protocols = ['agent-discovery', 'task-coordination', 'message-exchange'];
    
    if (request.features.includes('realtime')) {
      protocols.push('real-time-collaboration', 'live-updates');
    }
    
    if (request.features.includes('analytics')) {
      protocols.push('data-aggregation', 'cross-agent-analytics');
    }
    
    protocols.push('rag-knowledge-sharing', 'distributed-reasoning');
    
    return protocols;
  }

  private generateRAGPipeline(request: PromptGenerationRequest): string {
    const components = [
      'Document Ingestion → Chunking Strategy',
      'Embedding Generation → Vector Database',
      'Hybrid Search (Dense + Sparse)',
      'Re-ranking → Context Compression',
      'Query Enhancement → Response Generation'
    ];
    
    return components.join(' → ');
  }

  private assessComplexity(featureCount: number): string {
    if (featureCount <= 2) return 'Simple';
    if (featureCount <= 4) return 'Moderate';
    if (featureCount <= 6) return 'Complex';
    return 'Advanced';
  }

  private estimateBuildTime(featureCount: number, complexity: string): string {
    const baseTime = {
      'Simple': 2,
      'Moderate': 5,
      'Complex': 10,
      'Advanced': 20
    };
    
    const days = baseTime[complexity as keyof typeof baseTime] || 5;
    return `${days}-${days + 3} days`;
  }

  private generateComponentSuggestions(request: PromptGenerationRequest): string[] {
    const components = ['Header', 'Footer', 'Layout', 'MCPClient', 'A2AAgent', 'RAGRetriever'];
    
    if (request.features.includes('auth')) {
      components.push('AuthProvider', 'LoginForm', 'SignupForm');
    }
    
    if (request.features.includes('payments')) {
      components.push('PaymentForm', 'PricingCard', 'CheckoutFlow');
    }
    
    if (request.features.includes('realtime')) {
      components.push('WebSocketProvider', 'LiveChat', 'NotificationCenter');
    }
    
    if (request.features.includes('analytics')) {
      components.push('Dashboard', 'MetricsCard', 'ChartContainer');
    }
    
    if (request.features.includes('search')) {
      components.push('SearchBar', 'FilterPanel', 'ResultsList');
    }

    return components;
  }
}

export const promptService = new PromptService();
