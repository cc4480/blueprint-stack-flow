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

  // DeepSeek Streaming Blueprint Generation
  app.post("/api/stream-blueprint", async (req, res) => {
    const { prompt, temperature, systemPrompt } = req.body;

    if (!prompt?.trim()) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const apiKey = process.env.DEEPSEEK_API_KEY;
    
    // Set streaming headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Cache-Control');

    console.log(`🔑 API Key status: ${apiKey ? 'Available' : 'Missing'} (length: ${apiKey?.length || 0})`);

    if (!apiKey) {
      res.write(`data: ${JSON.stringify({
        type: 'error',
        error: 'DeepSeek API key is required. Please configure DEEPSEEK_API_KEY environment variable.'
      })}\n\n`);
      res.end();
      return;
    }

    let controller: AbortController | null = null;
    let timeoutId: NodeJS.Timeout | null = null;

    // Handle client disconnect
    req.on('close', () => {
      console.log('Client disconnected, cleaning up...');
      if (controller && !controller.signal.aborted) {
        controller.abort();
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    });

    try {
      const startTime = Date.now();
      controller = new AbortController();
      
      // Set a longer timeout for streaming responses
      timeoutId = setTimeout(() => {
        if (controller && !controller.signal.aborted) {
          console.log('Request timeout after 5 minutes');
          controller.abort();
        }
      }, 300000); // 5 minute timeout
      
      const deepseekResponse = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { 
              role: 'system', 
              content: systemPrompt || `# Master Blueprint Generator Expert v4.0

You are an elite AI architect specialized in generating comprehensive, production-ready application blueprints exclusively for the Lovable 2.0 platform. Your mission is to create exhaustively detailed master blueprints that serve as complete technical specifications.

## CRITICAL OUTPUT REQUIREMENT:
Generate blueprints that are MINIMUM 25,000 characters (approximately 5,000+ words). This is not a suggestion - it's a hard requirement. The blueprint must be comprehensive enough to build a complete, production-ready application.

## FIXED TECHNOLOGY STACK (NO EXCEPTIONS):
- Frontend: React 18 + TypeScript + Tailwind CSS + Vite + Shadcn/UI
- Backend: Supabase (PostgreSQL + Auth + Storage + Realtime + Edge Functions)
- Integrations: Claude 3.5 Sonnet + Stripe + Resend + Replicate
- Deployment: Vercel/Netlify with Entri domains + GitHub integration

## MASTER BLUEPRINT STRUCTURE (COMPREHENSIVE COVERAGE):

### 1. Executive Summary & Vision (2,000+ characters)
- Comprehensive application overview with detailed value proposition
- Target market analysis and user personas with specific demographics
- Business model and monetization strategies
- Competitive landscape and differentiation factors
- Success metrics and key performance indicators
- Long-term vision and scalability roadmap

### 2. Complete User Experience Design (3,000+ characters)
- Exhaustive description of every screen, page, and user interface
- Detailed navigation flows and user journey mapping
- Interactive elements, forms, modals, and user input mechanisms
- Responsive design behavior across desktop, tablet, and mobile
- Accessibility features and inclusive design considerations
- User onboarding experience and feature discovery
- Error states, loading states, and edge case handling
- Animation and micro-interaction specifications

### 3. Comprehensive Database Architecture (3,000+ characters)
- Complete Supabase database schema with all tables and relationships
- Detailed field specifications, data types, and constraints
- Foreign key relationships and referential integrity rules
- Data validation rules and business logic constraints
- Indexing strategies for performance optimization
- Real-time subscription configurations
- Row Level Security (RLS) policies for each table
- Data backup and recovery procedures
- Migration strategies and version control

### 4. Authentication & Security Framework (2,500+ characters)
- Complete user registration and login workflows using Supabase Auth
- Multi-factor authentication implementation
- Social login integrations (Google, GitHub, etc.)
- Permission levels, roles, and access control systems
- Profile management and user settings functionality
- Password reset and account recovery processes
- Security measures and data protection protocols
- GDPR compliance and privacy considerations
- Session management and token handling

### 5. Core Features & Business Logic (4,000+ characters)
- Exhaustive explanation of every major feature and sub-feature
- Detailed user workflows for each feature with step-by-step processes
- Data processing and business rule implementation
- Integration between different app components and modules
- Feature flags and progressive feature rollout
- User permission checks and authorization flows
- Data validation and error handling for each feature
- Performance considerations and optimization strategies

### 6. Real-time Features & Live Updates (2,000+ characters)
- Real-time data synchronization using Supabase Realtime
- Live notifications and push notification systems
- Collaborative features and multi-user interactions
- Conflict resolution for concurrent data modifications
- Performance optimization for real-time data streams
- Offline functionality and data synchronization
- WebSocket connection management and fallback strategies

### 7. Component Architecture & Technical Structure (3,000+ characters)
- Detailed component hierarchy and organization using React 18
- Reusable component patterns with Shadcn/UI specifications
- State management architecture and data flow patterns
- Context providers and global state management
- Custom hooks and utility functions
- Tailwind CSS design system and component styling
- TypeScript interfaces and type definitions
- Code organization and file structure standards

### 8. External Integrations & Third-Party Services (2,500+ characters)
- Comprehensive Stripe payment processing workflows
- Subscription management and billing automation
- Email functionality using Resend with template systems
- AI features using Claude 3.5 Sonnet with prompt engineering
- Image/media processing with Replicate AI models
- Analytics integration and user behavior tracking
- Error monitoring and performance tracking
- Third-party API integrations and webhook handling

### 9. Deployment & DevOps Strategy (2,000+ characters)
- Complete deployment pipeline using Vercel/Netlify
- Environment configuration and secrets management
- CI/CD workflows with GitHub Actions
- Domain management with Entri integration
- SSL certificate management and security headers
- Performance monitoring and error tracking setup
- Backup strategies and disaster recovery plans
- Scaling considerations and performance optimization

### 10. Testing & Quality Assurance (2,000+ characters)
- Comprehensive testing strategy including unit, integration, and E2E tests
- Test data management and mock data strategies
- User acceptance testing procedures
- Performance testing and load testing protocols
- Security testing and vulnerability assessments
- Quality gates and code review processes
- Bug tracking and issue management workflows

## WRITING REQUIREMENTS:
- Write in natural language with NO code examples
- Explain every feature in exhaustive detail
- Include comprehensive user workflow descriptions
- Provide complete database design explanations
- Describe all user interactions and system responses
- Explain how different components integrate and communicate
- Use markdown formatting with clear headings and structure
- MUST exceed 25,000 characters - aim for 30,000+ characters
- Include specific implementation details for Lovable AI to understand
- Only use the fixed Lovable technology stack mentioned above

Remember: This blueprint will be used by Lovable's AI to build a complete, production-ready application. Every detail matters for successful implementation.`
            },
            { role: 'user', content: prompt }
          ],
          temperature: parseFloat(temperature?.toString() || '0.7'),
          max_tokens: 32768,
          stream: true
        }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (!deepseekResponse.ok) {
        const errorText = await deepseekResponse.text();
        console.error('DeepSeek API error:', deepseekResponse.status, errorText);
        res.write(`data: ${JSON.stringify({
          type: 'error',
          error: `API request failed: ${deepseekResponse.status} - ${errorText}`
        })}\n\n`);
        res.end();
        return;
      }

      let fullContent = '';
      const reader = deepseekResponse.body?.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      if (!reader) {
        res.write(`data: ${JSON.stringify({
          type: 'error',
          error: 'Unable to read stream'
        })}\n\n`);
        res.end();
        return;
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split('\n\n');
        
        for (let i = 0; i < parts.length - 1; i++) {
          const part = parts[i].trim();
          if (part.startsWith('data:')) {
            const jsonStr = part.slice(5).trim();
            if (jsonStr === '[DONE]') {
              const processingTime = Date.now() - startTime;
              
              res.write(`data: ${JSON.stringify({
                type: 'complete',
                content: fullContent,
                processingTime,
                tokens: fullContent.length
              })}\n\n`);
              
              res.end();
              return;
            }
            
            try {
              const parsed = JSON.parse(jsonStr);
              const delta = parsed.choices?.[0]?.delta;
              
              if (delta?.content) {
                fullContent += delta.content;
                
                res.write(`data: ${JSON.stringify({
                  type: 'token',
                  content: delta.content,
                  fullContent: fullContent
                })}\n\n`);
              }
            } catch (parseError) {
              console.warn('Failed to parse DeepSeek streaming data:', parseError, 'Raw data:', jsonStr);
              // Skip invalid JSON but continue processing
            }
          }
        }
        
        buffer = parts[parts.length - 1];
      }
    } catch (error) {
      console.error('Streaming error:', error);
      
      let errorMessage = 'Streaming failed';
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = 'Request was cancelled by client';
          console.log('Stream cancelled by client disconnect');
        } else {
          errorMessage = error.message;
        }
      }
      
      // Check if response is still writable before writing
      if (!res.headersSent && res.writable) {
        res.write(`data: ${JSON.stringify({
          type: 'error',
          error: errorMessage
        })}\n\n`);
        res.end();
      }
    } finally {
      // Clean up resources
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    }
  });

  // DeepSeek reasoning endpoint with full API integration
  app.post("/api/deepseek/reason", async (req, res) => {
    try {
      const { prompt, systemPrompt, temperature = 0.7, maxSteps = 10 } = req.body;
      const apiKey = process.env.DEEPSEEK_API_KEY;
      
      if (!apiKey) {
        return res.status(400).json({
          error: 'DeepSeek API key is required. Please configure DEEPSEEK_API_KEY environment variable.'
        });
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
          model: 'deepseek-chat',
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
          stream: true
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

      // Set up Server-Sent Events for streaming
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Headers', 'Cache-Control');

      let fullContent = '';
      let reasoningContent = '';
      const reader = deepseekResponse.body?.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      if (!reader) {
        return res.status(500).json({ error: 'Unable to read stream from DeepSeek API' });
      }

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const parts = buffer.split('\n\n');
          
          for (let i = 0; i < parts.length - 1; i++) {
            const part = parts[i].trim();
            if (part.startsWith('data:')) {
              const jsonStr = part.slice(5).trim();
              if (jsonStr === '[DONE]') {
                const processingTime = Date.now() - startTime;
                
                // Send final response with complete data
                res.write(`data: ${JSON.stringify({
                  type: 'complete',
                  content: fullContent,
                  reasoning: reasoningContent,
                  processingTime,
                  tokens: fullContent.length
                })}\n\n`);
                
                res.end();
                return;
              }
              
              try {
                const parsed = JSON.parse(jsonStr);
                const delta = parsed.choices?.[0]?.delta;
                
                if (delta?.content) {
                  fullContent += delta.content;
                  
                  // Send streaming token
                  res.write(`data: ${JSON.stringify({
                    type: 'token',
                    content: delta.content,
                    fullContent: fullContent
                  })}\n\n`);
                }
                
                if (delta?.reasoning_content) {
                  reasoningContent += delta.reasoning_content;
                  
                  // Send reasoning update
                  res.write(`data: ${JSON.stringify({
                    type: 'reasoning',
                    content: delta.reasoning_content,
                    fullReasoning: reasoningContent
                  })}\n\n`);
                }
              } catch (parseError) {
                console.warn('JSON parse error:', parseError);
              }
            }
          }
          
          buffer = parts[parts.length - 1];
        }
      } catch (streamError) {
        console.error('Streaming error:', streamError);
        res.write(`data: ${JSON.stringify({
          type: 'error',
          error: 'Streaming failed'
        })}\n\n`);
        res.end();
      }

      // This code should not be reached in streaming mode
      console.error('Reached non-streaming code path, this should not happen');
      res.status(500).json({ error: 'Internal streaming error' });
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
