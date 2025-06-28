import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { cache } from "./cache";
import { 
  users, 
  ragDocuments, 
  mcpServers, 
  a2aAgents, 
  deepseekConversations,
  blueprintPrompts,
  type User, 
  type InsertUser,
  type RagDocument,
  type McpServer,
  type A2aAgent,
  type DeepseekConversation,
  type BlueprintPrompt,
  type InsertBlueprintPrompt
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

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
  
  // MCP Server methods
  getMcpServers(): Promise<McpServer[]>;
  createMcpServer(server: Partial<McpServer>): Promise<McpServer>;
  updateMcpServerStatus(id: string, status: string): Promise<void>;
  
  // A2A Agent methods
  getA2aAgents(): Promise<A2aAgent[]>;
  createA2aAgent(agent: Partial<A2aAgent>): Promise<A2aAgent>;
  
  // DeepSeek Conversation methods
  getDeepseekConversations(sessionId: string): Promise<DeepseekConversation[]>;
  createDeepseekConversation(conversation: Partial<DeepseekConversation>): Promise<DeepseekConversation>;
  
  // Blueprint Prompt methods
  getBlueprintPrompts(): Promise<BlueprintPrompt[]>;
  getBlueprintPrompt(id: string): Promise<BlueprintPrompt | undefined>;
  createBlueprintPrompt(prompt: Partial<InsertBlueprintPrompt>): Promise<BlueprintPrompt>;
  updateBlueprintPrompt(id: string, prompt: Partial<BlueprintPrompt>): Promise<void>;
}

export class PostgresStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    try {
      // Check cache first for high-performance reads
      const cached = cache.getUser(`${id}`);
      if (cached) {
        return cached;
      }

      const result = await db.select().from(users).where(eq(users.id, id));
      const user = result[0];
      
      // Cache the result for 30 minutes
      if (user) {
        cache.setUser(`${id}`, user);
      }
      
      return user;
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
}

export const storage = new PostgresStorage();
