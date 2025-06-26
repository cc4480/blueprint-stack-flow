
export interface FormData {
  appType: string;
  dataSource: string;
  features: string[];
  additionalRequirements: string;
}

export interface GeneratedResult {
  prompt: string;
  estimatedBuildTime: string;
  complexity: string;
  suggestedComponents: string[];
  reasoningContent?: string;
  mcpEndpoints?: string[];
  a2aProtocols?: string[];
  ragPipeline?: string;
}

export interface AppType {
  id: string;
  label: string;
  icon: string;
  description: string;
}

export interface DataSource {
  id: string;
  label: string;
  icon: string;
  description: string;
}

export interface Feature {
  id: string;
  label: string;
  category: string;
}

export interface ChatMessage {
  role: string;
  content: string;
}
