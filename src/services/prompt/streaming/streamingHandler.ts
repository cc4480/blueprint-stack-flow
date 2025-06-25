
import type { DeepSeekChunk } from '../types';

export class StreamingHandler {
  private decoder = new TextDecoder();

  async processStream(
    reader: ReadableStreamDefaultReader<Uint8Array>
  ): Promise<{ reasoningContent: string; finalContent: string }> {
    let reasoningContent = "";
    let finalContent = "";
    let buffer = '';
    let chunkCount = 0;
    let totalBytesRead = 0;

    console.log('🔄 StreamingHandler: Starting to read stream...');
    
    try {
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          console.log('✅ StreamingHandler: Stream reading completed', {
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
        
        const chunk = this.decoder.decode(value, { stream: true });
        buffer += chunk;
        
        console.log(`📦 StreamingHandler: Chunk ${chunkCount}`, {
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
                
                console.log('🔍 StreamingHandler: Processing delta', {
                  hasReasoningContent: !!delta?.reasoning_content,
                  hasContent: !!delta?.content,
                  reasoningLength: delta?.reasoning_content?.length || 0,
                  contentLength: delta?.content?.length || 0,
                  finishReason: parsedChunk.choices?.[0]?.finish_reason
                });
                
                if (delta?.reasoning_content) {
                  reasoningContent += delta.reasoning_content;
                  console.log('🧠 StreamingHandler: Reasoning chunk added', {
                    chunkLength: delta.reasoning_content.length,
                    totalReasoningLength: reasoningContent.length
                  });
                }
                if (delta?.content) {
                  finalContent += delta.content;
                  console.log('💬 StreamingHandler: Content chunk added', {
                    chunkLength: delta.content.length,
                    totalContentLength: finalContent.length
                  });
                }
              }
            } catch (parseError) {
              console.warn('⚠️ StreamingHandler: Skipping invalid JSON line', {
                line: line.slice(0, 100) + '...',
                error: parseError.message
              });
            }
          } else if (line.trim() === 'data: [DONE]') {
            console.log('🏁 StreamingHandler: Received DONE signal');
          } else if (line.trim() && !line.startsWith('data: ')) {
            console.log('ℹ️ StreamingHandler: Non-data line', {
              line: line.substring(0, 100)
            });
          }
        }
      }
    } catch (streamError) {
      console.error('❌ StreamingHandler: Stream reading error', {
        error: streamError.message,
        stack: streamError.stack,
        chunkCount,
        totalBytesRead,
        bufferLength: buffer.length
      });
      throw new Error(`Stream reading failed: ${streamError.message}`);
    } finally {
      reader.releaseLock();
      console.log('🔓 StreamingHandler: Reader lock released');
    }

    console.log('📊 StreamingHandler: Final results', {
      reasoningLength: reasoningContent.length,
      finalLength: finalContent.length,
      hasReasoning: !!reasoningContent,
      hasFinal: !!finalContent,
      chunkCount,
      totalBytesRead
    });

    if (!finalContent && !reasoningContent) {
      console.error('❌ StreamingHandler: No content received from DeepSeek Reasoner API');
      throw new Error('No content received from DeepSeek Reasoner API. The stream may have been empty or invalid.');
    }

    return { reasoningContent, finalContent };
  }
}
