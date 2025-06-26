
import { ChatMessage } from './types';

export class StreamingService {
  static async streamChatResponse(
    messages: ChatMessage[],
    onToken: (token: string) => void,
    onComplete?: () => void,
    onError?: (error: string) => void
  ): Promise<void> {
    try {
      console.log('🚀 Starting direct DeepSeek API streaming...');
      
      // Get the API key from localStorage or environment
      const apiKey = localStorage.getItem('deepseek_api_key') || 'sk-your-api-key-here';
      
      if (!apiKey || apiKey === 'sk-your-api-key-here') {
        throw new Error('DeepSeek API key not configured. Please set your API key in the settings.');
      }
      
      // Direct call to DeepSeek API with streaming
      const response = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages,
          temperature: 0.7,
          max_tokens: 16384,
          stream: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`DeepSeek API request failed: ${response.status} ${response.statusText}`);
      }

      if (!response.body) {
        throw new Error('No response stream available from DeepSeek API');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';
      let tokenCount = 0;

      console.log('📡 DeepSeek API streaming connection established, processing tokens...');

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            console.log('✅ DeepSeek API stream reading completed');
            break;
          }

          buffer += decoder.decode(value, { stream: true });
          
          // Process complete parts separated by double newlines
          const parts = buffer.split('\n\n');
          buffer = parts.pop() || ''; // Keep the incomplete part in buffer

          for (const part of parts) {
            const trimmed = part.trim();
            if (!trimmed) continue;
            
            if (trimmed.startsWith('data: ')) {
              const jsonStr = trimmed.slice(6);
              
              if (jsonStr === '[DONE]') {
                console.log('✅ DeepSeek API stream completed with [DONE] signal');
                onComplete?.();
                return;
              }
              
              try {
                const parsed = JSON.parse(jsonStr);
                const delta = parsed.choices?.[0]?.delta;
                const token = delta?.content;
                
                if (token) {
                  tokenCount++;
                  console.log(`📨 DeepSeek token ${tokenCount}: "${token}"`);
                  onToken(token);
                }
                
                if (parsed.choices?.[0]?.finish_reason) {
                  console.log('✅ DeepSeek API stream finished with reason:', parsed.choices[0].finish_reason);
                  onComplete?.();
                  return;
                }
              } catch (parseError) {
                console.warn('⚠️ JSON parse error for DeepSeek response:', jsonStr, parseError);
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }

      console.log(`🎯 DeepSeek API stream completed: ${tokenCount} tokens total`);
      onComplete?.();
    } catch (error) {
      console.error('❌ DeepSeek API streaming failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown DeepSeek API streaming error';
      onError?.(errorMessage);
      throw error;
    }
  }
}
