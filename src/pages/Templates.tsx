
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Star, Eye, Clock, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import TemplateModal from '@/components/templates/TemplateModal';

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

const Templates = () => {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');

  const templates: Template[] = [
    {
      id: 1,
      name: 'RAG 2.0 Knowledge Base',
      description: 'Complete implementation of advanced retrieval-augmented generation with hybrid search and re-ranking',
      category: 'RAG',
      difficulty: 'Intermediate',
      downloads: 1234,
      rating: 4.8,
      technologies: ['RAG 2.0', 'Vector DB', 'Hybrid Search', 'Re-ranking'],
      preview: '/templates/rag-preview.png'
    },
    {
      id: 2,
      name: 'MCP Tool Orchestrator',
      description: 'Model Context Protocol implementation for seamless tool integration and management',
      category: 'MCP',
      difficulty: 'Advanced',
      downloads: 892,
      rating: 4.9,
      technologies: ['MCP', 'Tool Integration', 'Protocol Management'],
      preview: '/templates/mcp-preview.png'
    },
    {
      id: 3,
      name: 'A2A Agent Network',
      description: 'Multi-agent system with Agent-to-Agent communication protocols',
      category: 'A2A',
      difficulty: 'Expert',
      downloads: 567,
      rating: 4.7,
      technologies: ['A2A Protocol', 'Multi-Agent', 'Communication'],
      preview: '/templates/a2a-preview.png'
    },
    {
      id: 4,
      name: 'DeepSeek Reasoner Integration',
      description: 'Chain-of-thought reasoning implementation with DeepSeek API',
      category: 'AI Reasoning',
      difficulty: 'Beginner',
      downloads: 2156,
      rating: 4.9,
      technologies: ['DeepSeek', 'Chain of Thought', 'Reasoning'],
      preview: '/templates/deepseek-preview.png'
    },
    {
      id: 5,
      name: 'Full Stack Blueprint',
      description: 'Complete NoCodeLos Blueprint Stack with all protocols integrated',
      category: 'Complete',
      difficulty: 'Expert',
      downloads: 445,
      rating: 5.0,
      technologies: ['RAG 2.0', 'MCP', 'A2A', 'DeepSeek', 'Full Integration'],
      preview: '/templates/blueprint-preview.png'
    },
    {
      id: 6,
      name: 'Enterprise RAG Pipeline',
      description: 'Production-ready RAG implementation with enterprise security and scalability',
      category: 'RAG',
      difficulty: 'Advanced',
      downloads: 723,
      rating: 4.6,
      technologies: ['Enterprise RAG', 'Security', 'Scalability', 'Production'],
      preview: '/templates/enterprise-preview.png'
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-500';
      case 'Intermediate': return 'bg-blue-500';
      case 'Advanced': return 'bg-orange-500';
      case 'Expert': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.technologies.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = categoryFilter === 'all' || template.category === categoryFilter;
    const matchesDifficulty = difficultyFilter === 'all' || template.difficulty === difficultyFilter;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const handleViewTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setIsModalOpen(true);
  };

  const handleUseTemplate = (template: Template) => {
    console.log('🚀 Using template:', template.name);
    toast.success(`Template "${template.name}" ready to use in Prompt Studio!`);
    
    // Navigate to prompt studio with template data
    navigate('/prompt-studio', { 
      state: { 
        templatePrompt: getTemplatePrompt(template),
        templateName: template.name 
      } 
    });
  };

  const getTemplatePrompt = (template: Template) => {
    // This function is duplicated from TemplateModal for navigation
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

  const categories = ['all', 'RAG', 'MCP', 'A2A', 'AI Reasoning', 'Complete'];
  const difficulties = ['all', 'Beginner', 'Intermediate', 'Advanced', 'Expert'];

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold gradient-logo-text mb-4">
            Blueprint Stack Templates
          </h1>
          <p className="text-purple-300 text-lg">
            Pre-built implementations for rapid development with RAG 2.0, MCP, and A2A protocols
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-48 bg-gray-800 border-gray-700">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
            <SelectTrigger className="w-48 bg-gray-800 border-gray-700">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              {difficulties.map(difficulty => (
                <SelectItem key={difficulty} value={difficulty}>
                  {difficulty === 'all' ? 'All Levels' : difficulty}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="bg-gray-900 border-blue-400/30 hover:border-blue-400/50 transition-all duration-300 group cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg mb-2">{template.name}</CardTitle>
                    <Badge className={`${getDifficultyColor(template.difficulty)} text-white`}>
                      {template.difficulty}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-yellow-400">
                    <Star className="w-3 h-3 fill-current" />
                    {template.rating}
                  </div>
                </div>
                <p className="text-gray-400 text-sm mt-2">{template.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400 mb-2">Technologies</p>
                  <div className="flex flex-wrap gap-1">
                    {template.technologies.slice(0, 3).map((tech) => (
                      <Badge key={tech} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                    {template.technologies.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{template.technologies.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Download className="w-3 h-3" />
                    {template.downloads.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {template.category}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button 
                    size="sm" 
                    className="flex-1 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500"
                    onClick={() => handleUseTemplate(template)}
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Use Template
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleViewTemplate(template)}
                  >
                    <Eye className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No templates found matching your criteria.</p>
            <Button 
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('all');
                setDifficultyFilter('all');
              }}
              variant="outline"
              className="mt-4"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      <TemplateModal
        template={selectedTemplate}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUseTemplate={handleUseTemplate}
      />
    </div>
  );
};

export default Templates;
