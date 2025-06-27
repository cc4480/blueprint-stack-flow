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
            { role: 'system', content: systemPrompt || 'You are a helpful AI assistant specialized in the NoCodeLos Blueprint Stack.' },
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
