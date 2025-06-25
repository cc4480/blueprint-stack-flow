
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  console.log('🎯 DeepSeek Edge Function: Request received', {
    method: req.method,
    url: req.url,
    headers: Object.fromEntries(req.headers.entries())
  })

  if (req.method === 'OPTIONS') {
    console.log('✅ DeepSeek Edge Function: Handling CORS preflight')
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    let requestBody;
    let messages;
    
    try {
      requestBody = await req.json()
      messages = requestBody.messages
      console.log('📥 DeepSeek Edge Function: Request body parsed successfully', {
        hasMessages: !!messages,
        messagesLength: messages?.length || 0,
        requestBodyKeys: Object.keys(requestBody || {})
      })
    } catch (parseError) {
      console.error('❌ DeepSeek Edge Function: Failed to parse request body', {
        error: parseError.message,
        stack: parseError.stack
      })
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    }
    
    const deepseekApiKey = Deno.env.get('DEEPSEEK_API_KEY')
    
    console.log('🔍 DeepSeek Edge Function: Environment check', {
      hasApiKey: !!deepseekApiKey,
      apiKeyLength: deepseekApiKey?.length || 0,
      apiKeyPrefix: deepseekApiKey ? deepseekApiKey.substring(0, 8) + '...' : 'none'
    })
    
    if (!deepseekApiKey) {
      console.error('❌ DeepSeek Edge Function: DEEPSEEK_API_KEY not found in environment variables')
      return new Response(
        JSON.stringify({ 
          error: 'DEEPSEEK_API_KEY not configured in Supabase secrets. Please add it in the Edge Function Secrets.',
          debug: {
            availableEnvVars: Object.keys(Deno.env.toObject()).filter(key => !key.includes('SECRET'))
          }
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      console.error('❌ DeepSeek Edge Function: Invalid messages format', {
        messages,
        isArray: Array.isArray(messages),
        length: messages?.length
      })
      return new Response(
        JSON.stringify({ 
          error: 'Invalid messages format. Expected non-empty array.',
          received: { messages, type: typeof messages }
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    }

    console.log('🚀 DeepSeek Edge Function: Processing request', {
      messagesCount: messages.length,
      messageRoles: messages.map(m => m.role),
      firstMessagePreview: messages[0]?.content?.substring(0, 100) + '...'
    })

    // Clean messages to remove any reasoning_content field as per DeepSeek docs
    const cleanMessages = messages.map((msg, index) => {
      const cleaned = {
        role: msg.role,
        content: msg.content
      }
      console.log(`🧹 DeepSeek Edge Function: Message ${index}`, {
        originalKeys: Object.keys(msg),
        cleanedKeys: Object.keys(cleaned),
        role: cleaned.role,
        contentLength: cleaned.content?.length || 0
      })
      return cleaned
    })

    const requestPayload = {
      model: 'deepseek-reasoner',
      messages: cleanMessages,
      stream: true,
      max_tokens: 32000,
    }

    console.log('📤 DeepSeek Edge Function: Making API request', {
      url: 'https://api.deepseek.com/chat/completions',
      payload: {
        ...requestPayload,
        messages: `${requestPayload.messages.length} messages`
      },
      headers: {
        'Authorization': 'Bearer ' + (deepseekApiKey ? deepseekApiKey.substring(0, 8) + '...' : 'missing'),
        'Content-Type': 'application/json'
      }
    })

    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${deepseekApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestPayload),
    })

    console.log('📡 DeepSeek Edge Function: API response received', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      ok: response.ok
    })

    if (!response.ok) {
      let errorDetails;
      try {
        errorDetails = await response.text()
        console.error('❌ DeepSeek Edge Function: API error details', {
          status: response.status,
          statusText: response.statusText,
          body: errorDetails,
          headers: Object.fromEntries(response.headers.entries())
        })
      } catch (readError) {
        console.error('❌ DeepSeek Edge Function: Failed to read error response', {
          readError: readError.message,
          originalStatus: response.status
        })
        errorDetails = `Failed to read error response: ${readError.message}`
      }
      
      return new Response(
        JSON.stringify({ 
          error: `DeepSeek API error: ${response.status} - ${response.statusText}`,
          details: errorDetails,
          debug: {
            requestUrl: 'https://api.deepseek.com/chat/completions',
            requestMethod: 'POST',
            hasApiKey: !!deepseekApiKey,
            messagesCount: cleanMessages.length
          }
        }),
        { 
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    }

    console.log('✅ DeepSeek Edge Function: API response successful, streaming response')

    // Return the streaming response with proper headers
    return new Response(response.body, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })

  } catch (error) {
    console.error('❌ DeepSeek Edge Function: Unexpected error', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      cause: error.cause
    })
    
    return new Response(
      JSON.stringify({ 
        error: `Edge Function error: ${error.message}`,
        debug: {
          errorName: error.name,
          errorStack: error.stack?.split('\n').slice(0, 5), // First 5 lines of stack
          timestamp: new Date().toISOString()
        }
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})
