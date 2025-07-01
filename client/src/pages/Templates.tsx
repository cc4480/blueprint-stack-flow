
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Download, Star, Eye, Clock, Copy, ExternalLink, Code, Database, Zap } from 'lucide-react';

const Templates = () => {
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const templateContents = {
    1: {
      code: `// RAG 2.0 Knowledge Base Implementation
import { createClient } from '@supabase/supabase-js';
import { OpenAI } from 'openai';

// Initialize Supabase and OpenAI
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Vector search with hybrid retrieval
export const hybridSearch = async (query: string, limit = 10) => {
  // Semantic search using embeddings
  const embedding = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: query,
  });

  const { data: semanticResults } = await supabase.rpc('match_documents', {
    query_embedding: embedding.data[0].embedding,
    match_threshold: 0.78,
    match_count: limit,
  });

  // Full-text search
  const { data: keywordResults } = await supabase
    .from('documents')
    .select('*')
    .textSearch('content', query)
    .limit(limit);

  // Re-ranking and fusion
  return fuseResults(semanticResults, keywordResults);
};`,
      readme: `# RAG 2.0 Knowledge Base

Advanced retrieval-augmented generation system with hybrid search capabilities.

## Features
- Vector embeddings with OpenAI
- Hybrid search (semantic + keyword)
- Re-ranking algorithms
- Supabase integration
- Real-time indexing

## Setup
1. Configure environment variables
2. Run database migrations
3. Upload your documents
4. Start querying!`,
      schema: `-- Documents table with vector support
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB,
  embedding VECTOR(1536),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable vector search
CREATE INDEX ON documents USING ivfflat (embedding vector_cosine_ops);`
    },
    2: {
      code: `// MCP Tool Orchestrator
import { MCPClient } from '@modelcontextprotocol/client';
import { StdioServerParameters } from '@modelcontextprotocol/client/stdio';

export class MCPOrchestrator {
  private clients: Map<string, MCPClient> = new Map();

  async registerTool(name: string, config: StdioServerParameters) {
    const client = new MCPClient(config);
    await client.connect();
    this.clients.set(name, client);
    
    console.log(\`Tool \${name} registered successfully\`);
    return client;
  }

  async executeTool(toolName: string, args: any) {
    const client = this.clients.get(toolName);
    if (!client) throw new Error(\`Tool \${toolName} not found\`);

    return await client.callTool(args);
  }

  async listAvailableTools() {
    const tools = [];
    for (const [name, client] of this.clients) {
      const capabilities = await client.getCapabilities();
      tools.push({ name, capabilities });
    }
    return tools;
  }
}`,
      readme: `# MCP Tool Orchestrator

Model Context Protocol implementation for seamless tool integration.

## Capabilities
- Multiple MCP server management
- Tool discovery and registration
- Protocol version negotiation
- Error handling and recovery

## Usage
\`\`\`typescript
const orchestrator = new MCPOrchestrator();
await orchestrator.registerTool('filesystem', { command: 'mcp-server-filesystem' });
\`\`\``,
      schema: `-- MCP Tools registry
CREATE TABLE mcp_tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  endpoint TEXT,
  capabilities JSONB,
  status TEXT DEFAULT 'inactive',
  created_at TIMESTAMP DEFAULT NOW()
);`
    },
    3: {
      code: `// A2A Agent Network Implementation
import { EventEmitter } from 'events';

export class AgentNetwork extends EventEmitter {
  private agents: Map<string, Agent> = new Map();
  private channels: Map<string, Channel> = new Map();

  async createAgent(config: AgentConfig): Promise<Agent> {
    const agent = new Agent(config);
    this.agents.set(agent.id, agent);
    
    agent.on('message', this.handleAgentMessage.bind(this));
    return agent;
  }

  async createChannel(name: string, participants: string[]): Promise<Channel> {
    const channel = new Channel(name, participants);
    this.channels.set(name, channel);
    return channel;
  }

  private async handleAgentMessage(message: A2AMessage) {
    const { to, from, content, type } = message;
    
    if (to === 'broadcast') {
      this.broadcast(message);
    } else {
      await this.deliverToAgent(to, message);
    }
  }

  async broadcast(message: A2AMessage) {
    for (const agent of this.agents.values()) {
      if (agent.id !== message.from) {
        await agent.receiveMessage(message);
      }
    }
  }
}`,
      readme: `# A2A Agent Network

Multi-agent system with Agent-to-Agent communication protocols.

## Architecture
- Event-driven communication
- Channel-based messaging
- Broadcast capabilities
- Message routing and delivery

## Agent Types
- Coordinator agents
- Worker agents
- Monitor agents
- Gateway agents`,
      schema: `-- A2A Agents and Messages
CREATE TABLE agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  capabilities JSONB,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE agent_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_agent UUID REFERENCES agents(id),
  to_agent UUID REFERENCES agents(id),
  content JSONB,
  message_type TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);`
    },
    4: {
      code: `// DeepSeek Reasoner Integration
import { DeepSeekAPI } from '@deepseek/api';

export class ReasoningEngine {
  private client: DeepSeekAPI;

  constructor(apiKey: string) {
    this.client = new DeepSeekAPI({ apiKey });
  }

  async chainOfThought(prompt: string, steps = 5): Promise<ReasoningResult> {
    const reasoning = [];
    let currentThought = prompt;

    for (let i = 0; i < steps; i++) {
      const response = await this.client.reason({
        input: currentThought,
        model: 'deepseek-reasoner',
        reasoning_steps: true
      });

      reasoning.push({
        step: i + 1,
        thought: response.reasoning,
        conclusion: response.content
      });

      currentThought = response.content;
    }

    return {
      original_prompt: prompt,
      reasoning_chain: reasoning,
      final_answer: reasoning[reasoning.length - 1].conclusion
    };
  }
}`,
      readme: `# DeepSeek Reasoner Integration

Chain-of-thought reasoning implementation with DeepSeek API.

## Features
- Multi-step reasoning
- Thought chain visualization
- Confidence scoring
- Reasoning validation

## Usage
\`\`\`typescript
const reasoner = new ReasoningEngine(process.env.DEEPSEEK_API_KEY);
const result = await reasoner.chainOfThought("Solve this complex problem...");
\`\`\``,
      schema: `-- Reasoning Sessions
CREATE TABLE reasoning_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt TEXT NOT NULL,
  reasoning_steps JSONB,
  final_answer TEXT,
  confidence_score FLOAT,
  created_at TIMESTAMP DEFAULT NOW()
);`
    },
    5: {
      code: `// Full Stack Blueprint Integration
import { RAGSystem } from './rag';
import { MCPOrchestrator } from './mcp';
import { AgentNetwork } from './a2a';
import { ReasoningEngine } from './deepseek';

export class BlueprintStack {
  private rag: RAGSystem;
  private mcp: MCPOrchestrator;
  private agents: AgentNetwork;
  private reasoner: ReasoningEngine;

  constructor(config: StackConfig) {
    this.rag = new RAGSystem(config.rag);
    this.mcp = new MCPOrchestrator();
    this.agents = new AgentNetwork();
    this.reasoner = new ReasoningEngine(config.deepseek.apiKey);
  }

  async processQuery(query: string): Promise<StackResponse> {
    // 1. RAG retrieval
    const context = await this.rag.search(query);
    
    // 2. Agent coordination
    const coordinator = await this.agents.createAgent({
      type: 'coordinator',
      capabilities: ['planning', 'execution']
    });
    
    // 3. MCP tool selection
    const tools = await this.mcp.listAvailableTools();
    
    // 4. DeepSeek reasoning
    const reasoning = await this.reasoner.chainOfThought(
      \`Query: \${query}\\nContext: \${JSON.stringify(context)}\\nTools: \${JSON.stringify(tools)}\`
    );

    return {
      query,
      context,
      reasoning: reasoning.reasoning_chain,
      answer: reasoning.final_answer,
      tools_used: tools
    };
  }
}`,
      readme: `# Full Stack Blueprint

Complete NoCodeLos Blueprint Stack with all protocols integrated.

## Integrated Systems
- RAG 2.0 Knowledge Base
- MCP Tool Orchestrator  
- A2A Agent Network
- DeepSeek Reasoner

## Production Features
- Auto-scaling
- Monitoring
- Error recovery
- Performance optimization`,
      schema: `-- Complete stack schema combining all systems
-- See individual template schemas for details

-- Stack operations log
CREATE TABLE stack_operations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  operation_type TEXT NOT NULL,
  input_data JSONB,
  output_data JSONB,
  processing_time_ms INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);`
    },
    6: {
      code: `// Enterprise RAG Pipeline
import { PineconeClient } from '@pinecone-database/pinecone';
import { OpenAI } from 'openai';

export class EnterpriseRAG {
  private pinecone: PineconeClient;
  private openai: OpenAI;
  private index: any;

  constructor(config: EnterpriseConfig) {
    this.pinecone = new PineconeClient();
    this.openai = new OpenAI({ apiKey: config.openaiKey });
  }

  async initializeIndex(indexName: string) {
    await this.pinecone.init({
      environment: process.env.PINECONE_ENV,
      apiKey: process.env.PINECONE_API_KEY
    });
    
    this.index = this.pinecone.Index(indexName);
  }

  async processDocument(document: Document): Promise<ProcessingResult> {
    // Chunk document with overlap
    const chunks = this.chunkDocument(document, 1000, 200);
    
    // Generate embeddings
    const embeddings = await this.batchEmbeddings(chunks);
    
    // Store with metadata
    await this.index.upsert({
      vectors: embeddings.map((embedding, i) => ({
        id: \`\${document.id}-\${i}\`,
        values: embedding,
        metadata: {
          documentId: document.id,
          chunkIndex: i,
          content: chunks[i],
          timestamp: new Date().toISOString()
        }
      }))
    });

    return { chunksProcessed: chunks.length, documentId: document.id };
  }
}`,
      readme: `# Enterprise RAG Pipeline

Production-ready RAG implementation with enterprise security and scalability.

## Enterprise Features
- Multi-tenant isolation
- RBAC integration
- Audit logging
- Performance monitoring
- Auto-scaling
- Backup & recovery

## Security
- Data encryption at rest
- TLS in transit
- API rate limiting
- Access controls`,
      schema: `-- Enterprise RAG with audit and security
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  security_level TEXT DEFAULT 'internal',
  created_by UUID,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE access_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  document_id UUID,
  action TEXT,
  ip_address INET,
  created_at TIMESTAMP DEFAULT NOW()
);`
    }
  };

  const templates = [
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

  const handlePreview = (template: any) => {
    setSelectedTemplate(template);
    setIsPreviewOpen(true);
  };

  const handleCopyCode = async (templateId: number) => {
    const content = templateContents[templateId as keyof typeof templateContents];
    if (content) {
      await navigator.clipboard.writeText(content.code);
      toast({
        title: "Code Copied!",
        description: "Template code has been copied to your clipboard.",
      });
    }
  };

  const handleDownloadTemplate = (template: any) => {
    const content = templateContents[template.id as keyof typeof templateContents];
    if (content) {
      // Create a zip-like structure in text format
      const fullTemplate = `# ${template.name}

${content.readme}

## Implementation Code

\`\`\`typescript
${content.code}
\`\`\`

## Database Schema

\`\`\`sql
${content.schema}
\`\`\`

## Technologies Used
${template.technologies.map((tech: string) => `- ${tech}`).join('\n')}

## Difficulty Level
${template.difficulty}

## Category
${template.category}
`;

      const blob = new Blob([fullTemplate], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${template.name.toLowerCase().replace(/\s+/g, '-')}-template.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Template Downloaded!",
        description: `${template.name} template has been downloaded as a markdown file.`,
      });
    }
  };

  const handleUseTemplate = (template: any) => {
    // Create a new Repl with this template
    const replitUrl = `https://replit.com/@replit/new?template=${encodeURIComponent(template.name)}`;
    window.open(replitUrl, '_blank');
    
    toast({
      title: "Creating New Repl",
      description: `Opening ${template.name} template in a new Repl...`,
    });
  };

  const renderPreviewModal = () => {
    if (!selectedTemplate) return null;
    
    const content = templateContents[selectedTemplate.id as keyof typeof templateContents];
    
    return (
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-gray-900 border-blue-400/30">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Code className="w-5 h-5 text-blue-400" />
              {selectedTemplate.name} - Template Preview
            </DialogTitle>
            <DialogDescription className="text-gray-300">
              {selectedTemplate.description}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Template Info */}
            <div className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg">
              <Badge className={`${getDifficultyColor(selectedTemplate.difficulty)} text-white`}>
                {selectedTemplate.difficulty}
              </Badge>
              <div className="flex items-center gap-1 text-yellow-400">
                <Star className="w-4 h-4 fill-current" />
                {selectedTemplate.rating}
              </div>
              <div className="flex items-center gap-1 text-gray-400">
                <Download className="w-4 h-4" />
                {selectedTemplate.downloads.toLocaleString()}
              </div>
            </div>

            {/* Technologies */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {selectedTemplate.technologies.map((tech: string) => (
                  <Badge key={tech} variant="outline" className="text-blue-300 border-blue-400/50">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>

            {/* README */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                <Database className="w-5 h-5 text-green-400" />
                README
              </h3>
              <div className="bg-gray-800 rounded-lg p-4">
                <pre className="text-sm text-gray-300 whitespace-pre-wrap">{content?.readme}</pre>
              </div>
            </div>

            {/* Code Preview */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                <Code className="w-5 h-5 text-purple-400" />
                Implementation Code
              </h3>
              <div className="bg-gray-800 rounded-lg p-4 max-h-60 overflow-y-auto">
                <pre className="text-sm text-gray-300 whitespace-pre-wrap">{content?.code}</pre>
              </div>
            </div>

            {/* Database Schema */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                <Database className="w-5 h-5 text-orange-400" />
                Database Schema
              </h3>
              <div className="bg-gray-800 rounded-lg p-4">
                <pre className="text-sm text-gray-300 whitespace-pre-wrap">{content?.schema}</pre>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button 
                onClick={() => handleUseTemplate(selectedTemplate)}
                className="bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 hover:from-blue-600 hover:via-purple-600 hover:to-red-600"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Use Template in New Repl
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleCopyCode(selectedTemplate.id)}
                className="border-blue-400/50 text-blue-300 hover:bg-blue-500/10"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Code
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleDownloadTemplate(selectedTemplate)}
                className="border-green-400/50 text-green-300 hover:bg-green-500/10"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Template
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <Card key={template.id} className="bg-gray-900 border-blue-400/30 hover:border-blue-400/50 transition-all duration-300 group">
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
                    className="flex-1 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 hover:from-blue-600 hover:via-purple-600 hover:to-red-600"
                    onClick={() => handleUseTemplate(template)}
                  >
                    <Zap className="w-3 h-3 mr-1" />
                    Use Template
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handlePreview(template)}
                    className="border-blue-400/50 text-blue-300 hover:bg-blue-500/10"
                  >
                    <Eye className="w-3 h-3" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleCopyCode(template.id)}
                    className="border-green-400/50 text-green-300 hover:bg-green-500/10"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search templates..."
              className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-800">
              All Categories
            </Button>
            <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-800">
              RAG
            </Button>
            <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-800">
              MCP
            </Button>
            <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-800">
              A2A
            </Button>
          </div>
        </div>

        {/* Usage Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gray-900 border-blue-400/30">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">6</div>
              <div className="text-sm text-gray-400">Templates Available</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-900 border-green-400/30">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-400">5,017</div>
              <div className="text-sm text-gray-400">Total Downloads</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-900 border-purple-400/30">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">4.8</div>
              <div className="text-sm text-gray-400">Average Rating</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-900 border-orange-400/30">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-400">100%</div>
              <div className="text-sm text-gray-400">Production Ready</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Preview Modal */}
      {renderPreviewModal()}
    </div>
  );
};

export default Templates;
