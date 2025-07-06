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

// Templates table for managing reusable templates
export const templates = pgTable("templates", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  content: text("content").notNull(),
  metadata: json("metadata"),
  tags: json("tags"),
  isPublic: boolean("is_public").default(false),
  downloadCount: integer("download_count").default(0),
  rating: real("rating").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// RAG Queries table for tracking search history and performance
export const ragQueries = pgTable("rag_queries", {
  id: uuid("id").defaultRandom().primaryKey(),
  query: text("query").notNull(),
  totalFound: integer("total_found").default(0),
  processingTimeMs: integer("processing_time_ms"),
  relevanceScore: real("relevance_score"),
  feedbackScore: real("feedback_score"),
  sessionId: text("session_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

// MCP Tool Executions table for tracking tool usage
export const mcpToolExecutions = pgTable("mcp_tool_executions", {
  id: uuid("id").defaultRandom().primaryKey(),
  toolName: text("tool_name").notNull(),
  serverId: uuid("server_id").references(() => mcpServers.id),
  status: text("status").notNull(),
  executionTimeMs: integer("execution_time_ms"),
  inputParams: json("input_params"),
  outputData: json("output_data"),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").defaultNow(),
});

// A2A Tasks table for agent-to-agent task management
export const a2aTasks = pgTable("a2a_tasks", {
  id: uuid("id").defaultRandom().primaryKey(),
  taskType: text("task_type").notNull(),
  agentId: uuid("agent_id").references(() => a2aAgents.id),
  status: text("status").notNull().default("pending"),
  metadata: json("metadata"),
  complexityScore: integer("complexity_score"),
  result: json("result"),
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

// System Metrics table for performance monitoring
export const systemMetrics = pgTable("system_metrics", {
  id: uuid("id").defaultRandom().primaryKey(),
  metricName: text("metric_name").notNull(),
  value: real("value").notNull(),
  category: text("category").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Integration Status table for external service monitoring
export const integrationStatus = pgTable("integration_status", {
  id: uuid("id").defaultRandom().primaryKey(),
  serviceName: text("service_name").notNull().unique(),
  status: text("status").notNull(),
  lastCheck: timestamp("last_check").defaultNow(),
  responseTimeMs: integer("response_time_ms"),
  errorCount: integer("error_count").default(0),
  lastError: text("last_error"),
});

// User Preferences table for personalization
export const userPreferences = pgTable("user_preferences", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: integer("user_id").references(() => users.id),
  preferences: json("preferences").notNull(),
  theme: text("theme").default("dark"),
  language: text("language").default("en"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Analytics Events table for user behavior tracking
export const analyticsEvents = pgTable("analytics_events", {
  id: uuid("id").defaultRandom().primaryKey(),
  eventType: text("event_type").notNull(),
  userId: integer("user_id").references(() => users.id),
  sessionId: text("session_id").notNull(),
  eventData: json("event_data"),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Tutorial Categories table
export const tutorialCategories = pgTable("tutorial_categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  icon: text("icon"),
  slug: text("slug").notNull().unique(),
  order: integer("order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Learning Paths table
export const learningPaths = pgTable("learning_paths", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  difficulty: text("difficulty").notNull(), // 'beginner', 'intermediate', 'advanced'
  duration: text("duration"), // e.g., '4-6 hours'
  moduleCount: integer("module_count").default(0),
  categoryId: uuid("category_id").references(() => tutorialCategories.id),
  slug: text("slug").notNull().unique(),
  order: integer("order").default(0),
  isActive: boolean("is_active").default(true),
  prerequisites: json("prerequisites"), // Array of prerequisite path IDs
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Tutorials table
export const tutorials = pgTable("tutorials", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  type: text("type").notNull(), // 'interactive', 'deep_dive', 'project_based'
  difficulty: text("difficulty").notNull(),
  duration: text("duration"),
  content: text("content"), // Markdown content
  codeExamples: json("code_examples"), // Array of code examples
  keyFeatures: json("key_features"), // Array of key features
  learningObjectives: json("learning_objectives"), // Array of learning objectives
  technology: text("technology"), // Main technology (React, Vue, etc.)
  categoryId: uuid("category_id").references(() => tutorialCategories.id),
  learningPathId: uuid("learning_path_id").references(() => learningPaths.id),
  slug: text("slug").notNull().unique(),
  order: integer("order").default(0),
  isActive: boolean("is_active").default(true),
  estimatedMinutes: integer("estimated_minutes").default(60),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Tutorial Modules table
export const tutorialModules = pgTable("tutorial_modules", {
  id: uuid("id").defaultRandom().primaryKey(),
  tutorialId: uuid("tutorial_id").references(() => tutorials.id),
  learningPathId: uuid("learning_path_id").references(() => learningPaths.id),
  title: text("title").notNull(),
  description: text("description"),
  content: text("content"), // Markdown content
  codeExample: text("code_example"),
  order: integer("order").default(0),
  duration: text("duration"), // e.g., '15 minutes'
  isCompleted: boolean("is_completed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User Progress table
export const userProgress = pgTable("user_progress", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: integer("user_id").references(() => users.id),
  tutorialId: uuid("tutorial_id").references(() => tutorials.id),
  learningPathId: uuid("learning_path_id").references(() => learningPaths.id),
  moduleId: uuid("module_id").references(() => tutorialModules.id),
  status: text("status").notNull().default("not_started"), // 'not_started', 'in_progress', 'completed'
  progressPercentage: integer("progress_percentage").default(0),
  timeSpent: integer("time_spent").default(0), // in minutes
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Tutorial Resources table
export const tutorialResources = pgTable("tutorial_resources", {
  id: uuid("id").defaultRandom().primaryKey(),
  tutorialId: uuid("tutorial_id").references(() => tutorials.id),
  title: text("title").notNull(),
  type: text("type").notNull(), // 'link', 'document', 'video', 'github'
  url: text("url"),
  description: text("description"),
  order: integer("order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
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
export const insertTemplateSchema = createInsertSchema(templates);
export const insertRagQuerySchema = createInsertSchema(ragQueries);
export const insertMcpToolExecutionSchema = createInsertSchema(mcpToolExecutions);
export const insertA2aTaskSchema = createInsertSchema(a2aTasks);
export const insertSystemMetricSchema = createInsertSchema(systemMetrics);
export const insertIntegrationStatusSchema = createInsertSchema(integrationStatus);
export const insertUserPreferencesSchema = createInsertSchema(userPreferences);
export const insertAnalyticsEventSchema = createInsertSchema(analyticsEvents);
export const insertTutorialCategorySchema = createInsertSchema(tutorialCategories);
export const insertLearningPathSchema = createInsertSchema(learningPaths);
export const insertTutorialSchema = createInsertSchema(tutorials);
export const insertTutorialModuleSchema = createInsertSchema(tutorialModules);
export const insertUserProgressSchema = createInsertSchema(userProgress);
export const insertTutorialResourceSchema = createInsertSchema(tutorialResources);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type RagDocument = typeof ragDocuments.$inferSelect;
export type McpServer = typeof mcpServers.$inferSelect;
export type A2aAgent = typeof a2aAgents.$inferSelect;
export type DeepseekConversation = typeof deepseekConversations.$inferSelect;
export type BlueprintPrompt = typeof blueprintPrompts.$inferSelect;
export type InsertBlueprintPrompt = z.infer<typeof insertBlueprintPromptSchema>;
export type Template = typeof templates.$inferSelect;
export type InsertTemplate = z.infer<typeof insertTemplateSchema>;
export type RagQuery = typeof ragQueries.$inferSelect;
export type InsertRagQuery = z.infer<typeof insertRagQuerySchema>;
export type McpToolExecution = typeof mcpToolExecutions.$inferSelect;
export type InsertMcpToolExecution = z.infer<typeof insertMcpToolExecutionSchema>;
export type A2aTask = typeof a2aTasks.$inferSelect;
export type InsertA2aTask = z.infer<typeof insertA2aTaskSchema>;
export type SystemMetric = typeof systemMetrics.$inferSelect;
export type InsertSystemMetric = z.infer<typeof insertSystemMetricSchema>;
export type IntegrationStatus = typeof integrationStatus.$inferSelect;
export type InsertIntegrationStatus = z.infer<typeof insertIntegrationStatusSchema>;
export type UserPreferences = typeof userPreferences.$inferSelect;
export type InsertUserPreferences = z.infer<typeof insertUserPreferencesSchema>;
export type AnalyticsEvent = typeof analyticsEvents.$inferSelect;
export type InsertAnalyticsEvent = z.infer<typeof insertAnalyticsEventSchema>;
export type TutorialCategory = typeof tutorialCategories.$inferSelect;
export type InsertTutorialCategory = z.infer<typeof insertTutorialCategorySchema>;
export type LearningPath = typeof learningPaths.$inferSelect;
export type InsertLearningPath = z.infer<typeof insertLearningPathSchema>;
export type Tutorial = typeof tutorials.$inferSelect;
export type InsertTutorial = z.infer<typeof insertTutorialSchema>;
export type TutorialModule = typeof tutorialModules.$inferSelect;
export type InsertTutorialModule = z.infer<typeof insertTutorialModuleSchema>;
export type UserProgress = typeof userProgress.$inferSelect;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type TutorialResource = typeof tutorialResources.$inferSelect;
export type InsertTutorialResource = z.infer<typeof insertTutorialResourceSchema>;
