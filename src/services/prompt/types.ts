
export interface PromptGenerationRequest {
  appType: string;
  dataSource: string;
  features: string[];
  platform: string;
  additionalContext?: string;
}

export interface PromptGenerationResult {
  prompt: string;
  estimatedBuildTime: string;
  complexity: string;
  suggestedComponents: string[];
  reasoningContent?: string;
  mcpEndpoints?: string[];
  a2aProtocols?: string[];
  ragPipeline?: string;
}

// Extended types for DeepSeek Reasoner - Updated according to official docs
export interface DeepSeekDelta {
  reasoning_content?: string;
  content?: string;
}

export interface DeepSeekChoice {
  delta?: DeepSeekDelta;
  finish_reason?: string;
}

export interface DeepSeekChunk {
  choices: DeepSeekChoice[];
  id?: string;
  object?: string;
  created?: number;
  model?: string;
}

export type ConversationMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
  // Note: reasoning_content should NOT be included in conversation history
};
