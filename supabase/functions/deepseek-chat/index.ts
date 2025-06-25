
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, systemPrompt, includeContext = true } = await req.json();
    
    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    let contextData = '';
    
    if (includeContext) {
      // Fetch RAG 2.0 documents
      const { data: ragDocs } = await supabase
        .from('rag_documents')
        .select('content, metadata, source, tags')
        .limit(10);

      // Fetch MCP servers and capabilities  
      const { data: mcpServers } = await supabase
        .from('mcp_servers')
        .select('name, status, capabilities, transport, endpoint')
        .eq('status', 'connected');

      // Fetch A2A agents and recent tasks
      const { data: a2aAgents } = await supabase
        .from('a2a_agents')
        .select('name, description, capabilities, status')
        .eq('status', 'online');

      const { data: recentTasks } = await supabase
        .from('a2a_tasks')
        .select('status, metadata, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      // Fetch recent RAG queries for insights
      const { data: recentQueries } = await supabase
        .from('rag_queries')
        .select('query, total_found, processing_time_ms, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      // Fetch MCP tool executions
      const { data: toolExecutions } = await supabase
        .from('mcp_tool_executions')
        .select('tool_name, status, execution_time_ms, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      // Build comprehensive context
      contextData = `
=== REAL-TIME SYSTEM CONTEXT ===

RAG 2.0 KNOWLEDGE BASE:
${ragDocs?.map(doc => `- Source: ${doc.source}\n  Content: ${doc.content?.substring(0, 200)}...\n  Tags: ${doc.tags?.join(', ')}`).join('\n') || 'No RAG documents available'}

MCP PROTOCOL SERVERS:
${mcpServers?.map(server => `- ${server.name} (${server.status})\n  Transport: ${server.transport}\n  Capabilities: ${JSON.stringify(server.capabilities)}`).join('\n') || 'No MCP servers connected'}

A2A AGENT NETWORK:
${a2aAgents?.map(agent => `- ${agent.name}: ${agent.description}\n  Status: ${agent.status}\n  Capabilities: ${JSON.stringify(agent.capabilities)}`).join('\n') || 'No A2A agents online'}

RECENT A2A TASKS:
${recentTasks?.map(task => `- Status: ${task.status} (${task.created_at})\n  Metadata: ${JSON.stringify(task.metadata)}`).join('\n') || 'No recent tasks'}

RECENT RAG QUERIES:
${recentQueries?.map(q => `- "${q.query}" → ${q.total_found} results (${q.processing_time_ms}ms)`).join('\n') || 'No recent queries'}

RECENT MCP EXECUTIONS:
${toolExecutions?.map(exec => `- ${exec.tool_name}: ${exec.status} (${exec.execution_time_ms}ms)`).join('\n') || 'No recent executions'}

=== END SYSTEM CONTEXT ===
`;
    }

    // Enhanced system prompt with database context
    const enhancedSystemPrompt = `${systemPrompt}

${contextData}

You now have access to real-time data from the NoCodeLos Blueprint Stack system including:
- RAG 2.0 knowledge base documents and query analytics
- MCP (Model Context Protocol) server configurations and tool executions  
- A2A (Agent-to-Agent) protocol network and task coordination
- System performance metrics and integration status

Use this context to provide accurate, up-to-date responses about the system state, capabilities, and recent activities. Reference specific data points when relevant.`;

    // Prepare messages for DeepSeek
    const deepseekMessages = [
      { role: 'system', content: enhancedSystemPrompt },
      ...messages
    ];

    console.log('🚀 Starting DeepSeek chat with database context');

    // Stream response from DeepSeek
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('DEEPSEEK_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: deepseekMessages,
        temperature: 0.7,
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API request failed: ${response.status} ${response.statusText}`);
    }

    // Return streaming response
    return new Response(response.body, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('❌ DeepSeek chat error:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Internal server error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
