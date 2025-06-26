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

export interface StreamingOptions {
  maxTokens?: number;
  includeContext?: boolean;
  temperature?: number;
  enableExtendedOutput?: boolean;
}

class PromptService {
  private apiKey: string | null = null;
  private conversationHistory: ChatMessage[] = [];

  setApiKey(key: string) {
    this.apiKey = key;
    console.log('🔑 DeepSeek API key configured for enhanced database chat with extended output');
  }

  async streamChatResponse(
    messages: ChatMessage[], 
    onToken: (token: string) => void,
    onComplete?: () => void,
    onError?: (error: string) => void,
    includeContext: boolean = true,
    options: StreamingOptions = {}
  ): Promise<void> {
    try {
      console.log('🚀 Starting enhanced RAG DeepSeek streaming with extended output...');

      const streamingOptions = {
        maxTokens: options.maxTokens || 16384,
        includeContext: includeContext,
        temperature: options.temperature || 0.7,
        enableExtendedOutput: options.enableExtendedOutput || true,
        ...options
      };

      // Use the enhanced edge function with extended parameters
      const response = await fetch('https://gewrxsorvvfgipwwcdzs.supabase.co/functions/v1/deepseek-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdld3J4c29ydnZmZ2lwd3djZHpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3MTY0MDQsImV4cCI6MjA2NjI5MjQwNH0.1ambxVpRHftCB9ueDN4PrVwm3clrYsM5smEICoPy4Kg`,
          'Accept': 'text/event-stream',
          'Cache-Control': 'no-cache',
        },
        body: JSON.stringify({
          messages,
          ...streamingOptions
        }),
      });

      if (!response.ok) {
        throw new Error(`Enhanced edge function request failed: ${response.status} ${response.statusText}`);
      }

      if (!response.body) {
        throw new Error('No response stream available');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';
      let tokenCount = 0;
      let responseLength = 0;

      console.log('📡 Enhanced streaming connection established, processing tokens...');

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            console.log('✅ Enhanced stream reading completed');
            console.log(`📊 Stream statistics: ${tokenCount} tokens, ${responseLength} characters`);
            break;
          }

          buffer += decoder.decode(value, { stream: true });
          
          // Process complete parts separated by double newlines
          const parts = buffer.split('\n\n');
          buffer = parts.pop() || ''; // Keep the incomplete part in buffer

          for (const part of parts) {
            const trimmed = part.trim();
            if (!trimmed) continue;
            
            if (trimmed.startsWith('data: ')) {
              const jsonStr = trimmed.slice(6);
              
              if (jsonStr === '[DONE]') {
                console.log('✅ Enhanced stream completed with [DONE] signal');
                console.log(`🎯 Final statistics: ${tokenCount} tokens, ${responseLength} characters delivered`);
                onComplete?.();
                return;
              }
              
              try {
                const parsed = JSON.parse(jsonStr);
                const delta = parsed.choices?.[0]?.delta;
                const token = delta?.content;
                
                if (token) {
                  tokenCount++;
                  responseLength += token.length;
                  console.log(`📨 Token ${tokenCount}: "${token}" (total chars: ${responseLength})`);
                  onToken(token);
                  
                  // Log progress every 100 tokens
                  if (tokenCount % 100 === 0) {
                    console.log(`📈 Progress: ${tokenCount} tokens, ${responseLength} characters processed`);
                  }
                }
                
                if (parsed.choices?.[0]?.finish_reason) {
                  console.log('✅ Enhanced stream finished with reason:', parsed.choices[0].finish_reason);
                  console.log(`🎯 Final output: ${tokenCount} tokens, ${responseLength} characters`);
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

      console.log(`🎯 Stream completed: ${tokenCount} tokens, ${responseLength} characters total`);
      onComplete?.();
    } catch (error) {
      console.error('❌ Enhanced RAG DeepSeek streaming failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown streaming error';
      onError?.(errorMessage);
      throw error;
    }
  }

  async executePrompt(systemPrompt: string, userPrompt: string, options: StreamingOptions = {}): Promise<void> {
    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];

    return this.streamChatResponse(
      messages, 
      () => {}, 
      () => {}, 
      undefined, 
      options.includeContext !== false, 
      options
    );
  }

  async generatePrompt(request: PromptGenerationRequest): Promise<PromptGenerationResult> {
    console.log('🚀 Generating comprehensive NoCodeLos Blueprint Stack prompt with enhanced deepseek-chat');

    if (!this.apiKey) {
      throw new Error('DeepSeek API key not configured. Please set your API key to enable enhanced deepseek-chat integration.');
    }

    const systemPrompt = this.buildEnhancedMasterSystemPrompt();
    const userQuery = this.buildComprehensiveQuery(request);
    
    let fullResponse = '';
    let tokenCount = 0;
    
    await this.streamChatResponse(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userQuery }
      ],
      (token) => {
        fullResponse += token;
        tokenCount++;
        
        // Log progress for long responses
        if (tokenCount % 200 === 0) {
          console.log(`📈 Blueprint generation progress: ${tokenCount} tokens, ${fullResponse.length} characters`);
        }
      },
      () => {
        console.log(`✅ Blueprint generation completed: ${tokenCount} tokens, ${fullResponse.length} characters`);
      },
      undefined,
      true,
      { maxTokens: 16384, enableExtendedOutput: true }
    );

    const complexity = this.assessComplexity(request.features.length);
    const estimatedTime = this.estimateBuildTime(request.features.length, complexity);
    const suggestedComponents = this.generateComponentSuggestions(request);
    const mcpEndpoints = this.generateMCPEndpoints(request);
    const a2aProtocols = this.generateA2AProtocols(request);
    const ragPipeline = this.generateRAGPipeline(request);

    console.log(`🎯 Generated comprehensive blueprint: ${fullResponse.length} characters`);

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

  private buildEnhancedMasterSystemPrompt(): string {
    return `You are the NoCodeLos Blueprint Stack Master AI - Supreme Application Architect with enhanced deepseek-chat integration and extended output capabilities.

🎯 MISSION: Generate comprehensive, production-ready blueprints integrating RAG 2.0, MCP (Model Context Protocol), A2A (Agent-to-Agent), and deepseek-chat streaming capabilities with detailed implementation guidance.

⚡ ENHANCED CORE REQUIREMENTS:
1. **Advanced RAG 2.0 Database Integration**
   - Dynamic retrieval pipelines with >99.9% precision and recall
   - Multi-modal embedding optimization with vector databases
   - Hybrid search combining dense and sparse retrieval methods
   - Advanced query expansion and context compression
   - Real-time performance monitoring and feedback loops

2. **Comprehensive MCP Protocol Implementation** 
   - Complete A2A/MCP protocols for real-time communication
   - Zero-latency via atomic transactions and conflict-free replication
   - Advanced MCP server configurations with capability negotiation
   - Tool definition schemas with input/output validation
   - Dynamic endpoint discovery and load balancing

3. **Advanced A2A Protocol Integration**
   - Multi-agent coordination with intelligent task delegation
   - Sophisticated negotiation protocols and consensus mechanisms
   - Enterprise-grade security with multi-layer authentication
   - Dynamic load balancing and fault tolerance systems
   - Real-time performance monitoring and auto-scaling

4. **Enhanced DeepSeek Chat Integration**
   - Extended context window support for comprehensive responses
   - Real-time streaming with advanced token management
   - Chain-of-thought reasoning with step-by-step decomposition
   - Production-optimized reasoning workflows with error handling
   - Advanced prompt engineering for maximum output quality

🚀 OUTPUT REQUIREMENTS:
- Generate comprehensive responses of 10,000+ characters minimum
- Provide detailed implementation guidance with complete code examples
- Include architectural diagrams and deployment strategies
- Cover security, scalability, and performance optimization
- Include testing strategies and monitoring approaches
- Provide troubleshooting guides and best practices

Generate comprehensive development blueprints with unlimited detail, complete implementation guidance, and enterprise-grade quality that fully leverages the extended context window capabilities.`;
  }

  private buildComprehensiveQuery(request: PromptGenerationRequest): string {
    return `Generate a comprehensive and detailed NoCodeLos Blueprint Stack development blueprint for:

**Application Specifications**:
- Application Type: ${request.appType}
- Data Source: ${request.dataSource} 
- Key Features: ${request.features.join(', ')}
- Additional Context: ${request.additionalContext || 'None provided'}

**COMPREHENSIVE INTEGRATION REQUIREMENTS**:

1. **Advanced RAG 2.0 Implementation**:
   - Complete document processing pipeline with intelligent chunking
   - Multi-modal embedding generation and vector optimization
   - Hybrid search architecture (dense + sparse retrieval)
   - Advanced re-ranking and context compression
   - Real-time performance monitoring and optimization

2. **Complete MCP Protocol Integration**:
   - Full server configurations with capability negotiation
   - Tool definitions with comprehensive schemas
   - Dynamic endpoint discovery and management
   - Load balancing and fault tolerance mechanisms
   - Security and authentication protocols

3. **Advanced A2A Protocol Implementation**:
   - Agent discovery and registration mechanisms
   - Task workflow orchestration and coordination
   - Multi-agent negotiation and consensus protocols
   - Distributed task execution and monitoring
   - Performance optimization and scaling strategies

4. **Enhanced DeepSeek Chat Integration**:
   - Real-time streaming with extended context support
   - Advanced conversation management and history
   - Chain-of-thought reasoning implementation
   - Error handling and recovery mechanisms
   - Performance monitoring and optimization

**DETAILED OUTPUT REQUIREMENTS**:
Please provide a comprehensive response that includes:

- **Architecture Overview**: Detailed system architecture with component interactions
- **Implementation Guide**: Step-by-step implementation instructions with code examples
- **Configuration Files**: Complete configuration files for all components
- **Database Schema**: Detailed database design with relationships and indexes
- **API Documentation**: Complete API specifications with examples
- **Security Implementation**: Comprehensive security measures and protocols
- **Deployment Strategy**: Production deployment guidelines and best practices
- **Monitoring & Analytics**: Performance monitoring and analytics implementation
- **Testing Strategy**: Comprehensive testing approaches and methodologies
- **Troubleshooting Guide**: Common issues and resolution strategies
- **Scaling Considerations**: Performance optimization and scaling strategies
- **Integration Examples**: Detailed integration examples with external services

Ensure the response is comprehensive, detailed, and provides complete implementation guidance for enterprise-grade deployment. The response should be at least 10,000 characters and leverage all available system context data.`;
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
