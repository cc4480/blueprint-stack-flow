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
let db: ReturnType<typeof drizzle>;

try {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is required');
  }
  
  client = postgres(process.env.DATABASE_URL, {
    max: 10, // Maximum connections
    idle_timeout: 60, // Close idle connections after 60 seconds
    max_lifetime: 60 * 30, // Close connections after 30 minutes
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

export const storage = new PostgresStorage();
