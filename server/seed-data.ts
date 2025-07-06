import { storage } from "./storage";

const blueprintStackTemplates = [
  {
    name: "NoCodeLos Blueprint Stack Master Template",
    description: "The complete system for building production apps without dev teams - includes 5-layer architecture, build prompts, and optimization workflows",
    category: "blueprint-stack",
    content: `# NoCodeLos Blueprint Stack Master Template

## The System That Builds Production Apps Without Dev Teams

This is the exact system I use to build full-stack AI applications faster and cheaper than traditional development teams. No guesswork. No wasted time. Just proven workflows that work.

## The 5-Layer Stack Architecture

### Layer 1: Core Build Prompts
- Component generation with proper TypeScript interfaces
- State management implementation patterns
- API integration and error handling workflows
- Database schema and relationship patterns
- Authentication and authorization flows

### Layer 2: Master Blueprint Template
- AI-native project structure
- Component hierarchy guidelines
- Data flow architecture
- Performance optimization patterns
- Deployment and scaling strategies

### Layer 3: Refactor Engine
- Automated component splitting strategies
- Performance bottleneck identification
- Bundle size optimization techniques
- Memory leak prevention patterns
- Cross-browser compatibility fixes

### Layer 4: Error Recovery Layer
- Common error pattern recognition
- Automated debugging strategies
- Console error interpretation guides
- Production monitoring setup
- Rollback and recovery procedures

### Layer 5: Platform Optimization
- Lovable-optimized development patterns
- Cursor IDE integration strategies
- Replit deployment workflows
- Cross-platform compatibility guides
- Performance monitoring implementations

## Implementation Methodology

### Phase 1: Project Initialization (15 minutes)
1. Define application requirements using the Blueprint Template
2. Generate core prompts using the Prompt Generator
3. Set up project structure and dependencies
4. Configure development environment

### Phase 2: Rapid Development (2-48 hours)
1. Execute generated prompts in sequence
2. Apply refactor patterns continuously
3. Implement error recovery protocols
4. Monitor performance metrics in real-time

### Phase 3: Production Deployment (30 minutes - 2 hours)
1. Performance optimization and bundle analysis
2. Security audit and vulnerability scanning
3. Accessibility compliance verification
4. Cross-browser testing and validation

## Quality Assurance Framework

### Development Standards
- TypeScript coverage: > 95%
- Component reusability: > 80%
- Error boundary coverage: 100%
- Loading state consistency: 100%
- Form validation completeness: 100%

### Performance Benchmarks
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- First Input Delay: < 100ms
- Cumulative Layout Shift: < 0.1
- Time to Interactive: < 3s

### User Experience Standards
- Mobile-first responsive design
- WCAG 2.1 AA compliance
- Cross-browser compatibility (Chrome, Firefox, Safari, Edge)
- Progressive enhancement implementation
- Offline functionality where applicable`,
    metadata: {
      author: "NoCodeLos",
      version: "4.0",
      lastUpdated: new Date().toISOString(),
      difficulty: "Advanced",
      estimatedTime: "2-48 hours"
    },
    tags: ["blueprint-stack", "full-stack", "ai-development", "production-ready"],
    isPublic: true,
    rating: 5.0
  },
  {
    name: "DeepSeek Reasoner Integration Guide",
    description: "Complete guide for integrating DeepSeek's reasoning model with streaming capabilities and CoT (Chain of Thought) processing",
    category: "ai-integration",
    content: `# DeepSeek Reasoner Integration Guide

## Overview
DeepSeek Reasoner is a reasoning model that generates Chain of Thought (CoT) content before delivering final answers, enhancing accuracy and transparency.

## Key Features
- Chain of Thought (CoT) reasoning
- Streaming support for real-time responses
- Function calling capabilities
- JSON output format support
- Maximum context length: 64K tokens
- Maximum output tokens: 32K (default), 64K (maximum)

## API Parameters

### Input Parameters
- **max_tokens**: Maximum output length (including CoT). Default: 32K, Max: 64K
- **messages**: Array of conversation messages
- **stream**: Boolean for streaming responses
- **model**: "deepseek-reasoner"

### Output Structure
- **reasoning_content**: The Chain of Thought process
- **content**: The final answer
- **usage**: Token usage statistics

## Implementation Example

### Streaming Integration
\`\`\`typescript
const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': \`Bearer \${apiKey}\`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'deepseek-reasoner',
    messages: [
      { role: 'user', content: 'Your question here' }
    ],
    stream: true,
    max_tokens: 8192
  })
});
\`\`\`

### Response Handling
\`\`\`typescript
const reader = response.body?.getReader();
let reasoning_content = '';
let content = '';

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  
  // Process streaming chunks
  const chunk = decoder.decode(value);
  const lines = chunk.split('\\n');
  
  for (const line of lines) {
    if (line.startsWith('data: ')) {
      const data = JSON.parse(line.slice(6));
      if (data.choices[0].delta.reasoning_content) {
        reasoning_content += data.choices[0].delta.reasoning_content;
      }
      if (data.choices[0].delta.content) {
        content += data.choices[0].delta.content;
      }
    }
  }
}
\`\`\`

## Best Practices

### Multi-round Conversations
- Remove reasoning_content from previous messages before sending new requests
- Only include the final content in conversation history
- Chain of Thought is not included in context for subsequent rounds

### Error Handling
- Handle 400 errors when reasoning_content is included in input
- Implement retry logic for network issues
- Validate response structure before processing

### Performance Optimization
- Use appropriate max_tokens based on use case
- Implement proper streaming chunk processing
- Add timeout handling for long-running requests

## Supported Features
- Function Calling
- JSON Output
- Chat Completion
- Chat Prefix Completion (Beta)

## Not Supported
- FIM (Fill-in-Middle) - Beta
- temperature, top_p, presence_penalty, frequency_penalty parameters
- logprobs, top_logprobs parameters`,
    metadata: {
      author: "DeepSeek",
      version: "1.0",
      lastUpdated: new Date().toISOString(),
      difficulty: "Intermediate",
      estimatedTime: "1-2 hours"
    },
    tags: ["deepseek", "ai", "reasoning", "streaming", "integration"],
    isPublic: true,
    rating: 4.8
  },
  {
    name: "AI Solutions Architect System Prompt",
    description: "Meta-template for AI systems to generate complete application blueprints and codebases from high-level user requests",
    category: "ai-prompting",
    content: `# AI Solutions Architect System Prompt

## Core Identity and Persona
You are "Blueprint Architect AI", an expert full-stack software architect and 10x engineer. Your core competency is understanding a user's high-level vision and instantly translating it into a robust, well-documented, and production-ready application plan.

## Technology Stack Expertise
- **Frontend**: Next.js, TypeScript, React, Tailwind CSS
- **Backend**: Next.js API Routes (Node.js environment)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **Deployment**: Vercel

## Primary Function
Take a user's raw idea and generate two synchronized outputs:
1. **The Master Blueprint**: Human-readable documentation and plan
2. **The Application Codebase**: Machine-readable, full-stack application structure

## Core Task: Blueprint and Code Generation

### Step 1: Master Blueprint Generation
Generate a complete "Master Blueprint" in Markdown format with detailed, practical information derived from the user's request. Use your expertise to make intelligent assumptions about:
- Architecture decisions
- User flows
- Technical implementation details
- Security considerations
- Performance optimizations

### Step 2: Complete File Structure Generation
Generate the complete file and folder structure for the full-stack application, presented as a Markdown code block representing a file tree. Include complete, high-quality boilerplate code for critical files.

## Master Blueprint Template Structure

\`\`\`markdown
# Master Blueprint: [AI-Generated Application Name]

## 🎯 Project Overview
- **Purpose**: [Clear description of what the application does]
- **Target Users**: [Who will use this application]
- **Core Value Proposition**: [Why users would choose this over alternatives]

## 🏗️ Technical Architecture

### Frontend Architecture
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with component library
- **State Management**: [Zustand/Redux/Context based on complexity]
- **Type Safety**: TypeScript with strict mode

### Backend Architecture
- **API Layer**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with [provider strategy]
- **File Storage**: [Strategy based on requirements]

### Data Architecture
\`\`\`sql
-- Core database schema
[Generated schema based on requirements]
\`\`\`

## 🔧 Implementation Plan

### Phase 1: Foundation (Day 1)
- [ ] Project setup and configuration
- [ ] Database schema design and migration
- [ ] Authentication system implementation
- [ ] Basic routing structure

### Phase 2: Core Features (Days 2-3)
- [ ] [Feature 1 implementation]
- [ ] [Feature 2 implementation]
- [ ] [Feature 3 implementation]

### Phase 3: Polish and Deploy (Day 4)
- [ ] UI/UX refinements
- [ ] Performance optimization
- [ ] Testing and validation
- [ ] Production deployment

## 🎨 User Experience Design

### User Journey
1. [Step-by-step user flow]
2. [Key interaction points]
3. [Success metrics]

### Interface Design
- **Design System**: [Color palette, typography, spacing]
- **Component Library**: [Reusable components list]
- **Responsive Strategy**: [Mobile-first approach details]

## 🔒 Security & Performance

### Security Measures
- [ ] Input validation and sanitization
- [ ] Authentication and authorization
- [ ] Data encryption strategies
- [ ] API rate limiting

### Performance Targets
- **Page Load Time**: < 2 seconds
- **Core Web Vitals**: All metrics in green
- **Accessibility**: WCAG 2.1 AA compliance

## 📱 Deployment Strategy
- **Platform**: Vercel
- **Environment Variables**: [List of required env vars]
- **CI/CD Pipeline**: GitHub Actions integration
- **Monitoring**: [Error tracking and analytics setup]
\`\`\`

## File Structure Template

\`\`\`
my-app/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── api/
│   │   ├── auth/
│   │   └── [feature]/
│   ├── [feature]/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── ui/
│   ├── forms/
│   └── layout/
├── lib/
│   ├── auth.ts
│   ├── db.ts
│   └── utils.ts
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── public/
├── styles/
├── types/
├── package.json
├── next.config.js
├── tailwind.config.js
└── tsconfig.json
\`\`\`

## Code Generation Guidelines

### Critical Files to Generate
1. **package.json**: Complete dependencies list
2. **prisma/schema.prisma**: Full database schema
3. **app/layout.tsx**: Root layout with providers
4. **lib/auth.ts**: Authentication configuration
5. **components/ui/**: Essential UI components
6. **app/api/**: Core API endpoints

### Code Quality Standards
- TypeScript strict mode enabled
- ESLint and Prettier configuration
- Error boundaries and loading states
- Responsive design implementation
- Accessibility considerations
- Performance optimizations

## Intelligent Assumptions Framework

When user requirements are vague or incomplete:
1. **Choose the most common use case**
2. **Implement industry best practices**
3. **Prioritize scalability and maintainability**
4. **Include comprehensive error handling**
5. **Plan for future feature expansion**

## Success Metrics
- **Development Speed**: 10x faster than traditional teams
- **Code Quality**: Production-ready from generation
- **Maintainability**: Clear architecture and documentation
- **Scalability**: Built to handle growth from day one`,
    metadata: {
      author: "Blueprint Stack",
      version: "2.0",
      lastUpdated: new Date().toISOString(),
      difficulty: "Expert",
      estimatedTime: "30 minutes setup"
    },
    tags: ["ai-prompting", "system-prompt", "blueprint-generation", "automation"],
    isPublic: true,
    rating: 4.9
  }
];

const sampleRagDocuments = [
  {
    title: "Blueprint Stack Architecture Overview",
    content: `The Blueprint Stack represents a paradigm shift in application development, moving from traditional coding to AI-assisted blueprint generation. This system consists of five interconnected layers that work together to produce production-ready applications in a fraction of the traditional development time.

Layer 1 (Core Build Prompts) forms the foundation with battle-tested prompts for every development scenario. These prompts have been refined through hundreds of projects and cover component generation, state management, API integration, database design, and authentication flows.

Layer 2 (Master Blueprint Template) serves as the new-generation replacement for outdated PRDs (Product Requirements Documents). It provides AI-native project structure, component hierarchy guidelines, data flow architecture, performance optimization patterns, and deployment strategies.

Layer 3 (Refactor Engine) enables continuous code optimization without breaking functionality. It includes automated component splitting strategies, performance bottleneck identification, bundle size optimization, memory leak prevention, and cross-browser compatibility fixes.

Layer 4 (Error Recovery Layer) ensures zero-bug deployment workflows through common error pattern recognition, automated debugging strategies, console error interpretation guides, production monitoring setup, and rollback procedures.

Layer 5 (Platform Optimization) provides tool-specific best practices for modern development platforms including Lovable-optimized patterns, Cursor IDE integration, Replit deployment workflows, and cross-platform compatibility guides.`,
    metadata: {
      source: "NoCodeLos Documentation",
      category: "architecture",
      author: "Blueprint Stack Team"
    },
    tags: ["blueprint-stack", "architecture", "development", "ai-assisted"]
  },
  {
    title: "DeepSeek Reasoner Implementation Guide",
    content: `DeepSeek Reasoner introduces a new paradigm in AI reasoning by generating Chain of Thought (CoT) content before delivering final answers. This approach significantly enhances accuracy and provides transparency into the AI's reasoning process.

The model supports a maximum context length of 64K tokens and can output up to 64K tokens (32K default). The reasoning_content field contains the CoT process, while the content field holds the final answer. Importantly, in multi-round conversations, the CoT from previous rounds is not concatenated into the context.

For streaming implementations, you must handle both reasoning_content and content deltas separately. The reasoning_content provides real-time insight into the AI's thinking process, while content delivers the final response incrementally.

Key implementation considerations include proper error handling (400 errors occur if reasoning_content is included in input messages), timeout handling for long-running requests, and appropriate max_tokens configuration based on use case complexity.

The model supports function calling, JSON output, and chat completion, but does not support FIM (Fill-in-Middle) operations or traditional parameters like temperature and top_p. This design choice ensures consistent reasoning quality while maintaining the model's core reasoning capabilities.`,
    metadata: {
      source: "DeepSeek API Documentation",
      category: "ai-integration",
      author: "DeepSeek Team"
    },
    tags: ["deepseek", "reasoning", "chain-of-thought", "streaming", "api"]
  },
  {
    title: "AI-Driven Blueprint Generation Methodology",
    content: `The evolution of software development has reached a critical inflection point where AI systems can serve as Lead Solutions Architects, taking simple user requests and generating comprehensive application blueprints with synchronized documentation and code structures.

This methodology transforms the traditional development pipeline by introducing a meta-template approach where AI systems use structured templates as internal thinking processes. The AI architect analyzes user requirements, applies industry best practices, and generates two primary outputs: a Master Blueprint (human-readable documentation) and an Application Codebase (machine-readable structure).

The Master Blueprint follows a standardized template that includes project overview, technical architecture, implementation phases, user experience design, security measures, and deployment strategies. Each section is populated with intelligent assumptions based on the user's requirements and industry standards.

The Application Codebase provides a complete file structure with production-ready boilerplate code for critical components. This includes package.json with appropriate dependencies, database schemas, authentication configurations, UI components, and API endpoints.

Success metrics for this approach include 10x faster development speed compared to traditional teams, production-ready code quality from initial generation, clear architecture for long-term maintainability, and built-in scalability to handle growth from day one. The system leverages Next.js, TypeScript, PostgreSQL, and modern deployment platforms to ensure industry-standard technology adoption.`,
    metadata: {
      source: "Blueprint Stack Flow Documentation",
      category: "methodology",
      author: "AI Development Research"
    },
    tags: ["ai-architecture", "blueprint-generation", "methodology", "automation", "development"]
  }
];

const sampleMcpServers = [
  {
    name: "File System Server",
    description: "Provides secure file system access with read/write capabilities",
    transport: "stdio",
    capabilities: {
      tools: ["read_file", "write_file", "list_directory", "create_directory"],
      resources: ["file_system"]
    },
    status: "active",
    protocolVersion: "1.0.0",
    command: "npx @modelcontextprotocol/server-filesystem"
  },
  {
    name: "Database Query Server",
    description: "Enables secure database operations through MCP protocol",
    transport: "stdio",
    capabilities: {
      tools: ["execute_query", "get_schema", "create_table", "insert_data"],
      resources: ["postgresql_database"]
    },
    status: "active",
    protocolVersion: "1.0.0",
    command: "npx @modelcontextprotocol/server-postgres"
  },
  {
    name: "Web Search Server",
    description: "Provides web search capabilities with result summarization",
    transport: "http",
    endpoint: "https://api.search.mcp/v1",
    capabilities: {
      tools: ["web_search", "summarize_results", "extract_content"],
      resources: ["web_content"]
    },
    status: "active",
    protocolVersion: "1.0.0"
  }
];

const sampleA2aAgents = [
  {
    name: "Code Generator Agent",
    description: "Specialized in generating production-ready code from specifications",
    status: "online",
    capabilities: {
      languages: ["TypeScript", "Python", "Go"],
      frameworks: ["Next.js", "React", "FastAPI"],
      specializations: ["frontend", "backend", "database"]
    },
    endpoint: "https://agents.blueprint.dev/code-generator",
    agentCard: {
      avatar: "🤖",
      expertise: ["Full-Stack Development", "AI Integration", "Performance Optimization"],
      successRate: 0.95,
      averageResponseTime: "2.3s"
    }
  },
  {
    name: "Architecture Advisor Agent",
    description: "Provides system architecture recommendations and best practices",
    status: "online",
    capabilities: {
      domains: ["microservices", "serverless", "monolith"],
      platforms: ["AWS", "Vercel", "Railway"],
      specializations: ["scalability", "security", "performance"]
    },
    endpoint: "https://agents.blueprint.dev/architecture-advisor",
    agentCard: {
      avatar: "🏗️",
      expertise: ["System Architecture", "Cloud Infrastructure", "Security"],
      successRate: 0.98,
      averageResponseTime: "1.8s"
    }
  },
  {
    name: "QA Testing Agent",
    description: "Automated testing and quality assurance for generated applications",
    status: "online",
    capabilities: {
      testTypes: ["unit", "integration", "e2e"],
      frameworks: ["Jest", "Playwright", "Cypress"],
      specializations: ["performance", "accessibility", "security"]
    },
    endpoint: "https://agents.blueprint.dev/qa-testing",
    agentCard: {
      avatar: "🧪",
      expertise: ["Test Automation", "Quality Assurance", "Performance Testing"],
      successRate: 0.92,
      averageResponseTime: "3.1s"
    }
  }
];

export async function seedDatabase() {
  console.log("🌱 Starting database seeding...");

  try {
    // Seed Templates
    console.log("📄 Seeding templates...");
    for (const template of blueprintStackTemplates) {
      await storage.createTemplate(template);
    }

    // Seed RAG Documents
    console.log("📚 Seeding RAG documents...");
    for (const doc of sampleRagDocuments) {
      await storage.createRagDocument(doc);
    }

    // Seed MCP Servers
    console.log("🔧 Seeding MCP servers...");
    for (const server of sampleMcpServers) {
      await storage.createMcpServer(server);
    }

    // Seed A2A Agents
    console.log("🤖 Seeding A2A agents...");
    for (const agent of sampleA2aAgents) {
      await storage.createA2aAgent(agent);
    }

    // Seed some system metrics
    console.log("📊 Seeding system metrics...");
    const metrics = [
      { metricName: "response_time", value: 120.5, category: "performance" },
      { metricName: "error_rate", value: 0.02, category: "reliability" },
      { metricName: "throughput", value: 1500, category: "performance" },
      { metricName: "cpu_usage", value: 45.2, category: "resources" },
      { metricName: "memory_usage", value: 68.7, category: "resources" }
    ];

    for (const metric of metrics) {
      await storage.createSystemMetric(metric);
    }

    // Seed integration status
    console.log("🔗 Seeding integration status...");
    const integrations = [
      { serviceName: "DeepSeek API", status: "active", responseTimeMs: 250, errorCount: 0 },
      { serviceName: "PostgreSQL", status: "active", responseTimeMs: 15, errorCount: 0 },
      { serviceName: "Redis Cache", status: "active", responseTimeMs: 5, errorCount: 0 },
      { serviceName: "File Storage", status: "active", responseTimeMs: 80, errorCount: 0 }
    ];

    for (const integration of integrations) {
      await storage.updateIntegrationStatus(integration.serviceName, integration);
    }

    console.log("✅ Database seeding completed successfully!");
    
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

// Export individual seed functions for selective seeding
export const seedFunctions = {
  seedTemplates: async () => {
    for (const template of blueprintStackTemplates) {
      await storage.createTemplate(template);
    }
  },
  seedRagDocuments: async () => {
    for (const doc of sampleRagDocuments) {
      await storage.createRagDocument(doc);
    }
  },
  seedMcpServers: async () => {
    for (const server of sampleMcpServers) {
      await storage.createMcpServer(server);
    }
  },
  seedA2aAgents: async () => {
    for (const agent of sampleA2aAgents) {
      await storage.createA2aAgent(agent);
    }
  }
};