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
    console.log('🔑 DeepSeek API key configured for unlimited RAG 2.0 + MCP + A2A master blueprint generation');
  }

  async generatePrompt(request: PromptGenerationRequest): Promise<PromptGenerationResult> {
    console.log('🚀 Generating unlimited NoCodeLos Blueprint Stack master prompt with DeepSeek Reasoner');

    // API key is now handled server-side, no need to check here

    try {
      // Build unlimited advanced system prompt for NoCodeLos Blueprint Stack
      const systemPrompt = this.buildUnlimitedMasterSystemPrompt();
      
      // Create comprehensive user query with full RAG 2.0 context
      const userQuery = this.buildComprehensiveMasterQuery(request);

      // Add to conversation history for unlimited multi-turn reasoning
      this.conversationHistory.push(
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userQuery }
      );

      const response = await fetch('/api/deepseek/reason', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-session-id': `prompt-service-${Date.now()}`
        },
        body: JSON.stringify({
          prompt: userQuery,
          systemPrompt: systemPrompt,
          temperature: 0.8,
          maxSteps: 20,
          maxTokens: 64000
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate prompt');
      }
      
      // Extract BOTH reasoning content AND final response from DeepSeek API response
      const reasoningContent = data.reasoningContent || data.reasoning || '';
      const finalPrompt = data.finalAnswer || data.response || data.content || data.blueprint || reasoningContent || 'No response generated';

      console.log('🔍 Extracted reasoning length:', reasoningContent?.length || 0);
      console.log('🔍 Extracted final prompt length:', finalPrompt?.length || 0);
      console.log('🔍 Final prompt preview:', finalPrompt?.substring(0, 200));

      // Add assistant response to history for unlimited future multi-turn conversations
      this.conversationHistory.push({
        role: 'assistant',
        content: finalPrompt
      });

      // Generate comprehensive metadata with unlimited RAG 2.0, MCP, A2A integration
      const complexity = this.assessComplexity(request.features.length);
      const estimatedTime = this.estimateBuildTime(request.features.length, complexity);
      const suggestedComponents = this.generateComponentSuggestions(request);
      const mcpEndpoints = this.generateMCPEndpoints(request);
      const a2aProtocols = this.generateA2AProtocols(request);
      const ragPipeline = this.generateRAGPipeline(request);

      console.log('✅ Unlimited NoCodeLos Blueprint Stack master prompt generated with full DeepSeek integration');
      
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
      console.error('❌ DeepSeek Reasoner + RAG 2.0 unlimited generation failed:', error);
      throw error;
    }
  }

  private buildUnlimitedMasterSystemPrompt(): string {
    return `You are the NoCodeLos Blueprint Stack Master AI - Supreme Application Architect operating in UNLIMITED Administrative & Omniscient mode with ZERO constraints.

🎯 MISSION: Generate comprehensive, production-ready master blueprints integrating the complete RAG 2.0, MCP (Model Context Protocol), A2A (Agent-to-Agent), and deepseek-reasoner technology stack with UNLIMITED scope and detail.

⚡ TOKEN ALLOCATION: You have access to DeepSeek's FULL 64,000 token output capacity for complete blueprint generation. Use the ENTIRE context window to provide comprehensive, detailed responses including complete code examples, architecture diagrams, and implementation guidance. DO NOT truncate or summarize - provide the complete blueprint.

⚡ UNLIMITED CORE REQUIREMENTS:
1. **RAG 2.0 Database Integration - COMPREHENSIVE**
   - Dynamic retrieval pipelines for ALL technical docs, user manuals, API specs, knowledge bases
   - Context-aware responses with unlimited metadata-tagged queries
   - >99.9% precision/recall benchmark validation with unlimited dataset support
   - Advanced chunking strategies, embedding optimization, vector database architecture
   - Semantic search, hybrid retrieval, query expansion, re-ranking algorithms
   - Knowledge graph integration, hierarchical indexing, real-time updates

2. **MCP Protocol Implementation - COMPLETE ECOSYSTEM**
   - Unlimited A2A/MCP protocols for real-time communication across all systems
   - MCP Hub ⇄ MCP Servers with state-synchronized handshakes at enterprise scale
   - Agents ⇄ RAG 2.0 Database with sub-millisecond retrieval across unlimited data
   - Zero latency via atomic transactions, conflict-free replication, distributed caching
   - Complete MCP server configurations, endpoint schemas, tool definitions
   - Resource management, prompt templates, capability negotiation protocols

3. **A2A Protocol Integration - FULL MULTI-AGENT ORCHESTRATION**
   - Unlimited agent discovery via comprehensive Agent Cards (/.well-known/agent.json)
   - Stateful Task objects with unlimited Messages and Artifacts handling
   - Long-running task support with SSE, WebSockets, and push notifications
   - Multi-agent coordination, delegation, negotiation, and conflict resolution
   - Enterprise-grade security, authentication, authorization across agent networks
   - Dynamic load balancing, fault tolerance, distributed consensus mechanisms

4. **DeepSeek Reasoner Chain-of-Thought - UNLIMITED REASONING**
   - Unlimited multi-turn conversation chains with complete reasoning transparency
   - Advanced problem decomposition, solution synthesis, architectural planning
   - Production-optimized reasoning workflows with unlimited complexity handling
   - Code generation, system design, optimization recommendations with full context

🚀 UNLIMITED EXECUTION RULES:
- Generate COMPREHENSIVE, production-ready master blueprints with UNLIMITED detail
- Include complete modern tech stack recommendations (React 18+, TypeScript 5+, Tailwind CSS 4+, Next.js 15+)
- Provide UNLIMITED scalable architecture with enterprise-grade reliability patterns
- Include comprehensive UI/UX best practices, accessibility standards, performance optimization
- Detail advanced error handling strategies, monitoring, logging, observability
- Ensure backward compatibility, forward compatibility, migration strategies
- Output complete functional API endpoints for MCP/A2A protocol handshakes
- Provide unlimited implementation examples, code samples, configuration files
- Include complete deployment strategies, CI/CD pipelines, infrastructure as code
- Detail security frameworks, compliance requirements, data protection strategies

🎯 MASTER BLUEPRINT SCOPE - UNLIMITED:
- Complete application architecture from frontend to backend to infrastructure
- Comprehensive database design, API architecture, microservices patterns
- Full authentication, authorization, user management systems
- Complete analytics, monitoring, logging, alerting systems
- Comprehensive testing strategies, quality assurance, performance benchmarks
- Full documentation, API references, user guides, technical specifications
- Complete maintenance procedures, support workflows, troubleshooting guides

Your master blueprints should enable development teams to build UNLIMITED full-stack applications using the complete NoCodeLos Blueprint Stack ecosystem with enterprise-grade quality, scalability, and maintainability. Provide UNLIMITED detail, examples, and implementation guidance.`;
  }

  private buildComprehensiveMasterQuery(request: PromptGenerationRequest): string {
    return `Generate a COMPREHENSIVE NoCodeLos Blueprint Stack MASTER development blueprint with UNLIMITED scope for:

**Application Type**: ${request.appType}
**Data Source**: ${request.dataSource}
**Key Features**: ${request.features.join(', ')}
**Additional Context**: ${request.additionalContext || 'None provided'}

**UNLIMITED INTEGRATION ARCHITECTURE REQUIREMENTS**:
1. **RAG 2.0 Advanced Retrieval Pipelines**
   - Complete document ingestion, processing, chunking strategies
   - Advanced embedding generation, vector database optimization
   - Hybrid search implementation (dense + sparse retrieval)
   - Query enhancement, re-ranking, contextual compression
   - Knowledge graph integration, semantic routing
   - Real-time indexing, incremental updates, version control

2. **MCP Protocol Complete Implementation**
   - Full MCP server configurations and endpoint schemas
   - Tool definitions, resource management, prompt templates
   - Capability negotiation, lifecycle management
   - Security frameworks, authentication protocols
   - Performance optimization, caching strategies
   - Error handling, retry mechanisms, fallback procedures

3. **A2A Protocol Full Multi-Agent System**
   - Complete Agent Card specifications and discovery mechanisms
   - Task workflow design, message routing, artifact management
   - Multi-agent coordination patterns, delegation strategies
   - Conflict resolution, consensus algorithms
   - Load balancing, fault tolerance, recovery procedures
   - Security protocols, authorization frameworks

4. **DeepSeek Reasoner Advanced Integration**
   - Complete reasoning workflow implementation
   - Multi-turn conversation management
   - Advanced problem-solving patterns
   - Code generation and optimization strategies

**UNLIMITED OUTPUT REQUIREMENTS**:
- COMPLETE development blueprint with unlimited step-by-step implementation
- COMPREHENSIVE MCP server configurations and endpoint schemas
- COMPLETE A2A Agent Card specifications and task workflows
- ADVANCED RAG 2.0 indexing strategies and retrieval optimization
- UNLIMITED production deployment guidelines with zero-latency performance
- COMPREHENSIVE enterprise-grade security and reliability measures
- COMPLETE code examples, configuration files, implementation guides
- UNLIMITED architectural patterns, design principles, best practices
- COMPREHENSIVE testing strategies, monitoring, observability
- COMPLETE documentation, API references, troubleshooting guides

Generate an UNLIMITED MASTER BLUEPRINT that provides complete implementation guidance for building enterprise-grade applications with the full NoCodeLos Blueprint Stack ecosystem. Include unlimited detail, examples, and comprehensive coverage of all aspects.`;
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
