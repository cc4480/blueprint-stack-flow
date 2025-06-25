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

  // DeepSeek reasoning endpoint (placeholder for API integration)
  app.post("/api/deepseek/reason", async (req, res) => {
    try {
      const { prompt, systemPrompt, temperature = 0.7, maxSteps = 10 } = req.body;
      
      // This would integrate with DeepSeek API when API key is provided
      // For now, return a demo response
      const response = {
        reasoning: "This is a placeholder response. Please configure your DeepSeek API key to enable full reasoning capabilities.",
        confidence: 85,
        processingTime: 1200,
        steps: [
          { step: 1, thought: "Analyzing the user's request..." },
          { step: 2, thought: "Considering various approaches..." },
          { step: 3, thought: "Formulating comprehensive response..." }
        ]
      };

      res.json(response);
    } catch (error) {
      res.status(500).json({ error: "Failed to process reasoning request" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
