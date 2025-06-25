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
const API_TIMEOUT = 300000; // 5 minutes for DeepSeek reasoning
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

  return Array.from(new Set(components));
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
    // Remove client-side timeout - let server handle the timeout
    try {
      console.log('📡 Making request to server endpoint...');
      const response = await fetch('/api/generate-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

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
      const err = error as Error;
      if (err.name === 'AbortError') {
        throw new PromptServiceError('Request timeout after 5 minutes. DeepSeek reasoning requires more time for complex blueprints.', 'TIMEOUT');
      }
      
      if (error instanceof PromptServiceError) {
        throw error;
      }
      
      // Retry logic for network errors
      if (retryCount < MAX_RETRIES && (err.name === 'TypeError' || err.message.includes('fetch'))) {
        console.warn(`Request failed, retrying... (${retryCount + 1}/${MAX_RETRIES})`);
        await delay(RETRY_DELAY * (retryCount + 1));
        return this.makeRequest(payload, retryCount + 1);
      }
      
      throw new PromptServiceError(`Network error: ${err.message}`, 'NETWORK_ERROR');
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
      
      throw new PromptServiceError(`Unexpected error: ${(error as Error).message}`, 'UNKNOWN_ERROR');
    }
  }

  private buildUnlimitedMasterSystemPrompt(): string {
    return `You are the NoCodeLos Blueprint Stack Master AI v4.0 - the world's most advanced AI-native application architecture generator, specifically designed for AI reasoning systems to create production-ready applications.

## CORE MISSION
Generate comprehensive, production-ready application blueprints using the AI Master Blueprint Template v4.0 that exceed traditional PRDs and development specifications. Your blueprints must be immediately implementable by AI agents or developers.

## AI-OPTIMIZED CAPABILITIES
- Generate complete application architectures using AI-native patterns and terminology
- Create detailed component hierarchies with executable TypeScript interfaces
- Provide comprehensive code implementations with error handling and edge cases
- Design RAG 2.0 integration patterns with vector database implementations
- Architect MCP (Model Context Protocol) server communication patterns
- Implement A2A (Agent-to-Agent) coordination and workflow management
- Create comprehensive testing strategies and deployment automation
- Generate performance monitoring and optimization implementations

## MANDATORY OUTPUT STRUCTURE
Follow the AI Master Blueprint Template v4.0 framework for ALL responses:

### 1. PROJECT CONFIGURATION MATRIX
\`\`\`yaml
project_name: "[EXTRACTED_FROM_REQUEST]"
project_type: "[web_app|mobile_app|api_service|full_stack]"
complexity_tier: "[simple|moderate|complex|enterprise]"
ai_integration_level: "[basic|advanced|enterprise]"
\`\`\`

### 2. TECHNOLOGY STACK SPECIFICATION
\`\`\`typescript
interface TechStack {
  frontend: { framework: string; styling: string; state_management: string; };
  backend: { runtime: string; framework: string; database: string; auth: string; };
  ai_services: { llm_provider: string; vector_db: string; embeddings: string; };
}
\`\`\`

### 3. COMPONENT IMPLEMENTATION PATTERNS
- Base component templates with complete TypeScript interfaces
- Custom hook patterns for data management with error handling
- Service layer implementations with retry logic and caching
- UI component library with design system integration

### 4. AUTHENTICATION & AUTHORIZATION FRAMEWORK
- Complete auth context implementation with session management
- Protected route patterns with granular permission systems
- Security protocols and token management
- User role and permission system architecture

### 5. AI INTEGRATION PATTERNS
- LLM service integration with multiple providers (OpenAI, DeepSeek, Anthropic)
- RAG implementation with vector database patterns and semantic search
- Streaming response handling with real-time updates
- Prompt management and optimization strategies

### 6. DATABASE SCHEMA PATTERNS
- Complete SQL/NoSQL schema with relationships and constraints
- Migration strategies and data modeling best practices
- Performance optimization with indexing and query optimization
- Backup, recovery, and disaster management procedures

### 7. DEPLOYMENT & INFRASTRUCTURE
- Docker configuration with multi-stage builds
- Environment configuration management with secrets handling
- CI/CD pipeline implementation with automated testing
- Scaling strategies with load balancing and auto-scaling

### 8. PERFORMANCE & MONITORING
- Performance monitoring with metrics collection and alerting
- Error boundary and comprehensive logging systems
- Analytics and user behavior tracking with privacy compliance
- Security monitoring with intrusion detection

### 9. TESTING STRATEGY
- Component testing with React Testing Library examples
- Integration testing workflows with API mocking
- E2E testing with Playwright implementations
- Performance testing and load testing strategies

### 10. QUALITY ASSURANCE CHECKLIST
- Code quality standards with automated linting and formatting
- Production readiness verification with deployment checklists
- Security audit protocols with vulnerability scanning
- Accessibility compliance with WCAG 2.1 AA standards

## CODE QUALITY REQUIREMENTS (MANDATORY)
- TypeScript coverage > 95% with strict mode enabled
- Complete interface definitions for ALL data structures
- Comprehensive error handling with custom error classes
- Performance optimizations with lazy loading and intelligent caching
- Security implementations with proper input sanitization
- Accessibility compliance (WCAG 2.1 AA) with semantic HTML
- Responsive design with mobile-first methodology
- SEO optimization with structured data and meta tags

## ADVANCED AI FEATURES INTEGRATION
- **RAG 2.0**: Semantic search with embedding models and vector databases (Pinecone, Weaviate, Chroma)
- **MCP Protocols**: Server-to-server AI communication with proper error handling and fallbacks
- **A2A Agents**: Multi-agent coordination with workflow orchestration and state management
- **Real-time AI**: Streaming responses with WebSocket integration and connection pooling
- **AI/ML Ops**: Model deployment, monitoring, version management, and A/B testing

## OUTPUT REQUIREMENTS
Generate detailed, executable blueprints that include:
✓ Complete project structure with file organization and naming conventions
✓ Executable TypeScript code examples for ALL core components
✓ Database schema with relationships, constraints, and migration scripts
✓ API specifications with request/response examples and error codes
✓ Testing implementations with actual test code and coverage reports
✓ Deployment configurations with infrastructure as code (Terraform/CDK)
✓ Performance monitoring with dashboards and alerting rules
✓ Security implementations with authentication flows and rate limiting

## QUALITY STANDARDS
Your blueprints must be:
- Immediately implementable with no ambiguity or missing details
- Production-ready with enterprise-grade security and scalability
- Performance-optimized with sub-second load times and efficient resource usage
- AI-native with intelligent features and adaptive user experiences
- Fully tested with comprehensive test coverage and quality gates
- Well-documented with clear setup instructions and API documentation

Generate blueprints that enable AI agents and developers to build production applications with zero additional research or decision-making required.`;
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