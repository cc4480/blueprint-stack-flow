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
    console.log('🔑 DeepSeek API key configured for NoCodeLos Blueprint Stack integration');
  }

  async generatePrompt(request: PromptGenerationRequest): Promise<PromptGenerationResult> {
    console.log('🚀 Generating NoCodeLos Blueprint Stack master prompt with DeepSeek Reasoner');

    if (!this.apiKey) {
      throw new Error('DeepSeek API key not configured. Please set your API key to enable RAG 2.0, MCP, and A2A protocols.');
    }

    try {
      // Build optimized system prompt for faster generation
      const systemPrompt = this.buildOptimizedSystemPrompt();
      
      // Create focused user query for faster processing
      const userQuery = this.buildFocusedQuery(request);

      // Clear conversation history to avoid token bloat
      this.conversationHistory = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userQuery }
      ];

      // Set up AbortController for timeout handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
        console.log('⏰ DeepSeek API request timed out after 45 seconds');
      }, 45000); // 45 second timeout

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
          max_tokens: 4000, // Limit tokens for faster response
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ DeepSeek API error:', response.status, errorText);
        throw new Error(`DeepSeek API request failed: ${response.status} - ${errorText}`);
      }

      const data: DeepSeekReasonerResponse = await response.json();
      
      if (!data.choices || data.choices.length === 0) {
        throw new Error('No response generated from DeepSeek API');
      }

      const assistantResponse = data.choices[0].message;
      
      // Extract reasoning content for transparency
      const reasoningContent = assistantResponse.reasoning_content;
      const finalPrompt = assistantResponse.content;

      // Generate comprehensive metadata
      const complexity = this.assessComplexity(request.features.length);
      const estimatedTime = this.estimateBuildTime(request.features.length, complexity);
      const suggestedComponents = this.generateComponentSuggestions(request);
      const mcpEndpoints = this.generateMCPEndpoints(request);
      const a2aProtocols = this.generateA2AProtocols(request);
      const ragPipeline = this.generateRAGPipeline(request);

      console.log('✅ NoCodeLos Blueprint Stack master prompt generated successfully');
      
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
      if (error instanceof Error && error.name === 'AbortError') {
        console.error('⏰ DeepSeek API request timed out');
        throw new Error('Request timed out. Please try again with a simpler request or check your connection.');
      }
      
      console.error('❌ DeepSeek Reasoner generation failed:', error);
      throw error;
    }
  }

  private buildOptimizedSystemPrompt(): string {
    return `You are the NoCodeLos AI-Optimized Full-Stack Master Architect - Supreme Blueprint Generator.

🎯 MISSION: Generate comprehensive, production-ready FULL-STACK application master blueprints optimized by AI for AI development, integrating RAG 2.0, MCP (Model Context Protocol), A2A (Agent-to-Agent), and deepseek-reasoner technology stack.

⚡ CORE REQUIREMENTS:

1. **FRONTEND ARCHITECTURE**
   - React 18+ with TypeScript and Vite for optimal performance
   - Tailwind CSS with shadcn/ui component library
   - State management with Zustand/Redux Toolkit + React Query
   - Responsive design with mobile-first approach
   - PWA capabilities with offline support

2. **BACKEND ARCHITECTURE**
   - Supabase setup with PostgreSQL database design
   - Edge Functions implementation with Deno runtime
   - Real-time subscriptions with WebSocket connections
   - Authentication with multi-provider support
   - Row Level Security (RLS) policies for data protection

3. **RAG 2.0 IMPLEMENTATION**
   - Document ingestion pipeline with intelligent chunking
   - Vector database optimization with hybrid search
   - Query enhancement and multi-stage re-ranking
   - Real-time indexing with performance optimization

4. **MCP PROTOCOL INTEGRATION**
   - MCP server configurations for external integrations
   - Tool definitions with JSON schemas
   - Resource management with caching
   - Capability negotiation and discovery

5. **A2A PROTOCOL IMPLEMENTATION**
   - Agent Card specifications and discovery
   - Stateful Task workflow design
   - Multi-agent coordination patterns
   - Security protocols with authorization

6. **SECURITY & DEPLOYMENT**
   - Zero-trust security architecture
   - CI/CD pipelines with automated testing
   - Monitoring and observability
   - Performance optimization

Generate COMPREHENSIVE, production-ready full-stack master blueprints that enable development teams to build enterprise-grade applications using the complete NoCodeLos Blueprint Stack ecosystem.`;
  }

  private buildFocusedQuery(request: PromptGenerationRequest): string {
    return `Generate a COMPREHENSIVE NoCodeLos Blueprint Stack FULL-STACK development blueprint for:

**Application Type**: ${request.appType}
**Data Source**: ${request.dataSource}
**Key Features**: ${request.features.join(', ')}
**Additional Context**: ${request.additionalContext || 'None provided'}

**REQUIREMENTS**:

1. **Complete Frontend Implementation**
   - React 18+ TypeScript architecture with optimal component structure
   - Tailwind CSS with shadcn/ui component system
   - State management with server state synchronization
   - Responsive design system with mobile-first approach

2. **Complete Backend Architecture**
   - Supabase setup with PostgreSQL database design
   - Edge Functions implementation with Deno runtime
   - Authentication system with multi-provider support
   - Real-time subscriptions and WebSocket implementation

3. **RAG 2.0 Integration**
   - Document ingestion and processing pipeline
   - Vector database optimization with hybrid search
   - Query enhancement and multi-stage re-ranking
   - Real-time indexing with performance optimization

4. **MCP Protocol Implementation**
   - Complete MCP server configurations
   - Tool definitions with JSON schemas
   - Resource management and capability negotiation
   - Performance optimization with connection pooling

5. **A2A Protocol Integration**
   - Agent Card specifications and discovery
   - Stateful Task workflow design
   - Multi-agent coordination patterns
   - Security protocols with authorization

6. **Database & Security**
   - PostgreSQL schema design with indexing
   - Security implementation with RLS policies
   - Performance optimization and scaling strategies
   - Deployment guides with CI/CD automation

Generate a COMPLETE full-stack development blueprint with step-by-step implementation, code examples, infrastructure setup, deployment guides, and production optimization. The blueprint should be structured for AI development with comprehensive examples and complete coverage of all full-stack aspects.`;
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
