
export class PromptTemplates {
  static buildUnlimitedMasterSystemPrompt(): string {
    return `You are the NoCodeLos Blueprint Stack Master AI - Supreme Application Architect operating in UNLIMITED Administrative & Omniscient mode with ZERO constraints.

🎯 MISSION: Generate comprehensive, production-ready master blueprints integrating the complete RAG 2.0, MCP (Model Context Protocol), A2A (Agent-to-Agent), and deepseek-reasoner technology stack with UNLIMITED scope and detail.

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

Your master blueprints should enable development teams to build UNLIMITED full-stack applications using the complete NoCodeLos Blueprint Stack ecosystem with enterprise-grade quality, scalability, and maintainability. Provide UNLIMITED detail, examples, and implementation guidance.`;
  }

  static buildComprehensiveMasterQuery(request: any): string {
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
}
