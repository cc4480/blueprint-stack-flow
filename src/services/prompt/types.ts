
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

// Extended types for DeepSeek Reasoner
export interface DeepSeekDelta {
  reasoning_content?: string;
  content?: string;
}

export interface DeepSeekChoice {
  delta?: DeepSeekDelta;
}

export interface DeepSeekChunk {
  choices: DeepSeekChoice[];
}

export type ConversationMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};
