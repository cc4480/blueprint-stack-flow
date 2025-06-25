
import type { ConversationMessage, DeepSeekChunk, PromptGenerationResult } from './types';

export class DeepSeekReasonerClient {
  private conversationHistory: ConversationMessage[] = [];

  async generateWithReasoning(messages: ConversationMessage[]): Promise<{ reasoningContent: string; finalContent: string }> {
    console.log('🔑 DeepSeekReasonerClient: Starting generation', {
      messagesCount: messages.length,
      messageRoles: messages.map(m => m.role),
      firstMessagePreview: messages[0]?.content?.substring(0, 100) + '...'
    });

    // Clean messages to remove any reasoning_content field as per DeepSeek Reasoner docs
    const cleanMessages = messages.map((msg, index) => {
      const cleaned = {
        role: msg.role,
        content: msg.content
      };
      console.log(`🧹 DeepSeekReasonerClient: Cleaned message ${index}`, {
        role: cleaned.role,
        contentLength: cleaned.content?.length || 0,
        originalKeys: Object.keys(msg),
        cleanedKeys: Object.keys(cleaned)
      });
      return cleaned;
    });

    console.log('📤 DeepSeekReasonerClient: Making request to edge function', {
      url: '/functions/v1/deepseek-reasoner',
      method: 'POST',
      hasAuth: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
      authPrefix: import.meta.env.VITE_SUPABASE_ANON_KEY?.substring(0, 8) + '...',
      payloadSize: JSON.stringify({ messages: cleanMessages }).length
    });

    let response;
    try {
      response = await fetch('/functions/v1/deepseek-reasoner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ messages: cleanMessages }),
      });
    } catch (fetchError) {
      console.error('❌ DeepSeekReasonerClient: Network error during fetch', {
        error: fetchError.message,
        stack: fetchError.stack,
        name: fetchError.name
      });
      throw new Error(`Network error: ${fetchError.message}. Check your internet connection and Supabase configuration.`);
    }

    console.log('📡 DeepSeekReasonerClient: Response received', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      headers: Object.fromEntries(response.headers.entries()),
      url: response.url
    });

    if (!response.ok) {
      console.error('❌ DeepSeekReasonerClient: Edge function error', {
        status: response.status,
        statusText: response.statusText,
        url: response.url
      });
      
      let errorData;
      try {
        const responseText = await response.text();
        console.log('📄 DeepSeekReasonerClient: Raw error response', {
          responseText,
          responseLength: responseText.length
        });
        
        try {
          errorData = JSON.parse(responseText);
          console.log('📋 DeepSeekReasonerClient: Parsed error data', errorData);
        } catch (jsonError) {
          console.warn('⚠️ DeepSeekReasonerClient: Failed to parse error as JSON', {
            jsonError: jsonError.message,
            responseText: responseText.substring(0, 500)
          });
          errorData = { error: responseText, raw: true };
        }
        
        throw new Error(errorData.error || `DeepSeek Reasoner API request failed with status ${response.status}. Raw response: ${responseText}`);
      } catch (readError) {
        console.error('❌ DeepSeekReasonerClient: Failed to read error response', {
          readError: readError.message,
          originalStatus: response.status
        });
        throw new Error(`DeepSeek Reasoner API request failed with status ${response.status}. Could not read error details: ${readError.message}`);
      }
    }

    let reasoningContent = "";
    let finalContent = "";

    // Check if response is JSON (error) or streaming
    const contentType = response.headers.get('content-type');
    console.log('📄 DeepSeekReasonerClient: Processing response', {
      contentType,
      hasBody: !!response.body,
      bodyLocked: response.bodyUsed
    });
    
    if (contentType?.includes('application/json')) {
      try {
        const errorData = await response.json();
        console.error('❌ DeepSeekReasonerClient: JSON error response', errorData);
        throw new Error(errorData.error || 'DeepSeek Reasoner API returned JSON error');
      } catch (jsonError) {
        console.error('❌ DeepSeekReasonerClient: Failed to parse JSON error', jsonError);
        throw new Error('DeepSeek Reasoner API returned JSON response but failed to parse it');
      }
    }

    // Process streaming response according to DeepSeek Reasoner docs
    const reader = response.body?.getReader();
    if (!reader) {
      console.error('❌ DeepSeekReasonerClient: No response body reader available');
      throw new Error('Failed to read response stream - no reader available');
    }

    const decoder = new TextDecoder();
    let buffer = '';
    let chunkCount = 0;
    let totalBytesRead = 0;

    try {
      console.log('🔄 DeepSeekReasonerClient: Starting to read stream...');
      
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          console.log('✅ DeepSeekReasonerClient: Stream reading completed', {
            chunkCount,
            totalBytesRead,
            reasoningLength: reasoningContent.length,
            finalLength: finalContent.length,
            bufferLength: buffer.length
          });
          break;
        }

        chunkCount++;
        totalBytesRead += value.length;
        
        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;
        
        console.log(`📦 DeepSeekReasonerClient: Chunk ${chunkCount}`, {
          chunkSize: value.length,
          decodedLength: chunk.length,
          bufferLength: buffer.length,
          totalBytesRead
        });

        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ') && line.trim() !== 'data: [DONE]') {
            try {
              const jsonStr = line.slice(6).trim();
              if (jsonStr) {
                const parsedChunk = JSON.parse(jsonStr) as DeepSeekChunk;
                const delta = parsedChunk.choices?.[0]?.delta;
                
                console.log('🔍 DeepSeekReasonerClient: Processing delta', {
                  hasReasoningContent: !!delta?.reasoning_content,
                  hasContent: !!delta?.content,
                  reasoningLength: delta?.reasoning_content?.length || 0,
                  contentLength: delta?.content?.length || 0,
                  finishReason: parsedChunk.choices?.[0]?.finish_reason
                });
                
                // Handle reasoning_content and content as per DeepSeek Reasoner docs
                if (delta?.reasoning_content) {
                  reasoningContent += delta.reasoning_content;
                  console.log('🧠 DeepSeekReasonerClient: Reasoning chunk added', {
                    chunkLength: delta.reasoning_content.length,
                    totalReasoningLength: reasoningContent.length
                  });
                }
                if (delta?.content) {
                  finalContent += delta.content;
                  console.log('💬 DeepSeekReasonerClient: Content chunk added', {
                    chunkLength: delta.content.length,
                    totalContentLength: finalContent.length
                  });
                }
              }
            } catch (parseError) {
              console.warn('⚠️ DeepSeekReasonerClient: Skipping invalid JSON line', {
                line: line.slice(0, 100) + '...',
                error: parseError.message
              });
            }
          } else if (line.trim() === 'data: [DONE]') {
            console.log('🏁 DeepSeekReasonerClient: Received DONE signal');
          } else if (line.trim() && !line.startsWith('data: ')) {
            console.log('ℹ️ DeepSeekReasonerClient: Non-data line', {
              line: line.substring(0, 100)
            });
          }
        }
      }
    } catch (streamError) {
      console.error('❌ DeepSeekReasonerClient: Stream reading error', {
        error: streamError.message,
        stack: streamError.stack,
        chunkCount,
        totalBytesRead,
        bufferLength: buffer.length
      });
      throw new Error(`Stream reading failed: ${streamError.message}`);
    } finally {
      reader.releaseLock();
      console.log('🔓 DeepSeekReasonerClient: Reader lock released');
    }

    console.log('📊 DeepSeekReasonerClient: Final results', {
      reasoningLength: reasoningContent.length,
      finalLength: finalContent.length,
      hasReasoning: !!reasoningContent,
      hasFinal: !!finalContent,
      chunkCount,
      totalBytesRead
    });

    if (!finalContent && !reasoningContent) {
      console.error('❌ DeepSeekReasonerClient: No content received from DeepSeek Reasoner API');
      throw new Error('No content received from DeepSeek Reasoner API. The stream may have been empty or invalid.');
    }

    return { reasoningContent, finalContent };
  }

  async continueConversation(userMessage: string): Promise<PromptGenerationResult> {
    // Add user message to conversation history
    this.conversationHistory.push({ role: 'user', content: userMessage });

    const { reasoningContent, finalContent } = await this.generateWithReasoning(this.conversationHistory);

    // Add ONLY the final content to history, NOT the reasoning_content as per DeepSeek Reasoner docs
    this.conversationHistory.push({ role: 'assistant', content: finalContent });

    console.log('✅ Multi-turn conversation completed with DeepSeek Reasoner');

    return {
      prompt: finalContent,
      estimatedBuildTime: '5-8 days',
      complexity: 'Advanced',
      suggestedComponents: [],
      reasoningContent,
      mcpEndpoints: [],
      a2aProtocols: [],
      ragPipeline: 'Continuous Learning Pipeline'
    };
  }

  addToConversationHistory(messages: ConversationMessage[]) {
    // Clean messages to ensure no reasoning_content is included
    const cleanMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
    this.conversationHistory.push(...cleanMessages);
  }
}
