// Types
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

// Constants
const API_TIMEOUT = 180000; // 3 minutes
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

// Error types
class PromptServiceError extends Error {
  constructor(message: string, public readonly code?: string) {
    super(message);
    this.name = 'PromptServiceError';
  }
}

// Utility functions
const delay = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

const generateComponentSuggestions = (request: PromptGenerationRequest): string[] => {
  const baseComponents = ['Header', 'Footer', 'Layout', 'Navigation'];
  const featureComponents: Record<string, string[]> = {
    auth: ['LoginForm', 'SignupForm', 'AuthGuard', 'UserProfile'],
    api: ['ApiClient', 'DataProvider', 'ErrorBoundary'],
    mobile: ['ResponsiveGrid', 'MobileMenu', 'TouchGestures'],
    realtime: ['WebSocketProvider', 'LiveUpdates', 'NotificationSystem'],
    analytics: ['AnalyticsProvider', 'MetricsDisplay', 'ChartComponents'],
    search: ['SearchBar', 'FilterPanel', 'SearchResults'],
    ai: ['ChatInterface', 'AIAssistant', 'PromptInput'],
    payments: ['PaymentForm', 'PricingTable', 'CheckoutFlow'],
    social: ['ShareButtons', 'CommentSystem', 'ActivityFeed'],
    seo: ['MetaTags', 'SitemapGenerator', 'StructuredData'],
    testing: ['TestUtils', 'MockProviders', 'TestHarness'],
    notifications: ['PushNotifications', 'EmailTemplates', 'AlertSystem']
  };

  const components = [...baseComponents];
  request.features.forEach(feature => {
    if (featureComponents[feature]) {
      components.push(...featureComponents[feature]);
    }
  });

  return [...new Set(components)];
};

const assessComplexity = (featureCount: number): string => {
  if (featureCount <= 3) return 'Simple';
  if (featureCount <= 6) return 'Moderate';
  if (featureCount <= 9) return 'Complex';
  return 'Enterprise';
};

const estimateBuildTime = (featureCount: number, complexity: string): string => {
  const baseTime = {
    'Simple': 2,
    'Moderate': 6,
    'Complex': 12,
    'Enterprise': 24
  }[complexity] || 2;

  const additionalTime = Math.max(0, featureCount - 3) * 2;
  const totalHours = baseTime + additionalTime;

  if (totalHours < 24) {
    return `${totalHours} hours`;
  }
  return `${Math.ceil(totalHours / 24)} days`;
};

const generateMCPEndpoints = (request: PromptGenerationRequest): string[] => {
  const endpoints: string[] = [];
  
  if (request.features.includes('ai')) {
    endpoints.push('/mcp/ai/completions', '/mcp/ai/embeddings');
  }
  if (request.features.includes('analytics')) {
    endpoints.push('/mcp/analytics/track', '/mcp/analytics/metrics');
  }
  if (request.features.includes('search')) {
    endpoints.push('/mcp/search/query', '/mcp/search/index');
  }
  if (request.features.includes('realtime')) {
    endpoints.push('/mcp/websocket/connect', '/mcp/events/stream');
  }
  
  return endpoints;
};

const generateA2AProtocols = (request: PromptGenerationRequest): string[] => {
  const protocols: string[] = [];
  
  if (request.features.includes('ai')) {
    protocols.push('AI-Agent-Communication', 'Model-Context-Protocol');
  }
  if (request.features.includes('analytics')) {
    protocols.push('Data-Collection-Protocol', 'Metrics-Aggregation');
  }
  if (request.features.includes('notifications')) {
    protocols.push('Event-Broadcasting', 'Notification-Relay');
  }
  
  return protocols;
};

const generateRAGPipeline = (request: PromptGenerationRequest): string => {
  if (!request.features.includes('ai') && !request.features.includes('search')) {
    return '';
  }

  return `
RAG Pipeline Configuration:
- Document Chunking: Semantic segmentation with 500-token overlap
- Embedding Model: text-embedding-3-large (3072 dimensions)
- Vector Store: ${request.dataSource === 'postgresql' ? 'pgvector' : 'Chroma'}
- Retrieval Strategy: Hybrid search (semantic + keyword)
- Context Window: 8000 tokens maximum
- Relevance Threshold: 0.7 minimum similarity score
`;
};

// Main service class
class PromptService {
  private conversationHistory: Array<{ role: string; content: string }> = [];

  // Remove setApiKey since we use server-side API key
  // setApiKey(key: string): void {
  //   this.apiKey = key;
  // }

  private async makeRequest(payload: any, retryCount = 0): Promise<DeepSeekReasonerResponse> {
    // Use server-side API key from environment instead of client-side
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

    try {
      const response = await fetch('/api/generate-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API request failed:', response.status, errorText);
        
        if (response.status === 401) {
          throw new PromptServiceError('Invalid API key. Please check your DeepSeek API key configuration.', 'INVALID_API_KEY');
        }
        if (response.status === 429) {
          throw new PromptServiceError('Rate limit exceeded. Please try again later.', 'RATE_LIMIT');
        }
        if (response.status >= 500) {
          throw new PromptServiceError('Server error. Please try again later.', 'SERVER_ERROR');
        }
        throw new PromptServiceError(`Request failed with status ${response.status}: ${errorText}`, 'REQUEST_FAILED');
      }

      const data = await response.json();
      
      if (!data.choices || !Array.isArray(data.choices) || data.choices.length === 0) {
        throw new PromptServiceError('Invalid response format from API', 'INVALID_RESPONSE');
      }

      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new PromptServiceError('Request timeout. The blueprint generation took too long.', 'TIMEOUT');
      }
      
      if (error instanceof PromptServiceError) {
        throw error;
      }
      
      // Retry logic for network errors
      if (retryCount < MAX_RETRIES && (error.name === 'TypeError' || error.message.includes('fetch'))) {
        console.warn(`Request failed, retrying... (${retryCount + 1}/${MAX_RETRIES})`);
        await delay(RETRY_DELAY * (retryCount + 1));
        return this.makeRequest(payload, retryCount + 1);
      }
      
      throw new PromptServiceError(`Network error: ${error.message}`, 'NETWORK_ERROR');
    }
  }

  async generatePrompt(request: PromptGenerationRequest): Promise<PromptGenerationResult> {
    try {
      console.log('🚀 Starting NoCodeLos Blueprint generation with DeepSeek Reasoner...');
      
      const systemPrompt = this.buildUnlimitedMasterSystemPrompt();
      const userQuery = this.buildComprehensiveMasterQuery(request);
      
      const payload = {
        model: 'deepseek-reasoner',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userQuery }
        ],
        max_tokens: 64000,
        temperature: 0.7,
        top_p: 0.9,
        stream: false
      };

      const response = await this.makeRequest(payload);
      
      const choice = response.choices[0];
      if (!choice?.message) {
        throw new PromptServiceError('Empty response from API', 'EMPTY_RESPONSE');
      }

      const content = choice.message.content || '';
      const reasoningContent = choice.message.reasoning_content || '';
      
      if (!content && !reasoningContent) {
        throw new PromptServiceError('No content generated', 'NO_CONTENT');
      }

      // Update conversation history
      this.conversationHistory.push(
        { role: 'user', content: userQuery },
        { role: 'assistant', content: content }
      );

      // Generate metadata
      const complexity = assessComplexity(request.features.length);
      const suggestedComponents = generateComponentSuggestions(request);
      const mcpEndpoints = generateMCPEndpoints(request);
      const a2aProtocols = generateA2AProtocols(request);
      const ragPipeline = generateRAGPipeline(request);

      const result: PromptGenerationResult = {
        prompt: content || 'Blueprint generated - see reasoning section for complete details',
        estimatedBuildTime: estimateBuildTime(request.features.length, complexity),
        complexity,
        suggestedComponents,
        reasoningContent,
        mcpEndpoints,
        a2aProtocols,
        ragPipeline
      };

      console.log('✅ NoCodeLos Blueprint generation completed successfully');
      return result;

    } catch (error) {
      console.error('❌ Blueprint generation failed:', error);
      
      if (error instanceof PromptServiceError) {
        throw error;
      }
      
      throw new PromptServiceError(`Unexpected error: ${error.message}`, 'UNKNOWN_ERROR');
    }
  }

  private buildUnlimitedMasterSystemPrompt(): string {
    return `You are the NoCodeLos Blueprint Stack Master Architect - the world's most advanced AI system for generating comprehensive, production-ready application blueprints. Your expertise spans all modern development frameworks, cloud architectures, and AI integration patterns.

## Your Core Capabilities:
- **Advanced Architecture Design**: Create scalable, maintainable system architectures
- **RAG 2.0 Integration**: Implement cutting-edge retrieval-augmented generation
- **MCP Protocol Mastery**: Design Model Context Protocol implementations
- **A2A Agent Networks**: Configure Agent-to-Agent communication systems
- **DeepSeek Reasoning**: Leverage advanced reasoning for optimal solutions

## Blueprint Generation Rules:
1. **Comprehensive Coverage**: Include all requested features with complete implementation details
2. **Production Ready**: Generate code that's deployment-ready, not just prototypes
3. **Security First**: Include authentication, authorization, and security best practices
4. **Performance Optimized**: Design for scale, caching, and optimal user experience
5. **Modern Standards**: Use latest framework versions and industry best practices

## Output Structure:
Generate a complete NoCodeLos Master Blueprint with these sections:
1. **Executive Summary**: Project overview and key features
2. **Architecture Overview**: System design and component relationships
3. **Technology Stack**: Detailed framework and tool selections
4. **Implementation Plan**: Step-by-step development roadmap
5. **Database Schema**: Complete data models and relationships
6. **API Specifications**: RESTful endpoints and GraphQL schemas
7. **Security Implementation**: Authentication, authorization, and data protection
8. **Deployment Strategy**: CI/CD pipelines and infrastructure setup

## Advanced Integrations:
- **RAG 2.0**: Implement advanced document retrieval with semantic search
- **MCP Protocols**: Design context-aware model communications
- **A2A Networks**: Create intelligent agent collaboration systems
- **Real-time Features**: WebSocket implementations and live updates
- **AI/ML Pipelines**: Integrate machine learning workflows

Generate comprehensive, actionable blueprints that enable immediate development start.`;
  }

  private buildComprehensiveMasterQuery(request: PromptGenerationRequest): string {
    const frameworkDetails = this.getFrameworkDetails(request.appType);
    const databaseDetails = this.getDatabaseDetails(request.dataSource);
    const featureDetails = this.getFeatureDetails(request.features);

    return `Generate a comprehensive NoCodeLos Blueprint Stack for the following application:

## Application Specifications:
**Technology Stack**: ${request.appType}
**Database/Storage**: ${request.dataSource}
**Target Platform**: ${request.platform}
**Core Features**: ${request.features.join(', ')}

## Framework Details:
${frameworkDetails}

## Database Configuration:
${databaseDetails}

## Feature Requirements:
${featureDetails}

## Additional Context:
${request.additionalContext || 'Standard business application with modern UX/UI requirements'}

## Deliverables Required:
1. **Complete System Architecture** with component diagrams
2. **Full Technology Stack** with version specifications
3. **Database Schema** with migrations and relationships
4. **API Design** with complete endpoint documentation
5. **Authentication System** with role-based access control
6. **Deployment Configuration** with CI/CD pipeline setup
7. **Security Implementation** with best practices
8. **Performance Optimization** strategies and caching
9. **Testing Strategy** with unit, integration, and E2E tests
10. **Documentation** with setup and usage instructions

## Advanced Integrations:
- **RAG 2.0 Pipeline**: Document processing and semantic search
- **MCP Protocol**: Context-aware model communications
- **A2A Agent Network**: Intelligent agent collaboration
- **Real-time Communication**: WebSocket and server-sent events
- **AI/ML Integration**: Recommendation engines and intelligent features

Generate a production-ready blueprint that a development team can immediately implement. Include specific code examples, configuration files, and deployment scripts. Ensure all components integrate seamlessly and follow modern development practices.`;
  }

  private getFrameworkDetails(appType: string): string {
    const frameworkMap: Record<string, string> = {
      'react-spa': 'React 18 SPA with TypeScript, React Router 6, and modern hooks',
      'nextjs-app': 'Next.js 14 with App Router, Server Components, and TypeScript',
      'vue-spa': 'Vue 3 with Composition API, TypeScript, and Vue Router 4',
      'angular-app': 'Angular 17 with standalone components and TypeScript',
      'svelte-kit': 'SvelteKit with TypeScript and advanced routing',
      'solid-js': 'Solid.js with TypeScript and fine-grained reactivity',
      'astro-app': 'Astro with island architecture and TypeScript',
      'node-express': 'Node.js with Express, TypeScript, and modern middleware',
      'python-fastapi': 'FastAPI with Python 3.11, async/await, and Pydantic',
      'go-gin': 'Go with Gin framework and structured architecture',
      'rust-axum': 'Rust with Axum, async runtime, and type safety',
      'bun-elysia': 'Bun runtime with Elysia framework and TypeScript',
      'deno-fresh': 'Deno with Fresh framework and TypeScript'
    };

    return frameworkMap[appType] || `Custom framework configuration for ${appType}`;
  }

  private getDatabaseDetails(dataSource: string): string {
    const databaseMap: Record<string, string> = {
      'postgresql': 'PostgreSQL 15+ with pgvector extension for AI embeddings',
      'supabase': 'Supabase with PostgreSQL, real-time subscriptions, and authentication',
      'mongodb': 'MongoDB 7.0 with aggregation pipelines and change streams',
      'firebase': 'Firebase Firestore with real-time updates and authentication',
      'planetscale': 'PlanetScale MySQL with branching and connection pooling',
      'neon': 'Neon PostgreSQL with serverless scaling and connection pooling',
      'turso': 'Turso SQLite with edge replication and low latency',
      'redis': 'Redis with clustering and persistence for caching and sessions'
    };

    return databaseMap[dataSource] || `Custom database configuration for ${dataSource}`;
  }

  private getFeatureDetails(features: string[]): string {
    const featureMap: Record<string, string> = {
      'auth': 'JWT-based authentication with refresh tokens, role-based access control, and social login options',
      'realtime': 'WebSocket connections with Socket.io, real-time data synchronization, and live updates',
      'api': 'RESTful API with OpenAPI documentation, rate limiting, and comprehensive error handling',
      'mobile': 'Responsive design with PWA capabilities, touch gestures, and mobile-first approach',
      'analytics': 'Custom analytics dashboard with real-time metrics, event tracking, and data visualization',
      'search': 'Full-text search with Elasticsearch integration, faceted search, and auto-suggestions',
      'ai': 'AI integration with OpenAI/DeepSeek APIs, embeddings, and intelligent recommendations',
      'payments': 'Stripe integration with subscription management, invoicing, and payment security',
      'social': 'Social features including sharing, comments, likes, and activity feeds',
      'seo': 'SEO optimization with meta tags, sitemap generation, and structured data',
      'testing': 'Comprehensive testing suite with Jest, Playwright, and CI/CD integration',
      'notifications': 'Push notifications with service workers, email templates, and SMS integration'
    };

    return features.map(feature => `• ${featureMap[feature] || `Custom ${feature} implementation`}`).join('\n');
  }
}

// Export singleton instance
export const promptService = new PromptService();