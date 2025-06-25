
import { StreamingHandler } from '../streaming/streamingHandler';

export class ResponseProcessor {
  private streamingHandler = new StreamingHandler();

  async processResponse(response: Response): Promise<{ reasoningContent: string; finalContent: string }> {
    // Check if response is JSON (error) or streaming
    const contentType = response.headers.get('content-type');
    console.log('📄 ResponseProcessor: Processing response', {
      contentType,
      hasBody: !!response.body,
      bodyLocked: response.bodyUsed
    });
    
    if (contentType?.includes('application/json')) {
      try {
        const errorData = await response.json();
        console.error('❌ ResponseProcessor: JSON error response', errorData);
        throw new Error(errorData.error || 'DeepSeek Reasoner API returned JSON error');
      } catch (jsonError) {
        console.error('❌ ResponseProcessor: Failed to parse JSON error', jsonError);
        throw new Error('DeepSeek Reasoner API returned JSON response but failed to parse it');
      }
    }

    // Process streaming response according to DeepSeek Reasoner docs
    const reader = response.body?.getReader();
    if (!reader) {
      console.error('❌ ResponseProcessor: No response body reader available');
      throw new Error('Failed to read response stream - no reader available');
    }

    return await this.streamingHandler.processStream(reader);
  }
}
