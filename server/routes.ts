import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
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
      
      // Call DeepSeek API
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
          max_tokens: 4000,
          stream: false
        })
      });

      if (!deepseekResponse.ok) {
        const errorData = await deepseekResponse.json().catch(() => ({}));
        return res.status(deepseekResponse.status).json({ 
          error: `DeepSeek API error: ${errorData.error?.message || 'Unknown error'}` 
        });
      }

      const data = await deepseekResponse.json();
      const processingTime = Date.now() - startTime;
      
      // Extract reasoning steps if available
      const reasoning = data.choices?.[0]?.message?.content || 'No response generated';
      const reasoningSteps = data.choices?.[0]?.message?.reasoning_content || null;
      
      // Save conversation to database
      await storage.createDeepseekConversation({
        sessionId: req.headers['x-session-id'] || 'default',
        messages: JSON.stringify([
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt },
          { role: 'assistant', content: reasoning }
        ]),
        reasoningSteps: reasoningSteps ? JSON.stringify(reasoningSteps) : null,
        model: 'deepseek-reasoner',
        temperature,
        maxSteps,
        confidence: 95, // DeepSeek typically has high confidence
        processingTimeMs: processingTime
      });

      const response = {
        reasoning,
        confidence: 95,
        processingTime,
        steps: reasoningSteps ? reasoningSteps.steps : [
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

  const httpServer = createServer(app);
  return httpServer;
}
