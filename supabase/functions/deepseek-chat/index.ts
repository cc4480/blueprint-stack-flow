
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
    
    console.log('🔍 DeepSeek Reasoner: Checking API key availability:', !!deepseekApiKey)
    console.log('🔍 DeepSeek Reasoner: Messages received:', messages?.length || 0)
    
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

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      console.error('❌ Invalid messages format')
      return new Response(
        JSON.stringify({ error: 'Invalid messages format' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    }

    console.log('🚀 DeepSeek Reasoner: Processing request with', messages.length, 'messages')

    // Ensure messages don't contain reasoning_content field as per DeepSeek docs
    const cleanMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }))

    console.log('🧹 DeepSeek Reasoner: Cleaned messages:', cleanMessages.length)

    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${deepseekApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-reasoner',
        messages: cleanMessages,
        stream: true,
        max_tokens: 32000, // Default as per docs
      }),
    })

    console.log('📡 DeepSeek API response status:', response.status, response.statusText)

    if (!response.ok) {
      console.error('❌ DeepSeek API error:', response.status, response.statusText)
      const errorText = await response.text()
      console.error('❌ DeepSeek API error details:', errorText)
      
      return new Response(
        JSON.stringify({ 
          error: `DeepSeek API error: ${response.status} - ${response.statusText}. Details: ${errorText}` 
        }),
        { 
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    }

    console.log('✅ DeepSeek API response received, setting up stream')

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
    console.error('❌ DeepSeek Edge Function error:', error)
    console.error('❌ Error stack:', error.stack)
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
