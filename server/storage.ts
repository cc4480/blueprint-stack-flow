import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { 
  users, 
  ragDocuments, 
  mcpServers, 
  a2aAgents, 
  deepseekConversations,
  blueprintPrompts,
  templates,
  ragQueries,
  mcpToolExecutions,
  a2aTasks,
  systemMetrics,
  integrationStatus,
  userPreferences,
  analyticsEvents,
  tutorialCategories,
  learningPaths,
  tutorials,
  tutorialModules,
  userProgress,
  tutorialResources,
  type User, 
  type InsertUser,
  type RagDocument,
  type McpServer,
  type A2aAgent,
  type DeepseekConversation,
  type BlueprintPrompt,
  type InsertBlueprintPrompt,
  type Template,
  type InsertTemplate,
  type RagQuery,
  type InsertRagQuery,
  type McpToolExecution,
  type InsertMcpToolExecution,
  type A2aTask,
  type InsertA2aTask,
  type SystemMetric,
  type InsertSystemMetric,
  type IntegrationStatus,
  type InsertIntegrationStatus,
  type UserPreferences,
  type InsertUserPreferences,
  type AnalyticsEvent,
  type InsertAnalyticsEvent,
  type TutorialCategory,
  type InsertTutorialCategory,
  type LearningPath,
  type InsertLearningPath,
  type Tutorial,
  type InsertTutorial,
  type TutorialModule,
  type InsertTutorialModule,
  type UserProgress,
  type InsertUserProgress,
  type TutorialResource,
  type InsertTutorialResource
} from "@shared/schema";
import { eq, desc, and, gte, lte, like, count } from "drizzle-orm";

// Database connection with error handling
let client: ReturnType<typeof postgres>;
// db is initialised below when DATABASE_URL is present;
// PostgresStorage is only instantiated in that branch so the non-null assertion is safe
let db: ReturnType<typeof drizzle>;

if (process.env.DATABASE_URL) {
  try {
    client = postgres(process.env.DATABASE_URL, {
      max: 10,
      idle_timeout: 60,
      max_lifetime: 60 * 30,
      onnotice: (notice) => {
        console.log('PostgreSQL notice:', notice);
      }
    });
    db = drizzle(client);
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
} else {
  console.warn('⚠️  DATABASE_URL not set — using in-memory storage (dev/test mode)');
}

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // RAG Document methods
  getRagDocuments(): Promise<RagDocument[]>;
  createRagDocument(doc: Partial<RagDocument>): Promise<RagDocument>;
  searchRagDocuments(query: string, limit?: number): Promise<RagDocument[]>;
  
  // MCP Server methods
  getMcpServers(): Promise<McpServer[]>;
  createMcpServer(server: Partial<McpServer>): Promise<McpServer>;
  updateMcpServerStatus(id: string, status: string): Promise<void>;
  
  // A2A Agent methods
  getA2aAgents(): Promise<A2aAgent[]>;
  createA2aAgent(agent: Partial<A2aAgent>): Promise<A2aAgent>;
  updateA2aAgentStatus(id: string, status: string): Promise<void>;
  
  // DeepSeek Conversation methods
  getDeepseekConversations(sessionId: string): Promise<DeepseekConversation[]>;
  createDeepseekConversation(conversation: Partial<DeepseekConversation>): Promise<DeepseekConversation>;
  
  // Blueprint Prompt methods
  getBlueprintPrompts(): Promise<BlueprintPrompt[]>;
  getBlueprintPrompt(id: string): Promise<BlueprintPrompt | undefined>;
  createBlueprintPrompt(prompt: Partial<InsertBlueprintPrompt>): Promise<BlueprintPrompt>;
  updateBlueprintPrompt(id: string, prompt: Partial<BlueprintPrompt>): Promise<void>;
  
  // Template methods
  getTemplates(category?: string): Promise<Template[]>;
  getTemplate(id: string): Promise<Template | undefined>;
  createTemplate(template: Partial<InsertTemplate>): Promise<Template>;
  updateTemplate(id: string, template: Partial<Template>): Promise<void>;
  deleteTemplate(id: string): Promise<void>;
  
  // RAG Query methods
  getRagQueries(sessionId?: string): Promise<RagQuery[]>;
  createRagQuery(query: Partial<InsertRagQuery>): Promise<RagQuery>;
  
  // MCP Tool Execution methods
  getMcpToolExecutions(serverId?: string): Promise<McpToolExecution[]>;
  createMcpToolExecution(execution: Partial<InsertMcpToolExecution>): Promise<McpToolExecution>;
  
  // A2A Task methods
  getA2aTasks(agentId?: string): Promise<A2aTask[]>;
  createA2aTask(task: Partial<InsertA2aTask>): Promise<A2aTask>;
  updateA2aTaskStatus(id: string, status: string, result?: any): Promise<void>;
  
  // System Metrics methods
  getSystemMetrics(category?: string, startDate?: Date, endDate?: Date): Promise<SystemMetric[]>;
  createSystemMetric(metric: Partial<InsertSystemMetric>): Promise<SystemMetric>;
  
  // Integration Status methods
  getIntegrationStatus(): Promise<IntegrationStatus[]>;
  updateIntegrationStatus(serviceName: string, status: Partial<IntegrationStatus>): Promise<void>;
  
  // User Preferences methods
  getUserPreferences(userId: number): Promise<UserPreferences | undefined>;
  updateUserPreferences(userId: number, preferences: Partial<InsertUserPreferences>): Promise<void>;
  
  // Analytics methods
  createAnalyticsEvent(event: Partial<InsertAnalyticsEvent>): Promise<AnalyticsEvent>;
  getAnalyticsEvents(sessionId?: string, eventType?: string): Promise<AnalyticsEvent[]>;
  
  // Tutorial Categories methods
  getTutorialCategories(): Promise<TutorialCategory[]>;
  createTutorialCategory(category: Partial<InsertTutorialCategory>): Promise<TutorialCategory>;
  
  // Learning Paths methods
  getLearningPaths(categoryId?: string): Promise<LearningPath[]>;
  getLearningPath(id: string): Promise<LearningPath | undefined>;
  createLearningPath(path: Partial<InsertLearningPath>): Promise<LearningPath>;
  updateLearningPath(id: string, path: Partial<LearningPath>): Promise<void>;
  
  // Tutorials methods
  getTutorials(categoryId?: string, learningPathId?: string): Promise<Tutorial[]>;
  getTutorial(id: string): Promise<Tutorial | undefined>;
  createTutorial(tutorial: Partial<InsertTutorial>): Promise<Tutorial>;
  updateTutorial(id: string, tutorial: Partial<Tutorial>): Promise<void>;
  deleteTutorial(id: string): Promise<void>;
  
  // Tutorial Modules methods
  getTutorialModules(tutorialId?: string, learningPathId?: string): Promise<TutorialModule[]>;
  createTutorialModule(module: Partial<InsertTutorialModule>): Promise<TutorialModule>;
  updateTutorialModule(id: string, module: Partial<TutorialModule>): Promise<void>;
  
  // User Progress methods
  getUserProgress(userId: number, tutorialId?: string, learningPathId?: string): Promise<UserProgress[]>;
  createUserProgress(progress: Partial<InsertUserProgress>): Promise<UserProgress>;
  updateUserProgress(id: string, progress: Partial<UserProgress>): Promise<void>;
  
  // Tutorial Resources methods
  getTutorialResources(tutorialId: string): Promise<TutorialResource[]>;
  createTutorialResource(resource: Partial<InsertTutorialResource>): Promise<TutorialResource>;
}

export class PostgresStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    try {
      const result = await db.select().from(users).where(eq(users.id, id));
      return result[0];
    } catch (error) {
      console.error('Error fetching user:', error);
      throw new Error(`Failed to fetch user with id ${id}`);
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const result = await db.select().from(users).where(eq(users.username, username));
      return result[0];
    } catch (error) {
      console.error('Error fetching user by username:', error);
      throw new Error(`Failed to fetch user with username ${username}`);
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      const result = await db.insert(users).values(insertUser).returning();
      if (!result[0]) {
        throw new Error('Failed to create user - no result returned');
      }
      return result[0];
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error(`Failed to create user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // RAG Document methods
  async getRagDocuments(): Promise<RagDocument[]> {
    try {
      return await db.select().from(ragDocuments);
    } catch (error) {
      console.error('Error fetching RAG documents:', error);
      throw new Error('Failed to fetch RAG documents');
    }
  }

  async createRagDocument(doc: Partial<RagDocument>): Promise<RagDocument> {
    try {
      // Ensure required fields are present - based on actual schema
      const documentData = {
        id: doc.id,
        title: doc.title || 'Untitled Document',
        content: doc.content || '',
        metadata: doc.metadata || {},
        embedding: doc.embedding || null,
        createdAt: doc.createdAt || new Date(),
        updatedAt: doc.updatedAt || new Date()
      };
      
      const result = await db.insert(ragDocuments).values(documentData).returning();
      if (!result[0]) {
        throw new Error('Failed to create RAG document - no result returned');
      }
      return result[0];
    } catch (error) {
      console.error('Error creating RAG document:', error);
      throw new Error(`Failed to create RAG document: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // MCP Server methods
  async getMcpServers(): Promise<McpServer[]> {
    try {
      return await db.select().from(mcpServers);
    } catch (error) {
      console.error('Error fetching MCP servers:', error);
      throw new Error('Failed to fetch MCP servers');
    }
  }

  async createMcpServer(server: Partial<McpServer>): Promise<McpServer> {
    try {
      // Match actual schema fields
      const serverData = {
        id: server.id,
        name: server.name || 'Unnamed Server',
        endpoint: server.endpoint || null,
        status: server.status || 'inactive',
        transport: server.transport || 'stdio',
        capabilities: server.capabilities || {},
        protocolVersion: server.protocolVersion || null,
        command: server.command || null,
        createdAt: server.createdAt || new Date(),
        updatedAt: server.updatedAt || new Date()
      };
      
      const result = await db.insert(mcpServers).values(serverData).returning();
      if (!result[0]) {
        throw new Error('Failed to create MCP server - no result returned');
      }
      return result[0];
    } catch (error) {
      console.error('Error creating MCP server:', error);
      throw new Error(`Failed to create MCP server: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updateMcpServerStatus(id: string, status: string): Promise<void> {
    try {
      const result = await db.update(mcpServers)
        .set({ status, updatedAt: new Date() })
        .where(eq(mcpServers.id, id))
        .returning();
      
      if (result.length === 0) {
        throw new Error(`MCP server with id ${id} not found`);
      }
    } catch (error) {
      console.error('Error updating MCP server status:', error);
      throw new Error(`Failed to update MCP server status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // A2A Agent methods
  async getA2aAgents(): Promise<A2aAgent[]> {
    return await db.select().from(a2aAgents);
  }

  async createA2aAgent(agent: Partial<A2aAgent>): Promise<A2aAgent> {
    const result = await db.insert(a2aAgents).values(agent as any).returning();
    return result[0];
  }

  // DeepSeek Conversation methods
  async getDeepseekConversations(sessionId: string): Promise<DeepseekConversation[]> {
    return await db.select().from(deepseekConversations).where(eq(deepseekConversations.sessionId, sessionId));
  }

  async createDeepseekConversation(conversation: Partial<DeepseekConversation>): Promise<DeepseekConversation> {
    const result = await db.insert(deepseekConversations).values(conversation as any).returning();
    return result[0];
  }

  async getBlueprintPrompts(): Promise<BlueprintPrompt[]> {
    return await db
      .select()
      .from(blueprintPrompts)
      .orderBy(desc(blueprintPrompts.createdAt));
  }

  async getBlueprintPrompt(id: string): Promise<BlueprintPrompt | undefined> {
    const result = await db
      .select()
      .from(blueprintPrompts)
      .where(eq(blueprintPrompts.id, id));
    return result[0] || undefined;
  }

  async createBlueprintPrompt(prompt: Partial<InsertBlueprintPrompt>): Promise<BlueprintPrompt> {
    const result = await db
      .insert(blueprintPrompts)
      .values(prompt as any)
      .returning();
    return result[0];
  }

  async updateBlueprintPrompt(id: string, prompt: Partial<BlueprintPrompt>): Promise<void> {
    await db
      .update(blueprintPrompts)
      .set({ ...prompt, updatedAt: new Date() })
      .where(eq(blueprintPrompts.id, id));
  }

  // Enhanced RAG Document methods
  async searchRagDocuments(query: string, limit: number = 10): Promise<RagDocument[]> {
    try {
      return await db
        .select()
        .from(ragDocuments)
        .where(like(ragDocuments.content, `%${query}%`))
        .limit(limit);
    } catch (error) {
      console.error('Error searching RAG documents:', error);
      throw new Error('Failed to search RAG documents');
    }
  }

  // A2A Agent status update
  async updateA2aAgentStatus(id: string, status: string): Promise<void> {
    try {
      const result = await db
        .update(a2aAgents)
        .set({ status, updatedAt: new Date() })
        .where(eq(a2aAgents.id, id))
        .returning();
      
      if (result.length === 0) {
        throw new Error(`A2A agent with id ${id} not found`);
      }
    } catch (error) {
      console.error('Error updating A2A agent status:', error);
      throw new Error(`Failed to update A2A agent status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Template methods
  async getTemplates(category?: string): Promise<Template[]> {
    try {
      if (category) {
        return await db.select().from(templates).where(eq(templates.category, category)).orderBy(desc(templates.createdAt));
      }
      return await db.select().from(templates).orderBy(desc(templates.createdAt));
    } catch (error) {
      console.error('Error fetching templates:', error);
      throw new Error('Failed to fetch templates');
    }
  }

  async getTemplate(id: string): Promise<Template | undefined> {
    try {
      const result = await db.select().from(templates).where(eq(templates.id, id));
      return result[0];
    } catch (error) {
      console.error('Error fetching template:', error);
      throw new Error(`Failed to fetch template with id ${id}`);
    }
  }

  async createTemplate(template: Partial<InsertTemplate>): Promise<Template> {
    try {
      const templateData = {
        name: template.name || 'Untitled Template',
        description: template.description || '',
        category: template.category || 'general',
        content: template.content || '',
        metadata: template.metadata || {},
        tags: template.tags || [],
        isPublic: template.isPublic || false,
        downloadCount: 0,
        rating: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const result = await db.insert(templates).values(templateData).returning();
      if (!result[0]) {
        throw new Error('Failed to create template - no result returned');
      }
      return result[0];
    } catch (error) {
      console.error('Error creating template:', error);
      throw new Error(`Failed to create template: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updateTemplate(id: string, template: Partial<Template>): Promise<void> {
    try {
      const result = await db
        .update(templates)
        .set({ ...template, updatedAt: new Date() })
        .where(eq(templates.id, id))
        .returning();
      
      if (result.length === 0) {
        throw new Error(`Template with id ${id} not found`);
      }
    } catch (error) {
      console.error('Error updating template:', error);
      throw new Error(`Failed to update template: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async deleteTemplate(id: string): Promise<void> {
    try {
      const result = await db
        .delete(templates)
        .where(eq(templates.id, id))
        .returning();
      
      if (result.length === 0) {
        throw new Error(`Template with id ${id} not found`);
      }
    } catch (error) {
      console.error('Error deleting template:', error);
      throw new Error(`Failed to delete template: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // RAG Query methods
  async getRagQueries(sessionId?: string): Promise<RagQuery[]> {
    try {
      if (sessionId) {
        return await db.select().from(ragQueries).where(eq(ragQueries.sessionId, sessionId)).orderBy(desc(ragQueries.createdAt));
      }
      return await db.select().from(ragQueries).orderBy(desc(ragQueries.createdAt));
    } catch (error) {
      console.error('Error fetching RAG queries:', error);
      throw new Error('Failed to fetch RAG queries');
    }
  }

  async createRagQuery(query: Partial<InsertRagQuery>): Promise<RagQuery> {
    try {
      const result = await db.insert(ragQueries).values(query as any).returning();
      if (!result[0]) {
        throw new Error('Failed to create RAG query - no result returned');
      }
      return result[0];
    } catch (error) {
      console.error('Error creating RAG query:', error);
      throw new Error(`Failed to create RAG query: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // MCP Tool Execution methods
  async getMcpToolExecutions(serverId?: string): Promise<McpToolExecution[]> {
    try {
      if (serverId) {
        return await db.select().from(mcpToolExecutions).where(eq(mcpToolExecutions.serverId, serverId)).orderBy(desc(mcpToolExecutions.createdAt));
      }
      return await db.select().from(mcpToolExecutions).orderBy(desc(mcpToolExecutions.createdAt));
    } catch (error) {
      console.error('Error fetching MCP tool executions:', error);
      throw new Error('Failed to fetch MCP tool executions');
    }
  }

  async createMcpToolExecution(execution: Partial<InsertMcpToolExecution>): Promise<McpToolExecution> {
    try {
      const result = await db.insert(mcpToolExecutions).values(execution as any).returning();
      if (!result[0]) {
        throw new Error('Failed to create MCP tool execution - no result returned');
      }
      return result[0];
    } catch (error) {
      console.error('Error creating MCP tool execution:', error);
      throw new Error(`Failed to create MCP tool execution: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // A2A Task methods
  async getA2aTasks(agentId?: string): Promise<A2aTask[]> {
    try {
      if (agentId) {
        return await db.select().from(a2aTasks).where(eq(a2aTasks.agentId, agentId)).orderBy(desc(a2aTasks.createdAt));
      }
      return await db.select().from(a2aTasks).orderBy(desc(a2aTasks.createdAt));
    } catch (error) {
      console.error('Error fetching A2A tasks:', error);
      throw new Error('Failed to fetch A2A tasks');
    }
  }

  async createA2aTask(task: Partial<InsertA2aTask>): Promise<A2aTask> {
    try {
      const result = await db.insert(a2aTasks).values(task as any).returning();
      if (!result[0]) {
        throw new Error('Failed to create A2A task - no result returned');
      }
      return result[0];
    } catch (error) {
      console.error('Error creating A2A task:', error);
      throw new Error(`Failed to create A2A task: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updateA2aTaskStatus(id: string, status: string, result?: any): Promise<void> {
    try {
      const updateData: any = { 
        status, 
        updatedAt: new Date() 
      };
      
      if (result) {
        updateData.result = result;
      }
      
      if (status === 'completed') {
        updateData.completedAt = new Date();
      }
      
      const queryResult = await db
        .update(a2aTasks)
        .set(updateData)
        .where(eq(a2aTasks.id, id))
        .returning();
      
      if (queryResult.length === 0) {
        throw new Error(`A2A task with id ${id} not found`);
      }
    } catch (error) {
      console.error('Error updating A2A task status:', error);
      throw new Error(`Failed to update A2A task status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // System Metrics methods
  async getSystemMetrics(category?: string, startDate?: Date, endDate?: Date): Promise<SystemMetric[]> {
    try {
      const conditions = [];
      if (category) {
        conditions.push(eq(systemMetrics.category, category));
      }
      if (startDate) {
        conditions.push(gte(systemMetrics.timestamp, startDate));
      }
      if (endDate) {
        conditions.push(lte(systemMetrics.timestamp, endDate));
      }
      
      if (conditions.length > 0) {
        return await db.select().from(systemMetrics).where(and(...conditions)).orderBy(desc(systemMetrics.timestamp));
      }
      
      return await db.select().from(systemMetrics).orderBy(desc(systemMetrics.timestamp));
    } catch (error) {
      console.error('Error fetching system metrics:', error);
      throw new Error('Failed to fetch system metrics');
    }
  }

  async createSystemMetric(metric: Partial<InsertSystemMetric>): Promise<SystemMetric> {
    try {
      const result = await db.insert(systemMetrics).values(metric as any).returning();
      if (!result[0]) {
        throw new Error('Failed to create system metric - no result returned');
      }
      return result[0];
    } catch (error) {
      console.error('Error creating system metric:', error);
      throw new Error(`Failed to create system metric: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Integration Status methods
  async getIntegrationStatus(): Promise<IntegrationStatus[]> {
    try {
      return await db.select().from(integrationStatus).orderBy(desc(integrationStatus.lastCheck));
    } catch (error) {
      console.error('Error fetching integration status:', error);
      throw new Error('Failed to fetch integration status');
    }
  }

  async updateIntegrationStatus(serviceName: string, status: Partial<IntegrationStatus>): Promise<void> {
    try {
      const result = await db
        .update(integrationStatus)
        .set({ ...status, lastCheck: new Date() })
        .where(eq(integrationStatus.serviceName, serviceName))
        .returning();
      
      if (result.length === 0) {
        // Create new integration status if it doesn't exist
        await db.insert(integrationStatus).values({
          serviceName,
          status: status.status || 'unknown',
          responseTimeMs: status.responseTimeMs,
          errorCount: status.errorCount || 0,
          lastError: status.lastError,
          lastCheck: new Date()
        });
      }
    } catch (error) {
      console.error('Error updating integration status:', error);
      throw new Error(`Failed to update integration status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // User Preferences methods
  async getUserPreferences(userId: number): Promise<UserPreferences | undefined> {
    try {
      const result = await db.select().from(userPreferences).where(eq(userPreferences.userId, userId));
      return result[0];
    } catch (error) {
      console.error('Error fetching user preferences:', error);
      throw new Error(`Failed to fetch user preferences for user ${userId}`);
    }
  }

  async updateUserPreferences(userId: number, preferences: Partial<InsertUserPreferences>): Promise<void> {
    try {
      const result = await db
        .update(userPreferences)
        .set({ ...preferences, updatedAt: new Date() })
        .where(eq(userPreferences.userId, userId))
        .returning();
      
      if (result.length === 0) {
        // Create new preferences if they don't exist
        await db.insert(userPreferences).values({
          userId,
          preferences: preferences.preferences || {},
          theme: preferences.theme || 'dark',
          language: preferences.language || 'en',
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    } catch (error) {
      console.error('Error updating user preferences:', error);
      throw new Error(`Failed to update user preferences: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Analytics methods
  async createAnalyticsEvent(event: Partial<InsertAnalyticsEvent>): Promise<AnalyticsEvent> {
    try {
      const result = await db.insert(analyticsEvents).values(event as any).returning();
      if (!result[0]) {
        throw new Error('Failed to create analytics event - no result returned');
      }
      return result[0];
    } catch (error) {
      console.error('Error creating analytics event:', error);
      throw new Error(`Failed to create analytics event: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getAnalyticsEvents(sessionId?: string, eventType?: string): Promise<AnalyticsEvent[]> {
    try {
      const conditions = [];
      if (sessionId) {
        conditions.push(eq(analyticsEvents.sessionId, sessionId));
      }
      if (eventType) {
        conditions.push(eq(analyticsEvents.eventType, eventType));
      }
      
      if (conditions.length > 0) {
        return await db.select().from(analyticsEvents).where(and(...conditions)).orderBy(desc(analyticsEvents.timestamp));
      }
      
      return await db.select().from(analyticsEvents).orderBy(desc(analyticsEvents.timestamp));
    } catch (error) {
      console.error('Error fetching analytics events:', error);
      throw new Error('Failed to fetch analytics events');
    }
  }

  // Tutorial Categories methods
  async getTutorialCategories(): Promise<TutorialCategory[]> {
    try {
      return await db.select().from(tutorialCategories).orderBy(tutorialCategories.order);
    } catch (error) {
      console.error('Error fetching tutorial categories:', error);
      throw new Error('Failed to fetch tutorial categories');
    }
  }

  async createTutorialCategory(category: Partial<InsertTutorialCategory>): Promise<TutorialCategory> {
    try {
      const result = await db.insert(tutorialCategories).values(category as any).returning();
      if (!result[0]) {
        throw new Error('Failed to create tutorial category - no result returned');
      }
      return result[0];
    } catch (error) {
      console.error('Error creating tutorial category:', error);
      throw new Error(`Failed to create tutorial category: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Learning Paths methods
  async getLearningPaths(categoryId?: string): Promise<LearningPath[]> {
    try {
      if (categoryId) {
        return await db.select().from(learningPaths).where(eq(learningPaths.categoryId, categoryId)).orderBy(learningPaths.order);
      }
      return await db.select().from(learningPaths).orderBy(learningPaths.order);
    } catch (error) {
      console.error('Error fetching learning paths:', error);
      throw new Error('Failed to fetch learning paths');
    }
  }

  async getLearningPath(id: string): Promise<LearningPath | undefined> {
    try {
      const result = await db.select().from(learningPaths).where(eq(learningPaths.id, id));
      return result[0];
    } catch (error) {
      console.error('Error fetching learning path:', error);
      throw new Error('Failed to fetch learning path');
    }
  }

  async createLearningPath(path: Partial<InsertLearningPath>): Promise<LearningPath> {
    try {
      const result = await db.insert(learningPaths).values(path as any).returning();
      if (!result[0]) {
        throw new Error('Failed to create learning path - no result returned');
      }
      return result[0];
    } catch (error) {
      console.error('Error creating learning path:', error);
      throw new Error(`Failed to create learning path: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updateLearningPath(id: string, path: Partial<LearningPath>): Promise<void> {
    try {
      await db.update(learningPaths).set(path as any).where(eq(learningPaths.id, id));
    } catch (error) {
      console.error('Error updating learning path:', error);
      throw new Error('Failed to update learning path');
    }
  }

  // Tutorials methods
  async getTutorials(categoryId?: string, learningPathId?: string): Promise<Tutorial[]> {
    try {
      const conditions = [];
      if (categoryId) conditions.push(eq(tutorials.categoryId, categoryId));
      if (learningPathId) conditions.push(eq(tutorials.learningPathId, learningPathId));
      
      if (conditions.length > 0) {
        return await db.select().from(tutorials).where(and(...conditions)).orderBy(tutorials.order);
      }
      return await db.select().from(tutorials).orderBy(tutorials.order);
    } catch (error) {
      console.error('Error fetching tutorials:', error);
      throw new Error('Failed to fetch tutorials');
    }
  }

  async getTutorial(id: string): Promise<Tutorial | undefined> {
    try {
      const result = await db.select().from(tutorials).where(eq(tutorials.id, id));
      return result[0];
    } catch (error) {
      console.error('Error fetching tutorial:', error);
      throw new Error('Failed to fetch tutorial');
    }
  }

  async createTutorial(tutorial: Partial<InsertTutorial>): Promise<Tutorial> {
    try {
      const result = await db.insert(tutorials).values(tutorial as any).returning();
      if (!result[0]) {
        throw new Error('Failed to create tutorial - no result returned');
      }
      return result[0];
    } catch (error) {
      console.error('Error creating tutorial:', error);
      throw new Error(`Failed to create tutorial: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updateTutorial(id: string, tutorial: Partial<Tutorial>): Promise<void> {
    try {
      await db.update(tutorials).set(tutorial as any).where(eq(tutorials.id, id));
    } catch (error) {
      console.error('Error updating tutorial:', error);
      throw new Error('Failed to update tutorial');
    }
  }

  async deleteTutorial(id: string): Promise<void> {
    try {
      await db.delete(tutorials).where(eq(tutorials.id, id));
    } catch (error) {
      console.error('Error deleting tutorial:', error);
      throw new Error('Failed to delete tutorial');
    }
  }

  // Tutorial Modules methods
  async getTutorialModules(tutorialId?: string, learningPathId?: string): Promise<TutorialModule[]> {
    try {
      const conditions = [];
      if (tutorialId) conditions.push(eq(tutorialModules.tutorialId, tutorialId));
      if (learningPathId) conditions.push(eq(tutorialModules.learningPathId, learningPathId));
      
      if (conditions.length > 0) {
        return await db.select().from(tutorialModules).where(and(...conditions)).orderBy(tutorialModules.order);
      }
      return await db.select().from(tutorialModules).orderBy(tutorialModules.order);
    } catch (error) {
      console.error('Error fetching tutorial modules:', error);
      throw new Error('Failed to fetch tutorial modules');
    }
  }

  async createTutorialModule(module: Partial<InsertTutorialModule>): Promise<TutorialModule> {
    try {
      const result = await db.insert(tutorialModules).values(module as any).returning();
      if (!result[0]) {
        throw new Error('Failed to create tutorial module - no result returned');
      }
      return result[0];
    } catch (error) {
      console.error('Error creating tutorial module:', error);
      throw new Error(`Failed to create tutorial module: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updateTutorialModule(id: string, module: Partial<TutorialModule>): Promise<void> {
    try {
      await db.update(tutorialModules).set(module as any).where(eq(tutorialModules.id, id));
    } catch (error) {
      console.error('Error updating tutorial module:', error);
      throw new Error('Failed to update tutorial module');
    }
  }

  // User Progress methods
  async getUserProgress(userId: number, tutorialId?: string, learningPathId?: string): Promise<UserProgress[]> {
    try {
      const conditions = [eq(userProgress.userId, userId)];
      if (tutorialId) conditions.push(eq(userProgress.tutorialId, tutorialId));
      if (learningPathId) conditions.push(eq(userProgress.learningPathId, learningPathId));
      
      return await db.select().from(userProgress).where(and(...conditions)).orderBy(userProgress.createdAt);
    } catch (error) {
      console.error('Error fetching user progress:', error);
      throw new Error('Failed to fetch user progress');
    }
  }

  async createUserProgress(progress: Partial<InsertUserProgress>): Promise<UserProgress> {
    try {
      const result = await db.insert(userProgress).values(progress as any).returning();
      if (!result[0]) {
        throw new Error('Failed to create user progress - no result returned');
      }
      return result[0];
    } catch (error) {
      console.error('Error creating user progress:', error);
      throw new Error(`Failed to create user progress: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updateUserProgress(id: string, progress: Partial<UserProgress>): Promise<void> {
    try {
      await db.update(userProgress).set(progress as any).where(eq(userProgress.id, id));
    } catch (error) {
      console.error('Error updating user progress:', error);
      throw new Error('Failed to update user progress');
    }
  }

  // Tutorial Resources methods
  async getTutorialResources(tutorialId: string): Promise<TutorialResource[]> {
    try {
      return await db.select().from(tutorialResources).where(eq(tutorialResources.tutorialId, tutorialId)).orderBy(tutorialResources.order);
    } catch (error) {
      console.error('Error fetching tutorial resources:', error);
      throw new Error('Failed to fetch tutorial resources');
    }
  }

  async createTutorialResource(resource: Partial<InsertTutorialResource>): Promise<TutorialResource> {
    try {
      const result = await db.insert(tutorialResources).values(resource as any).returning();
      if (!result[0]) {
        throw new Error('Failed to create tutorial resource - no result returned');
      }
      return result[0];
    } catch (error) {
      console.error('Error creating tutorial resource:', error);
      throw new Error(`Failed to create tutorial resource: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

// ---------------------------------------------------------------------------
// In-memory storage — used when DATABASE_URL is not set (dev / test mode)
// ---------------------------------------------------------------------------
function uuid() {
  return crypto.randomUUID();
}
function now() {
  return new Date();
}

export class MemStorage implements IStorage {
  private _users: User[] = [];
  private _ragDocs: RagDocument[] = [];
  private _mcpServers: McpServer[] = [];
  private _a2aAgents: A2aAgent[] = [];
  private _conversations: DeepseekConversation[] = [];
  private _blueprints: BlueprintPrompt[] = [];
  private _templates: Template[] = [];
  private _ragQueries: RagQuery[] = [];
  private _mcpExecs: McpToolExecution[] = [];
  private _a2aTasks: A2aTask[] = [];
  private _metrics: SystemMetric[] = [];
  private _integrations: IntegrationStatus[] = [];
  private _prefs: UserPreferences[] = [];
  private _events: AnalyticsEvent[] = [];
  private _tutCategories: TutorialCategory[] = [];
  private _learningPaths: LearningPath[] = [];
  private _tutorials: Tutorial[] = [];
  private _tutModules: TutorialModule[] = [];
  private _progress: UserProgress[] = [];
  private _resources: TutorialResource[] = [];

  async getUser(id: number) { return this._users.find(u => u.id === id); }
  async getUserByUsername(username: string) { return this._users.find(u => u.username === username); }
  async createUser(user: InsertUser): Promise<User> {
    const u = { ...user, id: this._users.length + 1 } as User;
    this._users.push(u); return u;
  }

  async getRagDocuments() { return [...this._ragDocs]; }
  async createRagDocument(doc: Partial<RagDocument>): Promise<RagDocument> {
    const d = { id: uuid(), title: '', content: '', metadata: null, embedding: null, createdAt: now(), updatedAt: now(), ...doc } as RagDocument;
    this._ragDocs.push(d); return d;
  }
  async searchRagDocuments(query: string, limit = 10) {
    const q = query.toLowerCase();
    return this._ragDocs.filter(d => d.title.toLowerCase().includes(q) || d.content.toLowerCase().includes(q)).slice(0, limit);
  }
  async deleteRagDocument(id: string) { this._ragDocs = this._ragDocs.filter(d => d.id !== id); }

  async getMcpServers() { return [...this._mcpServers]; }
  async createMcpServer(server: Partial<McpServer>): Promise<McpServer> {
    const s = { id: uuid(), name: '', transport: 'http', status: 'inactive', endpoint: null, capabilities: null, protocolVersion: null, command: null, createdAt: now(), updatedAt: now(), ...server } as McpServer;
    this._mcpServers.push(s); return s;
  }
  async updateMcpServerStatus(id: string, status: string) {
    const s = this._mcpServers.find(s => s.id === id); if (s) s.status = status;
  }

  async getA2aAgents() { return [...this._a2aAgents]; }
  async createA2aAgent(agent: Partial<A2aAgent>): Promise<A2aAgent> {
    const a = { id: uuid(), name: '', status: 'inactive', description: null, capabilities: null, endpoint: null, agentCard: null, createdAt: now(), updatedAt: now(), ...agent } as A2aAgent;
    this._a2aAgents.push(a); return a;
  }
  async updateA2aAgentStatus(id: string, status: string) {
    const a = this._a2aAgents.find(a => a.id === id); if (a) a.status = status;
  }

  async getDeepseekConversations(sessionId: string) {
    return this._conversations.filter(c => c.sessionId === sessionId);
  }
  async createDeepseekConversation(conversation: Partial<DeepseekConversation>): Promise<DeepseekConversation> {
    const c = { id: uuid(), sessionId: '', messages: [], reasoningSteps: null, model: null, temperature: null, maxSteps: null, confidence: null, processingTimeMs: null, createdAt: now(), updatedAt: now(), ...conversation } as DeepseekConversation;
    this._conversations.push(c); return c;
  }

  async getBlueprintPrompts() { return [...this._blueprints]; }
  async getBlueprintPrompt(id: string) { return this._blueprints.find(b => b.id === id); }
  async createBlueprintPrompt(prompt: Partial<InsertBlueprintPrompt>): Promise<BlueprintPrompt> {
    const b = { id: uuid(), userPrompt: '', generatedBlueprint: '', reasoningContent: null, estimatedBuildTime: null, complexity: null, suggestedComponents: null, mcpEndpoints: null, a2aProtocols: null, ragPipeline: null, tokensUsed: null, modelUsed: 'deepseek-reasoner', temperature: 0.7, sessionId: null, createdAt: now(), updatedAt: now(), ...prompt } as BlueprintPrompt;
    this._blueprints.push(b); return b;
  }
  async updateBlueprintPrompt(id: string, prompt: Partial<BlueprintPrompt>) {
    const i = this._blueprints.findIndex(b => b.id === id);
    if (i !== -1) this._blueprints[i] = { ...this._blueprints[i], ...prompt };
  }

  async getTemplates(category?: string) {
    return category ? this._templates.filter(t => t.category === category) : [...this._templates];
  }
  async getTemplate(id: string) { return this._templates.find(t => t.id === id); }
  async createTemplate(template: Partial<InsertTemplate>): Promise<Template> {
    const t = { id: uuid(), name: '', category: '', content: '', description: null, metadata: null, tags: null, isPublic: false, downloadCount: 0, rating: 0, createdAt: now(), updatedAt: now(), ...template } as Template;
    this._templates.push(t); return t;
  }
  async updateTemplate(id: string, template: Partial<Template>) {
    const i = this._templates.findIndex(t => t.id === id);
    if (i !== -1) this._templates[i] = { ...this._templates[i], ...template };
  }
  async deleteTemplate(id: string) { this._templates = this._templates.filter(t => t.id !== id); }

  async getRagQueries(sessionId?: string) {
    return sessionId ? this._ragQueries.filter(q => q.sessionId === sessionId) : [...this._ragQueries];
  }
  async createRagQuery(query: Partial<InsertRagQuery>): Promise<RagQuery> {
    const q = { id: uuid(), query: '', totalFound: 0, processingTimeMs: null, relevanceScore: null, feedbackScore: null, sessionId: null, createdAt: now(), ...query } as RagQuery;
    this._ragQueries.push(q); return q;
  }

  async getMcpToolExecutions(serverId?: string) {
    return serverId ? this._mcpExecs.filter(e => e.serverId === serverId) : [...this._mcpExecs];
  }
  async createMcpToolExecution(execution: Partial<InsertMcpToolExecution>): Promise<McpToolExecution> {
    const e = { id: uuid(), toolName: '', serverId: null, status: 'completed', executionTimeMs: null, inputParams: null, outputData: null, errorMessage: null, createdAt: now(), ...execution } as McpToolExecution;
    this._mcpExecs.push(e); return e;
  }

  async getA2aTasks(agentId?: string) {
    return agentId ? this._a2aTasks.filter(t => t.agentId === agentId) : [...this._a2aTasks];
  }
  async createA2aTask(task: Partial<InsertA2aTask>): Promise<A2aTask> {
    const t = { id: uuid(), taskType: '', agentId: null, status: 'pending', metadata: null, complexityScore: null, result: null, createdAt: now(), completedAt: null, ...task } as A2aTask;
    this._a2aTasks.push(t); return t;
  }
  async updateA2aTaskStatus(id: string, status: string, result?: any) {
    const t = this._a2aTasks.find(t => t.id === id);
    if (t) { t.status = status; if (result !== undefined) t.result = result; }
  }

  async getSystemMetrics(category?: string) {
    return category ? this._metrics.filter(m => m.category === category) : [...this._metrics];
  }
  async createSystemMetric(metric: Partial<InsertSystemMetric>): Promise<SystemMetric> {
    const m = { id: uuid(), metricName: '', value: 0, category: '', timestamp: now(), ...metric } as SystemMetric;
    this._metrics.push(m); return m;
  }

  async getIntegrationStatus() { return [...this._integrations]; }
  async updateIntegrationStatus(serviceName: string, status: Partial<IntegrationStatus>) {
    const i = this._integrations.findIndex(s => s.serviceName === serviceName);
    if (i !== -1) { this._integrations[i] = { ...this._integrations[i], ...status }; }
    else { this._integrations.push({ id: uuid(), serviceName, status: 'unknown', lastCheck: now(), responseTimeMs: null, errorCount: 0, lastError: null, ...status } as IntegrationStatus); }
  }

  async getUserPreferences(userId: number) { return this._prefs.find(p => p.userId === userId); }
  async updateUserPreferences(userId: number, preferences: Partial<InsertUserPreferences>) {
    const i = this._prefs.findIndex(p => p.userId === userId);
    if (i !== -1) { this._prefs[i] = { ...this._prefs[i], ...preferences }; }
    else { this._prefs.push({ id: uuid(), userId, preferences: {}, theme: 'dark', language: 'en', createdAt: now(), updatedAt: now(), ...preferences } as UserPreferences); }
  }

  async createAnalyticsEvent(event: Partial<InsertAnalyticsEvent>): Promise<AnalyticsEvent> {
    const e = { id: uuid(), eventType: '', sessionId: '', userId: null, eventData: null, timestamp: now(), ...event } as AnalyticsEvent;
    this._events.push(e); return e;
  }
  async getAnalyticsEvents(sessionId?: string, eventType?: string) {
    return this._events.filter(e =>
      (!sessionId || e.sessionId === sessionId) &&
      (!eventType || e.eventType === eventType)
    );
  }

  async getTutorialCategories() { return [...this._tutCategories]; }
  async createTutorialCategory(category: Partial<InsertTutorialCategory>): Promise<TutorialCategory> {
    const c = { id: uuid(), name: '', slug: '', description: null, icon: null, order: 0, createdAt: now(), updatedAt: now(), ...category } as TutorialCategory;
    this._tutCategories.push(c); return c;
  }

  async getLearningPaths(categoryId?: string) {
    return categoryId ? this._learningPaths.filter(p => p.categoryId === categoryId) : [...this._learningPaths];
  }
  async getLearningPath(id: string) { return this._learningPaths.find(p => p.id === id); }
  async createLearningPath(path: Partial<InsertLearningPath>): Promise<LearningPath> {
    const p = { id: uuid(), title: '', difficulty: 'beginner', slug: '', description: null, duration: null, moduleCount: 0, categoryId: null, order: 0, isActive: true, prerequisites: null, createdAt: now(), updatedAt: now(), ...path } as LearningPath;
    this._learningPaths.push(p); return p;
  }
  async updateLearningPath(id: string, path: Partial<LearningPath>) {
    const i = this._learningPaths.findIndex(p => p.id === id);
    if (i !== -1) this._learningPaths[i] = { ...this._learningPaths[i], ...path };
  }

  async getTutorials(categoryId?: string, learningPathId?: string) {
    return this._tutorials.filter(t =>
      (!categoryId || t.categoryId === categoryId) &&
      (!learningPathId || t.learningPathId === learningPathId)
    );
  }
  async getTutorial(id: string) { return this._tutorials.find(t => t.id === id); }
  async createTutorial(tutorial: Partial<InsertTutorial>): Promise<Tutorial> {
    const t = { id: uuid(), title: '', type: 'interactive', difficulty: 'beginner', slug: '', description: null, duration: null, content: null, codeExamples: null, keyFeatures: null, learningObjectives: null, technology: null, categoryId: null, learningPathId: null, order: 0, isActive: true, estimatedMinutes: 60, createdAt: now(), updatedAt: now(), ...tutorial } as Tutorial;
    this._tutorials.push(t); return t;
  }
  async updateTutorial(id: string, tutorial: Partial<Tutorial>) {
    const i = this._tutorials.findIndex(t => t.id === id);
    if (i !== -1) this._tutorials[i] = { ...this._tutorials[i], ...tutorial };
  }
  async deleteTutorial(id: string) { this._tutorials = this._tutorials.filter(t => t.id !== id); }

  async getTutorialModules(tutorialId?: string, learningPathId?: string) {
    return this._tutModules.filter(m =>
      (!tutorialId || m.tutorialId === tutorialId) &&
      (!learningPathId || m.learningPathId === learningPathId)
    );
  }
  async createTutorialModule(module: Partial<InsertTutorialModule>): Promise<TutorialModule> {
    const m = { id: uuid(), title: '', tutorialId: null, learningPathId: null, description: null, content: null, codeExample: null, order: 0, duration: null, isCompleted: false, createdAt: now(), updatedAt: now(), ...module } as TutorialModule;
    this._tutModules.push(m); return m;
  }
  async updateTutorialModule(id: string, module: Partial<TutorialModule>) {
    const i = this._tutModules.findIndex(m => m.id === id);
    if (i !== -1) this._tutModules[i] = { ...this._tutModules[i], ...module };
  }

  async getUserProgress(userId: number, tutorialId?: string, learningPathId?: string) {
    return this._progress.filter(p =>
      p.userId === userId &&
      (!tutorialId || p.tutorialId === tutorialId) &&
      (!learningPathId || p.learningPathId === learningPathId)
    );
  }
  async createUserProgress(progress: Partial<InsertUserProgress>): Promise<UserProgress> {
    const p = { id: uuid(), userId: null, tutorialId: null, learningPathId: null, moduleId: null, status: 'not_started', progressPercentage: 0, timeSpent: 0, completedAt: null, createdAt: now(), updatedAt: now(), ...progress } as UserProgress;
    this._progress.push(p); return p;
  }
  async updateUserProgress(id: string, progress: Partial<UserProgress>) {
    const i = this._progress.findIndex(p => p.id === id);
    if (i !== -1) this._progress[i] = { ...this._progress[i], ...progress };
  }

  async getTutorialResources(tutorialId: string) {
    return this._resources.filter(r => r.tutorialId === tutorialId);
  }
  async createTutorialResource(resource: Partial<InsertTutorialResource>): Promise<TutorialResource> {
    const r = { id: uuid(), tutorialId: null, title: '', type: 'link', url: null, description: null, order: 0, createdAt: now(), ...resource } as TutorialResource;
    this._resources.push(r); return r;
  }
}

export const storage: IStorage = process.env.DATABASE_URL
  ? new PostgresStorage()
  : new MemStorage();
