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

  // DeepSeek Conversations
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
};