
import { ChatMessage } from './types';

export class StreamingService {
  static async streamChatResponse(
    messages: ChatMessage[],
    onToken: (token: string) => void,
    onComplete?: () => void,
    onError?: (error: string) => void
  ): Promise<void> {
    try {
      console.log('🚀 Starting RAG-enhanced DeepSeek streaming...');
      
      const response = await fetch('https://gewrxsorvvfgipwwcdzs.supabase.co/functions/v1/deepseek-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdld3J4c29ydnZmZ2lwd3djZHpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3MTY0MDQsImV4cCI6MjA2NjI5MjQwNH0.1ambxVpRHftCB9ueDN4PrVwm3clrYsM5smEICoPy4Kg`
        },
        body: JSON.stringify({
          messages,
          includeContext: true,
          maxTokens: 16384
        })
      });

      if (!response.ok) {
        throw new Error(`Edge function request failed: ${response.status} ${response.statusText}`);
      }

      if (!response.body) {
        throw new Error('No response stream available');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            console.log('✅ Stream reading completed');
            break;
          }

          buffer += decoder.decode(value, { stream: true });
          const parts = buffer.split('\n\n');
          buffer = parts.pop() || '';

          for (const part of parts) {
            const trimmed = part.trim();
            if (!trimmed) continue;

            if (trimmed.startsWith('data: ')) {
              const jsonStr = trimmed.slice(6);

              if (jsonStr === '[DONE]') {
                console.log('✅ Stream completed with [DONE] signal');
                onComplete?.();
                return;
              }

              try {
                const parsed = JSON.parse(jsonStr);
                const delta = parsed.choices?.[0]?.delta;
                const token = delta?.content;

                if (token) {
                  console.log('📨 Received RAG-enhanced token:', token);
                  onToken(token);
                }

                if (parsed.choices?.[0]?.finish_reason) {
                  console.log('✅ Stream finished with reason:', parsed.choices[0].finish_reason);
                  onComplete?.();
                  return;
                }
              } catch (parseError) {
                console.warn('⚠️ JSON parse error for line:', jsonStr, parseError);
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }

      onComplete?.();
    } catch (error) {
      console.error('❌ RAG-enhanced DeepSeek streaming failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown streaming error';
      onError?.(errorMessage);
      throw error;
    }
  }
}
