import { pgTable, text, serial, integer, boolean, timestamp, uuid, json, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// RAG Documents table
export const ragDocuments = pgTable("rag_documents", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  metadata: json("metadata"),
  embedding: text("embedding"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// MCP Servers table
export const mcpServers = pgTable("mcp_servers", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  endpoint: text("endpoint"),
  status: text("status").notNull().default("inactive"),
  transport: text("transport").notNull(),
  capabilities: json("capabilities"),
  protocolVersion: text("protocol_version"),
  command: text("command"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// A2A Agents table
export const a2aAgents = pgTable("a2a_agents", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  status: text("status").notNull().default("inactive"),
  capabilities: json("capabilities"),
  endpoint: text("endpoint"),
  agentCard: json("agent_card"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// DeepSeek Conversations table
export const deepseekConversations = pgTable("deepseek_conversations", {
  id: uuid("id").defaultRandom().primaryKey(),
  sessionId: text("session_id").notNull(),
  messages: json("messages").notNull(),
  reasoningSteps: json("reasoning_steps"),
  model: text("model"),
  temperature: real("temperature"),
  maxSteps: integer("max_steps"),
  confidence: integer("confidence"),
  processingTimeMs: integer("processing_time_ms"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Blueprint Prompts table for automatic saving
export const blueprintPrompts = pgTable("blueprint_prompts", {
  id: uuid("id").defaultRandom().primaryKey(),
  userPrompt: text("user_prompt").notNull(),
  generatedBlueprint: text("generated_blueprint").notNull(),
  reasoningContent: text("reasoning_content"),
  estimatedBuildTime: text("estimated_build_time"),
  complexity: text("complexity"),
  suggestedComponents: json("suggested_components"),
  mcpEndpoints: json("mcp_endpoints"),
  a2aProtocols: json("a2a_protocols"),
  ragPipeline: text("rag_pipeline"),
  tokensUsed: integer("tokens_used"),
  modelUsed: text("model_used").default("deepseek-reasoner"),
  temperature: real("temperature").default(0.7),
  sessionId: text("session_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertRagDocumentSchema = createInsertSchema(ragDocuments);
export const insertMcpServerSchema = createInsertSchema(mcpServers);
export const insertA2aAgentSchema = createInsertSchema(a2aAgents);
export const insertDeepseekConversationSchema = createInsertSchema(deepseekConversations);
export const insertBlueprintPromptSchema = createInsertSchema(blueprintPrompts);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type RagDocument = typeof ragDocuments.$inferSelect;
export type McpServer = typeof mcpServers.$inferSelect;
export type A2aAgent = typeof a2aAgents.$inferSelect;
export type DeepseekConversation = typeof deepseekConversations.$inferSelect;
export type BlueprintPrompt = typeof blueprintPrompts.$inferSelect;
export type InsertBlueprintPrompt = z.infer<typeof insertBlueprintPromptSchema>;
