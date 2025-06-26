
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
    const { messages, includeContext = true, maxTokens = 16384 } = await req.json();
    
    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    let contextData = '';
    
    if (includeContext) {
      console.log('🔍 Fetching comprehensive RAG 2.0, MCP, and A2A context...');
      
      // Fetch RAG 2.0 documents with expanded context
      const { data: ragDocs } = await supabase
        .from('rag_documents')
        .select('content, metadata, source, tags, created_at')
        .order('created_at', { ascending: false })
        .limit(20);

      // Fetch MCP servers and capabilities with detailed info
      const { data: mcpServers } = await supabase
        .from('mcp_servers')
        .select('name, status, capabilities, transport, endpoint, description, version')
        .eq('status', 'connected')
        .limit(15);

      // Fetch A2A agents with comprehensive details
      const { data: a2aAgents } = await supabase
        .from('a2a_agents')
        .select('name, description, capabilities, status, last_active, performance_metrics')
        .eq('status', 'online')
        .limit(15);

      // Fetch recent A2A tasks with detailed metadata
      const { data: recentTasks } = await supabase
        .from('a2a_tasks')
        .select('status, metadata, created_at, agent_id, task_type, complexity_score')
        .order('created_at', { ascending: false })
        .limit(10);

      // Fetch recent RAG queries with performance insights
      const { data: recentQueries } = await supabase
        .from('rag_queries')
        .select('query, total_found, processing_time_ms, created_at, relevance_score, feedback_score')
        .order('created_at', { ascending: false })
        .limit(10);

      // Fetch MCP tool executions with performance metrics
      const { data: toolExecutions } = await supabase
        .from('mcp_tool_executions')
        .select('tool_name, status, execution_time_ms, created_at, input_params, output_data')
        .order('created_at', { ascending: false })
        .limit(10);

      // Fetch system performance metrics
      const { data: systemMetrics } = await supabase
        .from('system_metrics')
        .select('metric_name, value, timestamp, category')
        .order('timestamp', { ascending: false })
        .limit(20);

      // Fetch integration status
      const { data: integrationStatus } = await supabase
        .from('integration_status')
        .select('service_name, status, last_check, response_time_ms, error_count')
        .order('last_check', { ascending: false });

      // Build comprehensive context with detailed sections
      contextData = `
=== COMPREHENSIVE REAL-TIME SYSTEM CONTEXT ===

📊 SYSTEM OVERVIEW:
- RAG 2.0 Pipeline: Advanced retrieval with hybrid search and context compression
- MCP Protocol: Model Context Protocol for seamless tool integration
- A2A Network: Agent-to-Agent communication for distributed intelligence
- DeepSeek Integration: Real-time streaming with chain-of-thought reasoning

🔍 RAG 2.0 KNOWLEDGE BASE (${ragDocs?.length || 0} documents):
${ragDocs?.map(doc => `
- Document: ${doc.source} (${doc.created_at})
  Content Preview: ${doc.content?.substring(0, 500)}...
  Tags: ${doc.tags?.join(', ') || 'None'}
  Metadata: ${JSON.stringify(doc.metadata || {})}
`).join('\n') || 'No RAG documents available'}

🌐 MCP PROTOCOL SERVERS (${mcpServers?.length || 0} active):
${mcpServers?.map(server => `
- Server: ${server.name} (v${server.version || 'unknown'})
  Status: ${server.status} | Transport: ${server.transport}
  Endpoint: ${server.endpoint}
  Description: ${server.description || 'No description'}
  Capabilities: ${JSON.stringify(server.capabilities || {})}
`).join('\n') || 'No MCP servers connected'}

🤖 A2A AGENT NETWORK (${a2aAgents?.length || 0} online):
${a2aAgents?.map(agent => `
- Agent: ${agent.name} (${agent.status})
  Description: ${agent.description}
  Last Active: ${agent.last_active}
  Capabilities: ${JSON.stringify(agent.capabilities || {})}
  Performance: ${JSON.stringify(agent.performance_metrics || {})}
`).join('\n') || 'No A2A agents online'}

📋 RECENT A2A TASKS (${recentTasks?.length || 0} tasks):
${recentTasks?.map(task => `
- Task: ${task.task_type || 'Unknown'} (${task.status})
  Created: ${task.created_at}
  Agent: ${task.agent_id}
  Complexity: ${task.complexity_score || 'N/A'}
  Metadata: ${JSON.stringify(task.metadata || {})}
`).join('\n') || 'No recent tasks'}

🔎 RECENT RAG QUERIES (${recentQueries?.length || 0} queries):
${recentQueries?.map(q => `
- Query: "${q.query}"
  Results: ${q.total_found} found (${q.processing_time_ms}ms)
  Relevance Score: ${q.relevance_score || 'N/A'}
  User Feedback: ${q.feedback_score || 'N/A'}
  Timestamp: ${q.created_at}
`).join('\n') || 'No recent queries'}

⚡ RECENT MCP EXECUTIONS (${toolExecutions?.length || 0} executions):
${toolExecutions?.map(exec => `
- Tool: ${exec.tool_name} (${exec.status})
  Execution Time: ${exec.execution_time_ms}ms
  Timestamp: ${exec.created_at}
  Input: ${JSON.stringify(exec.input_params || {})}
  Output: ${JSON.stringify(exec.output_data || {})}
`).join('\n') || 'No recent executions'}

📈 SYSTEM PERFORMANCE METRICS:
${systemMetrics?.map(metric => `
- ${metric.metric_name}: ${metric.value} (${metric.category})
  Timestamp: ${metric.timestamp}
`).join('\n') || 'No system metrics available'}

🔗 INTEGRATION STATUS:
${integrationStatus?.map(integration => `
- Service: ${integration.service_name} (${integration.status})
  Last Check: ${integration.last_check}
  Response Time: ${integration.response_time_ms}ms
  Error Count: ${integration.error_count || 0}
`).join('\n') || 'No integration status available'}

=== CONTEXT ANALYSIS ===
Total Context Sources: ${(ragDocs?.length || 0) + (mcpServers?.length || 0) + (a2aAgents?.length || 0)}
Active Integrations: ${mcpServers?.filter(s => s.status === 'connected').length || 0}
Online Agents: ${a2aAgents?.filter(a => a.status === 'online').length || 0}
Recent Activity: ${(recentTasks?.length || 0) + (recentQueries?.length || 0) + (toolExecutions?.length || 0)} operations

=== ENHANCED CAPABILITIES ===
🧠 Advanced Reasoning: Chain-of-thought processing with DeepSeek
🔄 Real-time Streaming: Token-by-token response delivery
🎯 Context-Aware: Dynamic RAG retrieval based on query intent
🚀 Multi-Agent Coordination: Distributed task execution
🔒 Secure Communication: Encrypted MCP protocol channels
📊 Performance Monitoring: Real-time metrics and feedback loops

=== END COMPREHENSIVE SYSTEM CONTEXT ===
`;

      console.log('✅ Comprehensive context data prepared, length:', contextData.length);
    }

    // Enhanced system prompt with comprehensive context
    const enhancedMessages = [...messages];
    if (includeContext && contextData) {
      const systemMessageIndex = enhancedMessages.findIndex(m => m.role === 'system');
      if (systemMessageIndex >= 0) {
        enhancedMessages[systemMessageIndex].content += `\n\n${contextData}`;
      } else {
        enhancedMessages.unshift({
          role: 'system',
          content: `You are an advanced AI assistant with access to comprehensive real-time system data. You have deep knowledge of RAG 2.0, MCP (Model Context Protocol), and A2A (Agent-to-Agent) protocols. Provide detailed, comprehensive responses that leverage all available context data.\n\n${contextData}`
        });
      }
    }

    console.log('🚀 Starting DeepSeek streaming with enhanced context and extended output limits');

    // Stream response from DeepSeek with enhanced parameters
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('DEEPSEEK_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: enhancedMessages,
        temperature: 0.7,
        max_tokens: maxTokens,
        stream: true,
        presence_penalty: 0.1,
        frequency_penalty: 0.1,
        top_p: 0.95,
      }),
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API request failed: ${response.status} ${response.statusText}`);
    }

    // Return streaming response with enhanced headers
    return new Response(response.body, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no',
        'Access-Control-Expose-Headers': 'X-Stream-Status',
        'X-Stream-Status': 'active',
      },
    });

  } catch (error) {
    console.error('❌ DeepSeek enhanced chat error:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Internal server error',
      timestamp: new Date().toISOString(),
      context: 'deepseek-chat-enhanced'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
