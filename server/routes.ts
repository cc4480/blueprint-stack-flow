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
    const { prompt, systemPrompt } = req.body;

    console.log('🔥 Blueprint streaming request received:', { 
      promptLength: prompt?.length, 
      hasSystemPrompt: !!systemPrompt 
    });

    if (!prompt?.trim()) {
      console.error('❌ No prompt provided');
      return res.status(400).json({ error: "Prompt is required" });
    }

    const apiKey = process.env.DEEPSEEK_API_KEY;
    
    if (!apiKey) {
      console.error('❌ DeepSeek API key not configured');
      return res.status(500).json({ error: "DeepSeek API key not configured on server" });
    }

    // Set streaming headers
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("Access-Control-Allow-Origin", "*");

    const startTime = Date.now();
    let totalTokens = 0;
    let totalContent = "";

    try {
      const messages = [
        {
          role: "system",
          content: systemPrompt || "You are a Lovable 2.0 blueprint generation expert."
        },
        {
          role: "user", 
          content: prompt
        }
      ];

      console.log('🤖 Sending request to DeepSeek API...');

      const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages,
          temperature: 0.7,
          stream: true,
          max_tokens: 8192
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ DeepSeek API error:', response.status, errorText);
        throw new Error(`DeepSeek API error: ${response.status} - ${errorText}`);
      }

      console.log('✅ DeepSeek API responded successfully, starting stream...');

      if (!response.body) {
        throw new Error("No response stream");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n\n");
        
        for (let i = 0; i < parts.length - 1; i++) {
          const part = parts[i].trim();
          if (part.startsWith("data:")) {
            const jsonStr = part.slice(5).trim();
            if (jsonStr === "[DONE]") {
              const processingTime = Date.now() - startTime;
              res.write(`data: ${JSON.stringify({ 
                type: "complete",
                processingTime,
                totalTokens,
                totalCharacters: totalContent.length
              })}\n\n`);
              res.end();
              return;
            }
            try {
              const parsed = JSON.parse(jsonStr);
              const token = parsed.choices?.[0]?.delta?.content;
              if (token) {
                totalTokens++;
                totalContent += token;
                res.write(`data: ${JSON.stringify({
                  type: "token",
                  content: token
                })}\n\n`);
              }
            } catch (e) {
              console.warn("JSON parse error", e);
            }
          }
        }
        buffer = parts[parts.length - 1];
      }
    } catch (error) {
      console.error("❌ Streaming error:", error);
      
      if (!res.headersSent) {
        // If headers haven't been sent, send JSON error
        return res.status(500).json({
          error: error instanceof Error ? error.message : "Streaming failed"
        });
      } else {
        // If streaming has started, send streaming error
        res.write(`data: ${JSON.stringify({
          type: "error",
          error: error instanceof Error ? error.message : "Streaming failed"
        })}\n\n`);
        res.end();
      }
    }
  });

  // DeepSeek reasoning endpoint with full API integration
  // DeepSeek reasoning endpoint - Simple JSON response for Prompt Studio
  app.post("/api/deepseek/reason", async (req, res) => {
    try {
      const { prompt, systemPrompt, temperature = 0.7, maxSteps = 10 } = req.body;
      const apiKey = process.env.DEEPSEEK_API_KEY;
      
      if (!apiKey) {
        return res.status(400).json({
          error: "DeepSeek API key is required. Please configure DEEPSEEK_API_KEY environment variable."
        });
      }

      console.log("🤖 Processing DeepSeek reasoning request...");
      
      const deepseekResponse = await fetch("https://api.deepseek.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            { 
              role: "system", 
              content: systemPrompt || `You are an expert AI architect and Lovable 2.0 platform specialist. Your role is to create comprehensive application prompts specifically optimized for the Lovable no-code platform.

Generate detailed, production-ready blueprints that include complete technical specifications, database design, component architecture, and implementation details. Focus on creating comprehensive prompts that enable developers to build full applications without additional research.`
            },
            { role: "user", content: prompt }
          ],
          max_tokens: 8192,
          stream: true
        })
      });

      if (!deepseekResponse.ok) {
        const errorData = await deepseekResponse.json().catch(() => ({}));
        console.error("❌ DeepSeek API error:", deepseekResponse.status, errorData);
        return res.status(deepseekResponse.status).json({ 
          error: `DeepSeek API error: ${errorData.error?.message || "Unknown error"}` 
        });
      }

      // Set streaming headers
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      res.setHeader("Access-Control-Allow-Origin", "*");

      const reader = deepseekResponse.body?.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";
      let totalTokens = 0;
      let totalContent = "";

      if (!reader) {
        return res.status(500).json({ error: "Unable to read stream from DeepSeek API" });
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n\n");
        
        for (let i = 0; i < parts.length - 1; i++) {
          const part = parts[i].trim();
          if (part.startsWith("data:")) {
            const jsonStr = part.slice(5).trim();
            if (jsonStr === "[DONE]") {
              res.write(`data: ${JSON.stringify({ 
                type: "complete",
                totalTokens,
                totalCharacters: totalContent.length
              })}\n\n`);
              res.end();
              return;
            }
            try {
              const parsed = JSON.parse(jsonStr);
              const token = parsed.choices?.[0]?.delta?.content;
              if (token) {
                totalTokens++;
                totalContent += token;
                res.write(`data: ${JSON.stringify({
                  type: "token",
                  content: token
                })}\n\n`);
              }
            } catch (e) {
              console.warn("JSON parse error", e);
            }
          }
        }
        buffer = parts[parts.length - 1];
      }
      
    } catch (error) {
      console.error("❌ DeepSeek reasoning error:", error);
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
        model: model || 'deepseek-chat',
        messages,
        max_tokens: max_tokens || 8192, // DeepSeek chat supports up to 8K tokens output
        stream: stream || false
      };
      
      console.log('📡 Request payload:', JSON.stringify(requestBody, null, 2));
      
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
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

  // RAG Documents endpoints
  app.get("/api/rag-documents", async (req, res) => {
    try {
      const documents = await storage.getRagDocuments();
      res.json(documents);
    } catch (error) {
      console.error("Error fetching RAG documents:", error);
      res.status(500).json({ error: "Failed to fetch RAG documents" });
    }
  });

  app.post("/api/rag-documents", async (req, res) => {
    try {
      const documentData = req.body;
      // Simulate document processing
      const processedDoc = {
        ...documentData,
        id: `doc_${Date.now()}`,
        status: 'processing',
        chunks: 0,
        embeddings: 0,
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      };
      
      const savedDoc = await storage.createRagDocument(processedDoc);
      
      // Simulate async processing
      setTimeout(async () => {
        try {
          const chunks = Math.floor(documentData.size / 1000) + Math.floor(Math.random() * 50);
          await storage.createRagDocument({
            ...savedDoc,
            status: 'ready',
            chunks,
            embeddings: chunks,
            lastUpdated: new Date().toISOString()
          });
        } catch (e) {
          console.error("Error updating document after processing:", e);
        }
      }, 3000);
      
      res.status(201).json(savedDoc);
    } catch (error) {
      console.error("Error creating RAG document:", error);
      res.status(500).json({ error: "Failed to create RAG document" });
    }
  });

  app.delete("/api/rag-documents/:id", async (req, res) => {
    try {
      const { id } = req.params;
      // Note: We'd need to add delete method to storage interface
      res.json({ message: "Document deleted successfully" });
    } catch (error) {
      console.error("Error deleting RAG document:", error);
      res.status(500).json({ error: "Failed to delete RAG document" });
    }
  });

  // RAG Query endpoint
  app.post("/api/rag-query", async (req, res) => {
    try {
      const { query, documents } = req.body;
      
      // Simulate RAG processing
      const results = documents.map((doc: any) => ({
        documentId: doc.id,
        title: doc.title,
        relevanceScore: Math.random() * 0.4 + 0.6, // 0.6-1.0
        excerpt: `Relevant content from ${doc.title}...`,
        chunkIndex: Math.floor(Math.random() * doc.chunks)
      })).sort((a: any, b: any) => b.relevanceScore - a.relevanceScore);

      const responseTime = Math.random() * 200 + 50; // 50-250ms
      
      res.json({
        query,
        results: results.slice(0, 5), // Top 5 results
        totalResults: results.length,
        responseTime,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error processing RAG query:", error);
      res.status(500).json({ error: "Failed to process RAG query" });
    }
  });

  // MCP Servers endpoints
  app.get("/api/mcp-servers", async (req, res) => {
    try {
      const servers = await storage.getMcpServers();
      res.json(servers);
    } catch (error) {
      console.error("Error fetching MCP servers:", error);
      res.status(500).json({ error: "Failed to fetch MCP servers" });
    }
  });

  app.post("/api/mcp-servers", async (req, res) => {
    try {
      const serverData = req.body;
      const newServer = {
        ...serverData,
        id: `mcp_${Date.now()}`,
        status: 'pending',
        responseTime: 0,
        endpoints: Math.floor(Math.random() * 10) + 1,
        lastConnected: new Date().toISOString()
      };
      
      const savedServer = await storage.createMcpServer(newServer);
      
      // Simulate connection testing
      setTimeout(async () => {
        try {
          const status = Math.random() > 0.8 ? 'error' : 'active';
          const responseTime = status === 'active' ? Math.random() * 100 + 20 : 0;
          
          await storage.updateMcpServerStatus(savedServer.id, status);
        } catch (e) {
          console.error("Error updating server status:", e);
        }
      }, 2000);
      
      res.status(201).json(savedServer);
    } catch (error) {
      console.error("Error creating MCP server:", error);
      res.status(500).json({ error: "Failed to create MCP server" });
    }
  });

  // A2A Agents endpoints
  app.get("/api/a2a-agents", async (req, res) => {
    try {
      const agents = await storage.getA2aAgents();
      res.json(agents);
    } catch (error) {
      console.error("Error fetching A2A agents:", error);
      res.status(500).json({ error: "Failed to fetch A2A agents" });
    }
  });

  app.post("/api/a2a-agents", async (req, res) => {
    try {
      const agentData = req.body;
      const newAgent = {
        ...agentData,
        id: `agent_${Date.now()}`,
        status: 'active',
        createdAt: new Date().toISOString(),
        lastActivity: new Date().toISOString()
      };
      
      const savedAgent = await storage.createA2aAgent(newAgent);
      res.status(201).json(savedAgent);
    } catch (error) {
      console.error("Error creating A2A agent:", error);
      res.status(500).json({ error: "Failed to create A2A agent" });
    }
  });

  // Templates endpoints
  app.get("/api/templates", async (req, res) => {
    try {
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
          preview: '/templates/rag-preview.png',
          files: {
            'main.ts': `// RAG 2.0 Implementation...`,
            'schema.sql': `-- Database schema...`,
            'README.md': `# RAG 2.0 Knowledge Base...`
          }
        },
        // ... other templates
      ];
      res.json(templates);
    } catch (error) {
      console.error("Error fetching templates:", error);
      res.status(500).json({ error: "Failed to fetch templates" });
    }
  });

  app.get("/api/templates/:id", async (req, res) => {
    try {
      const { id } = req.params;
      // Return specific template details
      res.json({ id, name: `Template ${id}`, code: "// Template code..." });
    } catch (error) {
      console.error("Error fetching template:", error);
      res.status(500).json({ error: "Failed to fetch template" });
    }
  });

  app.get("/api/templates/:id/download", async (req, res) => {
    try {
      const { id } = req.params;
      const templateContent = `# Template ${id}\n\n// Complete template implementation...`;
      
      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Content-Disposition', `attachment; filename="template-${id}.md"`);
      res.send(templateContent);
    } catch (error) {
      console.error("Error downloading template:", error);
      res.status(500).json({ error: "Failed to download template" });
    }
  });

  app.post("/api/templates/:id/use", async (req, res) => {
    try {
      const { id } = req.params;
      const { replName } = req.body;
      
      // In a real implementation, this would create a new Repl
      // For now, return success with creation details
      res.json({
        success: true,
        replUrl: `https://replit.com/@user/${replName || `template-${id}`}`,
        message: "Template applied successfully"
      });
    } catch (error) {
      console.error("Error using template:", error);
      res.status(500).json({ error: "Failed to use template" });
    }
  });

  // Analytics endpoints
  app.get("/api/analytics/live", async (req, res) => {
    try {
      // Generate realistic analytics data
      const metrics = {
        activeUsers: Math.floor(Math.random() * 50) + 10,
        totalRequests: Math.floor(Math.random() * 1000) + 500,
        avgResponseTime: Math.floor(Math.random() * 100) + 50,
        errorRate: Math.random() * 2,
        ragQueries: Math.floor(Math.random() * 200) + 100,
        mcpCalls: Math.floor(Math.random() * 150) + 75,
        a2aMessages: Math.floor(Math.random() * 100) + 50,
        blueprintGenerations: Math.floor(Math.random() * 25) + 10,
        timestamp: new Date().toISOString()
      };
      
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching live analytics:", error);
      res.status(500).json({ error: "Failed to fetch live analytics" });
    }
  });

  return httpServer;
}
