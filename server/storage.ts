import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { 
  users, 
  ragDocuments, 
  mcpServers, 
  a2aAgents, 
  deepseekConversations,
  type User, 
  type InsertUser,
  type RagDocument,
  type McpServer,
  type A2aAgent,
  type DeepseekConversation
} from "@shared/schema";
import { eq } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client);

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
}

export class PostgresStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  // RAG Document methods
  async getRagDocuments(): Promise<RagDocument[]> {
    return await db.select().from(ragDocuments);
  }

  async createRagDocument(doc: Partial<RagDocument>): Promise<RagDocument> {
    const result = await db.insert(ragDocuments).values(doc as any).returning();
    return result[0];
  }

  // MCP Server methods
  async getMcpServers(): Promise<McpServer[]> {
    return await db.select().from(mcpServers);
  }

  async createMcpServer(server: Partial<McpServer>): Promise<McpServer> {
    const result = await db.insert(mcpServers).values(server as any).returning();
    return result[0];
  }

  async updateMcpServerStatus(id: string, status: string): Promise<void> {
    await db.update(mcpServers)
      .set({ status, updatedAt: new Date() })
      .where(eq(mcpServers.id, id));
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
}

export const storage = new PostgresStorage();
