
const express = require('express');

function setupStreamingRoutes(app) {
  // Stream blueprint generation endpoint
  app.post('/api/stream-blueprint', async (req, res) => {
    try {
      const { prompt, systemPrompt } = req.body;

      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }

      const apiKey = process.env.DEEPSEEK_API_KEY;
      if (!apiKey) {
        console.error('❌ DEEPSEEK_API_KEY not found in environment variables');
        return res.status(500).json({ error: 'DeepSeek API key not configured on server' });
      }

      // Set streaming headers
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      res.setHeader("Access-Control-Allow-Origin", "*");

      const startTime = Date.now();
      let totalTokens = 0;
      let totalContent = "";

      try {
        const messages = [
          {
            role: "system",
            content: systemPrompt || "You are a helpful assistant."
          },
          {
            role: "user", 
            content: prompt
          }
        ];

        console.log('🤖 Sending request to DeepSeek API...');

        const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "deepseek-chat",
            messages,
            temperature: 0.7,
            stream: true,
            max_tokens: 8192
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('❌ DeepSeek API error:', response.status, errorText);
          throw new Error(`DeepSeek API error: ${response.status} - ${errorText}`);
        }

        console.log('✅ DeepSeek API responded successfully, starting stream...');

        if (!response.body) {
          throw new Error("No response stream received");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let buffer = "";
        let hasStreamStarted = false;

        while (true) {
          const { done, value } = await reader.read();
          
          if (done) {
            console.log('📊 Stream completed:', {
              totalTokens,
              totalContent: totalContent.length,
              duration: Date.now() - startTime
            });

            res.write(`data: ${JSON.stringify({
              type: "complete",
              totalTokens,
              totalCharacters: totalContent.length,
              duration: Date.now() - startTime
            })}\n\n`);
            res.end();
            break;
          }

          hasStreamStarted = true;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');

          for (let i = 0; i < lines.length - 1; i++) {
            const line = lines[i].trim();
            
            if (line.startsWith('data: ')) {
              const jsonStr = line.slice(6).trim();
              
              if (jsonStr === '[DONE]') {
                res.write(`data: ${JSON.stringify({
                  type: "complete",
                  totalTokens,
                  totalCharacters: totalContent.length,
                  duration: Date.now() - startTime
                })}\n\n`);
                res.end();
                return;
              }

              if (jsonStr) {
                try {
                  const data = JSON.parse(jsonStr);
                  const token = data.choices?.[0]?.delta?.content;
                  
                  if (token) {
                    totalTokens++;
                    totalContent += token;
                    
                    res.write(`data: ${JSON.stringify({
                      type: "token",
                      content: token,
                      totalTokens,
                      totalCharacters: totalContent.length
                    })}\n\n`);
                  }
                } catch (parseError) {
                  console.warn('JSON parse error:', parseError);
                }
              }
            }
          }
          
          buffer = lines[lines.length - 1];
        }

      } catch (streamError) {
        console.error('❌ Streaming error:', streamError);
        
        if (!hasStreamStarted) {
          return res.status(500).json({
            error: streamError instanceof Error ? streamError.message : "Streaming failed"
          });
        } else {
          res.write(`data: ${JSON.stringify({
            type: "error",
            error: streamError instanceof Error ? streamError.message : "Streaming failed"
          })}\n\n`);
          res.end();
        }
      }

    } catch (error) {
      console.error('❌ Request setup error:', error);
      res.status(500).json({
        error: error instanceof Error ? error.message : "Failed to setup streaming"
      });
    }
  });
}

module.exports = { setupStreamingRoutes };
