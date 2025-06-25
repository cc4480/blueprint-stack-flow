
import type { ConversationMessage, DeepSeekChunk, PromptGenerationResult } from './types';

export class DeepSeekClient {
  private conversationHistory: ConversationMessage[] = [];

  async generateWithReasoning(messages: ConversationMessage[]): Promise<{ reasoningContent: string; finalContent: string }> {
    console.log('🔑 DeepSeekClient: Starting generation', {
      messagesCount: messages.length,
      messageRoles: messages.map(m => m.role),
      firstMessagePreview: messages[0]?.content?.substring(0, 100) + '...'
    });

    // Clean messages to remove any reasoning_content field as per DeepSeek docs
    const cleanMessages = messages.map((msg, index) => {
      const cleaned = {
        role: msg.role,
        content: msg.content
      };
      console.log(`🧹 DeepSeekClient: Cleaned message ${index}`, {
        role: cleaned.role,
        contentLength: cleaned.content?.length || 0,
        originalKeys: Object.keys(msg),
        cleanedKeys: Object.keys(cleaned)
      });
      return cleaned;
    });

    console.log('📤 DeepSeekClient: Making request to edge function', {
      url: '/functions/v1/deepseek-chat',
      method: 'POST',
      hasAuth: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
      authPrefix: import.meta.env.VITE_SUPABASE_ANON_KEY?.substring(0, 8) + '...',
      payloadSize: JSON.stringify({ messages: cleanMessages }).length
    });

    let response;
    try {
      response = await fetch('/functions/v1/deepseek-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ messages: cleanMessages }),
      });
    } catch (fetchError) {
      console.error('❌ DeepSeekClient: Network error during fetch', {
        error: fetchError.message,
        stack: fetchError.stack,
        name: fetchError.name
      });
      throw new Error(`Network error: ${fetchError.message}. Check your internet connection and Supabase configuration.`);
    }

    console.log('📡 DeepSeekClient: Response received', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      headers: Object.fromEntries(response.headers.entries()),
      url: response.url
    });

    if (!response.ok) {
      console.error('❌ DeepSeekClient: Edge function error', {
        status: response.status,
        statusText: response.statusText,
        url: response.url
      });
      
      let errorData;
      try {
        const responseText = await response.text();
        console.log('📄 DeepSeekClient: Raw error response', {
          responseText,
          responseLength: responseText.length
        });
        
        try {
          errorData = JSON.parse(responseText);
          console.log('📋 DeepSeekClient: Parsed error data', errorData);
        } catch (jsonError) {
          console.warn('⚠️ DeepSeekClient: Failed to parse error as JSON', {
            jsonError: jsonError.message,
            responseText: responseText.substring(0, 500)
          });
          errorData = { error: responseText, raw: true };
        }
        
        throw new Error(errorData.error || `DeepSeek API request failed with status ${response.status}. Raw response: ${responseText}`);
      } catch (readError) {
        console.error('❌ DeepSeekClient: Failed to read error response', {
          readError: readError.message,
          originalStatus: response.status
        });
        throw new Error(`DeepSeek API request failed with status ${response.status}. Could not read error details: ${readError.message}`);
      }
    }

    let reasoningContent = "";
    let finalContent = "";

    // Check if response is JSON (error) or streaming
    const contentType = response.headers.get('content-type');
    console.log('📄 DeepSeekClient: Processing response', {
      contentType,
      hasBody: !!response.body,
      bodyLocked: response.bodyUsed
    });
    
    if (contentType?.includes('application/json')) {
      try {
        const errorData = await response.json();
        console.error('❌ DeepSeekClient: JSON error response', errorData);
        throw new Error(errorData.error || 'DeepSeek API returned JSON error');
      } catch (jsonError) {
        console.error('❌ DeepSeekClient: Failed to parse JSON error', jsonError);
        throw new Error('DeepSeek API returned JSON response but failed to parse it');
      }
    }

    // Process streaming response according to DeepSeek docs
    const reader = response.body?.getReader();
    if (!reader) {
      console.error('❌ DeepSeekClient: No response body reader available');
      throw new Error('Failed to read response stream - no reader available');
    }

    const decoder = new TextDecoder();
    let buffer = '';
    let chunkCount = 0;
    let totalBytesRead = 0;

    try {
      console.log('🔄 DeepSeekClient: Starting to read stream...');
      
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          console.log('✅ DeepSeekClient: Stream reading completed', {
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
        
        console.log(`📦 DeepSeekClient: Chunk ${chunkCount}`, {
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
                
                console.log('🔍 DeepSeekClient: Processing delta', {
                  hasReasoningContent: !!delta?.reasoning_content,
                  hasContent: !!delta?.content,
                  reasoningLength: delta?.reasoning_content?.length || 0,
                  contentLength: delta?.content?.length || 0,
                  finishReason: parsedChunk.choices?.[0]?.finish_reason
                });
                
                // Handle reasoning_content and content as per DeepSeek docs
                if (delta?.reasoning_content) {
                  reasoningContent += delta.reasoning_content;
                  console.log('🧠 DeepSeekClient: Reasoning chunk added', {
                    chunkLength: delta.reasoning_content.length,
                    totalReasoningLength: reasoningContent.length
                  });
                }
                if (delta?.content) {
                  finalContent += delta.content;
                  console.log('💬 DeepSeekClient: Content chunk added', {
                    chunkLength: delta.content.length,
                    totalContentLength: finalContent.length
                  });
                }
              }
            } catch (parseError) {
              console.warn('⚠️ DeepSeekClient: Skipping invalid JSON line', {
                line: line.slice(0, 100) + '...',
                error: parseError.message
              });
            }
          } else if (line.trim() === 'data: [DONE]') {
            console.log('🏁 DeepSeekClient: Received DONE signal');
          } else if (line.trim() && !line.startsWith('data: ')) {
            console.log('ℹ️ DeepSeekClient: Non-data line', {
              line: line.substring(0, 100)
            });
          }
        }
      }
    } catch (streamError) {
      console.error('❌ DeepSeekClient: Stream reading error', {
        error: streamError.message,
        stack: streamError.stack,
        chunkCount,
        totalBytesRead,
        bufferLength: buffer.length
      });
      throw new Error(`Stream reading failed: ${streamError.message}`);
    } finally {
      reader.releaseLock();
      console.log('🔓 DeepSeekClient: Reader lock released');
    }

    console.log('📊 DeepSeekClient: Final results', {
      reasoningLength: reasoningContent.length,
      finalLength: finalContent.length,
      hasReasoning: !!reasoningContent,
      hasFinal: !!finalContent,
      chunkCount,
      totalBytesRead
    });

    if (!finalContent && !reasoningContent) {
      console.error('❌ DeepSeekClient: No content received from DeepSeek API');
      throw new Error('No content received from DeepSeek API. The stream may have been empty or invalid.');
    }

    return { reasoningContent, finalContent };
  }

  async continueConversation(userMessage: string): Promise<PromptGenerationResult> {
    // Add user message to conversation history
    this.conversationHistory.push({ role: 'user', content: userMessage });

    const { reasoningContent, finalContent } = await this.generateWithReasoning(this.conversationHistory);

    // Add ONLY the final content to history, NOT the reasoning_content as per DeepSeek docs
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
