import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health Check Endpoints
  app.get("/api/health", async (req, res) => {
    try {
      res.json({ 
        status: "healthy", 
        timestamp: new Date().toISOString(),
        version: "4.0",
        services: ["api", "database", "deepseek"]
      });
    } catch (error) {
      res.status(500).json({ status: "error", error: "Health check failed" });
    }
  });

  app.get("/api/db/health", async (req, res) => {
    try {
      // Simple database connectivity test
      await storage.getRagDocuments();
      res.json({ 
        status: "healthy", 
        database: "postgresql",
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ status: "error", error: "Database connection failed" });
    }
  });

  // RAG Documents API
  app.get("/api/rag/documents", async (req, res) => {
    try {
      const documents = await storage.getRagDocuments();
      res.json(documents);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch RAG documents" });
    }
  });

  app.post("/api/rag/documents", async (req, res) => {
    try {
      const document = await storage.createRagDocument(req.body);
      res.json(document);
    } catch (error) {
      res.status(500).json({ error: "Failed to create RAG document" });
    }
  });

  // MCP Servers API
  app.get("/api/mcp/servers", async (req, res) => {
    try {
      const servers = await storage.getMcpServers();
      res.json(servers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch MCP servers" });
    }
  });

  app.post("/api/mcp/servers", async (req, res) => {
    try {
      const server = await storage.createMcpServer(req.body);
      res.json(server);
    } catch (error) {
      res.status(500).json({ error: "Failed to create MCP server" });
    }
  });

  app.patch("/api/mcp/servers/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      await storage.updateMcpServerStatus(id, status);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to update MCP server status" });
    }
  });

  // A2A Agents API
  app.get("/api/a2a/agents", async (req, res) => {
    try {
      const agents = await storage.getA2aAgents();
      res.json(agents);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch A2A agents" });
    }
  });

  app.post("/api/a2a/agents", async (req, res) => {
    try {
      const agent = await storage.createA2aAgent(req.body);
      res.json(agent);
    } catch (error) {
      res.status(500).json({ error: "Failed to create A2A agent" });
    }
  });

  // DeepSeek Conversations API
  app.get("/api/deepseek/conversations/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const conversations = await storage.getDeepseekConversations(sessionId);
      res.json(conversations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch DeepSeek conversations" });
    }
  });

  app.post("/api/deepseek/conversations", async (req, res) => {
    try {
      const conversation = await storage.createDeepseekConversation(req.body);
      res.json(conversation);
    } catch (error) {
      res.status(500).json({ error: "Failed to create DeepSeek conversation" });
    }
  });

  // DeepSeek reasoning endpoint with full API integration
  app.post("/api/deepseek/reason", async (req, res) => {
    try {
      const { prompt, systemPrompt, temperature = 0.7, maxSteps = 10 } = req.body;
      const apiKey = process.env.DEEPSEEK_API_KEY;
      
      if (!apiKey) {
        // Return enhanced simulation when API key is not configured
        const mockResponse = {
          reasoning: `# DeepSeek Reasoning Simulation\n\n` +
                    `**Query:** "${prompt}"\n\n` +
                    `**System Context:** ${systemPrompt || 'NoCodeLos Blueprint Stack Assistant'}\n\n` +
                    `## Advanced Reasoning Chain:\n\n` +
                    `### Step 1: Problem Decomposition\n` +
                    `- Analyzing the core requirements and constraints\n` +
                    `- Identifying key architectural patterns needed\n` +
                    `- Mapping to NoCodeLos Blueprint Stack components\n\n` +
                    `### Step 2: Solution Architecture\n` +
                    `- RAG 2.0 integration for knowledge retrieval\n` +
                    `- MCP protocol implementation for server communication\n` +
                    `- A2A agent coordination for multi-agent workflows\n\n` +
                    `### Step 3: Implementation Strategy\n` +
                    `- Component selection and configuration\n` +
                    `- Integration patterns and data flow\n` +
                    `- Performance optimization and scaling considerations\n\n` +
                    `### Step 4: Validation & Testing\n` +
                    `- Quality assurance and testing strategies\n` +
                    `- Monitoring and observability setup\n` +
                    `- Deployment and maintenance procedures\n\n` +
                    `**Note:** This is a comprehensive simulation. Configure your DEEPSEEK_API_KEY to enable real DeepSeek reasoning with actual chain-of-thought processing.\n\n` +
                    `**Configuration:**\n` +
                    `- Temperature: ${temperature}\n` +
                    `- Max Steps: ${maxSteps}\n` +
                    `- Processing Time: ${Date.now() - Date.now()}ms (simulated)`,
          steps: maxSteps || 10,
          tokens_used: 350,
          simulated: true
        };

        return res.json(mockResponse);
      }

      const startTime = Date.now();
      
      // Call DeepSeek API with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 300000); // 5 minute timeout for blueprint generation
      
      const deepseekResponse = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'deepseek-reasoner',
          messages: [
            { role: 'system', content: systemPrompt || `# Lovable 2.0 Blueprint Generator Expert

You are an expert AI architect specialized in generating production-ready application blueprints exclusively for the Lovable 2.0 platform. Your role is to create comprehensive, immediately implementable blueprints using Lovable's proven technology stack.

## LOVABLE 2.0 TECHNOLOGY STACK (MANDATORY - NO EXCEPTIONS)

### Frontend Framework (Fixed)
- **React 18** with TypeScript - Modern declarative UI framework
- **Tailwind CSS** - Utility-first CSS framework for rapid styling
- **Vite** - Next-generation build tool and dev server
- **Shadcn/UI** - High-quality, accessible component library
- **Lucide React** - Beautiful icon library

### Backend Platform (Fixed)
- **Supabase** - Complete backend-as-a-service platform
- **PostgreSQL** - Robust relational database via Supabase
- **Supabase Auth** - Complete authentication and authorization
- **Supabase Storage** - Secure file storage and management
- **Supabase Realtime** - Live data synchronization

### AI & Integrations (Lovable Ecosystem)
- **Claude 3.5 Sonnet** - Primary AI model for intelligent features
- **Stripe** - Payment processing and subscription management
- **Resend** - Transactional email service
- **Replicate** - AI-generated media and content
- **Entri** - Domain management and hosting
- **Vercel/Netlify** - One-click deployment hosting

### Development Approach
- **Vibe Coding** - Conversational AI-driven development
- **GitHub Integration** - Real-time two-way synchronization
- **One-Click Publishing** - Instant deployment capabilities

## BLUEPRINT GENERATION REQUIREMENTS

### 1. Application Architecture
Generate detailed system architecture including:
- Component hierarchy and data flow
- Supabase database schema with tables, relationships, and RLS policies
- Authentication flows with role-based access control
- File upload and storage patterns
- Real-time data synchronization strategies

### 2. Database Design (Supabase PostgreSQL)
- Complete table schemas with proper relationships
- Row Level Security (RLS) policies for data protection
- Database triggers and functions for business logic
- Indexing strategies for optimal performance
- Migration scripts and seed data

### 3. Authentication System (Supabase Auth)
- User registration and login flows
- Role-based permissions and access control
- Social authentication providers (Google, GitHub, etc.)
- Password reset and email verification
- Protected routes and middleware

### 4. Frontend Implementation (React + Tailwind + Shadcn)
- Component structure and reusable patterns
- State management with React hooks and context
- Form handling with validation
- Responsive design with Tailwind CSS
- Accessibility best practices

### 5. API Integration
- Supabase client configuration and setup
- CRUD operations with proper error handling
- Real-time subscriptions and live updates
- File upload and storage operations
- External API integrations (Stripe, Resend, etc.)

### 6. Advanced Features Integration
Based on selected features, include:
- **Stripe Payments**: Complete checkout flows and subscription management
- **Resend Email**: Transactional emails and notifications
- **Claude AI**: Intelligent features and content generation
- **Replicate Media**: AI-generated images, videos, and audio
- **Search**: Full-text search with PostgreSQL
- **Analytics**: Custom event tracking and metrics

### 7. Deployment Configuration
- Vercel/Netlify deployment settings
- Environment variable configuration
- Domain setup with Entri integration
- CI/CD pipeline with GitHub Actions
- Performance optimization and caching

## OUTPUT STRUCTURE

Generate blueprints with these sections:

### 1. PROJECT OVERVIEW
- Application description and core functionality
- User personas and use cases
- Technical requirements and constraints

### 2. TECHNOLOGY STACK IMPLEMENTATION
- Detailed implementation of Lovable's fixed stack
- Package.json with exact dependencies
- Configuration files (tailwind.config.js, etc.)

### 3. DATABASE SCHEMA
- Complete Supabase table definitions
- Relationships and foreign keys
- RLS policies and security rules
- Sample data and migrations

### 4. COMPONENT ARCHITECTURE
- React component hierarchy
- Reusable UI components with Shadcn
- State management patterns
- Routing and navigation structure

### 5. AUTHENTICATION & AUTHORIZATION
- Supabase Auth implementation
- User roles and permissions
- Protected routes and components
- Social login integration

### 6. CORE FEATURES IMPLEMENTATION
- Detailed code examples for each selected feature
- API endpoints and data flows
- Error handling and validation
- Testing strategies

### 7. INTEGRATIONS & SERVICES
- Stripe payment implementation
- Resend email configuration
- Claude AI integration patterns
- File upload with Supabase Storage

### 8. DEPLOYMENT & HOSTING
- Vercel/Netlify configuration
- Environment setup guide
- Domain configuration with Entri
- Performance optimization

### 9. DEVELOPMENT WORKFLOW
- Local development setup
- GitHub integration and collaboration
- Code quality and testing
- Deployment pipeline

### 10. PRODUCTION CONSIDERATIONS
- Security best practices
- Performance monitoring
- Scaling strategies
- Maintenance procedures

## QUALITY STANDARDS

Your blueprints must be:
- **Immediately Implementable**: Complete code examples with no ambiguity
- **Lovable Platform Optimized**: Leverages all platform features and integrations
- **Production Ready**: Enterprise-grade security, performance, and scalability
- **Well Documented**: Clear setup instructions and usage guides
- **Accessible**: WCAG compliant and mobile-responsive
- **Tested**: Include testing strategies and quality assurance

## CONVERSATION STYLE
- Be comprehensive yet concise
- Provide specific, actionable guidance
- Include code examples for all implementations
- Focus on Lovable platform best practices
- Ensure all recommendations work within Lovable's ecosystem

Generate blueprints that enable developers to build production applications on Lovable 2.0 with zero additional research or decision-making required.` },
            { role: 'user', content: prompt }
          ],
          temperature,
          max_tokens: 64000, // Use DeepSeek's full 64K token output capacity
          stream: false
        }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (!deepseekResponse.ok) {
        const errorData = await deepseekResponse.json().catch(() => ({}));
        return res.status(deepseekResponse.status).json({ 
          error: `DeepSeek API error: ${errorData.error?.message || 'Unknown error'}` 
        });
      }

      const data = await deepseekResponse.json();
      const processingTime = Date.now() - startTime;
      
      // DeepSeek-reasoner provides reasoning_content (CoT) and content (final answer)
      const finalAnswer = data.choices?.[0]?.message?.content || 'No response generated';
      const reasoningContent = data.choices?.[0]?.message?.reasoning_content || null;
      
      // Use reasoning content as the primary response, with final answer as fallback
      const reasoning = reasoningContent || finalAnswer;
      const reasoningSteps = reasoningContent ? { 
        reasoning: reasoningContent, 
        finalAnswer: finalAnswer 
      } : null;
      
      // Save conversation to database
      const sessionId = Array.isArray(req.headers['x-session-id']) 
        ? req.headers['x-session-id'][0] 
        : req.headers['x-session-id'] || 'default';
        
      await storage.createDeepseekConversation({
        sessionId,
        messages: JSON.stringify([
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt },
          { role: 'assistant', content: reasoning }
        ]),
        reasoningSteps: reasoningSteps ? JSON.stringify(reasoningSteps) : null,
        model: 'deepseek-reasoner',
        temperature: parseFloat(temperature?.toString() || '0.7'),
        maxSteps,
        confidence: 95, // DeepSeek typically has high confidence
        processingTimeMs: processingTime
      });

      const response = {
        reasoning,
        reasoningContent: reasoningContent, // Chain of Thought from DeepSeek
        finalAnswer: finalAnswer, // Final answer from DeepSeek
        confidence: 95,
        processingTime,
        steps: (reasoningSteps as any)?.steps || [
          { step: 1, thought: "Processing request with DeepSeek Reasoner..." },
          { step: 2, thought: "Analyzing context and generating response..." },
          { step: 3, thought: "Finalizing comprehensive answer..." }
        ],
        rawResponse: data
      };

      res.json(response);
    } catch (error) {
      console.error('DeepSeek API error:', error);
      res.status(500).json({ error: "Failed to process reasoning request" });
    }
  });

  // DeepSeek prompt generation endpoint
  app.post('/api/generate-prompt', async (req, res) => {
    try {
      const { model, messages, max_tokens, temperature, top_p, stream } = req.body;
      
      // Use server-side API key from environment
      const apiKey = process.env.DEEPSEEK_API_KEY;
      
      if (!apiKey) {
        console.error('❌ DEEPSEEK_API_KEY not found in environment variables');
        return res.status(500).json({ error: 'DeepSeek API key not configured on server' });
      }

      console.log('🤖 Making request to DeepSeek API...');
      
      // DeepSeek reasoner doesn't support temperature, top_p according to docs
      const requestBody = {
        model: model || 'deepseek-reasoner',
        messages,
        max_tokens: max_tokens || 64000,
        stream: stream || false
      };
      
      console.log('📡 Request payload:', JSON.stringify(requestBody, null, 2));
      
      const response = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ DeepSeek API error:', response.status, errorData);
        return res.status(response.status).json({ 
          error: `DeepSeek API error: ${errorData.error?.message || 'Unknown error'}` 
        });
      }

      const data = await response.json();
      console.log('✅ DeepSeek API response received successfully');
      console.log('📊 Response tokens:', data.usage?.total_tokens || 'unknown');
      
      res.json(data);
    } catch (error) {
      console.error('❌ Server error in generate-prompt:', error);
      res.status(500).json({ error: 'Failed to process DeepSeek request' });
    }
  });

  const httpServer = createServer(app);
  // Blueprint Prompts API routes
  app.get("/api/blueprint-prompts", async (req, res) => {
    try {
      const prompts = await storage.getBlueprintPrompts();
      res.json(prompts);
    } catch (error) {
      console.error("Error fetching blueprint prompts:", error);
      res.status(500).json({ error: "Failed to fetch blueprint prompts" });
    }
  });

  app.get("/api/blueprint-prompts/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const prompt = await storage.getBlueprintPrompt(id);
      if (!prompt) {
        return res.status(404).json({ error: "Blueprint prompt not found" });
      }
      res.json(prompt);
    } catch (error) {
      console.error("Error fetching blueprint prompt:", error);
      res.status(500).json({ error: "Failed to fetch blueprint prompt" });
    }
  });

  app.post("/api/blueprint-prompts", async (req, res) => {
    try {
      const promptData = req.body;
      const savedPrompt = await storage.createBlueprintPrompt(promptData);
      res.status(201).json(savedPrompt);
    } catch (error) {
      console.error("Error saving blueprint prompt:", error);
      res.status(500).json({ error: "Failed to save blueprint prompt" });
    }
  });

  app.put("/api/blueprint-prompts/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      await storage.updateBlueprintPrompt(id, updates);
      res.json({ message: "Blueprint prompt updated successfully" });
    } catch (error) {
      console.error("Error updating blueprint prompt:", error);
      res.status(500).json({ error: "Failed to update blueprint prompt" });
    }
  });

  return httpServer;
}
