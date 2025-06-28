import { Request, Response } from 'express';

// Direct streaming proxy to DeepSeek API for real-time token display
export async function handleDirectStream(req: Request, res: Response) {
  const { messages, temperature = 0.7 } = req.body;
  
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return res.status(400).json({ error: 'DeepSeek API key not configured' });
  }

  // Set streaming headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const deepseekResponse = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages,
        temperature,
        stream: true,
      }),
    });

    if (!deepseekResponse.ok) {
      throw new Error(`DeepSeek API error: ${deepseekResponse.status}`);
    }

    if (!deepseekResponse.body) {
      throw new Error('No response stream');
    }

    const reader = deepseekResponse.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      buffer += decoder.decode(value, { stream: true });
      const parts = buffer.split('\n\n');
      
      for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i].trim();
        if (part.startsWith('data:')) {
          const jsonStr = part.slice(5).trim();
          if (jsonStr === '[DONE]') {
            res.write(`data: ${JSON.stringify({ type: 'complete' })}\n\n`);
            res.end();
            return;
          }
          
          try {
            const parsed = JSON.parse(jsonStr);
            const token = parsed.choices?.[0]?.delta?.content;
            if (token) {
              res.write(`data: ${JSON.stringify({
                type: 'token',
                content: token
              })}\n\n`);
            }
          } catch (e) {
            console.warn('JSON parse error:', e);
          }
        }
      }
      buffer = parts[parts.length - 1];
    }
  } catch (error) {
    console.error('Direct streaming error:', error);
    res.write(`data: ${JSON.stringify({
      type: 'error',
      error: error instanceof Error ? error.message : 'Streaming failed'
    })}\n\n`);
    res.end();
  }
}