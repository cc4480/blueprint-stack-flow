
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Copy, Download, Star, Clock, Code, FileText, Settings } from 'lucide-react';
import { toast } from 'sonner';

interface Template {
  id: number;
  name: string;
  description: string;
  category: string;
  difficulty: string;
  downloads: number;
  rating: number;
  technologies: string[];
  preview: string;
}

interface TemplateModalProps {
  template: Template | null;
  isOpen: boolean;
  onClose: () => void;
  onUseTemplate: (template: Template) => void;
}

const TemplateModal: React.FC<TemplateModalProps> = ({
  template,
  isOpen,
  onClose,
  onUseTemplate
}) => {
  if (!template) return null;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-500';
      case 'Intermediate': return 'bg-blue-500';
      case 'Advanced': return 'bg-orange-500';
      case 'Expert': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getTemplatePrompt = (template: Template) => {
    const prompts = {
      1: `Create a comprehensive RAG 2.0 Knowledge Base system with the following specifications:

**Core Architecture:**
- Advanced retrieval-augmented generation with hybrid search capabilities
- Vector database integration (Pinecone/Weaviate/Chroma)
- Semantic chunking with overlapping windows
- Multi-stage re-ranking with cross-encoders

**Key Features:**
- Document ingestion pipeline with metadata extraction
- Hybrid search combining dense and sparse retrieval
- Query expansion with hypothetical document embeddings (HyDE)
- Context compression and relevance filtering
- Real-time streaming responses with citations

**Technical Stack:**
- Vector embeddings: OpenAI text-embedding-3-large
- Reranking: Cohere rerank-english-v3.0
- LLM: GPT-4 or Claude-3.5-Sonnet
- Database: PostgreSQL with pgvector extension
- Frontend: React with TypeScript

**Implementation Details:**
- Chunk size: 512 tokens with 50-token overlap
- Top-k retrieval: 20 candidates, rerank to top-5
- Similarity threshold: 0.75 for relevance filtering
- Maximum context window: 16K tokens
- Response streaming with server-sent events

Generate a complete, production-ready implementation with all necessary components, configurations, and deployment instructions.`,

      2: `Build a complete MCP Tool Orchestrator system following the Model Context Protocol specification:

**MCP Architecture:**
- Client-server architecture with JSON-RPC 2.0 messaging
- Support for stdio and HTTP/SSE transport mechanisms
- Capability negotiation and lifecycle management
- Security with authentication and authorization

**Core Primitives Implementation:**
- Tools: Executable functions with JSON schema validation
- Resources: Structured data streams with URI templates  
- Prompts: Reusable instruction templates for common workflows

**Key Features:**
- Dynamic tool discovery and registration
- Real-time capability advertising
- Secure tool execution with sandboxing
- Error handling and retry mechanisms
- Logging and monitoring integration

**Technical Implementation:**
- Protocol: MCP v1.0 with JSON-RPC 2.0
- Transport: HTTP/SSE for remote, stdio for local
- Authentication: OAuth 2.0 or API key based
- Languages: TypeScript/Python SDK support
- Database: Tool registry with capability metadata

**Example Tools to Include:**
- File system operations (read/write/search)
- Database queries (SQL execution)
- API integrations (REST/GraphQL clients)
- Code execution (sandboxed Python/JavaScript)
- Web scraping and content extraction

Create a complete MCP server implementation with client integration examples and comprehensive documentation.`,

      3: `Develop a sophisticated A2A Agent Network with multi-agent coordination capabilities:

**Agent-to-Agent Protocol:**
- Standardized communication using A2A protocol specification
- Agent discovery through Agent Cards (/.well-known/agent.json)
- Task-based collaboration with stateful interactions
- Long-running task support with real-time updates

**Core Components:**
- Agent Card: Identity and capability advertisement
- Task: Stateful collaboration container
- Message: Communication within task context
- Artifact: Immutable results and outputs

**Multi-Agent Features:**
- Dynamic agent discovery and capability matching
- Task delegation and sub-task coordination
- Conflict resolution and consensus mechanisms
- Load balancing and fault tolerance
- Performance monitoring and optimization

**Security Implementation:**
- Authentication: OAuth 2.0 / API key verification
- Authorization: Role-based access control (RBAC)
- Encryption: TLS 1.3 for all communications  
- Audit logging: Comprehensive interaction tracking
- Rate limiting: DDoS protection and resource management

**Example Agent Types:**
- Research Agent: Information gathering and analysis
- Planning Agent: Task decomposition and scheduling  
- Execution Agent: Action implementation and monitoring
- Validation Agent: Quality assurance and verification
- Coordination Agent: Multi-agent orchestration

Build a complete A2A network with agent examples, discovery mechanisms, and coordination protocols.`,

      4: `Create a DeepSeek Reasoner Integration with advanced chain-of-thought capabilities:

**DeepSeek Integration:**
- Model: deepseek-reasoner with full reasoning exposure
- API: Official DeepSeek platform integration
- Streaming: Real-time token streaming with reasoning traces
- Context: Extended conversation management

**Chain-of-Thought Features:**
- Reasoning trace extraction and display
- Step-by-step problem decomposition
- Multi-turn conversation continuity
- Reasoning validation and verification
- Interactive reasoning exploration

**Technical Implementation:**
- API Client: Python SDK with async support
- Streaming: Server-sent events for real-time updates
- Context Management: Conversation history with reasoning
- Error Handling: Robust retry and fallback mechanisms
- Rate Limiting: Efficient token usage optimization

**Advanced Reasoning Capabilities:**
- Mathematical problem solving with step-by-step solutions
- Code generation with explanation of logic
- Complex analysis with structured reasoning
- Multi-perspective evaluation and synthesis
- Creative problem solving with ideation traces

**Integration Features:**
- Web interface with reasoning visualization
- API endpoints for external integration
- Webhook support for event notifications
- Database storage for reasoning sessions
- Analytics and performance monitoring

Create a complete DeepSeek reasoner system with web interface, API integration, and reasoning visualization.`,

      5: `Build the complete NoCodeLos Blueprint Stack with full integration of all protocols:

**Full Stack Architecture:**
- RAG 2.0: Advanced knowledge retrieval and generation
- MCP: Model Context Protocol for tool orchestration  
- A2A: Agent-to-Agent communication and coordination
- DeepSeek: Chain-of-thought reasoning integration

**System Integration:**
- Unified API gateway with protocol routing
- Shared authentication and authorization layer
- Cross-protocol data synchronization
- Real-time event streaming and notifications
- Comprehensive logging and monitoring

**Production Features:**
- Horizontal scaling with load balancing
- Database replication and backup strategies
- Security hardening with penetration testing
- Performance optimization and caching
- CI/CD pipeline with automated testing

**Enterprise Capabilities:**
- Multi-tenant architecture with isolation
- Role-based access control (RBAC)
- Audit logging and compliance reporting
- API rate limiting and quota management
- Disaster recovery and business continuity

**Technology Stack:**
- Backend: Node.js/Python with microservices
- Frontend: React/TypeScript with modern UI
- Database: PostgreSQL with Redis caching
- Message Queue: Apache Kafka or RabbitMQ
- Monitoring: Prometheus, Grafana, ELK stack

**Deployment Architecture:**
- Containerization: Docker with Kubernetes orchestration
- Cloud: AWS/GCP/Azure with multi-region deployment
- CDN: CloudFlare for global content delivery
- SSL/TLS: Certificate management and rotation
- Backup: Automated backup with point-in-time recovery

Create a complete, production-ready Blueprint Stack implementation with all protocols integrated and enterprise-grade features.`,

      6: `Develop an Enterprise RAG Pipeline with production-grade security and scalability:

**Enterprise Architecture:**
- Microservices with API gateway and service mesh
- Multi-tenant data isolation and security
- Horizontal scaling with load balancing
- High availability with 99.9% uptime SLA
- Disaster recovery with automated failover

**Security Implementation:**
- Zero-trust architecture with mutual TLS
- End-to-end encryption for data at rest and in transit
- OAuth 2.0/OIDC with RBAC and ABAC policies
- SOC 2 Type II compliance with audit logging
- Vulnerability scanning and penetration testing

**Scalability Features:**
- Auto-scaling based on load metrics
- Database sharding and read replicas
- Distributed caching with Redis clusters
- CDN integration for global content delivery
- Queue-based processing for heavy workloads

**Data Pipeline:**
- Real-time ingestion with Apache Kafka
- ETL processing with Apache Airflow
- Data versioning and lineage tracking
- Quality monitoring and anomaly detection
- Backup and retention policy automation

**Monitoring and Observability:**
- Metrics: Prometheus with Grafana dashboards
- Logging: ELK stack with centralized aggregation
- Tracing: Jaeger for distributed request tracking
- Alerting: PagerDuty integration with SLA monitoring
- Performance: APM with New Relic or Datadog

**Compliance and Governance:**
- GDPR/CCPA data privacy compliance
- Data classification and access controls
- Regulatory reporting and audit trails  
- Information lifecycle management
- Privacy by design principles

Build a complete enterprise RAG system with all production requirements, security measures, and compliance features.`
    };

    return prompts[template.id as keyof typeof prompts] || `Create a ${template.name} implementation based on the following requirements:\n\n${template.description}\n\nTechnologies: ${template.technologies.join(', ')}\n\nDifficulty Level: ${template.difficulty}`;
  };

  const getTemplateCode = (template: Template) => {
    const codeExamples = {
      1: `// RAG 2.0 Knowledge Base Implementation
import { VectorStore } from '@/lib/vectorstore';
import { Embeddings } from '@/lib/embeddings';
import { Reranker } from '@/lib/reranker';

class RAGKnowledgeBase {
  constructor(
    private vectorStore: VectorStore,
    private embeddings: Embeddings,
    private reranker: Reranker
  ) {}

  async ingestDocument(document: string, metadata: any) {
    const chunks = await this.chunkDocument(document);
    const embeddings = await this.embeddings.embed(chunks);
    await this.vectorStore.upsert(embeddings, metadata);
  }

  async query(question: string, topK = 20) {
    const queryEmbedding = await this.embeddings.embed([question]);
    const candidates = await this.vectorStore.search(queryEmbedding, topK);
    const reranked = await this.reranker.rerank(question, candidates, 5);
    return this.generateResponse(question, reranked);
  }
}`,

      2: `// MCP Tool Orchestrator Implementation
import { MCPServer } from '@/lib/mcp';

class ToolOrchestrator {
  private server: MCPServer;

  constructor() {
    this.server = new MCPServer({
      name: "tool-orchestrator",
      version: "1.0.0"
    });
    this.registerTools();
  }

  private registerTools() {
    this.server.addTool({
      name: "execute_code",
      description: "Execute code in a sandboxed environment",
      inputSchema: {
        type: "object",
        properties: {
          code: { type: "string" },
          language: { type: "string" }
        }
      }
    }, this.executeCode.bind(this));
  }

  private async executeCode(params: any) {
    // Implementation here
    return { result: "Code executed successfully" };
  }
}`,

      3: `// A2A Agent Network Implementation
import { A2AAgent } from '@/lib/a2a';

class AgentNetwork {
  private agents: Map<string, A2AAgent> = new Map();

  async discoverAgent(capabilities: string[]): Promise<A2AAgent | null> {
    for (const [id, agent] of this.agents) {
      const agentCard = await agent.getAgentCard();
      if (this.matchesCapabilities(agentCard.skills, capabilities)) {
        return agent;
      }
    }
    return null;
  }

  async delegateTask(task: Task, targetAgent: A2AAgent) {
    const taskId = await targetAgent.createTask(task);
    return this.monitorTask(taskId, targetAgent);
  }

  private matchesCapabilities(skills: string[], required: string[]): boolean {
    return required.every(cap => skills.includes(cap));
  }
}`,

      4: `// DeepSeek Reasoner Integration
import { DeepSeekClient } from '@/lib/deepseek';

class ReasonerIntegration {
  private client: DeepSeekClient;

  constructor(apiKey: string) {
    this.client = new DeepSeekClient(apiKey);
  }

  async streamReasoning(prompt: string, onToken: (token: string) => void) {
    const stream = await this.client.chat.completions.create({
      model: "deepseek-reasoner",
      messages: [{ role: "user", content: prompt }],
      stream: true
    });

    for await (const chunk of stream) {
      const token = chunk.choices[0]?.delta?.content;
      if (token) onToken(token);
    }
  }

  async getReasoningTrace(prompt: string) {
    const response = await this.client.chat.completions.create({
      model: "deepseek-reasoner", 
      messages: [{ role: "user", content: prompt }]
    });

    return {
      reasoning: response.choices[0].message.reasoning_content,
      answer: response.choices[0].message.content
    };
  }
}`,

      5: `// Complete Blueprint Stack Integration
import { RAGKnowledgeBase } from './rag';
import { ToolOrchestrator } from './mcp';
import { AgentNetwork } from './a2a';
import { ReasonerIntegration } from './deepseek';

class BlueprintStack {
  private rag: RAGKnowledgeBase;
  private mcp: ToolOrchestrator;
  private a2a: AgentNetwork;
  private reasoner: ReasonerIntegration;

  constructor(config: BlueprintConfig) {
    this.rag = new RAGKnowledgeBase(config.vectorStore);
    this.mcp = new ToolOrchestrator();
    this.a2a = new AgentNetwork();
    this.reasoner = new ReasonerIntegration(config.deepseekApiKey);
  }

  async processRequest(request: any) {
    // 1. Use RAG to retrieve relevant context
    const context = await this.rag.query(request.query);
    
    // 2. Delegate to appropriate agent via A2A
    const agent = await this.a2a.discoverAgent(request.capabilities);
    
    // 3. Use MCP tools for execution
    const tools = await this.mcp.getAvailableTools();
    
    // 4. Apply reasoning with DeepSeek
    const reasoning = await this.reasoner.getReasoningTrace(request.query);
    
    return this.synthesizeResponse(context, agent, tools, reasoning);
  }
}`,

      6: `// Enterprise RAG Pipeline Implementation
import { KafkaProducer } from '@/lib/kafka';
import { PostgresClient } from '@/lib/postgres';
import { RedisClient } from '@/lib/redis';

class EnterpriseRAGPipeline {
  private kafka: KafkaProducer;
  private db: PostgresClient;
  private cache: RedisClient;

  constructor() {
    this.kafka = new KafkaProducer();
    this.db = new PostgresClient();
    this.cache = new RedisClient();
  }

  async ingestDocument(document: any, tenantId: string) {
    // Multi-tenant isolation
    const isolatedDocument = this.isolateByTenant(document, tenantId);
    
    // Queue for processing
    await this.kafka.produce('document-ingestion', isolatedDocument);
    
    // Update metrics
    await this.updateMetrics('documents_ingested', tenantId);
  }

  async query(query: string, tenantId: string) {
    // Check cache first
    const cacheKey = this.getCacheKey(query, tenantId);
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

    // Process query with enterprise features
    const result = await this.processEnterpriseQuery(query, tenantId);
    
    // Cache result
    await this.cache.set(cacheKey, result, 3600);
    
    return result;
  }
}`
    };

    return codeExamples[template.id as keyof typeof codeExamples] || `// ${template.name} implementation code example\n// This would contain the actual implementation`;
  };

  const getTemplateConfig = (template: Template) => {
    const configs = {
      1: `# RAG 2.0 Configuration
VECTOR_DB_URL=postgresql://user:pass@localhost:5432/vectordb
EMBEDDING_MODEL=text-embedding-3-large
RERANKER_MODEL=rerank-english-v3.0
CHUNK_SIZE=512
CHUNK_OVERLAP=50
TOP_K_RETRIEVAL=20
SIMILARITY_THRESHOLD=0.75`,

      2: `# MCP Configuration
MCP_SERVER_PORT=3001
MCP_TRANSPORT=http
MCP_AUTH_METHOD=oauth2
MCP_SANDBOX_ENABLED=true
MCP_TOOL_TIMEOUT=30000
MCP_MAX_CONCURRENT_TOOLS=10`,

      3: `# A2A Configuration
A2A_DISCOVERY_PORT=3002
A2A_AGENT_CARD_PATH=/.well-known/agent.json
A2A_AUTH_PROVIDER=oauth2
A2A_TASK_TIMEOUT=3600000
A2A_MAX_AGENTS=100`,

      4: `# DeepSeek Configuration
DEEPSEEK_API_KEY=your-api-key-here
DEEPSEEK_MODEL=deepseek-reasoner
DEEPSEEK_MAX_TOKENS=8192
DEEPSEEK_TEMPERATURE=0.7
DEEPSEEK_STREAM=true`,

      5: `# Complete Blueprint Stack Configuration
# RAG 2.0
VECTOR_DB_URL=postgresql://localhost:5432/vectordb
# MCP
MCP_SERVER_PORT=3001
# A2A  
A2A_DISCOVERY_PORT=3002
# DeepSeek
DEEPSEEK_API_KEY=your-api-key-here
# Integration
BLUEPRINT_STACK_PORT=3000`,

      6: `# Enterprise RAG Configuration
DATABASE_URL=postgresql://localhost:5432/enterprise_rag
REDIS_URL=redis://localhost:6379
KAFKA_BROKERS=localhost:9092
MONITORING_ENABLED=true
AUDIT_LOGGING=true
COMPLIANCE_MODE=gdpr`
    };

    return configs[template.id as keyof typeof configs] || `# ${template.name} Configuration\n# Add your configuration here`;
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${type} copied to clipboard!`);
    } catch (error) {
      toast.error(`Failed to copy ${type}`);
    }
  };

  const handleUseTemplate = () => {
    onUseTemplate(template);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] bg-gray-900 text-white border-blue-400/30">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-4">
            {template.name}
            <Badge className={`${getDifficultyColor(template.difficulty)} text-white`}>
              {template.difficulty}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                {template.rating}
              </div>
              <div className="flex items-center gap-1">
                <Download className="w-4 h-4" />
                {template.downloads.toLocaleString()} downloads
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {template.category}
              </div>
            </div>
            <Button onClick={handleUseTemplate} className="bg-gradient-to-r from-blue-500 via-purple-500 to-red-500">
              <Download className="w-4 h-4 mr-2" />
              Use Template
            </Button>
          </div>

          <p className="text-gray-300">{template.description}</p>

          <div className="flex flex-wrap gap-2">
            {template.technologies.map((tech) => (
              <Badge key={tech} variant="outline" className="text-xs">
                {tech}
              </Badge>
            ))}
          </div>

          <Tabs defaultValue="prompt" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-800">
              <TabsTrigger value="prompt" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Prompt
              </TabsTrigger>
              <TabsTrigger value="code" className="flex items-center gap-2">
                <Code className="w-4 h-4" />
                Code Example
              </TabsTrigger>
              <TabsTrigger value="config" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Configuration
              </TabsTrigger>
            </TabsList>

            <TabsContent value="prompt" className="mt-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Master Prompt</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(getTemplatePrompt(template), 'Prompt')}
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    Copy Prompt
                  </Button>
                </div>
                <ScrollArea className="h-96 w-full rounded border border-gray-700 bg-gray-950">
                  <pre className="p-4 text-sm text-gray-300 whitespace-pre-wrap">
                    {getTemplatePrompt(template)}
                  </pre>
                </ScrollArea>
              </div>
            </TabsContent>

            <TabsContent value="code" className="mt-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Implementation Example</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(getTemplateCode(template), 'Code')}
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    Copy Code
                  </Button>
                </div>
                <ScrollArea className="h-96 w-full rounded border border-gray-700 bg-gray-950">
                  <pre className="p-4 text-sm text-gray-300">
                    <code>{getTemplateCode(template)}</code>
                  </pre>
                </ScrollArea>
              </div>
            </TabsContent>

            <TabsContent value="config" className="mt-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Configuration Template</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(getTemplateConfig(template), 'Configuration')}
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    Copy Config
                  </Button>
                </div>
                <ScrollArea className="h-96 w-full rounded border border-gray-700 bg-gray-950">
                  <pre className="p-4 text-sm text-gray-300">
                    {getTemplateConfig(template)}
                  </pre>
                </ScrollArea>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateModal;
