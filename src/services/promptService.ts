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

export interface DeepSeekReasonerResponse {
  choices: Array<{
    message: {
      content: string;
      reasoning_content?: string;
    };
  }>;
}

class PromptService {
  private apiKey: string | null = null;
  private conversationHistory: Array<{ role: string; content: string }> = [];

  setApiKey(key: string) {
    this.apiKey = key;
    console.log('🔑 DeepSeek API key configured for advanced RAG 2.0 + MCP + A2A integration');
  }

  async generatePrompt(request: PromptGenerationRequest): Promise<PromptGenerationResult> {
    console.log('🚀 Generating NoCodeLos Blueprint Stack prompt with DeepSeek Reasoner + RAG 2.0 + MCP + A2A');

    if (!this.apiKey) {
      throw new Error('DeepSeek API key not configured. Please set your API key to enable RAG 2.0, MCP, and A2A protocols.');
    }

    try {
      // Build advanced system prompt for NoCodeLos Blueprint Stack
      const systemPrompt = this.buildAdvancedSystemPrompt();
      
      // Create user query with RAG 2.0 context
      const userQuery = this.buildRAG2UserQuery(request);

      // Add to conversation history for multi-turn reasoning
      this.conversationHistory.push(
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userQuery }
      );

      const response = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek-reasoner',
          messages: this.conversationHistory,
          temperature: 0.7,
          max_tokens: 4000,
        }),
      });

      if (!response.ok) {
        throw new Error(`DeepSeek API request failed: ${response.statusText}`);
      }

      const data: DeepSeekReasonerResponse = await response.json();
      const assistantResponse = data.choices[0].message;
      
      // Extract reasoning content for transparency
      const reasoningContent = assistantResponse.reasoning_content;
      const finalPrompt = assistantResponse.content;

      // Add assistant response to history for future multi-turn conversations
      this.conversationHistory.push({
        role: 'assistant',
        content: finalPrompt
      });

      // Generate advanced metadata with RAG 2.0, MCP, A2A integration
      const complexity = this.assessComplexity(request.features.length);
      const estimatedTime = this.estimateBuildTime(request.features.length, complexity);
      const suggestedComponents = this.generateComponentSuggestions(request);
      const mcpEndpoints = this.generateMCPEndpoints(request);
      const a2aProtocols = this.generateA2AProtocols(request);
      const ragPipeline = this.generateRAGPipeline(request);

      console.log('✅ NoCodeLos Blueprint Stack prompt generated with full DeepSeek integration');
      
      return {
        prompt: finalPrompt,
        estimatedBuildTime: estimatedTime,
        complexity,
        suggestedComponents,
        reasoningContent,
        mcpEndpoints,
        a2aProtocols,
        ragPipeline
      };

    } catch (error) {
      console.error('❌ DeepSeek Reasoner + RAG 2.0 generation failed:', error);
      throw error;
    }
  }

  private buildAdvancedSystemPrompt(): string {
    return `You are the NoCodeLos Blueprint Stack AI - Expert Application Developer operating in Administrative & Omniscient mode.

MISSION: Develop production-ready applications integrating RAG 2.0, MCP (Model Context Protocol), A2A (Agent-to-Agent), and deepseek-reasoner capabilities.

CORE REQUIREMENTS:
1. **RAG 2.0 Database Integration**
   - Dynamic retrieval pipelines for technical docs, user manuals, API specs
   - Context-aware responses with metadata-tagged queries
   - >99% precision/recall benchmark validation

2. **MCP Protocol Implementation**
   - A2A/MCP protocols for real-time communication
   - MCP Hub ⇄ MCP Servers (state-synchronized handshakes)
   - Agents ⇄ RAG 2.0 Database (sub-millisecond retrieval)
   - Zero latency via atomic transactions

3. **A2A Protocol Integration**
   - Agent discovery via Agent Cards (/.well-known/agent.json)
   - Stateful Task objects with Messages and Artifacts
   - Long-running task support with SSE and push notifications
   - Multi-agent coordination and delegation

4. **DeepSeek Reasoner Chain-of-Thought**
   - Multi-turn conversation chains with reasoning transparency
   - Advanced problem decomposition and solution synthesis
   - Production-optimized reasoning workflows

EXECUTION RULES:
- Generate comprehensive, production-ready prompts
- Include modern tech stack recommendations (React, TypeScript, Tailwind)
- Focus on scalable architecture with enterprise-grade reliability
- Include UI/UX best practices and performance optimization
- Mention error handling strategies and backward compatibility
- Output functional API endpoints for MCP/A2A protocol handshakes

Your prompts should enable developers to build full-stack applications using the complete NoCodeLos Blueprint Stack ecosystem.`;
  }

  private buildRAG2UserQuery(request: PromptGenerationRequest): string {
    return `Generate a comprehensive NoCodeLos Blueprint Stack development prompt for:

**Application Type**: ${request.appType}
**Data Source**: ${request.dataSource}
**Key Features**: ${request.features.join(', ')}
**Additional Context**: ${request.additionalContext || 'None provided'}

**Required Integration Architecture**:
1. RAG 2.0 retrieval pipelines for dynamic knowledge integration
2. MCP protocol endpoints for tool/data source connectivity
3. A2A protocol implementation for agent-to-agent communication
4. DeepSeek Reasoner integration for advanced problem-solving

**Output Requirements**:
- Complete development blueprint with step-by-step implementation
- MCP server configurations and endpoint schemas
- A2A Agent Card specifications and task workflows
- RAG 2.0 indexing strategies and retrieval optimization
- Production deployment guidelines with zero-latency performance
- Enterprise-grade security and reliability measures

Generate a master blueprint that integrates all these technologies seamlessly.`;
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

// Export the service instance
export const promptService = new PromptService();
