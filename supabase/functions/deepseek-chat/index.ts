
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { messages } = await req.json()
    
    const deepseekApiKey = Deno.env.get('DEEPSEEK_API_KEY')
    
    console.log('🔍 Checking DeepSeek API key availability:', !!deepseekApiKey)
    
    if (!deepseekApiKey) {
      console.error('❌ DEEPSEEK_API_KEY not found in environment variables')
      return new Response(
        JSON.stringify({ 
          error: 'DEEPSEEK_API_KEY not configured in Supabase secrets. Please add it in the Edge Function Secrets.' 
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    }

    console.log('🚀 DeepSeek Reasoner: Processing RAG 2.0 + MCP + A2A request')

    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${deepseekApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-reasoner',
        messages: messages,
        stream: true,
        temperature: 0.8,
      }),
    })

    if (!response.ok) {
      console.error('❌ DeepSeek API error:', response.status, response.statusText)
      const errorText = await response.text()
      console.error('❌ DeepSeek API error details:', errorText)
      
      return new Response(
        JSON.stringify({ 
          error: `DeepSeek API error: ${response.status} - ${response.statusText}. Please check your API key.` 
        }),
        { 
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    }

    console.log('✅ DeepSeek API response received, streaming to client')

    // Stream the response back to the client
    const stream = new ReadableStream({
      start(controller) {
        const reader = response.body?.getReader()
        if (!reader) {
          controller.close()
          return
        }

        function pump(): Promise<void> {
          return reader.read().then(({ done, value }) => {
            if (done) {
              console.log('✅ DeepSeek streaming completed')
              controller.close()
              return
            }
            controller.enqueue(value)
            return pump()
          })
        }

        return pump()
      }
    })

    return new Response(stream, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/plain; charset=utf-8',
      },
    })

  } catch (error) {
    console.error('❌ DeepSeek Edge Function error:', error)
    return new Response(
      JSON.stringify({ 
        error: `Edge Function error: ${error.message}` 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})
