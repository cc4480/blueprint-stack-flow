// API client to replace Supabase calls with server-side endpoints

const API_BASE = '/api';

export const api = {
  // RAG Documents
  ragDocuments: {
    getAll: async () => {
      const response = await fetch(`${API_BASE}/rag/documents`);
      return response.json();
    },
    create: async (document: any) => {
      const response = await fetch(`${API_BASE}/rag/documents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(document),
      });
      return response.json();
    },
  },

  // MCP Servers
  mcpServers: {
    getAll: async () => {
      const response = await fetch(`${API_BASE}/mcp/servers`);
      return response.json();
    },
    create: async (server: any) => {
      const response = await fetch(`${API_BASE}/mcp/servers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(server),
      });
      return response.json();
    },
    updateStatus: async (id: string, status: string) => {
      const response = await fetch(`${API_BASE}/mcp/servers/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      return response.json();
    },
  },

  // A2A Agents
  a2aAgents: {
    getAll: async () => {
      const response = await fetch(`${API_BASE}/a2a/agents`);
      return response.json();
    },
    create: async (agent: any) => {
      const response = await fetch(`${API_BASE}/a2a/agents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(agent),
      });
      return response.json();
    },
  },

  // Templates API
  templates: {
    getAll: async () => {
      const response = await fetch(`${API_BASE}/templates`);
      return response.json();
    },
    getById: async (id: string) => {
      const response = await fetch(`${API_BASE}/templates/${id}`);
      return response.json();
    },
    download: async (id: string) => {
      const response = await fetch(`${API_BASE}/templates/${id}/download`);
      return response.blob();
    },
    use: async (id: string, replName?: string) => {
      const response = await fetch(`${API_BASE}/templates/${id}/use`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ replName }),
      });
      return response.json();
    },
  },

  // DeepSeek Conversations API
  deepseek: {
    getConversations: async (sessionId: string) => {
      const response = await fetch(`${API_BASE}/deepseek/conversations/${sessionId}`);
      return response.json();
    },
    createConversation: async (conversation: any) => {
      const response = await fetch(`${API_BASE}/deepseek/conversations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(conversation),
      });
      return response.json();
    },
    reason: async (prompt: string, systemPrompt?: string, options?: any) => {
      const response = await fetch(`${API_BASE}/deepseek/reason`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-session-id': `session-${Date.now()}`
        },
        body: JSON.stringify({ prompt, systemPrompt, ...options }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response from DeepSeek');
      }
      return data;
    },
  },

  // RAG Queries API
  ragQueries: {
    getAll: async (sessionId?: string) => {
      const url = sessionId ? `${API_BASE}/rag-queries?sessionId=${sessionId}` : `${API_BASE}/rag-queries`;
      const response = await fetch(url);
      return response.json();
    },
    create: async (query: any) => {
      const response = await fetch(`${API_BASE}/rag-queries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(query),
      });
      return response.json();
    },
  },

  // MCP Tool Executions API
  mcpToolExecutions: {
    getAll: async (serverId?: string) => {
      const url = serverId ? `${API_BASE}/mcp-tool-executions?serverId=${serverId}` : `${API_BASE}/mcp-tool-executions`;
      const response = await fetch(url);
      return response.json();
    },
    create: async (execution: any) => {
      const response = await fetch(`${API_BASE}/mcp-tool-executions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(execution),
      });
      return response.json();
    },
  },

  // A2A Tasks API
  a2aTasks: {
    getAll: async (agentId?: string) => {
      const url = agentId ? `${API_BASE}/a2a-tasks?agentId=${agentId}` : `${API_BASE}/a2a-tasks`;
      const response = await fetch(url);
      return response.json();
    },
    create: async (task: any) => {
      const response = await fetch(`${API_BASE}/a2a-tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      });
      return response.json();
    },
    updateStatus: async (id: string, status: string, result?: any) => {
      const response = await fetch(`${API_BASE}/a2a-tasks/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, result }),
      });
      return response.json();
    },
  },

  // System Metrics API
  systemMetrics: {
    getAll: async (category?: string, startDate?: string, endDate?: string) => {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      const url = `${API_BASE}/system-metrics${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await fetch(url);
      return response.json();
    },
    create: async (metric: any) => {
      const response = await fetch(`${API_BASE}/system-metrics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metric),
      });
      return response.json();
    },
  },

  // Integration Status API
  integrationStatus: {
    getAll: async () => {
      const response = await fetch(`${API_BASE}/integration-status`);
      return response.json();
    },
    update: async (serviceName: string, status: any) => {
      const response = await fetch(`${API_BASE}/integration-status/${serviceName}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(status),
      });
      return response.json();
    },
  },

  // User Preferences API
  userPreferences: {
    get: async (userId: number) => {
      const response = await fetch(`${API_BASE}/user-preferences/${userId}`);
      return response.json();
    },
    update: async (userId: number, preferences: any) => {
      const response = await fetch(`${API_BASE}/user-preferences/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences),
      });
      return response.json();
    },
  },

  // Analytics API
  analytics: {
    getEvents: async (sessionId?: string, eventType?: string) => {
      const params = new URLSearchParams();
      if (sessionId) params.append('sessionId', sessionId);
      if (eventType) params.append('eventType', eventType);
      const url = `${API_BASE}/analytics/events${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await fetch(url);
      return response.json();
    },
    createEvent: async (event: any) => {
      const response = await fetch(`${API_BASE}/analytics/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
      });
      return response.json();
    },
  },

  // Search API
  search: {
    ragDocuments: async (query: string, limit?: number) => {
      const params = new URLSearchParams({ q: query });
      if (limit) params.append('limit', limit.toString());
      const response = await fetch(`${API_BASE}/search/rag-documents?${params.toString()}`);
      return response.json();
    },
  },

  // Admin API
  admin: {
    seedDatabase: async () => {
      const response = await fetch(`${API_BASE}/admin/seed-database`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      return response.json();
    },
  },
};