
import { FormData } from './types';

export const assessComplexity = (featureCount: number): string => {
  if (featureCount <= 2) return 'Simple';
  if (featureCount <= 4) return 'Moderate';
  if (featureCount <= 6) return 'Complex';
  return 'Advanced';
};

export const estimateBuildTime = (featureCount: number, complexity: string): string => {
  const baseTime = {
    'Simple': 2,
    'Moderate': 5,
    'Complex': 10,
    'Advanced': 20
  };
  
  const days = baseTime[complexity as keyof typeof baseTime] || 5;
  return `${days}-${days + 3} days`;
};

export const generateComponentSuggestions = (formData: FormData): string[] => {
  const components = ['Header', 'Footer', 'Layout', 'MCPClient', 'A2AAgent', 'RAGRetriever'];
  
  if (formData.features.includes('auth')) {
    components.push('AuthProvider', 'LoginForm', 'SignupForm');
  }
  if (formData.features.includes('payments')) {
    components.push('PaymentForm', 'PricingCard', 'CheckoutFlow');
  }
  if (formData.features.includes('realtime')) {
    components.push('WebSocketProvider', 'LiveChat', 'NotificationCenter');
  }
  if (formData.features.includes('analytics')) {
    components.push('Dashboard', 'MetricsCard', 'ChartContainer');
  }
  if (formData.features.includes('search')) {
    components.push('SearchBar', 'FilterPanel', 'ResultsList');
  }
  
  return components;
};

export const generateMCPEndpoints = (formData: FormData): string[] => {
  const endpoints = ['/.well-known/mcp-manifest.json'];
  
  if (formData.features.includes('auth')) {
    endpoints.push('/mcp/auth-provider', '/mcp/user-management');
  }
  if (formData.features.includes('payments')) {
    endpoints.push('/mcp/payment-processor', '/mcp/billing-service');
  }
  if (formData.features.includes('realtime')) {
    endpoints.push('/mcp/websocket-server', '/mcp/notification-hub');
  }
  if (formData.features.includes('analytics')) {
    endpoints.push('/mcp/analytics-collector', '/mcp/metrics-aggregator');
  }
  
  endpoints.push('/mcp/rag-retriever', '/mcp/knowledge-indexer');
  return endpoints;
};

export const generateA2AProtocols = (formData: FormData): string[] => {
  const protocols = ['agent-discovery', 'task-coordination', 'message-exchange'];
  
  if (formData.features.includes('realtime')) {
    protocols.push('real-time-collaboration', 'live-updates');
  }
  if (formData.features.includes('analytics')) {
    protocols.push('data-aggregation', 'cross-agent-analytics');
  }
  
  protocols.push('rag-knowledge-sharing', 'distributed-reasoning');
  return protocols;
};

export const generateRAGPipeline = (): string => {
  const components = [
    'Document Ingestion → Chunking Strategy',
    'Embedding Generation → Vector Database',
    'Hybrid Search (Dense + Sparse)',
    'Re-ranking → Context Compression',
    'Query Enhancement → Response Generation'
  ];
  
  return components.join(' → ');
};
