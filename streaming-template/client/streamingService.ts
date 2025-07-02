
export interface StreamingResponse {
  type: 'token' | 'complete' | 'error';
  content?: string;
  totalTokens?: number;
  totalCharacters?: number;
  duration?: number;
  error?: string;
}

export interface StreamingCallbacks {
  onToken?: (content: string, totalChars: number) => void;
  onProgress?: (message: string) => void;
  onComplete?: (totalChars: number, duration: number) => void;
  onError?: (error: string) => void;
}

export class StreamingService {
  async streamGeneration(
    prompt: string,
    systemPrompt?: string,
    callbacks?: StreamingCallbacks
  ): Promise<string> {
    const abortController = new AbortController();
    let accumulatedContent = "";

    try {
      callbacks?.onProgress?.('🚀 Connecting to streaming endpoint...');

      const response = await fetch("/api/stream-blueprint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          systemPrompt
        }),
        signal: abortController.signal
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      if (!response.body) {
        throw new Error("No response stream received");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";

      callbacks?.onProgress?.('📝 Streaming started...');

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          callbacks?.onProgress?.('✅ Stream completed');
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');

        for (let i = 0; i < lines.length - 1; i++) {
          const line = lines[i].trim();
          if (line.startsWith('data: ')) {
            try {
              const jsonStr = line.slice(6).trim();
              if (jsonStr === '[DONE]') {
                callbacks?.onComplete?.(accumulatedContent.length, 0);
                return accumulatedContent;
              }

              if (jsonStr) {
                const data: StreamingResponse = JSON.parse(jsonStr);

                if (data.type === 'token' && data.content) {
                  accumulatedContent += data.content;
                  callbacks?.onToken?.(data.content, accumulatedContent.length);
                  callbacks?.onProgress?.(`📝 Generating... ${accumulatedContent.length} characters`);
                } else if (data.type === 'complete') {
                  callbacks?.onComplete?.(data.totalCharacters || accumulatedContent.length, data.duration || 0);
                  return accumulatedContent;
                } else if (data.type === 'error') {
                  throw new Error(data.error || 'Unknown streaming error');
                }
              }
            } catch (parseError) {
              console.warn('Failed to parse streaming data:', parseError);
            }
          }
        }
        
        buffer = lines[lines.length - 1];
      }

      return accumulatedContent;

    } catch (error) {
      console.error('Streaming generation failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      callbacks?.onError?.(errorMessage);
      throw error;
    }
  }

  // Cancel streaming (for future use)
  cancel(abortController: AbortController) {
    abortController.abort();
  }
}

export const streamingService = new StreamingService();
