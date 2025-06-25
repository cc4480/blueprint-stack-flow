import type { ConversationMessage, DeepSeekChunk, PromptGenerationResult } from './types';

export class DeepSeekClient {
  private conversationHistory: ConversationMessage[] = [];

  async generateWithReasoning(messages: ConversationMessage[]): Promise<{ reasoningContent: string; finalContent: string }> {
    console.log('🔑 Using DeepSeek Reasoner via secure Supabase edge function');

    const response = await fetch('/functions/v1/deepseek-chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      console.error('❌ DeepSeek edge function error:', response.status, response.statusText);
      
      // Try to get the error message from the response
      try {
        const errorData = await response.json();
        throw new Error(errorData.error || 'DeepSeek API request failed. Please check your API key configuration.');
      } catch (parseError) {
        throw new Error('DeepSeek API request failed. Please check your API key configuration.');
      }
    }

    let reasoningContent = "";
    let finalContent = "";

    // Check if response is JSON (error) or streaming
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'DeepSeek API error');
    }

    // Process streaming response
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Failed to read response stream');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ') && line.trim() !== 'data: [DONE]') {
            try {
              const jsonStr = line.slice(6);
              const chunk = JSON.parse(jsonStr) as DeepSeekChunk;
              const delta = chunk.choices[0]?.delta;
              
              if (delta?.reasoning_content) {
                reasoningContent += delta.reasoning_content;
              }
              if (delta?.content) {
                finalContent += delta.content;
              }
            } catch (e) {
              // Skip invalid JSON lines
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }

    if (!finalContent && !reasoningContent) {
      throw new Error('No content received from DeepSeek API. Please check your API key and try again.');
    }

    return { reasoningContent, finalContent };
  }

  async continueConversation(userMessage: string): Promise<PromptGenerationResult> {
    // Add user message to conversation history
    this.conversationHistory.push({ role: 'user', content: userMessage });

    const { reasoningContent, finalContent } = await this.generateWithReasoning(this.conversationHistory);

    // Add assistant response to history
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
    this.conversationHistory.push(...messages);
  }
}
