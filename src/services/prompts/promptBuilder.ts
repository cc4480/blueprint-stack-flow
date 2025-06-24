
import { PromptGenerationRequest } from '../types/promptTypes';

export class PromptBuilder {
  buildOptimizedSystemPrompt(): string {
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

  buildFocusedQuery(request: PromptGenerationRequest): string {
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
}
