
import type { ConversationMessage, DeepSeekChunk, PromptGenerationResult } from './types';

export class DeepSeekClient {
  private conversationHistory: ConversationMessage[] = [];

  async generateWithReasoning(messages: ConversationMessage[]): Promise<{ reasoningContent: string; finalContent: string }> {
    console.log('🔑 Using DeepSeek Reasoner via secure Supabase edge function');

    // Clean messages to remove any reasoning_content field as per DeepSeek docs
    const cleanMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    const response = await fetch('/functions/v1/deepseek-chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ messages: cleanMessages }),
    });

    console.log('📡 DeepSeek response status:', response.status);

    if (!response.ok) {
      console.error('❌ DeepSeek edge function error:', response.status, response.statusText);
      
      try {
        const errorData = await response.json();
        console.error('❌ Error details:', errorData);
        throw new Error(errorData.error || `DeepSeek API request failed with status ${response.status}`);
      } catch (parseError) {
        console.error('❌ Failed to parse error response:', parseError);
        throw new Error(`DeepSeek API request failed with status ${response.status}. Please check your API key configuration.`);
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

    // Process streaming response according to DeepSeek docs
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Failed to read response stream');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          console.log('✅ Stream reading completed');
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ') && line.trim() !== 'data: [DONE]') {
            try {
              const jsonStr = line.slice(6).trim();
              if (jsonStr) {
                const chunk = JSON.parse(jsonStr) as DeepSeekChunk;
                const delta = chunk.choices?.[0]?.delta;
                
                // Handle reasoning_content and content as per DeepSeek docs
                if (delta?.reasoning_content) {
                  reasoningContent += delta.reasoning_content;
                  console.log('🧠 Reasoning chunk received:', delta.reasoning_content.length, 'chars');
                }
                if (delta?.content) {
                  finalContent += delta.content;
                  console.log('💬 Content chunk received:', delta.content.length, 'chars');
                }
              }
            } catch (e) {
              console.warn('⚠️ Skipping invalid JSON line:', line.slice(0, 100));
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }

    console.log('📊 Final results - Reasoning:', reasoningContent.length, 'chars, Content:', finalContent.length, 'chars');

    if (!finalContent && !reasoningContent) {
      throw new Error('No content received from DeepSeek API. Please check your API key and try again.');
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
