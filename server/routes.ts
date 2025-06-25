import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { authenticateToken, requireRole, requirePermission, rateLimitMiddleware, authService, AuthRequest } from "./auth";
import WebSocketService from "./websocket";
import { databaseService } from "./database";
import multer from 'multer';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';

// Configure middleware
const upload = multer({ 
  dest: 'uploads/',
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt|md/;
    const extname = allowedTypes.test(file.originalname.toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  const wsService = new WebSocketService(httpServer);

  // Security middleware
  app.use(helmet());
  app.use(compression());
  app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5000'],
    credentials: true
  }));

  // Rate limiting
  app.use('/api', rateLimitMiddleware(1000, 60000)); // 1000 requests per minute

  // ============= AUTHENTICATION ROUTES =============
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { email, password, username } = req.body;
      
      // Validate input
      if (!email || !password || !username) {
        return res.status(400).json({ error: 'All fields required' });
      }

      // Check password strength
      const passwordCheck = authService.validatePasswordStrength(password);
      if (!passwordCheck.valid) {
        return res.status(400).json({ error: 'Weak password', issues: passwordCheck.errors });
      }

      // Check if user exists
      const existingUser = await authService.getUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({ error: 'User already exists' });
      }

      // Hash password and create user
      const hashedPassword = await authService.hashPassword(password);
      const user = await storage.createUser({
        email,
        username,
        password: hashedPassword,
        role: 'developer',
        permissions: authService.getRolePermissions('developer'),
        apiKeys: [],
        mfaEnabled: false,
        lastLogin: new Date(),
        failedAttempts: 0
      });

      // Generate tokens
      const tokens = authService.generateTokens(user);
      
      res.status(201).json({
        message: 'User created successfully',
        user: { id: user.id, email: user.email, username: user.username, role: user.role },
        tokens
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create user' });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password, deviceInfo } = req.body;
      
      // Check account lockout
      const lockoutStatus = await authService.checkAccountLockout(email);
      if (lockoutStatus.locked) {
        return res.status(423).json({ 
          error: 'Account locked', 
          remaining: lockoutStatus.remaining 
        });
      }

      // Get user
      const user = await authService.getUserByEmail(email);
      if (!user) {
        await authService.recordFailedAttempt(email);
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Verify password
      const passwordValid = await authService.verifyPassword(password, user.password);
      if (!passwordValid) {
        await authService.recordFailedAttempt(email);
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Generate tokens and session
      const tokens = authService.generateTokens(user);
      const sessionId = authService.createSession(user.id, deviceInfo);

      // Update last login
      await storage.updateUserLastLogin(user.id);

      res.json({
        message: 'Login successful',
        user: { id: user.id, email: user.email, username: user.username, role: user.role },
        tokens,
        sessionId
      });
    } catch (error) {
      res.status(500).json({ error: 'Login failed' });
    }
  });

  app.post('/api/auth/refresh', async (req, res) => {
    try {
      const { refreshToken } = req.body;
      const decoded = authService.verifyRefreshToken(refreshToken);
      const user = await storage.getUserById(decoded.id);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const tokens = authService.generateTokens(user);
      res.json({ tokens });
    } catch (error) {
      res.status(401).json({ error: 'Invalid refresh token' });
    }
  });

  app.post('/api/auth/logout', authenticateToken, async (req: AuthRequest, res) => {
    try {
      const { sessionId } = req.body;
      if (sessionId) {
        authService.invalidateSession(sessionId);
      }
      res.json({ message: 'Logged out successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Logout failed' });
    }
  });

  // ============= API KEY MANAGEMENT =============
  app.post('/api/auth/api-keys', authenticateToken, async (req: AuthRequest, res) => {
    try {
      const apiKey = authService.generateApiKey();
      await storage.addUserApiKey(req.user!.id, apiKey);
      
      res.json({
        message: 'API key created',
        apiKey,
        keyId: apiKey.slice(-8)
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create API key' });
    }
  });

  app.get('/api/auth/api-keys', authenticateToken, async (req: AuthRequest, res) => {
    try {
      const keys = await storage.getUserApiKeys(req.user!.id);
      res.json({ 
        apiKeys: keys.map(key => ({
          id: key.slice(-8),
          created: new Date(),
          lastUsed: null
        }))
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch API keys' });
    }
  });

  app.delete('/api/auth/api-keys/:keyId', authenticateToken, async (req: AuthRequest, res) => {
    try {
      await storage.removeUserApiKey(req.user!.id, req.params.keyId);
      res.json({ message: 'API key revoked' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to revoke API key' });
    }
  });

  // ============= USER MANAGEMENT (ADMIN ONLY) =============
  app.get('/api/admin/users', authenticateToken, requireRole(['admin']), async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json({ users });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  });

  app.patch('/api/admin/users/:userId/role', authenticateToken, requireRole(['admin']), async (req, res) => {
    try {
      const { role } = req.body;
      await storage.updateUserRole(req.params.userId, role);
      res.json({ message: 'User role updated' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update user role' });
    }
  });

  // ============= FILE UPLOAD ROUTES =============
  app.post('/api/files/upload', authenticateToken, upload.single('file'), async (req: AuthRequest, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const fileData = {
        originalName: req.file.originalname,
        filename: req.file.filename,
        path: req.file.path,
        size: req.file.size,
        mimetype: req.file.mimetype,
        uploadedBy: req.user!.id,
        uploadedAt: new Date()
      };

      const file = await storage.createFile(fileData);
      res.json({ message: 'File uploaded successfully', file });
    } catch (error) {
      res.status(500).json({ error: 'File upload failed' });
    }
  });

  app.get('/api/files', authenticateToken, async (req: AuthRequest, res) => {
    try {
      const files = await storage.getUserFiles(req.user!.id);
      res.json({ files });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch files' });
    }
  });

  // ============= NOTIFICATION SYSTEM =============
  app.get('/api/notifications', authenticateToken, async (req: AuthRequest, res) => {
    try {
      const notifications = await storage.getUserNotifications(req.user!.id);
      res.json({ notifications });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch notifications' });
    }
  });

  app.post('/api/notifications', authenticateToken, requirePermission('send_notifications'), async (req: AuthRequest, res) => {
    try {
      const { userId, title, message, type } = req.body;
      
      const notification = await storage.createNotification({
        userId,
        title,
        message,
        type,
        read: false,
        createdAt: new Date()
      });

      // Send real-time notification
      wsService.sendNotification(userId, notification);

      res.json({ message: 'Notification sent', notification });
    } catch (error) {
      res.status(500).json({ error: 'Failed to send notification' });
    }
  });

  app.patch('/api/notifications/:id/read', authenticateToken, async (req: AuthRequest, res) => {
    try {
      await storage.markNotificationRead(req.params.id, req.user!.id);
      res.json({ message: 'Notification marked as read' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to mark notification as read' });
    }
  });

  // ============= ANALYTICS & MONITORING =============
  app.get('/api/analytics/dashboard', authenticateToken, requireRole(['admin', 'developer']), async (req, res) => {
    try {
      const analytics = {
        users: await storage.getUserStats(),
        projects: await storage.getProjectStats(),
        apiUsage: await storage.getApiUsageStats(),
        errors: await storage.getErrorStats(),
        performance: databaseService.getQueryMetrics()
      };

      res.json({ analytics });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch analytics' });
    }
  });

  app.get('/api/health', async (req, res) => {
    try {
      const health = {
        status: 'healthy',
        timestamp: new Date(),
        database: await databaseService.getHealthStatus(),
        websocket: {
          connected: wsService.getConnectedCount(),
          status: 'operational'
        },
        memory: process.memoryUsage(),
        uptime: process.uptime()
      };

      res.json(health);
    } catch (error) {
      res.status(500).json({ 
        status: 'unhealthy', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  });

  // ============= PROJECT MANAGEMENT =============
  app.get('/api/projects', authenticateToken, async (req: AuthRequest, res) => {
    try {
      const projects = await storage.getUserProjects(req.user!.id);
      res.json({ projects });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch projects' });
    }
  });

  app.post('/api/projects', authenticateToken, async (req: AuthRequest, res) => {
    try {
      const projectData = {
        ...req.body,
        ownerId: req.user!.id,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const project = await storage.createProject(projectData);
      res.status(201).json({ project });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create project' });
    }
  });

  app.get('/api/projects/:id', authenticateToken, async (req: AuthRequest, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }

      // Check access permissions
      if (project.ownerId !== req.user!.id && !project.collaborators?.includes(req.user!.id)) {
        return res.status(403).json({ error: 'Access denied' });
      }

      res.json({ project });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch project' });
    }
  });

  app.patch('/api/projects/:id', authenticateToken, async (req: AuthRequest, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      
      if (!project || project.ownerId !== req.user!.id) {
        return res.status(404).json({ error: 'Project not found or access denied' });
      }

      const updatedProject = await storage.updateProject(req.params.id, {
        ...req.body,
        updatedAt: new Date()
      });

      res.json({ project: updatedProject });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update project' });
    }
  });

  app.delete('/api/projects/:id', authenticateToken, async (req: AuthRequest, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      
      if (!project || project.ownerId !== req.user!.id) {
        return res.status(404).json({ error: 'Project not found or access denied' });
      }

      await storage.deleteProject(req.params.id);
      res.json({ message: 'Project deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete project' });
    }
  });

  // ============= TEAM COLLABORATION =============
  app.post('/api/projects/:id/invite', authenticateToken, async (req: AuthRequest, res) => {
    try {
      const { email, role } = req.body;
      const project = await storage.getProject(req.params.id);
      
      if (!project || project.ownerId !== req.user!.id) {
        return res.status(404).json({ error: 'Project not found or access denied' });
      }

      const invitation = await storage.createProjectInvitation({
        projectId: req.params.id,
        email,
        role,
        invitedBy: req.user!.id,
        status: 'pending',
        createdAt: new Date()
      });

      // Send notification email (simplified)
      wsService.sendNotification(email, {
        title: 'Project Invitation',
        message: `You've been invited to collaborate on ${project.name}`,
        type: 'invitation'
      });

      res.json({ message: 'Invitation sent', invitation });
    } catch (error) {
      res.status(500).json({ error: 'Failed to send invitation' });
    }
  });

  // ============= EXISTING RAG, MCP, A2A ROUTES (Updated with Auth) =============
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
      await storage.createDeepseekConversation({
        sessionId: req.headers['x-session-id'] || 'default',
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
        processingTimeMs: processingTime,
        maxTokens: 64000
      });

      const response = {
        reasoning,
        reasoningContent: reasoningContent, // Chain of Thought from DeepSeek
        finalAnswer: finalAnswer, // Final answer from DeepSeek
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
  return httpServer;
}
