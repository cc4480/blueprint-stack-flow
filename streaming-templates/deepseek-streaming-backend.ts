
// DeepSeek Streaming Backend Template
// Copy this code to your Express.js routes file

import express from 'express';

export const setupStreamingRoutes = (app: express.Application) => {

  // DeepSeek Streaming Endpoint
  app.post("/api/stream-blueprint", async (req, res) => {
    const { prompt, temperature = 0.7, systemPrompt } = req.body;

    if (!prompt?.trim()) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const apiKey = process.env.DEEPSEEK_API_KEY;
    
    if (!apiKey) {
      console.error('❌ DEEPSEEK_API_KEY not found in environment variables');
      return res.status(500).json({ 
        error: 'DeepSeek API key not configured. Please add DEEPSEEK_API_KEY to your environment variables.' 
      });
    }

    // Set streaming headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Cache-Control');

    console.log(`🔑 API Key status: ${apiKey ? 'Available' : 'Missing'} (length: ${apiKey?.length || 0})`);
    console.log(`🔥 Blueprint streaming request received: { promptLength: ${prompt.length}, hasSystemPrompt: ${!!systemPrompt} }`);

    let hasStartedStreaming = false;

    try {
      const requestBody = {
        model: "deepseek-reasoner",
        messages: [
          ...(systemPrompt ? [{ role: "system", content: systemPrompt }] : []),
          { role: "user", content: prompt }
        ],
        temperature,
        max_tokens: 8000,
        stream: true
      };

      console.log('🤖 Sending request to DeepSeek API...');

      const deepseekResponse = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!deepseekResponse.ok) {
        const errorText = await deepseekResponse.text();
        console.error(`❌ DeepSeek API error: ${deepseekResponse.status} ${deepseekResponse.statusText}`, errorText);
        throw new Error(`DeepSeek API error: ${deepseekResponse.status} ${deepseekResponse.statusText}`);
      }

      if (!deepseekResponse.body) {
        throw new Error('No response body from DeepSeek API');
      }

      console.log('✅ DeepSeek API responded successfully, starting stream...');
      hasStartedStreaming = true;

      const reader = deepseekResponse.body.getReader();
      const decoder = new TextDecoder();
      let totalCharacters = 0;

      try {
        while (true) {
          const { done, value } = await reader.read();
          
          if (done) {
            console.log(`📊 Stream completed. Total characters: ${totalCharacters}`);
            res.write(`data: ${JSON.stringify({
              type: "complete",
              totalCharacters
            })}\n\n`);
            res.end();
            break;
          }

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.trim() === '') continue;
            if (line.trim() === 'data: [DONE]') {
              console.log(`📊 Stream marked as done by API. Total characters: ${totalCharacters}`);
              res.write(`data: ${JSON.stringify({
                type: "complete",
                totalCharacters
              })}\n\n`);
              res.end();
              return;
            }

            if (line.startsWith('data: ')) {
              try {
                const jsonStr = line.slice(6);
                const data = JSON.parse(jsonStr);
                
                if (data.choices?.[0]?.delta?.content) {
                  const content = data.choices[0].delta.content;
                  totalCharacters += content.length;
                  
                  // Send the token to client
                  res.write(`data: ${JSON.stringify({
                    type: "token",
                    content: content
                  })}\n\n`);
                }
              } catch (parseError) {
                console.warn('Failed to parse DeepSeek response line:', line, parseError);
              }
            }
          }
        }
      } catch (streamError) {
        console.error('❌ Stream processing error:', streamError);
        if (!res.headersSent) {
          res.status(500).json({
            error: streamError instanceof Error ? streamError.message : "Stream processing failed"
          });
        } else {
          res.write(`data: ${JSON.stringify({
            type: "error",
            error: streamError instanceof Error ? streamError.message : "Stream processing failed"
          })}\n\n`);
          res.end();
        }
      }

    } catch (error) {
      console.error('❌ DeepSeek streaming error:', error);
      
      if (!hasStartedStreaming) {
        // If streaming hasn't started, send JSON error
        return res.status(500).json({
          error: error instanceof Error ? error.message : "Streaming failed"
        });
      } else {
        // If streaming has started, send streaming error
        res.write(`data: ${JSON.stringify({
          type: "error",
          error: error instanceof Error ? error.message : "Streaming failed"
        })}\n\n`);
        res.end();
      }
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "healthy", 
      timestamp: new Date().toISOString(),
      deepseekConfigured: !!process.env.DEEPSEEK_API_KEY
    });
  });

  console.log('✅ Streaming routes configured successfully');
};

// Alternative: If you want to use this in a different framework, here's the core streaming logic:

export const createStreamingHandler = async (prompt: string, apiKey: string, options: {
  temperature?: number;
  systemPrompt?: string;
  onToken?: (content: string) => void;
  onComplete?: (totalCharacters: number) => void;
  onError?: (error: Error) => void;
} = {}) => {
  
  const { temperature = 0.7, systemPrompt, onToken, onComplete, onError } = options;

  try {
    const requestBody = {
      model: "deepseek-reasoner",
      messages: [
        ...(systemPrompt ? [{ role: "system", content: systemPrompt }] : []),
        { role: "user", content: prompt }
      ],
      temperature,
      max_tokens: 8000,
      stream: true
    };

    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status} ${response.statusText}`);
    }

    if (!response.body) {
      throw new Error('No response body from DeepSeek API');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let totalCharacters = 0;
    let accumulatedContent = '';

    while (true) {
      const { done, value } = await reader.read();
      
      if (done) {
        onComplete?.(totalCharacters);
        break;
      }

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.trim() === '' || !line.startsWith('data: ')) continue;
        if (line.trim() === 'data: [DONE]') {
          onComplete?.(totalCharacters);
          return accumulatedContent;
        }

        try {
          const jsonStr = line.slice(6);
          const data = JSON.parse(jsonStr);
          
          if (data.choices?.[0]?.delta?.content) {
            const content = data.choices[0].delta.content;
            totalCharacters += content.length;
            accumulatedContent += content;
            onToken?.(content);
          }
        } catch (parseError) {
          console.warn('Failed to parse DeepSeek response:', parseError);
        }
      }
    }

    return accumulatedContent;
  } catch (error) {
    onError?.(error instanceof Error ? error : new Error('Unknown error'));
    throw error;
  }
};

// Example usage in a Next.js API route:
/*
// pages/api/stream.ts or app/api/stream/route.ts
export async function POST(request: Request) {
  const { prompt } = await request.json();
  
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        await createStreamingHandler(prompt, process.env.DEEPSEEK_API_KEY!, {
          onToken: (content) => {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({
              type: "token",
              content
            })}\n\n`));
          },
          onComplete: (totalCharacters) => {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({
              type: "complete",
              totalCharacters
            })}\n\n`));
            controller.close();
          },
          onError: (error) => {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({
              type: "error",
              error: error.message
            })}\n\n`));
            controller.close();
          }
        });
      } catch (error) {
        controller.error(error);
      }
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
*/
